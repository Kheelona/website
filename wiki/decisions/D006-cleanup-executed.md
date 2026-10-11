---
title: "D006: Phase 0 clean-up executed (423 tracked files, 238 MB)"
type: decision
updated: 2026-10-10
sources: [../legacy/cleanup.md, "git show --stat 9059894"]
---

# D006: Phase 0 clean-up executed

**Context.** Brief 2 ("Old work") and 7 step 6. The [clean-up list](../legacy/cleanup.md) gives the
evidence of non-use for every item.

**Choice.** Deleted every **DELETE-NOW** row, and nothing else, in commit `9059894`: 423 tracked
files, 238,013,167 bytes. That total matches the list's dry-run figure exactly. Paired edits went
in the same commit: the build script is now plain `next build` (its gate read the old DS),
`tsconfig.json` drops two excludes for deleted folders and keeps `launch-video` because its ignored
`node_modules/` is still on disk, and one stale comment in `src/lib/family.ts` was fixed. The five
local branches (four merged, plus the mid version held by its tag) were deleted.

**Not deleted, on purpose.** DELETE-WITH-REBUILD items (current pages still use them; they go in
Phase 5). KEEP items. FOUNDER items: untracked or ignored files are not in any tag
([Q5](../open-questions.md)), and remote items are outside the repo ([Q2](../open-questions.md)).

**Verified.** `npm run build` passes. 118 test files and 1,346 tests pass; the 126 test files at
the tag minus the 8 in the deleted 3D stage gives exactly 118. `tsc` is clean once the stale `.next/`
of the mid version is rebuilt.

**Approved by.** CTO, within the brief. **Date.** 2026-10-10.
