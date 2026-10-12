---
title: "ADR-005: The offer on marketing pages follows the live store mode through a cached read (ISR), never the count"
type: adr
updated: 2026-10-12
sources:
  - ../../product/pricing.md ("How the price is decided", "Sell-out sweep")
  - ../../site/gate-a-open-items.md (B8 working default)
  - ../../decisions/D028-price-wording.md, ../../decisions/D037-delivery-date-in-schema.md
  - src/lib/store/mode.ts, src/config/site.ts, src/app/(site)/products/kheelu/_components/ViewContentTracker.tsx (read 2026-10-12)
  - node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md
  - node_modules/next/dist/docs/01-app/03-api-reference/04-functions/unstable_cache.md (line 7), generate-static-params.md (lines 292-310)
  - ../../qa/architecture-review-2026-10-12.md (N13, N14)
---

# ADR-005: The offer follows the live mode

**Status:** accepted by the Architect, 2026-10-12 (implements working default B8; the founder may
override it).

## Context

The store decides token or full mode per request from a live count (`preorderMode()` in
`src/lib/store/mode.ts`); the count never leaves that function. Marketing pages today are static and
show token text forever; the legacy sell-out sweep is a manual checklist that has missed surfaces
before ([pricing](../../product/pricing.md#sell-out-sweep-826-g)). B8's working default: "Read-only
price block that follows the live mode; the count is never shown." D028 fixes the wording per mode.

## Options

1. Static token text plus the manual sweep (today). Goes stale the day the 500th unit sells; Merchant
   and answer-engine prices drift.
2. A client island that fetches `/api/health` and swaps text. Crawlers see the token text forever,
   and the swap shifts layout.
3. **Server-rendered offer from `preorderMode()` through a cached function, pages revalidating every
   300 seconds (incremental static regeneration).**

## Choice

Option 3.

- `src/lib/offer/get-offer.ts` wraps the frozen `preorderMode(storeEnv())` in `unstable_cache` (key
  `offer-mode`, `revalidate: 300`, tag `offer`). With no store environment (local, CI) it returns
  `token` without a query; any failure reads as token, as `mode.ts` already does.
- `src/lib/offer/offer.ts` turns the mode into the **offer view model**: `mode`, `headlinePaise`
  (`LAUNCH` in token mode, `FULL` in full mode), formatted `token`, `balance`, `headline`, `full`, `mrp`,
  the price sentence and sticky-bar lines (from content), and `availabilityStarts`
  (`2026-11-15`, D037).
- Pages that render a price export `revalidate = 300` (statically analysable). The prerendered HTML,
  JSON-LD, `llms.txt` and `pricing.md` follow a mode flip within about ten minutes on a visited page:
  ISR regenerates on the first request after the window and serves that request the stale copy, and the
  cached mode inside can itself be up to 300 s old; a page nobody visits stays stale until someone does
  (QA review N14). No wrong charge is possible: the store decides per request and refuses a stale token
  order. The sell-out runbook therefore ends with a **Redeploy** of the production deployment once
  `/api/health` shows `full` **and 300 s have passed** (`unstable_cache` persists across deployments, so a
  Redeploy inside the window can prerender the cached `token` again; amended at the wave-2 close,
  2026-10-12), which rebuilds every page with the new mode in minutes and no code change
  ([architecture §15.5](../architecture.md#155-gate-b-release-to-production-and-rollback), step 9).
- **Cache Components stay off** (QA review N13). Next 16 says `unstable_cache` "has been replaced by
  `use cache`" (`unstable_cache.md:7`), but `use cache` belongs to the Cache Components model, which
  would change the store's `force-dynamic` behaviour and every route's caching at once, and refuses an
  empty `generateStaticParams` (`generate-static-params.md:310`), which the empty campaign route needs.
  The previous model is documented and supported in 16.3.4 (`caching-without-cache-components.md`); a
  guard (`test/guards/next-config.test.ts`) fails if `next.config.ts` gains a `cacheComponents` key, so
  any move is a deliberate decision with its own ADR.
- **The Meta `ViewContent` value comes from `headlinePaise / 100`**, passed from the page to the
  tracker. In token mode that is exactly today's `LAUNCH_AMOUNT_PAISE / 100` = 4999, so the payload is
  unchanged; at sell-out it becomes 7999, which is what the manual sweep would have done.

## Consequences

- Marketing pages become ISR pages, not dynamic: the route manifest must show them as static with a
  revalidate time (acceptance check in task 2.1, confirmed at wave close), and the store keeps
  `force-dynamic`.
- One Supabase count per page per five minutes at most, from the function region
  ([ADR-009](ADR-009-region-and-supabase-move.md)).
- If Supabase is paused or down, pages show token text, the cheaper price, which matches the store's
  own failure rule.
- The sell-out sweep shrinks to: verify the flip on `/api/health`, Redeploy, then spot-check the pages.
