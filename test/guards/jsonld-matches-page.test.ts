import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { freshBuiltPages, isNewDesignHtml, jsonLdMismatches } from "../e2e/support/page-checks";

/* jsonld-matches-page (task 1.1; architecture §9.2, lessons §6).
 *
 * Schema describes only what the same page shows: every FAQ answer, offer price and policy number
 * (return days, warranty months) in a page's JSON-LD must appear in its visible text, counted with
 * <script> blocks stripped (otherwise the JSON-LD answers for itself). Runs here on the prerendered
 * HTML of the last `next build` when it is newer than src/ (verify:e2e builds first), and on every
 * served page in test/e2e/content-integrity.spec.ts. Legacy pages are skipped until rebuilt.
 */

const page = (ld: object, body: string) =>
  `<html><head><script type="application/ld+json">${JSON.stringify(ld)}</script></head><body><main>${body}</main></body></html>`;

const faq = (text: string) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [{ "@type": "Question", name: "How much is Kheelu?", acceptedAnswer: { "@type": "Answer", text } }],
});
const product = (price: number, days: number, months: number) => ({
  "@type": "Product",
  offers: {
    "@type": "Offer",
    price,
    priceCurrency: "INR",
    hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy", merchantReturnDays: days },
  },
  hasWarranty: { "@type": "WarrantyPromise", durationOfWarranty: { "@type": "QuantitativeValue", value: months, unitCode: "MON" } },
});

describe("jsonld-matches-page detector", () => {
  const visible = "<p>Kheelu is ₹4,999 (incl. GST). Return it within 7 days of delivery. 6-month warranty.</p>";

  it("is green when JSON-LD restates the visible page (quotes and spaces normalised)", () => {
    expect(jsonLdMismatches(page(faq("Kheelu is ₹4,999 (incl. GST)."), visible))).toEqual([]);
    expect(jsonLdMismatches(page(product(4999, 7, 6), visible))).toEqual([]);
    expect(jsonLdMismatches(page(faq("It’s   a toy."), "<p>It's a toy.</p>"))).toEqual([]);
  });

  it("is red on an answer, price or policy number the page does not show", () => {
    expect(jsonLdMismatches(page(faq("Kheelu is free."), visible))).toHaveLength(1);
    expect(jsonLdMismatches(page(product(7999, 7, 6), visible))).toHaveLength(1);
    expect(jsonLdMismatches(page(product(4999, 15, 6), visible))).toHaveLength(1);
    expect(jsonLdMismatches(page(product(4999, 7, 12), visible))).toHaveLength(1);
  });

  it("does not let the JSON-LD vouch for itself", () => {
    expect(jsonLdMismatches(page(faq("Only in the script."), "<p>Nothing here.</p>"))).toHaveLength(1);
  });
});

const built = freshBuiltPages();

describe.skipIf(built === null)("jsonld-matches-page: prerendered pages of the last build", () => {
  it("restates only what each new-design page shows", () => {
    const pages = (built ?? []).map((p) => ({ ...p, html: readFileSync(p.file, "utf8") }));
    const fresh = pages.filter((p) => isNewDesignHtml(p.html));
    const problems = fresh.flatMap((p) => jsonLdMismatches(p.html).map((m) => `${p.route}: ${m}`));
    console.log(`[jsonld-matches-page] ${pages.length} built page(s), ${fresh.length} in the new design.`);
    expect(problems, problems.join("\n")).toEqual([]);
  });
});

if (built === null) {
  console.log("[jsonld-matches-page] no build newer than src/: the page check runs in verify:e2e (content-integrity.spec.ts).");
}
