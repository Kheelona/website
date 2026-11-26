---
title: "D074: the server reports each refund to PostHog as `purchase_refunded`"
type: decision
updated: 2026-11-26
sources: ["the founder's approval in chat, 2026-11-26 (store code, one-by-one sign-off)", "growth-team decision 2026-11-26-website-fixes-before-10-day-review (item 4, K-124)", "src/lib/store/posthog-server.ts", "src/lib/store/fulfil.ts (markRefunded)", "src/app/api/razorpay/webhook/route.ts", "src/lib/tracking/events.ts", "../site/tracking-inventory.md", "D069-openai-ads-measurement.md (the precedent for changing a frozen funnel file by a reviewed patch)", "test/guards/fixtures/authorised-diffs/src__lib__store__fulfil.ts.patch", "test/guards/fixtures/authorised-diffs/src__lib__store__posthog-server.ts.patch"]
---

# D074: the server reports each refund to PostHog as `purchase_refunded`

**Context.** The north star is a reservation that is paid and not refunded, and the ad-spend-per-reservation ceiling has to
be measured on reservations that stay. The Razorpay webhook already knows about refunds: `refund.processed` (deliberately
not `refund.created`, which is only the instruction) calls `markRefunded`, which finds the order by payment id and, for a
refund covering the whole order, sets `status = 'refunded'` so the order leaves the dispatch queue. A partial refund is
logged and the status is left for a human. But no analytics event was sent for either, so PostHog showed every reservation
as one that stayed. The founder approved fixing this on 26 November 2026 (store code, signed off one by one), as item 4 of
the growth team's "website fixes before the 10-day usage review" decision (K-124, which also answers K-88, "is there a
refund webhook").

**Choice.** One server event, `purchase_refunded`, sent to the project PostHog already holds `purchase_confirmed` in, from
the same server code path style (direct to PostHog, flushed before the webhook answers, never throws). It follows
`purchase_confirmed`'s rules on purpose, so the two join on the same order:

| | `purchase_refunded` |
|---|---|
| When | the webhook applies a `refund.processed` to a known order: after the status update for a full refund (refunded amount at least the order amount), and for a partial refund too (the status stays as it is; `partial: true`) |
| Not when | no order matches the payment (logged as today); a refund of no money |
| distinct id | the order's `ph_distinct_id`, else the order reference (as `purchase_confirmed`) |
| Properties | `transaction_id` (the order reference, the join key), `currency: "INR"`, `value` (rupees of this refund, never the order's amount), `tier`, `partial`, `source: "webhook"`, the order's campaign keys flat (`utm_*`, `utm_id`, `placement`), `$process_person_profile: false`, and `env` off production |
| Timestamp | the moment the webhook processes the refund (Razorpay's own `created_at` is not passed; the route is unchanged) |
| Never | a name, phone, email, address, child's age, payment id or refund id; nothing to Meta, GA4 or OpenAI (OpenAI's API has no refund event; this is no new data to an ad platform) |

**How the code changes.** Frozen files change only through their reviewed patches, the D069 pattern. `posthog-server.ts`
gains the name, the pure `purchaseRefundedEvent` and `reportRefundToPostHog`, and its send moves into one private function
both reports call, so the flush cannot be forgotten in one of two copies. `fulfil.ts` (`markRefunded`) selects `tier, utm,
ph_distinct_id` as well and reports after the update, through a small local function whose try/catch keeps an analytics
failure from ever changing the webhook's answer or the order. The webhook route, `markPaid`, `notifyPaid`, the emails, the
database and every return value are unchanged. The registry (`src/lib/tracking/events.ts`) lists it as an **added** event
(`decision: "D074"`), sent by its own code and never by the dispatcher, and tracking inventory §7 says so; the registry
guard gains a section for it, the way D069 and D070 each have one.

**Not in this decision: attribution fields (part b of K-124).** `purchase_confirmed` carries the campaign keys and the
browser's distinct id, but not the referrer domain, the landing path or whether a `gclid`/`fbclid` was present, and nothing
in the code captures them today, so every way to add them needs new data captured and stored. That is a technical and
privacy choice for the founder (the options are in the growth team's K-124 spec: the PostHog session id on the order, a
wider first-touch cookie, or an analyst-side join). **It waits for the founder's choice; nothing for it is built or
changed here.**

**What stays unknown until the founder checks it (read-only).** That the production Razorpay webhook entry for
`store.kheelona.com/api/razorpay/webhook` has **refund.processed** ticked; the test store's webhook ticks it
(test-store setup guide, step 2).

**Check after deploy.** On the test store (`betastore.kheelona.com/?internal=1`): place a Razorpay Test Mode order and refund
it in full in the Test Mode dashboard. PostHog then shows `purchase_refunded` with `env = beta`, `transaction_id` = the order
number, `value` 499, `partial` false and the same distinct id as that order's `purchase_confirmed`, and the test Supabase
row says `status = refunded`.

**Rollback.** Revert the merge commit: refunds go back to database-only; nothing else changes. Events already sent stay in
PostHog.
