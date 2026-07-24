# REVAMP WORKING FILE — theme B "Kheelu's Tour" → production site

**This is the brief-mandated working file for the 2026-07-24 revamp** (founder brief:
`Websit prompt based on B + inputs - 24-Jul.pdf`, repo root). Keep it current at every step;
cold restart = read this file top to bottom, then `docs/project-state.json`. Delete this file
(and its CLAUDE.md pointer) only after the founder approves the finished revamp.

Approved plan (session 2026-07-24): `~/.claude/plans/virtual-spinning-dolphin.md` — mirrored
here in full so nothing depends on conversation memory.

## Status

| Step | State |
|---|---|
| P0 hotfix (lumi image renames) | DONE — master `e71a963`, tests 165/165, build green, render 200 |
| P1.1 working file + CLAUDE.md pointer | DONE (this file) |
| P1.2 Gemini hero-art kit | DONE — `gemini-handoff/hero-2026-07/` (3 refs + prompt + gates). WAITING ON FOUNDER to generate + drop in ~/Downloads |
| P1.3 market research memo | DONE — `docs/revamp-2026-07/research.md` (competitors, parent voice, keyword map v2, AEO question bank). NEW founder facts needed: FOUNDER-TODO REV-b (subscription/camera/ship/languages) + REV-c (stale ₹2,999 in Google index) |
| P1.4 production copy (all routes, B voice) | DONE — `docs/revamp-2026-07/copy-v2.md` (the build transplants it verbatim; provenance-tagged; GATED blocks marked). Kheelu line queue = copy-v2.md guide-line lists |
| P1.5 QA strategy into blueprint | DONE — website-steps.md §8.20 |
| P2 tokens/design-system | DONE — branch commit `850a87a`: teal/purple/blue-soft/serif retired + usages migrated, blue-ink + action + room tokens added, check-tokens synced (18 mappings), DS annotated. teal-deep DEPRECATED until M5 |
| M1 theme core (branch `revamp/kheelu-tour`) | DONE — atoms `SiteBackdrop`/`Room`/`RoomsTrack`, reveal variants left/right/pop, `lib/kheelu-poses.ts` extraction, `KheeluGuide` organism mounted in layout (StickyMobileCTA unmounted; file deletes in M5), tests 179/179 + build green + SSR probe. Navbar/Footer restyle deferred into M2 (judge against real rooms). NOTE for M5 QA: verify [data-reveal] still animates after CLIENT-side nav (RevealObserver scans only on mount — possible latent gap, check before reveals go on rooms) |
| M2 Home (founder preview #1) | BUILT + visually verified in Chrome (dialog double-shift bug found + fixed: Tailwind v4 standalone `translate` vs keyframe `transform` — animate `scale`/`opacity` only). Home = hero (interim composed art) + 12 rooms + guide narration. Tests 202/202, build green. PREVIEW FLAGS for founder: guide bubble can overlap bottom-left copy on short viewports (theme-inherent, B behaved the same); two Kheelus visible in hero (guide + art) until REV-a final art; Family row replaced the 3-SKU shop (colorways moved to /products/lumi); footer cocoa unchanged |
| M3 /products/lumi (founder preview #2) | pending |
| M4 remaining 8 routes | pending |
| M5 cleanup + full QA | pending |
| P5 deploy v1 → THEN ask for 3 app images | pending |

## Locked decisions (founder, 2026-07-24 — do not re-ask)

1. **Colour**: 4 brand colours (#EF762F, #F1A23B, #FFFFFF, #29A0D7) + neutral ink family +
   the darkened functional oranges (#C25210 fills / #B54A0D small text) ONLY where WCAG 4.5:1
   demands. Washes stay as brand tints. Teal (#1ABC9C), teal-deep (#0F766E), purple (#8B5BFF),
   blue-soft retire from the web palette.
2. **Hero art**: founder generates FINAL Kheelu-talking-to-Lumi art from the Gemini kit BEFORE
   the hero ships. The sample embedded in the brief = reference only. Interim previews use
   composed cutouts (Kheelu pose + plush).
3. **Copy**: new production copy everywhere, B voice, research-guided. Old "Home = PDF verbatim"
   law retired. Prices/cap/claims discipline unchanged (never invent claims).
4. **Fonts**: Glory + Instrument Sans ONLY. Instrument Serif retired site-wide (quotes restyle
   in Glory + yellow marks).

Earlier locked (wireframe round): mascot spelling **Kheelu**; ages **3 to 10**; theme base = B.

## The 11 brief pointers (all in scope)

1. No section numbering (B's counter nodes + dotted trail dropped).
2. Hero: Kheelu-talking-to-Lumi image RIGHT + few interactive bubbles, minimal copy LEFT.
3. "Recognised by" = production `RecognitionStrip` content (4 entries + safety line).
4. Less text → assets/infographics/interactive elements. ALL generation founder-run via Gemini
   from prompt kits (`gemini-handoff/` pattern); ingest from `~/Downloads`.
5. Brand colours only (per locked decision 1).
6. Keep "How Lumi compares" (restyle, B voice, parent-friendly words, age row "3 to 10").
7. Fonts Glory + Instrument Sans only.
8. All routes carry over; ONE connected theme; nothing may look disconnected.
9. 3 mobile app images: founder shares AFTER v1 deploy — do not ask earlier.
10. Element source if needed: github.com/apoorva262/kheelona.ai.
11. (a) Trust section: brand blob shape per point; (b) "Here is what a day with Lumi feels
    like" = Kheelu amid rotating activity/stat cards (ref https://pin.it/19tEfJj8h);
    (c) Feelings = app-store character cards; click opens a UNI-style detail overlay.

Process notes that bind this work: follow docs/standards/; design system = single source of
truth (update `Design/design-system/` with assets + usage instructions as we go; never
hard-code DS values); ask consumer-facing questions; use project marketing skills; real market
research; production-ready copy; QA strategy before build; never leave the project folder;
research-only GA4 via Chrome.

## Architecture (adopted; details in the approved plan)

- New atoms: `Room` (fills white/cream/cool/sun/orange; data-guide/data-say/data-reveal),
  `RoomsTrack` (1180px column), `SiteBackdrop` (CSS-only fixed gradient + tints + one drifting
  blob). Section survives for heroes (`wash="none"`) + legal; CurveDivider retires.
- Reveal variants left/right/pop join the existing RevealObserver CSS. Transform/opacity only.
- Ambient three.js canvas goes DORMANT (StageGate unmounted per converted route; feature kept).
- `KheeluGuide` organism (client): fixed bottom-left narrator, IO on `[data-say]` (-45%
  rootMargin), 7 stacked pose images (new `src/lib/kheelu-poses.ts`), aria-hidden bubble, NO
  live regions, poke button, pointer-follow desktop-only + paused on hidden tabs, mobile dock
  ABSORBS StickyMobileCTA, reduced-motion static, hidden without JS, one tab stop.
- Home rooms: Recognition → Statement (WhyWeExist absorbs KheeluIntro) → Film → Trust
  (TrustRoom + Shape chips; absorbs SafetyCallout+SafetyStrip) → Family (MeetLumi restyle) →
  Warm (KheeluOrbit) → Feel (FeelingsGallery + ChatDemo + languages) → Parents (AssetSlot for
  app images) → Compare → Pilot → Journal → FinaleCTA (orange Room). Retired from Home:
  KheeluIntro, SafetyCallout, SafetyStrip, HowItWorks, HeroConversation.
- New shared: ChatDemo (CSS typing, at-rest fallback), AssetSlot (image-or-calm-fallback),
  FeelingsGallery (Radix Dialog detail), ColorwayPicker (lumi route, radiogroup).
- Every new/changed component: colocated story + test. Registry molecules + config/site
  constants are law.

## Asset queue (founder-run Gemini; kits in gemini-handoff/)

| # | Asset | Status |
|---|---|---|
| A1 | HERO: Kheelu talking/whispering to Lumi (final art) | KIT READY: `gemini-handoff/hero-2026-07/` — founder to run |
| A2 | 3 mobile app images | WAIT until after v1 deploy (brief pointer 9) |
| A3 | Belly-speaker product renders (lumi-*.jpeg in site/public/product/) | need `tools/cutout` + founder call on adopting as product art |
| A4 | Infographic slots discovered during build (per-room) | collect during M2-M4, batch kit |

## Kheelu guide say-lines (founder sign-off queue)

DRAFTED — full per-route list lives in `copy-v2.md` (Home 12 lines + poke 5 + one or two per
interior route), every one tagged GATED:kheelu-line. Founder signs off at the M2/M3 preview;
none ship to production before sign-off (previews on the branch are fine).

## Founder checkpoints at previews (do not forget)

- M2/M3 preview: guide say-line sign-off; hero final art in or interim OK'd; MeetLumi
  family-row vs 3-SKU-shop call; footer cocoa colour (dark neutral, technically off the
  4-swatch card) keep/change; two-Kheelus-in-hero (guide + hero art both show Kheelu).
- After v1 deploy: request the 3 app images (A2).

## Restart instructions

1. Read this file, then `docs/project-state.json` (`last_handoff`), then the approved plan
   mirror above if more detail is needed.
2. Wireframe B source: `docs/wireframes/2026-07/` (templates/b.html + kit.css + copy.json +
   README). Copy seed = copy.json. Standards: `docs/standards/`.
3. Work happens on branch `revamp/kheelu-tour` (except P0/P1 docs which live on master).
4. Verify commands: `cd site && npm test` · `npm run build` · Storybook `npm run storybook`.
   Local prod: `npx next start -p 3456`. Node ≥ 24.
5. Launch gates unchanged in FOUNDER-TODO.md (Tally URL, GA4, Vercel, claims...).
