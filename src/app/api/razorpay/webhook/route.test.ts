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

vi.mock("@/lib/store/env", () => ({ storeEnv }));
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/store/fulfil", () => ({ markPaid, notifyPaid }));

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
    expect(markPaid.mock.calls[0][1]).toEqual({ rzpOrderId: "order_abc", paymentId: "pay_xyz" });
    expect(notifyPaid).toHaveBeenCalledWith(fakeEnv, order);
  });

  it("finds the order id in an order.paid payload too, not only a payment one", async () => {
    await deliver({ event: "order.paid", payload: { order: { entity: { id: "order_zzz" } } } });
    expect(markPaid.mock.calls[0][1]).toEqual({ rzpOrderId: "order_zzz", paymentId: null });
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
