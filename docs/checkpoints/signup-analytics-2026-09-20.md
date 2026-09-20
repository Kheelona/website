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

### Commit 1 — the whole change, and the gate after

Laws **§8.40 a-i**. One commit, because §8.21-c binds the measurement change to its `/privacy`
sentence and the rest of it is not separable without leaving the funnel half-wired.

| Gate | Before (`6abeccb`) | After |
|---|---|---|
| `npm test` | 1297 / 122 files | **1335 / 123 files** |
| `npx tsc --noEmit` | 0 | **0** |
| `npx next build` | passes | **passes** |
| `qa:sweep`, 36 combos | clean, 90 accepted | **clean, 90 accepted** |
| `qa:payment`, real sandbox | clean 10/10 | **clean 10/10** |

The accepted-contrast count is unchanged at 90, which is the useful part: eight CTAs gained an
attribute and none of them gained a contrast pair.

#### What shipped

1. **`purchase_confirmed`, sent by the server** (`src/lib/store/posthog-server.ts`), from
   `notifyPaid()` beside `reportPurchaseToMeta`. The browser event stays; this one cannot be missed.
   Named differently on purpose (§8.40-c) because PostHog's only dedup key is a `uuid` the SDK
   requires to be a real UUID, and the gap between the two counts is itself the loss rate nobody
   could measure before.
2. **Stitching** via `ph_distinct_id` on the order row, with `$process_person_profile: false` so the
   visitor stays anonymous while funnels still work. Falls back to `order_ref` rather than dropping
   the sale.
3. **Campaign read from PostHog's session**, not the URL (§8.40-f). This is the fix for
   "do the ads work?".
4. **`preorder_form_started`**, one `onChange` on the `<form>`, fired once per mount.
5. **`data-ph-capture-attribute-cta`** on the eight pre-order CTAs, so autocapture can tell the hero
   from the navbar from the finale.
6. **`/privacy`** carries the stitching disclosure, in the same commit.

#### Verification notes

`posthog-node@5.52.4` added with `--save-exact`; the lockfile diff was read rather than trusted —
**one package added, nothing moved, `npm audit` 0.**

Four SDK facts were read out of the installed code rather than its docs, and two of them would have
failed silently: `getSessionProperty` reads `sessionPersistence.props[k]`, so campaign keys are the
raw `utm_*` names and **not** `$session_entry_utm_*`; `uuid` must be a real UUID; `flush()` is
required before a serverless function returns; and `data-ph-capture-attribute-*` is promoted to a
top-level property while a plain `data-` attribute is not.

**Mutation-tested rather than trusted**, because the form wiring was written before its tests and
tests-after prove less: dropping the `onChange`, firing on every change instead of once, dropping the
device id, and reverting the campaign to URL-first each failed with the intended message, and the
restored file passed. The server module's two critical guards (the flush, and the event name) were
mutation-tested the same way.

#### 🔴 The one thing no gate here can clear

**`qa:payment` passing does not mean production is safe.** `tools/qa/supabase-stub.mjs` parses the
body and stores it with **no column validation at all**, so it accepts `ph_distinct_id` and would
accept any invented field. Real Supabase will not: until `0004_ph_distinct_id.sql` is run by hand in
the dashboard, PostgREST answers PGRST204 and **every pre-order returns 500**. §8.40-i, and the same
shape as §8.34-f: the harness is not the deployment target.

**Deploy order is not negotiable: run the SQL, confirm it, then push.**

### Commit 2 — the campaign mechanism, replaced after production said it did not work

**🔴 I shipped a mechanism that did nothing, and the tests passed because they mocked the thing I had
wrong.** Recorded in full because the failure is more useful than the fix.

Commit 1's Phase 3 read the campaign back out of PostHog's session, on the reasoning that PostHog's
cookie is set on `.kheelona.com` and therefore already survives the apex to store hop. **The
reasoning was right. The API was wrong.** PostHog stores the session's ENTRY URL as
`$client_session_props.props.u` (shape `{r, u}`) and derives `utm_*` from it only when it builds
event properties. `getSessionProperty(k)` returns `sessionPersistence.props[k]` — a different bucket
that holds no campaign data at all. So `phCampaign()` returned `{}` on every real page load and
`readUtm()` fell straight through to the old, broken URL read.

**The unit tests were green because they MOCKED `getSessionProperty` to return the values.** They
asserted the same wrong assumption the code was making, which is §8.38-i precisely — one round after
that law was written, in the same subsystem. A mock cannot tell you where a third party keeps its
data.

It surfaced only because the deploy verification went looking for the campaign in a real browser on
production and found the session store holding nothing but SDK debug properties. Two more traps on
the way: `window.posthog` is `undefined` for this ES-module install and reads as "not running" while
everything runs (already recorded from the previous round, and walked into again), and the first
storage probe grepped for `utm_source` as a key when it was sitting inside a URL string.

#### What replaced it

A mechanism this repo owns end to end, which is the actual lesson. `src/proxy.ts` sets a **first-party
`kh_utm` cookie** on any request carrying `utm_*`: `.kheelona.com`, HttpOnly, SameSite=Lax,
session-scoped, **first touch wins**. `create-order` prefers it over anything the browser sends and
validates it as hard as the request body. Set at the edge rather than in client JavaScript because
the proxy sees the tagged landing itself: nothing loads, nothing races hydration, and a visitor who
blocks analytics is still attributed.

`phCampaign()` and its tests are **deleted rather than left looking as though they work**.
`get_distinct_id()` stays, and was re-verified against the real localStorage dump rather than the
types: `distinct_id` genuinely lives in `persistence.props`, so stitching was never affected.

`/privacy` gains a sentence for the cookie, in the same commit as the cookie.

#### Gate, third run

**1353 tests / 124 files**, `tsc` 0, build passes, `qa:sweep` clean 36/36 with 90 accepted,
`qa:payment` clean 10/10.

One near miss worth recording: a bad string edit left `PostHogGate.test.tsx` unparseable, and vitest
reported **"1320 passed"** with the file silently not running. **A passing total is not a passing
suite — read the file count too** (124, not 123).
