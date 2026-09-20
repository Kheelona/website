/** The one way this codebase talks to PostHog (2026-09-19).
 *
 *  Same shape and same reasoning as `lib/fbq.ts`: every call goes through here
 *  so there is a single place where the "is PostHog even here?" question is
 *  answered. It usually is not. The SDK loads only on POSTHOG_HOSTS, so on
 *  localhost, in previews and in every test every function below is a no-op by
 *  design, and no call site has to guard itself.
 *
 *  WHY A REGISTERED INSTANCE RATHER THAN AN IMPORT. `PostHogGate` pulls
 *  posthog-js in with a dynamic `import()` AFTER its host check passes, so that
 *  ~60KB never enters the bundle on a host that will not use it. If this module
 *  imported posthog-js directly to reach the same singleton, that saving would
 *  be undone the moment anything imported this file — which the pre-order
 *  feature does, on the store's critical path. So the gate hands the instance
 *  down and this module stays dependency-free and synchronous.
 *
 *  The structural type below is deliberately minimal: it is the surface this
 *  codebase actually uses, not a re-declaration of PostHog's API. */

/** Only what we call. Kept narrow so a posthog-js major cannot break the build
 *  in a way that hides which call site actually needs attention. */
type PostHogLike = {
  capture: (event: string, properties?: Record<string, unknown>) => void;
  startSessionRecording: () => void;
  stopSessionRecording: () => void;
  /** Both added 2026-09-20 (§8.40), and both names were read out of the
   *  INSTALLED SDK rather than its docs: `get_distinct_id()` is
   *  `get_property("distinct_id")`, and `getSessionProperty(k)` is
   *  `sessionPersistence.props[k]`. The casing really is inconsistent in
   *  posthog-js; matching it is not a typo. */
  get_distinct_id: () => string;
  getSessionProperty: (property: string) => unknown;
};

let instance: PostHogLike | null = null;

/** Called by PostHogGate once the SDK has loaded and initialised. */
export function registerPostHog(ph: PostHogLike): void {
  instance = ph;
}

/** Test seam. Nothing in the app calls this. */
export function resetPostHogForTests(): void {
  instance = null;
}

/** Send an event, or do nothing if PostHog is not on this host.
 *
 *  Every funnel event this site sends is user-initiated (a form submitted, a
 *  checkout opened, a payment completed), so by the time one fires the page has
 *  been open long enough for the gate's effect and the dynamic import to have
 *  finished. That is why there is no queue and no `whenReady` helper here, and
 *  why `lib/fbq.ts` needs one: `whenFbqReady` exists for events fired on MOUNT,
 *  and PostHog has none of those. Its page views are the SDK's own job. */
export function phCapture(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  instance?.capture(event, properties);
}

/** Turn session replay on or off for the route now showing.
 *
 *  Replay is started and stopped per route rather than configured once at init,
 *  because the reason to withhold it is a PROPERTY OF THE PAGE, not of the
 *  visit: `/store/thanks` prints a parent's email, order number and delivery
 *  address back to them as text, and a recording is a continuous screenshot of
 *  exactly that. A visitor who lands on the pre-order form, pays, and arrives at
 *  the confirmation must have the recorder stop when they get there and start
 *  again if they navigate away, which a one-time init flag cannot express.
 *
 *  `disable_session_recording: true` at init means the recorder never starts on
 *  its own, so the first allowed route is what turns it on. A denied route
 *  therefore never had a recorder running to leak from. */
export function phSetReplay(allowed: boolean): void {
  if (typeof window === "undefined" || !instance) return;
  if (allowed) instance.startSessionRecording();
  else instance.stopSessionRecording();
}

/** The five campaign keys, and only these. Same list the order row and
 *  `create-order` already agree on, so a campaign means the same thing in
 *  PostHog and in the database. */
const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/** PostHog's anonymous device id, or null when PostHog is not here.
 *
 *  Sent with a pre-order so the SERVER-sent `purchase_confirmed` event can join
 *  the same person's funnel. It is a device id, not a person: nothing calls
 *  `identify()` anywhere in this repo, and the server event sets
 *  `$process_person_profile: false`, so no person profile is created.
 *
 *  Null is an ordinary answer, not an error: on localhost, in every preview, in
 *  every test and for a visitor whose browser blocked the SDK there is no id,
 *  and the order must still go through. */
export function phDistinctId(): string | null {
  if (typeof window === "undefined" || !instance) return null;
  try {
    return instance.get_distinct_id() || null;
  } catch {
    /* Reading a property before the SDK finished loading throws rather than
       returning undefined. A pre-order is not lost over an analytics read. */
    return null;
  }
}

/** The campaign THIS SESSION ARRIVED WITH, which is not the same thing as the
 *  campaign in the current URL (§8.40).
 *
 *  This is the fix for the attribution hole that made "do the ads work?"
 *  unanswerable. Ads tag `kheelona.com`; a parent then reads a page or two and
 *  crosses to `store.kheelona.com`, where the URL carries nothing at all and
 *  `window.location.search` has nothing left to read. PostHog's own cookie is
 *  set on `.kheelona.com` — `cross_subdomain_cookie` resolves true for this
 *  domain, verified in the SDK, which takes the last two hostname labels and
 *  checks them against a blocklist — so the SESSION still knows the campaign
 *  long after the URL forgot it.
 *
 *  Reading what PostHog already stores, rather than forwarding tags on links or
 *  minting a cookie of our own: no new cookie means no new privacy surface, and
 *  no tagged link means `docs/utm-conventions.md` rule 2 stays intact. */
export function phCampaign(): Record<string, string> {
  if (typeof window === "undefined" || !instance) return {};
  const out: Record<string, string> = {};
  for (const key of CAMPAIGN_KEYS) {
    try {
      const value = instance.getSessionProperty(key);
      if (typeof value === "string" && value.trim()) out[key] = value.trim();
    } catch {
      /* One unreadable key must not cost the other four. */
    }
  }
  return out;
}
