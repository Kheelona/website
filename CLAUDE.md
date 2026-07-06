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
- **Voice-lint**: zero em-dashes (en-dash only inside number ranges), no hype, rarely lead with "AI", exact names (PlayOS, Lumi, Lori, Lua, Robu, Kheelona Magic Box), second person present tense.
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
- `docs/stories-image-prompts.md` — ready prompts for the 7 journal articles still missing hero images
- `docs/checkpoints/` — per-phase snapshots
- `design-concepts/README.md` — 3 archived concepts, mascot cutout pipeline, Tripo3D 2D→3D pipeline, engineering gotchas (overflow-x clip, scroll-snap wheel trap)
- `site/AGENTS.md` — Next.js 16 breaking-changes warning (read `node_modules/next/dist/docs/` before writing Next code)
