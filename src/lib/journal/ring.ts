/** The related-guide ring (ADR-014; journal-pipeline §4 `related`, §8.2 row 19).
 *
 *  A post names its three related guides (`related`, B1; the 20 rewritten guides carry task 7.1d's curated ring). What
 *  it does not name, the ring fills: main's ring, kept (main:src/lib/stories.ts:176-222). Over the journal sorted by
 *  theme, each guide offers the one before it and the two after it, wrapping at the ends. That buys three properties
 *  (main:src/lib/stories.ts:189-207, proven in ring.test.ts): even coverage (everyone offers three, so everyone is
 *  offered by three, and no guide is a dead end), theme relevance without theme prisons (neighbours in a theme-sorted
 *  list share a theme, and the one step back means a guide at the end of its theme still gets one), and one connected
 *  cycle (a crawler that lands anywhere can walk the lot). No randomness: the link graph is the same on every build. */

/** What the ring needs of a post. */
export interface RingPost {
  readonly slug: string;
  readonly theme: string;
}

/** Three related guides, as an `Article` holds them. */
export type Related = readonly [string, string, string];

const WANTED = 3;

/** The journal in reading order: grouped by theme, the given themes first in their order, then any other theme in the
 *  order it first appears; inside each theme, the given order of the posts (the snapshot's, by slug). */
export function readingOrder(posts: readonly RingPost[], themeOrder: readonly string[]): string[] {
  const themes = [...new Set([...themeOrder, ...posts.map((p) => p.theme)])];
  return themes.flatMap((theme) => posts.filter((p) => p.theme === theme).map((p) => p.slug));
}

/** Each guide's offers in a reading order: one step back, then forward, wrapping; three, or every other guide of a
 *  journal of four or fewer. */
export function ringOffers(order: readonly string[]): ReadonlyMap<string, readonly string[]> {
  const n = order.length;
  const wanted = Math.min(WANTED, n - 1);
  /* Every guide uses every offset, so each is offered by exactly `wanted` others: the coverage is arithmetic. */
  const offsets = [-1, ...Array.from({ length: Math.max(0, wanted - 1) }, (_, i) => i + 1)].slice(0, wanted);
  return new Map(order.map((slug, index) => [slug, offsets.map((offset) => order[(index + offset + n) % n])]));
}

/** The three related guides a post shows: its own published choices first (never itself, never twice), then the
 *  ring's offers it does not list yet. `filled` names what the ring added (a build warning, §8.2 row 19). */
export function fillRelated(
  slug: string,
  own: readonly string[],
  published: ReadonlySet<string>,
  offers: readonly string[],
): { related: Related; filled: string[] } {
  const related: string[] = [];
  for (const guide of own) {
    if (related.length === WANTED) break;
    if (guide !== slug && published.has(guide) && !related.includes(guide)) related.push(guide);
  }
  const filled: string[] = [];
  for (const guide of offers) {
    if (related.length === WANTED) break;
    if (guide !== slug && !related.includes(guide)) {
      related.push(guide);
      filled.push(guide);
    }
  }
  if (related.length !== WANTED) {
    throw new Error(`The journal is too small to give "${slug}" three related guides (it needs at least four posts)`);
  }
  return { related: [related[0], related[1], related[2]], filled };
}
