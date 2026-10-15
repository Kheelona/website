import { render, screen } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import { TRUST_COMPACT, trustItems, type TrustId } from "@/content/en-IN/trust";
import type { ArtBoardRef } from "@/content/types";
import { buildOffer } from "@/lib/offer/offer";
import type { CtaSecondary, SellingContext } from "../CtaBlock/cta-block.types";
import { withSellerFacts } from "../../../../test/e2e/support/seller-facts";
import { addClass, builtMarkup, canonical, mockupFold, renderedElement, STORE, without } from "../../../../test/support/mockup-compare";
import { CloseSection } from "./CloseSection";
import { CLAMPED_SPLIT_COLUMN_SIZES } from "./close-art";
import { CenterClose } from "./close-fold";
import type { CloseSectionConfig } from "./close-section.types";

/* CloseSection (task 3.2): every close of the approved mockup, from the real content in both offer modes. The art
   boards are ArtBoard's (task 2.3), checked here for what the section passes them. */

const TOKEN = buildOffer("token");
const FULL = buildOffer("full");
const context = (offer = TOKEN): SellingContext => ({ offer, ctaLabel: cta.preorder, help: seller.help });
const trust = (ids: readonly TrustId[]) => ids.map((id) => trustItems[id]);
const COMPACT = trust(TRUST_COMPACT);
const SEE_HOW: CtaSecondary = { label: "See how it works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" };

const raster = (name: string) => ({ src: `/_next/static/media/${name}`, width: 800, height: 1000 }) as StaticImageData;
const art = (tone: ArtBoardRef["tone"], label: string): ArtBoardRef => ({
  tone,
  label,
  layers: [
    { image: { src: raster("shape.svg"), alt: "" }, left: 6, width: 28, top: 7 },
    { image: { src: raster("kheelu-front-sticker.png"), alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
    { doodle: { name: "ink-star" }, left: 84, width: 11, top: 8, rotate: 14 },
  ],
});
const JOURNAL_HEADING = {
  title: "A toy that {hand:asks back.}",
  lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.",
};
const journal: CloseSectionConfig = {
  variant: "journal",
  heading: JOURNAL_HEADING,
  cta: { cta: "finale", arrow: true, block: true, trust: COMPACT, helpLine: true, secondary: SEE_HOW },
  art: art("sun", "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy."),
};

type Case = [name: string, slug: string, fold: string, config: CloseSectionConfig];
const CASES: Case[] = [
  [
    "safety close (split, clamped art)",
    "safety",
    "#close",
    {
      variant: "split",
      heading: {
        eyebrow: "Pre-order",
        title: "Check it all for yourself, {hand:at home.}",
        lead: "The wake-up button, the light and every conversation in the parent app: you can check each one once it’s home.",
      },
      cta: { cta: "finale", arrow: true, block: true, trust: COMPACT, helpLine: true },
      art: art("blue", "A laughing girl in a peach kurta beside Kheelu, the cream plush rabbit."),
      artClamp: true,
    },
  ],
  [
    "product close (split, the full block)",
    "meet-kheelu",
    "#close",
    {
      variant: "split",
      heading: {
        eyebrow: "Pre-order",
        title: "Bring home a toy that {hand:asks back.}",
        lead: "For your own child, or as a gift for a 3 to 7 year old in the family.",
      },
      // The trust line in place of meet-kheelu.html's five-item row since task Q2.8's review (the D2C plan v2 §1.1; the
      // harness reads the mockup's row so, test/support/mockup-compare.ts withPriceLine).
      cta: { cta: "product-foot", layout: "full", trust: COMPACT, helpLine: true },
      art: art("sun", "A smiling girl in a peach kurta beside Kheelu, the cream plush rabbit."),
    },
  ],
  [
    "guide close (tinted card)",
    "ai-toys-for-kids-in-india",
    "#close",
    {
      variant: "guide",
      tone: "blue",
      heading: { eyebrow: "Pre-order", title: "Five checks, answered. Now {hand:meet Kheelu.}", lead: "Bring it home and check all five answers for yourself." },
      cta: { cta: "finale", arrow: true, block: true, trust: COMPACT, helpLine: true },
      art: art("sun", "A boy in glasses and a rust T-shirt beside Kheelu, the cream plush rabbit."),
    },
  ],
  ["stories hub close (journal)", "stories", "#close", journal],
  ["article close (journal)", "story-learning-toys-for-a-three-year-old", "#close", journal],
  [
    "team close (centred)",
    "team",
    "#close",
    { variant: "center", heading: { title: "Bring Kheelu {hand:home.}" }, cta: { cta: "finale", trust: COMPACT, helpLine: true, secondary: { ...SEE_HOW, label: "See how Kheelu works" } } },
  ],
  [
    "contact close (centred, no help line)",
    "contact",
    "#close",
    { variant: "center", heading: { title: "Ready when {hand:you are.}" }, cta: { cta: "finale", trust: COMPACT, secondary: { ...SEE_HOW, label: "See how Kheelu works" } } },
  ],
  ["404 close (centred)", "404", "#close", { variant: "center", heading: { title: "Looking for {hand:Kheelu?}" }, cta: { cta: "finale", trust: COMPACT, helpLine: true } }],
  [
    "setup close (links, no chilli button)",
    "setup",
    "#help",
    {
      variant: "links",
      heading: { title: "Stuck? {hand:We’ll help.}" },
      /* WhatsApp or email, the call off (D063 item 2; task Q2.3). */
      contact:
        "[WhatsApp](https://wa.me/919187546483) or email [hello@kheelona.com](mailto:hello@kheelona.com). Tell us your order number, and what you see on Kheelu and in the app.",
      action: { label: "All the ways to reach us", href: "/contact", variant: "secondary", icon: "chat-circle-dots" },
      meet: { lead: "Don’t have Kheelu yet?", link: "[Meet Kheelu](/products/kheelu)" },
    },
  ],
];

/* The build's documented differences inside a close (besides the harness's, test/support/mockup-compare.ts, and CtaBlock's): the journal
   close's section and board take their own names (mk-close is a stories-page name; in one global stylesheet it
   would read as every close's, mockup-css-mapping §6.2), the guide close's board clamp is ArtBoard's class, and the
   CtaBlock classes (CtaBlock.test.tsx). */
const RENAMES = { close: ["ks-close-journal"], "close-art": ["ks-close-journal__art"], "sf-cta": [], "gd-cta": [], "close-cta": [], "close-trust": ["ks-cta__full-trust"] };
const adjustFor = (config: CloseSectionConfig) => (el: Element) => {
  addClass(el, ".kh-btn--cta", "ks-cta__button");
  addClass(el, ".kh-btn--cta > svg", "ks-btn__arrow");
  addClass(el, ".ks-beside--center .kh-trustline", "ks-trustline--center");
  if (config.variant === "split" && config.cta.layout === "full") addClass(el, ".kh-split .ks-help", "ks-cta__full-help");
};
/* Every close as D063 items 2-3 rule its mockup (task Q2.3; test/e2e/support/seller-facts.ts): the help and contact
   lines keep WhatsApp and the email, without the number. */
const ruledFold = (slug: string, fold: string) => withSellerFacts(mockupFold(slug, fold));

describe("CloseSection: every close of the approved mockup, exactly (art aside)", () => {
  it.each(CASES)("%s", (_name, slug, fold, config) => {
    const expected = builtMarkup([without(ruledFold(slug, fold), ".kh-art")], { renames: RENAMES, adjust: adjustFor(config) });
    const actual = canonical(without(renderedElement(<CloseSection {...config} {...context()} />), ".kh-art"));
    expect(actual).toBe(expected);
  });

  /* A trust item draws the icon its config passes, not the content's (the product close passed map-pin for "Delivery
     included anywhere in India" until task Q2.8's review gave that close the trust line). */
  it("draws the icon its config passes for a trust item (no rewrite of the content)", () => {
    const product = CASES[1][3];
    if (product.variant !== "split") throw new Error("the product close is a split close");
    const pinned = trust(["delivery-included"]).map((item) => ({ ...item, icon: "map-pin" }));
    const html = renderToStaticMarkup(<CloseSection {...product} cta={{ ...product.cta, trust: pinned }} {...context()} />);
    expect(html).toContain(ICON_PATHS["map-pin"]);
    expect(html).not.toContain(ICON_PATHS.package);
  });

  /* Task 3.6 item 6: /setup's links close renders its three content lines with the page's offer, as every other close
     renders its words, so copy that changes with the mode or names the delivery line works there too. */
  it("links: the contact line, the lead and the link render with the offer", () => {
    const links = CASES[8][3];
    if (links.variant !== "links") throw new Error("CASES[8] is the links close");
    const config: CloseSectionConfig = {
      ...links,
      contact: { token: "Token-mode help.", full: "Full-mode help." },
      meet: { lead: "{delivery}.", link: { token: "[Token link](/products/kheelu)", full: "[Full link](/products/kheelu)" } },
    };
    const token = renderedElement(<CloseSection {...config} {...context(TOKEN)} />);
    expect(token.querySelector(".ks-setup-help")?.textContent).toContain("Token-mode help.");
    expect(token.querySelector(".ks-setup-meet")?.textContent).toContain(`${TOKEN.delivery}.`);
    expect(token.querySelector(".ks-setup-meet a")?.textContent).toBe("Token link");
    const full = renderedElement(<CloseSection {...config} {...context(FULL)} />);
    expect(full.querySelector(".ks-setup-help")?.textContent).toContain("Full-mode help.");
    expect(full.querySelector(".ks-setup-meet a")?.textContent).toBe("Full link");
  });
});

describe("CloseSection: the art board", () => {
  const board = (config: CloseSectionConfig) => renderedElement(<CloseSection {...config} {...context()} />).querySelector(".kh-art");

  it("sits beside the words in its tone, named, below the first screen (doodle drawn, nothing eager)", () => {
    const el = board(CASES[0][3])!;
    expect(el).toHaveAttribute("role", "img");
    expect(el).toHaveAttribute("aria-label", "A laughing girl in a peach kurta beside Kheelu, the cream plush rabbit.");
    expect(el.querySelector("svg.ks-doodle")).toHaveAttribute("data-draw");
    expect(el.querySelector('img[loading="eager"]')).toBeNull();
    expect(el.parentElement).toHaveClass("kh-split");
  });

  it("takes ArtBoard's 480 px tablet clamp on the safety and guide closes only", () => {
    expect(board(CASES[0][3])).toHaveClass("ks-art--clamp");
    expect(board(CASES[2][3])).toHaveClass("ks-art--clamp");
    expect(board(CASES[1][3])).not.toHaveClass("ks-art--clamp");
    expect(board(journal)).not.toHaveClass("ks-art--clamp");
    expect(board(CASES[0][3])!.querySelectorAll("img")[1]).toHaveAttribute("sizes", expect.stringContaining("(min-width: 720px) calc(480px * 0.42)"));
    expect(CLAMPED_SPLIT_COLUMN_SIZES).toContain("(min-width: 720px) 480px");
  });

  it("journal: the 4:3 board of the journal close, shown from 900 px (stories.css:47, 143)", () => {
    const el = board(journal)!;
    expect(el.getAttribute("class")).toBe("kh-art kh-tone-sun ks-close-journal__art");
    expect(el.getAttribute("style")).toBe("--kh-ratio:4 / 3");
  });

  it("the centred and links closes have none", () => {
    expect(board(CASES[5][3])).toBeNull();
    expect(board(CASES[8][3])).toBeNull();
  });
});

describe("CloseSection: the section", () => {
  it("is a region named by its heading, with the close fragment (#close), or #help on /setup", () => {
    render(<CloseSection {...CASES[5][3]} {...context()} />);
    expect(screen.getByRole("region", { name: "Bring Kheelu home." })).toHaveAttribute("id", "close");
    render(<CloseSection {...CASES[8][3]} {...context()} />);
    expect(screen.getByRole("region", { name: "Stuck? We’ll help." })).toHaveAttribute("id", "help");
  });

  it("holds one chilli button, to the store, with the close's value; the links close holds none", () => {
    for (const [, , , config] of CASES) {
      const buttons = renderedElement(<CloseSection {...config} {...context()} />).querySelectorAll(".kh-btn--cta");
      if (config.variant === "links") {
        expect(buttons).toHaveLength(0);
        continue;
      }
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveAttribute("href", STORE);
      expect(buttons[0]).toHaveAttribute("data-ph-capture-attribute-cta", config.cta.cta);
    }
  });

  it("draws the arrow where the mockup does: the guide, safety, stories and article closes", () => {
    const arrowed = CASES.filter(([, , , c]) => renderedElement(<CloseSection {...c} {...context()} />).querySelector(".ks-btn__arrow")).map(([n]) => n);
    expect(arrowed).toEqual(["safety close (split, clamped art)", "guide close (tinted card)", "stories hub close (journal)", "article close (journal)"]);
  });

  it("never moves on arrival: no data-reveal in any close (a chilli button and the price, §11.2)", () => {
    for (const [, , , config] of CASES) expect(renderToStaticMarkup(<CloseSection {...config} {...context()} />)).not.toContain("data-reveal");
  });
});

describe("CloseSection: full mode (ADR-005)", () => {
  it.each(CASES.filter(([, , , c]) => c.variant !== "links"))("%s: the full-mode sentence and nothing else changes", (_name, _slug, _fold, config) => {
    const PRICE = /<p( id="[^"]*")? class="kh-body-s ks-price">[^<]*<\/p>/;
    const token = renderToStaticMarkup(<CloseSection {...config} {...context(TOKEN)} />);
    const full = renderToStaticMarkup(<CloseSection {...config} {...context(FULL)} />);
    expect(full.match(PRICE)?.[0]).toContain("₹7,999 in total, paid in full when you order.");
    expect(full.replace(PRICE, "")).toBe(token.replace(PRICE, ""));
  });
});

/* Task 4.9 item 4: the centred close has its own module (close-fold.tsx, with the fold and the heading every close
   shares) that never reaches the art board, so the 404 loads it without next/image; CloseSection renders it for `center`.
   The 404 renders CenterClose directly, so CenterClose itself is held to the approved mockup's centred closes. */
describe("CenterClose (close-fold.tsx)", () => {
  const CENTER = CASES.filter(([, , , c]) => c.variant === "center");

  it("covers the three centred closes: team, contact and 404", () => {
    expect(CENTER.map(([, slug]) => slug)).toEqual(["team", "contact", "404"]);
  });

  it.each(CENTER)("%s: the mockup's centred close, exactly", (_name, slug, fold, config) => {
    if (config.variant !== "center") throw new Error("a centred close");
    const expected = builtMarkup([ruledFold(slug, fold)], { renames: RENAMES, adjust: adjustFor(config) });
    expect(canonical(renderedElement(<CenterClose {...config} {...context()} />))).toBe(expected);
  });

  it.each(CENTER)("%s: in full mode only the price sentence changes", (_name, _slug, _fold, config) => {
    if (config.variant !== "center") throw new Error("a centred close");
    const PRICE = /<p( id="[^"]*")? class="kh-body-s ks-price">[^<]*<\/p>/;
    const token = renderToStaticMarkup(<CenterClose {...config} {...context(TOKEN)} />);
    const full = renderToStaticMarkup(<CenterClose {...config} {...context(FULL)} />);
    expect(full.match(PRICE)?.[0]).toContain("₹7,999 in total, paid in full when you order.");
    expect(full.replace(PRICE, "")).toBe(token.replace(PRICE, ""));
  });
});
