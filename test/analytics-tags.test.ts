import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { purchasePayload } from "@/lib/store/meta-capi";
import { replayAllowedOnPath } from "@/config/site";
import type { PreorderRow } from "@/lib/store/db";

/**
 * Five measurement tools now run on this site, and each one carries a promise
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
 *
 * PostHog (2026-09-19) sets a FIRST-PARTY cookie on our own domain and does not
 * follow anyone between sites, so on that axis it is milder than the pixel. It
 * is the widest tool here on a different axis: autocapture records every tap,
 * session replay records the screen, and error tracking reports exceptions. The
 * assertions below therefore pin what it does on THIS site, and in particular
 * the three promises a parent could actually act on — typed values masked, the
 * confirmation page never recorded, data held in the United States.
 */

const ROOT = process.cwd();
const LAYOUT = readFileSync(join(ROOT, "src/app/layout.tsx"), "utf8");
const PRIVACY = readFileSync(join(ROOT, "src/app/(site)/privacy/page.tsx"), "utf8");

/** A fully populated order, so the key allow-list sees every field the payload
 *  can carry. A sparser fixture would let a new key hide behind an absent
 *  value. */
const SAMPLE_ORDER = {
  id: 1,
  order_ref: "KH-A2B3-C4D5",
  tier: "launch",
  amount_paise: 49_900,
  status: "paid",
  parent_name: "Test Parent",
  phone: "+919187546483",
  email: "parent@example.com",
  child_age: "4",
  wa_consent: true,
  terms_accepted_at: null,
  address: { line1: "1 Road", line2: "", city: "Bengaluru", state: "KA", pincode: "560041" },
  rzp_order_id: "order_x",
  rzp_payment_id: "pay_x",
  balance_status: "due",
  utm: null,
  fb_attrib: { fbp: "fb.1.1.1", fbc: "fb.1.1.CLICK", ip: "203.0.113.9", ua: "UA/1" },
  created_at: "2026-09-02T00:00:00.000Z",
  paid_at: "2026-09-02T10:00:00.000Z",
} as PreorderRow;

describe("analytics tags and their privacy disclosure stay in step", () => {
  it("mounts all five tools in the root layout", () => {
    expect(LAYOUT).toContain("analytics.ahrefs.com/analytics.js");
    expect(LAYOUT).toContain("<Analytics />"); // Vercel
    expect(LAYOUT).toContain("<GoogleAnalyticsGate />");
    expect(LAYOUT).toContain("<MetaPixel />");
    expect(LAYOUT).toContain("<PostHogGate />");
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
      "PostHog",
    ]) {
      expect(PRIVACY, `${name} is not disclosed on /privacy`).toContain(name);
    }
  });

  it("still tells the reader which tools set cookies and how to refuse them", () => {
    expect(PRIVACY).toMatch(/set no cookies/);
    /* Conjugation-tolerant since 2026-09-19. This pinned the literal "does set
       cookies", which broke the moment PostHog joined GA4 and the sentence
       became "Google Analytics and PostHog DO set cookies" — a test failing on
       a verb agreement while the disclosure it guards got strictly better. What
       matters is that the page still separates the tools that set cookies from
       the ones that do not, so that is what is asserted. */
    expect(PRIVACY).toMatch(/\bdo(es)? set cookies\b/);
    /* Was `block all four` until 2026-09-02. That sentence became false the day
       the Conversions API shipped, because the server half is sent by us and no
       ad blocker can reach it. The refusal advice must still be here, but it may
       not overstate what refusing achieves. */
    /* DE-COUNTED 2026-09-19 with PostHog. This pinned "the three that only run
       in your browser", which stopped being true the moment a fourth
       browser-only tool shipped — so the suite would have enforced a false
       sentence, exactly the failure the 2026-09-02 correction was about. Both
       retired counts are banned below. */
    /* 🔴 RETIRED 2026-09-20 BY THE REVERSE PROXY (§8.39), and this is the third
       time this one sentence has been falsified by our own deploy. "The tools
       that only run in your browser" included PostHog, and PostHog now reports
       through kheelona.com/ingest — first-party requests an ad blocker cannot
       tell apart from the site itself. Defeating the blocker is the POINT of a
       reverse proxy, so the sentence had to move rather than be softened. */
    expect(PRIVACY).toMatch(/your browser can block the tools that load from another company/);
  });

  /* THE OPT-OUT MUST NOT OVERSTATE ITSELF (§8.30-r). Telling a parent to install
     an ad blocker and letting them believe nothing reached Meta is the single
     worst thing this page could do, because they would act on it and be wrong.
     The page has to name the gap. */
  it("admits that blocking cannot stop the server-side report", () => {
    expect(PRIVACY).toMatch(/sent by us, not by your browser, so blocking cannot prevent it/);
    expect(PRIVACY).not.toContain("your browser can block all four");
    expect(PRIVACY).not.toContain("block the three that only run in your browser");
    /* Nor may the fix be to bump the number: the next tool would falsify it
       again, silently, with a test holding it in place. */
    expect(PRIVACY).not.toMatch(/block the (one|two|three|four|five|six) that only run/);
    /* Retired 2026-09-20: true until PostHog started reporting first-party. */
    expect(PRIVACY).not.toContain("the tools that only run in your browser");
  });

  /* 🔴 THE PROXY IS A PRIVACY FACT, NOT A PLUMBING DETAIL (§8.39, §8.21-c).
     Routing PostHog through our own domain exists to stop an ad blocker
     dropping its requests, and PostHog is the tool that FILMS A PARENT'S
     SCREEN. A page that offered blocking as the remedy has to say that the
     remedy no longer reaches this one. The founder chose to state it plainly
     rather than leave it implied (2026-09-20). */
  it("admits that an ad blocker no longer reaches PostHog", () => {
    expect(PRIVACY).toMatch(/PostHog now reports through our own address/);
    expect(PRIVACY).toMatch(/an ad blocker usually cannot tell its requests apart/);
  });

  /* THE GAPS ARE NO LONGER COUNTED (§8.38-g, third occurrence). The page said
     "the one gap" while the server-side Meta report was the only one. The proxy
     made that a second gap, so a test pinning the word "one" would have gone on
     enforcing a false sentence — the exact failure of 2026-09-02 and 2026-09-19.
     A category is honest at any number; a count expires on the next change. */
  it("names the gaps without counting them", () => {
    expect(PRIVACY).toMatch(/Be aware of the gaps/);
    expect(PRIVACY).not.toContain("Be aware of the one gap");
    expect(PRIVACY).not.toMatch(/the (one|two|three|four) gaps?,/);
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
    /* UNCONDITIONAL SINCE 2026-09-02. This assertion used to sit behind
       `if (sendsIdentifiers)`, where that flag was a GREP OF THE SOURCE IT
       GUARDS for the literals `user_data.em` / `.ph` / `.fn`. Rewriting
       meta-capi.ts to `Object.assign(user_data, { em, ph, fn })` would have
       disabled the guard silently: zero assertions, green test, disclosure
       requirement gone. A guard whose trigger is a string match on the code it
       guards fails OPEN, which is the worst way for a guard to fail. The
       payload check below now establishes that identifiers are sent, and the
       disclosure is required no matter how the code is spelled. */
    expect(PRIVACY, "CAPI sends hashed contact details but /privacy does not disclose it")
      .toMatch(/one-way code/);
    expect(PRIVACY).toMatch(/never in readable form/);
  });

  /* BEHAVIOUR, NOT SPELLING. Asserted against the payload the code actually
     builds, as a KEY ALLOW-LIST rather than a search for values.
     Why a key list and not a value search: every identifier is hashed on the
     way in, so a future mistake would look exactly like the correct code
     (`user_data.db = hashed(order.child_age)`), and a check for the raw age or
     a raw address would sail straight past a SHA-256. A key list catches a
     hashed addition, a plaintext addition, and a widening of custom_data. */
  it("sends Meta these fields and no others", () => {
    const payload = purchasePayload(SAMPLE_ORDER, "TOKEN");
    const event = payload.data[0] as Record<string, unknown>;

    expect(Object.keys(event.user_data as object).sort()).toEqual([
      "client_ip_address",
      "client_user_agent",
      "em",
      "fbc",
      "fbp",
      "fn",
      "ph",
    ]);
    expect(Object.keys(event.custom_data as object).sort()).toEqual([
      "content_category",
      "currency",
      "order_id",
      "value",
    ]);
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
    /* Kept as a SOURCE grep deliberately, alongside the key allow-list above.
       The two catch different mistakes: the allow-list catches a new key, and
       this catches somebody reading `order.child_age` or `order.address` at all
       inside the Meta module, which is the step before it becomes a key. */
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
    /* The old assertion pinned "determined by Meta's own measurement script
       rather than chosen by us field by field", which is true of the browser
       script and FALSE of our server, which picks seven fields by name. The
       suite was enforcing a false claim about our own code. The page now states
       the two halves separately, and this pins both. */
    expect(PRIVACY).toMatch(/Meta's script in your browser reads what it recognises/);
    expect(PRIVACY).toMatch(/Our own server separately sends a small, fixed set/);
  });

  /* The IP and the user agent are the only things that leave in READABLE form,
     and they are personal data under DPDP. The page must say so, not merely
     avoid denying it. */
  /* WITHOUT COUNTING THEM. The first version of this asserted the page called
     the network address and the browser "the two" readable fields, which was
     wrong — `fbp` and `fbc` go verbatim as well — and pinning a count meant the
     suite enforced the error, which is the exact failure this file exists to
     prevent. The page names the categories; the key allow-list above is what
     pins the payload. A number in the copy is a review flag. */
  it("discloses the fields that are NOT hashed, without stating a count", () => {
    expect(PRIVACY).toMatch(/your network address/);
    expect(PRIVACY).toMatch(/identifiers already stored in Meta's own cookie/);
    expect(PRIVACY).toMatch(/Those last ones are not coded/);
    expect(PRIVACY).not.toContain("which are the two it needs in readable form");
  });

  /* Every unhashed key in the payload must be describable from the page. If a
     new raw field is added, this fails and points at the sentence to update. */
  it("the page accounts for every field the payload sends unhashed", () => {
    const ud = (purchasePayload(SAMPLE_ORDER, "TOKEN").data[0] as Record<string, unknown>)
      .user_data as Record<string, string>;
    const unhashed = Object.keys(ud).filter((k) => !["em", "ph", "fn"].includes(k));
    expect(unhashed.sort()).toEqual(["client_ip_address", "client_user_agent", "fbc", "fbp"]);
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

  /* POSTHOG'S THREE ACTIONABLE PROMISES (§8.38). A parent reading this page can
     do nothing about most of what it describes, but these three are concrete
     claims about our own configuration, and each one is a thing we could break
     in a single line without noticing. They are pinned here for the same reason
     the Meta disclosures above are: the tag and the sentence ship together, and
     the silent failure is keeping the tag while losing the sentence. */
  it("states what PostHog records on this site, in the specific", () => {
    expect(PRIVACY).toMatch(/which buttons and links you tap/);
    expect(PRIVACY).toMatch(/replay of your screen/);
  });

  it("promises typed values are masked before the recording leaves the browser", () => {
    expect(PRIVACY).toMatch(/hidden before the recording leaves your browser/);
    expect(PRIVACY).toMatch(/never what you put in it/);
  });

  /* THE STRONGEST PROMISE ON THE PAGE, because it is the one enforced by data
     rather than by care: POSTHOG_REPLAY_DENY_PATHS, checked by a pure predicate
     that PostHogGate.test.tsx exercises directly. If the deny list is ever
     emptied, that test fails too — but this one fails first and points at the
     sentence that would have become a lie. */
  it("promises the confirmation page is never recorded, and means it", () => {
    expect(PRIVACY).toMatch(/switch recording off completely on the order confirmation page/);
    expect(
      replayAllowedOnPath("/store/thanks"),
      "/privacy promises the confirmation page is not recorded, but the deny list no longer stops it",
    ).toBe(false);
  });

  it("says where PostHog holds what it collects", () => {
    expect(PRIVACY).toMatch(/servers in the United States/);
  });

  /* PostHog is first-party and is not an advertising tool, and the page says
     so. If that ever changes — an ad integration, a reverse proxy sharing
     identity, a cross-domain cookie — these two sentences become false and must
     be rewritten rather than left standing. */
  it("does not overstate PostHog's reach, and does not understate it either", () => {
    expect(PRIVACY).toMatch(/It does not follow you to other sites, and it is never used to advertise to you/);
    /* ...but it must not be filed away as harmless either. The page has to say
       it is the most detailed of the five. */
    expect(PRIVACY).toMatch(/most detailed of the five/);
  });

  /* 🔴 STITCHING IS A PRIVACY CHANGE, NOT A SCHEMA ONE (§8.40, founder
     2026-09-20). Storing PostHog's device id on the order row puts an analytics
     identifier next to a parent's name, email and phone in OUR database, which
     is a thing they can only know if the page says it. The 2026-09-19 round
     chose anonymity deliberately; the founder reversed that with the cost in
     view, so the page has to carry the reversal.

     Note what is NOT claimed: no person profile is created, and the page must
     not imply one is. `$process_person_profile: false` on the server event is
     what makes that sentence true, and posthog-server.test.ts pins it. */
  it("admits that an order is stored with the analytics identifier", () => {
    expect(PRIVACY).toMatch(/identifier PostHog has already given your browser/);
    expect(PRIVACY).toMatch(/identifier for a browser, not a profile of a person/);
  });

  /* 🔴 A COOKIE OF OUR OWN, ADDED 2026-09-20 (§8.40-f). `kh_utm` is set by
     src/proxy.ts when somebody lands on a tagged link and is read back when they
     order, which is how a sale is credited to the advertisement that produced
     it. It is first-party and session-scoped, and it is still a cookie this site
     sets about a visitor, so the page says so rather than leaving it to be found
     in devtools. */
  it("says we remember which advertisement brought you", () => {
    expect(PRIVACY).toMatch(/we remember which advertisement brought you/);
    expect(PRIVACY).toMatch(/only for as long as your visit lasts/);
  });

  /* The reason must be stated too. "We store an id" invites the question this
     sentence should answer without being asked. */
  it("says why it is stored, in the plainest terms", () => {
    expect(PRIVACY).toMatch(/whether our advertising is worth what it costs/);
  });

  it("says plainly that we never receive the payment details", () => {
    expect(PRIVACY).toMatch(/never to us|never see your payment/i);
    // and that Razorpay's own form sets cookies, which ours do not
    expect(PRIVACY).toMatch(/sets its own cookies/);
  });
});
