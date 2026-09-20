import { beforeEach, describe, expect, it } from "vitest";
import { preorderAnalytics } from "./analytics";
import { registerPostHog, resetPostHogForTests } from "@/lib/posthog";

/** ONE FUNNEL, DEFINED ONCE (§8.25-r, extended §8.38).
 *
 *  Three tools now measure the same five moments, and the failure this module
 *  exists to rule out is them drifting apart — Meta, GA4 and PostHog disagreeing
 *  about how many people paid, with nobody able to say which is lying. The drift
 *  is silent: adding a tool to four call sites and forgetting the fifth breaks
 *  nothing, fails nothing, and shows up weeks later as a funnel that does not
 *  reconcile.
 *
 *  So this asserts BEHAVIOUR rather than spelling. A source grep for `phCapture`
 *  would count six occurrences and pass while one of them sat in the wrong
 *  function. These tests call each event and record what each tool actually
 *  received. */

type Call = [string, Record<string, unknown> | undefined];

let gtagCalls: Call[];
let fbqCalls: unknown[][];
let phCalls: Call[];

beforeEach(() => {
  gtagCalls = [];
  fbqCalls = [];
  phCalls = [];
  resetPostHogForTests();

  (window as unknown as { gtag: (...a: unknown[]) => void }).gtag = (...a: unknown[]) => {
    if (a[0] === "event") gtagCalls.push([a[1] as string, a[2] as Record<string, unknown>]);
  };
  window.fbq = (...a: unknown[]) => fbqCalls.push(a);
  registerPostHog({
    capture: (e, p) => phCalls.push([e, p]),
    startSessionRecording: () => {},
    stopSessionRecording: () => {},
  });
});

describe("every funnel event reaches GA4 and PostHog alike", () => {
  /** The six moments, and the one call that produces each. */
  const EVENTS: { name: string; fire: () => void; ga: string }[] = [
    /* Added 2026-09-20 (§8.40). The FIRST signal a real human is here: before
       it, nothing fired until validation passed on submit, so a parent who typed
       their name and left was invisible. It is what makes abandonment a funnel
       step rather than a guess. */
    {
      name: "formStarted",
      fire: () => preorderAnalytics.formStarted("launch"),
      ga: "preorder_form_started",
    },
    { name: "start", fire: () => preorderAnalytics.start("launch"), ga: "preorder_start" },
    {
      name: "beginCheckout",
      fire: () => preorderAnalytics.beginCheckout(49_900, "launch"),
      ga: "begin_checkout",
    },
    {
      name: "purchase",
      fire: () => preorderAnalytics.purchase("KH-A2B3-C4D5", 49_900, "launch"),
      ga: "purchase",
    },
    {
      name: "addressSaved",
      fire: () => preorderAnalytics.addressSaved("KH-A2B3-C4D5"),
      ga: "preorder_address_saved",
    },
    { name: "dismissed", fire: () => preorderAnalytics.dismissed("launch"), ga: "preorder_dismissed" },
  ];

  for (const ev of EVENTS) {
    it(`${ev.name} sends the same event name to GA4 and PostHog`, () => {
      ev.fire();
      expect(gtagCalls.map((c) => c[0]), `${ev.name} did not reach GA4`).toContain(ev.ga);
      expect(phCalls.map((c) => c[0]), `${ev.name} did not reach PostHog`).toContain(ev.ga);
    });

    it(`${ev.name} sends GA4 and PostHog identical properties`, () => {
      /* Not merely "both were called". If the two payloads diverge, the two
         funnels stop being comparable, which is the entire reason PostHog was
         added to these bodies rather than left to autocapture. */
      ev.fire();
      const ga = gtagCalls.find((c) => c[0] === ev.ga)?.[1];
      const ph = phCalls.find((c) => c[0] === ev.ga)?.[1];
      expect(ph).toEqual(ga);
    });
  }
});

describe("the money events still reach Meta, with its own names", () => {
  /* Meta's event names are fixed by Meta, so parity here is about COVERAGE, not
     matching strings: the two events that carry money must reach all three
     tools. */
  it("begin_checkout reaches Meta as InitiateCheckout", () => {
    preorderAnalytics.beginCheckout(49_900, "launch");
    expect(fbqCalls.some((c) => c[1] === "InitiateCheckout")).toBe(true);
  });

  it("purchase reaches Meta as Purchase, with its de-duplication key", () => {
    preorderAnalytics.purchase("KH-A2B3-C4D5", 49_900, "launch");
    const purchase = fbqCalls.find((c) => c[1] === "Purchase");
    expect(purchase).toBeTruthy();
    expect(purchase?.[3]).toEqual({ eventID: "purchase_KH-A2B3-C4D5" });
  });

  it("reports the amount actually collected, in rupees, to every tool", () => {
    /* ₹499 for a token order, not the ₹4,999 headline (founder, 2026-09-01),
       and rupees rather than paise. A tool fed paise would report a hundredfold
       ROAS and nobody would notice for a month. */
    preorderAnalytics.purchase("KH-A2B3-C4D5", 49_900, "launch");
    expect(gtagCalls.find((c) => c[0] === "purchase")?.[1]).toMatchObject({ value: 499 });
    expect(phCalls.find((c) => c[0] === "purchase")?.[1]).toMatchObject({ value: 499 });
    const meta = fbqCalls.find((c) => c[1] === "Purchase")?.[2] as Record<string, unknown>;
    expect(meta).toMatchObject({ value: 499, currency: "INR" });
  });
});

/** The normal case on localhost, in previews and in every test: no tool is
 *  present and nothing may throw. */
describe("nothing throws when no tool is loaded", () => {
  beforeEach(() => {
    resetPostHogForTests();
    delete (window as unknown as { gtag?: unknown }).gtag;
    delete window.fbq;
  });

  it("survives a whole funnel with every tool absent", () => {
    expect(() => {
      preorderAnalytics.start("launch");
      preorderAnalytics.beginCheckout(49_900, "launch");
      preorderAnalytics.purchase("KH-A2B3-C4D5", 49_900, "launch");
      preorderAnalytics.addressSaved("KH-A2B3-C4D5");
      preorderAnalytics.dismissed("launch");
    }).not.toThrow();
  });
});
