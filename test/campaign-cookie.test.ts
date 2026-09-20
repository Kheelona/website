import { describe, expect, it } from "vitest";
import { CAMPAIGN_COOKIE, campaignFromUrl, readCampaignCookie } from "@/lib/campaign";

/**
 * 🔴 WHY THIS EXISTS, AND WHY THE FIRST ATTEMPT DID NOT (§8.40-f, corrected
 * 2026-09-20 after a production check).
 *
 * Ads tag `kheelona.com`; the pre-order form runs on `store.kheelona.com` and
 * the CTA between them carries no query string, so `window.location.search` was
 * empty at order time and every tagged click recorded `utm = null`.
 *
 * The first fix read the campaign back out of PostHog's session. It does not
 * work: PostHog stores the session's ENTRY URL as `$client_session_props.props.u`
 * and derives `utm_*` from it only when building event properties, while
 * `getSessionProperty()` reads `sessionPersistence.props`, which never holds
 * campaign data at all. The unit tests passed because they MOCKED
 * `getSessionProperty` and so restated the same wrong assumption the code made
 * (§8.38-i). Caught by dumping real browser storage on production.
 *
 * This is the mechanism that does work, and it is the one this repo already
 * trusts: a first-party cookie on `.kheelona.com`, set by the proxy and read
 * server-side, exactly as `readFbAttrib` reads `_fbp`/`_fbc`.
 */
describe("campaignFromUrl", () => {
  it("takes the five standard keys and nothing else", () => {
    const url = new URL("https://kheelona.com/?utm_source=meta&utm_campaign=2026-09-launch&fbclid=x");
    expect(campaignFromUrl(url)).toEqual({ utm_source: "meta", utm_campaign: "2026-09-launch" });
  });

  it("is null when the URL carries no campaign, so nothing is set", () => {
    expect(campaignFromUrl(new URL("https://kheelona.com/products/kheelu"))).toBeNull();
  });

  /* A cookie is written from this, so a hostile query string must not become a
     hostile cookie. Same reasoning as readUtm's 120-char cap on the server. */
  it("caps a long value rather than storing whatever arrives", () => {
    const url = new URL(`https://kheelona.com/?utm_source=${"x".repeat(400)}`);
    expect(campaignFromUrl(url)!.utm_source.length).toBeLessThanOrEqual(120);
  });

  it("ignores an empty value", () => {
    expect(campaignFromUrl(new URL("https://kheelona.com/?utm_source=&utm_medium=email"))).toEqual({
      utm_medium: "email",
    });
  });
});

describe("readCampaignCookie", () => {
  const withCookie = (value: string) =>
    new Request("https://store.kheelona.com/api/preorder/create-order", {
      headers: { cookie: `${CAMPAIGN_COOKIE}=${encodeURIComponent(value)}` },
    });

  /* THE WHOLE POINT: this request is on the STORE host with a clean URL, and the
     campaign still arrives, because the cookie was set on `.kheelona.com` two
     pages earlier. */
  it("recovers the campaign on the store host from a cookie set on the apex", () => {
    const req = withCookie(JSON.stringify({ utm_source: "meta", utm_campaign: "2026-09-launch" }));
    expect(readCampaignCookie(req)).toEqual({ utm_source: "meta", utm_campaign: "2026-09-launch" });
  });

  it("is null when there is no cookie at all", () => {
    expect(readCampaignCookie(new Request("https://store.kheelona.com/"))).toBeNull();
  });

  /* A cookie is client-suppliable, so it is validated exactly as hard as the
     request body already is. It must never be able to widen an order row. */
  it("refuses anything that is not our five keys", () => {
    expect(readCampaignCookie(withCookie(JSON.stringify({ evil: "x", utm_source: "meta" })))).toEqual({
      utm_source: "meta",
    });
    expect(readCampaignCookie(withCookie("not json at all"))).toBeNull();
    expect(readCampaignCookie(withCookie(JSON.stringify(["array"])))).toBeNull();
    expect(readCampaignCookie(withCookie(JSON.stringify({ utm_source: 42 })))).toBeNull();
  });

  it("caps a value a client tampered with", () => {
    const req = withCookie(JSON.stringify({ utm_source: "y".repeat(400) }));
    expect(readCampaignCookie(req)!.utm_source.length).toBeLessThanOrEqual(120);
  });
});
