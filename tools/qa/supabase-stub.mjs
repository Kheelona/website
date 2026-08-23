#!/usr/bin/env node
/** A minimal Supabase REST stand-in, for local visual QA of store pages.
 *
 *  The store's happy paths need two answers a DUMMY .env cannot give: the
 *  `event_tiers` row a partner page resolves, and the paid-orders count the
 *  mode gate reads. This serves exactly those, so `npx next start` with
 *  SUPABASE_URL=http://127.0.0.1:54321 renders the real pages for qa:shot /
 *  qa:axe / qa:text instead of their not-configured states. Read-only by
 *  construction: any write hits the 404 branch, so a stray create-order in a
 *  local session cannot invent an order that looks real.
 *
 *  Usage:
 *    node tools/qa/supabase-stub.mjs &          # port 54321
 *    STUB_PAID_COUNT=500 ... # flips the public store to full mode
 *
 *  Then start the app with the stub env (all six store vars set; Razorpay
 *  values stay fake, which is fine for rendering — checkout would fail at the
 *  payment sheet, which local QA never opens).
 */
import { createServer } from "node:http";

const PORT = Number(process.env.STUB_PORT ?? 54321);
const PAID_COUNT = Number(process.env.STUB_PAID_COUNT ?? 12);

/** The tiers local QA needs to exist. Expiry far out: the stub tests the
 *  page, not the calendar — tiers.test.ts owns the expiry boundary. */
const EVENT_TIERS = [
  {
    id: "ideabaaz",
    label: "Ideabaaz exclusive price",
    amount_paise: 9_900,
    cap: null,
    expires_on: "2099-01-01",
    active: true,
  },
  {
    id: "blr-oct-expo",
    label: "Bangalore expo price",
    amount_paise: 9_900,
    cap: 100,
    expires_on: "2099-01-01",
    active: true,
  },
];

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  const method = req.method ?? "GET";
  res.setHeader("content-type", "application/json");

  if (url.pathname === "/rest/v1/event_tiers" && (method === "GET" || method === "HEAD")) {
    const id = url.searchParams.get("id")?.replace(/^eq\./, "");
    const rows = EVENT_TIERS.filter(
      (tier) => (id ? tier.id === id : true) && tier.active,
    );
    res.end(JSON.stringify(rows));
    return;
  }

  if (url.pathname === "/rest/v1/preorders" && (method === "GET" || method === "HEAD")) {
    /* HEAD is a head-count (the mode gate and event caps); the answer travels
       in content-range, exactly as PostgREST sends it. */
    const orderRef = url.searchParams.get("order_ref")?.replace(/^eq\./, "");
    if (method === "GET" && orderRef) {
      /* A single order, for the confirmation page. Deliberately fake values:
         this stub renders pages, and no real customer's row belongs in a local
         QA fixture. */
      res.end(
        JSON.stringify([
          {
            id: 1,
            order_ref: orderRef,
            tier: process.env.STUB_TIER ?? "launch",
            amount_paise: Number(process.env.STUB_AMOUNT_PAISE ?? 49_900),
            status: process.env.STUB_STATUS ?? "paid",
            parent_name: "Test Parent",
            phone: "9000000000",
            email: "test@example.com",
            child_age: "3",
            wa_consent: true,
            terms_accepted_at: "2026-08-23T00:00:00Z",
            address: null,
            rzp_order_id: "order_stub",
            rzp_payment_id: "pay_stub",
            balance_status: "due",
            utm: null,
            created_at: "2026-08-23T00:00:00Z",
            paid_at: "2026-08-23T00:00:00Z",
          },
        ]),
      );
      return;
    }
    res.setHeader("content-range", `0-0/${PAID_COUNT}`);
    res.end(JSON.stringify([]));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: `stub: no route for ${method} ${url.pathname}` }));
}).listen(PORT, () => {
  console.log(`supabase stub on http://127.0.0.1:${PORT} (paid count ${PAID_COUNT})`);
});
