# BUILD-V4 — team feedback round (2026-07-30)

> **STATUS: IN BUILD on `demo-website`.** Source: the team's section-wise feedback,
> committed at `docs/revamp-2026-07/team-feedback-2026-07-30.pdf` (received as
> "Website prompt based on B + inputs - 24-Jul", a NEW document, not the committed
> 24-Jul brief with the near-identical filename). Where this spec conflicts with
> BUILD-V3 or older copy docs, THIS SPEC WINS. BUILD-V3's §0 laws still bind except
> where a numbered decision below explicitly supersedes one (D1 button colour,
> D5 finale fill, D6 PlayOS audience).
>
> Everything lands on `demo-website` for founder review at
> https://website-hdn2.vercel.app; the founder merges to `main` manually.
> The preview shows the "opens soon" card instead of the Tally form (env var is
> production-scoped) — expected, not a fault.

Goal unchanged: kheelona.com converts parents into ₹4,999 pre-bookings. The team's
verdict on the live site: "too much content, less value". This round makes the site
SHOW instead of tell (real audio of Lumi replaces paragraphs about Lumi), tightens
every page, and repositions the hero on the tutor claim.

---

## §0 Decisions locked this round (founder, 2026-07-30 — do not re-ask)

| # | Decision |
|---|---|
| D1 | **Buttons are brand orange `#EF762F` with dark ink text** (`text-ink-head`, measured 5.9:1, passes AA). White text on #EF762F is 2.9:1 and fails at every size, so the white-label law (R5) is RETIRED with the founder's sign-off. White keyline on buttons removed. Applies to nav pill, mobile dock chip, and every Button variant. |
| D2 | **Hero H1**: `Your kid's favourite tutor.` line 2 (orange): `Their best friend first.` Sub: the team's line polished: `A smart plush companion that listens, remembers, and adapts. It guides your child through stories, numbers, and languages at their own natural speed.` |
| D3 | **Reserve form: 5 fields** — Your name · Kid's age · Mobile number · WhatsApp consent · City. The founder edits Tally `Y5XW7J` (FOUNDER-TODO V4-a); until then the live 6-field form keeps working and the site copy stays compatible with both. |
| D4 | **Micro-interactions: not excessive.** Subtle and purposeful, every one earns its place, tap parity on mobile, reduced-motion complete-state fallbacks. (The founder's "should be excessive" was confirmed as a typo.) |
| D5 | **The finale is WHITE on every route** (one theme). Plush lineup images removed. The orange Room fill retires if nothing else uses it. |
| D6 | **/playos speaks to VCs**: vision + MOAT + technical depth, shorter. Supersedes the R11 "parent-voice only" law. Still no per-unit pricing; the kheelona.ai pointer stays the only partner CTA. |
| D7 | The launch film ("Watch two friends meet.") comes OFF Home and is not resurfaced elsewhere — the team read it as "cheap, AI-generated". Files stay in the repo; the VideoObject leaves Home's JSON-LD (schema mirrors visible content only). |
| D8 | Audio demos are REAL product audio (4 clips the team supplied from Drive). Transcripts render verbatim next to each play button, with two punctuation-only edits for the voice-lint law (§3 F3). |

**Unchanged laws that still bind every edit here**: never invent claims (§6 gates),
voice-lint (zero em-dashes, no italics, no exclamations outside quoted toy/child
speech, second person present tense, no contractions in body copy, one CTA verb
Reserve, prices/ages/subscription wording only from `@/config/site`), registry
molecules first, story + test per component, transform/opacity animation only, never
animate X on track-width elements, `@layer base` for element CSS, copy-only-hero
routes ship their first room reveal-free, plush stays the hero's largest element,
tilt never wraps whole-card links, A11y/BP/SEO 100 gates, Gemini generation is
founder-run from prompt kits.

## §1 The feedback → build map (every team item, dispositioned)

| Team item | Disposition |
|---|---|
| Mascot text overlaps room copy | Guide moves to bottom-RIGHT on desktop, shrinks below 1320px, bubble narrower; say lines capped short (§5.1) |
| Remove "You read every word" / "No screen, ever." / "Up to 10 home languages." | Hero bubbles removed entirely (HeroStage keeps art only). The claims stay alive where they already live (parents room, trust room, audio-room closing line + footnote) |
| H1 → "Kid's Favourite tutor" | D2 (polished two-line lockup, founder-picked) |
| Sub → "A smart plush companion..." | D2 (grammar/voice polish: fragment fixed, "Speed" lowercased) |
| Remove Meet Kheelu button | Done — single Reserve CTA in hero |
| Random orange → #EF762F | D1 |
| Remove white border on buttons | D1 |
| Cap line "not clearly visible" | Promoted: semibold ink on a soft sun chip directly under the CTA (§3 F1) |
| Section 2: remove the safety proof line, rewrite | Logos stay (real recognitions), the `Wake-word mic · ...` line is deleted, strip tightened (§3 F2) |
| Section 3 → "Play, Learn Together" + 4 audio clips + one line | New AudioMoments room replaces Statement (§3 F3) |
| Section 4 film "looks cheap" → How It Works sequence + flowchart | New LoopRoom replaces the film room (§3 F4), D7 |
| Section 5 "What parents say" | Kept as-is (no change requested; title stays "The first families are already talking.") |
| Reserve: no Lumi images, white, 4 fields | D3 + D5 (§3 F13) |
| PlayOS: technical + vision, VC focus, interactive image, shorter | D6, full rebuild (§4.2) |
| "Too much content less value" | Home 15 rooms → 13 with 4 heavy rooms replaced by 2 lighter ones; every surviving lede trimmed; interior pages slimmed with links instead of repetition (§4) |

## §2 Shared changes (slice V4-1)

### 2.1 Tokens + Button system (D1)
- `--color-action` repoints from `orange-cta` to `orange` (#EF762F); new
  `--color-action-text` is NOT needed — labels use existing `ink-head`.
- `Button` variants: `primary` = `bg-action text-ink-head shadow-cta`, no border;
  hover keeps the lift+shadow (no fill change, contrast never dips); `onDark`
  = same treatment (used on footer cocoa; #EF762F on cocoa is decorative fill, label
  ink-head on orange unchanged). `ghost` unchanged (dark keyline, transparent).
- Navbar CTA pill + KheeluGuide mobile dock chip: `bg-action text-ink-head`.
- `orange-cta` token: retire IF the greps show zero remaining usages after the
  finale flip (expected); token-check mapping count updates with it. `orange-ink`
  (#b54a0d) SURVIVES: kickers + the hero's orange line (`text-action-ink`).
- Update Button/Navbar/KheeluGuide tests + stories; re-run token-check.

### 2.2 `TallyEmbed` caption + FinaleCTA copy (D3)
The consent caption stays accurate for both the current 6-field and the coming
5-field form: `Your WhatsApp number is only for updates about your reservation.
You can leave the list anytime.` No code change needed for the fields themselves
(they live in Tally). Iframe height law (≥900px test) holds until the founder's
5-field form is live, then re-measure and adjust with the test.

### 2.3 New molecule: `AudioMoment` (+ `AudioMoments` group)
- One card = play/pause button (48px round, `bg-action`, ink icon) + a speech-bubble
  transcript (the same bubble language as Kheelu's, tail to the button) + a small
  teaching-area chip + a 4-bar equaliser that animates ONLY while playing.
- One `<audio preload="none">` per card (mobile data respected); playing one pauses
  the others (group-level state); `aria-label="Play: <first words>"`,
  `aria-pressed` on the button; transcript is visible text (the accessibility story
  IS the transcript); `onError` hides the button and keeps the transcript, so a
  missing file degrades to copy, never to a broken control.
- Reduced motion: no equaliser animation, icon swap only. No autoplay anywhere.
- Files: `public/audio/lumi-demo-{knight,shoes,breathe,apples}.mp3` (founder
  download, V4-b). Colocated story + test (renders transcript, button per clip,
  one-at-a-time contract via mocked HTMLMediaElement).

### 2.4 New organism: `LoopRoom` diagram (`HowItWorksLoop`)
- Desktop/tablet: three nodes on an SVG ring with arrow arcs and a return glyph;
  the active node scales slightly and fills `bg-orange/15`; auto-advances every
  2.5s while the room is on screen (IntersectionObserver-gated), pauses on
  hidden tabs, stops permanently on first user selection; every node is a real
  `<button aria-pressed>` (tap parity).
- Below `sm`: the ring becomes a vertical 1 → 2 → 3 → repeat flow (stacked, a
  connecting line drawn with borders, the loop arrow at the end) — no X animation,
  nothing spans off-track.
- Reduced motion: no auto-advance, no scale; all three nodes rendered expanded.
  No-JS: the static expanded state IS the server render (choreography is a
  progressive enhancement).
- Colocated story + test.

### 2.5 New organism: `ArchitectureStack` (/playos, §4.2)
- Five horizontal layer bars in a card; the top layer floats above a "waterline"
  divider (sky → water gradient, pure CSS) with the labels `What families see` /
  `What we build underneath`. Click/tap (or Enter/Space) expands a layer to reveal
  its chip set + one plain-words line; exactly one open (accordion semantics,
  `aria-expanded`, chevron); hover on fine pointers previews with a gentle lift
  (transform only) but never opens — tap/click is the single source of truth, so
  mobile and desktop share one mental model.
- Reduced motion: instant expand/collapse. No-JS: server renders ALL layers
  expanded (the full architecture is crawlable). Colocated story + test.
- Content: ONLY labels legible in the team's reference diagram (re-verified against
  the PDF at build time) + facts already published on /playos or kheelona.ai.
  Anything illegible is omitted, never guessed (§6).

## §3 Home (`src/app/page.tsx`) — slice V4-2/V4-3

Order (hero + 13 rooms; was hero + 15): Hero → Recognition → **AudioMoments** →
**Loop** → Day-with-Lumi (+modes strip) → Trust → Family → Feelings (slimmed) →
Parents (+K+ band) → Compare → Quotes → FAQ → Journal (+footnotes) → Finale (white).
Removed: Statement, Film, LearningRoom, BrainRoom (their jobs absorbed by the two
new rooms; BrainRoom's serve-and-return survives as the Loop room's closing line).

### F1 Hero (rework)
- Age chip unchanged: `For ages {LUMI_AGES}`.
- H1: `Your kid's favourite tutor.` / line 2 in `text-action-ink`:
  `Their best friend first.`
- Sub: `A smart plush companion that listens, remembers, and adapts. It guides
  your child through stories, numbers, and languages at their own natural speed.`
- ONE button: `{RESERVE_LABEL}`. The `Meet Kheelu` ghost is gone.
- CAP_LINE promoted: its own line directly under the button, `text-[16px]
  font-semibold text-ink-head` inside a soft `bg-yellow/15` rounded chip (matches
  the age-chip treatment; the offer becomes the hero's second-loudest element).
- Guide hint (`Your guide is waiting in the corner. Give Kheelu a poke.`) stays,
  md+ only — with Meet Kheelu gone it is the only pointer at the narrator.
- HeroStage: the three floating bubbles are REMOVED (art only). The plush remains
  the largest element and keeps `priority` (LCP law). fn-1's superscript moves to
  the audio room's languages line (F3).
- 5-second test still passes: what (tutor in a plush), who (2 to 5), offer
  (cap chip), risk (no payment now).

### F2 Recognition (slim)
`RecognitionStrip bare` WITHOUT `safetyLine` (the `Wake-word mic · ...` line is
deleted from Home; the four facts all still live on /safety and in the Trust room).
Label + four entries unchanged — real recognitions stay. Padding tightens
(`py-8` equivalent inside the room). `safetyLine` prop and its test survive
(other call sites unaffected; Home just stops passing it).

### F3 NEW — Play, learn, together. (AudioMoments room; replaces Statement)
- Room `fill="cream"`, `reveal="left"`, guide `joy`,
  say `Go on, press play. That's my best friend talking.` [GATED:kheelu-line]
- Kicker: `Hear it for yourself`
- H2: `Play, learn, together.` (the team's "Play, Learn Together" set in the
  site's sentence-case heading style)
- Lede (the team's one line, second person): `Lumi teaches in the way your child
  likes. Press play and listen in.`
- Four `AudioMoment` cards (2×2 md+, stacked below), transcripts verbatim from the
  team doc except two voice-lint punctuation edits (em-dash → comma in clip 3; the
  stray comma before "floating logs" dropped in clip 1). Exclamations and
  contractions inside quoted toy speech are sanctioned:
  1. chip `Thinking games` — `Oh no, the bridge is out! To help the knight cross
     the river, should we build a boat out of heavy rocks or floating logs?
     Choose one.` (`lumi-demo-knight.mp3`)
  2. chip `Everyday skills` — `Wait, I forgot... do we need to put our shoes on
     before or after our socks? Can you show me how you do it?`
     (`lumi-demo-shoes.mp3`)
  3. chip `Big feelings` — `I'm feeling a little overwhelmed by that loud noise,
     can we take three big breaths together?` (`lumi-demo-breathe.mp3`)
  4. chip `Numbers` — `We have 40 apples for our picnic, but a sneaky squirrel
     just ran off with 2! How many do we have left to share?`
     (`lumi-demo-apples.mp3`)
- Closing line (16px, ink-muted) with the fn-1 superscript: `In the languages you
  speak at home, up to ten of them.`
- Mid-page conversion moment (the strongest fold gets the ask): Reserve Button +
  PRICE_CAPTION under the grid.

### F4 NEW — the loop (replaces the film room)
- Room `fill="white"`, `reveal="right"`, guide `curious`,
  say `Round and round we go. Cleverer every lap.` [GATED:kheelu-line]
- Kicker: `How it works`
- H2: `A loop that learns your child.`
- Lede: `Three steps, then it repeats. Every round fits your child a little
  better.`
- `HowItWorksLoop` nodes (team copy, typos fixed, parent verb leads with the
  team's term as the small label — the LumiModes naming convention):
  1. `Talk and play` (label `Step 1`) — `Your child asks questions, plays word
     games, and listens to stories that talk back, in their own language.`
  2. `Lumi remembers` (label `Step 2 · Adaptive memory`) — `Lumi keeps track of
     the words your child knows, what they love, and the pace they learn at.`
  3. `Knowledge that sticks` (label `Step 3 · Real-world learning`) — `New ideas
     arrive inside everyday conversation, not forced drills.`
  - Return note on the loop glyph: `Then it begins again, one level wiser.`
- Closing line (absorbs BrainRoom, with its journal link): `Researchers call this
  serve and return, the back and forth that builds language and thinking in the
  years the brain grows fastest.` + link `Read the science in the journal` →
  `/stories/how-children-learn-by-talking`.

### F5–F12 (kept rooms, slim edits only)
- **Day with Lumi** (`KheeluOrbit` + `LumiModes strip`): unchanged content; the
  room's say line carries over.
- **Trust**: cards word-for-word; lede trimmed to one sentence if it runs two.
- **Family**: unchanged (already tight).
- **Feelings** (slim): SectionHeading + `FeelingsGallery` only. The ChatDemo block
  and the languages paragraph LEAVE Home (audio superseded the typed demo; the
  languages line moved to F3). `ChatDemo` itself survives on /products/lumi.
- **Parents room**: unchanged copy + K+ band (this is where `You read every word`
  lives on after the hero bubbles).
- **Compare**: unchanged + tuition line.
- **Quotes**: unchanged (team's Section 5 asked for nothing).
- **FAQ**: unchanged entries.
- **Journal**: unchanged + FootnotesRow (fn-1 anchor now referenced from F3).

### F13 Finale (white, D3/D5)
- Room `fill="white"` (all routes; ids and the `#reserve` contract unchanged).
- H2 + price para flip to ink on white; plush LINEUP REMOVED (`variant="full"`
  loses its image row entirely); K+ short line, Tally embed, consent caption and
  the WhatsApp share link all stay, restyled for white.
- The form is the room's visual anchor (sanctioned deviation from §5.1's
  every-room-owns-an-anchor rule — recorded here).

### Metadata (Home + layout)
Title: `Lumi by Kheelona: your kid's favourite tutor, in a screen-free talking
toy (ages 2 to 5)`
Description: `Lumi listens, remembers, and adapts. Stories, numbers, and languages
at your child's natural speed, with no screen and every word readable by you.
Reserve at ₹4,999, no payment now.`
(Both re-checked against the Ahrefs pull in V4-6 before QA.)

## §4 Other routes

### 4.1 `/products/lumi` (slim + align)
- Kheelu-mode room: the typed `LearnDemo` swaps for a compact 2-clip
  `AudioMoments` (knight + apples) — hearing beats reading a transcript of typing.
- PacePanel unchanged (it IS the tutor argument). FAQ, colorways, everything else:
  copy-trim pass only, no restructure.
- Hero lede aligns to the adaptive claim if it does not already.

### 4.2 `/playos` (rebuild, D6 — hero + 5 rooms, was hero + 8)
Audience: the VCs the founders are reaching out to; curious parents second. Facts
only from: current /playos copy, kheelona.ai, /team bios, the team's architecture
diagram. NO invented numbers, NO "India's first", NO user counts.
- **Hero**: kicker `PlayOS` · H1 `The operating system for childhood.` · lede
  `PlayOS is the platform under every Kheelona friend: one safe voice brain, one
  memory of your child, many bodies from age 2 to 14. Lumi is the first body.
  It will not be the last.` Media: magic-box.png (real hardware is the credibility
  shot). Guide line unchanged [GATED].
- **Moat room**: H2 `The moat, in plain words.` Four cards:
  1. `Own the stack` — `Custom board, firmware, cloud brain, and the parent app,
     built by one team. Nothing rented that matters.`
  2. `Own the model` — `A small voice model trained only for children, not shrunk
     from adult AI. It learns from conversations families separately opt into,
     and nothing is ever sold.`
  3. `Own the languages` — `Up to 10 home languages, built for India first.
     A child who can wonder in their own words wonders more.`
  4. `Own the years` — `One friend from 2 to 14: the toy, then the speaker, then
     books that answer back. The memory travels, so families stay.`
- **Architecture room**: H2 `Above the water, a toy. Below it, a platform.` +
  `ArchitectureStack` (§2.5). Lede: `Tap a layer to open it. The toy your child
  hugs is the smallest part of what we build.`
- **Flywheel + credibility**: trimmed "brain keeps growing" copy + RecognitionStrip
  (bare, no safety line) + the one published team line (`a CTO with 14 patents
  filed in his own name`) linking to /team.
- **Parents bridge** (compact): `Parents hold the keys.` — two lines + links to
  /products/lumi and /safety (the deep app + safety content lives there; this page
  stops duplicating it).
- **Finale compact (white)** + the kheelona.ai investor pointer above it.
- Metadata: `PlayOS by Kheelona: one platform for childhood, ages 2 to 14` /
  description on platform + moat terms, finalised after the Ahrefs pull.

### 4.3 `/safety`, `/setup`, `/team`, `/stories`, legal
- /safety: keep structure (recently rebuilt, question-led); trim any two-sentence
  lede to one where value holds; the GATED three-year-old block untouched.
- /setup: already minimal; finale flips white like everywhere.
- /team: no bio changes (recently refreshed from YC facts).
- /stories index: unchanged this slice; V4-7 adds five articles.
- Legal: untouched (counsel gate). 404: finale flip only.

## §5 Interaction table (D4: subtle, purposeful, mobile-first)

| Element | Interaction | Reduced-motion / no-JS |
|---|---|---|
| Buttons | Existing lift + ripple, now on `bg-action` | Already gated |
| Hero cap chip | none (static emphasis) | — |
| AudioMoment | Press → play + 4-bar equaliser; one at a time; pressing another pauses the first | Icon swap only / transcript is complete content |
| HowItWorksLoop | Auto-advance highlight while visible; tap/click selects and stops the tour | Static, all nodes expanded (also the SSR state) |
| ArchitectureStack | Tap/click expands one layer; hover lifts (fine pointers) but never opens | Instant expand / SSR renders all layers open |
| KheeluGuide | Same IO narration; now bottom-RIGHT, `h-[132px]` below 1320px (`h-[150px] xl:h-[176px]` above), bubble `max-w-[220px]`, tail flipped | Unchanged contract |
| Everything else | Existing Room reveals, orbit, gallery — untouched | Existing gates |

### 5.1 Guide line length law (new)
Every `data-say` line ships at ≤ 48 characters so the narrower right-side bubble
never wraps past two lines. Existing longer lines are shortened in place and the
edits join the sign-off queue.

## §6 Gates and founder actions (adds to FOUNDER-TODO)

- **V4-a (founder)**: edit Tally `Y5XW7J` to the D3 five fields. Site copy already
  compatible either way; iframe height re-measured after the edit.
- **V4-b (founder)**: the four audio files. Claude's sandbox cannot pull from
  Google Drive; either run the prepared download command (in FOUNDER-TODO) or drop
  the four MP3s in `~/Downloads` named `lumi-demo-{knight,shoes,breathe,apples}.mp3`.
  Until they land, the cards render transcripts with the play control hidden.
- **V4-c (founder)**: story hero art from
  `gemini-handoff/feedback-round-2026-07/AI-image-prompt.md` (5 prompts). Articles
  ship with the pose+tint fallback until then.
- **New GATED:kheelu-line entries**: F3 + F4 say lines above, plus every line
  shortened under §5.1. Same sign-off queue as v2/v3.
- All existing gates carry over unchanged: V3-a (closed by founder decision),
  V3-b Kheelona+ price/lapse, V3-c pipeline art, V3-d line sign-off, REV-a hero
  art, certifications/specs, ship date, named languages, camera.

## §7 Build order (each slice: `npm test` + `npm run build` green before commit)

- **V4-1** Shared: tokens/Button/Navbar/dock (D1), FinaleCTA white (D5) on all
  routes, orange Room fill retirement + token-check, AudioMoment(s),
  HowItWorksLoop, ArchitectureStack scaffolds with stories + tests.
- **V4-2** Home hero + guide + recognition (F1/F2 + §5 guide moves).
- **V4-3** Home rooms (F3/F4 in, Statement/Film/Learning/Brain out, Feelings slim,
  Home JSON-LD drops the VideoObject, metadata).
- **V4-4** /playos rebuild (§4.2) + /products/lumi audio swap (§4.1).
- **V4-5** Interior slim pass (§4.3) + `gemini-handoff/feedback-round-2026-07/`.
- **V4-6** CMO pass: Ahrefs pull (Chrome, founder's account), keyword map v3 in
  `docs/revamp-2026-07/keywords-v3.md`, metadata/H1 adjustments from data.
- **V4-7** Five new stories in `stories-expansion.ts` + kit prompts for their
  heroes.
- **V4-8** Full QA (§7 of BUILD-V3 checklist verbatim: voice-lint greps, mobile
  overflow probes 320/360/390/430, Lighthouse + axe, JSON-LD, crawl, no-JS) +
  docs (WORKING.md, project-state.json, website-steps §8.22 for D1/D5/D6 +
  §5.1's line-length law, copy-reference V4 entry, FOUNDER-TODO) + push
  `demo-website` + preview verification in Chrome.
