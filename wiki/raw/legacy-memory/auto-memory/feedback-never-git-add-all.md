---
name: feedback-never-git-add-all
description: "Never `git add -A` in this repo — it leaked the founder's investor deck to a PUBLIC GitHub repo on 2026-09-06"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c18a33df-85f4-4428-ba52-64ddb36817ff
  modified: 2026-09-05T14:59:57.721Z
---

**Stage files by name. Never `git add -A` / `git add .` in
`~/Documents/kheelona-com-website`.**

On 2026-09-06 I ran `git add -A` and swept in `pitch-deck/` — 197 files, 103MB of the founder's
pre-seed investor deck, financial model, assumptions, speaker notes and tough-questions doc. It was
pushed to **`github.com/Kheelona/website`, which is PUBLIC**, and sat there about ten minutes.

**Why:** the session's own opening `git status` showed `pitch-deck/` as untracked and I used `-A`
anyway. This repo routinely has untracked founder work in the tree that is NOT meant for a public
repo, and there is no `.gitignore` entry until someone adds one.

**How to apply:**
- Stage explicitly: `git add src/ test/ docs/ package.json` — or `git add -u` for tracked files only.
- Before ANY commit, read `git status --short` and account for every `??` line. An untracked
  directory you did not create is a stop, not a thing to sweep in.
- `git commit -a` has the same problem for tracked files; it is safer but still not a substitute for
  looking.
- **This repo is public.** Check `gh repo view --json isPrivate` before assuming otherwise; I had
  assumed it was private.

**The recovery, if it happens again:** branch a safety ref FIRST
(`git branch backup-x <head>`), then `git filter-branch --index-filter 'git rm -r --cached
--ignore-unmatch <path>' -- <base>..HEAD`, add the path to `.gitignore`, `git push
--force-with-lease`. **`filter-branch` checks out the rewritten HEAD, so it DELETES the files from
the working tree** — that is why the safety branch matters; restore with `git checkout backup-x --
<path>` then `git rm -r --cached <path>`, and verify byte-for-byte with `git cat-file blob` + `cmp`
before deleting the safety branch.

**What a force-push does NOT fix:** GitHub keeps unreachable objects addressable by commit SHA until
it garbage-collects. Only GitHub Support can purge them. Give the founder the exact SHAs.

Related: [[feedback-founder-working-style]], [[project-kheelona-com-build-prompt]]
