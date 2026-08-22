-- Full-payment tier (2026-08-23, §8.26).
--
-- After the first 500 capped units, a pre-order is the launch price paid in
-- full, so such an order never owes a balance. 'none' keeps those rows out of
-- the balance-due ops query forever, instead of relying on a human to filter
-- tier != 'full' — the kind of memory-based control §8.25-ee exists to remove.
--
-- ADDITIVE ONLY. No row is touched: old code never writes 'none', new code
-- writes it only for the new tier, so this is safe to run before the deploy
-- (and must be: the code that needs it ships after the constraint exists).
--
-- Rebuilt as NOT VALID + VALIDATE so the ADD takes no full-table scan under an
-- exclusive lock. The table is small today, but a migration pattern is a
-- precedent, and this one is safe at any size.

alter table public.preorders
  drop constraint if exists preorders_balance_status_check;

alter table public.preorders
  add constraint preorders_balance_status_check
  check (balance_status in ('due', 'link_sent', 'paid', 'none')) not valid;

alter table public.preorders
  validate constraint preorders_balance_status_check;

comment on column public.preorders.balance_status is
  'Token orders: due -> link_sent -> paid, driven by the manual balance run. Full-payment orders (tier=''full''): none, always — the whole price was paid upfront and nothing may ever send them a balance link.';
