# Pages other than home

Every page is a source file here, built into `<route>/index.html` by `python3 tools/build-pages.py`.
The build wraps each source in the shared shell (`_shell/`: nav, footer, bottom pre-order bar, Skip button, cursor,
video dialog) so those never drift. Never edit the built `index.html` files or `_shell/` by hand.

Serve with `python3 -m http.server 5173 --bind 127.0.0.1` from `website/redesign`, then open `/team`, `/safety`…
Phone frame: `/tools/phone-preview.html?page=/team`.

## Source format
```html
<!--page
{"path": "/safety", "title": "…", "description": "…", "css": ["safety"], "js": ["safety"]}
-->
<head-extra><script type="application/ld+json">…</script></head-extra>
<section class="ph">…</section>
…
```
`css` / `js` load `assets/css/pages/<name>.css` and `assets/js/pages/<name>.js` (plain CSS / plain JS, no build step).

## Design language (same as home)
- White base, ink `#1d1d1f`; Inter Tight for display (`.display`, `.h2`, `.h3`), Inter for text (`.lead`, `.eyebrow`, `.small`).
- Highlights: `<span class="mark mark--peach|sky|butter|mint|pink|lilac">`. Vary the shade; never the same twice in a row.
- Pastel tints for cards and blocks: `--p-pink --p-peach --p-butter --p-mint --p-sky --p-lilac` (or `.tint-*` classes).
- Khelu's own speech, when shown, is a pastel bubble with ink text: `.bubble .bubble--kheelu .bub--*`.
- Big soft radii (`--radius`, `--radius-lg`), hairline borders (`--line`), long soft shadows, buttons are pills
  (`.btn .btn--primary` / `.btn--ghost`, add `data-magnetic`).
- Motion is subtle and on transform/opacity only: `.reveal` (rises in), `[data-split]` (heading words rise),
  `[data-stagger]` (children rise one by one), `[data-count]`, `.flow` (steps with a drawing rainbow line),
  `[data-tilt-card]`, `[data-tilt]` around a `.kheelu`, `[data-kheelu]` (Khelu breathes and blinks). Everything must
  read fine with `prefers-reduced-motion` (main.js adds `.reduced` and skips motion).
- F-pattern: copy top-left; visuals beside or below. Mobile first (~70% of visits): check 390px.
- Living Khelu markup (copy from index.html): `.kheelu[data-kheelu] > .kheelu__shadow + .kheelu__body > img.kheelu__img + eyes`.

## Shared components (assets/css/pages.css)
`.ph` page hero (+ `.ph__glow` with three `<i>`, `.ph--center`, `.ph__visual`, `.crumbs`), `.answer` (answer-first card),
`.shead` section heading, `.bento`/`.bento__card` (with `.ico`), `.flow` steps, `.doc` + `.toc` + `.prose` (long reads;
add `<div class="readbar"></div>` and `data-read` on the article), `.kv` facts list, `.qcard` quote, `.closer`
(closing CTA card), `.stories`/`.storycard`, `.pills`, `.callout`, `.tablewrap`, `.page-sec` / `.page-sec--soft`.
From home: `.faq` (use `<details name="faq">`), `.backed__row`/`.backed__card` (Recognised by), `.trust`, `.price-line`.

## Content rules
- Words come from the live beta site (betawebsite.kheelona.com), word for word. Legal pages are complete and verbatim.
- The toy's visible name is **Khelu** everywhere (copy, titles, alt text, JSON-LD names). URLs and ids stay
  `/products/kheelu`, `#…kheelu…`. "Lumi" stays where the old name is explained.
- No invented claims, numbers or reviews. Ages 3 to 7. en-IN spelling.
- Pre-order links go to `https://store.kheelona.com` (not betastore). Keep each button's `data-ph-capture-attribute-cta`
  value exactly as the beta page has it.
- Images: reuse `assets/img/*`. New images may be downloaded from betawebsite.kheelona.com only, converted to WebP
  (`cwebp`), saved under `assets/img/<page>/`.
