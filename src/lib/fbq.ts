/** The one way this codebase talks to the Meta Pixel (2026-09-01).
 *
 *  Everything goes through `fbTrack` so there is a single place where the
 *  "is the pixel even here?" question is answered. It usually is not: the tag
 *  loads only on META_PIXEL_HOSTS, so on localhost, in previews and in every
 *  test every call below is a no-op by design, and nothing has to guard its own
 *  call site.
 *
 *  `eventId` is accepted and unused today. It is here so that adding the
 *  Conversions API later — a server-side copy of the same event, which Meta
 *  deduplicates by matching eventID — does not mean editing every call site. */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export function fbTrack(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string,
): void {
  if (typeof window === "undefined") return;
  window.fbq?.("track", event, params, eventId ? { eventID: eventId } : undefined);
}

/** The de-duplication key for a Purchase, derived from the order reference.
 *
 *  ISOMORPHIC ON PURPOSE, and that is the whole design. Meta collapses a
 *  browser event and a Conversions API event into a single conversion when
 *  `event_name` and `eventID` match within 48 hours. Deriving the id from
 *  something both sides already hold means the browser and the Razorpay webhook
 *  can each compute it alone, with no shared state, no handoff, and no way for
 *  one side to be running a stale version of the other's value.
 *
 *  So this function must stay pure and must never change shape casually:
 *  changing it while events are in flight would split one conversion into two
 *  for every order in the 48-hour window. */
export function purchaseEventId(orderRef: string): string {
  return `purchase_${orderRef}`;
}

/** Run `cb` once `window.fbq` exists, and return a canceller for React cleanup.
 *
 *  WHY THIS IS NEEDED, and it is not obvious. `fbTrack` no-ops when the pixel is
 *  absent, which is correct for localhost and previews but is a trap for any
 *  event fired on MOUNT. The pixel is gated behind a hostname check that runs in
 *  an effect, and only then does its script load `afterInteractive`. So on a
 *  production host the honest ordering is: page mounts, other effects run, THEN
 *  `fbq` appears. A `ViewContent` fired straight from a mount effect would
 *  therefore be dropped on the floor most of the time, silently, and the only
 *  symptom would be an event that looks mysteriously rare in Events Manager.
 *
 *  Once the inline snippet has run, `fbq` is a stub that queues calls until
 *  fbevents.js lands, so waiting for the stub is enough. Nothing needs to wait
 *  for the real library.
 *
 *  Events fired from a user interaction (InitiateCheckout, Purchase) do not need
 *  this: by then the page has been open for a while and the pixel is long since
 *  present. This is only for mount-time events.
 *
 *  Bounded on purpose: on a host where the gate stays shut, `fbq` never arrives,
 *  and this must give up rather than poll for the life of the page. */
export function whenFbqReady(
  cb: () => void,
  { timeoutMs = 10_000, intervalMs = 200 }: { timeoutMs?: number; intervalMs?: number } = {},
): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.fbq) {
    cb();
    return () => {};
  }

  let waited = 0;
  const id = window.setInterval(() => {
    waited += intervalMs;
    if (window.fbq) {
      window.clearInterval(id);
      cb();
    } else if (waited >= timeoutMs) {
      window.clearInterval(id);
    }
  }, intervalMs);

  return () => window.clearInterval(id);
}
