# Kheelona Design System v3

**New here? Open `START-HERE.html` in any browser.** It's a visual index of everything below.

The complete library for the Kheelona brand — tokens, assets, guidelines, and starter templates for marketing, content creation, pamphlets, banners, product UI, and anything else that carries the brand.

**Brand version:** 3.0 (August 2026) · **Source of truth:** the master Kheelona brand guidelines deck (Figma, 29 pages)

## What Kheelona is

Safe, conversational AI tutors for kids aged 2–5 — AI-powered physical toys combining robotics, great content, and play. Audience: parents of kids 2–5, Tier-1 cities (Bangalore first), top-tier play schools. Read `BRAND.md` before creating anything.

## Directory map

```
START-HERE.html          Open this first — a browsable index of the whole system
                         (palette, type specimens, every card and template)
BRAND.md                 The brand book: purpose, vision, mission, positioning,
                         audiences, tone of voice, personality sliders
SKILL.md                 Instructions for AI assistants applying this brand
tokens/
  kheelona.css           CSS custom properties + @font-face — import this first
  kheelona.tokens.json   Machine-readable tokens (W3C-style)
fonts/                   Glory, Instrument Sans, Instrument Serif (OFL TTFs
                         + their OFL licences and a usage/licensing note)
assets/
  MANIFEST.md            Full asset inventory with provenance and usage notes
  logo/                  Wordmark + K-mark SVGs, construction & spec references
  mascot/poses|activities|reference/   Foxy-Deer mascot renders (transparent PNG)
  shapes/                7 decorative vector shapes (currentColor SVGs)
  textures/              Noise textures
guidelines/
  logo.md · color.md · typography.md · mascot.md · voice.md
preview/                 22 reference cards — the brand book as browsable HTML
templates/               Starter marketing templates wired to the tokens
```

## Golden rules

1. **Never invent brand values.** Colors, fonts, spacing, shadows come from `tokens/kheelona.css` — if a value isn't there, it isn't brand.
2. **Copy assets, don't hotlink.** When building something new, copy what you need out of `assets/` so artifacts stay self-contained.
3. **Color ratio 30/30/20/10/5/5** (Yellow/White/Blue/Orange/Teal/Purple) — see `guidelines/color.md`.
4. **Glory for feeling, Instrument Sans for information, Instrument Serif italic for editorial accents** — see `guidelines/typography.md`.
5. **The logo is sacred:** never stretch, recolor, stroke, tilt, or place on clashing backgrounds — see `guidelines/logo.md`.
6. **The mascot is a character**, not a sticker — see `guidelines/mascot.md`.
7. **The voice talks up to parents and alongside kids** — see `guidelines/voice.md`. No emoji, no baby talk, no hype.

## Using the templates

Each file in `templates/` is a standalone HTML artboard at true pixel size (e.g. 1080×1080). Duplicate, replace the copy and imagery, keep the token wiring. Render to PNG with headless Chrome:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --screenshot=out.png --window-size=1080,1080 --hide-scrollbars \
  "file://$PWD/templates/social-square-1080.html"
```

## Keeping in sync

This is a point-in-time export of the master library. Brand values change rarely, but when
they do the master is the authority — not your copy.

- **Don't edit these files to change brand values.** Ask for a fresh export instead, so
  everyone stays on the same tokens.
- **Do copy freely out of it** into whatever you're building.
- The fonts are SIL Open Font License 1.1 — free to embed, but keep the `OFL-*.txt` files
  next to the TTFs in any copy. See `fonts/README.md`.
- Check the version row below before starting a large piece of work; if it's older than a
  few months, ask whether a newer export exists.

## Version log

| Date | Change |
|------|--------|
| 2026-08-23 | Added `START-HERE.html` browsable index; bundled the three OFL licences + `fonts/README.md`; corrected asset resolutions in `assets/MANIFEST.md`. |
| 2026-08-22 | v3.0 initial build from the master guidelines deck; full asset extraction including the reconstructed vector wordmark. |
