# Kheelona.com: Website Build Prompt (Next.js, R3F, Vercel)

> **Usage**: This is the build prompt for **kheelona.com**. Paste it at the start of a new conversation, add it as a Claude.ai Project system prompt, or save it as `claude.md` for Claude Code. It is written for Claude Code (real filesystem, real Next.js project, deploy to Vercel) and works with any AI tool that can read and write files. This prompt is **specialized for Kheelona**: the brand, voice, pages, content sources, and tech stack are already decided and locked below. Do not re-ask what is already settled here.

---

## §0: Mission & Source-of-Truth Hierarchy

### The one job of this launch
kheelona.com is the consumer home of the brand. Its single job: **turn parent interest into a qualified pre-order list, at the launch price, and earn trust while we do it.** We are pre-shipping. The site does not sell today. It proves real demand, builds a warm audience, and sets up the sale for the day Lumi ships.

### Primary call to action, on every page
**Join the pre-order list.** Reserve Lumi at the launch price of **₹4,999** (₹9,999 after launch). **No payment now. We hold the price, you hold your place.** Every page carries this CTA. The navbar carries a standing pre-order button. The footer repeats it.

### Source-of-truth precedence (how to resolve any conflict)
When two sources disagree, the higher one wins:

1. **`kheelona homepage website content.pdf`** (highest). The homepage content document. Its "blue box" copy is used **as written, verbatim**. It prevails over everything else, including this prompt.
2. **This prompt's Brand Bible** (§1), Site Map (§2), and Design Direction (§3): voice, names, facts, page jobs, rules.
3. **`/design/design-system`** (visual tokens), then **`/design/mascot-3d-images`**, then **`/design/product-images`**.
4. **The loose guidance text** (lowest). Helpful direction, easily overridden by anything above.
5. For AI based image generation or a video generation of upto 7 sec you can use Gemini via Claude-in-chrome, i will login to my paid gemini account once you prompt. 

If a conflict is material, note it in the relevant checkpoint file and follow the higher source.

### Workspace constraint
Operate ONLY within the master project folder (`kheelona-com-website/`). Do NOT read, write, or modify anything outside it. All project files, assets, configs, and outputs live within this single root. If a dependency or tool requires global installation, document it and ask the user for permission first.

---

## §1: Brand Bible (LOCKED CONTEXT)

This section is pre-filled from the founder's brief. **Treat it as decided.** In discovery phases, confirm it and fill gaps; do not re-interview.

### 1.1 The one idea
**The smartest way to grow your child's brain is to understand their heart.**
Brain development is the promise. The five feelings are the engine that makes it work. Every page serves this single thought.

### 1.2 Who we are, two front doors
- **kheelona.com** (this site): warm and human, for parents.
- **kheelona.ai** (sister site): precise and technical, for partners and investors.
- Same soul, two registers of one voice. The footer carries one quiet line linking partners and investors to kheelona.ai.

### 1.3 Who we are talking to
- Parents of children aged **3 to 6**, often the mother, in **India first**.
- Wary of screens. Tired of toys that do one thing and get dropped in a week.
- They are not buying a gadget. They are buying their child's growth and their own peace of mind.

### 1.4 What we want them to feel
Calm, understood, and hopeful. One clear idea (1.1) carried gently across the whole site. Feeling first, proof second.

### 1.5 How we know it worked
- List size, and the share of parents who lock the launch price.
- Quality of intent: completed profiles (child's birth month, city) and referrals, not just raw emails.
- Trust: time on Safety and Team pages, low unsubscribe rate.
- Reach: shares, press pickup, search visibility for the questions parents actually ask.

### 1.6 Voice & House Style (HARD RULES)
Warm, plain, and honest. Write the way a thoughtful friend talks, not the way a brand shouts.

- **Talk to one parent.** Second person, present tense. "Your child", not "children today".
- **Short sentences, one idea each.** Read it aloud. If you run out of breath, cut it.
- **Feeling first, feature second.** Say what it does for the child, then how it works.
- **No hype, no jargon.** Rarely lead with the word "AI". Say "a friend who listens and talks back".
- **No em-dashes.** Use commas, colons, periods, or parentheses. (The em-dash reads as machine-written.)
- **The en-dash stays only in number ranges:** ₹4,999–9,999, ages 3–6.
- **Names are fixed and exact:** PlayOS, Lumi, Lori, Lua, Robu, Kheelona Magic Box.
- **Global brand, local warmth.** Lead with "the languages you speak at home", never a single country.

**Before and after:**
- Draft: "a screen-free friend who listens first, then talks back — really talks —". House: "a screen-free friend who listens first, then talks back. Really talks."
- Draft: "it listens, answers, then asks the next question — no screen, ever". House: "it listens, answers, then asks the next question. No screen, ever."
- Hype: "the world's most advanced AI companion for children". House: "a screen-free friend who listens, and talks back".
- Feature first: "on-device voice-to-voice inference in 10 languages". House: "it talks with your child in the languages you speak at home".

### 1.7 Voice-Lint (enforceable, run before saving any copy)
Before writing copy to `docs/copy-reference.md` or into any component, scan it and fix:
1. **Em-dash check:** zero `—` characters in body or display copy. Replace with commas, colons, periods, or parentheses.
2. **En-dash check:** `–` appears only inside number/age ranges.
3. **Hype check:** no "world's most advanced", "revolutionary", "cutting-edge", "game-changing", or similar. No leading with "AI" where "a friend who listens and talks back" works.
4. **Name-casing check:** PlayOS, Lumi, Lori, Lua, Robu, Kheelona Magic Box are spelled and cased exactly.
5. **Person/tense check:** second person, present tense, talking to one parent.
6. **Read-aloud check:** any sentence you cannot say in one breath gets cut or split.
This lint is a gate. Copy that fails it is not committed.

### 1.8 Facts lock
- **Product:** Lumi, a screen-free talking toy for ages **3 to 6**. Not a tablet. Not a speaker. It holds a real conversation.
- **Languages:** 10 home languages ("the languages you speak at home").
- **Listening:** wake-word only; microphone is off the rest of the time.
- **Price:** launch **₹4,999**, **₹9,999** after launch. "Under ₹4 a day across ages 3–6." No payment at pre-order.
- **Platform:** PlayOS, Kheelona's own voice engine. Family of friends: Lumi today, then Lori, Lua, Robu. "One soul, many bodies." "Made to be kept, not outgrown."
- **Founders (confirmed):**
  - **Apoorva Sahu**, Founder and CEO. The business and the trust.
  - **Aman Soni**, Co-founder and CTO. The brain. 14 patents filed.
  - **Kashyap C.R**, Co-founder and Chief Hardware Officer. The body. Built at Intel.
  - **We name Intel. We leave the global tech-services firm unnamed.**
- **The five feelings** (use the homepage doc wording verbatim; summary here):
  - **Curious** asks why and chases ideas. **Grumpy** has opinions and needs to be heard. **Sad** sits with you and makes space for hard moments. **Silly** turns everything into a game. **Joy** lights up and celebrates.

### 1.9 Claims-to-confirm register (PENDING, never invent)
These are NOT settled. Build with clearly flagged placeholders and never fabricate them. Track each in `docs/project-state.json` blockers until the founder supplies real values:
- **Testimonials / parent voices:** real quote, parent name, child age, city, with consent. Founder to provide.
- **Certifications & toy-safety standards wording:** exact standards and certificate references. Founder to confirm.
- **Ship date.**
- **Exact specs:** battery life, dimensions, materials, wake word, charger details.
- **Contact email** in the footer.
Flag every placeholder in code (`TODO` comment), in the sprint report, and in `qa-report.md`. The launch checklist must show "zero unconfirmed claims remaining".

### 1.10 Currency
Standardize on **₹** across the site (the homepage doc's "Rs. 4,999" is the same value rendered differently). Ranges use the en-dash: ₹4,999–9,999. (This is a flagged decision: if the founder prefers "Rs.", it is a one-line find-and-replace.)

---

## §2: Site Map & Page Jobs (LOCKED)

Nine pages, all live at launch. One job each, one shared spine. Built **globally-ready** so a region/currency switch can be added later without rewriting a page.

| Page | Route | The one job |
|---|---|---|
| Home | `/` | Make a parent feel it, then reserve |
| Lumi | `/products/lumi` | Answer every question, deepen desire (built to sit under a future `/products` index) |
| PlayOS | `/playos` | Prove the technology and why we win (more for investor than parent) |
| Safety | `/safety` | Remove the fear, earn the trust |
| Team | `/team` | Meet the humans you are trusting |
| Stories | `/stories` | Be useful before we sell (the blog/journal) |
| Privacy | `/privacy` | Say plainly what we do with data (secondary) |
| Terms | `/terms` | Make the reservation fair and clear (secondary) |
| Setup | `/setup` | Show how simple day one will be (secondary) |

**Navigation:** Lumi, How it works (links to `/playos`), Safety, Stories, Team, plus a standing **Join the pre-order list** button.
**Footer:** the same links, plus Privacy, Terms, Setup, Contact, and **one quiet line for partners and investors that links to kheelona.ai**.

### Home page scroll (11 sections, from the homepage doc, used verbatim)
Home splits roughly 40% Lumi, 40% PlayOS, 20% other (safety, stories, trust). The ten/eleven beats:
1. Intro / how-to (internal note in the doc, not rendered).
2. **Hero** ("For ages 3 to 6" label, the one-idea headline, reserve CTA, price line).
3. **Why we exist** ("Your child's best years deserve more than a screen.").
4. **Meet the feelings** ("Learning starts with feeling understood." + five feeling cards).
5. **Meet Lumi** (~40%: hero product intro, screen-free feature, parent app, reserve CTA).
6. **How it works, PlayOS** (~40%: PlayOS intro, on-device processing, safety architecture, pre-order CTA + quiet kheelona.ai link).
7. **How Lumi compares** (the honest comparison table).
8. **Safety strip** (~20%: "Safe in their hands. Careful with their words." + link to Safety page).
9. **Parent voices** (testimonials, PENDING per §1.9).
10. **From the journal** ("Raising curious kids." + story cards + See all stories).
11. **Footer CTA** ("Reserve Lumi before the price goes up." + pre-order button + footer nav + quiet partner link + contact).

**The comparison table (from the doc, verbatim):**

| | Lumi | Smart toys | Phone / TV | Static toys |
|---|---|---|---|---|
| Screen-free | Yes | Varies | No | Yes |
| Holds a conversation | Yes | Limited | No | No |
| Speaks your language | Yes (10) | Rarely | Varies | No |
| No open internet | Yes | Rarely | No | Yes |
| The parent sees everything | Yes | Partial | Partial | No |
| Made for ages 3 to 6 | Yes | Varies | No | Varies |

> The exact Home copy lives in `kheelona homepage website content.pdf` and is the highest source of truth. Read it and reproduce the blue-box copy verbatim. The structure above is the checklist; the PDF is the text.

---

## §3: Design Direction (LOCKED)

### North star
**Warmth of yunastories.com, with the 3D mascot as the star.** A warm, illustrated children's-brand feel: full-bleed scenes with the character, stacked alternating feature sections, soft illustrated backgrounds, a large serif-style headline font, card-based testimonials, a clean footer stats bar. The mascot is the key player, **not the product**: the toy changes over time, so the mascot carries the brand. Use `/design/product-images` sparingly and as secondary support.

### 3D approach: HYBRID (decided)
- **Live 3D (React Three Fiber):** the hero mascot, and a few key scroll beats. Calm, characterful motion. The mascot reacts gently to scroll or pointer; it never feels like a tech demo.
- **Pre-rendered + parallax everywhere else:** use renders from `/design/mascot-3d-images` inside soft, full-bleed illustrated scenes with parallax and gentle scroll motion. This keeps the page warm and fast.
- **Never flashy.** The feeling is a calm, trustworthy children's brand, not a WebGL showcase.

### Design tokens come from the design system, do not invent them
Ingest **`/design/design-system`** as the token source. Map its colors, typography (serif-style display per the doc), spacing, radius, and shadows into `tailwind.config.ts` / CSS variables. Do NOT invent a palette or type scale. If a token is missing, flag it and ask before choosing one.

### 3D performance policy (reconciles the Lighthouse gate)
3D is heavy; protect the experience and the score:
- **Models:** glТF/GLB, compressed with Draco or meshopt. Keep poly counts and texture sizes lean.
- **Lazy-load the canvas:** mount R3F only when needed (in view), code-split the 3D bundle, and never block first paint on it.
- **Mobile static-render fallback:** on small or low-power devices, show a high-quality pre-rendered image instead of the live canvas.
- **`prefers-reduced-motion`:** respect it. Reduce or stop motion, fall back to static.
- **Separate 3D performance budget**, tracked in the blueprint.

**Lighthouse targets (3D-aware):**
- **Accessibility, Best Practices, SEO: 90+ on every page.** Non-negotiable.
- **Performance: 90+ on desktop.** On mobile, aim for 90+; where the live hero canvas makes that unrealistic, ship the static fallback to hold the score and document the tradeoff. Performance is never bought by hurting accessibility.

---

## §4: Context & Memory Management System

This project may span multiple conversation sessions. The AI does NOT rely on conversation memory: the **project folder is the memory**. Every decision, approval, and output is persisted to files so any AI (or a new session) can resume seamlessly.

### Core Principle
> **The project folder must always contain everything needed to resume from the current point. If the folder were handed to a completely new AI with zero prior context, it should read the files and continue without asking the user to repeat anything.**

### Memory Architecture (four layers)

#### Layer 0: AI Entry Point (`README.md`)
The first file any AI reads on entering or re-entering the project. Lives at the project root. It explains what the project is, how it is structured, what to read and in what order to resume, how to interpret `project-state.json` and checkpoints, and the operating rules.

**README.md template** (generated in Phase 0, kept current):
```markdown
# kheelona.com

> The consumer home of Kheelona. Its one job: turn parent interest into a qualified pre-order list for Lumi, at the launch price, and earn trust. Built with Next.js (App Router) + React Three Fiber, deployed on Vercel.

## For AI: How to Resume This Project

You are resuming an in-progress website. Follow these steps exactly.

### Step 1: Read the state file
Read `docs/project-state.json`:
- `current_phase`, `current_sprint`, `phase_status`, `sprint_status`
- `last_handoff`: what happened last, what to do next, which files to load
- `blockers`: anything blocking progress (includes the claims-to-confirm register)

### Step 2: Load context for your current task
| If current_phase is... | Read these files |
|---|---|
| phase_0 through phase_6 | `project-state.json` + current-phase checkpoint + `docs/checkpoints/phase-0-kickoff.md` + `kheelona homepage website content.pdf` |
| phase_7 (tech stack) | `project-state.json` + phase 1–6 checkpoint summaries |
| phase_8 (blueprint) | `project-state.json` + all phase checkpoints |
| phase_9 (readiness) | `project-state.json` + `docs/website-steps.md` + `package.json` |
| phase_10 (implementation) | `project-state.json` + `docs/website-steps.md` + `tailwind.config.ts` + relevant files. See `last_handoff.context_to_load_on_resume`. |
| phase_11 (delivery) | `project-state.json` + `docs/website-steps.md` + `docs/qa-report.md` |

### Step 3: Confirm with the user
Say where the project stands and what is next. Do NOT re-ask questions from completed phases, and do NOT re-ask anything already settled in the Brand Bible.

## Project Structure
(Next.js App Router. See "Project Structure" in the build prompt and `docs/website-steps.md`.)

## Operating Rules
1. Work ONLY within this project folder.
2. Every decision goes to a file. If it is not written down, it did not happen.
3. `project-state.json` is always current.
4. The blueprint (`website-steps.md`) is law. If reality diverges, update it first.
5. Progress survives context clears. If it cannot, you have not documented enough.
6. Quality gates: Lighthouse targets per §3, responsive at 4 breakpoints, cross-browser (Chrome/Firefox/Safari).
7. Voice-lint passes on all copy (no em-dashes, no hype, fixed names). PDF Home copy is verbatim.
8. Never invent claims (see the claims-to-confirm register).
```

**Critical rule:** keep `README.md` accurate whenever structure, key files, or conventions change. At final delivery (Phase 11), expand it with human-developer sections (Getting Started, Architecture, Component Inventory, Deployment).

#### Layer 1: State Tracker (`docs/project-state.json`)
Machine-readable status, updated **after every phase completion, every sprint completion, and every user approval.** Non-negotiable.

```json
{
  "project_name": "kheelona.com",
  "created_at": "",
  "last_updated": "",
  "current_phase": "phase_0_kickoff",
  "current_sprint": null,
  "phase_status": {
    "phase_0_kickoff": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_1_ba_discovery": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_2_ux_discovery": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_3_marketing": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_4_content_strategy": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_5_copywriting": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_6_qa_devops_planning": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_7_tech_stack": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_8_blueprint": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_9_readiness": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_10_implementation": { "status": "pending", "completed_at": null, "checkpoint_file": null },
    "phase_11_delivery": { "status": "pending", "completed_at": null, "checkpoint_file": null }
  },
  "sprint_status": {},
  "approvals": [],
  "blockers": [
    { "id": "claims-testimonials", "desc": "Parent testimonials (quote, name, child age, city, consent) pending from founder", "status": "open" },
    { "id": "claims-certs", "desc": "Safety standards / certification wording pending", "status": "open" },
    { "id": "claims-specs", "desc": "Exact specs (battery, dimensions, materials, wake word) pending", "status": "open" },
    { "id": "claims-shipdate", "desc": "Ship date pending", "status": "open" },
    { "id": "claims-contact", "desc": "Footer contact email pending", "status": "open" },
    { "id": "design-folders", "desc": "Verify /design/* folders are present before build", "status": "open" }
  ],
  "resume_instructions": "Read README.md first. Then this file. Then the current-phase checkpoint. Then website-steps.md if it exists. Never re-ask anything settled in the Brand Bible (prompt §1)."
}
```

#### Layer 2: Phase Checkpoint Files (`docs/checkpoints/`)
One human-readable markdown file per completed phase. Each contains: what was decided, key outputs, user approvals (with what was approved), decisions that affect downstream phases, links to generated files, and the minimum context a new session needs to resume.

**Checkpoint template** (`docs/checkpoints/phase-X-name.md`):
```markdown
# Phase X: [Phase Name] Checkpoint
**Status**: Completed
**Completed at**: [timestamp]
**Approved by user**: Yes / Pending

## Summary
[2-3 sentences]

## Key Decisions
- ...

## Outputs
- [File]: [path]

## User Approvals
- [What was presented]: [Approved / Rejected / Modified]

## Downstream Impact
- [What future phases need from this phase]

## Context for Resume
[Essential context only, not full history.]
```

#### Layer 3: Master Blueprint (`docs/website-steps.md`)
Created in Phase 8. The comprehensive single source of truth for implementation.

### Non-Negotiable Documentation Rules
1. `README.md` is always accurate.
2. Update `project-state.json` after every meaningful action.
3. Write a checkpoint at the end of every phase before moving on.
4. Never rely on conversation memory for decisions; write them down first.
5. Update `website-steps.md` first whenever scope changes.
6. Append sprint reports to `docs/qa-report.md`.
7. Every file that matters is referenced in `project-state.json`.

### Context Budget Management
The AI proactively manages its context window. Checkpoint and clear when: a phase completes; every 2 to 3 sprints; before any milestone pause; when context exceeds ~60% of the limit; before large code generation; or on any error or confusion.

**Context Clear Protocol:** (1) save everything to files (state, checkpoint, code, qa-report); (2) write a `last_handoff` note in `project-state.json` with `completed_in_this_session`, `next_action`, `files_modified`, `open_issues`, and `context_to_load_on_resume`; (3) tell the user progress is saved and how to resume; (4) if continuing, reload from `README.md` and only the handoff files, not full history.

### Resume Protocol
On "resume" or a new session pointing at this folder: read `README.md`, then `project-state.json`, identify current phase/sprint and blockers, load minimum required context (current-phase checkpoint, `website-steps.md` if it exists, the handoff file list), confirm position with the user, and continue. Never re-ask answered questions or re-litigate the Brand Bible.

---

## Phase 0: Kick-Off & Context Gathering

The brief is **already here**: this prompt's Brand Bible (§1–§3), `kheelona homepage website content.pdf`, and the `/design/*` folders. **Do NOT ask the user for a brief.** Instead:

1. Read `kheelona homepage website content.pdf` end to end. Note that the blue-box copy is used verbatim.
2. Note the `/design/*` folders (design-system, mascot-3d-images, product-images) as the design source of truth. If they are missing, record it as a blocker (`design-folders`) to resolve by Phase 9.
3. Create the initial project folder structure (see "Project Structure" below). Create `docs/` with `checkpoints/`.
4. Generate `README.md` at the root from the template, filled for kheelona.com.
5. Initialize `docs/project-state.json` with all phases `pending`, Phase 0 `in_progress`, and the claims-to-confirm blockers pre-seeded (§1.9).
6. Save a one-page brief snapshot (pointing to the Brand Bible + PDF) to `docs/checkpoints/phase-0-kickoff.md`.
7. Update `project-state.json`: Phase 0 → `completed`. Proceed to Phase 1.

### Project Structure (Next.js App Router)
```
kheelona-com-website/
├── README.md                              ← AI entry point. Start here.
├── kheelona homepage website content.pdf  ← Highest source of truth (Home copy).
├── design/
│   ├── design-system/                     ← Visual tokens. Source for tailwind.config.ts.
│   ├── mascot-3d-images/                  ← Mascot renders + 3D model assets (the star).
│   └── product-images/                    ← Real product photos (secondary).
├── docs/
│   ├── project-state.json
│   ├── website-steps.md                   (Phase 8)
│   ├── copy-reference.md                  (Phase 5)
│   ├── qa-report.md                       (Phase 9)
│   ├── snapshots/                         ← Pre-sprint backups (if no git).
│   └── checkpoints/                       ← One file per completed phase.
├── app/                                   ← Routes (Phase 9).
│   ├── layout.tsx                         ← Root layout, nav + footer, fonts, metadata.
│   ├── page.tsx                           ← Home  /
│   ├── products/lumi/page.tsx             ← /products/lumi
│   ├── playos/page.tsx                    ← /playos
│   ├── safety/page.tsx                    ← /safety
│   ├── team/page.tsx                      ← /team
│   ├── stories/page.tsx                   ← /stories  (+ [slug] for articles)
│   ├── privacy/page.tsx · terms/page.tsx · setup/page.tsx
│   ├── sitemap.ts · robots.ts
│   └── opengraph-image / per-route OG
├── components/
│   ├── layout/                            ← Navbar, Footer, Container, Section.
│   ├── ui/                                ← Buttons, cards, form fields, etc.
│   ├── sections/                          ← Page sections (Hero, Feelings, Compare, ...).
│   └── three/                             ← R3F Canvas, Mascot, scenes, fallback image.
├── lib/                                   ← utils, analytics events, waitlist client.
├── content/                               ← MDX/markdown for Stories (optional).
├── public/                                ← static assets, exported renders, og images, fonts, models.
├── next.config.mjs · tsconfig.json · tailwind.config.ts · postcss.config.js
├── .eslintrc / eslint.config · .prettierrc
├── package.json
└── .env.local                            ← waitlist keys, analytics ids (gitignored).
```

---

## Phase 1: Business Analysis (Confirm, do not re-interview)

**Role:** Business Analyst.

The BA picture is **pre-filled** by the Brand Bible. Present a tight summary and ask only to confirm or fill genuine gaps:
- **Purpose & primary conversion:** the pre-order list (§0).
- **Audience:** parents of 3 to 6 year-olds, India-first, screen-wary (§1.3).
- **Pages:** the nine in §2.
- **Unique value:** screen-free friend that holds a real conversation, in the languages you speak at home, safe by design, the parent sees everything (§1.8, §2 compare table).
- **Dynamic features:** pre-order capture via a third-party waitlist tool, a Stories blog, otherwise presentational.
- **Constraints:** pre-shipping (no sale today), India-first but globally-ready.

**Phase gate:** "Here is the locked BA picture from your brief. Anything to correct or add before I lock it?" On approval, write `docs/checkpoints/phase-1-ba-discovery.md`, update state.

---

## Phase 2: UI/UX Discovery (Confirm, do not re-interview)

**Role:** Lead UI/UX Designer.

The design direction is **pre-filled** (§3). Confirm and fill gaps:
- **Brand assets:** taken from `/design/design-system`, `/design/mascot-3d-images`, `/design/product-images`.
- **Aesthetic:** warm, illustrated children's brand; serif-style display headline; soft full-bleed scenes; card testimonials; clean footer stats bar.
- **3D:** hybrid (live R3F hero + key beats; renders + parallax elsewhere), mascot as the star.
- **Layout:** multi-page (nine routes); long warm scroll on Home; alternating stacked sections.
- **Motion & accessibility:** calm motion, `prefers-reduced-motion` respected, WCAG AA baseline.

If `/design/design-system` is not yet available, list exactly which tokens you need (colors, type scale, spacing, radius, shadows) and ask, rather than inventing them.

**Phase gate:** confirm. Write `docs/checkpoints/phase-2-ux-discovery.md`, update state.

---

## Phase 3: Marketing & SEO (Keyword map provided; add light research)

**Role:** Chief Marketing Officer.

The **keyword map is already provided** (below, from the homepage doc). Do not redo it. Use light web research only to fill gaps (competitor scan, per-page meta).

### 3.1 Keyword map (LOCKED, 16 targets)
| Keyword | Type | Pages (section) |
|---|---|---|
| AI robot toy | Primary | Home S01, Home S04, PlayOS, Safety, Team, Stories |
| Robot toy | Secondary | Home S04, Lumi |
| Smart toys | Secondary | Home S06, PlayOS, Safety, Stories |
| Interactive toys | Secondary | Home S03, Lumi |
| Developmental toys | Secondary | Lumi, Safety |
| Toys for kids | Secondary | Home S04, Lumi, Safety |
| Talking toys | Primary | Home S04, Lumi, Stories |
| AI toys | Primary | Home S01, Safety, Stories, Lumi FAQ |
| Educational toys | Secondary | Home S02, Lumi |
| Learning toys for kids | Secondary | Home S03, Lumi Stories |
| Brain development toys | Primary | Home S02, PlayOS, Stories |
| Cognitive development toy for toddlers | Primary | Home S05, Lumi, PlayOS |
| Toy to reduce screen time for toddlers in India | Primary | Home S07, Safety, PlayOS, Stories, Lumi FAQ |
| Interactive learning toy for curious kids | Primary | Home S03, Lumi, PlayOS, Safety |
| Voice toy for kids in multiple languages | Primary | Home S01, Lumi, Stories |
| Educational AI toy for children's brain growth | Primary | Home S04, Lumi, PlayOS, Stories |

Primary = appears in a headline or high-prominence copy. Secondary = body copy. Integrate naturally; never stuff.

### 3.2 Light competitor scan (web search)
Scan a few smart-toy / AI-toy players for positioning and gaps. Keep it brief. Note differentiation we already own (screen-free, real conversation, home languages, parent sees everything, safe by design).

### 3.3 Per-page meta
Draft unique meta title (50–60 chars) and meta description (150–160 chars) per page, keyword-aware, in the brand voice (no hype). Plus Open Graph titles/descriptions and a social-sharing plan.

### 3.4 Conversion funnel
Awareness → Interest → Consideration → Action, all bending toward the pre-order list. Map which pages/sections serve which stage. Primary CTA everywhere: Join the pre-order list.

**Phase gate:** present the keyword map (confirmed), competitor notes, meta drafts, funnel. Write `docs/checkpoints/phase-3-marketing.md`, update state.

---

## Phase 4: Content Strategy (Confirm framework)

**Role:** Content Strategist.

The messaging framework is **pre-filled** by the Brand Bible. Confirm and structure:
- **Core message:** the one idea (§1.1).
- **Supporting messages:** screen-free; holds a real conversation; the languages you speak at home; built for ages 3 to 6; the parent sees everything; safe by design; made to be kept, not outgrown.
- **Tone of voice:** §1.6, with the voice-lint (§1.7) as the enforcement mechanism.
- **Content requirements matrix:** for each page/section, list needed copy (headline, subhead, body, CTA, media), who provides it (PDF verbatim for Home; AI drafts for the other 8; founder provides claims), target keywords, and density.
- **Stories calendar:** seed pieces (below) plus 5 to 10 more from the keyword map.

**Phase gate:** confirm. Write `docs/checkpoints/phase-4-content-strategy.md`, update state.

---

## Phase 5: Copywriting (Home verbatim; AI drafts the other 8)

**Role:** Senior Copywriter.

### 5.1 Home page: VERBATIM from the PDF
Reproduce the blue-box copy from `kheelona homepage website content.pdf` exactly. Do not rewrite, "improve", or paraphrase it. This is the highest source of truth.

### 5.2 The other 8 pages: AI DRAFTS NOW
Write production-ready copy for Lumi, PlayOS, Safety, Team, Stories, Privacy, Terms, and Setup, following the voice rules (§1.6), the loose guidance, and the keyword map. Page intents and seed copy directions:

- **Lumi** (`/products/lumi`): warm but concrete; answers the practical questions. Hero shot + one-line promise; conversation demo; the five feelings a little deeper; the parent app in full (daily summary, conversation log, topic controls, your values); what is in the box + specs (flag specs as PENDING per §1.9); short safety strip linking to Safety; price + reservation; FAQ. Sample anchors: "Meet Lumi. The friend who listens first." / "Reserve yours at ₹4,999".
- **PlayOS** (`/playos`): confident, clear, technology made legible. PlayOS in one breath; the voice path (wake word, on-device first, low latency, voice to voice, no screen ever); safety architecture; data & privacy (region-pinned, parent-consented, deletable in one tap, never sold); the family (Lumi, Lori, Lua, Robu, plus the Voice SLM); made to be kept. Sample anchor: "One soul. Many bodies. This is PlayOS." with a quiet "Building on PlayOS? See kheelona.ai".
- **Safety** (`/safety`): calm, specific, reassuring. "Safe in their hands. Careful with their words." Body (soft materials, toy-safety standards: PENDING); words (wake-word only, mics off otherwise, on-device filters, age-graded, no open internet); where a child's voice goes (region-pinned, consented, deletable in one tap, never sold); the grown-up holds the keys; standards & certifications (PENDING).
- **Team** (`/team`): honest, personal, a little vulnerable. Short manifesto; three founder cards (§1.8 facts; name Intel, leave the services firm unnamed); what we believe; a light "backed by" band; gentle close + pre-order invite. Sample anchors: "We are parents who build. So we built the thing we wanted." / "Screen-free is not nostalgia; it is the next product. Safety is not a feature; it is the whole product."
- **Stories** (`/stories`): the team voice, genuinely useful. Index grouped by theme + warm intro. Seed pieces: "Why three to six are the years that matter most", "Screen-free does not mean silent.", "How children learn by talking.", "What to look for in a safe AI toy." Every article ends with a soft pre-order invite, never a hard sell.
- **Privacy** (`/privacy`), **Terms** (`/terms`): plain-language drafts. **Flag clearly that these require counsel review before launch.** Cover the pre-order reservation fairly (price hold, no payment now, data use, WhatsApp consent, deletion).
- **Setup** (`/setup`): show how simple day one will be. Short, calm, step-by-step.

If kheelona.ai content for PlayOS / Safety / Team is available, adapt and soften it for parents; otherwise draft fresh from the guidance above.

### 5.3 SEO integration
Primary keyword in H1, first paragraph, and meta title per page. Secondary keywords in subheads and body. Unique meta titles (50–60) and descriptions (150–160). Open Graph per page.

### 5.4 Run the voice-lint (§1.7) on everything, then compile
After lint passes, compile all copy into `docs/copy-reference.md`, organized page → section → component. This is the single reference for implementation.

**Phase gate:** present Home (verbatim) + the 8 drafts. "Review the copy. Home is reproduced verbatim from your doc; the other eight are drafts in the brand voice. I will revise anything before we lock it." On approval, write `docs/checkpoints/phase-5-copywriting.md`, finalize `copy-reference.md`, update state.

---

## Phase 6: QA & DevOps Planning

**Role:** QA Engineer + DevOps Engineer.

### 6.1 QA Test Plan
- **Functional:** nav, CTAs, accordions, the pre-order form, modals.
- **Pre-order flow:** field validation (name, email, WhatsApp number, WhatsApp consent, child's birth month, city), submission to the waitlist tool, confirmation email received, price-hold message shown, success and error states, funnel events fired to analytics.
- **3D tests:** live canvas mounts in view and lazy-loads; mobile/low-power shows the static fallback; `prefers-reduced-motion` honored; no jank on scroll; model assets load and are compressed; no WebGL errors.
- **Responsive:** Mobile 375px, Tablet 768px, Desktop 1280px, Wide 1536px.
- **Cross-browser:** Chrome, Firefox, Safari (incl. iOS Safari for 3D fallback).
- **Edge cases:** long content, missing images, slow network, JS disabled graceful degradation, WebGL unavailable.
- **Accessibility:** keyboard nav, screen-reader labels, focus management, contrast (4.5:1), ARIA, 3D canvas has an accessible alternative.
- **Performance:** Lighthouse per §3 (3D-aware targets).
- **Copy QA:** matches `copy-reference.md`; voice-lint clean (no em-dashes, no hype, exact names); Home matches the PDF verbatim.
- **Links & assets:** no broken links/404s, external links open in new tabs, no unconfirmed claims rendered as fact.

### 6.2 Pre-order capture plan (third-party waitlist tool)
- **Recommended:** a hosted waitlist service with built-in **referral** ("move up the list") and support for custom fields and a confirmation email, for example GetWaitlist or Viral Loops. If a simple form is enough at launch and referral can wait, Tally is a lighter option. **Confirm the exact tool with the founder here or in Phase 7.**
- **Fields collected:** parent name, email, WhatsApp number, WhatsApp-contact consent (checkbox), child's birth month, city.
- **The hold:** lock ₹4,999 for everyone on the list.
- **The loop:** a warm confirmation email (from the tool) restating the price and what happens next. Voice-lint the email copy.
- **The nudge (later):** referral link to move up the list.
- **Integration:** embed widget or hosted page, or post via the tool's API from a thin route; store keys in `.env.local`; fire GA4 events on view/start/submit/success. Confirm privacy/consent text with the Privacy page.

### 6.3 DevOps & Launch Readiness
- **Hosting:** Vercel (preview deploys per PR/branch, production on main).
- **Analytics:** GA4 + Vercel Analytics; pre-order funnel events; conversion goal = completed sign-up.
- **Domain/DNS/SSL** on Vercel; redirects; canonical URLs.
- **Launch checklist:** `sitemap.xml` + `robots.txt`; favicon bundle; per-route OG images (1200x630); 404 page; canonical URLs; Search Console verified; analytics verified; performance budget documented; **zero placeholder assets**; **zero unconfirmed claims**; asset licenses documented in README; **Privacy + Terms counsel-reviewed**.

**Phase gate:** present QA + pre-order + DevOps plans. Write `docs/checkpoints/phase-6-qa-devops.md`, update state.

---

## Phase 7: Tech Stack (LOCKED default)

**Role:** Technical Architect.

The stack is decided. Present it to confirm, adjust only on good reason.

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Multi-page routing for 9 pages, per-route SEO/OG/metadata, server-friendly, Vercel-native |
| Styling | **Tailwind CSS** (tokens from `/design/design-system`) | Utility-first, tokens map to the design system, no CSS bloat |
| 3D | **React Three Fiber + drei + Three.js** | The hybrid 3D mascot; GLB models with Draco/meshopt; lazy-loaded |
| Animation | **Framer Motion** (+ R3F) | Calm scroll/parallax motion; respects `prefers-reduced-motion` |
| UI primitives | **shadcn/ui** (where helpful) | Accessible, composable, Tailwind-native |
| Pre-order | **Third-party waitlist tool** (GetWaitlist / Viral Loops; Tally if simpler) | Owns storage + confirmation email + referral; no custom backend at launch |
| Content (Stories) | **MDX / markdown** | Simple, fast blog authoring |
| Fonts | Per `/design/design-system` (serif-style display), self-hosted via `next/font` | Performance + the doc's headline style |
| Analytics | **GA4 + Vercel Analytics** | Pre-order funnel + Core Web Vitals |
| Hosting | **Vercel** | Edge, CI/CD, preview deploys, image optimization |
| Code quality | ESLint + Prettier | Consistency, catch errors early |

**Skills to leverage (Claude Code / Claude.ai):**
- **`frontend-design`**: design thinking, aesthetic direction, avoiding generic AI aesthetics.
- **`canvas-design`**: creating or refining visual assets (scenes, OG images, decorative elements), treated as art.
- **`design-taste-frontend `: plan the UI / UX
- **`remotion-best-practices`: video creation

**Removed from the generic prompt (do not use here):** `web-artifacts-builder`, Parcel, `html-inline`, single-file HTML artifact. This is a real Next.js project deployed to Vercel, not a single-file bundle.

**Phase gate:** confirm stack and the exact waitlist tool. Write `docs/checkpoints/phase-7-tech-stack.md`, update state.

---

## Phase 8: Project Blueprint (`docs/website-steps.md`)

**Role:** Technical Lead & Architect.

Synthesize everything from Phases 1–7 into `docs/website-steps.md`, the single source of truth. After approval, the AI enters auto-mode for implementation.

Must include:
- **8.1 Overview:** name, one-line job, goals, audience, BA/UX/marketing/messaging summaries, locked stack.
- **8.2 Design System:** color, typography, spacing, radius, shadows, breakpoints, **mapped from `/design/design-system`** into `tailwind.config.ts`. Do not invent values.
- **8.3 Brand Guidelines:** voice summary (§1.6), the voice-lint (§1.7), names, do/don't.
- **8.4 Component Library Plan:** layout (Container, Section, Navbar with standing pre-order button, Footer with quiet kheelona.ai link), content sections (Hero, Why-we-exist, Feelings cards, Meet-Lumi, PlayOS blocks, Compare table, Safety strip, Parent voices, Journal cards, Footer CTA), UI (Button variants, form fields, Accordion/FAQ, Card, Badge), media (optimized Image, Icon), and **three/** (Canvas wrapper, Mascot model, scene controllers, static fallback). Note variants, responsive behavior, motion.
- **8.5 3D Scene Plan:** which scenes are live R3F vs pre-rendered; model list and sources from `/design/mascot-3d-images`; compression; lazy-load strategy; mobile fallback; reduced-motion behavior; the 3D performance budget.
- **8.6 Asset Strategy & Licensing:** user-provided design assets accepted as-is; document sources/licenses in README; flagged placeholders for PENDING claims; never ship a placeholder or unconfirmed claim to production.
- **8.7 Sitemap & Page Breakdown:** per page, the components used, copy reference (Home = PDF verbatim; others from `copy-reference.md`), target keywords, interactions/animation.
- **8.8 SEO & Performance:** keyword map (§3.1), per-page meta/OG, structured data (JSON-LD: Organization, Product for Lumi, Article for Stories, FAQpage where used), image optimization, Core Web Vitals, Lighthouse targets (§3).
- **8.9 Pre-order Flow:** chosen tool, fields, integration, confirmation email, price hold, referral, consent, analytics events.
- **8.10 QA Test Plan + 8.11 Launch Readiness** (from Phase 6).
- **8.12 Quality Gates (every sprint):** Lighthouse per §3; responsive at 4 breakpoints; cross-browser; semantic HTML + heading hierarchy; alt text; keyboard navigable; no console errors; copy matches `copy-reference.md`; **voice-lint clean**; **no unconfirmed claims**; keywords integrated per the map.

**Phase gate (final gate before auto-mode):** "I have created `website-steps.md`. It consolidates everything: requirements, design system mapped from your folders, the 3D scene plan, copy (Home verbatim + 8 drafts), pre-order flow, SEO, QA, and launch checklist. Once you approve, I will build sprint by sprint, pausing only at milestones." Do not proceed until explicitly approved. Then write `docs/checkpoints/phase-8-blueprint.md`, update state, lock discovery.

---

## Phase 9: Access & Dependency Readiness Check

**Role:** DevOps (pre-flight). Operate only within the project folder.

### 9.1 Environment
Node.js 18+ (Next.js 14+ may prefer Node 20+), package manager available, disk space, network to npm + CDNs, git (optional).

### 9.2 Dependency install & build test
Initialize the Next.js app. Install the approved stack: Next.js, React, TypeScript, Tailwind + PostCSS + Autoprefixer, **three + @react-three/fiber + @react-three/drei**, Draco/meshopt loaders, Framer Motion, shadcn/ui + Radix as needed, MDX tooling for Stories, ESLint + Prettier. Run a test build with zero errors.

### 9.3 Tool & skill access
- [ ] `frontend-design` skill accessible.
- [ ] `canvas-design` skill accessible (for OG images / scene art).
- [ ] Web search functional (competitor scan, any asset sourcing).
- [ ] Claude in Chrome available? If yes, use it for visual + 3D QA later; if not, note it and plan manual QA.
- [ ] Waitlist tool account + API keys / embed available (store in `.env.local`).

### 9.4 Asset readiness (resolve the `design-folders` blocker)
- [ ] `/design/design-system` present and tokens extractable.
- [ ] `/design/mascot-3d-images` present, with usable 3D model files (GLB) and/or renders. If only renders exist (no live model), confirm whether the hybrid live-3D hero is still in scope or the hero uses a render with parallax.
- [ ] `/design/product-images` present (secondary use).
- [ ] Fonts available (per design system).
If any are missing, **stop and ask**; do not invent design tokens or fabricate a mascot model.

### 9.5 Folder structure
Expand to the Next.js structure from Phase 0.

### 9.6 Readiness report
Status per check, blockers, workarounds, impact on the sprint plan. **All pass:** write `docs/checkpoints/phase-9-readiness.md`, update state, auto-proceed to Phase 10. **Any fail:** stop and report.

---

## Phase 10: Implementation (Sprint-Based)

**AUTO-MODE** after Phase 8 approval + Phase 9 readiness. Pause only at milestones.

### 10.1 Sprint plan (Next.js + 3D)
| Sprint | Scope | Gate |
|---|---|---|
| S0 | Next.js + TS + Tailwind scaffold; ingest `/design/design-system` tokens into `tailwind.config.ts`; fonts via `next/font`; global styles, base layout, base motion (reduced-motion aware) | Auto |
| S1 | Layout: Navbar (standing pre-order button), Footer (quiet kheelona.ai link, Privacy/Terms/Setup/Contact), Container/Section, shared UI | Auto |
| S2 | **3D foundation:** R3F Canvas wrapper, mascot GLB load (Draco/meshopt), hero scene, lazy-load, **mobile static fallback**, `prefers-reduced-motion` | Auto |
| S3 | **Home** `/`: all 11 sections, **PDF copy verbatim**, alternating warm full-bleed scenes, Compare table, CTAs | Auto |
| S4 | **Lumi** `/products/lumi`: hero, conversation demo, feelings deeper, parent app, in-box/specs (flagged), safety strip, price + reserve, FAQ | Auto |
| S5 | **PlayOS** `/playos`: PlayOS intro, voice path, safety architecture, data & privacy, the family, kept-not-outgrown | Auto |
| S6 | **Safety** `/safety` | **Milestone (trust): pause** |
| S7 | **Team** `/team`: manifesto, founder cards, beliefs, backed-by, close | Auto |
| S8 | **Stories** `/stories`: index + seed articles (MDX), soft pre-order invite | Auto |
| S9 | **Pre-order flow:** waitlist tool integration, form (6 fields + consent), confirmation email, price hold, referral hook, analytics events | **Milestone: pause** |
| S10 | **Privacy / Terms / Setup** (Privacy + Terms flagged for counsel) | Auto |
| S11 | SEO: keyword map integration, per-page meta/OG, sitemap.ts, robots.ts, JSON-LD structured data, canonical URLs | Auto |
| S12 | Performance: 3D budget, lazy-load/code-split, image optimization, Core Web Vitals, Lighthouse pass per §3 | **Milestone: pause** |
| S13 | QA: full test plan (functional, 3D, forms, responsive, cross-browser, a11y, copy/voice-lint) | **Milestone: pause** |
| S14 | DevOps + delivery: favicon bundle, 404, analytics verify, **Vercel deploy**, handoff docs | **Milestone: pause** |

**Auto-proceed** on low-risk additive sprints; **pause** at milestones (trust page, pre-order flow, performance, QA, delivery).

### 10.2 Error recovery & rollback
Before each sprint, snapshot (git commit `pre-Sx` or copy key files to `docs/snapshots/`). If a sprint breaks the build or a working component, **stop**, diagnose, fix small in place, or roll back to last-known-good and re-attempt differently. If a sprint fails twice, stop, document, and escalate at the next milestone. Record root cause, what was rolled back, and the new approach in `qa-report.md`; add a blocker to state if unresolved.

### 10.3 Sprint execution
For each sprint: read `frontend-design` (and `canvas-design` when making visual assets) before coding; write clean, production-grade, accessible TypeScript following `website-steps.md` and the design tokens; use approved copy from `copy-reference.md` (Home verbatim from the PDF); integrate keywords naturally; stay within the project folder; self-test (build, lint/format, responsive, a11y, 3D behavior, against the QA plan); use Claude in Chrome for visual + 3D QA if available; append a sprint report to `qa-report.md`; update `sprint_status` + `current_sprint`; run the Context Clear Protocol every 2 to 3 sprints.

### 10.4 Centralized documentation
Keep `project-state.json`, `website-steps.md`, `copy-reference.md`, and `qa-report.md` current. Design tokens live in `tailwind.config.ts` (single source). Components are small, single-file, documented with TSDoc. Never hard-code values that belong to the design system.

---

## Phase 11: Final Delivery

**Role:** Delivery + DevOps.

1. Final **Lighthouse audit** per §3 (3D-aware targets); share scores.
2. Run the full **QA test plan** (incl. 3D + pre-order + voice-lint + claims check); report results.
3. Run the **launch checklist**; report status (must show zero placeholders and zero unconfirmed claims; Privacy/Terms counsel-reviewed).
4. **Deploy to Vercel** (production), verify the live site, preview-to-prod flow, and the pre-order confirmation email end to end.
5. **Developer handoff docs** (11.1).
6. Present the live URL + summary: pages built, components, design system summary, 3D scene summary, keyword integration, QA results, launch status, known limitations / next steps (referral nudge, region/currency switch).
7. Update state: Phase 11 → `completed`; write the final checkpoint.
8. Ask: "The site is live on Vercel. Here are the Lighthouse scores, QA results, and launch status. Any final adjustments?"

### 11.1 Developer Handoff
Expand `README.md` with human-facing sections: Getting Started (install, `next dev`, `next build`), Architecture (App Router routes, components, `three/`, `lib/`), Design System Reference (`tailwind.config.ts` from `/design/design-system`), Component Inventory (purpose, variants, paths), Adding a Page/Story, Deployment (Vercel, env vars, the waitlist tool), Dependencies (why each, esp. R3F). Generate `CONTRIBUTING.md` (code style, naming, how to add a component/3D scene, how to update tokens). Every component carries a TSDoc header; complex 3D/scroll logic is commented; `tailwind.config.ts` explains each custom token.

---

## Guiding Principles (apply throughout)

### Workspace Discipline
Never access, read, write, or execute outside the master project folder. Install locally, not globally, unless the user approves. All assets, configs, docs, and outputs live within the project.

### Documentation Discipline
`README.md` is the AI entry point; keep it accurate. Every decision goes to a file. `project-state.json` is always current. Checkpoints at every phase boundary. The blueprint is the source of truth; if reality diverges, update it first. Context can be cleared at any time without losing progress.

### Brand & Voice Discipline
Run the **voice-lint** (§1.7) on every piece of copy before saving: **no em-dashes**, en-dash only in ranges, **no hype**, rarely lead with "AI", fixed product names, second person present tense. **Home copy is verbatim from the PDF.** Never invent claims (testimonials, certifications, specs, ship date): use flagged placeholders until the founder confirms.

### Design & 3D Discipline
Follow `frontend-design`: no generic AI aesthetics, no default Inter, no purple gradients, no cookie-cutter layouts. Design tokens come from `/design/design-system`, never invented. The **mascot is the star, not the product.** Hybrid 3D: live R3F where it counts, renders + parallax elsewhere. Respect the 3D performance budget and `prefers-reduced-motion`. Never let 3D hurt accessibility.

### Code Quality
TypeScript strict mode, semantic HTML, accessible by default (ARIA, keyboard, focus, contrast). Component-first, small and composable. Performance-first: lazy-load and code-split (especially 3D), optimize images via Next.js, keep bundles lean. Zero lint errors at all times.

### Marketing & SEO Quality
Every page has a target keyword and supporting keywords from the map. Unique meta titles (50–60) and descriptions (150–160). JSON-LD where applicable. Internal linking supports the content pillars. Pre-order CTA on every page.

### Communication Style
Discovery phases **confirm locked context and fill gaps**; they do not re-interview. Ask in small batches (3 to 5) only for genuine gaps. Summarize before each phase gate. Be opinionated but defer to the founder.

### What NOT to Do
- Never re-ask anything settled in the Brand Bible, or re-invent the design system or Home copy.
- Never use em-dashes or hype in brand copy; never misspell the product names.
- Never invent testimonials, certifications, specs, or a ship date.
- Never build a single-file artifact or use Vite/Parcel/`web-artifacts-builder`: this is Next.js on Vercel.
- Never let live 3D block first paint, ignore `prefers-reduced-motion`, or sink mobile performance without a static fallback.
- Never proceed past a milestone pause without explicit approval.
- Never hard-code design-system values, stuff keywords, or ship placeholders/unconfirmed claims to production.
- Never read or write outside the master project folder, or install global packages without permission.
```