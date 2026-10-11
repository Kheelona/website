---
title: "D008: Phase 0 pages cite legacy files at the archive tag"
type: decision
updated: 2026-10-10
sources: ["Phase 0 completeness critic, finding 2"]
---

# D008: Citation convention for legacy sources

**Context.** About 260 citations in Phase 0 pages point at `CLAUDE.md:<line>`, `Technical-Todo.md`
or `docs/checkpoints/*`. The schema rewrite and the clean-up change or delete those files, which
would leave every citation pointing at the wrong file or at nothing.

**Choice.** Every Phase 0 page carries `cites_at: archive/pre-reset-2026-10-10` in its front matter
and a line under its H1: a plain `path:line` citation refers to that tag, and `mid:path` refers to
`archive/mid-version-2026-10-10`. Read them with `git show <tag>:<path>`. Tags are immutable, so the
line numbers stay true. Later pages cite the commit or tag they read.

**Approved by.** CTO. **Date.** 2026-10-10.
