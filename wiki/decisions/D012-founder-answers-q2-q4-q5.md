---
title: "D012: Remote leftovers closed, pitch deck removed, caches deleted"
type: decision
updated: 2026-10-10
sources: ["founder's answers to Q2, Q4 and Q5, 2026-10-10", ../open-questions.md, ../legacy/cleanup.md]
---

# D012: Founder answers to Q2, Q4 (part) and Q5, executed

**Q2, "go ahead".** PR #16 closed with a comment pointing to the archive tag. Remote branches
`redesign-mockup-2026-10`, `lumi-rabbit` and `security-hardening` deleted; `main` is now the only
remote branch. Both archive tags were confirmed on `origin` first. The mid version's 8 Vercel
previews are the founder's to delete in the dashboard.

**Q4, partly.** The founder read "the deck" as the investor pitch deck and said: never push it;
delete it from this folder. `pitch-deck/` (200 untracked files, 103 MB, not in git) was **moved to
the macOS Trash** as `~/.Trash/pitch-deck-kheelona-2026-10-10`. It is out of the project, and the
founder can still restore it until the Trash is emptied. The `.gitignore` line for `pitch-deck/`
stays as a guard. **The actual Q4 (SKM's source documents) is re-asked with clarity.**

**Q5, "go with your recommendation".**
- **Kept:** the photoshoot originals (the only copy; the founder should back them up), the old
  prompt files, and `.agents/`.
- **Deleted, about 840 MB of regenerable caches:** `.next/`, `storybook-static/`, `docs/snapshots/`,
  `tsconfig.tsbuildinfo`, `launch-video/node_modules/` (which leaves `launch-video/` gone), and the
  `tools/cutout/cutout` binary (rebuildable from its source at the archive tag).
- **Tidied:** the stale `tsconfig` exclude and four stale `.gitignore` lines. `tsc` is clean.
- `security-review.md` stays where it is. With D010 the wiki is public too, so moving it gains nothing.

**Approved by.** Founder. **Date.** 2026-10-10.
