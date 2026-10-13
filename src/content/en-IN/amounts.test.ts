import { describe, expect, it } from "vitest";
import { TYPED_AMOUNT } from "@/lib/seo/price-lead";
import { isTestOrStory, listFiles, readRepoFile } from "../../../test/e2e/support/repo";

/* Every amount is a `{price:…}` token (architecture §6.2; task 2.1 acceptance 6): no content module
 * and no part of the offer view model types a rupee amount, not even in a comment, so a price can
 * only ever come from the checkout's own paise constants in src/config/site.ts. The pattern is the one
 * pageMeta refuses in a title or description (src/lib/seo/price-lead.ts, one definition; task 3.6).
 * A placeholder's note (`{ph:ID note}`) is the one exception: it names an open item and never reaches
 * production, because the build refuses every placeholder (ADR-004; ruling at the wave 5 part B2 merge,
 * for the approved terms placeholder "delivery ₹0"). Text outside the note is still scanned. */

/** The line with every placeholder note blanked, so only the words the page publishes are scanned. */
const outsidePlaceholderNotes = (line: string): string => line.replace(/\{ph:[^}]*\}/g, "{ph}");

function typedAmounts(paths: readonly string[]): string[] {
  return paths.flatMap((path) =>
    readRepoFile(path)
      .split("\n")
      .flatMap((line, i) => (TYPED_AMOUNT.test(outsidePlaceholderNotes(line)) ? [`${path}:${i + 1}: ${line.trim()}`] : [])),
  );
}

describe("typed amounts", () => {
  it("are caught in any form (the scan's own calibration)", () => {
    for (const line of ["₹4,999", "Rs 499", "Rs.499", "INR 7999", "499 rupees"]) expect(TYPED_AMOUNT.test(line), line).toBe(true);
    for (const line of ["{price:headline} (incl. GST)", "currency: \"INR\"", "36 months", "Rs is not a price"]) {
      expect(TYPED_AMOUNT.test(line), line).toBe(false);
    }
  });

  it("skip a placeholder's note and nothing else", () => {
    expect(TYPED_AMOUNT.test(outsidePlaceholderNotes("{ph:F4 the breakup: delivery ₹0, GST included}"))).toBe(false);
    for (const line of ["delivery ₹0", "{ph:a note} then ₹499", "₹499 {ph:a note}"]) {
      expect(TYPED_AMOUNT.test(outsidePlaceholderNotes(line)), line).toBe(true);
    }
  });

  it("appear in no content module and nowhere in the offer view model", () => {
    const files = listFiles(["src/content/en-IN", "src/lib/offer"]).filter((p) => /\.tsx?$/.test(p) && !isTestOrStory(p));
    expect(files.length).toBeGreaterThan(30);
    expect(typedAmounts(files)).toEqual([]);
  });
});
