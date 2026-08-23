import { beforeEach, describe, expect, it } from "vitest";
import { rateLimit, clientKey, resetRateLimits } from "./rate-limit";

/**
 * The throttle on the store's public POSTs (§8.25-j, F-14).
 *
 * It is honestly a modest control: an in-memory counter, per serverless
 * instance, whose job is to stop a stuck retry loop or a casual script from
 * filling the orders table and creating gateway orders. Bounding a determined
 * attacker is the edge's job, not this file's.
 *
 * What it must not be is decorative. It keyed on the FIRST entry of
 * `x-forwarded-for`, and that entry is whatever the caller typed: one varying
 * header per request and every limit in the store went away. So how the caller
 * is identified is the part worth pinning.
 */

function withHeaders(headers: Record<string, string>): Request {
  return new Request("https://store.kheelona.com/api/preorder/create-order", {
    method: "POST",
    headers,
  });
}

describe("identifying the caller", () => {
  it("trusts the platform's own header over anything forwarded", () => {
    const key = clientKey(
      withHeaders({ "x-real-ip": "203.0.113.9", "x-forwarded-for": "1.2.3.4" }),
    );
    expect(key).toBe("203.0.113.9");
  });

  it("takes the LAST hop of a forwarded chain, never the caller's own claim", () => {
    /* "client, proxy1, proxy2": each proxy appends, so anything a caller sends
       ends up on the left and the hop nearest us is on the right. */
    expect(clientKey(withHeaders({ "x-forwarded-for": "1.2.3.4, 203.0.113.9" }))).toBe(
      "203.0.113.9",
    );
  });

  it("cannot be steered by a spoofed leading entry", () => {
    /* The bug this test exists for: two requests from one caller, each claiming
       a different address, must land in the SAME bucket. */
    const a = clientKey(withHeaders({ "x-forwarded-for": "9.9.9.9, 203.0.113.9" }));
    const b = clientKey(withHeaders({ "x-forwarded-for": "8.8.8.8, 203.0.113.9" }));
    expect(a).toBe(b);
  });

  it("prefers Vercel's forwarded header to the generic one", () => {
    expect(
      clientKey(
        withHeaders({ "x-vercel-forwarded-for": "203.0.113.9", "x-forwarded-for": "1.2.3.4" }),
      ),
    ).toBe("203.0.113.9");
  });

  it("falls back to one shared bucket rather than to no limit at all", () => {
    expect(clientKey(withHeaders({}))).toBe("unknown");
    expect(clientKey(withHeaders({ "x-forwarded-for": " , " }))).toBe("unknown");
  });
});

describe("the window itself", () => {
  beforeEach(() => resetRateLimits());

  it("allows up to the limit and then refuses with a wait", () => {
    for (let i = 0; i < 8; i += 1) {
      expect(rateLimit("k", 8, 60_000, 1_000).allowed, `call ${i + 1}`).toBe(true);
    }
    const refused = rateLimit("k", 8, 60_000, 1_000);
    expect(refused.allowed).toBe(false);
    expect(refused.retryAfterSeconds).toBe(60);
  });

  it("opens a fresh window once the old one has passed", () => {
    for (let i = 0; i < 9; i += 1) rateLimit("k", 8, 60_000, 1_000);
    expect(rateLimit("k", 8, 60_000, 62_000).allowed).toBe(true);
  });

  it("counts each caller separately", () => {
    for (let i = 0; i < 9; i += 1) rateLimit("a", 8, 60_000, 1_000);
    expect(rateLimit("a", 8, 60_000, 1_000).allowed).toBe(false);
    expect(rateLimit("b", 8, 60_000, 1_000).allowed).toBe(true);
  });
});
