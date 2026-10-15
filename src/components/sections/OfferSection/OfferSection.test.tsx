import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { cta } from "@/content/en-IN/cta";
import { PLUS_NOTE } from "@/content/en-IN/offer";
import { seller } from "@/content/en-IN/seller";
import { TRUST_COMPACT, TRUST_OFFER_THIRD, trustItems } from "@/content/en-IN/trust";
import type { ArtBoardRef, ImageRef, Offer } from "@/content/types";
import { buildOffer } from "@/lib/offer/offer";
import type { SellingContext } from "../CtaBlock/cta-block.types";
import {
  CLAIM_FIXES,
  editsBeforeClaimFixes,
  KHEELONA_PLUS,
  OFFER_ADDITIONS,
  OFFER_NOTE,
  PRODUCT_OFFER_CARD,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
} from "../../../../test/e2e/support/deviations";
import { findBanned } from "../../../../test/guards/banned-phrases.data";
import { withSellerFacts } from "../../../../test/e2e/support/seller-facts";
import { builtMarkup, canonical, mockupFold, renderedElement, STORE, without } from "../../../../test/support/mockup-compare";
import { factSentences, hiddenProblems, ruleReach, withFacts } from "../../../../test/support/mockup-facts";
import { OfferSection } from "./OfferSection";
import type { OfferSectionConfig } from "./offer-section.types";

/* OfferSection (task 3.2): the product page's offer (meet-kheelu.html fold 3, variant photo) and, since task Q2.9, Home's
   offer moved up to fold 7 (variant home), from the real content in both modes. Home's close (home.html fold 9, the
   `close` variant) left with task Q2.13: Home's close is a CloseSection since task Q2.9. The art board and the photo are
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

const PRODUCT: OfferSectionConfig = {
  variant: "photo",
  heading: { eyebrow: "What you get", title: "Everything that {hand:comes with it.}" },
  cta: "product-offer",
  /* Both cards' rows since task Q2.8's review: the trust line, then the card's third row (the D2C plan v2 §1.1; the
     harness reads the mockup's rows so, test/support/mockup-compare.ts withPriceLine), two lists since task Q2.15. */
  trust: TRUST_COMPACT.map((id) => trustItems[id]),
  third: TRUST_OFFER_THIRD.map((id) => trustItems[id]),
  /* The Kheelona+ note in the card since task Q2.13 (the D2C plan v2 §3 fold 3: "the same note under the perks"). */
  note: PLUS_NOTE,
  photo: PHOTO,
};
/** Home's offer since task Q2.9 (the selling update; the D2C plan v2 §2 fold 7): moved up to fold 7, so not the close. */
const HOME_OFFER: OfferSectionConfig = {
  variant: "home",
  heading: { eyebrow: "Pre-order", title: "What you get, and {hand:what you pay.}", lead: "There every day at home, with no screen to switch off." },
  cta: "home-offer",
  cardLabel: "Kheelu offer",
  note: PLUS_NOTE,
  trust: TRUST_COMPACT.map((id) => trustItems[id]),
  third: TRUST_OFFER_THIRD.map((id) => trustItems[id]),
  art: HOME_ART,
};

const MEDIA = ".kh-art, figure.kh-photo";
type Slug = "home" | "meet-kheelu";
/** A page's main with the page's earlier accepted changes applied: since task 8b.1 the Kheelona+ line under Home's card
 *  and the product card's perk read D058 item 3's sentence (deviations.md V26, V27; CLAIM_FIXES). */
const claimFixed = (slug: Slug) => withFacts(withFacts(mockupFold(slug, "main"), editsBeforeClaimFixes(slug)), CLAIM_FIXES[slug].edits);
/** The product page's offer fold as approved, with the page's accepted changes applied, then task 8c.2's: the later price
 *  on the card and the share link under it (D061; OFFER_ADDITIONS); then task Q2.13's (PRODUCT_OFFER_CARD, the selling
 *  update's: the note in the card, the price printed once, no help line); then D063's (task Q2.3; seller-facts.ts). */
const approvedProductOffer = () =>
  withSellerFacts(withFacts(withFacts(claimFixed("meet-kheelu"), OFFER_ADDITIONS["meet-kheelu"].edits), PRODUCT_OFFER_CARD)).querySelector("#offer")!;
/* A perk's words are always in a span (OfferCard), so a value-marked perk keeps its span. */
const KEEP = ".kh-offer__list span";

describe("OfferSection: the approved fold, exactly (media aside)", () => {
  it("product offer (meet-kheelu.html fold 3, with its accepted changes)", () => {
    const expected = builtMarkup([without(approvedProductOffer(), MEDIA)], { keepSpans: KEEP });
    const actual = canonical(without(renderedElement(<OfferSection {...PRODUCT} {...context()} />), MEDIA));
    expect(actual).toBe(expected);
  });
});

describe("OfferSection: the card's button", () => {
  it.each([
    ["the product page", PRODUCT, "product-offer"],
    ["Home's offer (task Q2.9)", HOME_OFFER, "home-offer"],
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
  /* Task Q2.13: Home's close is a CloseSection since task Q2.9, so the `close` variant left (its tests, stories and
     catalogue wording with it). */
  it("has two variants, photo and home: no close variant", () => {
    const types = readFileSync(join(process.cwd(), "src/components/sections/OfferSection/offer-section.types.ts"), "utf8");
    expect([...types.matchAll(/readonly variant: "([a-z]+)"/g)].map((m) => m[1])).toEqual(["photo", "home"]);
    const section = readFileSync(join(process.cwd(), "src/components/sections/OfferSection/OfferSection.tsx"), "utf8");
    expect(section).not.toMatch(/\bclose: \{|variant === "close"|"close"/);
  });

  it("home: the art board beside the card, named, below the first screen (its doodle draws, nothing loads eagerly)", () => {
    const board = renderedElement(<OfferSection {...HOME_OFFER} {...context()} />).querySelector(".kh-art")!;
    expect(board.getAttribute("class")).toBe("kh-art kh-tone-sun ks-offer-art");
    expect(board).toHaveAttribute("role", "img");
    expect(board).toHaveAttribute("aria-label", HOME_ART.label);
    expect(board.children).toHaveLength(4);
    expect(board.querySelector("svg.ks-doodle")).toHaveAttribute("data-draw");
    expect(board.querySelector('img[loading="eager"]')).toBeNull();
  });

  /* Task Q2.1 (D064 item 5): on laptops Home's board (the girl in the mustard frock beside Kheelu) starts level with the
     card's top; the DS split centres its two columns (bundle.css:1136). Since task Q2.15 (the consistency review's CON-3,
     QAL-2, CMO-2) both offer folds share one composition from 900 px, where the split begins: the offer split's columns
     (5:6), the column against its picture with the card, the two rows and the share link one width (432 px), and the
     picture, Home's board or the product photo, starting at the column's edge, at most 512 px and top-aligned with the
     card. Its effect is measured in a browser (the task report). */
  it("one composition from 900 px: the column one width against its picture, the picture top-aligned, on both pages", () => {
    const css = readFileSync(join(process.cwd(), "src/components/sections/OfferSection/offer-section.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const media = [...css.matchAll(/@media \(min-width: 900px\) \{([\s\S]*?)\n\}/g)].map((m) => m[1]);
    const rules = media.flatMap((block) => [...block.matchAll(/([^{}]+)\{([^}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.replace(/\s+/g, " ").trim(), body })));
    const where = (declaration: RegExp) => rules.filter((r) => declaration.test(r.body)).map((r) => r.selector);
    expect(where(/align-self:\s*start;/)).toEqual([".ks-offer-split > .ks-offer-photo, .ks-offer-split > .ks-offer-art"]);
    expect(where(/justify-self:\s*start;/)).toEqual([".ks-offer-photo, .ks-offer-art"]);
    // The board has no width of its own (its layers are placed absolutely): started at the column's edge it takes the
    // column's width, up to 512 px, or it would shrink to nothing beside the card (the task's screenshots at 1440).
    expect(rules.find((r) => r.selector === ".ks-offer-photo, .ks-offer-art")?.body).toMatch(/width:\s*100%;/);
    expect(where(/grid-template-columns:\s*minmax\(0, 5fr\) minmax\(0, 6fr\);/)).toEqual([".ks-offer-split"]);
    expect(where(/justify-items:\s*end;/)).toEqual([".ks-offer-col"]);
    expect(where(/max-width:\s*calc\(var\(--space-10\) \* 3 \+ var\(--space-7\)\);/)).toEqual([".ks-offer-col > .kh-offer, .ks-offer-col > .kh-trustline, .ks-offer-col > .ks-offer-share"]);
    // The :has() rule that top-aligned Home's board alone (Q2.1) left with the one composition.
    expect(css).not.toContain(":has(");
    // The board stays full width on phones: no rule outside the 900 px block names it.
    const outside = css.replace(/@media \(min-width: 900px\) \{[\s\S]*?\n\}/g, "");
    expect(outside).not.toContain("ks-offer-art");
    // Each page's picture is the one those rules reach, in the split's second column.
    for (const [config, picture] of [
      [HOME_OFFER, "ks-offer-art"],
      [PRODUCT, "ks-offer-photo"],
    ] as const) {
      const split = renderedElement(<OfferSection {...config} {...context()} />).querySelector(".ks-offer-split")!;
      expect(split.lastElementChild).toHaveClass(picture);
      expect(split.firstElementChild).toHaveClass("ks-offer-col");
    }
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
    // No line under the card: the Kheelona+ note is inside it since task Q2.13, and the store's sentence (offer.plus) is
    // not on the card.
    expect(section.querySelector(".kh-offer + p")).toBeNull();
    expect(section.textContent).not.toContain(TOKEN.plus);
  });

  /* Task Q2.13 (the D2C plan v2 §2 fold 7 and §3 fold 3; the CMO's m9): both cards alike. The Kheelona+ note inside the
     card, after the perks and before the button; the price printed once, in the card's price block; under the button only
     the trust line (with the card's third row) and the share link: no help line (§1.1: the closes and the store only). */
  describe.each([
    ["the product page", PRODUCT],
    ["Home", HOME_OFFER],
  ] as const)("both cards alike: %s", (_name, config) => {
    it("prints the Kheelona+ note in the card, after the perks and before the button, in the plan's words", () => {
      const card = renderedElement(<OfferSection {...config} {...context()} />).querySelector(".kh-offer")!;
      const note = card.querySelector(":scope > .ks-offer__note")!;
      expect(note.outerHTML).toBe(`<p class="kh-body-s ks-offer__note">${OFFER_NOTE}</p>`);
      expect(note.previousElementSibling).toHaveClass("kh-offer__list");
      expect(note.nextElementSibling).toHaveClass("kh-btn--cta");
      expect(OFFER_NOTE).toBe(PLUS_NOTE);
    });

    it.each([
      ["token", TOKEN],
      ["full", FULL],
    ] as const)("prints the price once, in the card's price block: the button ends the card (%s mode)", (_mode, offer) => {
      const el = renderedElement(<OfferSection {...config} {...context(offer)} />);
      const card = el.querySelector(".kh-offer")!;
      expect(card.querySelector(".kh-offer__fine")).toBeNull();
      expect(card.lastElementChild).toHaveClass("kh-btn--cta");
      expect(el.textContent).not.toContain(offer.mode === "token" ? "today, refundable." : "paid in full when you order.");
    });

    it("puts only the trust line, then the card's third row, and the share link under the card: no help line", () => {
      const el = renderedElement(<OfferSection {...config} {...context()} />);
      const column = el.querySelector(".kh-offer")!.parentElement!;
      expect([...column.children].map((c) => [...c.classList].find((k) => /^(?:kh-offer|ks-offer-third|ks-trust|ks-offer-share)$/.test(k)))).toEqual([
        "kh-offer",
        "ks-trust",
        "ks-trust",
        "ks-offer-share",
      ]);
      expect([...column.querySelectorAll(".ks-trust li")].map((li) => li.textContent)).toEqual([
        "Full refund until dispatch · 7-day returns",
        "Deliveries start mid-November",
        "6-month warranty",
        "UPI, card or net banking",
      ]);
      expect(el.querySelector(".ks-help")).toBeNull();
      expect(el.textContent).not.toContain("Questions?");
    });

    /* Task Q2.15 (the consistency review's CON-3, QAL-2, CMO-2): the plan's rows built as rows (§1.1 "Offer cards only, a
       third row"), not one list that wraps by its column's width: the trust line, then the card's third row, each a list
       of its own, so both cards group them alike at every width. */
    it("prints the trust line and the card's third row as two lists, in the plan's order", () => {
      const column = renderedElement(<OfferSection {...config} {...context()} />).querySelector(".kh-offer")!.parentElement!;
      const rows = [...column.querySelectorAll(":scope > ul.kh-trustline")];
      expect(rows.map((row) => row.getAttribute("class"))).toEqual(["kh-trustline ks-trust", "kh-trustline ks-trust ks-offer-third"]);
      expect(rows.map((row) => [...row.querySelectorAll("li")].map((li) => li.textContent))).toEqual([
        ["Full refund until dispatch · 7-day returns", "Deliveries start mid-November"],
        ["6-month warranty", "UPI, card or net banking"],
      ]);
      expect(rows[1].querySelectorAll("a").length).toBe(2);
      expect([...rows[1].querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual(["/refund#faulty", "/terms#payment"]);
    });

    /* One composition (CON-3, QAL-2, CMO-2; D064 item 5): the column (card, the two rows, the share link) beside the
       picture in the offer split, on both pages; only the picture differs (Home's board, the product photo). */
    it("lays the column beside its picture in the one offer split", () => {
      const split = renderedElement(<OfferSection {...config} {...context()} />).querySelector(".kh-split")!;
      expect(split.getAttribute("class")).toBe("kh-split ks-offer-split");
      expect([...split.children].map((c) => [...c.classList].find((k) => /^ks-offer-(?:col|photo|art)$/.test(k)))).toEqual([
        "ks-offer-col",
        config.variant === "home" ? "ks-offer-art" : "ks-offer-photo",
      ]);
      expect(split.firstElementChild!.firstElementChild).toHaveClass("kh-offer");
    });
  });

  /* Task Q2.9 (the D2C plan v2 §2 fold 7; the CMO's m8): one perk list, in Home's order, on every card. */
  it("lists the one perk list on every card, in the plan's order, Made in India last and no GST invoice", () => {
    const perks = (config: OfferSectionConfig) =>
      [...renderedElement(<OfferSection {...config} {...context()} />).querySelectorAll(".kh-offer__list li")].map((li) => li.textContent);
    const PLAN = [
      "Deliveries start mid-November. Pre-orders go out first, in the order they were placed.",
      "In the box: Kheelu plush toy, charger and quick-start card",
      "Delivery anywhere in India, included",
      "6 months of Kheelona+ included. Nothing renews without you.",
      "Made in India",
    ];
    for (const config of [PRODUCT, HOME_OFFER]) expect(perks(config)).toEqual(PLAN);
    expect(perks(PRODUCT)).not.toContain(KHEELONA_PLUS.build);
  });

  /* Task 8c.5 (D061 item 10, confirming D034): "Made in India" on both offer cards, in both modes, the seller's own origin
     line (the footer's "Made in India" and the product page's Country of origin say the same), with the DS house icon:
     the closest of the DS set's 76 to a home-grown product, as map-pin is the delivery perk's. */
  it.each([
    ["Home", HOME_OFFER],
    ["the product page", PRODUCT],
  ] as const)("%s: the Made in India perk on the card in both modes, the seller's origin line, with the DS house icon", (_name, config) => {
    for (const offer of [TOKEN, FULL]) {
      const items = [...renderedElement(<OfferSection {...config} {...context(offer)} />).querySelectorAll(".kh-offer__list > li")];
      const made = items.filter((li) => li.textContent === seller.origin.line);
      expect(made, offer.mode).toHaveLength(1);
      expect(items.at(-1)).toBe(made[0]);
      expect(made[0].querySelector("svg.kh-icon path")?.getAttribute("d")).toBe(ICON_PATHS.house);
      expect(made[0].querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
      expect(made[0].lastElementChild?.outerHTML).toBe("<span>Made in India</span>");
    }
  });

  /* Task Q2.13 (the D2C plan v2 §1.1, §3 fold 3; the CMO's m9): neither card takes a help line, whatever help the page
     passes (the WhatsApp bubble and the page's close carry it). */
  it("prints no help line under either card, whatever help line the page passes, in both modes", () => {
    for (const offer of [TOKEN, FULL]) {
      for (const config of [HOME_OFFER, PRODUCT]) {
        const el = renderedElement(<OfferSection {...config} offer={offer} ctaLabel={cta.preorder} help={seller.help} />);
        expect(el.querySelector(".ks-help")).toBeNull();
        expect(el.querySelector('a[href^="https://wa.me/91"]')).toBeNull();
      }
    }
  });

  it("never moves on arrival: no data-reveal anywhere in the section (the offer card and the price, §11.2)", () => {
    for (const config of [HOME_OFFER, PRODUCT]) expect(renderToStaticMarkup(<OfferSection {...config} {...context()} />)).not.toContain("data-reveal");
  });
});

/* Task Q2.9 (the selling update, D064, D065; the D2C plan v2 §2 fold 7): Home's offer card moved up to fold 7, so it is no
   longer the page's close (the close is a CloseSection after the FAQ). Its own fragment, #offer, as the product page's;
   the lead under the heading; the card a named region with no id of its own (the section holds #offer) and no fine print
   (its price block stands in for the price line: "not repeated"); the Kheelona+ note under the card in the plan's words; the trust line and the card's third row under the button, and no help line
   (Home has none: the WhatsApp bubble replaces them, §1.1); the share link last; the board beside it, top-aligned. */
describe("OfferSection: home (Home's offer, moved up; task Q2.9)", () => {
  const section = () => renderedElement(<OfferSection {...HOME_OFFER} {...context()} />);

  it("is the #offer section named by its heading, with the plan's lead under it", () => {
    render(<OfferSection {...HOME_OFFER} {...context()} />);
    const region = screen.getByRole("region", { name: "What you get, and what you pay." });
    expect(region).toHaveAttribute("id", "offer");
    expect(region).toHaveAttribute("aria-labelledby", "offer-title");
    expect(region.querySelector(".kh-heading--center .kh-heading__lead")?.textContent).toBe("There every day at home, with no screen to switch off.");
  });

  it("names the card as a region without an id of its own, its button home-offer, and the plan's Kheelona+ note in it", () => {
    render(<OfferSection {...HOME_OFFER} {...context()} />);
    const card = screen.getByRole("region", { name: "Kheelu offer" });
    expect(card).not.toHaveAttribute("id");
    expect(card.querySelector(".kh-btn--cta")).toHaveAttribute("data-ph-capture-attribute-cta", "home-offer");
    expect(within(card).getByText("Kheelona+ is our paid subscription, on top of the free parent app.")).toHaveClass("ks-offer__note");
    expect(section().textContent).not.toContain(TOKEN.plus);
  });

  /* Plan fold 7: "The card's price block stands in for the price line here, so it is not repeated." */
  it.each([
    ["token", TOKEN],
    ["full", FULL],
  ] as const)("prints the price in the card's price block only: no short price line under the button (%s mode)", (_mode, offer) => {
    const el = renderedElement(<OfferSection {...HOME_OFFER} {...context(offer)} />);
    const card = el.querySelector(".kh-offer")!;
    expect(card.querySelector(".kh-offer__fine")).toBeNull();
    expect(card.lastElementChild).toHaveAttribute("data-ph-capture-attribute-cta", "home-offer");
    expect(el.textContent).not.toContain(offer.mode === "token" ? "today, refundable." : "paid in full when you order.");
  });

  it("puts the trust line with the card's third row under it, no help line, then the share link last in the column", () => {
    const el = section();
    const column = el.querySelector(".kh-offer")!.parentElement!;
    expect([...column.children].map((c) => c.className)).toEqual(["kh-offer", "kh-trustline ks-trust", "kh-trustline ks-trust ks-offer-third", "kh-section__actions ks-offer-share"]);
    expect([...column.querySelectorAll(".ks-trust li")].map((li) => li.textContent)).toEqual([
      "Full refund until dispatch · 7-day returns",
      "Deliveries start mid-November",
      "6-month warranty",
      "UPI, card or net banking",
    ]);
    expect(el.querySelector(".ks-help")).toBeNull();
    expect(el.querySelectorAll(".kh-btn--cta")).toHaveLength(1);
  });

  it("keeps the board beside the card, named, lazy, its heart drawing; the top-alignment rule reaches it", () => {
    const el = section();
    const split = el.querySelector(".kh-split")!;
    expect(split.firstElementChild?.firstElementChild).toHaveClass("kh-offer");
    const board = split.lastElementChild!;
    expect(board).toHaveClass("kh-art");
    expect(board).toHaveAttribute("aria-label", HOME_ART.label);
    expect(board.querySelector("svg.ks-doodle")).toHaveAttribute("data-draw");
    expect(board.querySelector('img[loading="eager"]')).toBeNull();
  });

  it("prints the full-mode card without the split or the later price, and moves nothing on arrival", () => {
    const full = renderedElement(<OfferSection {...HOME_OFFER} {...context(FULL)} />);
    expect(full.querySelector(".kh-offer__split, .ks-offer__later")).toBeNull();
    expect(full.querySelector(".kh-offer__price")?.textContent).toBe("₹7,999");
    expect(renderToStaticMarkup(<OfferSection {...HOME_OFFER} {...context()} />)).not.toContain("data-reveal");
    expect(full.textContent).not.toMatch(/GST|first 500/);
  });
});

/* Task 8c.2 (D061 item 3): the later price on both cards while the first-500 price is live, never in full mode, never
   struck through (PRICE-01, DARK-01). */
describe("OfferSection: the later price on the card (D061 item 3)", () => {
  const LATER = "₹4,999 for the first 500 units. ₹7,999 once they are gone.";

  it.each([
    ["Home", HOME_OFFER],
    ["the product page", PRODUCT],
  ] as const)("%s, token mode: a plain line under the amount, in the card's prices row", (_name, config) => {
    const prices = renderedElement(<OfferSection {...config} {...context(TOKEN)} />).querySelector(".kh-offer__prices")!;
    const later = prices.querySelectorAll(".ks-offer__later");
    expect(later).toHaveLength(1);
    expect(later[0].textContent).toBe(LATER);
    expect(later[0].getAttribute("class")).toBe("kh-body-s ks-offer__later");
    expect(prices.lastElementChild).toBe(later[0]);
  });

  it.each([
    ["Home", HOME_OFFER],
    ["the product page", PRODUCT],
  ] as const)("%s, full mode: no later price anywhere (the later price is the price)", (_name, config) => {
    const full = renderedElement(<OfferSection {...config} {...context(FULL)} />);
    expect(full.querySelector(".ks-offer__later")).toBeNull();
    expect(full.textContent).not.toMatch(/first 500|once they are gone/);
  });

  it("never strikes a price through, never counts units, never says save, in either mode", () => {
    for (const offer of [TOKEN, FULL]) {
      for (const config of [HOME_OFFER, PRODUCT]) {
        const section = renderedElement(<OfferSection {...config} {...context(offer)} />);
        expect(section.querySelectorAll("s, del, strike, .kh-offer__was, .kh-offer__count, .kh-offer__bar, .kh-sticker")).toHaveLength(0);
        expect(section.textContent).not.toMatch(/\bsave\b|\bleft at this price\b|\bunits left\b/i);
      }
    }
  });
});

/* Task 8c.2 (D061; the main session's ruling on the share link): "Know a parent who needs this? Share Kheelu on WhatsApp"
   under both cards, last in the offer's column, through Button as a ghost link (the DS link style, never WhatsApp green:
   D050 keeps that colour for the bubble), tracked `share-whatsapp`. */
describe("OfferSection: the share link under the card", () => {
  const shareOf = (config: OfferSectionConfig, offer = TOKEN) => {
    const section = renderedElement(<OfferSection {...config} {...context(offer)} />);
    const links = section.querySelectorAll('[data-ph-capture-attribute-cta="share-whatsapp"]');
    expect(links).toHaveLength(1);
    return { section, link: links[0] as HTMLAnchorElement };
  };

  it.each([
    ["Home", HOME_OFFER],
    ["the product page", PRODUCT],
  ] as const)("%s: one ghost link with the live site's words, opening WhatsApp with the offer's message", (_name, config) => {
    const { link } = shareOf(config);
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("class")).toBe("kh-btn kh-btn--ghost");
    expect(link.textContent).toBe("Know a parent who needs this? Share Kheelu on WhatsApp");
    expect(link.getAttribute("href")).toBe(TOKEN.share?.href);
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/\?text=/);
  });

  /* Task 8c.5 (the 8c merge's follow-up): WhatsApp opens in a new tab, as from the D050 bubble, so the page the parent
     was reading stays where it was. */
  it.each([
    ["Home", HOME_OFFER],
    ["the product page", PRODUCT],
  ] as const)("%s: opens WhatsApp in a new tab with rel=noopener, as the D050 bubble does", (_name, config) => {
    const { link } = shareOf(config);
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener");
  });

  it.each([
    ["Home", HOME_OFFER],
    ["the product page", PRODUCT],
  ] as const)("%s: sits last in the offer's column, after the trust line (no help line, task Q2.13), in an actions row of its own", (_name, config) => {
    const { section, link } = shareOf(config);
    const row = link.parentElement!;
    expect(row.getAttribute("class")).toBe("kh-section__actions ks-offer-share");
    expect(row.children).toHaveLength(1);
    const column = section.querySelector(".kh-offer")!.parentElement!;
    expect(row.parentElement).toBe(column);
    expect(column.lastElementChild).toBe(row);
    expect(row.previousElementSibling?.getAttribute("class")).toBe("kh-trustline ks-trust ks-offer-third");
  });

  /* Task Q2.13's screenshots: at 360-412 px and on the product page's 432 px laptop column the link wrapped mid-sentence
     ("… Share Kheelu on" over an orphaned "WhatsApp"). Balanced, it breaks at its sentence on both cards at every width
     where it wraps ("Know a parent who needs this?" over "Share Kheelu on WhatsApp"; measured in a browser, the report). */
  it("wraps at its sentence when it wraps: the share row balances its lines, on both cards", () => {
    const css = readFileSync(join(process.cwd(), "src/components/sections/OfferSection/offer-section.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim(), body }));
    expect(rules.filter((r) => /text-wrap:\s*balance;/.test(r.body)).map((r) => r.selector)).toEqual([".ks-offer-share"]);
    for (const config of [HOME_OFFER, PRODUCT]) expect(shareOf(config).link.parentElement).toHaveClass("ks-offer-share");
  });

  it("is never a chilli button, never the bubble's green, and leaves the card's button the section's one chilli button", () => {
    for (const config of [HOME_OFFER, PRODUCT]) {
      const { section, link } = shareOf(config);
      expect(link.className).not.toMatch(/kh-btn--cta|kh-btn--primary|ks-wa/);
      expect(section.querySelectorAll(".kh-btn--cta")).toHaveLength(1);
    }
  });

  it("follows the mode: the full-mode message never names the advance", () => {
    for (const config of [HOME_OFFER, PRODUCT]) {
      const { link } = shareOf(config, FULL);
      expect(link.getAttribute("href")).toBe(FULL.share?.href);
      const text = new URL(link.getAttribute("href")!).searchParams.get("text")!;
      expect(text).toContain("₹7,999 (incl. GST), paid in full when you order.");
      expect(text).not.toContain("₹499");
    }
  });

  it("is left out when an offer has no share copy (a locale without one)", () => {
    const bare: Offer = { ...TOKEN, share: undefined };
    for (const config of [HOME_OFFER, PRODUCT]) {
      expect(renderedElement(<OfferSection {...config} {...context(bare)} />).querySelector(".ks-offer-share")).toBeNull();
    }
  });
});

/* The three additions as a parity deviation (deviations.ts OFFER_ADDITIONS; the rows the main session files for task 8c.2
   and V47 for task 8c.5): on each page the rule accepts exactly the five sentences the edits add (the later price's two,
   the Made in India perk, the share link's two, in the page's order) and excuses none, and the pixels hide exactly the
   three added blocks, on the build's side. */
describe.each(["home", "meet-kheelu"] as const)("%s: the offer additions of tasks 8c.2 and 8c.5 as a parity deviation", (slug) => {
  const additions = OFFER_ADDITIONS[slug];
  const base = claimFixed(slug);

  /* Since task Q2.9 the card's list is the one perk list (ONE_PERK_LIST): the frozen card's perks the list no longer
     says go, its new lines come (Made in India, task 8c.5's perk, among them). */
  it("adds the later price's two sentences, the one perk list's new lines and the share link's two, and takes away the perks it drops", () => {
    const sorted = (lines: readonly string[]) => [...lines].sort();
    const diff = factSentences(base, additions.edits);
    expect(sorted(diff.missing)).toEqual(sorted(additions.mockup));
    expect(sorted(diff.extra)).toEqual(sorted(additions.build));
    expect(additions.build).toEqual([
      "₹4,999 for the first 500 units.",
      "₹7,999 once they are gone.",
      "Deliveries start mid-November.",
      "Pre-orders go out first, in the order they were placed.",
      "6 months of Kheelona+ included.",
      "Nothing renews without you.",
      "Made in India",
      "Know a parent who needs this?",
      "Share Kheelu on WhatsApp",
    ]);
    expect(additions.mockup).toEqual(
      slug === "home"
        ? ["Deliveries start mid-November", "A GST invoice with every order"]
        : [KHEELONA_PLUS.build, "Deliveries start mid-November", "A GST invoice with every order"],
    );
  });

  it("adds nothing the banned-phrases list refuses (claims, offer terms, spelling)", () => {
    expect(findBanned(additions.build.join("\n"))).toEqual([]);
  });

  it("is one text rule of the page, before D058's claim fixes (task 8c.4's FAQ fix may follow them), accepting exactly those sentences", () => {
    const rules = TEXT_DEVIATIONS[slug] ?? [];
    const own = rules.filter((r) => r.approvedBy === additions.approvedBy);
    expect(own).toHaveLength(1);
    const claimsAt = rules.findIndex((r) => r.approvedBy === CLAIM_FIXES[slug].approvedBy);
    expect(claimsAt).toBeGreaterThan(rules.indexOf(own[0]));
    const reach = ruleReach(base, additions.edits, own[0]);
    expect([...reach.excused].sort()).toEqual([...additions.mockup].sort());
    expect([...reach.accepted].sort()).toEqual([...additions.build].sort());
    expect(own[0].jsOff).toBeUndefined();
  });

  it("hides for the pixels the three added blocks on the build's side, each found once (the whole perk list since task Q2.9)", () => {
    expect(hiddenProblems(base, additions)).toEqual([]);
    const rows = (VISUAL_HIDDEN[slug] ?? []).filter((r) => r.approvedBy === additions.approvedBy);
    expect(rows.map((r) => [r.side, r.selector])).toEqual([
      ["build", ".ks-offer__later"],
      ["build", ".kh-offer__list"],
      ["build", ".ks-offer-share"],
    ]);
  });

  it("names V47 for the Made in India perk (D061 item 10) beside task 8c.2's rows", () => {
    expect(additions.approvedBy).toMatch(/^deviations\.md rows for task 8c\.2/);
    expect(additions.approvedBy).toContain("V47");
    expect(additions.approvedBy).toContain("D061 item 10");
  });

  it("finds each hidden block once in the section as it renders (token mode)", () => {
    const config = slug === "home" ? HOME_OFFER : PRODUCT;
    const section = renderedElement(<OfferSection {...config} {...context()} />);
    for (const selector of additions.hidden.build) expect(section.querySelectorAll(selector), selector).toHaveLength(1);
  });
});

describe("OfferSection: full mode (ADR-005, G-08)", () => {
  it.each([
    ["Home", HOME_OFFER],
    ["the product page", PRODUCT],
  ] as const)("%s: no split, the full price once; perks, the note and the trust line unchanged", (_name, config) => {
    const full = renderedElement(<OfferSection {...config} {...context(FULL)} />);
    const token = renderedElement(<OfferSection {...config} {...context(TOKEN)} />);
    expect(full.querySelector(".kh-offer__split")).toBeNull();
    expect(token.querySelector(".kh-offer__split")).not.toBeNull();
    // No note beside the amount (D065 item 3; task Q2.8), and the price once: no fine print (task Q2.13).
    expect(full.querySelector(".kh-offer__prices")?.textContent).toBe("₹7,999");
    expect(full.querySelector(".kh-offer__fine")).toBeNull();
    expect(full.textContent).not.toMatch(/₹499|₹4,500|₹4,999/);
    for (const part of [".kh-offer__list", ".ks-offer__note", ".ks-trust"]) {
      expect(full.querySelector(part)?.outerHTML, part).toBe(token.querySelector(part)?.outerHTML);
    }
  });
});
