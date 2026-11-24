import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOT, listFiles } from "../e2e/support/repo";
import { findBanned } from "./banned-phrases.data";

/* rejected-wording-built (D070 / B7a, 2026-11-24; the founder's narrow scope, claims §4 row "10 languages, including
 * English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French").
 *
 * Khelu's approved language line is "Speaks English, Hindi, Kannada and 7 more Indian languages." (24 Nov: where it
 * follows a question and would read as a fragment, "Khelu speaks English, ..." is approved). The list that named
 * Spanish and French is rejected. banned-phrases.data.ts bans that list as printed (its findBanned also reads every
 * dashboard post, so it cannot ban the bare words); here the broad words are read on the committed built output: the
 * marketing pages that are not articles (home, product, pillar, legal, shipping, contact, setup, safety, team, the
 * stories hub and the 404 page) and llms.txt, as raw HTML so the JSON-LD, the chips and the greetings count too.
 * Articles under /stories/<slug>/ are editorial and out of scope, and so are the one-line summaries of them that the
 * hub and llms.txt print. The headline, the footer and the brain wording are not this guard's business. */

export const REJECTED_LANGUAGE_WORDS: readonly RegExp[] = [
  /Spanish and French/i,
  /Español/,
  /Français/,
  /\bHola\b/,
  /\bBonjour\b/,
  /lang="(?:es|fr)"/,
];

/** The rejected language words a text contains. */
export function rejectedIn(text: string): string[] {
  return REJECTED_LANGUAGE_WORDS.filter((re) => re.test(text)).map((re) => re.source);
}

const isArticle = (path: string) => /^redesign\/stories\/[^/]+\/index\.html$/.test(path);
const BUILT = listFiles(["redesign/index.html", "redesign/404.html", "redesign/llms.txt", "redesign/**/index.html"]).filter(
  (p) => !p.startsWith("redesign/pages/") && !isArticle(p),
);

describe("the guard entry: the language list as the site printed it (B7a)", () => {
  it.each([
    "Khelu speaks 10 languages, including English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French.",
    "10 languages, including English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French",
    "Ten, including English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French. It can switch between them mid-sentence.",
    "It speaks 10 languages, including English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French.",
  ])("is red on “%s”", (line) => {
    expect(findBanned(line).map((h) => h.id)).toContain("languages-list-spanish-french");
  });

  it.each([
    "Speaks English, Hindi, Kannada and 7 more Indian languages.",
    "Speaks English, Hindi, Kannada and 7 more Indian languages. In AI mode, it can switch between them mid-sentence.",
    "Khelu speaks English, Hindi, Kannada and 7 more Indian languages. In AI mode, it can switch between them mid-sentence.",
    "Families who speak Spanish and French at home can still choose the language of bedtime stories.",
    "Eight today: English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French, with up to 10 at launch.",
    "Speaking your home language will not stop your child learning English.",
  ])("passes “%s”", (line) => {
    expect(findBanned(line)).toEqual([]);
  });
});

describe("the built pages and llms.txt print no Spanish or French language list, chip or greeting", () => {
  it("is red on the list, the chips and the greetings as the site printed them", () => {
    expect(rejectedIn("Khelu speaks 10 languages, including English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French.")).toEqual([
      "Spanish and French",
    ]);
    expect(rejectedIn('<li><b lang="es">Español</b><span>Spanish</span></li>')).toEqual(["Español", 'lang="(?:es|fr)"']);
    expect(rejectedIn('<li><button type="button" data-lg="7"><span lang="fr">Bonjour</span><small>French</small></button></li>')).toEqual([
      "\\bBonjour\\b",
      'lang="(?:es|fr)"',
    ]);
  });

  it("is green on the approved line", () => {
    expect(rejectedIn("Speaks English, Hindi, Kannada and 7 more Indian languages.")).toEqual([]);
    expect(rejectedIn("Khelu speaks English, Hindi, Kannada and 7 more Indian languages.")).toEqual([]);
  });

  it("reads the home page, the product page, the pillar page, the 404 page and llms.txt", () => {
    for (const path of ["redesign/index.html", "redesign/products/kheelu/index.html", "redesign/ai-toys-for-kids-in-india/index.html", "redesign/404.html", "redesign/llms.txt"]) {
      expect(BUILT, path).toContain(path);
    }
    expect(BUILT.some(isArticle)).toBe(false);
  });

  it.each(BUILT)("%s", (path) => {
    expect(rejectedIn(readFileSync(join(ROOT, path), "utf8")), path).toEqual([]);
  });
});
