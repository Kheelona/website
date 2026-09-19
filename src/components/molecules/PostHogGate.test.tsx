import { describe, expect, it, beforeEach } from "vitest";
import {
  GA4_HOSTS,
  POSTHOG_API_HOST,
  POSTHOG_ASSET_HOST,
  POSTHOG_HOSTS,
  POSTHOG_KEY,
  POSTHOG_REPLAY_DENY_PATHS,
  replayAllowedOnPath,
  shouldLoadPostHog,
} from "@/config/site";
import { phCapture, phSetReplay, registerPostHog, resetPostHogForTests } from "@/lib/posthog";

/** PostHog is the fifth measurement tool and by some distance the widest:
 *  autocapture records every click sitewide, session replay records the screen,
 *  and error tracking sends exceptions. Two predicates decide how far all of
 *  that reaches, so both are tested directly rather than through a render. */
describe("shouldLoadPostHog", () => {
  it("loads on the production hosts, including the store", () => {
    expect(shouldLoadPostHog("kheelona.com")).toBe(true);
    expect(shouldLoadPostHog("www.kheelona.com")).toBe(true);
    expect(shouldLoadPostHog("store.kheelona.com")).toBe(true);
  });

  it("does NOT load on localhost", () => {
    expect(shouldLoadPostHog("localhost")).toBe(false);
    expect(shouldLoadPostHog("127.0.0.1")).toBe(false);
    expect(shouldLoadPostHog("store.localhost")).toBe(false);
  });

  it("does NOT load on Vercel preview hosts", () => {
    expect(shouldLoadPostHog("website-hdn2.vercel.app")).toBe(false);
    expect(shouldLoadPostHog("website-git-main-kheelona.vercel.app")).toBe(false);
  });

  it("does NOT load on the sister site or a lookalike domain", () => {
    expect(shouldLoadPostHog("kheelona.ai")).toBe(false);
    expect(shouldLoadPostHog("kheelona.com.evil.example")).toBe(false);
    expect(shouldLoadPostHog("notkheelona.com")).toBe(false);
  });

  it("is case-insensitive, because hostnames are", () => {
    expect(shouldLoadPostHog("Kheelona.com")).toBe(true);
    expect(shouldLoadPostHog("STORE.KHEELONA.COM")).toBe(true);
  });
});

/** THE CONFIRMATION PAGE IS NOT RECORDED, and this is the guard on it.
 *
 *  `/store/thanks` renders a parent's email, their order number and their
 *  delivery address back to them as TEXT. Its own source has warned since
 *  2026-08-22 that a screenshot of it "would show a stranger a family's delivery
 *  address", and a session recording is a continuous screenshot. Masking inputs
 *  does not help: that covers what a parent types, and the exposure here is what
 *  we print. */
describe("replayAllowedOnPath", () => {
  it("never records the confirmation page", () => {
    expect(replayAllowedOnPath("/store/thanks")).toBe(false);
  });

  it("never records anything nested under it", () => {
    expect(replayAllowedOnPath("/store/thanks/")).toBe(false);
    expect(replayAllowedOnPath("/store/thanks/receipt")).toBe(false);
  });

  it("still records the pages the funnel actually needs", () => {
    /* Excluding the whole store host would have gutted the reason to buy
       replay: the pre-order form and the checkout hand-off are exactly where a
       parent stalls. Only the confirmation page is withheld. */
    expect(replayAllowedOnPath("/store")).toBe(true);
    expect(replayAllowedOnPath("/store/ideabaaz")).toBe(true);
    expect(replayAllowedOnPath("/store/e/some-event")).toBe(true);
    expect(replayAllowedOnPath("/")).toBe(true);
    expect(replayAllowedOnPath("/products/kheelu")).toBe(true);
  });

  /* A prefix match must not catch a route that merely STARTS with the same
     letters, or a future `/store/thanksgiving-offer` would silently stop
     recording and nobody would know why. */
  it("does not over-match a route that merely shares the prefix", () => {
    expect(replayAllowedOnPath("/store/thanksgiving")).toBe(true);
    expect(replayAllowedOnPath("/store/thanks-again")).toBe(true);
  });
});

describe("the PostHog constants", () => {
  it("holds a project API key in PostHog's shape", () => {
    expect(POSTHOG_KEY).toMatch(/^phc_[A-Za-z0-9]{40,}$/);
  });

  /* THE INGESTION HOST IS NOT THE DASHBOARD HOST. `us.posthog.com` is where the
     founder logs in; `us.i.posthog.com` is where events go. Pointing the SDK at
     the former fails silently, which is the worst way for this to be wrong. */
  it("points at the ingestion host, never the dashboard", () => {
    expect(POSTHOG_API_HOST).toBe("https://us.i.posthog.com");
    expect(POSTHOG_API_HOST).not.toBe("https://us.posthog.com");
  });

  /* Read out of the SDK's own request router, which builds
     `https://${region}-assets.i.posthog.com` for the assets target. It is not
     configured anywhere; this constant exists so the CSP names the same origin
     the SDK will actually fetch from. */
  it("names the asset origin the SDK derives", () => {
    expect(POSTHOG_ASSET_HOST).toBe("https://us-assets.i.posthog.com");
  });

  it("measures exactly the hosts GA4 measures", () => {
    expect([...POSTHOG_HOSTS]).toEqual([...GA4_HOSTS]);
  });

  it("never names a preview or local host", () => {
    for (const host of POSTHOG_HOSTS) {
      expect(host).not.toMatch(/localhost|127\.0\.0\.1|vercel\.app/);
    }
  });

  it("keeps the confirmation page in the replay deny list", () => {
    expect([...POSTHOG_REPLAY_DENY_PATHS]).toContain("/store/thanks");
  });
});

/** The wrapper's whole job is to be silent when PostHog is absent, which is the
 *  normal case: localhost, every preview, and every test. */
describe("the posthog wrapper no-ops when the SDK never loaded", () => {
  beforeEach(() => resetPostHogForTests());

  it("swallows a capture rather than throwing", () => {
    expect(() => phCapture("preorder_start", { tier: "launch" })).not.toThrow();
  });

  it("swallows a replay toggle rather than throwing", () => {
    expect(() => phSetReplay(true)).not.toThrow();
    expect(() => phSetReplay(false)).not.toThrow();
  });

  it("passes the event and its properties through once registered", () => {
    const calls: [string, Record<string, unknown> | undefined][] = [];
    registerPostHog({
      capture: (e, p) => calls.push([e, p]),
      startSessionRecording: () => {},
      stopSessionRecording: () => {},
    });

    phCapture("purchase", { value: 499, currency: "INR" });
    expect(calls).toEqual([["purchase", { value: 499, currency: "INR" }]]);
  });

  /* Replay is started and stopped, never merely configured, because the reason
     to withhold it is a property of the PAGE and a visitor moves between pages. */
  it("starts and stops the recorder as the route allows or denies it", () => {
    const log: string[] = [];
    registerPostHog({
      capture: () => {},
      startSessionRecording: () => log.push("start"),
      stopSessionRecording: () => log.push("stop"),
    });

    phSetReplay(replayAllowedOnPath("/store"));
    phSetReplay(replayAllowedOnPath("/store/thanks"));
    phSetReplay(replayAllowedOnPath("/"));

    expect(log).toEqual(["start", "stop", "start"]);
  });
});
