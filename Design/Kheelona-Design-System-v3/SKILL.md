---
name: kheelona-design-v3
description: Use this skill to create on-brand Kheelona designs and content — marketing pages, social banners, pamphlets, slides, product UI, or copy. Contains brand guidelines v3.0 (Aug 2026), design tokens, fonts, the full asset library, and starter templates.
user-invocable: true
---

Read `README.md` and `BRAND.md` first, then the relevant file in `guidelines/` for the surface you're designing.

**Kheelona in one sentence.** Safe, conversational AI tutors for kids aged 2–5 — AI-powered physical toys blending robotics, content, and play; a warm Pixar-feeling world of Golden Yellow, Sky Blue, and Deep Orange, fronted by a Foxy-Deer mascot in round blue glasses.

## Non-negotiables

1. **Tokens only.** Link `tokens/kheelona.css` (fonts load from `fonts/` via its `@font-face`). Never invent hex values or typefaces. Semantic vars: `var(--kh-orange)`, `var(--kh-font-display)`, `var(--kh-shadow)`, …
2. **Color ratio 30/30/20/10/5/5** — Yellow/White/Blue/Orange/Teal/Purple. Yellow+White are the canvas; Blue is structure; Orange is the accent (CTAs, mascot tee); Teal/Purple are seasoning only.
3. **Type:** Glory for headings (tracking −1%, leading 120%), Instrument Sans for body (tracking +1%, leading 130%), Instrument Serif *italic* for editorial section titles only. Never Luckiest Guy or Lato.
4. **Logo:** use `assets/logo/kheelona-wordmark.svg` on light, `kheelona-wordmark-white.svg` on color/photo, `kheelona-mark.svg` for avatars. Never stretch, recolor, stroke, tilt, or add backgrounds that clash. Sticker shadow = `var(--kh-shadow)`.
5. **Mascot:** pick the pose whose *emotion matches the message* (mapping in `guidelines/mascot.md`). Never flip renders with the chest mark, never redraw or recolor. It's a character with opinions — give it a role in the composition.
6. **Voice:** smart, warm, slightly playful friend. Talks UP to parents, ALONGSIDE kids. No baby talk, no emoji, no jargon, no fear-based messaging, no hype superlatives. Cheat-sheet in `guidelines/voice.md`.
7. **Decoration:** the 7 `assets/shapes/*.svg` recolored via CSS `color` at low density; noise textures for tactile surfaces. Decoration stays subordinate to content.

## Workflow

- **New marketing/social/print piece:** start from the closest file in `templates/` (square social, story, OG banner, A4 poster, A5 flyer, content card) — duplicate it, swap copy and mascot pose, keep the token wiring and safe margins.
- **New surface with no template:** compose on `--kh-cream` or White, Glory display headline, one mascot render, one shape cluster at 12–15% alpha bleeding off a corner, Orange CTA pill button.
- **Copy only:** follow `guidelines/voice.md` §4; check any claim about safety against the Protective register.
- **Copy assets into your artifact** rather than referencing across projects; everything is self-contained here.

If invoked with no other request, ask what they want to build (audience, surface, message, size) and act as the brand's designer.
