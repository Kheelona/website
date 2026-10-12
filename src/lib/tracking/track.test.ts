import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { registerPostHog, resetPostHogForTests } from "@/lib/posthog";
import { EVENTS } from "@/lib/tracking/events";
import { track, type NewEventParams } from "./track";

/** The dispatcher for NEW events only (ADR-006; architecture §8.1). It reads the registry for
 *  each event's destinations and parameters; the proven funnel never goes through it. */
type Gtag = (...args: unknown[]) => void;
const win = window as unknown as { gtag?: Gtag; fbq?: Gtag };

let gtag: ReturnType<typeof vi.fn>;
let fbq: ReturnType<typeof vi.fn>;
let capture: ReturnType<typeof vi.fn>;

beforeEach(() => {
  gtag = vi.fn();
  fbq = vi.fn();
  capture = vi.fn();
  win.gtag = gtag;
  win.fbq = fbq;
  registerPostHog({ capture, startSessionRecording: () => {}, stopSessionRecording: () => {}, get_distinct_id: () => "d" });
});

afterEach(() => {
  delete win.gtag;
  delete win.fbq;
  resetPostHogForTests();
});

const SAMPLES: { [N in keyof NewEventParams]: NewEventParams[N] } = {
  preorder_payment_window_opened: { tier: "launch" },
  preorder_payment_failed: { tier: "launch", reason_code: "BAD_REQUEST_ERROR", reason: "payment_failed" },
  preorder_form_rejected: { tier: "launch", fields: "phone,pincode" },
};

describe("track()", () => {
  it.each(Object.entries(SAMPLES))("%s goes to GA4 and PostHog with exactly its parameters", (name, params) => {
    track(name as keyof NewEventParams, params as never);
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", name, params);
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith(name, params);
  });

  it("never sends a new event to the Meta Pixel (architecture §8.2)", () => {
    for (const [name, params] of Object.entries(SAMPLES)) track(name as keyof NewEventParams, params as never);
    expect(fbq).not.toHaveBeenCalled();
  });

  it("sends only the registry's parameters, in the registry's order", () => {
    track("preorder_payment_failed", {
      reason: "payment_failed",
      tier: "launch",
      reason_code: "BAD_REQUEST_ERROR",
      email: "parent@example.com",
    } as never);
    const sent = gtag.mock.calls[0][2] as Record<string, unknown>;
    const registry = EVENTS.find((e) => e.name === "preorder_payment_failed")!;
    expect(Object.keys(sent)).toEqual([...registry.params]);
    expect(sent).not.toHaveProperty("email");
    expect(capture.mock.calls[0][1]).toEqual(sent);
  });

  it("drops a parameter left undefined rather than sending the key empty", () => {
    track("preorder_payment_failed", { tier: "launch", reason_code: undefined, reason: "x" } as never);
    expect(gtag.mock.calls[0][2]).toEqual({ tier: "launch", reason: "x" });
  });

  it("refuses an existing or unknown name: the proven funnel never goes through the dispatcher", () => {
    track("purchase" as never, { tier: "launch" } as never);
    track("InitiateCheckout" as never, { tier: "launch" } as never);
    track("not_registered" as never, {} as never);
    expect(gtag).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
    expect(fbq).not.toHaveBeenCalled();
  });

  it("is silent, and does not throw, where no tool loaded", () => {
    delete win.gtag;
    delete win.fbq;
    resetPostHogForTests();
    expect(() => track("preorder_payment_window_opened", { tier: "launch" })).not.toThrow();
  });
});
