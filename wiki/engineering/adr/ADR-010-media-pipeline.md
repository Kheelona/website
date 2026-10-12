---
title: "ADR-010: Media pipeline: DS images through next/image from one source, icons and fonts generated, films unchanged and mounted on play"
type: adr
updated: 2026-10-12
sources:
  - ../../raw/brief/kickoff-brief.md (§4.1 derivatives, §9.5, §9.10, §9.12 "Assets")
  - ../../design-system/overview.md (assets by group, the -web.webp rule, fonts), ../../design-system/gaps.md (G-13, G-14)
  - ../../decisions/D040-films-move-to-new-site.md, ../../decisions/D044-app-screens-on-the-site.md, ../../decisions/D046-gate-a-approved.md
  - ../../legacy/cleanup-public-assets.md (KEEP URL files: /og.png, /brand/logo-mark.png)
  - ../lessons.md (§2 video at rest is an axe critical; animated WebP in a plain img; measure bytes)
  - "ls -la public/video/moments (films 2.0-3.9 MB, posters 80-141 KB), design-system/project/fonts (Baloo 2 154 KB, Kalam 133-135 KB, Nunito 46 KB), 2026-10-12"
  - node_modules/next/dist/docs/01-app/01-getting-started/12-images.md, 13-fonts.md; 03-api-reference/02-components/image.md (lines 265-293 preload and the priority deprecation, 1404 changelog)
  - ../../decisions/D049-motion-picks.md (pick 3), ../../design-system/motion.md (line 123)
  - "design-system/project/assets/Doodles/*.svg read 2026-10-12: stroked paths, fill none, one identical feTurbulence filter id=chalk per file; mockup/pages grep: 11 doodle files used; six placements sit in a hero (Home, product, guide, team, refund, shipping) and stay plain img"
  - ../../qa/architecture-review-2026-10-12.md (B1, N12, N17, N19)
---

# ADR-010: The media pipeline

**Status:** accepted by the Architect, 2026-10-12. Font subsetting is conditional on a licence check.

## Context

Brief §9.12: each DS asset referenced from one place; derivatives generated, never hand-copied; one
icon set. §4.1: look-identical derivatives (compressed, resized, WebP/AVIF, srcsets, subset fonts) may be
generated **outside** `design-system/`. The DS hero board's sticker PNGs are 1.0-1.5 MB each against the
DS's own 200 KB hero budget (G-14). The films (D040) are already in `public/video/moments/`, each under
4 MB with a JPG poster and an animated WebP preview. The parent-app screenshots (D044) live in
`mockup/assets/app/`; two still need their round-2 edits.

## Options

1. A custom `sharp` script that pre-renders every srcset into `public/`. Full control, more code, and a
   second copy of every image in git.
2. **`next/image` with static imports straight from `design-system/` (alias `@ds/*`), so the DS file is
   the only source and Next generates AVIF and WebP at the widths each layout asks for; small scripts
   for what `next/image` cannot do (icons, fonts, stable-URL images for Open Graph and JSON-LD).**
3. Serve the DS files as they are. Blows the phone budget.

## Choice

Option 2.

- **Raster images** (`-web.webp` photos, cast stickers and cut-outs, Kheelu PNGs, posters, app screens):
  `import img from "@ds/assets/Cast/advik-sticker.png"` and `<Image src={img} sizes=… />` through the
  `Photo`, `ArtBoard`, `ImaginationFrame`, `AppScreens` and `Avatar` (photo form; added at the wave-2 close)
  primitives only. Each call site passes a
  `sizes` value matching its layout at 360, 390 and 1440 px. **No `priority` prop:** Next 16 deprecates it
  in favour of `preload` and recommends `loading="eager"` or `fetchPriority="high"` in most cases
  (`image.md:289-293`, changelog `:1404`; QA review N12), so the one LCP image of a page takes
  `loading="eager"` and `fetchPriority="high"`; everything below the first phone screen lazy-loads.
- **SVG** shapes and the logo: static import, rendered as a plain `<img>` (`next/image` does not optimise
  SVG); decorative ones carry `alt=""`.
- **Doodles (D049 pick 3, "draw themselves"):** `scripts/assets/build-doodles.mjs` writes
  `src/assets/doodles.generated.tsx`, one inline SVG component per DS doodle the pages use (11), outside
  `design-system/` (a look-identical derivative, brief §4.1): `aria-hidden="true"`, `focusable="false"`,
  class `ks-doodle`, `pathLength="1"` on every stroked path, filled dots marked `ks-doodle__fill`, DS paths
  and colours verbatim, `<title>` and `role` removed. Every DS doodle ships the same `feTurbulence` grain
  filter under the same id (`chalk`), which would repeat on a page; the generator drops it per file,
  points each doodle at one shared `#ks-chalk` filter rendered once by `ui/Doodle/DoodleDefs`, and fails if
  a doodle's filter ever differs. `ui/Doodle` renders the plain `<img>` in heroes (pick 2: still) and the
  inline component below the first screen. A drift test regenerates and compares; generated files are
  exempt from the off-token scan because their values are the DS's own.
- **Icons:** `scripts/assets/build-icons.mjs` reads the 76 DS icon SVGs and writes
  `src/assets/icons.generated.ts` (path data keyed by name, the same extraction `mockup/build.mjs` uses);
  the `Icon` primitive renders `<svg class="kh-icon">`. A test regenerates in memory and fails on drift.
- **Fonts:** `scripts/assets/build-fonts.mjs` writes `public/fonts/` and `src/styles/generated/fonts.css`
  with the DS family names. Default: Latin plus the rupee sign as one file per face, plus a Devanagari
  file for Baloo 2 behind `unicode-range` (the language chips). **Before subsetting, the task confirms
  each family's SIL OFL text declares no Reserved Font Name** (all three are distributed by Google Fonts,
  which subsets them, so none is expected); if one does, that family ships as a byte-identical copy.
  **Preload three files**, the faces every hero uses: Nunito Latin, Baloo 2 Latin and the Kalam face of
  `kh-hand` (Latin). Almost every approved h1 carries a Kalam accent, and without `next/font` there are no
  automatic fallback metrics, so a late Kalam swap could re-wrap the h1 and move the CTA (QA review N17).
  The three stay within the 130 KB font budget; if QA's delayed-font run still shows CLS over 0.1,
  generated fallback `@font-face` metrics are the next step. `src/styles/generated/fonts.generated.ts`
  exports the three URLs for the root layout.
- **Stable URLs** for machines: `scripts/assets/build-og.mjs` (sharp) writes `public/og.png` (keeps the
  URL; replaces the old file) and `public/og/<name>.jpg` at 1200 x 630 cropped from DS photos with no text
  (images carry claims, lessons §6), `public/brand/logo-mark.png` (keeps the URL; from the DS K mark), and
  `public/media/kheelu-front.jpg` for Product JSON-LD. App icons go to `src/app/icon.png` and
  `src/app/apple-icon.png` from the DS favicon and Apple touch icon (opaque).
- **Non-DS media:** the films stay at `public/video/moments/` (same URLs as production); posters go
  through `next/image` (the first three on Home eager as in the mockup but `fetchPriority="low"`, so they
  never compete with the LCP image, N19; the rest lazy); the `<video>` element is created only on play,
  `preload="none"`, native controls, one at a time, captions burned in (D040). The app screens move to
  `src/assets/app/` once final.
- **Never** write into `design-system/`; generated files carry a header naming their source and script.

## Consequences

- One source per image; the phone gets phone-sized AVIF or WebP; DS PNG stickers stop costing a
  megabyte each.
- Image optimisation runs on Vercel and counts against the plan's image-transformation allowance; the
  site has about 60 source images. If the allowance becomes a cost, option 1 is the fallback for the
  heavy stickers only (a founder decision because it costs money).
- `sharp` becomes an explicit pinned development dependency for the OG script ([dependencies](../dependencies.md)).
- Inline doodles add HTML bytes (and the App Router repeats them in the inline server-component payload),
  which is why only below-the-fold doodles are inlined and the HTML document has its own budget
  ([architecture §12](../architecture.md#12-performance-budget-phones-first)).
