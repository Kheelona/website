---
title: "D004: wiki/ and design-system/ stay uncommitted until the founder rules on the public repo"
type: decision
updated: 2026-10-10
sources: ["gh repo view Kheelona/website --json visibility", ../raw/brief/kickoff-brief.md]
---

# D004: Internal material stays out of git for now

> **Superseded 2026-10-10 by [D010](D010-wiki-and-ds-committed-publicly.md):** the founder chose to commit both publicly.

**Context.** `Kheelona/website` is PUBLIC (checked 2026-10-10). Brief 4.8: if the repository is public, ask before committing the wiki or the design system. The wiki will hold SKM's positioning, PostHog aggregates, open legal and claims questions, and the DS is shared with other teams.

**Choice.** Until the founder answers [open question Q1](../open-questions.md), `/wiki/` and `/design-system/` are listed in `.gitignore` with a comment pointing here, so they cannot be staged by accident. Everything else on the branch (code, `CLAUDE.md`, `.claude/agents/`, `.claude/settings.json`, `scripts/`) is committed locally. **Nothing is pushed** except the two archive tags, which point at commits that were already public.

**Consequence.** The wiki lives only on this machine until Q1 is answered: no backup, and other machines and CI cannot read it.

**Approved by.** CTO, pending the founder. **Date.** 2026-10-10.
