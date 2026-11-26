import { describe, expect, it } from "vitest";
import { fitCell, toCellText, truncationMarker } from "../../supabase/functions/db-backup/cells";
import { MAX_CELL_CHARS } from "../../supabase/functions/db-backup/config";
import { formatIst, istDate } from "../../supabase/functions/db-backup/ist";

describe("toCellText: a database value as the text of one cell", () => {
  it("null and undefined are empty cells; text stays as it is", () => {
    expect(toCellText(null)).toBe("");
    expect(toCellText(undefined)).toBe("");
    expect(toCellText("Fakey")).toBe("Fakey");
  });
  it("numbers and booleans become plain text a CSV import reads back", () => {
    expect(toCellText(49900)).toBe("49900");
    expect(toCellText(true)).toBe("true");
    expect(toCellText(false)).toBe("false");
  });
  it("JSON columns become their JSON text, one line", () => {
    expect(toCellText({ pin: "000000", line1: "x" })).toBe('{"pin":"000000","line1":"x"}');
    expect(toCellText([1, 2])).toBe("[1,2]");
  });
  it("a formula-looking string is just text here (RAW writing keeps it text, see backup.test.ts)", () => {
    expect(toCellText("=HYPERLINK(\"x\")")).toBe("=HYPERLINK(\"x\")");
  });
});

describe("fitCell: the 50,000-character cell limit", () => {
  it("leaves a value at the limit alone", () => {
    const text = "a".repeat(MAX_CELL_CHARS);
    expect(fitCell(text)).toEqual({ text, truncated: false });
  });
  it("cuts a longer value to fit, ending in a visible marker that says how much was kept", () => {
    const text = "b".repeat(MAX_CELL_CHARS + 1234);
    const fitted = fitCell(text);
    expect(fitted.truncated).toBe(true);
    expect(fitted.text.length).toBeLessThanOrEqual(MAX_CELL_CHARS);
    const kept = Number(/TRUNCATED: (\d+) of (\d+)/.exec(fitted.text)?.[1]);
    expect(fitted.text).toBe(text.slice(0, kept) + truncationMarker(kept, text.length));
    expect(fitted.text.endsWith(`of ${text.length} characters kept]`)).toBe(true);
  });
  it("never ends in half a surrogate pair", () => {
    const limit = 100;
    for (let pad = 0; pad < 60; pad++) {
      const fitted = fitCell("x".repeat(pad) + "😀".repeat(200), limit);
      expect(fitted.truncated).toBe(true);
      expect(fitted.text.length).toBeLessThanOrEqual(limit);
      expect(/[\ud800-\udbff](?![\udc00-\udfff])/.test(fitted.text)).toBe(false);
    }
  });
  it("fits for every length around the limit (digits in the marker change)", () => {
    for (const extra of [1, 2, 9, 10, 99, 100, 5000, 40000]) {
      const fitted = fitCell("z".repeat(MAX_CELL_CHARS + extra));
      expect(fitted.text.length).toBeLessThanOrEqual(MAX_CELL_CHARS);
      expect(fitted.truncated).toBe(true);
    }
  });
});

describe("India time", () => {
  it("is UTC+05:30: 02:00 IST is 20:30 UTC the evening before", () => {
    expect(formatIst(new Date("2026-11-25T20:30:00Z"))).toBe("2026-11-26 02:00:00 IST");
    expect(istDate(new Date("2026-11-25T20:30:00Z"))).toBe("2026-11-26");
  });
  it("rolls the date at 18:30 UTC, and pads every field", () => {
    expect(istDate(new Date("2026-11-25T18:29:59Z"))).toBe("2026-11-25");
    expect(istDate(new Date("2026-11-25T18:30:00Z"))).toBe("2026-11-26");
    expect(formatIst(new Date("2026-01-02T00:05:07Z"))).toBe("2026-01-02 05:35:07 IST");
  });
  it("crosses a year end", () => {
    expect(formatIst(new Date("2026-12-31T19:00:00Z"))).toBe("2027-01-01 00:30:00 IST");
  });
});
