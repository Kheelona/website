---
title: "D075: the order remembers the PostHog session id, and `purchase_confirmed` carries it as `$session_id`"
type: decision
updated: 2026-11-26
sources: ["the founder's choice in chat, 2026-11-26 (store code, explicit sign-off, option 1 of three)", "growth-team decision 2026-11-26-website-fixes-before-10-day-review (Update K-124(b))", "src/app/api/preorder/create-order/route.ts", "src/lib/tracking/ph-session-id.ts", "src/lib/store/db.ts", "src/lib/store/posthog-server.ts", "src/lib/tracking/events.ts", "supabase/migrations/0005_ph_session_id.sql", "../site/tracking-inventory.md", "D074-refund-event.md (part a of the same card, K-124)", "D069-openai-ads-measurement.md (the precedent for changing a frozen file by a reviewed patch)", "test/guards/fixtures/authorised-diffs/src__app__api__preorder__create-order__route.ts.patch", "test/guards/fixtures/authorised-diffs/src__lib__store__db.ts.patch", "test/guards/fixtures/authorised-diffs/src__lib__store__posthog-server.ts.patch"]
---

# D075: the order remembers the PostHog session id, and `purchase_confirmed` carries it as `$session_id`

**Context.** `purchase_confirmed` already carries the order's campaign keys (`utm_*`, `utm_id`, `placement`, from the
first-touch `kh_utm` cookie) and the browser's anonymous device id. It does not say where the visit came from: the
referrer's domain, the landing path, or whether a `gclid` or `fbclid` was present. Nothing in the store captures those, so
every way to get them meant capturing and storing new data, which the founder decided on 26 November 2026 (K-124 part b,
store code, signed off explicitly): of the three options in the growth team's spec, **option 1**.

**Why option 1.** PostHog already records each visit's entry referrer, landing path, `gclid`/`fbclid` and UTMs on the
visit's **session** (the `$entry_*` session properties behind its web-analytics channels). If the server event names the
browser's session, PostHog attributes the sale to that session's own entry data. No new cookie, no change to what the
site tells a visitor, no new place that holds a referrer or a click id: the order stores one random, pseudonymous id of the
same class as the `ph_distinct_id` it already stores.

**Choice.**

| | |
|---|---|
| Where it is read | `create-order`, on the server, from the visitor's existing PostHog cookie (`ph_<project key>_posthog` on `.kheelona.com`; its `$sesid` is `[last activity, session id, start]`). The client sends nothing new and `PreorderForm` is untouched |
| Validation | the session id must be a UUID-shaped string (PostHog's are UUIDv7) of at most 64 characters; anything else, a missing cookie, bad JSON or the wrong shape reads as none. It can never refuse or delay an order |
| Where it is stored | `public.preorders.ph_session_id text`, nullable, no default, no backfill (migration `0005_ph_session_id.sql`) |
| What is sent | `purchase_confirmed` gains `$session_id` **only when the order has one**; nothing else in its payload changes |
| Not sent | `purchase_refunded` does **not** carry it: a refund days later, tied to the sale's session, would stretch that session in PostHog |
| Never | a name, phone, email, address or child detail; nothing new to Meta, GA4 or OpenAI |

**Limits, stated plainly.** Orders whose browser blocked PostHog have no session id (they keep their UTMs, as today).
Orders placed before the migration and the deploy have none. The session id is read when the order is created, so it is
the session the parent was in at that moment; PostHog's own session rules (30 minutes idle, 24 hours long) apply.

**How the code changes.** Frozen files change only through reviewed patches (the D069 and D074 pattern): the `create-order`
route gains one import and one inserted field, `src/lib/store/db.ts` gains one optional field on `PreorderRow`, and
`posthog-server.ts` gains one conditional property. The reader is a new small module outside the frozen folders. The
`checkout-freeze` guard gains a narrow, named allowance for exactly one new file in a frozen folder, the migration, citing
this decision (the guard's own `RETIRED` map is its model); no other assertion changed. The registry lists `$session_id` as
an optional addition to `purchase_confirmed`, the way it lists `env`, and tracking inventory §7 says so.

**The migration is applied by hand, and BEFORE the code.** Migrations here run in the Supabase SQL editor (README,
`docs/store-go-live.md`), so the schema does not move with a deploy. `create-order` inserts the column on every order: if
the code shipped first, PostgREST would answer PGRST204 and every pre-order would return 500. Order: the test project (the
test store's), a Test Mode order on the test store, then the production project, then merge.

**Check after deploy.** On the test store: one Razorpay Test Mode order. PostHog then shows `purchase_confirmed` with
`env = beta` and a `$session_id`, and that session's entry properties (referrer, landing path, any click id, UTMs).

**Rollback.** Revert the merge commit. The extra column stays (nullable, unused). Events already sent stay in PostHog.
