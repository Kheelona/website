---
title: "D051: The beta runs without store integrations (no Supabase, Razorpay or email); no PostHog filter"
type: decision
updated: 2026-10-12
sources: ["founder's message in the build session, 2026-10-12, answering the beta runbook (architecture §15.4)", D048-beta-deployment.md, ../engineering/architecture.md, ../qa/architecture-review-2026-10-12.md, src/lib/store/env.ts (storeEnv), src/app/store/page.tsx (NotConfiguredState)]
---

# D051: The beta runs without store integrations

## Context

The Phase 4 plan (architecture §15.4, QA review B4) asked the founder to set up a separate Supabase
project, Razorpay test keys, a test inbox and a PostHog filter so that a test payment could run on
betastore.kheelona.com before Gate B.

## Founder's ruling (verbatim, 2026-10-12)

- Supabase: "Do not integrate supabase in the test website, when we are doing final merge, we can
  directly use the main website details."
- Razorpay: "Do not integrate razorpay in the test website, when we are doing final merge, we can
  directly use the main website details."
- Order-alert emails: "no need to integrate in test".
- PostHog filter: "ignore test is separate subdomain and will be down in 1-2 days and merged, so no need
  to worry."
- Domains: "tell me how to do it" (steps given in the session; recorded in architecture §15.4).

## What this means for the build

1. **Beta never takes a payment.** The store code treats the beta build as "not configured" whatever
   environment variables reach it: `storeEnv()` returns null when `SITE_ENV === "beta"` (task 2.10, an
   authorised diff to `src/lib/store/env.ts` with this decision's ID). Betastore shows the restyled
   "Pre-orders open here shortly" screen and the store API routes answer 503. This protects against
   production keys that may already be scoped to every Preview branch in Vercel.
2. **No beta setup beyond the domains.** No Supabase project, no Razorpay keys, no email settings, no
   PostHog filter. PostHog still tags beta events `env=beta` (D048); no purchase event can happen there.
3. **The store form and the confirmation page are reviewed from screenshots** of the local production
   build (phone first), sent to the founder with the beta link, because beta cannot render them.
4. **Payment proof before launch is local only:** checkout logic files byte-frozen (ADR-013), the JSX
   contract and logic-signature guards, and `npm run qa:payment` reaching the Razorpay sandbox sheet with
   test keys. The beta test payment of the test plan §6 and review item B4 are dropped.
5. **Residual risk, stated to the founder:** the first completed payment through the restyled checkout
   will be a real one. Mitigations: the frozen logic, the production smoke right after the merge (store
   loads in live mode, form validates, no order), Vercel Instant Rollback in seconds. Optional and the
   founder's call: the founder places one real order after launch and refunds it from the Razorpay
   dashboard (Claude never places orders or refunds).
6. **In-app browser check (open question P5)** moves to production right after launch, up to the Razorpay
   sheet, without paying.

## Approved by

The founder, 2026-10-12.
