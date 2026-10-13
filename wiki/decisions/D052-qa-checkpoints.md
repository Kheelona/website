---
title: "D052: QA at checkpoints, not on every step (targeted checks per task, review depth by risk, full suites at merges and milestones)"
type: decision
updated: 2026-10-13
sources: ["founder's message in the build session, 2026-10-13: 'I am afraid we are doing over QA … let's figure out strategic steps after which we should do QA. Currently it feels we are retesting somethings multiple times.'", "founder's answers to the two options (same session): 'Checkpoints as proposed (Recommended)'; 'From the next batch (Recommended)'", ../../.claude/workflows/build-wave.js, ../engineering/build-runbook.md, ../engineering/tasks.md, ../qa/test-plan.md]
---

# D052: QA at checkpoints, not on every step

## Context

Through waves 1-5 every task ran the same checks several times: the builder ran the full unit suite (about
4,600 tests), lint, both typechecks, jscpd, a production build and its browser specs; the reviewer re-ran all
of it and proved every guard red on a planted violation; each fix round repeated both; the main session ran the
full suite again after each merge and the full browser suite (about 1,400 tests) at each wave close; waves 8
and 9 repeat everything again. With six or seven tasks in parallel the machine reached a load average of 17-18,
and whole-tree guards timed out (5000 ms), which reviewers then reported as red, adding rounds that tested
nothing new (wave 5 part A, run `wf_2de8d3c9-589`).

## Options put to the founder

1. **Checkpoints** (recommended): targeted checks per task, review depth by risk, the full unit suite once per
   batch merge, the full browser suite only at milestones, deep QA in wave 8 and beta.
2. Lighter still: one light review for every task, checkout included.
3. Only remove duplicates: keep today's review depth and rounds.

## Founder's ruling (2026-10-13)

"Checkpoints as proposed", applied **from the next batch** (wave 5 part A, already running, finishes under the
old rules).

## The checkpoints

| Checkpoint | Who | What runs |
|---|---|---|
| During a task | builder | `tsc` (both programs if `test/` changed), eslint on changed files, `vitest related` on changed files plus new tests, `test/guards`, DS checksums; `npm run build` only if the task touches routes, layouts, `src/app`, `next.config`, the CSS pipeline or `package.json`; a page task runs its own route's browser specs at 360, 390 and 1440 |
| Task review | reviewer | Reads the diff against each acceptance item, runs the task's targeted checks once (reusing the builder's build), proves red only guards the task added or changed. **Depth by risk:** `high` (checkout and store, tracking, shared guards and shared content, templates): adversarial, review, fix, re-review (2 reviews at most); `normal` (pages, articles, sections): one review, a blocking finding gets one fix that the main session checks at the merge, minor findings go to a follow-up list; `mechanical` (renames, comments, moved files): no reviewer, the main session checks at the merge |
| Batch merge | main session | `npm run verify` (full unit suite, lint, typechecks, jscpd, checksums) and `next build` on the merged tree, once per batch |
| Milestones | main session | The full `verify:e2e` (whole browser suite, every viewport) and the visual-parity sweep: **M1** end of wave 5 (all marketing pages), **M2** end of wave 6 (store pages, gated changes), **M3** Gate B readiness |
| Deep QA | QA agent, founder | Wave 8 (task 7.1: Lighthouse, the axe matrix, tracking-parity evidence, CMO pass) and wave 9 (beta QA, founder review) |

Dropped: reviewers re-running the full suites; the full browser suite at every wave close; re-proving every
guard on every task; third review rounds.

## What stays

Every guard still runs on every merged batch; every browser spec still runs at each milestone; the checkout's
contract, signature and freeze guards still run in `test/guards` on every task and merge; nothing reaches
production without the approver's explicit OK (Gate B).

## Approved by

The founder, 2026-10-13, in the build session.
