import { describe, expect, it } from "vitest";
import { STORIES, getRelatedStories } from "@/lib/stories";

/**
 * The finding this file exists to keep closed.
 *
 * On 2026-08-12 a crawl of the live sitemap found fifteen of the nineteen
 * journal articles with exactly ONE incoming internal link — all of them from
 * the /stories index — and the remaining four with two, the ones Home promotes.
 * No article linked to any other. Ahrefs called it "page has only one dofollow
 * incoming internal link"; in plain terms the journal was nineteen dead-end
 * leaves and crawl equity pooled on Home instead of reaching the only pages on
 * this site written to rank.
 *
 * `ReadNext` fixes it by offering three neighbours at the foot of every
 * article. That is a promise about the SHAPE OF THE GRAPH, not about a
 * component, so this guard rebuilds the graph from the selector and asserts the
 * shape. It will fail the day someone adds an article the ring cannot reach, or
 * swaps the deterministic selection for something random.
 */

/** The graph ReadNext creates: article → the three it offers. */
function relatedGraph() {
  const incoming = new Map<string, string[]>(STORIES.map((s) => [s.slug, []]));
  for (const story of STORIES) {
    for (const related of getRelatedStories(story.slug)) {
      incoming.get(related.slug)!.push(story.slug);
    }
  }
  return incoming;
}

describe("the journal is not a set of dead ends", () => {
  it("still has the nineteen articles this guard was measured against", () => {
    expect(STORIES.length).toBeGreaterThanOrEqual(19);
  });

  it("gives every article at least three incoming links from other articles", () => {
    for (const [slug, sources] of relatedGraph()) {
      expect(sources.length, `${slug} is reachable from only: ${sources.join(", ") || "nothing"}`)
        .toBeGreaterThanOrEqual(3);
    }
  });

  it("leaves no article unreachable from any other article", () => {
    const orphans = [...relatedGraph()].filter(([, from]) => from.length === 0);
    expect(orphans.map(([slug]) => slug)).toEqual([]);
  });

  it("beats the baseline it was built to fix, for every single article", () => {
    /* Before: 15 articles at 1 incoming link, 4 at 2, and every one of those
       links came from the index rather than from another article. */
    for (const [slug, sources] of relatedGraph()) {
      expect(sources.length, `${slug} did not improve on the 2026-08-12 baseline`)
        .toBeGreaterThan(2);
    }
  });

  it("spreads the links rather than pointing them all at a few favourites", () => {
    const counts = [...relatedGraph().values()].map((s) => s.length);
    /* Total offered links are fixed at 3 per article, so a fair spread means
       nothing hoards them. A ceiling of double the average catches a selector
       that funnels the whole journal into one or two pieces. */
    const average = counts.reduce((a, b) => a + b, 0) / counts.length;
    expect(Math.max(...counts)).toBeLessThanOrEqual(average * 2);
  });
});
