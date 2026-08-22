import { storeEnv, razorpayMode } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { json } from "@/lib/store/http";

/** Store health, and the reason a daily cron exists (§8.25-k).
 *
 *  Supabase pauses a free project after about a week with no requests, and the
 *  request that wakes it would otherwise be a parent's first pre-order, which
 *  fails while it wakes. `vercel.json` hits this once a day so that never
 *  happens. The trivial query is the whole point: it has to touch Postgres, not
 *  just return 200.
 *
 *  It also reports which Razorpay mode is live, which is the one operational
 *  question worth being able to check from a phone: a test key on the real host
 *  means the store is quietly taking fake money. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const env = storeEnv();
  if (!env) return json(503, { ok: false, store: "not-configured" });

  const started = Date.now();
  const { error } = await db(env)
    .from("event_tiers")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("[health] database unreachable", error);
    return json(503, { ok: false, store: "database-unreachable" });
  }

  return json(200, {
    ok: true,
    store: "ready",
    razorpay: razorpayMode(env.razorpayKeyId),
    email: env.resendApiKey ? "configured" : "missing",
    dbMs: Date.now() - started,
  });
}
