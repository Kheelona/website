# Checkpoint: R11 — conversation hero, PlayOS platform page, Ria photo, consistency refactor

**Date:** 2026-07-11 · **Commits:** `7e4221b` + `9d0c2e5` + `9a62b59` · **Live:** https://website-hdn2.vercel.app (verified) · **Previous checkpoint:** `r10-clicks-ria-ambient-fold.md`

## What shipped (founder round, 4 items, decisions via one question batch)

1. **Conversation hero (founder pick "show the conversation")**: the hero demonstrates Lumi — plush + the moon exchange in CSS-only animated bubbles (`home/HeroConversation.tsx`, SSR text, zero hydration by the LCP). Copy diet: badge + PDF H1 + Reserve + one-line CAP_LINE; the PDF lede is the demo's caption; the R10 folded paragraph closes WhyWeExist. **LCP law re-learned twice on live** (see qa-report R11 "mobile LCP saga"): the choreography is desktop-gated (`min-width: 768px`), and the plush must stay the hero's LARGEST element (340px mobile) so the priority image owns LCP.
2. **PlayOS platform page** (nav tab renamed from "How it works"): mirrors founder-published kheelona.ai/playos in parent voice — One soul/Many bodies hero, family with real renders (`public/products/`: lori/lua/robu + magic-box from the .ai repo, all pre-cut 900×900 transparent), Magic Box band, platform parent app (3 PhoneFrames + 5 features + one-prompt with the published example), 6-step voice path, under the hood, six safety layers, privacy, Voice SLM as a parent-framed note. NO pricing, NO partner CTAs (founder decision) — one kheelona.ai pointer. The old 4-step path lives on /products/lumi under the conversation demo.
3. **Ria photo fixed**: the source PNG had a BAKED checkerboard (fake transparency — the founder saw "boxes"). Vision cutout (tools/cutout) → flat pale lavender #F1ECFB (each team photo's bg matches its card tint family) → 480px `team/ria.jpg` (JPG parity with the set).
4. **Consistency refactor (both audit agents' findings fully dispositioned)**: new shared molecules `SectionHeading` / `Card` / `StepList` / `PageHero` / `CheckList` / `LegalDoc` (§8.19 law: new sections must use them); prices + CTA labels centralized in `lib/site.ts`; FinaleCTA → `sections/shared/`; lumi wash seam fixed; two .ai-verbatim contractions removed (founder can revert — R11-b); orange-ink links on tinted washes; radius + type-scale normalization; brand focus rings; nav/footer target-size.

## Verification record
Build 28 pages, tsc clean, token gate 17, voice-lint clean. Local desktop LH: 100/100/100/100 all 9 routes. Live: desktop home 99 / others 100; **mobile: devtools-throttled 98×3 (LCP 2.0s) — the simulate-mode 86s are a proven headless/lantern artifact present identically in an R10 A/B build** (full evidence chain in qa-report R11; future verifies record both methods).

## Open queue (all founder-gated)
- **R11-a** founder reads the new hero + /playos live. **R11-b** contraction revert call.
- R10-a Ria card sign-off (photo now fixed) · ambient visual check · R9-a..c · R4-a..f · R5-a · Tally URL · GA4 · claims.
