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
Optional search meta: `"updated"` (or the page's date in `_shell/seo.json` "updated"), `"crumb"`, `"ogImage"`,
`"ogImageAlt"`, `"noindex"`, `"sitemap": false`, `"output"` (e.g. `404.html`). The build adds the breadcrumb, the
site's JSON-LD and the head tags itself (see the root README, v13); put only a page's own nodes (FAQPage, HowTo,
ContactPage…) in `<head-extra>`. `python3 tools/check-seo.py` after every build.
`css` / `js` load `assets/css/pages/<name>.css` and `assets/js/pages/<name>.js` (plain CSS / plain JS, no build step).

## Design language (same as home)
- White base, ink `#1d1d1f`. **Two fonts on the whole site** (owner, 2026-10-22): **Glory** for headings (`--display`:
  `.display`, `.h2`, `.h3`, every h1–h3 and the big words) and **Instrument Sans** for everything else (`--text`: `.lead`,
  `.eyebrow`, `.small`, nav, buttons, chips, labels). Self-hosted latin files in `assets/fonts/`, never another family;
  headings take light tracking (about -0.01em), not the old -0.035em.
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

## Stories: published from the dashboard
`/stories` and every `/stories/<slug>` are generated, never hand-written: writers publish in admin.kheelona.com → Blog,
and the redesign follows the live site's publishing rule (website/scripts/journal/sync-posts.mjs, journal-pipeline).

```bash
bash tools/publish-stories.sh          # sync (the live rule) → generate → python3 tools/build-pages.py
bash tools/publish-stories.sh --api    # preview straight from the live API (read-only GET); the snapshot is untouched
```
1. **Sync**: `website/scripts/journal/sync-posts.mjs`, run as the live build's prebuild step 15 runs it. `BLOG_SYNC=off`
   checks the committed snapshot `src/content/en-IN/stories/posts.generated.json` with no request; `BLOG_SYNC=on` refreshes
   it from the API (`JOURNAL_API` + `JOURNAL_POSTS_PATH` in `src/config/journal.ts`, or `BLOG_API_URL`); unset, only a
   production build with `JOURNAL_SOURCE` "api" reads the API. A post that breaks the journal gate stops the run.
2. **Generate**: `tools/generate-stories.mjs` (Node ≥ 22 with `--experimental-strip-types`; it imports the live site's
   import-free modules: journal config, topics, the gate `validate.ts`, `nowrap.ts`, `read-minutes.ts`, `ring.ts`, the DS
   icons, the banned list). It reads the posts (`data.posts` from the API, or the snapshot), runs the same gate, skips
   drafts, drops redirect sources, and renders every block the dashboard can produce: paragraphs (bold lead-ins, whole-bold
   gut lines, hard breaks), h2 parts (anchors) and h3s, bullet/check/tip/fact lists and numbered steps (DS icons), callouts,
   question blocks, rules, DS photos and uploads (captions), YouTube/Vimeo videos (click to play), the answer card, sources
   (`[^n]`), `{price:…}`, `{delivery}`, the age note. An unknown block, mark, icon, photo key, topic or byline fails the
   run and writes nothing. Topic rules come from `topics.ts` (talking guides: keep reading, no pitch, the D025 line),
   the hub's featured guides and order from `hub.ts`, related guides from the post (the ring fills gaps).
   It owns `pages/stories.html` and `pages/stories/*.html` (marked GENERATED): a post removed in the dashboard loses its
   page source and its built `stories/<slug>/` on the next run. Never edit them by hand.
3. **Build**: `python3 tools/build-pages.py`, which also applies `pages/_shell/facts.json`.

- **Images:** a DS photo key uses `assets/img/stories/<key>.webp` (+ `-640`); a key without a file fails with the
  command to add one. An upload is shown from its public API address (`api.kheelona.com/v1/public/blog/images/…`; the
  bucket is private), so a new upload needs no conversion step. A toy-only close-up (the old toy's tummy, or an upload
  whose alt says the toy up close) becomes `/assets/img/product/khelu-tummy-800.webp`.
- **Name:** posts may say Kheelu; visible text, alt, aria-labels and JSON-LD names become Khelu, URLs never change.
- **Deploy hook (when the redesign goes live):** publishing in the dashboard calls the site's deploy hook, which starts a
  build. That build must run `bash tools/publish-stories.sh` before it serves the folder (for Vercel: the project's
  build command, with `BLOG_SYNC=on` or `JOURNAL_SOURCE` "api" once the dashboard holds the 20 rewritten guides). If the
  sync or the gate fails, the build fails and the host keeps the last good deploy.
