import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import { KHEELU_LANGUAGES } from "@/config/site";
import type { IconText, RichTextString } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { CLAIM_FIXES, editsBeforeClaimFixes } from "../../../../../test/e2e/support/deviations";
import { ROOT, readRepoFile } from "../../../../../test/e2e/support/repo";
import { withFacts } from "../../../../../test/support/mockup-facts";
import { seller } from "../../seller";
import { product, type SpecRow } from "./product";

/* Product facts (architecture §6.1, §9.2; wiki/product/facts.md; D034, D036): the details panels
 * and declarations exactly as the approved product page prints them (stacked, N21), with the founder's
 * page facts applied (task 6.7: the parent app's phones filled, D055 item 26; every row and line still
 * waiting on an F4 value hidden on every environment, the box contents kept, D054 item 19), languages
 * with their `lang` codes, the three modes, and the schema fields that never change (Product `@id`,
 * ages 3 to 7). Then the founder's D058 (task 8b.1; deviation V27; CLAIM_FIXES["meet-kheelu"]): the
 * Microphone and Parent app rows and the Safety panel's first line follow the live team's code check. */

const doc = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const approved = doc("meet-kheelu");
/** The approved page with the founder's page facts applied (test/e2e/support/page-facts.ts), and task 7.1b's copy fixes,
 *  then task 8b.1's claim fixes in a pass of their own (test/e2e/support/deviations.ts). */
const page = withFacts(withFacts(approved.querySelector("main")!, editsBeforeClaimFixes("meet-kheelu")), CLAIM_FIXES["meet-kheelu"].edits);
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
  it("specs: every row as the mockup prints it, the parent app's phones filled and the four F4 rows hidden", () => {
    expect(contentRows(product.specs)).toEqual(rowsOf(page.querySelector("#panel-specs dl")));
    expect(contentRows(product.specs).map((r) => r.term)).toEqual([
      "Ages",
      "What it is",
      "Screen",
      "Camera",
      "Microphone",
      "Modes",
      "Open internet",
      "Languages",
      "Parent app",
    ]);
    expect(text(product.specs.find((r) => r.term === "Parent app")!.value as string)).toBe(
      "Every conversation, word for word, a few minutes after it ends; a daily summary; search; a look back over the week or the month. On iPhone and Android.",
    );
    expect(text(product.specs.find((r) => r.term === "Microphone")!.value as string)).toBe(
      "On only after a press of the wake-up button; off after a couple of minutes of quiet; a light shows while it’s on",
    );
  });

  it("in the box: three items with their icons (D041), untouched by the hidden F4 rows (D054 item 19)", () => {
    expect(contentTicks(product.box)).toEqual(ticksOf(page.querySelector("#panel-box ul")));
    expect(contentTicks(product.box)).toEqual(ticksOf(approved.querySelector("#panel-box ul")));
  });

  it("safety: the three confirmed items with their icons, the two F4 lines hidden; BIS applied for, not granted (claims §6)", () => {
    expect(contentTicks(product.safety)).toEqual(ticksOf(page.querySelector("#panel-safety ul")));
    expect(product.safety).toHaveLength(3);
  });

  it("declarations: MRP from its own value, origin, manufacturer, care (D034); net quantity and the month of manufacture hidden (F4)", () => {
    expect(contentRows(product.declarations)).toEqual(rowsOf(page.querySelector(".mk-declare dl")));
    expect(product.declarations.map((r) => r.term)).toEqual(["MRP", "Country of origin", "Manufacturer", "Consumer care"]);
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

  it("name the former name as alternateName, so one product never reads as two", () => {
    /* Architecture §6.1 and §9.2; claims §4 row 19 allows the old name only as alternateName and in
       the rename answer. The banned-phrases guard's `lumi` entry allows this line's sentence (task
       2.13; in any file, since the guard takes no path), added in the same commit as this assertion. */
    expect(product.schema.alternateName).toBe("Lumi");
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

/* D054 item 19 (task 6.7): the F4 slots stay in product.ts, in their approved places with their approved labels, so a
 * value the founder sends lands where it belongs; nothing of them is exported, so nothing of them renders, on any
 * environment (the guard's whole-tree test holds every content module to the same). */
describe("the F4 rows: hidden until their value arrives (D054 item 19)", () => {
  const SOURCE = readRepoFile("src/content/en-IN/products/kheelu/product.ts");

  it("keeps each F4 slot in the source, under its approved label", () => {
    for (const [label, note] of [
      ["Size and weight", "size and weight"],
      ["Materials", "outer fabric and filling"],
      ["Battery", "battery type, life per charge and charging time"],
      ["Charger", "charger type and its BIS registration number"],
      ["Age grading and warnings: ", "toy-safety age grading and any required warnings"],
      ["Battery safety: ", "battery safety certification"],
      ["Net quantity", "net quantity"],
      ["Month and year of manufacture", "month and year of manufacture"],
    ]) {
      expect(SOURCE, label).toContain(label);
      expect(SOURCE, note).toContain(`{${"ph"}:F4 ${note}}`);
    }
  });

  it("exports none of them: no row, line or schema field holds an F4 slot or its marker", () => {
    expect(JSON.stringify(product)).not.toMatch(/F4/);
  });
});
