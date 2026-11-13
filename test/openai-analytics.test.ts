import { beforeEach, describe, expect, it, vi } from "vitest";
import { preorderAnalytics } from "@/features/preorder/lib/analytics";
import { registerPostHog, resetPostHogForTests } from "@/lib/posthog";

/** The funnel's OpenAI Ads events (F6, D069), asserted by behaviour: call each moment and record what every tool
 *  received. The existing frozen funnel test (analytics.test.ts) holds GA4, Meta and PostHog to their names and
 *  payloads; this file holds OpenAI to its own and proves the other three did not move. It is a separate file
 *  because the frozen test files accept only literal-only patches. */

type Call = [string, Record<string, unknown> | undefined];
type Window2 = Window & { oaiq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void };

let gtagCalls: Call[];
let fbqCalls: unknown[][];
let phCalls: Call[];
let oaiqCalls: unknown[][];

beforeEach(() => {
  gtagCalls = [];
  fbqCalls = [];
  phCalls = [];
  oaiqCalls = [];
  resetPostHogForTests();
  const w = window as Window2;
  w.gtag = (...a: unknown[]) => {
    if (a[0] === "event") gtagCalls.push([a[1] as string, a[2] as Record<string, unknown>]);
  };
  window.fbq = (...a: unknown[]) => fbqCalls.push(a);
  w.oaiq = (...a: unknown[]) => oaiqCalls.push(a);
  registerPostHog({
    capture: (e, p) => phCalls.push([e, p]),
    startSessionRecording: () => {},
    stopSessionRecording: () => {},
  });
});

describe("OpenAI Ads funnel events", () => {
  it("beginCheckout sends checkout_started with the order data in paise, and no event id", () => {
    preorderAnalytics.beginCheckout(49_900, "launch");
    expect(oaiqCalls).toEqual([
      [
        "measure",
        "checkout_started",
        {
          type: "contents",
          amount: 49_900,
          currency: "INR",
          contents: [{ id: "khelu-reservation", name: "Khelu reservation", quantity: 1, amount: 49_900, currency: "INR" }],
        },
      ],
    ]);
  });

  it("purchase sends order_created with the raw order reference as its event id", () => {
    preorderAnalytics.purchase("KH-TEST-F6F6", 49_900, "launch");
    expect(oaiqCalls).toEqual([
      [
        "measure",
        "order_created",
        {
          type: "contents",
          amount: 49_900,
          currency: "INR",
          contents: [{ id: "khelu-reservation", name: "Khelu reservation", quantity: 1, amount: 49_900, currency: "INR" }],
        },
        { event_id: "KH-TEST-F6F6" },
      ],
    ]);
  });

  it("the event id is the order reference itself, not Meta's purchase_<ref>", () => {
    preorderAnalytics.purchase("KH-TEST-F6F6", 49_900, "launch");
    const options = oaiqCalls[0][3] as { event_id: string };
    expect(options.event_id).toBe("KH-TEST-F6F6");
    expect(options.event_id).not.toMatch(/^purchase_/);
    expect((phCalls.find((c) => c[0] === "purchase")?.[1] as { transaction_id: string }).transaction_id).toBe(options.event_id);
  });

  it("reports a full payment as its own product, in paise", () => {
    preorderAnalytics.purchase("KH-TEST-F6F6", 799_900, "full");
    const data = oaiqCalls[0][2] as { amount: number; contents: { id: string }[] };
    expect(data.amount).toBe(799_900);
    expect(data.contents[0].id).toBe("khelu-full-payment");
  });

  it("sends nothing to OpenAI for the other funnel moments", () => {
    preorderAnalytics.formStarted("launch");
    preorderAnalytics.start("launch");
    preorderAnalytics.addressSaved("KH-TEST-F6F6");
    preorderAnalytics.dismissed("launch");
    expect(oaiqCalls).toEqual([]);
  });

  it("leaves GA4, Meta and PostHog exactly as they were: same names, parameters and order", () => {
    preorderAnalytics.beginCheckout(49_900, "launch");
    preorderAnalytics.purchase("KH-TEST-F6F6", 49_900, "launch");
    expect(gtagCalls).toEqual([
      ["begin_checkout", { currency: "INR", value: 499, tier: "launch" }],
      ["purchase", { transaction_id: "KH-TEST-F6F6", currency: "INR", value: 499, tier: "launch" }],
    ]);
    expect(fbqCalls).toEqual([
      ["track", "InitiateCheckout", { currency: "INR", value: 499, content_category: "launch" }, undefined],
      [
        "track",
        "Purchase",
        { currency: "INR", value: 499, content_category: "launch", order_id: "KH-TEST-F6F6" },
        { eventID: "purchase_KH-TEST-F6F6" },
      ],
    ]);
    expect(phCalls).toEqual([
      ["begin_checkout", { currency: "INR", value: 499, tier: "launch" }],
      ["purchase", { transaction_id: "KH-TEST-F6F6", currency: "INR", value: 499, tier: "launch" }],
    ]);
  });

  it("is a no-op, and nothing else changes, when the OpenAI pixel is absent", () => {
    delete (window as Window2).oaiq;
    expect(() => {
      preorderAnalytics.beginCheckout(49_900, "launch");
      preorderAnalytics.purchase("KH-TEST-F6F6", 49_900, "launch");
    }).not.toThrow();
    expect(gtagCalls.map((c) => c[0])).toEqual(["begin_checkout", "purchase"]);
    expect(phCalls.map((c) => c[0])).toEqual(["begin_checkout", "purchase"]);
    expect(oaiqCalls).toEqual([]);
  });

  it("a throwing OpenAI SDK never reaches the checkout", () => {
    (window as Window2).oaiq = vi.fn(() => {
      throw new Error("sdk broke");
    });
    expect(() => preorderAnalytics.purchase("KH-TEST-F6F6", 49_900, "launch")).not.toThrow();
    expect(gtagCalls.map((c) => c[0])).toEqual(["purchase"]);
  });
});
