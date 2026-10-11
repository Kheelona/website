import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  isPlaceholder,
  parsePlaceholderToken,
  placeholder as ph,
  placeholderText,
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
