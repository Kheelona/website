import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Offer } from "@/content/types";
import { PriceSentence, offerWords } from "./PriceSentence";

/* Hand-written offers in both modes (ADR-005): the amounts are what formatInr gives for the checkout's own
   paise constants, the sentences are the D028 wording as content/en-IN/offer.ts holds it (price tokens, never a
   typed amount). Expected text is written out by hand from wiki/site/pages/home.md "At a glance". */
const card = { product: "Kheelu", priceNote: "incl. GST", perks: { home: [], product: [] } };
const TOKEN: Offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { token: "₹499", balance: "₹4,500", headline: "₹4,999", full: "₹7,999", mrp: "₹7,999" },
  sentence:
    "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
  sticky: { big: "{price:token} today", small: "refundable · {price:headline} total (incl. GST)" },
  card,
  plus: "Every Kheelu comes with 6 months of Kheelona+.",
  delivery: "Deliveries start mid-November",
  availabilityStarts: "2026-11-15",
};
const FULL: Offer = {
  ...TOKEN,
  mode: "full",
  headlinePaise: 799_900,
  prices: { ...TOKEN.prices, headline: "₹7,999" },
  sentence: "{price:full} (incl. GST), paid in full when you order.",
};

const TOKEN_TEXT =
  "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).";
const FULL_TEXT = "₹7,999 (incl. GST), paid in full when you order.";

const paragraph = (ui: React.ReactElement) => render(ui).container.firstElementChild as HTMLElement;

describe("PriceSentence", () => {
  it("renders the D028 token-mode sentence with the offer's amounts", () => {
    expect(paragraph(<PriceSentence offer={TOKEN} />).textContent).toBe(TOKEN_TEXT);
  });

  it("renders the full-mode sentence when the store has moved to full mode", () => {
    expect(paragraph(<PriceSentence offer={FULL} />).textContent).toBe(FULL_TEXT);
  });

  it.each([
    ["beside", "P", "kh-body-s ks-price"],
    ["drawer", "P", "kh-drawer__note"],
    ["offer-fine", "P", "kh-offer__fine"],
    ["store", "P", "kh-body"],
  ] as const)("the %s variant is a <p> with the mockup's classes", (variant, tag, classes) => {
    const p = paragraph(<PriceSentence offer={TOKEN} variant={variant} />);
    expect(p.tagName).toBe(tag);
    expect(p.className).toBe(classes);
    expect(p.textContent).toBe(TOKEN_TEXT);
  });

  it("defaults to the beside variant (the sentence under every CTA)", () => {
    expect(paragraph(<PriceSentence offer={TOKEN} />).className).toBe("kh-body-s ks-price");
  });

  it("carries the id a hero gives it and the parent's composition class", () => {
    const p = paragraph(<PriceSentence offer={TOKEN} id="hero-price" className="ks-store-top__price" variant="store" />);
    expect(p.id).toBe("hero-price");
    expect(p.className).toBe("kh-body ks-store-top__price");
  });

  it("never carries a mockup marker or a reveal hook (the price never moves on arrival)", () => {
    const p = paragraph(<PriceSentence offer={TOKEN} />);
    expect(p.querySelector("[data-src]")).toBeNull();
    expect(p.hasAttribute("data-reveal")).toBe(false);
  });

  it("refuses a sentence that is more than words and amounts, instead of flattening it", () => {
    const linked = { ...TOKEN, sentence: "Reserve for {price:token}, [see terms](/terms)." };
    expect(() => render(<PriceSentence offer={linked} />)).toThrow(/words and amounts/);
    const marked = { ...TOKEN, sentence: "{mark:Reserve} for {price:token}." };
    expect(() => render(<PriceSentence offer={marked} />)).toThrow(/words and amounts/);
  });
});

describe("offerWords", () => {
  it("resolves price and delivery tokens to the offer's own strings", () => {
    expect(offerWords("{price:token} today · {delivery}", TOKEN, "test")).toBe("₹499 today · Deliveries start mid-November");
  });

  it("names the place that passed it rich text", () => {
    expect(() => offerWords("{hand:Hi}", TOKEN, "OfferCard split label")).toThrow(/OfferCard split label/);
  });
});
