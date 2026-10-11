---
name: feedback-founder-working-style
description: How the founder wants big tasks run — plan first, consolidated questions, autonomous execution, screenshot-verified before any go-ahead
metadata:
  node_type: memory
  type: feedback
  originSessionId: 4e9c5c38-2812-4aba-b525-35791dfdb732
  modified: 2026-07-27T21:14:43.900Z
---

Working preferences [[user-apoorva-kheelona-founder]] confirmed during the 2026-07-07 visual-rework session:

- "You can run autonomously, but plan before you do anything. Ask me any questions you have." — they answer one consolidated batch of decision questions up front (AskUserQuestion with recommended defaults worked well; they picked every recommended option), then expect uninterrupted execution.
- **Never hand over without visual proof**: "visually inspect all pages via screenshot and fix any issues you find, before giving me go-ahead." Page-by-page screenshot walkthrough + fixing findings is part of done, not an extra.
- Brand boundaries for design work: palette/fonts/copy are locked (Brand Bible + PDF verbatim), but composition, depth, motion, and imagery are fully open to rework. Copy may be re-staged across sections if every sentence survives verbatim and in order (recorded in `docs/copy-reference.md`).
- Budget style: give them a cap and stop-point (e.g. "~400 Tripo credits, check in near the cap") rather than asking per-spend.

- **Human-in-the-loop for external AI tools** (added 2026-07-07 after the Gemini session): the founder runs ALL Gemini generation themselves from Claude-prepared kits (reference images + copy-paste prompts + quality checklist, pattern: `gemini-handoff/README.md`), results land in `~/Downloads` for Claude to ingest. Directive: "for anything to be generated in gemini, ask me, don't generate yourself" (now a CLAUDE.md hard gate). Browser automation against Gemini burned hours on Chrome download blocks and input freezes; the split (Claude prepares + integrates, founder generates) is faster and they like the control.

- **Vercel is theirs, not mine** (added 2026-07-28): "you don't have access to vercel, push it to github and wait." Do not invoke the Vercel CLI (`npx vercel whoami`/`login`/`link`) or try to read project settings — that tool call was rejected. The whole loop is: fix, verify locally, push to GitHub, then tell the founder the exact dashboard change if one is needed, and wait. Same shape as the Gemini gate above: Claude prepares, the founder operates the external service. Chrome is fine to use for verifying deployed pages, but it is not logged in to Vercel either.

**Why:** avoids blocking mid-run on questions they consider already delegated, while keeping the things they actually gate: brand truth, visual quality, external-AI generation runs, and the deploy/hosting account.

**How to apply:** front-load decisions into one question batch with recommendations; end every visual task with a full screenshot audit and explicit "go-ahead" framing; log sanctioned copy deviations in copy-reference.md; for Gemini (or similar) work, deliver a prompt kit and ask the founder to run it.
