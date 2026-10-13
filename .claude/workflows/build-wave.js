export const meta = {
  name: 'build-wave',
  description: 'Phase 5: build one wave of tasks in parallel git worktrees; targeted checks per task; review depth by risk (D052)',
  phases: [{ title: 'Copy' }, { title: 'Build' }, { title: 'Review' }, { title: 'Fix' }, { title: 'Screens' }],
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

const COPY = {
  type: 'object',
  properties: {
    pages: { type: 'array', items: { type: 'string' }, description: 'absolute paths of the copy pages written or changed' },
    open_questions: { type: 'array', items: { type: 'string' }, description: 'questions for the founder: options and a recommendation' },
    placeholders: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['pages', 'open_questions', 'placeholders'],
}
const CMO = {
  type: 'object',
  properties: {
    pass: { type: 'boolean' },
    review_page: { type: 'string' },
    issues: REVIEW.properties.issues,
    summary: { type: 'string' },
  },
  required: ['pass', 'issues', 'summary'],
}

const VERIFY_NOTE = W === 1
  ? `Wave 1 tasks run in parallel, so the other wave-1 tasks' files are NOT in your tree, and \`npm run verify\` exists only once task 1.1 lands. Task 1.1 creates it and must run it; every other wave-1 task runs the equivalent itself: \`npx tsc --noEmit\`, \`npx vitest run\` (whole suite), \`npx eslint <every file you changed>\`, \`node scripts/ds-checksums.mjs\`. Also run \`npm run build\` (the full Next production build; unit tests do not catch Turbopack failures). Your work must be green on its own tree.`
  : `TARGETED CHECKS ONLY (founder decision D052, wiki/decisions/D052-qa-checkpoints.md): do NOT run the full \`npm run verify\` or the whole Playwright suite; the main session runs the full unit suite and the production build once per batch merge, and the full browser suite only at milestones. Run, green, on your own tree: (1) \`npx tsc --noEmit\` (and \`npx tsc --noEmit -p tsconfig.guards.json\` if you touched test/); (2) \`npx eslint <every file you changed>\`; (3) \`npx vitest related --run <every source file you changed>\` plus the test files you added or changed; (4) \`npx vitest run test/guards\` (the whole-tree rules: tokens, banned phrases, client icons, motion, mockup markup); (5) \`node scripts/ds-checksums.mjs\`. (6) Only if your task adds or changes a route, a layout, src/app, next.config, the CSS pipeline or package.json: \`npm run build\` once. (7) Only for a page or route task: that route's browser specs at the three approved widths (360, 390, 1440; for example \`KH_SLUGS=<slug> npm run test:visual\`, \`npm run test:text -- <slug>\`, and axe, no-sideways, first-screen and links filtered to your route with \`--grep\`), on the ports the notes give you; ${W >= 3 ? 'plus any e2e spec your task owns (`npx playwright test <spec>`). ' : ''}Report each command and the tail of its output. A check that times out under machine load is re-run alone before you call it red.`

function buildPrompt(t) {
  return `You are building task ${t.id} of Phase 5 wave ${W} on the Kheelona.com website: "${t.title}".

The spec is the section "### ${t.id}" of ${REPO}/wiki/engineering/tasks.md. Read it in full, plus that file's sections "How to read a task", "Standard component acceptance", "Standard page acceptance" (where relevant) and "Guard-test ownership", then every input the task lists (architecture.md and structure.md sections, ADRs, decisions, mockup files). Paths in the wiki are relative to the repo root.

SETUP: you run in an isolated git worktree of ${REPO}.
1. Run \`pwd\` and \`git log -1 --oneline\`. The worktree tool may start you on \`origin/main\` (an old commit): if \`git merge-base --is-ancestor ${BASE} HEAD\` fails, run \`git reset --hard ${BASE}\` first (this worktree is new and yours). Then \`git switch -c build/w${W}-${t.id}\` (if a branch with that name exists, use \`build/w${W}-${t.id}-b\`) and confirm \`git merge-base --is-ancestor ${BASE} HEAD\` succeeds.
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

const risk = (t) => (t.risk === 'high' || t.risk === 'mechanical' ? t.risk : 'normal')

function reviewPrompt(t, b, round) {
  const high = risk(t) === 'high'
  return `${high ? 'Adversarial review' : 'Review'} (round ${round}, ${risk(t)} risk, D052) of Phase 5 task ${t.id} ("${t.title}") on the Kheelona.com website. Your job is to find what is wrong or missing, not to approve. Do NOT edit, create, stage or commit files in the worktree (scratch files only under /private/tmp/claude-501/ and deleted afterwards; if you plant a violation to prove a guard red, restore it with \`git checkout -- <file>\` and confirm \`git status\` is clean at the end).

Worktree: ${b.worktree_path} (branch ${b.branch}, head ${b.head}); base commit ${BASE}. cd there first.
Spec: section "### ${t.id}" of ${REPO}/wiki/engineering/tasks.md, with "How to read a task", the standard acceptance lists and "Guard-test ownership"; the architecture.md and ADR sections it cites.
The builder's report: ${JSON.stringify({ acceptance: b.acceptance, verify: b.verify, blocked: b.blocked, notes: b.notes }).slice(0, 6000)}

Check, with evidence for each:
1. Ownership: \`git diff --name-only ${BASE}..HEAD\` lists only files the task Owns (plus its catalogue rows). Nothing under design-system/ changed; \`node scripts/ds-checksums.mjs\` passes; no .env file, secret, real name or phone number from the app demo is staged; no mockup/_work file committed.
2. Every acceptance item against the diff (\`git diff ${BASE}..HEAD\`) and the code. ${high ? 'Check each item independently: run its tests, re-derive numbers, and prove every guard this task added or changed red on a planted violation. Do not trust the builder\'s evidence.' : 'Read the code for each item; run the tests behind any item whose evidence is thin or doubtful; prove red only a guard this task added or changed. Do not re-derive what the builder\'s evidence already shows convincingly.'}
3. Checks: run the task's targeted checks once (below), not the full suites; reuse the builder's production build in the worktree if HEAD has not moved since it was built. ${VERIFY_NOTE}
4. Quality: matches the approved mockup and the plan; DS tokens only; no copy, price or URL typed in components; tracking IDs and event names unchanged; checkout logic unchanged; correct for Next.js 16.3.8 (node_modules/next/dist/docs/); no test weakened; nothing that will break a later wave's owned file.
pass = true only if there is no blocking issue and the targeted checks are green (verify_green). Blocking means an acceptance item is not met, a rule is broken, or something will break at the merge; everything else is minor (it goes to a follow-up list, it does not hold the task). Each issue: severity, the acceptance item, what is wrong (file:line), and the exact fix.`
}

function fixPrompt(t, b, review) {
  return `Fix the review findings on Phase 5 task ${t.id} ("${t.title}") of the Kheelona.com website. Work in the existing worktree ${b.worktree_path} on branch ${b.branch} (cd there; do not create another worktree; node_modules is already present). The spec is section "### ${t.id}" of ${REPO}/wiki/engineering/tasks.md.

Findings to fix: every blocking one; a minor one only if it is small and inside your Owns (otherwise list it in notes as a follow-up):
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


// Copy stage (wave 5 part C, the 18 articles): copywriters write the copy pages in a worktree the main session
// created; the CMO reviewer approves them (2 reviews at most, brief Phase 5 step 1); the builder then commits the
// pages and builds the modules in the same worktree. The copywriter has no shell: it reads and writes by absolute path.
function copyPrompt(t, slugs) {
  const wt = t.copy.worktree_path
  return `You are writing the article copy for Phase 5 task ${t.id} ("${t.title}") of the Kheelona.com website: ${slugs.length} articles, ${slugs.join(', ')}.

WHERE: work only in the git worktree ${wt} (a full copy of the repo at the build's base). Read the repo's files there and write there, always by absolute path under ${wt}. Never write anything under ${REPO} outside that worktree. Do not touch any other article's page: another copywriter is writing the rest of this task's articles in the same worktree at the same time.

OUTPUT: one copy page per article, ${wt}/wiki/site/pages/story-<slug>.md, in the format of the three approved article pages (${wt}/wiki/site/pages/story-learning-toys-for-a-three-year-old.md, story-what-to-look-for-in-a-safe-ai-toy.md and story-talking-toys-and-late-talkers.md: read all three first): front matter (title, type page-copy, updated 2026-10-14, cites_at, sources), "How to read this page", "At a glance" (title tag of at most 60 characters with " · Kheelona", meta description of at most 155, primary keyword, H1, read time), then fold by fold with quoted **Copy** blocks (article head; the answer first, 40 to 60 words; the body sections; sources with markers; the close), then keyword placements, CTA tracking values, placeholders, questions for the founder, and sources. Every fold must map to a block the article template renders (the Article shape in ${wt}/src/content/types.ts and ${wt}/src/components/layouts/ArticleTemplate/), as the three approved articles do.

INPUTS for each article: the row of task ${t.id} in ${wt}/wiki/engineering/tasks.md (Wave 5 table) and the paragraph on part C above it; its stub module ${wt}/src/content/en-IN/stories/articles/<slug>.ts (the card title and summary are approved hub copy, ${wt}/mockup/pages/stories.html and ${wt}/wiki/site/pages/stories.md: keep them word for word; keep its related list and dates); the live article in ${wt}/src/lib/stories.ts and ${wt}/src/lib/stories-expansion.ts (input only: its topic, facts and sources, never its wording where the rules below differ); its rows in ${wt}/wiki/research/keyword-map.md (the URL's primary keyword, title, H2 plan and question bank) and ${wt}/wiki/site/url-map.md; ${wt}/wiki/product/claims.md (CONFIRMED claims only; never retired or banned wording, §4), ${wt}/wiki/research/source-verification.md and the source notes in ${wt}/wiki/raw/research/sources/ (every statistic or research statement carries a source marker and a verified source, D026; a claim without one becomes a marked placeholder); the decisions D016 (brain wording), D025 (speech and language: the disclaimer, and speech-delay answers only with it), D026, D041 (merged topics) in ${wt}/wiki/decisions/; ${wt}/wiki/site/content-boundary.md (external content only), ${wt}/wiki/product/age-band-review.md (ages 3 to 7, never anything implying under 3), the voice and messaging pages in ${wt}/wiki/brand/, and the banned phrases in ${wt}/test/guards/banned-phrases.data.ts.

RULES: parent-first plain en-IN English, written for a phone; the point first; one idea per section; at most one in-text product link, and none that pitches on a speech or language page; no competitor names; Kheelu is a toy, never a therapy or a tutor; prices only as the references pricing.md names. Do not write open-questions.md, decisions/, index.md, log.md or status.md.
${t.extra ? `\nNOTES FROM THE MAIN SESSION:\n${t.extra}\n` : ''}
Return the absolute paths of the pages you wrote, the open questions (options and a recommendation each) and every placeholder.`
}

function cmoPrompt(t, round, writes) {
  const wt = t.copy.worktree_path
  const page = `${wt}/wiki/qa/cmo-review-articles-${t.id}-2026-10-14.md`
  return `CMO review (round ${round}) of the article copy for Phase 5 task ${t.id} ("${t.title}") on the Kheelona.com website, before it is built (brief Phase 5 step 1). The pages are ${t.copy.groups.flat().map((s) => `${wt}/wiki/site/pages/story-${s}.md`).join(', ')}. Work in the worktree ${wt} (cd there; read by absolute path). This is a copy review: there is no built page and no screenshot yet.
The copywriters' reports: ${JSON.stringify(writes).slice(0, 6000)}

Judge each article as SKM would, against: the positioning and voice (${wt}/wiki/brand/), parents of 3-7 year olds and their real question (the article's keyword-map rows in ${wt}/wiki/research/keyword-map.md); the answer first in 40 to 60 words; one idea per section, phone-first lines; every statistic or research statement traced (check each one against ${wt}/wiki/product/claims.md, ${wt}/wiki/research/source-verification.md and the source notes); D016 brain wording, D025 speech and language (the disclaimer present wherever speech or language development is discussed), D026 markers; no banned or retired wording (claims.md §4 and ${wt}/test/guards/banned-phrases.data.ts); ages 3 to 7 and nothing implying under 3; no internal content (${wt}/wiki/site/content-boundary.md); no competitor names; at most one product link and no pitch on a speech page; title tag at most 60 characters, meta description at most 155; the approved card title and summary unchanged; every fold maps to a block of the article template.

Write your verdict to ${page} (${round === 1 ? 'create it with front matter: title, type qa, updated 2026-10-14, sources' : 'append a "## Round 2" section; keep round 1 as written'}): pass or fail per article and criterion, with a specific fix for each failure. Do not edit the copy pages; do not stage or commit anything.
pass = true only if no blocking issue remains. Blocking: an unverified or invented claim, a banned or retired phrase, a D016 or D025 breach, anything implying under 3, internal content, a wrong price or CTA, a title over 60 characters, a missing answer-first block, a changed card title or summary. Everything else is minor. Each issue: severity, the article and criterion, what is wrong (file and line), and the exact fix. Return review_page as ${page}.`
}

function copyFixPrompt(t, review) {
  const wt = t.copy.worktree_path
  return `Fix the CMO review findings on the article copy of Phase 5 task ${t.id} ("${t.title}") of the Kheelona.com website. The pages are ${t.copy.groups.flat().map((s) => `${wt}/wiki/site/pages/story-${s}.md`).join(', ')}, in the worktree ${wt}: read and write only there, by absolute path. The review is ${review.review_page || `${wt}/wiki/qa/cmo-review-articles-${t.id}-2026-10-14.md`}.
Fix every blocking finding, and a minor one where it is small; if a finding is wrong, say why with the source in notes instead of changing the copy:
${JSON.stringify(review.issues, null, 1).slice(0, 12000)}
Same rules as when you wrote them (the approved card title and summary stay word for word; every claim sourced or a marked placeholder). Return the pages you changed, the open questions and the placeholders.`
}

function buildFromCopyPrompt(t, copy) {
  const wt = t.copy.worktree_path
  const last = copy.cmo[copy.cmo.length - 1] || {}
  return `You are building task ${t.id} of Phase 5 wave ${W} on the Kheelona.com website: "${t.title}".

The spec is the row "${t.id}" of the Wave 5 table in ${REPO}/wiki/engineering/tasks.md, with the paragraphs above that table (part C), "How to read a task", "Standard page acceptance" and "Guard-test ownership", and the note on the 18 articles without a mockup below the table (template parity). Read them in full.

SETUP: the main session created your worktree ${wt} on branch ${t.copy.branch} from base ${BASE}, with node_modules already cloned. cd there and run \`git log -1 --oneline\` and \`git status\`. Do not create another worktree or branch.
The copy stage ran first in this worktree: ${copy.approved ? 'the CMO reviewer APPROVED the copy pages' : 'the CMO reviewer did NOT approve the copy pages in its last round (its open findings are below; build from the pages as they stand and list each open finding under blocked)'}. The pages are ${t.copy.groups.flat().map((s) => `wiki/site/pages/story-${s}.md`).join(', ')}, and the review is wiki/qa/cmo-review-articles-${t.id}-2026-10-14.md; they are uncommitted. FIRST stage exactly those files by name and commit them ("Article copy for task ${t.id}, CMO review ${copy.approved ? 'approved' : 'open'}"). Last CMO round: ${JSON.stringify({ pass: last.pass, summary: last.summary, issues: last.issues }).slice(0, 4000)}
Copywriters' open questions and placeholders: ${JSON.stringify(copy.writes.map((w) => ({ open_questions: w.open_questions, placeholders: w.placeholders }))).slice(0, 3000)}

Then build: each article module from its copy page word for word (the copy pages are the approved copy for these articles), through the article template, as task 5.6 built the three approved articles (read their modules and tests in src/content/en-IN/stories/articles/). Never change a copy page's words in the module; if the template cannot render something, list it under blocked.

RULES: change only the files your task Owns (the six article modules, their tests, and the copy pages and review page above), plus catalogue rows marked with your task id. Stage files BY NAME (never \`git add -A\` or \`git add .\`), commit with messages ending with the line:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Never push, never merge, never touch main, never run the Vercel CLI, never edit design-system/, never place a real order. Next.js 16.3.8 differs from your training data: read node_modules/next/dist/docs/ for any Next API you use.

VERIFY: ${VERIFY_NOTE} Prove every guard you write red with a planted violation, then restore it.
${t.extra ? `\nNOTES FROM THE MAIN SESSION FOR THIS TASK:\n${t.extra}\n` : ''}
Return the structured report: worktree path, branch, head commit, commits, files changed, the verify commands with the tail of their output, every acceptance item with status and evidence, catalogue rows touched, and anything blocked (including the copy's open questions for the founder).`
}

async function runCopy(t) {
  const writes = (await parallel(t.copy.groups.map((slugs, i) => () =>
    agent(copyPrompt(t, slugs), { label: `copy:${t.id}.${i + 1}`, phase: 'Copy', schema: COPY, agentType: 'copywriter' })))).filter(Boolean)
  const cmo = []
  let approved = false
  for (let round = 1; round <= 2; round++) {
    const r = await agent(cmoPrompt(t, round, writes), { label: `cmo:${t.id}#${round}`, phase: 'Copy', schema: CMO, agentType: 'cmo-reviewer' })
    if (!r) { cmo.push({ round, error: 'review returned nothing' }); break }
    cmo.push({ round, pass: r.pass, review_page: r.review_page, issues: r.issues, summary: r.summary })
    if (r.pass) { approved = true; break }
    const f = await agent(copyFixPrompt(t, r), { label: `copyfix:${t.id}#${round}`, phase: 'Copy', schema: COPY, agentType: 'copywriter' })
    if (f) writes.push(f)
  }
  return { writes, cmo, approved }
}

async function runTask(t) {
  let b
  let copy = null
  if (t.copy && !t.resume) {
    copy = await runCopy(t)
    if (!copy.writes.length) return { task: t.id, error: 'the copywriters returned nothing', copy }
  }
  if (copy) {
    b = await agent(buildFromCopyPrompt(t, copy), { label: `build:${t.id}`, phase: 'Build', schema: BUILD, agentType: 'builder' })
    if (b) b = { ...b, worktree_path: t.copy.worktree_path, branch: t.copy.branch }
  } else if (t.resume && t.resume.stage === 'review') {
    b = { task: t.id, worktree_path: t.resume.worktree_path, branch: t.resume.branch, head: t.resume.head || 'HEAD', commits: [], files_changed: [], verify: 'not recorded (resumed at review)', acceptance: [], blocked: [], notes: 'Resumed at review after the run was held; read the code and the commits instead of a builder report.' }
  } else if (t.resume) {
    b = await agent(finishPrompt(t), { label: `finish:${t.id}`, phase: 'Build', schema: BUILD, agentType: 'builder' })
    if (b) b = { ...b, worktree_path: t.resume.worktree_path, branch: t.resume.branch }
  } else {
    b = await agent(buildPrompt(t), { label: `build:${t.id}`, phase: 'Build', schema: BUILD, agentType: 'builder', isolation: 'worktree' })
  }
  if (!b) return { task: t.id, error: 'builder returned nothing' }
  // D052: review depth by risk. high: review, fix, re-review (2 reviews at most). normal: one review; a blocking
  // finding gets one fix, which the main session checks at the merge. mechanical: no review; the main session checks.
  const level = risk(t)
  const maxReviews = level === 'high' ? 2 : level === 'normal' ? 1 : 0
  const rounds = []
  let status = level === 'mechanical' ? 'not-reviewed' : 'failed'
  for (let round = 1; round <= maxReviews; round++) {
    const r = await agent(reviewPrompt(t, b, round), { label: `review:${t.id}#${round}`, phase: 'Review', schema: REVIEW })
    if (!r) { rounds.push({ round, error: 'review returned nothing' }); break }
    rounds.push({ round, pass: r.pass, verify_green: r.verify_green, ownership_ok: r.ownership_ok, issues: r.issues, summary: r.summary })
    if (r.pass) { status = 'passed'; break }
    const f = await agent(fixPrompt(t, b, r), { label: `fix:${t.id}#${round}`, phase: 'Fix', schema: BUILD, agentType: 'builder' })
    if (f) { b = { ...b, ...f, worktree_path: b.worktree_path, branch: b.branch }; if (round === maxReviews) status = 'fixed-unreviewed' }
  }
  const last = rounds[rounds.length - 1] || {}
  return { task: t.id, title: t.title, risk: level, status, worktree_path: b.worktree_path, branch: b.branch, head: b.head, commits: b.commits, files_changed: b.files_changed, acceptance: b.acceptance, blocked: b.blocked, notes: b.notes, catalogue_rows: b.catalogue_rows, final_pass: status === 'passed', rounds, copy: copy ? { approved: copy.approved, cmo: copy.cmo, open_questions: copy.writes.flatMap((w) => w.open_questions || []), placeholders: copy.writes.flatMap((w) => w.placeholders || []) } : undefined }
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

// Resume entries: { id, title, extra?, risk?: 'high' | 'normal' | 'mechanical' (D052; default normal), resume: { worktree_path, branch, head?, stage: 'finish' | 'review' } }
// Copy entries (articles): { id, title, extra?, risk?, copy: { worktree_path, branch, groups: [[slug, ...], ...] } }: the main
// session creates the worktree and branch from base (node_modules cloned); one copywriter per group.
const taskRuns = args.tasks.map(t => runTask(t))
const shotRuns = args.screens ? SHOTS.map(s => runShot(s)) : []
const results = await Promise.all(taskRuns.map(p => p.catch(e => ({ error: String(e) }))))
const shots = await Promise.all(shotRuns.map(p => p.catch(e => ({ error: String(e) }))))
return { wave: W, results, shots }
