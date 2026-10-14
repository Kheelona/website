import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Article } from "@/content/types";
import { ArticleTemplate } from "@/layouts/ArticleTemplate/ArticleTemplate";
import { toPlainText } from "@/lib/content/plain-text";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { buildOffer } from "@/lib/offer/offer";
import { ARTICLE_CLAIM_FIXES, RETENTION, TEXT_DEVIATIONS, VISUAL_HIDDEN } from "../../../../../test/e2e/support/deviations";
import type { PageFacts } from "../../../../../test/e2e/support/page-facts";
import { sentences } from "../../../../../test/e2e/support/parity";
import { approvedArticle } from "../../../../../test/fixtures/journal/approved";
import { mockupFold, skeleton, words } from "../../../../../test/support/mockup-compare";
import { factSentences, hiddenProblems, ruleReach, withFacts } from "../../../../../test/support/mockup-facts";
import { RETENTION_LINE } from "../../policies";
import { seller } from "../../seller";

/* The three rewritten articles (task 5.6): each carries its approved body, answer and sources, ported from its mockup
 * (mockup/pages/story-<slug>.html) and copy page (wiki/site/pages/story-<slug>.md), so the article template renders the
 * approved reading column from content alone. Since task 8b.2e each is a dashboard post (ADR-014), read here from the
 * approved export the founder signs at Gate B (test/fixtures/journal/approved, through the adapter), the template's
 * proof whatever a writer publishes later; journal.test.ts holds the snapshot equal to it while the journal is the
 * export, and holds every guide's markers and shared facts (rows 7 and 24). The head, the related guides and the close
 * are the template's (ArticleTemplate.test.tsx) and the journal's invariants are articles.test.ts's; this file holds the
 * reading column and the page-specific rules of tasks.md 5.6: one in-text product link (none on the late-talker page,
 * B5), the D025 line on the late-talker page, sources with markers, and the merged 2-year-old topic as an H2 of the
 * 3-year-old article (D041). */

const learningToys = approvedArticle("learning-toys-for-a-three-year-old");
const lateTalkers = approvedArticle("talking-toys-and-late-talkers");
const safeAiToy = approvedArticle("what-to-look-for-in-a-safe-ai-toy");

const APPROVED = [
  ["learning-toys-for-a-three-year-old", learningToys],
  ["what-to-look-for-in-a-safe-ai-toy", safeAiToy],
  ["talking-toys-and-late-talkers", lateTalkers],
] as const;

const TOKEN = buildOffer("token");

/** The rendered reading column: the answer, the parts and their photos, the sources. */
function column(article: Article): Element {
  const { container } = render(<ArticleTemplate article={article} offer={TOKEN} />);
  const body = container.querySelector(".ks-story-body");
  if (body === null) throw new Error(`${article.slug}: the template rendered no reading column`);
  return body;
}

/** An approved article's accepted changes since Gate A (deviations.ts ARTICLE_CLAIM_FIXES), if it has any. */
const claimFixes = (slug: string): PageFacts | undefined => (ARTICLE_CLAIM_FIXES as Readonly<Record<string, PageFacts>>)[`story-${slug}`];

/** The mockup's reading column, its in-text links read as the copy page's real URLs: the safe-AI-toy guide links the
 *  data-law guide itself (copy page fold 4, "Links"), where the mockup links the hub's topic while that guide waits
 *  for its rewrite (as the related rows do, ArticleTemplate.test.tsx). The frozen mockup (D046) keeps its Gate A words,
 *  so an article's accepted changes since (the safe-AI-toy guide's D058 claim fixes, task 8b.2a) are applied to it. */
function approvedColumn(slug: string): Element {
  const fold = mockupFold(`story-${slug}`, ".mk-story-body").cloneNode(true) as Element;
  fold.querySelectorAll('.mk-part a[href="stories.html#ai-and-safety"]').forEach((a) => a.setAttribute("href", "/stories/ai-toys-and-indias-data-law"));
  for (const span of RULED_NOWRAP[slug] ?? []) wrapNowrap(fold, span);
  return withFacts(fold, claimFixes(slug)?.edits ?? []);
}

/* The no-wrap spans the journal's adapter adds where an approved guide left an age bare (journal-pipeline §5.2: every
   "N-year-old" compound stays on one line), ruled at the wave ii merge (§12, 8b.2d ruling 2: presentation only, no word
   changes; on the Gate B list). Each is put into the frozen mockup's column, so the markup check accepts exactly that
   span, and no other. */
const RULED_NOWRAP: Readonly<Record<string, readonly { readonly selector: string; readonly phrase: string }[]>> = {
  "talking-toys-and-late-talkers": [{ selector: ".mk-part:first-of-type > p:first-of-type", phrase: "3-year-old" }],
};

function wrapNowrap(fold: Element, { selector, phrase }: { selector: string; phrase: string }): void {
  const host = fold.querySelector(selector);
  const text = host && [...host.childNodes].find((n) => n.nodeType === 3 && (n.textContent ?? "").includes(phrase));
  if (!host || !text) throw new Error(`the ruled no-wrap span "${phrase}" has no bare text at ${selector}`);
  const at = text.textContent!.indexOf(phrase);
  const span = host.ownerDocument.createElement("span");
  span.className = "mk-nowrap";
  span.textContent = phrase;
  const rest = (text as Text).splitText(at);
  rest.textContent = rest.textContent!.slice(phrase.length);
  host.insertBefore(span, rest);
}

/* The build's documented differences in the column: the type steps it adds (mapping rows 71-72) and the article
   marker variant (stories.css:72 as SourceMarker's `ks-src--article`); ArticleBody.test.tsx states the same. */
const OPTIONS = { drop: /^(?:ks-type-.*|ks-src--article)$/ };

/** Every content string of the reading column: the answer, its detail, the parts and the photos' captions. */
function columnStrings(article: Article): string[] {
  const strings = (v: unknown): string[] =>
    typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === "object" ? Object.values(v).flatMap(strings) : [];
  const answer = article.answer ? [article.answer.question, article.answer.answer, article.answer.detail ?? []] : [];
  return strings([answer, article.body.map((block) => (block.kind === "figure" ? block.caption ?? "" : block))]);
}

function nodes(article: Article): RichNode[] {
  const all = (list: readonly RichNode[]): RichNode[] => list.flatMap((n) => [n, ...("children" in n ? all(n.children) : [])]);
  return columnStrings(article).flatMap((s) => {
    try {
      return all(parseRichText(s));
    } catch {
      return []; // an icon name or a variant, not text
    }
  });
}

const linksTo = (article: Article, href: string) => nodes(article).filter((n) => n.kind === "link" && n.href === href).length;

describe.each(APPROVED)("the rewritten article %s", (slug, article) => {
  it("renders the approved reading column: answer, parts, photos and sources, in the mockup's markup", () => {
    expect(skeleton(column(article), OPTIONS)).toBe(skeleton(approvedColumn(slug), OPTIONS));
  });

  it("renders the approved words, markers included", () => {
    expect(words(column(article))).toBe(words(approvedColumn(slug)));
  });

  it("cites every note it lists, and every marker names a note (D026)", () => {
    const cited = new Set(nodes(article).flatMap((n) => (n.kind === "source" ? [n.n] : [])));
    expect(article.sources.length).toBeGreaterThan(0);
    expect([...cited].sort((a, b) => a - b)).toEqual(article.sources.map((_, i) => i + 1));
  });

  it("stores the rewrite's date as its last edit, after the live article's (architecture §6.1)", () => {
    const live = { "learning-toys-for-a-three-year-old": "2026-09-11", "what-to-look-for-in-a-safe-ai-toy": "2026-09-05", "talking-toys-and-late-talkers": "2026-09-05" };
    expect(article.updated > live[slug]).toBe(true);
  });
});

describe("the page-specific rules (tasks.md 5.6)", () => {
  it("links the product page once in the text of the learning-toys and safe-AI-toy guides (strategy §3.3)", () => {
    expect(linksTo(learningToys, "/products/kheelu")).toBe(1);
    expect(linksTo(safeAiToy, "/products/kheelu")).toBe(1);
  });

  it("never pitches on the late-talker page: no product link, Kheelu named only in the D025 line (B5)", () => {
    expect(nodes(lateTalkers).filter((n) => n.kind === "link")).toEqual([]);
    const named = columnStrings(lateTalkers).filter((s) => /Kheelu/.test(s));
    expect(named).toEqual(["Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician."]);
  });

  it("puts D025's line, verbatim, directly under the late-talker answer", () => {
    expect(lateTalkers.answer?.detail).toEqual([
      { kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician." },
    ]);
    const card = column(lateTalkers).querySelector(".ks-answer")!;
    expect(card.lastElementChild?.className).toBe("kh-body-s ks-disclaimer");
  });

  it("holds the merged 2-year-old topic as an H2 of the 3-year-old article, at #brain-development (D041)", () => {
    const part = learningToys.body.find((block) => block.kind === "part" && block.id === "brain-development");
    expect(part?.kind === "part" && toPlainText(part.title ?? "")).toBe("Brain development toys for a 3-year-old: what the label means");
    const section = column(learningToys).querySelector("section#brain-development")!;
    expect(section.querySelector(":scope > h2")?.textContent).toBe("Brain development toys for a 3-year-old: what the label means");
  });

  it("words the safe-AI-toy guide's contact line from the seller's help line, never a retyped number (seller.ts, D032)", () => {
    const contact = columnStrings(safeAiToy).filter((s) => s.includes(seller.support.phone));
    expect(contact).toHaveLength(1);
    expect(contact[0].endsWith(`you can ask us anything: ${seller.help.contact}.`)).toBe(true);
  });

  /* Until 8b.2e it also held the module's source free of a typed "36 months". A post prints the line as literal text;
     journal.test.ts holds every guide's to policies.ts's (§8.2 row 24, which replaced this rule, §8.3). */
  it("prints the safe-AI-toy guide's retention line as policies.ts words it (D020, architecture §6.1)", () => {
    const retention = columnStrings(safeAiToy).filter((s) => s.includes(RETENTION_LINE));
    /* Then the live team's deletion fact (D058 item 1; the copy page's fold 5, task 8b.2a). */
    expect(retention).toEqual([`You can read every conversation in the parent app. ${RETENTION_LINE} Delete them all sooner by deleting your account.`]);
  });
});

/* The safe-AI-toy guide's claim fixes (D058, the founder's ruling of 2026-10-14; task 8b.2a): the frozen mockup keeps
 * the Gate A words, and the build follows the live team's code check of 12 October. One text rule and its visual hides
 * (deviations.ts ARTICLE_CLAIM_FIXES), in page-facts.ts's form: the edits turn the approved page into the build (the
 * reading-column tests above apply them), and the rule reaches exactly the sentences they change. The retention line is
 * policies.ts's (task 8b.1 owns its words), so the sentences it changes are read from it. Task 8b.1b adds fold 4's
 * deletion bar: the third question's answer asks how you delete, a bar Kheelu meets, where "delete any of it yourself"
 * set one D058 withdrew. */
describe("the safe-AI-toy guide's claim fixes (D058; tasks 8b.2a and 8b.1b)", () => {
  const SLUG = "story-what-to-look-for-in-a-safe-ai-toy";
  const FIXES = ARTICLE_CLAIM_FIXES[SLUG];
  const main = () => mockupFold(SLUG, "main");
  const only = (lines: string[], not: string[]) => lines.filter((line) => !not.includes(line));

  it("withdraw the approved lines D058 withdrew, and print the code-checked ones in their place (the copy page's folds 4 and 5)", () => {
    expect(FIXES.mockup).toEqual([
      "Ask whether you can read every conversation, word for word, and delete any of it yourself, without emailing anyone.",
      "It switches itself off after about a minute of quiet.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India.",
      ...only(sentences(RETENTION.mockup), sentences(RETENTION_LINE)),
      "No open internet.",
      "Kheelu can’t browse the internet.",
      "Its answers come from a curated, closed content library, and every reply passes an age-graded safety layer set to the age you enter in the parent app.",
      "Tested by us first.",
      "We attack our own safety layer before every release.",
    ]);
    expect(FIXES.build).toEqual([
      "Ask whether you can read every conversation, word for word, and how you delete it, without emailing anyone.",
      "It switches itself off after a couple of minutes of quiet.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers.",
      ...only(sentences(RETENTION_LINE), sentences(RETENTION.mockup)),
      "Delete them all sooner by deleting your account.",
      "No web browsing.",
      "Kheelu can’t browse or search the internet.",
      "Its answers are generated by an AI model.",
      "On every conversation, the model is given child-safety rules and the age you enter in the parent app, with Google’s safety filters on top.",
    ]);
  });

  it("list exactly the sentences their edits change in the approved page", () => {
    expect(factSentences(main(), FIXES.edits)).toEqual({ missing: [...FIXES.mockup], extra: [...FIXES.build] });
  });

  it("are the page's one text rule, and it excuses and accepts exactly those sentences, no other line of the page", () => {
    expect(TEXT_DEVIATIONS[SLUG]?.map((rule) => rule.approvedBy)).toEqual([FIXES.approvedBy]);
    expect(ruleReach(main(), FIXES.edits, TEXT_DEVIATIONS[SLUG]![0])).toEqual({ excused: [...FIXES.mockup], accepted: [...FIXES.build] });
  });

  it("hide for the pixels fold 4's reworded answer and the four reworded facts on both sides, and on the mockup's side the fact that came off", () => {
    expect(hiddenProblems(main(), FIXES)).toEqual([]);
    const answer = ".mk-questions > p:nth-of-type(3), .ks-questions > p:nth-of-type(3)";
    const body = (n: number) => `.kh-trust > .kh-trust__item:nth-child(${n}) > .kh-trust__body`;
    expect(VISUAL_HIDDEN[SLUG]?.map((rule) => [rule.side, rule.selector, rule.approvedBy])).toEqual([
      ...(["mockup", "build"] as const).flatMap((side) => [answer, ...[1, 2, 3, 5].map(body)].map((selector) => [side, selector, FIXES.approvedBy])),
      ["mockup", ".kh-trust > .kh-trust__item:nth-child(8)", FIXES.approvedBy],
    ]);
  });
});
