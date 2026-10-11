---
title: "D005: Design-system integrity: checksum script, manifest and deny rules"
type: decision
updated: 2026-10-10
sources: [../../scripts/ds-checksums.mjs, ../design-system/manifest.md, ../../.claude/settings.json]
---

# D005: DS integrity tooling

**Context.** Brief 4.1: record a SHA-256 manifest, deny edits, and have QA re-verify before every gate, "since shell commands can still change files".

**Choice.**
- `scripts/ds-checksums.mjs`: verifies by default (fails on any changed, missing or ADDED file, and refuses an empty manifest); `--write` regenerates, only when a new DS version is delivered (log it).
- Manifest: [`design-system/manifest.md`](../design-system/manifest.md), 643 lines in `shasum -a 256` format, cross-checked against an independent `shasum` run.
- **Control:** tampering one byte in a COPY made the check fail with `changed README.md`, exit 1.
- `.claude/settings.json` denies **`Edit(/design-system/**)`**, anchored at the project root.
  **Revised the same day, twice, on evidence.** (1) Claude Code's permissions docs say `Edit` rules
  cover every built-in file-editing tool, and a `Write(...)` path rule "is accepted but never
  consulted" and warns at startup, so it was removed. (2) The brief's literal unanchored form
  `Edit(design-system/**)` also matched **`wiki/design-system/`** and stopped the design-system agent
  writing its pages, which the brief itself requires. The anchored form protects exactly the DS.
  **Controls:** an edit attempt on `design-system/README.md` is refused ("denied by your permission
  settings"); the same attempt on `wiki/design-system/gaps.md` reaches the file.
- The script sits in `scripts/` per brief 9.12. The repo's existing `tools/` (QA harness, cutout) stays until the Architect settles the structure in Phase 4.

**Approved by.** CTO, within the brief. **Date.** 2026-10-10.
