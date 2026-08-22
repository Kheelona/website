-- Kheelona pre-order store, initial schema (2026-08-22, §8.25).
--
-- Design rules this file follows, and why:
--
--  * NO anon or authenticated access, at all. Every read and write goes through
--    a Next route handler holding the service-role key. RLS is enabled on all
--    three tables with ZERO policies, which means: the service role bypasses it
--    (by design in Postgres, as table owner), and every other role gets nothing
--    even if a key leaks or someone wires up the browser client by mistake.
--    Grants are revoked explicitly as well, because "no policy" and "no grant"
--    fail closed in two independent ways and this table holds home addresses of
--    children's families.
--  * Money is an INTEGER COUNT OF PAISE, never a float and never rupees.
--    Razorpay's API speaks paise integers, so storing anything else would mean
--    converting twice and rounding somewhere. A check constraint keeps it
--    positive.
--  * bigint identity primary keys, not uuid v4: sequential keys keep index
--    inserts local instead of scattering them. Nothing external ever sees these
--    ids. What a parent quotes at us is `order_ref`, which is generated in the
--    application so it can be short, unambiguous, and safe to read out loud.
--  * timestamptz everywhere. A dispatch queue ordered by a naive timestamp is a
--    bug waiting for a timezone.

create table if not exists public.preorders (
  id bigint generated always as identity primary key,

  -- What the parent quotes at us. Unique, human-readable, never guessable in
  -- sequence (generated with random characters in the application).
  order_ref text not null unique,

  -- Which price this order was taken at. 'launch' is the public tier; event
  -- tiers are rows in event_tiers, so a new event needs no deploy.
  tier text not null default 'launch',
  amount_paise integer not null check (amount_paise > 0),

  status text not null default 'created'
    check (status in ('created', 'paid', 'failed', 'refunded', 'cancelled')),

  -- Collected before payment, so an abandoned payment is still a lead we can
  -- follow up honestly.
  parent_name text not null,
  phone text not null,
  email text not null,
  child_age text not null,

  -- Consent is a fact with a time, not a boolean: "did they agree, and when"
  -- is the question that matters if it is ever asked.
  wa_consent boolean not null default false,
  terms_accepted_at timestamptz,

  -- Collected AFTER payment (flow decision: contact, pay, then address), so it
  -- is nullable by design and its absence is a real state we chase.
  address jsonb,

  rzp_order_id text unique,
  rzp_payment_id text,

  balance_status text not null default 'due'
    check (balance_status in ('due', 'link_sent', 'paid')),

  -- Where the order came from. Silent capture, no field on the form.
  utm jsonb,

  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);

comment on table public.preorders is
  'One row per pre-order attempt. status=created rows are abandoned payments with contact details, which is why details are collected before the pay button.';
comment on column public.preorders.amount_paise is
  'What was actually charged, in paise. Resolved server-side from the tier, never accepted from the client.';

-- The dispatch queue: served in the order they paid. Partial, because unpaid
-- rows are never in it, and unpaid rows will outnumber paid ones.
create index if not exists preorders_paid_queue_idx
  on public.preorders (paid_at)
  where status = 'paid';

-- Counting redemptions per tier (event caps) hits exactly this shape.
create index if not exists preorders_tier_paid_idx
  on public.preorders (tier)
  where status = 'paid';

-- Support looking someone up by what they can tell us on WhatsApp.
create index if not exists preorders_phone_idx on public.preorders (phone);
create index if not exists preorders_email_idx on public.preorders (email);

-- Which paid orders still owe us the balance, and which have no address yet:
-- the two operational questions before a dispatch run.
create index if not exists preorders_balance_due_idx
  on public.preorders (balance_status)
  where status = 'paid';

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists preorders_touch_updated_at on public.preorders;
create trigger preorders_touch_updated_at
  before update on public.preorders
  for each row execute function public.touch_updated_at();

-- Razorpay retries a webhook until it gets a 2xx, and a retry must not send a
-- second acknowledgement email or double-count a tier. The event id is the
-- natural key: inserting it IS the idempotency check.
create table if not exists public.webhook_events (
  id text primary key,
  event_type text,
  order_ref text,
  received_at timestamptz not null default now(),
  payload jsonb
);

comment on table public.webhook_events is
  'Razorpay event ids already processed. The primary key is the idempotency guard: a duplicate insert fails and the handler returns 200 without acting twice.';

-- Event pricing. Editable from the Supabase dashboard so a booth on Saturday
-- does not need a Friday deploy. A leaked link dies on cap or expiry.
create table if not exists public.event_tiers (
  id text primary key,
  label text not null,
  amount_paise integer not null check (amount_paise > 0),
  cap integer check (cap is null or cap > 0),
  expires_on date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.event_tiers is
  'Per-event pre-order pricing. A signed link carries the id; the amount is always read from here, never from the request.';

-- Fail closed, twice: no policies and no grants.
alter table public.preorders enable row level security;
alter table public.webhook_events enable row level security;
alter table public.event_tiers enable row level security;

revoke all on public.preorders from anon, authenticated;
revoke all on public.webhook_events from anon, authenticated;
revoke all on public.event_tiers from anon, authenticated;
