---
title: "Build runbook: how each Phase 5 wave runs, merges and closes, and how to resume after a break"
type: runbook
updated: 2026-10-14
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

**After editing `build-wave.js`, launch it with `Workflow({ scriptPath: "<repo>/.claude/workflows/build-wave.js", args })`,
not `name: "build-wave"`:** the name resolves to the copy loaded when the session started (2026-10-14: run
`wf_ed84fddb-271` ran without the new copy stage, so the article tasks started as plain builders; stopped after
about 20 minutes, the shared-fix work saved as WIP commits, relaunched as `wf_242bc117-a1c`).

Per task it runs a pipeline: **builder** (agent type `builder`, `isolation: worktree`, creates branch
`build/w<wave>-<id>`, clones `node_modules` with `cp -cR`, commits by name, never pushes; **targeted checks
only**, [D052](../decisions/D052-qa-checkpoints.md)) → **review by risk** (each task's `risk` in the args:
`high` = adversarial review, fix, re-review, 2 reviews at most; `normal`, the default = one review, one fix for a
blocking finding, which the main session checks at the merge; `mechanical` = no review). The result carries
`status`: `passed`, `fixed-unreviewed` (check the fix at the merge), `not-reviewed` (check at the merge) or
`failed`. Until 2026-10-13 every task ran the full suites in build, review and each fix, with up to 3 reviews.
The result per task: worktree path, branch, head, commits, acceptance evidence, `final_pass`, every
review round. **Copy stage** (wave 5 part C, articles; since 2026-10-14 also other pages: `copy.prefix: ""` names
`wiki/site/pages/<slug>.md`, and `copy.noun`, `criteria`, `blocking`, `rules`, `rules_short`, `approved_note`,
`build_note` and `owns_note` replace the article wording in the prompts; articles keep the defaults): a task with `copy: { worktree_path, branch, groups }` first
runs one `copywriter` per group of slugs writing `wiki/site/pages/story-<slug>.md` in that worktree (the copywriter has
no shell, so the main session creates the worktree and branch from `base` and clones `node_modules` first), then the
`cmo-reviewer` (2 reviews at most, a copy fix after a failed one), then the builder commits the pages and builds in the
same worktree; the result adds `copy: { approved, cmo, open_questions, placeholders }`. Worktrees live in `.claude/worktrees/wf_<run>-<n>/` (excluded in `.git/info/exclude`;
never stage them).

## 2. After a wave's workflow completes (main session)

1. Read the result (or `journal.jsonl` in the run's transcript dir). Any task with `final_pass: false`:
   read its last review's blocking issues; fix in its worktree (a `builder` agent with the worktree path)
   or re-run that task alone with `tasks: [that one]`.
2. **Merge** each `build/w<wave>-<id>` into `reset/website-v2`, in task-id order, `git merge --no-ff`
   (no rebase, no force). Expected conflicts: only catalogue rows in `wiki/engineering/components.md` and
   `assets.md` (keep both sides' rows).
3. **Batch merge gate (D052):** on the merged branch run `npm run verify` and `npm run build` once. Read the
   diff of any `fixed-unreviewed` or `not-reviewed` task. Run it when no batch is building (parallel builders make
   whole-tree guards time out), or re-run timed-out files alone with `--testTimeout=120000` before calling them red;
   run `npm run build` first, so `.next/types` does not name a deleted route. Route any failure to the task that owns the failing file
   (fix agent), re-run until green. The full `npm run verify:e2e` runs only at the milestones: **M1** end of wave 5,
   **M2** end of wave 6, **M3** Gate B readiness.
4. Remove the worktrees (and the tool's leftover `worktree-wf_*` branches, which sit at `main`'s old head and must never be pushed: `git branch -D worktree-wf_<run>-<n>`): `git worktree remove .claude/worktrees/wf_<run>-<n>` (add `--force` only if
   it is locked by a finished run), then `git branch -d build/w<wave>-<id>` after the merge.
5. **Parity rows before the merge (lesson from M1, 2026-10-14):** a page task whose page differs from its mockup on
   purpose (a CMO fix, a proof-gated slot, an open placeholder) proves it in its unit tests, but the e2e text and
   visual parity specs only know a difference through `test/e2e/support/deviations.ts`, which only the main session
   edits. So at every merge, read each page task's report for such differences and add the rows (and the
   `wiki/qa/deviations.md` entry) in the reconciliation commit, then run that route's two parity specs. 5.7 and 5.8
   merged without rows in B1 and first went red at M1 (V7, V8).
6. Update [status](../status.md), [log](../log.md) and this page's §4; commit by name.
7. Start the next wave with `base` = the merged head.

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
| 2 | `wf_ab0be1f5-713` (19:45) died at the old account's usage limit; resumed as `wf_2317874f-e7d` (21:05, base `7eaa735`) | **Done 22:30, 2026-10-12.** All twelve tasks merged (`f0cb730` … `d87c71f`); wave close: verify green (234 files / 3581 tests), `next build` green, checksums intact; rulings and the ghost-button fix `610f141`; follow-ups 2.11-2.13 planned (tasks.md "Wave 2 close"); worktrees and branches removed |
| 3 | part 1: `wf_c0ea3e9b-90e` (2.11) and `wf_6e55e0c5-d28` (2.12, 2.13, 3.2, 3.4), base `610f141`, 22:35; both died at the apoorva@geekyants.work usage limit; resumed 23:20 on apoorva@kheelona.com as `wf_49e57754-05d` (2.11: **merged `91208de`**) and `wf_3a360d0e-7b7` (**all four passed; merged** 2.12 `3629d2e`, 2.13 `2a51371`, 3.2 `2a7cc40`, 3.4 `d7e0bea`; verify green, 4014 tests; worktrees removed). Part 2: `wf_8e83e0d9-f82` (3.1, 3.3; base `1f5ed78`): **both passed; merged** 3.1 `0632ed1`, 3.3 `28b4440`; verify and verify:e2e green (4277 tests; Playwright 208 passed); worktrees removed. Part 3: **3.5 alone in `wf_b4a2328e-81b`** (base `74fe47b`, 09:00, worktree `.claude/worktrees/wf_b4a2328e-81b-1`) | **3.5 merged `075144c`.** **Running: 3.6 and wave 4 (4.1-4.4) in `wf_431ed8e5-d4c`** (base `28386a1`, 09:50; worktrees `.claude/worktrees/wf_431ed8e5-d4c-{1..5}`). When it returns: merge per §2 in order 3.6, 4.1, 4.2, 4.3, 4.4; then the three main-session items in tasks.md "Wave 3 close" (STORY_SPECS `tabs`, the Tabs harness, the shells' GSTIN line); then switch `SiteShell` and `StoreShell`'s typed "GSTIN " lead to 4.3's `seller-lines` helper; then the close of waves 3 and 4 together. Close (verify, `verify:e2e`, checksums) after all of them merge. If a run dies: save each worktree's work as a WIP commit and resume with `stage: "finish"` (§3) |
| 4 | `wf_431ed8e5-d4c` (3.6, 4.1-4.4; base `28386a1`, 09:50) | **Done 11:55, 2026-10-13.** All five passed; merged 3.6 `4af95da`, 4.1 `056d48b`, 4.2 `fc0af71`, 4.3 `c093d2e`, 4.4 `c0633cd` with one-line import reconciliations; close commit `7867b93`; verify green (4570 tests); `verify:e2e` red only on the 21 new `/stories/*` routes (parity of the three approved articles until 5.6; perf-budget until 5.10 and the legacy pages go), ruled in tasks.md "Wave 4 close"; worktrees and branches removed |
| 5 | part A: `wf_08c09180-f5a` → paused → `wf_2de8d3c9-589` (two network outages, resumed from cache); B1 `wf_3b9a26ad-f78`; B2 `wf_97020885-57b` | **Part A merged 21:30, 2026-10-13** (`ef959af`; 4.5, 5.5, 5.6 passed; 5.1, 5.2, 5.3, 5.10 merged with only shared-file causes left, fixed by 4.6). **Part B1 merged** (`200bd17`: 4.6, 5.4, 5.7, 5.8, 5.9 passed first review; 5.11 `2485e47`, fix checked at the merge). **Part B2 merged 2026-10-14** (5.12-5.16 `eb47f13`; 5.13, 5.14, 5.16 passed; 5.12 and 5.15 fixed-unreviewed, tests-only fixes checked at the merge; reconciliation `5c5f20d`; merge gate green: build, verify 5349 tests; worktrees and branches removed). **Part C merged 2026-10-14** (`wf_242bc117-a1c`, base `aa4b39e`; the first launch `wf_ed84fddb-271` used the old script and was stopped, see §1): 4.7 `cf07677` and 4.8 `94d01dc` passed (high); 5.17 `c9155e1`, 5.18 `f7a31be`, 5.19 `b8af96b` fixed-unreviewed, fixes checked at the merge; the CMO approved all 18 copy pages. Conflicts: `deviations.ts` imports (4.8), `assets.md` photo rows (5.18, 5.19: one row per file). Reconciliation commit: rulings in [tasks](tasks.md) "4.9 and 5.20" (rewrite dates, `stub.ts` deleted, guard re-pins, plain close art, `/thanks` parity runs skipped per V5, `llms.txt` re-pinned, V6; `180da1c`). **M1 done 2026-10-14: wave 5 closed** (full
`verify:e2e` ruled: V7, V8, the motion test's locator, the JS budget re-based on Lighthouse; only the 404's own script
stays red, task 4.9; see the log). Next: 4.9, 5.20 and wave 6 |
| 6 | `wf_cd8260cf-e88` (base `25ccba5`, 2026-10-14); batch 6b next (6.4-6.7, base `bc645ea`) | **Batch 1 merged 2026-10-14** (4.9 `8ef6d2e`, 6.1 `3f92250`, 6.2 `32b7afb`, 5.20a `95ef53a`, 5.20b `55ebeaf`, 5.20c `83cdc9f`; reconciliation `cb55153`: V10, B11 not gated, Lighthouse harness block list; verify 347 files, 5892 tests; worktrees and branches removed). The founder answered every open question (D054, D055). **Batch 6b:** 6.4 (receipt and /thanks words, F12 answered), 6.5 (D053), 6.6 (team, /ideabaaz, CSP; copy stage on `team.md`), 6.7 (page facts; copy stage on the legal, setup and product pages) in `.claude/worktrees/w6b-6.6` and `w6b-6.7` on `build/w6-6.6` and `build/w6-6.7`. Then M2 |
| 7-10 | – | Per [tasks](tasks.md) |

### Wave 5 part A, paused (12:45, 2026-10-13)

Every task stopped in its builder stage; none has been reviewed. Worktrees `.claude/worktrees/wf_08c09180-f5a-<n>`.

| n | Task | Branch, head | State when paused |
|---|---|---|---|
| 1 | 4.5 Wave-4 follow-ups | `build/w5-4.5` `d3c7338` | 6 commits, items through 9 committed; clean tree |
| 2 | 5.1 Home | `build/w5-5.1` `d8a012f` | 1 commit (home as content through PageTemplate); clean tree |
| 3 | 5.2 Product | `build/w5-5.2` `9fcb5a0` | 3 commits + WIP `9fcb5a0`, which edits `eslint.config.mjs` and `test/guards/banned-phrases.data.ts` (outside 5.2's Owns: the review must accept or revert them) |
| 4 | 5.3 Safety | `build/w5-5.3` `53207d2` | 1 commit + WIP (page module and route) |
| 5 | 5.5 Stories hub | `build/w5-5.5` `b792504` | 2 commits; clean tree |
| 6 | 5.6 Three articles | `build/w5-5.6` `98f468b` | 2 commits + WIP, which edits `test/guards/answer-length.test.ts` (outside 5.6's Owns: the review must accept or revert it) |
| 7 | 5.10 404 | `build/w5-5.10` `3b592d5` | 2 commits; clean tree |

**To resume:** `Workflow({ name: "build-wave", args: { wave: 5, base: "3ab2cbb", screens: false, tasks: [...] } })`
with each task's `extra` from run `wf_08c09180-f5a` (its script file in the session folder holds the args) plus
`resume: { worktree_path, branch, head, stage: "finish" }` from this table, and a note that the builder was stopped
mid-task, so it first checks its own commits against the spec. Do not start part B before 4.5 is merged.

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