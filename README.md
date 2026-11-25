# kheelona.com

> The consumer home of Kheelona and its toy, Khelu: the site kheelona.com and the pre-order store
> store.kheelona.com, both served by this one Next.js app and deployed from `main` on Vercel (a merge to
> `main` is live). The offer and its prices are on one page: [wiki/product/pricing.md](wiki/product/pricing.md).

## For AI: How to Resume This Project

> **Rewritten 2026-11-25.** Until then this README described the site before the October 2026 reset (the
> store launch of August and the rounds up to 20 September), and pointed at files that are gone
> (`docs/project-state.json`, `docs/checkpoints/`, `docs/standards/`, `FOUNDER-TODO.md`, `Design/`). That
> version is kept at tag `archive/pre-reset-2026-10-10`. The protocol below is the one in `CLAUDE.md`.

### Step 1: Read CLAUDE.md and the status
`CLAUDE.md` holds the repo's non-negotiables, hard rules and hosting; it imports
[wiki/status.md](wiki/status.md), which says where the work stands and what waits on the founder.

### Step 2: Load context
[wiki/index.md](wiki/index.md) lists every wiki page with one line each; then read the pages the task needs.
Recent history: `grep "^## \[" wiki/log.md | tail -20`. Founder decisions are in `wiki/decisions/` (the
latest logged decision wins); open items are in [wiki/open-questions.md](wiki/open-questions.md).

### Step 3: Confirm with the user
Say where the project stands and what is next. Do not re-ask what a decision in `wiki/decisions/` or a
BINDS row of [wiki/legacy/settled-decisions.md](wiki/legacy/settled-decisions.md) already settles.

## Current Status
Kept in one place: [wiki/status.md](wiki/status.md).

## Project Structure
Folders, naming and the mockup-to-route map: [wiki/engineering/structure.md](wiki/engineering/structure.md),
with its catalogues in `wiki/engineering/`.

## Operating Rules
The non-negotiables and the hard rules in `CLAUDE.md` (the repo is public: stage files by name; a merge to
`main` deploys). Node 24 (`.nvmrc`). Before a pull request: `npm run verify` (lint, typecheck, tests, jscpd,
design-system checksums).
