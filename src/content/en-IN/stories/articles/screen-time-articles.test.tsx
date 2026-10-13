import { render } from "@testing-library/react";
import { basename, join } from "node:path";
import sharp from "sharp";
import { beforeAll, describe, expect, it } from "vitest";
import { STORE_URL } from "@/config/site";
import type { Article, ArticleCard, ArticlePart, IsoDate, ListBlock, ProseBlock } from "@/content/types";
import { ArticleTemplate } from "@/layouts/ArticleTemplate/ArticleTemplate";
import { isPlaceholder } from "@/lib/content/placeholder";
import { toPlainText } from "@/lib/content/plain-text";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { formatDate } from "@/lib/format/date";
import { buildOffer } from "@/lib/offer/offer";
import { ROOT, readRepoFile } from "../../../../../test/e2e/support/repo";
import { mockupFold, portClass, skeleton, words } from "../../../../../test/support/mockup-compare";
import { TEAM_BYLINE } from "../../organization";
import type { ArticleSlug } from "../../routes";
import { articles, getArticle } from "./index";
import { article as busyHands } from "./busy-hands-no-screens";
import { article as howMuch } from "./how-much-screen-time-for-a-3-to-6-year-old";
import { article as screenFree } from "./screen-free-does-not-mean-silent";
import { article as tantrums } from "./screen-time-and-tantrums";
import { article as rules } from "./screen-time-rules-parents-swear-by";
import { article as gentleWay } from "./the-gentle-way-off-the-phone";

/* The six screen-time articles (task 5.17; copy fixes of task 5.20a): each module is its copy page
 * (wiki/site/pages/story-<slug>.md, CMO reviews wiki/qa/cmo-review-articles-5.17-2026-10-14.md and
 * wiki/qa/cmo-review-article-fixes-5.20a-2026-10-14.md) word for word, rendered through the article template. There is no
 * mockup for them, so:
 *   - text parity is with the copy page: the head (crumbs, h1 and its accent, lead, byline, photo and alt), the reading
 *     column (the answer, every part, the sources) and the related guides, read from the page's Copy blocks;
 *   - visual parity is template parity with the approved articles for the shared parts (tasks.md, the note under the
 *     wave-5 table): the head as story-learning-toys-for-a-three-year-old.html (a portrait photo) or
 *     story-what-to-look-for-in-a-safe-ai-toy.html (a wide one) prints it, the answer card, the sources, the related
 *     guides and the journal close as story-learning-toys-for-a-three-year-old.html prints them, and no markup in the
 *     reading column that the three approved reading columns do not have.
 * Each keeps its stub's hub card, related list and dates (the main session's note for 5.17); the folder's invariants
 * (titles within 60, three incoming links, the live first-published date) are articles.test.ts's. */

interface Stub {
  readonly card: ArticleCard;
  readonly related: readonly [ArticleSlug, ArticleSlug, ArticleSlug];
  readonly published: IsoDate;
  readonly updated: IsoDate;
}

/* Each stub's approved hub card (stories.md fold 2), its related list (the live journal's ring) and its dates (the live
   article's, src/lib/stories*.ts at the freeze tag), as the stub modules held them at the build's base. */
const SCREEN_TIME: readonly (readonly [ArticleSlug, Article, Stub])[] = [
  [
    "how-much-screen-time-for-a-3-to-6-year-old",
    howMuch,
    {
      card: {
        title: "How much screen time is okay for a young child?",
        summary: "What the WHO, the Indian Academy of Pediatrics and the AAP say, age by age, and what to do at 6 pm.",
      },
      related: ["screen-free-does-not-mean-silent", "screen-time-and-tantrums", "the-gentle-way-off-the-phone"],
      published: "2026-07-28",
      updated: "2026-09-05",
    },
  ],
  [
    "screen-time-rules-parents-swear-by",
    rules,
    {
      card: {
        title: "The 3-6-9-12 rule, and other screen rules parents swear by",
        summary: "Where the 3-6-9-12 rule comes from, whether it holds up, and what the WHO, the IAP and the AAP say.",
      },
      related: ["busy-hands-no-screens", "what-to-look-for-in-a-safe-ai-toy", "ai-toys-and-indias-data-law"],
      published: "2026-07-30",
      updated: "2026-09-05",
    },
  ],
  [
    "screen-time-and-tantrums",
    tantrums,
    {
      card: {
        title: "Screen time and tantrums: what is actually happening",
        summary: "Why the meltdown lands the moment the screen goes off, and how to make switching off boring instead of explosive.",
      },
      related: ["how-much-screen-time-for-a-3-to-6-year-old", "the-gentle-way-off-the-phone", "busy-hands-no-screens"],
      published: "2026-07-28",
      updated: "2026-07-31",
    },
  ],
  [
    "the-gentle-way-off-the-phone",
    gentleWay,
    {
      card: {
        title: "The gentle way off the phone: a seven-day plan",
        summary: "A week-long plan to cut a young child’s screen time without turning your home into a battlefield.",
      },
      related: ["screen-time-and-tantrums", "busy-hands-no-screens", "screen-time-rules-parents-swear-by"],
      published: "2026-07-28",
      updated: "2026-07-31",
    },
  ],
  [
    "busy-hands-no-screens",
    busyHands,
    {
      card: {
        title: "Busy hands, no screens",
        summary: "Screen-free ways to keep a young child busy at home, including on the days you have to work.",
      },
      related: ["the-gentle-way-off-the-phone", "screen-time-rules-parents-swear-by", "what-to-look-for-in-a-safe-ai-toy"],
      published: "2026-07-28",
      updated: "2026-07-31",
    },
  ],
  [
    "screen-free-does-not-mean-silent",
    screenFree,
    {
      card: { title: "Screen-free does not mean silent", summary: "What a childhood full of talk looks like, without a single screen." },
      related: ["learning-toys-for-a-three-year-old", "how-much-screen-time-for-a-3-to-6-year-old", "screen-time-and-tantrums"],
      published: "2026-07-28",
      updated: "2026-09-05",
    },
  ],
];

/** The screen-time guides with no in-text product link. The 3-6-9-12 guide names Tisseron's AI markers ("no connected
 *  toys before 6"), so the working default of open question P25 drops its product line, as on the talking guides (task
 *  5.20a; its copy page's fold 7). Every other screen-time guide links the product page once (strategy §3.3). */
const NO_PRODUCT_LINK: ReadonlySet<ArticleSlug> = new Set(["screen-time-rules-parents-swear-by"]);

/** Tisseron's 3-6-13-18 markers about AI, all four (source verification 2026-10-14 §1a, the ready line). */
const AI_MARKERS = [
  "no digital tool before 3",
  "no connected toys before 6",
  "no internet or general-purpose chatbots before 12, except used with an adult",
  "no digital companion before 18",
];

/** The rewrite's date: every rewritten article's `updated` (BlogPosting dateModified and the sitemap), as task 5.6
 *  set it for the three approved guides; `published` stays the live page's (ruling at the wave 5 part C merge). */
const REWRITE_DATE: IsoDate = "2026-10-13";

const TOKEN = buildOffer("token");

/* ── The copy page ──────────────────────────────────────────────────────────────────────────────────────────────── */

interface Fold {
  /** The fold's name after its number: "Article head", "The answer first", "Sources (article foot)". */
  readonly name: string;
  /** The Copy block's lines, the quote marks off, blank lines dropped (each line is one paragraph, item or heading). */
  readonly lines: readonly string[];
  /** The fold's notes, white space collapsed. */
  readonly notes: string;
}

/** The copy page's folds, in order. */
function copyPage(slug: string): Fold[] {
  const md = readRepoFile(`wiki/site/pages/story-${slug}.md`);
  return md
    .split(/^## /m)
    .filter((section) => section.startsWith("Fold "))
    .map((section) => {
      const name = section.slice(0, section.indexOf("\n")).replace(/^Fold \d+ · /, "");
      const body = section.slice(section.indexOf("\n") + 1);
      const start = body.search(/^\*\*Copy\b/m);
      const lines = start === -1 ? [] : body.slice(start).split("\n").filter((l) => l.startsWith(">")).map((l) => l.replace(/^>\s?/, ""));
      return { name, lines: lines.filter((l) => l.trim() !== ""), notes: body.replace(/\s+/g, " ") };
    });
}

/** One fold by the start of its name. */
function fold(folds: readonly Fold[], name: string): Fold {
  const found = folds.find((f) => f.name.startsWith(name));
  if (found === undefined) throw new Error(`the copy page has no fold "${name}…"`);
  return found;
}

/** The reading column's folds: from the one after the head to the sources, inclusive. */
function columnFolds(folds: readonly Fold[]): Fold[] {
  const end = folds.findIndex((f) => f.name.startsWith("Sources"));
  expect(end, "the copy page has a Sources fold").toBeGreaterThan(1);
  return folds.slice(1, end + 1);
}

/** A copy-page row of "At a glance": `| Title (56 characters) | … |`, its stated length checked. */
function glance(slug: string, label: "Title" | "Meta description"): string {
  const row = readRepoFile(`wiki/site/pages/story-${slug}.md`)
    .split("\n")
    .find((l) => l.startsWith(`| ${label} (`));
  const m = row && /^\| [^(]+\((\d+) characters\) \| (.+?) \|$/.exec(row);
  if (!m) throw new Error(`story-${slug}.md has no "${label} (n characters)" row`);
  expect(m[2].length, `story-${slug}.md: ${label} says ${m[1]} characters`).toBe(Number(m[1]));
  return m[2];
}

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** A Copy line as the page prints it: the label (`**H2:**`) and the item dash off, bold kept as its words, a link as
 *  its label, the source markers as the build's `[n]`. */
function printed(line: string): string {
  return line
    .replace(/^\*\*(?:Breadcrumb|H1|H2):\*\*\s*/, "")
    .replace(/^- /, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\(https:\/\/kheelona\.com\/[^)]*\)/g, "$1")
    .replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰](?:\s?[¹²³⁴⁵⁶⁷⁸⁹⁰])*/g, (run) => [...run.replace(/\s/g, "")].map((c) => `[${SUPERSCRIPT.indexOf(c)}]`).join(""));
}

/** Copy pages type ASCII quotes and hyphens; the modules carry the typographic ones the pages print. Space around a
 *  source marker is left out on both sides (a note's number sits flush against its citation in the build). */
const same = (s: string) =>
  s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/‑/g, "-")
    .replace(/ /g, " ")
    .replace(/\s*(\[\d+\])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

/** The in-text links of a run of Copy lines: label and site path. */
const copyLinks = (lines: readonly string[]) =>
  lines.flatMap((l) => [...l.matchAll(/\[([^\]]+)\]\(https:\/\/kheelona\.com(\/[^)]*)\)/g)].map((m) => [m[1], m[2]]));

/* ── The module, rendered ───────────────────────────────────────────────────────────────────────────────────────── */

/** The head photo at its own size. Vitest loads an image file as its address alone, without the size next/image's
 *  static import carries, and the photo's shape sets the head's layout (portrait or wide). */
const sizes = new Map<string, { width: number; height: number }>();

const photoFile = (article: Article) => {
  const src = article.head.image?.src as unknown;
  return basename(decodeURIComponent(typeof src === "string" ? src : (src as { src: string }).src));
};

beforeAll(async () => {
  for (const [, article] of SCREEN_TIME) {
    if (article.head.image === undefined) continue;
    const meta = await sharp(join(ROOT, "design-system/project/assets/Photo library", photoFile(article))).metadata();
    sizes.set(article.slug, { width: meta.width, height: meta.height });
  }
});

function sized(article: Article): Article {
  const size = sizes.get(article.slug);
  if (size === undefined || article.head.image === undefined) return article;
  return { ...article, head: { ...article.head, image: { src: `/${article.slug}.webp`, ...size, alt: article.head.image.alt } } };
}

/** The page as the shell would hold it, in `<main>`. */
function builtMain(article: Article): Element {
  const { container } = render(<ArticleTemplate article={sized(article)} offer={TOKEN} />);
  const main = document.createElement("main");
  main.append(...Array.from(container.childNodes).map((node) => node.cloneNode(true)));
  return main;
}

function column(article: Article): Element {
  const body = builtMain(article).querySelector(".ks-story-body");
  if (body === null) throw new Error(`${article.slug}: the template rendered no reading column`);
  return body;
}

/** Every rich-text node of the article's own strings (images skipped). */
function nodes(value: unknown): RichNode[] {
  const all = (list: readonly RichNode[]): RichNode[] => list.flatMap((n) => [n, ...("children" in n ? all(n.children) : [])]);
  if (typeof value === "string") {
    try {
      return all(parseRichText(value));
    } catch {
      return []; // an icon name or a variant, not text
    }
  }
  if (Array.isArray(value)) return value.flatMap(nodes);
  if (value && typeof value === "object") return Object.entries(value).flatMap(([key, v]) => (key === "src" ? [] : nodes(v)));
  return [];
}

const readingStrings = (a: Article) => [a.answer ?? {}, a.body];

/** A related guide's card title, from the article registry. */
function cardTitle(slug: string): Article["card"]["title"] {
  const guide = getArticle(slug);
  if (guide === undefined) throw new Error(`"${slug}" is not in the article registry`);
  return guide.card.title;
}

/** Every prose block of the article, the answer's detail included. */
const blocks = (a: Article): ProseBlock[] => [...(a.answer?.detail ?? []), ...a.body.flatMap((b) => (b.kind === "part" ? b.blocks : [b]))];

/* ── Template parity (the shared parts) ─────────────────────────────────────────────────────────────────────────── */

/* The build's documented differences from the mockups, as ArticleTemplate.test.tsx and approved-articles.test.tsx list
   them: the type steps and list reset it adds, the CTA classes, the heading's step span, the article marker variant, the
   mockup's price spans, and the journal close's own names. */
const OPTIONS = {
  drop: /^(ks-type-.*|ks-list-reset|ks-cta__button|ks-btn__arrow|ks-src--article)$/,
  unwrap: ".ks-heading__step, [data-src]",
  rename: { close: "ks-close-journal", "close-art": "ks-close-journal__art" },
};

/** The mockup that sets the head's layout for a photo of this shape (ArticleHead: portrait 4:5, or wide 16:9). */
const headReference = (article: Article) => {
  const size = sizes.get(article.slug)!;
  return size.height > size.width ? "story-learning-toys-for-a-three-year-old" : "story-what-to-look-for-in-a-safe-ai-toy";
};

/** The head's frame: the h1's and the lead's words (and their accents) are the article's own and compared apart. */
const HEAD_WORDS = "#story-title *, .kh-heading__lead *";

/** An element down to its first `n` children, each without its inside (a list's first item, a card's question). */
function firstChildren(el: Element, n: number): Element {
  const copy = el.cloneNode(true) as Element;
  [...copy.children].slice(n).forEach((child) => child.remove());
  for (const child of copy.children) child.replaceChildren();
  return copy;
}

/** The tag and classes of every element in the approved reading columns, as the build names them. */
const APPROVED_COLUMN_MARKUP: ReadonlySet<string> = new Set(
  ["learning-toys-for-a-three-year-old", "what-to-look-for-in-a-safe-ai-toy", "talking-toys-and-late-talkers"].flatMap((slug) =>
    [...mockupFold(`story-${slug}`, ".mk-story-body").querySelectorAll("*")].map((el) => markupOf(el)),
  ),
);

function markupOf(el: Element): string {
  const classes = [...el.classList].flatMap((c) => portClass(c)).filter((c) => !OPTIONS.drop.test(c)).sort();
  return `${el.tagName.toLowerCase()}${classes.map((c) => `.${c}`).join("")}`;
}

/* ── The tests ──────────────────────────────────────────────────────────────────────────────────────────────────── */

describe.each(SCREEN_TIME)("the screen-time article %s", (slug, article, stub) => {
  const folds = copyPage(slug);
  const head = fold(folds, "Article head");

  it("is written: no open placeholder, and sources it cites", () => {
    const open = nodes(article).filter((n) => n.kind === "placeholder");
    expect(open).toEqual([]);
    expect(JSON.stringify(article)).not.toMatch(/"kind":"placeholder"/);
    expect(isPlaceholder(article.body)).toBe(false);
    expect(article.sources.length).toBeGreaterThan(0);
  });

  it("keeps its stub's hub card, related guides and first-published date; `updated` is the rewrite's (stories.md fold 2; part C merge ruling)", () => {
    expect(article.slug).toBe(slug);
    expect(article.card).toEqual(stub.card);
    expect(article.related).toEqual(stub.related);
    expect(article.published).toBe(stub.published);
    expect(article.updated).toBe(REWRITE_DATE);
    expect(article.updated > stub.updated).toBe(true);
    expect(article.close).toBe("journal");
  });

  it("carries the copy page's title and meta description, word for word", () => {
    expect(same(toPlainText(article.meta.title))).toBe(same(glance(slug, "Title")));
    expect(same(toPlainText(article.meta.description))).toBe(same(glance(slug, "Meta description")));
  });

  it("prints the copy page's head: crumbs, h1, accent, lead and byline", () => {
    const [crumbs, h1, lead, byline] = head.lines.map(printed);
    const main = builtMain(article);
    const header = main.querySelector(".ks-story-head")!;
    expect([...header.querySelectorAll("nav a")].map((a) => a.textContent).join(" › ")).toBe(crumbs);
    expect(same(header.querySelector("h1")!.textContent ?? "")).toBe(same(h1));
    const accent = /\*\*H1 accent:\*\* `Hand` on "([^"]+)"/.exec(head.notes)?.[1];
    expect([...header.querySelectorAll("h1 .kh-hand")].map((s) => s.textContent)).toEqual([accent]);
    expect(same(header.querySelector(".kh-heading__lead")!.textContent ?? "")).toBe(same(lead));
    expect(header.querySelector(".ks-byline")!.textContent).toBe(byline);
    expect(byline).toBe(`${TEAM_BYLINE} · First published ${formatDate(stub.published, "ui")} · ${article.head.readMinutes} min read`);
  });

  it("shows the copy page's head photo, with its alt", () => {
    const named = /`([a-z0-9-]+-web\.webp)`/.exec(head.notes.slice(head.notes.indexOf("**Image**")))?.[1];
    const alt = /Alt: "([^"]+)"/.exec(head.notes)?.[1];
    expect(photoFile(article)).toBe(named);
    expect(same(article.head.image!.alt)).toBe(same(alt ?? ""));
  });

  it("prints the copy page's reading column word for word: the answer, every part, the sources", () => {
    const expected = columnFolds(folds).flatMap((f) => f.lines.map(printed)).join(" ");
    expect(same(words(column(article)))).toBe(same(expected));
  });

  it("links in its text exactly where the copy page links, the product page once (strategy §3.3), or never under P25", () => {
    const expected = copyLinks(columnFolds(folds).flatMap((f) => f.lines));
    const links = [...column(article).querySelectorAll("a:not(.ks-src)")].filter((a) => a.closest(".ks-sources") === null);
    expect(links.map((a) => [same(a.textContent ?? ""), a.getAttribute("href")])).toEqual(expected.map(([label, path]) => [same(label), path]));
    expect(links.filter((a) => a.getAttribute("href") === "/products/kheelu")).toHaveLength(NO_PRODUCT_LINK.has(slug) ? 0 : 1);
  });

  it("numbers its sources in reading order, cites every one, and every marker names a note (D026, B15)", () => {
    const order = nodes(readingStrings(article)).flatMap((n) => (n.kind === "source" ? [n.n] : []));
    const firsts = order.filter((n, i) => order.indexOf(n) === i);
    expect(firsts).toEqual(article.sources.map((_, i) => i + 1));
  });

  it("uses the icons the copy page names for its tips and its callout", () => {
    for (const f of folds) {
      const tips = /Tip icons: ((?:`[a-z-]+`(?:, )?)+)/.exec(f.notes)?.[1];
      const lists = blocks(article).filter((b): b is ListBlock => b.kind === "list" && b.variant === "tips");
      if (tips) {
        const names = [...tips.matchAll(/`([a-z-]+)`/g)].map((m) => m[1]);
        expect(lists.map((l) => l.items.map((item) => (typeof item === "string" ? undefined : item.icon)))).toContainEqual(names);
      }
      const callout = /`callout` \(icon `([a-z-]+)`\)/.exec(f.notes)?.[1];
      if (callout) expect(blocks(article).filter((b) => b.kind === "callout").map((b) => (b.kind === "callout" ? b.icon : ""))).toContain(callout);
    }
  });

  it("offers the copy page's related guides, each by its own card title", () => {
    const expected = fold(folds, "Related guides").lines.map(printed).slice(1).map(same);
    const related = builtMain(article).querySelector(".ks-related")!;
    expect([...related.querySelectorAll("a")].map((a) => [same(a.textContent ?? ""), a.getAttribute("href")])).toEqual(
      article.related.map((r, i) => [expected[i], `/stories/${r}`]),
    );
    expect(article.related.map((r) => same(toPlainText(cardTitle(r))))).toEqual(expected);
  });

  /* Template parity: the shared parts, as the approved articles print them. */

  it("frames its head as the approved article with a photo of the same shape does", () => {
    const reference = mockupFold(headReference(article), ".mk-story-head").cloneNode(true) as Element;
    const built = builtMain(article).querySelector(".ks-story-head")!;
    /* The article's own: its topic in the crumbs and its photo's words. */
    reference.querySelectorAll("nav a")[1].setAttribute("href", built.querySelectorAll("nav a")[1].getAttribute("href")!);
    reference.querySelector("img")!.setAttribute("alt", article.head.image!.alt);
    expect(skeleton(built, { ...OPTIONS, skip: HEAD_WORDS })).toBe(skeleton(reference, { ...OPTIONS, skip: HEAD_WORDS }));
    expect(built.querySelectorAll("nav a")[1].getAttribute("href")).toBe("/stories#screen-time");
  });

  it("opens its reading column with the approved answer card: the question, then the answer", () => {
    const col = column(article).querySelector(".ks-col")!;
    const built = col.querySelector(".ks-answer")!;
    const reference = mockupFold("story-learning-toys-for-a-three-year-old", ".mk-answer");
    expect(col.firstElementChild).toBe(built);
    expect(skeleton(firstChildren(built, 2), OPTIONS)).toBe(skeleton(firstChildren(reference, 2), OPTIONS));
  });

  it("uses only markup the approved reading columns use (body styles)", () => {
    const own = new Set([...column(article).querySelectorAll(".ks-col *")].map(markupOf));
    expect([...own].filter((m) => !APPROVED_COLUMN_MARKUP.has(m))).toEqual([]);
  });

  it("ends its reading column with the approved sources: the subtitle, then the numbered notes", () => {
    const col = column(article).querySelector(".ks-col")!;
    const built = col.querySelector(".ks-sources")!;
    const reference = mockupFold("story-learning-toys-for-a-three-year-old", ".mk-sources");
    const firstNote = (el: Element) => {
      const copy = el.cloneNode(true) as Element;
      const list = copy.querySelector("ol")!;
      [...list.children].slice(1).forEach((li) => li.remove());
      list.firstElementChild!.replaceChildren();
      return copy;
    };
    expect(skeleton(firstNote(built), OPTIONS)).toBe(skeleton(firstNote(reference), OPTIONS));
    expect(col.lastElementChild).toBe(built);
  });

  it("closes as the approved learning-toys article does: its related guides band, then the journal close", () => {
    const main = builtMain(article);
    const built = document.createElement("div");
    built.append(...[main.querySelector(".ks-related")!, main.querySelector("#close")!].map((n) => n.cloneNode(true)));
    const reference = document.createElement("div");
    reference.append(
      ...[mockupFold("story-learning-toys-for-a-three-year-old", ".mk-related"), mockupFold("story-learning-toys-for-a-three-year-old", "#close")].map((n) =>
        n.cloneNode(true),
      ),
    );
    /* The article's own: its three guides, by their card titles and pages; the mockup's store page is the store host. */
    reference.querySelectorAll(".mk-related a.kh-listitem").forEach((row, i) => {
      row.setAttribute("href", `/stories/${article.related[i]}`);
      row.querySelector(".kh-listitem__title")!.textContent = toPlainText(cardTitle(article.related[i]));
    });
    reference.querySelectorAll('a[href="store.html"]').forEach((link) => link.setAttribute("href", STORE_URL));
    const aside = { ...OPTIONS, skip: ".kh-art" };
    expect(skeleton(built, aside)).toBe(skeleton(reference, aside));
    expect(words(built, { skip: ".kh-art" })).toBe(words(reference, { skip: ".kh-art" }));
  });
});

describe("the 3-6-9-12 guide under open question P25's working default (task 5.20a)", () => {
  const text = () => same(words(column(rules)));

  it("names Tisseron's four AI markers in full, together in one fold, never a selection", () => {
    const fold3 = rules.body.find((b): b is ArticlePart => b.kind === "part" && (b.title?.startsWith("Where does") ?? false));
    expect(fold3, "fold 3, where the rule comes from").toBeDefined();
    const fold3Text = same((fold3?.blocks ?? []).flatMap((b) => (b.kind === "p" ? [toPlainText(b.text)] : [])).join(" "));
    for (const marker of AI_MARKERS) {
      expect(text(), marker).toContain(marker);
      expect(fold3Text, `fold 3: ${marker}`).toContain(marker);
    }
  });

  it("names Kheelu nowhere in its reading column: no product line beside the markers", () => {
    expect(text()).not.toMatch(/\bKheelu\b/);
    expect(NO_PRODUCT_LINK).toEqual(new Set([rules.slug]));
  });
});

describe("the screen-time articles together", () => {
  it("are all six of the topic's guides, none of them a stub any more", () => {
    expect(SCREEN_TIME.map(([slug]) => slug)).toEqual([
      "how-much-screen-time-for-a-3-to-6-year-old",
      "screen-time-rules-parents-swear-by",
      "screen-time-and-tantrums",
      "the-gentle-way-off-the-phone",
      "busy-hands-no-screens",
      "screen-free-does-not-mean-silent",
    ]);
    for (const [slug, article] of SCREEN_TIME) expect(articles[slug], slug).toBe(article);
  });

  it("never import the stub builder", () => {
    for (const [slug] of SCREEN_TIME) {
      expect(readRepoFile(`src/content/en-IN/stories/articles/${slug}.ts`), slug).not.toMatch(/from "\.\/stub"/);
    }
  });
});
