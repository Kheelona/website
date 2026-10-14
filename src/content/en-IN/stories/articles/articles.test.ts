import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Article, Copy } from "@/content/types";
import { isPlaceholder } from "@/lib/content/placeholder";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { toPlainText } from "@/lib/content/plain-text";
import { formatDate } from "@/lib/format/date";
import { ROOT, readRepoFile, tagText } from "../../../../../test/e2e/support/repo";
import { approvedArticle } from "../../../../../test/fixtures/journal/approved";
import { ARTICLE_SLUGS } from "../../routes";
import { hubGroupsOf } from "../hub";
import { articles } from "./index";

/* The journal's articles (architecture §6.1; task 2.1 acceptance 5; 21 until the 3-6-9-12 article left the journal,
 * D053, task 6.5: its copy page went, and the three guides that offered it each took another, so every article still
 * names three and is offered by three). Invariants every article keeps whoever writes it later: its slug, three related
 * articles that exist, at least three incoming related links for every article, the live article's first published
 * date, titles and descriptions within the SEO limits, no open placeholder, sources it cites, no typed rupee amount.
 *
 * Since task 8b.2e (ADR-014) every article is a published post of the committed snapshot, adapted by the journal
 * registry, so these run over the registry (the stories route reads the same). The stub era's checks went with the
 * stubs (journal-pipeline §8.3; tasks.md wave 8 follow-ups): the legacy ring (`LEGACY_RING`) and its swaps (`SWAPS`),
 * the shortened and unbranded stub titles, and the two open bodies a stub or a port-pending guide carried (a post
 * cannot carry a placeholder at all: the gate refuses any brace but the tokens, rule 5). The three approved articles'
 * mockup checks read the approved export the founder signs at Gate B (test/fixtures/journal/approved). */

const DIR = join(ROOT, "src/content/en-IN/stories/articles");
const ALL = ARTICLE_SLUGS.map((slug) => articles[slug]);
const get = (slug: string): Article => articles[slug];
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const plain = (value: Copy) => toPlainText(value);

/** Every open placeholder an article still carries, inline or as data (images skipped). */
function openPlaceholders(value: unknown): string[] {
  const inNodes = (nodes: readonly RichNode[]): string[] =>
    nodes.flatMap((n) => (n.kind === "placeholder" ? [n.note] : "children" in n ? inNodes(n.children) : []));
  if (typeof value === "string") return inNodes(parseRichText(value));
  if (isPlaceholder(value)) return [value.note];
  if (Array.isArray(value)) return value.flatMap(openPlaceholders);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, v]) => (key === "src" ? [] : openPlaceholders(v)));
  }
  return [];
}

/** The live journal at the freeze tag: each article's first-published and last-edited dates. */
const LEGACY_DATES: ReadonlyMap<string, { published: string; updated: string }> = (() => {
  const source = ["src/lib/stories.ts", "src/lib/stories-expansion.ts"].map((p) => tagText(p) ?? "").join("\n");
  const re = /slug:\s*"([^"]+)"[\s\S]*?published:\s*"([^"]+)"[\s\S]*?updated:\s*"([^"]+)"/g;
  return new Map([...source.matchAll(re)].map((m) => [m[1], { published: m[2], updated: m[3] }]));
})();

describe("the folder", () => {
  /* Until 8b.2e: one module per article, the registry, and the stub builder while any body was open. Every article is
     now a post of src/content/en-IN/stories/posts.generated.json; the folder keeps the shared page copy and its tests. */
  it("holds the shared article page copy only (index.ts): no article is a module any more", () => {
    const files = readdirSync(DIR).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));
    expect(files).toEqual(["index.ts"]);
  });
});

describe("every article", () => {
  it("carries its own slug", () => {
    for (const slug of ARTICLE_SLUGS) expect(get(slug).slug).toBe(slug);
  });

  it("names three different related articles, never itself, all in the plan", () => {
    for (const slug of ARTICLE_SLUGS) {
      const related = get(slug).related;
      expect(new Set(related).size, slug).toBe(3);
      expect(related, slug).not.toContain(slug);
      for (const r of related) expect(ARTICLE_SLUGS as readonly string[], `${slug} → ${r}`).toContain(r);
    }
  });

  it("is offered by at least three others, so none is a dead end (stories.ts ring, test/internal-links)", () => {
    const incoming = new Map<string, number>(ARTICLE_SLUGS.map((s) => [s, 0]));
    for (const slug of ARTICLE_SLUGS) for (const r of get(slug).related) incoming.set(r, (incoming.get(r) ?? 0) + 1);
    expect([...incoming].filter(([, n]) => n < 3)).toEqual([]);
  });

  it("stores calendar dates, published on or before updated", () => {
    for (const slug of ARTICLE_SLUGS) {
      const a = get(slug);
      expect(() => formatDate(a.published, "ui"), slug).not.toThrow();
      expect(() => formatDate(a.updated, "ui"), slug).not.toThrow();
      expect(a.published <= a.updated, slug).toBe(true);
    }
  });

  it("keeps the live article's first-published date (src/lib/stories*.ts at the freeze tag)", () => {
    expect(LEGACY_DATES.size).toBe(22);
    for (const slug of ARTICLE_SLUGS) expect(get(slug).published, slug).toBe(LEGACY_DATES.get(slug)?.published);
  });

  it("parses: every content string follows the inline syntax", () => {
    const strings = (v: unknown): string[] =>
      typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];
    for (const slug of ARTICLE_SLUGS) {
      const a = get(slug);
      for (const s of strings([a.meta.title, a.meta.description, a.card, a.head.title, a.head.lead ?? "", a.body])) {
        expect(() => parseRichText(s), `${slug}: ${s}`).not.toThrow();
      }
    }
  });

  it("keeps its title within 60 and its description within 155 characters, both unique (architecture §9.1)", () => {
    const titles = ARTICLE_SLUGS.map((s) => plain(get(s).meta.title));
    const descriptions = ARTICLE_SLUGS.map((s) => plain(get(s).meta.description));
    expect(titles.filter((t) => t.length > 60)).toEqual([]);
    expect(descriptions.filter((d) => d.length > 155)).toEqual([]);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("shares a card that exists, with words for it", () => {
    for (const slug of ARTICLE_SLUGS) {
      const { og } = get(slug).meta;
      expect(existsSync(join(ROOT, "public", og.image)), slug).toBe(true);
      expect(og.alt.length, slug).toBeGreaterThan(0);
    }
  });

  it("holds no open placeholder and cites its sources", () => {
    for (const a of ALL) {
      expect(openPlaceholders(a), a.slug).toEqual([]);
      expect(a.sources.length, a.slug).toBeGreaterThan(0);
    }
  });

  it("is placed under one hub topic", () => {
    for (const slug of ARTICLE_SLUGS) {
      expect(hubGroupsOf.filter((g) => g.featured === slug || g.slugs.includes(slug)), slug).toHaveLength(1);
    }
  });

  it("never types a rupee amount", () => {
    for (const slug of ARTICLE_SLUGS) expect(JSON.stringify(get(slug)), slug).not.toContain("₹");
  });
});

/* The mockups' related lists name guides by title and link to the hub (the stubs had no pages yet); these are the slugs
   those titles stand for. Held on the approved export (test/fixtures/journal/approved, since task 8b.2e). */
describe.each([
  [
    "learning-toys-for-a-three-year-old",
    "journal",
    ["what-actually-builds-a-sharp-brain", "a-toy-that-talks-vs-a-toy-that-listens", "how-much-screen-time-for-a-3-to-6-year-old"],
    "myra-04-drawing-at-home-web.webp",
  ],
  [
    "what-to-look-for-in-a-safe-ai-toy",
    "journal",
    ["questions-parents-ask-about-ai-toys", "should-kids-use-ai", "ai-toys-and-indias-data-law"],
    "tara-02-evening-with-amma-web.webp",
  ],
  [
    "talking-toys-and-late-talkers",
    "keep",
    ["talking-late-or-talking-little", "how-to-get-your-child-talking", "raising-a-bilingual-child-in-india"],
    "kabir-04-planet-book-web.webp",
  ],
] as const)("the rewritten article %s, as its approved mockup shows it", (slug, close, related, photo) => {
  const page = new DOMParser().parseFromString(readRepoFile(`mockup/story-${slug}.html`), "text/html");
  const pageMeta = JSON.parse(/^<!--page (\{.*\}) -->/.exec(readRepoFile(`mockup/pages/story-${slug}.html`))![1]) as {
    title: string;
    description: string;
  };
  const approved = approvedArticle(slug);

  it("has the mockup's title and description", () => {
    expect(plain(approved.meta.title)).toBe(pageMeta.title);
    expect(plain(approved.meta.description)).toBe(pageMeta.description);
  });

  it("has the mockup's heading, accent and lead", () => {
    const h1 = page.querySelector("#story-title")!;
    expect(toPlainText(approved.head.title)).toBe(norm(h1.textContent));
    const textOf = (nodes: readonly RichNode[]): string =>
      nodes.map((n) => ("children" in n ? textOf(n.children) : n.kind === "text" ? n.text : "")).join("");
    const hand = (nodes: readonly RichNode[]): string[] =>
      nodes.flatMap((n) => ("children" in n ? (n.kind === "hand" ? [textOf(n.children)] : hand(n.children)) : []));
    expect(hand(parseRichText(approved.head.title))).toEqual(Array.from(h1.querySelectorAll(".kh-hand")).map((s) => s.textContent));
    expect(toPlainText(approved.head.lead ?? "")).toBe(norm(page.querySelector(".mk-story-head .kh-heading__lead")?.textContent));
  });

  it("has the mockup's byline: author, first published date and read time", () => {
    expect(`${approved.head.author} · First published ${formatDate(approved.published, "ui")} · ${approved.head.readMinutes} min read`).toBe(
      norm(page.querySelector(".mk-byline")?.textContent),
    );
    expect(page.querySelector(".mk-byline time")?.getAttribute("datetime")).toBe(approved.published);
  });

  it("has the mockup's photo and its words (the hub's card shows the same, stories.md folds 3-5)", () => {
    const img = page.querySelector(".mk-story-head img")!;
    const image = approved.head.image!;
    expect(image.alt).toBe(img.getAttribute("alt"));
    expect(decodeURIComponent(img.getAttribute("src") ?? "").endsWith(`/Photo library/${photo}`)).toBe(true);
    const src = image.src as unknown;
    expect(decodeURIComponent(typeof src === "string" ? src : (src as { src: string }).src).endsWith(`/Photo library/${photo}`)).toBe(true);
  });

  /* Until 8b.2e a related guide still waiting for its rewrite also carried the card title the mockup lists; none waits
     now, and ArticleTemplate.test.tsx holds the related band to each guide's own card title. */
  it("offers the mockup's related guides, in order", () => {
    expect(approved.related).toEqual(related);
    expect(Array.from(page.querySelectorAll(".mk-related li a"))).toHaveLength(related.length);
  });

  it(`closes with the ${close} close (B5: the late-talker page has no pre-order button)`, () => {
    expect(approved.close).toBe(close);
    expect(page.querySelector('[data-ph-capture-attribute-cta="finale"]') !== null).toBe(close === "journal");
  });

  it("holds the approved body task 5.6 ported, with its sources", () => {
    expect(openPlaceholders(approved)).toEqual([]);
    expect(approved.sources.length).toBeGreaterThan(0);
  });
});
