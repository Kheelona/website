---
title: "D007: The new CLAUDE.md names the live Meta pixel id, keeping the doc-versus-code guard"
type: decision
updated: 2026-10-10
sources: ["archive/pre-reset-2026-10-10:test/meta-pixel-id.test.ts", ../../CLAUDE.md]
---

# D007: CLAUDE.md keeps the live pixel id

**Context.** `test/meta-pixel-id.test.ts` fails unless `CLAUDE.md` names the live pixel id and no
stale one. It exists because a pixel migration once changed the id with nothing failing. Rewriting
`CLAUDE.md` as the short schema would have broken it.

**Options.** (a) Weaken the test. (b) Name the id once in the schema's tracking-parity line.

**Choice.** (b). The id now appears in the non-negotiable "Tracking parity: every ID and event
name stays exactly as it is", which is a useful reminder in its own right. The guard stays intact
until the Architect replaces it with the tracking module's registry test (Phase 4). The inventory
itself lives on [tracking inventory](../site/tracking-inventory.md).

**Approved by.** CTO. **Date.** 2026-10-10.
