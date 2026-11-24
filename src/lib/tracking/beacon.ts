/**
 * Tracking that has to leave the page NOW (D070 / B7c, K-174; wiki/site/tracking-inventory.md §17).
 *
 * WHY THIS EXISTS. posthog-js (1.434.2) queues every event and flushes the queue every 3 seconds, and on `pagehide` /
 * `beforeunload`. A phone does not fire `pagehide` when the parent switches to a UPI app, locks the screen or closes an
 * in-app browser, so an event queued just before that waits in memory and is lost if the tab is discarded. And the
 * store's own `$pageview` waits for hydration plus the SDK's dynamic import, so a visitor who leaves early is never
 * counted. Two signals therefore bypass the queue and go out at once, by `navigator.sendBeacon`:
 *
 *   - `store_arrived`: an inline script in the store's server HTML (`storeArrivalScript`, rendered by StoreShell), run
 *     while the HTML is parsed, before any bundle.
 *   - `preorder_payment_window_hidden`: `beaconCapture`, called when the page is hidden with the payment sheet open
 *     (./payment-window.ts).
 *
 * WHAT THEY ARE NOT. Not funnel events: `analytics.ts` (frozen, D069) and the dispatcher (`track.ts`) are untouched, and
 * nothing here reaches GA4, Meta or OpenAI. They are PostHog events only, sent to the same-origin proxy
 * (`POSTHOG_PROXY_PATH`, so an ad blocker treats them like the SDK's own), in the body format posthog-js itself uses with
 * `sendBeacon` (read from the installed SDK: `POST <api_host>/e/?compression=base64`, a form body `data=<base64 of
 * {api_key, batch: [event], sent_at}>`, each event `{event, properties: {token, distinct_id, ...}, timestamp}`).
 *
 * WHAT THEY NEVER CARRY. Only the properties named in the registry (events.ts, D070 rows): a URL with just the campaign
 * keys of `CAMPAIGN_KEYS` (never another query parameter: no email, phone or order reference can leak through a URL), the
 * host and path, the referrer's host, the PostHog device and session ids that posthog-js itself put in its cookie, the
 * team-device flag, and `tier`. `$process_person_profile: false`, so no person profile is created. Nothing from the
 * pre-order form, ever.
 *
 * ONE SOURCE OF TRUTH. The inline script cannot import anything, so `storeArrivalScript()` is a template that takes its
 * values (key, proxy path, hosts, campaign keys, deny paths, internal-flag names) from the same constants
 * `beaconCapture` uses, serialised with JSON. test/tracking-beacon.test.ts evaluates the script text in jsdom and checks
 * that it and `beaconCapture` send the same keys.
 */
import { HOSTS, isBetaHost } from "@/config/env";
import { POSTHOG_KEY, POSTHOG_PROXY_PATH, POSTHOG_REPLAY_DENY_PATHS, shouldLoadPostHog } from "@/config/site";
import { CAMPAIGN_KEYS } from "@/lib/campaign";
import { phDistinctId } from "@/lib/posthog";
import { INTERNAL_PROPERTY } from "./internal-flag";

/** The event the inline script sends. */
export const STORE_ARRIVED = "store_arrived";
/** `$lib` of the inline script's event, and of every `beaconCapture` event: so an analyst can tell them from the SDK's. */
export const EARLY_LIB = "kh-early";
export const BEACON_LIB = "kh-beacon";

/** posthog-js's capture endpoint behind our proxy; `compression=base64` is the SDK's own beacon body format. */
export const BEACON_URL = `${POSTHOG_PROXY_PATH}/e/?compression=base64`;
const BEACON_CONTENT_TYPE = "application/x-www-form-urlencoded";

/** posthog-js names its persistence `ph_<token>_posthog` (token with + / = escaped); the cross-subdomain COOKIE holds
 *  `distinct_id` and `$sesid` = [last activity ms, session id, start ms], and localStorage on the host holds the rest,
 *  `internal` (the team flag, `register()`ed by applyInternalFlag) included. Both are probed in the B7c evidence. */
export const POSTHOG_PERSISTENCE_NAME = `ph_${POSTHOG_KEY.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")}_posthog`;

/** The session posthog-js would still continue: idle under 30 minutes (its default `session_idle_timeout_seconds`). A
 *  stale id is left out rather than joined to a visit the SDK is about to give a new session. (The SDK also ends a
 *  session after 24 hours; a visit that long is not worth the bytes in the inline script.) */
const SESSION_IDLE_MS = 30 * 60 * 1000;
/** A campaign value is capped as `campaignFromUrl` (src/lib/campaign.ts, frozen) caps it (that one also trims). */
const CAMPAIGN_VALUE_MAX = 120;

/** The hosts the inline script sends from: the store hosts that are PostHog hosts (production store, betastore), so
 *  never localhost, a preview or the marketing host. `STORE_BETA_HOSTS` is the subset stamped `env: "beta"`. */
export const STORE_ARRIVAL_HOSTS: readonly string[] = [HOSTS.production.store, HOSTS.beta.store].filter((h) =>
  shouldLoadPostHog(h),
);
const STORE_BETA_HOSTS = STORE_ARRIVAL_HOSTS.filter((h) => isBetaHost(h));

/**
 * The visits posthog-js itself drops (its default blocked user agents, and `navigator.webdriver`), approximated, so a
 * crawler is not counted by `store_arrived` while it is not counted by `$pageview`: the two have to be comparable.
 * One source for the inline script (as a regex literal: no `/` or `\` in it) and for `beaconCapture`. Short on purpose
 * (the inline script has a size budget): the families that make up nearly all crawler traffic, not the SDK's whole list
 * (test/tracking-beacon.test.ts checks every entry of the installed list and names the few left out).
 */
export const BOT_UA_SOURCE = "bot|crawl|spider|headless|lighthouse|preview|google|external";
const BOT_UA = new RegExp(BOT_UA_SOURCE, "i");

export function isLikelyBot(userAgent: string, webdriver?: boolean): boolean {
  return webdriver === true || BOT_UA.test(userAgent);
}

/** The PostHog cookie as an object (empty when absent or malformed: an ordinary state, never an error). */
export function readPostHogCookie(cookie: string): Record<string, unknown> {
  const hit = new RegExp(`(?:^|; )${POSTHOG_PERSISTENCE_NAME}=([^;]*)`).exec(cookie);
  if (!hit) return {};
  try {
    const value: unknown = JSON.parse(decodeURIComponent(hit[1]));
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/** The cookie's `$sesid` as a session id, or undefined when it is missing or idle past what posthog-js would continue. */
export function freshSessionId(sesid: unknown, now: number): string | undefined {
  if (!Array.isArray(sesid)) return undefined;
  const [lastActive, id] = sesid as unknown[];
  return typeof id === "string" && id && now - Number(lastActive) < SESSION_IDLE_MS ? id : undefined;
}

/** `origin + pathname`, then ONLY the campaign keys the URL carries, in `CAMPAIGN_KEYS` order, each capped. */
export function campaignUrl(location: Pick<Location, "origin" | "pathname" | "search">): string {
  const query = new URLSearchParams(location.search);
  const kept = new URLSearchParams();
  for (const key of CAMPAIGN_KEYS) {
    const value = query.get(key);
    if (value) kept.set(key, value.slice(0, CAMPAIGN_VALUE_MAX));
  }
  const text = kept.toString();
  return `${location.origin}${location.pathname}${text ? `?${text}` : ""}`;
}

/**
 * Is this a team device? The flag posthog-js holds for this host (`register({ internal: true })` by applyInternalFlag,
 * in localStorage). Read at call time, so a device flagged with `?internal=1` counts from its second page load: the
 * first load's `store_arrived` goes out before posthog-js has stored the flag (the inline script has no room for the
 * URL parameter).
 */
export function isInternalDevice(storedPersistence: string | null): boolean {
  try {
    return (JSON.parse(storedPersistence ?? "null") as Record<string, unknown> | null)?.[INTERNAL_PROPERTY] === true;
  } catch {
    return false;
  }
}

/** A random v4 UUID, from `getRandomValues` (also available where `crypto.randomUUID` is not, e.g. http hosts). */
function randomUuid(): string {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16),
  );
}

function storedPersistence(): string | null {
  try {
    return localStorage.getItem(POSTHOG_PERSISTENCE_NAME);
  } catch {
    return null;
  }
}

/** UTF-8 safe `btoa`. */
function base64(text: string): string {
  let binary = "";
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/**
 * Send one PostHog event NOW, by `navigator.sendBeacon` (a request that outlives the page), falling back to
 * `fetch(…, { keepalive: true })` when the browser has no beacon or refuses it. For the signal that must not wait for
 * posthog-js's queue (see the top of this file); B5's early Pre-order tap uses it too.
 *
 *   beaconCapture("preorder_payment_window_hidden", { tier: "launch" });
 *
 * - Does nothing off the PostHog hosts (`shouldLoadPostHog`: the production hosts and the two beta hosts; never
 *   localhost or a preview) and for the visits posthog-js ignores (`isLikelyBot`). Returns true only when a request was
 *   handed to the browser.
 * - Never throws: a measuring tool must not break the page (a try/catch around everything, and the fallback's rejection
 *   is swallowed).
 * - Adds, before `props`: `token`, `distinct_id` (the live SDK's through `phDistinctId()`, else the cookie's, else a
 *   random UUID that makes the event a plain count), `$current_url` (campaign keys only), `$host`, `$pathname`,
 *   `$session_id` (cookie, only while fresh), `internal: true` on a team device, `env: "beta"` on the beta hosts (the
 *   stamp `before_send` gives the SDK's events, which a beacon bypasses), `$lib: "kh-beacon"` and
 *   `$process_person_profile: false`. `token` and `distinct_id` cannot be overridden; every other key can.
 * - `props` is for small, named values (a tier), never anything a parent typed.
 */
export function beaconCapture(event: string, props: Record<string, unknown> = {}): boolean {
  try {
    if (typeof window === "undefined") return false;
    const { location } = window;
    if (!shouldLoadPostHog(location.hostname)) return false;
    if (isLikelyBot(navigator.userAgent, navigator.webdriver)) return false;

    const cookie = readPostHogCookie(document.cookie);
    const cookieId = typeof cookie.distinct_id === "string" && cookie.distinct_id ? cookie.distinct_id : undefined;
    const sessionId = freshSessionId(cookie.$sesid, Date.now());
    const properties: Record<string, unknown> = {
      $current_url: campaignUrl(location),
      $host: location.host,
      $pathname: location.pathname,
      ...(sessionId ? { $session_id: sessionId } : {}),
      ...(isInternalDevice(storedPersistence()) ? { [INTERNAL_PROPERTY]: true } : {}),
      ...(isBetaHost(location.hostname) ? { env: "beta" } : {}),
      $lib: BEACON_LIB,
      $process_person_profile: false,
      ...props,
      token: POSTHOG_KEY,
      distinct_id: phDistinctId() ?? cookieId ?? randomUuid(),
    };
    const sentAt = new Date().toISOString();
    const body = `data=${encodeURIComponent(
      base64(JSON.stringify({ api_key: POSTHOG_KEY, batch: [{ event, properties, timestamp: sentAt }], sent_at: sentAt })),
    )}`;
    const blob = new Blob([body], { type: BEACON_CONTENT_TYPE });

    if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon(BEACON_URL, blob)) return true;
    void fetch(BEACON_URL, { method: "POST", body: blob, keepalive: true }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

/** A JSON literal that is safe inside an inline <script>: no `<` can start `</script>` or `<!--`. */
const literal = (value: unknown): string => JSON.stringify(value).replace(/</g, "\\u003c");

/**
 * The text of the inline script StoreShell puts first in the store's HTML, so `store_arrived` goes out while the page
 * is still being parsed, before hydration, before posthog-js is even downloaded (C-site-bottleneck A2: 7 of 27 Pre-order
 * taps left no store page view). It sends once per page load (a script in the server HTML runs once per document load),
 * from the store hosts that are PostHog hosts only
 * (`STORE_ARRIVAL_HOSTS`), never on /thanks or under it (`POSTHOG_REPLAY_DENY_PATHS`: the page that prints a parent's
 * order), and not for a bot or an automated browser (`BOT_UA_SOURCE`, `navigator.webdriver`).
 *
 * Properties: `$current_url` (origin + path + campaign keys only), `$host`, `$pathname`, `$referring_domain` (the
 * referrer's host, else `$direct`), `$session_id` (cookie, while fresh), `internal: true` on a team device (from its second
 * page load: see `isInternalDevice`), `env: "beta"` on the beta store, `$lib: "kh-early"`, `$process_person_profile: false`. `distinct_id` is the PostHog cookie's when
 * there is one (so the event joins the visitor's funnel), else a random UUID (then it is only a count).
 *
 * No dependency, no network wait (a beacon), every step inside a try: it can never throw, and it does nothing the
 * parent can see. The guard in test/tracking-beacon.test.ts holds it under 1.5 KB, which is why it is terse and does
 * less than `beaconCapture`: no `fetch` fallback (a ~400-byte beacon is not refused for quota), no `timestamp` or
 * `sent_at` (the event is sent at once, so PostHog's receipt time is the event time, and a phone with a wrong clock cannot
 * skew it), no 24-hour session check, no trim of a campaign value. Everything in it is ASCII (a pathname and a hostname always are), so `btoa` is safe. The
 * persistence name is `"ph_" + key + "_posthog"` (the test holds the key free of the characters posthog-js escapes).
 * The arguments, in order: store hosts, beta store hosts, project key, proxy path, deny paths, campaign keys, internal
 * property. The random id is `Math.random`, not `crypto` (it is an id for counting, not a secret, and `crypto.randomUUID`
 * is missing on old browsers and on http pages).
 */
export function storeArrivalScript(): string {
  const body = `(S,B,K,P,D,C,V)=>{
try{
var l=location,d=document,n=navigator,h=l.hostname,p=l.pathname;
if(S.indexOf(h)<0||n.webdriver||/${BOT_UA_SOURCE}/i.test(n.userAgent)||D.some(x=>p==x||!p.indexOf(x+"/")))return;
var N="ph_"+K+"_posthog",q=new URLSearchParams(l.search),u=new URLSearchParams,c={},r="$direct",x,s,o,m;
C.forEach(k=>(x=q.get(k))&&u.set(k,x.slice(0,${CAMPAIGN_VALUE_MAX})));
m=d.cookie.match(new RegExp("(?:^|; )"+N+"=([^;]*)"));
try{c=JSON.parse(decodeURIComponent(m[1]))||{}}catch(e){}
try{r=new URL(d.referrer).hostname||r}catch(e){}
x=c.distinct_id||"10000000-1000-4000-8000-100000000000".replace(/[018]/g,e=>(e^Math.random()*16>>e/4).toString(16));
o={token:K,distinct_id:x,$current_url:l.origin+p+(u>""?"?"+u:""),$host:l.host,$pathname:p,$referring_domain:r,$lib:"${EARLY_LIB}",$process_person_profile:!1};
s=c.$sesid;
if(s&&s[1]&&Date.now()-s[0]<${SESSION_IDLE_MS})o.$session_id=s[1];
try{if(JSON.parse(localStorage.getItem(N))[V]===!0)o[V]=!0}catch(e){}
if(~B.indexOf(h))o.env="beta";
n.sendBeacon(P+"/e/?compression=base64",new Blob(["data="+encodeURIComponent(btoa(JSON.stringify({api_key:K,batch:[{event:"${STORE_ARRIVED}",properties:o}]})))],{type:"${BEACON_CONTENT_TYPE}"}))
}catch(e){}
}`.replace(/\n/g, "");
  const args = [
    STORE_ARRIVAL_HOSTS,
    STORE_BETA_HOSTS,
    POSTHOG_KEY,
    POSTHOG_PROXY_PATH,
    POSTHOG_REPLAY_DENY_PATHS,
    CAMPAIGN_KEYS,
    INTERNAL_PROPERTY,
  ];
  return `(${body})(${args.map(literal).join(",")})`;
}
