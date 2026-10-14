import { describe, expect, it } from "vitest";
import { fillRelated, readingOrder, ringOffers } from "./ring";

/* The related-guide ring (journal-pipeline §4 `related`, §8.2 row 19): what fills a post's related list when the post
 * names fewer than three published guides. Main's ring (main:src/lib/stories.ts:176-222): over the theme-sorted
 * journal, each guide offers the one before it and the two after it, wrapping. Its three properties
 * (main:src/lib/stories.ts:189-207) are proven here on fixture journals: even coverage, theme relevance without theme
 * prisons, one connected cycle. */

const THEMES = ["Screen time", "Talking and language", "AI toys and safety", "Learning and play"];

/** A fixture journal: `n` posts whose themes follow a fixed, uneven pattern, in an order that is not theme-sorted. */
function journal(n: number) {
  const pattern = [0, 1, 1, 2, 0, 3, 1, 0, 2, 1, 1, 3, 0];
  return Array.from({ length: n }, (_, i) => ({ slug: `guide-${String(i + 1).padStart(2, "0")}`, theme: THEMES[pattern[i % pattern.length]] }));
}

/** The eleven-post fixture the properties are shown on by name. */
const FIXTURE = journal(11);

describe("readingOrder", () => {
  it("groups the journal by theme, in the topics' order, keeping the given order inside each theme", () => {
    expect(readingOrder(FIXTURE, THEMES)).toEqual([
      "guide-01", "guide-05", "guide-08", // Screen time
      "guide-02", "guide-03", "guide-07", "guide-10", "guide-11", // Talking and language
      "guide-04", "guide-09", // AI toys and safety
      "guide-06", // Learning and play
    ]);
  });

  it("puts a theme outside the list after the listed ones, in the order it first appears", () => {
    const posts = [
      { slug: "a", theme: "Other" },
      { slug: "b", theme: "Screen time" },
      { slug: "c", theme: "Other" },
    ];
    expect(readingOrder(posts, THEMES)).toEqual(["b", "a", "c"]);
  });
});

describe("ringOffers", () => {
  it("offers the guide before and the two after, wrapping at both ends", () => {
    const offers = ringOffers(["a", "b", "c", "d", "e"]);
    expect(offers.get("a")).toEqual(["e", "b", "c"]);
    expect(offers.get("c")).toEqual(["b", "d", "e"]);
    expect(offers.get("e")).toEqual(["d", "a", "b"]);
  });

  it("offers every other guide of a journal of four or fewer, never the guide itself", () => {
    expect(ringOffers(["a", "b", "c", "d"]).get("a")).toEqual(["d", "b", "c"]);
    expect(ringOffers(["a", "b", "c"]).get("a")).toEqual(["c", "b"]);
    expect(ringOffers(["a"]).get("a")).toEqual([]);
  });

  it("is the same on every run: no randomness, so the link graph a crawler sees is stable", () => {
    const order = readingOrder(FIXTURE, THEMES);
    expect(ringOffers(order)).toEqual(ringOffers(order));
  });

  describe.each([4, 5, 7, 11, 20, 22, 25])("main's three properties on a fixture journal of %i posts", (n) => {
    const posts = journal(n);
    const order = readingOrder(posts, THEMES);
    const offers = ringOffers(order);
    const themeOf = new Map(posts.map((p) => [p.slug, p.theme]));

    it("1. even coverage: every guide offers three others and is offered by exactly three", () => {
      const incoming = new Map(order.map((s) => [s, 0]));
      for (const slug of order) {
        const offered = offers.get(slug)!;
        expect(offered, slug).toHaveLength(3);
        expect(new Set(offered).size, slug).toBe(3);
        expect(offered, slug).not.toContain(slug);
        for (const o of offered) incoming.set(o, incoming.get(o)! + 1);
      }
      expect([...incoming.values()].every((count) => count === 3)).toBe(true);
    });

    it("2. theme relevance: every guide in a theme of two or more is offered one of its own theme", () => {
      for (const slug of order) {
        const theme = themeOf.get(slug);
        const sameTheme = posts.filter((p) => p.theme === theme).length;
        if (sameTheme < 2) continue;
        expect(offers.get(slug)!.some((o) => themeOf.get(o) === theme), slug).toBe(true);
      }
    });

    it("3. one connected cycle: following the offers from any guide reaches every guide", () => {
      for (const start of order) {
        const seen = new Set([start]);
        const queue = [start];
        while (queue.length) for (const next of offers.get(queue.shift()!)!) if (!seen.has(next)) (seen.add(next), queue.push(next));
        expect(seen.size, start).toBe(order.length);
      }
    });
  });
});

describe("fillRelated", () => {
  const published = new Set(["a", "b", "c", "d", "e", "f"]);
  const offers = ["f", "b", "c"];

  it("keeps a post's own three published guides, in its order", () => {
    expect(fillRelated("a", ["d", "e", "b"], published, offers)).toEqual({ related: ["d", "e", "b"], filled: [] });
  });

  it("takes the ring's three for a post that names none", () => {
    expect(fillRelated("a", [], published, offers)).toEqual({ related: ["f", "b", "c"], filled: ["f", "b", "c"] });
  });

  it("drops what is not a published guide, the post itself and repeats, then fills from the ring, skipping what is listed", () => {
    expect(fillRelated("a", ["gone", "a", "b", "b"], published, offers)).toEqual({ related: ["b", "f", "c"], filled: ["f", "c"] });
  });

  it("keeps the first three of a longer list", () => {
    expect(fillRelated("a", ["b", "c", "d", "e"], published, offers)).toEqual({ related: ["b", "c", "d"], filled: [] });
  });

  it("refuses a journal too small to offer three others", () => {
    expect(() => fillRelated("a", [], new Set(["a", "b", "c"]), ["c", "b"])).toThrow(/too small to give "a" three related guides/);
  });
});
