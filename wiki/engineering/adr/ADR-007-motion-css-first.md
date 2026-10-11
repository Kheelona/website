---
title: "ADR-007: Motion is CSS presets on DS motion tokens plus one small observer; no JavaScript animation library (with the D049 addendum)"
type: adr
updated: 2026-10-12
sources:
  - ../../raw/brief/kickoff-brief.md (§9.11)
  - ../../../mockup/APPROVAL.md (§6 motion spec, approved as G4 in D041)
  - ../../decisions/D041-gate-a-round-1.md (G4 approved; G-09 sticky bar behaviour)
  - ../../decisions/D049-motion-picks.md (the founder's eight picks, 2026-10-12)
  - ../../decisions/D050-whatsapp-chat-button.md (the bubble's lift and label)
  - ../../design-system/motion.md (line 123: an <img> cannot be stroke-animated; the grain filter's paint cost), ../../design-system/gaps.md (G-09, G-10)
  - mockup/mockup.css, mockup/mockup.js, mockup/_work/motion/motion.css (local reference of every D049 option)
  - design-system/project/tokens.css:100-105 (durations and easings), :71 (--space-1 4px); components/bundle.css (.kh-btn--cta:active, .kh-faq__item[open] .kh-faq__sign)
  - "design-system/project/assets/Doodles/*.svg read 2026-10-12: stroked paths, some filled dots, one identical feTurbulence filter in each"
  - "grep of every chilli button in mockup/pages and partials, 2026-10-12 (arrows on the Home and product heroes and on five closes)"
  - ../../research/posthog-audit.md (Home INP 546 ms on phones, issue 8)
  - ../../qa/architecture-review-2026-10-12.md (B1)
---

# ADR-007: CSS-first motion

**Status:** accepted by the Architect, 2026-10-12; addendum for D049 the same day (QA review B1).

## Context

The founder approved the motion spec in `mockup/APPROVAL.md` §6 (D041, G4): reveals below the fold
only (opacity plus a `space-4` upward move, `duration-enter`, `ease-standard`, once per section);
stickers below the fold settle with `ease-bounce`; the sticky bar fades and slides up once with
`duration-base` and then only steps aside; the drawer is a native `<dialog>` whose panel slides in with
`duration-enter` over the DS scrim; nothing animates the hero, the H1, the price sentence, any orange
button or the offer card; `transform` and `opacity` only; reduced motion turns movement off; nothing
loops. The mockup implements all of it in about 60 lines of plain JavaScript and a dozen CSS rules, with
no library. The stack has `motion` 12 installed. Home's phone INP was 546 ms on the old site (audit
issue 8), so JavaScript weight matters.

## Options

1. Port the spec to `motion` (Framer Motion). Adds a client runtime to every page for effects CSS
   already does.
2. **CSS presets on DS tokens (`src/motion/motion.css`) and one `MotionController` client component
   that runs a single `IntersectionObserver`; the sticky bar, drawer, films and bubble carry their own
   few lines.**
3. CSS scroll-driven animations (`animation-timeline: view()`). They replay when scrolling back up,
   which breaks "once per section", and need a fallback anyway.

## Choice

Option 2, ported from `mockup/mockup.css` and `mockup/mockup.js`:

- Presets: `[data-reveal]` (hidden only under `html.js-motion`, revealed by `.is-in`), the sticker
  settle, the sticky bar transition, the drawer keyframes, the reduced-motion block. All timings and
  easings are DS tokens.
- `MotionController` (mounted once in the site shell): marks anything already in view as revealed
  **before** adding `js-motion` to `<html>`, observes the rest, unobserves after reveal, and re-arms on
  every `usePathname()` change (lessons §2). With reduced motion or no `IntersectionObserver`, it does
  nothing and everything is visible.
- `data-reveal` may never wrap the first section, an `h1`, a `.kh-btn--cta`, a price sentence or the
  offer card; a test walks every page's rendered HTML for that.
- View Transitions are not used: the site has no in-page state changes that benefit.

## Addendum: the founder's motion picks (D049, 2026-10-12)

D049 is the latest decision and wins where it differs from the Gate A spec. Picks 1A (fade and rise), 2A
(hero still), 4A (buy bar slides up) and 5A (menu slides from the side) are the spec above. Four picks
needed new choices; each is still CSS on DS tokens, so option 2 stands and `motion` still retires.

| Pick | Choice | Why |
|---|---|---|
| **3B doodles draw themselves** | A generated inline-SVG derivative of each DS doodle (`scripts/assets/build-doodles.mjs` → `src/assets/doodles.generated.tsx`, outside `design-system/`, brief §4.1) with `pathLength="1"` on stroked paths; CSS animates `stroke-dashoffset` 1 → 0 over `duration-draw`, once, when the doodle enters; filled dots fade in at the end; doodles 400 ms apart (`calc(var(--duration-base) * 2)` steps, inside D049's 300-600 ms). **Only below the first screen**: hero doodles stay plain `<img>` (pick 2A). Without JavaScript the doodle is fully drawn | An `<img>` cannot be stroke-animated (`motion.md:123`). Every DS doodle carries the same `feTurbulence` grain filter with the same id, so the generator replaces it with one shared filter rendered once per page. The filter stays on during the draw for fidelity; if the phone performance trace shows a frame over 50 ms, the fallback applies the filter only once the draw ends |
| **6B press and arrow nudge** | Hover on pointer devices (`(hover: hover) and (pointer: fine)`): the arrow icon of a chilli button moves `translateX(var(--ks-nudge))` over `duration-fast`; press is the DS's own `:active`. `--ks-nudge: 5px` is defined once in `motion.css`, the value D049 names | 5 px is not a DS token (`--space-1` is 4 px). Using the founder's value is recommended over a 1 px deviation; the main session decides and may log it as a G-10 addendum; the off-token guard allows exactly this literal. Only six chilli buttons have an arrow, two of them in heroes (Home, product). Reading: hover and press are feedback the visitor starts, not arrival motion, so "the hero never moves" (2A) is not breached, just as the DS press already moves a hero button on tap. Put to the main session |
| **7B FAQ smooth open** | CSS only: inside `@supports selector(::details-content)`, the native `<details>` content is a grid whose row goes `0fr` → `1fr` over `duration-enter`, with a discrete `content-visibility` transition so it also closes smoothly; the answer sits in a `ks-faq__clip` wrapper (`overflow: hidden; min-height: 0`) so the DS padding does not leak; the sign gets a transform transition (the DS rotates it 45° when open, with no transition). Browsers without `::details-content` (older iOS Safari) open instantly, which is pick 7A | No script, so no INP cost and no change to the native keyboard and find-in-page behaviour |
| **8B focus grows** | One `IntersectionObserver` per films strip, rooted on the track and narrowed to its central band; the tile most inside the band gets `is-focus` and scales to `--ks-film-focus: 1.05` (one value inside D049's 1.04-1.1) over `duration-base`; the track gains `padding-block: var(--space-3)` with an equal negative margin so the scaled tile is not clipped and nothing below moves; end detection tolerates half a tile | Scroll-snap events (`scrollsnapchange`) are newer and not in every target browser; an observer works everywhere and costs no scroll listener. The scale is transform only; the no-sideways check runs with the strip at both ends |

**Two founder-approved exceptions** to brief §9.11's "transform and opacity only", and no others:
`stroke-dashoffset` (pick 3B, only in `.ks-doodle` rules) and `grid-template-rows` with a discrete
`content-visibility` transition (pick 7B, only in `.kh-faq__item::details-content` rules). D049 calls the
FAQ one "the one allowed non-transform animation"; the doodle draw is the second, implied by the pick
itself ("stroke-dashoffset 1→0"). `test/guards/motion-properties.test.ts` encodes exactly these two.

**The WhatsApp bubble (D050)** lifts with the buy bar and shows a laptop label, both transform and opacity
with D049 timings, nothing with reduced motion.

**Reduced motion:** nothing moves; reveals and doodles are shown in their final state; the FAQ opens
instantly; the films do not scale; the buy bar fades without moving; the drawer appears without sliding;
the arrow does not nudge (the DS press remains, as the tap state).

**Owners and tests:** one row per pick in [architecture §11.2](../architecture.md#112-what-moves-d041-g4-and-d049)
and [tasks, D049 and D050 owners](../tasks.md#d049-and-d050-owners-b1); the class contract between
`motion.css` and the components in [architecture §11.3](../architecture.md#113-class-contract-between-motioncss-and-components).
The main session updates [design-system/motion](../../design-system/motion.md) with the picks.

## Consequences

- The motion code is a few hundred bytes of JavaScript plus CSS; the inline doodles add HTML bytes only
  below the first screen and count toward the HTML budget ([architecture §12](../architecture.md#12-performance-budget-phones-first)).
- `motion` is retired in the clean-up task ([ADR-001](ADR-001-keep-the-stack.md)): every D049 pick is CSS.
- If a future section needs physics or gesture motion, that is a new library decision under brief §9.11
  (exactly one library).
