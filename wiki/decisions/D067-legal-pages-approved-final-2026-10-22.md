---
title: "D067: The founder approved the drafted legal pages (privacy, terms, refund, shipping) as final"
type: decision
updated: 2026-10-22
sources: ["founder's instruction in the redesign session, 2026-10-22", D029-grievance-officer-legal-review.md, "scripts/guards/placeholders.mjs (the production guard)"]
---

# D067: The legal pages are final

## Context

Under [D029](D029-grievance-officer-legal-review.md) the founder approves the privacy, terms, refund and shipping pages
himself, after the independent review. Until then each page was a draft: `status: "draft"` in
`src/content/en-IN/legal/{privacy,terms,refund,shipping}.ts`, a "Draft for the founder’s approval; not legal advice."
note above the hero (the Next template's `ks-draft`, and `legal-draft` in the redesign's `pages/*.html`), and the
production build stopped at prebuild step 30 (the placeholder guard, `scripts/guards/placeholders.mjs`, ADR-004).

## Options

1. Keep the drafts and the guard's refusal until a further review.
2. Approve the drafted versions as they stand, as final.

## Choice

**The founder approved the drafted legal pages as final, 2026-10-22.** The words do not change; the four documents are
`status: "approved"` (their "Last updated" stays the founder's date, 14 October 2026, D055 item 8), every draft note and
marker is gone from the Next modules, the redesign page sources, `redesign/tools/import-legal.py` and
`redesign/pages/_shell/facts.json`, and the production prebuild passes the legal guard.

## Why

Legal sign-off is given; the drafted versions are the ones the founder wants live.

**Approved by.** Founder. **Date.** 2026-10-22.
