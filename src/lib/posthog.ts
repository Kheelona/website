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
  /** Added 2026-09-20 (§8.40). `get_distinct_id()` is `get_property("distinct_id")`,
   *  which reads `persistence.props` — verified against real browser storage on
   *  production, not merely against the types. */
  get_distinct_id: () => string;
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
