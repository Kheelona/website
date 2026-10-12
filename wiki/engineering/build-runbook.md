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
| 1 | `wf_de7ff1a5-e8b` → `wf_20aaa1e8-c0f` → `wf_7ba453ba-6cb` | **Done 19:40, 2026-10-12.** All seven tasks merged (1.1 `b3fff53`, 1.2 follow-up `e8b56ce`); wave close `51b9b5f`: `npm run verify` green (143 files / 2143 tests, lint 0 errors, both typechecks, jscpd, checksums) and `next build` green; mapping exceptions `5c65999`; worktrees and branches removed |
| 2 | **`wf_ab0be1f5-713`** (19:45, base `7eaa735`) | **Running:** 2.1-2.10 plus the addenda 1.1b (harness minors) and 1.2b (font scan); 8 agents at a time (10 CPUs). If it dies: re-run `build-wave` with the unfinished tasks (args in the log entry of 19:45) |
| 3-10 | – | Per [tasks](tasks.md) |

### Wave 1 snapshot (18:50, 2026-10-12)

| Task | Branch, head | State | What the main session does next |
|---|---|---|---|
| 1.1 Toolchain, harness, guards | `build/w1-1.1-b` `11e792f` in `.claude/worktrees/wf_20aaa1e8-c0f-1` (descends from `e7da91c`; the old `build/w1-1.1` and worktree `wf_de7ff1a5-e8b-1` are superseded) | Run `wf_20aaa1e8-c0f`: three reviews, verify green, **round 3 failed** on 2 blocking guard gaps (no-off-token misses bracketed variants, the `!` suffix and `@apply`; no served-page check runs the no-reveal-on-money DOM rule) + 6 minor. Findings saved in the session scratchpad `r3-issues-1.1.json`. **Fix round running in `wf_7ba453ba-6cb`** with main-session approvals: `tsconfig.guards.json` (1.1 owns it), `postcss@8.5.23` pinned (phantom dependency of 1.2's guards), the perf-budget "shared" definition, KHEELONA_PLUS_LINE → 6.3 | Read the result; merge `build/w1-1.1-b` if it passes |
| 1.2 Visual layer and motion | `build/w1-1.2-b` `6078e4d` in `.claude/worktrees/wf_20aaa1e8-c0f-2` | **Passed round 3; MERGED** (`ab4868e`; assets.md conflict resolved by keeping both tasks' rows). Follow-up in `wf_7ba453ba-6cb`: Devanagari font subset to the text the site uses (110,588 B → a few KB; §12 budget) and `public/fonts/OFL.txt` | Merge the follow-up commits again (second `--no-ff` merge) |
| 1.3 | `build/w1-1.3` `db711ce` | MERGED (`d8e03db`). The www-only `/store/:path*` redirect accepted and recorded in architecture §9.4 | Done |
| 1.4 | `build/w1-1.4` `8578501` | MERGED (`cf73b8b`) | Done |
| 1.5 | `build/w1-1.5` `fe338c2` | MERGED (`33dff28`); RGBA icon fix `517a38e`; stale `path[pathLength]` comments fixed by the main session | Done |
| 1.5b | `6225df2` | Done | – |
| 1.6 | `build/w1-1.6` `0d8bc4e` | MERGED (`1e2168a`). `formatInr` note: the code is right (it takes paise); the spec example was wrong and is corrected in tasks.md | Done |

**Merged tree after 1.2 (`ab4868e`, 18:45):** tsc green, Vitest 135 files / 1957 tests green, DS checksums
intact (643), `next build` green.

**In parallel (main session):** an `architect` agent is writing `mockup-css-mapping.md`: every literal value in
the approved mockup CSS (about 189 off-token declarations found by 1.1's calibration: font weights and px
sizes, a 1200 px breakpoint, fixed widths, `--kh-ratio` in CSS, z-index 60, scale 1.32) mapped to a DS token
or class, or a narrow named exception for `token-exceptions.ts`. **Done 19:20 and accepted** ([mockup-css-mapping](mockup-css-mapping.md)):
**apply its §4 (nine `CSS_EXCEPTIONS`, the per-file `MEDIA_EXCEPTIONS` `content-max-1200` and the guard change of
§4.2) right after 1.1 merges and BEFORE wave 2**: tasks 2.2-2.5 already need them. Prove each new id red outside its
files and green inside; every existing plant stays red. Wave-2 builders read its §5.

**Resume order for a fresh session:** (1) `git worktree list`; re-check heads with `git -C <worktree> log -1`;
(2) if `wf_7ba453ba-6cb` died, re-run `build-wave` with the two resume entries (1.1 stage `finish` with the
round-3 findings; 1.2 stage `finish` with the font follow-up; args in the log entry of 18:40); (3) merge
`build/w1-1.1-b` and the 1.2 follow-up per §2; (4) wave close (`npm run verify`, `npm run build`, checksums);
(5) clean up worktrees and branches (including `build/w1-1.1`, `build/w1-1.2` and every `worktree-wf_*`);
(6) wave 2 with `Workflow({name: "build-wave", args: {wave: 2, base: <merged head>, screens: false, tasks: [...]}})`,
task ids and titles from [tasks](tasks.md) "Wave 2" (2.1-2.10).

## 5. Wave 1 follow-ups for the main session

- **1.5b screenshots:** done (`6225df2`).
- **Review notes:** both settled 2026-10-12 (1.3 redirect accepted, §9.4; 1.6 spec corrected).
- **1.2 review notes recorded:** architecture §4.1 (built-CSS order), §4.2 (the PostCSS literal-utility filter),
  §5.3 (bubble hover instant; hidden bar `inert`), §11.2-§11.3 (doodle selector, FAQ sign, the
  `data-scroll-behavior` hook), §12/§17 (Devanagari subset); tasks.md 2.3, 3.1, 6.3 and two guard-owner rows.
- **`beta` exists on GitHub** (2026-10-12, `24e92e3` = main + `vercel.json` with `"beta": false`, so Vercel builds nothing). When the new site is ready: merge `reset/website-v2` into a local `beta` (no force), flip `"beta": true` per architecture §15.3, push with `git push origin beta:refs/heads/beta`.
- **Beta domains done** (2026-10-12): both attached to branch `beta`, Valid Configuration; until the first `beta` deployment Vercel still serves the live site there (checked 16:25: 200, `x-robots-tag: noindex, nofollow`, no GA4 or Meta by host lists), harmless.