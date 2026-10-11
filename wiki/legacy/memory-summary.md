---
title: Legacy memory summary
type: legacy-summary
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - CLAUDE.md at tag archive/pre-reset-2026-10-10 (= production main 77552ff)
  - git show archive/mid-version-2026-10-10:CLAUDE.md (lines 3-67 are the mid version's banner)
  - AGENTS.md
  - README.md
  - Technical-Todo.md (and git show archive/mid-version-2026-10-10:Technical-Todo.md)
  - FOUNDER-TODO.md
  - git show archive/mid-version-2026-10-10:MARKETING-TODO.md
  - security-review.md
  - docs/project-state.json (and the mid-version copy)
  - docs/checkpoints/closed-rounds.md
  - docs/checkpoints/migration-to-new-dsx.md (founder decisions of 2026-08-23, lines 35-60)
  - docs/copy-reference.md
  - website-builder-prompt-final-kheelona.md
  - docs/revamp-2026-07/WORKING.md
  - docs/utm-conventions.md
  - docs/posthog-settings.md
  - docs/video-conventions.md
  - docs/seo/*.md (5 files)
  - git show archive/mid-version-2026-10-10:docs/checkpoints/cmo-merge-2026-10.md
  - wiki/raw/legacy-memory/auto-memory/*.md (16 files)
  - ~/.claude/plans/*.md (5 mention Kheelona; 3 read as website-relevant)
  - src/config/site.ts, src/app/(site)/** (grep checks at 77552ff = tag archive/pre-reset-2026-10-10, 2026-10-10)
  - wiki/site/tracking-inventory.md (live PostHog reads that close three old open items)
  - wiki/open-questions.md (IDs for every open item below)
  - design-system/project/01-writing.md, 04-kheelu.md, assets/Cast/README.md (read-only, to classify legacy rules)
  - wiki/raw/brief/kickoff-brief.md
---

# Legacy memory summary

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

## What you need to know

- Old sessions left about 26 memory sources. This page sorts them: still true (§2), obsolete (§3), needs a decision (§4), open items (§5), conflicts (§6).
- Founder decisions that must not be re-raised are on [settled decisions](settled-decisions.md). Open items link their ID in [open questions](../open-questions.md).
- Two real paid orders came in (2026-09-25 and 2026-09-27). Whether Meta counted each once through CAPI is still unproven (C2).
- Production still carries wording the founder retired on 2026-10-04 ([claims](../product/claims.md) §4). Fixing it before launch is Q3.
- Most old rules were design or copy rules that the new DS and the brief replace. The store, tracking and verification rules still hold.

**How to read the citations**

- A plain path (e.g. `CLAUDE.md:674-675`) means that file at tag `archive/pre-reset-2026-10-10`
  (= production `main` at `77552ff`). Many of these files are being deleted from the working tree, so
  read them with `git show archive/pre-reset-2026-10-10:<path>`.
- `mid:` means the unreleased mid version (CMO merge, PR #16, never deployed), tagged
  `archive/mid-version-2026-10-10` (= `50827d1`). Read with `git show archive/mid-version-2026-10-10:<path>`.
- `auto-memory/<file>` means `wiki/raw/legacy-memory/auto-memory/<file>` (byte-identical copies).
- `brief §n` means [the kickoff brief](../raw/brief/kickoff-brief.md).
- In older sources "Lumi" means the product before its rename to Kheelu on 2026-09-05
  (`CLAUDE.md:461-479`). Dates matter: the old root `CLAUDE.md` is a history log, newest block first.

---

## 1. Source inventory

| # | Source | What it is | Size | Latest date in it |
|---|---|---|---|---|
| 1 | `CLAUDE.md` | Session entry point turned history log: banners per round (pixel, PostHog, video, SEO, 404s, rename, security, store), then state of play, standards, hard gates, commands, env, docs map | 82,547 B, 908 lines | 2026-09-20 |
| 2 | `mid:CLAUDE.md` | Same file plus a 65-line banner (lines 3-67) recording the CMO merge and the founder's 2026-10-04 decisions | 88,260 B, 974 lines | 2026-10-04 |
| 3 | `AGENTS.md` | Next.js 16 breaking-changes warning, pointer to `docs/standards/` | 733 B, 12 lines | undated |
| 4 | `README.md` | "For AI: how to resume" chain and the newest-round pointers | 16,280 B, 186 lines | 2026-09-20 |
| 5 | `Technical-Todo.md` | The one open-items list since 2026-08-23 (founder and engineering) | 94,102 B, 1,206 lines | 2026-09-20 |
| 6 | `mid:Technical-Todo.md` | Adds "THE CMO MERGE" block (lines 42-88) and two sell-out-sweep additions (lines 1192-1198) | 99,756 B | 2026-10-04 |
| 7 | `FOUNDER-TODO.md` | Pointer only, kept for 82 references | 918 B, 13 lines | 2026-08-23 |
| 8 | `mid:MARKETING-TODO.md` | Content list against the CMO team's content doc v7; "Claims to settle" table. **Mid version only, not at the pre-reset tag** | 11,551 B, 169 lines | 2026-10-04 |
| 9 | `security-review.md` | Security engagement: architecture map, findings F-01 to F-15, gate log, founder actions | 49,136 B, 669 lines | 2026-09-05 |
| 10 | `docs/project-state.json` | Machine state: phase, 13 blockers, handoff, test count | 23,147 B, 298 lines | 2026-09-20 (mid: 2026-10-04) |
| 11 | `docs/checkpoints/closed-rounds.md` | Archive of settled blockers and founder decisions "not to re-raise" | 75,182 B, 332 lines | 2026-08-23 |
| 12 | `docs/copy-reference.md` | Copy provenance per round; self-declared "provenance record, not current state" (lines 3-9) | 40,833 B, 506 lines | 2026-08-24 |
| 13 | `website-builder-prompt-final-kheelona.md` | The July 2026 master build spec (Brand Bible, voice-lint, facts lock, keyword map) | 53,667 B, 715 lines | July 2026 |
| 14 | `docs/revamp-2026-07/WORKING.md` | Revamp-era operating record; superseded as entry point 2026-08-23 | 11,828 B, 155 lines | 2026-08-23 |
| 15 | `docs/utm-conventions.md` | UTM scheme, `npm run utm`, paid-social block | 8,287 B, 165 lines | 2026-09-20 |
| 16 | `docs/posthog-settings.md` | PostHog dashboard settings that are the founder's | 6,274 B, 105 lines | 2026-09-19 |
| 17 | `docs/video-conventions.md` | Rulebook for adding a parent video | 8,739 B, 199 lines | 2026-09-19 |
| 18 | `docs/seo/` (5 files) | Two developer handoffs (09-05, 09-11), founder actions, app-store listing text, outreach drafts (none sent) | 55,397 B total | 2026-09-12 |
| 19 | `mid:docs/checkpoints/cmo-merge-2026-10.md` | Running record of the CMO merge and two founder review rounds | 37,346 B, 461 lines | 2026-10-04 |
| 20 | `auto-memory/*.md` (16 files) | Project auto-memory: index `MEMORY.md` plus 15 topic files (founder, brand law, feedback, pixel, PostHog, SEO, security, CMO merge, pipelines) | 73,904 B total | 2026-10-04 |
| 21 | `~/.claude/plans/fameliarise-yourself-with-the-kind-avalanche.md` | Approved plan for the CMO merge (founder decisions 1-4) | 19,599 B | 2026-10-04 |
| 22 | `~/.claude/plans/fameliarise-yourself-with-the-witty-rocket.md` | Approved plan for the video section | 10,880 B | 2026-09-19 |
| 23 | `~/.claude/plans/pasted-content-id-faa3-i-need-piped-minsky.md` | Plan for the Meta pixel migration (superseded by the records in `CLAUDE.md:3-88`) | 12,286 B | 2026-09-20 |
| 24 | `~/.claude/plans/check-out-the-decks-cheeky-castle.md` | Deck copy (founder bios for a deck family). **Skipped**: deck material, out of scope | 4,614 B | 2026-09-14 |
| 25 | `~/.claude/plans/pasted-content-id-b237-the-programs-iterative-owl.md` | Backend server operations (SSH on the API host). **Skipped**: not the website | 6,582 B | 2026-09-21 |
| 26 | `pitch-deck/` (gitignored, has its own `CLAUDE.md`) | Investor material. **Not opened**, out of scope; noted only | not measured | n/a |

**Other memory-like files found, summarised by other pages, not here:** `docs/website-steps.md`
(259,044 B, the §8.x laws: see [laws summary](laws-summary.md)), `docs/checkpoints/` (33 files,
504 KB), `docs/qa-report.md` (129,163 B), `docs/store-go-live.md`, `docs/standards/*.md` (3 files),
`docs/revamp-2026-07/BUILD-V3..V6.md`, `copy-v2.md`, `WORKING-history-2026-07.md`.

**Checked and absent in the legacy tree:** no nested `CLAUDE.md` in the project except
`pitch-deck/CLAUDE.md` (not opened); no `CLAUDE.local.md`; no `.claude/` directory at either tag (so no
`.claude/rules/` or `.claude/agents/`); no `~/.claude/CLAUDE.md`; no `~/.claude/rules/`. Today's
`.claude/rules/` and `.claude/agents/` are **new Phase 0 schema files**, not legacy memory.
`.claude/settings.local.json` is a stale permission allow-list (globally gitignored), not memory.
User-level `~/.claude/settings.json:16` holds one Kheelona-specific line, a WebFetch permission for
`api.kheelona.com`; reported, not touched (brief §7 Phase 0 step 3).

**Not copied:** the user-level plans stay where they are (read-only). If they are ever pruned, copy
rows 21-23 into `wiki/raw/legacy-memory/` first.

---

## 2. Still true

Each line names the wiki page that now owns the fact. Restated here only as far as needed to sort
it; the owning page is the source.

### 2.1 Product facts and claims → [product facts](../product/facts.md), [claims](../product/claims.md)

| Fact or rule | Source |
|---|---|
| The product is **Kheelu** (Lumi until 2026-09-05); three modes: AI mode, **Story mode** (was "Kheelu mode"), Bluetooth mode | `CLAUDE.md:461-479`, `CLAUDE.md:690-699` |
| Kheelu is a cream plush rabbit, one colourway, since 2026-08-25; the new DS describes the same toy | `CLAUDE.md:543-559`; `design-system/project/04-kheelu.md:1-12` |
| Eight named languages (English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, French), published ceiling "up to 10" | `docs/checkpoints/closed-rounds.md:313` |
| Connectivity is mode-precise: AI mode needs home Wi-Fi; Story mode and Bluetooth work offline; never a blanket "works offline" | `docs/revamp-2026-07/WORKING.md:128-130` |
| **Founder-confirmed 2026-10-04:** no camera; it says it is a toy and never asks a child for a secret; voice goes only to Kheelona's own servers, in India | `mid:CLAUDE.md:19-23`; `mid:MARKETING-TODO.md:148-151` |
| Brain claims are research-anchored: conversation helps a young brain grow and Kheelu gives a child more of it; never "Kheelu grows the brain" | `mid:CLAUDE.md:21-23`; `mid:docs/checkpoints/cmo-merge-2026-10.md:29` |
| The microphone wording was retired on 2026-10-04 as inaccurate for a wake-word toy. Replacement wording and every place production still carries the old line: [product claims](../product/claims.md) §4 (only owner). Fixing it before launch: [open questions](../open-questions.md) Q3 | `mid:CLAUDE.md:24-26` |
| Kheelona+ terms, and the unconfirmed "talking is free for life": [product facts](../product/facts.md), Kheelona+ (open: F7) | `CLAUDE.md:704-707`; `closed-rounds.md:314`; `mid:CLAUDE.md:20-21` |
| Certifications: none received; status-honest standards section; no badge before it is earned (open: F4) | `closed-rounds.md:315`; `Technical-Todo.md:907-908` |
| Specs are not final (dimensions, weight, battery runtime with test conditions, charging, materials, box contents, warranty, wake word). Show "Not yet announced", never a placeholder number (open: F4) | `Technical-Todo.md:604-615`, `909-911` |
| Battery life, warranty and manufacturing origin are deliberately absent from `src/lib/product-facts.ts` | `CLAUDE.md:368-372` |
| Manufacture origin ("designed and built here" and the sanctioned wording): [product claims](../product/claims.md) (only owner); country of origin is F3 | `mid:docs/checkpoints/cmo-merge-2026-10.md:36-38`, `383-384` |
| Team: three co-founders, Apoorva Sahu (Founder and CEO), Aman Soni (Co-founder and CTO, 14 patents filed), Kashyap C.R (Co-founder and Chief Hardware Officer, built at Intel). "We name Intel. We leave the global tech-services firm unnamed" | `CLAUDE.md:741-743`; `website-builder-prompt-final-kheelona.md:92-96` |
| Ria Mangala Rewari is **off the site entirely** (founder, 2026-10-04); her 8 journal bylines move to Aman Soni. Production still shows her | `mid:CLAUDE.md:48-50`; `mid:docs/checkpoints/cmo-merge-2026-10.md:415-418` |
| NVIDIA Inception and nasscom are "Recognised by", never "backed by"; the new DS says the same | `Technical-Todo.md:948-950`; `design-system/project/01-writing.md:70` |
| Never invent social proof: no stock or seeded "parent" footage, no fake reviews or ratings. The new DS's cast children are fictional and must never be presented as customers | `CLAUDE.md:278-280`; `design-system/project/assets/Cast/README.md:3`; `design-system/project/03-cast.md:5` |
| Never publish the product's look-rotation (rotating SKU) strategy | `CLAUDE.md:798` |
| Contact email, the WhatsApp support number, and the legacy placeholder number that is never published: [product facts](../product/facts.md), Support channel | `CLAUDE.md:699-700`, `708-710`; `closed-rounds.md:163-166` |

### 2.2 Offer, pricing and checkout → [pricing](../product/pricing.md), [policies](../product/policies.md), [checkout](../site/checkout.md)

| Fact or rule | Source |
|---|---|
| ₹499 refundable token holds one of the first 500 units at ₹4,999; ₹4,500 balance by payment link before dispatch; after 500 paid units, ₹7,999 paid in full. Mode decided server-side per request from the live paid count; the count is never published; a refund reopens a slot | `CLAUDE.md:574-582`; `src/config/site.ts:64-69` |
| Shipping starts **20 October 2026**, rendered from `SHIP_DATE_TEXT`/`SHIP_DATE_ISO` | `src/config/site.ts:138-139`; `closed-rounds.md:312` |
| Delivery included anywhere in India; prices GST-inclusive; GST is paid under reverse charge and deliberately not published | `closed-rounds.md:197`, `284` |
| One Kheelu per order; refunds of everything paid, by request, in 5 to 7 working days | `closed-rounds.md:285` |
| Payment runs on `store.kheelona.com`, served by this repo through a host rewrite in `src/proxy.ts`; Razorpay's checkout modal takes the payment; orders in Supabase; receipts via Resend; guest checkout with a signed token, no accounts | `CLAUDE.md:574-582`; `security-review.md:640-650` |
| Every pre-order CTA reaches the store in one tap | `CLAUDE.md:621`; `docs/revamp-2026-07/WORKING.md:85-91` |
| The payment path was proven with one real ₹499 UPI order on 2026-08-22 and refunded. Never re-test with real money; always refund the whole token; a partial refund does not cancel an order | `CLAUDE.md:597-605` |
| `/api/health` is the first check on any store question; it reports readiness and the offer mode (`token` or `full`) | `CLAUDE.md:593-596` |
| The store host is `noindex`; its Lighthouse SEO of about 66 is correct by design | `CLAUDE.md:808-813` |
| Event prices (₹99) run through signed QR links; the Ideabaaz event ended 2026-09-01 and its route was kept because printed QR codes point at it | `Technical-Todo.md:836-848` |
| The six store variables are secrets and never take a `NEXT_PUBLIC_` name | `CLAUDE.md:836-843` |
| Supabase migrations are applied by hand in the dashboard; shipping code before its SQL makes every pre-order return 500 | `CLAUDE.md:94-99` |
| Store laws §8.25 and §8.26 (client never sends a price, cap never leaves `mode.ts`, idempotent `markPaid`, raw-body webhook, signed address tokens) | `CLAUDE.md:615-622`; full list in [laws summary](laws-summary.md) |

### 2.3 Tracking → [tracking inventory](../site/tracking-inventory.md)

| Fact or rule | Source |
|---|---|
| Five measurement tools: Vercel Web Analytics, GA4 (manual gtag, host-gated), Ahrefs (deliberately not host-gated), Meta Pixel `1051265191046395` with server-side Purchase via CAPI, PostHog project 617632 (US cloud, behind `/ingest`, autocapture, session replay, error tracking) | `CLAUDE.md:201-207`, `519-534`, `844-857`; `Technical-Todo.md:146-153` |
| Adding, removing or changing a measurement tool changes `/privacy` in the same commit | `CLAUDE.md:523-524`, `847-848` |
| `purchase_confirmed` is sent server-side from the webhook, deliberately not named `purchase`; the gap between the two is the client-side loss rate | `CLAUDE.md:108-112` |
| Campaign keys live in one list, `CAMPAIGN_KEYS` (`src/lib/campaign.ts`), including `utm_id` and `placement`; the `kh_utm` and `kh_fbclid` first-party cookies carry attribution to the store host; `create-order` copies UTMs onto the order row | `CLAUDE.md:115-142`; `docs/utm-conventions.md:79-86` |
| Session replay never runs on the order-confirmation page (`/thanks` and `/store/thanks`); its container carries `ph-no-capture`; `/privacy` promises this | `CLAUDE.md:208-243` |
| Automatic Advanced Matching is on with all fields (founder, 2026-09-02); our own CAPI payload must never carry `child_age` or the address (consent posture at launch: G6) | `Technical-Todo.md:977-986` |
| CTA clicks are told apart by a PostHog `cta` attribute (`data-ph-capture-attribute-cta`). The eight values: [tracking inventory](../site/tracking-inventory.md) §6 (mapping them on the new site: G10) | `Technical-Todo.md:69`; `CLAUDE.md:124-128` |
| `ViewContent` fires on `/products/kheelu` with a value read from the ₹4,999 launch amount; the sell-out sweep must switch it to ₹7,999 | `Technical-Todo.md:1136-1143` |
| On any redesign the founder requires the pixel and PostHog to be carried forward, planned as "freeze plus proof" with a control | `auto-memory/feedback-analytics-carry-forward.md:8-11` |
| UTM scheme and `npm run utm`; never tag internal links | `docs/utm-conventions.md:19-44` |

### 2.4 URLs, SEO, AEO and GEO → [URL map](../site/url-map.md)

| Fact or rule | Source |
|---|---|
| The apex `kheelona.com` is canonical; `www` 308s to it | `CLAUDE.md:664-669` |
| `/products/lumi` 308s to `/products/kheelu`; legacy redirects point straight there; the Product `@id` stays `https://kheelona.com/products/lumi#product` | `CLAUDE.md:468-472` |
| Legacy Wix URLs redirect (incl. `/privacy-policy`, `/terms-conditions`, `/post/:slug*`, `/for-the-parents`); a 404 does not correct a stale index, a 301/308 does | `CLAUDE.md:321-326`; `Technical-Todo.md:401` |
| A redirect source must never shadow a `public/` directory | `CLAUDE.md:715-720` |
| `robots.txt` allows GPTBot, ClaudeBot, Google-Extended and CCBot; the apex must stay DNS-only in Cloudflare or its managed block silently disallows them (AI-crawler policy: G7) | `CLAUDE.md:330-333` |
| Indexing is not the problem; Keyword Planner shows no Indian volume for any "AI toy" phrasing; the demand is in answer engines; about 1,050 of 2,280 homepage impressions were a "Lumi" name collision | `CLAUDE.md:361-367` |
| Stale third-party profiles (Play Store "Lumi" x7) outvote the site in AI answers; the off-site half is the founder's | `CLAUDE.md:352-360` |
| Resubmit the sitemap after any round that adds URLs | `CLAUDE.md:326-327` |
| Never add `aggregateRating` or `review` schema to clear a warning | `Technical-Todo.md:588-590` |
| FAQ answers stay in server HTML (native `<details>`), because AI crawlers do not run JavaScript | `docs/revamp-2026-07/WORKING.md:131-135` |
| Next merges metadata shallowly: a page's `openGraph` replaces the layout's (lost `og:image` on 31 pages once) | `CLAUDE.md:480-489` |

### 2.5 Engineering and verification lessons → [engineering lessons](../engineering/lessons.md), [laws summary](laws-summary.md)

| Lesson | Source |
|---|---|
| Stack: Next.js 16.3.4 (App Router), TypeScript, Vercel, Node 24+, Supabase, Razorpay, Resend; app at repo root | `CLAUDE.md:434-450`, `715-720`, `763-794` |
| `--save-exact` always; never a bare `npm install` (moves 23 packages incl. Supabase on the payment path); zero `overrides` | `CLAUDE.md:434-450` |
| A green test suite is the null result for framework-shaped defects; look at real artefacts (served HTML, crawls, screenshots, receipts) | `auto-memory/project-kheelona-com-build-prompt.md:69-87` |
| A mock cannot tell you where a third party keeps its data | `CLAUDE.md:120-128` |
| A path in config is a claim about what the browser reports, and this repo rewrites paths | `CLAUDE.md:235-243` |
| An absence measured by the wrong instrument is not an absence: build the control first | `CLAUDE.md:50-58` |
| `next start` is not Vercel; never throw `notFound()` on a mistypable route | `CLAUDE.md:391-410` |
| `next dev` on `127.0.0.1` does not hydrate (use `localhost`); hidden tabs freeze reveals; grepping HTML also searches the RSC payload | `CLAUDE.md:284-292`, `732-740` |
| No `<video>` element on a page at rest (axe "video-caption" is critical) | `CLAUDE.md:268-271` |
| Never animate X on a full-width element (widens the phone viewport); the hero LCP image must stay the largest element; a copy-only hero's first room ships reveal-free | `CLAUDE.md:711-714`, `899-902` |
| A Vercel env var applies only to deployments created after it changes | `auto-memory/project-security-engagement-2026-08.md:23-24` |
| Guard tests enumerate through `git ls-files` (the index): stage deletions before counting; `git stash pop` does not restore the index | `CLAUDE.md:303-308` |
| Port 3456 may hold a stale `next-server`; full-page screenshots over about 16k px tile | `mid:CLAUDE.md:58-62` |
| Check how an asset is referenced before calling it dead (template strings; decisions kept only in code comments) | `docs/revamp-2026-07/WORKING.md:95-101` |
| Agents can fabricate (a cited "CVSS 9.5" advisory that 404s): spot-check IDs | `auto-memory/project-kheelona-com-build-prompt.md:102-103` |
| `qa:sweep`'s default store URL aims at production DNS; use `SWEEP_STORE=http://store.localhost:<port>` | `Technical-Todo.md:1053-1067` |

### 2.6 How the founder works → [settled decisions](settled-decisions.md)

| Rule | Source |
|---|---|
| Plan first, one consolidated batch of questions with recommendations, then autonomous execution; screenshot-verify before any go-ahead | `auto-memory/feedback-founder-working-style.md:13-24` |
| The founder's taste in motion is low: "immersion must whisper"; bias towards stillness over spectacle (useful context for [motion](../design-system/motion.md)) | `auto-memory/feedback-redesign-2026-07.md:20` |
| Keep records current in the same commit as each change (now the wiki, brief §5) | `auto-memory/feedback-living-documentation.md:11-21` |

---

## 3. Obsolete because of the reset

| Legacy rule or fact | Source | Replaced by |
|---|---|---|
| Source-of-truth precedence: content PDF verbatim, then the build prompt, then DS v3 | `CLAUDE.md:754-762`; `website-builder-prompt-final-kheelona.md:15-24` | brief §3 |
| Home copy taken verbatim from `kheelona homepage website content.pdf` and its sanctioned deviations. The PDF was not copied into the wiki; it is recoverable from the tag with `git show "archive/pre-reset-2026-10-10:kheelona homepage website content.pdf"` | `CLAUDE.md:755`; `docs/copy-reference.md:14-20` | positioning docs and the Copywriter (brief §6); see [positioning](../brand/positioning.md) |
| The July Brand Bible: "understand their heart", the five feelings, ages 3 to 6, ₹9,999 after launch, "no payment at pre-order", "join the pre-order list", 10 languages, and a variant of the retired microphone line ([claims](../product/claims.md) §4) | `website-builder-prompt-final-kheelona.md:35-107` | positioning docs; current facts above. Several of its lines are already banned by tests (`docs/copy-reference.md:371-382`) |
| Design authority = `Design/Kheelona-Design-System-v3/` (§8.27), its token gate and site extensions | `CLAUDE.md:495-502`, `757-762` | the new DS in `design-system/` (brief §4.1); old DS deleted per brief §2 |
| Styling laws: Instrument Serif italic accent, serif only in quotes, 13px orange-ink kickers, all text left-aligned, white finale rooms, "one orange" (§8.42-i) | `CLAUDE.md:899-902`; `mid:CLAUDE.md:43-47` | the new DS ([overview](../design-system/overview.md)) |
| CTA styling: brand orange `#EF762F` with white labels at an accepted 2.88:1 | `CLAUDE.md:567-573` | new DS `cta` colour and brief §9.6 (WCAG 2.2 AA) |
| Calm ambient sky, dormant 3D journey, Tripo mascot pipeline | `CLAUDE.md:898`; `auto-memory/tripo3d-mascot-pipeline.md` | DS motion rules and brief §9.11 |
| **Kheelu as mascot and site narrator**: the Foxy-Deer corner guide, `say=` lines (48-char limit, founder approval), the contraction exemption for Kheelu's speech | `CLAUDE.md:797-798`, `899-902`; `auto-memory/brand-kheelu-lumi-law.md:16-18` | retired on the mid version (founder, 2026-10-04, `mid:CLAUDE.md:14-18`); the new DS defines "Kheelu, the product" (`design-system/project/04-kheelu.md:1-3`) |
| Art reconciliation (rabbit vs Foxy-Deer) and the parked "Hi, I'm Kheelu" hero line | `Technical-Todo.md:470-504`, `596-602` | moot: no narrator in the new design |
| **Ages "3+" with no published ceiling** (founder decision #8, 2026-08-23) and the dead-range guards in `seo.test` | `CLAUDE.md:690-693`; `mid:MARKETING-TODO.md:30` | brief §2: ages 3-7 (see [age-band review](../product/age-band-review.md)) |
| Lighthouse gates "A11y/BP/SEO 90+, Perf 90+ desktop"; QA widths 390/1280 | `CLAUDE.md:808-813`, `732-740` | brief §9.5, §9.10 (mobile median of 3; 360/390/412 and 1366/1440) |
| "Only two sanctioned price surfaces" (`PREORDER_OFFER_LINE`, `PRICE_CAPTION`) | `docs/copy-reference.md:384-392` | brief §9.1: price, offer, delivery and returns beside every CTA, from the checkout's source |
| Tutor narrative "in exactly four places" (V6) and other V4-V6 content laws | `CLAUDE.md:628-640` | new messaging ([messaging](../brand/messaging.md)) |
| R4 polish items, Home vs Meet Kheelu overlap, three parked R4 design calls | `Technical-Todo.md:1069-1119` | new strategy and design |
| Requests for real photography (R9-a) and Gemini-generated art kits | `Technical-Todo.md:934-936`; `CLAUDE.md:796` | brief §2: imagery only from the DS zip |
| "Ria reads her /team card" and "one de-contracted line" | `Technical-Todo.md:925-930` | Ria is off the site; voice rules move to [voice](../brand/voice.md) |
| The mid version as a whole: PR #16, §8.42, `analytics-freeze` test, `RESERVE_LABEL`, `StickyReserveBar`, `lib/faq.ts` sync tests | `mid:CLAUDE.md:3-67` | archived and deleted per brief §2 (see [cleanup](cleanup.md)); its founder decisions are carried in [settled decisions](settled-decisions.md) |
| Entry points: README "For AI" chain, `project-state.json`, `FOUNDER-TODO.md` pointer, `WORKING.md` cold restart | `README.md:9-60`; `WORKING.md:16-25` | `wiki/status.md` and `wiki/index.md` (brief §5) |

---

## 4. Needs a decision

True before the reset; the reset may change it. IDs point to [open questions](../open-questions.md).

| Item | Legacy position | Why the reset reopens it | Who decides |
|---|---|---|---|
| CTA label | Four candidates (live, founder decision #9 of 2026-08-23, mid, DS): [messaging](../brand/messaging.md), CTA labels | brief §6: labels come from the strategy; §9.1: one label everywhere | Gate A: **G1** |
| Drafted testimonials on named people | Keep as they are (founder, 2026-07-28) | brief §4.2, §9.8 forbid fabricated social proof | **Decided by the brief**: they do not move to the new site (section E) |
| Non-DS media: 7 consented parent videos, founder headshots, recognition logos, app screenshots, 19 journal hero photos, Lori/Lua/Robu renders, mascot drawings on journal pages | Live on production | brief §2 "only the photos, illustrations and art in the new design-system zip"; the DS has none of these | Gate A: **G3** |
| Voice rules: no em dashes, no contractions, rarely lead with "AI", second person present tense, exact names | Hard gate (`CLAUDE.md:797`) | Voice now comes from positioning plus the DS writing guide | Positioning agent in [voice](../brand/voice.md) |
| Lighthouse best-practices 74 on production, caused by the Meta Pixel's third-party cookie | Accepted (founder, 2026-09-06) | brief §9.5 needs sign-off for any score under 90 | Gate A: **G10**; re-signed at Gate B |
| CSP still Report-Only; enforce clock reset twice (2026-09-01, 2026-09-19) | Mine to flip after reading reports | The rebuild changes scripts; parity must hold | **C10** (recommendation: Report-Only through launch) |
| `ViewContent` on Home | Founder request on the mid version, never deployed (`mid:CLAUDE.md:31-35`) | brief §9.4: existing events may not change | Gate A: **G10** |
| `/how` and `/faq` pages | Built on mid only (`mid:CLAUDE.md:11-13`) | brief §2: new pages only with research value | Gate A: **G8** |
| PlayOS in nav vs footer; `/playos` page | V4 D6 nav tab; mid moved it to the footer | brief §2 allows proposing to drop or merge `/playos` | Gate A: **G8** |
| Folder structure and component standards (`src/` atomic design; a Storybook story and a Vitest test per component) | Binding since 2026-07-12 (`CLAUDE.md:763-794`) | brief §9.12 gives a starting structure | Architect, Phase 4 |
| Manual sell-out copy sweep when 500 units sell | Standing trigger (`Technical-Todo.md:1130-1143`) | brief §9.1: prices render from the checkout's own source | Gate A: **G9** (display only, no logic change) |
| Lori/Lua/Robu renders kept "for parity" with kheelona.ai | Decision 2026-08-23 (`Technical-Todo.md:1201-1206`) | brief §2: delete unused assets | Founder, via [cleanup](cleanup.md) |
| Product line-up chips (Kheelu Speaker 5+, AI books 3+) | `CLAUDE.md:693-694` | ages 3-7 (section E) | Product agent / SKM |
| Standards list on `/safety` ("Designed for" COPPA, GDPR-K, DPDP; ISO 27001 "In progress") | Mirrored from kheelona.ai (`src/app/(site)/safety/page.tsx:55-62`) | brief §9.7 asks for BIS/ISI status; ages 3+ grading | **F4**; [claims](../product/claims.md) |
| Store page shows the ship date only after the form on a phone | Founder removed the store paragraph, 2026-08-24 (`Technical-Todo.md:1160-1164`) | brief §9.1: price, offer, delivery and returns next to the CTA | Checkout agent (copy and layout only) |
| Video captions contain em dashes; one carries a "sound on" badge | Ship now, fix later (founder, 2026-09-19) | Depends on the voice and imagery decisions | Gate A: **G3** |

---

## 5. Open items carried from the old queues (status as of 2026-10-10)

Status as of 2026-10-10. Where a live read has since closed an item, the row says so and links the
evidence. The last column is the item's ID in [open questions](../open-questions.md) ("–" = not a
founder question).

| Item | Source | Owner | Due / priority | Open question |
|---|---|---|---|---|
| Post-dispatch returns and warranty terms | `Technical-Todo.md:27-38`, `823-832` | Founder | LOW until 5 Oct, **HIGH since 5 Oct**; first dispatch 20 Oct | F1, Q3(b) |
| Two DPDP lines on `/privacy` (retention period, grievance contact); session replay and US storage to put before counsel | `Technical-Todo.md:886-897`, `217-219`; `security-review.md:419-425` | Founder + counsel | **HIGH since 5 Oct** | F2, Q3(c) |
| What the site says once dispatch starts on 20 Oct (10 days away) | `src/config/site.ts:138-139`; `CLAUDE.md:574-582` | Founder | Before 20 Oct | F12, Q3(d) |
| Specs (D08), MRP, toy-safety certificates, wake word | `Technical-Todo.md:604-615`, `905-914` | Founder / SKM | Open since July | F4 (MRP: F3) |
| Kheelona+ ₹ price | `Technical-Todo.md:905-906` | Founder | Gated | F7 |
| Camera yes or no | `Technical-Todo.md:912-914` | Founder | **Answered "no camera" on 2026-10-04** (`mid:CLAUDE.md:19`); production list is stale | – |
| ~~One Purchase (not two) on the next real order~~ **Orders came in**: two real paid orders, 2026-09-25 and 2026-09-27 (PostHog `purchase` 2, `purchase_confirmed` 2, `preorder_address_saved` 2: [tracking inventory](../site/tracking-inventory.md), live snapshot). Still unproven: that Meta received each Purchase through CAPI and counted it once, and that the rotated token works | `Technical-Todo.md:95`, `1011-1023` | Founder | Check Events Manager and the Vercel log for those two orders | **C2** |
| Old pixel's "last received" must keep ageing | `Technical-Todo.md:97` | Founder | Was "check tomorrow" (2026-09-21); no later record | no ID yet |
| Re-tag Meta ads (`utm_source=facebook`, `placement`), rename campaigns `<yyyy-mm>-<slug>` | `Technical-Todo.md:47-57` | Founder | HIGH | C5 |
| ~~PostHog visitor-country check through the proxy~~ **Closed**: countries resolve through the proxy ([tracking inventory](../site/tracking-inventory.md) §8) | `Technical-Todo.md:127` | – | Done | – |
| ~~PostHog replay retention 30 days applied~~ **Closed**: the project reads 30-day retention ([tracking inventory](../site/tracking-inventory.md) §6) | `Technical-Todo.md:203-209` | – | Done | – |
| PostHog Installation Health 7/7 | `Technical-Todo.md:129` | Founder (PostHog Analyst may read it via MCP) | MEDIUM | no ID yet |
| Read production CSP reports, then flip to enforce | `Technical-Todo.md:177-180`, `806-821` | CTO | Open | C10 |
| Re-measure Lighthouse on production | `Technical-Todo.md:181-184` | CTO / QA | Phase 1 baseline | – |
| App Store and Play Store listings still say "Lumi"; profile back-links; YNOS and F6S corrections | `Technical-Todo.md:335-348`, `373-375`, `441-442` | Founder | HIGH (GEO) | C6 |
| 2026-10-03 GEO re-measure (two Perplexity prompts, GSC AI impressions) | `Technical-Todo.md:383-386`, `445-446` | Search agent | **Past due** | – |
| Re-export videos without em dashes | `Technical-Todo.md:255-263` | Founder | Open | G3 |
| `markRefunded` depends on webhook order; `/thanks` cannot tell a missing order from a failed query | `Technical-Todo.md:1031-1040`, `522-527` | CTO, founder approval (brief §4.4) | Not urgent | C10 |
| "Pay ₹0 and reserve" seen once on the store; a bad `event_tiers` row may exist | `Technical-Todo.md:1025-1029` | Founder | Open | C10 |
| Two test rows in Supabase to delete or close | `Technical-Todo.md:916-921` | Founder | Cosmetic | C10 |
| Re-check the `fflate` exemption when `posthog-js` moves; dependency floors | `Technical-Todo.md:191-194`, `534-537` | CTO | Standing | – |
| `qa:sweep` default store URL | `Technical-Todo.md:1053-1067` | CTO | Tooling | – |
| `SectionHeading` leading defect (mid only) | `mid:Technical-Todo.md:86` | n/a | Moot with the rebuild | – |
| Publish `/.well-known/security.txt`? | `security-review.md:668` | Founder | Non-blocking | C10 |

---

## 6. Conflicts found between the legacy sources

The last column says where each conflict is now settled or tracked (IDs in
[open questions](../open-questions.md)).

| Conflict | Sources | Customer sees it? | Settled or tracked |
|---|---|---|---|
| Age band: brief 3-7 vs "3+, no ceiling" (decision #8) vs new DS "ages 3+" and Kheelu's voice "3-6" vs the July spec "3 to 6" | brief §2; `CLAUDE.md:690-693`; `design-system/project/01-writing.md:67`, `75`; `website-builder-prompt-final-kheelona.md:87` | Yes | Decided by the brief: 3-7 (section E); wording at 3-7 is G5 |
| CTA label: four candidates ([messaging](../brand/messaging.md), CTA labels) | `src/config/site.ts:94`; `mid:CLAUDE.md:27-30`; `docs/checkpoints/migration-to-new-dsx.md:52` | Yes | G1 |
| Microphone wording retired on mid (2026-10-04) but still live on production, Product JSON-LD included | `mid:CLAUDE.md:24-26`; locations on [product claims](../product/claims.md) §4 | Yes | Q3(a) |
| Manufacture origin: the live wording claims more than any source supports, and brief §9.7 requires a country of origin | [product claims](../product/claims.md) (only owner) | Yes | F3 |
| Testimonials kept vs brief's no-fabricated-social-proof rule | `closed-rounds.md:153-156`, `316`; brief §4.2, §9.8 | Yes | Decided by the brief: they do not move (section E) |
| Counsel: "Legal counsel review waived" vs "counsel lead time is the constraint" for DPDP and returns | `closed-rounds.md:317`; `Technical-Todo.md:37`, `886-891` | Yes (legal pages) | F2 |
| Camera question still open in production's list vs confirmed "no camera" on 2026-10-04 | `Technical-Todo.md:912-914`; `mid:CLAUDE.md:19` | Yes | Settled 2026-10-04 ([settled decisions](settled-decisions.md)) |
| Kheelu = mascot/narrator (hard gate) vs Kheelu = product (rename 2026-09-05; new DS); production hero still says "Hi, I'm Kheelu" beside the product | `CLAUDE.md:797-798`, `452-460`; `design-system/project/04-kheelu.md:1` | Yes | Moot: no narrator in the new design |
| DMARC blocker still "open" with the old `p=quarantine` plan vs done as `p=none; sp=quarantine` on 2026-09-12 | `docs/project-state.json:211-219`; `Technical-Todo.md:850-884` | No | Settled 2026-09-12 |
| Repo visibility: video section still recommends going private vs decided public on 2026-09-19 | `Technical-Todo.md:284-287` vs `677-695` | No | Q1 (committing the wiki and DS) |
| Deploy ownership: brief "you deploy at Gate B" vs "Vercel is the founder's, never run the CLI" | brief §2; `CLAUDE.md:674-675`, `389` | No | Decided: "You deploy" = merge to `main` after the Gate B OK (section E) |
| Device split: brief ~70% mobile vs the video plan's "60% of traffic" | brief §1; `~/.claude/plans/fameliarise-yourself-with-the-witty-rocket.md:148` | No | PostHog Analyst to measure |
| `security-review.md` header says three items are with the founder; its body says two things are left | `security-review.md:3-4` vs `24-28` | No | Q5 (what happens to the file) |
