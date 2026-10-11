---
title: Design system tokens and the Tailwind bridge
type: design-system
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - design-system/project/tokens.json
  - design-system/project/tokens.css
  - design-system/project/tools/tokens/build_tokens_css.py
  - design-system/project/components/bundle.css
  - design-system/project/components/index.d.ts
  - design-system/project/README.md
  - design-system/project/00-how-to-use.md
  - package.json and package-lock.json (at the tag)
  - src/styles/globals.css (lines 1-169, at the tag)
  - "node_modules/tailwindcss/package.json (4.3.2) and node_modules/tailwindcss/theme.css: the installed copy, not in git, read 2026-10-10"
  - wiki/raw/brief/kickoff-brief.md (sections 4.1, 9.9, 9.12)
---

# Design system tokens and the Tailwind bridge

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

DS citations (`design-system/…`; short forms such as `tokens.css:71` or `README.md:130` are files under
`design-system/project/`) refer to DS v11 as delivered and checksummed in the [manifest](manifest.md);
the DS is in no git tag ([D004](../decisions/D004-internal-material-uncommitted.md)). `theme.css` means
the installed `node_modules/tailwindcss/theme.css`, which is not in git.

The token families, how they are named, how to consume them, and a sketch of how they could feed a
Tailwind v4 theme. **Values are not repeated here**: the source is
[`design-system/project/tokens.css`](../../design-system/project/tokens.css), generated from
[`tokens.json`](../../design-system/project/tokens.json). Each family below gives its `tokens.css` lines.

## Source and build

- `tokens.json` is the master; `tokens.css` is rebuilt from it with
  `python3 tools/tokens/build_tokens_css.py` (`00-how-to-use.md:137`). Both are read-only for us.
- `tokens.json` carries `"version": 6` while the DS is v11 (`design-system/README.md:1`). The DS does not
  explain the field; it reads like the token file's own revision counter. Recorded, not a problem.
- Rule: "Use tokens only. Never paste hex values." (`README.md:15`); "use tokens only, never pasted hex
  values or one-off sizes: colour, spacing, radius, stroke, size, motion and layer tokens, and the type
  styles" (`00-how-to-use.md:136`).

## Families

| Family | Names | Count | Defined in `tokens.css` | Consumed as |
|---|---|---|---|---|
| Colour primitives | `white`; `fur-100`, `-200`, `-300`, `-600`; `ink-600`, `ink-900`; `chilli-500`; `blue-500`; `sun-500`; `green-700`, `green-300`; `red-700`, `red-300`; `night-100`, `-200`, `-300`, `-500` | 18 | lines 3-20 | `var(--fur-100)` etc. Components should use roles, not primitives |
| Colour roles (switch with theme) | Ground `surface`, `surface-raised`, `surface-band`; text `text`, `text-muted`; lines `border`, `border-strong`; buy `cta`, `on-cta`; act and select `primary`, `on-primary`; coloured text `deep-blue`, `deep-chilli`, `deep-sun`; `link`, `focus`; `chalk`, `scrim`; status `success`, `warning`, `danger` | 21 | Day 21-41; Bedtime 46-66 | `var(--surface)` etc. Role table: `README.md:59-71` |
| Shadow (switch with theme) | `shadow-press`, `shadow-lift`, `shadow-sticker` | 3 | 42-44; Bedtime 67-68 | `box-shadow: var(--shadow-lift)` |
| Spacing | `space-1` … `space-10` (scale and section padding rules: `README.md:130`) | 10 | 71-80 | `var(--space-5)` |
| Radius | `radius-xs`, `-s`, `-m`, `-l`, `-xl`, `-pill` | 6 | 81-86 | `var(--radius-l)` |
| Size | `tap-min`, `tap-kid`; `icon-s`, `-m`, `-l`, `-xl`; `measure`; `content-max` | 8 | 87-94 | `min-height: var(--tap-min)` |
| Stroke | `stroke-hair`, `-control`, `-focus`, `-chalk`, `-sticker` | 5 | 95-99 | `var(--stroke-focus)` |
| Motion | `duration-fast`, `-base`, `-enter`, `-draw`; `ease-standard`, `ease-bounce` | 6 | 100-105 | See [motion](motion.md) |
| Layers | `z-sticky`, `z-popover`, `z-tooltip`, `z-overlay`, `z-toast` | 5 | 106-110 | `z-index: var(--z-sticky)` |
| Font families | `font-display` (Baloo 2 and sister families), `font-body` (Nunito), `font-hand` (Kalam) | 3 | 111-113 | `font-family: var(--font-body)` |
| Type styles | `kh-display-xl`, `-l`, `-m`; `kh-headline`; `kh-title`, `kh-subtitle`; `kh-price`; `kh-hand-l`, `-m`; `kh-note`; `kh-lead`; `kh-body-l`, `kh-body`, `kh-body-s`; `kh-label-l`, `kh-label`, `kh-label-s`; `kh-eyebrow`; `kh-caption` | 19 | 115-133 (**classes with literal sizes, not variables**) | `class="kh-title"` |
| Fonts | 4 `@font-face` rules, relative URLs `fonts/…`, `font-display: swap` | 4 | 134-137 | Served next to `tokens.css` |

**Tone classes** (in `bundle.css`, not `tokens.css`): `kh-tone-chilli`, `kh-tone-blue`, `kh-tone-sun`
set `--tone`, `--on-tone`, `--tone-strong`, `--tone-tint`, `--tone-deep` for a block and the text on it
(`index.d.ts:3-5`). The v1 names `pink`, `peach`, `sky`, `mint`, `lilac` are kept as aliases
(`bundle.css:37-38`); do not use them.

### Naming

- **Primitives** are family plus step (`fur-200`, `ink-900`) or family plus `500` for the single brand
  value (`chilli-500`). There are no tints, light steps or deep steps since v7 (`README.md:38`).
- **Roles** are semantic and are what components read; the Bedtime theme changes roles, never
  primitives. `deep-*` roles are **ink in Day** (brand colours are too light as text on cream) and the
  brand colour in Bedtime (`tokens.json` usage notes).
- Scales are numbered (`space-1…10`) or t-shirt sized (`radius-xs…xl`, `icon-s…xl`).

### What is not a token

| Thing | Where it lives instead |
|---|---|
| Breakpoints | Four `min-width` media queries in `bundle.css` and prose; the widths are listed as evidence in [G-03](gaps.md#g-03) |
| Grid columns | Prose (`README.md:131`); the built classes are `kh-split` and `kh-cols` |
| Type sizes | Literal values inside the `kh-` type classes (`tokens.css:115-133`) |
| Component dimensions | Literal px in `bundle.css`: for example the nav height, chip height, switch thumb and the `kh-device` frame (`bundle.css:1169`, which matters for [G-04](gaps.md#g-04)) |
| Hover darkening and disabled opacity | Literals at `bundle.css:114` and `:129` |
| Spinner speed | A literal at `bundle.css:669` ([G-10](gaps.md#g-10)) |
| The logo's colours | Baked into the Logo SVGs; the logo is exempt from contrast rules (`README.md:82`) |

## How to consume them

1. Load `tokens.css`, then `bundle.css` (`00-how-to-use.md:91`). Every value is a CSS custom property on
   `:root`.
2. Set `data-theme="light"` on the page wrapper (`kh-page`) for every marketing page
   (`10-pages.md:22`). Bedtime is `data-theme="dark"`, app only.
3. Use **roles** in components (`var(--surface)`, `var(--text)`, `var(--cta)`), primitives only where the
   DS does (stickers, blocks via `kh-tone-*`).
4. Use the `kh-` type classes for text styles; there are no type variables to compose.
5. Fonts: `tokens.css` points at `fonts/*.woff2` relative to itself, so serve the font files at that
   relative path or generate a derivative CSS with rewritten URLs (brief §4.1 allows look-identical
   derivatives outside `design-system/`).
6. `bundle.css` also sets global rules (`*` box-sizing, `body`, `img`, `:focus-visible`,
   `bundle.css:6-21`), so its order against Tailwind's preflight must be decided explicitly.

## The current stack

- Next 16.3.4, React 19.2.4, Tailwind CSS v4 via `@tailwindcss/postcss` (`package.json:33`, `:36`,
  `:46`, `:59`); the locked and installed Tailwind is 4.3.2 (`package-lock.json:11251`).
- `src/styles/globals.css` starts with `@import "tailwindcss" source(none)` (line 1) and an `@theme`
  block (lines 15-169) that maps the **retired v3 design system** (orange-ink, blue-ink, cream, cool and
  sun washes; Glory, Instrument Sans and Instrument Serif fonts; `--ease-calm`). Nothing in it is a v11
  token, and it does not reset Tailwind's default palette. It will be replaced; the old system's removal
  belongs to [cleanup](../legacy/cleanup.md).
- No Tailwind preset or config ships with the DS. Brief §9.12: "If the DS ships its own CSS or Tailwind
  preset, build on it instead of duplicating it." The DS ships CSS (`tokens.css`, `bundle.css`), so the
  bridge should **reference** it.

## Sketch: a Tailwind v4 theme generated from the DS

A sketch for the Architect (Phase 4), not a decision. Principle: Tailwind utilities point at DS
variables, so no value is typed twice, and every Tailwind default that the DS does not define is
switched off (brief §9.12; §9.9 bans arbitrary values).

```css
/* src/styles/ds-bridge.css (illustrative) */
@import "tailwindcss";
/* tokens.css and bundle.css (or derivatives) are loaded here, in a layer order chosen by the Architect */

@theme inline {
  /* 1. Switch off Tailwind's own look */
  --color-*: initial;
  --font-*: initial;
  --text-*: initial;          /* type comes from the kh- classes */
  --spacing: initial;         /* stop Tailwind's multiples-of-a-base spacing */
  --breakpoint-*: initial;    /* see G-03 */
  --container-*: initial;
  --animate-*: initial;
  /* plus --radius-*, --shadow-*, --ease-*, --drop-shadow-*, --blur-*, --perspective-* … */

  /* 2. Colours: role names point at DS roles (theme-safe because `inline` emits var(--surface) directly) */
  --color-surface: var(--surface);
  --color-surface-band: var(--surface-band);
  --color-text: var(--text);
  --color-cta: var(--cta);
  /* … every role and the 18 primitives the DS lets components use */

  /* 3. Spacing: DS numbering, so p-5 means space-5, not Tailwind's own step 5 */
  --spacing-1: var(--space-1);
  /* … to --spacing-10 */

  /* 4. Containers and transitions */
  --container-content: var(--content-max);
  --default-transition-duration: var(--duration-fast);
  --default-transition-timing-function: var(--ease-standard);
}
```

**Points the sketch exposes** (each verified against Tailwind 4.3.2's `theme.css`, not built or tested):

1. **Name collisions.** The DS already uses Tailwind's namespaces for four families: `--radius-*`,
   `--shadow-*`, `--ease-*` and `--font-*` (`--font-display`, `--font-body`, `--font-hand`). Writing
   `--radius-l: var(--radius-l)` in `@theme` is self-referential. Two ways out: (a) generate those theme
   entries from `tokens.json` at build time with the same names and values (a derivative, never
   hand-typed, with a test that it equals `tokens.css`); or (b) leave them out of Tailwind and use the
   CSS-variable shorthand, e.g. `rounded-(--radius-l)`. Architect's call.
2. **Tailwind's default transition is not the DS's.** Tailwind sets its own default duration and easing
   (`theme.css:492-493`); left alone, every `transition` utility would bring Tailwind's motion. Point
   both at DS tokens.
3. **Durations and z-index have no theme namespace in v4**, so `duration-150` and `z-50` accept any
   number. Lint must ban numeric forms and allow only `duration-(--duration-fast)` and
   `z-(--z-sticky)`. Whether the `(--var)` shorthand counts as an "arbitrary value" under brief §9.9
   needs a written rule.
4. **Type has no variables**, so the `kh-` classes stay the way to set text, and `--text-*` is switched
   off.
5. **Breakpoints** cannot be taken from tokens because there are none. The widths `bundle.css` uses,
   listed in [G-03](gaps.md#g-03), are the only DS evidence.
6. **The `kh-` component classes** stay the visual source; Tailwind is for layout glue between them.
   Any utility that restates a component's look duplicates the DS.
7. **Lint list** for §9.9: no `[…]` arbitrary values, no hex, no raw px in classes, no Tailwind default
   colour names (they no longer exist once reset).

## Related

[Overview](overview.md) · [Component map](component-map.md) · [Motion](motion.md) · [Gaps](gaps.md)
