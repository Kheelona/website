import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Article } from "@/content/types";
import { ArticleTemplate } from "@/layouts/ArticleTemplate/ArticleTemplate";
import { articleTrail } from "@/layouts/ArticleTemplate/article-page";
import { toPlainText } from "@/lib/content/plain-text";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { formatDate } from "@/lib/format/date";
import { buildOffer } from "@/lib/offer/offer";
import { readRepoFile } from "../../../../../test/e2e/support/repo";
import { words } from "../../../../../test/support/mockup-compare";
import { RETENTION_LINE, RETENTION_MONTHS } from "../../policies";
import { product } from "../../products/kheelu/product";
import { seller } from "../../seller";
import { articles, getArticle } from "./index";

/* The six AI, safety and learning articles (task 5.19): rewritten from their approved copy pages
 * (wiki/site/pages/story-<slug>.md, CMO review wiki/qa/cmo-review-articles-5.19-2026-10-14.md). They have no mockup, so
 * the copy page is the reference: every Copy block of the head, the answer, the body and the sources is read from the
 * page and compared with what the article template renders, word for word and heading by heading (SPA 2 and 7, with
 * the copy page in the mockup's place). The related guides and the close are the template's, shared with the approved
 * articles (ArticleTemplate.test.tsx); their order and words are checked here only as far as the module names them.
 * Page rules of tasks.md 5.19: one in-text product link each, brain wording per D016, the data-law page states the law
 * from its official texts and gives no legal advice, shared facts read from their modules and never retyped. */

const SLUGS = [
  "questions-parents-ask-about-ai-toys",
  "should-kids-use-ai",
  "ai-toys-and-indias-data-law",
  "does-a-three-year-old-need-an-ai-tutor",
  "what-actually-builds-a-sharp-brain",
  "why-three-to-six-are-the-years-that-matter-most",
] as const;
type Slug = (typeof SLUGS)[number];

/** The copy-page reading is calibrated on the three approved articles (task 5.6), whose modules were ported from their
 *  mockups: a rule that would fail approved copy is a broken rule, not a broken page. */
const APPROVED = ["learning-toys-for-a-three-year-old", "what-to-look-for-in-a-safe-ai-toy", "talking-toys-and-late-talkers"] as const;
type Parity = Slug | (typeof APPROVED)[number];

/** The live articles' last edits (the stubs kept them, src/lib/stories*.ts at the freeze tag); the rewrite comes after. */
const LIVE_UPDATED: Readonly<Record<Slug, string>> = {
  "questions-parents-ask-about-ai-toys": "2026-09-11",
  "should-kids-use-ai": "2026-09-05",
  "ai-toys-and-indias-data-law": "2026-09-11",
  "does-a-three-year-old-need-an-ai-tutor": "2026-09-05",
  "what-actually-builds-a-sharp-brain": "2026-07-31",
  "why-three-to-six-are-the-years-that-matter-most": "2026-09-05",
};
/** The rewrite's date, from git history (architecture §6.1: stored when the article changes). */
const REWRITE_DATE = "2026-10-13";

const TOKEN = buildOffer("token");
const article = (slug: Parity): Article => articles[slug];
const moduleSource = (slug: Parity) => readRepoFile(`src/content/en-IN/stories/articles/${slug}.ts`);

/* ── Reading a copy page ──────────────────────────────────────────────────────────────────────────────────────── */

interface Fold {
  /** The fold heading without "Fold n · ". */
  readonly title: string;
  /** Everything under the heading, notes included. */
  readonly text: string;
  /** The Copy block's paragraphs, each its quoted lines. */
  readonly paragraphs: readonly (readonly string[])[];
}

interface CopyPage {
  readonly title: string;
  readonly description: string;
  readonly folds: readonly Fold[];
}

function copyPage(slug: Parity): CopyPage {
  const md = readRepoFile(`wiki/site/pages/story-${slug}.md`);
  const row = (label: string) => {
    const m = new RegExp(`^\\| ${label} \\([^)]*\\) \\| (.+?) \\|$`, "m").exec(md);
    if (!m) throw new Error(`story-${slug}.md: no "${label}" row in "At a glance"`);
    return m[1];
  };
  const folds = md
    .split(/^## /m)
    .slice(1)
    .filter((s) => s.startsWith("Fold "))
    .map((section): Fold => {
      const [heading, ...rest] = section.split("\n");
      /* The Copy block: the quoted lines after "**Copy", grouped by the blank quote lines between them. */
      const quoted: string[] = [];
      let i = rest.findIndex((l) => l.startsWith("**Copy"));
      if (i >= 0) {
        while (i < rest.length && !rest[i].startsWith(">")) i++;
        for (; i < rest.length && rest[i].startsWith(">"); i++) quoted.push(rest[i].replace(/^>\s?/, ""));
      }
      const paragraphs = quoted
        .join("\n")
        .split(/\n\s*\n/)
        .map((p) => p.split("\n").filter((l) => l.trim() !== ""))
        .filter((p) => p.length > 0);
      return { title: heading.replace(/^Fold \d+ · /, "").trim(), text: rest.join("\n"), paragraphs };
    });
  return { title: row("Title"), description: row("Meta description"), folds };
}

function fold(page: CopyPage, title: RegExp): Fold {
  const found = page.folds.find((f) => title.test(f.title));
  if (!found) throw new Error(`the copy page has no fold ${title}`);
  return found;
}

/** One block of a Copy block: a heading (the H2, a bold question, the sources' title) or a run of text. */
interface Block {
  readonly heading: boolean;
  readonly text: string;
}

const H2 = /^\*\*H2:\*\* (.+)$/;
const BOLD_ONLY = /^\*\*([^*]+)\*\*$/;

function blocks(paragraph: readonly string[]): Block[] {
  const [first, ...rest] = paragraph;
  const heading = H2.exec(first) ?? BOLD_ONLY.exec(first);
  if (heading) return [{ heading: true, text: heading[1] }, ...(rest.length ? blocks(rest) : [])];
  if (paragraph.every((l) => l.startsWith("- "))) return paragraph.map((l) => ({ heading: false, text: l.slice(2) }));
  return [{ heading: false, text: paragraph.join(" ") }];
}

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** A Copy line as the page prints it: bold and italic marks gone, links as their words, superscript markers as "[n]". */
function plainCopy(line: string): string {
  return line
    .replace(/\*+/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => `[${[...m].map((c) => SUPERSCRIPT.indexOf(c)).join("")}]`);
}

/** Quotes and spaces as one form on both sides; the space a copy page leaves around a marker counts for nothing. */
const norm = (s: string) =>
  s
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[   ]/g, " ")
    .replace(/\s*(\[\d+\])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

/** The reading column's folds on the copy page: the answer, the body, the sources (not the head, related or close). */
function columnFolds(page: CopyPage): Fold[] {
  return page.folds.filter((f) => !/^(Article head|Related guides|Close)/.test(f.title));
}

const columnBlocks = (page: CopyPage) => columnFolds(page).flatMap((f) => f.paragraphs.flatMap(blocks));

/** The in-text links of the copy's column, as the site's own paths. */
function copyLinks(page: CopyPage): { label: string; href: string }[] {
  const lines = columnFolds(page).flatMap((f) => f.paragraphs.flat());
  return lines.flatMap((l) => [...l.matchAll(/\[([^\]]+)\]\(https:\/\/kheelona\.com(\/[^)]*)\)/g)].map((m) => ({ label: m[1], href: m[2] })));
}

/* ── Reading the rendered page ────────────────────────────────────────────────────────────────────────────────── */

function rendered(slug: Parity) {
  const { container } = render(<ArticleTemplate article={article(slug)} offer={TOKEN} />);
  const column = container.querySelector(".ks-story-body");
  if (column === null) throw new Error(`${slug}: the template rendered no reading column`);
  return { container, column };
}

/** The column's in-text links: not the source markers, the notes' addresses or the help line's WhatsApp and call. */
function renderedLinks(column: Element): { label: string; href: string }[] {
  return Array.from(column.querySelectorAll("a"))
    .filter((a) => !a.matches(".ks-src, .ks-sources a") && !/^(?:https:\/\/wa\.me|tel:)/.test(a.getAttribute("href") ?? ""))
    .map((a) => ({ label: norm(a.textContent ?? ""), href: a.getAttribute("href") ?? "" }));
}

/** Every string in a value, depth first (block kinds and icon names included: harmless to the rules below). */
const strings = (v: unknown): string[] =>
  typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];

const answerStrings = (a: Article) => (a.answer ? strings([a.answer.question, a.answer.answer, a.answer.detail ?? []]) : []);

/** Every content string of an article's column (answer, parts, captions), for the rules that read the module. */
const columnStrings = (a: Article): string[] => [...answerStrings(a), ...strings(a.body)];

/** The answer and each part, as plain text: the units D016 keeps apart. */
const units = (a: Article): string[][] => [answerStrings(a), ...a.body.map(strings)].map((u) => u.map((s) => toPlainText(s)));

const nodesOf = (s: string): RichNode[] => {
  const all = (list: readonly RichNode[]): RichNode[] => list.flatMap((n) => [n, ...("children" in n ? all(n.children) : [])]);
  try {
    return all(parseRichText(s));
  } catch {
    return []; // an icon name or a variant, not text
  }
};

/* ── The tests ────────────────────────────────────────────────────────────────────────────────────────────────── */

describe.each([...SLUGS, ...APPROVED])("the article %s, as its approved copy page words it", (slug) => {
  const page = copyPage(slug);

  it("carries the copy page's title and description", () => {
    expect(norm(toPlainText(article(slug).meta.title))).toBe(norm(page.title));
    expect(norm(toPlainText(article(slug).meta.description))).toBe(norm(page.description));
  });

  it("heads the page with the copy's H1, accent, lead, crumbs and byline", () => {
    const a = article(slug);
    const head = fold(page, /^Article head/);
    const line = (label: string) => head.paragraphs.flat().find((l) => l.startsWith(`**${label}:**`))?.replace(`**${label}:** `, "") ?? "";
    const [lead, byline] = head.paragraphs.flat().filter((l) => !l.startsWith("**"));
    expect(norm(toPlainText(a.head.title))).toBe(norm(line("H1")));
    expect(norm(toPlainText(a.head.lead ?? ""))).toBe(norm(lead));
    const hand = /`Hand` on "([^"]+)"/.exec(head.text)?.[1];
    const hands = nodesOf(a.head.title).filter((n) => n.kind === "hand");
    expect(hands.map((n) => ("children" in n ? n.children.map((c) => (c.kind === "text" ? c.text : "")).join("") : ""))).toEqual([hand]);
    expect(articleTrail(a).map((c) => c.name)).toEqual(line("Breadcrumb").split(" › "));
    expect(norm(`${a.head.author} · First published ${formatDate(a.published, "ui")} · ${a.head.readMinutes} min read`)).toBe(norm(byline));
  });

  it("shows the copy page's head photo, with its alt", () => {
    const note = fold(page, /^Article head/).text.replace(/\s+/g, " ");
    const m = /`([a-z0-9-]+-web\.webp)`\. Alt: "([^"]+)"/.exec(note);
    expect(m, "the copy page names the head photo and its alt").not.toBeNull();
    const image = article(slug).head.image!;
    const src = image.src as unknown;
    expect(decodeURIComponent(typeof src === "string" ? src : (src as { src: string }).src)).toMatch(new RegExp(`/Photo library/${m![1]}$`));
    expect(norm(image.alt)).toBe(norm(m![2]));
  });

  it("renders the copy page's reading column word for word: answer, body, sources", () => {
    const expected = norm(columnBlocks(page).map((b) => plainCopy(b.text)).join(" "));
    expect(norm(words(rendered(slug).column))).toBe(expected);
  });

  it("renders the copy page's headings, in order: the answer's question, each H2, each question asked", () => {
    const expected = columnBlocks(page).filter((b) => b.heading).map((b) => norm(plainCopy(b.text)));
    const headings = Array.from(rendered(slug).column.querySelectorAll("h2, h3")).map((h) => norm(h.textContent ?? ""));
    expect(headings).toEqual(expected);
  });

  it("links what the copy links, where it links", () => {
    const links = renderedLinks(rendered(slug).column);
    expect(links).toEqual(copyLinks(page).map((l) => ({ label: norm(plainCopy(l.label)), href: l.href })));
  });

  it("cites every note it lists, and every marker names a note (D026)", () => {
    const cited = new Set(columnStrings(article(slug)).flatMap((s) => nodesOf(s).flatMap((n) => (n.kind === "source" ? [n.n] : []))));
    expect([...cited].sort((x, y) => x - y)).toEqual(article(slug).sources.map((_, i) => i + 1));
  });

});

describe.each(SLUGS)("the rewritten article %s (task 5.19)", (slug) => {
  it("is a full article now, built without the stub", () => {
    expect(moduleSource(slug)).not.toMatch(/from "\.\/stub"/);
    expect(article(slug).answer).toBeDefined();
    expect(article(slug).sources.length).toBeGreaterThan(0);
  });

  it("heads the page with the hub card's title and summary, word for word (stories.md folds 4-5)", () => {
    const head = fold(copyPage(slug), /^Article head/).paragraphs.flat();
    const [lead] = head.filter((l) => !l.startsWith("**"));
    const h1 = head.find((l) => l.startsWith("**H1:**"))!.replace("**H1:** ", "");
    expect(norm(toPlainText(article(slug).card.title))).toBe(norm(h1));
    expect(norm(toPlainText(article(slug).card.summary))).toBe(norm(lead));
  });

  it("links the product page once in its text (strategy §3.3)", () => {
    expect(renderedLinks(rendered(slug).column).filter((l) => l.href === "/products/kheelu")).toHaveLength(1);
  });

  it("keeps the stub's related guides, in the copy page's order", () => {
    const related = fold(copyPage(slug), /^Related guides/);
    expect(article(slug).related).toEqual([...related.text.matchAll(/^\| [^|]+ \| `\/stories\/([a-z0-9-]+)`/gm)].map((m) => m[1]));
    const titles = related.paragraphs.flat().filter((l) => l.startsWith("- ")).map((l) => norm(l.slice(2)));
    expect(article(slug).related.map((r) => norm(toPlainText(getArticle(r)!.card.title)))).toEqual(titles);
  });

  it("closes with the journal close (the pre-order button, finale)", () => {
    expect(article(slug).close).toBe("journal");
  });

  it("stores the rewrite's date as its last edit, after the live article's (architecture §6.1)", () => {
    expect(article(slug).updated).toBe(REWRITE_DATE);
    expect(article(slug).updated > LIVE_UPDATED[slug]).toBe(true);
  });

  it("never puts a brain line in the same answer or part as Kheelu (D016)", () => {
    const mixed = units(article(slug)).filter((u) => u.some((s) => /\bKheelu\b/.test(s)) && u.some((s) => /\bbrain/i.test(s)));
    expect(mixed).toEqual([]);
  });
});

describe("the shared facts, read from their modules and never retyped", () => {
  it("prints the D020 retention line from policies.ts where a page gives it (hard questions, should kids, data law)", () => {
    for (const slug of ["questions-parents-ask-about-ai-toys", "should-kids-use-ai", "ai-toys-and-indias-data-law"] as const) {
      expect(columnStrings(article(slug)).some((s) => s.includes(RETENTION_LINE)), slug).toBe(true);
    }
    for (const slug of SLUGS) expect(moduleSource(slug), slug).not.toMatch(new RegExp(`\\b${RETENTION_MONTHS}\\s+months\\b`));
  });

  it("words the data-law page's help line from the seller's help line, never a retyped number (seller.ts, D032)", () => {
    const contact = columnStrings(article("ai-toys-and-indias-data-law")).filter((s) => s.includes(seller.support.phone));
    expect(contact).toHaveLength(1);
    expect(contact[0].endsWith(`tell us: ${seller.help.contact}.`)).toBe(true);
    for (const slug of SLUGS) expect(moduleSource(slug), slug).not.toMatch(/91875|919187546483/);
  });

  it("names the languages from the product facts, never a typed list (product.ts)", () => {
    const names = product.languages.map((l) => l.name);
    const line = `It speaks ${names.slice(0, -1).join(", ")} and ${names.at(-1)}, with up to ${product.languageCeiling} languages at launch.`;
    expect(columnStrings(article("questions-parents-ask-about-ai-toys")).some((s) => s.endsWith(line))).toBe(true);
    for (const slug of SLUGS) expect(moduleSource(slug), slug).not.toMatch(/\bKannada\b/);
  });
});

describe("the data-law page states the law from its official texts and gives no legal advice", () => {
  const dataLaw = article("ai-toys-and-indias-data-law");

  it("cites only the Government of India's own texts on meity.gov.in (C20 caveat 5: never a mirror)", () => {
    expect(dataLaw.sources.map((s) => new URL(s.href).host)).toEqual(["www.meity.gov.in", "www.meity.gov.in", "www.meity.gov.in"]);
  });

  it("says plainly that it is not legal advice, and never that Kheelu complies", () => {
    const text = columnStrings(dataLaw).map((s) => toPlainText(s));
    expect(text.some((s) => s.includes("It is not legal advice."))).toBe(true);
    expect(text.filter((s) => /\bcompl(?:y|ies|iant|iance)\b/i.test(s))).toEqual([]);
  });
});
