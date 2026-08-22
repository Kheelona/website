import {
  TOKEN_AMOUNT_PAISE,
  FULL_AMOUNT_PAISE,
  CAP_UNITS_TEXT,
  FULL_PRICE,
  TOKEN_PRICE,
  formatInr,
} from "@/config/site";
import { FULL_TIER, preorderMode } from "./mode";
import { verify } from "./signing";
import { db } from "./db";
import type { StoreEnv } from "./env";

/** Which price an order is taken at (§8.25-g).
 *
 *  `launch` and `full` are the public tiers and their amounts come from config,
 *  so the price on the page and the price charged cannot disagree. Which of the
 *  two is on offer is decided HERE, per request, from the live unit count
 *  (§8.26): `launch` (a ₹499 token) while the capped units last, `full` (the
 *  launch price, paid upfront) after. Both directions are gated, deliberately —
 *  a stale full-mode page must not overcharge a parent after a refund reopens a
 *  slot, and a stale token-mode page must not underprice once the cap is hit.
 *  Every other tier is a row in `event_tiers`, which means a booth on Saturday
 *  needs a dashboard insert rather than a Friday deploy.
 *
 *  An event link is SIGNED, capped and dated. Signing stops anyone minting a
 *  ₹99 link by guessing a slug; the cap and the expiry are what contain the leak
 *  that signing cannot prevent, because a printed QR code can be photographed
 *  and forwarded. So the honest security model is: unguessable, and worthless
 *  once the event is over or the allocation is gone. */

export const LAUNCH_TIER = "launch";
export { FULL_TIER };

export type ResolvedTier = {
  id: string;
  amountPaise: number;
  /** Shown on the store page beside the amount, e.g. "Bangalore expo price". */
  label: string;
};

export type TierResult =
  | { ok: true; tier: ResolvedTier }
  | {
      ok: false;
      reason: "cap-reached" | "not-yet" | "unknown" | "bad-signature" | "expired" | "full";
    };

export function launchTier(): ResolvedTier {
  return { id: LAUNCH_TIER, amountPaise: TOKEN_AMOUNT_PAISE, label: "Pre-order price" };
}

export function fullTier(): ResolvedTier {
  return { id: FULL_TIER, amountPaise: FULL_AMOUNT_PAISE, label: "Launch price" };
}

/** Resolve a tier for a request. `signature` is required for anything that is
 *  not a public tier, and the amount is ALWAYS read from our side. */
export async function resolveTier(
  env: StoreEnv,
  input: { tier?: string | null; signature?: string | null },
  now: Date = new Date(),
): Promise<TierResult> {
  const id = (input.tier ?? LAUNCH_TIER).trim();

  if (id === LAUNCH_TIER) {
    if ((await preorderMode(env)) === "full") return { ok: false, reason: "cap-reached" };
    return { ok: true, tier: launchTier() };
  }

  /* Checked before the signed branch so no event tier can ever shadow the
     public full tier by taking its id. */
  if (id === FULL_TIER) {
    if ((await preorderMode(env)) === "token") return { ok: false, reason: "not-yet" };
    return { ok: true, tier: fullTier() };
  }

  if (!input.signature || !verify(env.signingSecret, "event-link", id, input.signature)) {
    return { ok: false, reason: "bad-signature" };
  }

  const client = db(env);
  const { data: tier } = await client
    .from("event_tiers")
    .select("id, label, amount_paise, cap, expires_on, active")
    .eq("id", id)
    .eq("active", true)
    .maybeSingle();

  if (!tier) return { ok: false, reason: "unknown" };

  const today = now.toISOString().slice(0, 10);
  if (tier.expires_on && tier.expires_on < today) return { ok: false, reason: "expired" };

  if (tier.cap) {
    /* head:true asks for the count without the rows: the answer is a number,
       and pulling every paid order to length-check it would get slower every
       week the store runs. */
    const { count } = await client
      .from("preorders")
      .select("id", { count: "exact", head: true })
      .eq("tier", id)
      .eq("status", "paid");
    if ((count ?? 0) >= tier.cap) return { ok: false, reason: "full" };
  }

  return {
    ok: true,
    tier: { id: tier.id, amountPaise: tier.amount_paise, label: tier.label },
  };
}

/** Why a tier was refused, in words a parent at a stall can act on. The two
 *  mode refusals happen when a page went stale across the flip, in either
 *  direction: the price the parent SAW is the only price they may be charged
 *  (§8.25-c-i), so the answer is always "refresh", never a silent re-price. */
export function tierRefusalMessage(reason: Exclude<TierResult, { ok: true }>["reason"]): string {
  switch (reason) {
    case "cap-reached":
      return `The ${CAP_UNITS_TEXT} have all been reserved, and Lumi is now ${FULL_PRICE}. Refresh this page and it will show the current price.`;
    case "not-yet":
      return `Good news: one of the ${CAP_UNITS_TEXT} has opened up again. Refresh this page and reserve it for ${TOKEN_PRICE}.`;
    case "expired":
      return "This event link has expired. You can still pre-order at the usual price on this page.";
    case "full":
      return "The allocation for this event has all gone. You can still pre-order at the usual price on this page.";
    default:
      return `This link is not one of ours. You can pre-order at ${formatInr(TOKEN_AMOUNT_PAISE)} on this page.`;
  }
}
