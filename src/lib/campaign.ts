/** Which advertisement paid for this order (§8.40-f, corrected 2026-09-20).
 *
 *  🔴 THE PROBLEM, AND THE FIRST FIX THAT DID NOT WORK.
 *
 *  Ads tag `kheelona.com`. The pre-order form runs on `store.kheelona.com`, and
 *  the CTA between them carries no query string, so `window.location.search` was
 *  empty by the time anyone ordered: every tagged click recorded `utm = null`
 *  and the internal alert email said "direct". That is why "do the ads work?"
 *  could not be answered.
 *
 *  The first attempt read the campaign back out of PostHog's own session, on the
 *  reasoning that its cookie is set on `.kheelona.com` and so already survives
 *  the hop. The reasoning was right and the API was wrong: PostHog stores the
 *  session's ENTRY URL as `$client_session_props.props.u` and derives `utm_*`
 *  from it only when it builds event properties, whereas `getSessionProperty()`
 *  reads `sessionPersistence.props`, which never holds campaign data at all. The
 *  unit tests passed because they mocked `getSessionProperty` and so asserted
 *  the same wrong assumption the code was making — §8.38-i, one round later.
 *  Found by dumping real browser storage on production.
 *
 *  SO: OUR OWN COOKIE, which is the mechanism this repo already trusts for
 *  exactly this shape of problem. `readFbAttrib` reads `_fbp`/`_fbc` off the
 *  request in `create-order`; this is the same move for the same reason.
 *
 *  Set by `src/proxy.ts` rather than by client JavaScript, because the proxy
 *  sees the tagged landing request itself: no script has to load, nothing races
 *  hydration, and a visitor who blocks analytics still gets attributed. */

export const CAMPAIGN_COOKIE = "kh_utm";

/** Every field a campaign may carry, and the ONE list the whole repo reads.
 *
 *  Exported because `create-order` and the pre-order form each used to keep
 *  their own copy of the five standard keys, which is two more places for this
 *  to drift than there should be.
 *
 *  THE LAST TWO ARE NOT `utm_` KEYS, AND THAT IS WHY THEY NEEDED ADDING
 *  (§8.40-j, founder 2026-09-20). Meta's ads tagged
 *  `utm_source={{site_source_name}}`, which emits `an` / `fb` / `ig` — three
 *  channels where there is one, none of them the `facebook` that
 *  `docs/utm-conventions.md` has specified since 2026-09-05. Correcting the
 *  source alone would have thrown away the useful half: `placement` is how
 *  Audience Network is told from Feed, and it is the field that found a real
 *  problem. Neither it nor `utm_id` was on the old five-key list, and neither is
 *  in posthog-js's own campaign-parameter list either (read from the installed
 *  SDK), so both would have arrived NOWHERE while looking perfectly tagged in
 *  Meta. `PostHogGate` passes them as `custom_campaign_params`, which the SDK
 *  concatenates onto its defaults rather than replacing them. */
export const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  /** Meta's campaign id, so ad spend can be joined to sessions. */
  "utm_id",
  /** Feed vs Reels vs Audience Network. Deliberately its own field rather than
   *  smuggled into utm_source, which is what started this. */
  "placement",
] as const;

const KEYS = CAMPAIGN_KEYS;

/** Values are capped for the same reason `readUtm` caps them: a query string is
 *  attacker-supplied, and this one becomes a cookie AND a database row. */
const MAX = 120;

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, MAX) : null;
}

/** The campaign carried by a landing URL, or null when there is none.
 *  Null rather than `{}` so the caller can tell "no campaign here" from "a
 *  campaign with nothing in it" and leave an existing cookie alone. */
export function campaignFromUrl(url: URL): Record<string, string> | null {
  const out: Record<string, string> = {};
  for (const key of KEYS) {
    const value = clean(url.searchParams.get(key));
    if (value) out[key] = value;
  }
  return Object.keys(out).length ? out : null;
}

/** The campaign remembered from earlier in this visit, read off the request.
 *
 *  A cookie is client-suppliable, so it is validated exactly as hard as the
 *  request body already is: five known keys, strings only, capped. It must never
 *  be able to widen an order row with whatever someone put in it. */
export function readCampaignCookie(request: Request): Record<string, string> | null {
  const header = request.headers.get("cookie");
  if (!header) return null;

  const raw = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CAMPAIGN_COOKIE}=`))
    ?.slice(CAMPAIGN_COOKIE.length + 1);
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeURIComponent(raw));
  } catch {
    /* A malformed cookie is an ordinary thing, not an error: a truncated value,
       an old format, someone poking. It costs the attribution, never the order. */
    return null;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

  const source = parsed as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of KEYS) {
    const value = clean(source[key]);
    if (value) out[key] = value;
  }
  return Object.keys(out).length ? out : null;
}
