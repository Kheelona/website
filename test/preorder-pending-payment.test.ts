import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PENDING_KEY,
  PENDING_TTL_MS,
  clearPaymentSession,
  clearPending,
  confirmThenGoToThanks,
  fetchPayStatus,
  readPending,
  savePending,
} from "@/features/preorder/components/pending-payment";
import { DRAFT_KEY } from "@/features/preorder/components/form-draft";

/**
 * The payment this tab started, kept in this tab (D070 / B2, K-172; output/2026-W48/engineering/B2-spec.md acceptance 3).
 * Literal expectations from the spec: key `kh_preorder_pending`, `{ v, orderRef, rzpOrderId, tier, createdAt }`, nothing
 * else (no token, no personal data, no amount), gone after two hours.
 */

const ENTRY = { orderRef: "KH-A2B3-C4D5", rzpOrderId: "order_PROBE000000001", tier: "launch" };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("the pending entry", () => {
  it("is written under kh_preorder_pending with exactly the five fields", () => {
    savePending(ENTRY);
    expect(PENDING_KEY).toBe("kh_preorder_pending");
    const raw = JSON.parse(sessionStorage.getItem("kh_preorder_pending")!);
    expect(Object.keys(raw).sort()).toEqual(["createdAt", "orderRef", "rzpOrderId", "tier", "v"]);
    expect(raw).toMatchObject({ v: 1, ...ENTRY });
    expect(typeof raw.createdAt).toBe("number");
    expect(sessionStorage.length).toBe(1);
    expect(localStorage.getItem("kh_preorder_pending")).toBeNull();
  });

  it("reads back what was saved, and clears", () => {
    savePending(ENTRY);
    expect(readPending()).toMatchObject(ENTRY);
    clearPending();
    expect(readPending()).toBeNull();
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("expires after two hours and is deleted when read late", () => {
    savePending(ENTRY);
    const createdAt = readPending()!.createdAt;
    expect(PENDING_TTL_MS).toBe(2 * 60 * 60 * 1000);
    expect(readPending(createdAt + 119 * 60_000)).not.toBeNull();
    expect(readPending(createdAt + 121 * 60_000)).toBeNull();
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it.each([
    ["not JSON", "{nope"],
    ["the wrong version", JSON.stringify({ v: 2, ...ENTRY, createdAt: Date.now() })],
    ["a missing field", JSON.stringify({ v: 1, orderRef: ENTRY.orderRef, tier: "launch", createdAt: Date.now() })],
    ["a future date", JSON.stringify({ v: 1, ...ENTRY, createdAt: Date.now() + 3_600_000 })],
    ["null", "null"],
  ])("deletes %s instead of trusting it", (_name, raw) => {
    sessionStorage.setItem(PENDING_KEY, raw);
    expect(readPending()).toBeNull();
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("clearPaymentSession removes this entry and B3's saved details, nothing else", () => {
    savePending(ENTRY);
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ v: 1 }));
    sessionStorage.setItem("something_else", "keep");
    clearPaymentSession();
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(sessionStorage.getItem("something_else")).toBe("keep");
  });

  it("with storage blocked, nothing throws and nothing is remembered", () => {
    const blocked = vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => savePending(ENTRY)).not.toThrow();
    expect(() => clearPending()).not.toThrow();
    expect(readPending()).toBeNull();
    blocked.mockRestore();
  });
});

describe("fetchPayStatus", () => {
  const answer = (body: unknown, status = 200) => vi.fn(async () => new Response(JSON.stringify(body), { status }));

  it("posts the pair as JSON to /pay/status and returns paid, open or closed", async () => {
    const fetchMock = answer({ status: "paid" });
    vi.stubGlobal("fetch", fetchMock);
    expect(await fetchPayStatus(ENTRY)).toEqual({ status: "paid" });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/pay/status");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ orderRef: ENTRY.orderRef, rzpOrderId: ENTRY.rzpOrderId });

    vi.stubGlobal("fetch", answer({ status: "open", keyId: "rzp_test_x", amountPaise: 49_900 }));
    expect(await fetchPayStatus(ENTRY)).toEqual({ status: "open", keyId: "rzp_test_x", amountPaise: 49_900 });
    vi.stubGlobal("fetch", answer({ status: "closed" }));
    expect(await fetchPayStatus(ENTRY)).toEqual({ status: "closed" });
  });

  it.each([
    ["a 503", answer({ error: "unavailable" }, 503)],
    ["a 429", answer({ error: "too-many" }, 429)],
    ["an open answer without a key", answer({ status: "open", amountPaise: 49_900 })],
    ["an open answer with a fractional amount", answer({ status: "open", keyId: "k", amountPaise: 1.5 })],
    ["an unknown status", answer({ status: "banana" })],
    ["a network failure", vi.fn(async () => Promise.reject(new TypeError("offline")))],
  ])("%s is no answer (null), so the caller changes nothing", async (_name, fetchMock) => {
    vi.stubGlobal("fetch", fetchMock);
    expect(await fetchPayStatus(ENTRY)).toBeNull();
  });
});

describe("confirmThenGoToThanks (a resumed payment made in the page's own window)", () => {
  const PAID = { razorpay_order_id: "order_PROBE000000001", razorpay_payment_id: "pay_PROBE000000001", razorpay_signature: "sig_probe" };
  let assign: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    assign = vi.fn();
    vi.stubGlobal("location", { ...window.location, assign });
  });
  const noWait = async () => {};

  it("confirms with keepalive, then asks the status (which sets the cookie), then goes to a clean /thanks", async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url === "/pay/status" ? new Response(JSON.stringify({ status: "paid" })) : new Response(JSON.stringify({ ok: true })),
    );
    vi.stubGlobal("fetch", fetchMock);
    await confirmThenGoToThanks(PAID, ENTRY, noWait);

    const urls = fetchMock.mock.calls.map(([url]) => url);
    expect(urls).toEqual(["/api/preorder/confirm", "/pay/status"]);
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.keepalive).toBe(true);
    expect(JSON.parse(init.body as string)).toEqual({
      razorpayOrderId: "order_PROBE000000001",
      razorpayPaymentId: "pay_PROBE000000001",
      razorpaySignature: "sig_probe",
    });
    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith("/thanks");
  });

  it("when the order is not yet paid it asks up to three times, then goes to /thanks anyway", async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url === "/pay/status" ? new Response(JSON.stringify({ status: "open", keyId: "k", amountPaise: 1 })) : Promise.reject(new TypeError("offline")),
    );
    vi.stubGlobal("fetch", fetchMock);
    await confirmThenGoToThanks(PAID, ENTRY, noWait);
    expect(fetchMock.mock.calls.filter(([url]) => url === "/pay/status")).toHaveLength(3);
    expect(assign).toHaveBeenCalledWith("/thanks");
  });
});
