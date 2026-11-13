import { describe, expect, it } from "vitest";
import {
  OPENAI_ADS_CURRENCY,
  OPENAI_CAPI_URL,
  OPENAI_COOKIES,
  OPENAI_PIXEL_CONFIG_URL,
  OPENAI_PIXEL_ID,
  openAiOrderData,
  validObref,
  validOppref,
} from "./openai-events";

describe("openAiOrderData", () => {
  it("reports the ₹499 reservation as 49900 paise of one Khelu reservation", () => {
    expect(openAiOrderData(49_900, "launch")).toEqual({
      type: "contents",
      amount: 49_900,
      currency: "INR",
      contents: [{ id: "khelu-reservation", name: "Khelu reservation", quantity: 1, amount: 49_900, currency: "INR" }],
    });
  });

  it("names a full payment as its own product", () => {
    const data = openAiOrderData(799_900, "full");
    expect(data.amount).toBe(799_900);
    expect(data.contents[0]).toMatchObject({ id: "khelu-full-payment", name: "Khelu (paid in full)", amount: 799_900 });
  });

  it("still reports a tier it has no name for, under its own id", () => {
    const data = openAiOrderData(9_900, "event");
    expect(data.contents[0]).toMatchObject({ id: "khelu-event", name: "Khelu pre-order", amount: 9_900, quantity: 1 });
  });

  it("always sends integers, in the one currency constant", () => {
    const data = openAiOrderData(49_900.4, "launch");
    expect(Number.isInteger(data.amount)).toBe(true);
    expect(Number.isInteger(data.contents[0].amount)).toBe(true);
    expect(data.currency).toBe(OPENAI_ADS_CURRENCY);
    expect(data.contents[0].currency).toBe(OPENAI_ADS_CURRENCY);
    expect(OPENAI_ADS_CURRENCY).toBe("INR");
  });

  it("repeats the order amount on the one line item, so the lines sum to the total", () => {
    const data = openAiOrderData(49_900, "launch");
    expect(data.contents.reduce((n, c) => n + c.amount * c.quantity, 0)).toBe(data.amount);
  });
});

describe("validOppref", () => {
  it("accepts an opaque token of URL-safe characters", () => {
    expect(validOppref("f6_test_ref")).toBe("f6_test_ref");
    expect(validOppref("Ab1.-_~xyz")).toBe("Ab1.-_~xyz");
    expect(validOppref("a".repeat(512))).toBe("a".repeat(512));
  });

  it("refuses, and never trims, anything else", () => {
    expect(validOppref("")).toBeNull();
    expect(validOppref(null)).toBeNull();
    expect(validOppref(undefined)).toBeNull();
    expect(validOppref(" abc")).toBeNull();
    expect(validOppref("abc ")).toBeNull();
    expect(validOppref("a b")).toBeNull();
    expect(validOppref("a;b")).toBeNull();
    expect(validOppref('a"b')).toBeNull();
    expect(validOppref("a,b")).toBeNull();
    expect(validOppref("a\nb")).toBeNull();
    expect(validOppref("a".repeat(513))).toBeNull();
  });
});

describe("validObref", () => {
  it("accepts a random browser reference of letters, digits and hyphens", () => {
    expect(validObref("3f2a9c1e-77aa-4b1d-9c10-0123456789ab")).toBe("3f2a9c1e-77aa-4b1d-9c10-0123456789ab");
    expect(validObref("a".repeat(64))).toBe("a".repeat(64));
  });

  it("refuses a malformed one", () => {
    expect(validObref("")).toBeNull();
    expect(validObref(null)).toBeNull();
    expect(validObref("a".repeat(65))).toBeNull();
    expect(validObref("abc_def")).toBeNull();
    expect(validObref("abc def")).toBeNull();
    expect(validObref("abc;def")).toBeNull();
  });
});

describe("the constants", () => {
  it("holds OpenAI's pixel ID and the endpoints built from it", () => {
    expect(OPENAI_PIXEL_ID).toBe("CtmHigpYxafJN3qgbj3xnv");
    expect(OPENAI_PIXEL_CONFIG_URL).toBe("https://bzrcdn.openai.com/pixel-config/v1/CtmHigpYxafJN3qgbj3xnv.json");
    expect(OPENAI_CAPI_URL).toBe("https://bzr.openai.com/v1/events?pid=CtmHigpYxafJN3qgbj3xnv");
  });

  it("lists the three cookies the feature reads or clears", () => {
    expect([...OPENAI_COOKIES]).toEqual(["kh_oppref", "__oppref", "__obref"]);
  });
});
