import { TOKEN_AMOUNT_PAISE, isPreorderOpen, formatInr } from "@/config/site";
import { verify } from "./signing";
import { db } from "./db";
import type { StoreEnv } from "./env";

/** Which price an order is taken at (§8.25-g).
 *
 *  `launch` is the public tier and its amount comes from config, so the price on
 *  the page and the price charged cannot disagree. Every other tier is a row in
 *  `event_tiers`, which means a booth on Saturday needs a dashboard insert
 *  rather than a Friday deploy.
 *
 *  An event link is SIGNED, capped and dated. Signing stops anyone minting a
 *  ₹99 link by guessing a slug; the cap and the expiry are what contain the leak
 *  that signing cannot prevent, because a printed QR code can be photographed
 *  and forwarded. So the honest security model is: unguessable, and worthless
 *  once the event is over or the allocation is gone. */

export const LAUNCH_TIER = "launch";

export type ResolvedTier = {
  id: string;
  amountPaise: number;
  /** Shown on the store page beside the amount, e.g. "Bangalore expo price". */
  label: string;
};

export type TierResult =
  | { ok: true; tier: ResolvedTier }
  | { ok: false; reason: "closed" | "unknown" | "bad-signature" | "expired" | "full" };

export function launchTier(): ResolvedTier {
  return { id: LAUNCH_TIER, amountPaise: TOKEN_AMOUNT_PAISE, label: "Pre-order price" };
}

/** Resolve a tier for a request. `signature` is required for anything that is
 *  not the public tier, and the amount is ALWAYS read from our side. */
export async function resolveTier(
  env: StoreEnv,
  input: { tier?: string | null; signature?: string | null },
  now: Date = new Date(),
): Promise<TierResult> {
  const id = (input.tier ?? LAUNCH_TIER).trim();

  if (id === LAUNCH_TIER) {
    if (!isPreorderOpen(now)) return { ok: false, reason: "closed" };
    return { ok: true, tier: launchTier() };
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

/** Why a tier was refused, in words a parent at a stall can act on. */
export function tierRefusalMessage(reason: Exclude<TierResult, { ok: true }>["reason"]): string {
  switch (reason) {
    case "closed":
      return "Pre-order pricing has closed. Lumi goes on general sale shortly, and we can tell you the moment it does.";
    case "expired":
      return "This event link has expired. You can still pre-order at the usual price on this page.";
    case "full":
      return "The allocation for this event has all gone. You can still pre-order at the usual price on this page.";
    default:
      return `This link is not one of ours. You can pre-order at ${formatInr(TOKEN_AMOUNT_PAISE)} on this page.`;
  }
}
