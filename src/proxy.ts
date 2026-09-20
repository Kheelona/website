import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeForHost, isStoreHost } from "@/lib/store/host";
import { isIndexableHost } from "@/config/site";
import { THANKS_COOKIE, THANKS_COOKIE_MAX_AGE_SECONDS } from "@/lib/store/thanks-session";
import { trailingSlashRedirectPath } from "@/lib/trailing-slash";
import { CAMPAIGN_COOKIE, campaignFromUrl, readCampaignCookie } from "@/lib/campaign";
import { CLICK_ID_COOKIE, clickIdFromUrl, readClickIdCookie } from "@/lib/click-id";

/** Host routing (§8.25-a).
 *
 *  Next 16 renamed middleware to `proxy.ts`; the file is otherwise the same one
 *  file per project, at the same level as `app`
 *  (node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md).
 *
 *  All the decisions live in `lib/store/host.ts` as a pure function, so they are
 *  unit tested rather than verified by deploying and clicking. This file is the
 *  adapter, plus one header the pure function cannot set.
 *
 *  That header: the store is `noindex`. It is a transactional endpoint, not a
 *  content property, and letting it into the index would put a thin checkout page
 *  in competition with /products/kheelu, which is the page a year of SEO work went
 *  into. The store's job is to convert traffic the marketing site already earned. */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname, search } = request.nextUrl;

  /* The trailing-slash redirect Next is no longer doing for us (2026-09-20,
     §8.39). `next.config.ts` sets `skipTrailingSlashRedirect` so PostHog keeps
     the trailing slashes it ingests on, and that flag is site-wide, so this
     puts the behaviour back for every path except the proxied ones. Without it
     `/team/` and `/team` would both answer 200 and one page would have two
     URLs.

     FIRST, before any host rule: a redirect that then had to be re-resolved
     through `routeForHost` would be two round trips where one will do, and the
     303 claim below sets a cookie scoped to an exact path. */
  /* Remember which advertisement paid for this visit (§8.40-f, 2026-09-20).
     Applied to whatever response this function ends up returning, including a
     redirect, because a tagged link to a trailing-slash URL would otherwise lose
     its campaign on the way to its own canonical form. */
  const remember = campaignToRemember(request);
  /* And which advertisement it was clicked from (§8.41), kept separately
     because it answers a different question and has a different lifetime. */
  const rememberClick = clickToRemember(request);

  const stripped = trailingSlashRedirectPath(pathname);
  if (stripped) {
    return rememberClick(
      remember(NextResponse.redirect(new URL(`${stripped}${search}`, request.url), 308)),
    );
  }

  const route = routeForHost(host, pathname, search);

  if (route.kind === "redirect") {
    return NextResponse.redirect(route.url, 308);
  }

  if (route.kind === "claim") {
    /* The confirmation credential moves from the URL into an HttpOnly cookie
       and the browser lands on a clean path, so no page that carries analytics
       ever sees the token (F-01, thanks-session.ts).

       303 and never a permanent code: this response is one customer's cookie,
       and a cached redirect handing it to the next customer would be far worse
       than the leak it fixes. The no-store header says so out loud as well. */
    const response = NextResponse.redirect(new URL(route.path, request.url), 303);
    response.cookies.set(THANKS_COOKIE, route.session, {
      httpOnly: true,
      /* Secure unless the host is literally a localhost one, which is the only
         place this app is ever served over http. Deliberately not derived from
         the request protocol: behind a platform proxy that is an inference, and
         a security attribute on a payment flow should not rest on one. */
      secure: !host.split(":")[0].toLowerCase().endsWith("localhost"),
      sameSite: "lax",
      path: route.path,
      maxAge: THANKS_COOKIE_MAX_AGE_SECONDS,
    });
    response.headers.set("cache-control", "private, no-store");
    return response;
  }

  if (route.kind === "rewrite") {
    /* No status override here, deliberately, and it cost a deploy to learn
       (§8.34-f). `NextResponse.rewrite(url, { status: 404 })` works under
       `next start` — 404 AND the rewritten page — but on Vercel the edge sees
       the 4xx, discards the destination and serves its own /404, which on the
       store host is the MARKETING 404. So the store's dead ends render at 200
       and wear the right chrome, which is the half that a person notices. */
    const response = NextResponse.rewrite(new URL(route.path, request.url));
    response.headers.set("x-robots-tag", "noindex, nofollow");
    return rememberClick(remember(response));
  }

  /* Marketing routes on the canonical hosts pass through untouched. Anything
     else serving this same app — the Vercel preview branch, a *.vercel.app
     deployment URL, a local prod check — is a byte-identical duplicate of a
     live commercial site, so it says noindex on the way out (2026-09-05).

     A header rather than a <meta> tag on purpose: this app serves static,
     prerendered and dynamic routes, and only a header covers all three from one
     place without threading the request host into every page's metadata. */
  const response = NextResponse.next();
  if (!isIndexableHost(host)) {
    response.headers.set("x-robots-tag", "noindex, nofollow");
  }
  return rememberClick(remember(response));
}

/** Decide once whether this visit's AD CLICK needs storing (§8.41, 2026-09-20).
 *
 *  Meta's `fbc` reaches the Conversions API only if Meta's own pixel set the
 *  `_fbc` cookie, so a browser that blocks the pixel loses the click id and the
 *  conversion matches worse — which is what Events Manager reports as "low
 *  coverage of fbc". Captured HERE rather than in client JavaScript because the
 *  proxy sees the landing request itself: nothing has to load, and the visitor
 *  who blocked the pixel is exactly the one this is for.
 *
 *  🔴 WHAT GOES IN THE COOKIE IS THE RAW `fbclid`, NEVER A BUILT `fbc`
 *  (see lib/click-id.ts). Storing a rebuilt value would leave two things that
 *  both look like an `fbc` and a rule about which one wins; this way there is
 *  one builder, called only when Meta's cookie is absent.
 *
 *  FIRST TOUCH WINS, as with the campaign: the visit that is ordering keeps the
 *  click that started it, not whichever ad was clicked most recently. */
function clickToRemember(request: NextRequest) {
  const click = clickIdFromUrl(request.nextUrl, Date.now());
  if (!click || readClickIdCookie(request)) return (r: NextResponse) => r;

  return (response: NextResponse) => {
    response.cookies.set(CLICK_ID_COOKIE, JSON.stringify(click), {
      /* Only `create-order` reads it, server-side. Nothing in the browser needs
         it, and Meta's own `_fbc` is a separate cookie we never touch. */
      httpOnly: true,
      domain: ".kheelona.com",
      secure: true,
      sameSite: "lax",
      path: "/",
      /* Session-scoped, matching the campaign cookie: attribution for THIS
         visit is what the order needs. */
    });
    return response;
  };
}

/** Decide once whether this visit's campaign needs storing, and hand back the
 *  function that writes it onto whichever response we return (§8.40-f).
 *
 *  WHY THE EDGE AND NOT THE BROWSER. The proxy sees the tagged landing request
 *  itself, so nothing has to load, nothing races hydration, and a visitor who
 *  blocks analytics is still attributed. The alternative this replaces read the
 *  campaign back out of PostHog's session and did not work at all: PostHog keeps
 *  the entry URL in `$client_session_props` and derives `utm_*` from it only
 *  when building event properties, while `getSessionProperty()` reads a bucket
 *  that never holds campaign data. Found by dumping real browser storage on
 *  production, after tests that mocked the getter had passed (§8.38-i).
 *
 *  FIRST TOUCH WINS. An existing cookie is never overwritten: a visitor who
 *  arrives on one ad and later follows another tagged link should be credited to
 *  the visit that is actually ordering, and never to whichever page happened to
 *  be last before checkout. */
function campaignToRemember(request: NextRequest) {
  const campaign = campaignFromUrl(request.nextUrl);
  if (!campaign || readCampaignCookie(request)) return (r: NextResponse) => r;

  return (response: NextResponse) => {
    response.cookies.set(CAMPAIGN_COOKIE, JSON.stringify(campaign), {
      /* Nothing in the browser reads this; only create-order does, server-side.
         It is attribution and never a credential, but HttpOnly costs nothing
         and keeps it away from every script on the page. */
      httpOnly: true,
      /* The point of the whole mechanism: readable on store.kheelona.com, where
         the order is actually placed and where the URL carries no campaign. */
      domain: ".kheelona.com",
      secure: true,
      sameSite: "lax",
      path: "/",
      /* Session-scoped, deliberately. Attribution for THIS visit is what the
         order needs, and a dated cookie would be a longer-lived tracker than
         the job requires. */
    });
    return response;
  };
}

export const config = {
  /* Everything except Next's own assets, the API (same handlers serve both
     hosts, and the store's fetches are same-origin either way), and any path
     with a dot in it, which is a file: /favicon.ico, /og.png, /llms.txt.
     Rewriting a file request would break the very assets the store renders.

     `ingest/` and `ingest-assets/` join that list on 2026-09-20 (§8.39): they
     are the PostHog reverse proxy, forwarded by a rewrite in `next.config.ts`,
     and they are the highest-volume paths on the site. Excluding them keeps
     every analytics beacon from waking this function, and it stops the store
     host's rule turning `/ingest/e/` into `/store/ingest/e/`.

     🔴 THIS LIST IS A LITERAL AND CANNOT IMPORT THE CONSTANTS — Next requires a
     statically analysable matcher. `test/posthog-proxy.test.ts` closes that gap
     by running this very regex against the real request paths, derived from the
     constants, so the two cannot drift apart silently (§8.38-i). */
  matcher: ["/((?!_next/|api/|ingest/|ingest-assets/|.*\\..*).*)"],
};

/** Re-exported for the guard test, which asserts the store host never reaches a
 *  marketing route and the apex never serves a store one. */
export { isStoreHost };
