import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, firstArg, type RecordedCall } from "../../../../../test/helpers/fake-supabase";
import { signAddressToken } from "@/lib/store/signing";
import { resetRateLimits } from "@/lib/store/rate-limit";

/**
 * The address route holds a family's home address, and there are no accounts
 * here, so the signed token is the whole of the authorisation. Getting it wrong
 * is not a billing bug, it is showing a stranger where a child lives.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown }> = {};

const storeEnv = vi.hoisted(() => vi.fn());
vi.mock("@/lib/store/env", () => ({ storeEnv }));
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));

const { POST } = await import("./route");

const REF = "KH-A2B3-C4D5";
const address = {
  line1: "Flat 4B, Sunrise Apartments",
  line2: "Near the park",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560041",
};

function token(ref = REF, ttlMs = 60_000) {
  return signAddressToken(fakeEnv.signingSecret, ref, Date.now() + ttlMs);
}

function post(body: unknown, ip = "1.2.3.4") {
  return POST(
    new Request("https://store.kheelona.com/api/preorder/address", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/preorder/address", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimits();
    calls = [];
    results = { "preorders.update": { data: { order_ref: REF }, error: null } };
    storeEnv.mockReturnValue(fakeEnv);
  });

  it("saves the address for a valid token", async () => {
    const response = await post({ orderRef: REF, token: token(), ...address });
    expect(response.status).toBe(200);
    expect(firstArg(calls, "preorders", "update")).toEqual({ address });
  });

  it("refuses a token minted for a different order", async () => {
    const response = await post({ orderRef: REF, token: token("KH-Z9Y8-X7W6"), ...address });
    expect(response.status).toBe(403);
    expect(calls.some((c) => c.method === "update")).toBe(false);
  });

  it("refuses an expired token", async () => {
    const response = await post({ orderRef: REF, token: token(REF, -1000), ...address });
    expect(response.status).toBe(403);
  });

  it("refuses a made-up order reference before it reaches a query", async () => {
    const response = await post({ orderRef: "'; drop table preorders; --", token: token(), ...address });
    expect(response.status).toBe(403);
    expect(calls.length).toBe(0);
  });

  /* One message for wrong-order, bad-signature and expired: a caller poking at
     this must not be able to learn which order references exist. */
  it("gives the same answer whichever way authorisation failed", async () => {
    const wrongOrder = await (await post({ orderRef: REF, token: token("KH-Z9Y8-X7W6"), ...address })).json();
    const expired = await (await post({ orderRef: REF, token: token(REF, -1000), ...address })).json();
    expect(wrongOrder).toEqual(expired);
  });

  it("validates the address on the server, not only in the browser", async () => {
    const response = await post({ orderRef: REF, token: token(), ...address, pincode: "56004" });
    expect(response.status).toBe(422);
    const body = (await response.json()) as { errors: Record<string, string> };
    expect(body.errors.pincode).toBeTruthy();
    expect(calls.some((c) => c.method === "update")).toBe(false);
  });

  it("rejects a state a courier could not read", async () => {
    const response = await post({ orderRef: REF, token: token(), ...address, state: "Karnatka" });
    expect(response.status).toBe(422);
  });

  it("tells them where a human is when the order can no longer be edited", async () => {
    results["preorders.update"] = { data: null, error: null };
    const response = await post({ orderRef: REF, token: token(), ...address });
    expect(response.status).toBe(409);
    expect(((await response.json()) as { message: string }).message).toMatch(/WhatsApp/);
  });

  it("only ever touches orders that are still open", async () => {
    await post({ orderRef: REF, token: token(), ...address });
    const statusFilter = calls.find((c) => c.method === "in");
    expect(statusFilter?.args).toEqual(["status", ["created", "paid"]]);
  });
});
