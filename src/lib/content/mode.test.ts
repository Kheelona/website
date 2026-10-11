import { describe, expect, it } from "vitest";
import { isModeVariant, pickMode } from "./mode";

const sentence = { token: "Reserve yours today.", full: "Paid in full when you order." };

describe("pickMode", () => {
  it("returns the token text in token mode and the full text in full mode", () => {
    expect(pickMode(sentence, "token")).toBe("Reserve yours today.");
    expect(pickMode(sentence, "full")).toBe("Paid in full when you order.");
  });

  it("returns a value that does not change with the mode as it is, in either mode", () => {
    expect(pickMode("Ages 3 to 7.", "token")).toBe("Ages 3 to 7.");
    expect(pickMode("Ages 3 to 7.", "full")).toBe("Ages 3 to 7.");
    expect(pickMode("Ages 3 to 7.", undefined)).toBe("Ages 3 to 7.");
  });

  it("picks between objects too, such as the sticky bar's two lines", () => {
    const sticky = { token: { big: "a", small: "b" }, full: { big: "c", small: "d" } };
    expect(pickMode(sticky, "full")).toEqual({ big: "c", small: "d" });
  });

  it("refuses to guess when a value changes with the mode and no mode is given", () => {
    expect(() => pickMode(sentence, undefined)).toThrow(/mode/i);
  });
});

describe("isModeVariant", () => {
  it("is true only for an object with exactly the two modes", () => {
    expect(isModeVariant(sentence)).toBe(true);
    expect(isModeVariant("text")).toBe(false);
    expect(isModeVariant(null)).toBe(false);
    expect(isModeVariant({ token: "a" })).toBe(false);
    // the offer's price table has token and full keys among others: not a variant
    expect(isModeVariant({ token: "a", balance: "b", headline: "c", full: "d", mrp: "e" })).toBe(false);
  });
});
