---
title: "D014: The reset branch is pushed as a backup, with Vercel builds switched off for it"
type: decision
updated: 2026-10-10
sources: ["founder's answer, 2026-10-10", "https://vercel.com/docs/project-configuration/git-configuration (git.deploymentEnabled, fetched 2026-10-10)", ../../vercel.json]
---

# D014: Branch pushed for backup; no Vercel previews

**Context.** All work lived only on this machine. The founder wants local review, not previews
([D011](D011-production-held-until-gate-b.md)), and Vercel builds every pushed branch by default.

**Choice (founder, 2026-10-10, option a).** `vercel.json` gets
`"git": { "deploymentEnabled": { "reset/*": false } }`. Vercel's docs: branches matched by this
minimatch pattern do not trigger a deployment on commit, and unlisted branches deploy as before.
Checked with minimatch itself: `reset/website-v2` matches and `main` does not. The test that reads
`vercel.json` (`test/store-secrets.test.ts`) still passes. Then `reset/website-v2` is pushed to
`origin`, which is public (wiki included, per [D010](D010-wiki-and-ds-committed-publicly.md)).

**Verify after pushing.** No new deployment appears for the branch (GitHub's deployments API for
the repo); production is unchanged. When the branch merges at Gate B, the rule is harmless to
`main` because it names only `reset/*`.

**Approved by.** Founder. **Date.** 2026-10-10.
