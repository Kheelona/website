import { describe, expect, it } from "vitest";
import {
  LAUNCH_AMOUNT_PAISE,
  LATER_AMOUNT_PAISE,
  TOKEN_AMOUNT_PAISE,
  BALANCE_AMOUNT_PAISE,
  LAUNCH_PRICE,
  LATER_PRICE,
  TOKEN_PRICE,
  BALANCE_PRICE,
  PRICE_CAPTION,
  PREORDER_OFFER_LINE,
  PREORDER_DEADLINE_ISO,
  SHIP_DATE_ISO,
  isPreorderOpen,
  formatInr,
} from "@/config/site";

/**
 * The money law (§8.25-c), guarded.
 *
 * This site quoted prices for a year without ever charging one, so a disagreeing
 * pair of numbers was a copy bug. It is now a billing bug: a parent who reads
 * "₹4,500 on dispatch" and is asked for ₹4,600 has been misled by us, and the
 * only defence is that no rupee figure is ever typed twice.
 *
 * Everything below therefore checks DERIVATION, not text. The published strings
 * are asserted once, at the bottom, because those exact characters are what a
 * parent read before they paid.
 */
describe("pre-order money", () => {
  it("makes the token and the balance add up to the price, exactly", () => {
    expect(TOKEN_AMOUNT_PAISE + BALANCE_AMOUNT_PAISE).toBe(LAUNCH_AMOUNT_PAISE);
  });

  it("keeps every amount a whole number of paise", () => {
    for (const amount of [
      LAUNCH_AMOUNT_PAISE,
      LATER_AMOUNT_PAISE,
      TOKEN_AMOUNT_PAISE,
      BALANCE_AMOUNT_PAISE,
    ]) {
      expect(Number.isInteger(amount)).toBe(true);
      expect(amount).toBeGreaterThan(0);
    }
  });

  it("keeps the token smaller than the price it reserves", () => {
    expect(TOKEN_AMOUNT_PAISE).toBeLessThan(LAUNCH_AMOUNT_PAISE);
    expect(LAUNCH_AMOUNT_PAISE).toBeLessThan(LATER_AMOUNT_PAISE);
  });

  it("formats rupees the Indian way, including above a lakh", () => {
    expect(formatInr(49_900)).toBe("₹499");
    expect(formatInr(499_900)).toBe("₹4,999");
    // the grouping a naive en-US formatter gets wrong: 1,00,000 not 100,000
    expect(formatInr(10_000_000)).toBe("₹1,00,000");
  });

  it("closes the pre-order window before shipping starts", () => {
    expect(PREORDER_DEADLINE_ISO < SHIP_DATE_ISO).toBe(true);
  });

  it("treats the deadline day itself as open, and the day after as closed", () => {
    expect(isPreorderOpen(new Date(`${PREORDER_DEADLINE_ISO}T23:59:00Z`))).toBe(true);
    expect(isPreorderOpen(new Date("2026-10-01T00:00:00Z"))).toBe(false);
    expect(isPreorderOpen(new Date("2026-08-22T12:00:00Z"))).toBe(true);
  });

  /* The exact characters a parent reads before paying. If one of these lines
     changes, that is a founder-level copy decision, not a refactor. */
  it("publishes the sanctioned strings", () => {
    expect(LAUNCH_PRICE).toBe("₹4,999");
    expect(LATER_PRICE).toBe("₹9,999");
    expect(TOKEN_PRICE).toBe("₹499");
    expect(BALANCE_PRICE).toBe("₹4,500");
    expect(PRICE_CAPTION).toBe(
      "₹499 now, ₹4,500 on dispatch. Fully refundable until we ship.",
    );
    expect(PREORDER_OFFER_LINE).toBe(
      "₹499 reserves yours at ₹4,999. ₹9,999 after 30 September 2026.",
    );
  });
});
