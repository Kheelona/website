/** A small fixed-window throttle for the store's public POSTs (§8.25-j).
 *
 *  Honest about what this is: an in-memory counter, so it is PER SERVERLESS
 *  INSTANCE and a determined person spread across enough cold starts gets more
 *  than the limit. It is not a defence against a motivated attacker. It is a
 *  defence against the ordinary case, which is a script or a stuck retry loop
 *  filling the table with junk rows and Razorpay orders, and for that it works
 *  and costs nothing.
 *
 *  A real limiter would need shared state we do not have a reason to run yet.
 *  When the store has enough traffic for that to matter, the fix is Upstash or
 *  a Postgres counter, and this comment is the note explaining why it was not
 *  built on day one. */

type Window = { count: number; resetAt: number };
const windows = new Map<string, Window>();

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
  now = Date.now(),
): RateLimitResult {
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    // opportunistic sweep: this map must not grow forever in a warm instance
    if (windows.size > 5_000) {
      for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** The caller's address, as well as a proxy can tell us (F-14).
 *
 *  THIS USED TO READ THE FIRST ENTRY OF `x-forwarded-for`, which is the classic
 *  version of this bug. That header is a chain, each proxy APPENDS to it, and
 *  anyone may send one: a client that sets `x-forwarded-for: 1.2.3.4` puts its
 *  own value at the left, so keying on the leftmost entry meant every throttle
 *  in the store could be stepped around by varying one header per request. A
 *  rate limit keyed on a value the caller chooses is not a rate limit.
 *
 *  So, in order of how much we trust them: `x-real-ip`, which the platform sets
 *  itself and a client cannot prepend to; then Vercel's own forwarded header;
 *  then the RIGHTMOST entry of `x-forwarded-for`, which is the hop added by the
 *  proxy nearest to us rather than whatever the caller claimed. When there is no
 *  proxy at all, as locally, rightmost and leftmost are the same value. */
export function clientKey(request: Request): string {
  const direct = request.headers.get("x-real-ip")?.trim();
  if (direct) return direct;

  for (const header of ["x-vercel-forwarded-for", "x-forwarded-for"]) {
    const chain = request.headers.get(header);
    if (!chain) continue;
    const hops = chain.split(",").map((hop) => hop.trim()).filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }

  /* No address at all means every anonymous caller shares one bucket, which is
     the strict direction: it throttles sooner, never later. */
  return "unknown";
}

/** Test-only: windows are process state, and one test must not leak into another. */
export function resetRateLimits(): void {
  windows.clear();
}
