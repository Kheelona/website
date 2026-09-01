import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Four measurement tools now run on this site, and each one carries a promise
 * on /privacy about whether it sets cookies. The standing rule from
 * website-steps §8.21-c is that a tool and the sentence describing it ship
 * together, so this guards the pairing: if someone adds or removes a tag
 * without touching the privacy page, this fails.
 *
 * Cookie behaviour below was OBSERVED in a browser on a clean load, not copied
 * from a vendor's marketing page: Vercel and Ahrefs set nothing, GA4 sets _ga.
 * The Meta Pixel (2026-09-01) sets _fbp, and is the first tool here that
 * follows a visitor to other sites, which is why the tests below check that
 * /privacy says so in those words rather than merely naming it.
 */

const ROOT = process.cwd();
const LAYOUT = readFileSync(join(ROOT, "src/app/layout.tsx"), "utf8");
const PRIVACY = readFileSync(join(ROOT, "src/app/(site)/privacy/page.tsx"), "utf8");

describe("analytics tags and their privacy disclosure stay in step", () => {
  it("mounts all four tools in the root layout", () => {
    expect(LAYOUT).toContain("analytics.ahrefs.com/analytics.js");
    expect(LAYOUT).toContain("<Analytics />"); // Vercel
    expect(LAYOUT).toContain("<GoogleAnalyticsGate />");
    expect(LAYOUT).toContain("<MetaPixel />");
  });

  it("keeps the Ahrefs tag in <head> and async, which is what its verifier needs", () => {
    const head = LAYOUT.slice(LAYOUT.indexOf("<head>"), LAYOUT.indexOf("</head>"));
    expect(head).toContain("analytics.ahrefs.com/analytics.js");
    expect(head).toContain("async");
  });

  it("names every tool on the privacy page", () => {
    for (const name of [
      "Vercel Web Analytics",
      "Ahrefs Web Analytics",
      "Google Analytics",
      "Meta Pixel",
    ]) {
      expect(PRIVACY, `${name} is not disclosed on /privacy`).toContain(name);
    }
  });

  it("still tells the reader which tools set cookies and how to refuse them", () => {
    expect(PRIVACY).toMatch(/set no cookies/);
    expect(PRIVACY).toMatch(/does set cookies/);
    expect(PRIVACY).toMatch(/block all four/);
  });

  /* The Meta Pixel is the first tool here that exists to advertise to the
     visitor afterwards, so naming it is not enough. These three sentences are
     the disclosure, and losing any of them while keeping the tag would leave
     the page claiming something milder than what runs. */
  it("says plainly that the pixel follows you and is used to advertise", () => {
    expect(PRIVACY).toMatch(/follow you to other sites/);
    expect(PRIVACY).toMatch(/Facebook or Instagram/);
    expect(PRIVACY).toMatch(/advertise on Facebook and Instagram/);
  });

  /* The old page promised the opposite of all this in two other sections. If
     either sentence is ever restored while the pixel is mounted, the page is
     lying again, so both are pinned as banned. */
  it("no longer carries the blanket promises the pixel made untrue", () => {
    expect(PRIVACY).not.toContain("none of it is used to advertise to you");
    expect(PRIVACY).not.toContain("We do not run ads with it");
    expect(PRIVACY).not.toContain("Three tools do it");
  });

  /* THE CONVERSIONS API SENDS HASHED CONTACT DETAILS (§8.30-l), and that broke
     the page a second time on 2026-09-02: it had promised that no tool is ever
     sent a name, phone number or email, which stopped being true the day the
     server-side Purchase shipped. The founder chose to keep the matching and
     disclose it (option B).

     So this is the pairing rule applied to a payload rather than to a tag: if
     meta-capi.ts sends em, ph or fn, /privacy has to say so. Losing the
     disclosure while keeping the code is the failure mode, and it is silent. */
  it("discloses the hashed contact details the Conversions API sends", () => {
    const capi = readFileSync(join(ROOT, "src/lib/store/meta-capi.ts"), "utf8");
    const sendsIdentifiers =
      capi.includes("user_data.em") || capi.includes("user_data.ph") || capi.includes("user_data.fn");

    if (sendsIdentifiers) {
      expect(PRIVACY, "CAPI sends hashed contact details but /privacy does not disclose it")
        .toMatch(/one-way code/);
      expect(PRIVACY).toMatch(/never in readable form/);
    }
  });

  it("no longer claims nothing is ever sent, which the Conversions API made untrue", () => {
    expect(PRIVACY).not.toContain("None of them is ever sent your name");
    expect(PRIVACY).not.toContain("It works from your visit to this website, not from your order details");
    expect(PRIVACY).not.toContain("None of these fields is ever sent to an advertiser");
  });

  /* OUR SERVER STAYS NARROW EVEN THOUGH META'S SCRIPT DOES NOT (founder decision
     2026-09-02, §8.30-o). Automatic Advanced Matching is deliberately left ON,
     and it scrapes whatever form fields Meta's own script recognises, which on
     /thanks includes the city, state and pincode of a delivery address. That is
     why /privacy no longer promises the address is never sent: it could not
     honestly.

     What we still control absolutely is our OWN Conversions API payload, and it
     sends email, phone and first name and nothing else. These two assertions
     keep it that way. They are not about the wording any more, they are about
     never widening the one half of this we decide. */
  it("keeps our own server payload narrow: no address, no child's age", () => {
    const capi = readFileSync(join(ROOT, "src/lib/store/meta-capi.ts"), "utf8");
    expect(capi, "the child's age must never be put in OUR payload").not.toMatch(/child_age/);
    expect(capi, "the delivery address must never be put in OUR payload").not.toMatch(/order\.address/);
  });

  /* The page must not claim something Automatic Advanced Matching can falsify.
     These two sentences were true until AAM was left on, and restoring either
     would put a false promise back on a page a parent reads before paying. */
  it("no longer promises what AAM can contradict", () => {
    expect(PRIVACY).not.toContain("delivery address is never sent");
    expect(PRIVACY).not.toContain("Nothing about your child is ever sent");
  });

  /* Category-level wording is a legitimate drafting choice; silence is not.
     Whatever the fields, the page has to say that form details can reach Meta
     and that Meta's script decides which. */
  it("still discloses that form details can reach Meta, and who decides which", () => {
    expect(PRIVACY).toMatch(/details you enter can be included/);
    expect(PRIVACY).toMatch(/determined by Meta's own measurement script/);
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
