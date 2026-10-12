import { readdirSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import type { Article, RichTextString } from "@/content/types";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { toPlainText } from "@/lib/content/plain-text";
import { formatDate } from "@/lib/format/date";
import { ROOT, readRepoFile } from "../../../../../test/e2e/support/repo";
import { ARTICLE_SLUGS, type ArticleSlug } from "../../routes";
import { hubTopics } from "../hub";
import { ARTICLE_REWRITE_PENDING } from "./stub";

/* The 21 article modules (architecture §6.1; task 2.1 acceptance 5). Invariants every article
 * keeps whoever rewrites it later (tasks 5.6, 5.17-5.19): its slug, three related articles that
 * exist, at least three incoming related links for every article, stored calendar dates. The
 * eighteen not yet rewritten are stubs (title and summary from the hub, body open, related from
 * the legacy ring); the three rewritten ones match their approved mockups' head, byline, related
 * list and close. */

const DIR = join(ROOT, "src/content/en-IN/stories/articles");
const articles = new Map<ArticleSlug, Article>();

beforeAll(async () => {
  for (const slug of ARTICLE_SLUGS) {
    const mod = (await import(/* @vite-ignore */ join(DIR, `${slug}.ts`))) as { article: Article };
    articles.set(slug, mod.article);
  }
});

const get = (slug: ArticleSlug) => articles.get(slug)!;
const isStub = (a: Article) => JSON.stringify(a.body).includes(ARTICLE_REWRITE_PENDING);
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const meta = (title: RichTextString) => toPlainText(title);

describe("the folder", () => {
  it("holds one module per article of the URL plan, plus the stub builder", () => {
    const files = readdirSync(DIR).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));
    expect(files.sort()).toEqual([...ARTICLE_SLUGS.map((s) => `${s}.ts`), "stub.ts"].sort());
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

  it("is placed under one hub topic", () => {
    for (const slug of ARTICLE_SLUGS) {
      expect(hubTopics.filter((g) => g.featured === slug || (g.slugs as readonly string[]).includes(slug)), slug).toHaveLength(1);
    }
  });
});

describe("the stubs (the eighteen not yet rewritten)", () => {
  /* The legacy journal in reading order (src/lib/stories.ts BY_THEME at tag
     archive/pre-reset-2026-10-10), without the merged 2-year-old article (D041). Each stub offers
     the one before it and the two after it, wrapping (getRelatedStories). */
  const LEGACY_RING: readonly ArticleSlug[] = [
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
  const SWAPS: Readonly<Partial<Record<ArticleSlug, [ArticleSlug, ArticleSlug]>>> = {
    "why-three-to-six-are-the-years-that-matter-most": ["questions-parents-ask-about-ai-toys", "screen-free-does-not-mean-silent"],
    "ai-toys-and-indias-data-law": ["talking-late-or-talking-little", "screen-time-rules-parents-swear-by"],
  };

  const stubs = () => ARTICLE_SLUGS.filter((s) => isStub(get(s)));

  it("are eighteen today", () => {
    expect(stubs()).toHaveLength(18);
  });

  it("show the hub's title and summary as their meta, card and head (stories.md folds 2-5)", () => {
    for (const slug of stubs()) {
      const a = get(slug);
      expect(a.meta.title, slug).toBe(a.card.title);
      expect(a.meta.description, slug).toBe(a.card.summary);
      expect(a.head.title, slug).toBe(a.card.title);
      expect(a.head.author, slug).toBe("The Kheelona team");
    }
  });

  it("hold one open paragraph and no sources, so production refuses them until rewritten", () => {
    for (const slug of stubs()) {
      const a = get(slug);
      expect(a.body, slug).toEqual([{ kind: "part", blocks: [{ kind: "p", text: ARTICLE_REWRITE_PENDING }] }]);
      expect(a.sources, slug).toEqual([]);
      expect(a.close, slug).toBe("journal");
    }
    expect(ARTICLE_REWRITE_PENDING).toBe("{ph:ARTICLE rewrite pending}");
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
  ],
  [
    "what-to-look-for-in-a-safe-ai-toy",
    "journal",
    ["questions-parents-ask-about-ai-toys", "should-kids-use-ai", "ai-toys-and-indias-data-law"],
  ],
  [
    "talking-toys-and-late-talkers",
    "keep",
    ["talking-late-or-talking-little", "how-to-get-your-child-talking", "raising-a-bilingual-child-in-india"],
  ],
] as const)("the rewritten article %s, as its approved mockup shows it", (slug, close, related) => {
  const page = new DOMParser().parseFromString(readRepoFile(`mockup/story-${slug}.html`), "text/html");
  const pageMeta = JSON.parse(/^<!--page (\{.*\}) -->/.exec(readRepoFile(`mockup/pages/story-${slug}.html`))![1]) as {
    title: string;
    description: string;
  };

  it("has the mockup's title and description", () => {
    expect(meta(get(slug).meta.title)).toBe(pageMeta.title);
    expect(meta(get(slug).meta.description)).toBe(pageMeta.description);
  });

  it("has the mockup's heading, accent and lead", () => {
    const a = get(slug);
    const h1 = page.querySelector("#story-title")!;
    expect(toPlainText(a.head.title)).toBe(norm(h1.textContent));
    const hand = (nodes: readonly RichNode[]): string[] =>
      nodes.flatMap((n) => ("children" in n ? (n.kind === "hand" ? [toPlainTextOf(n.children)] : hand(n.children)) : []));
    const toPlainTextOf = (nodes: readonly RichNode[]): string =>
      nodes.map((n) => ("children" in n ? toPlainTextOf(n.children) : n.kind === "text" ? n.text : "")).join("");
    expect(hand(parseRichText(a.head.title))).toEqual(Array.from(h1.querySelectorAll(".kh-hand")).map((s) => s.textContent));
    expect(toPlainText(a.head.lead ?? "")).toBe(norm(page.querySelector(".mk-story-head .kh-heading__lead")?.textContent));
  });

  it("has the mockup's byline: author, first published date and read time", () => {
    const a = get(slug);
    expect(`${a.head.author} · First published ${formatDate(a.published, "ui")} · ${a.head.readMinutes} min read`).toBe(
      norm(page.querySelector(".mk-byline")?.textContent),
    );
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

  it("keeps its title and description within 60 and 155 characters", () => {
    expect(meta(get(slug).meta.title).length).toBeLessThanOrEqual(60);
    expect(meta(get(slug).meta.description).length).toBeLessThanOrEqual(155);
  });
});
