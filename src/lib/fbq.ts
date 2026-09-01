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
