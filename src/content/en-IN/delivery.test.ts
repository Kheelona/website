import { describe, expect, it } from "vitest";
import { SHIP_DATE_TEXT } from "@/config/site";
import { formatDate } from "@/lib/format/date";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { MOCKUP_DELIVERY, MOCKUP_SLUGS, withDeliveryDate } from "../../../test/e2e/support/mockup-text";
import { DELIVERY_SCHEMA_DATE, DELIVERY_TEXT } from "./delivery";

/* The delivery values for new orders (architecture §6.1; D023, D037; task 2.1 acceptance 2): one
 * visible line, rendered wherever a delivery line appears, and one schema date behind it. */

const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

describe("the visible delivery line (D023)", () => {
  /* The frozen mockups (D046) still print the old line, "Deliveries start mid-November"; the founder's decision of
     2026-11-10 (D068, deviations.md V69) moved the build's, so each mockup line is read with that date fact applied. */
  it("is what every delivery line of every approved mockup prints, read with D068's date fact", () => {
    let lines = 0;
    for (const slug of MOCKUP_SLUGS) {
      const doc = new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
      for (const span of Array.from(doc.querySelectorAll('[data-src="DELIVERY_TEXT"]'))) {
        lines += 1;
        expect(norm(span.textContent), slug).toBe(MOCKUP_DELIVERY);
        expect(withDeliveryDate(norm(span.textContent)), slug).toBe(DELIVERY_TEXT);
      }
    }
    expect(lines).toBeGreaterThan(20);
  });

  it("names no arrival date or transit time (D022's guardrail), and never the held production date (D011)", () => {
    expect(DELIVERY_TEXT).toBe("Deliveries start 15 December 2026");
    /* D068: the one number the line may carry is the founder's start date; a transit time or any other date stays out. */
    expect(DELIVERY_TEXT.replace("15 December 2026", "")).not.toMatch(/\d/);
    expect(DELIVERY_TEXT).not.toContain(SHIP_DATE_TEXT);
  });
});

describe("the schema date (D037)", () => {
  it("is 15 December 2026, a real calendar day, used in schema only", () => {
    expect(DELIVERY_SCHEMA_DATE).toBe("2026-12-15");
    expect(formatDate(DELIVERY_SCHEMA_DATE, "long")).toBe("15 December 2026");
  });
});
