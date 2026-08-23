import { isOrderRef } from "./order-ref";

/** The confirmation page's credential, kept out of the address bar (F-01).
 *
 *  WHY THIS FILE EXISTS. `/thanks` used to be reached as
 *  `/thanks?ref=KH-…&t=<address token>`, and that token is the ONLY thing
 *  authorising a person to read an order and change its delivery address, for
 *  thirty days. A URL is not a private place: `gtag` reports `page_location`
 *  verbatim, so every paid order's credential was being copied into the
 *  analytics properties, where anyone with access could open a stranger's
 *  confirmation and re-point their delivery. It also sat in browser history.
 *
 *  So the token now arrives once, in a URL that immediately redirects, and
 *  travels onward in an HttpOnly cookie the page reads server-side. Nothing
 *  about the authorisation model changes: it is still the same signed,
 *  expiring, purpose-labelled token, still verified with
 *  `verifyAddressToken`, and `/api/preorder/address` still takes it in the
 *  POST body exactly as before (§8.25-n). Only its route to the page changed.
 *
 *  Two hours, not thirty days: this cookie is a hand-off, not a session. A
 *  parent who comes back next week opens the link in their email again, which
 *  is the flow the acknowledgement email was already written for. */

export const THANKS_COOKIE = "kh_order";

/** Long enough to fill in an address after paying, including a phone call in
 *  the middle of it. Short enough that a shared laptop does not keep it. */
export const THANKS_COOKIE_MAX_AGE_SECONDS = 2 * 60 * 60;

/** The path the cookie is scoped to, which is also the page it serves. */
export const THANKS_PATH = "/thanks";

/** An address token is `<expiry ms>.<16 char base64url mac>` (signing.ts). The
 *  shape is checked before anything is written to a cookie: the value arrives
 *  from a URL, and a header is the wrong place to discover that. */
const TOKEN_SHAPE = /^\d{10,16}\.[A-Za-z0-9_-]{16}$/;

/** One cookie value carrying both halves, or null if either half is not ours.
 *  The order reference is fixed-width and dot-free, so the FIRST dot is the
 *  boundary and the token keeps its own. */
export function formatThanksSession(orderRef: string, token: string): string | null {
  if (!isOrderRef(orderRef) || !TOKEN_SHAPE.test(token)) return null;
  return `${orderRef}.${token}`;
}

export function parseThanksSession(
  value: string | undefined | null,
): { orderRef: string; token: string } | null {
  if (!value) return null;
  const boundary = value.indexOf(".");
  if (boundary < 0) return null;
  const orderRef = value.slice(0, boundary);
  const token = value.slice(boundary + 1);
  if (!isOrderRef(orderRef) || !TOKEN_SHAPE.test(token)) return null;
  return { orderRef, token };
}
