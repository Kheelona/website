import { describe, expect, it } from "vitest";
import {
  normalisePhone,
  validateContact,
  validateAddress,
  hasErrors,
  CHILD_AGE_MAX,
} from "./validate";

const goodContact = {
  parentName: "Priya Menon",
  phone: "9187546483",
  email: "priya@example.com",
  childAge: "3",
  accepted: true,
};

const goodAddress = {
  line1: "Flat 4B, Sunrise Apartments, 12th Main",
  line2: "Near the park",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560041",
};

describe("phone normalisation", () => {
  it("accepts the shapes people actually type", () => {
    for (const raw of ["9187546483", "+91 91875 46483", "091875 46483", "+919187546483"]) {
      expect(normalisePhone(raw), raw).toBe("9187546483");
    }
  });

  it("rejects what cannot be an Indian mobile number", () => {
    // landline-style leading digits, too short, too long, and letters
    for (const raw of ["5187546483", "918754648", "91875464831234", "not a number"]) {
      expect(normalisePhone(raw), raw).toBeNull();
    }
  });
});

describe("contact validation", () => {
  it("passes a real parent", () => {
    expect(hasErrors(validateContact(goodContact))).toBe(false);
  });

  it("insists on the terms tick, because it is a payment", () => {
    const errors = validateContact({ ...goodContact, accepted: false });
    expect(errors.accepted).toBeTruthy();
  });

  /* Free text since 2026-08-23. The dropdown it replaced rejected "2.5" and
     "2 and 5", which are true answers a parent actually has, and the field is
     only ever read by a human planning production. So the bar is: something was
     typed, and it is short enough to store. */
  it("takes an age however a parent writes it, and only insists it is there", () => {
    expect(validateContact({ ...goodContact, childAge: "" }).childAge).toBeTruthy();
    expect(validateContact({ ...goodContact, childAge: "   " }).childAge).toBeTruthy();
    for (const age of ["2", "2.5", "3 years", "nearly 4", "2 and 5", "18 months", "7"]) {
      expect(
        validateContact({ ...goodContact, childAge: age }).childAge,
        `rejected "${age}", which is a real answer`,
      ).toBeUndefined();
    }
  });

  it("refuses an age longer than the column, rather than letting the server trim it", () => {
    const tooLong = "x".repeat(CHILD_AGE_MAX + 1);
    expect(validateContact({ ...goodContact, childAge: tooLong }).childAge).toBeTruthy();
    expect(
      validateContact({ ...goodContact, childAge: "x".repeat(CHILD_AGE_MAX) }).childAge,
    ).toBeUndefined();
  });

  it("catches a missing at-sign and a missing dot, but allows a long domain", () => {
    expect(validateContact({ ...goodContact, email: "priya.example.com" }).email).toBeTruthy();
    expect(validateContact({ ...goodContact, email: "priya@example" }).email).toBeTruthy();
    expect(
      validateContact({ ...goodContact, email: "priya+lumi@mail.co.in" }).email,
    ).toBeUndefined();
  });
});

describe("address validation", () => {
  it("passes a real address", () => {
    expect(hasErrors(validateAddress(goodAddress))).toBe(false);
  });

  it("treats line 2 as optional", () => {
    expect(validateAddress({ ...goodAddress, line2: "" }).line2).toBeUndefined();
  });

  /* The PIN code rule earns its place: a six-digit code starting with zero is
     not an Indian PIN code, and a five-digit one is a US ZIP typed by habit. */
  it("holds the PIN code to six digits, never starting with zero", () => {
    for (const pincode of ["56004", "0560041", "5600411", "abcdef"]) {
      expect(validateAddress({ ...goodAddress, pincode }).pincode, pincode).toBeTruthy();
    }
    expect(validateAddress({ ...goodAddress, pincode: "110001" }).pincode).toBeUndefined();
  });

  it("only accepts a state from the list, so a courier can read it", () => {
    expect(validateAddress({ ...goodAddress, state: "Karnatka" }).state).toBeTruthy();
    expect(validateAddress({ ...goodAddress, state: "KA" }).state).toBeTruthy();
  });
});
