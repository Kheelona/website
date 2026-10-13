import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  HIDDEN_ITEMS,
  isHiddenPlaceholder,
  isPlaceholder,
  parsePlaceholderToken,
  placeholder as ph,
  placeholderText,
  withoutHiddenRows,
  withoutHiddenSlots,
} from "./placeholder";

/* The production placeholder scan (task 2.9) looks for the literal opening of a
   marker, the data helper's call and the inline token anywhere in src/. This file
   spells them in pieces so the scan never mistakes a test for open content. */
const OPEN = "[" + "PLACEHOLDER";

describe("the marker text a placeholder renders", () => {
  it("names the open item and then its note", () => {
    expect(placeholderText(ph("F4", "size and weight"))).toBe(`${OPEN} F4: size and weight]`);
  });

  it("drops the id and its space when the copy page gives none", () => {
    expect(placeholderText(ph(null, "region"))).toBe(`${OPEN}: region]`);
  });

  it("keeps the note exactly as written, punctuation and quotes included", () => {
    const note = "names, or “on request”";
    expect(placeholderText(ph(null, note))).toBe(`${OPEN}: names, or “on request”]`);
  });
});

describe("the data helper", () => {
  it("accepts the id shapes the project uses: F4, F11, B24, C6, G-20, D047, ARTICLE", () => {
    for (const id of ["F4", "F11", "B24", "C6", "G-20", "D047", "ARTICLE"]) {
      expect(ph(id, "note").id).toBe(id);
    }
  });

  it("refuses an id that is not an open-item id, so a typo cannot hide the item", () => {
    for (const id of ["f4", "F 4", "4F", "A", "", "F4:"]) {
      expect(() => ph(id, "note"), id).toThrow(/id/i);
    }
  });

  it("refuses an all-capitals word as an id: open items are numbered, ARTICLE aside", () => {
    for (const id of ["GST", "BIS", "HSN", "CA"]) {
      expect(() => ph(id, "note"), id).toThrow(/open-item id/i);
    }
  });

  it("refuses an empty note: the founder must see what is missing", () => {
    expect(() => ph("F4", "")).toThrow(/note/i);
    expect(() => ph("F4", "   ")).toThrow(/note/i);
  });

  it("trims the note it is given", () => {
    expect(ph("F4", "  size and weight ").note).toBe("size and weight");
  });
});

describe("isPlaceholder", () => {
  it("recognises what the helper makes", () => {
    expect(isPlaceholder(ph("F4", "size and weight"))).toBe(true);
  });

  /* Server components pass props to client parts by serialising them, so a
     placeholder must still read as one after a copy, not only by identity. */
  it("still recognises a placeholder after it has been serialised and copied", () => {
    const copy = JSON.parse(JSON.stringify(ph("B24", "founder photo")));
    expect(isPlaceholder(copy)).toBe(true);
    expect(placeholderText(copy)).toBe(`${OPEN} B24: founder photo]`);
  });

  it("is false for strings, empty values and other objects", () => {
    for (const value of ["F4 size", `${OPEN} F4: size]`, null, undefined, 0, {}, { id: "F4", note: "x" }]) {
      expect(isPlaceholder(value), String(value)).toBe(false);
    }
  });
});

describe("the inline token body", () => {
  it.each([
    ["F4 size and weight", "F4", "size and weight"],
    ["F11 proof of the recognition", "F11", "proof of the recognition"],
    ["ARTICLE rewrite pending", "ARTICLE", "rewrite pending"],
    ["G-20 the brand green", "G-20", "the brand green"],
    ["region", null, "region"],
    ["how long we keep them", null, "how long we keep them"],
    ["order number, KH-XXXX-XXXX", null, "order number, KH-XXXX-XXXX"],
    ["D047 the founder’s ruling", "D047", "the founder’s ruling"],
    // a single capital is an English word, never an id
    ["A grown-up nearby", null, "A grown-up nearby"],
    // an all-capitals word without a digit is part of the note (ARTICLE aside)
    ["GST documents", null, "GST documents"],
    ["BIS number", null, "BIS number"],
    ["HSN code and the GST rate", null, "HSN code and the GST rate"],
  ])("reads %j as id %j with note %j", (body, id, note) => {
    const result = parsePlaceholderToken(body);
    expect(result.id).toBe(id);
    expect(result.note).toBe(note);
    expect(isPlaceholder(result)).toBe(true);
  });

  it("ignores the spacing around and between the id and the note", () => {
    const result = parsePlaceholderToken("  F4    size and weight  ");
    expect([result.id, result.note]).toEqual(["F4", "size and weight"]);
  });

  it("refuses an id with no note", () => {
    expect(() => parsePlaceholderToken("F4")).toThrow(/note/i);
  });

  it("refuses an empty body", () => {
    expect(() => parsePlaceholderToken("")).toThrow(/empty/i);
    expect(() => parsePlaceholderToken("  ")).toThrow(/empty/i);
  });
});

/* Text parity with the approved mockups: every marker they print, written as the
   inline token, renders back to exactly the same marker. A new note that the id
   rule would misread fails here, in CI, and not on beta. */
describe("every placeholder marker in the approved mockups", () => {
  /* A string, not a URL object: under jsdom, URL is jsdom's and node refuses it. */
  const mockup = join(dirname(fileURLToPath(import.meta.url)), "../../../mockup");
  const files = readdirSync(mockup, { recursive: true, encoding: "utf8" }).filter((file) => file.endsWith(".html"));
  const escaped = OPEN.replace(/[[\]]/g, "\\$&");
  const markerPattern = new RegExp(`${escaped}[^\\]]*\\]`, "g");
  const markers = [
    ...new Set(files.flatMap((file) => readFileSync(join(mockup, file), "utf8").match(markerPattern) ?? [])),
  ];
  const markerParts = new RegExp(`^${escaped}(?: ([^:\\s]+))?: (.+)\\]$`, "s");

  it("finds the mockups' markers", () => {
    expect(markers.length).toBeGreaterThan(0);
  });

  it.each(markers.map((marker) => [marker]))("round-trips %s through the token", (marker) => {
    const [, id, note] = markerParts.exec(marker) ?? [];
    expect(note, marker).toBeDefined();
    const body = id === undefined ? note : `${id} ${note}`;
    expect(placeholderText(parsePlaceholderToken(body))).toBe(marker);
  });
});

/* D054 item 19 (task 6.7): an F4 slot, the product's final specs, is hidden instead of marked. The row or line it is
   the value of comes off the page on every environment (nothing of it renders, so the production build has nothing to
   refuse); a line with words of its own keeps them; the box contents stay. Every other placeholder is untouched: marked
   on beta, refused in production. Tokens are spelled in pieces, as above. */
const token = (body: string) => "{" + "ph:" + body + "}";

describe("the open items hidden until their value arrives (D054 item 19)", () => {
  it("is F4 alone", () => {
    expect(HIDDEN_ITEMS).toEqual(["F4"]);
  });

  it("recognises an F4 placeholder, from the helper or the token, and nothing else", () => {
    expect(isHiddenPlaceholder(ph("F4", "size and weight"))).toBe(true);
    expect(isHiddenPlaceholder(parsePlaceholderToken("F4 net quantity"))).toBe(true);
    expect(isHiddenPlaceholder(JSON.parse(JSON.stringify(ph("F4", "net quantity"))))).toBe(true);
    for (const other of [ph("F11", "proof"), ph("B24", "founder photo"), ph(null, "region"), ph("F41", "x")]) {
      expect(isHiddenPlaceholder(other), String(other.id)).toBe(false);
    }
    for (const value of [token("F4 size"), "F4", null, undefined, { id: "F4", note: "x" }]) {
      expect(isHiddenPlaceholder(value), String(value)).toBe(false);
    }
  });
});

describe("withoutHiddenSlots: one content string", () => {
  it.each([
    ["a value that is only the slot", token("F4 size and weight")],
    ["a label waiting on its value", `Battery safety: ${token("F4 battery safety certification")}`],
    ["a label and two slots", `Battery: ${token("F4 type")} ${token("F4 life")}`],
  ])("says nothing once %s is gone: null", (_name, text) => {
    expect(withoutHiddenSlots(text)).toBeNull();
  });

  it("keeps a line's own words and drops the slot with the space before it", () => {
    expect(withoutHiddenSlots(`It charges with the charger in the box. ${token("F4 battery life per charge and charging time")}`)).toBe(
      "It charges with the charger in the box.",
    );
    expect(withoutHiddenSlots(`Charge it ${token("F4 x")} first.`)).toBe("Charge it first.");
  });

  it("leaves every other placeholder, and every other token, exactly where it is", () => {
    const others = `Every conversation, word for word. ${token("which phones the parent app runs on")} ${token("B24 founder photo")}`;
    expect(withoutHiddenSlots(others)).toBe(others);
    expect(withoutHiddenSlots(`{price:mrp} (incl. of all taxes) ${token("F4 x")}`)).toBe("{price:mrp} (incl. of all taxes)");
    expect(withoutHiddenSlots(token("region"))).toBe(token("region"));
    expect(withoutHiddenSlots("Ages 3 to 7")).toBe("Ages 3 to 7");
  });

  it("refuses a malformed slot instead of hiding it", () => {
    expect(() => withoutHiddenSlots(`Size: ${token("F4")}`)).toThrow(/note/i);
  });
});

describe("withoutHiddenRows: the rows and lines a page shows", () => {
  const specs = [
    { term: "Screen", value: "None" },
    { term: "Size and weight", value: token("F4 size and weight") },
    { term: "Parent app", value: `A weekly report. ${token("which phones the parent app runs on")}` },
    { term: "Consumer care", value: ["WhatsApp", token("F4 a second line")] },
    { term: "Net quantity", value: [token("F4 net quantity")] },
    { term: "Founder", value: ph("B24", "founder photo") },
    { term: "Charger", value: ph("F4", "charger type") },
  ];

  it("drops each row whose value is an F4 slot and keeps the others, in order, every other placeholder included", () => {
    expect(withoutHiddenRows(specs, "value")).toEqual([
      { term: "Screen", value: "None" },
      { term: "Parent app", value: `A weekly report. ${token("which phones the parent app runs on")}` },
      { term: "Consumer care", value: ["WhatsApp"] },
      { term: "Founder", value: ph("B24", "founder photo") },
    ]);
  });

  it("keeps a line's confirmed half and drops a line that is only a label and its slot", () => {
    const lines = [
      { icon: "battery-charging", text: `It charges with the charger in the box. ${token("F4 battery life")}` },
      { icon: "warning-circle", text: `Age grading and warnings: ${token("F4 age grading")}` },
      { icon: "package", text: "Kheelu plush toy" },
    ];
    expect(withoutHiddenRows(lines, "text")).toEqual([
      { icon: "battery-charging", text: "It charges with the charger in the box." },
      { icon: "package", text: "Kheelu plush toy" },
    ]);
  });

  it("leaves a list with no F4 slot as it is: the box contents stay", () => {
    const box = [
      { icon: "package", text: "Kheelu plush toy" },
      { icon: "battery-charging", text: "Charger" },
      { icon: "book-open", text: "Quick-start card" },
    ];
    expect(withoutHiddenRows(box, "text")).toEqual(box);
  });

  it("renders nothing of a hidden slot: no marker in the words a page, its JSON-LD or llms.txt print", () => {
    const shown = withoutHiddenRows(specs, "value").flatMap((row) => (Array.isArray(row.value) ? row.value : [row.value]));
    const printed = shown.map((value) => (isPlaceholder(value) ? placeholderText(value) : value)).join("\n");
    expect(printed).not.toContain("F4");
    expect(printed).toContain(`${OPEN} B24: founder photo]`);
  });
});
