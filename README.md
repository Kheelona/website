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

Master build spec: `website-builder-prompt-final-kheelona.md` (Brand Bible §1, site map §2, design direction §3, phases, sprint plan). Highest source of truth for Home copy: `kheelona homepage website content.pdf` (blue-box copy is verbatim).

### Step 3: Confirm with the user
Say where the project stands and what is next. Do NOT re-ask questions from completed phases, and do NOT re-ask anything already settled in the Brand Bible.

## Current Status (keep this section current)
- **BUILD COMPLETE (2026-07-06)**: all 9 pages + 14 journal articles live in `site/` (Next.js 16, 28 static pages). Lighthouse desktop 99/100/100/100. Launch is gated only on founder inputs: see `FOUNDER-TODO.md` at the repo root.
- **Journal (2026-07-06 expansion)**: 10 keyword-researched articles added (`site/lib/stories-expansion.ts`), 7 illustrated heroes in `site/public/stories/` (remaining 7 prompts: `docs/stories-image-prompts.md`). All 14 verified 0% AI / 100% human-written on QuillBot AI Detector v7.1.0 (humanizer rewrite skipped: it degraded meaning on a sample — see qa-report).
- Extras delivered: launch teaser videos (`launch-video/out/`, 16:9 + 9:16), rigged 3D mascot GLB with idle animation (`site/public/models/`, hero uses it with static fallback), 3 archived design concepts (`design-concepts/`).
- **Getting started (developers)**: `cd site && npm install && npm run dev` (Node 18+). Production: `npm run build && npm start`. Env: copy `site/.env.example` → `.env.local`. Deploy: Vercel, project root `site/`.
- **Locked decisions**: tokens from `Design/design-system/` mapped in `site/app/globals.css`; Tally pre-order (adapter in `components/ui/TallyEmbed.tsx`); ₹ site-wide; A+C blended design (see `docs/checkpoints/phase-2-ux-discovery.md`); accessibility 90+ outranks any styling preference.

## Project Structure
```
kheelona-com-website/
├── README.md                              ← This file. AI entry point.
├── website-builder-prompt-final-kheelona.md  ← Master build spec (Brand Bible, phases, sprints).
├── kheelona homepage website content.pdf  ← Highest source of truth (Home copy, verbatim).
├── Design/                                ← NOTE: capital D (spec says /design/, actual folder is Design/)
│   ├── design-system/                     ← Tokens (colors_and_type.css), fonts, brand README, shapes, logo.
│   ├── mascot-3d-images/                  ← Mascot PNG renders (the star). No GLB model exists yet.
│   └── product-images/                    ← Lumi photos (secondary support).
├── design-concepts/                       ← 3 homepage concepts (approval gate before build).
├── docs/
│   ├── project-state.json                 ← Machine-readable status. Always current.
│   ├── website-steps.md                   ← Master blueprint (Phase 8, written after concept approval).
│   ├── copy-reference.md                  ← All approved copy (Phase 5, during build).
│   ├── qa-report.md                       ← Sprint reports + QA results.
│   ├── snapshots/                         ← Pre-sprint backups.
│   └── checkpoints/                       ← One file per completed phase.
└── (app/, components/, lib/, public/ …)   ← Next.js app, created in Phase 9/10.
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
