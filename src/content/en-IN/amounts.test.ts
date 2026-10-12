import { describe, expect, it } from "vitest";
import { TYPED_AMOUNT } from "@/lib/seo/price-lead";
import { isTestOrStory, listFiles, readRepoFile } from "../../../test/e2e/support/repo";

/* Every amount is a `{price:…}` token (architecture §6.2; task 2.1 acceptance 6): no content module
 * and no part of the offer view model types a rupee amount, not even in a comment, so a price can
 * only ever come from the checkout's own paise constants in src/config/site.ts. The pattern is the one
 * pageMeta refuses in a title or description (src/lib/seo/price-lead.ts, one definition; task 3.6). */

function typedAmounts(paths: readonly string[]): string[] {
  return paths.flatMap((path) =>
    readRepoFile(path)
      .split("\n")
      .flatMap((line, i) => (TYPED_AMOUNT.test(line) ? [`${path}:${i + 1}: ${line.trim()}`] : [])),
  );
}

describe("typed amounts", () => {
  it("are caught in any form (the scan's own calibration)", () => {
    for (const line of ["₹4,999", "Rs 499", "Rs.499", "INR 7999", "499 rupees"]) expect(TYPED_AMOUNT.test(line), line).toBe(true);
    for (const line of ["{price:headline} (incl. GST)", "currency: \"INR\"", "36 months", "Rs is not a price"]) {
      expect(TYPED_AMOUNT.test(line), line).toBe(false);
    }
  });

  it("appear in no content module and nowhere in the offer view model", () => {
    const files = listFiles(["src/content/en-IN", "src/lib/offer"]).filter((p) => /\.tsx?$/.test(p) && !isTestOrStory(p));
    expect(files.length).toBeGreaterThan(30);
    expect(typedAmounts(files)).toEqual([]);
  });
});
