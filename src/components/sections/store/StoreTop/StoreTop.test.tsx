import { render, screen, within } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import { MARKETING_ORIGIN } from "@/config/env";
import { navigation } from "@/content/en-IN/navigation";
import { storePage } from "@/content/en-IN/store/store-page";
import { isSitePath } from "@/lib/links";
import { buildOffer } from "@/lib/offer/offer";
import { SELLING_CLOSES } from "../../../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../../../test/e2e/support/repo";
import { mockupDiff, mockupFold, mockupRoute } from "../../../../../test/support/mockup-compare";
import { withFacts } from "../../../../../test/support/mockup-facts";
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

/** The store's first screen as approved, with the eyebrow of the selling update (task Q2.12; D065 item 1; the D2C plan v2
 *  §10; SELLING_CLOSES.store): "Screen-free AI toy · Ages 3 to 7", the band no-wrap. */
const FIRST_SCREEN_EDITS = SELLING_CLOSES.store.edits.filter((edit) => edit.at === ".kh-eyebrow");

describe("StoreTop", () => {
  it("equals the mockup's first screen (token mode)", () => {
    const { container } = render(<StoreTop content={content} offer={token} newTabNote={NOTE} />);
    expect(FIRST_SCREEN_EDITS).toHaveLength(1);
    expect(differences(container.firstElementChild!, withFacts(mockupFold("store", "section.mk-store-top"), FIRST_SCREEN_EDITS))).toEqual([]);
  });

  it("is the page's one h1, named by its id, and labels the section with it", () => {
    render(<StoreTop content={content} offer={token} newTabNote={NOTE} />);
    const h1 = screen.getByRole("heading", { level: 1, name: "Pre-order Khelu." });
    expect(h1.closest("section")).toHaveAttribute("aria-labelledby", h1.id);
  });

  // The checkout keeps D028's sentence, GST and the breakdown with it, in both modes (D065 item 3; task Q2.8).
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
    // The store's top marketing line takes the one risk-reversal line, first (task Q2.8; D065 item 3; D2C plan v2 §1.1).
    expect(links.map((a) => [a.getAttribute("href"), a.getAttribute("target"), a.getAttribute("rel")])).toEqual([
      [`${MARKETING_ORIGIN}/refund#before-dispatch`, "_blank", "noopener"],
      [`${MARKETING_ORIGIN}/shipping#when`, "_blank", "noopener"],
    ]);
    expect(links.map((a) => a.textContent)).toEqual([`Full refund until dispatch · 7-day returns${NOTE}`, `Deliveries start 15 December 2026${NOTE}`]);
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

  // D070 / C1 (K-176): the small Kheelu opens the first film on the store page; the event pages pass no film and keep the plain image.
  describe("the small Kheelu as a link to a film", () => {
    const film = { id: "learning-by-asking", label: "Play: Learning by asking. Khelu asks her to explain carrom." };

    it("is a plain image without a film (the mockup's markup: the image is the section's own child)", () => {
      const { container } = render(<StoreTop content={content} offer={token} newTabNote={NOTE} />);
      expect(container.querySelector("a.ks-store-top__film")).toBeNull();
      expect(container.querySelector(".ks-store-top > img.ks-store-top__img")).not.toBeNull();
    });

    it("wraps the same image in an in-page link to the film's tile, named by the film's own words, keeping the image's alt and loading", () => {
      const { container } = render(<StoreTop content={content} offer={token} newTabNote={NOTE} film={film} />);
      const link = container.querySelector<HTMLAnchorElement>(".ks-store-top > a.ks-store-top__film")!;
      expect(link.getAttribute("href")).toBe("#learning-by-asking");
      expect(screen.getByRole("link", { name: film.label })).toBe(link);
      expect(link.hasAttribute("target")).toBe(false);
      const img = link.querySelector("img")!;
      expect(img.className).toContain("ks-store-top__img");
      expect(img).toHaveAttribute("alt", storePage.top.image.alt);
      expect(img).toHaveAttribute("loading", "eager");
      expect(img).toHaveAttribute("fetchPriority", "high");
      expect(link.children).toHaveLength(1);
    });

    it("changes nothing else on the first screen: the same words, the same two trust links, the same order", () => {
      const plain = render(<StoreTop content={content} offer={token} newTabNote={NOTE} />).container;
      const linked = render(<StoreTop content={content} offer={token} newTabNote={NOTE} film={film} />).container;
      const kinds = (el: Element) => Array.from(el.firstElementChild!.children).map((c) => c.className.split(" ")[0] || c.tagName);
      expect(linked.textContent).toBe(plain.textContent);
      expect(kinds(linked)).toEqual(kinds(plain).map((k) => (k === "ks-store-top__img" ? "ks-store-top__film" : k)));
    });

    it("gives the link the image's size and place in the grid, the image filling it, so the first screen does not move", () => {
      const css = readRepoFile("src/components/sections/store/StoreTop/store-top.css").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");
      expect(css).toContain(".ks-store-top__film { display: block; width: var(--space-9); }");
      expect(css).toContain(".ks-store-top__film > .ks-store-top__img { width: 100%; }");
      expect(css).toContain(".ks-store-top__img, .ks-store-top__film { grid-column: 2; grid-row: 1 / span 3; width: var(--space-10); }");
    });
  });
});
