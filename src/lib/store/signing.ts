import { createHmac, timingSafeEqual } from "node:crypto";

/** HMAC helpers for the store (§8.25).
 *
 *  Two things get signed, and they must not be interchangeable: an event link
 *  that sets a ₹99 price, and an address token that lets someone edit an order.
 *  Both derive from one `STORE_SIGNING_SECRET` with a LABEL inside the HMAC
 *  input, which is standard key separation: a signature minted for one purpose
 *  cannot be replayed as the other, and the founder pastes one secret instead
 *  of two.
 *
 *  Comparison is always timing-safe. It costs nothing here, and the alternative
 *  leaks a byte at a time to anyone patient. */

export type Purpose = "event-link" | "address-token";

function digest(secret: string, purpose: Purpose, payload: string): string {
  return createHmac("sha256", secret).update(`${purpose}:${payload}`).digest("base64url");
}

/** A short signature, for something a person may retype or a QR encodes.
 *  16 base64url characters is 96 bits: far past guessing, small in a URL. */
export function sign(secret: string, purpose: Purpose, payload: string): string {
  return digest(secret, purpose, payload).slice(0, 16);
}

export function verify(
  secret: string,
  purpose: Purpose,
  payload: string,
  candidate: string,
): boolean {
  const expected = sign(secret, purpose, payload);
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(candidate));
}

/** How long an address link stays usable: long enough to survive a parent who
 *  pays on the bus and fills the address in at home on Sunday. */
export const ADDRESS_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** An address token ties one order reference to an expiry, so a link mailed to
 *  a parent works for weeks but not forever, and cannot be pointed at someone
 *  else's order by editing the reference in the URL. */
export function signAddressToken(
  secret: string,
  orderRef: string,
  expiresAtMs: number,
): string {
  return `${expiresAtMs}.${sign(secret, "address-token", `${orderRef}.${expiresAtMs}`)}`;
}

export function verifyAddressToken(
  secret: string,
  orderRef: string,
  token: string,
  nowMs: number = Date.now(),
): boolean {
  const [expiresRaw, mac] = token.split(".");
  if (!expiresRaw || !mac) return false;
  const expiresAtMs = Number(expiresRaw);
  if (!Number.isFinite(expiresAtMs) || expiresAtMs < nowMs) return false;
  return verify(secret, "address-token", `${orderRef}.${expiresAtMs}`, mac);
}
