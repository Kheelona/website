import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { POSTHOG_PROXY_PATH } from "@/config/site";
import { CAMPAIGN_COOKIE } from "@/lib/campaign";
import { CLICK_ID_COOKIE } from "@/lib/click-id";

/**
 * The behavioural half of §8.39's trailing-slash story. `trailing-slash.test.ts`
 * proves the RULE; this proves `src/proxy.ts` actually applies it, which is the
 * part that would otherwise be a comment nobody checked.
 *
 * It drives the real exported `proxy` with a real NextRequest rather than
 * asserting on the file's text, because the question is what a browser gets
 * back, not what the source says.
 */
function request(url: string, host = "kheelona.com") {
  return new NextRequest(new URL(url, `https://${host}`), {
    headers: { host },
  });
}

describe("src/proxy.ts restores the trailing-slash redirect", () => {
  it("308s a marketing route with a trailing slash", () => {
    const response = proxy(request("https://kheelona.com/team/"));
    expect(response.status).toBe(308);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/team");
  });

  it("keeps the query string when it redirects", () => {
    const response = proxy(request("https://kheelona.com/products/kheelu/?utm_source=meta"));
    expect(response.status).toBe(308);
    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/products/kheelu");
    /* An untagged click is untagged forever (docs/utm-conventions.md), and ads
       are running. Dropping the query here would silently break attribution. */
    expect(location.search).toBe("?utm_source=meta");
  });

  it("does not redirect a route that has no trailing slash", () => {
    const response = proxy(request("https://kheelona.com/team"));
    expect(response.status).not.toBe(308);
  });

  it("leaves the PostHog ingestion path exactly as PostHog sends it", () => {
    const response = proxy(request(`https://kheelona.com${POSTHOG_PROXY_PATH}/e/`));
    expect(response.status).not.toBe(308);
  });

  /* The store host redirects the same way, because it is one app and a parent
     mid-checkout must not meet different routing from a parent reading a story. */
  it("308s on the store host too", () => {
    const response = proxy(request("https://store.kheelona.com/refund/", "store.kheelona.com"));
    expect(response.status).toBe(308);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/refund");
  });
});

/** REMEMBERING THE CAMPAIGN AT THE EDGE (§8.40-f, corrected 2026-09-20).
 *
 *  Set here rather than in client JavaScript because the proxy sees the tagged
 *  landing request itself: nothing has to load, nothing races hydration, and a
 *  visitor who blocks analytics is still attributed. The cookie is scoped to
 *  `.kheelona.com` so it is still sent when the same person reaches
 *  `store.kheelona.com`, which is the hop that was losing the campaign. */
describe("the proxy remembers which campaign a visit arrived on", () => {
  const cookieOf = (response: Response) => response.headers.get("set-cookie") ?? "";

  it("stores the campaign when someone lands on a tagged link", () => {
    const response = proxy(
      request("https://kheelona.com/?utm_source=meta&utm_campaign=2026-09-launch"),
    );
    const cookie = cookieOf(response);
    expect(cookie).toContain(`${CAMPAIGN_COOKIE}=`);
    expect(decodeURIComponent(cookie)).toContain("2026-09-launch");
  });

  /* The whole reason it is a cookie and not a query string: it has to be
     readable on the OTHER host. */
  it("scopes it to the whole domain so the store host receives it", () => {
    const cookie = cookieOf(proxy(request("https://kheelona.com/?utm_source=meta")));
    expect(cookie.toLowerCase()).toContain("domain=.kheelona.com");
  });

  /* Attribution data, never a credential, and nothing in the browser reads it.
     HttpOnly costs nothing here and keeps it off any script on the page. */
  it("is HttpOnly and SameSite=Lax, because only our server reads it", () => {
    const cookie = cookieOf(proxy(request("https://kheelona.com/?utm_source=meta"))).toLowerCase();
    expect(cookie).toContain("httponly");
    expect(cookie).toContain("samesite=lax");
  });

  it("sets nothing at all on an ordinary untagged page", () => {
    expect(cookieOf(proxy(request("https://kheelona.com/products/kheelu")))).not.toContain(
      CAMPAIGN_COOKIE,
    );
  });

  /* FIRST TOUCH WINS. A visitor who arrives on an Instagram ad, comes back a day
     later through a Google link and then orders should be credited to the visit
     that is ordering, not overwritten mid-journey by an internal link that
     happens to carry a tag. Overwriting on every tagged view would also let the
     last page before checkout claim the sale. */
  it("does not overwrite a campaign already remembered this visit", () => {
    const req = new NextRequest(new URL("https://kheelona.com/?utm_source=google"), {
      headers: {
        host: "kheelona.com",
        cookie: `${CAMPAIGN_COOKIE}=${encodeURIComponent(JSON.stringify({ utm_source: "meta" }))}`,
      },
    });
    expect(cookieOf(proxy(req))).not.toContain(CAMPAIGN_COOKIE);
  });

  /* A redirect must still carry it, or a tagged link to a trailing-slash URL
     loses the campaign on the way to its own canonical form. */
  it("still remembers it when the same request is being redirected", () => {
    const response = proxy(request("https://kheelona.com/team/?utm_source=meta"));
    expect(response.status).toBe(308);
    expect(cookieOf(response)).toContain(CAMPAIGN_COOKIE);
  });
});

/** REMEMBERING THE AD CLICK AT THE EDGE (§8.41, 2026-09-20).
 *
 *  Same pass and same reasoning as the campaign cookie above: the proxy sees the
 *  landing request itself, so nothing has to load, nothing races hydration, and
 *  a visitor whose browser blocks Meta's pixel is still attributed. That last
 *  case is the whole point — `_fbc` exists only if the pixel ran. */
describe("the proxy remembers the ad click a visit arrived on", () => {
  const cookieOf = (r: Response) => r.headers.get("set-cookie") ?? "";

  it("stores the click id when someone lands from an advertisement", () => {
    const cookie = cookieOf(proxy(request("https://kheelona.com/?fbclid=IwAR0abcDEF123")));
    expect(cookie).toContain(`${CLICK_ID_COOKIE}=`);
    expect(decodeURIComponent(cookie)).toContain("IwAR0abcDEF123");
  });

  /* 🔴 IT STORES THE RAW ID, NOT A BUILT fbc. If a reconstructed value ever
     appears in this cookie there are two things that look like an `fbc` and a
     rule about which wins, which is exactly what this design removes. */
  it("stores the raw click id and never a built fbc value", () => {
    const cookie = decodeURIComponent(cookieOf(proxy(request("https://kheelona.com/?fbclid=IwAR0abc"))));
    expect(cookie).not.toContain("fb.1.");
  });

  it("scopes it to the whole domain so the store host receives it", () => {
    const cookie = cookieOf(proxy(request("https://kheelona.com/?fbclid=IwAR0abc"))).toLowerCase();
    expect(cookie).toContain("domain=.kheelona.com");
    expect(cookie).toContain("httponly");
    expect(cookie).toContain("samesite=lax");
  });

  /* The control. Without it the test above proves very little. */
  it("sets nothing on an ordinary page with no click id", () => {
    expect(cookieOf(proxy(request("https://kheelona.com/products/kheelu")))).not.toContain(
      CLICK_ID_COOKIE,
    );
  });

  /* A malformed id must produce NOTHING rather than a best effort: Meta accepts
     a broken fbc with a 200 and silently matches nobody. */
  it("sets nothing when the click id is not the shape of one", () => {
    expect(cookieOf(proxy(request("https://kheelona.com/?fbclid=has%20spaces")))).not.toContain(
      CLICK_ID_COOKIE,
    );
  });

  /* First touch wins, as with the campaign: the visit that is ordering keeps
     the click that started it, not whichever ad was clicked most recently. */
  it("does not overwrite a click already remembered this visit", () => {
    const req = new NextRequest(new URL("https://kheelona.com/?fbclid=second"), {
      headers: {
        host: "kheelona.com",
        cookie: `${CLICK_ID_COOKIE}=${encodeURIComponent(JSON.stringify({ id: "first", ts: 1 }))}`,
      },
    });
    expect(cookieOf(proxy(req))).not.toContain(CLICK_ID_COOKIE);
  });

  /* An ad link to a trailing-slash URL must not lose its click on the way to
     the canonical form. */
  it("still remembers it when the request is being redirected", () => {
    const response = proxy(request("https://kheelona.com/team/?fbclid=IwAR0abc"));
    expect(response.status).toBe(308);
    expect(cookieOf(response)).toContain(CLICK_ID_COOKIE);
  });
});
