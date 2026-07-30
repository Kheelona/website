# BUILD-V5 — the end-to-end design/UX review round (2026-07-31)

> **STATUS: IN BUILD on `demo-website`.** Brief: the founder asked for a full review of the live
> site "from all angles from a customer's perspective", wearing three hats (CMO, chief design
> officer, chief content writer), with the team's own observations as seeds. Where this spec
> conflicts with BUILD-V4, THIS SPEC WINS; V4's §0 laws still bind except where a finding below
> supersedes one. Founder merges to `main` after review, as before.

**Method, so the findings are auditable rather than opinions.** The Chrome extension's window is
locked at ~390px and its tab runs hidden, which freezes reveals and defers painting — useless for
judging layout. So the review ran through a purpose-built headless harness
(`scratchpad/shot.mjs`, `audit.mjs`, `form-measure.mjs`): exact viewports, reveals forced, lazy
images warmed, every `<section>` clipped for inspection, plus a numeric audit of all 9 routes at
1440×900 and 390×844.

---

## §1 The audit table (both viewports, reveals forced)

| Route | words | height @390 | sections | cards | cards w/ hover | longest ¶ | ¶ >45w |
|---|---|---|---|---|---|---|---|
| `/` | 1310 | **19.0k** | 14 | 40 | **3** | 50 | 1 |
| `/products/lumi` | 1272 | **17.0k** | 14 | 27 | **0** | 47 | 1 |
| `/playos` | 551 | 7.3k | 6 | 16 | 6 | 59 | 1 |
| `/safety` | 930 | 10.9k | 10 | 15 | **0** | **85** | **5** |
| `/setup` | 203 | 4.0k | 3 | 2 | 0 | 24 | 0 |
| `/team` | 647 | 7.8k | 6 | 10 | **0** | 75 | 5 |
| `/stories` | 698 | 10.9k | 8 | — | **19** | 29 | 0 |
| story article | 521 | 5.2k | 3 | 2 | 0 | 65 | 6 |
| `/contact` | 274 | 4.2k | 4 | 5 | 0 | 42 | 0 |

Zero horizontal overflow anywhere at 390 or 1440 — mobile hygiene from the M4-b pass is holding.

## §2 Findings and fixes

### F1 — The interaction system is not a system (the team's headline complaint, CONFIRMED and worse on mobile)
**Evidence.** The entire codebase contains **two** `active:` press states (`Button`, the audio play
control). `TiltCard` — the only card interaction — renders a plain `<div>` unless
`(hover: hover) and (pointer: fine)`, so **on touch, the founder's primary customer, 40 Home cards
/ 27 Lumi cards / 19 story cards / 5 feeling cards / 3 mode cards / the colorway swatches / every
accordion row give no feedback at all.** Hover coverage across routes reads 19 · 6 · 3 · 0 · 0 · 0 —
`/stories` and `/playos` feel alive, everything else is inert.

**Fix (V5-1).** One shared contract in `src/lib/interactions.ts`, used everywhere instead of
per-surface improvisation:
- `PRESS` — `active:scale-[0.97]` on the bouncy ease, reduced-motion neutralised. Every tappable
  surface gets it, so **touch always answers**.
- `LIFT` — `md:hover:-translate-y-1` + `shadow-room-sm` on the calm ease, fine-pointer only.
- `PRESS_LIFT` — both, the default for clickable cards.
Applied to: story cards, feelings cards, `LumiModes` cards, colorway swatches, `Faq` triggers,
`ArchitectureStack` rows, `AudioMoments` cards, and `Card` via a new `interactive` prop.
Tilt stays for non-interactive surfaces only (R10 hard rule unchanged), and no surface gets both
tilt and lift.

### F2 — The reserve form has measured dead space, and it is the flattest section on the site
**Evidence.** `TallyEmbed`'s iframe is `h-[900px]`, measured against the OLD six-field form. The
five-field form's content ends at **721px on desktop and 609px on mobile** →
**179px / 291px of visible dead space**, with Tally's "Made with Tally" badge floating alone in it.
Separately: V4 turned the finale white, which was right for theme unity but left the single most
important section on the site looking like an unbranded third-party embed on a blank page.

**Fix (V5-2).** Measured responsive heights (`h-[720px] sm:h-[800px]`) keeping ~110/79px of
headroom for validation messages, with the guard test and its re-measure instructions updated.
Then give the moment back its weight without resurrecting the retired orange band: the form sits in
a white card on a cream room, over a **reassurance strip** — *No payment today · First 500 at
₹4,999 · Ships 1 September* — built from the brand shape marks (see F4). Scannable proof exactly
where the decision happens, and it fills the section with substance instead of padding.

### F3 — `/safety` is not merely wordy, it repeats itself (CONFIRMED)
**Evidence.** 930 words, 12 `<h2>`s, one **85-word** paragraph, five paragraphs over 45 words. The
"Where does my child's voice go?" section states one promise **four times**: an 85-word answer, then
four numbered step cards, then four label cards (*Region-pinned · Parent-consented · Deletable in
one tap · Never sold*) whose facts the answer already carried, then a display line repeating it
again. The four-column grid gives each card ~215px, so titles wrap mid-phrase ("Deletable / in one
tap", "Lumi hears the / wake word").

**Fix (V5-3).** Delete the duplicate label row. Trim every >45-word paragraph to ≤40. Four-column
grids become three-column so titles stop breaking mid-phrase. The page keeps every FACT and every
answer block (AEO depends on them) — it loses only the restatements.

### F4 — The brand shapes are orphaned (the team's read is right)
**Evidence.** The four blob marks render in exactly one place, `TrustRoom`, at 24px in pale tints.
They are a real design-system asset (the shape language) used once and nowhere else.

**Fix (V5-4).** Give them ONE job instead of scattering them: **the marker for a promise/value
card.** Applied on `TrustRoom` (already), `/safety`'s promise cards, `/playos`'s moat cards, and the
new reassurance strip — at a consistent 28px with a documented tint mapping. Rejected on purpose:
shapes as background texture on other rooms (the calm law and the founder's "keep it clean" both
argue against decoration without a job).

### F5 — Kheelu appears twice in the hero viewport (NEW, craft)
**Evidence.** REV-a's final artwork *contains* Kheelu whispering to Lumi, and the persistent corner
guide renders Kheelu at the same moment — two identical characters in the first impression. This was
a known M2 flag ("two Kheelus until REV-a lands"); the final art did not remove it, it locked it in.

**Fix (V5-5).** The desktop guide holds back until the hero has scrolled past (an
IntersectionObserver on the hero, fading him in after). The mobile dock is unaffected — there is no
duplication there, because the hero art is above it, not beside it.

### F6 — Hero typography breaks badly on the site's most important text (NEW, craft)
**Evidence.** At 1440px the H1 sets as four lines with a weak break: *"Your kid's / favourite
tutor. / Their best / friend first."* The measure is narrower than the column allows.

**Fix (V5-5).** Widen the H1 measure so each sentence takes one line. Also lift the cap-line chip
off the backdrop — `bg-yellow/15` on a warm backdrop is close to invisible, which is what the team
meant by "not clearly visible", and V4's chip promotion only half-solved it.

### F7 — The two conversion pages are 60% the same page (the "too much content, less value" root)
**Evidence.** Six components render on BOTH Home and `/products/lumi`: `AudioMoments`, `Faq`,
`FeelingsGallery`, `FootnotesRow`, `LumiModes`, `ParentQuotes`. A visitor who reads Home and clicks
"Meet Lumi" meets the same audio demos, the same five feelings, the same three modes, the same
quotes and a near-identical FAQ. Home is 19,000px on a phone (22 screens); Lumi is 17,000px.

**Fix (V5-6).** Conservative, because the founder values the content: `/products/lumi` drops the
`FeelingsGallery` duplicate — Home owns that emotional beat, and the product page still has modes,
the pace panel, the audio pair, the chat demo, colorways, and its own FAQ. Everything else stays.
Recorded as the standing recommendation: if the founder wants a further cut, the next candidates are
the duplicate `ParentQuotes` and collapsing Lumi's FAQ into a link to Home's.

### F8 — Loop-room step labels misalign (NEW, minor)
"STEP 3 · REAL-WORLD LEARNING" wraps to two lines while steps 1–2 fit one, so the three body
paragraphs start at different heights. Fixed with a reserved two-line label slot.

## §3 What this round deliberately does NOT do
- **No new AI-generated assets are needed.** Every fix uses existing design-system shapes and
  published copy. The one real remaining asset gap is R9-a (real photography), which stays a
  founder item — inventing more AI art would not serve it.
- No copy claims change. Ship date, languages, prices, Kheelona+ wording and the age bands all
  render from `config/site` exactly as V4 left them.
- No return of the orange finale band, no new page chrome (section nav, progress bars), no
  autoplaying anything — the calm law and "keep the website clean" both hold.
- Testimonials stay as the founder decided (V3-a).

## §4 Laws this round produces (consolidated into `docs/website-steps.md` §8.23)
1. **Every tappable surface answers touch.** A new interactive surface uses `PRESS`/`PRESS_LIFT`
   from `lib/interactions.ts`; hand-rolled hover/active classes are a review flag. Hover-only
   affordances are incomplete by definition, because the primary customer is on a phone.
2. **An embedded third-party form's height is measured, never guessed, and re-measured whenever its
   fields change** — with the measurement recorded next to the number.
3. **A brand mark needs a job.** The shape marks mean "this is a promise"; using them as decoration
   is a review flag.
4. **One idea, one statement, per page.** If a fact appears in an answer block, do not restate it as
   a card row and then again as a display line.
5. **Two characters that are the same character never share a viewport.**
