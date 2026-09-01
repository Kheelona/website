import { storeEnv, razorpayMode, missingStoreEnv } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { preorderMode } from "@/lib/store/mode";
import { rateLimit, clientKey } from "@/lib/store/rate-limit";
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

/** Generous: a person refreshing this on a phone, plus the daily cron, plus any
 *  uptime checker, should never meet it. A script counting our database for us
 *  should (F-07). */
const CHECKS_PER_MINUTE = 20;

export async function GET(request: Request) {
  /* This is the only public endpoint that touches Postgres twice per call, and
     it was unthrottled. Nothing here is secret and nothing here writes, so the
     risk was small: an anonymous caller running our database bill up, and a
     free way to watch our operational state change. Cheap to close. */
  if (!rateLimit(`health:${clientKey(request)}`, CHECKS_PER_MINUTE).allowed) {
    return json(429, { ok: false, store: "rate-limited" });
  }

  const env = storeEnv();
  if (!env) {
    /* Names, never values. Turns "why is the store off" into one request
       instead of a paste-and-redeploy guessing loop. */
    return json(503, { ok: false, store: "not-configured", missing: missingStoreEnv() });
  }

  const started = Date.now();
  const { error } = await db(env)
    .from("event_tiers")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("[health] database unreachable", error);
    return json(503, { ok: false, store: "database-unreachable" });
  }

  /* The MODE, never the count (§8.26, founder: no public counter). This field
     is the phone-checkable trigger for the sell-out copy sweep: the day it
     says "full", the static marketing pages are a manual task away from true. */
  const preorder = await preorderMode(env);

  return json(200, {
    ok: true,
    store: "ready",
    preorder,
    razorpay: razorpayMode(env.razorpayKeyId),
    email: env.resendApiKey ? "configured" : "missing",
    /* PRESENCE ONLY, never the value (added 2026-09-02). The Conversions API
       token is optional, so a missing one and a working one look identical from
       outside: the store behaves the same and, until this, the only way to tell
       was to wait for a customer to buy something and then read Events Manager.
       That question cost two cycles in one week, because a Vercel variable only
       applies to deployments created AFTER it changes, so a rotation without a
       redeploy silently keeps the old value. This turns it into one curl.
       Same shape as `email` above, and for the same reason. */
    capi: env.metaCapiToken ? "configured" : "missing",
    dbMs: Date.now() - started,
  });
}
