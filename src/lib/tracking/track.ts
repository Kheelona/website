/**
 * The dispatcher for NEW events (ADR-006; architecture §8.1, §8.2).
 *
 * A component fires a registered new event by name; this module looks the event up in the
 * registry's client map of new events (src/lib/tracking/new-events.ts, held equal to the new rows
 * of src/lib/tracking/events.ts; task 6.3, so the store's client chunks never carry the whole
 * registry) and sends it to each browser destination listed, with exactly the registry's
 * parameters in the registry's order:
 *   - GA4 through `window.gtag("event", name, params)`, as the frozen funnel does;
 *   - PostHog through `phCapture` (src/lib/posthog.ts), with the same parameters as GA4.
 *
 * NEVER THE META PIXEL. Meta receives only its fixed conversion events, all of them sent by the
 * frozen funnel and the gates; no new name ever reaches it (architecture §8.2), even if a registry
 * row listed it. The proven funnel (preorderAnalytics, ViewContentTracker, the gates) never goes
 * through here: an existing or unknown name is refused, so parity cannot drift through the
 * dispatcher (test/guards/tracking-parity.test.ts).
 *
 * Every tool may be absent (localhost, previews, beta for GA4, every test), so every send is a
 * no-op there, exactly like the funnel's own calls.
 */
import { phCapture } from "@/lib/posthog";
import type { NewEventName } from "./events";
import { NEW_EVENTS, type NewEventRoute } from "./new-events";

/** Each new event's parameters, named as the registry lists them (tracking-parity proves the match). */
export type NewEventParams = {
  preorder_payment_window_opened: { tier: string };
  preorder_payment_failed: { tier: string; reason_code: string; reason: string };
  preorder_form_rejected: { tier: string; fields: string };
};

/* Compile-time: the map covers exactly the registry's new events, no more and no fewer. */
type Exactly<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const coversRegistry: Exactly<keyof NewEventParams, NewEventName> = true;
void coversRegistry;

type Gtag = (command: "event", name: string, params: Record<string, string | number>) => void;

export function track<N extends NewEventName>(name: N, params: NewEventParams[N]): void {
  if (typeof window === "undefined") return;
  // Own keys only: an existing or unknown name (or "toString") finds nothing and sends nothing.
  if (!Object.hasOwn(NEW_EVENTS, name)) return;
  const entry: NewEventRoute = NEW_EVENTS[name];

  const given = params as Record<string, string | number | undefined>;
  const payload: Record<string, string | number> = {};
  for (const key of entry.params) {
    const value = given[key];
    if (value !== undefined) payload[key] = value;
  }

  for (const destination of entry.destinations) {
    if (destination === "ga4") (window as unknown as { gtag?: Gtag }).gtag?.("event", name, payload);
    else if (destination === "posthog-browser") phCapture(name, payload);
    // "meta-pixel" is never sent a new event; server destinations are not this module's.
  }
}
