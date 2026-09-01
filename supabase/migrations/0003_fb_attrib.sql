-- 0003 — Meta attribution captured at order time (§8.30-l), added 2026-09-02.
--
-- RECORDED LATE, ON PURPOSE NOTED. The column was created by hand in the
-- Supabase SQL editor on 2026-09-02 and existed in production for a day before
-- this file did. That gap is the bug this file closes: rebuilding the database
-- from this repo would have produced a schema without it, and
-- src/app/api/preorder/create-order/route.ts inserts into it on every order, so
-- PostgREST would have answered PGRST204 and EVERY pre-order would have
-- returned 500. Safe to re-run against production, which already has it.
alter table public.preorders
  add column if not exists fb_attrib jsonb;

comment on column public.preorders.fb_attrib is
  'Meta attribution captured at order time (§8.30-l): the _fbp and _fbc cookies, the client IP and the user agent, all read server-side from the request that created the order. Nullable: every row before 2026-09-02 has none, and a visitor with the pixel blocked legitimately has none.';
