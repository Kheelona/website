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

/* notifyPaid's three downstream calls, mocked so the CONTRACT is what is
   tested: that all three are attempted and that no failure escapes. */
const sendEmail = vi.hoisted(() => vi.fn());
const reportPurchaseToMeta = vi.hoisted(() => vi.fn());
vi.mock("@/lib/email/send", () => ({ sendEmail }));
vi.mock("./meta-capi", () => ({ reportPurchaseToMeta }));

const { markPaid, notifyPaid, markRefunded } = await import("./fulfil");
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
  return calls.filter((c) => ["eq", "neq", "lte", "in"].includes(c.method)).map((c) => `${c.method}:${c.args[0]}`);
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
    expect(filters()).toContain("in:status");
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

/* ── notifyPaid ───────────────────────────────────────────────────────────
 *
 *  WHY THESE EXIST. Until 2026-09-02 this function had NO tests, and the
 *  omission was provable rather than theoretical: commenting out the
 *  `reportPurchaseToMeta(env, order)` line left all 950 tests passing. That is
 *  the single line that reports a sale to Meta, and §8.30-l leans on this
 *  function's placement for its exactly-once and never-throw guarantees while
 *  nothing pinned either.
 *
 *  The emails and the Meta call are mocked because what is under test is this
 *  function's CONTRACT: that all three are attempted, and that no failure among
 *  them can escape. By the time this runs the money has moved and the row says
 *  so, and a throw here would fail a webhook Razorpay then retries for a
 *  payment recorded perfectly. */
/* ── The payable allow-list (§8.30-s) ─────────────────────────────────────
 *
 *  `.neq("status","paid")` reads as "not already paid" and was right about the
 *  case it was written for and wrong about two others: `refunded` and
 *  `cancelled` both satisfy it. A webhook retry after a refund would flip the
 *  row back to paid and put a refunded customer BACK IN THE DISPATCH QUEUE. */
describe("markPaid and the payable allow-list", () => {
  beforeEach(() => {
    calls = [];
    results = {};
    vi.restoreAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("builds the UPDATE from an allow-list, naming the payable states", async () => {
    results["preorders.update"] = { data: row };
    await markPaid(env, { rzpOrderId: "order_abc", paymentId: "pay_1" });
    const inCall = calls.find((c) => c.method === "in");
    expect(inCall?.args[0]).toBe("status");
    expect(inCall?.args[1]).toEqual(["created", "failed"]);
  });

  it.each([["refunded"], ["cancelled"]])(
    "refuses to resurrect a %s order, and says so",
    async (status) => {
      results["preorders.update"] = { data: null };
      results["preorders.select"] = { data: { status, amount_paise: 49_900 } };

      const result = await markPaid(env, {
        rzpOrderId: "order_abc",
        paymentId: "pay_1",
        paidPaise: 49_900,
      });

      expect(result).toEqual({ outcome: "not-payable", status });
      expect(console.error).toHaveBeenCalled();
    },
  );

  /* THE REGRESSION THE PLAN REVIEW CAUGHT. `paid` is not in the allow-list, so
     a not-payable check placed before the already-paid check would fire on
     EVERY successful order: two paths reach markPaid and the second one lands
     in exactly this branch. That would bury the real alarm in false ones. */
  it("still answers 'already' for an order that is simply paid, not an alarm", async () => {
    results["preorders.update"] = { data: null };
    results["preorders.select"] = { data: { status: "paid", amount_paise: 49_900 } };

    const result = await markPaid(env, {
      rzpOrderId: "order_abc",
      paymentId: "pay_1",
      paidPaise: 49_900,
    });

    expect(result).toEqual({ outcome: "already" });
    expect(console.error).not.toHaveBeenCalled();
  });

  it.each([["created"], ["failed"]])(
    "still pays a %s order, so the happy path does not regress",
    async (status) => {
      results["preorders.update"] = { data: { ...row, status } };
      const result = await markPaid(env, {
        rzpOrderId: "order_abc",
        paymentId: "pay_1",
        paidPaise: 49_900,
      });
      expect(result.outcome).toBe("paid");
    },
  );

  it("keeps short payment distinguishable from not-payable", async () => {
    results["preorders.update"] = { data: null };
    results["preorders.select"] = { data: { status: "created", amount_paise: 49_900 } };
    const result = await markPaid(env, {
      rzpOrderId: "order_abc",
      paymentId: "pay_1",
      paidPaise: 40_000,
    });
    expect(result.outcome).toBe("short-paid");
  });

  it("guards orphan recovery with the same allow-list", async () => {
    results["preorders.update"] = { data: null };
    results["preorders.select"] = { data: null };
    await markPaid(env, {
      rzpOrderId: "order_orphan",
      paymentId: "pay_1",
      orderRef: "KH-A2B3-C4D5",
    });
    const inCalls = calls.filter((c) => c.method === "in");
    expect(inCalls.length).toBeGreaterThanOrEqual(2);
    for (const c of inCalls) expect(c.args[1]).toEqual(["created", "failed"]);
  });
});

describe("notifyPaid", () => {
  beforeEach(() => {
    calls = [];
    results = {};
    vi.clearAllMocks();
    sendEmail.mockResolvedValue(undefined);
    reportPurchaseToMeta.mockResolvedValue("sent");
  });

  const paidOrder = { ...row, status: "paid", child_age: "4", phone: "+919187546483" };

  it("reports the sale to Meta, exactly once, with the paid order", async () => {
    await notifyPaid(env, paidOrder as never);
    expect(reportPurchaseToMeta).toHaveBeenCalledTimes(1);
    expect(reportPurchaseToMeta).toHaveBeenCalledWith(env, paidOrder);
  });

  it("sends the parent's acknowledgement and the internal alert", async () => {
    await notifyPaid(env, paidOrder as never);
    expect(sendEmail).toHaveBeenCalledTimes(2);
    const recipients = sendEmail.mock.calls.map((c) => (c[1] as { to: string }).to);
    expect(recipients).toContain(paidOrder.email);
    expect(recipients).toContain(env.alertEmail);
  });

  /* The never-throw contract, from three directions. Each of these is a real
     outage shape: Meta down, Resend down, both. */
  it("does not throw when the Meta report fails, and still sends both emails", async () => {
    reportPurchaseToMeta.mockRejectedValue(new Error("graph.facebook.com unreachable"));
    await expect(notifyPaid(env, paidOrder as never)).resolves.toBeUndefined();
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it("does not throw when an email fails, and still reports to Meta", async () => {
    sendEmail.mockRejectedValue(new Error("resend down"));
    await expect(notifyPaid(env, paidOrder as never)).resolves.toBeUndefined();
    expect(reportPurchaseToMeta).toHaveBeenCalledTimes(1);
  });

  it("does not throw when everything downstream fails at once", async () => {
    sendEmail.mockRejectedValue(new Error("resend down"));
    reportPurchaseToMeta.mockRejectedValue(new Error("meta down"));
    await expect(notifyPaid(env, paidOrder as never)).resolves.toBeUndefined();
  });
});

/* ── markRefunded (§8.25-ee) ──────────────────────────────────────────────
 *
 *  Also untested until now, and it carries the law that a PARTIAL refund is not
 *  a cancellation. That is not hypothetical: the first refund this store ever
 *  issued was ₹489 of ₹499, so a rule of "any refund clears the order" would
 *  have silently cancelled a live pre-order. */
describe("markRefunded", () => {
  beforeEach(() => {
    calls = [];
    results = {};
  });

  it("takes a fully refunded order out of the dispatch queue", async () => {
    results["preorders.select"] = {
      data: { order_ref: "KH-A2B3-C4D5", amount_paise: 49_900, status: "paid" },
    };
    await expect(markRefunded(env, { paymentId: "pay_1", refundedPaise: 49_900 })).resolves.toBe(
      "refunded",
    );
    const update = calls.find((c) => c.method === "update");
    expect(update?.args[0]).toMatchObject({ status: "refunded" });
  });

  it("leaves a PARTIAL refund alone, because there is no honest automatic answer", async () => {
    results["preorders.select"] = {
      data: { order_ref: "KH-A2B3-C4D5", amount_paise: 49_900, status: "paid" },
    };
    await expect(markRefunded(env, { paymentId: "pay_1", refundedPaise: 48_900 })).resolves.toBe(
      "partial",
    );
    expect(calls.find((c) => c.method === "update")).toBeUndefined();
  });

  it("says so when no order matches the payment, rather than guessing", async () => {
    results["preorders.select"] = { data: null };
    await expect(markRefunded(env, { paymentId: "pay_unknown", refundedPaise: 100 })).resolves.toBe(
      "unknown",
    );
  });
});
