import type { Copy, ImageRef, TrustItem } from "@/content/types";

/* StoreTop's configuration (task 5.15; components §2; store.md fold 1): what the store content gives the store's first
 * screen. The price sentence is the offer's (D028), so it is not here. */

export interface StoreTopConfig {
  /** "Ages 3 to 7": the band first (benchmarks A9). */
  readonly eyebrow: Copy;
  /** The page's one h1: "Pre-order Kheelu." (store.md question 1, option A). */
  readonly title: Copy;
  /** The h1's id, which names the section. */
  readonly titleId: string;
  /** The small Kheelu beside the heading (small on purpose, so the form stays high on a phone). */
  readonly image: ImageRef;
  /** The price sentence's id. */
  readonly priceId: string;
  /** The compact trust line under the price: the delivery line and the returns promise (TRUST_COMPACT). */
  readonly trust: readonly TrustItem[];
}
