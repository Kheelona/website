/** The visitor's PostHog SESSION id, read on the server from the PostHog cookie the browser already sends (D075, K-124b).
 *
 *  WHY. PostHog records each visit's entry referrer, landing path, click ids and UTMs on the visit's session. If the
 *  server-sent `purchase_confirmed` names that session (`$session_id`), PostHog attributes the sale to the visit's own
 *  entry data. The Razorpay webhook that sends the event is called by Razorpay, so it has no cookie: `create-order`,
 *  which holds the visitor's own request, is the last moment anyone can read it (as `ph_distinct_id` before it).
 *
 *  WHERE. posthog-js keeps its state in the cookie `ph_<project key>_posthog` on `.kheelona.com` (so the store host
 *  gets it too), percent-encoded JSON whose `$sesid` is `[last activity ms, session id, start ms]`
 *  (`POSTHOG_PERSISTENCE_NAME` in `beacon.ts` holds the name and the layout; confirmed against production 24 Nov).
 *  Read on the server only: no client change, no new cookie, nothing new the browser sends.
 *
 *  STRICT. A cookie is client-suppliable, and this value goes into our database and into a PostHog event, so it is
 *  validated as hard as `readCampaignCookie` validates its cookie: a UUID-shaped string of at most 64 characters (PostHog's
 *  are UUIDv7), else nothing. Never throws, and never costs an order: a missing, truncated, oversized or foreign cookie is
 *  an ordinary state that reads as `null`, which only costs the attribution. */
import { POSTHOG_PERSISTENCE_NAME } from "./beacon";

/** Eight-four-four-four-twelve hex digits: a UUID's shape, whatever its version. */
const SESSION_ID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SESSION_ID_MAX_LENGTH = 64;
/** A browser stores at most ~4 KB per cookie: anything longer is not posthog-js's, and is not worth parsing. */
const COOKIE_VALUE_MAX_LENGTH = 4096;

/** The session id when `value` is a UUID-shaped string of at most 64 characters, else null. */
export function validPhSessionId(value: unknown): string | null {
  return typeof value === "string" && value.length <= SESSION_ID_MAX_LENGTH && SESSION_ID_SHAPE.test(value)
    ? value
    : null;
}

/** The session id in the request's PostHog cookie, or null. */
export function readPhSessionId(request: Request): string | null {
  try {
    const header = request.headers.get("cookie");
    if (!header) return null;

    const prefix = `${POSTHOG_PERSISTENCE_NAME}=`;
    const raw = header
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix))
      ?.slice(prefix.length);
    if (!raw || raw.length > COOKIE_VALUE_MAX_LENGTH) return null;

    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const sesid = (parsed as Record<string, unknown>).$sesid;
    return Array.isArray(sesid) ? validPhSessionId(sesid[1]) : null;
  } catch {
    /* A malformed escape or truncated JSON: someone poking, or an old format. It costs the attribution, never the order. */
    return null;
  }
}
