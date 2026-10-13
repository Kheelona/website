import { render, screen, within } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import { MARKETING_ORIGIN } from "@/config/env";
import { navigation } from "@/content/en-IN/navigation";
import { storePage } from "@/content/en-IN/store/store-page";
import { isSitePath } from "@/lib/links";
import { buildOffer } from "@/lib/offer/offer";
import { mockupDiff, mockupFold, mockupRoute } from "../../../../../test/support/mockup-compare";
import { StoreTop } from "./StoreTop";
import type { StoreTopConfig } from "./store-top.types";

/* StoreTop (task 5.15; components §2; store.md fold 1): the store's first screen, the eyebrow and h1 beside a small
 * Kheelu, the price sentence and the compact trust line, compared element by element with the approved mockup
 * (mockup/store.html, section.mk-store-top) through the mockup comparison harness (test/support/mockup-compare.ts). */

const token = buildOffer("token");
const full = buildOffer("full");
const NOTE = navigation.labels.newTabNote;

/** The store's trust links open the marketing site's terms (MARKETING_ORIGIN), as the store footer's policy links do. */
function realHref(href: string): string {
  const route = mockupRoute(href);
  return isSitePath(route) ? `${MARKETING_ORIGIN}${route}` : route;
}

/** next/image's own attributes are not the mockup's markup; its ratio rides on the inline --kh-ratio (Photo, 4.6). */
const differences = mockupDiff({ realHref, ignore: ["src", "srcset", "sizes", "width", "height", "style", "loading", "decoding", "fetchpriority", "fetchPriority", "data-nimg"] });

/** The DS image as Next imports it (Vitest resolves a static import to its path). */
const content: StoreTopConfig = {
  ...storePage.top,
  image: { src: { src: "/_next/static/media/kheelu-front.webp", width: 1080, height: 1324 } as StaticImageData, alt: storePage.top.image.alt },
};

describe("StoreTop", () => {
  it("equals the mockup's first screen (token mode)", () => {
    const { container } = render(<StoreTop content={content} offer={token} newTabNote={NOTE} />);
    expect(differences(container.firstElementChild!, mockupFold("store", "section.mk-store-top"))).toEqual([]);
  });

  it("is the page's one h1, named by its id, and labels the section with it", () => {
    render(<StoreTop content={content} offer={token} newTabNote={NOTE} />);
    const h1 = screen.getByRole("heading", { level: 1, name: "Pre-order Kheelu." });
    expect(h1.closest("section")).toHaveAttribute("aria-labelledby", h1.id);
  });

  it("puts the price sentence in the first screen with the offer's amounts, in both modes", () => {
    const { rerender } = render(<StoreTop content={content} offer={token} newTabNote={NOTE} />);
    expect(document.getElementById("store-price")).toHaveTextContent(
      "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    );
    rerender(<StoreTop content={content} offer={full} newTabNote={NOTE} />);
    expect(document.getElementById("store-price")).toHaveTextContent("₹7,999 (incl. GST), paid in full when you order.");
  });

  it("opens each trust item's terms on the marketing site in a new tab, and says so to screen readers", () => {
    render(<StoreTop content={content} offer={token} newTabNote={NOTE} />);
    const links = within(screen.getByRole("list")).getAllByRole("link");
    expect(links.map((a) => [a.getAttribute("href"), a.getAttribute("target"), a.getAttribute("rel")])).toEqual([
      [`${MARKETING_ORIGIN}/shipping`, "_blank", "noopener"],
      [`${MARKETING_ORIGIN}/refund`, "_blank", "noopener"],
    ]);
    expect(links.map((a) => a.textContent)).toEqual([`Deliveries start mid-November${NOTE}`, `7-day returns, no questions asked${NOTE}`]);
  });

  it("loads the small Kheelu at once, as the first screen's one image (eager, fetchpriority high), at its rendered widths", () => {
    render(<StoreTop content={content} offer={token} newTabNote={NOTE} />);
    const img = screen.getByRole("img", { name: storePage.top.image.alt });
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchPriority", "high");
    expect(img.getAttribute("sizes")).toBe("(min-width: 720px) 128px, 96px");
    expect(img.getAttribute("style")).toContain("--kh-ratio: 1080 / 1324");
  });

  it("never moves on arrival: no reveal anywhere in the first screen (D049 pick 2)", () => {
    const { container } = render(<StoreTop content={content} offer={token} newTabNote={NOTE} />);
    expect(container.querySelector("[data-reveal], [data-draw]")).toBeNull();
  });
});
