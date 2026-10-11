---
title: "D048: Beta on betawebsite.kheelona.com and betastore.kheelona.com from a pushed `beta` branch; Razorpay test mode; Meta and GA4 off on beta, PostHog tagged beta"
type: decision
updated: 2026-10-12
sources: ["founder, in session after the account switch (verbatim below)", D011-production-held-until-gate-b.md, D046-gate-a-approved.md, D047-vercel-build-and-data-regions.md]
---

# D048: Beta deployment

**Founder (verbatim):** "let's get to full website building. with animation and ready for deployment. show
me the version in betawebsite.kheelona.com and betastore.kheelona.com, this version once i approve make it
live on main website."

| Item | Choice |
|---|---|
| Where the beta lives | A branch `beta` pushed to GitHub (`Kheelona/website`, public; D010). The founder assigns **betawebsite.kheelona.com** (marketing) and **betastore.kheelona.com** (store) to that branch in the Vercel dashboard and adds the DNS records (never the Vercel CLI). `main` and production stay untouched until Gate B (D011) |
| Approval | The founder reviews the two beta hosts; that approval is **Gate B**; then the work merges to `main`, which auto-deploys to kheelona.com and store.kheelona.com |
| Beta payments | **Razorpay test mode**: the founder puts the TEST keys in Vercel's Preview environment (same env var names); no real orders from beta |
| Beta tracking | Same tags and event names as production (parity), but **Meta Pixel/CAPI and GA4 do not fire on beta hosts**; PostHog fires with `env=beta` on every event; beta hosts are `noindex, nofollow` |
| Code changes this needs | Host routing treats betastore.kheelona.com as a store host and betawebsite.kheelona.com as the marketing host; beta hosts are never indexable; analytics gate by host; `vercel.json` keeps `reset/*` builds off and lets `beta` build |
| Animation | The approved motion spec (Gate A G4, D041) implemented in the build |

**Approved by.** Founder. **Date.** 2026-10-12.
