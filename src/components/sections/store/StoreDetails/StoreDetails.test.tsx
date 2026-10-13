import { render, screen, within } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it, vi } from "vitest";
import { FaqSection } from "@/components/sections/FaqSection/FaqSection";
import { StoreTop } from "@/components/sections/store/StoreTop/StoreTop";
import { InAppBrowserNote } from "@/components/ui/InAppBrowserNote/InAppBrowserNote";
import { MARKETING_ORIGIN, STORE_ORIGIN } from "@/config/env";
import { pickFaqs } from "@/content/en-IN/faqs";
import { navigation } from "@/content/en-IN/navigation";
import { inAppNote } from "@/content/en-IN/store/in-app-note";
import { storePage } from "@/content/en-IN/store/store-page";
import { isSitePath } from "@/lib/links";
import { buildOffer } from "@/lib/offer/offer";
import { mockupDiff, mockupFold, mockupPage, mockupRoute } from "../../../../../test/support/mockup-compare";
import { PayBeside, StoreDetails, StorePaymentsLine } from "./StoreDetails";

/* StoreDetails (task 5.15; components §2; store.md folds 1-5 and 7): the store's two columns, compared element by
 * element with the approved mockup (mockup/store.html `mk-store`) through the mockup comparison harness, with the
 * page's real parts in its slots, as src/app/store/page.tsx composes them. The FAQ fold is FaqSection's own test's;
 * the form's and the card's inside are checkout-presentation.test.tsx's. */

vi.mock("@/features/preorder/lib/checkout", () => ({ startCheckout: vi.fn() }));
const { PreorderForm } = await import("@/features/preorder/components/PreorderForm");
const { OrderSummary } = await import("@/features/preorder/components/OrderSummary");

const token = buildOffer("token");
const NOTE = navigation.labels.newTabNote;

function realHref(href: string): string {
  const route = mockupRoute(href);
  return isSitePath(route) ? `${MARKETING_ORIGIN}${route}` : route;
}
const IMAGE_ATTRIBUTES = ["src", "srcset", "sizes", "width", "height", "style", "loading", "decoding", "fetchpriority", "fetchPriority", "data-nimg"];
const differences = mockupDiff({ realHref, ignore: [...IMAGE_ATTRIBUTES, "action", "method"] });

/** The store page's parts in StoreDetails' slots (src/app/store/page.tsx), the image as Next imports it. */
function composed() {
  const top = { ...storePage.top, image: { src: { src: "/_next/static/media/kheelu-front.webp", width: 1080, height: 1324 } as StaticImageData, alt: storePage.top.image.alt } };
  return (
    <StoreDetails
      content={storePage.details}
      top={<StoreTop content={top} offer={token} newTabNote={NOTE} />}
      note={<InAppBrowserNote content={inAppNote} storeUrl={STORE_ORIGIN} />}
      form={<PreorderForm tier="launch" amountLabel="₹499" mode="token" beside={<PayBeside content={storePage.beside} offer={token} newTabNote={NOTE} />} />}
      summary={<OrderSummary amountLabel="₹499" tierLabel="Pre-order price" mode="token" delivery={token.delivery} />}
      questions={<FaqSection variant="store" heading={storePage.questions.heading} items={pickFaqs(storePage.questions.items)} offer={token} />}
    />
  );
}

/** What both sides leave out of the comparison: generated control ids (useId), and the FAQ fold (its own test). */
function comparable(source: Element, faq: string): Element {
  const el = source.cloneNode(true) as Element;
  el.querySelectorAll("input, .kh-field__hint, .kh-field__error").forEach((n) => n.removeAttribute("id"));
  el.querySelectorAll("input").forEach((n) => n.removeAttribute("aria-describedby"));
  el.querySelectorAll("label[for]").forEach((n) => n.removeAttribute("for"));
  el.querySelector(faq)?.remove();
  return el;
}

/** The mockup's two columns as the build must print them: the in-app note built switched off (N7, renders nothing),
 *  the consent box unrequired and its links' live rel (the rendered contract, ADR-013), the delivery head whole
 *  (checkout-presentation.test.tsx). */
function approved(): Element {
  const el = comparable(mockupFold("store", "div.mk-store"), "section.mk-faq");
  el.querySelector(".mk-inapp")!.remove();
  el.querySelector('input[name="accepted"]')!.removeAttribute("required");
  el.querySelectorAll(".kh-check__text a").forEach((a) => a.setAttribute("rel", "noopener noreferrer"));
  el.querySelectorAll(".mk-agree .mk-nowrap").forEach((n) => n.replaceWith(...Array.from(n.childNodes)));
  return el;
}

describe("StoreDetails", () => {
  it("equals the mockup's two columns, with the store's parts in its slots (token mode)", () => {
    const { container } = render(composed());
    expect(differences(comparable(container.firstElementChild!, "section.ks-faq"), approved())).toEqual([]);
  });

  it("keeps the phone order: first screen, the form, then the agreement card and the questions", () => {
    const { container } = render(composed());
    const order = Array.from(container.querySelectorAll("h1, h2")).map((h) => h.textContent);
    expect(order).toEqual(["Pre-order Kheelu.", "Your details", "What you are agreeing to", "Questions before you pay"]);
    const card = screen.getByRole("region", { name: "What you are agreeing to" });
    expect(screen.getByRole("button", { name: "Pay ₹499 and reserve" }).compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("names the details section by its heading and keeps the #details fragment the films link back to", () => {
    render(composed());
    const details = screen.getByRole("region", { name: "Your details" });
    expect(details).toHaveAttribute("id", "details");
    expect(within(details).getByRole("button", { name: "Pay ₹499 and reserve" })).toBeInTheDocument();
  });

  it("prints nothing for the in-app note while it is switched off (N7)", () => {
    const { container } = render(composed());
    expect(container.querySelector(".ks-inapp")).toBeNull();
    expect(container.textContent).not.toContain("Paying by UPI?");
  });

  it("moves nothing on arrival: no reveal, no drawing doodle anywhere in the money folds (D049 1A)", () => {
    const { container } = render(composed());
    expect(container.querySelector("[data-reveal], [data-draw]")).toBeNull();
  });
});

describe("PayBeside", () => {
  it("equals what follows the price sentence beside the mockup's pay button", () => {
    const { container } = render(
      <div className="ks-beside ks-pay-beside">
        <PayBeside content={storePage.beside} offer={token} newTabNote={NOTE} />
      </div>,
    );
    const ref = mockupFold("store", ".mk-pay-beside").cloneNode(true) as Element;
    ref.querySelector(".mk-price")!.remove();
    expect(differences(container.firstElementChild!, ref)).toEqual([]);
  });
});

describe("StorePaymentsLine", () => {
  it("prints the mockup footer's payments line, its chargeback link on the marketing site in a new tab", () => {
    const { container } = render(<StorePaymentsLine content={storePage.payments} newTabNote={NOTE} />);
    const line = Array.from(mockupPage("store").querySelectorAll("footer p")).find((p) => /Payments by Razorpay/.test(p.textContent ?? ""))!;
    /* In the footer the mockup's muted colour came from `.mk-store-foot p`; in main the line names it (ks-muted). */
    const ref = line.cloneNode(true) as Element;
    ref.classList.add("ks-muted");
    expect(differences(container.querySelector("p")!, ref)).toEqual([]);
    expect(container.querySelector("p")!.textContent).toBe(`${storePage.payments.text} ${storePage.payments.link.label}${NOTE}`);
    expect(screen.getByRole("link")).toHaveAttribute("href", `${MARKETING_ORIGIN}/refund#chargeback`);
  });

  it("is a contained block aligned with the store footer", () => {
    const { container } = render(<StorePaymentsLine content={storePage.payments} newTabNote={NOTE} />);
    expect(container.firstElementChild).toHaveClass("ks-store-payments");
    expect(container.querySelector(".ks-store-payments > .kh-container > p")).not.toBeNull();
  });
});
