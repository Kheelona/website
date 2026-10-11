<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Structure & component standards

Structure: `wiki/engineering/structure.md` (Phase 4, 2026-10-12); build plan: `wiki/engineering/tasks.md`.
Components ship a colocated Vitest test (and a story for `ui/` and `sections/`). Legacy code keeps
`docs/standards/` until task 6.3 deletes it. Node ≥ 24.
