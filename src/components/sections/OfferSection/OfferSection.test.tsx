import { render, screen, within } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import { TRUST_FULL, trustItems } from "@/content/en-IN/trust";
import type { ArtBoardRef, ImageRef, Offer } from "@/content/types";
import { buildOffer } from "@/lib/offer/offer";
import type { SellingContext } from "../CtaBlock/cta-block.types";
import {
  CLAIM_FIXES,
  editsBeforeClaimFixes,
  KHEELONA_PLUS,
  OFFER_ADDITIONS,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
} from "../../../../test/e2e/support/deviations";
import { findBanned } from "../../../../test/guards/banned-phrases.data";
import { builtMarkup, canonical, mockupFold, renderedElement, STORE, without } from "../../../../test/support/mockup-compare";
import { factSentences, hiddenProblems, ruleReach, withFacts } from "../../../../test/support/mockup-facts";
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
type Slug = "home" | "meet-kheelu";
/** A page's main with the page's earlier accepted changes applied: since task 8b.1 the Kheelona+ line under Home's card
 *  and the product card's perk read D058 item 3's sentence (deviations.md V26, V27; CLAIM_FIXES). */
const claimFixed = (slug: Slug) => withFacts(withFacts(mockupFold(slug, "main"), editsBeforeClaimFixes(slug)), CLAIM_FIXES[slug].edits);
/** A page's fold as approved, with the page's accepted changes applied, then task 8c.2's: the later price on the card and
 *  the share link under it (D061; OFFER_ADDITIONS). */
const approvedFold = (slug: Slug, fold: string) => withFacts(claimFixed(slug), OFFER_ADDITIONS[slug].edits).querySelector(fold)!;
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

  it("lists the perks of its placement: Home's five, the product page's six (Kheelona+ among them), Made in India last on both", () => {
    const perks = (config: OfferSectionConfig) =>
      [...renderedElement(<OfferSection {...config} {...context()} />).querySelectorAll(".kh-offer__list li")].map((li) => li.textContent);
    expect(perks(HOME)).toEqual([
      "Deliveries start mid-November",
      "In the box: Kheelu plush toy, charger and quick-start card",
      "Delivery anywhere in India, included",
      "A GST invoice with every order",
      "Made in India",
    ]);
    expect(perks(PRODUCT)).toHaveLength(6);
    expect(perks(PRODUCT)[1]).toBe(KHEELONA_PLUS.build);
    expect(perks(PRODUCT)[5]).toBe("Made in India");
  });

  /* Task 8c.5 (D061 item 10, confirming D034): "Made in India" on both offer cards, in both modes, the seller's own origin
     line (the footer's "Made in India" and the product page's Country of origin say the same), with the DS house icon:
     the closest of the DS set's 76 to a home-grown product, as map-pin is the delivery perk's. */
  it.each([
    ["Home", HOME],
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

/* Task 8c.2 (D061 item 3): the later price on both cards while the first-500 price is live, never in full mode, never
   struck through (PRICE-01, DARK-01). */
describe("OfferSection: the later price on the card (D061 item 3)", () => {
  const LATER = "₹4,999 for the first 500 units. ₹7,999 once they are gone.";

  it.each([
    ["Home", HOME],
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
    ["Home", HOME],
    ["the product page", PRODUCT],
  ] as const)("%s, full mode: no later price anywhere (the later price is the price)", (_name, config) => {
    const full = renderedElement(<OfferSection {...config} {...context(FULL)} />);
    expect(full.querySelector(".ks-offer__later")).toBeNull();
    expect(full.textContent).not.toMatch(/first 500|once they are gone/);
  });

  it("never strikes a price through, never counts units, never says save, in either mode", () => {
    for (const offer of [TOKEN, FULL]) {
      for (const config of [HOME, PRODUCT]) {
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
    ["Home", HOME],
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
    ["Home", HOME],
    ["the product page", PRODUCT],
  ] as const)("%s: opens WhatsApp in a new tab with rel=noopener, as the D050 bubble does", (_name, config) => {
    const { link } = shareOf(config);
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener");
  });

  it.each([
    ["Home", HOME],
    ["the product page", PRODUCT],
  ] as const)("%s: sits last in the offer's column, after the help line, in an actions row of its own", (_name, config) => {
    const { section, link } = shareOf(config);
    const row = link.parentElement!;
    expect(row.getAttribute("class")).toBe("kh-section__actions ks-offer-share");
    expect(row.children).toHaveLength(1);
    const column = section.querySelector(".kh-offer")!.parentElement!;
    expect(row.parentElement).toBe(column);
    expect(column.lastElementChild).toBe(row);
    expect(row.previousElementSibling?.classList.contains("ks-help")).toBe(true);
  });

  it("is never a chilli button, never the bubble's green, and leaves the card's button the section's one chilli button", () => {
    for (const config of [HOME, PRODUCT]) {
      const { section, link } = shareOf(config);
      expect(link.className).not.toMatch(/kh-btn--cta|kh-btn--primary|ks-wa/);
      expect(section.querySelectorAll(".kh-btn--cta")).toHaveLength(1);
    }
  });

  it("follows the mode: the full-mode message never names the advance", () => {
    for (const config of [HOME, PRODUCT]) {
      const { link } = shareOf(config, FULL);
      expect(link.getAttribute("href")).toBe(FULL.share?.href);
      const text = new URL(link.getAttribute("href")!).searchParams.get("text")!;
      expect(text).toContain("₹7,999 (incl. GST), paid in full when you order.");
      expect(text).not.toContain("₹499");
    }
  });

  it("is left out when an offer has no share copy (a locale without one)", () => {
    const bare: Offer = { ...TOKEN, share: undefined };
    for (const config of [HOME, PRODUCT]) {
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

  it("adds exactly the later price's two sentences, the Made in India perk and the share link's two, and takes none away", () => {
    expect(factSentences(base, additions.edits)).toEqual({ missing: [], extra: [...additions.build] });
    expect(additions.build).toEqual([
      "₹4,999 for the first 500 units.",
      "₹7,999 once they are gone.",
      "Made in India",
      "Know a parent who needs this?",
      "Share Kheelu on WhatsApp",
    ]);
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
    expect(ruleReach(base, additions.edits, own[0])).toEqual({ excused: [], accepted: [...additions.build] });
    expect(own[0].jsOff).toBeUndefined();
  });

  it("hides for the pixels the three added blocks on the build's side, each found once", () => {
    expect(hiddenProblems(base, additions)).toEqual([]);
    const rows = (VISUAL_HIDDEN[slug] ?? []).filter((r) => r.approvedBy === additions.approvedBy);
    expect(rows.map((r) => [r.side, r.selector])).toEqual([
      ["build", ".ks-offer__later"],
      ["build", ".kh-offer__list > li:last-child"],
      ["build", ".ks-offer-share"],
    ]);
  });

  it("names V47 for the Made in India perk (D061 item 10) beside task 8c.2's rows", () => {
    expect(additions.approvedBy).toMatch(/^deviations\.md rows for task 8c\.2/);
    expect(additions.approvedBy).toContain("V47");
    expect(additions.approvedBy).toContain("D061 item 10");
  });

  it("finds each hidden block once in the section as it renders (token mode)", () => {
    const config = slug === "home" ? HOME : PRODUCT;
    const section = renderedElement(<OfferSection {...config} {...context()} />);
    for (const selector of additions.hidden.build) expect(section.querySelectorAll(selector), selector).toHaveLength(1);
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
    // No note beside the amount and the short price line as fine print (D065 item 3; task Q2.8).
    expect(full.querySelector(".kh-offer__prices")?.textContent).toBe("₹7,999");
    expect(full.querySelector(".kh-offer__fine")?.textContent).toBe("₹7,999 in total, paid in full when you order.");
    expect(full.textContent).not.toMatch(/₹499|₹4,500|₹4,999/);
    for (const part of [".kh-offer__list", ".ks-trust", ".ks-help"]) {
      expect(full.querySelector(part)?.outerHTML, part).toBe(token.querySelector(part)?.outerHTML);
    }
    if (config.variant === "close") expect(full.textContent).toContain(FULL.plus);
  });
});
