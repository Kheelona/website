import { describe, expect, it } from "vitest";
import { formatInr as checkoutFormatInr } from "@/config/site";
import { formatInr } from "./inr";

describe("formatInr", () => {
  /* One formatter for the rupee (architecture §3, "build once"): the page must
     print exactly what the checkout charges, so this is the checkout's own. */
  it("is the checkout's own formatter, not a second copy", () => {
    expect(formatInr).toBe(checkoutFormatInr);
  });

  it("formats the offer's amounts, given in paise like every money constant", () => {
    expect(formatInr(49_900)).toBe("₹499");
    expect(formatInr(450_000)).toBe("₹4,500");
    expect(formatInr(499_900)).toBe("₹4,999");
    expect(formatInr(799_900)).toBe("₹7,999");
  });

  it("groups digits the Indian way, as the design system's ₹1,00,000 example", () => {
    expect(formatInr(10_000_000)).toBe("₹1,00,000");
    expect(formatInr(1_000_000_000)).toBe("₹1,00,00,000");
  });

  /* The design system's helper takes rupees (formatINR(100000) is ₹1,00,000);
     the site's takes paise, so 1,00,000 paise is ₹1,000. Pinned so nobody
     passes rupees to it by habit. */
  it("takes paise, never rupees", () => {
    expect(formatInr(100_000)).toBe("₹1,000");
  });
});
