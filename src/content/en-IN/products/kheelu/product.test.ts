import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import { KHEELU_LANGUAGES } from "@/config/site";
import type { IconText, RichTextString } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { ROOT, readRepoFile } from "../../../../../test/e2e/support/repo";
import { seller } from "../../seller";
import { product, type SpecRow } from "./product";

/* Product facts (architecture §6.1, §9.2; wiki/product/facts.md; D034, D036): the details panels
 * and declarations exactly as the approved product page prints them (stacked, N21), placeholders
 * where the facts are still open (F4), languages with their `lang` codes, the three modes, and the
 * schema fields that never change (Product `@id`, ages 3 to 7). */

const doc = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const page = doc("meet-kheelu");
const offer = buildOffer("token");
const text = (value: RichTextString) => toPlainText(value, offer);

function iconOf(svg: Element | null): IconName | undefined {
  const d = Array.from(svg?.querySelectorAll("path") ?? []).map((p) => p.getAttribute("d")).join("");
  return (Object.keys(ICON_PATHS) as IconName[]).find((name) => ICON_PATHS[name] === d);
}

const rowsOf = (dl: Element | null) =>
  Array.from(dl?.querySelectorAll(":scope > div") ?? []).map((row) => {
    const dd = row.querySelector("dd")!;
    const lines = dd.querySelectorAll(".mk-care");
    return {
      term: norm(row.querySelector("dt")?.textContent),
      value: lines.length > 0 ? Array.from(lines).map((l) => norm(l.textContent)) : norm(dd.textContent),
    };
  });
const contentRows = (rows: readonly SpecRow[]) =>
  rows.map((r) => ({ term: r.term, value: typeof r.value === "string" ? text(r.value) : r.value.map(text) }));
const ticksOf = (ul: Element | null) =>
  Array.from(ul?.querySelectorAll("li") ?? []).map((li) => ({ icon: iconOf(li.querySelector("svg")), text: norm(li.textContent) }));
const contentTicks = (items: readonly IconText[]) => items.map((i) => ({ icon: i.icon, text: text(i.text) }));

describe("the details panels (product fold 7)", () => {
  it("specs: every row as the mockup prints it, placeholders included", () => {
    expect(contentRows(product.specs)).toEqual(rowsOf(page.querySelector("#panel-specs dl")));
  });

  it("in the box: three items with their icons (D041)", () => {
    expect(contentTicks(product.box)).toEqual(ticksOf(page.querySelector("#panel-box ul")));
  });

  it("safety: five items with their icons; BIS applied for, not granted (claims §6)", () => {
    expect(contentTicks(product.safety)).toEqual(ticksOf(page.querySelector("#panel-safety ul")));
  });

  it("declarations: MRP from its own value, origin, manufacturer, care (D034)", () => {
    expect(contentRows(product.declarations)).toEqual(rowsOf(page.querySelector(".mk-declare dl")));
    expect(JSON.stringify(product.declarations)).toContain("{price:mrp}");
  });

  it("names the manufacturer and origin from the seller block, never retyped", () => {
    const value = (term: string) => product.declarations.find((r) => r.term === term)?.value;
    expect(value("Manufacturer")).toBe(seller.manufacturer);
    expect(value("Country of origin")).toBe(seller.origin.country);
  });
});

describe("languages and modes", () => {
  it("names the eight announced languages, in the checkout constant's order", () => {
    expect(product.languages.map((l) => l.name)).toEqual([...KHEELU_LANGUAGES]);
    expect(product.languageCeiling).toBe(10);
  });

  it("shows each language's own name and lang code as the chips do (Home and product)", () => {
    for (const slug of ["home", "meet-kheelu"]) {
      const chips = Array.from(doc(slug).querySelectorAll(".kh-lang")).map((li) => ({
        native: norm(li.querySelector(".kh-lang__native")?.textContent),
        en: norm(li.querySelector(".kh-lang__en")?.textContent) || null,
        lang: li.querySelector(".kh-lang__native")?.getAttribute("lang") ?? null,
      }));
      expect(
        product.languages.map((l) => ({
          native: l.native,
          en: l.native === l.name ? null : l.name,
          lang: l.lang === "en" ? null : l.lang,
        })),
        slug,
      ).toEqual(chips);
    }
  });

  it("has the three modes and what each needs (facts, modes; D027)", () => {
    expect(product.modes.map((m) => [m.id, m.name, m.needs])).toEqual([
      ["ai", "AI mode", "home Wi‑Fi"],
      ["story", "Story mode", "no Wi‑Fi needed"],
      ["bluetooth", "Bluetooth mode", "a paired phone"],
    ]);
    for (const m of product.modes) expect(Object.keys(ICON_PATHS)).toContain(m.icon);
  });
});

describe("schema facts (architecture §9.2)", () => {
  it("keep the Product @id for good (lessons §6)", () => {
    expect(product.schema.id).toBe("https://kheelona.com/products/lumi#product");
    expect(product.schema.name).toBe("Kheelu by Kheelona");
    expect(product.schema.brand).toBe(seller.brand);
    expect(product.schema.category).toBe("Screen-free AI toy");
    expect(product.schema.countryOfOrigin).toBe("IN");
  });

  it("leave out the former name until the banned-phrases guard allows it as alternateName", () => {
    /* Claims §4 row 19 allows the old name only as alternateName and in the rename answer, but the
       guard's scan of new src code reads `alternateName: "Lumi"` as a banned use: its allowance
       matches a bare string only. Reported to the main session with task 2.1; the field is added
       here, and this test flipped, in the commit that widens the allowance. */
    expect("alternateName" in product.schema).toBe(false);
  });

  it("state the 3 to 7 band, never 3+ alone", () => {
    expect(product.ages).toEqual({ min: 3, max: 7 });
    expect(product.specs.find((r) => r.term === "Ages")?.value).toBe("3 to 7");
  });

  it("use the stable machine image, which exists", () => {
    expect(product.schema.image).toBe("/media/kheelu-front.jpg");
    expect(existsSync(join(ROOT, "public", product.schema.image))).toBe(true);
  });

  it("never type a rupee amount", () => {
    expect(JSON.stringify(product)).not.toContain("₹");
  });
});
