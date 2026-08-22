import { PREORDER_CAP_UNITS } from "@/config/site";
import { db } from "./db";
import type { StoreEnv } from "./env";

/** Which offer the store is making right now (§8.26).
 *
 *  "token": fewer than PREORDER_CAP_UNITS launch-priced orders are paid, so a
 *  ₹499 token still reserves a unit at the capped price. "full": the capped
 *  units are gone, and a pre-order is the launch price paid in full.
 *
 *  THE COUNT NEVER LEAVES THIS MODULE (founder, 2026-08-23: no public counter).
 *  Only the mode is exported, and only tiers.ts, the store page and /api/health
 *  may import it. Anything rendering an EXISTING order (thanks, emails, the
 *  balance run) derives from the order row instead, so a mode flip can never
 *  rewrite what a customer already agreed to.
 *
 *  A refund reopens a slot on purpose: the dispatch queue (`status='paid'`) is
 *  the truth (§8.25-ee), and this count IS that queue minus full-price orders,
 *  which never consumed a capped unit. A missing count (a DB hiccup) reads as
 *  0, the same idiom as the event-tier cap: the failure direction offers the
 *  LOWER price, which costs us margin and never overcharges a parent. */
export type PreorderMode = "token" | "full";

/** The post-cap public tier id. Defined here rather than in tiers.ts so that
 *  tiers.ts can import it without a cycle. It is a reserved id in
 *  `preorders.tier`: an event tier may never take it (tiers.ts refuses the
 *  name before the signed branch runs). */
export const FULL_TIER = "full";

export async function preorderMode(env: StoreEnv): Promise<PreorderMode> {
  /* head:true asks for the count without the rows, exactly like the event-tier
     cap check: the answer is a number, and it must stay cheap because the
     store page asks on every request. */
  const { count } = await db(env)
    .from("preorders")
    .select("id", { count: "exact", head: true })
    .eq("status", "paid")
    .neq("tier", FULL_TIER);
  return (count ?? 0) >= PREORDER_CAP_UNITS ? "full" : "token";
}
