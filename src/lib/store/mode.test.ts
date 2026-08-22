import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fakeClient,
  fakeEnv,
  type RecordedCall,
} from "../../../test/helpers/fake-supabase";
import { PREORDER_CAP_UNITS } from "@/config/site";
import type { StoreEnv } from "./env";

/**
 * The unit-cap gate (§8.26).
 *
 * Two commercial promises live in this one query: the ₹4,999 price is for the
 * first 500 PAID orders (refunded orders reopen their slot, because the paid
 * queue is the truth, §8.25-ee), and full-price orders never consume a capped
 * unit. Both are query-shape facts, so both are asserted as query shape.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));

const mode = await import("./mode");
const env = fakeEnv as StoreEnv;

describe("preorderMode", () => {
  beforeEach(() => {
    calls = [];
    results = {};
  });

  it("stays in token mode below the cap", async () => {
    results = { "preorders.select": { count: PREORDER_CAP_UNITS - 1 } };
    expect(await mode.preorderMode(env)).toBe("token");
  });

  it("flips to full mode at the cap, and stays there above it", async () => {
    results = { "preorders.select": { count: PREORDER_CAP_UNITS } };
    expect(await mode.preorderMode(env)).toBe("full");

    results = { "preorders.select": { count: PREORDER_CAP_UNITS + 1 } };
    expect(await mode.preorderMode(env)).toBe("full");
  });

  it("counts only paid orders, and never full-price ones", async () => {
    results = { "preorders.select": { count: 0 } };
    await mode.preorderMode(env);

    /* status='paid' is what makes a refund reopen a slot; tier != 'full' is
       what stops post-cap orders from consuming capped units. */
    expect(calls).toContainEqual(
      expect.objectContaining({ table: "preorders", method: "eq", args: ["status", "paid"] }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({ table: "preorders", method: "neq", args: ["tier", "full"] }),
    );
  });

  it("fails toward the cheaper price when the count is missing", async () => {
    /* A DB hiccup must never overcharge: an unknown count reads as 0, so the
       store offers ₹4,999 — margin risk for us, never a wrong charge for a
       parent. Same idiom as the event-tier cap. */
    results = { "preorders.select": {} };
    expect(await mode.preorderMode(env)).toBe("token");
  });

  it("exports the mode and the tier id, never the count", () => {
    /* The no-public-counter law (founder, 2026-08-23), made executable: if a
       count-shaped export ever appears here, this fails before a page can
       render it. */
    expect(Object.keys(mode).sort()).toEqual(["FULL_TIER", "preorderMode"]);
  });
});
