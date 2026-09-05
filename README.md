# kheelona.com

> The consumer home of Kheelona. Its one job: turn parents into paid pre-orders for Kheelu (called
> Lumi until the 2026-09-05 rename; the old URL still redirects). A ₹499
> refundable token holds one of the first 500 units at ₹4,999, with the ₹4,500 balance due before
> dispatch; once those units are gone, a pre-order is ₹7,999 paid in full. Payment happens on
> store.kheelona.com, which this same repo serves. Built with Next.js (App Router) + TypeScript,
> deployed on Vercel.

## For AI: How to Resume This Project

You are resuming an in-progress website. Follow these steps exactly.

> **2026-08-23 — THE PAID STORE IS LIVE AND VERIFIED.** kheelona.com sells a ₹499 refundable token
> holding a Kheelu at ₹4,999; payment happens on store.kheelona.com, served by this same repo. Proven
> with a real ₹499 order that was refunded afterwards.
>
> - **First thing on any store question →** `curl -s https://kheelona.com/api/health`
> - **Before touching store code →** `docs/website-steps.md` §8.25 AND §8.26 (the unit-cap laws)
> - **What is still open →** `Technical-Todo.md` (dated, or facts only the
>   founder has, no defects)
> - **Why a 404 must never be thrown on a route a visitor can mistype →**
>   `docs/checkpoints/blank-404s-2026-09-06.md` (laws §8.34) — four routes served a BLANK
>   page in production, including one on the payment path
> - **The 2026-09-05 agency audit + the Lumi → Kheelu rename →**
>   `docs/checkpoints/agency-audit-2026-09-05.md` (laws §8.32)
> - **The build and launch record →** `docs/checkpoints/preorder-store-2026-08-22.md` and
>   `docs/store-go-live.md`
> - **To verify →** `npm test`, `npx tsc --noEmit`, `npx next build`, `npm run qa:sweep`, and for
>   anything touching the money path `npm run qa:payment` (real Razorpay SANDBOX, in a browser)
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

1. **`CLAUDE.md`** — its banner and STATE OF PLAY lead with the live truth (the 2026-08-23 v3
   migration: unit-cap offer §8.26, ages 3+, ship 20 October 2026, v3 design authority §8.27).
2. **`docs/project-state.json`** — `current_phase`, the open `blockers` (all dated or founder
   facts), and `last_handoff.next_action`. Closed history lives in
   `docs/checkpoints/closed-rounds.md`, not in that file.
3. **`Technical-Todo.md`** — THE single open-items list since 2026-08-23, founder-gated and
   engineering items in one place, each tagged with who owns it. Nothing on it blocks the site.
   Settled decisions are NOT there: they live in `docs/checkpoints/closed-rounds.md`, and **that is
   the file to search before re-asking the founder anything**. `FOUNDER-TODO.md` is now a pointer at
   both, kept because 82 references across the repo name it.
   **`security-review.md`** is the open security engagement, and CLAUDE.md's banner says to read it
   at the start of every session until it is signed off.
4. **`docs/checkpoints/white-cta-labels-2026-08-24.md`** — the newest round's record (§8.29, the
   white CTA labels and the two store paragraphs). Behind it,
   **`docs/checkpoints/v3-migration-2026-08-23.md` + `docs/checkpoints/migration-to-new-dsx.md`** —
   the v3 migration's record and its full tracker (the twelve founder decisions, QA log, SEO keyword
   map). Spec precedence behind them: `BUILD-V6.md` → BUILD-V5 → BUILD-V4 → BUILD-V3 → `copy-v2.md`
   (all records now, not queues; V6's ages and hero were re-anchored by the migration).
5. **Before changing any code**: `docs/standards/` (`PROJECT_STRUCTURE.md`,
   `COMPONENT_GUIDELINES.md`, `STRUCTURE-MAP.md`) and `docs/website-steps.md` §8 (the laws;
   **§8.26 and §8.27 are the newest** — the unit-cap offer and the v3 design authority; §8.25 is
   the store's base law).

Older phase-by-phase routing (`phase_0` … `phase_11`) is history; those checkpoints live in
`docs/checkpoints/` if you need to know why something is the way it is.

Master build spec: `website-builder-prompt-final-kheelona.md` (Brand Bible §1, site map §2, design direction §3, phases, sprint plan). Highest source of truth for Home copy: `kheelona homepage website content.pdf` (blue-box copy is verbatim).

### Step 3: Confirm with the user
Say where the project stands and what is next. Do NOT re-ask questions from completed phases, and do NOT re-ask anything already settled in the Brand Bible.

## Current Status (keep this section current)
- **🎨 NEWEST ROUND — WHITE CTA LABELS (§8.29, 2026-08-24, LIVE).** Every label on a solid orange
  fill is `text-white` across twelve surfaces, and the descriptive paragraph is gone from BOTH
  `/store` and `/store/ideabaaz`. **The accepted cost, decided by the founder with the arithmetic in
  front of them: white on `#EF762F` is 2.88:1 and fails WCAG AA at every size**; the passing
  alternative (`orange-cta #C25210`, 4.66:1) was declined to keep brand orange and match
  `.kh-button` in the v3 deck. Lighthouse a11y measured **96** (was 100), `color-contrast` the only
  failing audit, still above the 90 gate. `qa:sweep` prints these as `accepted:` rather than
  silencing them; any other contrast pair still fails it. §8.25-b was corrected in the same round,
  because it justified one-tap CTAs by quoting a paragraph that no longer exists. Rollback tag
  **`pre-white-cta-labels-2026-08-24`** = `fbbbe17`. Record:
  `docs/checkpoints/white-cta-labels-2026-08-24.md`.
- **🟢 THE v3-MIGRATED SITE IS LIVE (2026-08-23).** One engagement, one day: the
  **unit-cap offer** (₹4,999 for the first 500 units by live Supabase count, then ₹7,999 paid in
  full — §8.26; the 30 September deadline and ₹9,999 are gone), **ages 3+ everywhere** (hero
  "A best friend at 3. / A head start for school."), the **v3 design system** as sole authority
  (§8.27; old system deleted, token gate fail-hard, 16 mappings), the v3 wordmark/icons/og, the
  editorial serif on pull-quotes, ship date **20 October 2026**. Production-verified: `/api/health`
  reports the offer MODE (`preorder: token|full`); Lighthouse desktop home/lumi 99/100/100/100,
  store 98/100/100/66-by-design (**the a11y 100 became 96 on 2026-08-24 with §8.29** — see the row
  above; the SEO 66 on the store is `noindex` by design, §8.25-aa). Rollback tag **`pre-v3-migration-2026-08-23`** = `b27fd25`.
  Record: `docs/checkpoints/v3-migration-2026-08-23.md` + `docs/checkpoints/migration-to-new-dsx.md`.
  Test count: `tests.count` in `docs/project-state.json`, kept in that one place.
- **💳 THE PAID STORE (live since 2026-08-22, proven with a real ₹499 UPI order the same night)**:
  our own form in `src/features/preorder/`, Razorpay live keys, Supabase orders, Resend receipts,
  ₹99 event tiers behind signed QR links. Laws §8.25 + §8.26; runbook `docs/store-go-live.md`;
  checkpoint `preorder-store-2026-08-22.md`. Do not re-test the payment path.
- **Milestone history, one line each (detail lives in `docs/checkpoints/` and
  `docs/checkpoints/closed-rounds.md`):** 2026-08-23 one-tap CTAs + free-text age + repo cleanup
  (`one-tap-and-cleanup-2026-08-23.md`) · 2026-07-31 the four-round day — V4 team feedback, V5
  design/UX, the Great Clearance, V6 growth-arc content (checkpoints `v4/v5/v6-*-2026-07-31.md`;
  specs `docs/revamp-2026-07/BUILD-V*.md`, laws §8.22–8.24) · 2026-07-28 LIVE at
  https://kheelona.com + repo-root move (`go-live-2026-07-28.md`, `repo-root-move-2026-07-28.md`) ·
  2026-07-25 theme-B revamp (`revamp-theme-b-2026-07-25.md`) · 2026-07-12 the `src/` atomic-design
  restructure + Storybook/Vitest (`production-restructure-2026-07-12.md`, standards in
  `docs/standards/`) · 2026-07-10/11 the R4–R11 rounds (R9 settled the Kheelu/Lumi brand law;
  checkpoints `r9/r10/r11-*.md`, laws §8.13–8.19) · 2026-07-06/08 the original 9-page build, the
  19-article journal, and the founder-generated art pipeline (`gemini-handoff/`, `tools/cutout/`).
  The pre-revamp Wix-era app is preserved at tag `pre-revamp-2026-07` with its URLs 301'd.
- **Working agreement**: work on `main`; `demo-website` is the Vercel preview branch
  (https://website-hdn2.vercel.app), synced by MERGING main into it, never force-push. Vercel and
  all external dashboards are the founder's.
- **Getting started (developers)**: `npm install && npm run dev`. **Node ≥ 24** — `.nvmrc` pins 24 and `AGENTS.md` and the standards both require it; this line said Node 18+ until 2026-08-23, which was simply wrong. Production: `npm run build && npm start` (the build runs the token gate first and fails hard without the v3 design system). Env: copy `.env.example` → `.env` (or `.env.local`, which Next loads at higher precedence — the store's six secrets are documented in `.env.example` and read in exactly one place, `src/lib/store/env.ts`; a missing one makes the store render an honest "opening shortly" state rather than crash). Local store URLs need a store hostname: `http://store.localhost:3456`. Deploy: Vercel, Root Directory = repo root.
- **Locked decisions**: tokens from `Design/Kheelona-Design-System-v3/tokens/kheelona.css` (THE design authority since 2026-08-23) mapped into `src/styles/globals.css` `@theme` (drift fails the build via `tools/tokens/check-tokens.mjs`, which also fails hard if the v3 CSS is missing); the pre-order is **paid, on our own form** in `src/features/preorder/` (the Tally embed and its adapter were retired on 2026-08-22); ₹ site-wide, from the paise integers in `src/config/site.ts`; accessibility 90+ outranks any styling preference.

## Project Structure
```
kheelona-com-website/
├── CLAUDE.md                              ← Session entry point (founder identity, gates, commands).
├── README.md                              ← This file. Resume protocol + status.
├── Technical-Todo.md                      ← THE open-items list (founder + engineering, tagged by owner).
├── FOUNDER-TODO.md                        ← A pointer to the two files above. Kept: 82 references name it.
├── security-review.md                     ← The open security engagement. Read at session start until sign-off.
├── website-builder-prompt-final-kheelona.md  ← Master build spec (Brand Bible, phases, sprints).
├── kheelona homepage website content.pdf  ← Highest source of truth (Home copy, verbatim).
├── .env                                   ← Gitignored. Six store secrets documented in .env.example; REAL
│                                             values live in Vercel (a local DUMMY .env renders the store's
│                                             honest "opening shortly" state instead of crashing).
├── Design/                                ← NOTE: capital D (spec says /design/, actual folder is Design/)
│   ├── Kheelona-Design-System-v3/         ← THE design authority (tokens/kheelona.css, fonts, logo SVGs,
│   │                                         guidelines incl. site-extensions.md). Old design-system/ deleted
│   │                                         2026-08-23; git history keeps it.
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
