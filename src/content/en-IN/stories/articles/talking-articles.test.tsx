import { join } from "node:path";
import { render } from "@testing-library/react";
import sharp from "sharp";
import { beforeAll, describe, expect, it } from "vitest";
import type { Article, ArticlePart, FigureBlock, ImageRef, ProseBlock } from "@/content/types";
import { ArticleTemplate } from "@/layouts/ArticleTemplate/ArticleTemplate";
import { toPlainText } from "@/lib/content/plain-text";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { buildOffer } from "@/lib/offer/offer";
import { ROOT, readRepoFile } from "../../../../../test/e2e/support/repo";
import { mockupFold, skeleton, words } from "../../../../../test/support/mockup-compare";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";
import { article as aToyThatTalks } from "./a-toy-that-talks-vs-a-toy-that-listens";
import { article as collectWords } from "./how-children-collect-words";
import { article as learnByTalking } from "./how-children-learn-by-talking";
import { article as getTalking } from "./how-to-get-your-child-talking";
import { article as bilingual } from "./raising-a-bilingual-child-in-india";
import { article as talkingLate } from "./talking-late-or-talking-little";

/* The six talking-and-language guides (task 5.18; tasks.md wave 5 part C). There is no mockup for them: each module is
 * its copy page (wiki/site/pages/story-<slug>.md, CMO review wiki/qa/cmo-review-articles-5.18-2026-10-14.md) word for
 * word, rendered by the article template. So this file holds:
 *   - text parity with the copy page: the page the template renders says exactly the words of the copy page's Copy
 *     blocks, in order (head, answer, parts, sources, keep-reading close), markers included;
 *   - the copy page's title, description, H1 accent and head photo; the stub's card, related list and dates, which the
 *     rewrite keeps (the hub's approved copy, stories.md fold 3; the main session's task notes);
 *   - the rules of row 5.18 and the talking topic: D025's line, verbatim, directly under every answer; no pitch (B5):
 *     no product link, no pre-order button, Kheelu named only in the D025 line; links to other guides only; every
 *     marker names a note and every note is cited (D026);
 *   - template parity for the shared parts (tasks.md, the note on the 18 articles without a mockup): the head, the
 *     answer card, the sources and the keep-reading close render the approved articles' markup.
 * The folder's invariants (slugs, related ring, dates, lengths) stay articles.test.ts's. */

/** The rewrite's date: every rewritten article's `updated` (BlogPosting dateModified and the sitemap), as task 5.6
 *  set it for the three approved guides; `published` stays the live page's (ruling at the wave 5 part C merge). */
const REWRITE_DATE = "2026-10-13";

const TOKEN = buildOffer("token");

/** D025's in-article line, as the approved late-talker page prints it. */
const D025 = "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.";

interface Expected {
  readonly article: Article;
  /** The stub's card, related list and dates: the rewrite keeps them (task notes; stories.md fold 3). */
  readonly stub: Pick<Article, "card" | "related" | "published" | "updated">;
  /** Every in-text link, in reading order: other guides only (B5). */
  readonly links: readonly string[];
  /** The icons of the tips and callouts, in reading order: the copy page's, or the CMO review's (M14) where the copy
   *  page leaves the pick to the builder. */
  readonly icons: readonly string[];
}

const TALKING: readonly (readonly [string, Expected])[] = [
  [
    "talking-late-or-talking-little",
    {
      article: talkingLate,
      stub: {
        card: {
          title: "Talking late, or talking little?",
          summary: "A calm guide for parents of quiet 3 and 4 year olds: what varies, what deserves a professional look, and what helps at home.",
        },
        related: ["how-to-get-your-child-talking", "how-children-collect-words", "a-toy-that-talks-vs-a-toy-that-listens"],
        published: "2026-07-28",
        updated: "2026-07-31",
      },
      links: [],
      icons: ["chat-circle-dots", "question", "plus", "clock", "book-open", "music-notes", "eye-slash"],
    },
  ],
  [
    "how-to-get-your-child-talking",
    {
      article: getTalking,
      stub: {
        card: {
          title: "How to get your child talking",
          summary: "Better questions than “How was school?”, and the small habits that turn one-word answers into conversations.",
        },
        related: ["ai-toys-and-indias-data-law", "talking-late-or-talking-little", "how-children-collect-words"],
        published: "2026-07-28",
        updated: "2026-09-05",
      },
      links: ["/stories/talking-late-or-talking-little"],
      icons: ["eye", "currency-inr", "book-open", "chat-circle-dots", "music-notes", "users-three"],
    },
  ],
  [
    "how-children-learn-by-talking",
    {
      article: learnByTalking,
      stub: {
        card: {
          title: "How children learn by talking",
          summary: "Serve and return, the back-and-forth between a young child and a caring adult, and how it looks at home.",
        },
        related: ["why-three-to-six-are-the-years-that-matter-most", "what-actually-builds-a-sharp-brain", "learning-toys-for-a-three-year-old"],
        published: "2026-07-28",
        updated: "2026-09-05",
      },
      links: [],
      icons: ["eye", "clock", "eye-slash"],
    },
  ],
  [
    "how-children-collect-words",
    {
      article: collectWords,
      stub: {
        card: {
          title: "How children collect words",
          summary: "How children pick up words at home, in every language you speak, without a single worksheet.",
        },
        related: ["talking-late-or-talking-little", "a-toy-that-talks-vs-a-toy-that-listens", "talking-toys-and-late-talkers"],
        published: "2026-07-28",
        updated: "2026-07-31",
      },
      links: ["/stories/raising-a-bilingual-child-in-india", "/stories/talking-toys-and-late-talkers"],
      icons: ["chat-circle-dots", "info", "eye", "question", "book-open", "arrow-counter-clockwise", "users-three", "star"],
    },
  ],
  [
    "raising-a-bilingual-child-in-india",
    {
      article: bilingual,
      stub: {
        card: {
          title: "Raising a bilingual child in India",
          summary: "Does a bilingual home confuse a young child? What the research says, and what keeps a home language alive.",
        },
        related: ["talking-toys-and-late-talkers", "should-kids-use-ai", "does-a-three-year-old-need-an-ai-tutor"],
        published: "2026-07-28",
        updated: "2026-09-05",
      },
      links: [],
      icons: ["music-notes", "chat-circle-dots", "translate", "book-open", "users-three", "heart", "hand-heart"],
    },
  ],
  [
    "a-toy-that-talks-vs-a-toy-that-listens",
    {
      article: aToyThatTalks,
      stub: {
        card: {
          title: "A toy that talks is not a toy that listens",
          summary: "Why a toy that repeats your child is a mirror, and how screens, speakers and talking toys compare.",
        },
        related: ["how-children-collect-words", "talking-toys-and-late-talkers", "raising-a-bilingual-child-in-india"],
        published: "2026-07-30",
        updated: "2026-09-05",
      },
      links: ["/stories/what-to-look-for-in-a-safe-ai-toy"],
      icons: ["question"],
    },
  ],
];

/* ── The copy page ──────────────────────────────────────────────────────────────────────────────────────────────── */

const copyPage = (slug: string) => readRepoFile(`wiki/site/pages/story-${slug}.md`);

const SUPERSCRIPTS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const MARKER_RUN = /[⁰¹²³⁴⁵⁶⁷⁸⁹]+(?:\s+[⁰¹²³⁴⁵⁶⁷⁸⁹]+)*/g;
const markerNumber = (run: string) => [...run].map((c) => SUPERSCRIPTS.indexOf(c)).join("");

/** One line of a Copy block as the page prints it: the block labels, the list dashes and the markdown gone, the
 *  crumb separator (an icon on the page) gone, and each superscript marker as the "[n]" the page prints. */
function printed(line: string): string {
  return line
    .replace(/^\*\*(?:Breadcrumb|H1|H2):\*\*\s*/, "")
    .replace(/ › /g, " ")
    .replace(/^- /, "")
    .replace(/^\[([^\]]+)\] → `[^`]*`.*$/, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^\*(.+)\*$/, "$1")
    .replace(MARKER_RUN, (run) =>
      run
        .split(/\s+/)
        .map((n) => `[${markerNumber(n)}]`)
        .join(""),
    );
}

/** The words of the copy page's Copy blocks, in order: only those are published (D013). A block is the run of quoted
 *  lines after a "**Copy**" line. */
function copyWords(slug: string): string {
  const out: string[] = [];
  let inCopy = false;
  let started = false;
  for (const line of copyPage(slug).split("\n")) {
    if (/^\*\*Copy(?::\*\*|\*\*)/.test(line)) {
      inCopy = true;
      started = false;
    } else if (inCopy && line.startsWith(">")) {
      started = true;
      out.push(printed(line.replace(/^>\s?/, "")));
    } else if (inCopy && started) inCopy = false;
  }
  return out.join(" ").replace(/\s+/g, " ").trim();
}

/** Both sides read alike: typographic quotes as the copy pages type them, a marker joined to the words after it (the
 *  sources list prints its number apart, with no space), white space collapsed. */
const same = (s: string) =>
  s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/‑/g, "-")
    .replace(/ /g, " ")
    .replace(/(\[\d+\])\s+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

/** The copy page's metadata row ("| Title (58 characters) | … |"), checked at the length the row states. */
function copyRow(slug: string, label: "Title" | "Meta description"): string {
  const row = copyPage(slug)
    .split("\n")
    .find((l) => new RegExp(`^\\|\\s*${label} \\(\\d+ characters\\)\\s*\\|`).test(l));
  if (row === undefined) throw new Error(`story-${slug}.md has no "${label} (n characters)" row`);
  const [cell, value] = row.split("|").slice(1, 3).map((c) => c.trim());
  expect(value.length, `story-${slug}.md "${cell}"`).toBe(Number(/\((\d+) characters\)/.exec(cell)![1]));
  return value;
}

/** A note of the copy page's fold 1 (the notes wrap across lines): the H1 accent and the head photo with its alt. */
function headNotes(slug: string): { hand: string; photo: string; alt: string } {
  const text = copyPage(slug).replace(/\n\s+/g, " ");
  const hand = /\*\*H1 accent:\*\* `Hand` on "([^"]+)"/.exec(text);
  const image = /\*\*Image\*\* \(`kh-photo[^`]*`, [^)]*\): `([^`]+)`\. Alt: "([^"]+)"/.exec(text);
  if (!hand || !image) throw new Error(`story-${slug}.md: no H1 accent or no head image note in fold 1`);
  return { hand: hand[1], photo: image[1], alt: image[2] };
}

/* ── The module ─────────────────────────────────────────────────────────────────────────────────────────────────── */

/** Every content string of the module a reader sees (meta, card, head, answer, body; never an image or an href). */
function contentStrings(article: Article): string[] {
  const strings = (v: unknown): string[] =>
    typeof v === "string"
      ? [v]
      : Array.isArray(v)
        ? v.flatMap(strings)
        : v && typeof v === "object"
          ? Object.entries(v).flatMap(([k, x]) => (k === "src" || k === "image" || k === "icon" || k === "kind" || k === "variant" ? [] : strings(x)))
          : [];
  const { meta, card, head, answer, body } = article;
  return strings([meta.title, meta.description, card, head.title, head.lead ?? "", head.author, answer ?? [], body]);
}

/** The words of some nodes, accents and no-wrap phrases opened. */
const textOf = (list: readonly RichNode[]): string => list.map((n) => ("children" in n ? textOf(n.children) : n.kind === "text" ? n.text : "")).join("");

function nodes(article: Article): RichNode[] {
  const all = (list: readonly RichNode[]): RichNode[] => list.flatMap((n) => [n, ...("children" in n ? all(n.children) : [])]);
  return contentStrings(article).flatMap((s) => all(parseRichText(s)));
}

/** Every prose block of the reading column, the answer's detail first. */
function blocks(article: Article): ProseBlock[] {
  return [
    ...(article.answer?.detail ?? []),
    ...article.body.flatMap((b: ArticlePart | FigureBlock): ProseBlock[] => (b.kind === "part" ? [...b.blocks] : [b])),
  ];
}

/** The words a reader reads: the head's title and lead, the answer and the parts (never the sources or the close),
 *  markers left out, a word being anything with a letter or a digit. */
function readingWords(article: Article): number {
  const { head, answer, body } = article;
  const text = [head.title, head.lead ?? "", answer?.question ?? "", answer?.answer ?? "", ...blocks(article).flatMap(blockStrings), ...body.flatMap((b) => (b.kind === "part" && b.title ? [b.title] : []))]
    .map((s) => toPlainText(s, TOKEN).replace(/\[\d+\]/g, " "))
    .join(" ");
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

function blockStrings(block: ProseBlock): string[] {
  switch (block.kind) {
    case "p":
    case "callout":
      return [block.lead ?? "", block.text ?? ""];
    case "h3":
    case "disclaimer":
      return [block.text];
    case "list":
      return block.items.flatMap((item) => (typeof item === "string" ? [item] : [item.lead ?? "", item.text ?? ""]));
    default:
      throw new Error(`a talking guide uses no ${block.kind} block`);
  }
}

/** The photo's file name, read from the module's image (Vitest loads it as an address; the build as an import). */
function photoFile(image: ImageRef): string {
  const src = image.src as unknown;
  return decodeURIComponent(typeof src === "string" ? src : (src as { src: string }).src)
    .split("/")
    .pop()!
    .split("?")[0];
}

/* ── The page ───────────────────────────────────────────────────────────────────────────────────────────────────── */

const SIZES = new Map<string, { width: number; height: number }>();

beforeAll(async () => {
  for (const [, { article }] of TALKING) {
    if (article.head.image === undefined) continue;
    const file = photoFile(article.head.image);
    const meta = await sharp(join(ROOT, "design-system/project/assets/Photo library", file)).metadata();
    SIZES.set(file, { width: meta.width!, height: meta.height! });
  }
});

/** The article with its head photo at the file's own size: Vitest loads an image without the size next/image's static
 *  import carries, and the photo's shape sets the head's layout (portrait or wide). */
function sized(article: Article): Article {
  const image = article.head.image;
  if (image === undefined) return article;
  const file = photoFile(image);
  return { ...article, head: { ...article.head, image: { src: `/${file}`, ...SIZES.get(file)!, alt: image.alt } } };
}

const page = (article: Article) => render(<ArticleTemplate article={sized(article)} offer={TOKEN} />).container;

/* ── The tests ──────────────────────────────────────────────────────────────────────────────────────────────────── */

describe.each(TALKING)("the talking guide %s", (slug, { article, stub, links, icons }) => {
  it("prints its copy page word for word: head, answer, parts, sources and the keep-reading close", () => {
    expect(same(words(page(article), { skip: "script" }))).toBe(same(copyWords(slug)));
  });

  it("has the copy page's title and description", () => {
    expect(same(toPlainText(article.meta.title))).toBe(same(copyRow(slug, "Title")));
    expect(same(toPlainText(article.meta.description))).toBe(same(copyRow(slug, "Meta description")));
    expect(article.meta.og).toEqual(DEFAULT_OG);
  });

  it("keeps the stub's card, related list and first-published date; `updated` is the rewrite's (the hub's approved copy; part C merge ruling)", () => {
    const { updated, ...kept } = stub;
    expect({ card: article.card, related: article.related, published: article.published }).toEqual(kept);
    expect(article.updated).toBe(REWRITE_DATE);
    expect(article.updated > updated).toBe(true);
  });

  it("has the copy page's head: the Hand accent, the team byline, the photo and its words", () => {
    const notes = headNotes(slug);
    const hands = parseRichText(article.head.title).flatMap((n) => (n.kind === "hand" ? [textOf(n.children)] : []));
    expect(hands).toEqual([notes.hand]);
    expect(article.head.author).toBe(TEAM_BYLINE);
    expect(photoFile(article.head.image!)).toBe(notes.photo);
    expect(article.head.image!.alt).toBe(notes.alt);
  });

  it("states its read time from its own words, round(words / 200) (CMO review M11)", () => {
    expect(article.head.readMinutes).toBe(Math.max(1, Math.round(readingWords(article) / 200)));
  });

  it("has the copy page's byline row at the module's read time (the copy page and the build agree)", () => {
    const row = copyPage(slug)
      .split("\n")
      .find((l) => /^\|\s*Byline line\s*\|/.test(l));
    expect(row?.split("|")[2]).toMatch(new RegExp(`· ${article.head.readMinutes} min read(?: \\(.*\\))?\\s*$`));
  });

  it("puts D025's line, verbatim, directly under the answer, and names Kheelu nowhere else (B5)", () => {
    expect(article.answer?.detail).toEqual([{ kind: "disclaimer", text: D025 }]);
    expect(page(article).querySelector(".ks-answer")?.lastElementChild?.className).toBe("kh-body-s ks-disclaimer");
    expect(contentStrings(article).filter((s) => /\bKheelu\b/.test(s))).toEqual([D025]);
  });

  it("never pitches: the keep-reading close, no pre-order button, no product or store link (B5)", () => {
    expect(article.close).toBe("keep");
    const container = page(article);
    expect(container.querySelector(".kh-btn--cta, [data-ph-capture-attribute-cta]")).toBeNull();
    expect([...container.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter((h) => /\/products|store|^https:\/\/kheelona/.test(h!))).toEqual([]);
  });

  it("links only the guides its copy page links, in reading order", () => {
    expect(nodes(article).flatMap((n) => (n.kind === "link" ? [n.href] : []))).toEqual(links);
  });

  it("cites every note it lists, and every marker names a note (D026)", () => {
    const cited = new Set(nodes(article).flatMap((n) => (n.kind === "source" ? [n.n] : [])));
    expect(article.sources.length).toBeGreaterThan(0);
    expect([...cited].sort((a, b) => a - b)).toEqual(article.sources.map((_, i) => i + 1));
  });

  it("gives each tip and callout the icon the copy page names (or the CMO review's, M14)", () => {
    const named = blocks(article).flatMap((b) =>
      b.kind === "callout" ? [b.icon] : b.kind === "list" && b.variant === "tips" ? b.items.map((i) => (typeof i === "string" ? "" : (i.icon ?? ""))) : [],
    );
    expect(named).toEqual(icons);
  });

  it("prints typographic quotes and apostrophes, never straight ones", () => {
    expect(contentStrings(article).filter((s) => /['"]/.test(s.replace(/\]\([^)]*\)/g, "]")))).toEqual([]);
  });
});

/* Template parity (tasks.md, the 18 articles without a mockup): the shared parts render the approved articles' markup.
 * The head follows the approved head of its photo's shape (the late-talker page's wide photo, the learning-toys page's
 * portrait one); the answer card, the sources and the keep-reading close follow the approved late-talker page, which has
 * the same answer, the D025 line and the keep close. Words, markers, alts and source addresses differ by article, so
 * they are left out here: the copy parity above holds them. */

const PARITY = {
  drop: /^(ks-type-.*|ks-list-reset|ks-src--article)$/,
  unwrap: ".ks-heading__step, [data-src], .kh-hand, .ks-nowrap, .mk-nowrap",
  skip: ".ks-src, .mk-src",
};

/** `el` with its alts and its source addresses left out, and every list cut to its first row. */
function shape(el: Element): Element {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll("[alt]").forEach((n) => n.removeAttribute("alt"));
  copy.querySelectorAll("ol.ks-notes a, ol.mk-notes a, .ks-notes a, .mk-notes a").forEach((n) => n.removeAttribute("href"));
  copy.querySelectorAll(".ks-notes > li + li, .mk-notes > li + li").forEach((n) => n.remove());
  return copy;
}

describe.each(TALKING)("the talking guide %s, as the article template's shared parts", (slug, { article }) => {
  const wide = () => {
    const size = SIZES.get(photoFile(article.head.image!))!;
    return size.width > size.height;
  };

  it("renders its head as the approved head of its photo's shape", () => {
    const approved = mockupFold(wide() ? "story-talking-toys-and-late-talkers" : "story-learning-toys-for-a-three-year-old", ".mk-story-head").cloneNode(true) as Element;
    approved.querySelectorAll(".mk-crumbs li + li a").forEach((a) => a.setAttribute("href", "stories.html#talking"));
    const built = page(article).querySelector(".ks-story-head")!;
    expect(skeleton(shape(built), PARITY)).toBe(skeleton(shape(approved), PARITY));
  });

  it("renders its answer card, with D025's line under it, as the approved late-talker page", () => {
    const built = page(article).querySelector(".ks-answer")!;
    expect(skeleton(shape(built), PARITY)).toBe(skeleton(shape(mockupFold("story-talking-toys-and-late-talkers", ".mk-answer")), PARITY));
  });

  it("renders its sources as the approved late-talker page", () => {
    const built = page(article).querySelector(".ks-sources")!;
    expect(skeleton(shape(built), PARITY)).toBe(skeleton(shape(mockupFold("story-talking-toys-and-late-talkers", ".mk-sources")), PARITY));
  });

  it("closes with the approved keep-reading close, its rows linked to its own related guides", () => {
    const approved = mockupFold("story-talking-toys-and-late-talkers", ".mk-related").cloneNode(true) as Element;
    approved.querySelectorAll("a.kh-listitem").forEach((row, i) => row.setAttribute("href", `/stories/${article.related[i]}`));
    const built = page(article).querySelector(".ks-related")!;
    expect(skeleton(shape(built), PARITY)).toBe(skeleton(shape(approved), PARITY));
  });
});

describe("the copy-page reader this file uses", () => {
  it("turns a Copy line into the words the page prints", () => {
    expect(printed("**H2:** Will a bilingual home confuse your child?")).toBe("Will a bilingual home confuse your child?");
    expect(printed("**Breadcrumb:** Stories › Talking and language")).toBe("Stories Talking and language");
    expect(printed("- **At breakfast.** A moon.¹ ² Then a half moon.³")).toBe("At breakfast. A moon.[1][2] Then a half moon.[3]");
    expect(printed("read [a guide](/stories/x) now")).toBe("read a guide now");
    expect(printed("[All guides for parents of 3 to 7 year olds] → `/stories`")).toBe("All guides for parents of 3 to 7 year olds");
    expect(printed("*Kheelu is a toy.*")).toBe("Kheelu is a toy.");
    expect(printed("¹ A source, 2026. https://example.org/")).toBe("[1] A source, 2026. https://example.org/");
  });

  it("reads only the Copy blocks, never the internal notes around them", () => {
    const words = copyWords("talking-late-or-talking-little");
    expect(words.startsWith("Stories Talking and language 3-year-old not talking in sentences?")).toBe(true);
    expect(words).not.toMatch(/INTERNAL|Fold job|Renders as/);
    expect(words.endsWith("All guides for parents of 3 to 7 year olds")).toBe(true);
  });
});
