import { unstable_cache } from "next/cache";
import type { Offer, OfferMode } from "@/content/types";
import { storeEnv } from "@/lib/store/env";
import { preorderMode } from "@/lib/store/mode";
import { buildOffer } from "./offer";

/**
 * The offer on marketing pages follows the live store mode (ADR-005): one cached read of the
 * frozen `preorderMode()`, never the count. Pages that show a price export `revalidate = 300`
 * as a literal (Next reads it statically); the store keeps its own per-request read.
 *
 * Cache Components stay off (QA review N13), so this is the documented previous model:
 * `unstable_cache` with a key, a window and a tag (Next 16 docs, unstable_cache.md,
 * caching-without-cache-components.md).
 */

/** The cache window, in seconds: a mode flip shows within about ten minutes (ADR-005, N14). */
export const OFFER_REVALIDATE_SECONDS = 300;

/** The live mode, read the way the store reads it. No store environment (local, CI, and beta,
 *  D051) or any failure reads as token: the lower price, which never overcharges (mode.ts). */
async function readOfferMode(): Promise<OfferMode> {
  try {
    const env = storeEnv();
    if (env === null) return "token";
    return await preorderMode(env);
  } catch {
    return "token";
  }
}

const cachedOfferMode = unstable_cache(readOfferMode, ["offer-mode"], {
  revalidate: OFFER_REVALIDATE_SECONDS,
  tags: ["offer"],
});

/** The offer view model for the live mode. */
export async function getOffer(): Promise<Offer> {
  let mode: OfferMode;
  try {
    mode = await cachedOfferMode();
  } catch {
    mode = "token";
  }
  return buildOffer(mode);
}
