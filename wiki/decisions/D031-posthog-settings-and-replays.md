---
title: "D031: PostHog dashboard settings approved; the paid-ad replays expire"
type: decision
updated: 2026-10-11
sources: ["founder's answer to C13, 2026-10-11 05:20 PDT", "https://posthog.com/docs/session-replay/recording-retention (via PostHog docs-search, 2026-10-11)", "https://github.com/PostHog/posthog/issues/43030 (LTS removed; collections no longer extend retention)", ../research/posthog-audit.md]
---

# D031: PostHog settings and replays (C13)

**Context.** [C13](../open-questions.md): four PostHog dashboard settings proposed by the Phase 1
[PostHog audit](../research/posthog-audit.md) (setup unfinished), and the paid-ad replays
(2026-09-19 to 09-23), which expire from 2026-10-19 under the project's 30-day retention.

**Facts checked before asking (2026-10-11).** A retention change applies only to recordings made
after it; existing recordings keep their original period. Adding a recording to a collection or
sharing it no longer extends its life. The only way to keep an existing recording is a manual
"Export as JSON" in the app. Events are retained separately and are not affected. The Razorpay
sheet is a cross-origin frame, which replays most likely show blank (inference).

**Choice.**
1. Apply all four settings in project 617632 (dashboard only; no event name, ID or tracking code
   changes; [tracking inventory](../site/tracking-inventory.md) parity is untouched):
   - Web analytics conversion goal: `purchase_confirmed`.
   - Revenue analytics on `purchase_confirmed.value`, currency INR.
   - Test-account filter adds `$virt_is_bot` is not true (keeps the internal cohort 580233 rule).
   - Authorised URLs add `https://store.kheelona.com`.
   Applied by the main session through the PostHog connector after the human-session recompute
   agents finish, so their figures are not affected mid-run.
2. The paid-ad replays are allowed to expire. No export.

**Why.** The settings make the post-launch reports (Phase 8) read conversions and revenue
directly and drop bot visits by default. The replays add little: the audit's 26 drop-off
timelines are rebuilt from events, which stay, and the payment step cannot be seen in a replay.

**Approved by.** Founder. **Date.** 2026-10-11.

## Applied (2026-10-11 12:25 UTC, main session, PostHog connector)

- Marketing-analytics conversion goal "Purchase (server, purchase_confirmed)" on `purchase_confirmed`,
  counts as customer (`marketing-analytics-create-conversion-goal`). The Web analytics dashboard's
  own "conversion goal" is a per-view UI filter, not a stored setting: pick `purchase_confirmed`
  there when viewing (PostHog docs, web-analytics/conversion-goals, via docs-search 2026-10-11).
- Revenue analytics: event `purchase_confirmed`, revenue property `value` (rupees, not minor units:
  `currencyAwareDecimal: false`), static currency INR; reporting currency INR (project and revenue
  config). Verified: the charge view returns 2 charges, ₹998, INR.
- Test-account filter: cohort 580233 `not_in` (kept) + `$virt_is_bot` `is_not` `true`.
- Authorised URLs: https://kheelona.com, https://store.kheelona.com.
- No event name, ID or tracking code changed.
