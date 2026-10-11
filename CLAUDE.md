# Kheelona.com — project schema
@wiki/status.md

## Every session
Read wiki/status.md (above) → wiki/index.md → the pages the task needs. Then act.
Recent history: `grep "^## \[" wiki/log.md | tail -20`
The standing brief is `wiki/raw/brief/kickoff-brief.md` (never edited). A later instruction from
the founder is recorded in `wiki/decisions/` and `wiki/log.md`, and the latest logged decision wins.

## Non-negotiables (full text: wiki/raw/brief/kickoff-brief.md, section 4)
- design-system/ is read-only and is the only source of visual decisions.
  Verify before every gate: `node scripts/ds-checksums.mjs`.
- Ages 3–7. No invented claims. Checkout logic unchanged.
- Tracking parity: every ID and event name stays exactly as it is (for example the Meta pixel
  `1051265191046395`). Inventory and parity checklist: wiki/site/tracking-inventory.md.
- Mobile-first: ~70% of visits are on phones.
- Build once, reuse: check the catalogues in wiki/engineering/ before creating anything.
- Everything in its place: wiki/engineering/structure.md.
- Nothing reaches production without the approver's explicit OK (Gate B).

## Hard rules for this repo (each one cost us once; detail in wiki/engineering/lessons.md)
- The GitHub repo is PUBLIC. Stage files by name: never `git add -A` or `git add .`.
  Never force-push or rewrite history. `wiki/` and `design-system/` stay out of git until the
  founder rules on it (wiki/decisions/D004).
- Vercel is the founder's: never run the Vercel CLI. `main` auto-deploys, so nothing is pushed
  to `main` before Gate B.
- Never run a bare `npm install`: name the package and pin it with `--save-exact`.
- Never place a real order or refund. The payment sandbox is `npm run qa:payment`.
- No secrets in the repo or the wiki; keep the existing env var names. The store's six secrets
  never take a `NEXT_PUBLIC_` name.
- Next.js 16 is not the Next.js in your training data: @AGENTS.md

## Wiki
Karpathy's "LLM Wiki" pattern; opens cleanly in Obsidian. Three layers: `wiki/raw/` (immutable
sources: read, never edit), the wiki pages (maintained by Claude), and this schema.

```
wiki/
  index.md            catalogue of every page: link + one-line summary, by category
  log.md              append-only history
  status.md           phase, last step, next step, blockers, waiting on the founder, due dates (≤ 40 lines)
  open-questions.md   everything waiting on SKM or the founder
  raw/                brief/, positioning/, legacy-memory/, posthog/, research/, feedback/, qa/
  brand/ product/ site/ engineering/ design-system/ research/ decisions/ agents/ qa/ legacy/
```

- **Page conventions.** YAML front matter (`title`, `type`, `updated`, `sources`); relative links;
  each fact on ONE page, other pages link to it; every claim cites its raw source or query.
- **Log entries.** `## [YYYY-MM-DD HH:MM] <type> | <summary>`, type ∈ ingest, decision, agent,
  build, qa, gate, deploy, lint, cleanup.
- **Ingest:** save to `raw/`, write or update its summary page, update every affected page,
  `index.md` and `log.md`. **Query:** answer from the wiki first; file answers worth keeping.
  **Lint** (end of every phase): contradictions, stale claims, orphans, missing links, open TODOs.
- **Decisions:** one file per decision in `wiki/decisions/D###-slug.md`: context, options,
  choice, why, approved by, date.
- Update `status.md` and `log.md` after every task, before and after handing work to an agent,
  and whenever the conversation gets long. Project facts never go in auto-memory or agent memory.

## Agents
Definitions: `.claude/agents/` · Roster and run history: `wiki/agents/`.
Only the main session starts agents, and every agent reports back to it. Agents write only their
own wiki pages; the main session owns `open-questions.md`, `decisions/`, `index.md`, `log.md` and
`status.md`.
