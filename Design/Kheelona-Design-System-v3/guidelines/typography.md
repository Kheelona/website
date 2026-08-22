# Typography Guidelines

**Kheelona Brand Guidelines v3.0 · pages 16–19**

## 1. Typefaces

### Primary — Glory
> Glory is a geometric sans-serif with distinctively rounded, soft curves. It feels "friendly" and "bouncy" without looking like a childish comic font. It aligns perfectly with the "Pixar/Disney" aesthetic.

- Role: headings, display, buttons, anything with personality.
- Weights in use: **Regular · Medium · SemiBold · Bold** (variable file, 100–900 available).
- Files: `../fonts/Glory[wght].ttf`, `../fonts/Glory-Italic[wght].ttf` (SIL OFL).

### Secondary — Instrument Sans
> Instrument Sans is a "Precision" font. It is a neo-grotesque that feels sharp, modern, and highly organized. It's a favorite in the high-end tech and startup world because of its legibility and "smart" feel.

- Role: body copy, UI labels, captions, tables, long-form text.
- Weights in use: **Regular · Medium · SemiBold · Bold** (variable file).
- Files: `../fonts/InstrumentSans[wdth,wght].ttf`, `../fonts/InstrumentSans-Italic[wdth,wght].ttf` (SIL OFL).

### Editorial accent — Instrument Serif
- Role: italic editorial section titles in brand collateral (as used throughout the brand book: *Brand Purpose*, *Brand Vision*, …). Use sparingly — one accent per composition.
- Files: `../fonts/InstrumentSerif-Regular.ttf`, `../fonts/InstrumentSerif-Italic.ttf` (SIL OFL).

## 2. Composition Styles

### Heading Style (p.18)
| Property | Value |
|----------|-------|
| Typeface | Glory |
| Letter spacing | **−1%** (`--kh-heading-tracking`) |
| Line spacing | **120%** (`--kh-heading-leading`) |
| Reference size | 36 px (subhead) |

### Paragraph Style (p.19)
| Property | Value |
|----------|-------|
| Typeface | Instrument Sans |
| Letter spacing | **+1%** (`--kh-body-tracking`) |
| Line spacing | **130%** (`--kh-body-leading`) |
| Reference sizes | 36 px subhead / 24 px body |

### Reference specimen (from the guidelines)
> **Toys that develop brain. Toy talks in every Language.**
>
> Aman and Apoorva then realised the $100B toy industry was stuck in the past, selling plastic while the world moved to AI. Then they decided to change that. Now we aren't just making "smart toys", We are building how the toys will feel like, from now on.

## 3. Type Scale (tokens)

| Token | Size | Typical use |
|-------|------|-------------|
| `--kh-text-hero` | 96 px | Hero/display statements |
| `--kh-text-display` | 64 px | Large display |
| `--kh-text-h1` | 48 px | Page titles |
| `--kh-text-h2` | 36 px | Section headings |
| `--kh-text-h3` | 32 px | Sub-sections |
| `--kh-text-lead` | 24 px | Lead paragraphs |
| `--kh-text-body` | 16 px | Body/UI |
| `--kh-text-caption` | 13 px | Captions, footnotes |

## 4. Rules

1. Never substitute the typefaces; the fallback stacks in `tokens/kheelona.css` are for progressive loading only.
2. Glory carries the *feeling*; Instrument Sans carries the *information*. Don't set long paragraphs in Glory.
3. Instrument Serif Italic is an accent, not a workhorse — titles and pull-quotes only.
4. Respect the tracking/leading specs above; they are part of the brand's look.
5. "Luckiest Guy" and "Lato" appear incidentally in the source deck; they are **not** brand fonts — do not use them.
