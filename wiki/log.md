---
title: Log
type: log
updated: 2026-10-10
sources: [raw/brief/kickoff-brief.md]
---

# Log

Append-only. Newest at the bottom. Each entry starts `## [YYYY-MM-DD HH:MM] <type> | <summary>`,
where type is one of ingest, decision, agent, build, qa, gate, deploy, lint, cleanup. Times are
the working machine's local clock (PDT). Recent history: `grep "^## \[" wiki/log.md | tail -20`.

## [2026-10-10 17:30] ingest | Kickoff brief received and read
The founder's CTO kickoff brief (`KICKOFF.md`) arrived with the positioning PDF and docx and the new
design system folder `Kheelona-Design-System-v-Oct-26` (v11, exported 10 Oct 2026, 643 files, 54 MB).
Checked before acting: repo `Kheelona/website` is PUBLIC; `main` = `origin/main` = `77552ff`
(production); the checkout was on `redesign-mockup-2026-10` (PR #16, open, never deployed);
`package.json` and the lockfile are identical between the two, so `node_modules` stays valid.

## [2026-10-10 17:33] decision | Archive tags pushed, branch reset/website-v2 created from production
`archive/pre-reset-2026-10-10` = `77552ff`, `archive/mid-version-2026-10-10` = `50827d1`, both pushed.
[D001](decisions/D001-branch-and-archive.md), [D002](decisions/D002-mid-version-identified.md).

## [2026-10-10 17:35] ingest | Brief, positioning docs and DS moved into place, byte-identical
[D003](decisions/D003-inputs-moved-not-copied.md). SHA-256 before and after matched for all three
raw inputs and all 643 DS files.

## [2026-10-10 17:37] build | DS checksum manifest, verify script and deny rules
[D005](decisions/D005-ds-integrity-tooling.md). `node scripts/ds-checksums.mjs` passes 643/643;
the control (one byte changed in a copy) fails as it should.

## [2026-10-10 17:39] ingest | Auto-memory copied to raw/legacy-memory before any pruning
16 files from the project auto-memory copied byte-identical to `raw/legacy-memory/auto-memory/`.
No `~/.claude/CLAUDE.md` exists. Five user-level plans in `~/.claude/plans/` mention Kheelona:
read-only, not touched, reported to the founder.

## [2026-10-10 17:40] agent | Phase 0 inventory workflow launched (9 specialists + completeness critic)
Owners: legacy-memory, legacy-laws, positioning, design-system, product, checkout, tracking, urls,
cleanup. Each writes only its own pages (ownership map in [index](index.md)).

## [2026-10-10 17:41] decision | wiki/ and design-system/ held out of git pending Q1
[D004](decisions/D004-internal-material-uncommitted.md). Guarded in `.gitignore`.

## [2026-10-10 18:31] agent | Phase 0 inventory workflow finished: 10/10 agents, 22 pages, 99 questions
Pages: legacy (memory summary, settled decisions, laws summary), engineering/lessons, brand (4),
design-system (5), product (facts, claims, age review, pricing, policies), site (checkout, tracking
inventory, url map), legacy/cleanup. The completeness critic returned 28 findings (2 blockers, 10
major, 16 minor). Run `wf_fee145da-3a0`; roster updated.

## [2026-10-10 18:33] decision | DS deny rule anchored; design-system pages moved into the wiki
The unanchored `Edit(design-system/**)` also matched `wiki/design-system/`, so the DS agent staged
its pages in the scratchpad and stopped, correctly. The rule is now `Edit(/design-system/**)`;
controls show the DS refused and the wiki page reachable. [D005](decisions/D005-ds-integrity-tooling.md) revised.

## [2026-10-10 18:36] ingest | open-questions.md written: 99 agent questions merged into 5 + 13 + 11 + 10 + 4
A (answer now) Q1-Q5, B facts F1-F13, C Gate A decisions G1-G11, D founder checks C1-C10, E decided
by the brief ([D009](decisions/D009-brief-readings.md)).

## [2026-10-10 18:37] agent | Phase 0 wiki fix pass launched (7 page-group owners + lint verifier)
Run `wf_9b4dc490-980`. Applies the critic's findings and the citation convention
([D008](decisions/D008-citation-convention.md)).

## [2026-10-10 18:38] cleanup | 423 tracked files (238 MB) deleted, commit 9059894
[D006](decisions/D006-cleanup-executed.md). Build passes, 118 files / 1,346 tests pass (126 at the
tag minus 8 deleted with ambient-stage), tsc clean after the stale `.next/` of the mid version was
rebuilt. Five local branches deleted (four merged; the mid version is held by its tag).

## [2026-10-10 18:40] build | Schema committed (b163b5c): CLAUDE.md, agents, rules, deny rule, checksum script
CLAUDE.md is 63 lines (was 908) and keeps the live pixel id
([D007](decisions/D007-claude-md-keeps-pixel-id.md)). AGENTS.md now points structure at Phase 4.
Auto-memory: 16 files verified byte-identical in `raw/legacy-memory/`, originals pruned, MEMORY.md
is a pointer to the wiki. Nothing pushed.

## [2026-10-10 18:57] agent | Phase 0 wiki fix pass finished: 51 findings resolved, verified
Run `wf_9b4dc490-980`, 8/8 agents. The lint verifier confirmed every RESOLVED claim on the pages
and checked 803 links (0 broken) and front matter on all 38 pages. Polish applied by the
orchestrator: 7 sharper anchors, two restated facts replaced with links (DS price rules, balance
webhook trail), one unusable SKM figure marked. Nine new questions merged into
[open questions](open-questions.md) (Q3 count 15 not "about ten"; a fourth SKM source "the deck";
manufacturer in JSON-LD; team-bio proof; balance-payment measurement; old-pixel and Installation
Health checks; DS child voice 6-7 and retired microphone wording in the DS).

## [2026-10-10 18:59] lint | Phase 0 lint clean; scripts/wiki-lint.mjs added (commit ef0a71f)
`node scripts/wiki-lint.mjs`: 38 pages, front matter complete, every link resolves. Control: a
missing key, file and anchor all fail it. `node scripts/ds-checksums.mjs`: 643/643.
Note: some pages date live reads 2026-10-11 (UTC); the project date is 2026-10-10 (machine local).

## [2026-10-10 19:05] decision | No agent drives the founder's logged-in browser; exports requested instead
Search Console, Keyword Planner and GA4 need the founder's Google login. Acting under those
credentials while the founder may be away is not within the brief's autonomy (brief 10: ask when
something needs credentials or access), so Phase 1 uses recorded legacy findings plus public
sources, and the exports are requested as [C11](open-questions.md).

## [2026-10-10 19:06] agent | Phase 1 discovery workflow launched (11 agents in 4 streams + critic)
Run `wf_f0e4e8b2-9ab`. PostHog Analyst + an adversarial number verifier; Market Research in three
site groups (global DTC, Indian D2C, kids/toy/ed-tech + positioning competitors) + synthesis;
Search & AI Visibility (demand, AEO/GEO) + keyword-map synthesis; QA baseline on production
(Lighthouse 13.4.1 median of 3, links, metadata, schema, axe at 390/1280, 360x640 checks). Agents
use the `.claude/agents/` definitions where the runtime resolves them.

## [2026-10-10 19:28] decision | Founder answered Q1, Q2, Q3, Q5 and part of Q4
Q1 (c): commit wiki/ and design-system/ publicly ([D010](decisions/D010-wiki-and-ds-committed-publicly.md));
secret and personal-data scan clean before staging. Q2: PR #16 closed with a pointer to the tag;
remote branches redesign-mockup-2026-10, lumi-rabbit, security-hardening deleted. Q3: hold
production until Gate B, review locally ([D011](decisions/D011-production-held-until-gate-b.md)).
Q4: the founder read "the deck" as the investor pitch deck: `pitch-deck/` moved to the macOS Trash
(restorable), never to be pushed; SKM's source documents re-asked with clarity. Q5: about 840 MB
of regenerable caches deleted; originals kept ([D012](decisions/D012-founder-answers-q2-q4-q5.md)).
The founder asked for remaining questions one at a time in chat.

## [2026-10-10 19:45] decision | Internal vs external content boundary (founder); Q4 closed
The founder: the research figures are internal; publish only what the ICP needs; this is a sales
website. [D013](decisions/D013-internal-vs-external-content.md) and the new
[content boundary](site/content-boundary.md) page. Copywriter, CMO Reviewer, Search & AI
Visibility, Architect and QA definitions now enforce it. Classification workflow `wf_68f4ef5c-ad8`
tags every fact, claim and message EXTERNAL / EXTERNAL IF CONFIRMED / INTERNAL / BANNED, with an
adversarial leak check.

## [2026-10-10 19:55] decision | Push the branch as a backup with Vercel builds off for reset/* (founder, option a)
[D014](decisions/D014-branch-pushed-no-previews.md). `vercel.json` rule added and checked with
minimatch (matches `reset/website-v2`, not `main`); `test/store-secrets.test.ts` passes.

## [2026-10-10 20:15] build | Push of reset/website-v2 FAILED three times (HTTP 408); nothing new on GitHub
Pack to send: 53.9 MB (mostly design-system images). Upload speed 15.8 Mbps (networkQuality), so
bandwidth is not the cause: the HTTPS POST stalls (4m31s) and GitHub answers 408. Tried: default,
`http.postBuffer=524288000` + low-speed limits, and `http.version=HTTP/1.1`: all 408. SSH: both
aliases in ~/.ssh/config (`github-kheelona`, `github-personal`) are refused (publickey), so SSH
needs the founder to register a key. Remote has only `main`; GitHub deployments list unchanged
(latest still the mid version, 2026-10-05). Constraint: do NOT push intermediate commits as the
branch head: only the head `1743f16` carries the vercel.json `reset/*` no-deploy rule, so earlier
heads would trigger Vercel previews. Options next: founder adds the Kheelona SSH key to GitHub;
or push the big objects under a non-branch ref first; or try from another network.

## [2026-10-10 20:40] agent | D013 classification finished: no leaks; corrections and 9 rulings queued
Run `wf_68f4ef5c-ad8` (3/3). Brand pages: an INTERNAL note on positioning, audience and voice;
messaging has a Site column on 10 tables. facts.md and claims.md have Site columns (facts 54 rows,
claims 69). Verifier: **0 leaks**; about 10 externals looser than the owner rules (e.g. "asks back",
Harvard line without "a caring adult", unread public research, the live tutor/best-friend lines
should be BANNED, "lessons" in Story mode); 6 over-classifications ("never sold" is documented on
live /privacy, so EXTERNAL; "3+" as a safety age grade is F4, not BANNED; "Own the model" belongs
to G8); about 20 unclassified lines (voice.md:89 recommends a BANNED line). Founder rulings R1-R9
added to [open questions](open-questions.md) section F. Rule-conformant corrections: next fix pass.
Public-research sources not yet read: the Copywriter reads and cites them before use (no founder
question needed).

## [2026-10-10 22:30] agent | Session limit cut Phase 1 and the brand fix; completion run launched
Account limit hit around 21:00: of Phase 1 `wf_f0e4e8b2-9ab`, only the PostHog audit, its verifier
and the two search gatherers finished. On disk and reused: 19 benchmark folders with screenshots
(5 with notes), 60 Lighthouse runs + axe + HTML + screens, 34 search raw captures. The brand-page
boundary fix (`wf_2678bf5d-79b`) was cut; the product-page fix finished. Completion run
`wf_08ea6a36-c38` (9 agents): notes for 15 sites, QA baseline write-up, keyword map, PostHog fixes,
brand fix, then benchmark synthesis and the critic.

## [2026-10-10 22:32] ingest | PostHog audit (verified) and search raw ingested into open questions
PostHog audit: 802 human sessions 2026-09-19..10-10; 76% phone (paid 99%); 360 px widest share
(31%); WhatsApp in-app browser 36% of phone sessions; funnel 802 > 91 store > 10 form > 5 orders >
2 paid; paid social 414 sessions, 0 orders, median 7 s, all landed on Home; all 3 unpaid orders in
in-app browsers. Verifier: 33 checks, about 120 values, matches except 7 scope/wording slips
(being fixed). New items: C12-C16, G12-G14, R10; C5, C6, C7, C11 extended.

## [2026-10-10 22:40] decision | Push deferred: keep the branch local, retry from another network (founder)
[D014](decisions/D014-branch-pushed-no-previews.md) updated. The `reset/*` no-deploy rule stays.
The project's agent definitions are now registered as agent types in this session.

## [2026-10-10 22:45] decision | Only the founder signs off copy (founder, option c)
[D015](decisions/D015-founder-signs-off-copy.md). CMO Reviewer definition updated; SKM-owned
questions now go to the founder.

## [2026-10-10 22:50] decision | R7 brain wording = (b): honest promise, "brain development" as a topic (founder)
[D016](decisions/D016-brain-wording.md). To apply to claims, messaging and positioning once the
completion run releases those pages.

## [2026-10-10 22:55] decision | R1 = (c): live, founder-approved behaviour claims confirmed (founder)
[D017](decisions/D017-live-behaviour-claims-confirmed.md). Scope: claims live on production;
positioning-only claims (weekly report, mood reading) still need confirmation.

## [2026-10-10 23:00] decision | No wake word: the mic is on only after a press of the wake-up button (founder)
[D018](decisions/D018-wake-up-button.md): new product fact, wording rules (mechanism, not "no
risk"; no hardware claim unless confirmed), and draft lines. Supersedes R2 and every wake-word
line. Asking next: how long the mic stays on after a press, and whether a light shows.

## [2026-10-10 23:05] decision | Wake-up button: one press starts a conversation; mic off after about a minute of quiet (founder)
[D018](decisions/D018-wake-up-button.md) updated with the mechanism and revised draft lines.
Still unknown: a listening light or sound (asked next).

## [2026-10-10 23:08] decision | A light shows while Kheelu's microphone is on (founder)
[D018](decisions/D018-wake-up-button.md): new trust line "You'll always see when Kheelu is
listening." Colour unspecified, so copy never names one.

## [2026-10-10 23:12] decision | Voice uses multiple outside providers; "only our own servers, in India" retired (founder, R3)
[D019](decisions/D019-voice-providers.md). No processing claim is published until the provider
facts (location, retention, training, contracts) are confirmed; asked next.

## [2026-10-10 23:16] decision | Provider terms confirmed; "we don't sell your data" confirmed (founder)
[D020](decisions/D020-provider-terms-and-no-sale.md): process only to reply, keep nothing, never
train, by contract. Open in F5: processing location; transcript retention.

## [2026-10-10 23:18] decision | All voice processing is on servers in India, for every provider (founder)
[D020](decisions/D020-provider-terms-and-no-sale.md) updated; the providers line now says "on
servers in India". F5 narrowed to transcript retention.

## [2026-10-10 23:21] decision | Transcript retention: 36 months, then automatic deletion (founder); F5 closed
[D020](decisions/D020-provider-terms-and-no-sale.md) now holds the whole voice-and-data answer.
The same period becomes the DPDP retention line on /privacy (counsel review stays with F2).

## [2026-10-10 23:25] decision | Returns: 7 days, no questions asked, opened OK if undamaged and complete (founder)
[D021](decisions/D021-returns-policy.md). Applied reading: 7 days from delivery. F1 narrowed to
warranty, replacement, pickup cost and refund speed.

## [2026-10-10 23:30] decision | Warranty 6 months; faulty-on-arrival replaced within 7 days of receipt; pickup arranged; refund in 7 working days (founder)
[D022](decisions/D022-warranty-replacement-refund.md). No timelines published. Minor open
points in F1: the remedy after the first 7 days, and whether pickup is free.

## [2026-10-10 23:35] decision | New orders: same ₹499 advance, deliveries from mid-November (founder)
[D023](decisions/D023-new-order-delivery.md). Raised: the live site will show a passed ship date
from 20 October while production is held (D011).

## [2026-10-10 23:40] decision | Ship date on production held until Gate B (founder, option b; accepted risk)
[D023](decisions/D023-new-order-delivery.md), [D011](decisions/D011-production-held-until-gate-b.md)
reaffirmed. Do not re-raise.

## [2026-10-10 23:45] decision | Payment methods UPI, cards, net banking; prices incl. GST; GST invoice (founder); F6 closed
[D024](decisions/D024-payment-methods-gst.md).

## [2026-10-10 23:47] decision | R9: the site is for parents of 3-7 year olds and family buyers only (founder)
Recorded on [content boundary](site/content-boundary.md) and in open questions.

## [2026-10-10 23:52] decision | R4 speech and language: allowed with public sources only; disclaimer on Terms + Meet Kheelu, not Home (founder)
[D025](decisions/D025-speech-and-language.md).

## [2026-10-10 23:54] decision | R5 emotion reading dropped from the new site (founder)
"The feeling gets read", mood reading and "maps emotions and triggers" are BANNED, like "adapts".
To apply on claims, facts and messaging after the completion run.

## [2026-10-11 00:00] decision | R6 public statistics: use as SKM wrote them, after independent source verification, each with a linked marker (founder)
[D026](decisions/D026-public-statistics.md). The DS "never sell through fear" rule conflicts; the
founder's instruction wins (recorded once). Internal survey figures stay internal (D013).

## [2026-10-11 00:02] agent | Source verification workflow launched (`wf_dc801a61-c52`)
Extract every public-source claim from both SKM documents → one independent verifier per source
family (primary sources only, exact quotes, excerpt files in `raw/research/sources/`) →
adversarial re-check of every usable claim (stricter verdict wins) → the Copywriter writes
`research/source-verification.md` with footnoted copy lines and the DS footnote-gap finding.

## [2026-10-11 00:08] decision | R8: no "lessons"; Story mode = stories, poems, jingles; no interrupt-and-ask feature (founder)
[D027](decisions/D027-story-mode-wording.md); D017 narrowed (apply row by row).

## [2026-10-11 00:11] decision | Kheelona+ line reworded (option b): poems and jingles are in Kheelona+; "no subscription needed" (founder)
[D027](decisions/D027-story-mode-wording.md). Closes the Kheelona+ half of R10.

## [2026-10-11 00:14] decision | R10 price wording: ₹499 first next to the CTA, ₹4,999 total in the same sentence; machine outputs lead with ₹4,999 (founder)
[D028](decisions/D028-price-wording.md). All content rulings R1-R10 are now answered.

## [2026-10-11 00:20] decision | Grievance officer Aman Soni; founder approves legal pages after an independent review (founder)
[D029](decisions/D029-grievance-officer-legal-review.md). Raised at once: E-Commerce Rules 4(5)
require acknowledgement within 48 hours, not 5 days. Independent legal-requirements review launched.

## [2026-10-11 00:30] agent | Phase 1 completion finished: all four discovery outputs written; critic 0 blockers, 6 major, 9 minor
Pages: [PostHog audit](research/posthog-audit.md) (corrected), [D2C benchmarks](research/d2c-benchmarks.md)
(19 sites, all with notes), [keyword map](research/keyword-map.md), [QA baseline](qa/baseline-2026-10-10.md).
QA headline: links clean; A11y 96 everywhere; BP 73 (pixel, known); mobile Perf below 90 on Home
(86), store (85), /ai-toys (80); 9 of 36 titles over 60 chars. Critic majors: the question bank
predates D017-D027; PostHog recomputes blocked because the **PostHog connector disconnected after
the account switch**; replay evidence expires 19-23 Oct (C13); C11 exports still the biggest
search gap; CTA-tap and outside-India figures need human-session scoping. New items merged:
F14, C17-C20; G4, G7, G8, G13, C10 extended.

## [2026-10-11 00:45] build | PostHog connector: the claude.ai one belongs to the OLD account; direct server added
After the account switch (now apoorva@kheelona.com) the "claude.ai PostHog" connector answers
"Server not found" (404): it lives in the previous account's organisation. Per PostHog's docs
(posthog.com/docs/model-context-protocol/claude-code, fetched 2026-10-11) the founder ran
`claude mcp add --transport http posthog https://mcp.posthog.com/mcp -s user` (user config, not
the repo; browser login, no key stored in the project). It loads only after a restart:
`/exit` → `claude --continue` → `/mcp` (no argument) → **posthog** → Authenticate. After it
connects: point `.claude/agents/posthog-analyst.md` and `search-visibility.md` at the new tool
names, then run the human-session recomputes the Phase 1 critic listed, then C13.
The founder restarts only after the three background runs finish and are ingested.

## [2026-10-11 01:05] agent | Founder rulings applied to owner pages (`wf_842c5f27-82d`, 5/5); verifier: values agree, fixes queued
facts, claims, policies, pricing, checkout, messaging, positioning, voice, audience and the
keyword map now carry D016-D029. Values agree everywhere; no PENDING RULING marks left. Queued
for after the restart ([rulings check](qa/rulings-check-2026-10-11.md)): five more live
wake-word lines (Footer, setup steps, /setup, /safety and /ai-toys meta), benchmark price lines
that break D028, the Xu-study pairing (implies the banned interrupt-and-ask), "adapts"-family
phrases, keyword-map placeholders the owners have since ruled on, "Region-pinned", the AI2
providers line. Copy corrections to make (CTO): D028's draft as ONE sentence; the D023 delivery
line paired with the D028 price sentence; "within one month" (the rule's words) not "30 days";
"Wi-Fi" per the DS. New questions F15 (exact delivery date; existing orders), F16 (opt-in
training), F17 (advertising to the child).

## [2026-10-11 01:20] agent | Source verification finished (`wf_dc801a61-c52`, 16/16): 45 public claims, none of SKM's 30 usable as written
[Source verification](research/source-verification.md): final verdicts (stricter of two
independent passes) 1 SUPPORTED, 38 SUPPORTED-WITH-REWORDING, 4 NOT-SUPPORTED (C15 parents'
worry, C28 "thinks in it too", C41 vocabulary doubling, C45 "learn fastest"), 2 COULD-NOT-VERIFY
(C04 NCF alignment, C13 "76 questions an hour"). Nine wrong attributions inside supported claims
(e.g. the Xu study is UC Irvine, not Harvard). 26 ready footnoted site lines; 13 supported but
INTERNAL. Several LIVE lines fail (held until Gate B, D011). 95 excerpt files in
`raw/research/sources/`. DS gap G-18 (no footnote pattern) logged; Gate A item G15.

## [2026-10-11 05:00] agent | Indian-law review finished (`wf_49e24b92-a56`, 5/5): 65 verified requirements, 2 blockers
[Legal requirements](product/legal-requirements.md), sourced from the official Gazette and
ministry texts (E-Commerce Rules incl. the 2026 amendment, CPA 2019, CCPA misleading-ads and
dark-pattern guidelines, ASCI, Legal Metrology, Toys QCO and BIS Act, Electronics CRO, CGST,
DPDP Act and Rules, IT Act and SPDI Rules, CERT-In). Blockers: (1) the BIS licence and ISI mark
for the toy before any sale or dispatch (our records show none; status asked as L1); (2) 48-hour
grievance acknowledgement, not 5 days (L2). The final writer's input was truncated after DP-05:
rows DATA-06 to DATA-31 keep an earlier pass's text (verified by the data lens's verifier, not
re-read by the writer). WPC text could not be fetched. Founder actions L1-L8 added. The run's
writer was restarted once (00:13 -> 02:58); total 5 h 54 min.

## [2026-10-11 05:01] build | PostHog reachable again: the claude.ai connector now answers in the new account
`project-get` through `mcp__claude_ai_PostHog__exec` returns project 617632 ("Default project",
app URL https://kheelona.com, admin access, timezone UTC). The founder reconnected the claude.ai
connector under the founder's new account, so the agent files keep their tool name
(`mcp__claude_ai_PostHog__exec` in `posthog-analyst.md` and `search-visibility.md`); no edit
needed. The direct `posthog` server added at 00:45 is still unauthenticated and unused.

## [2026-10-11 05:02] agent | Human-session recomputes launched: posthog-analyst (writer) + an independent verifier
Scope from the Phase 1 critic and [PostHog audit §12](research/posthog-audit.md#12-what-this-audit-could-not-see):
scroll depth Q19/Q19b, web vitals Q20/Q39, CTA taps Q13/Q14/Q14b, outside-India share Q33, all in
the human-session scope, same window 2026-09-19 to 2026-10-11 00:00 UTC.

## [2026-10-11 05:08] decision | L1: the BIS licence for Kheelu is under application, not granted (founder)
Recorded on [claims §6](product/claims.md#6-certifications) and [open questions](open-questions.md) L1.
Under the [legal review](product/legal-requirements.md) (BIS-01) no unit may be dispatched before the
grant, so the 20 Oct dispatch of existing token orders is the next question.

## [2026-10-11 05:12] decision | D030: questions to the founder limited to the website draft; the 20 Oct dispatch question is out of scope (founder)
[D030](decisions/D030-questions-scoped-to-the-website.md). Not asked from now on: operational parts of
F12, L3, L8, L6's setup consent. L1's site consequence: no BIS/ISI claim until a licence number exists.

## [2026-10-11 05:20] decision | D031: four PostHog settings approved; paid-ad replays expire (founder, C13)
[D031](decisions/D031-posthog-settings-and-replays.md). Docs checked first: a retention change only
reaches new recordings; only a manual JSON export keeps an existing one. Settings are applied after
the recompute agents finish.

## [2026-10-11 05:30] decision | Founder's answer round (all pending website questions): D032-D039
At the founder's request, every pending website-scope question was asked in seven rounds before the
founder slept. Recorded: [D032](decisions/D032-grievance-block-and-call-line.md) grievance 48 h / one
month, WhatsApp takes calls; [D033](decisions/D033-warranty-after-day-7.md) repair-else-replace, free
pickup; [D034](decisions/D034-origin-manufacturer-mrp.md) made in India, Kheelona Robotics, MRP ₹7,999;
[D035](decisions/D035-model-training-opt-out.md) own-model training on voice + transcripts, opt-out,
terms/privacy only (DPDP risk recorded); [D036](decisions/D036-launch-feature-claims.md) eight launch
features, age set in app; [D037](decisions/D037-delivery-date-in-schema.md) `availabilityStarts`
2026-11-15 (late-delivery refund risk recorded); [D038](decisions/D038-trust-content-rulings.md)
trust content; [D039](decisions/D039-repo-and-setup-answers.md) repo and setup. Applied to
[policies](product/policies.md), [claims](product/claims.md), [facts](product/facts.md),
[pricing](product/pricing.md) and [open questions](open-questions.md). Still open from the founder:
C17 (Supabase region), F7 (Kheelona+ after 6 months, Gate A), F11 proof files, section D checks.

## [2026-10-11 05:40] agent | Human-session recomputes ingested: writer and verifier agree on every cell
[PostHog audit](research/posthog-audit.md) updated by posthog-analyst (H0-H39 in
`raw/posthog/2026-10-11-human-session-recomputes.json`); independent verifier W0-W6d in
`raw/posthog/2026-10-11-recompute-verification.sql`. V9 and V12 reproduce exactly. No ranking or
must-include changes; issue 5 strengthens (since tagging went live, 14 of 18 phone store taps came
from the guide's bottom bar). Store phone median time 50 s → 34 s; store page phone LCP 3,284 ms
(n 29). Follow-ups sent to the analyst: scroll-report coverage (W2c), 19 automated-looking US
sessions (W5c), CTA figures without the one `/privacy` session, setup status after D031. Raw files
scanned: no emails, IPs or person ids.

## [2026-10-11 05:45] build | D031 applied in PostHog; repo website field set (C16)
PostHog 617632: conversion goal on `purchase_confirmed`; revenue analytics INR on `value` (verified
2 charges, ₹998); bots in the test-account filter; store URL authorised (details in
[D031](decisions/D031-posthog-settings-and-replays.md)). GitHub `Kheelona/website` homepage set to
https://kheelona.com (`gh repo edit`; confirmed by `gh repo view`).

## [2026-10-11 06:25] agent | PostHog audit follow-ups applied (coverage, US automation, /privacy session, setup after D031)
[PostHog audit](research/posthog-audit.md): scroll figures scoped to measured views (W2c: 373 of 607
phone Home views reported scroll); 19 of 61 US sessions look automated (W5c, inference); phone
store-link taps without the one `/privacy` session: 21 taps / 17 sessions, 14 from the guide's bar
(H14h, new raw file `raw/posthog/2026-10-11-cta-without-privacy-session.json`, no emails stored);
setup gaps closed by D031; the baseline insight Y9KjojeN has "filter test accounts" off and its own
bot filter, so D031 does not change it (S5). Q21/Q41 human-session recompute stays a Phase 8
prerequisite, with a re-read of PostHog's marketing-analytics suggestions.

## [2026-10-11 06:55] build | Phase 2 strategy written: `site/strategy.md`
[Strategy](site/strategy.md): one idea (Kheelu answers, then asks back, so the child does the
thinking; D016 form for the promise); one CTA "Pre-order Kheelu" to the store everywhere incl. the
phone sticky bar (G1 recommendation; the price sentence sits beside it, D028); the product page as
the selling page and ad destination (audit issue 6); URL plan: keep everything, drop `/playos` and
`/stories/brain-development-toys-for-a-2-year-old` (301s), no new pages in v1; fixes mapped to all
10 PostHog issues; Gate A decisions listed (§9).

## [2026-10-11 06:58] agent | Phase 3 started: Copywriter → `site/pages/home.md`; fork applying the rulings-check fixes
Copywriter briefed with today's rulings restated (D028 one-sentence price, D032 call line, D035 no
training on customer pages, D036 features, D038 no advisor/pilot/testimonials, the "adapts" family
banned as a CTO ruling, Xu guard). Hero H1: a recommendation plus four alternatives incl. "It asks.
They think." (D038). Fold 2 written in two variants pending G3 (films).

## [2026-10-11 07:20] build | Rulings-check fixes applied; D030-D039 propagated to brand, keyword-map, benchmark and baseline pages
Fork run: claims (wake-word rows 18-22, "Region-pinned" banned, the "adapts" family ruled BANNED as
written (CTO, 1d), Xu guard, D019 Gate A flags), facts, messaging (D028 one-sentence candidate:
"Reserve Kheelu for ₹499 today, refundable, and pay the remaining ₹4,500 of the ₹4,999 total (incl.
GST) before delivery."; new candidate lines for D032-D038), voice, positioning (76-questions figure
not usable), audience, keyword map (placeholders ruled; schema `availabilityStarts` 2026-11-15,
`returnFees: FreeReturn`; P1 placeholder for how a parent opts out of training, D035), benchmarks
(A3/A4/D2 price lines now D028; anchors fixed), QA baseline, age-band review; rulings check marked
applied. Also banned as learning-outcome claims: "builds four thinking skills, at your child's level"
and "Knowledge that sticks". Lint: 77 pages, every link resolves.

## [2026-10-11 07:50] agent | Homepage copy written and CMO-reviewed: ready after two fixes
[Home copy](site/pages/home.md) (Copywriter): nine folds, H1 recommended "Your child asks why. Kheelu
asks back." with four alternatives, one-sentence D028 price line, one marked placeholder (box
contents, F4). [CMO review](qa/cmo-review-2026-10-11.md): pass on fidelity, five-second test, tone,
comparison, FAQ, keywords; fail F1 (fold 3 card implied Kheelu is the "caring adult") and F2 (fold 6
heading "Where your child's voice goes" implied no training, against D035). Fixes routed to the
Copywriter with S1, S2, S4, S5, S6, S10 and the sticky bar in D028 order (₹499 first); S12 (drop the
Lumi FAQ) declined: Lumi is Home's keyword-map secondary. CMO wants F7 decided at Gate A.

## [2026-10-11 07:55] build | Mockup v1 built: `mockup/index.html` (plain HTML + CSS from DS classes)
Composed from DS `tokens.css` + `bundle.css` markup (captured by rendering the DS's own live
previews headlessly), `mockup.css` (tokens only; breakpoints are the DS's 720/1024) and `mockup.js`
(reveals, sticky bar that steps aside for any inline CTA, native `<dialog>` drawer, G2 preview switch
`?contrast=ink`). Checks: 360 × 590 holds the CTA and the full price sentence; no sideways scroll at
360-1440; axe: only G2's white-on-Chilli CTAs (2.87:1) are serious, 0 with `?contrast=ink`; no
off-token values; DS checksums intact.

## [2026-10-11 08:20] build | Mockup v1 published privately for the founder's phone; approval pack drafted
Private artifact https://claude.ai/artifact/W6XpUUMXhdubxb4fvJpYxa (catalogued in
[artifacts](engineering/artifacts.md)); `#ink` shows the G2 option. Price sentence (d) adopted on the
page and in [home copy](site/pages/home.md) (Copywriter and CMO pick; 18 words). `mockup/APPROVAL.md`
drafted: seven decisions (label, hero copy, contrast, films, motion, URLs and AI crawlers, Kheelona+
after six months and the training clause), fold rationale, CTA strategy, URL plan, page outlines,
tracking parity, checks. Waiting on the CMO's visual pass.

## [2026-10-11 08:45] gate | Gate A pack ready: mockup v2 after the CMO's visual pass; stopped for the founder
[CMO review, mockup pass](qa/cmo-review-2026-10-11.md): ready after five fixes, all applied: V1 phone
comparison as one card per row with Kheelu first (the table hid Kheelu off screen; G-05 workaround);
V2 DS 1:1 hero board (face clear); V3 no reveal on any button, price or the OfferCard; V4 every trust
item links to its terms; V5 fold-5 heading spacing. Also M1-M4, M6-M12 (price straight under each
button; the bar stays until the OfferCard's own button, logged under G-09; 44 px tap areas; laptop CTA
not full width; offer before the board; nothing in view at load fades). M13 tried and reverted (made
safety longer). Bar hidden from 900 px per the DS. Checks: 360 × 590 holds the button, price sentence
and delivery line; no sideways scroll; axe only G2 (0 with `#ink`); DS checksums intact. Artifact v2
at the same private link; curated screenshots in `mockup/screenshots/` (kept local, D039). Approval
pack complete: `mockup/APPROVAL.md`. Phase 4 waits for the founder's explicit approval.

## [2026-10-11 09:45] agent | Read-only sweep of every website question still open (general-purpose agent)
- Found ~60 items across APPROVAL §3, home.md, open-questions sections B-D, claims, gaps, legal and policies, plus 19 stale-page inconsistencies. Filed as [Gate A open items](site/gate-a-open-items.md).

## [2026-10-11 10:15] decision | Founder answered Gate A round 1 and follow-ups (D040, D041, D042)
- Verbatim: [raw/feedback/2026-10-11-gate-a-answers.md](raw/feedback/2026-10-11-gate-a-answers.md).
- D040: the seven parent films move to the new site; film 6 caption now names AI mode; film 1 label kept; subtitles ship as they are; a proof line replaces the endorsement disclosure (risk recorded).
- D041: Pre-order Kheelu; price (d); white on Chilli kept as an accepted exception; motion, URLs and crawlers approved; training clause kept; Kheelona+ after 6 months left unspecified; more DS children, Myra allowed; box contents; first 500 once in the FAQ; "friend" allowed; grown-up nearby at 3. Headline rejected ("lacks a hook"): new options to pick from. **Gate A not approved yet**: the founder reviews the revised mockup first.
- D042: no consent banner at launch; no exchanges; no payment fees; refunds start within 2 working days.
- Remaining items run on logged working defaults ([Gate A open items](site/gate-a-open-items.md)); the founder may override.

## [2026-10-11 10:20] agent | Headline workflow started (3 copywriters × angles → CMO + compliance judges → copywriter final)
- Angles: storyteller, contrast/curiosity, parent's payoff. Output: five H1 options, films copy, find/replace edits for D041; the Copywriter updates home.md.

## [2026-10-11 10:55] build | Mockup v3 published (same link): the seven films, more children, two overflow fixes
- Fold 2 is now the films strip (variant a): tap to play with native controls, one at a time, pauses out of view, poster returns at the end; live labels kept for tracking ("Play: …", "Previous video", "Next video"); counter reads "1–3 of 7" where three show. Verified in Chrome (H.264) at 360, 390, 768, 1024, 1440: plays, focus moves to the film, a second tap stops the first, arrows disable at the ends.
- Children: Advik (hero), Kabir's chalk frame moved to fold 3 and zoomed so the question sits just above him (founder's screenshot feedback), Ira in fold 4, Tara in the close (was a second Advik).
- Fixed: hidden film labels escaped the strip (page 1,921 px wide on phones); a 4 px overflow at 360 px from a long ghost link, present since v2 and hidden by an `innerWidth`-based check ([lessons](engineering/lessons.md)). Now no sideways scroll at 320-1440.
- Removed the `#ink` contrast preview (D041). Fold 2's `aria-labelledby` now points at a real id.

## [2026-10-11 11:20] decision | D043: every page as a mockup before the build; scope answers
- Founder: "create all other pages ... let me know once all pages are ready, i can review them all together. once all pages are approved in this light weight format, you can go-ahead and work on the full website." Scope: articles template + 3; legal full drafts; store mocked; one link with a page index.

## [2026-10-11 11:30] build | Mockup system for many pages: partials, page bodies, build and check tools
- `mockup/partials/` (nav, footer, buybar, drawer), `mockup/pages/<slug>.html`, `node mockup/build.mjs [slug…]`, `node mockup/tools/check.cjs <out> <slug…>`. Home moved to `mockup/home.html`; `mockup/index.html` is the review index. Links between pages use mockup file names. Sticky bar now shows from first paint on pages without a hero CTA (strategy §3.4).

## [2026-10-11 11:35] agent | Two workflows started: app screenshots + Harvard logo rules; all-pages mockups
- App screenshots from the founder's demo video (`mobileapp-live-demo-oct2026.mp4`, local only, never committed: it shows a personal inbox and a phone number): transcript, activity, privacy centre; names replaced with "Aarav", "Khelu" corrected to "Kheelu", activity filled with example content; each verified for leftover personal data.
- All pages: 7 groups (product; safety + buyer's guide; stories hub + 3 articles; team, setup, contact, 404; privacy + terms; refund + shipping; store + confirmation), each copy → build → review (CMO, or a legal verifier) → fix, then a cross-page check.

## [2026-10-11 12:20] build | Home: five headline options (picker), films copy, D041 copy edits
- Headline workflow done (3 angles → CMO + compliance → copywriter). H1-1 "Shh. Your child is explaining the moon to Kheelu." shows by default; the "Headline" pill opens a sheet to try H1-1…H1-5 (mockup-only tool; `#h1-N` deep link). Films H2 "Kheelu asks. Watch them think.", lede "Real children, real families…" (not all films at home), proof line "Kids doing the talking. Parents, in their own words." Kheelona+ line keeps "6 months"; box contents; first 500 once in the FAQ; grown-up nearby at 3.

## [2026-10-11 12:50] decision | D044: what the real app screens may show; no Harvard logo
- Usage time confirmed; no games; 36-month retention (app to match); no "seen only by you" banner; no AI summary; memory line; clean Hindi title; share/favourite/download/recordings confirmed. Harvard and Center logos not allowed without written permission (Trademark Program FAQ Q10/Q17/Q19; the Center's Terms): plain-text citation stays.
- App screens placed in Home: transcript + activity in fold 5 (replacing the DS illustrative screen), privacy centre in fold 6.

## [2026-10-11 13:05] agent | Workflows stopped for quota; state recorded
- All-pages workflow: copy and build done for all 17 pages; legal review and fixes done for refund/shipping; CMO review written for team/setup/contact/404 (fixes pending); other reviews, fixes and the cross-page check not run. Screens round 2: privacy done; transcript and activity pending.
- Work files moved from the session scratchpad to `mockup/_work/` (local only, in `.git/info/exclude`, with the demo video). Resume plan: [site/gate-a-progress.md](site/gate-a-progress.md).

## [2026-10-11 13:30] build | All-pages preview published (artifact v4, same link)
- `mockup/_work/build_artifact_multi.py` builds the set: the review index as the main page, 18 pages beside it (95 files, ~31 MB). The index carries a status note (which pages are reviewed). Copy-page links fixed for the wiki lint (106 pages, every link resolves).

## [2026-10-11 13:45] decision | D045: Home hero "Kheelu answers every why. Then it asks one back."
- The founder rejected "Shh. Your child is explaining the moon to Kheelu." and chose from four new options. Fits the 360 × 590 first screen (CTA 432 px, price 508 px, delivery 584 px). Picker removed from Home; artifact republished (home and index only).

## [2026-10-11 14:10] gate | D046: Gate A approved for the full set; final Home changes
- Captions now "The Kheelona app is live on Apple’s App Store and the Google Play Store."; the Safety phone matches the parent-app phones; Myra replaces Tara at the close; new fold 7b "Guides for parents · How we can help, from 3 to 7." (screen time, talking and language, learning and play → Stories sections). Founder: "rest all is good to go ... then you can go on to building the webiste". Next: Phase 4 in a new session (other account).

## [2026-10-11 14:25] decision | D047: Vercel build not overridden; Supabase ap-southeast-2 (moves before launch); toy backend on GCP India
- C8 and C17 answered. /privacy must name the order-data location until Supabase moves to India.

## [2026-10-11 14:35] decision | Phase 4 kickoff written; today's work committed locally
- [engineering/phase-4-kickoff.md](engineering/phase-4-kickoff.md): approved sources, constraints, seven architecture decisions (components from mk- patterns, one content model with a placeholder guard, regions per D047, tracking registry, SEO/schema/robots/redirects, media pipeline, guardrails), Phase 5 carry-overs.
- Committed locally: `42a65b3` (112 files, staged by name; not pushed, D014).

## [2026-10-12 00:10] decision | Account switch; D048 beta deployment; Phase 4 started
- Founder (new account): "let's get to full website building. with animation and ready for deployment. show me the version in betawebsite.kheelona.com and betastore.kheelona.com, this version once i approve make it live on main website." D048: push branch `beta`; Razorpay test mode on beta; Meta/GA4 off and PostHog tagged on beta; approval on beta = Gate B.
- GitHub reachable (`git ls-remote` returns main at 77552ff). Phase 4 workflow started (architect → QA → revise).

## [2026-10-12 00:40] build | Motion options page for the founder (8 places × 3 options)
- https://claude.ai/artifact/XgoMduGs3cLTaWawJ7RE5w: reveals, hero picture, doodles (true line draw-in from the DS SVG strokes), phone buy bar, phone menu, orange button, FAQ opening, films strip; DS motion tokens; my picks marked (1A 2B 3B 4A 5A 6B 7B 8B). Picks feed Phase 5 (D049 when answered).

## [2026-10-12 00:55] decision | D049: motion picks 1A 2A 3B 4A 5A 6B 7B 8B
- Reveals fade and rise; hero still; doodles draw themselves; buy bar slides up; menu from the side; button arrow nudge; FAQ smooth open; films focus grows. Build specs with DS timings in D049.

## [2026-10-12 01:05] decision | D050: persistent WhatsApp chat bubble on every page
- Bottom right; on phones it lifts above the buy bar and drops back when the bar steps aside; WhatsApp green (approved DS exception, gap G-20); pre-filled messages per context; `cta=whatsapp-float`. Added to the build scope.

## [2026-10-12 14:25] agent | Phase 4 architecture workflow done (architect → QA review → architect revision)
Outputs: architecture.md, structure.md, components.md, assets.md, dependencies.md, tasks.md (10 waves), ADR-001 to ADR-013, qa/architecture-review-2026-10-12.md (B1-B4 blocking, folded in), qa/test-plan.md. D049 and D050 have owners and tests. Founder questions recorded as open-questions §P with working defaults.

## [2026-10-12 14:30] decision | Main-session prep for wave 1
WhatsApp green `#25D366` recorded in gaps G-20; motion.md gains the D049 section and the two named exceptions; seven path-scoped rules added to `.claude/rules/` (structure §9); CLAUDE.md and AGENTS.md point at structure and tasks (structure §10).

## [2026-10-12 14:35] build | Dev tools pinned; security patch next 16.3.8 and sharp 0.35.5
Added (exact, ≥ 2 weeks old where possible): @playwright/test 1.63.0, @axe-core/playwright 4.12.1, axe-core 4.12.1, lighthouse 13.4.1, jscpd 5.3.2, sharp 0.35.5, subset-font 2.9.0 (BSD-3-Clause). npm audit showed next 16.3.4's own advisories (GHSA-vcvr-r3jv-pc5j critical next/og RCE, GHSA-cjq9-62q9-8jv4 high image SSRF, ISR cache poisoning GHSA-4jqv-mc3x-m676 / GHSA-mcj8-r9mp-w47p, three more); next and eslint-config-next → 16.3.8 (2026-09-30), floors raised in test/dependency-floor.test.ts. tsc, Vitest (1346 tests) and `next build` green. Remaining audit items are dev-only (eslint chain, source-map-js, dompurify low). Lint baseline: 15 errors (legacy src files, mockup tools, a DS runtime file) for task 1.1 to scope.

## [2026-10-12 14:45] agent | Wave 1 build workflow started (run wf_de7ff1a5-e8b)
Tasks 1.1-1.6 each in its own git worktree (branch build/w1-<id>, base 1806937), each reviewed adversarially against its acceptance criteria with up to two fix rounds; 1.5b app screenshots (transcript, activity round 2) edited in the main checkout under mockup/_work (local only) and verified. Reusable script: workflows/scripts/build-wave-wf_de7ff1a5-e8b.js (args: wave, base, tasks, screens). Next: merge the six branches, wave close (`npm run verify`), review the screenshots against D044, then wave 2.

## [2026-10-12 15:05] decision | D051: the beta runs without store integrations
Founder: no Supabase, Razorpay or email on beta ("when we are doing final merge, we can directly use the main website details"); no PostHog filter (beta lives 1-2 days). New task 2.10 makes `storeEnv()` null on beta so betastore can never take a payment even if Preview has production keys. B4 checks and the beta test payment (test plan §6) dropped; store form and /thanks reviewed from local screenshots; residual risk (first completed payment through the restyled checkout is real) stated with mitigations. Runbook §15.4 rewritten: two Cloudflare CNAMEs (DNS only) + two Vercel Preview domains on branch `beta`.

## [2026-10-12 15:20] deploy | Beta domains added in Vercel, but connected to Production
Founder added betawebsite.kheelona.com and betastore.kheelona.com (Valid Configuration). Both are attached to the Production environment, so today they serve the live site (checked by curl: 200, `x-robots-tag: noindex, nofollow` because neither is in INDEXABLE_HOSTS; GA4 and Meta gated off by host lists). Asked the founder to switch each to Preview, Git branch `beta` (runbook §15.4 step 1).

## [2026-10-12 15:35] cleanup | Build runbook written; build-wave saved as a named workflow
New page engineering/build-runbook.md (how waves run, merge, close and resume; wave progress; wave-1 follow-ups). Script saved as `.claude/workflows/build-wave.js` so any session can run `Workflow({name: "build-wave", args})`. `.claude/worktrees/` added to `.git/info/exclude`. Wave 1 at 15:30: 1.3, 1.5, 1.6 passed review; 1.4 and 1.2 in fix rounds; 1.1 building; screenshots re-edited and verified (uncommitted, awaiting D044 review).

## [2026-10-12 15:45] build | Task 1.5b done: app screenshots round 2 reviewed and committed
Main-session review against D044: transcript (no AI summary, first line fixed, Hindi title clear of "Activity") and activity (no Games, Chats 3, titles and times match). All three at 576 × 1209 in `src/assets/app/` and `mockup/assets/app/` (`6225df2`).

## [2026-10-12 16:00] cleanup | Handoff snapshot before the account switch
Wave 1 (run wf_de7ff1a5-e8b): 1.3, 1.4, 1.5, 1.6 passed review (branches build/w1-*, heads in build-runbook §4); 1.5b done on the main branch; 1.2 fix committed, re-review pending; 1.1 still building with uncommitted files in its worktree. Beta domains still attached to Production (founder to switch to Preview, branch beta). Next session: build-runbook §4 resume order.

## [2026-10-12 16:10] deploy | INCIDENT: push meant for `beta` went to `main`; `beta` then created correctly
`git push -u origin beta` (branch tracking origin/main, global push.default=upstream) pushed 24e92e3 to main: vercel.json only (adds git.deploymentEnabled.beta: false), no app code; production rebuilt identical code; /, store, /products/kheelu all 200 right after. Then `git push origin 24e92e3:refs/heads/beta` created `beta` (builds nothing). Not reverted (a revert would be another identical production deploy); founder told immediately. New hard rule in CLAUDE.md and lessons: explicit `<src>:refs/heads/<dst>` pushes, `--no-track` branches.

## [2026-10-12 16:20] deploy | Beta domains attached to branch `beta`
Founder switched betawebsite.kheelona.com and betastore.kheelona.com to the `beta` branch in Vercel (Valid Configuration). The founder's beta setup is complete (D051: nothing else needed).

## [2026-10-12 16:40] agent | Wave 1 run held by the founder (workflow wf_de7ff1a5-e8b stopped)
Founder: "hold the build-wave" while changing the Chrome login. Stopped the workflow. Task 1.1's unfinished e2e harness committed as WIP `e7da91c` on build/w1-1.1 (unverified, unreviewed). 1.2's round-2 review was cut off (fix `7c8ebe8` committed). 1.3, 1.4, 1.5, 1.6 passed; 1.5b done. Resume per build-runbook §4 when the founder says go.

## [2026-10-12 17:05] build | Wave 1 resumed on the new account; 1.3-1.6 merged
build-wave gained a resume mode (finish or review a task in its existing worktree; no session trailer). Run wf_20aaa1e8-c0f: finish 1.1 from e7da91c, review 1.2 at 7c8ebe8. Merged build/w1-1.3, 1.4, 1.5, 1.6 (no conflicts): tsc, Vitest 1862 tests, DS checksums green; `next build` failed on RGB app icons (Turbopack needs RGBA), fixed in 517a38e. Every build task now runs `npm run build` (lessons).

## [2026-10-12 18:50] build | Wave 1: 1.2 merged; 1.1 back for a fix round; 1.2 review notes recorded
Run wf_20aaa1e8-c0f finished (12 agents). **1.2 passed** round 3 at `6078e4d` and is merged (`ab4868e`; assets.md rows from both tasks kept). Merged tree: tsc, Vitest 135 files / 1957 tests, DS checksums, `next build` green. **1.1 failed** round 3 (verify green): no-off-token misses bracketed variants, the `!` suffix and `@apply`; no served-page check runs the no-reveal-on-money DOM rule; 6 minor. New run **wf_7ba453ba-6cb** (18:40): 1.1 fix round (resume `finish` on `build/w1-1.1-b`, findings in the session scratchpad) with approvals: `tsconfig.guards.json` owned by 1.1, `postcss@8.5.23 --save-exact` (phantom dependency of 1.2's guards), perf-budget "shared" = framework + layout entry chunks, reduced motion accepts only the buy bar's opacity fade, KHEELONA_PLUS_LINE ("lessons") owned by 6.3, playwright-core 1.64.0 left hoisted. 1.2 follow-up (resume `finish` on `build/w1-1.2-b`): Devanagari subset limited to the text the site uses (architecture §12 wins: 110,588 B file pulled by the "हिन्दी" chip on both money pages) with a coverage guard, and `public/fonts/OFL.txt`. Main session: dependencies.md (real pins, chrome-launcher, postcss); architecture §4.1, §4.2, §5.3, §9.4, §11.2, §11.3, §12, §17; tasks.md 2.3, 3.1 (`data-scroll-behavior`, `inert` hidden bar, no `.ks-wa` colour transition), 6.3 (jscpd route ignores, KHEELONA_PLUS_LINE), the `formatInr` spec example (paise), two guard-owner rows; stale `path[pathLength]` comments in build-doodles.mjs and its test. Architect agent started on `mockup-css-mapping.md` (the approved mockup's ~189 off-token declarations → DS tokens or named exceptions; before wave 3).

## [2026-10-12 19:25] agent | Mockup CSS mapping accepted; plan corrected
Architect agent wrote [mockup-css-mapping](engineering/mockup-css-mapping.md): the approved mockup's 189 off-token detector rows (135 declarations): 127 ported, 4 mockup-only, 4 not ported. Ported values reproduced by `ks-type-*` classes (23 rows), DS tokens or exact `calc()` of space tokens (21), the existing `outline-offset-2px` (1) and **10 new named exceptions** (36 rows): DS weights 800/700/500 and the DS link offset 3px in named files, three legal type values no class reaches, the founder's Kabir zoom `scale(1.32)`, the guide plush 4:3 ratio, and `@media (min-width: 1200px)` (= DS content-max) in StepLoop and ArticleBody only (1024 would change 1024-1199 px). Main session accepted it (no founder decision; optional P12 legal h2 weight, default keep 700). Applied to the plan: architecture §4.4, ADR-002 §4-§5, components rows (Heading `titleStepXl`, SourceMarker article variant, ArtBoard `ratio`/`clamp`, AppScreens variants, Card `titleType`, TrustList `bodyType`, StepLoop 1200 rule, AnswerSection ports `mk-team-answer`) and §7 (`mk-tool` and `mk-step` are ported, not dead), tasks SCA 2, 1.1 item 11, 3.2 (seller and grievance context), 3.3 (disclaimer name, contact hero scope), 4.3 (two legal families). **Timing:** the §4 entries go into token-exceptions.ts right after 1.1 merges and before wave 2.

## [2026-10-12 19:40] build | Wave 1 closed
Run wf_7ba453ba-6cb: 1.1 passed its re-review at `eef4f33` (no-off-token reads arbitrary Tailwind class by class and in `@apply`; motion.spec runs the no-reveal-on-money DOM rule on every served route; bypass header never rides a redirect hop; WebKit-less config and Lighthouse per-run allowance left as minors), 1.2 follow-up passed at `68599b4` (Devanagari subset 3,828 B, was 110,588 B; OFL.txt). Merged (`b3fff53`, `e8b56ce`; assets.md resolved to reset/website-v2 plus 1.2's two font rows). Wave close found two integration faults, fixed in `51b9b5f`: ESLint walked into `.claude/worktrees` (now ignored), and 1.1's new guards typecheck caught a Map-iterator argument in 1.2's font test. `npm run verify` green (143 files / 2143 tests), `next build` green, DS checksums intact. Main session added the ten mapping exceptions (`5c65999`, mutation-checked). Decisions: Lighthouse gates on the simulated median, devtools recorded; the harness's bypass-hop handling accepted (tasks 7.2). New addenda 1.1b and 1.2b run with wave 2. All wave-1 worktrees and branches removed (none pushed).

## [2026-10-12 19:45] agent | Wave 2 launched (run wf_ab0be1f5-713)
`build-wave` with wave 2, base `7eaa735`, tasks 2.1-2.10 plus addenda 1.1b ("Harness addendum: no-off-token gaps, opt-in WebKit project, Lighthouse gating") and 1.2b ("Font scan robustness"). Each extra names the merged wave-1 inputs; 2.2-2.5 port mockup CSS per mockup-css-mapping (§3 rows, §5 rules, catalogue props) and must never edit token-exceptions.ts; 2.10 carries the one authorised diff to `src/lib/store/env.ts` (D051).

## [2026-10-12 21:00] agent | Wave 2 run died at the previous account's usage limit; resumed on apoorva@geekyants.work
Run wf_ab0be1f5-713 lost 12 of 14 agents ("session limit") after about 30 minutes. Left on disk: 2.7 and 2.8 built and committed (reviews died); 2.5 one commit (unverified); 2.6 three commits plus an uncommitted test; 2.1-2.4 uncommitted work, now saved as local WIP commits (`a543a20`, `9645e03`, `0b0b708`, `d2aa0a1`, `8355723`); 2.9, 2.10, 1.1b, 1.2b never started (their empty worktrees and every `worktree-wf_*` branch removed). Rulings: /team `AboutPage` and /contact `ContactPage` JSON-LD kept as live (architecture §9.2, task 2.7); 2.8's choices accepted (doodles already on screen when motion arms are shown drawn, D049 3B; off-screen blocks fade out unseen); 1.1b also type-checks colocated tests and stories and fixes the `hasWarranty` fixture; live schema validators move to Phase 6 QA (a browser is needed). build-wave setup now resets a new worktree to `base` when the tool starts it on `origin/main`.

## [2026-10-12 21:05] agent | Wave 2 resumed (run wf_2317874f-e7d)
`build-wave` wave 2, base `7eaa735`: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7 resume `finish` in `.claude/worktrees/wf_ab0be1f5-713-{1..7}` (heads `a543a20`, `9645e03`, `0b0b708`, `d2aa0a1`, `96a7f43`, `8355723`, `a76e60b`); 2.8 resume `review` at `d289acb` in `-8`; 2.9, 2.10, 1.1b, 1.2b fresh. Every extra tells the builder to type-check its colocated tests with a scratch config until 1.1b lands.

## [2026-10-12 22:30] build | Wave 2 closed
Run wf_2317874f-e7d finished (35 agents, about 2 hours): **all twelve tasks passed review** (2.1, 2.3, 2.4, 2.5, 2.6, 1.1b after one fix round; the rest first time). Merged with `--no-ff` in order 1.1b, 1.2b, 2.1-2.10 (`f0cb730` … `d87c71f`); the only conflicts were catalogue rows in components.md (both tasks' built rows kept; a stale planned `Chip` row dropped twice). Wave close: `npm run verify` green (234 files, 3581 tests, lint 0 errors with 10 legacy warnings, both typechecks including colocated tests and stories, jscpd 0.98%, DS checksums 643), `next build` green (the new placeholders step lists 16 open placeholders in 6 files, development mode). Main session at the close (`610f141`): ghost buttons back to the mockup's markup (mockup.css:135 ported onto `.kh-btn--ghost`); rulings on the reviewers' open points (tasks.md "Wave 2 close": client islands never import Icon/Button, placeholders scan skips never-shipped files, MotionController takes late targets, 300 s wait before the sell-out Redeploy, the Organization input mapper lives in SiteShell, stub.ts deleted by 6.3, numeric opacity modifiers off-token, frozen tests stay excluded from the guards typecheck); architecture §4.4, §6.2, §8.1, §10, §11.3, §12, §15.5; ADR-005, ADR-006, ADR-010; mapping rows 54-57; CLAUDE.md's stale D004 line (D010 rules). Follow-ups planned as tasks 2.11 (client-safe icons: named path constants, `Glyph`, client-safe `IconButton`, guard), 2.12 (runtime) and 2.13 (guards and SEO builders). Worktrees and `build/w2-*` branches removed (none pushed).

## [2026-10-12 22:35] agent | Wave 3 part 1 launched (runs wf_c0ea3e9b-90e and wf_6e55e0c5-d28)
Base `610f141`. Run **wf_c0ea3e9b-90e** (`build-wave` wave 2): task 2.11 alone, because 3.1 (drawer, sticky bar, bubble) and 3.3 (films controls) need its client-safe `IconButton`. Run **wf_6e55e0c5-d28** (wave 3): 2.12, 2.13, 3.2 selling sections, 3.4 support sections, file ownership disjoint. When 2.11 merges: launch 3.1 and 3.3 on the merged head; wave 3 closes after all six merge.

## [2026-10-12 23:20] agent | Wave 3 part 1 died at the usage limit; resumed on apoorva@kheelona.com (runs wf_49e57754-05d, wf_3a360d0e-7b7)
Runs wf_c0ea3e9b-90e and wf_6e55e0c5-d28 lost all five builders after about 17 minutes ("session limit", account apoorva@geekyants.work). Left on disk: 2.11 all work staged (saved as WIP `f3a7258`); 2.12 items 1-2 committed (`0bad04f`, `bd7b3eb`) plus Card work (WIP `9832930`); 2.13 items 1-4 committed (`16e8616` … `a8edfac`) plus a build-steps test (WIP `d8ed551`); 3.4 one test file (WIP `2314912`); 3.2 nothing (empty worktree and branch removed). Account switched back to apoorva@kheelona.com. Resumed: run **wf_49e57754-05d** (2.11 `finish` in `.claude/worktrees/wf_c0ea3e9b-90e-1`) and run **wf_3a360d0e-7b7** (2.12, 2.13, 3.4 `finish` in `wf_6e55e0c5-d28-{1,2,4}`; 3.2 fresh), base `610f141`.

## [2026-10-12 23:55] build | 2.11 merged; wave 3 part 2 launched (run wf_8e83e0d9-f82)
Run wf_49e57754-05d: **2.11 passed** its first review (head `b517b08`): 76 named `ICON_*` constants (branded `IconPath`), `Glyph`, a client-safe `IconButton`, field and alert icons re-exported, `CopyLinkButton` on `Glyph`, guard `client-icons.test.ts`. Production proof: a client island using one constant ships one chunk of 1,425 B (767 B gzip) with that path only; the old way ships 29,255 B (10,451 B gzip). Merged `91208de`; `npm run verify` green (236 files, 3623 tests). Guard ownership row added; the 2.5 controls' own `<svg>` icons move to `Glyph` at the wave-3 close (`1f5ed78`). Run **wf_8e83e0d9-f82** (wave 3, base `1f5ed78`): 3.1 chrome, shells and the WhatsApp bubble; 3.3 story sections. Run wf_3a360d0e-7b7 (2.12, 2.13, 3.2, 3.4) still running.

## [2026-10-13 08:50] build | 2.12, 2.13, 3.2 and 3.4 merged; N21 corrected (product details are tabs, as approved)
Run wf_3a360d0e-7b7 finished (12 agents, 9.4 h including the usage-limit stop): **all four tasks passed** (2.12 and 3.2 on the first review; 2.13 and 3.4 after one fix round). Merged `--no-ff` in task order: 2.12 `3629d2e` (catalogue rows resolved row by row against the merge base: 2.11's Icon, IconButton and CopyLinkButton rows, 2.12's RichText, InAppBrowserNote and MotionController rows), 2.13 `2a51371`, 3.2 `2a7cc40`, 3.4 `d7e0bea` (both clean). `npm run verify` green on the merged tree: 255 files, 4014 tests (2 skipped), lint 0 errors (10 legacy warnings), both typechecks, jscpd 0.88%, checksums 643. Four worktrees and their `build/w3-*` and `worktree-wf_*` branches removed.
**N21 corrected** (from the 3.4 review, checked by the main session): the approved product page's own inline script (`mockup/pages/meet-kheelu.html:397-439`, present in the Gate A commit `42a65b3`) adds `is-tabs`, shows the tab list and one panel at a time, so the founder saw tabs; without JavaScript the DS `.kh-tabs__list { display: flex }` also shows the row. P1's default is now **tabs as approved** (open-questions P1, architecture §5 table and §17-§18 rows, the review's N21 row, tasks 2.4 note, 3.4 and 5.2; components `Tabs` row planned for 3.5).
Rulings and follow-ups written to tasks.md "Wave 3 close": product close keeps the mockup's `map-pin` per placement; `alternateName: "Lumi"` allowed anywhere (claims row 19); one `asIconName`, one `isSitePath`, one mockup harness; new tasks **3.5** (ui/Tabs island, ProductDetails on it) and **3.6** (twelve code follow-ups from the 2.12, 2.13, 3.2 and 3.4 reviews); 4.2 gets `knownAuthorIds`, 4.3 owns a `seller-lines` helper (refund and shipping no-wrap spans, GSTIN line), 6.3 owns the rewritten `utm.test.ts` exclusion. Still running: wf_8e83e0d9-f82 (3.1 in review round 2, 3.3 in fix round 1). Dates: the wiki's day runs one ahead of the machine clock (PDT) since 2026-10-12, kept so the log stays in order (machine clock now 2026-10-12 08:50).

## [2026-10-13 09:00] agent | Task 3.5 launched alone (run wf_b4a2328e-81b)
Base `74fe47b`. 3.5 (product details tabs) depends on nothing still running, so it starts now in its own run; 3.6 and wave 4 wait for 3.1 and 3.3 (the Organization mapper, the story sections, their helpers).

## [2026-10-13 09:40] build | 3.1 and 3.3 merged: wave 3's six build tasks are in; verify and verify:e2e green
Run wf_8e83e0d9-f82 finished (8 agents, 9.2 h): **3.1** (chrome, shells, WhatsApp bubble; root viewport now `viewport-fit=cover` as the mockup) and **3.3** (story sections, films strip) both passed after one fix round. Merged `--no-ff`: 3.1 `0632ed1` (clean), 3.3 `28b4440` (catalogue rows resolved against the merge base). On the merged tree: `npm run verify` green (4277 tests, 2 skipped; lint 0 errors, 10 legacy warnings; both typechecks; jscpd 0.79%; checksums 643) and `npm run verify:e2e` green (`next build`, Storybook, Playwright 208 passed, 1171 skipped: the page-level specs print "pending" until the wave-5 pages exist; `chrome.spec` 24 passed, 1 skipped until 5.15 renders the store bubble). Worktrees and branches removed.
Rulings on the reviewers' open points (tasks.md "Wave 3 close", architecture §5.3, §10, §11.2, new page [deviations](qa/deviations.md)): the store footer's payments line moves into the store page because the store layout's policy links are a frozen checkout contract (V1); store pages set their own description and Open Graph (5.15, 5.16, 6.1); the bubble's lift subtracts the bottom inset and its right offset adds the right inset; laptop label "Chat with us on WhatsApp" to match the link's name (new open question **P13**, default applies); `ModesSection` uses a bare `Photo`; films strip taller with motion on by design (V2); 4.2 owns an article registry. 3.6 grows to 22 items.

## [2026-10-13 09:50] agent | 3.6 and wave 4 launched (run wf_431ed8e5-d4c)
Base `28386a1`, `build-wave` wave 4: **3.6** wave-3 code follow-ups (22 items), **4.1** PageTemplate and section registry, **4.2** ArticleTemplate, stories route and article registry, **4.3** LegalTemplate and the `seller-lines` helper, **4.4** SEO wiring and the data-driven page guards. 3.5 keeps running in wf_b4a2328e-81b. Ownership kept disjoint in each task's notes (3.6 never adds a GSTIN line to seller.ts: 4.3's helper provides it, and the main session switches the two shells at the close); each worktree runs Playwright on its own ports (`KH_E2E_PORT` 3481-3485, `KH_STORYBOOK_PORT` 6121-6125).

## [2026-10-13 11:05] build | 3.5 merged: product details are tabs, as approved
Run wf_b4a2328e-81b: **3.5 passed its first review** (head `4380fcb`; 70 min). `ui/Tabs`: server markup as the mockup's DS Tabs, a client island (`enhance-tabs.ts`) proven equal to the approved page's own tab script by running both on the mockup's fold (click, arrows with wrap, Home, End), the tab row hidden until `is-tabs` so the panels stack without JavaScript; `ProductDetails` on it (new `tabsLabel` prop for 5.2). `tabs.spec.ts`: 26 tests (keyboard, ARIA, axe with and without JavaScript, no layout shift on hydration, the tabbed fold equal to the mockup's at 360, 390 and 1440 per tab). Merged `075144c` (clean); typecheck and the Tabs, ProductDetails and guard tests green (1020 tests). V3 in [deviations](qa/deviations.md) now names the JavaScript-off text-parity effect, which 5.2 records; three small items for the main session after 3.6 (tasks.md "Wave 3 close").

## [2026-10-13 11:55] build | 3.6 and wave 4 merged (templates, stories route, legal template, machine files); verify green
Run wf_431ed8e5-d4c (12 agents, 98 min): **all five passed** (3.6, 4.1, 4.2, 4.3 on the first review; 4.4 after one fix round). Merged `--no-ff`: 3.6 `4af95da`, 4.1 `056d48b`, 4.2 `fc0af71`, 4.3 `c093d2e`, 4.4 `c0633cd`; catalogue rows resolved row by row against the merge base each time. Reconciled in the merge commits: 4.1's two product-details fixtures gain 3.5's required `tabsLabel`; 4.2's and 4.3's imports point at 3.6's `asIconName` (`ui/Icon`) and `test/support/mockup-compare.ts`; their no-op no-wrap hoists dropped; the GSTIN literal removed from a `seller-lines.ts` comment (4.4's policies guard). Close commit `7867b93`: both shells read `gstinLine` from 4.3's helper; `sitemap.ts` reads 4.2's article registry; `tabs.spec.ts` filed under the storybook project (`STORY_SPECS`). `npm run verify` green: 290 files, 4570 tests (2 skipped), lint 0 errors (10 legacy warnings), both typechecks, jscpd under threshold, checksums 643.
Rulings (tasks.md "Wave 4 close", architecture §9.2, structure §6 and the setup row): Home's FAQPage adds "What is Kheelu?" and `/safety`'s adds fold 2's four facts, as the copy pages say; page modules import types only from layouts and components; machine-file date pins are bumped by the main session with any shared-content change (guard-ownership row). New follow-up **4.5** (nine items: campaign page type, legal shapes into content/types.ts, legal shared words, AboutPage description from its fold, machine-files hardening and the Manufacturer line in pricing.md, MotionController at arming, one mockup reader in the ui tests, stale words). `verify:e2e` running.

## [2026-10-13 12:25] qa | Waves 3-4 e2e: red only on the new /stories routes, cleared by wave 5; wave 5 part A launching
`npm run verify:e2e` on `11660e7`: `next build` and Storybook green; Playwright 866 passed, 524 skipped, failures only on the 21 `/stories/*` routes, the first new-design marketing routes: text and visual parity of the three approved articles (bodies are `ARTICLE_PORT_PENDING` until 5.6) and `perf-budget` on every article route. Measured on a local `next start` (script requests and the build's client-reference manifests): the article page's own chunk is about 6 KB; about 34 KB is the legacy root not-found boundary's chunks, present in every route's manifest; about 61 KB is Next prefetching the legacy pages the nav and crumbs link to. Ruling (tasks.md "Wave 4 close"): specs unchanged; 5.10 moves into part A; the full `verify:e2e` is the wave-5 close gate. Wave 5 runs in three parts (A: 4.5, 5.1, 5.2, 5.3, 5.5, 5.6, 5.10; B after 4.5: 5.4, 5.7-5.9, 5.11-5.14; C: 5.15-5.19). Wave-4 worktrees and branches removed.

## [2026-10-13 12:30] agent | Wave 5 part A launched (run wf_08c09180-f5a)
Base `3ab2cbb`, `build-wave` wave 5: **4.5** wave-4 follow-ups, **5.1** Home, **5.2** product, **5.3** safety, **5.5** stories hub, **5.6** the three approved articles, **5.10** 404 (also clears the legacy not-found chunks from every route). Each builder runs Playwright on its own ports (`KH_E2E_PORT` 3501-3507, `KH_STORYBOOK_PORT` 6131-6137); `perf-budget` is reported, not chased, until the wave-5 close. 5.2 may add the V3 JavaScript-off text deviation (main-session approval). Part B follows 4.5's merge.

## [2026-10-13 12:45] agent | Wave 5 part A paused at the founder's request (usage limit approaching)
Run wf_08c09180-f5a stopped (TaskStop) while all seven builders were mid-task; no review had run. Leftover local servers stopped. Uncommitted work saved by name as WIP commits: 5.2 `9fcb5a0` (also edits `eslint.config.mjs` and `test/guards/banned-phrases.data.ts`, outside its Owns: for the review), 5.3 `53207d2`, 5.6 `98f468b` (also edits `test/guards/answer-length.test.ts`, outside its Owns). 4.5, 5.1, 5.5 and 5.10 had clean trees. Per-task branches, heads and the resume call are in the runbook ("Wave 5 part A, paused"). Nothing merged or pushed in this step.

## [2026-10-13 13:00] agent | Wave 5 part A resumed on apoorva@geekyants.work (run wf_2de8d3c9-589)
The founder switched accounts and asked to continue. All seven paused worktrees checked unchanged (heads as in the runbook, clean trees). Resumed with `build-wave` wave 5, base `3ab2cbb`, each task `stage: "finish"` from its saved head; 5.2 and 5.6 are told to revert their WIP edits outside their Owns (`eslint.config.mjs`, `banned-phrases.data.ts`; `answer-length.test.ts`) unless strictly required, and report any kept edit for a ruling.

## [2026-10-13 14:00] agent | Wave 5 part A: network outage mid-run; resumed from the run's cache
Run wf_2de8d3c9-589 lost seven agents to "Can't reach the API server (ENOTFOUND)": the finishers of 5.1, 5.2 and 5.10 and the first reviews of 4.5, 5.3, 5.5 and 5.6. The four completed builders (4.5, 5.3, 5.5, 5.6) are kept. Every worktree was clean with its progress committed (heads: 4.5 `d3c7338`, 5.1 `7315915`, 5.2 `b3321f0`, 5.3 `8bba3ec`, 5.5 `ca0149a`, 5.6 `0e8c1f3`, 5.10 `be2a10a`); leftover local servers stopped. Resumed the same run with `resumeFromRunId` and identical args: finished agents replay from cache, failed ones run again (a finisher reads the worktree's own commits, so nothing is redone or lost).

## [2026-10-13 18:20] agent | Wave 5 part A: second network outage; resumed again
The resumed run wf_2de8d3c9-589 lost seven agents to ENOTFOUND again, after about four hours with the network down (only 4.5's builder was kept). Heads now: 4.5 `d3c7338`, 5.1 `7315915`, 5.2 `b3321f0`, 5.3 `8bba3ec`, 5.5 `ca0149a`, 5.6 `5c8f35f`, 5.10 `787b230` (its uncommitted `not-found.tsx` saved as WIP). API reachable again; resumed the same run from its cache with identical args (founder: "continue").

## [2026-10-13 18:45] decision | D052: QA at checkpoints (founder), from wave 5 part B
The founder found the build over-testing ("we are retesting somethings multiple times"). Audit of `build-wave.js`: every task ran the full suites in build, review and each fix (up to 3 reviews), the main session re-ran them at each merge and the whole browser suite at each wave close, and waves 8-9 repeat it; seven parallel tasks pushed the load average to 17-18 and made whole-tree guards time out. Founder chose **checkpoints** from the next batch ([D052](decisions/D052-qa-checkpoints.md)): targeted checks per task; review depth by risk (`high` 2 reviews, `normal` 1 review plus one fix, `mechanical` none); the full unit suite and build once per batch merge; the whole browser suite only at milestones M1 (end of wave 5), M2 (end of wave 6), M3 (Gate B readiness); deep QA in waves 8-9. Applied in `.claude/workflows/build-wave.js` (targeted VERIFY note, `risk` per task, `status` per result), the runbook §1-2, tasks.md (wave 5 note), the test plan header, status and index. Wave 5 part A (run wf_2de8d3c9-589) finishes under the old rules.

## [2026-10-13 21:30] build | Wave 5 part A merged: Home, product, safety, hub, three articles, 404, 4.5
Run wf_2de8d3c9-589 finished (30 agents): 4.5, 5.5 (hub) and 5.6 (three articles) passed on the first review; 5.1 (Home), 5.2 (product), 5.3 (safety) and 5.10 (404) used all three reviews and failed only on causes in shared files outside their Owns: the `us-center` spelling rule on bare layout values, the JSON-LD text detector splitting `12.[1]`, next/image renditions shifting folds by fractions of a pixel (AppScreens and the bare Photo), 16-digit doodle coordinates pushing Home's HTML over 60 KB, a guides-card tap target, and `chrome.spec` sticky-bar cases written for the legacy Home. All seven merged clean in task order (`ef959af`). 5.2's three edits outside its Owns accepted (us-center allows a bare `center`; eslint exception for the legacy Sheet story until 6.3; tracking-parity follows the removed default). New task **4.6** (shared fixes, risk high) launches with part B1 (5.4 guide, 5.7 team, 5.8 setup, 5.9 contact, 5.11 privacy) under D052; part B2 (5.12-5.14) and part C (5.15-5.19) follow. Merge-gate verify and build running.

## [2026-10-13 22:20] qa | Merge gate after part A: green apart from the one known JSON-LD detector failure
`next build` green. `npm run verify` on `04bd42b`: the first run stopped at typecheck on a stale `.next/types/validator.ts` still naming the deleted legacy product route (a fresh build regenerates it); the re-run gave 4787 passed, 11 failed: ten were 5-11 s timeouts in whole-tree guards while part B1's six builders loaded the machine, and re-run alone with `--testTimeout=120000` they pass (361 passed). The one real failure is `jsonld-matches-page` (the detector splitting `12.[1]` on `/products/kheelu` and `/safety`), which task 4.6 fixes. Runbook §2 now says: run the merge gate when no batch is building, or re-run timed-out files alone with a long timeout before calling them red.

## [2026-10-14 00:05] build | Wave 5 part B1: five of six passed on the first review (first run under D052); merged
Run wf_3b9a26ad-f78 (14 agents, 46 min): **4.6** shared fixes (high risk) and **5.4** guide, **5.7** team, **5.8** setup, **5.9** contact (normal risk) each passed their one review. 4.6 measured: Home's HTML 55.0 KB (was 66.9 KB) after rounding doodle coordinates to 2 decimals (`doodles.generated.tsx` 35.8 KB to 19.1 KB); visual parity of Home, product and safety green at the three widths after AppScreens and the bare Photo carry their own `--kh-ratio`; the JSON-LD detector ignores a space before punctuation or a source marker; the guides card links get a 44 px tap area; `chrome.spec` sticky-bar cases follow the new Home. Merged clean (`200bd17`); the safety page test no longer unwraps links for the detector (`ac61237`). **5.11** privacy (high risk) had one blocking finding; its fix and second review hit the account's session limit and were resumed from the run's cache (account apoorva@kheelona.com). Merge-gate build and verify running before part B2.

## [2026-10-14 00:40] agent | Merge gate after B1 green; part B2 launched (run wf_97020885-57b)
Merge gate on `ac61237`: `next build` green; `npm run verify` 5000 passed, 5 failed, all 5-11 s timeouts in whole-tree guards, which pass alone with a long timeout (220 passed). Fix: `vitest.config.ts` `testTimeout: 30_000` (`b187b4d`), so a busy machine no longer reports these guards red. Part B2 launched on base `b187b4d` under D052: **5.12** terms, **5.13** refund, **5.14** shipping (normal risk), **5.15** store page and **5.16** /thanks (high risk: checkout, ADR-013; `qa:payment` to the sandbox sheet only). 5.11's resumed fix round runs in wf_3b9a26ad-f78. Part C (5.17-5.19, the 18 articles) follows.

## [2026-10-14 01:35] build | 5.11 privacy merged (fix checked at the merge, D052); part A and B1 worktrees removed
Run wf_3b9a26ad-f78 resumed from cache: 5.11's fix round and second review ran; the second review found one blocking gap (the tool-count guard missed "These seven run on kheelona.com" and "all 7"), and the final fix (`2fa57ef`) builds every count pattern from one number (words to fifteen, "a dozen", digits), adds counts that name no noun, and runs the same patterns on the rendered page (status `fixed-unreviewed`). Main session checked it at the merge: the diff answers the finding; privacy, analytics-tags and the route tests 80 passed; lint and the guards typecheck clean. Merged `2485e47`. Open for the main session: the legal "Also read" links lack a 44 px tap width (`.ks-also a`, legal-template.css; also hits /terms); copy note for the founder: the approved lead "Two things blocking can't stop." counts the gaps (suggested "What blocking can't stop."); /privacy script total 162 KB is the known legacy-prefetch overrun. Part A and B1 worktrees and branches removed.

## [2026-10-14 03:10] build | Wave 5 part B2 merged: terms, refund, shipping, store page, /thanks; merge gate green
Run wf_97020885-57b (16 agents, 2 h 8 min): **5.13** refund, **5.14** shipping and **5.16** /thanks passed; **5.12** terms and **5.15** store ended `fixed-unreviewed` and their last fixes (tests only: c756d14, d499fcb) were read at the merge. Merged in order (`eb47f13`; one catalogue conflict, the /thanks folds' row). Checkout contract fixtures untouched; the store and /thanks signature fixtures and patches were reviewed in the high-risk rounds. Reconciliation `5c5f20d`: the amounts guard blanks a `{ph:…}` note before scanning (terms placeholder 3 says "delivery ₹0"; placeholders never reach production, ADR-004), with calibration; `jscpd:new` ignores the legacy playos page until 6.3 (with the old product route deleted, jscpd paired it with the legacy LegalDoc.tsx; neither changed since the tag). Merge gate: `next build` green; `npm run verify` green (329 files, 5349 passed, 1 skipped; lint 0 errors; jscpd 0 new; checksums 643). Rulings: PreorderForm's policy links on `MARKETING_ORIGIN` accepted (architecture §15.3); the full-mode refund sentence beside the pay button recorded in store.md fold 3 (frozen JSX contract, same words as fold 5); /thanks keeps one static title (ADR-013). New: [deviations](qa/deviations.md) V4 (store in-app note off, N7) and V5 (/thanks route specs see the link-needed state), V1 extended to /thanks; [open questions](open-questions.md) P15 (FAQ "we replace it" vs D033, default align), P16 (terms point 8 heading, optional), P8 note (missing `created_at` gets the D023 line). Follow-ups planned as tasks 4.7 (legal tap width, a `launch` price key for full mode, the bubble over the store form on phones, P15) and 4.8 (store parity rows, the payments line on /thanks, a paid-state parity composition, client-safe words modules); 6.1 shows the event price name since OrderSummary dropped `tierLabel`. Worktrees and branches removed. `build-wave` gains a copy stage for the articles (copywriter, CMO review, then builder in one worktree).

## [2026-10-14 03:20] agent | Wave 5 part C launched (run wf_ed84fddb-271): 4.7, 4.8 and the 18 articles
Base `aa4b39e`. 4.7 (shared content, legal pages, chrome) and 4.8 (store and /thanks presentation) at high risk; 5.17-5.19 at normal risk, each with the new copy stage: two copywriters per task write the six copy pages in the task's worktree (created by the main session: `.claude/worktrees/w5c-5.17` … `5.19`, branches `build/w5-5.17` … `5.19`), the CMO reviewer approves them (up to two rounds), then the builder commits the pages and builds the modules. Ports 3530-3534 / 6160-6164.

## [2026-10-14 03:45] agent | Part C relaunched as wf_242bc117-a1c: the first launch ran the old build-wave script
`Workflow({ name: "build-wave" })` resolved to the script loaded at session start, without the copy stage, so 5.17-5.19 started as plain builders (one drafted five copy pages itself). Stopped after about 20 minutes. Kept: 4.7's commits `e4b004d`, `d1b0b73` plus WIP `ff400f5` (item 4), and 4.8's `b3df2dc`, `be44659` plus WIP `6b9bbbd` (item 1), resumed with `stage: "finish"`. Discarded: the three article tool worktrees (no commits; the builder's draft copy was outside the copywriter and CMO process). Relaunched by `scriptPath`; the copy stage confirmed running (six copywriters). Runbook §1 notes the rule.

## [2026-10-14 06:45] build | Wave 5 part C merged: shared fixes 4.7 and 4.8, and the 18 articles (copy, CMO, build)
Run wf_242bc117-a1c (24 agents, 2 h 18 min). **4.7** (legal "Also read" tap width; a `{price:launch}` key, removing refund's full-mode stopgap; the WhatsApp bubble steps aside from the store's form on a phone; the P15 FAQ line) and **4.8** (store parity hide rules; one payments line for the store and /thanks; the /thanks paid state as a Storybook story compared with the mockup; checkout words in words-only modules: store route chunk 17.50 → 15.54 KB, /thanks 11.73 → 10.04 KB gzip) **passed** at high risk. **5.17-5.19** ran the new copy stage: six copywriters wrote the 18 copy pages, the CMO approved them (5.19 in its second review, after a blocking fix: "Should kids use AI?" now quotes Common Sense Media's age warning instead of reframing it as a build checklist), then the builders built the modules; each ended `fixed-unreviewed` with a small fix (5.17 an assets.md row; 5.18 a read time and assets.md; 5.19 two content-integrity wordings with a unit test), read and accepted at the merge. Merged `--no-ff`: 4.7 `cf07677`, 4.8 `94d01dc` (deviations.ts imports joined by hand), 5.17 `c9155e1`, 5.18 `f7a31be`, 5.19 `b8af96b` (assets.md photo rows joined, one row per file). No checkout-contract fixture changed; DS checksums 643.
**Merge-gate rulings** (main session; full list in [tasks](engineering/tasks.md) "4.9 and 5.20"): every rewritten article's `updated` is the rewrite's date, 2026-10-13, as 5.6 set it (12 modules and their tests re-pinned; copy pages note it); `stub.ts` deleted (no open body; the folder test asks for it) with the template test's stub block; the banned-phrases guard names the 15 site pages and one copy page per article slug (proven red with a page removed); the sticky-bar test pins the seven keep-close guides; `PLAIN_CLOSE_ART` adds the three AI and data guides (DS: no doodle on safety), and the template's doodle check, which passed vacuously (two pages mounted, jsdom resolved `#close` to the first), now mounts one page at a time (proven red); the /thanks route's own parity runs skip with a printed reason (`PARITY_ELSEWHERE`, V5; thanks-paid.spec proves the paid state); `llms.txt` re-pinned to 2026-10-13 and deviation **V6** added (P15 default applied); V1 and V4 wording updated (the mockup's footer payments line is hidden too); D025 read as written; 4.7's step-aside choices (off the right edge, `inert`) and 4.8's two out-of-Owns lines accepted; architecture §5.3, §11.2, §11.3 and structure.md updated.
**New follow-ups:** task **4.9** (D050 gap: the bubble can sit over the price on Home and the product page at 324 px and mid-page; the /thanks address step; BlogPosting `citation`; test-harness items) and task **5.20** (sources first: Tisseron's AI markers, CDC 4-year milestones; then the CMO reviews' minor fixes, fewer repeated head photos). Founder questions **P17-P24** added (bylines, H1 vs hub card, no pitch on talking guides, product lines on screen-time guides, B3 reuse, hard questions without answers, the data-law page's own answers and counsel, repeated photos). Two wordings changed after CMO approval (data law fold 7, AI tutor fold 4) are on the Gate B list in cmo-review-articles-5.19.

## [2026-10-14 07:20] qa | Part C closed (`180da1c`, worktrees removed); milestone M1 started: full `npm run verify:e2e`
Merge gate green at `180da1c` (build; verify 337 files, 5740 tests). Part C worktrees `w5c-5.17`…`5.19`, `wf_ed84fddb-271-1/-2` and their branches removed (the 5.19 CMO capture copied to the local `wiki/raw/qa/2026-10-14/cmo/`, D039). M1 runs every Playwright spec (Chromium; site and Storybook projects) on a fresh build; results and rulings follow in the next entry.

## [2026-10-14 08:40] qa | Milestone M1: full browser suite run and ruled; three test-side fixes; JavaScript budget re-based on Lighthouse evidence
`npm run verify:e2e` at `180da1c`: 1385 passed, 47 failed, 9 skipped (13.3 min). **(1) /team and /setup parity (10 tests):** approved departures (CMO fixes M-T1 and M-S1; D038/F11 proof-gated slots render nothing) that 5.7 and 5.8 had proved only in their unit tests: the e2e harness had no rows. Added deviations **V7** (team: the mockup's gated backgrounds and fold 5 hidden, the hero lead hidden on both sides and compared as text) and **V8** (setup: step 2 hidden on both sides, its words accepted as text); `src/content/en-IN/pages/parity-deviations.test.ts` holds each rule to exactly its lines and elements (literals in deviations.ts, because Playwright cannot load content modules that import images). All 10 green. Runbook §2 gains the step that would have caught it (parity rows at each merge). **(2) motion re-arm test:** clicked the first product link, the hidden laptop nav link at 390 px, so it timed out at 3 min (first live run: it was pending until Home and the product page were both new). Now clicks the first visible link; green 3 of 3. **(3) perf-budget (36 routes):** every route's total script was 162.9-183.6 KB against 130/150; the Next 16.3 + React 19.2 root chunks alone are 127.4 KB gzip (measured), shared layouts about 21 KB; each page's own script within its 25 KB except the 404 (35.0 KB, task 4.9 item 4). **Ruling (architecture §12; the brief §9.5 leaves the JS budget to the architect, gating on Lighthouse ≥ 90):** totals re-based to 175 KB marketing / 185 KB store; the 25 KB route budget unchanged. Re-run: 35 of 36 pass, only the 404.
**Lighthouse mobile (13.4.1, simulated, median of 3, the baseline's 10 pages):** local profile Performance 94-98 on every marketing page; with the tags loading (lp-tags) 92-97. The store first measured 88 / 86 because this sandbox blocks outbound network, so its per-request Supabase count read waited 7.0 s (TTFB) before falling back to the token price (the same read the legacy store makes; checkout logic, untouched); with the store settings blank, as in CI and on beta, it scores 95 / 94. Accessibility 96-100 (only D041 white on Chilli). Best Practices 96 local; 70 with tags against B10's ~74: report-only CSP noise that predates the reset (`upgrade-insecure-requests` ignored in report-only; GA4's `www.google.com/g/collect` and an unidentified `*.ecs.us-east-1.on.aws` beacon not listed), queued as task 4.9 item 5. Reports in `lighthouse-reports/2026-10-13/` (local only, D039).
**Also:** task 5.20 step 1 done by a verifier agent ([source verification 2026-10-14](research/source-verification-2026-10-14.md)): Tisseron's 3-6-13-18 AI markers and daily minutes, the CDC 4-year sentence item, the 30-month items against Zubler 2022, all SUPPORTED with ready lines; its finding that Tisseron's markers say "no connected toys before 6" is founder question **P25** (default: add the markers in full and drop that article's product line). `build-wave` gains a copy `mode: "fix"` for 5.20 (default unchanged). Unit gate after these changes: verify green (338 files, 5742 tests); the build-checking tests re-run after a fresh build, green.
**M1 closes wave 5.** Open into the next batch: 4.9 (incl. the 404's script and the CSP items), 5.20 (copy fixes), wave 6 (6.1; 6.2 on B11's working default; 6.4 waits on F12).

## [2026-10-14 09:05] agent | Batch after M1 launched (run wf_cd8260cf-e88): 4.9, 5.20a-c, 6.1, 6.2
Base `25ccba5`, launched by script path. **4.9** (high): the D050 price gap on Home and the product page, the /thanks address step, BlogPosting `citation`, the 404's own script (35 KB), the report-only CSP items, test-harness items. **5.20a/b/c** (normal): the CMO reviews' minor fixes to the 18 article copy pages and modules, with the new copy stage in fix mode (copywriters, a fix-pass CMO review, then the builder), the source lines of [source verification 2026-10-14](research/source-verification-2026-10-14.md), P25's working default on the 3-6-9-12 guide, and separate head-photo pools (tasks.md 5.20); worktrees `.claude/worktrees/w6-5.20a`…`c`, created by the main session with node_modules cloned. **6.1** (high): store event and partner pages, store not-found and dead ends. **6.2** (high): the three B11 checkout events (GA4 and PostHog only, no personal data, existing events unchanged); the main session confirms B11's working default; the founder may override. 6.4 waits on F12. Ports 3540-3545 / 6170-6175. Builders run store specs with the Supabase settings blank (this sandbox blocks outbound network; the store's count read otherwise waits 7 s).

## [2026-10-14 09:15] decision | D053: the founder removes the 3-6-9-12 article (P25)
Asked in the session (P25: Tisseron's 3-6-13-18 AI markers say "no connected toys before 6" and criticise talking plush toys sold from 3 as a screen alternative). Founder's answer: **remove the article** ([D053](decisions/D053-remove-the-3-6-9-12-article.md)). The journal becomes 20 articles; the old URL redirects in one hop to `/stories#screen-time`. Built as task **6.5** after the running batch merges, because 5.20a and 5.20c own two of the three related lists that name it (5.20a is fixing that article now under the old default; its changes to it are dropped by 6.5).

## [2026-10-14 01:20] decision | D054: the founder answers every open build question; the batch wf_cd8260cf-e88 finished
(Times: entries before this one ran about ten hours ahead of IST; from here they are IST from the system clock.)
At the founder's request ("ask me all the questions you have here") the main session asked every open question in
seven rounds. Answers recorded in [D054](decisions/D054-founder-answers-open-questions-2026-10-14.md): F12 (old orders
keep "Ships from 20 October 2026", the founder contacts them personally; WhatsApp confirmations are sent; balance
payments unrecorded), `24e92e3` stays on `main`, P3 (Kheelu Blue joins the D041 exception), P5 (no real-phone in-app
check: accepted risk), the report-only CSP fixed in three lines (amends D039 C10), the B11 privacy words approved, P23
(data-law guide published as built), P17-P24 as built or left out, F4 (final values before Gate B; the rest hidden),
F11/G3 (the recognition strip and background lines now, the live founder photos; amends D038), P10 (www stays a
redirect), P14 applied, P16 kept, `/ideabaaz` becomes the store's not-found (no redirect), F13 (today's tiers), the
Gate A working defaults final. The question about photos named two founders; the page has three, so all three live
photos apply (founder told). New task **6.6**; task **6.4** unblocked. open-questions, gate-a-open-items, tasks,
index, status updated.
The batch `wf_cd8260cf-e88` finished (27 agents, 2 h 6 min): 4.9, 5.20b, 5.20c and 6.1 passed; 5.20a and 6.2
fixed-unreviewed. Merge gate next. Found by 4.9: M1's local Lighthouse runs with tags on sent 2 GA4 hits and 36 Meta
gateway events to production (the harness's block list lacked both hosts; fixed at this merge).

## [2026-10-14 02:00] build | Wave 6 batch merged and reconciled; D055: the founder fills the page facts
Merged `--no-ff`: 4.9 (`8ef6d2e`), 6.1 (`3f92250`), 6.2 (`32b7afb`), 5.20a (`95ef53a`), 5.20b (`55ebeaf`; assets.md
photo rows joined by hand), 5.20c (`83cdc9f`; advik-04 row joined). Read before merging: 5.20a's fix pass (one alt per
pool photo; the tantrums guide moves off the "feelings" photo, CMO N1 and N2: the CMO's recommended option, ruled
accepted) and 6.2's last round (no code change; its four findings resolved at this merge). Reconciliation `cb55153`:
the B11 privacy words as deviation **V10** (copy page updated; the Gate A mockup keeps its text; unit test proven red),
`gated: "B11"` dropped from events.ts, architecture §8.2 and the tracking-registry guard, the Lighthouse harness now
blocks www.google.com/g/collect and the Meta gateway, and a 5.20a test typed for `tsc`. Accepted outside Owns:
6.1's `TierCheckout` and its tests, the two DS-mapped utilities (mb-5, h-7). Gate: `npm run build` green; `npm run
verify` 347 files, 5892 passed, 6 skipped; checksums 643. Contract fixtures untouched.
The build's placeholder report listed about 55 slots the production build refuses (privacy, refund, shipping, terms,
setup, product). The founder answered them one by one: **[D055](decisions/D055-page-facts-legal-setup-product-2026-10-14.md)**
(lines without a confirmed fact come off; the recipients' regions from each provider's documents; Supabase stated as
Australia until the founder says it moved). Tasks: **6.6** narrowed to team, /ideabaaz and the CSP; new **6.7** (page
facts, F4 rows hidden, P14); follow-ups of the batch filed under 6.3, 6.5 and 7.3. Next: remove the batch worktrees,
launch 6.4-6.7, then M2.

## [2026-10-14 02:13] agent | Batch 6b launched (run wf_146abbc8-31a): 6.4, 6.5, 6.6, 6.7
Base `bc645ea` (the copy stage now takes non-article pages: `build-wave.js`, runbook §1). 6.4 receipt and `/thanks`
words (high; F12 answered, D054 item 1); 6.5 the 3-6-9-12 article removed (normal; V9 rules under `stories`); 6.6
team strip, background lines and live photos, `/ideabaaz` not found, the report-only CSP (high; copy stage on
`team.md` in `.claude/worktrees/w6b-6.6`); 6.7 the D055 page facts, F4 rows hidden, P14 (high; copy stage on the
privacy, refund, shipping, terms, setup and product pages in `.claude/worktrees/w6b-6.7`). The recipients' regions
came from a research agent reading each provider's own pages on 2026-10-13: Razorpay India (its blog; the privacy
policy names no place), Resend United States, Google "data centres around the world" (no country published), Meta
"the United States, Ireland and other countries", Ahrefs United States (general policy; nothing specific to Web
Analytics). Ports 3550-3553 / 6180-6183.

## [2026-10-14 04:40] build | Batch 6b merged (6.4-6.7) with main-session rulings; merge gate green
Run `wf_146abbc8-31a` (25 agents). 6.5 passed; 6.4, 6.6 and 6.7 came back fixed-unreviewed with rulings for the main
session, made on their branches before merging:
- **6.4** (`77841dd`): the receipt's delivery row follows the `/thanks` card by the order's `created_at` (accepted: D054
  item 1 and D023 need it, or every new-site receipt would say "Ships from 20 October 2026"); the rule moved to
  `src/lib/offer/delivery-line.ts` so `lib/email` imports no section; the receipt's "Order" label reads "Order number"
  as on `/thanks`; the reviewed patch regenerated with the ruling in its header.
- **6.6** (`ceb9ef7`, `0460724`): `/ideabaaz` applied as the builder's v2 patch (checkout-freeze accepts a deletion only
  for a path in its `RETIRED` map citing the decision; the frozen page test and signature fixture go with the page; it
  answers 200 noindex like every store dead end, a Vercel constraint in `host.ts`); founder photos `alt=""` (DS Avatar
  rule); the NVIDIA alt "NVIDIA Inception Program" (the en-IN guard allows that exact string); Kashyap's line in the
  live bio's shape and past tense (CMO M2). The Karnataka mark (the state's emblem) is built as ordered and put on
  the Gate B list with the CMO's text-only recommendation.
- **6.7**: the last fix (F4 slots hidden only inside a `withoutHiddenRows` call) read and accepted; `types.ts`'s
  optional `grievanceNote` granted.
Merged `--no-ff`, no conflicts: 6.5 `c0bb934`, 6.6 `b8d43dc`, 6.4 `3e3aee1`, 6.7 `fa957d0`. Reconciliation: the
LegalTemplate test and story render the fixtures with the Gate A words (`LEGAL_TEMPLATE_GATE_A_COPY`); `llms.txt`
re-pinned (2026-10-14; only "On iPhone and Android." changed; hashes as the 6.7 reviewer computed); deviations V7 and V8
updated, V9 and V11-V16 filed; checkout, store-confirmation, architecture (§9.4 rows for D053 and `/ideabaaz`), ADR-013,
structure, components, tracking inventory §14a (the CSP now admits both beacon hosts), the hub copy page, guard-test
ownership and the batch 6b rulings in tasks.md; follow-ups under 6.3; Gate B list extended (Karnataka mark, Kashyap's
line, refund timing wording on `/terms` and the FAQ, the legal sign-off). Gate: `npm run build` green; the placeholder
report is down to 4 (the legal pages' `status: "draft"`, D029); `npm run verify` 347 files, 5983 passed, 2 skipped;
checksums 643. Next: M2.

## [2026-10-14 05:11] qa | Milestone M2: full browser suite and Lighthouse on the wave 6 tree; wave 6 closed
`npm run verify:e2e` at `77be18b`: **1485 passed, 1 failed, 24 skipped** (13.2 min; M1: 1385 passed, 47 failed). The one
failure, `motion-films.spec.ts` "the film in focus grows" at 1440, read an empty motion log: `transitionrun` is
dispatched at the next rendering frame, which the loaded machine delayed past the read (green alone 5 of 5). The test
now waits for the event (`expect.poll`), assertion unchanged; green 5 of 5 again. The four `NoFallbackError` lines
are the unknown-URL 404 tests, as at M1.
**Lighthouse mobile (13.4.1, simulated, median of 3; store settings blank, as M1 ruled):** local Performance 93-98,
Accessibility 96-100, Best Practices 96, SEO 100 (store 69, pre-approved). LP-tags Performance 91-95 (one full run had
/team at 89; five runs of /team alone: 92-95, median 93), Accessibility 96-100, SEO 100. LP-tags Best Practices 74
(M1: 70): the CSP console errors are gone (D054 item 9 works); what is left is `/_vercel/insights/script.js`'s 404,
which only Vercel's edge serves, plus the http:// audits LP-tags always flips. The harness now names that console
error apart and allows it on LP-tags only (`scripts/qa/lighthouse.mjs`; two tests in `test/lighthouse-gating.test.ts`,
proven red); every page passes. Found once on `/privacy`: a Report-Only report for the Meta Pixel's diagnostic log
(`connect.facebook.net/log/error`), not in `connect-src`; nothing blocked; open question **G18**. Reports in
`lighthouse-reports/2026-10-13/` (local only, D039).
New founder questions from the batch 6b merge: **G16** (the Karnataka seal), **G17** (refund timing wording), **G18**.
**M2 closes wave 6.** Next: wave 7 (task 6.3, clean-up and dependency retirement).

## [2026-10-14 05:12] agent | Wave 7 launched (run wf_1dbdd8e9-45e): task 6.3, clean-up and dependency retirement, base `4fa8626`
One builder, risk high (deletions across `src/`, `package.json` and the lockfile), with the two follow-up lists under
6.3 (wave 6 batch and batch 6b). Packages retired by name only (`npm uninstall <name>`, the lockfile diff read; the
registry is reachable, so `npm audit` runs); frozen checkout files and contract fixtures untouched. Ports 3560/6190.

## [2026-10-14 06:30] agent | Wave 7: the 6.3 builder lost its API connection; resumed (run wf_b9732366-0d9)
Run `wf_1dbdd8e9-45e` ended after 61 min with "Can't reach the API server (ENOTFOUND)". The builder had 21 commits on
`build/w7-6.3` (legacy UI and its guards deleted, legacy lists empty; `docs/standards` and the four puppeteer tools
retired; 13 packages retired by name: tailwind-merge, motion, lucide-react, two Radix packages, drei, fiber, three,
@types/three, zustand, vite-tsconfig-paths; four caret pins made exact; source-map-js 1.2.2 for GHSA-68fv-2mgg-jv7q;
35 public files deleted; most batch follow-ups). The main session saved its one unfinished file (the payment probe's
gtag spy) as WIP `59886bb` and ruled its open question: delete `public/product/lumi.png`; 6.3 may re-sample
1.3's two redirect guards without weakening them. Resumed at stage "finish" in the same worktree.

## [2026-10-14 07:31] build | Wave 7 merged: task 6.3 (clean-up and dependency retirement); merge gate green
6.3 passed its review (resumed run `wf_b9732366-0d9`; 26 commits). Merged `--no-ff` `4a05b92`. About 230 legacy files
deleted (old components, `features/home`, `playos`, `app/fonts`, `globals.css`, 18 legacy `src/lib` modules, 7
retired guard tests, `docs/standards`, the four puppeteer QA tools), `LEGACY_PATHS` and `LEGACY_ROUTES` empty; 11
packages retired one by one by name (tailwind-merge, motion, lucide-react, two Radix, drei, fiber, three,
@types/three, zustand, vite-tsconfig-paths), four caret pins made exact, `source-map-js` 1.2.2 for GHSA-68fv-2mgg-jv7q
(floored); `npm audit --omit=dev`: one low (dompurify via posthog-js), no high or critical; the `fflate` floor stays
(posthog-js still brings it); 36 public files deleted (all DELETE-WITH-REBUILD, `lumi.png` on the main session's
ruling); the batch follow-ups (client-only map of the new events in `track.ts`, the store's not-configured state as
`NotFoundPanel`, the axe store-tier case on the database stand-in, the payment probe's gtag spy, one copy-page reader,
stale comments and copy-page notes). Rulings: [tasks](engineering/tasks.md) 6.3 "Merged". The main session removed two
stale guard allowances (banned-phrases' KHEELONA_PLUS pending item; motion-properties' `globals.css` exemption; both
proven red with plants) and stale comments. The main checkout's `node_modules` was replaced by the worktree's, which
matches the new lockfile (no retired package left). Gate: build green (4 open placeholders, the legal drafts); verify
284 files, 5177 passed, 2 skipped; lint 0 errors, 4 warnings (was 9); checksums 643. Left: `qa:payment` on the sandbox
(7.1), six dev-only high advisories (a package decision), `README.md` and `docs/store-go-live.md` rewrites (7.3).
Next: wave 8 (task 7.1, full QA on L and LP).

## [2026-10-14 07:32] agent | Wave 8 (task 7.1) started: full browser suite (main session) and the QA agent's checks
The main session runs `npm run verify:e2e` on `f6eac29` (it also stands for 6.3's own e2e check: one run, not two)
and, after the agents finish, Lighthouse. The QA agent covers what the suites do not: tracking parity on LP (test plan
§5, every beacon answered locally), per-page criteria (§7), the redirect matrix (§8), the checkout invariants (§9),
CLS with fonts delayed (N17) and the production dry-run placeholder list; defects to `wiki/qa/defects.md`, results to
`wiki/qa/results-2026-10-14.md`. CMO built-page reviews start when the suite finishes (CPU).

## [2026-10-14 07:53] qa | Wave 8: full browser suite green after 6.3; CMO built-page reviews started
`npm run verify:e2e` at `a5124aa`: **1486 passed, 0 failed, 28 skipped** (13.5 min); it stands for 6.3's own e2e check.
The 21 store tests that need a store database (the signed event page's form, its axe case) skip on a plain run and
were run once with 6.1's read-only stand-in (fake values, nothing submitted): store-secondary and axe specs **283
passed, 0 skipped**. The other skips are the known ones (V5's `/thanks` parity, the tracking probe's LP rows, which the
QA agent covers). Three CMO reviewers started on the built pages: A conversion pages (`/`, product, AI toys, safety,
team, contact, setup, 404), B the journal (hub and 20 guides), C the legal pages and the store host. The QA agent is
still running.

## [2026-10-14 09:03] qa | Wave 8 round 1 reported; D056: the founder answers the reviews' questions; fix batch planned
QA agent ([results](qa/results-2026-10-14.md), [defects](qa/defects.md)): nothing in the site fails; no S1 or S2.
Tracking parity on LP passes every row it can prove (GA4 `G-7LMKSFEXZ9` and Meta `1051265191046395` exact; ViewContent
exact; the B11 events carry field names and codes only; nothing reached production: every beacon answered locally);
redirect matrix 256 of 256; checkout invariants all pass; CLS with fonts delayed 0.0001-0.038; the production
placeholder scan refuses exactly the four legal drafts. S3: QA-001 and QA-002 (the LP probe can leak redirect-followed
and page-close requests; PostHog drops webdriver browsers) and QA-003 (three tag diagnostic calls missing from the
Lighthouse block list: fixed now). S4 ruled: QA-004 (plan wording follows the original site), QA-005 (the footer link
to `/contact#grievance`). CMO built-page reviews: A (conversion pages) 2 blocking (overlapping tap areas on the first
phone screens; "Seven families" uncounted), 11 minor; B (journal) pass, 5 minor; C (legal and store) 2 blocking (the
WhatsApp bubble over store prices at 412; the delete limit's reach), 10 minor. V11's Meta region text corrected to the
build's ("The United States and other countries"). The founder answered eight questions in two rounds:
**[D056](decisions/D056-founder-answers-built-page-reviews-2026-10-14.md)** (delete limit left as is; "Real families";
the in-app note on; refund "reaches you"; keep the Karnataka emblem and the Kheelona+ line; no examples note; the
founder turns Meta's automatic events off). Fix batch 7.1a-7.1f in [tasks](engineering/tasks.md) "Wave 8 round 1".

## [2026-10-14 09:07] agent | Wave 8 fix batch launched (run wf_4eb5e856-7af): 7.1a-7.1f, base `fdb7580`
7.1a chrome and interaction (high), 7.1b copy fixes (high; copy stage on meet-kheelu, safety, setup, stories, home,
terms in `.claude/worktrees/w8-7.1b`), 7.1c store fixes (high; copy stage on store and store-confirmation in
`w8-7.1c`), 7.1d the related-guide ring (normal; copy stage on ten guides in `w8-7.1d`), 7.1e the LP probe's leak and
PostHog visibility (normal), 7.1f share images for the 20 guides (normal). Ports 3600-3605 / 6200-6205.

## [2026-10-14 12:01] qa | Wave 8 closed: fix batch 7.1a-7.1f merged and reconciled; full browser suite, stand-in run, payment sandbox and Lighthouse green
Run `wf_4eb5e856-7af` (27 agents, about 2 h): 7.1a, 7.1c, 7.1d, 7.1e, 7.1f passed review; 7.1b fixed-unreviewed, its
last fix (the age-3 line on `/safety` and `/setup` in the CMO's own words) checked at the merge. Merged `--no-ff`:
7.1a `ce2eb1d`, 7.1b `bdff94d` (conflicts: `home.test.tsx` imports; `e2e-harness.test.ts`'s no-rule sample page, now
the buyer's guide, since 7.1a's shared tap-area rule leaves no page without one), 7.1c `55e17f1` (`components.md`
rows), 7.1d `1a7e360`, 7.1f `f9476be`, 7.1e `08874e0`. Reconciliation `ec3991a`: the age-3 sentence "If your child is
3, keep a grown-up nearby." on the product page's FAQ 3 and the buyer's guide too (copy review 7.1b minor 2; every FAQ
answer review A M8 named now says it one way); `llms.txt` and `pricing.md` re-pinned (`PRICING_UPDATED` 2026-10-14);
deviation rows V17-V25 written, V4 retired, V7 and V9 amended; source markers' tap area cut to 4 px above and below
(7.1a's tap-area spec found neighbouring markers taking each other's taps on three articles; the spec now fails on it,
proven red with the old area planted: 5 cases); Tabs compensate no target inside the tab box; stale Storybook literals;
the shared-head-photo guard over all 20 guides; `lp.ts` decodes only PostHog's form `data`, and the probe waits for
page-close beacons; docs (architecture, test plan, defects QA-001 to QA-005, store copy pages, index, open questions
G19-G22, tasks.md merge rulings and follow-ups). Gate: build green; verify 288 files, 5467 passed, 2 skipped; lint 4
warnings; checksums 643.
Closing checks on the merged build: Playwright 1609 passed, 0 failed, 34 skipped (13.5 min; a first launch with the
store's database settings blanked showed the store's not-configured state and failed the 4.7 store-bubble tests: an
environment mistake of the main session's, re-run as the milestone runs are); the stand-in run (store-secondary, axe,
chrome, tap-areas) 453 passed, 0 skipped; `qa:payment` on the Razorpay sandbox clean (gateway order from our tier
table, sheet open, no content-policy refusal, `preorder_payment_window_opened` sent, signed webhook accepted, forged
refused; no payment completed); Lighthouse local 93-98 / 96-100 / 96 / 100, LP-tags performance 92-97 (approved
exceptions only). The `/thanks` bubble at 360 px passes over the chargeback link only mid-scroll; at the page's end it
sits clear of everything (no change). Worktrees and branches removed. New founder questions: G19 (the films heading's
"in their own homes" against the 2026-10-11 answer), G20 (`/terms` section 9's age line), G21 (the confirming `/thanks`
tab title), G22 (a refused event link's words). Next: wave 9 (7.2), the beta push and beta QA.

## [2026-10-14 12:06] deploy | Wave 9 (7.2): beta push refused by GitHub (token lacks the `workflow` scope); the live `main` has moved (G23)
Before pushing: merged `origin/beta`'s placeholder `24e92e3` (vercel.json only; ours kept, tree unchanged; `92a3b70`) so
the push is a fast-forward; checked what the push publishes for the first time (`wiki/`, 362 files, and
`design-system/`, 643, never on GitHub before): D010's rules hold (secret scan: only test fakes; PostHog files hold
aggregates only, no person or session ids; no investor material; no file over 4 MB); CI (`verify.yml`) is read-only
with no secrets, and the archive tag it needs is on GitHub; the beta build is self-contained (four legal drafts are
listed, not refused, outside production). `git push origin reset/website-v2:refs/heads/beta` was **refused**: "refusing
to allow an OAuth App to create or update workflow `.github/workflows/verify.yml` without `workflow` scope". Nothing
reached GitHub; `beta` stays `24e92e3`, `main` untouched. The active gh login lacks the `workflow` scope; the founder
refreshes it (`gh auth refresh -h github.com -s workflow`), then the main session pushes again.
Found at the same time: `origin/main` has 11 commits since the branch point (`77552ff`), 12-13 Oct: #18 the parent app
on `/privacy` and `/terms` (App Store and Play), #19 product claims withdrawn or reworded, #20-#22 the journal written in
the admin dashboard and synced at build (`tools/blog/sync.mjs`, `api.kheelona.com`, a deploy hook; CSP and image-host
changes in `security-headers.ts` and `next.config.ts`), and two CLAUDE.md edits describing it. Merging the rebuild at
Gate B as it stands would undo them: open question G23. A read-only agent is mapping each change against the rebuild.

## [2026-10-14 12:40] decision | D058: the site follows the live team's code check; the founder's rulings; wave 8b planned
A read-only agent mapped PRs #18-#22 against the rebuild ([reconciliation map](qa/live-main-reconciliation-2026-10-14.md)):
the live team's code check of 12 Oct withdrew claims the rebuild still made (one-tap delete, servers in India, the closed
library, topics and quiet hours, the new-word count, "about a minute"), and #18 added the parent app to `/privacy` and
`/terms`. The founder answered four rounds of questions: D057 (the journal from the dashboard; the films heading; the
`/terms` age line; a refused event link's words; applied in `fda50f8`) and D058 (follow the code check; Bluetooth and
the languages stay; the app is free with Kheelona+ paid on top; Aman stays the grievance officer; own-model training
with an opt-out in the app; the processors named; the report follows the app; 36 months then deleted). Narrowing notes
added to D017, D018, D020, D036, D055. Wave 8b in tasks.md: 8b.1 claims and the parent app on the pages (copy batch),
8b.2 the journal from the dashboard (architect design, then build), 8b.3 merging `origin/main` into the rebuild.

## [2026-10-14 12:45] agent | Wave 8b started: 8b.1 copy batch (run wf_c359ee74-7a4, base `0d8344b`); 8b.2 design (architect)
8b.1 in `.claude/worktrees/w8b-8b.1` on `build/w8b-8b.1` (ports 3610/6210): copy groups privacy+terms, home+meet-kheelu,
safety+setup, and ai-toys, team, stories, 404, contact, store; then the modules and parity rules; machine-file hashes
reported for the main session. 8b.2: the architect writes ADR-014 and `journal-pipeline.md` (read-only on code).

## [2026-10-14 13:23] decision | 8b.2 designed (ADR-014, journal-pipeline.md); D059: the dashboard's voice check follows the DS, uploads as fallback, the dashboard after Gate B
The architect's design: the journal reads a committed snapshot of the dashboard's posts
(`src/content/en-IN/stories/posts.generated.json`, prebuild step 15; only a production build after the flip calls the
API); one adapter `postToArticle` into the rebuild's `Article`; eight new nullable post fields and six node attributes
for the backend (§13, to pass to Aman); DS photos by key with uploads as fallback; `ui/VideoEmbed` with a reviewed
`frame-src` patch (D057); guards in three layers; the 20 guides corrected per D058 in their modules first, then exported.
The founder answered its three questions (D059). Next: wave i of 8b.2 (8b.2a, 8b.2b, 8b.2c) in parallel with 8b.1.

## [2026-10-14 13:26] agent | 8b.2 wave i launched (run wf_fed52266-980, base `7448270`): 8b.2a, 8b.2b, 8b.2c
8b.2a (the four claim-bearing guides per D058; copy groups, worktree `w8b-8b.2a`, ports 3620/6220), 8b.2b (the sync,
validator and source switch; 3621/6221), 8b.2c (VideoEmbed and the frame-src patch, a frozen file through a reviewed
diff; 3622/6222). 8b.1 still running (`wf_c359ee74-7a4`).

## [2026-10-14 13:34] deploy | `beta` pushed: Vercel deployed it behind Vercel login; CI's `npm ci` needed one lock entry; the live `main` has open security alerts (G25)
The founder refreshed the gh login (`apoorva262` now has the `workflow` scope; a first try approved as `apoorvakheelona`
failed). `git push origin reset/website-v2:refs/heads/beta` (fast-forward from `24e92e3`): `c2e0f1d`, then `82b9444`;
`main` untouched (`8c4718a`). Vercel: "Deployment has completed"; `betawebsite` and `betastore.kheelona.com` answer 302 to
Vercel's login (no bypass secret here yet). CI (`verify.yml`) failed at `npm ci`: npm 11.12 on the runner refused the
lock ("Missing: @emnapi/runtime@1.11.3"; sharp's wasm build needs it; npm 11.6 here does not check). Fixed by adding
that one entry from the registry's metadata (`82b9444`, proven with npm 11.12.1 `npm ci --dry-run`, macOS and Linux).
Dependabot on `main` (production): 1 critical, 4 high, 9 medium, 3 low; every critical and high is a package the rebuild
already has fixed (next 16.3.8, sharp 0.35.5, source-map-js 1.2.2): open question G25, for Aman to patch `main` now.
This push published `wiki/` and `design-system/` to the public repo for the first time (D010; checks in the 12:06 entry).

## [2026-10-14 15:21] build | 8b.1 merged (`24ea2e4`): claims and the parent app on the site's pages (D058); V26-V36; G26-G31
Run `wf_c359ee74-7a4` (11 agents): copy pages in four groups, CMO review passed in round 2
([review](qa/cmo-review-claims-8b.1-2026-10-14.md)), modules, parity rules; task review passed in round 2 (round 1's
blocker, a guide test that needed the withdrawn one-tap sentence on the copy pages, fixed in `0704cc0`). The merge
re-pins `llms.txt` (token 93b2979f…, full 42173ef3…) and `pricing.md` (deb48acc…, f90f7ec9…). Deviation rows
[V26-V36](qa/deviations.md) (V35, the safe-AI-toy guide's retention line, retires at the 8b.2a merge; V11 amended by V32).
Checks on the merged tree: build green; `npm run verify` 288 files, 5512 passed, 2 skipped; Playwright on the 12 changed
routes (text and visual parity, chrome, axe, no-sideways, first-screen, links, content-integrity, no-js,
legal-template): 478 passed, 8 skipped, 0 failed. Partly applied: D058 item 1's talk-time limit and WiFi off at rest
(no copy yet). New questions G26-G31 (five for the founder, one for Aman); follow-ups planned as 8b.1b. Ruled: the
providers' keep-nothing promise stays (D020 items 1-4; D058 does not supersede them) until the founder's contract check.

## [2026-10-14 15:28] build | 8b.2 wave i merged: 8b.2a (`d4f411d`), 8b.2b (`1a9fc6d`), 8b.2c (`d623cf0`); V37; G32
Run `wf_fed52266-980` (12 agents). 8b.2b and 8b.2c passed review in round 1; 8b.2a ended fixed-unreviewed after two
review rounds (the merge script had to follow 8b.1's moves; two guides had lost their deletion answer), and the main
session read its last fix (`24fd09a`) before merging. 8b.2a merged with its resolution script v2 (blob `34d3b1b`): one
parity rule for the safe-AI-toy guide (`ARTICLE_CLAIM_FIXES`, row V37; V35 retired). Merge fixes (`4c7258b`):
`JournalImageUrl` derived from `JOURNAL_IMAGES` (proven red), the sharp floor's note. Rulings: the snapshot shape is
`{ generated, posts }` (ADR-014 corrected); the lazy video player is accepted; the providers' keep-nothing promise stays
until the founder's contract check (journal pipeline §9.2); 8b.2d takes the play word and figure spacing; 8b.2e
exports the four corrected guides dated 2026-10-14. Checks on the merged tree: build green; `npm run verify` 293
files, 5804 passed, 2 skipped; Playwright on the four guides, the hub and Home (parity, axe, no-sideways,
first-screen, links, content-integrity, no-js, perf budget): 139 passed, 5 skipped, 0 failed. Docs: structure §1, §3
(the journal's scripts, config and lib), architecture §10 and §14, artifacts, index. Question G32 (the providers' place
in the four guides). Next: wave ii (8b.2d) with 8b.1b.

## [2026-10-14 15:30] agent | Wave ii launched (run wf_437afd5d-b48, base `24d7631`): 8b.2d (the adapter, the photo table) with 8b.1b (8b.1's and 8b.2a's follow-ups)
8b.2d (ports 3630/6230): `postToArticle`, `articleToPost`, the ring, the photo table, the play word and figure spacing;
no consumer switched. 8b.1b (3631/6231): `/safety`'s screenshot alt without "delete all chats"; D058's withdrawn claims
as guard entries (frozen mockups exempt only where a claim-fix rule covers the route); the safe-AI-toy and should-kids
guides' advice questions; Storybook stories and fixtures in the D058 wording. Founder items G26-G32 not in scope.

## [2026-10-14 15:51] qa | Checkpoint before the beta push (8b.1 and 8b.2 wave i in): full Playwright, the store stand-in, `qa:payment`
On `43fc8c4` (the code of `4c7258b`): `npm run verify:e2e` 1609 passed, 34 skipped, 0 failed (the same counts as wave 8's
close); the store stand-in set (store-secondary, axe, chrome, tap-areas) 453 passed; `qa:payment` clean on the
sandbox (the four fields and consent; create-order 200 with a sandbox gateway order; the amount from our tier table,
49900 paise; preorder_form_started, preorder_start, begin_checkout value 499, preorder_payment_window_opened; no CSP
refusal with 8b.2c's `frame-src`; a signed webhook accepted, a forged one refused; no payment). Lighthouse not re-run:
no layout or script change on a shipped page since wave 8 (the video player loads only on a page with a video, and
none has one; the perf-budget spec is green); it runs at 8b's close, after the journal switch (8b.2e). The diff to
`origin/beta` holds no secret, phone number or raw capture; the only addresses are aman@ and connect@kheelona.com and a
test fixture's example.org.

## [2026-10-14 17:26] deploy | `beta` updated to `ac68650` (8b.1 and 8b.2 wave i); CI green; Vercel deployed. Wave ii resumed after the usage limit
`git push origin reset/website-v2:refs/heads/beta` (fast-forward `82b9444..ac68650`); `main` untouched (`8c4718a`; the
G25 patch not yet on it). CI `verify` on `ac68650`: success (3m19s). Vercel: "Deployment has completed". Beta no
longer shows the claims D058 withdrew. Wave ii (`wf_437afd5d-b48`): both builders stopped at the account's usage limit
(reset 04:00 PDT) without a report. 8b.1b had committed `b9384ed` (the `/safety` alt) and `055ff95` (the guides' advice
questions); the main session saved each worktree's uncommitted files as unverified WIP commits (8b.2d `ce84187`:
topics, photos, nowrap, read-minutes, ring; 8b.1b `47d4942`: D058 claim entries, claims.md rows, a fixture), deleted
8b.2d's scratch test folder, and resumed both in their worktrees (run `wf_55e2af9d-ae9`).

## [2026-10-14 21:06] agent | Wave ii paused while the Mac slept (05:00-08:28 PDT), not stuck; a 4-hour sleep blocker started
`pmset -g log`: the Mac entered sleep at 05:00 PDT and only dark-woke for seconds at 05:56, 06:30, 07:00 and 08:01;
both resumed builders (`wf_55e2af9d-ae9`) show the same gaps and have worked again since 08:28. `caffeinate -i -s -t
14400` now blocks idle sleep (on battery, closing the lid still sleeps the Mac).

## [2026-10-14 22:34] build | Wave 8b ii merged (8b.2d `eab6e46`, 8b.1b `9908c4c`); rulings; wave iii (8b.2e, 8b.1d) handed to builders
Run `wf_55e2af9d-ae9` (resumed after the usage limit): 8b.2d passed review in round 2 (one blocking fix: a talking
guide could link a pasted full address to a product page or the store; now refused); 8b.1b passed in round 1. Merged
`--no-ff`, both clean. Build green; `npm run verify` 299 files, 6015 passed, 2 skipped; Storybook built; targeted
Playwright (`KH_SLUGS=safety,story-what-to-look-for-in-a-safe-ai-toy`, every project) 459 passed, 29 skipped, 0
failed; `content-integrity` over every route plus `journal-figure` 61 passed. Rulings (`07ef609`): the answer card's
detail is the nodes above a rule before the first h2 in a post with an answer (journal pipeline §4, §5.1, §13 B2);
the round trip's listed set accepted (the-gentle-way-off-the-phone 3 → 4 min, should-kids-use-ai 5 → 4 min, three
no-wrap spans; on the Gate B pack); files outside the written Owns accepted (8b.2d: vocabulary.ts, the journal
stories, journal-figure.spec.ts; 8b.1b: content-integrity.spec.ts, FaqList and ModesSection stories); FeatureSplit's
`skills` variant has no story until the weekly report ships; deviations V28 and V37 amended; artifacts rows for the
two journal fixtures. Hand-offs: `Article.meta.og` typed (8b.2e); new task 8b.1d (three claim entries narrowed so
parents' advice passes the journal validator, five rewordings caught, claims.md's withdrawn rows marked, the stories
held to the mockups through their fixes). Worktrees and branches removed. Wave iii next: 8b.2e with 8b.1d.

## [2026-10-14 22:38] agent | Wave 8b iii started (run `wf_e07be4c1-904`, base `9a25fdb`): 8b.2e the switch, 8b.1d the claim guard
8b.2e (risk high) per journal pipeline §12 with the wave ii hand-offs; its snapshot scan goes in a new guard file, not
banned-phrases (8b.1d's). 8b.1d (risk medium) per tasks.md. Sleep blocker renewed for 8 hours (`caffeinate -i -s`).

## [2026-10-14 23:57] build | Wave 8b iii merged (8b.2e `3b1e070`, 8b.1d `792108b`); 8b.3: `origin/main` merged (`dae33e6`)
Run `wf_e07be4c1-904` (1 h 18 min). 8b.2e passed review in round 1: `posts.generated.json` (the export of the 20 guides)
and `journal.ts` in one commit, every consumer on the registry, the article tests on the frozen export
(`test/fixtures/journal/approved/`), the 20 modules and `from-article.ts` deleted, `Article.meta.og` typed; rendered
words, the hub, `llms.txt` and `pricing.md` equal before and after except the ruled list. 8b.1d failed review round 1
(the narrowing let "Track your child’s new words in the app." and four other product claims through); its fix was not
re-reviewed, so the main session probed it: 13 claim wordings red, 12 parents' lines green, 0 mismatches. Both merged
`--no-ff`, clean. Main-session fixes `955720f`: stale comments (to-article.ts, ArticleTemplate.tsx, vocabulary.ts,
stories page test), the hub test's vacuous stub branch, architecture §5.4/§6.1/§9.2/§17, structure §3.3/§4/§5,
`.claude/rules/content.md`, new `.claude/rules/journal.md`; rulings in journal pipeline §12 (four inert differences
added to the ruled list; article parity once a writer edits; 8b.2g's prerequisites: the count pins). Build green
(journal-sync 20 posts pass; journal-pages 20 prerendered); `npm run verify` 301 files, 6038 passed, 1 skipped. 8b.3:
`git merge -s ours origin/main` (`8c4718a`, PRs #18-#22): every file of §11's table resolves to the rebuild's; main's
`GRIEVANCE_EMAIL` (connect@) stays out (D058 item 4); `git diff HEAD^1` empty; `origin/main` is an ancestor.
Worktrees removed after the checkpoint.

## [2026-10-15 01:05] qa | The wave 8b close checkpoint (D052): full Playwright, stand-in, qa:payment, Lighthouse, the CMO's hidden blocks
At `dae33e6` (8b.3 merged): `npm run verify:e2e` 1613 passed, 34 skipped, 0 failed (13.4 min); the store stand-in run
(Supabase stub, test keys) 453 passed; `qa:payment` clean (sandbox order `order_TntNycphjdJwuF`, 49900 paise from our
tier table, the four checkout events, no CSP refusal, the signed webhook 200, a forged one 400). **Lighthouse**
(13.4.1, simulated, mobile, on battery): local 94-98 on all ten pages (accessibility 96-100); with the tags (lp-tags)
the first medians of 3 put home 89, the store 88 and `/stories` 87 under 90; five runs each gave home 92, the store 91
and `/stories` 88. On `/stories` the tags add 240-410 ms of blocking time (about 2 ms without them) and LCP lands at
2.6 s or 3.2 s by run; no journal data in the client chunks; one run logged the Meta pixel's `//log/error` call refused
by the CSP (open question G18). Listed in the Gate B pack: re-measure on mains power. **CMO built-page review** of the
four blocks the visual pass hides whole ([review](qa/cmo-review-hidden-blocks-8b-2026-10-14.md)): passed; m1-m3 on
`/safety` fold 4 fixed (`f967d84`): "child‑safety" with a non-breaking hyphen and `text-wrap: pretty`; the third
control runs full width (`ks-trust--span-last`); the alt names the Save voice recordings switch; D046's caption on two
copy pages; V28 amended. The first try at m2 raised the selector's specificity and overrode the never list's
three-then-two layout at 1024 px and up (`/safety` 1440 grew 118 px); the visual parity test caught it, and
`:where(:nth-child(odd))` fixed it (height 5413 px, the mockup's). After the fixes: build green; the unit tests of the
touched sections and the guards 1254 passed; Playwright on safety, ai-toys, meet-kheelu, privacy and terms 570 passed
plus the re-run 65 passed. Diff since `ac68650` scanned: no secret, only aman@kheelona.com and the help@example.org
fixture; design-system/ intact (643 files); no mockup or checkout-contract file touched. Next: push `beta`.

## [2026-10-15 01:20] deploy | `beta` pushed `d79299d`: CI green; Vercel's deployment failed; beta still serves `ac68650`
`git push origin reset/website-v2:refs/heads/beta` (fast-forward `ac68650..d79299d`, with `origin/main`'s history since
8b.3). CI `verify` success (run 38622684581). Vercel: "Deployment has failed" 48 s after it started
(`dpl_7vU3JqKQVFr1e9rsP6MfMDUBiQ5T`); GitHub records no reason, the build log is only in the Vercel dashboard, the
browser extension is not connected, and the Vercel CLI is the founder's (never run). Ruled out locally: package.json,
the lock, vercel.json and next.config.ts are unchanged since `ac68650`; `npm run build` with `VERCEL=1
VERCEL_ENV=preview VERCEL_GIT_COMMIT_REF=beta` and no other variables passes (journal-sync 20 posts pass;
journal-pages 20 pages; SITE_ENV beta); no Node-24-only API in src or scripts (.nvmrc 24); the proxy bundles no
journal data. New on Vercel in this push: step 15 now checks a real snapshot and postbuild step 20 checks 20 pages
(before 8b.2e both printed "no snapshot yet"). A failed deployment is not aliased, so both beta hosts keep `ac68650`.
This log commit goes to `beta` too, to see whether the failure repeats.

## [2026-10-15 02:16] deploy | Beta's Vercel failure found and fixed: on Vercel, prerendered pages live in `.next/server/route-cache`
`f2491b0` failed the same way (`dpl_ErceHcr19K9gTeNb256WdbyvSojC`, 68 s). The founder's `vercel inspect --logs` stopped
at the CLI's login; the founder then pasted the build log from the dashboard. Prebuild passed (journal-sync 20 posts, no
request, SITE_ENV beta) and `next build` made all 41 pages, then postbuild step 10 printed "nothing to scan (no
prerendered HTML)" and step 20 failed with "no prerendered page" for all 20 guides. Cause: Vercel plugs its deployment
adapter in ("Applying modifyConfig from Vercel"), and with any adapter Next 16.3 writes each prerender under
`.next/server/route-cache/<kind>/<sha256 of the source route>/$/` instead of `.next/server/app`
(`node_modules/next/dist/server/lib/route-cache-key.js`; `build/index.js` switches on `config.adapterPath`). A local
build with `VERCEL=1` keeps the old layout, which is why every local run passed; `ac68650` deployed only because step 20
had no snapshot to check then. Step 10 would also have stopped the first production deploy at Gate B (production
refuses an empty scan). Reproduced in a clean clone with a stub adapter (`NEXT_ADAPTER_PATH`), exactly Vercel's errors;
Node 22.23.3 and a clean clone without an adapter both passed, so neither was the cause.
Fix (main session): `scripts/prerendered.mjs` lists the prerendered folders in both layouts; step 10's
`scripts/guards/placeholders.mjs --html` and step 20's `sync-posts.mjs --pages` read through it (findings keep their URL
path). Tests: new `test/prerendered.test.ts` pins the layout to the installed Next's `getRouteCacheKey` and the
`adapterPath` switch; Vercel-layout cases in `test/guards/placeholders.test.ts` and `test/journal-sync.test.ts`, red on
the old scripts (4 failures) and green on the new. Proven on the real build through the stub adapter: steps 10 and 20
pass (38 prerendered files, 20 pages; production scan too), and each goes red (exit 1) on a planted marker or a deleted
guide page. Plain build green too. `npm run verify`: 302 files, 6048 passed. Docs: [lessons §1](engineering/lessons.md#1-nextjs-16-and-vercel-behaviour),
[structure](engineering/structure.md) scripts, tasks 2.9 and ADR-004 (the folder), [Gate B pack](qa/gate-b-pack.md) §5
(check the first production build's log for both lines). No site output changes, so no e2e re-run (D052).

## [2026-10-15 02:20] deploy | `beta` `99afe51` deployed on Vercel (the route-cache fix); CI green
`git push origin reset/website-v2:refs/heads/beta` (`f2491b0..99afe51`). Vercel "Deployment has completed" 38 s after
it started (20:46:42-20:47:20 UTC); CI `verify` success. Both beta hosts answer 302 to Vercel's login, as before, so the
pages are checked in beta QA (task 7.2) once the bypass secret arrives. A Vercel deploy failure shows only "Deployment has
failed" on GitHub: the reason is in the dashboard's build log (the founder can paste it, as on 2026-10-14).

## [2026-10-15 03:18] decision | D060: the beta links open to the public (no Vercel login); kheelona.com unchanged until Gate B
The founder asked "can we make it live for public?" and chose "Open the beta links" over going live on kheelona.com
(Gate B cannot happen yet: a production build stops on the four draft legal pages, D029). The founder turns off Vercel
Authentication in the dashboard (the main session never changes Vercel settings). Checked in the code before it opens:
beta sends `X-Robots-Tag: noindex, nofollow` on every response (`next.config.ts`) and the store shows "Pre-orders open
here shortly." with the WhatsApp button (D051). Once the hosts answer 200, the main session checks them and runs beta QA
(task 7.2) without the bypass secret. [D060](decisions/D060-beta-open-to-the-public-2026-10-14.md).

## [2026-10-15 03:23] qa | Beta public (D060): smoke passed; beta QA (task 7.2) handed to a workflow (run `wf_9d6aaf76-174`)
The founder turned off Vercel Authentication: both beta hosts answer 200 with `x-robots-tag: noindex, nofollow`. Main
session smoke: 14 pages 200, a bogus path 404, robots.txt, sitemap.xml, llms.txt and pricing.md 200; betastore shows
"Pre-orders open here shortly." with no Razorpay; no Meta pixel, GA4, Ahrefs or GTM in the home page; robots meta
noindex; canonical to https://kheelona.com; `/safety` carries f967d84's alt (the newest build is served);
`x-vercel-id` `sfo1::bom1::…` (function region bom1). Beta QA scoped to what a deploy changes (D052): four checks run
in parallel by QA agents, each then refuted by a verifier: (1) hosts, N1 noindex on every route and file, the redirect
matrix on Vercel, the store APIs' 503, region and timing; (2) CTAs to betastore, chrome, the tracking probe and a
§5.3 capture walk, then a read-only HogQL check of `env = 'beta'`; (3) axe and Lighthouse on beta; (4) the store
form and `/thanks` phone screenshots from the local build with stand-in values (D051). Evidence under
`wiki/raw/qa/beta-2026-10-15/` (local, uncommitted, D039).

## [2026-10-15 03:37] qa | Beta QA (task 7.2) on hold at the founder's word ("hold beta-qa")
Workflow `wf_9d6aaf76-174` stopped mid-run, before any check reported; the keep-awake stopped too. No server, browser
or Lighthouse left running; no tracked file changed. Partial evidence stays local in `wiki/raw/qa/beta-2026-10-15/`
(uncommitted, D039). To resume: re-run the workflow script with `resumeFromRunId` (agents that finished return cached
results) once the founder says go. The beta links stay public (D060).

## [2026-10-15 03:43] ingest | The marketing advisor's homepage proposal (2026-10-12): review handed to a workflow (run `wf_13c2e74f-ae8`)
The founder shared a senior marketing advisor's homepage proposal: a content document (`Kheelona_Website_Content.docx`,
22 homepage sections, an ad first screen, a reserve page, 11 open items) and a clickable design (`Kheelona Website
Redesign.html`, the untracked file whose origin was unknown until now). The founder asked us to review the
recommendations against the current site and what makes parents buy, decide what to take, then plan and update the
site, with the usual tech and non-tech reviews. Kept local and uncommitted (a third party's draft with names):
`wiki/raw/feedback/advisor-homepage-2026-10-12/` (both files, the docx as text, the design rendered at 1440 and 390
plus the ad screen and reserve page, and the 37 numbered recommendations AP-01..AP-37); `.gitignore` names the folder.
Workflow: six reviews in parallel (copywriter; claims and compliance with the banned-phrase checker; search
visibility; PostHog evidence, read-only; benchmarks; architect for feasibility), then the CMO agent decides each item
(adopt, adapt, already, reject, founder) and writes its review page, then a buyer's advocate and a guardrails auditor
challenge the decisions. Early read (main session): the proposal conflicts with D016 (the brain promise as the
headline), the 3-7 band ("Ages 3+"), R5 (feelings), D058 (choose topics), D023 (ships 20 Oct), ADR-013 (cash on
delivery, a new form) and the DS (its own palette and fonts), and carries ideas the CMO will weigh (the
asks-back line, a hero film, stat tiles, a comparison table, sample conversations, an offer bar).

## [2026-10-15 04:40] decision | D061: the advisor's proposal reviewed and decided; wave 8c planned
Workflow `wf_13c2e74f-ae8` (9 agents, no errors): six reviews (copywriter: adapt 7, reject 15; claims: every claim
classed, the guard catches only 3 of the stale facts; search visibility; PostHog read-only: 410 paid phone sessions,
0 orders, 90% never scroll, films the most-clicked element, the buy bar and navbar produced all 3 purchases;
benchmarks; architect: Home at 56 of 60 KB HTML), then the CMO decided AP-01..AP-37 (0 adopted as written, 7 adapted,
12 already, 15 rejected, 3 for the founder; [its page](qa/cmo-review-advisor-proposal-2026-10-15.md)), then a buyer's
advocate and a guardrails auditor challenged it (resolutions in [the review](research/advisor-homepage-proposal-review.md)).
The founder answered four questions ([D061](decisions/D061-advisor-proposal-what-we-take-2026-10-15.md)): Kheelu on the
first phone screen of Home and the product page; ads stay on Home (no /lp page); the later price as a plain line on
the offer cards; parents' own words from the consented films. The two quotes were read off the films' burned-in
subtitles locally (ffmpeg frames; the transcripts stay local: they name children and a neighbourhood). Wave 8c in
[tasks](engineering/tasks.md): 8c.1 the first phone screen (high), 8c.2 the later price and the share link, 8c.3 the
quotes, recognition strip, four steps and example (high), 8c.4 the FAQ wording, a languages answer and guard entries.
[A fact pack for the advisor](brand/for-the-advisor.md) for the founder to forward.

## [2026-10-15 04:41] build | Wave 8c handed to the build workflow (run `wf_6522caae-8ac`, base `94a799f`)
Four builders in parallel worktrees (8c.1 and 8c.3 high risk: adversarial review, fix, re-review; 8c.2 and 8c.4
normal: one review), ports 3461-3464 and 6011-6014. Lighthouse in the worktrees is advisory (four builds on one machine,
on battery); the main session re-measures after the merge. Then: merge, full `npm run verify` and build, targeted
Playwright on Home and the product page, Lighthouse, the CMO's phone review of the built pages, deviation rows, beta.

## [2026-10-15 05:19] decision | D061 follow-up: seven more answers from the founder (asked after the build started)
The founder asked whether we had questions before building; the main session asked seven. Answers: the approved hero
art's Kheelu on the first phone screen (what 8c.1 builds); no label line; the share text approved as written (what
8c.2 builds); no cash on delivery (revisit after launch); Home fold 5 keeps its heading; Made in India (already decided
in D034 and on the site: footer, "Country of origin"; now also a perk on the offer cards, new task 8c.5 after 8c.2);
nothing else from the rejected list. None of the answers changes the running build.

## [2026-10-15 05:39] decision | D061 item 12: the expert video comes back as a trimmed clip (founder); cut proposals running
The founder asked to keep the counsellor's video, as "a video from an expert". It is the founder's own YouTube video
(4:46). Downloaded locally (audio, captions, 720p video; kept git-ignored in the advisor's folder) and read: the first
half is general (screens, talk), the second half makes results claims about Kheelu the site cannot carry. Founder:
a trimmed clip of the general part only; credit "Chaitra, therapist and developmental coach" (no "Dr."); written
permission on file; paid or given a Kheelu, so a disclosure line. Changes D038 F9 for this video only. The CMO and a
claims reviewer propose the cut independently (workflow `wf_7be1470f-7e4`); task 8c.6 builds it after 8c.3.

## [2026-10-15 06:11] decision | D061 item 13: the expert clip's details (founder); task 8c.6 specified
The CMO and a claims review proposed cuts independently (workflow `wf_7be1470f-7e4`): both on the product page after
the offer, both cut before "Dr." and before every Kheelu claim, both with the disclosure "Kheelona made this video with
Chaitra and compensated her for it."; the CMO found her coat badge reads "Dr Chaitra C R" beside a medical symbol.
Founder: no "doctor" in our text, the coat and badge shown as they are (risk accepted), the CMO's 34-second cut, the
original YouTube video unchanged (the site hosts its own copy, never the full video), built from the 720p download.
Task 8c.6 in [tasks](engineering/tasks.md) carries the cut, the 11 caption lines, the copy, the guard entries.

## [2026-10-15 08:00] build | Wave 8c 8c.1-8c.4 merged; verify after one guard exception; production build green
Workflow `wf_6522caae-8ac`: 8c.3 passed its adversarial review; 8c.2 and 8c.4 failed review once and were fixed (the
main session checked both fixes: the CTA spec reads the values placed after Gate A from the registry; the claims guard
has no RegExp modifier group and loads on Node 22.23.3, prebuild step 15 green on it); 8c.1 met 390 × 844 and
412 × 915 on both pages with a 4:3 phone board, not 360 × 590 (the founder: leave as built, D061 item 14), and its
last fix round was lost to a network error (worktree clean). Merged `1cdc5c1`, `6677665`, `38a1d96`, `a6e06f4`;
the main session resolved the shared rule lists (deviations.ts, two route tests, components.md) in one order and
updated two assertions (the offer rule before the claim fixes; two hero LCP images, one per board). `npm run verify`
found one red: `test/utm.test.ts` refused `src/content/en-IN/share.ts` (the share message's tagged kheelona.com
address); ruled not an internal link and given a named, self-checking exception. Production build: 20 journal pages,
no open placeholders. Deviation rows V38-V46 filed; the Gate B pack lists them and the WhatsApp ₹ check. Follow-ups
folded into 8c.5 ([tasks](engineering/tasks.md) "8c.1-8c.4 merge rulings").

## [2026-10-15 08:03] qa | Wave 8c merge: Home and the product page in the browser, green
`KH_SLUGS=home,meet-kheelu` on the merged build (`aed858d`): visual and text parity (with the V38-V46 rules),
first-screen, cta, axe, no-sideways, perf-budget, content-integrity, chrome, no-js: 190 passed, 8 skipped, 0 failed.
The 8c worktrees removed (merged, clean). 8c.5 and 8c.6 building (workflow `wf_011a9512-2c5`, base `aed858d`).

## [2026-10-15 09:14] build | Wave 8c 8c.5 and 8c.6 merged (`576c8d9`, `2729940`); review follow-ups fixed by the main session
Workflow `wf_011a9512-2c5`: both passed review first time. 8c.5: "Made in India" on both offer cards (DS `house`),
the share link in a new tab (Button gains `target`), the hero's help line out of the WhatsApp bubble's column (no
hero link under the bubble at the matrix phones; Kheelu's first-screen boxes unchanged), content-integrity allows the
cap twice on Home, llms.txt answers the languages question. 8c.6: the 34-second expert clip in its own fold after the
product page's offer (poster first, tap to play, captions in the DS style, Nunito ExtraBold on white pills, which the
main session accepted over the task's dark box; the disclosure burned in and printed under the credit); the final
file transcribed locally holds only the 11 caption lines. The clip's build and words-check scripts kept beside the
local-only source (`wiki/raw/feedback/advisor-homepage-2026-10-12/expert-video/`). The optional Home link was not
built (fold 3's one link slot is taken). Main-session follow-ups from the reviews: the poster's alt no longer says
"white coat"; the fold's never-list test reads each line apart (a leading "Dr." was missed); the endorsement entry also
catches "Recommended by a speech therapist", "Paediatrician-approved" and the like; perf-budget weighs the expert
poster; `/pricing.md` no longer lists "Made in India" under "Included" (pins re-set). Rows V47 and V48 filed; V38, V40,
V42 amended; claims.md's advisor row points to D061.

## [2026-10-15 09:26] qa | Wave 8c close checkpoint: verify, build, Storybook, browser, Lighthouse
`npm run verify` 307 files, 6489 passed; production build green (20 journal pages, no open placeholders); Storybook
built; Playwright on Home and the product page (parity with V38-V48, first-screen, cta, axe, no-sideways, perf-budget,
content-integrity, chrome, no-js, films, tap-areas): 215 passed. Lighthouse (battery, indicative): local Home 93,
product 94, store 98; with the tags Home 85, product 83, store 84 (the unchanged store also fell from 88-91, so the drop
is mostly the run's conditions; re-measure on mains power with `/stories`, Gate B pack). Found: Best Practices lost
`image-aspect-ratio` on Home and the product page: the hero board hidden at phone widths (task 8c.1) asks for a 1 px
candidate, and Lighthouse read its size from the width and height attributes although the element has no box. Phones
get sharp candidates (w=256-384, probed in Chromium at 360, 390 and 412). Fixed with `object-fit: contain` on art-board
layers (no change on screen: visual parity green on six art-board pages; BP back to 96, the audit passes).

## [2026-10-15 09:31] deploy | `beta` `cf60e8a` deployed (wave 8c); the CMO's built-page review running
The first push timed out (HTTP 408 on a slow upload with the 3 MB clip); a retry with a larger `http.postBuffer`
went through (`ee273b5..cf60e8a`). Vercel "Deployment has completed" in 32 s; the product page on beta shows the expert
fold, "Made in India", the later-price line and the parents' quotes. GitHub's push reply flagged Dependabot alerts on
the default branch (`main`, the live site: G25 is Aman's). The CMO reviews wave 8c on beta, phone first (workflow
`wf_cb359084-f20`); a second reviewer checks any blocking finding.

## [2026-10-15 09:57] qa | The CMO's review of wave 8c on beta: passed, 12 minor; tasks 8c.7 and 8c.8 building
[The review](qa/cmo-review-wave-8c-2026-10-15.md) on `cf60e8a`: all eight checks pass (the first phone screen, the offer
cards, the quotes, the strip, the expert fold, the FAQ, the page order, every new line); Lighthouse on beta Home 91,
product 99. m1 (not from 8c): Home throws React #418 on every load on beta. The main session found the cause: Vercel
re-renders Home (ISR, STALE) under the segments `["", "index"]`, so `usePathname()` is `/index` on the server and
the buy bar is left out of the HTML, then added in the browser. A stub-adapter local build prerenders `/` and has the
bar, so only Vercel's runtime shows it. Task 8c.7: a path hook that normalises `/index`, the four shell components on
it, a page-error guard in the e2e fixtures, a beta deploy check. Task 8c.8: the product page's rulings (the strip after
the offer, the clip re-encoded with raised captions, a readable disclosure and a clean poster, the clip capped on
laptops, the FAQ's "What if my child doesn't like it, or it stops working?", the film button in the languages answer,
the credit clear of the bubble, the example's closing line dropped). m9 and m12 are the founder's (workflow
`wf_71b12167-174`, base `1963f060`).

## [2026-10-15 09:59] decision | D061 item 15: no disclosure line under the parents' quotes (founder)
The CMO's m9 asked whether either family got Kheelu free or at a discount. Founder: "No need to add any line". Recorded
with the endorsement-guidelines risk accepted, as for the films (D040); the expert clip keeps its disclosure.

## [2026-10-15 11:21] build | 8c.7 and 8c.8 merged; rulings; docs
Workflow `wf_71b12167-174`: 8c.7 passed its second adversarial review (round 1 found the beta check read the build's
prerender, not Vercel's runtime render: the runbook's loop now waits 5 minutes and reads a HIT after a STALE); 8c.8
passed first time. 8c.7: `src/lib/page-path.ts` (`usePagePath()`, `/index` folded to `/`) read by StickyBuyBar,
NavBar, WhatsAppFloat and MotionController (MetaPixel and PostHogGate untouched), a whole-tree rule that only it reads
the raw path, tests with the path mocked to `/index`, a page-error and hydration guard on every e2e spec (the LP
probe's own browser not yet covered: follow-up). 8c.8: the strip after the offer (offer card 3,102 → 2,828 px at 390),
the clip re-encoded (captions' foot at 69%, ruled over 80% on the builder's evidence of Chrome's control row; the
disclosure at caption size; the poster's face clear; 700 px cap from 720 px; credit left on phones), the product FAQ's
"What if my child doesn't like it, or it stops working?", "Two languages" an in-page link that plays film 6 (ruled over
the button, which needs a new rich-text node, and the drop, which breaks the 40-word rule), the example's closing line
dropped. Rows V41, V42, V44, V46, V48 amended; the Gate B pack carries the beta deploy check; structure.md lists
page-path.ts. Follow-ups: FAQ-answer links in the browser's blue (as the approved mockup's), the LP probe's page-error
coverage, a few comments still give the expert fold's old place.

## [2026-10-15 11:48] deploy | `beta` `398c5ee` (8c.7, 8c.8): Home's runtime render carries the buy bar; no React #418
Checkpoint before the push: `npm run verify` 308 files, 6536 passed; build green; Playwright on Home and the product
page 156 passed; the stand-in run 453 passed (the page-error guard live on all). The first push failed locally (zsh read
`$H:r` as a modifier; nothing reached GitHub); `git push origin reset/website-v2:refs/heads/beta` then went through.
Vercel Ready at 06:12:18Z. The runbook's check (§5), run 5.5 minutes later: `HIT, HIT, STALE, HIT`; the HIT after the
STALE (Vercel's runtime render, still under `"c":["","index"]`) carries `class="kh-buybar`. Chromium on beta at
390 × 844 and 1440 × 900: Home and the product page each one buy bar, no page or console error (Vercel's feedback
script excluded). The CMO's m1 is fixed on Vercel.

## [2026-10-15 12:07] decision | D062: quick visual changes from here on; the project summary written
The founder: "now we are going to do quick visual changes from here on, and till we do final changes, we will keep it
quick changes" and "we will do detailed QA and other integrations once website is final." Recorded as
[D062](decisions/D062-quick-visual-changes-until-final-2026-10-15.md): per batch, `npm run verify` and the build, a
quick review only for a risky change, push `beta`, docs updated; the full Playwright, Lighthouse, CMO reviews, beta QA
and the integrations deferred to the final pass; the non-negotiables kept. [Project summary](engineering/project-summary.md)
written: where it lives, what is built (waves 1-8c), the decisions, the quality at `398c5ee`, how a batch runs,
what is deferred, what waits on the founder, and the first quick-change batch.

## [2026-10-15 12:31] decision | D063 and quick batch 1 handed to the build workflow (`wf_3b6c14b5-b84`, base `23d83d31`)
The founder chose the hero photo B2 (Advik · studio hug) from a sheet of 13 candidates in five kinds, and kept the
phone number only on `/contact` and the legal pages' seller block (E-Commerce Rules r.4(2)(d)); the GSTIN comes off
the site; the year-by-year content adapted to the claims rules by the main session (all lines `findBanned`-clean;
the guard does not catch "at their own pace", "a tutor" or "grows with them", so they were dropped by hand)
([D063](decisions/D063-quick-batch-1-choices-2026-10-15.md)). Six builders under D062's quick rules: Q1.1 hero, Q1.2
"What is Kheelu?" sticky scroll, Q1.3 safety collapsible, Q1.4 films order, offer alignment, footer gaps, Q1.5 GSTIN and
phone, Q1.6 the WhatsApp logo from Wikimedia Commons.

## [2026-10-15 12:33] build | Quick batch 1 on hold at the founder's word ("hold it")
Workflow `wf_3b6c14b5-b84` stopped before any builder committed; the six empty worktrees removed. Nothing running.
The batch stays specified in [tasks](engineering/tasks.md) (Q1.1-Q1.6) and [D063](decisions/D063-quick-batch-1-choices-2026-10-15.md),
ready to start again when the founder says go. Beta unchanged at `398c5ee`.

## [2026-10-15 13:22] decision | D065: the site sells; the founder answers G26, G28, G29, G30 before the end-to-end update
The founder asked for the whole site updated end to end, phone first and consistent across pages, as a D2C site that
sells, and went to sleep after answering: the direct promise within D016, ages 3 to 7, "Pre-order Kheelu" with a short
price line (GST and the breakdown only at checkout), first 500 on offer cards only, the daily talk-time limit (G28),
"Nothing renews without you." (G30), "Delete all chats" deletes from the servers since the app changed (G26), the
doesn't-know line (G29) ([D065](decisions/D065-selling-site-founder-answers-2026-10-15.md)). The copywriter's plan is
being written (workflow `wf_2e1884fe-cd4`); then the build.
