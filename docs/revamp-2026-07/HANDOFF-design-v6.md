# Design-team handoff — after the V6 growth-arc content round (2026-07-31)

**Scope instruction from the founder: MICRO improvements only — spacing, link states, small
polish. No structural or layout changes.** The content of this round is founder-approved verbatim
(spec `BUILD-V6.md` §2) and QA'd independently (`QA-V6-note.md`); copy is not the design team's
surface. Anything here that grows beyond micro goes back through a founder decision.

## What V6 changed visually (so you know what you are looking at)

1. **Home hero**: new two-line H1 ("A best friend at 2. / A head start by 5.") — shorter lines
   than V5's. Art, chip, CTA, cap card unchanged.
2. **New Home room `#growth`** ("What your child gets, year by year."): cream room, 2×2 white
   stage cards (registry `Card`, static — tilt only, deliberately no press/lift), orange-ink
   kickers, a muted hedge line, a 19px display line.
3. **/products/lumi**: two paragraphs added at the end of the pace room (the arc echo); step
   numeral 01 and /setup's numeral 02 are now `blue-ink` (contrast law — `text-blue` measured
   2.68:1); PacePanel kickers and ChatDemo speaker labels are now full `ink` (were `ink-muted`,
   4.31–4.37:1 on tinted washes).
4. **FinaleCTA lede** is one sentence longer (the hold promise joined the cap line).
5. Small copy swaps with visual footprint: /team's logo row label ("Recognised by"), /playos's
   top chip ("AI mode on home WiFi"), the Home feelings lede now names Kheelu.

## The micro-improvement list (ordered by value)

1. **Server-render the FAQ answer bodies** (QA finding N3, deferred to you): only the first
   answer of each accordion is in the served HTML; the rest exist solely in JSON-LD until JS
   expands them. A no-JS reader or DOM-reading agent sees the questions and one answer.
   Component: `molecules/Faq.tsx`. This is the one item on this list that is code, not polish —
   treat the interaction contract (§8.23-1) and the FAQPage-mirrors-visible-copy law as binding.
2. **GrowthArc room rhythm**: check the 2×2 card grid at 768–1024px (single → two column
   transition) and whether the closing display line (19px, Family-scale) carries enough weight
   for a room this important. The larger display clamp is available if it reads quiet — design
   call, copy unchanged.
3. **Hero balance at mid widths**: the shorter H1 changes the left-column mass against the art
   at 1024–1280px. `text-balance` handles the wrap; judge the whitespace.
4. **Kicker treatment consistency**: PacePanel kickers and ChatDemo labels moved to full `ink`
   for contrast. If they now read heavier than the site's orange-ink kickers, `orange-ink` is
   the sanctioned alternative (passes 4.5:1 on every wash). Either passes; pick one language.
5. **Link states**: the new in-copy link (Home audio room → the bilingual article) uses the
   standard underline + focus-ring pattern; verify hover/focus parity with the loop room's
   journal link. Run the internal-link crawl on the preview while you are there.

## Laws that bind this work (pointers, not repetition)

`docs/website-steps.md` §8.23 (interaction contract; axe with reveals forced **plus a ~1.5s
settle**, §8.24-5e) and §8.24 (mode-precise connectivity, one-source facts, GrowthArc registry).
CTAs stay brand orange `#EF762F` with ink labels — no white text on the action fill. Zero italics,
all text left-aligned, tilt never wraps a whole-card link, the plush stays the hero's largest
element (mobile LCP). Visual reviews run through the headless harness, never the Chrome extension
(§8.23 method note).

## Do not touch

The growth-room copy and its data module (`lib/growth-arc.ts`), every connectivity sentence
(§8.24-1), the tutor's four homes (§8.24-2), the testimonial quotes (settled founder decision),
the Tally form and its measured iframe heights, anything gated (Kheelona+ price, certifications,
wake word, specs).

## Evidence

Before/after full-page captures (11 routes × desktop 1440/mobile 390) live in the session
scratchpad (`before/`, `after/`, key crops in `crops/`) — session-local; re-generate with the
§8.23 harness if needed. Independent QA verdict + facts table: `QA-V6-note.md`. QA record:
`docs/qa-report.md` "V6".
