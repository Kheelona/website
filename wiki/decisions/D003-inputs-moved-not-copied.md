---
title: "D003: Inputs moved, not copied, into wiki/raw and design-system/"
type: decision
updated: 2026-10-10
sources: [../raw/brief/kickoff-brief.md]
---

# D003: Inputs moved, not copied

**Context.** The brief wants the brief, the positioning docs and the DS saved in fixed places, and forbids duplicate files (section 4.10).

**Choice.** Each input was MOVED with `mv` and verified byte-identical by SHA-256 before and after:
- `KICKOFF.md` → [`raw/brief/kickoff-brief.md`](../raw/brief/kickoff-brief.md)
- `Kheelona Positioning (1).pdf`, `Kheelona Positioning Strategy.docx` → `raw/positioning/`
- `Kheelona-Design-System-v-Oct-26/` → `design-system/` (only the top folder was renamed; all 643 files identical). It arrived as a folder, not a zip, and is treated as the delivered DS.

**Why.** One copy of everything; the raw layer is never edited.

**Approved by.** CTO, within the brief. **Date.** 2026-10-10.
