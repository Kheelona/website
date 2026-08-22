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

/** The caller's address, as well as a proxy can tell us. Vercel sets
 *  x-forwarded-for; the first entry is the client. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/** Test-only: windows are process state, and one test must not leak into another. */
export function resetRateLimits(): void {
  windows.clear();
}
