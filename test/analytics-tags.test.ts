import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Three measurement tools now run on this site, and each one carries a promise
 * on /privacy about whether it sets cookies. The standing rule from
 * website-steps §8.21-c is that a tool and the sentence describing it ship
 * together, so this guards the pairing: if someone adds or removes a tag
 * without touching the privacy page, this fails.
 *
 * Cookie behaviour below was OBSERVED in a browser on a clean load, not copied
 * from a vendor's marketing page: Vercel and Ahrefs set nothing, GA4 sets _ga.
 */

const ROOT = process.cwd();
const LAYOUT = readFileSync(join(ROOT, "src/app/layout.tsx"), "utf8");
const PRIVACY = readFileSync(join(ROOT, "src/app/privacy/page.tsx"), "utf8");

describe("analytics tags and their privacy disclosure stay in step", () => {
  it("mounts all three tools in the root layout", () => {
    expect(LAYOUT).toContain("analytics.ahrefs.com/analytics.js");
    expect(LAYOUT).toContain("<Analytics />"); // Vercel
    expect(LAYOUT).toContain("<GoogleAnalyticsGate />");
  });

  it("keeps the Ahrefs tag in <head> and async, which is what its verifier needs", () => {
    const head = LAYOUT.slice(LAYOUT.indexOf("<head>"), LAYOUT.indexOf("</head>"));
    expect(head).toContain("analytics.ahrefs.com/analytics.js");
    expect(head).toContain("async");
  });

  it("names every tool on the privacy page", () => {
    for (const name of ["Vercel Web Analytics", "Ahrefs Web Analytics", "Google Analytics"]) {
      expect(PRIVACY, `${name} is not disclosed on /privacy`).toContain(name);
    }
  });

  it("still tells the reader which tools set cookies and how to refuse them", () => {
    expect(PRIVACY).toMatch(/set no cookies/);
    expect(PRIVACY).toMatch(/does set cookies/);
    expect(PRIVACY).toMatch(/block all three/);
  });

  /* Extended 2026-08-22 (§8.25-e). The standing rule was written for
     measurement tags, but its reason is broader: a third party that touches a
     visitor and a sentence naming it ship together. Taking payments added three
     such parties at once, and they touch far more than a page view — a name, an
     email, a delivery address, a payment. If any of them is swapped out, this
     fails until /privacy is edited too. */
  it("names every processor that touches a parent's details", () => {
    for (const name of ["Razorpay", "Supabase", "Resend", "Vercel"]) {
      expect(PRIVACY, `${name} is not disclosed on /privacy`).toContain(name);
    }
  });

  it("says plainly that we never receive the payment details", () => {
    expect(PRIVACY).toMatch(/never to us|never see your payment/i);
    // and that Razorpay's own form sets cookies, which ours do not
    expect(PRIVACY).toMatch(/sets its own cookies/);
  });
});
