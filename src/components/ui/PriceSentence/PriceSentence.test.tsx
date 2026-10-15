import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Offer } from "@/content/types";
import { PriceSentence, offerWords } from "./PriceSentence";

/* Hand-written offers in both modes (ADR-005): the amounts are what formatInr gives for the checkout's own
   paise constants, the lines are the words content/en-IN/offer.ts holds (price tokens, never a typed amount):
   the D028 sentence (wiki/site/pages/home.md "At a glance"), the checkout's, and the short price line beside every
   button on the selling pages (D065 item 3; task Q2.8). Expected text is written out by hand. */
const card = { product: "Kheelu", perks: { home: [], product: [] } };
const TOKEN: Offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { token: "₹499", balance: "₹4,500", headline: "₹4,999", full: "₹7,999", mrp: "₹7,999", launch: "₹4,999" },
  sentence:
    "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
  priceLine: "{price:token} today, refundable. {price:headline} in total.",
  sticky: { big: "{price:token} today", small: "refundable · {price:headline} in total" },
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
  priceLine: "{price:full} in total, paid in full when you order.",
};

const TOKEN_LINE = "₹499 today, refundable. ₹4,999 in total.";
const FULL_LINE = "₹7,999 in total, paid in full when you order.";
const TOKEN_SENTENCE =
  "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).";
const FULL_SENTENCE = "₹7,999 (incl. GST), paid in full when you order.";

const paragraph = (ui: React.ReactElement) => render(ui).container.firstElementChild as HTMLElement;

describe("PriceSentence", () => {
  it("renders the short price line beside a button, with the offer's amounts (D065 item 3)", () => {
    expect(paragraph(<PriceSentence offer={TOKEN} />).textContent).toBe(TOKEN_LINE);
  });

  it("renders the full-mode price line when the store has moved to full mode", () => {
    expect(paragraph(<PriceSentence offer={FULL} />).textContent).toBe(FULL_LINE);
  });

  it.each([
    ["beside", "P", "kh-body-s ks-price"],
    ["drawer", "P", "kh-drawer__note"],
    ["offer-fine", "P", "kh-offer__fine"],
  ] as const)("the %s variant is a <p> with the mockup's classes, printing the short price line", (variant, tag, classes) => {
    const p = paragraph(<PriceSentence offer={TOKEN} variant={variant} />);
    expect(p.tagName).toBe(tag);
    expect(p.className).toBe(classes);
    expect(p.textContent).toBe(TOKEN_LINE);
    expect(p.textContent).not.toMatch(/GST|₹4,500/);
  });

  /* The store is the checkout: GST and the payment breakdown stay there (D065 item 3), in D028's sentence. */
  it.each([
    ["token", TOKEN, TOKEN_SENTENCE],
    ["full", FULL, FULL_SENTENCE],
  ] as const)("the store variant keeps the checkout's D028 sentence (%s mode), a <p> with the mockup's class", (_mode, offer, text) => {
    const p = paragraph(<PriceSentence offer={offer} variant="store" />);
    expect(p.tagName).toBe("P");
    expect(p.className).toBe("kh-body");
    expect(p.textContent).toBe(text);
  });

  it("defaults to the beside variant (the line under every CTA)", () => {
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

  it("refuses a line that is more than words and amounts, instead of flattening it, in either form", () => {
    const linked = { ...TOKEN, priceLine: "Reserve for {price:token}, [see terms](/terms)." };
    expect(() => render(<PriceSentence offer={linked} />)).toThrow(/words and amounts/);
    const marked = { ...TOKEN, sentence: "{mark:Reserve} for {price:token}." };
    expect(() => render(<PriceSentence offer={marked} variant="store" />)).toThrow(/words and amounts/);
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
