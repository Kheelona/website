---
title: "Build runbook: how each Phase 5 wave runs, merges and closes, and how to resume after a break"
type: runbook
updated: 2026-10-12
sources: [tasks.md, architecture.md, ../../.claude/workflows/build-wave.js, ../decisions/D051-beta-without-store-integrations.md, "workflow run wf_de7ff1a5-e8b (wave 1), journal under ~/.claude/projects/-Users-apoorvasahu-Documents-kheelona-com-website/a7840453-29e0-4cce-aaef-7d40bff98747/subagents/workflows/wf_de7ff1a5-e8b/"]
---

# Build runbook (Phase 5)

**Read this first when resuming the build** (after a context compaction, a new session or an account
switch). The plan is [tasks](tasks.md) (ten waves); this page is how the main session executes it.

## 1. The workflow: `build-wave`

Saved as a named workflow in [`.claude/workflows/build-wave.js`](../../.claude/workflows/build-wave.js)
(ultracode is on, so the main session runs every wave through it):

```
Workflow({ name: "build-wave", args: {
  wave: 2,                      // wave number (changes the verify instructions: wave 1 has no npm run verify yet)
  base: "<merged commit>",      // the commit every task branch must descend from
  screens: false,               // true only in wave 1 (the D044 app screenshots, task 1.5b)
  tasks: [ { id: "2.1", title: "Content model data", extra: "optional notes from the main session" }, ... ]
}})
```

Per task it runs a pipeline: **builder** (agent type `builder`, `isolation: worktree`, creates branch
`build/w<wave>-<id>`, clones `node_modules` with `cp -cR`, commits by name, never pushes) → **adversarial
review** against the task's acceptance criteria (no edits; checks ownership, DS checksums, verify, each
item independently) → if not passed, **fix** in the same worktree → review again (at most 3 reviews).
The result per task: worktree path, branch, head, commits, acceptance evidence, `final_pass`, every
review round. Worktrees live in `.claude/worktrees/wf_<run>-<n>/` (excluded in `.git/info/exclude`;
never stage them).

## 2. After a wave's workflow completes (main session)

1. Read the result (or `journal.jsonl` in the run's transcript dir). Any task with `final_pass: false`:
   read its last review's blocking issues; fix in its worktree (a `builder` agent with the worktree path)
   or re-run that task alone with `tasks: [that one]`.
2. **Merge** each `build/w<wave>-<id>` into `reset/website-v2`, in task-id order, `git merge --no-ff`
   (no rebase, no force). Expected conflicts: only catalogue rows in `wiki/engineering/components.md` and
   `assets.md` (keep both sides' rows).
3. **Wave close:** on the merged branch run `npm run verify` (from wave 3 also `npm run verify:e2e`) and
   `node scripts/ds-checksums.mjs`. Route any failure to the task that owns the failing file (fix agent),
   re-run until green.
4. Remove the worktrees: `git worktree remove .claude/worktrees/wf_<run>-<n>` (add `--force` only if
   it is locked by a finished run), then `git branch -d build/w<wave>-<id>` after the merge.
5. Update [status](../status.md), [log](../log.md) and this page's §4; commit by name.
6. Start the next wave with `base` = the merged head.

## 3. If the session breaks mid-wave

- Workflows run in the background and survive a context compaction; the notification arrives later.
- To see where a run stands: `git worktree list`, `git branch --list 'build/*'`, `git -C <worktree> log
  --oneline -5`, and the run's `journal.jsonl` (one `result` line per finished agent).
- If the run died: `Workflow({ scriptPath: "<session>/workflows/scripts/build-wave-<run>.js",
  resumeFromRunId: "<run>" })` replays finished agents from cache. From another session (different
  session folder), re-run `build-wave` with only the unfinished tasks; finished branches are on disk and
  merge as in §2.

## 4. Progress

| Wave | Run | State |
|---|---|---|
| 0 (prep) | – | Done 2026-10-12: plan committed (`b2ea409`); dev tools pinned and **security patch next 16.3.8, sharp 0.35.5** (`1806937`); D051 (`8423f87`) |
| 1 | `wf_de7ff1a5-e8b` (base `1806937`) | **Running** (15:30): 1.3 passed review round 1; 1.5 and 1.6 passed after one fix; 1.4 in its third review; 1.2 in fix round 1; 1.1 still building. Screens (1.5b): **done**, reviewed against D044 and committed (`6225df2`, all three in `src/assets/app/`) |
| 2 | – | Next: 2.1-2.10 (2.10 = beta never takes a payment, D051) |
| 3-10 | – | Per [tasks](tasks.md) |

## 5. Wave 1 follow-ups for the main session

- **1.5b screenshots:** done (`6225df2`).
- **Review notes to carry:** 1.3 added a www-only `/store/:path*` redirect beyond architecture §9.4 (minor,
  check at merge); 1.6 noted `formatInr` in `site.ts` cannot produce "₹1,00,000" as the spec words it
  (minor, check the frozen helper's real output before 2.1).
- **Founder:** switch both beta domains from Production to **Preview, branch `beta`** in Vercel (they are
  attached to Production today and serve the live site with a noindex header). If Vercel needs the branch
  to exist, push a `beta` branch whose `vercel.json` sets `"beta": false` (builds nothing) first.
