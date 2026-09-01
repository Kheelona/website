import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fbTrack, purchaseEventId, whenFbqReady } from "./fbq";

/** The pixel is absent far more often than it is present: localhost, previews,
 *  every test, and the first moments of a production page load. So what these
 *  pin is mostly the ABSENT case, which is where a mistake is silent. */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

afterEach(() => {
  delete window.fbq;
  vi.useRealTimers();
});

describe("fbTrack", () => {
  it("does nothing at all when the pixel is absent", () => {
    expect(() => fbTrack("ViewContent")).not.toThrow();
  });

  it("forwards the event name and params to fbq", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    fbTrack("Purchase", { currency: "INR", value: 499 });
    expect(fbq).toHaveBeenCalledWith("track", "Purchase", { currency: "INR", value: 499 }, undefined);
  });

  /* The slot that lets the Conversions API be added later without editing a
     single call site: Meta deduplicates a server-side copy by matching eventID. */
  it("passes an eventID only when one is given", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    fbTrack("Purchase", undefined, "KH-ABCD-1234");
    expect(fbq).toHaveBeenCalledWith("track", "Purchase", undefined, { eventID: "KH-ABCD-1234" });
  });
});

describe("whenFbqReady", () => {
  beforeEach(() => vi.useFakeTimers());

  it("runs immediately when fbq is already there", () => {
    window.fbq = vi.fn();
    const cb = vi.fn();
    whenFbqReady(cb);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  /* The whole reason this helper exists. A mount-time event would otherwise be
     dropped, because the pixel is gated behind an effect and then loads
     afterInteractive, so it arrives AFTER other components have mounted. */
  it("waits for a pixel that arrives late, then fires once", () => {
    const cb = vi.fn();
    whenFbqReady(cb);
    expect(cb).not.toHaveBeenCalled();

    vi.advanceTimersByTime(600);
    expect(cb).not.toHaveBeenCalled();

    window.fbq = vi.fn();
    vi.advanceTimersByTime(200);
    expect(cb).toHaveBeenCalledTimes(1);

    // and never again
    vi.advanceTimersByTime(5000);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("gives up instead of polling forever where the gate stays shut", () => {
    const cb = vi.fn();
    whenFbqReady(cb, { timeoutMs: 1000, intervalMs: 100 });
    vi.advanceTimersByTime(60_000);
    expect(cb).not.toHaveBeenCalled();
  });

  it("stops polling when cancelled, which is what React cleanup does", () => {
    const cb = vi.fn();
    const cancel = whenFbqReady(cb);
    cancel();
    window.fbq = vi.fn();
    vi.advanceTimersByTime(5000);
    expect(cb).not.toHaveBeenCalled();
  });
});

describe("purchaseEventId", () => {
  /* The contract that makes Conversions API de-duplication possible: the
     browser and the Razorpay webhook each derive this alone, from the one
     thing they both hold. */
  it("derives a stable id from the order reference", () => {
    expect(purchaseEventId("KH-KZYJ-PEHT")).toBe("purchase_KH-KZYJ-PEHT");
  });

  it("is pure, so both sides always agree", () => {
    expect(purchaseEventId("KH-AAAA-BBBB")).toBe(purchaseEventId("KH-AAAA-BBBB"));
    expect(purchaseEventId("KH-AAAA-BBBB")).not.toBe(purchaseEventId("KH-AAAA-BBBC"));
  });
});
