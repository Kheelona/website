# REVAMP WORKING FILE — theme B "Kheelu's Tour" → production site

**This is the brief-mandated working file for the 2026-07-24 revamp** (founder brief:
`Websit prompt based on B + inputs - 24-Jul.pdf`, repo root). Keep it current at every step;
cold restart = read this file top to bottom, then `docs/project-state.json`. Delete this file
(and its CLAUDE.md pointer) only after the founder approves the finished revamp.

Approved plan (session 2026-07-24): `~/.claude/plans/virtual-spinning-dolphin.md` — mirrored
here in full so nothing depends on conversation memory.

---

## ⏭ COLD-RESTART: START HERE (last updated 2026-07-28 — MERGED TO MAIN, APP AT REPO ROOT)

**The site is finished, merged, and pushed. Work on `main`.**

> **⚠ ONE THING IS NOT DONE, AND ONLY THE FOUNDER CAN DO IT.** Vercel's **Root Directory**
> setting must be **empty (the repo root)**. It was `site`, and on 2026-07-28 the app moved out
> of `site/` to the repo root — so a project still pointing at `site` builds nothing, and a
> project pointing at the root was already failing before the move with "No Next.js version
> detected". Until that setting is cleared, pushes do not become deployments. Nothing in the
> code can fix this; it is a dashboard setting. FOUNDER-TODO #0.


```bash
cd /Users/apoorvasahu/Documents/kheelona-com-website
git switch main && git pull
npm test                     # expect 237/237 green
npm run build                # token-check 17, then next build
npx next start -p 3456       # local prod at http://localhost:3456
```

**Repository state after the 2026-07-28 cleanup**
- **The app lives at the REPO ROOT** since 2026-07-28 (`package.json`, `next.config.ts`, `src/`,
  `public/`, `test/`, `.storybook/`). `site/` is gone. Any doc, checkpoint or note that says
  `site/...` predates the move: drop the prefix (`cd site && npm test` is now `npm test`).
- `main` IS the website: the theme-B revamp + V3 repositioning, merged 2026-07-28. It replaced the
  legacy Wix commerce app that used to live at the repo root (cart, checkout, member accounts,
  Wix SDK). That app is preserved at the tag **`pre-revamp-2026-07`** — one checkout recovers it —
  and its URLs are 301'd in `next.config.ts` so nothing 404s and the old ₹2,999 product pages
  stop competing in Google's index.
- `demo-website` is the Vercel preview branch only (https://website-hdn2.vercel.app). It carries
  the `/a` `/b` `/c` wireframe drafts on top of main. **Sync by MERGING main into it. Never
  force-push** — that would delete the wireframe commit.
- `revamp/kheelu-tour` is deleted; every one of its commits is reachable from `main`.
- GitHub is clean: 0 open PRs, 0 stale branches. The 5 dependabot PRs and one outside
  contributor's PR were closed with explanations; the dependabot and `feat/login` branches are gone.
- Agent skill packages are gitignored and reinstallable from `skills-lock.json`.

**What the site is**: 11 routes on the room grammar (Home, /products/lumi, /playos, /safety,
/setup, /team, /stories, /stories/[slug], /contact, /privacy, /terms, plus a 404), narrated by a
persistent Kheelu guide, with one schema graph carrying the company as an entity, `/llms.txt` and
`/pricing.md` for agents, and the offer at ₹4,999 for the first 500 units with no payment taken.

**The spec is `BUILD-V3.md`** — the record of what every fold means and why. Its §0 laws and §6
gates still bind every future change.

**Verified at merge**: 225 tests, tsc clean, build green (token-check 17), axe zero violations
across 10 routes at two viewports, Lighthouse A11y/BP/SEO 100 on all 18 runs with Perf 99–100,
mobile clean 320–430px, all internal links 200.

**NOTHING IS LIVE TO CUSTOMERS.** kheelona.com DNS does not point at Vercel. Everything remaining
is founder-gated, listed in FOUNDER-TODO.md: V3-a real testimonial quotes (the site carries
drafted placeholders), V3-b the Kheelona+ price and post-lapse behaviour, V3-c pipeline art,
V3-d Kheelu line sign-off, V3-e a colour field on the Tally form, V3-f named article authors,
V3-g Search Console verification, V3-h the Play Store's ₹2,999 listing, V3-i the backlink campaign,
plus the Tally URL, GA4 ID, the Vercel env vars, DNS, and counsel review of /privacy and /terms.
The two highest-leverage items for quality remain REV-a (final hero art) and R9-a (real
photography).

---

Everything below this line describes the COMPLETED theme-B revamp (P0..M4-b) that V3 builds on.

---

## ⏭ COLD-RESTART: START HERE (last updated 2026-07-25, after M4 + the M4-b mobile pass)

**LIVE PREVIEW: https://website-hdn2.vercel.app** (updated 2026-07-25 with M4 + the mobile pass). The founder
review URL now serves the revamp: branch `demo-website` was MERGED with `revamp/kheelu-tour`
(merge, not force-push, so the wireframe drafts at `/a` `/b` `/c` still resolve) and pushed.
Keep `demo-website` in sync by MERGING the revamp branch into it (never force-push: that
would delete the wireframe commit). Its `NEXT_PUBLIC_*` env vars are
still unset, so the reserve panel shows the placeholder card and GA4 is not measuring.

**All work is on branch `revamp/kheelu-tour`** (pushed to origin; `git log --oneline -8`
lists the milestone commits).
`main` only holds the P0 image hotfix + the P1 doc commit — the revamp itself lives on the
branch. To continue:

```bash
cd /Users/apoorvasahu/Documents/kheelona-com-website
git checkout revamp/kheelu-tour          # the revamp branch (already pushed)
npm test                       # expect 215/215 green
```

**DONE so far:** P0, P1 (all), P2, M1, M2 (Home), M3 (/products/lumi), M4 (all 8 interior
routes), M4-b (the mobile pass), and P5's deploy step. **The whole site now runs one theme** —
every route is a backdrop hero + a room track + the orange finale, narrated by KheeluGuide.
Tests 215/215 + build green, all 10 routes walked in Chrome, 23-href crawl clean, `#reserve`
present everywhere (including the 404, which had a dead nav anchor before M4), and phones are
clean at 320/360/390/430px (no sideways pan, no stretched fixed layer) both locally and on the
live preview.

**NEXT = M5 (cleanup + full QA)**:
1. Delete the retired files + their `.test.tsx`/`.stories.tsx` (list below) and the now-unused
   `teal-deep` token + `Section` teal wash (M4 removed its last usage, /safety's hero).
2. Full pass per website-steps §8.20 item 5: Lighthouse 100 A11y/BP/SEO on every route both
   form factors, Perf ≥95 desktop / ≥90 mobile (judge mobile on devtools-throttled medians),
   axe on all 10 routes, JSON-LD validation, sitemap/robots/OG, SSR/no-JS render check.
3. AEO plumbing deferred here by founder call: `llms.txt`, robots.txt allowances for
   GPTBot/PerplexityBot/ClaudeBot/Google-Extended, visible last-updated dates.
**P5 is half done**: the preview is deployed (link above). What remains is the founder review of
it, and then the 3 app images — brief pointer 9 gated that ask on the v1 deploy, which has now
happened, so **REV-d is unblocked and askable** (FOUNDER-TODO updated to say so).

**M4-b mobile pass DONE (2026-07-25)**, after the founder reported mobile issues. Root cause:
the directional room reveals translate X by ±46px, which on a phone pushes a full-width room
past the screen and makes mobile Chrome widen the LAYOUT VIEWPORT (417px on a 390px screen) —
that one detail caused the sideways pan, the stretched fixed dock with its Reserve button
off-screen, and the cropped-looking copy. Sideways reveals now wait for 960px (the gutter only
absorbs 46px at ~920px wide). Also fixed: long ghost button labels wrap below sm; PhoneFrame is
`max-w-full` + its grid item `min-w-0`; /team's bio column drops its 280px minimum below sm;
/stories' art column narrows; `p { text-wrap: pretty }` moved into `@layer base` (unlayered CSS
outranks utilities, so it had been silently beating `truncate` and making the guide dock three
lines / 86px tall — now one line / 67px); and **CompareTable stacks one card per claim below sm**
instead of being a 640px sideways scroll with Lumi's "Yes, up to 10" sliced mid-word and the
three alternatives off-screen. Verified 320/360/390/430px: 9/9 routes, no pan, no stretched
fixed layer; 1024px unchanged. Full write-up: `docs/qa-report.md` "Revamp M4-b".
HARD RULE ADDED: never animate X on an element that spans the track width; and any base-level
element rule in globals.css belongs in `@layer base`.

**M4 preview flags for the founder** (say so at review):
- **The guide overlaps room copy**, not just headings. At a 1200×760 desktop window Kheelu
  (fixed, bottom-left, 150px) sits over the first ~100px of the room's text column, so a few
  words per line are hidden on almost every route. Accepted as theme-inherent at the M2/M3
  previews; it is more visible now that 8 more routes have body copy there. Ready fix if
  wanted: shrink and shift the guide on viewports narrower than ~1320px.
- `/safety` carries the **GATED:founder-signoff** answer block "Is an AI toy OK for a
  three-year-old?" (the point-by-point reply to child-development guidance). It renders on the
  preview so it can be read in place, is marked `GATED:founder-signoff` in
  `src/app/safety/page.tsx`, and is deliberately absent from the page's FAQPage schema so
  pulling it leaves no orphaned structured data.
- Journal age pass (founder call): product-facing copy is 3 to 10 everywhere; three articles
  were retitled off the "3 to 6" band with **slugs unchanged** ("Why the early years matter
  most", "How much screen time is okay for a young child?", "What actually builds a sharp brain
  in the early years"). One "aged 3 to 6" survives on purpose, in the SOURCED sleep-guidance
  sentence — restating cited WHO/AAP age bands as 3 to 10 would fabricate a claim.
- `/setup` is deliberately short (hero + one steps room + finale): copy-v2 specifies only the
  four steps for that route, and no unreviewed copy was invented to pad it.

**Known follow-ups to honour during M5**:
- ~~`[data-reveal]` after CLIENT-side nav~~ **FIXED in M4**: `RevealObserver` now re-arms on
  `usePathname()` (it lives in the persistent layout, so the mount-only effect left every
  client-navigated route's rooms at `opacity: 0`). Regression test in
  `RevealObserver.test.tsx`; verified in Chrome by navigating Home → Team → Stories.
- Retire in M5 (files still present, unmounted from every route): `KheeluIntro`, `WhyWeExist`,
  `Feelings`, `MeetLumi`, `WhatLumiDoes`, `HowItWorks`, `SafetyCallout`, `SafetyStrip`,
  `HeroConversation`, `StickyMobileCTA`, `CurveDivider`, `MascotScene`, `KheeluSays`,
  `hero-glow`, `Beat` — each with its `.test.tsx`/`.stories.tsx`. `features/ambient-stage/`
  stays DORMANT (not deleted — same law as the 3D journey). `home/index.ts` marks the retired
  exports. NOTE: `KheeluSays` is still imported by live components (`FinaleCTA`,
  `ParentAppSection`, `LaunchVideo`, `Journal`, `Compare`) behind props their callers no longer
  pass — strip those call sites before deleting the file.
- The last "3 to 6" strings live only in retired components (`MeetLumi`, `WhatLumiDoes`), which
  M5 deletes. Nothing published renders them.
- Founder-gated, do NOT invent: REV-a hero art, REV-b (subscription/camera/ship/languages),
  REV-c stale ₹2,999 index, plus all launch gates in FOUNDER-TODO.md.
- Every Kheelu `data-say` line is GATED:kheelu-line — founder sign-off before merge to master
  (queue = the guide-line lists in copy-v2.md). Fine to ship on the preview branch. M4 shipped
  exactly the copy-v2 lines, no new ones invented: playos hero + its carried-over voice-path
  line, safety hero, setup hero, team hero, stories hero, privacy, terms, and Home's finale
  line reused on every route's orange room. `not-found` has a pose but no line.

---

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
| M2 Home (founder preview #1) | DONE + visually verified in Chrome (commit `ddf5996`). Dialog double-shift bug found + fixed: Tailwind v4 standalone `translate` vs keyframe `transform` — animate `scale`/`opacity` only. Home = hero (interim composed art) + 12 rooms + guide narration. Tests + build green. PREVIEW FLAGS for founder: guide bubble can overlap bottom-left copy on short viewports (theme-inherent, B behaved the same); two Kheelus visible in hero (guide + art) until REV-a final art; Family row replaced the 3-SKU shop (colorways moved to /products/lumi); footer cocoa unchanged |
| M3 /products/lumi (founder preview #2) | DONE + visually verified in Chrome (commit `87a812a`). ColorwayPicker (radiogroup, arrow keys, no-CLS swap verified blue→green→pink) + 11 rooms + FAQ v2 + JSON-LD "Lumi by Kheelona". Tests 206/206, build green |
| M4 remaining 8 routes | DONE + verified in Chrome. playos/safety/setup/team/stories/stories-slug/privacy/terms/not-found all on the room grammar. New shared parts: `PageHero` became the theme-B hero shell (own `<section>`, track width, `guide`/`say`), new `AnswerBlock` molecule (question-led H2/H3 + 40–60 word visible answer, AEO), new `FamilyGrid` organism (de-duplicated Home + /playos lineups), `LegalDoc` on rooms, `SectionHeading` gained a fourth `nested` type step, `PhoneFrame` gained `priority` (the /setup hero owns its LCP). Fixed the latent `RevealObserver` client-nav bug. Journal age pass done (slugs unchanged). FAQPage schema mirrors the new visible answers on /safety + /playos. Tests 222/222, build green (token-check 18) |
| M5 cleanup + full QA | **NEXT** — delete retired files (list above) + `teal-deep`, Lighthouse/a11y/voice-lint/crawl pass, then the deferred AEO plumbing (llms.txt, AI-crawler robots rules, last-updated dates) |
| V3 content repositioning | **NEXT** — full spec `BUILD-V3.md` (2026-07-27, from the founder's YC application + benchmark research `benchmarks-v3.md`). Supersedes M5-as-next; M5 cleanup folds into V3-5 |
| P5 deploy v1 → THEN ask for 3 app images | PREVIEW DEPLOYED 2026-07-25 — `demo-website` merged with the revamp (merge, NOT force-push, so `/a` `/b` `/c` survive) and pushed; https://website-hdn2.vercel.app verified live (10 routes 200, new metadata serving, `/b` still resolving). REMAINING: founder review of that URL, then ask for the 3 app images (REV-d — brief pointer 9 gated it on the v1 deploy, which has now happened) |

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
| A3 | Belly-speaker product renders (lumi-*.jpeg in public/product/) | need `tools/cutout` + founder call on adopting as product art |
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
4. Verify commands: `npm test` · `npm run build` · Storybook `npm run storybook`.
   Local prod: `npx next start -p 3456`. Node ≥ 24.
5. Launch gates unchanged in FOUNDER-TODO.md (Tally URL, GA4, Vercel, claims...).
