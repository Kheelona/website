export const meta = {
  name: 'build-wave',
  description: 'Phase 5: build one wave of tasks in parallel git worktrees, adversarially review each against its acceptance criteria, fix and re-review',
  phases: [{ title: 'Build' }, { title: 'Review' }, { title: 'Fix' }, { title: 'Screens' }],
}

const REPO = '/Users/apoorvasahu/Documents/kheelona-com-website'
const W = args.wave
const BASE = args.base

const BUILD = {
  type: 'object',
  properties: {
    task: { type: 'string' },
    worktree_path: { type: 'string' },
    branch: { type: 'string' },
    head: { type: 'string' },
    commits: { type: 'array', items: { type: 'string' } },
    files_changed: { type: 'array', items: { type: 'string' } },
    verify: { type: 'string', description: 'commands run and the tail of their output' },
    acceptance: { type: 'array', items: { type: 'object', properties: { item: { type: 'string' }, status: { type: 'string', enum: ['done', 'partial', 'not-done'] }, evidence: { type: 'string' } }, required: ['item', 'status', 'evidence'] } },
    catalogue_rows: { type: 'array', items: { type: 'string' } },
    blocked: { type: 'array', items: { type: 'string' }, description: 'anything that needs the main session or the founder' },
    notes: { type: 'string' },
  },
  required: ['task', 'worktree_path', 'branch', 'head', 'commits', 'files_changed', 'verify', 'acceptance', 'blocked'],
}
const REVIEW = {
  type: 'object',
  properties: {
    pass: { type: 'boolean' },
    verify_green: { type: 'boolean' },
    ownership_ok: { type: 'boolean' },
    issues: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['blocking', 'minor'] }, item: { type: 'string' }, detail: { type: 'string' }, fix: { type: 'string' } }, required: ['severity', 'item', 'detail', 'fix'] } },
    summary: { type: 'string' },
  },
  required: ['pass', 'verify_green', 'ownership_ok', 'issues', 'summary'],
}

const VERIFY_NOTE = W === 1
  ? `Wave 1 tasks run in parallel, so the other wave-1 tasks' files are NOT in your tree, and \`npm run verify\` exists only once task 1.1 lands. Task 1.1 creates it and must run it; every other wave-1 task runs the equivalent itself: \`npx tsc --noEmit\`, \`npx vitest run\` (whole suite), \`npx eslint <every file you changed>\`, \`node scripts/ds-checksums.mjs\`. Also run \`npm run build\` (the full Next production build; unit tests do not catch Turbopack failures). Your work must be green on its own tree.`
  : `Run \`npm run verify\` and \`npm run build\` (the full Next production build: unit tests do not catch Turbopack failures) green on your own tree${W >= 3 ? ', and the e2e specs your task owns (`npx playwright test <spec>`)' : ''}.`

function buildPrompt(t) {
  return `You are building task ${t.id} of Phase 5 wave ${W} on the Kheelona.com website: "${t.title}".

The spec is the section "### ${t.id}" of ${REPO}/wiki/engineering/tasks.md. Read it in full, plus that file's sections "How to read a task", "Standard component acceptance", "Standard page acceptance" (where relevant) and "Guard-test ownership", then every input the task lists (architecture.md and structure.md sections, ADRs, decisions, mockup files). Paths in the wiki are relative to the repo root.

SETUP: you run in an isolated git worktree of ${REPO}.
1. Run \`pwd\` and \`git log -1 --oneline\`; then \`git switch -c build/w${W}-${t.id}\` (if a branch with that name exists, use \`build/w${W}-${t.id}-b\`). Confirm \`git merge-base --is-ancestor ${BASE} HEAD\` succeeds.
2. node_modules: \`cp -cR ${REPO}/node_modules ./node_modules\` (an APFS clone, fast). Never run npm install: the main session already installed every dev tool the plan names (Playwright 1.63.0 with its Chromium headless shell, @axe-core/playwright 4.12.1, axe-core 4.12.1, lighthouse 13.4.1, jscpd 5.3.2, sharp 0.35.5 (not 0.35.4: security patch), subset-font 2.9.0, next 16.3.8). If you truly need another package, stop and list it under blocked.
3. If your task runs the payment sandbox, copy ${REPO}/.env.local into your worktree (it is gitignored: never stage it, never print its values).
4. Local-only files exist only in the main checkout and are never committed: ${REPO}/mockup/_work/** (for example the motion reference ${REPO}/mockup/_work/motion/motion.css and motion.js). Read them by absolute path; never copy them into your tree.

RULES: change only the files your task Owns (and catalogue rows marked with your task id in wiki/engineering/components.md or assets.md). Follow the test-file rule before deleting or rewriting anything. Stage files BY NAME (never \`git add -A\` or \`git add .\`), commit on your branch with clear messages ending with the line:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Never push, never merge, never touch main, never run the Vercel CLI, never edit design-system/, never place a real order. Next.js 16.3.8 differs from your training data: read node_modules/next/dist/docs/ for any Next API you use.

VERIFY: ${VERIFY_NOTE} Prove every guard you write red with a planted violation, then restore it.
${t.extra ? `\nNOTES FROM THE MAIN SESSION FOR THIS TASK:\n${t.extra}\n` : ''}
Return the structured report: worktree path, branch, head commit, commits, files changed, the verify commands with the tail of their output, every acceptance item with status and evidence, catalogue rows touched, and anything blocked.`
}

function reviewPrompt(t, b, round) {
  return `Adversarial review (round ${round}) of Phase 5 task ${t.id} ("${t.title}") on the Kheelona.com website. Your job is to find what is wrong or missing, not to approve. Do NOT edit, create, stage or commit files in the worktree (scratch files only under /private/tmp/claude-501/ and deleted afterwards; if you plant a violation to prove a guard red, restore it with \`git checkout -- <file>\` and confirm \`git status\` is clean at the end).

Worktree: ${b.worktree_path} (branch ${b.branch}, head ${b.head}); base commit ${BASE}. cd there first.
Spec: section "### ${t.id}" of ${REPO}/wiki/engineering/tasks.md, with "How to read a task", the standard acceptance lists and "Guard-test ownership"; the architecture.md and ADR sections it cites.
The builder's report: ${JSON.stringify({ acceptance: b.acceptance, verify: b.verify, blocked: b.blocked, notes: b.notes }).slice(0, 6000)}

Check, with evidence for each:
1. Ownership: \`git diff --name-only ${BASE}..HEAD\` lists only files the task Owns (plus its catalogue rows). Nothing under design-system/ changed; \`node scripts/ds-checksums.mjs\` passes; no .env file, secret, real name or phone number from the app demo is staged; no mockup/_work file committed.
2. Every acceptance item, independently: run the tests, read the code, re-derive numbers, prove guards red on a planted violation. Do not trust the builder's evidence.
3. Verify: ${VERIFY_NOTE}
4. Quality: matches the approved mockup and the plan; DS tokens only; no copy, price or URL typed in components; tracking IDs and event names unchanged; checkout logic unchanged; correct for Next.js 16.3.8 (node_modules/next/dist/docs/); no test weakened; nothing that will break a later wave's owned file.
pass = true only if there is no blocking issue and verify is green. Each issue: severity, the acceptance item, what is wrong (file:line), and the exact fix.`
}

function fixPrompt(t, b, review) {
  return `Fix the review findings on Phase 5 task ${t.id} ("${t.title}") of the Kheelona.com website. Work in the existing worktree ${b.worktree_path} on branch ${b.branch} (cd there; do not create another worktree; node_modules is already present). The spec is section "### ${t.id}" of ${REPO}/wiki/engineering/tasks.md.

Findings to fix (all blocking ones; minor ones too unless a fix would leave your Owns list):
${JSON.stringify(review.issues, null, 1).slice(0, 12000)}

Same rules as the build: only your Owns files, stage by name, commit with the trailer line Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>, never push or merge, never edit design-system/. ${VERIFY_NOTE}
If a finding is wrong, say why in notes with evidence instead of changing code. Return the full structured report again (all acceptance items, current head).`
}

function finishPrompt(t) {
  return `Finish Phase 5 task ${t.id} ("${t.title}") of the Kheelona.com website. An earlier builder started it and was stopped part-way. Work in the existing worktree ${t.resume.worktree_path} on branch ${t.resume.branch} (cd there first; do not create another worktree; node_modules is already present). Read what is already committed there (\`git log --oneline ${BASE}..HEAD\`, \`git diff --stat ${BASE}..HEAD\`; the last commit may be an unverified work-in-progress snapshot) before writing anything, keep what is right, fix what is not, and complete every acceptance item of section "### ${t.id}" of ${REPO}/wiki/engineering/tasks.md (with "How to read a task", the standard acceptance lists and "Guard-test ownership").
${t.extra ? `\nNOTES FROM THE MAIN SESSION:\n${t.extra}\n` : ''}
Same rules as any build task: only your Owns files, stage by name, commit with the trailer line Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>, never push or merge, never edit design-system/, never run npm install unless the task owns package.json and the main session approved the package. ${VERIFY_NOTE} Prove every guard you write red with a planted violation, then restore it.
Return the full structured report (all acceptance items, current head).`
}

async function runTask(t) {
  let b
  if (t.resume && t.resume.stage === 'review') {
    b = { task: t.id, worktree_path: t.resume.worktree_path, branch: t.resume.branch, head: t.resume.head || 'HEAD', commits: [], files_changed: [], verify: 'not recorded (resumed at review)', acceptance: [], blocked: [], notes: 'Resumed at review after the run was held; read the code and the commits instead of a builder report.' }
  } else if (t.resume) {
    b = await agent(finishPrompt(t), { label: `finish:${t.id}`, phase: 'Build', schema: BUILD, agentType: 'builder' })
    if (b) b = { ...b, worktree_path: t.resume.worktree_path, branch: t.resume.branch }
  } else {
    b = await agent(buildPrompt(t), { label: `build:${t.id}`, phase: 'Build', schema: BUILD, agentType: 'builder', isolation: 'worktree' })
  }
  if (!b) return { task: t.id, error: 'builder returned nothing' }
  const rounds = []
  for (let round = 1; round <= 3; round++) {
    const r = await agent(reviewPrompt(t, b, round), { label: `review:${t.id}#${round}`, phase: 'Review', schema: REVIEW })
    if (!r) { rounds.push({ round, error: 'review returned nothing' }); break }
    rounds.push({ round, pass: r.pass, verify_green: r.verify_green, ownership_ok: r.ownership_ok, issues: r.issues, summary: r.summary })
    if (r.pass || round === 3) break
    const f = await agent(fixPrompt(t, b, r), { label: `fix:${t.id}#${round}`, phase: 'Fix', schema: BUILD, agentType: 'builder' })
    if (f) b = { ...b, ...f, worktree_path: b.worktree_path, branch: b.branch }
  }
  const last = rounds[rounds.length - 1] || {}
  return { task: t.id, title: t.title, worktree_path: b.worktree_path, branch: b.branch, head: b.head, commits: b.commits, files_changed: b.files_changed, acceptance: b.acceptance, blocked: b.blocked, notes: b.notes, catalogue_rows: b.catalogue_rows, final_pass: !!last.pass, rounds }
}

const SHOT_COMMON = `Round 2 edits to a REAL Kheelona parent-app screenshot (576 wide) for the website. Read ${REPO}/wiki/decisions/D044-app-screens-on-the-site.md and D046 first (the founder's rulings). The round-1 masters are ${REPO}/mockup/_work/appshots/edited/<name>.png (already redacted: the child is "Aarav", the toy is "Kheelu", recorder icon and Android nav bar removed); source frames are in ${REPO}/mockup/_work/appshots/frames/ (t*.png) and you may extract more with ffmpeg from ${REPO}/mobileapp-live-demo-oct2026.mp4 into ${REPO}/mockup/_work/appshots/frames/ (never copy, commit or upload that video; it shows a real family and the founder's inbox). The round-1 scripts and font fitting are in ${REPO}/mockup/_work/appshots/work/ (build.py, fit.py, build_privacy_r2.py): reuse them. Fonts: Instrument Sans (ls ~/Library/Fonts /Library/Fonts | grep -i instrument); Devanagari: /System/Library/Fonts/Kohinoor.ttc (Kohinoor Devanagari), matched to the app's Devanagari weight and size. Edit cleanly: sample backgrounds, keep shapes and spacing, prefer moving the app's own pixels over drawing, draw new text fitted to size, weight, colour and softness, iterate by reading zoomed crops until a careful viewer cannot tell. Final canvas 576 x 1209. Overwrite ${REPO}/mockup/_work/appshots/edited/<name>.png and ${REPO}/mockup/assets/app/<name>.webp (WebP q90, no upscaling). Do not stage or commit anything. Return paths, final size and every edit.`
const SHOTS = [
  { name: 'app-transcript', spec: `(1) Kheelu's first bubble becomes "Kheelu remembers! Hello, Aarav. Ready to hop for bubbles again?" (the original line minus "Oh", names fixed; the bubble may grow back to 3 lines like the original: shift the content below accordingly and rebuild the bottom of the list from other frames if needed so nothing is cut oddly); (2) REMOVE the purple AI summary card ("What Aarav explored: ...") entirely and close the gap so the date line flows into the first "Kheelu" label with the app's normal spacing; (3) the app bar: the back label "‹ Activity" stays at the left and the chat title becomes "हिंदी में बातें", set so it does NOT overlap the back label (after a normal gap, same bold weight as the original title, or centred if it fits better; match the original app bar's look); keep the share, heart and delete bar; keep everything else from round 1.` },
  { name: 'app-activity', spec: `(1) REMOVE "Games": the legend becomes just "● Questions  ● Stories" (natural spacing) and the bar has two parts only (Questions orange about 65%, Stories purple about 35%), no green; (2) stats: keep "22 min Talking" and "9 Questions asked"; set Chats to "3" so it matches the three cards; (3) the three chat cards use the app's real preview format (child's words in quotes after the name, then the toy's name with NO colon, then its words): card 1 title "Why does the moon follow our car?" 7:42 PM, preview: Aarav: "why does the moon follow our car?" Kheelu The moon is very, very far away. So when the…; card 2 title "हिंदी में बातें" (same as the transcript screen's title) 5:26 PM, preview: Aarav: "to say hello" Kheelu My name is Kheelu. Kheelu! What is your n…; card 3 title "Three bricks and two more" 4:10 PM, preview: Aarav: "I have three bricks and two more" Kheelu How many is that altogether?…; truncate with an ellipsis at two lines like the app.` },
]
const SHOT_R = { type: 'object', properties: { webp: { type: 'string' }, width: { type: 'number' }, height: { type: 'number' }, edits: { type: 'array', items: { type: 'string' } } }, required: ['webp', 'width', 'height', 'edits'] }
const SHOT_V = { type: 'object', properties: { pass: { type: 'boolean' }, issues: { type: 'array', items: { type: 'string' } } }, required: ['pass', 'issues'] }

async function runShot(s) {
  let r = await agent(`${SHOT_COMMON}\n\nSCREEN: ${s.name}\n${s.spec}`, { label: `edit:${s.name}`, phase: 'Screens', schema: SHOT_R })
  if (!r) return { name: s.name, error: 'no result' }
  let v = null
  for (let i = 1; i <= 2; i++) {
    v = await agent(`Verify the round-2 edit of ${r.webp} against D044 (${REPO}/wiki/decisions/D044-app-screens-on-the-site.md) and this spec: ${s.spec}. Read the image and zoom into crops (PIL). FAIL if: any spec item is not done; the canvas is not 576 x 1209; any real name, "Khelu" in Latin script, phone number, recorder icon, touch ripple or nav bar remains; "Games" or the AI summary card remains; any edit looks pasted (font, size, weight, colour, alignment, halo, broken spacing) at 100%; numbers or titles are inconsistent between the activity and transcript screens (compare with ${REPO}/mockup/assets/app/app-transcript.webp and app-activity.webp). Do not edit files.`, { label: `verify:${s.name}#${i}`, phase: 'Screens', schema: SHOT_V })
    if (!v || v.pass || i === 2) break
    const r2 = await agent(`${SHOT_COMMON}\n\nSCREEN: ${s.name}\n${s.spec}\n\nA reviewer found these problems in your current output; fix them all: ${JSON.stringify(v.issues)}`, { label: `edit:${s.name}#2`, phase: 'Screens', schema: SHOT_R })
    if (r2) r = r2
  }
  return { name: s.name, ...r, check: v }
}

// Resume entries: { id, title, extra?, resume: { worktree_path, branch, head?, stage: 'finish' | 'review' } }
const taskRuns = args.tasks.map(t => runTask(t))
const shotRuns = args.screens ? SHOTS.map(s => runShot(s)) : []
const results = await Promise.all(taskRuns.map(p => p.catch(e => ({ error: String(e) }))))
const shots = await Promise.all(shotRuns.map(p => p.catch(e => ({ error: String(e) }))))
return { wave: W, results, shots }
