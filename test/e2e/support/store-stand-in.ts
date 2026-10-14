import { createServer, type Server } from "node:http";
import { sign } from "../../../src/lib/store/signing";
import type { Route } from "./routes";

/* The store database's read-only stand-in (task 6.1, shared since 6.3 by store-secondary.spec.ts and axe.spec.ts).
 *
 * The signed event page /e/<tier> sells only with a store database, which no local run, CI or beta has (D051). This is
 * PostgREST as supabase-js reads it, for one tier and no orders: rows as a JSON array, counts in Content-Range, every
 * write refused (503), nothing else answered. Start the production server with its environment (fake values only,
 * never a real key; nothing is ever submitted):
 *
 *   KH_E2E_SUPABASE_STUB_PORT=<port> SUPABASE_URL=http://127.0.0.1:<port> SUPABASE_SERVICE_ROLE_KEY=kh-e2e-stub \
 *   RAZORPAY_KEY_ID=rzp_test_khe2e RAZORPAY_KEY_SECRET=kh-e2e RAZORPAY_WEBHOOK_SECRET=kh-e2e \
 *   STORE_SIGNING_SECRET=kh-e2e-signing npx playwright test test/e2e/store-secondary.spec.ts test/e2e/axe.spec.ts
 *
 * (Playwright's web server inherits them.) Without them the blocks that need it print as pending.
 *
 * Two specs on one port, in parallel workers: `ensureStandIn()` reuses a stand-in already answering on the port
 * (another worker's), starts one only when none answers, and never closes it (the listener is unref'd and ends with its
 * worker), so one spec finishing can never pull the database from under the other. Call it before each test. */

export const STAND_IN_PORT = Number(process.env.KH_E2E_SUPABASE_STUB_PORT ?? 0);

/** True when the server under test was started against the stand-in (the environment above). */
export const STAND_IN_ON =
  STAND_IN_PORT > 0 && process.env.SUPABASE_URL === `http://127.0.0.1:${STAND_IN_PORT}` && Boolean(process.env.STORE_SIGNING_SECRET);

export const STAND_IN_PENDING =
  "pending: the signed event page sells only with a store database; start the server with the read-only stand-in's " +
  "environment (test/e2e/support/store-stand-in.ts)";

export const STAND_IN_TIER = "kh-e2e-expo";
export const STAND_IN_TIER_ROW = {
  id: STAND_IN_TIER,
  label: "Bangalore expo price",
  amount_paise: 9_900,
  cap: null,
  expires_on: null,
  active: true,
} as const;

/** The signed event page's route on the store host (the signature from STORE_SIGNING_SECRET, so call it in a test). */
export function signedEventRoute(): Route {
  return {
    id: "event-signed",
    host: "store",
    path: `/e/${STAND_IN_TIER}?sig=${sign(process.env.STORE_SIGNING_SECRET!, "event-link", STAND_IN_TIER)}`,
    mockup: null,
    buybar: false,
    chrome: false,
    title: null,
    description: null,
    template: "store",
  };
}

function listen(port: number): Promise<Server> {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://stub");
    const json = (status: number, body: unknown, headers: Record<string, string> = {}) => {
      res.writeHead(status, { "content-type": "application/json", ...headers });
      res.end(req.method === "HEAD" ? undefined : JSON.stringify(body));
    };
    if (req.method !== "GET" && req.method !== "HEAD") return json(503, { message: "e2e stand-in: read only" });
    if (url.pathname === "/rest/v1/event_tiers") {
      const id = url.searchParams.get("id")?.replace(/^eq\./, "");
      return json(200, [STAND_IN_TIER_ROW].filter((r) => r.id === id));
    }
    if (url.pathname === "/rest/v1/preorders") return json(200, [], { "content-range": "*/0" });
    return json(404, { message: "e2e stand-in: no such table" });
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

/** Whether a stand-in already answers on the port, with this file's tier. */
async function answers(port: number): Promise<boolean> {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/rest/v1/event_tiers?id=eq.${STAND_IN_TIER}`);
    const rows = (await res.json()) as { id?: string }[];
    return res.ok && rows.length === 1 && rows[0].id === STAND_IN_TIER;
  } catch {
    return false;
  }
}

/** Makes sure a stand-in answers on the port: reuses one that does, else starts one (unref'd, never closed). */
export async function ensureStandIn(port: number = STAND_IN_PORT): Promise<void> {
  if (await answers(port)) return;
  try {
    (await listen(port)).unref();
  } catch (error) {
    // Another worker started one between the check and the listen: use it.
    if ((error as NodeJS.ErrnoException).code !== "EADDRINUSE" || !(await answers(port))) throw error;
  }
}
