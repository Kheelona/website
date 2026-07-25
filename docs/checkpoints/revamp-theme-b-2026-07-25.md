# Checkpoint — Revamp to theme B "Kheelu's Tour" (2026-07-25)

Cold-restart snapshot for the in-progress revamp. The live working file is
`docs/revamp-2026-07/WORKING.md` (read its "COLD-RESTART: START HERE" section first). This
checkpoint is the durable summary.

## Where the work lives

- **Branch `revamp/kheelu-tour`** (pushed to origin, 6 commits ahead of master). All revamp
  code is here.
- **master** holds only: P0 image hotfix (`e71a963`) + P1 docs commit (`9f3afa5`). The revamp
  proper is on the branch — do not expect it on master.

Branch commits (newest first):
```
87a812a  M3: /products/lumi rebuilt on the room grammar
ddf5996  M2: Home rebuilt on the room grammar
f355065  M1: theme core — SiteBackdrop, Room/RoomsTrack, KheeluGuide
870c0b8  P1: production copy v2 for all routes
30bb2eb  P1: market research memo + new founder gates (REV-a..d)
850a87a  P2: brand-4 palette + two-font law
```

## What the revamp is

Founder brief `Websit prompt based on B + inputs - 24-Jul.pdf`: re-theme the entire production
site onto wireframe direction B. Signature = a persistent **Kheelu guide** (fixed bottom-left
narrator that tracks the section under the viewport and swaps pose + speech line), content in
contained rounded **rooms** on one warm CSS backdrop, directional reveals, less text / more
visuals, **no section numbering**. Locked founder decisions (do not re-ask): brand-4 palette +
functional darks only; founder generates the final hero art; new production copy everywhere;
two fonts only (Glory + Instrument Sans).

## Done

| Phase | Result |
|---|---|
| P0 | Repointed 13 refs of the deleted `/product/lumi-*.png` → `-2.png` real-photo cutouts (master). |
| P1 | Working file + CLAUDE.md pointer; Gemini hero kit (`gemini-handoff/hero-2026-07/`); market research (`docs/revamp-2026-07/research.md`); full-site copy (`docs/revamp-2026-07/copy-v2.md`); QA strategy (`website-steps.md` §8.20). |
| P2 | Retired teal/teal-deep(*)/purple/blue-soft + Instrument Serif from the web palette; added `blue-ink`, semantic `action`/`action-ink`, `radius-room`, `shadow-room`. Migrated every live usage. Synced `check-tokens.mjs` (18 mappings). Annotated `Design/design-system`. (*teal-deep deprecated until M5.) |
| M1 | New atoms `SiteBackdrop` / `Room` / `RoomsTrack`; reveal variants left/right/pop; `lib/kheelu-poses.ts`; **`KheeluGuide`** organism (IO section-sensing, aria-hidden bubble with NO live regions, poke button, desktop pointer-follow paused on hidden tabs, mobile dock that absorbed `StickyMobileCTA`, one tab stop, hidden without JS). Wired into layout; the three.js ambient canvas is now dormant. |
| M2 | Home = hero (interim composed Kheelu+plush art + 3 SSR fact bubbles) + 12 rooms narrated by the guide. New: `Statement`, `TrustRoom` (shape chips), `Family` (shared `lib/family`), `KheeluOrbit` (CSS ring), `FeelingsGallery` (Radix Dialog character cards), `ChatDemo`. Reworded `CompareTable` (parent-first, ages 3 to 10). Visually verified. |
| M3 | /products/lumi = hero + `ColorwayPicker` (radiogroup, no-CLS blue/green/pink swap) + 11 rooms + FAQ v2 + JSON-LD "Lumi by Kheelona". Visually verified. |

Tests **206/206**, `next build` green (token-check 18), both routes walked in Chrome.

One bug found + fixed in M2: FeelingsGallery dialog double-shifted because a keyframe animated
`transform` while Tailwind v4 centering uses the standalone `translate` property — now animates
`scale`/`opacity` only. (Gotcha worth remembering for any future centered-dialog animation.)

## Next

- **M4** — the 8 interior routes onto the room grammar (pattern in WORKING.md; copy in
  copy-v2.md). `/playos /safety /setup /team /stories /stories/[slug] /privacy /terms not-found`.
- **M5** — delete retired components + tests/stories (`KheeluIntro`, `WhyWeExist`, `Feelings`,
  `MeetLumi`, `WhatLumiDoes`, `HowItWorks`, `SafetyCallout`, `SafetyStrip`, `HeroConversation`,
  `StickyMobileCTA`, `CurveDivider`, `MascotScene`, `KheeluSays`, `hero-glow`, `Beat`);
  ambient-stage stays dormant. Full Lighthouse (100 A11y/BP/SEO, Perf ≥95 desktop / ≥90 mobile)
  + voice-lint + href crawl + no-JS check. Verify `[data-reveal]` still fires after client-side
  nav (RevealObserver scans on mount only).
- **P5** — Vercel preview of the branch → founder review → request the 3 app images (brief
  pointer 9, only after v1 deploy).

## Founder-gated (never invent; FOUNDER-TODO.md "THE REVAMP")

REV-a hero art · REV-b subscription/camera/ship-date/10-languages · REV-c stale ₹2,999 in
Google's index (old Wix + Play Store) · REV-d 3 app images · plus all standing launch gates
(Tally URL, GA4, Vercel/DNS, certs, testimonials, legal). Every Kheelu `data-say` line needs
founder sign-off before merge to master (fine on the preview branch).
