import { afterEach, describe, expect, it, vi } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";

/* The checkout's client-safe words (task 4.8 item 4; architecture §12, ADR-013). PreorderForm and AddressForm are client
 * islands, so whatever module their words come from ships to the browser with every module it imports. Their words, and
 * OrderSummary's, live in words-only modules: type imports, plus offer.ts and navigation.ts where a sentence or a note is
 * shared, plus the checkout's own config (the unit cap in the agreement card's small print). The seller and organisation
 * data (seller.ts, organization.ts) and everything else the page modules read stay out of the client chunks. */

const MODULES = [
  { file: "preorder-form.ts", name: "preorderFormCopy", reader: "src/features/preorder/components/PreorderForm.tsx" },
  { file: "order-summary.ts", name: "orderSummaryCopy", reader: "src/features/preorder/components/OrderSummary.tsx" },
  { file: "address-form.ts", name: "addressForm", reader: "src/features/preorder/components/AddressForm.tsx" },
] as const;

/** The only modules a words-only module may load at run time. */
const ALLOWED = new Set(["../offer", "../navigation", "@/config/site"]);

/** The value imports of a module (type-only imports are erased and ship nothing). */
function valueImports(text: string): string[] {
  return [...text.matchAll(/^import\s+(?!type\b)[^;]*?\bfrom\s+["']([^"']+)["'];?$/gm), ...text.matchAll(/^import\s+["']([^"']+)["'];?$/gm)].map((m) => m[1]);
}

/** Content modules a words-only module must never load: the seller and organisation data and every shared module that
 *  reads them (or a picture, or the FAQs). Each is replaced by one that throws when it is loaded. */
const FORBIDDEN = ["../seller", "../organization", "../trust", "../policies", "../delivery", "../faqs", "../films", "./store-page", "./confirmation"];

afterEach(() => {
  for (const path of FORBIDDEN) vi.doUnmock(path);
  vi.resetModules();
});

describe("the checkout's words-only modules", () => {
  it("the import reader sees value imports and skips type imports", () => {
    const planted = 'import type { A } from "x";\nimport { seller } from "../seller";\nimport "./side-effect";\nimport type B from "y";';
    expect(valueImports(planted)).toEqual(["../seller", "./side-effect"]);
  });

  it.each(MODULES)("$file imports types, offer.ts, navigation.ts and the checkout's config only", ({ file }) => {
    const text = readRepoFile(`src/content/en-IN/store/${file}`);
    expect(valueImports(text).filter((path) => !ALLOWED.has(path))).toEqual([]);
  });

  it.each(MODULES)("$file loads without the seller, organisation or page data", async ({ file, name }) => {
    vi.resetModules();
    for (const path of FORBIDDEN) {
      vi.doMock(path, () => {
        throw new Error(`${file} loaded ${path}`);
      });
    }
    const loaded = (await import(`./${file}`)) as Record<string, unknown>;
    expect(loaded[name]).toBeTypeOf("object");
  });

  it.each(MODULES)("$reader reads its words from $file, never from a page module", ({ file, reader }) => {
    const imports = valueImports(readRepoFile(reader));
    expect(imports).toContain(`@/content/en-IN/store/${file.replace(/\.ts$/, "")}`);
    expect(imports.filter((path) => /content\/en-IN\/store\/(store-page|confirmation)$/.test(path))).toEqual([]);
  });

  it("the page modules no longer hold the checkout's words", async () => {
    const storePage = (await import("./store-page")) as Record<string, unknown>;
    const confirmation = (await import("./confirmation")) as Record<string, unknown>;
    expect(Object.keys(storePage)).not.toContain("preorderFormCopy");
    expect(Object.keys(storePage)).not.toContain("orderSummaryCopy");
    expect(Object.keys(confirmation)).not.toContain("addressForm");
  });
});
