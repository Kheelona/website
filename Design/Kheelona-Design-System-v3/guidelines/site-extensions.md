# Site extensions and errata — kheelona.com

**Added 2026-08-23 under the migration's gap protocol** (the master prompt requires every
gap found during migration to be documented IN v3). This file records what kheelona.com
carries ON TOP of v3, plus the two places v3's own guidance is corrected or knowingly
departed from. It adds no brand values and changes none — per the README, brand-value
changes need a fresh export from the source deck.

## Errata

1. **White on Deep Orange is 2.88:1, and the founder has accepted it (2026-08-24).**
   `guidelines/color.md` §6 says white is safe on `--kh-orange` at ≥18px bold. It is not:
   it computes to **2.88:1**, which fails WCAG AA at every size, since even the large-text
   threshold is 3:1. That arithmetic is unchanged and stays recorded here.

   What changed is the decision on top of it. From 2026-08-24 the site's rule is the deck's
   rule: **white `#FFFFFF` labels on Deep Orange `#EF762F` fills**, exactly as the
   `.kh-button` helper in `tokens/kheelona.css` has always specified. This was put to the
   founder with both the ratio and the alternative (darkening the fill to `#C25210`, which
   carries white at 4.66:1 and passes), and the founder chose to keep brand orange and take
   the 2.88:1. It applies to every solid orange surface: buttons, the nav pill, the guide
   dock chip, the compare table's brand column, and the store's submit buttons.

   So this is no longer an erratum against the deck. It is a **known, accepted accessibility
   deviation**, recorded in `docs/website-steps.md` §8.29, asserted as arithmetic in
   `test/contrast-tokens.test.ts`, and printed on every `npm run qa:sweep` run. Anyone
   proposing to "fix" the contrast is reversing a founder decision, not correcting an
   oversight.

   **Still a real erratum:** white on Teal computes ≈2.4:1 and fails. Teal is not in the
   live web palette, so nothing on kheelona.com relies on it, but carry the correction into
   the next deck export.

   **The pale-tint rule is untouched.** `bg-orange/15` chips and the `--kh-*-tint` washes are
   light surfaces and keep ink text. White on a tint is invisible, and none of the above
   applies to them.

2. **BRAND.md says ages 2–5.** The founder repositioned to **ages 3+** on 2026-08-23
   (no published ceiling anywhere). The site renders "3+"; the deck needs a refresh.

## Extensions the site carries (proposed for adoption into v3)

| Extension | Value | Why v3 needs it |
|---|---|---|
| Small-text orange `orange-ink` | `#b54a0d` | The only orange ≥4.5:1 on white, cream and every tint (except purple-tint, 4.43). v3 ships no small-text brand colours, and kickers/labels need one. |
| Small-text blue `blue-ink` | `#1b6e96` | The blue twin; ≥4.71:1 everywhere including purple-tint. |
| Motion tokens | ease-bounce `cubic-bezier(.34,1.56,.64,1)`, ease-calm `cubic-bezier(.2,.8,.2,1)` | v3 defines no motion language; START-HERE.html already hard-codes the bounce inline. Codify both. |
| Fluid type scale | `clamp()` steps anchored to v3's px scale | v3's scale is fixed px (deck-derived); responsive surfaces need fluid steps between its anchors. |
| Footer ground `footer-cocoa` | `#2a1608` | Dark warm surface for footers and icon plates (white on it: 17.26:1). No v3 equivalent. |
| Per-size app icons | favicon.ico 16/32/48 + 512 + 180 plated | v3 ships one 2048px app-icon sheet; production needs the derived set. The site's pipeline: `tools/brand/render-icons.mjs` in the kheelona.com repo. |

## Usage notes proven in production

- The wordmark/mark SVGs (reconstructions) rasterize cleanly at 512px down to 16px and
  render crisply at 34px navbar height; no PNG fallback was needed.
- The editorial serif works as WOFF2 subsets of the shipped TTFs; the site ships the
  ITALIC face only, because italic accents are the face's entire role here.
- `purple-tint` must never carry an `orange-ink` kicker (4.43:1 — the one wash/ink pair
  in the site's matrix that fails). Blue-ink is the legal label colour on it.
