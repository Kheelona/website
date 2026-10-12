import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Article } from "@/content/types";
import { ArticleTemplate } from "@/layouts/ArticleTemplate/ArticleTemplate";
import { toPlainText } from "@/lib/content/plain-text";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { buildOffer } from "@/lib/offer/offer";
import { mockupFold, skeleton, words } from "../../../../../test/support/mockup-compare";
import { seller } from "../../seller";
import { article as learningToys } from "./learning-toys-for-a-three-year-old";
import { article as lateTalkers } from "./talking-toys-and-late-talkers";
import { article as safeAiToy } from "./what-to-look-for-in-a-safe-ai-toy";

/* The three rewritten articles (task 5.6): each module carries its approved body, answer and sources, ported from its
 * mockup (mockup/pages/story-<slug>.html) and copy page (wiki/site/pages/story-<slug>.md), so the article template
 * renders the approved reading column from content alone. The head, the related guides and the close are the
 * template's (ArticleTemplate.test.tsx) and the folder's invariants are articles.test.ts's; this file holds the
 * reading column and the page-specific rules of tasks.md 5.6: one in-text product link (none on the late-talker
 * page, B5), the D025 line on the late-talker page, sources with markers, and the merged 2-year-old topic as an H2
 * of the 3-year-old article (D041). */

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

/** The mockup's reading column, its in-text links read as the copy page's real URLs: the safe-AI-toy guide links the
 *  data-law guide itself (copy page fold 4, "Links"), where the mockup links the hub's topic while that guide waits
 *  for its rewrite (as the related rows do, ArticleTemplate.test.tsx). */
function approvedColumn(slug: string): Element {
  const fold = mockupFold(`story-${slug}`, ".mk-story-body").cloneNode(true) as Element;
  fold.querySelectorAll('.mk-part a[href="stories.html#ai-and-safety"]').forEach((a) => a.setAttribute("href", "/stories/ai-toys-and-indias-data-law"));
  return fold;
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
});
