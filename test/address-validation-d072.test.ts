import { describe, expect, it } from "vitest";
import { hasErrors, validateAddress, type AddressInput } from "@/features/preorder/lib/validate";

/* D072 (K-184 B8): the address is asked after the parent has paid, so the house/street and the city take anything typed,
   and the PIN code's first three digits must belong to the picked state. These assertions live here because the frozen
   validate.test.ts takes literal-only patches. */

const MISMATCH = "This PIN code belongs to a different state. Please check your PIN code and state.";
const FORMAT = "A PIN code is six digits, and never starts with a zero.";

const goodKarnataka: AddressInput = {
  line1: "Flat 4B, Sunrise Apartments, 12th Main",
  line2: "Near the park",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560041",
};

describe("house or flat and street", () => {
  it("saves a short answer such as a house number", () => {
    const errors = validateAddress({ ...goodKarnataka, line1: "10" });
    expect(errors.line1).toBeUndefined();
    expect(hasErrors(errors)).toBe(false);
  });

  it("still blocks an empty answer and one made only of spaces, with the same message", () => {
    for (const line1 of ["", "   "]) {
      expect(validateAddress({ ...goodKarnataka, line1 }).line1, JSON.stringify(line1)).toBe(
        "We need the flat or house and the street.",
      );
    }
  });

  it("keeps the 120 limit and its message", () => {
    expect(validateAddress({ ...goodKarnataka, line1: "x".repeat(120) }).line1).toBeUndefined();
    expect(validateAddress({ ...goodKarnataka, line1: "x".repeat(121) }).line1).toBe("Please shorten this a little.");
  });
});

describe("city or town", () => {
  it("saves a one-letter answer", () => {
    expect(validateAddress({ ...goodKarnataka, city: "X" }).city).toBeUndefined();
  });

  it("still blocks an empty city and one made only of spaces, with the same message", () => {
    for (const city of ["", "  "]) {
      expect(validateAddress({ ...goodKarnataka, city }).city, JSON.stringify(city)).toBe("Which city or town?");
    }
  });

  it("keeps the 60 limit and its message", () => {
    expect(validateAddress({ ...goodKarnataka, city: "x".repeat(60) }).city).toBeUndefined();
    expect(validateAddress({ ...goodKarnataka, city: "x".repeat(61) }).city).toBe("Please shorten this a little.");
  });
});

describe("the PIN code belongs to the picked state", () => {
  it("passes a good Kerala address", () => {
    const kerala = { ...goodKarnataka, city: "Kochi", state: "Kerala", pincode: "682001" };
    expect(hasErrors(validateAddress(kerala))).toBe(false);
  });

  it("blocks a Karnataka PIN against Kerala, with the approved line word for word", () => {
    const errors = validateAddress({ ...goodKarnataka, state: "Kerala", pincode: "560001" });
    expect(errors.pincode).toBe(MISMATCH);
    expect(Object.keys(errors)).toEqual(["pincode"]);
  });

  it("reads the PIN as typed, spaces around it included", () => {
    expect(validateAddress({ ...goodKarnataka, state: "Kerala", pincode: " 560001 " }).pincode).toBe(MISMATCH);
    expect(validateAddress({ ...goodKarnataka, pincode: " 560001 " }).pincode).toBeUndefined();
  });

  it("lets the six-digit message win when the PIN is badly formed", () => {
    for (const pincode of ["56004", "0560041", "5600411", "abcdef", "", "060001"]) {
      expect(validateAddress({ ...goodKarnataka, state: "Kerala", pincode }).pincode, JSON.stringify(pincode)).toBe(FORMAT);
    }
  });

  it("says nothing about the PIN while the state itself is invalid", () => {
    for (const state of ["", "Karnatka", "KA"]) {
      const errors = validateAddress({ ...goodKarnataka, state, pincode: "110001" });
      expect(errors.state, state).toBe("Pick your state from the list.");
      expect(errors.pincode, state).toBeUndefined();
    }
  });

  it("never blocks a PIN prefix the table does not know, or one a state shares", () => {
    expect(validateAddress({ ...goodKarnataka, state: "Kerala", pincode: "569001" }).pincode).toBeUndefined();
    expect(validateAddress({ ...goodKarnataka, state: "Delhi", pincode: "900056" }).pincode).toBeUndefined();
    expect(validateAddress({ ...goodKarnataka, state: "Puducherry", pincode: "605001" }).pincode).toBeUndefined();
    expect(validateAddress({ ...goodKarnataka, state: "Tamil Nadu", pincode: "605001" }).pincode).toBeUndefined();
    expect(validateAddress({ ...goodKarnataka, state: "Telangana", pincode: "520001" }).pincode).toBeUndefined();
  });
});
