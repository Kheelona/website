import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import type { Article, Copy } from "@/content/types";
import { isPlaceholder } from "@/lib/content/placeholder";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { toPlainText } from "@/lib/content/plain-text";
import { formatDate } from "@/lib/format/date";
import { ROOT, readRepoFile, tagText } from "../../../../../test/e2e/support/repo";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";
import { ARTICLE_SLUGS, type ArticleSlug } from "../../routes";
import { hubTopics } from "../hub";

/* The 20 article modules (architecture §6.1; task 2.1 acceptance 5; 21 until the 3-6-9-12 article left the journal,
 * D053, task 6.5: its module and copy page went, and the three guides that offered it each took another, so every
 * article still names three and is offered by three). Invariants every article
 * keeps whoever writes it later (tasks 5.6, 5.17-5.19): its slug, three related articles that
 * exist, at least three incoming related links for every article, the live article's first
 * published date, titles and descriptions within the SEO limits. The eighteen not yet rewritten
 * are stubs (title and summary from the hub, body open, related from the legacy ring). The three
 * rewritten ones match their approved mockups' head, byline, photo, related list and close; their
 * approved body is ported by task 5.6, so until then it is one open paragraph too.
 *
 * Every assertion holds in every state of the rewrite (B2): a stub may become an article, a
 * port-pending body may become the approved one, and stub.ts goes once no body is open. So this
 * test never imports stub.ts (it reads it only while it exists), and never spells the inline
 * token: the production placeholder scan (task 2.9) refuses it anywhere in src/ but the syntax's
 * own files, so the two open bodies are built in pieces here. */

const DIR = join(ROOT, "src/content/en-IN/stories/articles");
const STUB = join(DIR, "stub.ts");
const ph = (body: string) => "{" + "ph:" + body + "}";
const REWRITE_PENDING = ph("ARTICLE rewrite pending");
const PORT_PENDING = ph("ARTICLE body from the approved mockup");
const BRAND = " · Kheelona";
const articles = new Map<ArticleSlug, Article>();

beforeAll(async () => {
  for (const slug of ARTICLE_SLUGS) {
    const mod = (await import(/* @vite-ignore */ join(DIR, `${slug}.ts`))) as { article: Article };
    articles.set(slug, mod.article);
  }
});

const get = (slug: ArticleSlug) => articles.get(slug)!;
const bodyHas = (a: Article, marker: string) => JSON.stringify(a.body).includes(marker);
const isStub = (a: Article) => bodyHas(a, REWRITE_PENDING);
const isPortPending = (a: Article) => bodyHas(a, PORT_PENDING);
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
  it("holds one module per article of the URL plan, the registry, plus the stub builder while any body is open", () => {
    const files = readdirSync(DIR).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));
    const open = ARTICLE_SLUGS.some((s) => isStub(get(s)) || isPortPending(get(s)));
    /* index.ts: the one registry of the article modules (wave-3 close ruling, task 4.2). */
    expect(files.sort()).toEqual([...ARTICLE_SLUGS.map((s) => `${s}.ts`), "index.ts", ...(open ? ["stub.ts"] : [])].sort());
  });
});

describe("the two open bodies", () => {
  it("are ARTICLE placeholders, which beta prints and the production build refuses (task 2.9)", () => {
    for (const body of [REWRITE_PENDING, PORT_PENDING]) {
      expect(parseRichText(body), body).toEqual([expect.objectContaining({ kind: "placeholder", id: "ARTICLE" })]);
    }
  });

  it.runIf(existsSync(STUB))("are spelled by the stub builder exactly as this test reads them", async () => {
    const stub = (await import(/* @vite-ignore */ STUB)) as Record<string, unknown>;
    expect(stub.ARTICLE_REWRITE_PENDING).toBe(REWRITE_PENDING);
    expect(stub.ARTICLE_PORT_PENDING).toBe(PORT_PENDING);
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

  it("shares a card that exists, with words for it (the default one until its own is chosen)", () => {
    for (const slug of ARTICLE_SLUGS) {
      const { og } = get(slug).meta;
      expect(existsSync(join(ROOT, "public", og.image)), slug).toBe(true);
      expect(og.alt.length, slug).toBeGreaterThan(0);
      if (isStub(get(slug))) expect(og, slug).toEqual(DEFAULT_OG);
    }
  });

  it("once written, holds no open placeholder and cites its sources", () => {
    for (const slug of ARTICLE_SLUGS) {
      const a = get(slug);
      if (isStub(a) || isPortPending(a)) continue;
      expect(openPlaceholders(a), slug).toEqual([]);
      expect(a.sources.length, slug).toBeGreaterThan(0);
    }
  });

  it("is placed under one hub topic", () => {
    for (const slug of ARTICLE_SLUGS) {
      expect(hubTopics.filter((g) => g.featured === slug || g.slugs.includes(slug)), slug).toHaveLength(1);
    }
  });

  it("never types a rupee amount", () => {
    for (const slug of ARTICLE_SLUGS) expect(JSON.stringify(get(slug)), slug).not.toContain("₹");
  });
});

describe("the stubs (the eighteen not yet rewritten)", () => {
  /* The legacy journal in reading order (src/lib/stories.ts BY_THEME at tag
     archive/pre-reset-2026-10-10), without the merged 2-year-old article (D041). Each stub offers
     the one before it and the two after it, wrapping (getRelatedStories). The ring is the tag's, so it keeps the
     3-6-9-12 article D053 took off the journal; no stub is left to read it. */
  const LEGACY_RING: readonly string[] = [
    "why-three-to-six-are-the-years-that-matter-most",
    "how-children-learn-by-talking",
    "what-actually-builds-a-sharp-brain",
    "learning-toys-for-a-three-year-old",
    "screen-free-does-not-mean-silent",
    "how-much-screen-time-for-a-3-to-6-year-old",
    "screen-time-and-tantrums",
    "the-gentle-way-off-the-phone",
    "busy-hands-no-screens",
    "screen-time-rules-parents-swear-by",
    "what-to-look-for-in-a-safe-ai-toy",
    "ai-toys-and-indias-data-law",
    "how-to-get-your-child-talking",
    "talking-late-or-talking-little",
    "how-children-collect-words",
    "a-toy-that-talks-vs-a-toy-that-listens",
    "talking-toys-and-late-talkers",
    "raising-a-bilingual-child-in-india",
    "should-kids-use-ai",
    "does-a-three-year-old-need-an-ai-tutor",
    "questions-parents-ask-about-ai-toys",
  ];
  const ring = (slug: ArticleSlug) => {
    const i = LEGACY_RING.indexOf(slug);
    const n = LEGACY_RING.length;
    return [-1, 1, 2].map((o) => LEGACY_RING[(i + o + n) % n]);
  };
  /* The three rewritten articles take their mockups' related lists, which leaves two articles with
     two incoming links on the pure ring; two stubs swap one slot each to restore three. */
  const SWAPS: Readonly<Partial<Record<ArticleSlug, [string, string]>>> = {
    "why-three-to-six-are-the-years-that-matter-most": ["questions-parents-ask-about-ai-toys", "screen-free-does-not-mean-silent"],
    "ai-toys-and-indias-data-law": ["talking-late-or-talking-little", "screen-time-rules-parents-swear-by"],
  };
  /* A live title longer than the 60-character limit keeps it on the card and the page, and its
     first sentence as the meta title (reported to the main session with task 2.1). */
  const SHORT_TITLES: Readonly<Partial<Record<ArticleSlug, string>>> = {
    "should-kids-use-ai": "Should kids use AI?",
  };
  /* The meta title is the page's whole <title> (pageMeta's `absolute`, ADR-012), so it carries the
     brand as the rewritten articles' do. Three hub titles leave no room for it within the limit and
     go without: a shorter title would be new copy (reported to the main session with task 2.1). */
  const UNBRANDED: readonly ArticleSlug[] = [
    "what-actually-builds-a-sharp-brain",
    "screen-time-and-tantrums",
  ];

  const stubs = () => ARTICLE_SLUGS.filter((s) => isStub(get(s)));
  const stillStubs = (slugs: readonly ArticleSlug[]) => slugs.filter((s) => isStub(get(s)));

  it("are at most eighteen: the rewrites (tasks 5.17-5.19) only ever take them away", () => {
    expect(stubs().length).toBeLessThanOrEqual(18);
  });

  it("show the hub's title and summary as their meta, card and head, by the Kheelona team (stories.md folds 2-5)", () => {
    for (const slug of stubs()) {
      const a = get(slug);
      const title = SHORT_TITLES[slug] ?? a.card.title;
      expect(a.meta.title, slug).toBe(UNBRANDED.includes(slug) ? title : `${title}${BRAND}`);
      expect(a.meta.description, slug).toBe(a.card.summary);
      expect(a.head.title, slug).toBe(a.card.title);
      expect(a.head.author, slug).toBe(TEAM_BYLINE);
    }
  });

  it("shorten a meta title only where the live title is over the limit", () => {
    for (const slug of stillStubs(Object.keys(SHORT_TITLES) as ArticleSlug[])) {
      expect(plain(get(slug).card.title).length, slug).toBeGreaterThan(60);
      expect(plain(get(slug).card.title).startsWith(SHORT_TITLES[slug]!), slug).toBe(true);
    }
  });

  it("leave the brand off only where it would take the title over 60 characters", () => {
    for (const slug of stillStubs(UNBRANDED)) {
      expect(plain(get(slug).meta.title).length, slug).toBeLessThanOrEqual(60);
      expect(`${plain(get(slug).meta.title)}${BRAND}`.length, slug).toBeGreaterThan(60);
    }
  });

  it("hold one open paragraph and no sources, so production refuses them until rewritten", () => {
    for (const slug of stubs()) {
      const a = get(slug);
      expect(a.body, slug).toEqual([{ kind: "part", blocks: [{ kind: "p", text: REWRITE_PENDING }] }]);
      expect(a.sources, slug).toEqual([]);
      expect(a.close, slug).toBe("journal");
      expect(a.answer, slug).toBeUndefined();
    }
  });

  it("keep the live article's last-edit date until rewritten", () => {
    for (const slug of stubs()) expect(get(slug).updated, slug).toBe(LEGACY_DATES.get(slug)?.updated);
  });

  it("offer the legacy ring, apart from the two named swaps", () => {
    for (const slug of stubs()) {
      const swap = SWAPS[slug];
      const expected = ring(slug).map((r) => (swap && r === swap[0] ? swap[1] : r));
      expect(get(slug).related, slug).toEqual(expected);
    }
  });
});

/* The mockups' related lists name guides by title and link to the hub (the stubs had no pages
   yet); these are the slugs those titles stand for. */
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

  it("has the mockup's title and description", () => {
    expect(plain(get(slug).meta.title)).toBe(pageMeta.title);
    expect(plain(get(slug).meta.description)).toBe(pageMeta.description);
  });

  it("has the mockup's heading, accent and lead", () => {
    const a = get(slug);
    const h1 = page.querySelector("#story-title")!;
    expect(toPlainText(a.head.title)).toBe(norm(h1.textContent));
    const textOf = (nodes: readonly RichNode[]): string =>
      nodes.map((n) => ("children" in n ? textOf(n.children) : n.kind === "text" ? n.text : "")).join("");
    const hand = (nodes: readonly RichNode[]): string[] =>
      nodes.flatMap((n) => ("children" in n ? (n.kind === "hand" ? [textOf(n.children)] : hand(n.children)) : []));
    expect(hand(parseRichText(a.head.title))).toEqual(Array.from(h1.querySelectorAll(".kh-hand")).map((s) => s.textContent));
    expect(toPlainText(a.head.lead ?? "")).toBe(norm(page.querySelector(".mk-story-head .kh-heading__lead")?.textContent));
  });

  it("has the mockup's byline: author, first published date and read time", () => {
    const a = get(slug);
    expect(`${a.head.author} · First published ${formatDate(a.published, "ui")} · ${a.head.readMinutes} min read`).toBe(
      norm(page.querySelector(".mk-byline")?.textContent),
    );
    expect(page.querySelector(".mk-byline time")?.getAttribute("datetime")).toBe(a.published);
  });

  it("has the mockup's photo and its words (the hub's card shows the same, stories.md folds 3-5)", () => {
    const img = page.querySelector(".mk-story-head img")!;
    const image = get(slug).head.image!;
    expect(image.alt).toBe(img.getAttribute("alt"));
    expect(decodeURIComponent(img.getAttribute("src") ?? "").endsWith(`/Photo library/${photo}`)).toBe(true);
    const src = image.src as unknown;
    expect(decodeURIComponent(typeof src === "string" ? src : (src as { src: string }).src).endsWith(`/Photo library/${photo}`)).toBe(true);
  });

  it("offers the mockup's related guides, in order", () => {
    expect(get(slug).related).toEqual(related);
    const titles = Array.from(page.querySelectorAll(".mk-related li a")).map((a) => norm(a.textContent));
    related.forEach((r, i) => {
      /* While a related guide waits for its rewrite, its card title is the one the mockup lists. */
      if (isStub(get(r))) expect(toPlainText(get(r).card.title), r).toBe(titles[i]);
    });
  });

  it(`closes with the ${close} close (B5: the late-talker page has no pre-order button)`, () => {
    expect(get(slug).close).toBe(close);
    expect(page.querySelector('[data-ph-capture-attribute-cta="finale"]') !== null).toBe(close === "journal");
  });

  it("holds either the port-pending paragraph, or the approved body task 5.6 ports, with its sources", () => {
    const a = get(slug);
    expect(isStub(a)).toBe(false);
    if (isPortPending(a)) {
      expect(a.body).toEqual([{ kind: "part", blocks: [{ kind: "p", text: PORT_PENDING }] }]);
      expect(a.sources).toEqual([]);
    } else {
      expect(openPlaceholders(a)).toEqual([]);
      expect(a.sources.length).toBeGreaterThan(0);
    }
  });
});
