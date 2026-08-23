import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, type RecordedCall } from "../../../../../test/helpers/fake-supabase";

/**
 * The webhook. Everything here is about not losing money and not double-acting.
 *
 * The signature is computed with a real HMAC in the test because we are testing
 * the HANDLER, not the verifier: the verifier has its own tests against fixed
 * vectors (lib/store/store-crypto.test.ts), and here we need a signature that is
 * genuinely valid so the handler proceeds past it.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};

const storeEnv = vi.hoisted(() => vi.fn());
const markPaid = vi.hoisted(() => vi.fn());
const notifyPaid = vi.hoisted(() => vi.fn());
const markRefunded = vi.hoisted(() => vi.fn());
const markFailed = vi.hoisted(() => vi.fn());

vi.mock("@/lib/store/env", () => ({ storeEnv }));
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/store/fulfil", () => ({ markPaid, notifyPaid, markRefunded, markFailed }));

const { POST } = await import("./route");

const order = {
  order_ref: "KH-A2B3-C4D5",
  email: "priya@example.com",
  amount_paise: 49_900,
  parent_name: "Priya Menon",
  address: null,
};

function deliver(body: unknown, options: { signature?: string; eventId?: string } = {}) {
  const raw = JSON.stringify(body);
  const signature =
    options.signature ?? createHmac("sha256", fakeEnv.razorpayWebhookSecret).update(raw).digest("hex");
  return POST(
    new Request("https://store.kheelona.com/api/razorpay/webhook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-razorpay-signature": signature,
        "x-razorpay-event-id": options.eventId ?? "evt_1",
      },
      body: raw,
    }),
  );
}

const paidEvent = {
  event: "order.paid",
  payload: { payment: { entity: { id: "pay_xyz", order_id: "order_abc" } } },
};

describe("POST /api/razorpay/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calls = [];
    results = { "webhook_events.insert": { data: null, error: null } };
    storeEnv.mockReturnValue(fakeEnv);
    markPaid.mockResolvedValue({ outcome: "paid", order });
    markRefunded.mockResolvedValue("refunded");
  });

  it("rejects an unsigned delivery, and says nothing about why", async () => {
    const response = await deliver(paidEvent, { signature: "deadbeef" });
    expect(response.status).toBe(400);
    expect(markPaid).not.toHaveBeenCalled();
  });

  it("rejects a body edited after signing", async () => {
    const raw = JSON.stringify(paidEvent);
    const signature = createHmac("sha256", fakeEnv.razorpayWebhookSecret).update(raw).digest("hex");
    const tampered = JSON.stringify({
      ...paidEvent,
      payload: { payment: { entity: { id: "pay_other", order_id: "order_other" } } },
    });
    const response = await POST(
      new Request("https://store.kheelona.com/api/razorpay/webhook", {
        method: "POST",
        headers: { "x-razorpay-signature": signature, "x-razorpay-event-id": "evt_1" },
        body: tampered,
      }),
    );
    expect(response.status).toBe(400);
    expect(markPaid).not.toHaveBeenCalled();
  });

  it("marks the order paid and sends both emails", async () => {
    const response = await deliver(paidEvent);
    expect(response.status).toBe(200);
    expect(markPaid.mock.calls[0][1]).toMatchObject({
      rzpOrderId: "order_abc",
      paymentId: "pay_xyz",
    });
    expect(notifyPaid).toHaveBeenCalledWith(fakeEnv, order);
  });

  /* F-06. The handler's job here is only to hand the captured amount on;
     refusing a short one is markPaid's, and fulfil.test.ts owns that. */
  it("passes the captured amount through, so an order cannot be paid by less", async () => {
    markPaid.mockResolvedValue({ outcome: "paid", order });
    await deliver({
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_xyz", order_id: "order_abc", amount: 49_900 } } },
    });
    expect(markPaid.mock.calls[0][1]).toMatchObject({ paidPaise: 49_900 });
  });

  it("falls back to the order's amount_paid when there is no payment entity", async () => {
    markPaid.mockResolvedValue({ outcome: "paid", order });
    await deliver({
      event: "order.paid",
      payload: { order: { entity: { id: "order_abc", amount_paid: 799_900 } } },
    });
    expect(markPaid.mock.calls[0][1]).toMatchObject({ paidPaise: 799_900 });
  });

  it("answers 200 on a refused short payment, since a retry would repeat it", async () => {
    markPaid.mockResolvedValue({ outcome: "short-paid" });
    const response = await deliver({
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_xyz", order_id: "order_abc", amount: 100 } } },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ note: "short-paid" });
    /* Nothing is sent to a customer for money we refused to record. */
    expect(notifyPaid).not.toHaveBeenCalled();
  });

  it("finds the order id in an order.paid payload too, not only a payment one", async () => {
    await deliver({ event: "order.paid", payload: { order: { entity: { id: "order_zzz" } } } });
    expect(markPaid.mock.calls[0][1]).toMatchObject({
      rzpOrderId: "order_zzz",
      paymentId: null,
    });
  });

  /* Razorpay retries until it gets a 2xx, so a repeat delivery is normal
     traffic. It must not email a parent twice. */
  it("does nothing on a repeat delivery, and still answers 200", async () => {
    results["webhook_events.insert"] = { data: null, error: { code: "23505" } };
    const response = await deliver(paidEvent);
    expect(response.status).toBe(200);
    expect(markPaid).not.toHaveBeenCalled();
    expect(notifyPaid).not.toHaveBeenCalled();
  });

  it("sends no second email when the browser callback already recorded it", async () => {
    markPaid.mockResolvedValue({ outcome: "already" });
    const response = await deliver(paidEvent);
    expect(response.status).toBe(200);
    expect(notifyPaid).not.toHaveBeenCalled();
  });

  it("records events it does not act on, without acting on them", async () => {
    const response = await deliver({ event: "payment.failed", payload: {} });
    expect(response.status).toBe(200);
    expect(markPaid).not.toHaveBeenCalled();
    // but the delivery IS in the audit trail
    expect(calls.some((c) => c.table === "webhook_events" && c.method === "insert")).toBe(true);
  });

  /* The failure that matters most: if we claim an event and then fail, the claim
     must be released, or the retry is swallowed and a paid order is lost. */
  it("releases its claim and asks for a retry when processing fails", async () => {
    markPaid.mockRejectedValue(new Error("database gone"));
    const response = await deliver(paidEvent);
    expect(response.status).toBe(500);
    expect(calls.some((c) => c.table === "webhook_events" && c.method === "delete")).toBe(true);
  });

  it("asks for a retry rather than dropping a delivery that arrives too early", async () => {
    storeEnv.mockReturnValue(null);
    expect((await deliver(paidEvent)).status).toBe(503);
  });

  it("refuses a delivery with no event id, since it cannot be deduplicated", async () => {
    const raw = JSON.stringify(paidEvent);
    const signature = createHmac("sha256", fakeEnv.razorpayWebhookSecret).update(raw).digest("hex");
    const response = await POST(
      new Request("https://store.kheelona.com/api/razorpay/webhook", {
        method: "POST",
        headers: { "x-razorpay-signature": signature },
        body: raw,
      }),
    );
    expect(response.status).toBe(400);
  });
});

/**
 * The dispatch queue is literally `where status = 'paid'`, so an order that was
 * refunded and left as paid is a Lumi shipped to someone who cancelled, plus an
 * invoice for ₹4,500. Before this handler existed, the only thing preventing that
 * was somebody remembering to run an UPDATE by hand every single time.
 */
describe("refunds leave the dispatch queue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calls = [];
    results = { "webhook_events.insert": { data: null, error: null } };
    storeEnv.mockReturnValue(fakeEnv);
    markRefunded.mockResolvedValue("refunded");
  });

  const refundEvent = {
    event: "refund.processed",
    payload: { refund: { entity: { id: "rfnd_1", payment_id: "pay_xyz", amount: 49_900 } } },
  };

  it("marks a fully refunded order refunded", async () => {
    const response = await deliver(refundEvent, { eventId: "evt_refund_1" });
    expect(response.status).toBe(200);
    expect(markRefunded).toHaveBeenCalledWith(fakeEnv, {
      paymentId: "pay_xyz",
      refundedPaise: 49_900,
    });
    // a refund is not a payment: nobody gets a second receipt
    expect(notifyPaid).not.toHaveBeenCalled();
  });

  /* refund.created is only the instruction. Acting on it would clear an order
     before the money has actually left our account. */
  it("ignores refund.created, and acts only once the refund is processed", async () => {
    const response = await deliver(
      { event: "refund.created", payload: { refund: { entity: { payment_id: "pay_xyz", amount: 49_900 } } } },
      { eventId: "evt_refund_created" },
    );
    expect(response.status).toBe(200);
    expect(markRefunded).not.toHaveBeenCalled();
  });

  it("passes the refunded amount through, so a partial refund can be told apart", async () => {
    /* Not hypothetical: the first refund this store ever issued was ₹489 of ₹499.
       If any refund cleared an order, a ₹10 goodwill refund would silently cancel
       a live pre-order. */
    markRefunded.mockResolvedValue("partial");
    const response = await deliver(
      { event: "refund.processed", payload: { refund: { entity: { payment_id: "pay_xyz", amount: 48_900 } } } },
      { eventId: "evt_refund_partial" },
    );
    expect(response.status).toBe(200);
    expect(markRefunded.mock.calls[0][1].refundedPaise).toBe(48_900);
    expect((await response.json()) as { note: string }).toMatchObject({ note: "partial" });
  });

  it("survives a refund event with no payment id", async () => {
    const response = await deliver(
      { event: "refund.processed", payload: { refund: { entity: { amount: 100 } } } },
      { eventId: "evt_refund_noid" },
    );
    expect(response.status).toBe(200);
    expect(markRefunded).not.toHaveBeenCalled();
  });
});

describe("failed payments are recorded", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calls = [];
    results = { "webhook_events.insert": { data: null, error: null } };
    storeEnv.mockReturnValue(fakeEnv);
  });

  /* Separates "tried to pay us and the card was declined" from "filled the form
     and never came back". Two different follow-up conversations. */
  it("marks the order failed without touching a paid one", async () => {
    const response = await deliver(
      { event: "payment.failed", payload: { payment: { entity: { id: "pay_f", order_id: "order_abc" } } } },
      { eventId: "evt_failed_1" },
    );
    expect(response.status).toBe(200);
    expect(markFailed).toHaveBeenCalledWith(fakeEnv, "order_abc");
    expect(markPaid).not.toHaveBeenCalled();
  });
});

describe("orphan recovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calls = [];
    results = { "webhook_events.insert": { data: null, error: null } };
    storeEnv.mockReturnValue(fakeEnv);
    markPaid.mockResolvedValue({ outcome: "paid", order });
  });

  /* create-order writes our row, then creates the gateway order, then attaches
     its id. If that last step fails, a real payment arrives for an order id we
     have no row for. Our own reference travels in the Razorpay order's notes and
     receipt, so it is passed through as the fallback. */
  it("passes our own reference from the order notes", async () => {
    await deliver(
      {
        event: "order.paid",
        payload: { order: { entity: { id: "order_abc", notes: { order_ref: "KH-A2B3-C4D5" } } } },
      },
      { eventId: "evt_orphan_notes" },
    );
    expect(markPaid.mock.calls[0][1].orderRef).toBe("KH-A2B3-C4D5");
  });

  it("falls back to the receipt when notes are absent", async () => {
    await deliver(
      { event: "order.paid", payload: { order: { entity: { id: "order_abc", receipt: "KH-Z9Y8-X7W6" } } } },
      { eventId: "evt_orphan_receipt" },
    );
    expect(markPaid.mock.calls[0][1].orderRef).toBe("KH-Z9Y8-X7W6");
  });

  it("passes null when Razorpay gives us nothing to recover from", async () => {
    await deliver(paidEvent, { eventId: "evt_orphan_none" });
    expect(markPaid.mock.calls[0][1].orderRef).toBeNull();
  });
});
