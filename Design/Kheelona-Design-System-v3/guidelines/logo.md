# Logo Guidelines

**Kheelona Brand Guidelines v3.0 · pages 11–15**

## 1. Anatomy & Symbolism

The wordmark sets "Kheelona" in custom rounded letterforms, alternating Deep Orange and Sky Blue, wrapped in a white sticker outline.

- **The 'K' (Heart) — Care & Companionship.** Grounds the brand in emotional warmth. It signals that companionship and a safe environment are the foundation of the Kheelona experience. The K is drawn as an orange heart rotated toward the word, with a Sky Blue teardrop accent.
- **The 'O' (4-Point Star) — Playful Tech Ed.** Represents the dynamic energy of modern learning. The white four-point star counter turns the letterform into a symbol of future-focused, engaging technology education.
- Letter coloring: **K** orange (blue accent) · **h** blue · **ee** orange · **l** blue · **o** orange (white star) · **n** blue · **a** orange.

## 2. Files

| File | Use |
|------|-----|
| `../assets/logo/kheelona-wordmark.svg` | Primary full-color wordmark (vector, rebuilt from the source geometry). Default choice on white/light backgrounds. |
| `../assets/logo/kheelona-wordmark-white.svg` | Single-color white wordmark for Sky Blue, Deep Orange, photo or dark backgrounds. |
| `../assets/logo/kheelona-mark.svg` | The standalone K-mark (heart + teardrop) for avatars, favicons, chest badges. |
| `../assets/logo/logo-construction-grid.png` | Construction grid reference (10 × 3 unit clear-space grid). |
| `../assets/logo/app-icon-sheet.png` | Mobile application icon sheet. |
| `../assets/logo/spec-*.png` | Source spec panels captured from Figma (dimensions, stroke, colors, shadow). |

## 3. Construction & Clear Space

- Reference proportions: **557 × 155** (≈ 3.59 : 1).
- The construction grid frames the wordmark in a **10-unit-wide × 3-unit-tall** grid; keep at least **one grid unit** (≈ logo-height ÷ 3) of clear space on every side.
- **Sticker outline:** white stroke, **weight 5, aligned outside** the letterforms.
- **Drop shadow:** X 0 · Y 4 · blur 4 · black at 25% (`--kh-shadow`). Apply to the sticker lockup on flat backgrounds; omit in very small sizes.

## 4. Approved Colors

Logo colors are fixed: `#EF762F`, `#29A0D7`, `#FFFFFF` — never recolor, never add gradients.

| Background | Version |
|------------|---------|
| White / Cream / light tints | Full-color wordmark |
| Sky Blue, Deep Orange, Yellow, photos, dark | White wordmark |

## 5. How NOT to Use the Logo (p.14)

1. **Stretch or Compress** — never distort proportions; scale uniformly only.
2. **Colours** — never change or re-map the logo colors.
3. **Stroke** — never add extra strokes or change the outline weight.
4. **Different BG** — never place the full-color logo on backgrounds that break contrast or clash (use the white version on brand colors and photos).
5. **Tilt** — never rotate or tilt the logo.

## 6. Mobile Application Logo (p.15)

The app icon uses the K-mark centered on a brand-color tile (see `app-icon-sheet.png`); corner radius follows the platform mask, clear space of 3 units inside the tile.
