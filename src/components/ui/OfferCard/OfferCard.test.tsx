import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Offer } from "@/content/types";
import { OfferCard } from "./OfferCard";

/* Hand-written offers in both modes (ADR-005). The token-mode card carries the split; the view model leaves it out
   in full mode (src/content/types.ts OfferCard.split), and the card must not show one even if it is passed. Since task
   Q2.8 (D065 item 3: no GST on the selling pages) the amount takes no note and the fine print is the short price line;
   the split's two rows keep their amounts. */
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
  priceLine: "{price:token} today, refundable. {price:headline} in total.",
  sticky: { big: "{price:token} today", small: "refundable · {price:headline} in total" },
  card: { product: "Kheelu", split: SPLIT, perks: { home: [], product: [] } },
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
  card: { product: "Kheelu", perks: { home: [], product: [] } },
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
    expect(el.querySelector(".kh-offer__prices")?.innerHTML).toBe('<span class="kh-offer__price">₹4,999</span>');
    expect(el.querySelector(".kh-offer__split")?.innerHTML).toBe("<span>Today, refundable</span><b>₹499</b><span>Before delivery</span><b>₹4,500</b>");
    expect(el.querySelector(".kh-offer__fine")?.textContent).toBe("₹499 today, refundable. ₹4,999 in total.");
  });

  it("says no GST anywhere on the card, in either mode (D065 item 3)", () => {
    for (const offer of [TOKEN, FULL]) expect(card(<OfferCard offer={offer} perks={PERKS} action={action} />).textContent).not.toMatch(/GST/);
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
    expect(el.querySelector(".kh-offer__prices")?.innerHTML).toBe('<span class="kh-offer__price">₹7,999</span>');
    expect(el.querySelector(".kh-offer__fine")?.textContent).toBe("₹7,999 in total, paid in full when you order.");
  });

  /* The D2C plan v2 §2 fold 7 (task Q2.9's review): where the card's price block stands in for the price line, the line
     is not repeated under the button. The default keeps it (Home's close, the product page until task Q2.10). */
  it.each([
    ["token", TOKEN],
    ["full", FULL],
  ] as const)("leaves the short price line out when the placement asks (fine={false}; %s mode): the button ends the card", (_mode, offer) => {
    const el = card(<OfferCard offer={offer} perks={PERKS} action={action} fine={false} />);
    expect(el.querySelector(".kh-offer__fine")).toBeNull();
    expect(el.lastElementChild?.className).toBe("kh-btn kh-btn--cta kh-btn--l kh-btn--block");
    expect(el.textContent).not.toContain(offer.mode === "token" ? "today, refundable." : "paid in full when you order.");
  });

  it("keeps the short price line by default, and when fine is passed true", () => {
    for (const fine of [undefined, true]) {
      const el = card(<OfferCard offer={TOKEN} perks={PERKS} action={action} fine={fine} />);
      expect(el.querySelectorAll(".kh-offer__fine")).toHaveLength(1);
      expect(el.lastElementChild?.className).toBe("kh-offer__fine");
    }
  });

  /* Task Q2.13 (the D2C plan v2 §2 fold 7 and §3 fold 3; the main session's OK for the slot): both cards print the small
     Kheelona+ note under the perks, inside the card, before the button; under the button only the trust line, the third
     row and the share link (OfferSection). */
  const NOTE = "Kheelona+ is our paid subscription, on top of the free parent app.";

  it.each([
    ["token", TOKEN],
    ["full", FULL],
  ] as const)("prints the note after the perks and before the button, as small text of its own (%s mode)", (_mode, offer) => {
    const el = card(<OfferCard offer={offer} perks={PERKS} action={action} note={NOTE} fine={false} />);
    const order = [...el.children].map((c) => `${c.tagName}.${c.className}`);
    expect(order.slice(-3)).toEqual(["UL.kh-offer__list", "P.kh-body-s ks-offer__note", "A.kh-btn kh-btn--cta kh-btn--l kh-btn--block"]);
    expect(el.querySelector(".ks-offer__note")?.outerHTML).toBe(`<p class="kh-body-s ks-offer__note">${NOTE}</p>`);
  });

  it("takes rich content in the note slot, rendered inside the one paragraph", () => {
    const el = card(<OfferCard offer={TOKEN} perks={PERKS} action={action} note={<span>{NOTE}</span>} />);
    expect(el.querySelectorAll(".ks-offer__note")).toHaveLength(1);
    expect(el.querySelector(".ks-offer__note")?.innerHTML).toBe(`<span>${NOTE}</span>`);
    // The fine print, where a placement keeps it, still follows the button.
    expect([...el.children].slice(-3).map((c) => c.className)).toEqual(["kh-body-s ks-offer__note", "kh-btn kh-btn--cta kh-btn--l kh-btn--block", "kh-offer__fine"]);
  });

  it("prints no note when none is passed: the perks lead straight to the button", () => {
    const el = card(<OfferCard offer={TOKEN} perks={PERKS} action={action} />);
    expect(el.querySelector(".ks-offer__note")).toBeNull();
    expect(el.querySelector(".kh-offer__list")?.nextElementSibling?.tagName).toBe("A");
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
      '<span class="kh-offer__price">₹4,999</span>' +
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
    const linked = { ...TOKEN, card: { ...TOKEN.card, split: [{ label: "[Today](/terms)", price: "token" as const }] } };
    expect(() => render(<OfferCard offer={linked} perks={PERKS} action={action} />)).toThrow(/OfferCard split label/);
    const fine = { ...TOKEN, priceLine: "{hand:Today}" };
    expect(() => render(<OfferCard offer={fine} perks={PERKS} action={action} />)).toThrow(/words and amounts/);
  });
});
