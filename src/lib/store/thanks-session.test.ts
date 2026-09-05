import { describe, expect, it } from "vitest";
import {
  formatThanksSession,
  parseThanksSession,
  THANKS_COOKIE_MAX_AGE_SECONDS,
} from "./thanks-session";
import { signAddressToken, ADDRESS_TOKEN_TTL_MS } from "./signing";

/**
 * The hand-off that keeps an order's credential out of the URL (F-01).
 *
 * An address token authorises reading one family's confirmation and changing
 * where their Kheelu is delivered, for thirty days. It used to ride in the query
 * string of a page that loads three analytics tags, each of which reports the
 * URL it loaded on. This module is the boundary that fixed that, so what it
 * accepts and refuses is worth pinning: a value that reaches a Set-Cookie
 * header is a value that arrived from a stranger's URL.
 */

const REF = "KH-A2B3-C4D5";
const token = () => signAddressToken("s3cret", REF, 1_790_000_000_000);

describe("the /thanks hand-off value", () => {
  it("round-trips a real reference and token", () => {
    const value = formatThanksSession(REF, token());
    expect(value).not.toBeNull();
    expect(parseThanksSession(value)).toEqual({ orderRef: REF, token: token() });
  });

  it("splits on the FIRST dot, because the token carries its own", () => {
    /* signAddressToken returns "<expiry>.<mac>", so a naive split(".") would
       hand back a truncated token that then fails verification for reasons
       nobody would enjoy debugging at the moment a parent is paying. */
    expect(token()).toContain(".");
    const parsed = parseThanksSession(formatThanksSession(REF, token())!);
    expect(parsed?.token).toBe(token());
  });

  it("refuses anything that is not one of our references", () => {
    for (const bad of ["", "KH-A2B3", "kh-a2b3-c4d5", "KH-A2B3-C4D0", "../../etc"]) {
      expect(formatThanksSession(bad, token()), bad).toBeNull();
    }
  });

  it("refuses a token that is not the shape we mint", () => {
    for (const bad of ["", "abc", "1790000000000", "1790000000000.short", "x.aaaaaaaaaaaaaaaa"]) {
      expect(formatThanksSession(REF, bad), bad).toBeNull();
    }
  });

  it("refuses a cookie value that is missing, empty, or malformed", () => {
    for (const bad of [undefined, null, "", "no-dots-here", `${REF}.`, `.${token()}`]) {
      expect(parseThanksSession(bad), String(bad)).toBeNull();
    }
  });

  it("is a hand-off, not a session: the cookie expires long before the token", () => {
    expect(THANKS_COOKIE_MAX_AGE_SECONDS * 1000).toBeLessThan(ADDRESS_TOKEN_TTL_MS);
  });
});
