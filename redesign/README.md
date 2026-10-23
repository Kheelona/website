# Kheelona redesign: scroll-driven home page prototype (v2, after UX research)

A white, product-first home page that plays like the launch film as you scroll. Kheelu stays on stage while the story
moves around it: the questions arrive, we zoom into the tummy, the sky-blue answer draws itself, the rooms of a home
change around Kheelu while it speaks, then the languages, memory, bedtime, the parent app, safety, real families, and the offer.

## Run it
```bash
bash tools/build-assets.sh            # the local asset step (needs ffmpeg + cwebp): its outputs are committed
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
- **SEO:** see "Search (v13)" below. Every page is indexable; the Next app writes `noindex` into `<!--robots-->` on non-production hosts.
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
- **Films:** no PLAY cursor over videos. Three parent quote cards (one in Kannada with an English line); the owner
  confirmed they are real parent quotes (2026-10-22).

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
- **Footer:** Khelu peeks over a soft card and its eyes follow the cursor (the peek was removed in v15); rainbow "ear" lines ripple along the card's top;
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
- **Stories come from the admin dashboard** (admin.kheelona.com → Blog), as on the live site: `bash tools/publish-stories.sh`
  syncs the posts, generates `/stories` and one page per published post, then builds every page (details in
  `pages/README.md`, "Stories: published from the dashboard").
- **Importer** keeps long text exact: `tools/import-legal.py` (privacy,
  terms, refund, shipping) read the beta HTML; re-run them instead of hand-editing those page sources.
- `main.js` is shared: home-only chapters run only when `#hero` exists. The footer (with the company address) is the
  same on every page; its pre-order button is untagged off the home page so each page reports one `finale`.
- **Team:** the founders orbit a living Khelu, their cards turn over to show each background, and a Khelu map shows
  who builds which part (from the founders' own lines). Phones: the cards are a swipeable row.
- `tools/phone-preview.html?page=/team` previews any page at 390px.

## v12 changes (owner's answers, 2026-10-22)
- **Owner-confirmed facts** live in `pages/_shell/facts.json`, applied by `tools/build-pages.py` to every page so the
  importers/generator can't bring old wording back: chats are kept **until you delete them** (no 36-month deletion),
  Khelu speaks **10 languages**. The legal pages are final (the founder approved the drafts, 2026-10-22, wiki D067): no draft notice.
- **Only the current toy is shown:** the previous toy's close-ups and packshot are replaced by crops of
  `code/Khelu_By_Kheelona.png` (`assets/img/product/khelu-tummy-*.webp`, `khelu-studio-*.webp`, made by
  `tools/build-assets.sh`).
- **Stories follow the dashboard:** `bash tools/publish-stories.sh` (sync with the live rule → generate → build); see
  `pages/README.md`.
- **Team, fold 1 is a real-time 3D scene** (`assets/js/pages/team3d.js`, Three.js 0.170 vendored): the three founders at
  a round table with Khelu, cups, a pendant lamp and plants. Their faces are their own photos, cut out on this Mac with
  Apple Vision (`tools/cutout/cutout.swift` → `assets/img/team/*-cut.webp`), set on gently curved cards that turn toward
  the camera, with bodies in their shirt colours. Scrolling rolls the camera from a wide shot to each founder (their
  card opens) and back out; the dots jump to a founder. No WebGL or reduced motion → the founder cards show instead.
- **Living faces (v12.1):** each founder's photo sits on a mesh with real relief built from Apple Vision face landmarks
  (`tools/cutout/landmarks.swift` → `assets/img/team/landmarks.json`): the head turns and tilts from the neck, nods when the
  camera reaches them, and the eyes blink (eyelids drawn inside each founder's own eye outline, in their skin tone).
  `?t3lid=0.8` holds the eyelids, to check them. A line runs from the founder's shoulder in the scene to their box, which
  shows their portrait, role, what they build, background and LinkedIn.
- **Seamless bodies (v12.2):** below the chest each founder's body is their own photo carried on to the seat (each column
  keeps its own shirt pixels, mirrored so knit and stripes run on, tapering to the waist and shading toward the table),
  so face and body are one surface. No 3D arms or torso blocks: beside a real photo they never read as the same person.
  Legs under the table use the same flat, soft shading.

## v13: search (SEO, AEO, GEO), 2026-10-22
- **One source:** `pages/_shell/seo.json` holds the Organization (with description and support contact), the founders,
  the WebSite and the Product + Offer (`alternateName` Kheelu and Lumi; `availabilityStarts` 2026-11-15 = mid-November;
  @id `/products/lumi#product`), the default share card, breadcrumb names, page dates and the robots policy.
  `tools/build-pages.py` writes them into every page's JSON-LD and into `index.html` (between `<!--seo:jsonld-->` markers;
  home's FAQPage is read from its visible questions), so every @id is the same everywhere.
- **Every page:** `<!--robots-->` in `<head>` (no prototype noindex), `<!--tracking-head-->` before `</head>`,
  `<!--tracking-body-->` before `</body>`, absolute slash-less canonical, OG/Twitter with an image on disk, icons, a
  visible breadcrumb + BreadcrumbList (not home), a WebPage node. Guides show "Updated" and carry a named author where
  the post has one; `/stories` carries a Blog of every guide.
- **Root files** (written by build-pages): `sitemap.xml`, `robots.txt`, `llms.txt` and `pricing.md` (templates in
  `pages/_shell/`), `404.html` (source `pages/404.html`), `site.webmanifest`, `manifest.json` (routes, files, markers
  and the redirect map from `pages/_shell/redirects.json`, for the Next app; not to be served).
- **Images:** `bash tools/build-seo-images.sh` renders the share and product images from the current toy photo only
  (`og/kheelu.jpg`, `og.png`, `media/kheelu-front.jpg`, `product/lumi.png`), copies beta's story cards (`og/<photo>.jpg`)
  and the Kheelona mark (`brand/logo-mark.png`, favicon, icons). Each guide's card is also copied to `stories/<slug>.jpg`.
- **Check:** `python3 tools/check-seo.py` (add `--table` for the per-page table): titles, descriptions, H1s, canonicals,
  markers, JSON-LD parse and @id consistency, every internal link and anchor, sitemap, machine files, redirect targets.

## Deploy build and performance (2026-10-22)
- **One command:** `bash tools/build-site.sh` (stories with `BLOG_SYNC` off unless set → `build-pages.py` →
  `node tools/optimize.mjs`) writes a complete static site to `dist/` (gitignored). Sources are never modified.
- **Runs on Vercel with Node + Python 3 only** (2026-10-22): no ffmpeg, cwebp or svgo at deploy time, nothing downloaded
  by npx (esbuild is the website's pinned devDependency; `build-pages.py`/`check-seo.py` run on Python 3.9+). Every
  media file is **committed**: images, posters, the 6 s film loops (`assets/video/*-loop.mp4`), audio clips, the team
  bodies and stills, and the generated images in `assets/gen/` (responsive variants, PNG → WebP, SVGO output, indexed by
  `assets/gen/variants.json` with each source's hash). `optimize.mjs` only reads them and **fails, listing each file,**
  when one it needs is missing or stale. After changing an image or a page's images, run the local asset step
  (`bash tools/build-assets.sh`, or just `node tools/optimize.mjs --make-variants`) and commit `assets/gen/`.
- **Full films are not copied:** pages play `/video/moments/<id>.mp4` and `/video/expert/expert-clip.mp4`, the files the
  Next app already serves from `public/video` (`redesign/video` is a link there for the local server).
- **What the optimiser does:** one minified stylesheet per page, inlined (`CSS_MODE=link` links it instead); GSAP +
  ScrollTrigger + Lenis as one shared vendor file and one app file per page; the team 3D scene code-split with a
  tree-shaken three.js chunk; responsive variants with measured `sizes`, PNG → WebP, SVGO (all read from `assets/gen/`); hero words split at
  build time and animated by CSS (no wait for JS); content-hashed asset names; markers `<!--robots-->`,
  `<!--tracking-head-->`, `<!--tracking-body-->` kept. `dist/asset-manifest.json` lists every mapping and the cache rule:
  hashed `/assets/**` → `Cache-Control: public, max-age=31536000, immutable`; everything else → revalidate.
  Khelu's voice clips and root files (`og/`, `media/`, `brand/`, icons, `sitemap.xml`…) keep their own paths.
- **Team 3D:** `team3d.js` is a 1 KB boot; the scene (`team3d-scene.js` + three.js) loads after the page, when idle, and
  starts on the first scroll/tap (or after a short idle wait). Until then a still shows (`assets/img/team/table-*.webp`,
  the `<picture class="t3__poster">` in `pages/team.html`).
  The founders' photo bodies are baked: re-run `node tools/bake-team3d.mjs` after changing a photo, `landmarks.json`
  or the scene (it also re-captures the stills). `?t3debug` logs the set-up timings.

## v14: launch fixes (CMO review and owner rulings, 2026-10-22)
- **Claims:** safety heading "What Khelu does, and what it won't." ("Five facts you can check for yourself."), "It can't
  browse the internet.", privacy rows "Yours to read.", the narrower "never sold" line, "Delete all chats", "Chats stay until
  you delete them". The privacy-centre screenshot no longer shows the app's "seen only by you / never used for ads"
  banner (cropped in `tools/build-assets.sh`). Kept as the owner chose: footer line, home H1, "Children ask hundreds of
  questions a day.", "Backed by the best.", the app chips, "Never public", the voice greeting, the three parent quotes.
- **Facts:** 10 languages everywhere; the ✦ wake-up button is on Khelu's tummy (the current toy photo; firmware's AI button,
  also held for setup). Every parent-app screenshot carries an "Example account" tag. The support number is only on
  `/contact` (a ContactPoint there) and the legal pages, never in the site-wide Organization.
- **Selling on phones:** the hero says "Ages 3 to 7 · Reserve for ₹499 today, refundable · ₹4,999 in total."; the bottom
  bar shows the price on phones and drops "Watch" there; subpages' bar is price + Pre-order (tagged `sticky-bar` in the
  HTML), and only the product page adds "Watch", which plays the film in place. The bar slides away while an in-page
  Pre-order button or the footer is on screen; WhatsApp hides in the footer. The nav has a "Pre-order Khelu" pill
  (`navbar`; `navbar-mobile` in the menu). Home has inline Pre-order blocks after the sky-blue chapter (`home-asks` +
  "See how Khelu works" `home-asks-learn`), after the safety facts (`safety` + `safety-learn`) and in `#why` (`home-why`).
  Every price string here is swapped by the live offer (`src/lib/site-pages/offer-swap.ts`).
- **Phones:** each pinned home chapter is at most 2.5 screens tall (home ≈ 27 phone screens, was 42).

## v15: owner's changes (2026-10-22)
- **Fonts:** two on the whole site, **Glory** for headings (primary) and **Instrument Sans** for everything else, replacing
  Inter Tight / Inter. Latin subsets from Google Fonts, self-hosted in `assets/fonts/` (`glory-var-latin.woff2`, wght
  100–800, 30 KB; `instrument-sans-var-latin.woff2`, wght 400–700 pinned to its normal width, 29 KB); both are preloaded on
  every page (`index.html`, `tools/build-pages.py`). Glory's face carries `size-adjust: 108%` (its capitals are 8% shorter
  than Inter Tight's), so every heading size keeps its designed visual size and line box. The metric-matched fallbacks
  ("Glory Fallback" on Arial Bold, "Instrument Sans Fallback" on Arial) were re-measured in Chrome so the swap doesn't
  shift layout. Heading tracking is about a third of the old values (the hero -0.012em, the footer wordmark -0.019em);
  film card titles are headings in Glory too. Neither face has a ₹ glyph (nor did Inter): it comes from the system font.
- **Footer:** the peeking Khelu is gone (markup, CSS and the scroll tween); the footer's top padding is now just enough
  to show the card's rounded top.
- **Team:** "Why we build Khelu" gets the site's section rhythm above it (`clamp(3.5rem, 8vw, 6rem)`) when the 3D table
  is live, so it no longer sits against the table.
- **Home quotes:** the three quote cards are real parent quotes (no sample markers).
- **Legal pages are final:** the founder approved the drafted privacy, terms, refund and shipping pages (wiki D067);
  no draft notice anywhere, and the production build's placeholder guard passes.


## v16: smooth on phones (2026-10-23)
Measured on a 390px touch viewport with 4× and 10× CPU throttling (Chrome traces, frame times per section), then fixed:
- **First swipe:** Khelu's audio context was made on the first `pointerdown`, which on a phone is the touch that starts a
  scroll (a 170–200 ms stall at 4×, and a suspended context, so no voice). Touch screens now unlock sound on a tap (`click`).
- **Address bar:** showing or hiding it fires `resize` with only the height changed. On touch screens the waves canvas,
  rem scale, Skip button, reel and rocket now re-measure on a width change only (`onResize`), and the canvas is
  reallocated only when its size really changes (it used to blink).
- **Off-screen chapters skip rendering:** `.motion main > .track { content-visibility: auto }`. Every track has an
  explicit height, so pinning is unchanged; about 25% fewer slow frames at 10×.
- **Reel:** card centres are measured once per layout (no `getBoundingClientRect` per card per frame); scales follow the
  tween's own updates (including the scrub's glide); only the centre film plays, its neighbours preload, and the
  in-view loop player on touch leaves the reel alone (several videos used to decode at once).
- **Calm motion on touch:** no overshoot or bounce (`pop()` → `power3.out`), smaller Khelu hops (`hop()`, which also
  replaces a hop still running), and a fast scroll through *A day at home* no longer stacks room, copy and bubble
  animations. App deck and privacy highlight tweens overwrite; the privacy highlight lost its fighting CSS transition, and
  reveals switch off their element's CSS transform transition while GSAP moves them.
- **Nav** hides or shows only after 24px of scroll in one direction (no flicker from a thumb's wobble).
- **GPU:** drifting blurred blobs (footer, app deck, subpage hero glow) use a radial mask on touch instead of a blur
  filter; the invisible tiny blurs (motes, privacy blob) are gone there; no grey tap flash, buttons press in slightly.

## v17: phones, films and speed (owner's notes and Lighthouse reports, 2026-10-23)
- **One swipe, one beat (touch phones):** a scroll-snap stop at every beat of each pinned chapter and at each section's
  top (`.beats`, placed at page coordinates by main.js), hard (`mandatory`, `scroll-snap-stop: always`) only while a
  chapter is pinned (`html.in-chapter`), so the sections between scroll freely. Phone chapter lengths keep neighbouring
  beats ~0.6 screen apart (more than a thumb's drag); the beats are `BEATS` in main.js. Chrome still lets a very hard
  flick cross two stops; it no longer crosses a whole chapter.
- **Films viewer:** every `[data-video]` opens a full-screen reel at that film, playing with sound; swipe up (or ↓) for
  the next, which plays as it arrives, and a film that ends moves on; tap pauses; Back, Esc or × closes. One shared
  `<video>` moves from slide to slide, so the first tap unlocks sound for every film. Markup: `#modal.reels` in
  `index.html` and `pages/_shell/after.html`.
- **Tracking starts on engagement** (`src/lib/site-pages/tracking-shell.ts`): GA4, the Meta Pixel, PostHog and Vercel
  Analytics load on the first touch, click, key, scroll, wheel or mouse move, or 4 s after load. Same IDs and events.
  A Pre-order tap that comes first waits (≤ 2 s; measured 0.5-1.1 s) until PostHog's remote config has loaded, the
  moment autocapture starts recording, so its `cta` still reaches PostHog. The replay recorder starts when idle. Ahrefs
  stays in `<head>` (its install check reads the tag). Lighthouse mobile on the same Mac, trackers loaded but their
  hits blocked: Total Blocking Time ≈ 250 ms (live) → 17-63 ms.
- Hero image preloaded before the fonts; the "No Wi-Fi" slash animates transform/opacity (was stroke-dashoffset).
