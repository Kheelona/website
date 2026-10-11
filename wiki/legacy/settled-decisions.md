---
title: Settled founder decisions (legacy)
type: legacy-decisions
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - CLAUDE.md at tag archive/pre-reset-2026-10-10 (= production main 77552ff)
  - git show archive/mid-version-2026-10-10:CLAUDE.md
  - git show archive/mid-version-2026-10-10:docs/checkpoints/cmo-merge-2026-10.md
  - git show archive/mid-version-2026-10-10:MARKETING-TODO.md
  - Technical-Todo.md
  - docs/checkpoints/closed-rounds.md
  - docs/checkpoints/migration-to-new-dsx.md (founder decisions of 2026-08-23)
  - security-review.md
  - docs/project-state.json
  - docs/posthog-settings.md
  - website-builder-prompt-final-kheelona.md
  - wiki/raw/legacy-memory/auto-memory/*.md
  - wiki/raw/brief/kickoff-brief.md
  - wiki/site/tracking-inventory.md (replay retention read live)
  - wiki/open-questions.md (IDs)
---

# Settled founder decisions (legacy)

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

Decisions the founder took before the reset. **Rows marked BINDS must not be re-raised.** Rows marked
OVERRIDDEN are replaced by the [kickoff brief](../raw/brief/kickoff-brief.md) (section named).
Where an override changes what a customer sees, the brief (§3) asks for it to be flagged rather than
resolved silently, so those rows say **CONFIRM** and name their ID in
[open questions](../open-questions.md) (Q, F, G, C IDs; "section E" = already decided by the brief).

`auto-memory/` is `wiki/raw/legacy-memory/auto-memory/` (as in the [legacy memory
summary](memory-summary.md)). The facts themselves live on their owning pages; this page records only
the decision and its status.

**Status key:** BINDS · BINDS, reconciled (still holds, read with the brief) · OVERRIDDEN (brief §) ·
OVERRIDDEN, CONFIRM (customer-visible, open for the founder) · MOOT (no longer applies).

---

## Tracking and measurement → details in [tracking inventory](../site/tracking-inventory.md)

| Decision | Date | Source | After the reset |
|---|---|---|---|
| The Meta Pixel is `1051265191046395`, the ad account's pixel, chosen for ownership; losing the old pixel's history was accepted; the engineering recommendation (keep the old one) was put twice and declined | 2026-09-20 | `CLAUDE.md:3-10`; `auto-memory/project-meta-pixel-2026-09.md:13-23` | **BINDS** (and brief §9.4 requires the same ID) |
| The retired pixel `1045085251085243` cannot be deleted; every connection was removed and its dataset excluded from the business Conversions API connection instead | 2026-09-20 | `CLAUDE.md:42-45`, `70-80` | **BINDS** |
| Automatic Advanced Matching stays ON with all fields (recommended off twice); `/privacy` wording was changed to match | 2026-09-02 | `Technical-Todo.md:977-986` | **BINDS** (brief §9.4: consent behaviour stays exactly as it is); the launch consent posture is G6 |
| Meta campaigns stay on the Traffic objective | 2026-09-20 | `Technical-Todo.md:100` | **BINDS** (ads, not the site) |
| No "re-fire guard" on `/thanks` for Purchase: the concern is false (raised three times) | 2026-09-02 | `Technical-Todo.md:1001-1009` | **BINDS** |
| `purchase_confirmed` is sent server-side and deliberately named differently from `purchase`; do not reconcile the two counts | 2026-09-20 | `CLAUDE.md:108-112` | **BINDS** |
| "Signup" means the paid pre-order; no waitlist is to be built | 2026-09-20 | `CLAUDE.md:101-103`; `auto-memory/project-posthog-2026-09.md:55-57` | **BINDS** |
| PostHog added as the fifth tool, **additive to GA4** ("additive for now") | 2026-09-19 | `Technical-Todo.md:146-153`, `198-202` | **BINDS** (brief §9.4 parity keeps all five) |
| PostHog key hardcoded and host-gated; a Vercel secret was offered and declined (a `NEXT_PUBLIC_` value cannot be a secret) | 2026-09-19 | `CLAUDE.md:204-207` | **BINDS** |
| PostHog stays anonymous: `identified_only`, nothing calls `identify()` | 2026-09-19 | `docs/project-state.json:278-284` | **BINDS** |
| Session replay: retention cut to 30 days, sampling stays 100% (dashboard settings, founder to apply) | 2026-09-19 | `docs/posthog-settings.md:7`, `16-41` | **BINDS**, and **applied**: the project reads 30-day retention with no sampling ([tracking inventory](../site/tracking-inventory.md) §6) |
| PostHog Replay Vision (AI scanners over recordings) declined; revisit only on the stated trigger | 2026-09-19 | `Technical-Todo.md:210-216` | **BINDS** |
| PostHog runs through a reverse proxy (`/ingest`), knowingly defeating ad blockers; an in-product "do not record me" opt-out was offered and declined | 2026-09-20 | `CLAUDE.md:152-158`; `Technical-Todo.md:138-142` | **BINDS** |
| The Ahrefs tag is deliberately not host-gated (Ahrefs verifies by fetching the page) | 2026-07-30 | `Technical-Todo.md:1181-1185` | **BINDS** |
| Click-to-WhatsApp conversions are parked (needs the WhatsApp Business Platform, not the app) | 2026-09-20 | `Technical-Todo.md:103-110` | **BINDS** (parked) |
| Any redesign must carry the pixel and PostHog forward as "freeze plus proof"; the founder rejected a plan without that section | 2026-10-04 | `auto-memory/feedback-analytics-carry-forward.md:8-11` | **BINDS**, and brief §9.4 now says the same |
| Production Lighthouse best-practices 74 (78 with the CSP enforced) is accepted because of the Meta Pixel's third-party cookie; do not drop the pixel to fix it | 2026-09-06 | `Technical-Todo.md:743-781`; `CLAUDE.md:800-807` | **BINDS, reconciled**: it is the ready root cause, but brief §9.5 asks for the founder's sign-off again (pre-approval at Gate A: G10) |

## Privacy and data

| Decision | Date | Source | After the reset |
|---|---|---|---|
| Session replay never runs on the order-confirmation page; `/privacy` promises it | 2026-09-19 | `CLAUDE.md:208-243` | **BINDS** |
| GA4 retention confirmed at 14 months; deleting the old URL-borne tokens was declined | 2026-08-23 | `security-review.md:569-575` | **BINDS** |
| The two DPDP lines (retention period, grievance contact) and the post-dispatch returns and warranty terms were parked as LOW **until 5 October 2026, then HIGH** | 2026-09-12 | `Technical-Todo.md:27-38`; `CLAUDE.md:337-341` | **Now HIGH and open**: not a settled answer. Facts: F1 (returns, warranty), F2 (DPDP); shipping a copy fix before launch: Q3(b), Q3(c) |
| Legal counsel review "waived by you" | not dated in the row (archived 2026-08-23) | `docs/checkpoints/closed-rounds.md:317` | **Conflicts** with the 2026-09-12 note that counsel lead time is the constraint (`Technical-Todo.md:35-37`, `886-891`); asked in F2 ("is counsel reviewing?") |

## Infrastructure, access and process

| Decision | Date | Source | After the reset |
|---|---|---|---|
| **Vercel is the founder's**: never run the Vercel CLI or read its settings; push to GitHub and hand over any dashboard change | 2026-07-28 | `CLAUDE.md:674-675`; `auto-memory/feedback-founder-working-style.md:20` | **BINDS, reconciled** with brief §2 ("you deploy, after Gate B"): push to `main` auto-deploys (`CLAUDE.md:389`), so deploying = merging to `main` after the Gate B OK, as [open questions](../open-questions.md) section E records; env vars and dashboard changes stay the founder's |
| Push to `main` auto-deploys | 2026-09-05 | `CLAUDE.md:389`; `Technical-Todo.md:394` | **BINDS**; consequence: nothing from the reset branch reaches `main` before Gate B (brief §4.5) |
| The apex `kheelona.com` is canonical; `www` 308s to it | 2026-07-28 | `CLAUDE.md:664-669`; `closed-rounds.md:72-74` | **BINDS** |
| The `http://www` two-hop redirect is Vercel platform behaviour; do not reopen | 2026-09-06 | `Technical-Todo.md:636-641` | **BINDS** |
| DMARC is `p=none; sp=quarantine`, not `p=quarantine` (65% of apex mail relays via IKP EDEN); reopen only if IKP changes | 2026-09-12 | `Technical-Todo.md:850-884`; `CLAUDE.md:327-330` | **BINDS** (`docs/project-state.json:211-219` still shows the old plan as open: stale) |
| The apex stays DNS-only in Cloudflare (its managed `robots.txt` block would disallow AI crawlers we allow) | 2026-09-12 | `CLAUDE.md:330-333` | **BINDS** (brief §9.3 keeps the current robots policy until the founder decides: G7) |
| The GitHub repo **stays public**, with real children's video permanently in its history as a known position | 2026-09-19 | `Technical-Todo.md:677-695`; `CLAUDE.md:309-315` | **BINDS**; brief §4.8 adds: ask before committing the wiki or the design system to a public repo (Q1) |
| **Never `git add -A` or `git add .`**; stage by name and account for every `??` line (the investor deck leaked this way on 2026-09-06) | 2026-09-06 | `Technical-Todo.md:729-737`; `auto-memory/feedback-never-git-add-all.md:11-29` | **BINDS** |
| Gemini (or any external AI) generation is run by the founder from Claude-prepared kits, never by Claude | 2026-07-07 | `CLAUDE.md:796`; `auto-memory/gemini-asset-pipeline.md:11` | **BINDS**, though largely moot: brief §2 limits imagery to the DS, and the DS says to composite the real photo rather than regenerate (`design-system/project/04-kheelu.md:14`) |
| Next.js 16.3.4 (a minor bump) approved; exact pins with `--save-exact`; zero `overrides` | 2026-09-05 | `CLAUDE.md:434-450`; `security-review.md:197` | **BINDS** (brief §2 keeps the stack unless the Architect finds a blocker) |
| Never re-test the payment path with real money; always refund the whole token | 2026-08-22 | `CLAUDE.md:597-605` | **BINDS**, and brief §4.4 says the same |
| Security engagement rules: no active testing against production; secrets, gateway config, production DB, DNS/TLS and legal wording are escalate-only | 2026-08-23 | `CLAUDE.md:503-510` | **BINDS** (matches the reset's safety rules); security follow-ups are C10 |
| The Supabase project region cannot be moved; accepted as the explanation if checkout feels slow | 2026-08-22 | `closed-rounds.md:283` | **BINDS** |
| Keep records current in the same commit as each change; open every round with a running record | 2026-09-05 | `auto-memory/feedback-living-documentation.md:11-21` | **BINDS**, now as the wiki (brief §5) |
| Plan first, one consolidated question batch with recommendations, then run autonomously; screenshot-verify before handing over | 2026-07-07 | `auto-memory/feedback-founder-working-style.md:13-24` | **BINDS** (matches brief §10) |
| The `demo-website` branch and its Vercel project were deleted; the preview host answers 404 | 2026-09-05 | `CLAUDE.md:648-663` | **BINDS** (a preview host is retired only by deleting the deployment) |

## Product facts and claims → details in [product facts](../product/facts.md) and [claims](../product/claims.md)

| Decision | Date | Source | After the reset |
|---|---|---|---|
| The product is named **Kheelu** (was Lumi); "Kheelu mode" became **Story mode**; Kheelona, PlayOS, Kheelona+ and the Kheelu Speaker unchanged | 2026-09-05 | `CLAUDE.md:461-479` | **BINDS** |
| The Product JSON-LD `@id` stays `https://kheelona.com/products/lumi#product`; `/products/lumi` 308s to `/products/kheelu` | 2026-09-05 | `CLAUDE.md:468-472` | **BINDS** |
| **Confirmed true:** no camera; Kheelu says it is a toy and never asks a child for a secret; voice goes only to Kheelona's own servers, in India | 2026-10-04 | `mid:CLAUDE.md:19-21`; `mid:docs/checkpoints/cmo-merge-2026-10.md:28` | **BINDS** (founder-confirmed facts; production does not yet say all of them) |
| **Not confirmed:** "talking is free for life"; it stays off the site | 2026-10-04 | `mid:CLAUDE.md:20-21`; `mid:MARKETING-TODO.md:150` | **BINDS** until the founder confirms otherwise (F7; terms on [product facts](../product/facts.md), Kheelona+) |
| Brain claims are research-anchored: conversation helps a young brain grow and Kheelu gives a child more of it; never "Kheelu grows the brain" | 2026-10-04 | `mid:CLAUDE.md:21-23` | **BINDS** |
| Retire the microphone wording everywhere, schema included, and say what a wake-word toy actually does | 2026-10-04 | `mid:CLAUDE.md:24-26` | **BINDS**. The retired and replacement wording, and every place production still carries it: [product claims](../product/claims.md) §4 (only owner); fixing it before launch: Q3(a) |
| The finale says Kheelu "ships from 20 October", never "Meet Kheelu on 20 October" (implies delivery that day) | 2026-10-04 | `mid:docs/checkpoints/cmo-merge-2026-10.md:35-37` | **BINDS** as a claims rule |
| Manufacture origin is never claimed beyond what is sanctioned | 2026-10-04 | `mid:docs/checkpoints/cmo-merge-2026-10.md:36-38`, `383-384` | **BINDS** until the founder supplies the country of origin (F3; brief §9.7 requires it). Wording and the live "designed and built here" issue: [product claims](../product/claims.md) (only owner) |
| Kheelona+ has one sanctioned wording and no ₹ amount until the founder sets it | 2026-07-31 | `closed-rounds.md:314`; `CLAUDE.md:704-707` | **BINDS**; terms on [product facts](../product/facts.md), Kheelona+; price is F7 |
| Eight named languages; the published ceiling stays "up to 10" | 2026-08-23 | `closed-rounds.md:313` | **BINDS** |
| Shipping starts **20 October 2026** (moved 1 Sep → 1 Oct → 20 Oct) | 2026-08-23 | `closed-rounds.md:312` | **BINDS**; "still 20 October?" and what the site says after dispatch: F12, Q3(d) |
| The unit-bounded offer: ₹499 token, first 500 units at ₹4,999, then ₹7,999 paid in full; the live count is never published | 2026-08-23 | `CLAUDE.md:574-582`; `auto-memory/brand-kheelu-lumi-law.md:19` | **BINDS** (brief §4.4: pricing logic unchanged) |
| Delivery included anywhere in India; prices GST-inclusive; the reverse-charge mechanism is not published | 2026-08-22 | `closed-rounds.md:191-197`, `284` | **BINDS** |
| Support is by WhatsApp (messages) and email; the legacy placeholder number is never published | 2026-07-28 | `closed-rounds.md:163-166`; `CLAUDE.md:699-700`, `708-710` | **BINDS**; number and labels on [product facts](../product/facts.md), Support channel |
| Certifications: none yet, so no standards FAQ and no badge until a certificate lands | 2026-08-23 | `closed-rounds.md:315` | **BINDS**; certification facts: F4 |
| Specs are not final; show "Not yet announced", never a placeholder number or an empty table | 2026-09-06 | `Technical-Todo.md:604-615` | **BINDS**; signed-off specs: F4 |
| "We name Intel. We leave the global tech-services firm unnamed" (founder bios) | July 2026 | `website-builder-prompt-final-kheelona.md:92-96` | **BINDS** |
| NVIDIA Inception and nasscom are "Recognised by", not backers | 2026-08-23 | `Technical-Todo.md:948-950` | **BINDS** (the new DS says the same, `design-system/project/01-writing.md:70`) |
| Never publish the rotating-SKU (look changes) strategy | 2026-07-10 | `CLAUDE.md:798` | **BINDS** (whether the rotation plan still exists is unverified) |
| **Drafted testimonials** on named people stay live "as it is" | 2026-07-28 | `closed-rounds.md:153-156`, `316`; `CLAUDE.md:680-683` | **OVERRIDDEN** (brief §4.2, §9.8: no fabricated social proof). Decided by the brief: they do not move to the new site ([open questions](../open-questions.md) section E) |

## Content and pages

| Decision | Date | Source | After the reset |
|---|---|---|---|
| Keep the indexed URLs `/products/kheelu`, `/team`, `/contact`; do not build `/kheelu` or `/story` | 2026-10-04 | `mid:CLAUDE.md:11-13` | **BINDS** (brief §2 keeps every URL) |
| Add `/how` and `/faq` (and remove `/faq`'s 308) | 2026-10-04 | `mid:CLAUDE.md:11-13` | **MOOT** with the mid version; whether to add them is decided at Gate A (G8; brief §2: new pages only with research value) |
| **Ria Mangala Rewari is off the site entirely**; her 8 journal bylines become Aman Soni's | 2026-10-04 | `mid:CLAUDE.md:48-50`; `mid:docs/checkpoints/cmo-merge-2026-10.md:405-418` | **BINDS** (production still shows her until the new site launches) |
| Retire the Kheelu corner guide; add a sticky reserve bar on phones; keep scroll reveals and the backdrop | 2026-10-04 | `mid:CLAUDE.md:14-18` | Guide retirement **BINDS**; the sticky bar is now required by brief §9.1; "keep reveals and backdrop" is **OVERRIDDEN** (brief §4.1, §9.11: DS motion; motion spec G4) |
| **CTA label stays "Pre-order Lumi"** (no number on the button; price in the caption). Founder decision #9 | 2026-08-23 | `docs/checkpoints/migration-to-new-dsx.md:52` | **Held on production**: after the 2026-09-05 rename the live label is "Pre-order Kheelu" (`src/config/site.ts:94`). The mid version's 2026-10-04 default (next row) would have replaced it but was **never live**. **OVERRIDDEN, CONFIRM**: one of the candidates for G1 |
| CTA label "Reserve Kheelu for ₹499" / "Reserve ₹499" (a plan default approved with the plan) | 2026-10-04 | `mid:CLAUDE.md:27-30` | Never live. **OVERRIDDEN, CONFIRM**: brief §6 takes labels from the strategy; one of the candidates for G1. All candidates: [messaging](../brand/messaging.md), CTA labels |
| PlayOS moved from the nav to the footer (a plan default) | 2026-10-04 | `mid:CLAUDE.md:29-30` | **MOOT**: decided at Gate A (G8; brief §2 allows proposing to merge or drop `/playos`) |
| `ViewContent` also fires on Home (founder request on the mid branch) | 2026-10-04 | `mid:CLAUDE.md:31-35` | Never deployed; **CONFIRM** (brief §9.4: existing events may not change): G10 |
| The audio demos are removed from the site; do not re-raise | 2026-09-19 | `CLAUDE.md:293-302` | **BINDS** |
| Real parent videos: written consent held; montage `first-conversations` in the centre, `a-parent-speaks` to its right; ship now with em-dash captions and re-export later | 2026-09-19 | `CLAUDE.md:257-267`, `309-312` | **BINDS** if videos stay; whether non-DS media stays is a **CONFIRM** (brief §2 imagery rule): G3 |
| The Ideabaaz event page is kept in its ended state because printed QR codes point at it | 2026-09-01 | `Technical-Todo.md:836-843` | **BINDS** → [URL map](../site/url-map.md); every printed tier: F13 |
| Every pre-order CTA reaches the store in one tap | 2026-08-23 | `CLAUDE.md:621` | **BINDS** (brief §9.1: fewest taps) |
| The child's age on the form is a free-text blank, not a dropdown | 2026-08-23 | `docs/revamp-2026-07/WORKING.md:92-94` | **BINDS** (checkout form logic unchanged, brief §4.4); its hint text must follow the 3-7 band |
| The store's descriptive paragraph was removed (ship date now read after the form on a phone) | 2026-08-24 | `Technical-Todo.md:1160-1164` | Layout only: revisit under brief §9.1 in [checkout](../site/checkout.md) |
| Lori, Lua and Robu renders kept in `public/products/` for parity with kheelona.ai | 2026-08-23 | `Technical-Todo.md:1201-1206` | **CONFIRM** against brief §2 (delete unused assets) via [cleanup](cleanup.md) |
| The mascot's "Hi, I'm Kheelu" hero line parked (twice) | 2026-09-05, 2026-09-06 | `Technical-Todo.md:470-475` | **MOOT** (no narrator; the new DS makes Kheelu the product) |

## Brand and design

| Decision | Date | Source | After the reset |
|---|---|---|---|
| Design authority is `Design/Kheelona-Design-System-v3/`; the older DS deleted | 2026-08-23 | `CLAUDE.md:495-502` | **OVERRIDDEN** (brief §4.1, §2: the new DS in `design-system/`; v3 archived then deleted) |
| The CMO's v4 design-system swap dropped ("we will still continue using our website Design System") | 2026-10-04 | `mid:docs/checkpoints/cmo-merge-2026-10.md:17` | **OVERRIDDEN** (brief §4.1: the new DS delivered 2026-10-10) |
| CTA labels white on brand orange `#EF762F`, a knowingly accepted 2.88:1 contrast failure | 2026-08-24 | `CLAUDE.md:567-573`; `Technical-Todo.md:1149-1158` | **OVERRIDDEN** (brief §4.1 new DS; §9.6 WCAG 2.2 AA via DS tokens). The new DS has the same contrast problem: [DS gaps](../design-system/gaps.md) G-02, decided at Gate A as G2 |
| "One orange": no `#b54a0d`, ink for small text, bold display orange accepted | 2026-10-04 | `mid:CLAUDE.md:43-47` | **OVERRIDDEN** (brief §4.1) |
| Italics only as the v3 editorial accent (reversing the zero-italics law) | 2026-08-23 | `CLAUDE.md:899` | **OVERRIDDEN** (brief §4.1) |
| Ages **3+ with no published ceiling** (decision #8) | 2026-08-23 | `CLAUDE.md:690-693`; `mid:MARKETING-TODO.md:30` | **OVERRIDDEN** (brief §2, §3: ages 3-7; [open questions](../open-questions.md) section E). Wording at 3-7: G5 |
| Kheelu is the permanent mascot and site narrator (Foxy-Deer art); its say lines need founder approval | 2026-07-10, art 2026-08-23 | `CLAUDE.md:797-798`; `auto-memory/brand-kheelu-lumi-law.md:16-18` | **MOOT** (guide retired 2026-10-04; the new DS defines Kheelu as the product, `design-system/project/04-kheelu.md:1-3`) |
| Home copy verbatim from the content PDF, which outranks everything | July 2026 | `CLAUDE.md:754-756` | **OVERRIDDEN** (brief §3) |
| The calm ambient treatment; the 3D journey dormant | 2026-07-10 | `CLAUDE.md:898` | **OVERRIDDEN** (brief §9.11 and DS motion); the founder's low appetite for motion is still useful context (`auto-memory/feedback-redesign-2026-07.md:20`) |
