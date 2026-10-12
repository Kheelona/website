/**
 * The team-device flag (B46; open questions C7; architecture §8.1).
 *
 * A team member opens any page once with `?internal=1`, and PostHog then carries the lasting
 * property `internal: true` on every event from that device, so the "Internal / Test users" cohort
 * finally has members and test traffic can be filtered out. `?internal=0` clears it. It is a new
 * property only: no event is added, renamed or changed, and nothing else is registered.
 *
 * `register` is right HERE and wrong for the beta stamp: this property is meant to last and to
 * follow the device everywhere, including to production, while `env: "beta"` must never leave the
 * beta hosts (D048, QA review N3), so that one goes through `before_send` in PostHogGate.
 *
 * Called by PostHogGate once the SDK has initialised, with `window.location.search`. The target is
 * structural, so this module never imports posthog-js (the gate loads the SDK dynamically).
 * The property is recorded in the registry as STAMPED_PROPERTIES (src/lib/tracking/events.ts).
 */

export const INTERNAL_PARAM = "internal";
export const INTERNAL_PROPERTY = "internal";

export type InternalFlag = "set" | "clear";

/** The slice of the PostHog instance this module uses. */
export interface InternalFlagTarget {
  register(properties: Record<string, unknown>): void;
  unregister(property: string): void;
}

/** "set" for `internal=1`, "clear" for `internal=0`, null for anything else (typos change nothing). */
export function internalFlagFrom(search: string): InternalFlag | null {
  const value = new URLSearchParams(search).get(INTERNAL_PARAM);
  if (value === "1") return "set";
  if (value === "0") return "clear";
  return null;
}

/** Registers or clears `internal` on the instance as the query string asks; returns what it did. */
export function applyInternalFlag(target: InternalFlagTarget, search: string): InternalFlag | null {
  const flag = internalFlagFrom(search);
  if (flag === "set") target.register({ [INTERNAL_PROPERTY]: true });
  else if (flag === "clear") target.unregister(INTERNAL_PROPERTY);
  return flag;
}
