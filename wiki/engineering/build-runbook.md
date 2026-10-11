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
4. Remove the worktrees (and the tool's leftover `worktree-wf_*` branches, which sit at `main`'s old head and must never be pushed: `git branch -D worktree-wf_<run>-<n>`): `git worktree remove .claude/worktrees/wf_<run>-<n>` (add `--force` only if
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
| 0 (prep) | – | Done 2026-10-12: plan committed (`b2ea409`); dev tools pinned and **security patch next 16.3.8, sharp 0.35.5** (`1806937`); D051 (`8423f87`); runbook (`242126b`) |
| 1 | `wf_de7ff1a5-e8b` (base `1806937`), started 14:45 in the old account's session | Snapshot 2026-10-12 ~16:00 below. **The run may die with that session (account switch).** |
| 2 | – | Next: 2.1-2.10 (2.10 = beta never takes a payment, D051) |
| 3-10 | – | Per [tasks](tasks.md) |

### Wave 1 snapshot (~16:00, 2026-10-12)

| Task | Branch, head | State | What the new session does |
|---|---|---|---|
| 1.1 Toolchain, harness, guards | `build/w1-1.1` `200623d` + **26 uncommitted files** in `.claude/worktrees/wf_de7ff1a5-e8b-1` | Builder still working (first commit: configs, step runner, Vitest guards); not reviewed | If the run is dead: start a `builder` agent in that worktree to finish 1.1 from where the files are (commit the good work first, by name), then an adversarial review (same prompt shape as the workflow), fix, review |
| 1.2 Visual layer and motion | `build/w1-1.2` `7c8ebe8` (+1 uncommitted file) | Round-1 review failed on the motion guard; fix committed (`7c8ebe8`); re-review not yet run | Run the review on `7c8ebe8`; fix if needed |
| 1.3 Environments and beta | `build/w1-1.3` `db711ce` | **Passed** review round 1 | Merge. Minor: a www-only `/store/:path*` redirect beyond §9.4 (check) |
| 1.4 Tracking registries | `build/w1-1.4` `8578501` | **Passed** after two fixes | Merge |
| 1.5 Assets, icons, doodles, OG | `build/w1-1.5` `fe338c2` | **Passed** after one fix | Merge |
| 1.5b App screenshots | on `reset/website-v2` `6225df2` | **Done** | – |
| 1.6 Content contracts | `build/w1-1.6` `0d8bc4e` | **Passed** after one fix | Merge. Minor: `formatInr` wording vs the frozen helper (check before 2.1) |

**Resume order for a fresh session:** (1) `git worktree list` and the table above (re-check heads with
`git -C <worktree> log -1`); (2) finish 1.1 and re-review 1.2 in their worktrees (or, if this session's
run is still alive, wait for its notification); (3) merge per §2 in id order; (4) wave close; (5) wave 2
with `Workflow({name: "build-wave", args: {wave: 2, base: <merged head>, screens: false, tasks: [...]}})`,
task ids and titles from [tasks](tasks.md) "Wave 2" (2.1-2.10).

## 5. Wave 1 follow-ups for the main session

- **1.5b screenshots:** done (`6225df2`).
- **Review notes to carry:** 1.3 added a www-only `/store/:path*` redirect beyond architecture §9.4 (minor,
  check at merge); 1.6 noted `formatInr` in `site.ts` cannot produce "₹1,00,000" as the spec words it
  (minor, check the frozen helper's real output before 2.1).
- **`beta` exists on GitHub** (2026-10-12, `24e92e3` = main + `vercel.json` with `"beta": false`, so Vercel builds nothing). When the new site is ready: merge `reset/website-v2` into a local `beta` (no force), flip `"beta": true` per architecture §15.3, push with `git push origin beta:refs/heads/beta`.
- **Founder:** switch both beta domains from Production to **Preview, branch `beta`** in Vercel (they are
  attached to Production today and serve the live site with a noindex header). If Vercel needs the branch
  to exist, push a `beta` branch whose `vercel.json` sets `"beta": false` (builds nothing) first.
