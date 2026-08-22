# kheelona.com

> The consumer home of Kheelona. Its one job: turn parents into paid pre-orders for Lumi. A ₹499
> refundable token holds one at ₹4,999 (₹9,999 after 30 September 2026), the ₹4,500 balance falls due
> before dispatch, and the payment happens on store.kheelona.com, which this same repo serves. Built
> with Next.js (App Router) + TypeScript, deployed on Vercel.

## For AI: How to Resume This Project

You are resuming an in-progress website. Follow these steps exactly.

> **2026-08-23 — THE PAID STORE IS LIVE AND VERIFIED.** kheelona.com sells a ₹499 refundable token
> holding a Lumi at ₹4,999; payment happens on store.kheelona.com, served by this same repo. Proven
> with a real ₹499 order that was refunded afterwards.
>
> - **First thing on any store question →** `curl -s https://kheelona.com/api/health`
> - **Before touching store code →** `docs/website-steps.md` §8.25
> - **What is still open →** the **⏳ OPEN** half of `FOUNDER-TODO.md` (dated, or facts only the
>   founder has, no defects)
> - **The build and launch record →** `docs/checkpoints/preorder-store-2026-08-22.md` and
>   `docs/store-go-live.md`
> - **To verify →** `npm test`, `npx tsc --noEmit`, `npx next build`, and `npm run qa:sweep`
>   (the expected test count is `tests.count` in `docs/project-state.json`, kept in that one place)
>   (add `SWEEP_BASE=https://kheelona.com SWEEP_STORE=https://store.kheelona.com` for production)
> - **Do not re-test the payment path.** A real customer already proved it.

### Step 1: Read the state file
Read `docs/project-state.json`:
- `current_phase`, `current_sprint`, `phase_status`, `sprint_status`
- `last_handoff`: what happened last, what to do next, which files to load
- `blockers`: anything blocking progress (includes the claims-to-confirm register)

### Step 2: Load context — the chain, in order

`current_phase` is now a sentence, not a `phase_N` label, so read the chain rather than matching a row:

1. **`docs/revamp-2026-07/WORKING.md`** — start at "COLD-RESTART: START HERE". It carries the
   commands, the repository state, the full milestone table, and the one open action.
2. **`docs/project-state.json`** — `current_phase`, the open `blockers` (five, all dated or founder
   facts), and `last_handoff.next_action`. Closed history lives in
   `docs/checkpoints/closed-rounds.md`, not in that file.
3. **`FOUNDER-TODO.md`** — rewritten 2026-08-23 and split in two: **⏳ OPEN** is the whole live
   queue, and **✅ CLOSED** is one or two lines per finished item. Nothing in either half blocks the
   site. Never re-ask what is settled there.
4. **`docs/revamp-2026-07/BUILD-V6.md`** — the spec that built the current copy, with every
   published sentence verbatim in §2. It is a record, not a queue, and it wins over BUILD-V5 →
   BUILD-V4 → BUILD-V3 → `copy-v2.md` and older copy laws, in that order.
5. **Before changing any code**: `docs/standards/` (`PROJECT_STRUCTURE.md`,
   `COMPONENT_GUIDELINES.md`, `STRUCTURE-MAP.md`) and `docs/website-steps.md` §8 (the laws;
   **§8.24 is the newest** — mode-precise connectivity, one-source facts, disclosure content ships
   in the markup, one kicker language, and axe needs a settle after forcing reveals).

Older phase-by-phase routing (`phase_0` … `phase_11`) is history; those checkpoints live in
`docs/checkpoints/` if you need to know why something is the way it is.

Master build spec: `website-builder-prompt-final-kheelona.md` (Brand Bible §1, site map §2, design direction §3, phases, sprint plan). Highest source of truth for Home copy: `kheelona homepage website content.pdf` (blue-box copy is verbatim).

### Step 3: Confirm with the user
Say where the project stands and what is next. Do NOT re-ask questions from completed phases, and do NOT re-ask anything already settled in the Brand Bible.

## Current Status (keep this section current)
- **🟢 CURRENT STATE — V6 IS LIVE (2026-07-31).** `main` = `demo-website` = `29d2fdd`, trees
  identical; rollback tag **`v5-live-2026-07-31`**; **279 tests**. Four rounds shipped that day:
  **V4** (team feedback — brand-orange CTAs with ink labels, real-audio demos, white finales,
  VC-voiced /playos, 19 photographed journal heroes), **V5** (design/UX review — one interaction
  contract in `lib/interactions.ts`, the measured reserve form, `PromiseMark`), **the Great
  Clearance** (ship date 1 September 2026 — **since moved to 1 October 2026**, eight named languages, lifetime smart features, article
  bylines), and **V6** (the growth-arc content round: the outcome hero "A best friend at 2. / A head
  start by 5.", the Home `#growth` room answering what a child gets from 2 to 5, mode-precise
  connectivity, the native-`<details>` FAQ, and the consistency sweep). Read
  **`docs/revamp-2026-07/WORKING.md`** first, then `BUILD-V6.md` and `website-steps.md` §8.22–8.24.
  Three facts that were WRONG on the live site until V6 and must not regress: the internet FAQ
  claimed Lumi plays offline (AI mode needs home WiFi), /privacy described a Tally form that had
  stopped collecting email and birth month, and the FAQ served 1 of 8 answers to anyone without
  JavaScript. Still founder-gated: the Kheelona+ ₹ amount, certifications, real testimonial words.
- **🟢 LIVE TO CUSTOMERS (2026-07-28): https://kheelona.com** (apex canonical, `www` 308s to it). DNS pointed, Vercel Root Directory fixed, repo-root move and the product-image redirect fix deployed. **The pre-order form is live** (Tally `Y5XW7J` via `NEXT_PUBLIC_TALLY_FORM_URL`, production only, so the preview still shows the placeholder card). Verified in Chrome on the real domain: hero renders Lumi and Kheelu, GA4 `G-7LMKSFEXZ9` firing, Vercel Web Analytics loading from its obfuscated path, Tally iframe loading with all six fields, `preorder_view` reaching GA4. Iframe height was raised 560px → 960px the same day: the form measures 886px, so Submit had been below the frame's own fold. **245 tests at that point** (249 after the 2026-07-30 Ahrefs work). Search Console and Bing were both done the same day, so V3-g is closed: domain property verified, sitemap processed, 24 pages discovered.
- **✅ THE NEW SITE IS MERGED TO `main` (2026-07-28) and is the only site.** The 2026-07 revamp (theme B "Kheelu's Tour") plus the V3 repositioning from the founder's YC application (40% fun / 20% brain development / 40% education) replaced the legacy Wix commerce app that used to live at the repo root — preserved at the tag **`pre-revamp-2026-07`**, with its URLs 301'd in `next.config.ts`. **Work on `main`**; `demo-website` is only the Vercel preview branch (https://website-hdn2.vercel.app) and carries the `/a` `/b` `/c` wireframes, so sync it by MERGING, never force-push. **READ FIRST on resume: `docs/revamp-2026-07/WORKING.md`**, then `docs/revamp-2026-07/BUILD-V3.md` (the spec, whose laws still bind). Lumi is **ages 2 to 5** with the platform arc **2 to 14**; three modes (AI, Kheelu, Bluetooth); Kheelona+ is "6 months included, price announced before launch" and may never carry a ₹ amount. VERIFIED: **249 tests**, tsc clean, build green, **axe zero violations** on 10 routes × 2 viewports, **Lighthouse A11y/BP/SEO 100 on all 18 runs** with Perf 99-100, mobile clean 320-430px. **This shipped: the site went live at https://kheelona.com on 2026-07-28** — see the bullet above. **2026-07-30**: Ahrefs Web Analytics added (raw `<script async>` in `<head>`, deliberately NOT host-gated because Ahrefs verifies by fetching the page); /privacy updated in the same commit to name all three measurement tools and say which set cookies.
- **PRODUCTION RESTRUCTURE (2026-07-12, MERGED + LIVE on `demo-website` at `890a24a`) — structure/docs/tooling only, ZERO user-facing change**: the app moved to a **`src/`-based atomic-design** layout (components in `atoms/molecules/organisms/templates`, home sections in `features/home/`, the 3D stack in `features/ambient-stage/`, constants in `config/`, styles in `styles/`; `@/* → src/*`), made compliant with the two standards now in **`docs/standards/`** (`PROJECT_STRUCTURE.md` + `COMPONENT_GUIDELINES.md`, plus `STRUCTURE-MAP.md` for old→new paths). Added **Storybook 10 + Vitest** (dev-only): a story + a test per component (55 files, 165 tests green). No-change proven per phase (production CSS byte-identical, build green, pages render pixel-identically). Binding law recorded in `CLAUDE.md`. **Merged to `demo-website` and live** (branch deleted); the docs-only redeploy is byte-identical. Checkpoint: `docs/checkpoints/production-restructure-2026-07-12.md`.
- **R11 LIVE (2026-07-11, commits 7e4221b/9d0c2e5/9a62b59) — THE CURRENT STATE**: the Home hero now **shows the conversation** (plush + the moon exchange in CSS-only bubbles; choreography desktop-gated, plush 340px owns mobile LCP — the two live-caught LCP lessons live in qa-report R11); **/playos is the platform page** (nav tab renamed "PlayOS"; kheelona.ai/playos flow in parent voice, NO pricing/partner CTAs; family renders + the real Magic Box photo in `public/products/`; the 4-step voice path moved to /products/lumi); **Ria's photo re-cut** on pale lavender (source had a baked checkerboard); **consistency refactor** — new shared `SectionHeading`/`Card`/`StepList`/`PageHero`/`CheckList`/`LegalDoc` (§8.19 law: new sections use them), prices/CTA labels centralized in `lib/site.ts`, FinaleCTA in `sections/shared/`, audit fixes (seam, contractions, orange-ink links, radii, type scale, focus rings, target sizes). Desktop LH 100s local / 99-100 live; mobile devtools-throttled 98×3 (simulate-mode 86 = proven measurement artifact, evidence in qa-report R11). Spec: `docs/website-steps.md` §8.19 · Checkpoint: `docs/checkpoints/r11-hero-playos-consistency.md`.
- **R10 LIVE (2026-07-11, commit 107344b)**: story-card clicks fixed (root cause: pointer-tracked tilt moved the surface under the cursor → **HARD RULE: tilt never wraps a whole-card link**, `src/components/ui/TiltCard.tsx`); **Ria Mangala Rewari on /team** (Head of Marketing · "The voice" · purple, between Kashyap and Apoorva — her card sign-off is FOUNDER-TODO R10-a); ambient shapes stabilized (perspective-correct margin lanes, gentle ghost, mount ease-in — founder visual check on live still open); StagedIntro folded into the hero (founder pick). Spec: `docs/website-steps.md` §8.18 · Checkpoint: `docs/checkpoints/r10-clicks-ria-ambient-fold.md`. Live-verified incl. corner-click test on /stories.
- **R9 LIVE (2026-07-11, commits 5c30c0a + d40e577)**: friend-feedback round fully shipped and live-verified. Brand law settled by founder: the plush = **Lumi, the product** (rotating SKU; looks change post-launch, core stays — NOT published on-site); the orange character = **Kheelu**, the permanent brand mascot and the site's NARRATOR (full-narrator mandate; device = `ui/KheeluSays.tsx` + `home/KheeluIntro.tsx`; all lines founder-approved, listed in `docs/copy-reference.md` R9). Product-first hero (lumi-blue = LCP) **closed the mobile perf gate: live median 93 vs old 85**. Real urgency live: "first 500 units at ₹4,999" (founder-supplied). **(That cap was RETIRED on 2026-08-22: urgency is now the 30 September 2026 price deadline.)** One CTA verb (nav = "Reserve at ₹4,999"). Serif only in quotes; sans kickers in guarded token `orange-ink #b54a0d` (17 token mappings). All 9 routes: A11y/BP/SEO 100, desktop perf 99–100. Disposition of all 20 reviewer findings: `docs/qa-report.md` R9. Spec: `docs/website-steps.md` §8.17. Rollback: tag `r7-live-2026-07-10`. Founder queue: FOUNDER-TODO R9-a..c (photography, testimonial faces, Kheelu voice check) + R4-a..f + R5-a (new logo). Checkpoint: `docs/checkpoints/r9-friend-feedback-kheelu.md`.
- **R5–R7 SHIPPED (2026-07-10)**: calm ambient home (3D journey dormant, one prop-flip), zero italics, left-aligned, white-label fills, Animate UI vendored registry, kheelona.ai enrichment (recognition strip, safety callout, parent-app section, 3 real quotes, team parity). Specs: `docs/website-steps.md` §8.14–8.16.
- **DEMO LIVE (2026-07-10)**: https://website-hdn2.vercel.app (GitHub `Kheelona/website` branch `demo-website`, Vercel root then `site/`, the repo root since 2026-07-28; local `master` pushes there via plain `git push`).
- **REDESIGN v2 ON MASTER (2026-07-09, temp-live for feedback)**: Home is one continuous immersive 3D journey (Direction 1 "Lumi's World" + pop-up elements; ribbon nav removed on founder feedback). Founder-generated GLBs live in `public/models/` (mascot breathes + follows the cursor procedurally; Lumi sways at Meet Lumi and on /products/lumi). Lighthouse: home desktop 99/100/100/100 LCP 0.9s, /products/lumi 100/100/100/100; reduced-motion/no-JS get the full flat site; phones keep DOM art over an ambient sky. Known follow-ups: mobile perf 81 (LCP 4.9s slow-4G), 7 interior pages still flat. Architecture: `docs/redesign-plan-2026-07.md`.
- **BUILD COMPLETE (2026-07-06)**: all 9 pages + 14 journal articles live in `site/` (Next.js 16, 28 static pages). Lighthouse desktop 99/100/100/100. Launch is gated only on founder inputs: see `FOUNDER-TODO.md` at the repo root.
- **Journal (2026-07-06 expansion)**: 10 keyword-researched articles added (`src/lib/stories-expansion.ts`), 7 illustrated heroes in `public/stories/` (remaining 7 prompts: `docs/stories-image-prompts.md`). All 14 verified 0% AI / 100% human-written on QuillBot AI Detector v7.1.0 (humanizer rewrite skipped: it degraded meaning on a sample — see qa-report).
- **Visual rework (2026-07-07)**: clean transparent cutouts site-wide (`tools/cutout`), R3F 3D hero with regenerated idle mascot GLB (two-face artifact fixed), staged hero copy, 20s real-photo launch film after the hero, feelings cast lineup, scroll-reveal blanking fixed. Lighthouse desktop 99/96/100/100 (home).
- **Asset-quality sprint (2026-07-07/08, committed 001fe78)**: Lumi imagery replaced with founder-approved Gemini studio renders (`lumi-blue.png` 1113×1600; green/right/left/back/pink staged in `Design/product-images/generated-2026-07/`); the site is **2D everywhere** (all GLBs/R3F/three deps removed; heroes use `MascotScene` parallax cutouts); the launch film is the 25s "Two friends" Veo build (founder-generated clips + Remotion overlays), live at `public/video/launch.mp4`. Hard rule: all Gemini generation is founder-run from `gemini-handoff/` kits (CLAUDE.md gate). Resume from `docs/project-state.json` → `last_handoff.next_action`.
- **Getting started (developers)**: `npm install && npm run dev` (Node 18+). Production: `npm run build && npm start`. Env: copy `.env.example` → `.env.local`. Deploy: Vercel, Root Directory = repo root.
- **Locked decisions**: tokens from `Design/design-system/` mapped into `src/styles/globals.css` `@theme` (drift fails the build via `tools/tokens/check-tokens.mjs`, 17 mappings); the pre-order is **paid, on our own form** in `src/features/preorder/` (the Tally embed and its adapter were retired on 2026-08-22); ₹ site-wide, from the paise integers in `src/config/site.ts`; accessibility 90+ outranks any styling preference.

## Project Structure
```
kheelona-com-website/
├── CLAUDE.md                              ← Session entry point (founder identity, gates, commands).
├── README.md                              ← This file. Resume protocol + status.
├── FOUNDER-TODO.md                        ← Split in two: ⏳ OPEN is the live queue, ✅ CLOSED is the record.
├── website-builder-prompt-final-kheelona.md  ← Master build spec (Brand Bible, phases, sprints).
├── kheelona homepage website content.pdf  ← Highest source of truth (Home copy, verbatim).
├── .env                                   ← Gitignored. The store's six real secrets live here and in Vercel.
├── Design/                                ← NOTE: capital D (spec says /design/, actual folder is Design/)
│   ├── design-system/                     ← Tokens (colors_and_type.css), fonts, brand README, shapes, logo.
│   ├── mascot-3d-images/                  ← Mascot PNG renders (source for cutouts + the Tripo GLB).
│   └── product-images/                    ← Lumi photos (secondary support).
├── design-concepts/                       ← 3 archived concepts + cutout/Tripo pipelines (see its README).
├── docs/
│   ├── project-state.json                 ← Machine-readable status. Always current.
│   ├── website-steps.md                   ← Master blueprint (law; update it when reality diverges).
│   ├── copy-reference.md                  ← Copy provenance + sanctioned deviations.
│   ├── qa-report.md                       ← Sprint reports, Lighthouse, article AI-detection evidence.
│   ├── stories-image-prompts.md           ← Historical: all 19 articles are photographed. Keeps the style block.
│   ├── snapshots/                         ← Pre-sprint backups.
│   └── checkpoints/                       ← One file per completed phase, plus closed-rounds.md (the closed history).
├── gemini-handoff/                        ← Founder generation kit (refs + Veo seeds + prompts).
├── launch-video/                          ← Remotion project; live film source FilmTwoFriendsVeo.tsx, master in out/.
├── src/                                   ← The Next.js 16 app (app/, components/, features/, lib/, config/, styles/).
├── test/                                  ← Cross-cutting guard tests (the money, copy and CTA laws).
├── tools/                                 ← qa/ (axe + voice sweep), tokens/ (drift check), cutout/ (Swift).
├── supabase/                              ← The store's migration. Applied by hand in the dashboard.
├── public/                                ← Static assets (images, video, models).
└── package.json, next.config.ts, …        ← App config AT THE REPO ROOT (moved out of site/ on 2026-07-28).
```

## Operating Rules
1. Work ONLY within this project folder.
2. Every decision goes to a file. If it is not written down, it did not happen.
3. `project-state.json` is always current.
4. The blueprint (`website-steps.md`) is law. If reality diverges, update it first.
5. Progress survives context clears. If it cannot, you have not documented enough.
6. Quality gates: Lighthouse (A11y/BP/SEO 90+ everywhere, Perf 90+ desktop), responsive at 375/768/1280/1536, cross-browser (Chrome/Firefox/Safari).
7. Voice-lint passes on all copy (no em-dashes, no hype, fixed names: PlayOS, Lumi, **Kheelu**, Lori, Lua, Robu, Kheelona Magic Box). `npm run qa:sweep` runs it over every rendered route.
8. Never invent claims (testimonials, certifications, specs, ship date, contact email). Flag placeholders as TODO + blocker.
