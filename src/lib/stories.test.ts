import { describe, expect, it } from "vitest";
import {
  STORIES,
  formatStoryDate,
  latestUpdated,
  readingMinutes,
  wordCount,
} from "./stories";

/** §8.35-a/b (2026-09-05). Before this round every article shared ONE hardcoded
 *  `dateModified: "2026-07-01"`, had no publication date, and advertised a typed
 *  4 to 6 minute read on 200 to 430 words. Dates now come from git history and
 *  read time from the words; these guards keep both honest. */
describe("journal dates are real, ordered and machine-readable", () => {
  const ISO = /^\d{4}-\d{2}-\d{2}$/;

  it("gives every article an ISO published and updated date", () => {
    for (const s of STORIES) {
      expect(s.published, `${s.slug} published`).toMatch(ISO);
      expect(s.updated, `${s.slug} updated`).toMatch(ISO);
    }
  });

  it("never updates an article before it was published", () => {
    for (const s of STORIES) {
      expect(s.updated >= s.published, `${s.slug}: updated ${s.updated} < published ${s.published}`).toBe(true);
    }
  });

  it("publishes nothing before the site went live on 2026-07-28", () => {
    /* The journal shipped with the site. An earlier date would be an invented one. */
    for (const s of STORIES) expect(s.published >= "2026-07-28", s.slug).toBe(true);
  });

  it("derives the journal's freshness line from the newest article", () => {
    const newest = [...STORIES.map((s) => s.updated)].sort().at(-1);
    expect(latestUpdated()).toBe(newest);
    expect(latestUpdated([])).toBe("");
  });

  it("formats dates the way the site writes them, whatever the build machine's timezone", () => {
    expect(formatStoryDate("2026-07-28")).toBe("28 July 2026");
    expect(formatStoryDate("2026-09-05")).toBe("5 September 2026");
  });
});

describe("read time is derived from the words, never typed", () => {
  it("counts headings and paragraphs and nothing else", () => {
    expect(wordCount({ paragraphs: [{ h: "Two words", p: "one two three" }, { p: "four" }] })).toBe(6);
  });

  it("counts a link by its label, never its address", () => {
    expect(wordCount({ paragraphs: [{ p: "see [the WHO guideline](https://www.ncbi.nlm.nih.gov/books/NBK541169/) here" }] })).toBe(5);
  });

  it("rounds at 200 words a minute with a one-minute floor", () => {
    const words = (n: number) => ({ paragraphs: [{ p: Array(n).fill("w").join(" ") }] });
    expect(readingMinutes(words(50))).toBe(1);
    expect(readingMinutes(words(299))).toBe(1);
    expect(readingMinutes(words(300))).toBe(2);
    expect(readingMinutes(words(900))).toBe(5);
  });

  it("never advertises more than the words can justify on a real article", () => {
    for (const s of STORIES) {
      const claimed = readingMinutes(s);
      expect(claimed, s.slug).toBeGreaterThanOrEqual(1);
      expect(claimed * 200, `${s.slug} claims ${claimed} min for ${wordCount(s)} words`).toBeLessThanOrEqual(
        wordCount(s) + 100,
      );
    }
  });

  it("has no hand-set minutes left on any article", () => {
    for (const s of STORIES) expect("minutes" in s, s.slug).toBe(false);
  });
});
