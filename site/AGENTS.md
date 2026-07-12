<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Structure & component standards (BINDING)

App code is `src/`-based atomic design. Before writing or moving any code, follow
`../docs/standards/` (`PROJECT_STRUCTURE.md`, `COMPONENT_GUIDELINES.md`, `STRUCTURE-MAP.md`)
and the "Production structure & standards" section in the root `CLAUDE.md`. Every component
ships a colocated Storybook story + Vitest test; Storybook/Vitest are dev-only. Node ≥ 24.
