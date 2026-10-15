import { render, screen, within } from "@testing-library/react";
import postcss from "postcss";
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
import { CLAIM_FIXES, SELLING_CLOSES } from "../../../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../../../test/e2e/support/repo";
import { withSellerFacts } from "../../../../../test/e2e/support/seller-facts";
import { mockupDiff, mockupFold, mockupRoute } from "../../../../../test/support/mockup-compare";
import { withFacts } from "../../../../../test/support/mockup-facts";
import { PayBeside, StoreDetails } from "./StoreDetails";

/* StoreDetails (task 5.15; components §2; store.md folds 1-5 and 7): the store's two columns, compared element by
 * element with the approved mockup (mockup/store.html `mk-store`) through the mockup comparison harness, with the
 * page's real parts in its slots, as src/app/store/page.tsx composes them. The FAQ fold is FaqSection's own test's;
 * the form's and the card's inside are checkout-presentation.test.tsx's; the payments line is StorePaymentsLine's
 * (task 4.8). */

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
 *  (checkout-presentation.test.tsx), the small print as task 8b.1 words it (D058 item 3; deviations.md V34), the help
 *  line without the call (D063 item 2; task Q2.3), the first screen's eyebrow as the selling update words it (task Q2.12;
 *  D065 item 1; SELLING_CLOSES.store, the one edit inside these columns). */
function approved(): Element {
  const eyebrow = SELLING_CLOSES.store.edits.filter((edit) => edit.at === ".kh-eyebrow");
  const el = comparable(withSellerFacts(withFacts(withFacts(mockupFold("store", "div.mk-store"), CLAIM_FIXES.store.edits), eyebrow)), "section.mk-faq");
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

  it("prints nothing for the in-app note outside the in-app browsers (its gate reads the user agent; on since D056 item 3)", () => {
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
    const ref = withSellerFacts(mockupFold("store", ".mk-pay-beside"));
    ref.querySelector(".mk-price")!.remove();
    expect(differences(container.firstElementChild!, ref)).toEqual([]);
  });
});

/* Task Q2.16 (consistency review QAP-8): the trust links under the pay button had tap rows 36 px tall, their 12 px
   extensions overlapping, because store.css:63 closed their rows to --space-4 while every other trust line keeps
   TrustLine's --space-5 (trust-line.css: two extensions apart). The override is gone: the rows are TrustLine's. CSS only;
   the checkout's markup and logic are unchanged. */
describe("store-details.css", () => {
  const rules = (path: string) => {
    const out: Record<string, string[]> = {};
    postcss.parse(readRepoFile(path)).walkRules((rule) => {
      const key = rule.selectors.join(", ");
      out[key] = [...(out[key] ?? []), ...rule.nodes.flatMap((d) => (d.type === "decl" ? [`${d.prop}: ${d.value}`] : []))];
    });
    return out;
  };

  it("lets the trust line under the pay button keep TrustLine's rows, two tap extensions apart", () => {
    const store = rules("src/components/sections/store/StoreDetails/store-details.css");
    expect(Object.keys(store).filter((selector) => /ks-pay-beside\s+\.ks-trust\b/.test(selector))).toEqual([]);
    expect(rules("src/components/ui/TrustLine/trust-line.css")[".ks-trust"]).toContain("row-gap: var(--space-5)");
  });
});
