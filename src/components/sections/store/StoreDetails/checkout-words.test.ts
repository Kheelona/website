import { describe, expect, it } from "vitest";
import { BALANCE_PRICE, FULL_PRICE, LAUNCH_PRICE, MRP_PRICE, TOKEN_PRICE } from "@/config/site";
import { checkoutPrices, checkoutWords } from "./checkout-words";

/* The checkout's amounts (task 5.15; ADR-013): the restyled PreorderForm and OrderSummary print their amounts from the
 * labels the server formatted for this order (what it pays today, what it still owes) and the money block's prices,
 * never from a typed amount and never from the marketing offer's cache. */

describe("checkoutPrices", () => {
  it("a token order: today is the server's label, the balance its label, the launch and full prices the money block's", () => {
    expect(checkoutPrices("token", "₹99", "₹4,900")).toEqual({
      token: "₹99",
      balance: "₹4,900",
      headline: LAUNCH_PRICE,
      full: FULL_PRICE,
      mrp: MRP_PRICE,
    });
  });

  it("a full order: the full price is what this order pays today; the launch price stays the money block's", () => {
    expect(checkoutPrices("full", "₹7,999", BALANCE_PRICE)).toEqual({
      token: TOKEN_PRICE,
      balance: BALANCE_PRICE,
      headline: LAUNCH_PRICE,
      full: "₹7,999",
      mrp: MRP_PRICE,
    });
  });
});

describe("checkoutWords", () => {
  const prices = checkoutPrices("token", "₹499", "₹4,500");

  it("fills every {price:…} token and keeps the words", () => {
    expect(checkoutWords("Reserve yours for {price:token} today, then pay {price:balance}: {price:headline} in total.", prices)).toBe(
      "Reserve yours for ₹499 today, then pay ₹4,500: ₹4,999 in total.",
    );
  });

  it("refuses any other token, so a link or a placeholder never reaches the checkout flattened", () => {
    expect(() => checkoutWords("See the [terms](/terms).", prices)).toThrow(/words and amounts only/);
    expect(() => checkoutWords("{delivery}", prices)).toThrow(/words and amounts only/);
    expect(() => checkoutWords("{nowrap:soon}", prices)).toThrow(/words and amounts only/);
  });

  it("refuses broken syntax as the content parser does", () => {
    expect(() => checkoutWords("{price:launch}", prices)).toThrow();
  });
});
