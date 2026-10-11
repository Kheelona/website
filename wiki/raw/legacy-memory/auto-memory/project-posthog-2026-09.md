---
name: project-posthog-2026-09
description: PostHog 2026-09: shipped as the fifth tool, moved behind a reverse proxy, then made to measure signups end to end; the settled decisions not to re-ask, and three separate times a GREEN TEST SUITE hid a real defect
metadata:
  type: project
---

**PostHog is LIVE and production-verified since 2026-09-19** (project **617632**, US cloud). Record:
`docs/checkpoints/posthog-2026-09-19.md`; laws **§8.38 a–i**; founder-facing dashboard settings
`docs/posthog-settings.md`; rollback tag `pre-posthog-2026-09-19` = `9541c1c`.

Product analytics + **session replay** + error tracking, **autocapture ON**, additive to GA4 (so
**five** measurement tools now run). See [[project-security-engagement-2026-08]] for the CSP this
extends.

## Settled 2026-09-19 — do NOT re-ask

- **Anonymous, permanently until a specific question forces otherwise.** `person_profiles:
  "identified_only"` and **nothing calls `identify()`**. Funnels work on the anonymous distinct id, so
  nothing the founder asked for is lost. Reversing it costs a `/privacy` rewrite plus a real order
  becoming linkable to US-held browsing history.
- **Replay retention → 30 days, sampling stays 100%.** Dashboard-only; still the founder's to apply.
- **Additive to GA4**, no retirement decided.
- **The key is HARDCODED in `config/site.ts` and that is correct.** The founder offered a Vercel
  secret; it was declined. A `phc_` project key is a public client-side identifier, and a
  `NEXT_PUBLIC_` name **cannot** be a Vercel Secret anyway — third time this repo has met that trap.
  What protects the project is `POSTHOG_HOSTS`, not secrecy.

- **Replay Vision DECLINED 2026-09-19** (AI scanners over recordings). Costs real money: 1 credit =
  $0.01, one scanner × one recording = one observation, first 500/month free — so **four scanners
  means ~125 recordings, not 500**. Declined on volume, on `/privacy` saying nothing about recordings
  being fed to an AI (§8.21-c would require it), and on it shipping via the same wizard already
  declined. **Revisit trigger:** when ad traffic makes watching every recording impractical — then
  write the privacy paragraph FIRST, then scanners with sampling. The one worth coming back for is
  the Classifier's `blocked_by_error` outcome on the checkout.

## 📈 SIGNUPS MEASURABLE, 2026-09-20 — live, and the ad side is the founder's

Laws **§8.40 a-j**; checkpoint `docs/checkpoints/signup-analytics-2026-09-20.md`; rollback tag
`pre-signup-analytics-2026-09-20` = `6abeccb`. Detail lives in the repo; only what a future session
would not otherwise know is here.

**The brief was wrong three times and checking it is what made the round worth doing.** There was no
waitlist to instrument (deleted 2026-08-22, a lint test bans the word), click data was never missing
(autocapture sitewide since 2026-09-19), and signups already reached PostHog. **The real defect was
narrower and worse: `purchase` fired ONLY from Razorpay's client `onPaid` callback**, so a parent who
paid and closed the tab was recorded in Supabase and sent to Meta's CAPI while PostHog and GA4 heard
nothing — Meta was the only tool that could not miss a sale.

- `purchase_confirmed` is now sent SERVER-side from the webhook. **Deliberately a different name from
  `purchase`** — PostHog's only dedup key is a `uuid` the SDK requires to be a real UUID. **The gap
  between the two counts IS the client-event loss rate; do not "reconcile" them.**
- **`CAMPAIGN_KEYS` (`src/lib/campaign.ts`) is the ONE campaign key list.** A parameter not in it is
  discarded silently by everything.
- **Settled, do not re-ask:** signup = the paid pre-order (no waitlist is being built); stitching via
  a DEVICE id with `$process_person_profile: false` (anonymous and stitched are not opposites);
  abandonment DERIVED from `preorder_form_started` rather than fired on `pagehide`.
- **Offered and pending, not forgotten:** an `adset` campaign key. Ad-set name is not captured.

**🟠 The founder still owes the AD side:** re-tag Meta to `utm_source=facebook` +
`placement={{placement}}`, and rename campaigns to `<yyyy-mm>-<slug>`. Until then paid traffic
arrives as `an`/`fb`/`ig` and will not join to spend.

## 🔴 THE METHOD LESSON OF THE WHOLE MONTH: a green suite hid a real defect THREE TIMES

Same subsystem, three rounds, three shapes — this is the thing to carry, not the fixes.

1. **2026-09-19:** session replay recorded the order confirmation page against an explicit `/privacy`
   promise, because the deny list held a ROUTE FILE path while a rewrite means the browser reports a
   different one. Tests green: they restated the code's own wrong assumption (§8.38-i).
2. **2026-09-20:** the campaign mechanism read `getSessionProperty()` and returned nothing on every
   real page. **Tests green: they MOCKED that getter.** PostHog keeps the entry URL in
   `$client_session_props` and derives `utm_*` only when building event properties.
   **A MOCK CANNOT TELL YOU WHERE A THIRD PARTY KEEPS ITS DATA.** Found by dumping real browser
   storage on production.
3. **2026-09-20:** `utm_id` and `placement` are not `utm_` keys, so our allowlist AND posthog-js both
   dropped them — they would have read as perfectly tagged in Meta and produced nothing.

**The rule that follows: when code depends on another library's storage or on what a browser really
reports, the check must run against the real thing.** Also met the same day: a parse error in a test
file reads as "passed" (read the FILE count, 124 not 123), `qa:payment` validates no columns because
the Supabase stub stores whatever it is sent, and `git stash pop` does not restore the index (a
commit captured 3 of 30 files with a message describing all thirty).

## 🔀 THE REVERSE PROXY, 2026-09-20 — and it INVERTED two of the §8.38 laws

PostHog reports through **`kheelona.com/ingest`** since 2026-09-20 (Installation Health flagged the
missing proxy at 6 of 7). Record: `docs/checkpoints/posthog-reverse-proxy-2026-09-20.md`; laws
**§8.39 a-g**; rollback tag `pre-posthog-proxy-2026-09-20` = `e097ad8`.

**Founder decision, settled, do not re-raise.** I recommended AGAINST it: a reverse proxy exists to
stop an ad blocker working, `/privacy` promised parents one did, and PostHog is the tool that films
their screen. The founder chose to proxy everything and state the consequence plainly. An in-product
`opt_out_capturing` control was offered and declined.

**🔴 TWO §8.38 LAWS IN THIS FILE INVERTED, so read them with this attached.** A path in `api_host`
makes the SDK's `region` **"custom"** (it is a regex test on the host):

- **§8.38-b inverts.** The asset origin stops being DERIVED and **must be configured** via
  `asset_host`. Miss it and the recorder 404s and replay silently never starts.
- **§8.38-c inverts.** `ui_host` was correctly UNSET on the direct install and **must now be SET**.
  The SDK derives it as `apiHost.replace(".i.posthog.com", ".posthog.com")`, which does nothing
  whatever to `"/ingest"`, so every dashboard deep link **including recording links** would land
  nowhere.

**The general lesson: a law written for a direct install is not automatically true behind a proxy.
Re-read the laws a change touches instead of assuming they still hold.**

**The routing trap, which no dashboard would have shown.** Next runs **proxy at step 3 and
`beforeFiles` rewrites at step 4**, so `src/proxy.ts` sees `/ingest/e/` first — and the store host
maps every path into `/store/...`. Unguarded, **PostHog dies silently on the one host the pre-order
funnel runs on while the marketing host looks perfectly healthy.** Also: PostHog's own guide nests
assets under the ingestion prefix, needing two OVERLAPPING `beforeFiles` rules whose precedence the
Next docs leave open; two non-overlapping prefixes (`/ingest`, `/ingest-assets`) remove the question.
`"/ingest-assets".startsWith("/ingest")` is **true**, which caught my own test on its first run.

**`skipTrailingSlashRedirect` is SITE-WIDE.** PostHog ingests on `/e/`, `/s/`, `/i/` with the slash,
so the flag is required — and the redirect it disables had to be re-performed in `src/proxy.ts` for
every other path, **query string included**, or ads attribution breaks silently.

**The CSP was NOT touched and that was the win:** both directives already carried `'self'`, so the
policy string is unchanged and **the §8.28-a enforce clock did not reset a third time.**

**Control, again (see below).** `GET /ingest/e/` answers **400** — and so does a direct request to
`us.i.posthog.com/e/`. Alone it reads as a broken proxy. `POST` answers 200 both ways and the
recorder comes back byte-identical.

**Production still owes the one check local work cannot reach: visitor COUNTRY.** PostHog now reads
the IP via `x-forwarded-for`. If that does not survive Vercel's edge, every visitor collapses to one
location and the dashboard quietly goes wrong — a fix for "some metrics may not be accurate" making
them less accurate.

## 🔴 The bug I shipped, and why nothing caught it

**Session replay recorded the order confirmation page for ~15 minutes** while `/privacy` promised in
as many words that it did not. The promise was the false half.

`POSTHOG_REPLAY_DENY_PATHS` held `/store/thanks` — the **route file** path.
`store.kheelona.com/thanks` is *rewritten* to it, and **a rewrite is invisible to the browser**, so
`usePathname()` returns `/thanks`. The apex separately 308s `/store/thanks` away. The list matched
nothing, ever.

**The tests were green because they restated the assumption the code was making.** Asserting
`replayAllowedOnPath("/store/thanks") === false` is true and proves nothing, since no visitor is ever
on that path. Two guards, one blind spot, both passing — through build, full suite, and a checkpoint
already written.

**The law (§8.38-i): a path in a config file is a claim about what a BROWSER will report, and this
repo rewrites paths.** Anything compared against `usePathname()` must be derived from the routing or
checked against a real URL on the real host. The fixed guard derives the browser path from
`routeForHost` instead of restating a literal. A sweep found no other instance.

## The method lesson, which is the same one as [[project-seo-aeo-geo-round-2026-09]]

**Three drafts were wrong and the SDK's own code caught all three** — none would have failed a test,
a build or a type-check. `ui_host` pointed at the asset CDN (it is actually what PostHog builds
dashboard deep-links from, so it would have produced dead links with everything else working);
`ph-mask` was assumed to be a PostHog class and appears nowhere in the SDK (it is ours, handed to
rrweb); the `fflate` advisory looked like it needed an npm override, which would have shipped a
combination PostHog never tested.

**And twice in one day a grep nearly stood in for a measurement, in opposite directions.**
`window.posthog` is `undefined` on production and that is CORRECT for an ES-module install — checking
it reads as "not running" while everything runs. And grepping the confirmation page's HTML reported
three data leaks that were all Next **RSC payload inside `<script>`**, which autocapture cannot read
(§8.25-bb). Classify before counting.

**Verify with the CONTROL, always.** A fix that disabled replay everywhere would have passed the
"not recording /thanks" check just as cleanly. Both cases were measured: recorder loads on
`store.kheelona.com/`, does not on `/thanks`.

## Open, and dated

- **Founder checks Vercel runtime logs for `[csp]` around 2026-09-26**, then the §8.28-a CSP can flip
  from Report-Only to enforcing. **The reports do NOT accumulate anywhere** — `/api/csp-report`
  `console.warn`s them into the Vercel platform log. It is "go and look", not "wait".
  The enforce clock has now reset **twice** (Meta Pixel 2026-09-01, PostHog 2026-09-19). The
  2026-09-20 proxy deliberately did NOT reset it a third time, by changing no CSP origin.
- Founder to apply the two dashboard settings in `docs/posthog-settings.md`.
- Lighthouse re-measure on production (best-practices should NOT move — PostHog's cookie is
  first-party, so it does not feed the `third-party-cookies` audit holding BP at an accepted 74).
