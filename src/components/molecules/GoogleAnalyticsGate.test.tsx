import { describe, expect, it } from "vitest";
import { GA4_HOSTS, GA4_MEASUREMENT_ID } from "@/config/site";
import { shouldLoadGa4 } from "./GoogleAnalyticsGate";

/** The whole risk of hardcoding a measurement ID sits in this predicate: too
 *  loose and our own localhost and preview traffic pollutes the founder's
 *  property, too tight and production measures nothing. So it gets tested
 *  directly rather than through a render. */
describe("shouldLoadGa4", () => {
  it("loads on the production hosts", () => {
    expect(shouldLoadGa4("kheelona.com")).toBe(true);
    expect(shouldLoadGa4("www.kheelona.com")).toBe(true);
  });

  it("does NOT load on localhost", () => {
    expect(shouldLoadGa4("localhost")).toBe(false);
    expect(shouldLoadGa4("127.0.0.1")).toBe(false);
  });

  it("does NOT load on Vercel preview hosts", () => {
    // The founder review URL, and the shape every future preview takes.
    expect(shouldLoadGa4("website-hdn2.vercel.app")).toBe(false);
    expect(shouldLoadGa4("website-git-demo-website-kheelona.vercel.app")).toBe(false);
  });

  it("does NOT load on the sister site or a lookalike domain", () => {
    expect(shouldLoadGa4("kheelona.ai")).toBe(false);
    expect(shouldLoadGa4("kheelona.com.evil.example")).toBe(false);
    expect(shouldLoadGa4("notkheelona.com")).toBe(false);
  });

  it("is case-insensitive, because hostnames are", () => {
    expect(shouldLoadGa4("Kheelona.com")).toBe(true);
    expect(shouldLoadGa4("WWW.KHEELONA.COM")).toBe(true);
  });
});

describe("the GA4 constants", () => {
  it("holds the founder's real measurement ID in GA4 shape", () => {
    expect(GA4_MEASUREMENT_ID).toMatch(/^G-[A-Z0-9]{10}$/);
  });

  it("lists production hosts only, never a preview or local host", () => {
    for (const h of GA4_HOSTS) {
      expect(h).not.toMatch(/vercel\.app|localhost|127\.0\.0\.1/);
    }
  });
});
