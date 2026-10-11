---
name: feedback-living-documentation
description: "Founder wants repo documentation kept current continuously during a round, not at the end, because session context can be compressed at any time"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7d272673-18e3-4a29-a0e8-71f60061f4e0
  modified: 2026-09-05T16:41:40.054Z
---

Keep the documentation up to date at all times during a round (founder, 2026-09-05, while approving the
SEO/AEO/GEO plan): the checkpoint, the handoff file, `Technical-Todo.md` and `docs/project-state.json`
are living documents, opened as commit 0 and updated in the SAME commit as each change they describe.

**Why:** the session context can be compressed at any moment; a round whose records are written only at
the end loses its state (and its reasoning) the moment that happens. A running record in the repo is
what lets the next context window, or the next session, resume without re-deriving anything.

**How to apply:** start every multi-commit round by writing the checkpoint with a "Running record"
section and the handoff skeleton, then append one dated line per commit (what changed, SHA, gate
results, what is next). Never plan a final "docs" commit as the only documentation step. Related:
[[feedback-founder-working-style]], [[feedback-never-git-add-all]].
