# Supabase, for the pre-order store

The store's database. Three tables, no authentication, and no browser access:
every read and write goes through a Next route handler holding the service-role
key. See `migrations/0001_preorders.sql` for the reasoning inline.

## Setting it up (founder, once)

1. Create a project at supabase.com (free tier is enough: this stores text, and
   a pre-order is a few hundred bytes).
2. Open the SQL editor, paste `migrations/0001_preorders.sql`, run it.
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
