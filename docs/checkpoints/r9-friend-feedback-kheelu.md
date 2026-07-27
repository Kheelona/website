# Checkpoint: R9 — friend-feedback round + Kheelu the narrator

**Date:** 2026-07-11 · **Commits:** `5c30c0a` (code) + `d40e577` (live-verify docs) · **Live:** https://website-hdn2.vercel.app · **Rollback:** tag `r7-live-2026-07-10`

## What this round was

An external reviewer (founder's friend) audited the live site: ~20 findings across CTA, brand consistency, typography, UX flow, content, trust. Founder answered every gated decision across three question batches, then added a creative mandate mid-round: **the site is told by Kheelu**. Everything shipped, QA'd, pushed, and live-verified in one session. Full disposition table: `docs/qa-report.md` R9. Spec: `docs/website-steps.md` §8.17. Copy provenance + all narrator lines: `docs/copy-reference.md` R9.

## Decisions locked this round (never re-ask)

1. **Brand law**: plush = **Lumi, the product** — rotating SKU (looks change every 30–45 days post-launch; core/AI stays; rotation strategy is NOT published on-site). Orange character = **Kheelu**, permanent brand mascot + site narrator. Product owns the hero (Blue leads everywhere the SKUs appear).
2. **Kheelu**: full-narrator prominence (founder chose the heavier option knowingly). His card copy is verbatim source; his quoted speech is the one sanctioned contraction zone. New lines need founder approval (list them in the plan, like R9 did).
3. **Urgency is REAL**: "first 500 units at ₹4,999" (founder-supplied 2026-07-10). Never invent scarcity.
4. **CTA**: one verb — Reserve. Nav/sheet "Reserve at ₹4,999"; desire peaks "Reserve Lumi at ₹4,999"; sticky unchanged. Reassurance line verbatim ONLY at hero + finale.
5. **Typography**: serif (Instrument Serif) only in human-voice quotes; eyebrows = 13px bold caps sans kicker in `orange-ink #b54a0d` (guarded token, 17 mappings); accent leads = display font.
6. **Feelings**: re-map only, no new art. Sad = the serene `bliss` render (home + lumi page); the scared render is the narrator's "act them out" bubble; Grumpy render verified correct (reviewer misread).
7. Every page ends with `FinaleCTA` (#reserve) — /privacy and /terms were violating this (dead nav anchor), now fixed.

## State of the code

- NEW: `site/components/ui/KheeluSays.tsx` (narrator device), `site/components/sections/home/KheeluIntro.tsx`, `site/components/sections/home/HowItWorks.tsx` (4 /setup steps via shared `site/lib/setup-steps.ts`), token `--color-orange-ink` (globals @theme + `lib/three/tokens.ts` + `tools/tokens/check-tokens.mjs` SITE_MAP).
- CHANGED: Hero (plush Image, priority = LCP), FinaleCTA (product-forward lineup, cap line, `kheeluLine` prop), MeetLumi/Compare/lumi-page (cap/trim lines), Feelings (re-map + Kheelu alts), Eyebrow (sans kicker), StagedIntro/WhyWeExist/SafetyCallout/playos/lumi (de-serifed accents), RecognitionStrip (h-14/h-8 uniform + `safetyLine` prop), WhatLumiDoes (B2B line removed), nav ("Meet Lumi", "Reserve at ₹4,999"), rhythm trims (StagedIntro/WhyWeExist/MeetLumi/Compare), privacy+terms (FinaleCTA compact).
- DELETED: `ParentVoices.tsx` (legacy, unmounted since R7).

## Verification record

- Local: build green (28 pages), tsc clean, token gate ok (17), voice-lint clean, 29-href crawl clean, SSR probes pass, full visible-tab scroll desktop + LH-emulated mobile.
- Lighthouse local desktop: home 99–100/100/100/100; lumi 100 ×4 (after the orange-ink contrast fix — orange-cta kickers failed 4.5:1 on cream; the gate caught it); a11y/BP/SEO 100 on all 9 routes.
- **Live: home desktop 100/100/100/100 LCP 0.7s; home mobile ×5 runs 97/85/93/84/100 → median 93 — the ≥90 gate PASSES for the first time since R5** (the old MascotScene hero was the ~2s render-delay culprit; R8 bisect task closed by fix). Residual 84–100 variance tracks CDN/image-optimizer cache on cold hits.

## Open items (the resume queue)

- **Founder (FOUNDER-TODO)**: R9-a real photography (shot list ready), R9-b testimonial name/face/video, R9-c Kheelu voice check on live page; plus pre-existing R4-a..f, R5-a (new logo), Tally URL, GA4, claims (certs/specs/ship date/contact email).
- **No open engineering tasks.** Next session starts from founder input or a new feedback round.
