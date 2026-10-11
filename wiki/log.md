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
