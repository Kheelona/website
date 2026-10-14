/**
 * The new events as the browser dispatcher needs them (task 6.3, from 6.2's note 2): each name with the destinations
 * and parameters the registry gives it, and nothing else.
 *
 * Client-only on purpose. track.ts runs in the store's client chunks (PreorderForm and checkout.ts call it); reading
 * the whole registry there (src/lib/tracking/events.ts: every existing event, its "fired by" and "when" notes, the
 * stamped properties) shipped about 2.3 KB gzip of documentation on three store chunks. This module takes nothing but
 * types from the registry, and src/lib/tracking/new-events.test.ts keeps it that way.
 *
 * The registry stays the one source: test/guards/tracking-registry.test.ts holds this map equal to EVENTS filtered to
 * status "new" (names, destinations and parameters, in order), so a new event lands in events.ts first and here in
 * the same commit, or the guard fails. Never a Meta destination (architecture §8.2).
 */
import type { DestinationKey } from "./destinations";
import type { NewEventName } from "./events";

export interface NewEventRoute {
  readonly destinations: readonly DestinationKey[];
  /** Parameter names in the registry's order. */
  readonly params: readonly string[];
}

export const NEW_EVENTS = {
  preorder_payment_window_opened: { destinations: ["ga4", "posthog-browser"], params: ["tier"] },
  preorder_payment_failed: { destinations: ["ga4", "posthog-browser"], params: ["tier", "reason_code", "reason"] },
  preorder_form_rejected: { destinations: ["ga4", "posthog-browser"], params: ["tier", "fields"] },
} as const satisfies Record<NewEventName, NewEventRoute>;
