import { describe, expect, it } from "vitest";
import {
  LAUNCH_AMOUNT_PAISE,
  FULL_AMOUNT_PAISE,
  TOKEN_AMOUNT_PAISE,
  BALANCE_AMOUNT_PAISE,
  LAUNCH_PRICE,
  FULL_PRICE,
  TOKEN_PRICE,
  BALANCE_PRICE,
  PRICE_CAPTION,
  PREORDER_OFFER_LINE,
  PREORDER_CAP_UNITS,
  CAP_UNITS_TEXT,
  SHIP_DATE_TEXT,
  SHIP_DATE_ISO,
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
 *
 * Since 2026-08-23 the offer is bounded by UNITS, not a date (§8.26): the old
 * window tests died with the deadline, and the cap joined the sanctioned
 * numbers because the offer line quotes it at parents.
 */
describe("pre-order money", () => {
  it("makes the token and the balance add up to the price, exactly", () => {
    expect(TOKEN_AMOUNT_PAISE + BALANCE_AMOUNT_PAISE).toBe(LAUNCH_AMOUNT_PAISE);
  });

  it("keeps every amount a whole number of paise", () => {
    for (const amount of [
      LAUNCH_AMOUNT_PAISE,
      FULL_AMOUNT_PAISE,
      TOKEN_AMOUNT_PAISE,
      BALANCE_AMOUNT_PAISE,
    ]) {
      expect(Number.isInteger(amount)).toBe(true);
      expect(amount).toBeGreaterThan(0);
    }
  });

  it("keeps the ladder ordered: token, capped price, launch price", () => {
    expect(TOKEN_AMOUNT_PAISE).toBeLessThan(LAUNCH_AMOUNT_PAISE);
    expect(LAUNCH_AMOUNT_PAISE).toBeLessThan(FULL_AMOUNT_PAISE);
  });

  it("formats rupees the Indian way, including above a lakh", () => {
    expect(formatInr(49_900)).toBe("₹499");
    expect(formatInr(499_900)).toBe("₹4,999");
    // the grouping a naive en-US formatter gets wrong: 1,00,000 not 100,000
    expect(formatInr(10_000_000)).toBe("₹1,00,000");
  });

  it("keeps the cap a real, positive unit count that the copy derives from", () => {
    expect(Number.isInteger(PREORDER_CAP_UNITS)).toBe(true);
    /* 500 is a sanctioned commercial number (founder, 2026-08-23), held to the
       same standard as the sanctioned strings below: changing it is a founder
       decision, not a refactor. */
    expect(PREORDER_CAP_UNITS).toBe(500);
    expect(CAP_UNITS_TEXT).toBe(`first ${PREORDER_CAP_UNITS} units`);
  });

  it("keeps the two ship-date renderings in agreement", () => {
    /* One date, two shapes: prose and ISO. They live one line apart in config
       and nothing derives one from the other, so this is the guard against
       editing one and forgetting its twin. */
    expect(SHIP_DATE_TEXT).toBe("20 October 2026");
    expect(SHIP_DATE_ISO).toBe("2026-10-20");
  });

  /* The exact characters a parent reads before paying. If one of these lines
     changes, that is a founder-level copy decision, not a refactor. */
  it("publishes the sanctioned strings", () => {
    expect(LAUNCH_PRICE).toBe("₹4,999");
    expect(FULL_PRICE).toBe("₹7,999");
    expect(TOKEN_PRICE).toBe("₹499");
    expect(BALANCE_PRICE).toBe("₹4,500");
    expect(PRICE_CAPTION).toBe(
      "₹499 now, ₹4,500 on dispatch. Fully refundable until we ship.",
    );
    expect(PREORDER_OFFER_LINE).toBe(
      "₹499 reserves one of the first 500 units at ₹4,999. ₹7,999 once they are gone.",
    );
  });

  it("keeps the offer line unit-bounded, never date-bounded", () => {
    /* The urgency is the cap. A month name creeping back into the offer line
       would be the date deadline returning by habit (§8.25-f). */
    expect(PREORDER_OFFER_LINE).toMatch(/first 500 units/);
    expect(PREORDER_OFFER_LINE).not.toMatch(
      /January|February|March|April|May|June|July|August|September|October|November|December/,
    );
  });
});
