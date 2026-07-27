# Checkpoint — theme B "Kheelu's Tour" + the V3 repositioning (2026-07-25 → 28)

Cold-restart snapshot for the in-progress revamp. The live working file is
`docs/revamp-2026-07/WORKING.md` (read its "COLD-RESTART: START HERE" section first). This
checkpoint is the durable summary.

## Where the work lives

- **Branch `revamp/kheelu-tour`** (pushed to origin). All revamp code is here.
- **master/`main`** holds only: P0 image hotfix (`e71a963`) + P1 docs commit (`9f3afa5`). The
  revamp proper is on the branch — do not expect it on main.
- **LIVE PREVIEW: https://website-hdn2.vercel.app** — branch `demo-website` (Vercel root
  directory `site`) was MERGED with the revamp on 2026-07-25, so the shared review URL now
  serves the theme-B site. It was a merge, not a force-push, so the wireframe drafts at
  `/a` `/b` `/c` still resolve. Env vars are still unset there: the reserve panel shows the
  "opens soon" card and GA4 is not measuring (FOUNDER-TODO #1/#2).

Branch commits (newest first):
```
7e7e2b7  M4: the 8 interior routes rebuilt on the room grammar
141e267  Docs: revamp handoff for cold restart
87a812a  M3: /products/lumi rebuilt on the room grammar
ddf5996  M2: Home rebuilt on the room grammar
f355065  M1: theme core — SiteBackdrop, Room/RoomsTrack, KheeluGuide
870c0b8  P1: production copy v2 for all routes
30bb2eb  P1: market research memo + new founder gates (REV-a..d)
850a87a  P2: brand-4 palette + two-font law
```
`demo-website` = `a0d6b41`, the merge of `7e7e2b7` into the old preview branch.

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
| M4 | **All 8 interior routes** on the room grammar, so the whole site is one theme. `/playos` (Magic Box hero, parent-app room led by a question), `/safety` (rewritten question-led: five visible 40–60 word answers + trimmed FAQ + status-exact standards), `/setup`, `/team`, `/stories`, `/stories/[slug]`, `/privacy`, `/terms`, `not-found` (gained the finale, closing a dead `#reserve` nav anchor). New shared parts: `PageHero` became the theme-B hero shell, new `AnswerBlock` molecule (AEO), new `FamilyGrid` organism, `LegalDoc` on rooms, `SectionHeading` gained a fourth `nested` step, `PhoneFrame` gained `priority`. Journal age pass (product copy 3 to 10; three articles retitled, slugs unchanged; one cited WHO/AAP band kept). |
| P5 (part) | Preview deployed: `demo-website` merged + pushed, https://website-hdn2.vercel.app now serves the revamp. Founder review pending. |
| V3 | **Content repositioning** (founder's YC application, 2026-07-27/28). Spec `docs/revamp-2026-07/BUILD-V3.md`, research `benchmarks-v3.md`. Mix 40% fun / 20% brain development / 40% education, companion story still leading. Lumi ages **2 to 5**, platform arc **2 to 14** (3-to-10 retired). Pipeline **Lumi → Kheelu Speaker → AI books** replaces the .com companion lineup. NEW: Home Learning room (shows the Kheelu-mode loop as a real exchange, with its own Reserve), Home Brain room (serve and return, journal photo), `/products/lumi` Kheelu-mode room, the pace panel ("School teaches the class. Lumi teaches your child.", framed as addition), `KheelonaPlusBand` ("6 months included, price announced before launch" — no ₹, no post-lapse claim), `FootnotesRow`, named placeholder testimonials, footer signature, WhatsApp share. Adaptive hero: "Every child learns differently. / Lumi learns with them." |
| V3 cleanup | The old M5, folded in: 15 retired components deleted with tests and stories (after stripping dormant `KheeluSays`/`CurveDivider` call sites from six live components), `teal-deep` + the teal wash removed (token-check 17). `features/ambient-stage/` stays dormant. |
| V3 AEO | `/llms.txt`, robots rules for the AI crawlers, one honest journal freshness signal. |
| V3 QA | axe **zero violations** on 10 routes × desktop and mobile. Lighthouse **A11y/BP/SEO 100 on all 18 runs**, Perf 99–100 (mobile on devtools throttling). Tests **210/210**. |
| M4-b | **Mobile pass** (founder reported mobile issues on the preview). Reviewed at real mobile viewports over CDP, 320-1024px. Root cause of most symptoms: the room reveals translate X by ±46px, which on a phone pushes a full-width room past the screen edge and makes mobile Chrome WIDEN THE LAYOUT VIEWPORT (417px on a 390px screen) — hence the sideways pan, the stretched fixed dock with its CTA off-screen, and the cropped-looking copy. Sideways reveals now gated to ≥960px. Plus: long ghost labels wrap below sm; PhoneFrame `max-w-full` + `min-w-0` on its grid item; /team bio column and /stories art column yield on small phones; `p { text-wrap: pretty }` moved into `@layer base` (unlayered CSS outranks utilities — it had been beating `truncate`, so the dock ran 3 lines / 86px, now 1 line / 67px); **CompareTable stacks one card per claim below sm** instead of a 640px sideways scroll. Verified 320/360/390/430px: 9/9 routes, no pan, no stretched fixed layer. Live-verified on the preview. |

At the end of M4-b: tests 226/226, `next build` green (token-check 18), tsc clean. All 10 routes walked in
Chrome (local prod + live), 23-href crawl 200s, `#reserve` on every route including the 404,
voice-lint clean (zero em-dashes, zero italics, no stale ages on product surfaces).

Two bugs found + fixed:
- **M2** — FeelingsGallery dialog double-shifted because a keyframe animated `transform` while
  Tailwind v4 centering uses the standalone `translate` property; now animates `scale`/`opacity`
  only. (Worth remembering for any future centered-dialog animation.)
- **M4** — `RevealObserver` ran its effect once but lives in the persistent root layout, so
  after a CLIENT-side navigation the new route's `[data-reveal]` rooms were never observed and
  stayed at `opacity: 0`. It re-arms on `usePathname()` now, with a regression test. Any future
  observer mounted in the layout must do the same.
- **V3 QA** — `/stories` mobile measured Lighthouse 85 with a 4.3s LCP against a 1.5s FCP. The
  LCP element was a card paragraph inside the FIRST room, and that room carried a directional
  reveal, which holds it at `opacity: 0` until the observer hydrates. `Room.tsx` already stated the
  rule; the theme loop was generating a reveal for room one anyway. Gating it to `reveal="none"`
  gave 100 and a 1.5s LCP. **Generalised rule (§8.21): a route with a copy-only hero has no
  priority image to win LCP, so its first room owns it and must ship reveal-free.** Also learned:
  axe skips `opacity: 0` subtrees, so a reveal-heavy page under-reports.
- **M4-b** — two rules now in website-steps §8.20: never animate X on an element that spans the
  track width (it widens the layout viewport on phones and drags every fixed element with it),
  and base-level element rules in globals.css belong in `@layer base` (unlayered CSS outranks
  every Tailwind utility regardless of specificity).

## Next

**All build work is done.** Every remaining item is founder-gated (see FOUNDER-TODO.md):
V3-a real testimonial quotes (the site carries drafted placeholders — this BLOCKS merge to main),
V3-b the Kheelona+ monthly price and post-lapse behaviour, V3-c pipeline art via
`gemini-handoff/pipeline-2026-07/`, V3-d Kheelu line sign-off (three new in V3), V3-e a colour
field on the Tally form, plus the standing launch gates: Tally URL, GA4, the two Vercel env vars,
DNS, counsel review, certifications/specs/ship date. The two highest-leverage founder items for
quality are REV-a (final hero art) and R9-a (real photography) — the Apple-tier audit's verdict was
that the structure is at tier and the remaining gap is asset quality.

Historical, completed by V3 (kept for provenance):

- ~~**M5**~~ (folded into V3 cleanup) — delete retired components + tests/stories (`KheeluIntro`, `WhyWeExist`, `Feelings`,
  `MeetLumi`, `WhatLumiDoes`, `HowItWorks`, `SafetyCallout`, `SafetyStrip`, `HeroConversation`,
  `StickyMobileCTA`, `CurveDivider`, `MascotScene`, `KheeluSays`, `hero-glow`, `Beat`) plus the
  `teal-deep` token and `Section`'s teal wash, whose last usage M4 removed. `KheeluSays` is
  still imported by live components (`FinaleCTA`, `ParentAppSection`, `LaunchVideo`, `Journal`,
  `Compare`) behind props their callers no longer pass — strip those call sites first.
  ambient-stage stays dormant. Then the full pass: Lighthouse (100 A11y/BP/SEO, Perf ≥95
  desktop / ≥90 mobile), axe, JSON-LD, href crawl, no-JS check. Plus the AEO plumbing the
  founder deferred here: `llms.txt`, robots.txt allowances for
  GPTBot/PerplexityBot/ClaudeBot/Google-Extended, visible last-updated dates.
- **P5 (rest)** — founder review of https://website-hdn2.vercel.app, then request the 3 app
  images (brief pointer 9 says only after the v1 deploy, which has now happened → REV-d is
  unblocked and ASKABLE).

## Open founder decisions from the M4 preview

1. **The guide overlaps room copy.** At ~1200px window width Kheelu (fixed, bottom-left, 150px)
   covers the first ~100px of the room's text column, hiding a few words per line; it is clean
   at ~1320px+. Accepted as theme-inherent at the M2/M3 previews. Ready fix if wanted: shrink
   and shift the guide below ~1320px.
2. **The `/safety` GATED block** ("Is an AI toy OK for a three-year-old?") is live on the
   preview per founder call, marked `GATED:founder-signoff` in the route file, and deliberately
   absent from that page's FAQPage schema so pulling it orphans no structured data.
3. **Journal retitles** — "Why the early years matter most", "How much screen time is okay for
   a young child?", "What actually builds a sharp brain in the early years" (slugs unchanged).

## Founder-gated (never invent; FOUNDER-TODO.md "THE REVAMP")

REV-a hero art · REV-b subscription/camera/ship-date/10-languages · REV-c stale ₹2,999 in
Google's index (old Wix + Play Store) · REV-d 3 app images · plus all standing launch gates
(Tally URL, GA4, Vercel/DNS, certs, testimonials, legal). Every Kheelu `data-say` line needs
founder sign-off before merge to master (fine on the preview branch).
