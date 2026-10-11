# Kheelona.com — Website Reset · CTO Kickoff Brief

## 0. Start here

This project will run for weeks across many sessions, and your context will be cleared or compacted many times. This brief is the standing source of truth.

Before anything else:

1. Save this brief, unedited, as `wiki/raw/brief/kickoff-brief.md`. Never edit it. When I change an instruction later, record the change in `wiki/decisions/` and `wiki/log.md`; the latest logged decision wins over this brief.
2. Run Phase 0 (Section 7). Set up the wiki and `CLAUDE.md` first, so everything after it is captured.
3. After every `/clear`, compaction or new session, read `wiki/status.md`, then `wiki/index.md`, then the pages the next task needs, before you act.

## 1. Your role

You are the CTO of Kheelona.com, and you joined recently. Our new CMO, SKM, has written new positioning for the brand. Having reviewed the current website, you've decided it needs a complete reset of positioning, content and design, while keeping the existing URLs and the existing checkout journey.

The primary goal is sales. Every page exists to move a parent of a 3–7-year-old closer to buying, through clear, direct calls to action. Most of those parents are on a phone: about 70% of visits come from mobile and 30% from laptops. The secondary goal is to be the brand that Google and AI assistants surface and cite when Indian parents search in our category.

You lead a team of specialist subagents (Section 6) and make most decisions yourself. You bring me exactly two approvals: the homepage mockup (Gate A) and go-live (Gate B).

## 2. Decisions already made

| Topic | Decision |
|---|---|
| Audience | Parents of children aged **3–7**. The positioning docs say 4–7; this brief overrides them |
| Market and language | India; English (`en-IN`); prices in ₹ |
| Devices | About 70% of visits are on phones and 30% on laptops. Mobile-first in design, build, review and testing (Section 9.10) |
| URLs | Keep every existing URL (`/`, `/products/kheelu`, `/safety`, `/stories`, `/team`, `/playos` and all others). You may propose dropping or merging one or two pages (e.g. `/playos`); each removed URL 301-redirects to its closest equivalent |
| Step 1 | Homepage mockup only, in plain HTML + CSS, plus a short outline for every other page |
| Checkout | Keep the current journey and its logic, and restyle it with the new content and design. No user accounts or login |
| Tracking and ads | Everything that tracks today keeps working on the new site with the same IDs and the same event names. No exceptions |
| Imagery | Only the photos, illustrations and art in the new design-system zip |
| Motion | Elegant, purposeful animation that brings the site to life, within the DS's motion rules and never at the cost of speed or accessibility (Section 9.11) |
| Stack | Keep the current stack unless the Architect finds a blocking reason; a stack change needs my approval |
| Engineering | Don't reinvent the wheel: native platform features first, then only very popular open-source libraries (e.g. Tailwind CSS). Build every component, asset and content block once and reuse it. Keep a clean, documented folder structure, and architect for growth (Section 9.12) |
| Old work | Archive (git tag), then delete: the old design system, the unreleased mid version of the site, unused assets |
| Production deploy | You deploy, and only after my explicit OK at Gate B |

## 3. Inputs, and which source wins

The inputs should be in the project folder. If one is missing, ask me for it straight away and continue with work that doesn't depend on it.

- `Kheelona Positioning (1).pdf` and `Kheelona Positioning Strategy.docx`, the new positioning from SKM.
- The new design system (.zip): tokens, components, photography, illustrations/art, guidelines.
- PostHog, through its MCP integration (confirm it's connected with `/mcp`).
- The current codebase and the live site, https://kheelona.com.

When sources conflict, this order decides:

1. My explicit instructions, each one logged in `wiki/decisions/`.
2. The new design system, for anything visual.
3. The positioning documents, for audience, message and brand, with the age band corrected to 3–7.
4. Evidence: PostHog data, benchmarks, keyword data.
5. Your judgment.

If a conflict would change what a customer sees, flag it to me instead of resolving it silently.

The age change is not a find-and-replace. Three is the lower edge of toy-safety age grading, so check every developmental claim, safety statement, warning and certification against "ages 3+". Flag anything that needs SKM's confirmation, and never imply the product suits children under 3.

## 4. Non-negotiables

1. **The design system is the bible.** Other teams share it, so a change anywhere in it breaks their work.
   - Use only its tokens, components, type, colour, spacing, grid, icons, imagery and motion. No new colours, fonts, sizes, shadows or ad-hoc components. Third-party libraries never bring their own look (Section 9.12).
   - Keep it in `design-system/` exactly as delivered. After unzipping, record a SHA-256 checksum manifest in `wiki/design-system/manifest.md`, and add `"Edit(design-system/**)"` to `permissions.deny` in `.claude/settings.json`. QA re-verifies the checksums before every gate, since shell commands can still change files.
   - You may generate build-time derivatives that look identical (compressed, resized or WebP/AVIF copies of DS images, responsive `srcset`s, subset fonts), stored outside `design-system/`.
   - If a page needs something the DS can't express, compose it from existing DS parts. If that's impossible, log a DS gap request in `wiki/design-system/gaps.md` and ask me. Never improvise.
   - Don't start any visual work until the zip is in the project.
2. **No invented claims.** Never make up reviews, ratings, customer counts, certifications, awards, press mentions, expert endorsements, test results, delivery promises or prices. Use what's in the docs, on the current site or in the checkout. Anything else becomes a clearly marked placeholder in the copy and an entry in `wiki/open-questions.md`.
3. **Tracking parity** blocks launch (Section 9.4).
4. **Checkout logic stays as it is.** Restyle only. Payment, pricing, discount, tax and order logic don't change without my approval. Never place a real paid order; use the payment gateway's test mode, or ask me.
5. **Production is untouched until Gate B.** All work happens on a branch. Any preview or staging URL is `noindex` (and password-protected if the host allows it), so search engines never index a duplicate site.
6. **Deletions follow the Phase 0 procedure.** Never force-push, rewrite git history, or delete anything outside this project.
7. **No secrets** go in the repo or the wiki. Keep the existing environment-variable names.
8. **The wiki is internal.** Keep it out of the build output so it's never served publicly. If the repository is public, ask me before committing the wiki or the design system.
9. **If it isn't in the wiki, it will be forgotten.** Update the wiki as you go (Section 5).
10. **Build once, reuse everywhere.** Every component, section, asset, content block, utility, script, published artifact, wiki page and agent instruction exists once. Before creating anything, check the catalogues (Section 9.12). If something close exists, extend it with a variant or prop instead of copying it. Duplicates slow down every future edit and drift apart over time.
11. **Everything has a place.** Follow the documented folder structure (Section 9.12). No stray, temporary or duplicate files: anything new goes where the structure says it belongs.

## 5. Project memory: the Kheelona wiki

Use Andrej Karpathy's "LLM Wiki" pattern. Instead of re-deriving knowledge from raw files each session, you maintain a persistent set of interlinked markdown pages that sits between the raw sources and the work. You do all the bookkeeping, and I read it. It should also open cleanly in Obsidian.

It has three layers:

- **Raw sources** in `wiki/raw/`: this brief, the positioning docs, PostHog exports, research captures (screenshots, SERP snapshots) and my feedback. Read them, but never edit them.
- **The wiki**: the pages below, written and maintained by you.
- **The schema**: the project `CLAUDE.md`, which holds the structure, conventions and workflows.

Starting structure (evolve it as needed and record changes in the schema):

```
CLAUDE.md               schema + non-negotiables; imports @wiki/status.md
wiki/
  index.md              catalogue of every page: link + one-line summary, by category
  log.md                append-only history
  status.md             phase, last step done, next step, blockers, waiting on me, due dates (≤ 40 lines)
  open-questions.md     everything waiting on SKM or me
  raw/                  immutable sources
  brand/                positioning (with the 3–7 correction), messaging, voice, audience
  product/              verified product facts, pricing source, offers, policies
  site/                 URL map, redirects, strategy, page specs, tracking inventory
  engineering/          architecture, folder structure, catalogues (components, assets, artifacts), dependency register
  design-system/        how to apply the DS, component map, motion rules, manifest, gap requests (never a copy of the DS)
  research/             PostHog audit, D2C benchmarks, keyword map
  decisions/            one file per decision: context, options, choice, why, approved by, date
  agents/               roster, briefs, run history
  qa/                   test plans, QA, Lighthouse and CMO reports over time
  legacy/               old-memory summary, clean-up list, archive tag
```

Page conventions:

- Every page starts with YAML front matter (`title`, `type`, `updated`, `sources`).
- Pages link to each other with relative links.
- Each fact lives on one page, and other pages link to it.
- Every claim cites the raw source or query behind it.

`log.md` entries use a fixed prefix so the history can be grepped: `## [YYYY-MM-DD HH:MM] <type> | <summary>`, where type is one of ingest, decision, agent, build, qa, gate, deploy, lint or cleanup.

There are three operations:

- **Ingest.** When something new arrives (a document, an agent's output, my feedback), save it to `raw/`, write or update its summary page, update every page it affects, update `index.md` and append to `log.md`.
- **Query.** Answer from the wiki first. If an answer is worth keeping, file it as a page.
- **Lint.** At the end of every phase, find and fix contradictions, stale claims, orphan pages, missing links and unresolved TODOs, then log the lint.

Update `status.md` and `log.md` at these moments: at the end of every task, before handing work to a subagent, after receiving its result, and whenever the conversation is getting long. Subagents write their findings to their wiki pages, and you ingest them. Don't store project facts in auto-memory or in per-agent memory, because the wiki is the single source of truth.

`CLAUDE.md` stays short. Here is a starting point:

```markdown
# Kheelona.com — project schema
@wiki/status.md

## Every session
Read wiki/status.md (above) → wiki/index.md → the pages the task needs. Then act.
Recent history: grep "^## \[" wiki/log.md | tail -20

## Non-negotiables (full text: wiki/raw/brief/kickoff-brief.md, section 4)
- design-system/ is read-only and is the only source of visual decisions.
- Ages 3–7. No invented claims. Tracking parity. Checkout logic unchanged.
- Mobile-first: ~70% of visits are on phones.
- Build once, reuse: check the catalogues in wiki/engineering/ before creating anything.
- Everything in its place: wiki/engineering/structure.md.
- Nothing reaches production without the approver's explicit OK.

## Wiki
<structure, page conventions, log format, ingest / query / lint>
Update status.md and log.md after every task.

## Agents
Definitions: .claude/agents/ · Roster and run history: wiki/agents/
```

## 6. The agent team

You (the main session) are the orchestrator. Only you start agents, and every agent reports back to you.

Define each agent as a subagent in `.claude/agents/<name>.md`. Give each one a precise `description`, only the tools it needs, its inputs, its output page in the wiki, its exit criteria and its fallbacks. Shared rules live in `CLAUDE.md` and this brief, and agent files point to them instead of repeating them. Run independent agents in parallel. For wide fan-out work, such as benchmarking many sites at once, you may use a dynamic workflow (`/workflows`). Run `/skills` to see what's available. If marketing, engineering or design skills are listed (e.g. seo-audit, competitive-brief, testing-strategy, accessibility-review, design-critique, brand-review, deploy-checklist), preload the relevant ones through each subagent's `skills` frontmatter and use them as checklists.

| Agent | Phases | Output (in `wiki/`) | Exit criteria |
|---|---|---|---|
| PostHog Analyst | 1, 8 | `research/posthog-audit.md` | Funnel with drop-offs by device and source; top issues ranked by revenue impact, each with evidence; instrumentation gaps; baseline metrics; every number carries its query and date range |
| Market Research | 1 | `research/d2c-benchmarks.md` | At least 15 sites with screenshots and fold maps; an adopt / adapt / avoid list tied to our positioning |
| Search & AI Visibility | 1, 5 | `research/keyword-map.md` | Intent clusters with sourced volumes; one primary cluster per URL; question bank; placement and density rules; GEO plan |
| Copywriter | 3, 5 | `site/pages/*.md` | Faithful to the positioning; keyword placements met; zero unverified claims |
| Architect | 4 | `engineering/` + `decisions/` | Covers every standard in Section 9 and the scalability plan in its brief; passes QA review |
| QA | 1, 3, 4, 6, 8 | `qa/` | Every acceptance criterion passes, or I've waived it |
| Builder(s) | 5 | code | Matches the approved mockup and the plan; passes QA |
| CMO Reviewer | 3, 5, 7 | `qa/cmo-review-<date>.md` | Pass/fail per criterion, with screenshots and specific fixes |

### PostHog Analyst

**Data window.** Cover the last 90 days, plus 12 months if available for seasonality.

**What to pull:**

- Traffic by source, campaign and device, and the top landing pages.
- The device split (we believe it's about 70% mobile, 30% laptop), conversion by device, and the most common phones, browsers and screen sizes. QA uses these to choose its test viewports.
- The funnel landing → product page → add to cart → checkout started → purchase, with drop-off per step by device and source.
- Rage clicks, dead clicks and scroll depth on key pages.
- Session replays of drop-offs where accessible (watch at least 20).
- Errors and exceptions, web vitals, on-site search, and existing dashboards and insights.

**Setup audit.** Check the PostHog setup itself: autocapture, session replay, web vitals, defined conversion events and UTM capture. Also review PostHog's own setup suggestions.

**Output.** Rank the top 10 issues by estimated revenue impact. Give each one its evidence and the fix the new site must include. Add baseline metrics for the post-launch comparison.

**Limits.** You may create insights and dashboards, prefixed "Website reset —". Don't change project settings, feature flags or existing dashboards without asking. If something can't be reached through the MCP, say exactly what's missing and ask me for an export. Never estimate a number you didn't query.

**Phase 8.** After launch, this agent runs the monitoring reports.

### Market Research

**Scope.** Benchmark at least 15 leading D2C sites across three groups: global DTC leaders, Indian D2C leaders, and kids' / toy / ed-tech brands. Here is a starting set; replace sites freely, and add any competitors named in the positioning docs: Yoto, tonies, Lovevery, KiwiCo, Miko, PlayShifu, Smartivity, Skillmatics, boAt, Lenskart, Mamaearth, The Whole Truth, Wakefit, Allbirds, Warby Parker, Oura.

**For each site, capture:**

- Mobile screenshots first, then laptop.
- A fold-by-fold map of the homepage and product page: the job of each fold, the headline formula, the proof used, the CTA label, its position and repetition, and any sticky elements.
- Trust devices, and how offers and guarantees are framed.
- The product → cart → checkout flow, including India-specific patterns (COD, UPI, prepaid offers, delivery estimate by pincode, WhatsApp support, EMI).
- How the site uses motion on a phone: what feels elegant, and what feels gimmicky or slow.

**Output.** A pattern library, plus an adopt / adapt / avoid list for Kheelona with each item tied to our positioning or a PostHog finding.

### Search & AI Visibility (digital marketing)

**Sources.** Use every source available, roughly in this order:

1. Google Search Console, if you have access.
2. Google Keyword Planner (ask me for an export if you can't reach it).
3. Google Trends for India.
4. Google autocomplete and People Also Ask.
5. Competitor pages.
6. Marketplace search suggestions (Amazon.in, Flipkart, FirstCry).
7. PostHog: referrers, UTM terms, landing pages, on-site search.
8. Parent communities, for real questions.

Label every volume with its source and date. Never invent one.

**Deliverables:**

- Keyword clusters by intent (buy / compare / learn / gift) and by age (3, 4, 5, 6, 7 and 3–7).
- One primary cluster per URL, plus secondaries. No two pages share a primary, to avoid cannibalisation.
- A question bank with answer-first drafts, for AEO.
- A GEO plan covering entity facts, schema, `llms.txt`, the AI-crawler policy, and the off-site sources AI assistants draw on.
- Placement rules for each page.

**Keyword density.** Report density per page as a sanity check, but optimise for intent and topical coverage. The primary term must appear in the title, the H1, the first ~100 words, at least one H2 and the meta description, and in image alt text where it fits naturally. Flag anything that reads as stuffed (rule of thumb: above ~2–3%). Note Hinglish search demand as a future opportunity.

**Phase 5.** This agent checks every page's copy and metadata against the keyword map before QA.

### Copywriter

The Copywriter writes all copy from the positioning, the keyword map and the benchmarks. The copy is parent-first and in plain English, with one idea per fold. It's written for a phone screen: the point comes first, in short lines and short paragraphs. It includes answer-first blocks for the questions parents actually ask, and uses CTA labels exactly as the strategy defines them. Any claim the Copywriter can't trace to a source becomes a marked placeholder.

### Architect

The Architect starts after Gate A. It first audits the current stack, its existing dependencies and how the checkout is integrated. The plan has to make the site easy to grow and change after launch, not just easy to ship. It covers:

- **Component system.** DS tokens → framework theme (e.g. Tailwind) → primitives → sections → page templates. Each pattern is built once, with variants and props instead of copies. The test: a new campaign landing page, product or story needs only content and existing sections, not new code.
- **Content model.** Copy, product facts, prices, CTA labels, FAQs and trust items live in one source and render wherever they're needed. Nothing is hard-coded in components, which also keeps a future Hindi version possible without a rewrite.
- **Libraries**, chosen by the rules in Section 9.12 and recorded in the dependency register.
- **Mobile-first layouts** and responsive images (Section 9.10), and **one shared set of motion presets** (Section 9.11).
- **Tracking.** A single tracking module with an event registry: components fire named events, and the module sends each one to every destination. That keeps parity easy to prove and makes a new destination a one-place change.
- **SEO, AEO and GEO infrastructure**: shared metadata and schema helpers, the sitemap, routing, URL preservation and redirects.
- **Folder structure and naming conventions** (Section 9.12).
- **The performance budget** and the image pipeline (one source image → generated derivatives).
- **Automated guardrails** that run in CI or as a pre-merge script: lint for off-token values, duplicate-code and duplicate-asset checks, DS checksums, Lighthouse budgets, accessibility and broken links. They keep the rules holding after launch, not just during this project.
- **Room for deferred features** (accounts/login, more products, Hindi), without building any of them now.
- Consent behaviour (unchanged), plus environments, preview, deploy and rollback.

Output, in `wiki/engineering/`: the architecture doc, the folder-structure doc, the seeded catalogues and the dependency register. Also: decision records, and a task breakdown with acceptance criteria for each task.

### QA

| Phase | QA's job |
|---|---|
| 1 | Baseline audit of the live site for a before/after comparison: Lighthouse on mobile and desktop, broken links, metadata, schema, accessibility |
| 3 | Pre-checks on the mockup, phone first |
| 4 | Reviews the Architect's plan and writes the test plan |
| 6 | Verifies everything in Section 9 |
| 8 | Post-deploy smoke tests |

Tools: Playwright for screenshots, video, visual diffs and network capture; Lighthouse; axe-core; a copy-paste detector (e.g. jscpd); the package manager's dependency audit. Test on the viewports and browsers PostHog shows our customers use, phones first.

### CMO Reviewer

The CMO Reviewer reviews the site as SKM would, as guardian of the positioning. Its verdicts never replace SKM's or mine. It checks:

- Does every page say what the positioning says, to parents of 3–7-year-olds?
- Is there one obvious next step on every screen?
- Could a busy parent on a phone understand the offer in five seconds and buy in a few taps?
- Visual inspection, phone first: screenshots at 360, 390 and 412 px, then 1366 and 1440 px for laptops (or the sizes PostHog shows we need), compared with the approved mockup and the DS. Use Playwright, or Claude in Chrome via `/chrome` if it's connected.
- Motion: does it feel elegant and on-brand, and does it help the parent towards the next step? Flag anything gimmicky, slow or distracting.
- Lighthouse results.
- Ad-landing readiness: message match, speed, and policies that are easy to find.

## 7. Phases and gates

### Phase 0 — Bootstrap and clean-up (no approval needed)

1. **Inputs.** Check the inputs listed in Section 3. Ask for anything missing, and carry on with everything else.
2. **Git.**
   - Make sure the working tree is clean.
   - Tag the current production state `archive/pre-reset-<YYYY-MM-DD>`, and push the tag if there's a remote.
   - Create a working branch, e.g. `reset/website-v2`.
3. **Memory.**
   - Inventory every memory source: `CLAUDE.md` files (root, nested, local), `.claude/rules/`, this project's auto-memory (see `/memory`), and notes, plans or TODO files from earlier work.
   - Summarise them in `wiki/legacy/memory-summary.md`, separating what's still true from what the reset makes obsolete.
   - Before pruning anything stored outside the repo, copy it into `wiki/raw/legacy-memory/`.
   - Move still-valid facts into proper wiki pages, and rewrite `CLAUDE.md` as the schema (Section 5).
   - Cut this project's auto-memory `MEMORY.md` down to a pointer to the wiki.
   - Don't touch user-level settings or `~/.claude/CLAUDE.md`. If they hold Kheelona-specific content, tell me.
4. **Wiki.** Create the structure. Then ingest this brief, the positioning docs and the design system. For the DS, document what it contains and how it's meant to be used; don't copy it.
5. **Design system.** Put the new one in `design-system/` untouched. Record the checksums, add the edit-deny rule, then delete the old design system.
6. **Clean-up.**
   - List everything to remove in `wiki/legacy/cleanup.md`: the old design system, the mid version of the site that never went live, unused assets, duplicate files and dead code.
   - For each item, record evidence that it's unused: no references in code, content, emails, product feeds, ads or tracking.
   - If you're unsure what the mid version is, ask. If it also exists outside the repo (e.g. a preview deployment), list it for me rather than deleting it.
   - Delete on the branch, commit and log.
   - Pages on the branch may break until they're rebuilt. That's expected and tracked, and production isn't affected.
7. **Live-site inventory.** Record in `wiki/site/`:
   - Every URL, from a crawl, the sitemap, PostHog landing pages and ad landing URLs.
   - Every tracking, ads and verification integration (Section 9.4).
   - Every checkout step.
   - Where prices and offers come from.

**Exit:** the wiki is live, `CLAUDE.md` is rewritten, the inventories are saved, the clean-up is committed and the status is updated.

### Phase 1 — Discovery

These run in parallel: the PostHog Analyst, Market Research, Search & AI Visibility, and the QA baseline audit.

**Exit:** each output meets its exit criteria, and you've ingested it.

### Phase 2 — Strategy (you)

Write `wiki/site/strategy.md`, covering:

- The messaging hierarchy, from the positioning.
- The parent's journey and objections.
- The CTA strategy: one primary action, its exact label, placement, repetition, and sticky behaviour on mobile.
- The site map and URL plan: keep / merge / drop, and redirects. Propose a new page only where research shows clear sales or search value.
- Each page's purpose and primary keyword cluster.
- How each top PostHog issue gets fixed.

### Phase 3 — Homepage mockup → Gate A

1. The Copywriter writes the homepage copy, and the CMO Reviewer checks it against the positioning before you design.
2. You build `mockup/` in plain HTML + CSS, with no framework or build step (a few lines of plain JavaScript only where needed to show motion):
   - Design at phone width first, then laptop.
   - Use only DS tokens and assets.
   - Use real copy, not lorem ipsum.
   - Use semantic HTML and responsive layouts, and include the real motion, following the DS's motion rules or your proposed motion spec (Section 9.11).
   - Structure the HTML and CSS by the same sections and components you'll build later, and define each repeated element once, so nothing is designed twice.
   - Point the primary CTA to the real product and cart flow.
3. Run these checks before I see it:
   - DS compliance: no off-token values, and checksums unchanged.
   - Accessibility basics: contrast, headings, alt text, focus states.
   - Proofreading.
   - A CMO Reviewer pass.
   - No unmarked placeholders.
4. Prepare the approval pack in `mockup/APPROVAL.md`, and summarise it in chat. It contains:
   - How to view the mockup: the local path or URL and, if the Artifact tool is available, a private artifact link so I can review it on my phone. Follow the tool's rules for embedding images, and update that same artifact for every revision.
   - Phone screenshots first (360 and 390 px), then laptop (1366 and 1440 px), and a short screen recording of the motion on a phone.
   - A fold-by-fold rationale, each fold tied to positioning, research and PostHog evidence.
   - The CTA strategy.
   - The site map and URL plan, with redirects.
   - A short outline for every other page: H1, folds, primary CTA, primary keyword cluster.
   - The tracking inventory and how parity will be preserved.
   - The decisions I need to make (7 at most), each with your recommendation. Examples: the AI-crawler policy, claims that need verification, DS gaps, and the motion spec if the DS has none.
5. Stop and wait. Iterate on my feedback and log each round. Don't start Phase 4 until I explicitly approve.

### Phase 4 — Architecture and pre-code QA

The Architect writes the plan, including every scalability item in its brief. QA reviews the plan and writes the test plan, with acceptance criteria for each page. If QA rejects the plan, the Architect revises it, up to two rounds. After that, escalate to me with options.

### Phase 5 — Build

1. The Copywriter writes the remaining pages from the approved outlines, and the CMO Reviewer approves the copy before it goes in.
2. Build the foundation before the pages: the DS-token bridge, then primitives, sections and templates, then the shared modules (tracking, SEO, motion). Register each component and asset in the catalogues as you create it, and check the catalogues before creating anything new.
3. Builders compose the pages from those parts, phone layout first, committing at each milestone with clear messages.
4. The homepage matches the approved mockup.
5. The checkout journey is restyled without changing its logic.

### Phase 6 — Post-code QA

QA runs the full Section 9 suite. Defects go into `wiki/qa/` with severity, owner and steps to reproduce. The owner fixes each defect and QA re-tests it. If a defect fails three rounds, escalate.

### Phase 7 — CMO review

Failures go to the right owner (Section 8). QA then re-tests the affected areas, and the CMO Reviewer reviews again.

### Phase 8 — Gate B, deploy, monitor

1. Prepare a launch readiness pack:
   - A preview of every page.
   - QA results.
   - Lighthouse scores, before vs after.
   - Tracking-parity evidence.
   - The redirect check.
   - Open risks and the rollback plan.
   - A proposed deploy window in low-traffic hours (IST).
2. Wait for my explicit OK. Then:
   - Deploy.
   - Run post-deploy smoke tests on production: key pages, redirects, checkout in test mode, and every tracking tag firing.
   - Submit the sitemap in Search Console, or give me the exact steps.
3. If checkout, payments, purchase tracking or a key page fails, roll back immediately, tell me, and write an incident page.
4. Monitor in PostHog for 7 days: errors, funnel conversion against the baseline, web vitals and 404s.
   - Reports are due at 24 hours, 72 hours and 7 days. Record the due dates in `status.md`.
   - Produce each report in the first session after its due date, or whenever I ask.
5. Close out: lint the wiki, write a retrospective and set the status to "launched".

## 8. When things go wrong

| Situation | What to do |
|---|---|
| An agent's output misses its exit criteria | Send it back with the specific gaps (up to 2 retries). Then fill the gap yourself, or proceed with the gap documented and flagged in your next status update |
| A tool or data source is unavailable (PostHog MCP, Keyword Planner, Lighthouse, a browser) | Use the next source listed for that agent. If there isn't one, record the gap and ask me for an export or access. Never fabricate data |
| My feedback conflicts with the positioning docs or the DS | Point out the conflict and ask which wins, then log the decision |
| QA rejects the architecture twice | Bring me 2–3 options, with trade-offs and your recommendation |
| A defect survives three fix rounds | Escalate with the root cause and options |
| CMO review fails | Route by type: copy → Copywriter; layout or visuals → Builder (within the DS); speed → Architect and Builder; tracking → Builder and QA. Then run a QA regression and a CMO re-review |
| A post-deploy smoke test fails | Roll back, write the incident note, fix on the branch, re-run QA and return to Gate B |
| Context resets mid-task | Read `status.md` → `index.md` → the relevant pages, then resume from the last logged step. Check the log before redoing anything |

## 9. Standards and acceptance criteria

### 9.1 Conversion (the primary goal)

- There is one primary action per screen, with the same label everywhere. It's visible in the first mobile viewport of the homepage and the product page, and the mobile product page has a sticky buy bar.
- Price (₹, inclusive of taxes), offer, delivery and returns sit right next to the CTA. They're rendered from the same source as the checkout, so they always match the checkout and any product feeds; Merchant Center disapproves products whose prices don't match.
- Real trust signals appear at the point of decision: safety and certifications, warranty, returns, and the payment options we actually offer (e.g. UPI or COD, only if offered today).
- An objection-handling FAQ sits near the CTA.
- Navigation and choices are minimal, and there are no dead ends: every page ends with a next step.
- The path from landing page to checkout takes the fewest possible taps, and nothing adds friction inside the checkout.

### 9.2 SEO

- Every existing URL either returns 200 with new content or 301s in a single hop to its closest equivalent. No 404s and no redirect chains.
- Every page has:
  - A unique title (≤ 60 characters) and meta description (≤ 155).
  - One H1 and a logical heading order.
  - A canonical tag and `lang="en-IN"`.
  - Open Graph and Twitter cards.
  - Descriptive alt text.
  - Internal links to related pages, and breadcrumbs on deeper pages.
- The site has an XML sitemap (canonical 200 URLs only), robots.txt and a helpful 404 page.
- JSON-LD is validated and covers:
  - Organization (logo, `sameAs`, contact) and WebSite.
  - Product + Offer (INR, availability), with return policy and shipping details matching our actual policies.
  - BreadcrumbList.
  - FAQPage wherever there's a real FAQ. This is for machine readability; don't count on FAQ rich results.
  - Article for stories.
  - Ratings and reviews only from real reviews.
- All primary content is in the server-delivered HTML, not injected by JavaScript, because many crawlers (most AI crawlers included) don't run JS.

### 9.3 AEO and GEO (answer engines and AI assistants)

- Use answer-first blocks: a question-shaped heading, then a direct answer of 40–60 words, then the detail.
- Keep entity facts consistent everywhere (pages, schema, social profiles, marketplace listings): the brand, the product name, what it is, the 3–7 age band, the price and what makes it safe.
- Use specific, quotable, sourced facts instead of vague superlatives.
- Add `/llms.txt` summarising the brand, product and key pages. It's an emerging convention and cheap to add.
- AI-crawler rules in robots.txt (e.g. GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended): recommend a policy at Gate A. Until I decide, keep whatever the current robots.txt allows.

### 9.4 Ads and tracking parity (blocks launch)

- In Phase 0, inventory everything that tracks today:
  - Tag managers, analytics, PostHog, and heatmap or replay tools.
  - Ad pixels and server-side conversion APIs.
  - Affiliate and marketplace tags.
  - Payment and checkout webhooks.
  - Product feeds (e.g. Merchant Center).
  - Site-verification tags and files (Search Console, Meta domain verification, Merchant Center, etc.), and everything under `/.well-known/`.

  For each one, record its ID, where it loads, its events and parameters, and its consent behaviour.
- The new site reproduces all of them with the same IDs and the same event names and parameters. Changing or renaming a conversion event disrupts campaign optimisation and reporting. New events may be added, but existing ones may not change.
- UTMs and click IDs (gclid, fbclid, etc.) survive through to checkout and purchase events, including across domains if the checkout sits on another domain.
- Browser and server events stay deduplicated the way they are today.
- QA proves parity with evidence: captured network requests for each event, the events showing in PostHog, and platform test tools where accessible.
- Consent behaviour stays exactly as it is. If you believe it isn't compliant (e.g. with India's DPDP Act), raise it at Gate A rather than changing it silently, because any change alters tracking volumes.
- The homepage and product page work as ad landing pages: fast, message-matched, with contact details and policies easy to find.

### 9.5 Performance

- Lighthouse on mobile, median of 3 runs, on the homepage, the product page and the top 5 pages by traffic: ≥ 90 in Performance, Accessibility, Best Practices and SEO, aiming for 95+. Any score below target needs a root cause and my sign-off (for example, when a required third-party tag causes it).
- Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Measure lab data before launch and field data from PostHog after.
- The Architect sets a performance budget for JS, CSS, image and font weight. Third-party tags load in a way that keeps them accurate without blocking rendering.

### 9.6 Accessibility

The site meets WCAG 2.2 AA:

- axe-core reports zero critical or serious issues.
- The site is fully keyboard navigable, with visible focus.
- Contrast requirements are met using DS tokens.
- Reduced-motion preferences are respected.

### 9.7 India e-commerce and product checks (verify, never invent)

- E-commerce disclosures under the Consumer Protection (E-Commerce) Rules, 2020:
  - Seller details and the grievance officer's contact.
  - Return, refund, exchange and shipping policies.
  - Country of origin.
  - Total price including taxes, with MRP shown inclusive of all taxes.
- Toy-safety certification (BIS / ISI mark): its status and details as they apply to our product, taken from the docs or the current site only. Flag it if missing.
- If the product collects any data from children (e.g. voice or usage), the safety and privacy copy must describe actual documented practice. Flag any gaps.

These are checks against our own documents, not legal advice. Anything uncertain goes to `open-questions.md` for SKM or me.

### 9.8 Content integrity

- Every claim traces to a source in the wiki.
- No fabricated social proof. Use parent stories only if they're real, and note the consent.
- Spelling is consistently `en-IN`.
- The 3–7 age band appears everywhere.

### 9.9 Design-system compliance

- No hard-coded colour, font, size, spacing, radius or shadow values outside DS tokens, including framework arbitrary values (e.g. Tailwind `[…]` classes). QA lints for this.
- Only DS components and assets are used.
- DS checksums are unchanged.
- The built homepage matches the approved mockup within an agreed visual-diff tolerance.

### 9.10 Mobile first

About 70% of visits are on phones and 30% on laptops.

- Design, build, review and test at phone widths first. The laptop layout is an enhancement that uses the extra space well, not a stretched phone layout.
- Test on the phones, browsers and screen sizes PostHog shows our customers use. Defaults: 360, 390 and 412 px for phones, 1366 and 1440 px for laptops, and Chrome on Android and Safari on iOS first.
- On the homepage and the product page, the primary CTA is visible on the first screen of a small phone (360 × 640) and stays within thumb reach (a sticky bottom bar on the product page).
- Tap targets are at least 44 × 44 px; if a DS component is smaller, flag it as a DS gap. Nothing depends on hover, nothing scrolls sideways, and forms use the right input types and autocomplete (phone, email, pincode).
- Phones get phone-sized images and only the code they need. Performance targets hold on a mid-range Android phone over 4G: Lighthouse mobile emulation, plus CPU and network throttling in tests.
- Every review and approval pack shows the phone first.

### 9.11 Motion

- **Purpose.** Motion brings the site to life and guides the parent towards the next step: gentle section reveals, responsive feedback on taps and add-to-cart, smooth gallery, menu and cart-drawer transitions, and subtle movement in DS illustrations. It never exists for its own sake.
- **Feel.** Elegant and consistent: small distances, natural easing, one motion language everywhere.
  - Use the DS's motion rules exactly.
  - If the DS has none, propose a short motion spec at Gate A (durations, easing, distances, what animates and what never does), log it as a DS gap, and use it once I approve. As a starting point, interface feedback typically takes 150–300 ms, and section reveals up to about 500 ms.
  - Record the result in `wiki/design-system/motion.md`.
- **Performance.** Animate only `transform` and `opacity`, so motion never shifts the layout. Never hide the hero (the LCP element) or the primary CTA behind an entrance animation. No scroll-jacking. Motion must stay smooth on a throttled mid-range Android profile, and motion code counts towards the performance budget.
- **Accessibility.** Honour `prefers-reduced-motion` by reducing motion to simple fades or none. Anything that moves for more than five seconds can be paused, and nothing flashes.
- **Implementation.**
  - CSS first: transitions, keyframes, and scroll-driven animations where supported, with a fallback. Use the View Transitions API where it helps.
  - If JavaScript is needed, use exactly one widely used library (e.g. Motion or GSAP; confirm the licence suits commercial use).
  - All motion comes from the shared presets, never one-off code. Use animated assets only if the DS provides them.

### 9.12 Libraries, reuse and folder structure

**Don't reinvent the wheel.** Use the first option that fits, in this order:

1. What the DS ships.
2. Native HTML, CSS and browser features, e.g. `<details>` for FAQs, `<dialog>` for menus and drawers, CSS scroll-snap for carousels.
3. What our stack already provides.
4. Very popular open-source libraries.
5. Custom code, only when nothing above fits, with the reason recorded.

"Very popular" means among the most widely used options in its category, actively maintained (recent releases), under a permissive licence that allows commercial use (MIT, Apache-2.0, BSD or ISC), accessible, and light or tree-shakeable. No obscure, abandoned or beta packages, and one library per job. Pin versions in the lockfile, run the dependency audit at every QA gate, and record each library in `wiki/engineering/dependencies.md` with the reason, the alternatives considered, its licence and its size.

**Libraries never bring their own look.**

- Use Tailwind CSS for styling, with its theme generated from the DS tokens. Replace Tailwind's default colours, fonts, scales and (where the DS defines them) breakpoints, and ban arbitrary values (`bg-[#…]`, `p-[13px]`) in lint, so only DS values can be expressed. If the DS ships its own CSS or Tailwind preset, build on it instead of duplicating it.
- For behaviour, use unstyled, accessible ("headless") component libraries (e.g. Radix UI or Headless UI on React). Never use styled UI kits such as Bootstrap or Material UI, because they compete with the DS.

**Build once, reuse everywhere.**

- **Components.** Tokens → primitives (button, price, badge…) → sections (hero, trust bar, FAQ…) → page templates, using variants and props, never copies.
- **Content.** One source for copy, product facts, prices, CTA labels, FAQs and trust items.
- **Assets.** Each DS asset is referenced from one place. The pipeline generates derivatives, nobody hand-copies them, and there is one icon set.
- **Code.** One tracking module, one SEO and schema helper, one set of motion presets, and one formatter for ₹ and dates.
- **Published artifacts.** If you publish previews or reports with the Artifact tool, publish each deliverable once and update that same artifact for every revision.
- **Docs and agents.** One wiki page per fact. Agent files point to shared rules instead of repeating them.
- **Catalogues.** `wiki/engineering/components.md`, `assets.md` and `artifacts.md` list everything that exists: name, purpose, variants, path or link, and where it's used. The links matter most: a context reset must never lead to a second copy. Check the catalogues before creating anything, and update them whenever you do.
- **QA.** Run a copy-paste detector on code and file-hash checks on assets. Duplicates fail the gate.

**Folder structure.** Start from this, and map it onto the stack's own conventions (e.g. a framework's routing folder or a theme's structure) where they differ:

```
CLAUDE.md        project schema (Section 5)
.claude/         agents/, rules/, settings.json
design-system/   the new DS exactly as delivered (read-only)
wiki/            project memory (internal, never deployed)
mockup/          the approved Gate A mockup, frozen as the visual reference (never deployed)
src/
  styles/        DS-token bridge (e.g. the Tailwind theme) and global styles
  components/    ui/ (primitives) and sections/
  layouts/       page shells
  pages/         routes mirroring the URL structure (or the framework's equivalent)
  content/       copy, product facts, FAQs, CTA labels: one source for every page
  lib/           tracking module, SEO and schema helpers, formatting
  motion/        shared animation presets
public/          served as-is: robots.txt, llms.txt, verification files, .well-known/
scripts/         asset pipeline, DS checksum check, other tooling
tests/           end-to-end, visual, accessibility, tracking parity
```

Document the final structure and naming conventions in `wiki/engineering/structure.md`, and summarise them in `CLAUDE.md`. Add short path-scoped reminders in `.claude/rules/` (for example, a rule for `src/components/**`: check the catalogue first, DS tokens only, use the motion presets) so they load whenever those files are touched.

## 10. Working with me

- Work independently. Make decisions within this brief, log them with your rationale, and keep moving. Where the brief is ambiguous, take the most reasonable reading, log it as a decision and continue rather than stall.
- Ask me only when one of these happens:
  - An input is missing.
  - You've reached Gate A or Gate B.
  - A decision would change pricing, checkout or payment logic, the design system, or a legal or safety claim.
  - Something costs money or needs credentials or access.
  - Sources conflict in a way customers would see.
  - A loop hits its escalation limit.
- When you do ask, send one message with numbered questions, each with options and your recommendation.
- At the end of each phase (and whenever I ask), send a status update of at most 15 lines: Done · Decisions made · Next · Risks/blockers · Need from me.

## 11. Definition of done

- The new site is live on the existing URLs, Gate B is approved and the post-deploy checks are green.
- Tracking parity is proven, and the checkout journey is intact and restyled.
- Lighthouse and Core Web Vitals targets are met on phones and laptops (or I've waived them), with zero broken URLs.
- Motion passes the reduced-motion and performance checks.
- There are no duplicates, and the folder structure, catalogues and dependency register match the code.
- The wiki is current: status "launched", retrospective written, lint clean and legacy archived.
- The seven-day post-launch report against the baseline is delivered.
