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
- **Skip:** one fixed "Skip section ↓" button (see v10).
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

## v8 changes (owner's notes, 2026-10-22)
- **Typing dots:** one short pass (~0.5 s) before each Khelu line, never a long or looping wait.
- **A day at home:** the copy sits on a frosted card so it never blends into the room; light motes rise, and the room
  breathes slowly and leans away from the pointer.
- **Languages:** no speech bubble. The greeting itself is the hero, large and in its own script, above Khelu, and the
  colour changes for each language. A clickable list of the 8 languages follows the scroll.
- **Memory:** a paper rocket (a paper plane) flies along the dotted path from yesterday's question to today's card.
- **Bedtime:** a night window (crescent moon, stars, notes floating up, "No Wi‑Fi · still playing"). Khelu has no light
  ring here. The three modes have small looping icon motions, and Story mode is the highlighted card.
- **Parent app:** the v1.0.5 screens (`app-home`, `app-curiosity`, `app-offline`, cropped from `code/UI Images_ mobile
  app` by `tools/build-assets.sh`) are shown as a deck of cards, learning first; learning chips pop out on the first card.
- **Privacy:** the v1.0.5 privacy centre (`app-privacy-centre.webp`). Every promise is in one list and the active one
  opens; the highlight moves to the matching rows. "Your choice" now says you choose how long chats are kept (the app's
  setting), not a fixed 36 months.
- **Offer:** one compact two-column card that fits a laptop screen.
- **Highlights:** `.mark` cycles through six soft shades (`.mark--peach/sky/butter/mint/pink/lilac`).

## v9 changes (owner's notes, 2026-10-22)
- **FAQ:** two columns (heading left, questions right), one answer open at a time (`<details name="faq">`, animated with
  `::details-content`). It fits one screen: 609px on a laptop and 557–720px on a phone, where it starts closed.
- **"It asks. They think." removed.** Its Pre-order button (`cta=finale`) moved into the footer.
- **Footer:** Khelu peeks over a soft card and its eyes follow the cursor; rainbow "ear" lines ripple along the card's top;
  pastel light drifts behind; links get a rainbow underline on hover; a giant "kheelona" wordmark rises letter by letter,
  its colours follow the pointer, and each letter lifts on hover.

## v10 changes (owner's notes, 2026-10-22)
- **Hero:** the question marks sit behind Khelu, never over it.
- **One Skip button:** a single fixed "Skip section ↓" (`#skip`) replaces the per-chapter buttons. It skips whichever
  section is in the middle of the screen, jumping to the start of the next one, and hides in the footer.

## v11: the whole site (2026-10-22)
Every page of betawebsite.kheelona.com, rebuilt in the home page's design language, word for word (Kheelu → Khelu):
`/products/kheelu`, `/safety`, `/setup`, `/ai-toys-for-kids-in-india`, `/stories` + 20 guides, `/team`, `/contact`,
`/privacy`, `/terms`, `/refund`, `/shipping`.
- **How pages are made:** sources in `pages/` (see `pages/README.md`), wrapped in the shared shell (`pages/_shell/`: nav,
  footer, pre-order bar) by `python3 tools/build-pages.py` → `<route>/index.html`. Shared subpage components:
  `assets/css/pages.css` + `assets/js/pages.js`; each page's own CSS/JS in `assets/css/pages/`, `assets/js/pages/`.
- **Importers** keep long text exact: `tools/import-stories.py` (hub + 20 guides) and `tools/import-legal.py` (privacy,
  terms, refund, shipping) read the beta HTML; re-run them instead of hand-editing those page sources.
- `main.js` is shared: home-only chapters run only when `#hero` exists. The footer (with the company address) is the
  same on every page; its pre-order button is untagged off the home page so each page reports one `finale`.
- **Team:** the founders orbit a living Khelu, their cards turn over to show each background, and a Khelu map shows
  who builds which part (from the founders' own lines). Phones: the cards are a swipeable row.
- `tools/phone-preview.html?page=/team` previews any page at 390px.
