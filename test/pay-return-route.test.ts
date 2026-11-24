import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { routeForHost } from "@/lib/store/host";
import { resetRateLimits } from "@/lib/store/rate-limit";
import { THANKS_COOKIE, formatThanksSession } from "@/lib/store/thanks-session";
import { verifyAddressToken } from "@/lib/store/signing";

/**
 * POST /pay/return: where Razorpay's redirect flow sends an in-app browser after the page is gone (D070 / B2, K-172;
 * output/2026-W48/engineering/B2-spec.md acceptance 2).
 *
 * The frozen helpers are mocked where they would touch a service (the environment, the database, fulfilment: `markPaid`,
 * `notifyPaid`), and used for real where they are pure (the checkout signature check, the address token, the proxy's
 * claim rule), so a Location this route answers is proven to be one the proxy accepts. Fake secrets and fake ids only;
 * nothing is sent anywhere. Every expectation is a literal written from the spec.
 */

const SECRET = "test_key_secret_for_unit_tests_only";
const SIGNING = "test_signing_secret_for_unit_tests_only_0123456789";
const ORDER_ID = "order_PROBE000000001";
const PAYMENT_ID = "pay_PROBE000000001";
const ORDER_REF = "KH-A2B3-C4D5";

const fakeEnv = {
  razorpayKeyId: "rzp_test_probe",
  razorpayKeySecret: SECRET,
  razorpayWebhookSecret: "hook",
  supabaseUrl: "http://127.0.0.1:9",
  supabaseServiceKey: "service",
  signingSecret: SIGNING,
};

const mocks = vi.hoisted(() => ({
  storeEnv: vi.fn(),
  markPaid: vi.fn(),
  notifyPaid: vi.fn(),
  lookup: vi.fn(),
}));

vi.mock("@/lib/store/env", () => ({ storeEnv: mocks.storeEnv }));
vi.mock("@/lib/store/fulfil", () => ({ markPaid: mocks.markPaid, notifyPaid: mocks.notifyPaid }));
vi.mock("@/lib/store/db", () => ({
  db: () => ({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.lookup }) }) }) }),
}));

import { GET, POST } from "@/app/store/pay/return/route";

const sign = (orderId: string, paymentId: string) => createHmac("sha256", SECRET).update(`${orderId}|${paymentId}`).digest("hex");

function post(fields: Record<string, string>, ip = "203.0.113.7"): Request {
  return new Request("https://store.kheelona.com/pay/return", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "x-real-ip": ip },
    body: new URLSearchParams(fields),
  });
}
const success = (over: Record<string, string> = {}) => ({
  razorpay_payment_id: PAYMENT_ID,
  razorpay_order_id: ORDER_ID,
  razorpay_signature: sign(ORDER_ID, PAYMENT_ID),
  ...over,
});

function expectPrivate(response: Response) {
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
}
function expectBackToStore(response: Response) {
  expect(response.status).toBe(303);
  expect(response.headers.get("location")).toBe("/");
  expectPrivate(response);
}

beforeEach(() => {
  resetRateLimits();
  vi.restoreAllMocks();
  mocks.storeEnv.mockReset().mockReturnValue(fakeEnv);
  mocks.markPaid.mockReset();
  mocks.notifyPaid.mockReset().mockResolvedValue(undefined);
  mocks.lookup.mockReset();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /pay/return: a verified payment", () => {
  it("marks it paid, notifies once, and 303s to a RELATIVE /thanks?ref&t that the proxy accepts as a claim", async () => {
    mocks.markPaid.mockResolvedValue({ outcome: "paid", order: { order_ref: ORDER_REF } });
    const response = await POST(post(success()));

    expect(mocks.markPaid).toHaveBeenCalledWith(fakeEnv, { rzpOrderId: ORDER_ID, paymentId: PAYMENT_ID });
    expect(mocks.notifyPaid).toHaveBeenCalledTimes(1);
    expect(mocks.notifyPaid).toHaveBeenCalledWith(fakeEnv, { order_ref: ORDER_REF });

    expect(response.status).toBe(303);
    expectPrivate(response);
    const location = response.headers.get("location")!;
    expect(location.startsWith("/thanks?ref=KH-A2B3-C4D5&t=")).toBe(true); // relative: no scheme, no host
    expect(location).not.toMatch(/^https?:/);

    const url = new URL(location, "https://store.kheelona.com");
    const token = url.searchParams.get("t")!;
    expect(verifyAddressToken(SIGNING, ORDER_REF, token)).toBe(true);
    // The proxy turns it into the kh_order cookie and a clean /thanks (F-01).
    const claim = routeForHost("store.kheelona.com", url.pathname, url.search);
    expect(claim).toEqual({ kind: "claim", path: "/thanks", session: formatThanksSession(ORDER_REF, token) });
    expect(THANKS_COOKIE).toBe("kh_order");
  });

  it("is idempotent: when the webhook got there first it does not notify again, and still reaches /thanks", async () => {
    mocks.markPaid.mockResolvedValue({ outcome: "already" });
    mocks.lookup.mockResolvedValue({ data: { order_ref: ORDER_REF }, error: null });
    const response = await POST(post(success()));

    expect(mocks.notifyPaid).not.toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get("location")!.startsWith("/thanks?ref=KH-A2B3-C4D5&t=")).toBe(true);
    expectPrivate(response);
  });

  it("a payment it cannot record (the database is down) goes to the store page, where the recovery asks again", async () => {
    mocks.markPaid.mockRejectedValue(new Error("db down"));
    const response = await POST(post(success()));
    expectBackToStore(response);
    expect(mocks.notifyPaid).not.toHaveBeenCalled();
  });

  it.each([
    ["not-payable", { outcome: "not-payable", status: "refunded" }],
    ["short-paid", { outcome: "short-paid" }],
    ["unknown", { outcome: "unknown" }],
  ])("%s outcome: no notification, back to the store page", async (_name, result) => {
    mocks.markPaid.mockResolvedValue(result);
    const response = await POST(post(success()));
    expectBackToStore(response);
    expect(mocks.notifyPaid).not.toHaveBeenCalled();
  });
});

describe("POST /pay/return: anything that is not a verified payment", () => {
  it("a bad signature goes to / and marks nothing", async () => {
    const response = await POST(post(success({ razorpay_signature: "0".repeat(64) })));
    expectBackToStore(response);
    expect(mocks.markPaid).not.toHaveBeenCalled();
  });

  it("a signature made for another payment id is refused", async () => {
    const response = await POST(post(success({ razorpay_payment_id: "pay_OTHER00000001" })));
    expectBackToStore(response);
    expect(mocks.markPaid).not.toHaveBeenCalled();
  });

  it.each(["razorpay_payment_id", "razorpay_order_id", "razorpay_signature"])("missing %s goes to /", async (missing) => {
    const fields = success();
    delete (fields as Record<string, string>)[missing];
    expectBackToStore(await POST(post(fields)));
    expect(mocks.markPaid).not.toHaveBeenCalled();
  });

  it("an order id that is not Razorpay's shape goes to /", async () => {
    const response = await POST(post(success({ razorpay_order_id: "order_x", razorpay_signature: sign("order_x", PAYMENT_ID) })));
    expectBackToStore(response);
    expect(mocks.markPaid).not.toHaveBeenCalled();
  });

  it("Razorpay's failure post (error[...]) goes to /, even beside valid-looking fields", async () => {
    const failure = {
      "error[code]": "BAD_REQUEST_ERROR",
      "error[description]": "Payment failed",
      "error[source]": "customer",
      "error[reason]": "payment_failed",
      "error[metadata]": JSON.stringify({ order_id: ORDER_ID }),
    };
    expectBackToStore(await POST(post(failure)));
    expectBackToStore(await POST(post({ ...success(), ...failure })));
    expect(mocks.markPaid).not.toHaveBeenCalled();
  });

  it("an unreadable body goes to /", async () => {
    const request = new Request("https://store.kheelona.com/pay/return", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": "203.0.113.8" },
      body: "{not a form",
    });
    expectBackToStore(await POST(request));
  });

  it("GET goes to / with the same private, unindexed headers", () => {
    expectBackToStore(GET());
  });

  it("a store that is not switched on goes to /", async () => {
    mocks.storeEnv.mockReturnValue(null);
    expectBackToStore(await POST(post(success())));
    expect(mocks.markPaid).not.toHaveBeenCalled();
  });

  it("is rate limited like confirm (8 a minute for one address); the ninth goes to / without being processed", async () => {
    mocks.markPaid.mockResolvedValue({ outcome: "paid", order: { order_ref: ORDER_REF } });
    for (let i = 0; i < 8; i += 1) expect((await POST(post(success(), "198.51.100.9"))).headers.get("location")).toMatch(/^\/thanks/);
    const ninth = await POST(post(success(), "198.51.100.9"));
    expectBackToStore(ninth);
    expect(mocks.markPaid).toHaveBeenCalledTimes(8);
  });

  it("never logs a payment id, a signature or free text", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await POST(post(success({ razorpay_signature: "0".repeat(64) })));
    await POST(post({ "error[description]": "Jane Doe's card was declined" }, "203.0.113.9"));
    const logged = JSON.stringify(warn.mock.calls);
    expect(logged).toContain(ORDER_ID);
    expect(logged).not.toContain(PAYMENT_ID);
    expect(logged).not.toContain("0".repeat(64));
    expect(logged).not.toContain("Jane Doe");
  });
});
