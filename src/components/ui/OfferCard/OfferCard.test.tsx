import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Offer } from "@/content/types";
import { OfferCard } from "./OfferCard";

/* Hand-written offers in both modes (ADR-005). The token-mode card carries the split; the view model leaves it out
   in full mode (src/content/types.ts OfferCard.split), and the card must not show one even if it is passed. */
const SPLIT = [
  { label: "Today, refundable", price: "token" },
  { label: "Before delivery", price: "balance" },
] as const;
const TOKEN: Offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { token: "₹499", balance: "₹4,500", headline: "₹4,999", full: "₹7,999", mrp: "₹7,999", launch: "₹4,999" },
  sentence:
    "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
  sticky: { big: "{price:token} today", small: "refundable · {price:headline} total (incl. GST)" },
  card: { product: "Kheelu", priceNote: "incl. GST", split: SPLIT, perks: { home: [], product: [] } },
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
  card: { product: "Kheelu", priceNote: "incl. GST", perks: { home: [], product: [] } },
};

const icon = (name: string) => <svg className="kh-icon" data-icon={name} aria-hidden="true" />;
const PERKS = [
  { icon: icon("truck"), text: "Deliveries start mid-November" },
  { icon: icon("package"), text: "In the box: Kheelu plush toy, charger and quick-start card" },
];
/* The action slot takes PreorderButton (task 2.2) on the pages; its markup stands in here. */
const action = (
  <a href="https://store.kheelona.com" className="kh-btn kh-btn--cta kh-btn--l kh-btn--block" data-ph-capture-attribute-cta="finale">
    <span>Pre-order Kheelu</span>
  </a>
);

const card = (ui: React.ReactElement) => render(ui).container.firstElementChild as HTMLElement;

describe("OfferCard", () => {
  it("renders the token-mode card in home.html fold 9's order: product, prices, split, perks, button, fine print", () => {
    const el = card(<OfferCard offer={TOKEN} perks={PERKS} action={action} label="Kheelu offer" id="offer" />);
    expect(el.tagName).toBe("SECTION");
    expect(el.className).toBe("kh-offer");
    expect(el.id).toBe("offer");
    expect([...el.children].map((c) => `${c.tagName}.${c.className}`)).toEqual([
      "P.kh-offer__product",
      "DIV.kh-offer__prices",
      "DIV.kh-offer__split",
      "UL.kh-offer__list",
      "A.kh-btn kh-btn--cta kh-btn--l kh-btn--block",
      "P.kh-offer__fine",
    ]);
    expect(el.querySelector(".kh-offer__product")?.textContent).toBe("Kheelu");
    expect(el.querySelector(".kh-offer__prices")?.innerHTML).toBe('<span class="kh-offer__price">₹4,999</span><span class="kh-body-s">incl. GST</span>');
    expect(el.querySelector(".kh-offer__split")?.innerHTML).toBe("<span>Today, refundable</span><b>₹499</b><span>Before delivery</span><b>₹4,500</b>");
    expect(el.querySelector(".kh-offer__fine")?.textContent).toBe(
      "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    );
  });

  it("lists each perk as icon, then its words in a span", () => {
    const el = card(<OfferCard offer={TOKEN} perks={PERKS} action={action} />);
    const items = [...el.querySelectorAll(".kh-offer__list > li")];
    expect(items.map((li) => li.firstElementChild?.getAttribute("data-icon"))).toEqual(["truck", "package"]);
    expect(items.map((li) => li.lastElementChild?.outerHTML)).toEqual([
      "<span>Deliveries start mid-November</span>",
      "<span>In the box: Kheelu plush toy, charger and quick-start card</span>",
    ]);
  });

  it("omits the split in full mode and shows the full price and the full-mode sentence (G-08)", () => {
    const el = card(<OfferCard offer={FULL} perks={PERKS} action={action} />);
    expect(el.querySelector(".kh-offer__split")).toBeNull();
    expect(el.querySelector(".kh-offer__price")?.textContent).toBe("₹7,999");
    expect(el.querySelector(".kh-offer__fine")?.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
  });

  it("never shows a split in full mode, even if one is passed by mistake", () => {
    const stale = { ...FULL, card: { ...FULL.card, split: SPLIT } };
    expect(card(<OfferCard offer={stale} perks={PERKS} action={action} />).querySelector(".kh-offer__split")).toBeNull();
  });

  it("is a named region on Home and a plain block on the product page (meet-kheelu.html fold 3)", () => {
    render(<OfferCard offer={TOKEN} perks={PERKS} action={action} label="Kheelu offer" />);
    expect(screen.getByRole("region", { name: "Kheelu offer" })).toHaveClass("kh-offer");
    const plain = card(<OfferCard offer={TOKEN} perks={PERKS} action={action} />);
    expect(plain.tagName).toBe("DIV");
    expect(plain.hasAttribute("aria-label")).toBe(false);
  });

  it("never moves on arrival: no reveal hook on the card", () => {
    expect(card(<OfferCard offer={TOKEN} perks={PERKS} action={action} />).hasAttribute("data-reveal")).toBe(false);
  });

  /* D061 item 3 (task 8c.2): the later price, as a plain line in the DS card's later-price place (kh-offer__prices, where
     the DS draws `was`), never struck through (PRICE-01): only while the first-500 price is live. */
  const LATER = "{price:headline} for the first 500 units. {price:full} once they are gone.";
  const withLater = (offer: Offer): Offer => ({ ...offer, card: { ...offer.card, later: LATER } });

  it("prints the later price in token mode as a plain line under the amount, in the card's later-price place", () => {
    const el = card(<OfferCard offer={withLater(TOKEN)} perks={PERKS} action={action} />);
    expect(el.querySelector(".kh-offer__prices")?.innerHTML).toBe(
      '<span class="kh-offer__price">₹4,999</span><span class="kh-body-s">incl. GST</span>' +
        '<p class="kh-body-s ks-offer__later">₹4,999 for the first 500 units. ₹7,999 once they are gone.</p>',
    );
  });

  it("never prints the later price in full mode, even if one is passed by mistake", () => {
    const el = card(<OfferCard offer={withLater(FULL)} perks={PERKS} action={action} />);
    expect(el.querySelector(".ks-offer__later")).toBeNull();
    expect(el.textContent).not.toMatch(/first 500|once they are gone/);
  });

  it("prints no later price when the offer has none", () => {
    expect(card(<OfferCard offer={TOKEN} perks={PERKS} action={action} />).querySelector(".ks-offer__later")).toBeNull();
  });

  it("never strikes a price through: no s, del or the DS's struck later price (kh-offer__was), in either mode", () => {
    for (const offer of [withLater(TOKEN), withLater(FULL)]) {
      const el = card(<OfferCard offer={offer} perks={PERKS} action={action} />);
      expect(el.querySelectorAll("s, del, strike, .kh-offer__was")).toHaveLength(0);
    }
  });

  it("refuses rich text in the later price instead of flattening it", () => {
    const linked = { ...TOKEN, card: { ...TOKEN.card, later: "[Later](/terms)" } };
    expect(() => render(<OfferCard offer={linked} perks={PERKS} action={action} />)).toThrow(/OfferCard later price/);
  });

  it("refuses rich text in the offer's own strings instead of flattening it", () => {
    const linked = { ...TOKEN, card: { ...TOKEN.card, priceNote: "[incl. GST](/terms)" } };
    expect(() => render(<OfferCard offer={linked} perks={PERKS} action={action} />)).toThrow(/OfferCard price note/);
  });
});
