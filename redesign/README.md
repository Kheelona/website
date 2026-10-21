# Kheelona redesign: scroll-driven home page prototype

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
