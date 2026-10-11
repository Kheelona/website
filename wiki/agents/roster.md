---
title: Agent roster and run history
type: agents
updated: 2026-10-10
sources: [../raw/brief/kickoff-brief.md, ../../.claude/agents/]
---

# Agent roster and run history

The main session is the orchestrator: only it starts agents, and every agent reports back to it.
Definitions live in `.claude/agents/<name>.md`; shared rules live in `CLAUDE.md` and the brief
(section 4 and the agent's own part of section 6), and the definitions point to them rather than
repeat them. Agents write only their own pages; the orchestrator owns
[open-questions](../open-questions.md), [decisions](../decisions/), [index](../index.md),
[log](../log.md) and [status](../status.md).

## Roster

| Agent | Definition | Phases | Output | Preloaded skills |
|---|---|---|---|---|
| PostHog Analyst | `.claude/agents/posthog-analyst.md` | 1, 8 | `research/posthog-audit.md`, `research/post-launch-*.md` | analytics, cro |
| Market Research | `.claude/agents/market-research.md` | 1 | `research/d2c-benchmarks.md` | competitor-profiling, cro, marketing-psychology |
| Search & AI Visibility | `.claude/agents/search-visibility.md` | 1, 5 | `research/keyword-map.md`, `qa/keyword-check-*.md` | ai-seo, schema, site-architecture, programmatic-seo |
| Copywriter | `.claude/agents/copywriter.md` | 3, 5 | `site/pages/*.md` | copywriting, copy-editing, product-marketing, marketing-psychology |
| Architect | `.claude/agents/architect.md` | 4 | `engineering/*`, `decisions/` | site-architecture, schema |
| QA | `.claude/agents/qa.md` | 1, 3, 4, 6, 8 | `qa/*` | none (uses tools directly) |
| Builder(s) | `.claude/agents/builder.md` | 5 | code | invokes superpowers TDD + verification via the Skill tool |
| CMO Reviewer | `.claude/agents/cmo-reviewer.md` | 3, 5, 7 | `qa/cmo-review-*.md` | cro, copy-editing, product-marketing, marketing-psychology |

Skills come from the project's marketing skill set (`.claude/skills/`, reinstallable from
`skills-lock.json`). The brief's examples `seo-audit`, `testing-strategy`, `accessibility-review`,
`design-critique`, `brand-review` and `deploy-checklist` are **not installed** here; the agents use
the brief's own checklists instead. Plugin-namespaced skills (`superpowers:*`) are not documented
as preloadable through the `skills` field, so the Builder invokes them with the Skill tool.
Source: Claude Code docs, sub-agents page (checked 2026-10-10).

## Run history

| When | Run | Agents | Result |
|---|---|---|---|
| 2026-10-10 17:40 | Phase 0 inventory workflow `wf_fee145da-3a0` | 9 one-off specialists (legacy-memory, legacy-laws, positioning, design-system, product, checkout, tracking, urls, cleanup) + a completeness critic. These ran before the roster existed, as generic agents with page-ownership rules. | 10/10 done in 50 min; 22 pages; 99 questions; critic: 28 findings (2 blockers) |
| 2026-10-10 18:37 | Phase 0 wiki fix pass `wf_9b4dc490-980` | 7 page-group owners + a lint verifier | 8/8 done in 17 min; 51 findings resolved; 803 links checked, 0 broken; 9 new questions merged into open-questions |
| 2026-10-10 19:06 | Phase 1 discovery `wf_f0e4e8b2-9ab` | posthog-analyst ×2, market-research ×4, search-visibility ×3, qa ×1, + critic | cut by the account session limit: 4 finished (PostHog audit + verifier, both search gatherers) |
| 2026-10-10 22:30 | Phase 1 completion `wf_08ea6a36-c38` | market-research ×4 (notes ×3 + synthesis), qa, search-visibility, posthog-analyst, brand fix, critic | 9/9 done (custom agent types fell back to general agents); critic: 0 blockers, 6 major, 9 minor |
| 2026-10-10 20:2x-00:2x | D013 classification + corrections; source verification `wf_dc801a61-c52`; Indian-law review `wf_49e24b92-a56` | classifiers, verifiers, copywriter, legal lenses | classification done; the last two running |
