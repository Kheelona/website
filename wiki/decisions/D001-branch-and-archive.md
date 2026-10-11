---
title: "D001: Branch from production; archive production and the mid version as tags"
type: decision
updated: 2026-10-10
sources: [../raw/brief/kickoff-brief.md, "git rev-parse main origin/main", "gh pr view 16"]
---

# D001: Branch from production; archive both states as tags

**Context.** Brief section 7, Phase 0 step 2: tag the current production state, then work on a branch. The checkout at kickoff was on `redesign-mockup-2026-10` (PR #16, the CMO merge), which was never deployed. `main` = `origin/main` = `77552ff`, and a push to `main` auto-deploys, so `main` is production.

**Options.** (a) Branch from `main`. (b) Branch from the mid version and keep its work.

**Choice.** (a). Tags, both pushed to `origin`:
- `archive/pre-reset-2026-10-10` = `77552ff` (production).
- `archive/mid-version-2026-10-10` = `50827d1` (the mid version, so nothing is lost when it is deleted).

Working branch: `reset/website-v2`, created from `main`.

**Why.** The brief makes the reset a complete rebuild of positioning, content and design, and lists the mid version for archive and deletion. Its useful knowledge (founder rulings on claims, shared content sources) is read from the tag into the wiki rather than inherited as code.

**Approved by.** CTO, within the brief. **Date.** 2026-10-10.
