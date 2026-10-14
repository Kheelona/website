---
title: "D059: The journal's voice rule, uploaded covers, and when the dashboard takes over"
type: decision
updated: 2026-10-14
sources: ["founder's answers in the build session, 2026-10-14, to the three questions of the journal design", ../engineering/journal-pipeline.md, ../engineering/adr/ADR-014-journal-from-the-dashboard.md, D057-journal-from-dashboard-and-three-wordings-2026-10-14.md, D040-films-move-to-new-site.md]
---

# D059: The journal's voice rule, uploaded covers, and when the dashboard takes over

## Context

The design for the journal from the admin dashboard ([ADR-014](../engineering/adr/ADR-014-journal-from-the-dashboard.md);
[journal pipeline](../engineering/journal-pipeline.md) §14) left three questions for the founder. Each answer below is
the founder's, with the option they picked.

## Choices

1. **The voice rule (Q1): the dashboard follows the design system.** The backend's publish check allows contractions
   and at most one "!" a post; the em-dash, link-label and bare-URL rules stay. The 20 guides keep their approved words.
   Aman's team changes the check (journal pipeline §13, B3).
2. **Uploaded covers (Q2): a DS photo first, the writer's upload as the fallback**, shown in the DS photo frame; the
   admin who publishes checks that any photo of a child has the parents' consent, as for the films (D040).
3. **Timing (Q3): after Gate B.** The site launches from the corrected 20 guides committed in the repo
   (`JOURNAL_SOURCE = "snapshot"`); Aman imports them into the dashboard right after; writers pause publishing from the
   Gate B merge until the flip to the API, a day or two.

## Why

The founder's own answers; each followed the recommendation offered.

**Approved by.** Founder. **Date.** 2026-10-14.
