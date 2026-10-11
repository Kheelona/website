---
paths:
  - "test/**"
  - "scripts/**"
---

# Tests and scripts

Source: wiki/engineering/structure.md §9 (Phase 4 plan, 2026-10-12).

- A guard must exit non-zero and must be proven red with a planted violation before it is trusted.
- Before deleting, moving or rewriting a file, grep test/ and src/**/*.test.* for its path and exported names; edit a test only if your task owns it (wiki/engineering/tasks.md, guard-test ownership).
- Never weaken a guard to make a task pass; a guard that contradicts approved copy goes to the main session.
- Stage new and deleted files before running guards that read the git index.
- Accepted exceptions (D041 white on Chilli; the named token exceptions) are classified narrowly and printed every run.
- A build step is one file in scripts/steps/<hook>/, owned by the task that writes its script.
