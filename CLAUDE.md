# kheelona.com — session entry point

Pre-order marketing site for **Lumi**, Kheelona's screen-free talking AI toy for ages 3 to 6 (India-first). One job: convert parents into the Tally pre-order list at ₹4,999 (₹9,999 after launch, no payment now).

## Who you work for
**Apoorva Sahu** (apoorva@geekyants.work) — Founder & CEO of Kheelona (kheelona.com + sister site kheelona.ai), also a Director at GeekyAnts. Full authority on brand, product, and copy; defer to them on brand calls. Co-founders: Aman Soni (CTO, 14 patents filed), Kashyap C.R (Chief Hardware Officer, built at Intel — name only Intel).

## Resume protocol
1. Read `docs/project-state.json` (`current_phase`, `last_handoff`, `blockers`).
2. Follow the "For AI: How to Resume" table in `README.md`.
3. Founder-gated items live in `FOUNDER-TODO.md` — never re-ask what's already settled there or in checkpoints.

## Source-of-truth precedence
1. `kheelona homepage website content.pdf` — Home copy, verbatim (Rs. → ₹ is the one sanctioned deviation).
2. `website-builder-prompt-final-kheelona.md` — master build spec (Brand Bible §1, voice rules §1.7, keyword map §3.1).
3. `Design/design-system/` — tokens/fonts (note: capital-D `Design/`, and its README's "em-dash preferred" is OVERRIDDEN by the Brand Bible).

## Hard gates (non-negotiable)
- **Gemini generation goes through the founder, never Claude** (founder directive 2026-07-07): for ANY Gemini image/video generation, prepare reference images + copy-paste prompts (pattern: `gemini-handoff/README.md`), hand them to the founder, and ingest the results from `~/Downloads`. Do not drive gemini.google.com yourself.
- **Voice-lint**: zero em-dashes (en-dash only inside number ranges), no hype, rarely lead with "AI", exact names (PlayOS, Lumi, **Kheelu** = the brand mascot, Lori, Lua, Robu, Kheelona Magic Box), second person present tense. ONE exemption: Kheelu's quoted speech (KheeluSays bubbles) may use contractions — his founder-published card voice (copy-reference.md R9).
- **Brand law (founder, 2026-07-10)**: the plush = **Lumi, the product** — a rotating SKU whose look changes post-launch (core/AI stays); NEVER publish the rotation strategy on-site. The orange character = **Kheelu**, the permanent mascot and site narrator. The product owns the hero; Kheelu narrates (all speech lines founder-approved before shipping — pattern: list them in the plan).
- **Never invent claims**: testimonials, certifications, specs, ship date, contact email → flagged placeholders + blockers only.
- **Accessibility 90+ outranks any styling preference** (spec §3). Lighthouse gates: A11y/BP/SEO 90+ everywhere, Perf 90+ desktop.

## Commands
- Dev: `cd site && npm run dev` (port 3000)
- Prod: `cd site && npx next build && npx next start -p 3456` (local prod URL the founder uses: http://localhost:3456)
- Deploy target: Vercel, project root `site/` (blocked on founder auth, FOUNDER-TODO #2)

## Env
Root `.env` (gitignored, DUMMY values until founder fills them): `TRIPO_API_KEY` (unused — mascot pipeline went through the Tripo web UI instead, see `design-concepts/README.md`), `NEXT_PUBLIC_TALLY_FORM_URL`, `NEXT_PUBLIC_GA4_MEASUREMENT_ID`. Site reads the two `NEXT_PUBLIC_*` vars (`site/.env.example` mirrors them; `TallyEmbed` treats values containing "DUMMY" as unconfigured).

## Docs map
- `docs/project-state.json` — machine-readable status, always current
- `docs/website-steps.md` — blueprint (law; if reality diverges, update it first)
- `docs/qa-report.md` — sprint logs, Lighthouse, AI-detection verification of all 14 articles
- `docs/copy-reference.md` — copy provenance + sanctioned deviations
- `docs/design-review-2026-07-10.md` — R4 panel findings, every item dispositioned (FIXED/FOUNDER/DEFERRED/REJECTED); §8.13 in website-steps.md is the matching spec. 3D QA gotcha: hidden tabs freeze rAF, so the canvas looks dead in background automation tabs — verify with a visible window
- `docs/stories-image-prompts.md` — ready prompts for the 7 journal articles still missing hero images
- `docs/checkpoints/` — per-phase snapshots
- `design-concepts/README.md` — 3 archived concepts, mascot cutout pipeline, Tripo3D 2D→3D pipeline (v2 runs incl. Janus fix + Lumi plush), engineering gotchas (overflow-x clip, scroll-snap wheel trap)
- `site/AGENTS.md` — Next.js 16 breaking-changes warning (read `node_modules/next/dist/docs/` before writing Next code)
- `tools/cutout/` — offline background removal (Swift + Apple Vision; compile with `swiftc -O main.swift -o cutout`). Every mascot/product cutout and video asset goes through it; never ship art with baked backgrounds. For thin pale details the Vision mask drops (hat ribbons), use `keycut.swift` (region-grow color-key; hybrid mode takes a Vision `--no-crop` alpha for the body: `keycut in.png out.png 24 vision-nocrop.png`).
- Visuals are the **calm ambient treatment** (R5, founder 2026-07-10: the R4 flying journey overwhelmed — every route incl. Home now rides `AmbientStage`; punch-list law in `docs/website-steps.md` §8.14): fixed canvas sky glides the page's own washes behind SSR DOM (`site/components/three/`, `site/lib/three/`), few translucent shapes that ghost to 4% under copy, **2D Kheelu + 2D Lumi in the DOM permanently** (`MascotScene.tsx`, `LumiHero.tsx`; since R9 the HOME hero is a plain priority `Image` of the lumi-blue plush — that swap is what finally passed the live mobile perf gate, median 93). The full 3D journey (GLBs in `site/public/models/`, mascot rigged clip-less + procedural idle) is DORMANT, one prop-flip away: `<StageGate stage="journey" />` on Home. R5 hard rules: zero italics, all text left-aligned, white button/band labels on `orange-cta #C25210` / `teal-deep #0F766E` only; R9 adds: serif ONLY in human quotes, 13px sans kickers in `orange-ink #b54a0d` (the only orange passing 4.5:1 on every wash), one CTA verb (nav "Reserve at ₹4,999"), every page ends with `FinaleCTA` (id="reserve" — the nav CTA anchors to it), Kheelu narrator bubbles = `ui/KheeluSays.tsx` (§8.17). Plan + architecture: `docs/redesign-plan-2026-07.md`. `site/public/video/launch.{mp4,jpg}` = the "Two friends" film (source `launch-video/src/FilmTwoFriendsVeo.tsx`)
- `gemini-handoff/` — founder generation kit (refs + seeds + prompts); product renders staged in `Design/product-images/generated-2026-07/`
