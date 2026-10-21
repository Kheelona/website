# Kheelona redesign: scroll-driven home page prototype (v2, after UX research)

A white, product-first home page that plays like the launch film as you scroll. Kheelu stays on stage while the story
moves around it: the questions arrive, we zoom into the tummy, the sky-blue answer draws itself, the rooms of a home
change around Kheelu while it speaks, then the languages, memory, bedtime, the parent app, safety, real families, and the offer.

## Run it
```bash
bash tools/build-assets.sh            # once: builds product images, posters, video loops (needs ffmpeg + cwebp)
python3 -m http.server 5173 --bind 127.0.0.1
# open http://127.0.0.1:5173/  ·  phone frame: http://127.0.0.1:5173/tools/phone-preview.html
```

## How it's built
- Plain HTML/CSS/JS. GSAP 3.13 + ScrollTrigger and Lenis 1.1.20 are vendored in `assets/vendor/`. There is no build step.
- Each chapter is a CSS sticky **track** (`.track` with `--len`, and a `.stage` that is 100svh tall). Its ScrollTrigger progress scrubs a timeline.
- **Kheelu is alive:** it breathes and sways, it blinks (eyelid overlays), its eye glints follow the cursor, its light ring glows, and
  sound ripples come from the tummy speaker. All of this is transform/opacity on a single product cutout (`kheelu-*.webp`).
- **Pointer layer (fine pointers only):**
  - a custom cursor that changes to PLAY or DRAG;
  - magnetic buttons;
  - Kheelu tilts toward the cursor in 3D;
  - question marks scatter away from the cursor;
  - film previews play on hover.
- **Reduced motion:** every animation is skipped and the content shows in its final state.
- **SEO:** title, description, canonical, OG/Twitter, the FAQPage and Organization JSON-LD (`seo/*.jsonld`), the H1,
  every URL and every `data-ph-capture-attribute-cta` value match the live home page. `robots` is noindex here until it replaces the page.

## Content
The copy is rewritten for clarity and every fact comes from the current site: ages 3–7, the three modes, 8 languages, the
wake-up button, the parent app, the prices and the delivery date. The dialogue lines are marked illustrative.

## v2 changes (UX researcher notes, 2026-10-21)
- The name is **Khelu** everywhere it's visible. URLs stay `/products/kheelu`.
- Copy is short and simple, and "screen" appears only where it matters. Chapters are numbered 01–13 so the headings tell one story.
  Small connecting lines between chapters act as page breaks.
- **F-pattern reading:** chapter copy always sits in the same top-left column, and the visual sits beside or below it.
- **Pre-order dock:** fixed at the bottom on every screen, with "Watch Khelu ask" and "Pre-order Khelu". Its CTA tracks as
  `hero` on the first screen and as `sticky-bar` after it.
- **Skip:** every pinned demo has a "Skip ↓" button.
- **Clickable toy:** the real buttons on Khelu (✦ talk, stories and songs, ⏮ ⏭, volume −/+, power) each show what they do and play a small sound.
  The button roles come from the firmware (`iot-firmware/MEDIA-JUKEBOX.md`).
- **Sky demo:** it's now Khelu talking it through, and the sky turns to sunset when the child answers "Orange!".
- **Privacy:** a new pinned chapter built from the launch film's sequence: only you; never sold or used for ads; never kept; delete anytime.
- **Safety:** a bento of six facts that animate in.
- **Big screens and TVs:** all sizing is in rem and the root size steps up at 1800, 2300 and 3000px. Layout re-measures on resize.

## v7 changes (owner's notes, 2026-10-22)
- **Khelu's speech is pastel:** every Khelu bubble uses a light pastel from its ears (`--p-*` tokens, `.bub--*`) with ink text.
- **Why is the sky blue (`#asks`):** Khelu sits on a hill inside the sky and each line pops out of the toy with tummy ripples.
  The sky shows each step (white light fans into colours → blue bounces off the air → the sky fills blue). A clickable step
  list jumps between steps, air particles drift from the pointer, and at "Your turn" the visitor taps an answer: the sun
  sets and Khelu explains sunset.
- **Buttons demo:** the zoom back out is eased over a longer stretch of scroll.
- **Films:** no PLAY cursor over videos. Three quote cards (one in Kannada with an English line) are **sample quotes** marked
  `data-sample` in `index.html`: replace them with real, consented parent quotes before this page goes live (brief §9.8).
