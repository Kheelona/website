---
title: "ADR-008: One build-time site environment drives hosts, links, analytics gating and indexing; beta per D048"
type: adr
updated: 2026-10-12
sources:
  - ../../decisions/D048-beta-deployment.md, ../../decisions/D011-production-held-until-gate-b.md, ../../decisions/D014-branch-pushed-no-previews.md
  - ../../site/tracking-inventory.md (host lists, Ahrefs ungated on purpose, §15 consent)
  - ../lessons.md (§1 NEXT_PUBLIC values inlined at build; §3 INDEXABLE_HOSTS vs GA4_HOSTS)
  - src/config/site.ts, src/lib/store/host.ts, src/lib/store/env.ts, src/lib/store/posthog-server.ts, src/lib/store/fulfil.ts, src/lib/store/meta-capi.ts, src/proxy.ts, src/app/layout.tsx, src/app/store/layout.tsx, vercel.json (read 2026-10-12)
  - "https://vercel.com/docs/environment-variables/system-environment-variables (VERCEL_ENV, VERCEL_GIT_COMMIT_REF at build and runtime), fetched 2026-10-12"
  - "https://vercel.com/docs/project-configuration/git-configuration (deploymentEnabled, any true rule wins), fetched 2026-10-12"
  - "https://vercel.com/docs/deployment-protection (Standard Protection covers every non-production domain), fetched 2026-10-12"
  - node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/env.md
  - "https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation (fetched 2026-10-12 by QA): header or query x-vercel-protection-bypass; VERCEL_AUTOMATION_BYPASS_SECRET system variable"
  - ../../qa/architecture-review-2026-10-12.md (B4, N1, N3, N4, N5, N8, N11)
  - "src/proxy.ts:203 (matcher excludes paths with a dot), read 2026-10-12"
---

# ADR-008: Environments and the beta

**Status:** accepted by the Architect, 2026-10-12, implementing D048. One sub-choice (Ahrefs off on beta)
is flagged to the founder.

## Context

D048: a pushed branch `beta` deploys on Vercel to **betawebsite.kheelona.com** (marketing) and
**betastore.kheelona.com** (store), assigned by the founder in the dashboard; Razorpay TEST keys in the
Preview environment; Meta Pixel and CAPI and GA4 never fire on beta hosts; PostHog fires with
`env=beta`; beta hosts are noindex; `vercel.json` keeps `reset/*` off and lets `beta` build; approval on
beta is Gate B, then the work merges to `main`.

Today every cross-host link is a constant: `STORE_URL = "https://store.kheelona.com"` feeds every CTA,
the apex `/store/*` redirect (`host.ts`), the `/thanks` link in receipts (`fulfil.ts:304`), the CAPI
`event_source_url` and `llms.txt`. Left alone, every CTA on beta would send a reviewer to the
**production** store. Static pages are prerendered, so the right value must be known at build time.

## Options

1. Hard-code beta hosts behind runtime `window.location` checks everywhere. Static HTML would still
   carry production links.
2. A new environment variable the founder must set per environment. One more thing to forget.
3. **A build-time `SITE_ENV` derived from Vercel's system variables (`VERCEL_ENV`,
   `VERCEL_GIT_COMMIT_REF`), inlined through `next.config.ts` `env`, with a local override
   `KH_SITE_ENV` for tests; every origin and gate reads it.**

## Choice

Option 3. Exact changes: [architecture §15.3](../architecture.md#153-beta-per-d048-the-exact-code-changes).

- `SITE_ENV` = `production` when `VERCEL_ENV=production`; `beta` when the branch is `beta`; `preview`
  for any other Vercel preview; `development` otherwise. The build fails with a clear message if it runs
  on Vercel with system variables switched off.
- `STORE_URL` keeps its name and becomes `STORE_ORIGIN` (production value unchanged; beta value
  `https://betastore.kheelona.com`), so the frozen consumers (`host.ts`, `fulfil.ts`, `meta-capi.ts`,
  `templates.ts`) need no edit and behave correctly on both. `CANONICAL_ORIGIN` stays
  `https://kheelona.com` on every environment (canonicals, JSON-LD, sitemap).
- Analytics: GA4 and Meta host lists are unchanged (production hosts only), so they never load on beta.
  PostHog's list gains the two beta hosts (task 2.6, in the same commit as the gate test that asserts the
  list) and stamps `env: "beta"` through `before_send` only: no `posthog.register`, because a registered
  super property persists in PostHog's storage, whose cookie is cross-subdomain on `.kheelona.com`, and
  could follow a tester onto production (QA review N3). Meta CAPI is switched off on beta in `env.ts`
  (token read as absent), so the existing "SKIPPED" path logs it. The server event `purchase_confirmed`
  carries `env: SITE_ENV` on every non-production build (beta, preview, development), so even a sandbox
  order completed against a local server is marked; production's payload is unchanged (N4).
- **Ahrefs** is ungated on production on purpose (its installation check fetches the page). On beta the
  root layout leaves it out, because it cannot be tagged by environment and beta views would land in the
  production property. **Flagged to the founder** (D048 does not name Ahrefs).
- Indexing, every response: the proxy's matcher skips any path with a dot (`src/proxy.ts:203`), so
  `/llms.txt`, `/pricing.md`, `/sitemap.xml`, images and films would get no header from it (QA review N1).
  `next.config.ts` `headers()` therefore adds `X-Robots-Tag: noindex, nofollow` to `/:path*` when
  `resolveSiteEnv(process.env) === "beta"` (called directly: inside the config, the inlined `SITE_ENV`
  still reads `development`). For HTML routes, beta hosts are also outside `INDEXABLE_HOSTS`, so the proxy
  sends the same header; and the root metadata adds `robots: noindex, nofollow` when
  `SITE_ENV === "beta"`. Development keeps loopback indexable so local Lighthouse SEO stays honest
  (lessons §3).
- `host.ts` treats `betastore.kheelona.com` as a store host on every build (a pure-function change with
  tests); D048 authorises this edit to a frozen file.
- `vercel.json` adds `"beta": true` beside `"reset/*": false` (any true rule wins, so `beta` builds and
  `reset/website-v2` does not).
- Access: under Vercel's Standard Protection the two beta domains are not production domains, so
  Vercel Authentication protects them (brief §4.5 "password-protected if the host allows it"). QA uses a
  Protection Bypass for Automation secret kept outside the repo, sent only to the two beta hosts (never
  through Playwright's `extraHTTPHeaders`, which would send it to Razorpay too), never in a query string
  on a page that loads PostHog, and rotated after any real-device test that used a bypass link. Vercel
  exposes it to deployments as `VERCEL_AUTOMATION_BYPASS_SECRET`; `test/store-secrets.test.ts` fails if
  `src/` ever reads that name or gives it a `NEXT_PUBLIC_` form (QA review N5).
- **Isolation is a gate, not a recommendation (QA review B4).** Before the first beta payment, five
  checks are recorded: beta's own Supabase project (a shared one would count test payments toward the
  500-unit cap that flips production's price, and put test orders in the dispatch queue); `rzp_test_`
  keys; no CAPI token or test code in Preview; order alerts to a test inbox (the frozen templates make a
  beta alert look like a real order); PostHog's test-account filter and revenue analytics excluding
  `env = beta`. Each check and who verifies it: [architecture §15.4](../architecture.md#154-founder-runbook-the-beta-vercel-dashboard-and-cloudflare-only-never-the-cli).

**Superseded in part by [D051](../../decisions/D051-beta-without-store-integrations.md) (2026-10-12):**
the founder ruled that the beta runs without Supabase, Razorpay or email, and without a PostHog filter.
The isolation checks above are void; instead the store code refuses store keys on beta (task 2.10), so
no payment can happen there.

## Consequences

- One build of `beta` serves both beta hosts with correct cross-links; one build of `main` serves
  production exactly as today.
- The founder must keep "Enable access to System Environment Variables" on (the build refuses
  otherwise) and scope the beta's Preview variables to the `beta` branch.
- Attribution cookies (`kh_utm`, `kh_fbclid`) stay on `.kheelona.com`, so a tester's beta visit can
  seed a production session's first touch in the same browser. Accepted (testers only, session cookies);
  the runbook says to review beta in a private window.
- Beta's free Supabase project pauses after a quiet week and the health cron runs only on production,
  so it is woken before each beta session (N11).
- On beta, `og:image` resolves against the production origin (`metadataBase` is `CANONICAL_ORIGIN`), so a
  shared beta link may preview the old image. Accepted (N8).
