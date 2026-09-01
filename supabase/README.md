# Supabase, for the pre-order store

The store's database. Three tables, no authentication, and no browser access:
every read and write goes through a Next route handler holding the service-role
key. See `migrations/0001_preorders.sql` for the reasoning inline.

## Setting it up (founder, once)

1. Create a project at supabase.com (free tier is enough: this stores text, and
   a pre-order is a few hundred bytes).
2. Open the SQL editor and run **every file in `migrations/` in filename order**
   (`0001_preorders.sql`, then `0002_…`, then `0003_…`, and so on). Do not stop at
   the first one. This line used to name `0001` alone, which by 2026-09-02 meant a
   rebuilt database silently missed two later migrations: without `0002` a
   full-payment order violates the `balance_status` CHECK, and without `0003`
   every pre-order returns 500 because `create-order` inserts a column that is not
   there. Every file is written to be safe to re-run.
3. Project Settings → API. Copy the **Project URL** and the **service_role**
   key into Vercel as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

The service-role key bypasses RLS and can read every order, so it is a real
secret: it belongs in Vercel's environment variables and in a local `.env`, and
nowhere else. It must never be given a `NEXT_PUBLIC_` name, which is why the
guard test asserts that.

## The one free-tier trap

Supabase pauses a free project after about a week with no requests, and a paused
project fails the next real order. `/api/health` runs a trivial query and a daily
Vercel cron hits it (`vercel.json`), which keeps the project awake without
anyone remembering to.

## Adding an event tier

Insert a row in `event_tiers` from the dashboard, then generate its signed link
with `npm run event-link -- <id>`. See `docs/preorder-events.md`.

## `webhook_events.payload` holds a summary, not the event (2026-08-23, F-05)

The column used to store each Razorpay delivery verbatim and keep it forever, which meant a second
copy of the payer's email, phone and card metadata (network, last4, issuer) accumulating in a table
whose only job is to say "this event id has been handled". None of it was needed for idempotency or
reconciliation.

It now holds an allow-listed summary: the event type, plus the ids and amounts from the payment,
order and refund entities. An allow-list rather than a deny-list, so a field Razorpay adds next year
does not quietly start being kept. Razorpay retains the full event on their side, which is where a
real forensic question should be asked from. The pre-existing rows were pruned by the founder on
2026-08-23; `select count(*) from public.webhook_events where payload ? 'payload'` returns 0.

To be explicit, since it is the question a reviewer asks: **no PAN and no CVV has ever been stored
here or anywhere else in this repo.** Last four and network are not PAN, and keeping them was
permitted — they were simply not needed.

