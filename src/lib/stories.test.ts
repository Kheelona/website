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

/** The voice laws, applied to the journal's DATA (SEO round C3, 2026-09-05).
 *  `qa:sweep` lints one rendered article as a stand-in for nineteen; this
 *  reads every title, description, heading and paragraph so an expansion
 *  cannot ship an em-dash, a contraction or an exclamation mark. Link syntax
 *  is stripped first so a URL cannot trip the rules. */
describe("every article keeps the brand voice", () => {
  const CONTRACTIONS =
    /\b(don't|doesn't|can't|won't|isn't|aren't|wasn't|weren't|it's|that's|there's|here's|what's|we're|you're|they're|I'm|I'll|we'll|you'll|we've|you've|I've|didn't|couldn't|shouldn't|wouldn't|hasn't|haven't|let's)\b/i;
  const prose = (t: string) => t.replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");
  const texts = STORIES.flatMap((s) => [
    { where: `${s.slug} title`, text: s.title },
    { where: `${s.slug} description`, text: s.description },
    ...s.paragraphs.flatMap((b, i) => [
      ...(b.h ? [{ where: `${s.slug} h#${i}`, text: b.h }] : []),
      { where: `${s.slug} p#${i}`, text: prose(b.p) },
    ]),
    ...(s.sources ?? []).map((src) => ({ where: `${s.slug} source`, text: src.label })),
  ]);

  it("uses no em-dash anywhere (en-dash only inside number ranges)", () => {
    for (const { where, text } of texts) expect(text, where).not.toMatch(/—/);
  });

  it("uses no exclamation mark", () => {
    for (const { where, text } of texts) expect(text, where).not.toMatch(/!/);
  });

  it("uses no contractions in body copy", () => {
    for (const { where, text } of texts) expect(text, where).not.toMatch(CONTRACTIONS);
  });

  it("does not leave a raw link address in the prose", () => {
    for (const { where, text } of texts) expect(text, where).not.toMatch(/\]\(|https?:\/\//);
  });
});
