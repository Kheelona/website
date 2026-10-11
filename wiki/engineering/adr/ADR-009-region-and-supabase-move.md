---
title: "ADR-009: Server functions in Mumbai (bom1) now; move Supabase to Mumbai before launch with env names unchanged"
type: adr
updated: 2026-10-12
sources:
  - ../../decisions/D047-vercel-build-and-data-regions.md
  - ../../research/posthog-audit.md (issue 7: the store is the slowest page; store LCP 3.3 s on phones)
  - ../../site/checkout.md (store page force-dynamic; mode count per request)
  - "https://vercel.com/docs/functions/configuring-functions/region (vercel.json regions; Hobby one region), fetched 2026-10-12"
  - node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/preferredRegion.md (deprecated)
  - ../lessons.md (§4 migrations applied by hand before code; fastest safe stop)
---

# ADR-009: Function region and the Supabase move

**Status:** accepted by the Architect, 2026-10-12. The Supabase move itself is the founder's (D047:
"will switch it before we ship the product").

## Context

Vercel functions run in `iad1` (Washington) by default; the store page is `force-dynamic` and counts
paid orders on every request; the store was the slowest page (audit issue 7). Supabase is in
`ap-southeast-2` (Sydney) until the founder moves it (D047). Most buyers are in India. Next 16 deprecates
the per-route `preferredRegion`; Vercel reads `regions` from `vercel.json` (Hobby: one region).

Rough network paths for one store request (one count query): today India → `iad1` → Sydney and back;
with `bom1`, India → Mumbai → Sydney and back, a shorter path on both legs; after the move, India →
Mumbai → Mumbai. These are geography-based expectations, not measurements; QA measures TTFB from India
on beta before and after.

## Options

1. Stay in `iad1` until Supabase moves. Keeps the slowest path for weeks.
2. **`"regions": ["bom1"]` in `vercel.json` now (it also applies to beta), Supabase moved to
   `ap-south-1` (Mumbai) before launch.**
3. Sydney (`syd1`) functions next to today's database. Optimises for a temporary state; worse for the
   user leg from India.

## Choice

Option 2. The beta's own Supabase project is created in `ap-south-1`, which rehearses the move.

**The move (founder, before Gate B; runbook in [architecture §15.6](../architecture.md#156-supabase-move-to-mumbai-d047)):**
create a new project in `ap-south-1`; apply `supabase/migrations/0001-0004` by hand in order; keep RLS
on with zero policies; pause new orders by removing `RAZORPAY_KEY_ID` from Production and redeploying
(the fastest safe stop); copy the three tables' data (`preorders`, `event_tiers`, `webhook_events`);
check row counts and the paid count; set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (same names) to
the new project; restore `RAZORPAY_KEY_ID`; redeploy; check `/api/health`; keep the old project paused,
not deleted, for 30 days. The `/privacy` order-data location is a content value
(`ORDER_DATA_LOCATION`) that stays a placeholder until the founder confirms the move, so the
production build cannot ship the wrong country.

## Consequences

- The daily `/api/health` cron keeps the new free-tier project awake, as today.
- Webhooks, the store host and every env var name stay as they are.
- If the move slips past launch, `/privacy` must name Australia (Sydney) as the order-data location;
  the placeholder forces that choice to be made explicitly.
