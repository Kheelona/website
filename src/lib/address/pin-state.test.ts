import { describe, expect, it } from "vitest";
import { INDIAN_STATES } from "@/features/preorder/lib/india";
import { PIN_PREFIXES, pinMatchesState } from "./pin-state";

/* The table may only ever stop an obvious mismatch (D072, K-184 B8): a paid parent must never be blocked by a gap in it.
   One real PIN per state, each read in the All India Pincode Directory on 25 Nov 2026. */
const REAL_PIN: Readonly<Record<(typeof INDIAN_STATES)[number], string>> = {
  "Andaman and Nicobar Islands": "744101",
  "Andhra Pradesh": "520001",
  "Arunachal Pradesh": "791111",
  Assam: "781001",
  Bihar: "800001",
  Chandigarh: "160017",
  Chhattisgarh: "492001",
  "Dadra and Nagar Haveli and Daman and Diu": "396230",
  Delhi: "110001",
  Goa: "403001",
  Gujarat: "380001",
  Haryana: "122001",
  "Himachal Pradesh": "171001",
  "Jammu and Kashmir": "190001",
  Jharkhand: "834001",
  Karnataka: "560001",
  Kerala: "695001",
  Ladakh: "194101",
  Lakshadweep: "682555",
  "Madhya Pradesh": "462001",
  Maharashtra: "400001",
  Manipur: "795001",
  Meghalaya: "793001",
  Mizoram: "796001",
  Nagaland: "797001",
  Odisha: "751001",
  Puducherry: "605001",
  Punjab: "141001",
  Rajasthan: "302001",
  Sikkim: "737101",
  "Tamil Nadu": "600001",
  Telangana: "500001",
  Tripura: "799001",
  "Uttar Pradesh": "226001",
  Uttarakhand: "248001",
  "West Bengal": "700001",
};

describe("the PIN prefix table", () => {
  it("has a row for every state and union territory the form offers, and no other", () => {
    expect(Object.keys(PIN_PREFIXES).sort()).toEqual([...INDIAN_STATES].sort());
  });

  it("holds only well-formed, ascending runs of three-digit prefixes, never a 9xx one", () => {
    for (const [state, runs] of Object.entries(PIN_PREFIXES)) {
      for (const run of runs.split(" ")) {
        expect(run, `${state}: "${run}"`).toMatch(/^[1-8]\d\d(-[1-8]\d\d)?$/);
        const [from, to = from] = run.split("-").map(Number);
        expect(to, `${state}: "${run}" runs backwards`).toBeGreaterThanOrEqual(from);
      }
    }
  });

  it("keeps a state's runs in ascending order, without overlap", () => {
    for (const [state, runs] of Object.entries(PIN_PREFIXES)) {
      let last = 0;
      for (const run of runs.split(" ")) {
        const [from, to = from] = run.split("-").map(Number);
        expect(from, `${state}: "${run}" follows ${last}`).toBeGreaterThan(last);
        last = to;
      }
    }
  });
});

describe("pinMatchesState", () => {
  it.each(INDIAN_STATES.map((state) => [state, REAL_PIN[state]]))("a real %s PIN, %s, matches its state", (state, pin) => {
    expect(pinMatchesState(pin, state)).toBe(true);
  });

  it("refuses a known prefix against a state that does not own it", () => {
    expect(pinMatchesState("560001", "Kerala")).toBe(false);
    expect(pinMatchesState("110001", "Karnataka")).toBe(false);
    expect(pinMatchesState("682555", "Tamil Nadu")).toBe(false);
  });

  it("accepts every state that shares a prefix", () => {
    const shared: [string, string[]][] = [
      ["403001", ["Goa"]],
      ["533464", ["Puducherry", "Andhra Pradesh", "Telangana"]],
      ["605001", ["Puducherry", "Tamil Nadu"]],
      ["609602", ["Puducherry", "Tamil Nadu"]],
      ["673310", ["Puducherry", "Kerala"]],
      ["396210", ["Dadra and Nagar Haveli and Daman and Diu", "Gujarat"]],
      ["362520", ["Dadra and Nagar Haveli and Daman and Diu", "Gujarat"]],
      ["160017", ["Chandigarh", "Punjab", "Haryana"]],
      ["134109", ["Chandigarh", "Haryana"]],
      ["140603", ["Chandigarh", "Punjab"]],
      ["500001", ["Andhra Pradesh", "Telangana"]],
      ["520001", ["Andhra Pradesh", "Telangana"]],
      ["507111", ["Andhra Pradesh", "Telangana"]],
      ["194101", ["Jammu and Kashmir", "Ladakh"]],
      ["190001", ["Jammu and Kashmir", "Ladakh"]],
      ["682555", ["Lakshadweep", "Kerala"]],
      ["744101", ["Andaman and Nicobar Islands"]],
    ];
    for (const [pin, states] of shared) {
      for (const state of states) expect(pinMatchesState(pin, state), `${pin} for ${state}`).toBe(true);
    }
  });

  it("always allows a prefix no state lists", () => {
    // 569 is not in the directory; 9xx is the Army Postal Service, left out on purpose
    expect(pinMatchesState("569001", "Kerala")).toBe(true);
    for (const state of INDIAN_STATES) {
      expect(pinMatchesState("999001", state), `999001 for ${state}`).toBe(true);
      expect(pinMatchesState("900056", state), `900056 for ${state}`).toBe(true);
    }
  });

  it("reads only the first three digits, and ignores spaces around the PIN", () => {
    expect(pinMatchesState(" 560041 ", "Karnataka")).toBe(true);
    expect(pinMatchesState("560999", "Karnataka")).toBe(true);
    expect(pinMatchesState(" 560041 ", "Kerala")).toBe(false);
  });
});
