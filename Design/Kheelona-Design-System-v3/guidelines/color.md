# Color Guidelines

**Kheelona Brand Guidelines v3.0 · pages 21–23**

## 1. Philosophy

> Kheelona's palette is warm-first and tech-second. Dominant Yellow and White (60%) evoke optimism and screen-free clarity, anchored by Sky Blue (20%) for reliable intelligence. Deep Orange adds a burst of energy, while subtle Teal and Purple accents (10%) provide the "magical spark" of AI discovery. Together, they position Kheelona as a sophisticated learning companion rather than a simple plastic toy.

## 2. Primary Colors (p.21)

| Color | Hex | Token | Meaning |
|-------|-----|-------|---------|
| Deep Orange | `#EF762F` | `--kh-orange` | Orange is synonymous with energy and physical activity. |
| Golden Yellow | `#F1A23B` | `--kh-yellow` | Adds a layer of optimism and happiness. |
| Sky Blue | `#29A0D7` | `--kh-blue` | The universal colour of trust, logic, and communication — the anchor for the technology side of the brand. |
| White | `#FFFFFF` | `--kh-white` | Screen-free clarity; primary canvas. |

## 3. Secondary & Accent Colors (p.22)

| Color | Hex | Token | Meaning |
|-------|-----|-------|---------|
| Teal | `#1ABC9C` | `--kh-teal` | While primary blue represents the stability of the technology, teal represents the **result** of using it: Cognitive Freshness. |
| Purple | `#8B5BFF` | `--kh-purple` | The most "magical" colour in the spectrum. Adds a sense of mystery and premium "spark". |

## 4. Usage Ratio (p.23)

Apply per composition, not per element. Judge a layout by squinting: it should feel warm and bright, with blue as the stable anchor and orange as punctuation.

```
Yellow  ██████████████████████████████ 30%
White   ██████████████████████████████ 30%
Blue    ████████████████████ 20%
Orange  ██████████ 10%
Teal    █████ 5%
Purple  █████ 5%
```

Practical rules:
- Yellow and White form the canvas — large fields, backgrounds, breathing room.
- Sky Blue carries structure — headers, key UI, links to "the tech".
- Deep Orange is the accent — CTAs, highlights, the mascot's tee. Never flood a layout with orange.
- Teal and Purple are seasoning — badges, sparkles, small moments of magic. Never primary surfaces.

## 5. Ink & Support Values

These support values come from the guidelines deck itself (not the brand palette): text ink `#1B1B1B` (`--kh-ink`), warm stone secondary text `#44403C` / `#78716C`, soft white `#FDFEFE` (`--kh-paper`), warm page background `#F9F8F6` (`--kh-cream`). Tints for content backgrounds are provided as `--kh-*-tint` tokens.

## 6. Accessibility Notes

- Body text: use `--kh-ink` on White/Cream/tints. Do not set body text in Yellow or Orange.
- White text is safe on Deep Orange, Sky Blue, Teal, and Purple at ≥ 18 px bold / 24 px regular; for smaller text prefer `--kh-ink` on tints.
- Never place Yellow text on White or White text on Yellow.
