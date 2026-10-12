import { describe, expect, it } from "vitest";
import { SHIP_DATE_TEXT } from "@/config/site";
import { formatDate } from "@/lib/format/date";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { MOCKUP_SLUGS } from "../../../test/e2e/support/mockup-text";
import { DELIVERY_SCHEMA_DATE, DELIVERY_TEXT } from "./delivery";

/* The delivery values for new orders (architecture §6.1; D023, D037; task 2.1 acceptance 2): one
 * visible line, rendered wherever a delivery line appears, and one schema date behind it. */

const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

describe("the visible delivery line (D023)", () => {
  it("is what every delivery line of every approved mockup prints", () => {
    let lines = 0;
    for (const slug of MOCKUP_SLUGS) {
      const doc = new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
      for (const span of Array.from(doc.querySelectorAll('[data-src="DELIVERY_TEXT"]'))) {
        lines += 1;
        expect(norm(span.textContent), slug).toBe(DELIVERY_TEXT);
      }
    }
    expect(lines).toBeGreaterThan(20);
  });

  it("names no arrival date or transit time (D022's guardrail), and never the held production date (D011)", () => {
    expect(DELIVERY_TEXT).toBe("Deliveries start mid-November");
    expect(DELIVERY_TEXT).not.toMatch(/\d/);
    expect(DELIVERY_TEXT).not.toContain(SHIP_DATE_TEXT);
  });
});

describe("the schema date (D037)", () => {
  it("is 15 November 2026, a real calendar day, used in schema only", () => {
    expect(DELIVERY_SCHEMA_DATE).toBe("2026-11-15");
    expect(formatDate(DELIVERY_SCHEMA_DATE, "long")).toBe("15 November 2026");
  });
});
