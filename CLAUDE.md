# Kheelona.com — project schema
@wiki/status.md

## Every session
Read wiki/status.md (above) → wiki/index.md → the pages the task needs. Then act.
Recent history: `grep "^## \[" wiki/log.md | tail -20`
The standing brief is `wiki/raw/brief/kickoff-brief.md` (never edited). A later instruction from
the founder is recorded in `wiki/decisions/` and `wiki/log.md`, and the latest logged decision wins.

## Non-negotiables (full text: wiki/raw/brief/kickoff-brief.md, section 4)
- design-system/ is read-only and is the only source of visual decisions.
  Verify before every gate: `node scripts/ds-checksums.mjs`.
- Ages 3–7. No invented claims. Checkout logic unchanged.
- Tracking parity: every ID and event name stays exactly as it is (for example the Meta pixel
  `1051265191046395`). Inventory and parity checklist: wiki/site/tracking-inventory.md.
- Mobile-first: ~70% of visits are on phones.
- Build once, reuse: check the catalogues in wiki/engineering/ before creating anything.
- Everything in its place: folder structure, naming and the mockup-to-route map are in
  wiki/engineering/structure.md. Catalogues: components.md, assets.md, artifacts.md, dependencies.md.
  Build plan: wiki/engineering/tasks.md (waves) and architecture.md.
- Nothing reaches production without the approver's explicit OK (Gate B).

## Hard rules for this repo (each one cost us once; detail in wiki/engineering/lessons.md)
- The GitHub repo is PUBLIC. Stage files by name: never `git add -A` or `git add .`.
  Never force-push or rewrite history. `wiki/` and `design-system/` are committed publicly
  (wiki/decisions/D010, superseding D004), so neither ever holds a secret or personal data.
- Vercel is the founder's: never run the Vercel CLI. `main` auto-deploys, so nothing is pushed
  to `main` before Gate B.
- Push only with an explicit destination: `git push origin <src>:refs/heads/<dst>`. Global
  `push.default` is `upstream`, so a branch made from `origin/main` pushes to `main` (it happened once:
  2026-10-12, 24e92e3). Create branches with `--no-track`.
- Never run a bare `npm install`: name the package and pin it with `--save-exact`.
- Never place a real order or refund. The payment sandbox is `npm run qa:payment`.
- No secrets in the repo or the wiki; keep the existing env var names. The store's six secrets
  never take a `NEXT_PUBLIC_` name.
- Next.js 16 is not the Next.js in your training data: @AGENTS.md

## Hosting (moving to AWS; Vercel stays live until the switch)
- Live: Vercel (rule above). Target: AWS, same account as api/admin: CloudFront + Lambda + S3 in ap-south-1
  via OpenNext/SST, certificate in us-east-1. Switch only when every check passes and the founder says go; DNS last.
- Agents never hold AWS credentials and never run `aws`, `sst`, `cdk` or anything that calls AWS. The founder
  (AWS tech owner) deploys `infra/` from the console; later, GitHub Actions via the OIDC roles only (no stored keys).
- `infra/cert.yaml` = stack `kheelona-website-cert` (us-east-1): ACM certificate for the 3 names (DNS validation in
  Cloudflare) + alerts topic `kheelona-website-alerts` for CloudFront/WAF alarms. `infra/bootstrap.yaml` = stack
  `kheelona-website-bootstrap` (ap-south-1): 2 deploy roles, the boundary policy, alerts topic `kheelona-website-alerts`,
  trail `kheelona-cloudtrail` (reuses the account's GitHub OIDC provider).
- GitHub environments `aws-production` (branch `main` only) and `aws-preview`, each with variables
  `AWS_DEPLOY_ROLE_ARN` and `AWS_ACCOUNT_ID`. `Production`/`Preview` belong to Vercel: never touch them.
- Spike (K-150): `.github/workflows/aws-spike.yml` on `main` is a dispatch-only stub (no permissions, no AWS, stops at
  once). The spike's real workflow lives only on the never-merged branch `growth/2026-W48/aws-spike` (stage `spike`,
  preview role via the `aws-preview` environment, no store secrets, placeholders only). cto-architect dispatches it with
  `gh workflow run aws-spike.yml --ref growth/2026-W48/aws-spike` (founder decision, 18 Nov); each run is logged.
  PR-3 removes the stub.
- Dispatching that GitHub workflow is the only way agents start a deploy. The rule above stands: agents never hold AWS
  credentials and never run `aws`, `sst`, `cdk` or anything that calls AWS themselves; the runner assumes the OIDC role.
- Certificate status: stack `kheelona-website-cert` failed on 18 Nov because `www`/`store` are CNAMEs to Vercel, whose
  CAA excludes Amazon. The spike therefore runs on CloudFront's default `*.cloudfront.net` address with no aliases.
  The certificate fix is decided before the parallel run.
- Fences: names `kheelona-website-*` and/or tag `project=website` + `stage`; ap-south-1 and us-east-1 only; every
  website role carries `kheelona-website-boundary`; never read, tag or change a backend resource; no stage name
  starting `deploy`.
- Secrets: SSM SecureString `/kheelona-website/production/<NAME>` in ap-south-1, same 12 names as Vercel, entered
  by the founder only. Budget and anomaly alerts: the founder sets them in the console.
- Every migration PR updates this section.

## Wiki
Karpathy's "LLM Wiki" pattern; opens cleanly in Obsidian. Three layers: `wiki/raw/` (immutable
sources: read, never edit), the wiki pages (maintained by Claude), and this schema.

```
wiki/
  index.md            catalogue of every page: link + one-line summary, by category
  log.md              append-only history
  status.md           phase, last step, next step, blockers, waiting on the founder, due dates (≤ 40 lines)
  open-questions.md   everything waiting on SKM or the founder
  raw/                brief/, positioning/, legacy-memory/, posthog/, research/, feedback/, qa/
  brand/ product/ site/ engineering/ design-system/ research/ decisions/ agents/ qa/ legacy/
```

- **Page conventions.** YAML front matter (`title`, `type`, `updated`, `sources`); relative links;
  each fact on ONE page, other pages link to it; every claim cites its raw source or query.
- **Log entries.** `## [YYYY-MM-DD HH:MM] <type> | <summary>`, type ∈ ingest, decision, agent,
  build, qa, gate, deploy, lint, cleanup.
- **Ingest:** save to `raw/`, write or update its summary page, update every affected page,
  `index.md` and `log.md`. **Query:** answer from the wiki first; file answers worth keeping.
  **Lint** (end of every phase): contradictions, stale claims, orphans, missing links, open TODOs.
- **Decisions:** one file per decision in `wiki/decisions/D###-slug.md`: context, options,
  choice, why, approved by, date.
- Update `status.md` and `log.md` after every task, before and after handing work to an agent,
  and whenever the conversation gets long. Project facts never go in auto-memory or agent memory.

## Agents
Definitions: `.claude/agents/` · Roster and run history: `wiki/agents/`.
Only the main session starts agents, and every agent reports back to it. Agents write only their
own wiki pages; the main session owns `open-questions.md`, `decisions/`, `index.md`, `log.md` and
`status.md`.
