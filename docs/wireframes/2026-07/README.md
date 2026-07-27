# Redesign wireframes, 2026-07 (3 directions) — RESUME HERE

**Status: awaiting founder's pick.** Three hi-fi landing-page directions were built and
deployed live for feedback. When the founder chooses one (or a hybrid), build it properly
in Next.js on the `src/` component system per `docs/standards/`.

## What this is
Hi-fi HTML/CSS wireframes for the kheelona.com **landing page** and **/products/lumi**,
exploring a founder-approved **two-layer "hybrid" flow**: one page that opens as the quiet,
credible **company layer**, is narrated by **Kheelu**, **warms** into the mascot world, and
ends at **Reserve**. Mascot-first (Kheelu leads; the product is not the landing hero).

Each file is a self-contained page carrying BOTH the landing and the Lumi page, switched by
a top nav toggle ("Lumi" / "Meet Kheelu").

## The three directions
- **A — First Light** (`templates/a.html`): a calm editorial column that warms down the
  scroll (washes shift cream to sun to teal; Kheelu grows and comes alive). Safest/most premium.
- **B — Kheelu's Tour** (`templates/b.html`): Kheelu is a **persistent on-screen guide** who
  changes pose + narration per section; rooms linked by a numbered trail. Warmest/most differentiated.
- **C — The Constellation** (`templates/c.html`): companions **orbit a trusted base**
  (Kheelu centered, Lumi + Lori/Lua/Robu on rings); you descend from the system to Lumi.
  Strongest 3D feel; most platform-forward.

## Live for feedback (branch `demo-website`, commit 202d520)
- A: https://website-hdn2.vercel.app/a
- B: https://website-hdn2.vercel.app/b
- C: https://website-hdn2.vercel.app/c

Deployed as `site/public/{a,b,c}.html` + `site/vercel.json` clean-URL rewrites (additive; no
existing route touched). Also published as private claude.ai Artifacts (favicon 🧡).

## Locked decisions this round
- Mascot spelling = **Kheelu** (founder wrote "Khelu", confirmed Kheelu).
- ICP / age widened to **ages 3 to 10** (Lumi serves the younger end today, grows up).
- Realistic Lumi product photos (speaker/controls/wordmark visible) cut to transparency via
  `tools/cutout` keycut hybrid; stored as webp in `assets-web/`.
- Copy: CMO draft then a senior-editor pass (de-patterned mirrored "X. Y." headlines, killed
  AI tells, zero em-dashes). Single source of truth: `copy.json`.

## Open flags (founder calls, still PUBLIC on the deployed wireframes)
- **Testimonials** = placeholders (Ananya/Karthik/Divya). Swap real quotes, relabel "Sample", or leave.
- **Ship date** in the Lumi FAQ = placeholder.
- **Content-ecosystem name** = the founder's feature list said "Khelu™ Ecosystem"; used a
  descriptive name in the wireframe, exact on-site name TBC.
- **Kheelu narrator lines** need sign-off (brand law): "Hi, I'm Kheelu. Come see what we're
  making." / "That was the careful part. Now let me show you the fun." / "Save your spot.
  I'll keep Lumi company until launch." / "This is Lumi. I picked the colours myself."

## How to rebuild / iterate
```
cd docs/wireframes/2026-07
node assemble.mjs          # inlines Glory font + assets-web/*.webp + copy.json -> dist/*.html
```
- Edit copy in `copy.json` (one place, all directions), structure/motion in `templates/*.html`,
  shared tokens/primitives in `kit.css` (`{{FONT_FACES}}`, `{{KIT_CSS}}`, `{{COPY:path}}`,
  `{{COPY_JSON}}`, `{{IMG:name}}` are the placeholders the assembler fills).
- Available image names: see `assets-web/` (lumi-blue/green/pink, mascot-*, dashboard,
  nasscom, nvidia-inception, karnataka-seal, launch-poster).

## How to re-deploy the live /a /b /c
```
git worktree add -b wf-deploy /tmp/wt-demo origin/demo-website
cp docs/wireframes/2026-07/dist/a.html   /tmp/wt-demo/site/public/a.html   # (wrap w/ <!doctype><meta charset> for standalone)
# ...b, c... ; site/vercel.json already has the rewrites
cd /tmp/wt-demo && git add site/public/{a,b,c}.html site/vercel.json && git commit && git push origin wf-deploy:demo-website
```
The deployed files use the full-document wrapper (doctype + `<meta charset=utf-8>` + viewport)
so ₹ and mobile render correctly when served standalone.

## Verification bar used (all passed)
Rendered in Chrome desktop: hero, warming flow, trust grid, companions, feelings + typing
chat, parent dashboard, serif pilot quotes, finale, Lumi toggle, colorway picker; zero console
errors; zero em/en-dashes; ₹ correct (UTF-8); `/` and `/products/lumi` still 200 after deploy.
Known: first load is ~2-3s (all fonts/images inlined per file) — a packaging tradeoff, not a
real-site concern.
