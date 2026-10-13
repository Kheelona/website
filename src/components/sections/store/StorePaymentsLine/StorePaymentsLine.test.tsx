import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MARKETING_ORIGIN } from "@/config/env";
import { navigation } from "@/content/en-IN/navigation";
import { paymentsLine } from "@/content/en-IN/store/payments-line";
import { isSitePath } from "@/lib/links";
import { mockupDiff, mockupPage, mockupRoute } from "../../../../../test/support/mockup-compare";
import { StorePaymentsLine } from "./StorePaymentsLine";

/* StorePaymentsLine (task 4.8 item 2; store.md fold 7, D042; wiki/qa/deviations.md V1): the payments line the approved
 * store and confirmation mockups print in their shared store footer, rendered as the last line of each page's main
 * (the store layout's policy links are a frozen checkout contract). One piece for both pages (5.15 built it inside
 * StoreDetails for the store alone), compared element by element with each mockup's footer line. */

const NOTE = navigation.labels.newTabNote;

function realHref(href: string): string {
  const route = mockupRoute(href);
  return isSitePath(route) ? `${MARKETING_ORIGIN}${route}` : route;
}
const differences = mockupDiff({ realHref });

/** The footer's payments line in a mockup page, with the muted colour named: in the footer it came from
 *  `.mk-store-foot p`; in main the line names it (ks-muted). */
function mockupLine(slug: "store" | "store-confirmation"): Element {
  const line = Array.from(mockupPage(slug).querySelectorAll("footer p")).find((p) => /Payments by Razorpay/.test(p.textContent ?? ""));
  if (!line) throw new Error(`mockup/${slug}.html has no payments line in its footer`);
  const ref = line.cloneNode(true) as Element;
  ref.classList.add("ks-muted");
  return ref;
}

describe("StorePaymentsLine", () => {
  it.each(["store", "store-confirmation"] as const)("prints the %s mockup footer's payments line, its chargeback link on the marketing site in a new tab", (slug) => {
    const { container } = render(<StorePaymentsLine content={paymentsLine} newTabNote={NOTE} />);
    expect(differences(container.querySelector("p")!, mockupLine(slug))).toEqual([]);
    expect(container.querySelector("p")!.textContent).toBe(`${paymentsLine.text} ${paymentsLine.link.label}${NOTE}`);
    expect(screen.getByRole("link")).toHaveAttribute("href", `${MARKETING_ORIGIN}/refund#chargeback`);
  });

  it("is a contained block aligned with the store footer", () => {
    const { container } = render(<StorePaymentsLine content={paymentsLine} newTabNote={NOTE} />);
    expect(container.firstElementChild).toHaveClass("ks-store-payments");
    expect(container.querySelector(".ks-store-payments > .kh-container > p")).not.toBeNull();
  });

  it("leaves autocapture alone by default (the store page: its line is part of the funnel PostHog reads)", () => {
    const { container } = render(<StorePaymentsLine content={paymentsLine} newTabNote={NOTE} />);
    expect(container.firstElementChild!.className).toBe("ks-store-payments");
    expect(container.querySelector(".ph-no-capture")).toBeNull();
  });

  it("noCapture: the whole line inside ph-no-capture, so /thanks keeps zero autocapture events (tracking inventory row 18)", () => {
    const { container } = render(<StorePaymentsLine content={paymentsLine} newTabNote={NOTE} noCapture />);
    expect(container.firstElementChild!.className).toBe("ks-store-payments ph-no-capture");
    /* posthog-js walks a tapped element's ancestors for the class, so the chargeback link is covered. */
    expect(screen.getByRole("link").closest(".ph-no-capture")).toBe(container.firstElementChild);
  });
});
