# Design-team handoff — after the V6 growth-arc content round (2026-07-31)

**Scope instruction from the founder: MICRO improvements only — spacing, link states, small
polish. No structural or layout changes.** The content of this round is founder-approved verbatim
(spec `BUILD-V6.md` §2) and QA'd independently (`QA-V6-note.md`); copy is not the design team's
surface.

> **STATUS UPDATE (2026-07-31, same day):** the founder asked for this list to be implemented
> rather than handed over, and answered the three judgement calls it contained. **All five items
> are now closed** — four implemented, one measured and dismissed. What remains below is the
> record of what changed and the standing constraints, not a task list. The next design pass
> starts from a clean sheet.

## What V6 changed visually

1. **Home hero**: two-line H1 ("A best friend at 2. / A head start by 5.") — shorter lines than
   V5's. Art, chip, CTA, cap card unchanged.
2. **New Home room `#growth`** ("What your child gets, year by year."): cream room, 2×2 white
   stage cards (registry `Card`, static — tilt only, deliberately no press/lift), orange-ink
   kickers reading **AT 2 YEARS / AT 3 YEARS / AT 4 YEARS / BY 5 YEARS**, a muted hedge line, and
   a 19px display line.
3. **/products/lumi**: two paragraphs added at the end of the pace room (the arc echo).
4. **FinaleCTA lede** is one sentence longer (the hold promise joined the cap line).
5. Small copy swaps with visual footprint: /team's logo row label ("Recognised by"), /playos's top
   chip ("AI mode on home WiFi"), the Home feelings lede now names Kheelu.

## The five items, and how each was closed

| # | Item | Outcome |
|---|---|---|
| 1 | Server-render the FAQ answer bodies | **IMPLEMENTED.** Rebuilt on native `<details>`/`<summary>` (founder's pick over forcing hidden text into the Radix markup). All answers now ship in the HTML — Home went from **1 of 8** to **8 of 8** — they open with JavaScript off, and the component ships no client JS at all. The Radix accordion chunk now loads on **/playos alone**. Law: §8.24-6. |
| 2 | GrowthArc room rhythm | **MEASURED, NO CHANGE.** At 768px the cards are 300px with copy wrapping comfortably; 1024px gives 404px, 1280px gives 457px. The `md:grid-cols-2` transition is sound. Founder kept the closing display line at 19px so it matches every other display line on the site. |
| 3 | Hero balance at mid widths | **MEASURED, NO CHANGE.** At 1024px the H1 is 454px against 436px of art; at 1280px, 520px against 466px. Balanced at both. |
| 4 | Kicker treatment consistency | **IMPLEMENTED.** Founder chose one language: every small uppercase label is `orange-ink`. The pace-panel and chat-demo labels moved off dark ink accordingly. Law: §8.24-7. |
| 5 | Link states + internal crawl | **VERIFIED.** The two in-copy story links on Home carry byte-identical class strings (hover, underline offset, focus ring). The crawl that had never been run is now run: **34 unique internal hrefs across 11 pages, all 200.** |

## The laws as they stood on 2026-07-31 (SUPERSEDED IN PART — current law is CLAUDE.md + §8.26/§8.27)

> Two of these reversed in the 2026-08-23 migration: **italics are now allowed** as the v3
> editorial serif accent (founder decision #11), and **the Tally form is long retired** (our own
> paid form since 2026-08-22). Everything else below still binds.

`docs/website-steps.md` §8.23 (interaction contract; axe with reveals forced **plus a ~1.5s
settle**, §8.24-5e) and §8.24 (mode-precise connectivity, one-source facts, the GrowthArc
registry, **§8.24-6 disclosure content ships in the markup**, **§8.24-7 one kicker language**).
CTAs stay brand orange `#EF762F` with ink labels — no white text on the action fill. Zero italics
(as of then), all text left-aligned, tilt never wraps a whole-card link, the plush stays the
hero's largest element (mobile LCP). Visual reviews run through the headless harness, never the
Chrome extension (§8.23 method note).

## Do not touch (as of 2026-07-31)

The growth-room copy and its data module (`lib/growth-arc.ts` — since re-anchored at 3+ by the
migration), every connectivity sentence (§8.24-1), the tutor's four homes (§8.24-2), the
testimonial quotes (settled founder decision), the Tally form and its measured iframe heights
(retired 2026-08-22), anything gated (Kheelona+ price, certifications, wake word, specs).
`ArchitectureStack` keeps its Radix accordion on purpose — a layered diagram with roving arrow
keys is the one place the JavaScript earns itself.

## Evidence

Before/after full-page captures (11 routes × desktop 1440 / mobile 390), breakpoint captures at
768/1024/1280, and the FAQ open-state crops live in the session scratchpad (`before/`, `after/`,
`bp/`, `crops/`) — session-local; re-generate with the §8.23 harness if needed. Independent QA
verdict + facts table: `QA-V6-note.md`. QA record: `docs/qa-report.md` "V6".
