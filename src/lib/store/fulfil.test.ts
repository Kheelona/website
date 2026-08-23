import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, type RecordedCall } from "../../../test/helpers/fake-supabase";
import type { StoreEnv } from "./env";

/**
 * Marking an order paid, and refusing to (§8.25-p, F-06).
 *
 * The two properties this function exists for are that it acts once whichever
 * path reaches it first, and that it never claims money it has not seen. The
 * second one is new: an order may not be marked paid by less than its own
 * amount. Nothing can produce that today, because the amount is set server-side
 * when the gateway order is created and Razorpay enforces it. That is a fact
 * about a dashboard setting, not about our data, and this is the difference.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));

const { markPaid } = await import("./fulfil");
const env = fakeEnv as StoreEnv;

const row = {
  order_ref: "KH-A2B3-C4D5",
  amount_paise: 49_900,
  status: "created",
  email: "parent@example.com",
  parent_name: "Test Parent",
  tier: "launch",
  address: null,
};

/** The filters the UPDATE was built with, as name/value pairs. */
function filters() {
  return calls.filter((c) => ["eq", "neq", "lte"].includes(c.method)).map((c) => `${c.method}:${c.args[0]}`);
}

describe("markPaid", () => {
  beforeEach(() => {
    calls = [];
    results = {};
  });

  it("marks a matching order paid and hands back the row", async () => {
    results["preorders.update"] = { data: row };
    const result = await markPaid(env, {
      rzpOrderId: "order_abc",
      paymentId: "pay_1",
      paidPaise: 49_900,
    });
    expect(result).toEqual({ outcome: "paid", order: row });
  });

  it("guards the UPDATE with the captured amount, so the statement stays atomic", async () => {
    /* The check is a condition on the write, not a read-then-write: that is
       what keeps two racing callers from both acting. */
    results["preorders.update"] = { data: row };
    await markPaid(env, { rzpOrderId: "order_abc", paymentId: "pay_1", paidPaise: 49_900 });
    expect(filters()).toContain("lte:amount_paise");
    expect(filters()).toContain("neq:status");
  });

  it("refuses to mark an order paid when the gateway captured less", async () => {
    /* The UPDATE matches nothing because of the amount guard, and the follow-up
       read explains why: still unpaid, and owed more than arrived. */
    results["preorders.update"] = { data: null };
    results["preorders.select"] = { data: { status: "created", amount_paise: 49_900 } };

    const result = await markPaid(env, {
      rzpOrderId: "order_abc",
      paymentId: "pay_1",
      paidPaise: 100,
    });

    expect(result).toEqual({ outcome: "short-paid" });
  });

  it("still says 'already' when the other path won the race", async () => {
    results["preorders.update"] = { data: null };
    results["preorders.select"] = { data: { status: "paid", amount_paise: 49_900 } };
    const result = await markPaid(env, {
      rzpOrderId: "order_abc",
      paymentId: "pay_1",
      paidPaise: 49_900,
    });
    expect(result).toEqual({ outcome: "already" });
  });

  it("applies no amount guard when the caller has no amount to give", async () => {
    /* The browser callback is told nothing about amounts, and verifying its
       signature is what makes it trustworthy. Its behaviour must not change. */
    results["preorders.update"] = { data: row };
    await markPaid(env, { rzpOrderId: "order_abc", paymentId: "pay_1" });
    expect(filters()).not.toContain("lte:amount_paise");
  });

  it("shouts about money for an order we have no record of", async () => {
    results["preorders.update"] = { data: null };
    results["preorders.select"] = { data: null };
    const result = await markPaid(env, { rzpOrderId: "order_ghost", paymentId: "pay_1" });
    expect(result).toEqual({ outcome: "unknown" });
  });

  it("recovers an orphan by our own reference, with the same amount guard", async () => {
    /* Two updates in this path: the first misses (no row carries the gateway
       order id), the second finds the row by the reference Razorpay echoed. */
    let updates = 0;
    results["preorders.select"] = { data: null };
    Object.defineProperty(results, "preorders.update", {
      get() {
        updates += 1;
        return updates === 1 ? { data: null } : { data: row };
      },
      enumerable: true,
      configurable: true,
    });

    const result = await markPaid(env, {
      rzpOrderId: "order_abc",
      paymentId: "pay_1",
      orderRef: "KH-A2B3-C4D5",
      paidPaise: 49_900,
    });

    expect(result).toEqual({ outcome: "paid", order: row });
    expect(filters().filter((f) => f === "lte:amount_paise")).toHaveLength(2);
  });
});
