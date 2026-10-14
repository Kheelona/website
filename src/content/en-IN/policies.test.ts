import { describe, expect, it } from "vitest";
import { RETENTION } from "../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../test/e2e/support/repo";
import {
  BANK_REFUND_WORKING_DAYS,
  FAULTY_REPORT_DAYS,
  GRIEVANCE_ACK_HOURS,
  GRIEVANCE_RESOLUTION,
  NO_EXCHANGES,
  PAYMENT_METHODS,
  PAYMENT_TERMS,
  REFUND_AFTER_RETURN_WORKING_DAYS,
  REFUND_START_WORKING_DAYS,
  RETENTION_LINE,
  RETENTION_MONTHS,
  RETURN_DAYS,
  RETURN_PICKUP_FREE,
  WARRANTY_MONTHS,
} from "./policies";

/* Policy constants (architecture §6.1; task 2.1 acceptance 2): each number once, from the owner
 * page wiki/product/policies.md ("Decided for the new site") and its decisions; each shared line
 * exactly as the approved mockups print it. */

const mockupText = (slug: string) =>
  (new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html").body.textContent ?? "").replace(/\s+/g, " ");

describe("the decided terms (policies.md; D020-D022, D024, D032, D033, D042)", () => {
  it("returns: 7 days from delivery, pickup free; faulty on arrival: reported within 7 days", () => {
    expect(RETURN_DAYS).toBe(7);
    expect(RETURN_PICKUP_FREE).toBe(true);
    expect(FAULTY_REPORT_DAYS).toBe(7);
  });

  it("warranty: 6 months on manufacturing defects", () => {
    expect(WARRANTY_MONTHS).toBe(6);
  });

  it("refunds: started within 2 working days, the bank's 5-7, within 7 working days after a return", () => {
    expect(REFUND_START_WORKING_DAYS).toBe(2);
    expect(BANK_REFUND_WORKING_DAYS).toBe("5-7");
    expect(REFUND_AFTER_RETURN_WORKING_DAYS).toBe(7);
  });

  it("grievances: acknowledged within 48 hours, resolved within one month, never 30 days or 5 days (D032)", () => {
    expect(GRIEVANCE_ACK_HOURS).toBe(48);
    expect(GRIEVANCE_RESOLUTION).toBe("one month");
  });

  it("retention: 36 months (D020)", () => {
    expect(RETENTION_MONTHS).toBe(36);
  });

  it("payment methods: the three D024 names, and never wallets, EMI or Pay Later", () => {
    expect(PAYMENT_METHODS).toBe("UPI, card or net banking");
    expect(PAYMENT_METHODS).not.toMatch(/wallet|emi|pay later|cash/i);
  });
});

describe("the shared policy lines, as the approved mockups print them", () => {
  it("payment terms (D042): store, confirmation and refund pages", () => {
    expect(PAYMENT_TERMS).toBe("No payment fees. Nothing recurring. Payments by Razorpay.");
    for (const slug of ["store", "store-confirmation", "refund"]) expect(mockupText(slug)).toContain(PAYMENT_TERMS);
  });

  it("no exchanges (D042): refund and terms pages", () => {
    expect(NO_EXCHANGES).toBe("No exchanges: return it within 7 days and order again.");
    for (const slug of ["refund", "terms"]) expect(mockupText(slug)).toContain(NO_EXCHANGES);
  });

  /* D020's first sentence. Its one-tap sentence came off with the live team's code check (D058 items 1 and 9; task 8b.1):
     the approved mockups keep it, an accepted deviation (test/e2e/support/deviations.ts RETENTION, CLAIM_FIXES). */
  it("the retention line (D020, D058): Home, product, safety, the safe-AI-toy article and privacy", () => {
    expect(RETENTION_LINE).toBe(RETENTION.build);
    expect(RETENTION_LINE).toBe("Your child’s conversations stay in your parent app for 36 months, then they’re deleted automatically.");
    expect(RETENTION_LINE).not.toMatch(/one tap|sooner/);
    for (const slug of ["home", "meet-kheelu", "safety", "story-what-to-look-for-in-a-safe-ai-toy", "privacy"]) {
      expect(mockupText(slug), slug).toContain(RETENTION.mockup);
      expect(RETENTION.mockup.startsWith(`${RETENTION_LINE} `), slug).toBe(true);
    }
  });
});
