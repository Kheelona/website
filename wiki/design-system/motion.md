---
title: Design system motion
type: design-system
updated: 2026-10-12
cites_at: archive/pre-reset-2026-10-10
sources:
  - design-system/project/README.md (lines 155-161)
  - design-system/project/tokens.json (motion family, lines 649-683)
  - design-system/project/tokens.css (lines 100-105)
  - design-system/project/components/bundle.css
  - design-system/project/components/bundle.js
  - design-system/project/02-imagery.md
  - design-system/project/06-surfaces.md
  - design-system/project/08-accessibility.md
  - design-system/project/components/NavDrawer/README.md, Dialog/README.md, StickyBuyBar/README.md, Toast/README.md, ProgressBar/README.md
  - design-system/project/assets/Doodles/*.svg
  - package.json (line 32, at the tag)
  - wiki/raw/brief/kickoff-brief.md (section 9.11)
  - "grep of every motion token name in bundle.css and bundle.js, re-run 2026-10-10"
---

# Design system motion

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

DS citations (`design-system/…`; short forms such as `README.md:157` or `bundle.css:108` are files under
`design-system/project/`) refer to DS v11 as delivered and checksummed in the [manifest](manifest.md);
the DS is in no git tag ([D004](../decisions/D004-internal-material-uncommitted.md)). **Token values are
not copied here:** the source is `tokens.css:100-105` (values) and `tokens.json:649-683` (usage notes).
A value appears only where a gap needs it as evidence, and says so.

What the DS says about motion, what it actually implements, and whether that is enough for brief §9.11.

## Verdict

**The DS defines motion for small interactions only. It is not enough for brief §9.11, so a short
motion spec must be proposed at Gate A ([open questions](../open-questions.md) G4) and is logged as DS
gap [G-10](gaps.md#g-10).**

- Defined and built: button press and hover, state changes (switch, caret, FAQ sign, radio, progress),
  tooltip fade, the spinner, and a reduced-motion rule.
- Defined but **not built anywhere**: entrances (`duration-enter` with `ease-bounce`) and the chalk
  draw-on (`duration-draw`). No component uses any of the three tokens (0 hits in `bundle.css` and
  `bundle.js`).
- **Not defined at all**: section reveals, the sticky buy bar appearing and hiding, drawer, sheet,
  dialog and toast transitions, gallery or carousel motion, page or view transitions, movement
  distances (the button press is the only one), staggering, what never animates, and pausing
  anything that moves for over five seconds.

§9.11 asks for gentle section reveals, tap feedback, smooth menu and drawer transitions, a smooth
gallery and subtle movement in illustrations. Only tap feedback is covered.

## The DS's motion rules

Summarised from `README.md:155-161` ("quick and gentle, like a toy that wobbles back into place"):

| Situation | Tokens | Rule |
|---|---|---|
| Presses, hovers, tooltips | `duration-fast`, `ease-standard` | A pressed button drops onto its ink base edge |
| State changes: switches, carets, accordion signs, progress bars | `duration-base` | |
| Entrances: things arriving (sheets, toasts, stickers) | `duration-enter` with `ease-bounce` | A small overshoot that settles |
| Chalk doodles | `duration-draw` | Stroke-reveal "draw on", once per view, never on a loop (also `06-surfaces.md:68` for video) |
| `prefers-reduced-motion` | | Drop movement, keep opacity fades only; spinners slow down instead of stopping (`README.md:161`; `08-accessibility.md:43`; `tokens.json:650`) |

"Use tokens only … motion (`duration-*`, `ease-*`)" (`00-how-to-use.md:136`).

## Motion tokens

Six tokens; values at `tokens.css:100-105`. There are no distance, delay, stagger or opacity tokens.

| Token | `tokens.css` | Used by any component? (grep, 2026-10-10) |
|---|---|---|
| `duration-fast` | line 100 | Yes, 12 uses in `bundle.css` |
| `duration-base` | line 101 | Yes, 7 uses |
| `duration-enter` | line 102 | **No (0 uses)** |
| `duration-draw` | line 103 | **No (0 uses)** |
| `ease-standard` | line 104 | Yes, 18 uses |
| `ease-bounce` | line 105 | **No (0 uses)** |

`bundle.js` uses none of the six.

## What `bundle.css` actually animates

| Element | Property | Timing | Line |
|---|---|---|---|
| `Button` (all variants) | `transform`, `box-shadow`, `background-color`, `filter` | `duration-fast`, `ease-standard` | `bundle.css:108` |
| Button press (`cta`, `primary`, `secondary`) | `translateY`, shadow removed. The press distance is the DS's only movement distance (quoted as evidence for G-10: 4 px) | as above | `:117` |
| Button hover (`cta`, `primary`) | `filter: brightness()` | as above | `:114` |
| FAQ plus sign | `rotate` when open | `duration-base` | `:280-282` |
| Switch track and thumb | `background-color`, `border-color`, thumb `translateX` | `duration-base` | `:583-587` |
| Menu caret | `rotate` | `duration-base` | `:713-714` |
| Radio dot | `scale` | `duration-fast` | `:803-805` |
| Checkbox, icon button, tag, tab-bar pill | colour changes | `duration-fast` | `:698`, `:792`, `:1070` |
| Tooltip bubble | `opacity`, `visibility` | `duration-fast` | `:938` |
| Progress bar | **`width`** | `duration-base` | `:680` |
| Spinner | `rotate` loop | **a literal, not a token** (quoted as evidence for G-10: 0.9s linear) | `:669` |

**Not animated:** `NavDrawer` (its README says it "slides in from the right", but `.kh-drawer__panel`
has no transition, `bundle.css:983-996`), `Dialog` and `BottomSheet` (the sheet "slides from the
bottom" per its README; no transition, `:953-978`), `Toast` (no entrance), `StickyBuyBar` (no show or
hide, `:414-430`), the FAQ answer panel (native `<details>` opens instantly), stickers and section
content. `bundle.js` has no motion code: no `IntersectionObserver`, no `matchMedia`, no
reduced-motion check.

### Reduced motion as built

`bundle.css:1176-1180` sets `transition: none` on buttons, the FAQ sign, switches, icon buttons, the
menu caret, checkboxes, radios, the progress bar, the tooltip and the tab-bar pill, and slows the
spinner. This removes the tooltip's opacity fade too, while the README says reduced motion should
"keep opacity fades only". A minor inconsistency, logged under [G-10](gaps.md#g-10).

## Where the DS meets the brief's motion rules

| Brief §9.11 rule | DS position | Conflict? |
|---|---|---|
| Animate only `transform` and `opacity` | Button hover animates `filter`; progress bar animates `width` (a layout property); a stroke-reveal draw-on would animate `stroke-dashoffset` | **Yes** for the progress bar and the draw-on. Hover `filter` is paint-only and causes no layout shift |
| Never hide the hero or the primary CTA behind an entrance | Not addressed | Spec must say it |
| No scroll-jacking | Not addressed | Spec must say it |
| Honour reduced motion with fades or nothing | Yes (`README.md:161`) | Built version removes fades entirely; acceptable under "or none" |
| Anything moving over 5 s can be paused; nothing flashes | Doodles: "once per view, never on a loop". The spinner loops (allowed as a loading indicator) | Spec must state the pause rule |
| CSS first; at most one JS library | The DS ships CSS transitions only | No conflict |
| All motion from shared presets | Tokens exist for 4 durations and 2 easings | No conflict; the presets must use them |
| Animated assets only if the DS provides them | No animated assets; doodles are static SVGs with stroke paths and a `feTurbulence` grain filter (e.g. `assets/Doodles/chalk-rocket.svg`) | A draw-on needs the SVG inlined, since an `<img>` cannot be stroke-animated; animating under a turbulence filter costs paint time on mid-range Android |

## What the Gate A motion spec has to decide

Open as [open questions](../open-questions.md) G4. These are the decisions, not proposals. The spec
should reuse the existing duration and easing tokens wherever they fit, and the founder approves it at
Gate A (brief §9.11).

1. **Section reveals:** whether to have them at all; property (opacity, plus a small `translateY`?);
   distance; duration and easing (the DS has `duration-enter` and `ease-bounce` for "things arriving");
   trigger (scroll-driven CSS or `IntersectionObserver`); the rule that the hero, its CTA and anything
   above the fold never wait for a reveal.
2. **StickyBuyBar:** how it enters and leaves (the DS gives the trigger, not the motion: after the hero
   cta leaves, hidden while the OfferCard is visible; [G-09](gaps.md#g-09)).
3. **NavDrawer, BottomSheet, Dialog, Toast:** entrance and exit (the DS describes "slides in" and
   "slides from the bottom" but does not build them); the scrim fade.
4. **FAQ answer:** whether the panel itself animates or only the sign.
5. **Gallery or carousel:** none exists in the DS ([G-11](gaps.md#g-11)); CSS scroll-snap per brief
   §9.12 needs no motion beyond native scrolling.
6. **Illustration movement:** whether chalk doodles draw on (inline SVG, stroke reveal, once per view,
   `duration-draw`), and how that squares with "transform and opacity only".
7. **Distances:** the button press is the only DS distance; reveals need one.
8. **Never animate:** the hero image (LCP), prices, the checkout, safety and pricing sections (the DS
   already keeps the Imagination layer off safety and pricing, `02-imagery.md:57`).
9. **Reduced motion:** fades only or nothing; the spinner keeps the DS's slow-down.
10. **Implementation:** CSS transitions, keyframes and scroll-driven animations with a fallback; the
    stack already depends on `motion` 12 (`package.json:32`), which the Architect may keep or drop.

## What the build does (D049, 2026-10-12)

The founder chose one option per place ([D049](../decisions/D049-motion-picks.md): 1A 2A 3B 4A 5A 6B 7B
8B); the build plan is [architecture §11](../engineering/architecture.md#11-motion) and
[ADR-007](../engineering/adr/ADR-007-motion-css-first.md). The open questions above are answered there:
reveals fade and rise once below the fold; the hero stays still; doodles draw themselves (inline SVG,
below the first screen only); the phone buy bar slides up; the menu panel slides from the side; the
orange button's arrow nudges on hover; FAQ answers open smoothly; the focused film grows a little. The
WhatsApp bubble (D050) lifts above the buy bar with it.

**Two founder-approved exceptions to "transform and opacity only"**, each guarded by
`test/guards/motion-properties.test.ts`: `stroke-dashoffset` inside `.ks-doodle` rules (pick 3B) and
`grid-template-rows` inside `.kh-faq__item::details-content` rules (pick 7B). Two named literals outside
the DS tokens: `--ks-nudge: 5px` (pick 6B, the value shown to the founder) and `--ks-film-focus: 1.05`
(pick 8B). Reduced motion: nothing moves.

## Related

[Overview](overview.md) · [Tokens](tokens.md) · [Gaps](gaps.md) · brief §9.11 in
[`raw/brief/kickoff-brief.md`](../raw/brief/kickoff-brief.md)
