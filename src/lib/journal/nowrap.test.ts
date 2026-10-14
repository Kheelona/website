import { describe, expect, it } from "vitest";
import { parseRichText } from "@/lib/content/rich-text";
import { nowrapAges } from "./nowrap";

/* The no-wrap spans a post never stores (journal-pipeline §5.2, "(derived)"): every "N-year-old" compound, with its
 * trailing comma or ’s, as the approved heads and bodies wrap them, so "3-year-old" never breaks at its hyphens. */

describe("nowrapAges", () => {
  it("wraps an age compound written in figures or in words", () => {
    expect(nowrapAges("Learning toys for a 3-year-old at home")).toBe("Learning toys for a {nowrap:3-year-old} at home");
    expect(nowrapAges("Does a three-year-old need an AI tutor?")).toBe("Does a {nowrap:three-year-old} need an AI tutor?");
    expect(nowrapAges("Three-year-olds talk")).toBe("{nowrap:Three-year-olds} talk");
  });

  it("keeps a trailing comma or ’s inside the span, never a full stop or a question mark", () => {
    expect(nowrapAges("for a 3-year-old, skill by skill")).toBe("for a {nowrap:3-year-old,} skill by skill");
    expect(nowrapAges("a 3-year-old’s vocabulary")).toBe("a {nowrap:3-year-old’s} vocabulary");
    expect(nowrapAges("a 3-year-old's vocabulary")).toBe("a {nowrap:3-year-old's} vocabulary");
    expect(nowrapAges("for a 4-year-old?")).toBe("for a {nowrap:4-year-old}?");
    expect(nowrapAges("for a 7-year-old.")).toBe("for a {nowrap:7-year-old}.");
  });

  it("wraps every compound in the text, plurals too", () => {
    expect(nowrapAges("A 5-year-old and two 6-year-olds")).toBe("A {nowrap:5-year-old} and two {nowrap:6-year-olds}");
  });

  it("leaves a compound that is part of a longer word alone (a slug, a range)", () => {
    expect(nowrapAges("how-much-screen-time-for-a-3-to-6-year-old")).toBe("how-much-screen-time-for-a-3-to-6-year-old");
    expect(nowrapAges("a 3-year-older")).toBe("a 3-year-older");
    expect(nowrapAges("a 3 year old")).toBe("a 3 year old");
  });

  it("is idempotent: an existing span is left as it is", () => {
    const once = nowrapAges("for a 3-year-old, and a 4-year-old");
    expect(nowrapAges(once)).toBe(once);
    expect(nowrapAges("for a {nowrap:3-year-old}")).toBe("for a {nowrap:3-year-old}");
  });

  it("leaves the site's tokens untouched, and its output parses", () => {
    const out = nowrapAges("For a 3-year-old, it costs {price:headline}.[^1] Delivery: {delivery}");
    expect(out).toBe("For a {nowrap:3-year-old,} it costs {price:headline}.[^1] Delivery: {delivery}");
    expect(() => parseRichText(out)).not.toThrow();
  });

  it("returns text without an age compound unchanged", () => {
    expect(nowrapAges("")).toBe("");
    expect(nowrapAges("Screen time and tantrums")).toBe("Screen time and tantrums");
  });
});
