import { render, screen, within } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import { TRUST_FULL, trustItems } from "@/content/en-IN/trust";
import type { ArtBoardRef, ImageRef } from "@/content/types";
import { buildOffer } from "@/lib/offer/offer";
import type { SellingContext } from "../CtaBlock/cta-block.types";
import { CLAIM_FIXES, editsBeforeClaimFixes, KHEELONA_PLUS } from "../../../../test/e2e/support/deviations";
import { builtMarkup, canonical, mockupFold, renderedElement, STORE, without } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";
import { OfferSection } from "./OfferSection";
import type { OfferSectionConfig } from "./offer-section.types";

/* OfferSection (task 3.2): Home's close (home.html fold 9, variant close) and the product page's offer
   (meet-kheelu.html fold 3, variant photo), from the real content in both modes. The art board and the photo are
   the media primitives' (task 2.3) and are checked here only for what the section passes them. */

const TOKEN = buildOffer("token");
const FULL = buildOffer("full");
const context = (offer = TOKEN): SellingContext => ({ offer, ctaLabel: cta.preorder, help: seller.help });

const raster = (name: string, width: number, height: number) => ({ src: `/_next/static/media/${name}`, width, height }) as StaticImageData;
const HOME_ART: ArtBoardRef = {
  tone: "sun",
  label: "A curious girl in a mustard flowered frock beside Kheelu, the cream plush rabbit",
  layers: [
    { image: { src: raster("flower-chilli.svg", 240, 240), alt: "" }, left: 6, width: 30, top: 7 },
    { image: { src: raster("myra-sticker.png", 800, 1200), alt: "" }, left: 44, width: 48, bottom: 0 },
    { image: { src: raster("kheelu-front-sticker.png", 1154, 1397), alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
    { doodle: { name: "ink-heart" }, left: 82, width: 12, top: 9, rotate: 14 },
  ],
};
const PHOTO: ImageRef = {
  src: raster("kheelu-on-fur.jpg", 1600, 1600),
  alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
};

const HOME: OfferSectionConfig = {
  variant: "close",
  heading: { eyebrow: "Pre-order", title: "What you get, and {hand:what you pay.}" },
  cta: "finale",
  cardLabel: "Kheelu offer",
  trust: TRUST_FULL.map((id) => trustItems[id]),
  art: HOME_ART,
};
const PRODUCT: OfferSectionConfig = {
  variant: "photo",
  heading: { eyebrow: "What you get", title: "Everything that {hand:comes with it.}" },
  cta: "product-offer",
  trust: (["returns-7-days", "warranty-6-months", "payment-methods"] as const).map((id) => trustItems[id]),
  photo: PHOTO,
};

const MEDIA = ".kh-art, figure.kh-photo";
/** A page's fold as approved, with the page's accepted changes applied: since task 8b.1 the Kheelona+ line under Home's
 *  card and the product card's perk read D058 item 3's sentence (deviations.md V26, V27; CLAIM_FIXES). */
const approvedFold = (slug: "home" | "meet-kheelu", fold: string) =>
  withFacts(withFacts(mockupFold(slug, "main"), editsBeforeClaimFixes(slug)), CLAIM_FIXES[slug].edits).querySelector(fold)!;
/* A perk's words are always in a span (OfferCard), so a value-marked perk keeps its span. */
const KEEP = ".kh-offer__list span";

describe("OfferSection: the approved folds, exactly (media aside)", () => {
  it.each([
    ["Home close (home.html fold 9)", "home", "#close", HOME],
    ["product offer (meet-kheelu.html fold 3)", "meet-kheelu", "#offer", PRODUCT],
  ] as const)("%s", (_name, slug, fold, config) => {
    const expected = builtMarkup([without(approvedFold(slug, fold), MEDIA)], { keepSpans: KEEP });
    const actual = canonical(without(renderedElement(<OfferSection {...config} {...context()} />), MEDIA));
    expect(actual).toBe(expected);
  });
});

describe("OfferSection: the card's button", () => {
  it.each([
    ["Home", HOME, "finale"],
    ["the product page", PRODUCT, "product-offer"],
  ] as const)("on %s carries the placement's CTA value and links to the store", (_name, config, value) => {
    const { container } = render(<OfferSection {...config} {...context()} />);
    const button = container.querySelector(".kh-offer .kh-btn--cta");
    expect(button).toHaveAttribute("data-ph-capture-attribute-cta", value);
    expect(button).toHaveAttribute("href", STORE);
    expect(button?.className).toBe("kh-btn kh-btn--cta kh-btn--l kh-btn--block");
    expect(container.querySelectorAll(".kh-btn--cta")).toHaveLength(1);
  });
});

describe("OfferSection: variants", () => {
  it("close: a section named by its heading, the card a named region with id offer, the Kheelona+ line under it", () => {
    render(<OfferSection {...HOME} {...context()} />);
    const section = screen.getByRole("region", { name: "What you get, and what you pay." });
    expect(section).toHaveAttribute("id", "close");
    const card = within(section).getByRole("region", { name: "Kheelu offer" });
    expect(card).toHaveAttribute("id", "offer");
    expect(card.nextElementSibling).toHaveTextContent(TOKEN.plus);
  });

  it("close: the art board beside the card, named, below the first screen (its doodle draws, nothing loads eagerly)", () => {
    const board = renderedElement(<OfferSection {...HOME} {...context()} />).querySelector(".kh-art")!;
    expect(board.getAttribute("class")).toBe("kh-art kh-tone-sun");
    expect(board).toHaveAttribute("role", "img");
    expect(board).toHaveAttribute("aria-label", HOME_ART.label);
    expect(board.children).toHaveLength(4);
    expect(board.querySelector("svg.ks-doodle")).toHaveAttribute("data-draw");
    expect(board.querySelector('img[loading="eager"]')).toBeNull();
  });

  it("photo: the section id offer (the page's #offer fragment), a plain card, the square photo beside it", () => {
    const section = renderedElement(<OfferSection {...PRODUCT} {...context()} />);
    expect(section).toHaveAttribute("id", "offer");
    expect(section).toHaveAttribute("aria-labelledby", "offer-title");
    expect(section.querySelector(".kh-offer")?.tagName).toBe("DIV");
    expect(section.querySelector(".kh-offer")).not.toHaveAttribute("aria-label");
    const photo = section.querySelector("figure")!;
    expect(photo.getAttribute("class")).toBe("kh-photo kh-photo--square kh-photo--xl ks-offer-photo");
    expect(photo.querySelector("img")).toHaveAttribute("alt", PHOTO.alt);
    expect(photo.querySelector("img")).toHaveAttribute("loading", "lazy");
    // No Kheelona+ line under the card: the sentence is the card's perk alone (D058 item 3 words both the same).
    expect(section.querySelector(".kh-offer + p")).toBeNull();
    expect(section.textContent?.split(TOKEN.plus)).toHaveLength(2);
  });

  it("lists the perks of its placement: Home's four, the product page's five (Kheelona+ among them)", () => {
    const perks = (config: OfferSectionConfig) =>
      [...renderedElement(<OfferSection {...config} {...context()} />).querySelectorAll(".kh-offer__list li")].map((li) => li.textContent);
    expect(perks(HOME)).toEqual(["Deliveries start mid-November", "In the box: Kheelu plush toy, charger and quick-start card", "Delivery anywhere in India, included", "A GST invoice with every order"]);
    expect(perks(PRODUCT)).toHaveLength(5);
    expect(perks(PRODUCT)[1]).toBe(KHEELONA_PLUS.build);
  });

  /* Task 3.6 item 6: the help line is content (`Copy`) and renders with the page's offer, as in CtaBlock. */
  it("renders the help line with the offer: copy that changes with the mode", () => {
    const help = { lead: { token: "Questions before you pay the advance?", full: "Questions before you pay?" }, contact: seller.help.contact };
    for (const [offer, lead] of [
      [TOKEN, "Questions before you pay the advance?"],
      [FULL, "Questions before you pay?"],
    ] as const) {
      for (const config of [HOME, PRODUCT]) {
        const line = renderedElement(<OfferSection {...config} offer={offer} ctaLabel={cta.preorder} help={help} />).querySelector(".ks-help");
        expect(line?.textContent).toContain(lead);
      }
    }
  });

  it("never moves on arrival: no data-reveal anywhere in the section (the offer card and the price, §11.2)", () => {
    for (const config of [HOME, PRODUCT]) expect(renderToStaticMarkup(<OfferSection {...config} {...context()} />)).not.toContain("data-reveal");
  });
});

describe("OfferSection: full mode (ADR-005, G-08)", () => {
  it.each([
    ["Home", HOME],
    ["the product page", PRODUCT],
  ] as const)("%s: no split, the full price and sentence; perks, trust line and help line unchanged", (_name, config) => {
    const full = renderedElement(<OfferSection {...config} {...context(FULL)} />);
    const token = renderedElement(<OfferSection {...config} {...context(TOKEN)} />);
    expect(full.querySelector(".kh-offer__split")).toBeNull();
    expect(token.querySelector(".kh-offer__split")).not.toBeNull();
    expect(full.querySelector(".kh-offer__prices")?.textContent).toBe("₹7,999(incl. GST)");
    expect(full.querySelector(".kh-offer__fine")?.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
    expect(full.textContent).not.toMatch(/₹499|₹4,500|₹4,999/);
    for (const part of [".kh-offer__list", ".ks-trust", ".ks-help"]) {
      expect(full.querySelector(part)?.outerHTML, part).toBe(token.querySelector(part)?.outerHTML);
    }
    if (config.variant === "close") expect(full.textContent).toContain(FULL.plus);
  });
});
