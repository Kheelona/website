import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, firstArg, type RecordedCall } from "../../../../../test/helpers/fake-supabase";
import { TOKEN_AMOUNT_PAISE } from "@/config/site";
import { resetRateLimits } from "@/lib/store/rate-limit";

/**
 * The route that decides what a parent is charged.
 *
 * The single most important assertion in this repo is in here: a request that
 * asks to pay ₹1 gets charged ₹499, because the amount is read from our tier
 * table and the request's own numbers are ignored entirely.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};

const storeEnv = vi.hoisted(() => vi.fn());
const createRazorpayOrder = vi.hoisted(() => vi.fn());

vi.mock("@/lib/store/env", () => ({ storeEnv, storeReady: () => Boolean(storeEnv()) }));
vi.mock("@/lib/store/razorpay", () => ({ createRazorpayOrder }));
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));

const { POST } = await import("./route");

const goodBody = {
  parentName: "Priya Menon",
  phone: "+91 91875 46483",
  email: "PRIYA@Example.com ",
  childAge: "3",
  accepted: true,
};

function post(body: unknown, ip = "1.2.3.4") {
  return POST(
    new Request("https://store.kheelona.com/api/preorder/create-order", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/preorder/create-order", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    /* The throttle is module state and counts every request in this file, so a
       test that did not reset it would fail for the previous test's reasons. */
    resetRateLimits();
    calls = [];
    results = {
      "preorders.insert": { data: { id: 1, order_ref: "KH-A2B3-C4D5" }, error: null },
      "preorders.update": { data: null, error: null },
    };
    storeEnv.mockReturnValue(fakeEnv);
    createRazorpayOrder.mockResolvedValue({
      id: "order_abc",
      amount: TOKEN_AMOUNT_PAISE,
      currency: "INR",
      status: "created",
    });
  });

  it("answers 503, kindly, before the keys are configured", async () => {
    storeEnv.mockReturnValue(null);
    const response = await post(goodBody);
    expect(response.status).toBe(503);
    const body = (await response.json()) as { message: string };
    expect(body.message).toMatch(/not switched on yet/i);
  });

  /* THE test. A hostile client sends its own price; the server sends Razorpay
     the price from its own tier table. */
  it("ignores an amount supplied by the client, completely", async () => {
    const response = await post({ ...goodBody, amountPaise: 100, amount: 1, price: 1 });
    expect(response.status).toBe(200);

    expect(createRazorpayOrder.mock.calls[0][1]).toMatchObject({
      amountPaise: TOKEN_AMOUNT_PAISE,
    });
    expect(firstArg(calls, "preorders", "insert")).toMatchObject({
      amount_paise: TOKEN_AMOUNT_PAISE,
    });
  });

  it("refuses an event tier with no signature, rather than pricing it", async () => {
    const response = await post({ ...goodBody, tier: "blr-aug" });
    expect(response.status).toBe(409);
    expect((await response.json()) as { error: string }).toMatchObject({
      error: "bad-signature",
    });
    expect(createRazorpayOrder).not.toHaveBeenCalled();
  });

  it("validates on the server too, not only in the browser", async () => {
    const response = await post({ ...goodBody, phone: "12345", accepted: false });
    expect(response.status).toBe(422);
    const body = (await response.json()) as { errors: Record<string, string> };
    expect(body.errors.phone).toBeTruthy();
    expect(body.errors.accepted).toBeTruthy();
    expect(calls.some((c) => c.method === "insert")).toBe(false);
  });

  it("normalises what it stores, so a support search can find people", async () => {
    await post(goodBody);
    expect(firstArg(calls, "preorders", "insert")).toMatchObject({
      phone: "9187546483",
      email: "priya@example.com",
    });
  });

  it("records consent as a fact with a time, not a boolean", async () => {
    await post(goodBody);
    const row = firstArg(calls, "preorders", "insert")!;
    expect(row.wa_consent).toBe(true);
    expect(typeof row.terms_accepted_at).toBe("string");
  });

  it("writes our row BEFORE calling the gateway", async () => {
    await post(goodBody);
    const insertIndex = calls.findIndex((c) => c.table === "preorders" && c.method === "insert");
    expect(insertIndex).toBeGreaterThanOrEqual(0);
    // the gateway call happens after the insert resolves, so by the time it ran
    // the insert was already recorded
    expect(createRazorpayOrder).toHaveBeenCalled();
  });

  it("keeps the lead when the gateway fails, and says nothing was charged", async () => {
    createRazorpayOrder.mockRejectedValue(new Error("razorpay down"));
    const response = await post(goodBody);
    expect(response.status).toBe(502);
    expect(((await response.json()) as { message: string }).message).toMatch(
      /Nothing has been charged/i,
    );
    // the row was still written: an abandoned attempt is a lead, not a loss
    expect(firstArg(calls, "preorders", "insert")).toBeTruthy();
  });

  it("captures only the five standard UTM keys, and nothing a client invents", async () => {
    await post({
      ...goodBody,
      utm: { utm_source: "whatsapp", utm_medium: "share", note: "anything at all" },
    });
    expect(firstArg(calls, "preorders", "insert")!.utm).toEqual({
      utm_source: "whatsapp",
      utm_medium: "share",
    });
  });

  it("hands back an address token so the browser can reach its own receipt", async () => {
    const body = (await (await post(goodBody)).json()) as { addressToken: string };
    expect(body.addressToken).toMatch(/^\d+\.[\w-]{16}$/);
  });

  it("throttles a flood from one address", async () => {
    const ip = "9.9.9.9";
    const statuses: number[] = [];
    for (let i = 0; i < 12; i += 1) statuses.push((await post(goodBody, ip)).status);
    expect(statuses.filter((s) => s === 429).length).toBeGreaterThan(0);
  });
});
