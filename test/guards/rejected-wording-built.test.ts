import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOT, listFiles } from "../e2e/support/repo";

/* rejected-wording-built (D070 / B7a, 2026-11-24; claims §4 rows "An AI toy that supports brain development." to
 * "It speaks your home language.").
 *
 * The rejected home, footer and language lines are also checked on the committed built output, in the broad words that
 * banned-phrases.data.ts cannot use: that file's findBanned reads every dashboard post too (the journal sync stops the
 * production build on a hit). Here the scope is the built marketing pages that are not articles (home, product, pillar, legal, shipping, contact, setup,
 * safety, team, the stories hub and the 404 page) and llms.txt, read as raw HTML so the JSON-LD and the chips count too.
 * Articles under /stories/<slug>/ are editorial and out of scope, and so are the one-line summaries of them that the hub
 * and llms.txt print (a parent's advice such as "every language you speak" or "your home language" is not the claim). */

export const REJECTED_WORDS: readonly string[] = [
  "develop brains",
  "brain development.",
  "brains grow",
  "built on the same idea",
  "hundreds of questions",
  "questions a day",
  "Spanish and French",
  "Español",
  "Français",
  "speaks your home language",
  "speaks in every language",
  "speeks",
];

/** The rejected words a text contains, any case. */
export function rejectedIn(text: string): string[] {
  const lower = text.toLowerCase();
  return REJECTED_WORDS.filter((w) => lower.includes(w.toLowerCase()));
}

const isArticle = (path: string) => /^redesign\/stories\/[^/]+\/index\.html$/.test(path);
const BUILT = listFiles(["redesign/index.html", "redesign/404.html", "redesign/llms.txt", "redesign/**/index.html"]).filter(
  (p) => !p.startsWith("redesign/pages/") && !isArticle(p),
);

describe("the built pages and llms.txt print none of the rejected home, footer and language wording", () => {
  it("is red on the rejected lines as the site printed them", () => {
    expect(rejectedIn('<h1>An AI toy that supports <span class="mark">brain development.</span></h1>')).toEqual(["brain development."]);
    expect(rejectedIn('<p class="footer__line">We make AI toys that <span>develop brains.</span></p>')).toEqual(["develop brains"]);
    expect(rejectedIn("Khelu speaks 10 languages, including English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French.")).toEqual(["Spanish and French"]);
    expect(rejectedIn('<li><b lang="es">Español</b><span>Spanish</span></li>')).toEqual(["Español"]);
    expect(rejectedIn("Children ask hundreds of questions a day.")).toEqual(["hundreds of questions", "questions a day"]);
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
