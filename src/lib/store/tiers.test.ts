import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fakeClient,
  fakeEnv,
  type RecordedCall,
} from "../../../test/helpers/fake-supabase";
import { TOKEN_AMOUNT_PAISE, FULL_AMOUNT_PAISE, PREORDER_CAP_UNITS } from "@/config/site";
import { sign } from "./signing";
import type { StoreEnv } from "./env";

/**
 * The mode gate at the price choke point (§8.26 on top of §8.25-c-i).
 *
 * Both flip directions are gated: a stale token-mode page must not underprice
 * once the cap is hit, and a stale full-mode page must not overcharge after a
 * refund reopens a slot. The price a parent SAW is the only price they may be
 * charged, so a raced submit is refused with words, never silently re-priced.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));

const { resolveTier, tierRefusalMessage, LAUNCH_TIER, FULL_TIER } = await import("./tiers");
const env = fakeEnv as StoreEnv;

/** The paid-orders count the mode gate will read. */
function unitsSold(count: number) {
  results["preorders.select"] = { count };
}

describe("resolveTier under the unit cap", () => {
  beforeEach(() => {
    calls = [];
    results = {};
  });

  it("sells the launch tier at the token price while units remain", async () => {
    unitsSold(PREORDER_CAP_UNITS - 1);
    const result = await resolveTier(env, { tier: LAUNCH_TIER });
    expect(result).toEqual({
      ok: true,
      tier: { id: LAUNCH_TIER, amountPaise: TOKEN_AMOUNT_PAISE, label: "Pre-order price" },
    });
  });

  it("refuses the launch tier once the cap is reached", async () => {
    unitsSold(PREORDER_CAP_UNITS);
    const result = await resolveTier(env, { tier: LAUNCH_TIER });
    expect(result).toEqual({ ok: false, reason: "cap-reached" });
  });

  it("sells the full tier at the full price once the cap is reached", async () => {
    unitsSold(PREORDER_CAP_UNITS);
    const result = await resolveTier(env, { tier: FULL_TIER });
    expect(result).toEqual({
      ok: true,
      tier: { id: FULL_TIER, amountPaise: FULL_AMOUNT_PAISE, label: "Launch price" },
    });
  });

  it("refuses the full tier while capped units remain", async () => {
    unitsSold(PREORDER_CAP_UNITS - 1);
    const result = await resolveTier(env, { tier: FULL_TIER });
    expect(result).toEqual({ ok: false, reason: "not-yet" });
  });

  it("never lets an event tier shadow the public full tier", async () => {
    /* A dashboard row named "full", even correctly signed, must never price a
       public full-tier order: the id is reserved before the signed branch. */
    unitsSold(PREORDER_CAP_UNITS);
    results["event_tiers.select"] = {
      data: { id: "full", label: "Bad row", amount_paise: 100, cap: null, expires_on: null, active: true },
    };
    const result = await resolveTier(env, {
      tier: FULL_TIER,
      signature: sign(env.signingSecret, "event-link", FULL_TIER),
    });
    expect(result).toEqual({
      ok: true,
      tier: { id: FULL_TIER, amountPaise: FULL_AMOUNT_PAISE, label: "Launch price" },
    });
  });

  it("resolves an event tier in either mode: the cap does not gate events", async () => {
    /* An event token is a token whatever the public mode is (§8.26): the ₹99
       QR at a stall keeps working after the 500th unit sells, contained by its
       own cap and expiry exactly as §8.25-g designed. cap:null here so the only
       preorders count in play would be the mode gate's — and the assertion is
       that it is never consulted. */
    results["event_tiers.select"] = {
      data: { id: "expo", label: "Expo price", amount_paise: 9_900, cap: null, expires_on: null, active: true },
    };
    const result = await resolveTier(env, {
      tier: "expo",
      signature: sign(env.signingSecret, "event-link", "expo"),
    });
    expect(result).toEqual({
      ok: true,
      tier: { id: "expo", amountPaise: 9_900, label: "Expo price" },
    });
    expect(calls.filter((c) => c.table === "preorders")).toEqual([]);
  });

  it("honours expires_on inclusively: sells on the last day, refuses after", async () => {
    /* The Ideabaaz page (2026-08-23) leans on this as its backstop: the
       founder closes by hand on 31 August, and this boundary is what catches
       the day the hand slips. */
    results["event_tiers.select"] = {
      data: {
        id: "ideabaaz",
        label: "Ideabaaz exclusive price",
        amount_paise: 9_900,
        cap: null,
        expires_on: "2026-08-31",
        active: true,
      },
    };
    const signed = sign(env.signingSecret, "event-link", "ideabaaz");

    const lastDay = await resolveTier(
      env,
      { tier: "ideabaaz", signature: signed },
      new Date("2026-08-31T18:00:00Z"),
    );
    expect(lastDay).toEqual({
      ok: true,
      tier: { id: "ideabaaz", amountPaise: 9_900, label: "Ideabaaz exclusive price" },
    });

    const morningAfter = await resolveTier(
      env,
      { tier: "ideabaaz", signature: signed },
      new Date("2026-09-01T00:30:00Z"),
    );
    expect(morningAfter).toEqual({ ok: false, reason: "expired" });
  });

  it("explains both mode refusals in refresh-the-page words", () => {
    expect(tierRefusalMessage("cap-reached")).toContain("₹7,999");
    expect(tierRefusalMessage("cap-reached")).toContain("Refresh");
    expect(tierRefusalMessage("not-yet")).toContain("₹499");
    expect(tierRefusalMessage("not-yet")).toContain("Refresh");
  });
});
