# Signups measurable in PostHog (2026-09-20)

**Status: IN PROGRESS.** Running record, appended at every commit (living-documentation law,
founder 2026-09-05). Rollback tag **`pre-signup-analytics-2026-09-20` = `6abeccb`**.

---

## Why this round exists

The founder could not answer three commercial questions: cost per signup, conversion rate, and
whether the ads work. The brief asked for signups in PostHog within seconds, tagged with channel and
campaign, plus a signal for form abandonment, and stated that the site captures no click data.

**Three premises in the brief were wrong, and correcting them changed the work.**

| Brief | Reality |
|---|---|
| "waitlist signups" | **There is no waitlist.** The free list was deleted 2026-08-22 (`42c99e8`) when pre-orders went paid, and `test/preorder-copy.test.ts:81` bans the word. Founder settled it: "signup" = the paid pre-order. |
| "we capture no click data at all" | **Autocapture has run sitewide since 2026-09-19** — every click, change and submit, plus `$pageview`, `$pageleave`, `$exception`. The problem is findability, not absence. |
| "a signup lands in Supabase and nothing else knows" | Half right, and the right half is worse. `preorder_start` and `purchase` already fire. But **`purchase` fires only from Razorpay's client `onPaid` callback**, while the authoritative paid signal is the webhook. |

### The real defect, which nobody had named

**A parent who pays and closes the tab is invisible to PostHog and GA4.** Supabase records the
payment and `reportPurchaseToMeta` sends it server-side from the webhook, so **Meta is the only tool
that cannot miss a sale.** Revenue in PostHog is structurally under-counted by whatever the
client-event loss rate is, and nothing in the repo measured that rate.

### And an attribution bug underneath it

Ads tag `kheelona.com`. `readUtm()` (`PreorderForm.tsx:302`) reads `window.location.search` on
**store.kheelona.com**, and the pre-order CTA crossing hosts forwards no query string. So a tagged
click writes `utm = null` and the internal alert email prints "direct" — which is precisely why
"whether the ads work" was unanswerable.

## Founder decisions, 2026-09-20

| | Decision | Consequence |
|---|---|---|
| Scope | "Signup" = the paid pre-order | No waitlist is built; no settled decision reversed |
| Identity | **Stitch server events to the browsing session** | Reverses the "anonymous forever" default of 2026-09-19. Needs a `/privacy` edit in the same commit (§8.21-c) and a hand-applied migration |
| Attribution | Campaign must survive the apex to store hop | Implemented from PostHog's own session properties rather than link forwarding; see the round's laws |
| Abandonment | A `form started` event, abandonment derived as a funnel drop | No `pagehide` handler: unreliable on mobile Safari, and a number that reads authoritative and is not is worse than none |

---

## Running record

### Commit 0 — this file, and the QA gate BEFORE

The founder asked for a QA gate both before and after. Run on `6abeccb`, before any change:

| Gate | Result |
|---|---|
| `npm test` | **1297 passed / 122 files** |
| `npx tsc --noEmit` | **0** |
| `npx next build` | passes (incl. the token-drift gate) |
| `qa:sweep` (36 route/width combos) | **clean, axe and voice, both widths** |
| `qa:payment` (real Razorpay sandbox, browser) | **clean, 10/10** incl. forged-webhook refusal |

**Two doc-drift findings, both pre-existing and neither a regression.** `docs/qa-report.md:20,1374`
still says "clean 34/34 over 17 routes, **79 accepted**". The real numbers today are **36/36 over 18
routes and 90 accepted** white-on-orange. The 90 was measured before this round touched anything, so
it reflects CTAs added since that line was written (the video section and the store rounds), not a
contrast regression. `qa-report.md:1380` calls 79 "the useful number", so it is corrected rather than
left to mislead the next reader.

Also corrected: `docs/project-state.json` still pinned `tests.count: 1267 / files: 119` from the video
round, stale by 30 tests and 3 files after the PostHog proxy round (`4d693f8`). The living-documentation
law says that file moves in the same commit as the change; it did not, and this is the catch-up.
