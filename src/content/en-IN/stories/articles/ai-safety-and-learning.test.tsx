import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Article } from "@/content/types";
import { ArticleTemplate } from "@/layouts/ArticleTemplate/ArticleTemplate";
import { articleTrail } from "@/layouts/ArticleTemplate/article-page";
import { toPlainText } from "@/lib/content/plain-text";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { formatDate } from "@/lib/format/date";
import { buildOffer } from "@/lib/offer/offer";
import { RETENTION } from "../../../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../../../test/e2e/support/repo";
import { GUIDE_CONTACT_LINE } from "../../../../../test/e2e/support/seller-facts";
import { approvedArticle } from "../../../../../test/fixtures/journal/approved";
import { type CopyFold, type CopyPage, copyFold, copyLines, copyParagraphs, glanceRow, readCopyPage } from "../../../../../test/support/copy-page";
import { words } from "../../../../../test/support/mockup-compare";
import { RETENTION_LINE } from "../../policies";
import { product } from "../../products/kheelu/product";
import { seller } from "../../seller";

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
/** The guides task 8b.2a corrected per D058 carry the export's date (ruled at the wave i merge, journal-pipeline §12
 *  8b.2e: their dateModified, OG modifiedTime and sitemap date). */
const CORRECTED: Readonly<Partial<Record<Slug, string>>> = {
  "questions-parents-ask-about-ai-toys": "2026-10-14",
  "should-kids-use-ai": "2026-10-14",
  "ai-toys-and-indias-data-law": "2026-10-14",
};
/** The read times the journal derives where its guide stored another (words at 200 a minute; journal-pipeline §4),
 *  ruled at the wave ii merge (§12, 8b.2d ruling 2; on the Gate B list): the copy page keeps the approved line. */
const RULED_READ_TIMES: Readonly<Partial<Record<Parity, readonly [approved: number, derived: number]>>> = {
  "should-kids-use-ai": [5, 4],
};

const TOKEN = buildOffer("token");
/* Since task 8b.2e the guides are dashboard posts (ADR-014): each is read from the approved export the founder signs at
   Gate B (test/fixtures/journal/approved, through the adapter), which journal.test.ts holds equal to the snapshot while
   the journal is the export. The facts a guide shares with other pages (retention, help line, languages) were read from
   their modules; in a post they are literal text, held to today's by journal.test.ts (§8.2 row 24). */
const article = (slug: string): Article => approvedArticle(slug);

/* ── Reading a copy page (test/support/copy-page.ts, the one reader; task 6.3) ───────────────────────────────── */

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
function columnFolds(page: CopyPage): CopyFold[] {
  return page.folds.filter((f) => !/^(Article head|Related guides|Close)/.test(f.title));
}

const columnBlocks = (page: CopyPage) => columnFolds(page).flatMap((f) => copyParagraphs(f).flatMap(blocks));

/** The in-text links of the copy's column, as the site's own paths. */
function copyLinks(page: CopyPage): { label: string; href: string }[] {
  const lines = columnFolds(page).flatMap(copyLines);
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
/** The in-text links a copy page lists as the site's paths; the seller's contact links (WhatsApp, the email that took
 *  the call's place by D063 item 2, a call) are the seller's, held by the row-24 rules. */
function renderedLinks(column: Element): { label: string; href: string }[] {
  return Array.from(column.querySelectorAll("a"))
    .filter((a) => !a.matches(".ks-src, .ks-sources a") && !/^(?:https:\/\/wa\.me|tel:|mailto:)/.test(a.getAttribute("href") ?? ""))
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

/** A rule of the content-integrity spec (test/e2e/content-integrity.spec.ts, SPA 7), read from the spec itself so the
 *  two never drift apart; the spec runs only in the browser suite, this catches its finds at the unit level. */
function integrityRule(name: string): RegExp {
  const m = new RegExp(`^const ${name} = /(.+)/([a-z]*);$`, "m").exec(readRepoFile("test/e2e/content-integrity.spec.ts"));
  if (!m) throw new Error(`content-integrity.spec.ts has no "${name}" rule`);
  return new RegExp(m[1], m[2]);
}

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
  const page = readCopyPage(slug);

  it("carries the copy page's title and description", () => {
    expect(norm(toPlainText(article(slug).meta.title))).toBe(norm(glanceRow(page, "Title")));
    expect(norm(toPlainText(article(slug).meta.description))).toBe(norm(glanceRow(page, "Meta description")));
  });

  it("heads the page with the copy's H1, accent, lead, crumbs and byline", () => {
    const a = article(slug);
    const head = copyFold(page, /^Article head/);
    const line = (label: string) => copyLines(head).find((l) => l.startsWith(`**${label}:**`))?.replace(`**${label}:** `, "") ?? "";
    const [lead, byline] = copyLines(head).filter((l) => !l.startsWith("**"));
    expect(norm(toPlainText(a.head.title))).toBe(norm(line("H1")));
    expect(norm(toPlainText(a.head.lead ?? ""))).toBe(norm(lead));
    const hand = /`Hand` on "([^"]+)"/.exec(head.text)?.[1];
    const hands = nodesOf(a.head.title).filter((n) => n.kind === "hand");
    expect(hands.map((n) => ("children" in n ? n.children.map((c) => (c.kind === "text" ? c.text : "")).join("") : ""))).toEqual([hand]);
    expect(articleTrail(a).map((c) => c.name)).toEqual(line("Breadcrumb").split(" › "));
    const ruled = RULED_READ_TIMES[slug];
    if (ruled !== undefined) expect(norm(byline), `${slug}: the copy page's approved read time`).toMatch(new RegExp(` · ${ruled[0]} min read$`));
    const shown = ruled === undefined ? norm(byline) : norm(byline).replace(new RegExp(` · ${ruled[0]} min read$`), ` · ${ruled[1]} min read`);
    expect(norm(`${a.head.author} · First published ${formatDate(a.published, "ui")} · ${a.head.readMinutes} min read`)).toBe(shown);
  });

  it("shows the copy page's head photo, with its alt", () => {
    const note = copyFold(page, /^Article head/).text.replace(/\s+/g, " ");
    const m = /`([a-z0-9-]+-web\.webp)`\. Alt: "([^"]+)"/.exec(note);
    expect(m, "the copy page names the head photo and its alt").not.toBeNull();
    const image = article(slug).head.image!;
    const src = image.src as unknown;
    expect(decodeURIComponent(typeof src === "string" ? src : (src as { src: string }).src)).toMatch(new RegExp(`/Photo library/${m![1]}$`));
    expect(norm(image.alt)).toBe(norm(m![2]));
  });

  /* Task 8b.1 (D058 items 1 and 9; deviations.md V35): the retention line the guides print from policies.ts lost its
     one-tap sentence. A copy page that still prints the Gate A line (until task 8b.2a's corrected copy pages are in) is
     read with that one sentence gone, and nothing else; a corrected copy page is read as it stands. Either way no guide
     prints the withdrawn sentence. */
  /* D063 item 2 (task Q2.3): the copy page's "WhatsApp or call +91 91875 46483." reads "WhatsApp or email
     hello@kheelona.com." (seller-facts.ts GUIDE_CONTACT_LINE). */
  it("renders the copy page's reading column word for word: answer, body, sources (the retention line as policies.ts prints it)", () => {
    const copy = norm(columnBlocks(page).map((b) => plainCopy(b.text)).join(" "));
    const column = norm(words(rendered(slug).column));
    const calls = ["ai-toys-and-indias-data-law", "what-to-look-for-in-a-safe-ai-toy"].includes(slug);
    expect(copy.includes(norm(GUIDE_CONTACT_LINE.mockup)), "the copy page's contact line, as approved, on the two guides that give it").toBe(calls);
    expect(column).toBe(copy.replaceAll(norm(RETENTION.mockup), norm(RETENTION.build)).replaceAll(norm(GUIDE_CONTACT_LINE.mockup), norm(GUIDE_CONTACT_LINE.build)));
    expect(column).not.toContain("You can delete any of them sooner, in one tap.");
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
  /* Until 8b.2e it also read its module's source for the stub import; no guide is a module any more. */
  it("is a full article now, built without the stub", () => {
    expect(article(slug).answer).toBeDefined();
    expect(article(slug).sources.length).toBeGreaterThan(0);
  });

  it("heads the page with the hub card's title and summary, word for word (stories.md folds 4-5)", () => {
    const head = copyLines(copyFold(readCopyPage(slug), /^Article head/));
    const [lead] = head.filter((l) => !l.startsWith("**"));
    const h1 = head.find((l) => l.startsWith("**H1:**"))!.replace("**H1:** ", "");
    expect(norm(toPlainText(article(slug).card.title))).toBe(norm(h1));
    expect(norm(toPlainText(article(slug).card.summary))).toBe(norm(lead));
  });

  it("links the product page once in its text (strategy §3.3)", () => {
    expect(renderedLinks(rendered(slug).column).filter((l) => l.href === "/products/kheelu")).toHaveLength(1);
  });

  it("offers the copy page's related guides, in its order (the stub's, or CMO B m3's ring, task 7.1d)", () => {
    const related = copyFold(readCopyPage(slug), /^Related guides/);
    expect(article(slug).related).toEqual([...related.text.matchAll(/^\| [^|]+ \| `\/stories\/([a-z0-9-]+)`/gm)].map((m) => m[1]));
    const titles = copyLines(related).filter((l) => l.startsWith("- ")).map((l) => norm(l.slice(2)));
    expect(article(slug).related.map((r) => norm(toPlainText(article(r).card.title)))).toEqual(titles);
  });

  it("closes with the journal close (the pre-order button, finale)", () => {
    expect(article(slug).close).toBe("journal");
  });

  it("stores the rewrite's date as its last edit, after the live article's (architecture §6.1); the D058 corrections the export's", () => {
    expect(article(slug).updated).toBe(CORRECTED[slug] ?? REWRITE_DATE);
    expect(article(slug).updated > LIVE_UPDATED[slug]).toBe(true);
  });

  it("never implies a child under three nor uses an analytics word, by content-integrity's own rules (SPA 7)", () => {
    const a = article(slug);
    const text = `${toPlainText(a.meta.title)}\n${toPlainText(a.meta.description)}\n${words(rendered(slug).container)}`;
    for (const rule of ["UNDER_THREE", "ANALYTICS"]) expect(integrityRule(rule).exec(text)?.[0], rule).toBeUndefined();
  });

  it("never puts a brain line in the same answer or part as Kheelu (D016)", () => {
    const mixed = units(article(slug)).filter((u) => u.some((s) => /\bKheelu\b/.test(s)) && u.some((s) => /\bbrain/i.test(s)));
    expect(mixed).toEqual([]);
  });
});

/* Until 8b.2e each guide read these facts from their modules, and each test also held its module's source free of the
   typed fact (36 months, the phone number, a language list). A post carries them as literal text (journal-pipeline §5.3),
   so the "never retyped" half became "always today's": journal.test.ts holds every guide of the journal to policies.ts,
   seller.ts and product.ts (§8.2 row 24). These keep each approved guide printing the fact where its copy page does. */
describe("the shared facts, as today's modules word them", () => {
  /* Then D058 item 1's deletion fact, in the one form the safe-AI-toy guide prints too (CMO review of task 8b.2a, m2), so
     each guide that tells a parent how long conversations stay also says how to delete them sooner. */
  it("prints the D020 retention line from policies.ts where a page gives it, then the deletion sentence (hard questions, should kids, data law)", () => {
    for (const slug of ["questions-parents-ask-about-ai-toys", "should-kids-use-ai", "ai-toys-and-indias-data-law"] as const) {
      expect(columnStrings(article(slug)).some((s) => s.includes(`${RETENTION_LINE} Delete them all sooner by deleting your account.`)), slug).toBe(true);
    }
  });

  /* WhatsApp or the email, never the number (D063 item 2; task Q2.3). */
  it("words the data-law page's contact line from the seller's WhatsApp-or-email phrase (seller.ts), with no number", () => {
    const strings = columnStrings(article("ai-toys-and-indias-data-law"));
    const contact = strings.filter((s) => s.includes(seller.support.whatsapp));
    expect(contact).toHaveLength(1);
    expect(contact[0].endsWith(`tell us: ${seller.support.reach}.`)).toBe(true);
    expect(strings.filter((s) => s.includes(seller.support.phone) || s.includes("tel:"))).toEqual([]);
  });

  it("names the languages from the product facts (product.ts)", () => {
    const names = product.languages.map((l) => l.name);
    const line = `It speaks ${names.slice(0, -1).join(", ")} and ${names.at(-1)}, with up to ${product.languageCeiling} languages at launch.`;
    expect(columnStrings(article("questions-parents-ask-about-ai-toys")).some((s) => s.endsWith(line))).toBe(true);
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
