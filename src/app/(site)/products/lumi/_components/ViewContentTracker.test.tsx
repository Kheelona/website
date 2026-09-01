import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ViewContentTracker } from "./ViewContentTracker";
import { LAUNCH_AMOUNT_PAISE, TOKEN_AMOUNT_PAISE, FULL_AMOUNT_PAISE } from "@/config/site";

afterEach(() => {
  delete window.fbq;
  vi.useRealTimers();
});

describe("ViewContentTracker", () => {
  it("renders nothing", () => {
    const { container } = render(<ViewContentTracker />);
    expect(container).toBeEmptyDOMElement();
  });

  it("reports ViewContent for Lumi when the pixel is present", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    render(<ViewContentTracker />);

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "ViewContent",
      {
        content_name: "Lumi",
        content_ids: ["lumi"],
        content_type: "product",
        value: 4999,
        currency: "INR",
      },
      undefined,
    );
  });

  it("fires exactly once, not once per effect run", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    const { rerender } = render(<ViewContentTracker />);
    rerender(<ViewContentTracker />);
    expect(fbq).toHaveBeenCalledTimes(1);
  });

  it("stays silent where the pixel never loads, and does not throw", () => {
    expect(() => render(<ViewContentTracker />)).not.toThrow();
  });

  /* The pixel is gated behind an effect and then loads afterInteractive, so at
     mount it is usually absent. If this component ever calls fbTrack directly
     instead of waiting, the event is dropped on production and the only symptom
     is an event that looks rare in Events Manager. Pinned as source, because the
     bug is an ABSENCE of waiting and there is nothing to observe at runtime. */
  it("waits for the pixel rather than calling fbTrack straight from mount", () => {
    const src = readFileSync(join(process.cwd(), "src/app/(site)/products/lumi/_components/ViewContentTracker.tsx"), "utf8");
    expect(src).toContain("whenFbqReady");
  });

  /* Founder decision 2026-09-01 (§8.30-j): ViewContent reports the HEADLINE unit
     price, not the ₹499 the checkout collects, because for a browsing event the
     product's own price is the honest answer. It must come from config, so that
     it cannot drift away from the price the page renders beside it. Typing 4999
     here directly is the failure this catches. */
  it("reports the headline unit price, taken from config and not retyped", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    render(<ViewContentTracker />);

    const params = fbq.mock.calls[0][2] as Record<string, unknown>;
    expect(params.value).toBe(LAUNCH_AMOUNT_PAISE / 100);
    expect(params.currency).toBe("INR");
    // and it is the ₹4,999 headline, NOT the ₹499 token or the ₹7,999 full price
    expect(params.value).not.toBe(TOKEN_AMOUNT_PAISE / 100);
    expect(params.value).not.toBe(FULL_AMOUNT_PAISE / 100);
  });

  /* ⚑ THE KNOWN STALENESS, pinned so it is impossible to forget. The value above
     becomes wrong the day the 500-unit cap fills and the price is ₹7,999. That
     is a manual change riding the standing sell-out copy sweep (§8.26-g), and
     this assertion is the tripwire: whoever flips the site to full-payment copy
     has to come here, and this test then tells them what to change. */
  it("carries a pointer to the sweep that has to update it", () => {
    const src = readFileSync(
      join(process.cwd(), "src/app/(site)/products/lumi/_components/ViewContentTracker.tsx"),
      "utf8",
    );
    expect(src).toContain("FULL_AMOUNT_PAISE");
    expect(src).toContain("§8.26-g");
  });
});
