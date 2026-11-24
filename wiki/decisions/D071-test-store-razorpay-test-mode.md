---
title: "D071: the test store takes Razorpay Test Mode payments, and the code keeps test and live apart (supersedes D051)"
type: decision
updated: 2026-11-24
sources: ["the founder's answers in chat, 2026-11-24 (a permanent Razorpay test environment; answers 2 and 4: Test Mode only on beta, and the test Supabase project's id may be public)", D051-beta-without-store-integrations.md, D048-beta-deployment.md, D060-beta-open-to-the-public-2026-10-14.md, ../engineering/adr/ADR-008-environments-and-beta.md, src/lib/store/env.ts (accepted), src/config/test-store.ts, test/store-env-beta.test.ts]
---

# D071: the test store takes Razorpay Test Mode payments, and the code keeps test and live apart

> **Supersedes [D051](D051-beta-without-store-integrations.md)** ("beta never takes a payment", 2026-10-12) for the store's
> payment, database and email keys. D051's other lines (no PostHog filter; the beta is reviewed from screenshots) are
> history and are replaced by this decision's test store.

**Context.** Until now every change to the store could be tried only on screenshots, or with a real ₹499 payment and a
refund. On 24 November 2026 the founder asked for a permanent test environment ("let's setup a test razor pay, Test
payments. It will help in long run as well."): the `beta` build, `betastore.kheelona.com`, taking Razorpay **Test Mode**
payments into its own **test** Supabase project, with no email, no Meta and no OpenAI server event, and never counted in the
numbers. D051 stopped that: on a beta build `storeEnv()` read every store value as absent, so betastore could never take a
payment, even a test one. The account setup (Razorpay Test Mode keys and webhook, the test Supabase project, Vercel's
per-environment variables) is the founder's and happens in the dashboards only; no value is ever in the repo.

**Options.**
1. Keep D051 and test with live ₹499 payments and refunds. Rejected by the founder on 24 Nov: real money and real refunds
   for every test.
2. **Let the test store take Test Mode payments, and make the code refuse the wrong mode in both directions.** Chosen.

**Choice** (the founder's answers 2 and 4, 24 Nov 2026). `storeEnv()` accepts a store configuration only when the Razorpay
key's mode fits the build (`SITE_ENV`):

| Build | `RAZORPAY_KEY_ID` accepted | Refused |
|---|---|---|
| production | `rzp_live_...` only | `rzp_test_...` and anything else |
| beta (the test store) | `rzp_test_...` only | `rzp_live_...` and anything else |
| preview, development | anything except `rzp_live_...` (a local `rzp_placeholder` keeps working) | `rzp_live_...` |

- **Refused means "not configured":** the store shows "Pre-orders open here shortly", the store API routes answer 503,
  `missingStoreEnv()` (and so `/api/health`) names `RAZORPAY_KEY_ID`, nothing is read from or written to a database and no
  network call is made. It never throws and never crashes a page. One `console.error` line per rule and process says which
  rule fired and the mode (for example "RAZORPAY_KEY_ID is a test key, which a production build refuses"), never a value.
- **Email is off on beta,** whatever is set: `resendApiKey` is null, so a test order sends no acknowledgement or alert.
  Meta's Conversions API stays off on beta (D048, unchanged). OpenAI's server event stays production-only (another file,
  unchanged).
- **The Supabase project rule.** `src/config/test-store.ts` lists the ids of test Supabase projects (the id at the start of
  a project's URL, `https://<id>.supabase.co`; an identifier, not a key, so the founder agreed it may be public). A production
  build refuses a `SUPABASE_URL` whose id is on the list. A beta build, once the list is not empty, refuses a `SUPABASE_URL`
  whose id is not on it. Preview and development have no Supabase rule (the local stub keeps working). The list is empty
  in this change; naming the test project is a separate one-line follow-up (T1b) with no frozen-file change.
- **Production with a live key and its own Supabase project behaves exactly as before.** `test/store-env-beta.test.ts` runs
  the tag `archive/pre-reset-2026-10-10`'s own `env.ts` beside today's on the same variables, for every combination a build
  accepts.

**What did not change.** No route, page, copy or tracking; `/api/health` (it already reported `razorpay: test|live` and the
missing names); the six store values and their names; the placeholder rules (`DUMMY`, `<...>`, blank); prices and the offer.

**Why.** A test store is only worth having if it cannot touch real money or real customers, and the cheapest guarantee is in
code, next to the keys: the wrong mode on the wrong build reads as "not configured" instead of working quietly (a test key on
the live host would take fake money; a live key on a preview would take real money). Vercel's variable scoping stays the first
line; this is the second.

**Frozen file.** `src/lib/store/env.ts` is in the checkout freeze (ADR-013 class 1). It changes only with its reviewed patch,
`test/guards/fixtures/authorised-diffs/src__lib__store__env.ts.patch`, regenerated for this decision (the D051 paragraph now says
"superseded by D071"). The new list is a separate file in `src/config/`, because a new file inside a frozen folder fails the guard.

**Approved by** the founder, one by one (checkout and store code), in chat on 2026-11-24. Spec: K-182 T1.

**Rollback.** Revert the pull request: the test store goes back to "never takes a payment" (D051) and production is unchanged
either way.
