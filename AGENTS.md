<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Structure & component standards

The website reset (2026-10-10) replaces the structure: the Architect writes it in Phase 4 at
`wiki/engineering/structure.md`, with catalogues beside it. Until then, the existing code still
follows `docs/standards/` (`src/`-based atomic design; every component ships a colocated Vitest
test). Node ≥ 24.
