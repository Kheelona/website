import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimits } from "@/lib/store/rate-limit";
import { THANKS_COOKIE, parseThanksSession } from "@/lib/store/thanks-session";
import { verifyAddressToken } from "@/lib/store/signing";

/**
 * POST /pay/status: what became of the payment this tab started (D070 / B2, K-172; output/2026-W48/engineering/B2-spec.md
 * acceptance 3). The environment and the database are mocked; the shape checks, the signing and the cookie helpers are the
 * real ones. Fake secrets and ids only. Every expectation is a literal written from the spec.
 */

const SIGNING = "test_signing_secret_for_unit_tests_only_0123456789";
const ORDER_REF = "KH-A2B3-C4D5";
const RZP_ID = "order_PROBE000000001";
const fakeEnv = {
  razorpayKeyId: "rzp_test_probe",
  razorpayKeySecret: "secret",
  razorpayWebhookSecret: "hook",
  supabaseUrl: "http://127.0.0.1:9",
  supabaseServiceKey: "service",
  signingSecret: SIGNING,
};

const mocks = vi.hoisted(() => ({ storeEnv: vi.fn(), lookup: vi.fn(), eq: vi.fn() }));
vi.mock("@/lib/store/env", () => ({ storeEnv: mocks.storeEnv }));
vi.mock("@/lib/store/db", () => {
  const builder: Record<string, unknown> = {};
  builder.select = () => builder;
  builder.eq = (column: string, value: string) => {
    mocks.eq(column, value);
    return builder;
  };
  builder.maybeSingle = mocks.lookup;
  return { db: () => ({ from: () => builder }) };
});

import { POST } from "@/app/store/pay/status/route";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const row = (over: Record<string, unknown> = {}) => ({
  data: { order_ref: ORDER_REF, status: "created", amount_paise: 49_900, created_at: minutesAgo(10), ...over },
  error: null,
});

function ask(body: unknown, headers: Record<string, string> = {}, ip = "203.0.113.7"): Request {
  return new Request("https://store.kheelona.com/pay/status", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": ip, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
const pair = { orderRef: ORDER_REF, rzpOrderId: RZP_ID };

function expectPrivate(response: Response) {
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
}

beforeEach(() => {
  resetRateLimits();
  mocks.storeEnv.mockReset().mockReturnValue(fakeEnv);
  mocks.lookup.mockReset();
  mocks.eq.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /pay/status", () => {
  it("paid: answers { status: paid } and sets the kh_order cookie exactly as the proxy's claim does", async () => {
    mocks.lookup.mockResolvedValue(row({ status: "paid" }));
    const response = await POST(ask(pair, { host: "store.kheelona.com" }));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ status: "paid" });
    expectPrivate(response);

    const cookie = response.headers.get("set-cookie")!;
    expect(cookie).toMatch(new RegExp(`^${THANKS_COOKIE}=`));
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/Secure/i);
    expect(cookie).toMatch(/SameSite=lax/i);
    expect(cookie).toMatch(/Path=\/thanks(;|$)/);
    expect(cookie).toMatch(/Max-Age=7200/i);

    const value = decodeURIComponent(cookie.split(";")[0].slice(THANKS_COOKIE.length + 1));
    const session = parseThanksSession(value)!;
    expect(session.orderRef).toBe(ORDER_REF);
    expect(verifyAddressToken(SIGNING, ORDER_REF, session.token)).toBe(true);
    // The token never appears in the body.
    expect(JSON.stringify(body)).not.toContain(session.token);
  });

  it("paid on a localhost host: the cookie is not Secure (the only place the app is served over http)", async () => {
    mocks.lookup.mockResolvedValue(row({ status: "paid" }));
    const response = await POST(ask(pair, { host: "store.localhost:3468" }));
    expect(response.headers.get("set-cookie")).not.toMatch(/Secure/i);
  });

  it("created: open, with the key and the amount Razorpay needs to reopen the same order, and no cookie", async () => {
    mocks.lookup.mockResolvedValue(row());
    const response = await POST(ask(pair));
    expect(await response.json()).toEqual({ status: "open", keyId: "rzp_test_probe", amountPaise: 49_900 });
    expect(response.headers.get("set-cookie")).toBeNull();
    expectPrivate(response);
  });

  it("looks the order up by BOTH the reference and Razorpay's order id", async () => {
    mocks.lookup.mockResolvedValue(row());
    await POST(ask(pair));
    expect(mocks.eq).toHaveBeenCalledWith("order_ref", ORDER_REF);
    expect(mocks.eq).toHaveBeenCalledWith("rzp_order_id", RZP_ID);
  });

  it.each(["failed", "refunded", "cancelled", "something-new"])("%s: closed", async (status) => {
    mocks.lookup.mockResolvedValue(row({ status }));
    const response = await POST(ask(pair));
    expect(await response.json()).toEqual({ status: "closed" });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("a pair that does not belong to one order (no row): closed, saying nothing about whether either exists", async () => {
    mocks.lookup.mockResolvedValue({ data: null, error: null });
    const response = await POST(ask(pair));
    expect(await response.json()).toEqual({ status: "closed" });
    expectPrivate(response);
  });

  it.each([
    ["created 2 hours ago", row({ created_at: minutesAgo(121), status: "created" })],
    ["paid 2 hours ago", row({ created_at: minutesAgo(121), status: "paid" })],
    ["dated in the future", row({ created_at: minutesAgo(-30) })],
    ["with an unreadable date", row({ created_at: "not a date" })],
  ])("an order %s: closed", async (_name, found) => {
    mocks.lookup.mockResolvedValue(found);
    const response = await POST(ask(pair));
    expect(await response.json()).toEqual({ status: "closed" });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("an order just under two hours old is still answered", async () => {
    mocks.lookup.mockResolvedValue(row({ created_at: minutesAgo(119) }));
    expect((await (await POST(ask(pair))).json()).status).toBe("open");
  });

  it.each([
    ["a reference that is not ours", { orderRef: "KH-0000-0000", rzpOrderId: RZP_ID }],
    ["a Razorpay id of the wrong shape", { orderRef: ORDER_REF, rzpOrderId: "order_short" }],
    ["a Razorpay id that is not a string", { orderRef: ORDER_REF, rzpOrderId: 12345 }],
    ["missing fields", {}],
    ["a SQL-ish reference", { orderRef: "KH-A2B3-C4D5' or '1'='1", rzpOrderId: RZP_ID }],
  ])("%s: closed, and the database is never asked", async (_name, body) => {
    const response = await POST(ask(body));
    expect(await response.json()).toEqual({ status: "closed" });
    expect(mocks.lookup).not.toHaveBeenCalled();
  });

  it("an unreadable body is a 400, private", async () => {
    const response = await POST(ask("{not json"));
    expect(response.status).toBe(400);
    expectPrivate(response);
  });

  it("a store that is not switched on has no orders: closed", async () => {
    mocks.storeEnv.mockReturnValue(null);
    expect(await (await POST(ask(pair))).json()).toEqual({ status: "closed" });
    expect(mocks.lookup).not.toHaveBeenCalled();
  });

  it("a database error is a 503 the client treats as 'ask again later', not as closed", async () => {
    mocks.lookup.mockResolvedValue({ data: null, error: { message: "boom" } });
    const response = await POST(ask(pair));
    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toBeNull();
    expectPrivate(response);
  });

  it("is rate limited: the ninth request in a minute from one address is a 429", async () => {
    mocks.lookup.mockResolvedValue(row());
    for (let i = 0; i < 8; i += 1) expect((await POST(ask(pair, {}, "198.51.100.9"))).status).toBe(200);
    const ninth = await POST(ask(pair, {}, "198.51.100.9"));
    expect(ninth.status).toBe(429);
    expectPrivate(ninth);
    expect(mocks.lookup).toHaveBeenCalledTimes(8);
  });
});
