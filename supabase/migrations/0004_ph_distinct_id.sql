-- 0004 — PostHog's anonymous device id, captured at order time (§8.40),
-- added 2026-09-20.
--
-- 🔴 RUN THIS BEFORE DEPLOYING THE CODE THAT WRITES IT. Migrations here are
-- applied BY HAND in the Supabase SQL editor (README.md, docs/store-go-live.md),
-- so the schema does not move with a push. src/app/api/preorder/create-order
-- inserts this column on every order: if the code ships first, PostgREST answers
-- PGRST204 and EVERY PRE-ORDER RETURNS 500. That is not a hypothetical — read
-- the header of 0003_fb_attrib.sql, where this repo already came within a
-- rebuild of doing it.
--
-- Safe to re-run. Idempotent, nullable, no default, no backfill, no lock of
-- consequence on a table this size.
alter table public.preorders
  add column if not exists ph_distinct_id text;

comment on column public.preorders.ph_distinct_id is
  'PostHog''s own anonymous DEVICE id, read in the browser at order time and passed through create-order. It is what lets the server-sent purchase_confirmed event (fired from the Razorpay webhook, which is the only place a payment is known to be real) join the same person''s funnel as the form events. A device id, never a person: the server event sets $process_person_profile false, so no PostHog person profile is created. Nullable and every consumer copes — orders before 2026-09-20 have none, a visitor with PostHog blocked has none, and the event falls back to the order reference rather than being lost.';
