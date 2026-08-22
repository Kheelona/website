# Asset Manifest

Every reusable Kheelona brand asset, its provenance, and when to use it.
Source: `Kheelona_Brand_Guidelies.fig` (v3.0, exported 2026-08-22) unless noted.
Naming: kebab-case, semantic. Every file here is the full-resolution original as embedded in the source deck — nothing has been resaved or recompressed.

## logo/ — 7 PNG + 3 SVG

| File | Size | Type | Use |
|------|------|------|-----|
| `kheelona-wordmark.svg` | vector | Reconstructed from source vector geometry | Primary logo on light backgrounds. |
| `kheelona-wordmark-white.svg` | vector | Reconstructed from source vector geometry | Logo on brand-color, photo, or dark backgrounds. |
| `kheelona-mark.svg` | vector | Reconstructed from source vector geometry | Standalone K heart + teardrop: avatars, favicons, badges. |
| `logo-construction-grid.png` | 1772×834 | Reference | Clear-space / construction documentation. |
| `logo-clearspace-card.png` | 443×209 | Reference | Compact clear-space reference. |
| `app-icon-sheet.png` | 2048×2100 | Reference | Mobile app icon sheet (p.15). |
| `spec-dimensions.png` | 462×200 | Reference | Figma spec panel: wordmark W557 H155. |
| `spec-stroke.png` | 472×264 | Reference | Figma spec panel: white outside stroke, weight 5. |
| `spec-colors.png` | 470×292 | Reference | Figma spec panel: #29A0D7 / #EF762F / #FFFFFF. |
| `spec-shadow.png` | 470×426 | Reference | Figma spec panel: drop shadow 0/4/4 black 25%. |

## mascot/poses/ — 17 transparent PNGs

Transparent PNGs. See `../guidelines/mascot.md` for the emotion → use mapping.

**Resolution is inherited from the source file and varies a lot.** Nine poses
are print-grade; eight were only ever embedded in the `.fig` at thumbnail size,
so no larger version exists to extract — they are screen-only, and anything
bigger has to be re-rendered from the 3D source or commissioned.

| Print-grade (≥ 1440 px) | px | Screen-only (≤ 360 px) | px |
|---|---|---|---|
| `cheering-laughing` | 2236×1888 | `hugging-teddy` | 256×263 |
| `peeking-waving` | 2236×1888 | `peeking-wink` | 280×236 |
| `sitting-crying` | 2016×2080 | `sitting-cute` | 256×263 |
| `sitting-eyes-open` | 2048×2100 | `sitting-giggling` | 256×263 |
| `sitting-laughing` | 2048×2100 | `standing-arms-open` | 280×236 |
| `sitting-pointing` | 2048×2102 | `standing-hero-cape` | 180×360 |
| `standing-salute` | 2048×2100 | `standing-pointing` | 256×263 |
| `superman-flying` | 1440×2880 | `standing-thinking` | 256×263 |
| `taking-notes` | 1728×2444 | | |

## mascot/activities/ — 4 PNGs

Scene renders (some with environment backgrounds):

| File | px | Note |
|---|---|---|
| `painting-wall` | 4096×2323 | Largest asset in the library. |
| `beanbag-chill` | 3559×2070 | |
| `riding-bicycle` | 2048×2100 | |
| `painting-window` | 512×291 | Screen-only — no larger source. |

## mascot/reference/ — 6 PNGs

On-model references for commissioning new art — never publish directly:

| File | px | Note |
|---|---|---|
| `closeups-large` | 2820×1504 | Face/detail close-ups. |
| `views-back-left-front` | 2820×1504 | Three-quarter views. |
| `design-reference` | 2048×2102 | Full character sheet. |
| `turnaround-mini` | 353×188 | |
| `closeups-sheet` | 353×188 | Thumbnail of `closeups-large`. |
| `turnaround` | 256×263 | **Smaller than `turnaround-mini` despite the name** — the source embedded it at thumbnail size. Use `views-back-left-front` for actual turnaround work. |

## shapes/ — 7 SVGs

Decorative vector shapes, `fill="currentColor"` (recolor via CSS `color`). Carried over from the v2 design-system project; identical to the v3 symbol library (`flower/flower_3`, `flower_4`, `flower_5`, `flower_13`, `polygon/Default`, `Cool Shape` base, `triangle/triangle_5`):
`flower-3` · `flower-4` · `flower-5` · `flower-13` · `polygon` · `squircle` · `triangle-5`

## textures/ — 4 PNGs

Noise textures from the internal symbol library ("Cool Shape" uses noise-1/noise-2 over a squircle):
`noise-1` · `noise-2` · `noise-fine` · `noise-white`

## fonts/ (top level) — 6 TTFs + 3 licences

Glory (variable + italic) · Instrument Sans (variable + italic) · Instrument Serif (regular + italic). All SIL Open Font License 1.1, downloaded from Google Fonts (github.com/google/fonts), matching the families specified in the guidelines. The `OFL-*.txt` licence files must travel with the TTFs in any copy of this library — see `../fonts/README.md`.

## Known gaps

- **Eight mascot poses, one activity scene, and two reference sheets exist only at thumbnail resolution** (table above). This is a limit of the source `.fig`, not of the extraction — every PNG here is byte-identical to the original embedded in the file. Re-render or commission if you need them large.
- The wordmark/mark SVGs are faithful reconstructions from the file's vector geometry (verified against the reference render). For print-critical work you may still want a one-time official SVG/EPS export from Figma — drop it in `logo/` beside these.
- The 16 "gradient blob" symbols and the internal `rectangle`/`wheel` component sheets from the Internal Only canvas were not extracted (not used in the guideline pages).
- No "Core Values" page exists in the v3 deck (listed in the ToC as planned).
