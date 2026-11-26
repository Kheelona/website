-- 0005 — PostHog's session id, read from the visitor's own cookie at order time
-- (D075, K-124 part b), added 2026-11-26.
--
-- 🔴 RUN THIS BEFORE DEPLOYING THE CODE THAT WRITES IT. Migrations here are
-- applied BY HAND in the Supabase SQL editor (README.md, docs/store-go-live.md),
-- so the schema does not move with a push. src/app/api/preorder/create-order
-- inserts this column on every order: if the code ships first, PostgREST answers
-- PGRST204 and EVERY PRE-ORDER RETURNS 500. Read the header of 0004_ph_distinct_id.sql
-- and of 0003_fb_attrib.sql, where this repo came within a rebuild of doing it.
-- Run it in the TEST project first (the test store's), then in production.
--
-- Safe to re-run. Idempotent, nullable, no default, no backfill, no lock of
-- consequence on a table this size.
alter table public.preorders
  add column if not exists ph_session_id text;

comment on column public.preorders.ph_session_id is
  'PostHog''s own anonymous SESSION id, read on the server at order time from the visitor''s existing PostHog cookie and passed through create-order. It lets the server-sent purchase_confirmed event carry $session_id, so PostHog attributes the sale to that visit''s own entry referrer, landing path, click ids and UTMs. A random id, never a person: same class as ph_distinct_id. Nullable and every consumer copes — orders before 2026-11-26 have none, a visitor with PostHog blocked has none, and the event simply leaves $session_id out.';
