# kheelona.com

> The consumer home of Kheelona. Its one job: turn parent interest into a qualified pre-order list for Lumi, at the launch price (₹4,999, ₹9,999 after launch, no payment now), and earn trust. Built with Next.js (App Router) + TypeScript, deployed on Vercel.

## For AI: How to Resume This Project

You are resuming an in-progress website. Follow these steps exactly.

### Step 1: Read the state file
Read `docs/project-state.json`:
- `current_phase`, `current_sprint`, `phase_status`, `sprint_status`
- `last_handoff`: what happened last, what to do next, which files to load
- `blockers`: anything blocking progress (includes the claims-to-confirm register)

### Step 2: Load context for your current task
| If current_phase is... | Read these files |
|---|---|
| phase_0 through phase_6 | `project-state.json` + current-phase checkpoint + `docs/checkpoints/phase-0-kickoff.md` + `kheelona homepage website content.pdf` |
| phase_7 (tech stack) | `project-state.json` + phase 1–6 checkpoint summaries |
| phase_8 (blueprint) | `project-state.json` + all phase checkpoints |
| phase_9 (readiness) | `project-state.json` + `docs/website-steps.md` + `package.json` |
| phase_10 (implementation) | `project-state.json` + `docs/website-steps.md` + `tailwind.config.ts` + relevant files. See `last_handoff.context_to_load_on_resume`. |
| phase_11 (delivery) | `project-state.json` + `docs/website-steps.md` + `docs/qa-report.md` |
| phase_13 (revamp theme B → V3, BUILT) | **`docs/revamp-2026-07/WORKING.md` FIRST**, then **`docs/revamp-2026-07/BUILD-V3.md`** (the spec that was built; still wins over copy-v2.md) + `project-state.json`. Work on branch `revamp/kheelu-tour`. |

Master build spec: `website-builder-prompt-final-kheelona.md` (Brand Bible §1, site map §2, design direction §3, phases, sprint plan). Highest source of truth for Home copy: `kheelona homepage website content.pdf` (blue-box copy is verbatim).

### Step 3: Confirm with the user
Say where the project stands and what is next. Do NOT re-ask questions from completed phases, and do NOT re-ask anything already settled in the Brand Bible.

## Current Status (keep this section current)
- **⚠ REVAMP + V3 REPOSITIONING BUILT, AWAITING FOUNDER GATES (2026-07-28, branch `revamp/kheelu-tour`; LIVE PREVIEW https://website-hdn2.vercel.app)**: the whole site is re-themed onto wireframe direction B and then repositioned per the founder's YC application (40% fun / 20% brain development / 40% education, companion story leading). **READ FIRST on resume: `docs/revamp-2026-07/WORKING.md`**, then `docs/revamp-2026-07/BUILD-V3.md` (the spec that was built; it wins over copy-v2.md). Signature = a persistent **Kheelu guide** narrating **rooms** on one warm backdrop, brand-4 palette, two fonts. DONE: P0-P2, M1 theme core, M2 Home, M3 /products/lumi, M4 the 8 interior routes, M4-b the mobile pass, then V3 in five slices (shared parts, Home, Lumi, interior, cleanup+QA+deploy) plus the founder review round. Lumi is **ages 2 to 5** with the platform arc **2 to 14**; the .com lineup is the pipeline Lumi → Kheelu Speaker → AI books; Lumi's three modes are named on-site (**AI mode** conversation, **Kheelu mode** stories that quiz back, **Bluetooth mode** pair-a-phone playback); Kheelona+ is "6 months included, price announced before launch" and may never carry a ₹ amount, and Bluetooth may never be framed as a subscription fallback. VERIFIED: tests **215/215**, tsc clean, build green, **axe zero violations** on 10 routes × 2 viewports, **Lighthouse A11y/BP/SEO 100 on all 18 runs** with Perf 99-100, mobile clean 320-430px, 23-href crawl 200s. **NEXT = founder gates only** (V3-a real testimonial quotes BLOCK merge to main, V3-b Kheelona+ price/lapse, V3-c pipeline art, V3-d Kheelu lines, plus Tally URL, GA4, DNS, counsel review, and the two highest-leverage assets REV-a hero art and R9-a photography). Checkpoint: `docs/checkpoints/revamp-theme-b-2026-07-25.md`.
- **PRODUCTION RESTRUCTURE (2026-07-12, MERGED + LIVE on `demo-website` at `890a24a`) — structure/docs/tooling only, ZERO user-facing change**: the app moved to a **`src/`-based atomic-design** layout (components in `atoms/molecules/organisms/templates`, home sections in `features/home/`, the 3D stack in `features/ambient-stage/`, constants in `config/`, styles in `styles/`; `@/* → src/*`), made compliant with the two standards now in **`docs/standards/`** (`PROJECT_STRUCTURE.md` + `COMPONENT_GUIDELINES.md`, plus `STRUCTURE-MAP.md` for old→new paths). Added **Storybook 10 + Vitest** (dev-only): a story + a test per component (55 files, 165 tests green). No-change proven per phase (production CSS byte-identical, build green, pages render pixel-identically). Binding law recorded in `CLAUDE.md`. **Merged to `demo-website` and live** (branch deleted); the docs-only redeploy is byte-identical. Checkpoint: `docs/checkpoints/production-restructure-2026-07-12.md`.
- **R11 LIVE (2026-07-11, commits 7e4221b/9d0c2e5/9a62b59) — THE CURRENT STATE**: the Home hero now **shows the conversation** (plush + the moon exchange in CSS-only bubbles; choreography desktop-gated, plush 340px owns mobile LCP — the two live-caught LCP lessons live in qa-report R11); **/playos is the platform page** (nav tab renamed "PlayOS"; kheelona.ai/playos flow in parent voice, NO pricing/partner CTAs; family renders + the real Magic Box photo in `site/public/products/`; the 4-step voice path moved to /products/lumi); **Ria's photo re-cut** on pale lavender (source had a baked checkerboard); **consistency refactor** — new shared `SectionHeading`/`Card`/`StepList`/`PageHero`/`CheckList`/`LegalDoc` (§8.19 law: new sections use them), prices/CTA labels centralized in `lib/site.ts`, FinaleCTA in `sections/shared/`, audit fixes (seam, contractions, orange-ink links, radii, type scale, focus rings, target sizes). Desktop LH 100s local / 99-100 live; mobile devtools-throttled 98×3 (simulate-mode 86 = proven measurement artifact, evidence in qa-report R11). Spec: `docs/website-steps.md` §8.19 · Checkpoint: `docs/checkpoints/r11-hero-playos-consistency.md`.
- **R10 LIVE (2026-07-11, commit 107344b)**: story-card clicks fixed (root cause: pointer-tracked tilt moved the surface under the cursor → **HARD RULE: tilt never wraps a whole-card link**, `site/components/ui/TiltCard.tsx`); **Ria Mangala Rewari on /team** (Head of Marketing · "The voice" · purple, between Kashyap and Apoorva — her card sign-off is FOUNDER-TODO R10-a); ambient shapes stabilized (perspective-correct margin lanes, gentle ghost, mount ease-in — founder visual check on live still open); StagedIntro folded into the hero (founder pick). Spec: `docs/website-steps.md` §8.18 · Checkpoint: `docs/checkpoints/r10-clicks-ria-ambient-fold.md`. Live-verified incl. corner-click test on /stories.
- **R9 LIVE (2026-07-11, commits 5c30c0a + d40e577)**: friend-feedback round fully shipped and live-verified. Brand law settled by founder: the plush = **Lumi, the product** (rotating SKU; looks change post-launch, core stays — NOT published on-site); the orange character = **Kheelu**, the permanent brand mascot and the site's NARRATOR (full-narrator mandate; device = `ui/KheeluSays.tsx` + `home/KheeluIntro.tsx`; all lines founder-approved, listed in `docs/copy-reference.md` R9). Product-first hero (lumi-blue = LCP) **closed the mobile perf gate: live median 93 vs old 85**. Real urgency live: "first 500 units at ₹4,999" (founder-supplied). One CTA verb (nav = "Reserve at ₹4,999"). Serif only in quotes; sans kickers in guarded token `orange-ink #b54a0d` (17 token mappings). All 9 routes: A11y/BP/SEO 100, desktop perf 99–100. Disposition of all 20 reviewer findings: `docs/qa-report.md` R9. Spec: `docs/website-steps.md` §8.17. Rollback: tag `r7-live-2026-07-10`. Founder queue: FOUNDER-TODO R9-a..c (photography, testimonial faces, Kheelu voice check) + R4-a..f + R5-a (new logo). Checkpoint: `docs/checkpoints/r9-friend-feedback-kheelu.md`.
- **R5–R7 SHIPPED (2026-07-10)**: calm ambient home (3D journey dormant, one prop-flip), zero italics, left-aligned, white-label fills, Animate UI vendored registry, kheelona.ai enrichment (recognition strip, safety callout, parent-app section, 3 real quotes, team parity). Specs: `docs/website-steps.md` §8.14–8.16.
- **DEMO LIVE (2026-07-10)**: https://website-hdn2.vercel.app (GitHub `Kheelona/website` branch `demo-website`, Vercel root `site/`; local `master` pushes there via plain `git push`).
- **REDESIGN v2 ON MASTER (2026-07-09, temp-live for feedback)**: Home is one continuous immersive 3D journey (Direction 1 "Lumi's World" + pop-up elements; ribbon nav removed on founder feedback). Founder-generated GLBs live in `site/public/models/` (mascot breathes + follows the cursor procedurally; Lumi sways at Meet Lumi and on /products/lumi). Lighthouse: home desktop 99/100/100/100 LCP 0.9s, /products/lumi 100/100/100/100; reduced-motion/no-JS get the full flat site; phones keep DOM art over an ambient sky. Known follow-ups: mobile perf 81 (LCP 4.9s slow-4G), 7 interior pages still flat. Architecture: `docs/redesign-plan-2026-07.md`.
- **BUILD COMPLETE (2026-07-06)**: all 9 pages + 14 journal articles live in `site/` (Next.js 16, 28 static pages). Lighthouse desktop 99/100/100/100. Launch is gated only on founder inputs: see `FOUNDER-TODO.md` at the repo root.
- **Journal (2026-07-06 expansion)**: 10 keyword-researched articles added (`site/lib/stories-expansion.ts`), 7 illustrated heroes in `site/public/stories/` (remaining 7 prompts: `docs/stories-image-prompts.md`). All 14 verified 0% AI / 100% human-written on QuillBot AI Detector v7.1.0 (humanizer rewrite skipped: it degraded meaning on a sample — see qa-report).
- **Visual rework (2026-07-07)**: clean transparent cutouts site-wide (`tools/cutout`), R3F 3D hero with regenerated idle mascot GLB (two-face artifact fixed), staged hero copy, 20s real-photo launch film after the hero, feelings cast lineup, scroll-reveal blanking fixed. Lighthouse desktop 99/96/100/100 (home).
- **Asset-quality sprint (2026-07-07/08, committed 001fe78)**: Lumi imagery replaced with founder-approved Gemini studio renders (`lumi-blue.png` 1113×1600; green/right/left/back/pink staged in `Design/product-images/generated-2026-07/`); the site is **2D everywhere** (all GLBs/R3F/three deps removed; heroes use `MascotScene` parallax cutouts); the launch film is the 25s "Two friends" Veo build (founder-generated clips + Remotion overlays), live at `site/public/video/launch.mp4`. Hard rule: all Gemini generation is founder-run from `gemini-handoff/` kits (CLAUDE.md gate). Resume from `docs/project-state.json` → `last_handoff.next_action`.
- **Getting started (developers)**: `cd site && npm install && npm run dev` (Node 18+). Production: `npm run build && npm start`. Env: copy `site/.env.example` → `.env.local`. Deploy: Vercel, project root `site/`.
- **Locked decisions**: tokens from `Design/design-system/` mapped in `site/app/globals.css`; Tally pre-order (adapter in `components/ui/TallyEmbed.tsx`); ₹ site-wide; A+C blended design (see `docs/checkpoints/phase-2-ux-discovery.md`); accessibility 90+ outranks any styling preference.

## Project Structure
```
kheelona-com-website/
├── CLAUDE.md                              ← Session entry point (founder identity, gates, commands).
├── README.md                              ← This file. Resume protocol + status.
├── FOUNDER-TODO.md                        ← Everything waiting on the founder (11 items).
├── website-builder-prompt-final-kheelona.md  ← Master build spec (Brand Bible, phases, sprints).
├── kheelona homepage website content.pdf  ← Highest source of truth (Home copy, verbatim).
├── .env                                   ← Gitignored; dummy TRIPO_API_KEY / Tally URL / GA4 ID.
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
│   ├── stories-image-prompts.md           ← Ready prompts for the 7 articles still missing heroes.
│   ├── snapshots/                         ← Pre-sprint backups.
│   └── checkpoints/                       ← One file per completed phase.
├── gemini-handoff/                        ← Founder generation kit (refs + Veo seeds + prompts).
├── site/                                  ← The Next.js 16 app (app/, components/, lib/, public/). 2D everywhere (no GLB/R3F).
└── launch-video/                          ← Remotion project; live film source FilmTwoFriendsVeo.tsx, master in out/.
```

## Operating Rules
1. Work ONLY within this project folder.
2. Every decision goes to a file. If it is not written down, it did not happen.
3. `project-state.json` is always current.
4. The blueprint (`website-steps.md`) is law. If reality diverges, update it first.
5. Progress survives context clears. If it cannot, you have not documented enough.
6. Quality gates: Lighthouse (A11y/BP/SEO 90+ everywhere, Perf 90+ desktop), responsive at 375/768/1280/1536, cross-browser (Chrome/Firefox/Safari).
7. Voice-lint passes on all copy (no em-dashes, no hype, fixed names: PlayOS, Lumi, Lori, Lua, Robu, Kheelona Magic Box). PDF Home copy is verbatim.
8. Never invent claims (testimonials, certifications, specs, ship date, contact email). Flag placeholders as TODO + blocker.
