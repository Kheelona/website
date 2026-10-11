---
title: Open questions
type: open-questions
updated: 2026-10-10
sources: [raw/brief/kickoff-brief.md, "Phase 0 inventory workflow wf_fee145da-3a0 (99 agent questions, deduplicated here)"]
---

# Open questions

Everything waiting on the founder or SKM. Owned by the orchestrator; agents return questions and
the orchestrator merges them here. **Section A needs an answer now.** B is facts only the founder or
SKM can give (copy stays a marked placeholder until then). C is decided at Gate A with a
recommendation in `mockup/APPROVAL.md`. D is checks and access on the founder's side. E needs no
answer: the brief already decides it.

Status values: **OPEN**, **ASKED** (sent to the founder, with date), **ANSWERED** (date + link to the decision).

## A. Answer now

### Q1. May `wiki/` and `design-system/` be committed to this PUBLIC repo? — ANSWERED 2026-10-10: (c) commit both publicly ([D010](decisions/D010-wiki-and-ds-committed-publicly.md))
**Why.** Brief 4.8. The wiki holds SKM's positioning, PostHog aggregates, open legal and claims
questions, and the founder's work email and an order reference (in the byte-identical memory copies
under `raw/legacy-memory/`). Other teams share the DS. Today both are held out of git
([D004](decisions/D004-internal-material-uncommitted.md)), so the wiki has no backup.
**Options.** (a) Make `Kheelona/website` private. Simplest, but it reverses the 2026-09-19 "stays
public" decision, and the Vercel plan must allow private ORGANISATION repos. Check that before
switching. (b) Keep the site repo public and put `wiki/` and `design-system/` in a separate
**private** repo, nested and gitignored here. The build reads only generated token and image
derivatives, which are committed (brief 4.1 allows them). (c) Commit both publicly.
**Recommendation.** (b). It keeps the public decision, cannot break deploys, and backs up the wiki.
**Owner** founder · **Customer-visible** no.

### Q2. The mid version's remote leftovers: close and delete? — ANSWERED 2026-10-10: go ahead; done ([D012](decisions/D012-founder-answers-q2-q4-q5.md)). Vercel previews: founder's dashboard
PR #16 (open, mergeable), remote branch `origin/redesign-mockup-2026-10`, and its 8 Vercel previews
(behind Vercel SSO, noindex). Also two merged remote branches, `origin/lumi-rabbit` and
`origin/security-hardening`. Everything is preserved by tags or by `main`
([D001](decisions/D001-branch-and-archive.md), [D002](decisions/D002-mid-version-identified.md),
[clean-up §2, §6](legacy/cleanup.md)).
**Recommendation.** I close PR #16 with a note pointing to the archive tag and delete the three
remote branches. You delete the previews in Vercel (your dashboard). **Owner** founder.

### Q3. Production before 20 October: one narrow exception to "production untouched until Gate B"? — ANSWERED 2026-10-10: hold everything until Gate B; review locally ([D011](decisions/D011-production-held-until-gate-b.md))
**Why.** Shipping starts 20 October 2026 and the reset will launch after that. Four things on the
live site are wrong or legally thin now:
(a) "the microphone is off, not muted" and its variants in 15 places, including the Product JSON-LD and
`llms.txt`. The founder ruled it inaccurate on 2026-10-04, but the fix exists only on the unreleased
mid version. Also "Internet access: None", "answers work offline" and the "nearly 3" store hint
([claims](product/claims.md), [age review](product/age-band-review.md)).
(b) The returns, warranty and replacement terms are promised as "coming" on `/refund` and
`/products/kheelu` (HIGH since 5 October).
(c) The DPDP retention period and the grievance officer on `/privacy`, also needed under the
E-Commerce Rules (HIGH since 5 October). The sources disagree on whether counsel review was waived
([settled decisions](legacy/settled-decisions.md)).
(d) What the pre-order copy says once dispatch begins, and the delivery lead time for new orders.
**Options.** (1) A small hotfix branch from `main`. Copy only, each change shown to you before it
merges, no checkout logic touched. (2) Hold everything for Gate B.
**Recommendation.** (1) for (a) now. (b), (c) and (d) also go out via (1) as soon as you supply
the facts in F1, F2 and F12. **Owner** founder · **Customer-visible** yes.

### Q4. Missing inputs from SKM — RE-ASKED 2026-10-10 with clarity (first answer was about the investor pitch deck, now removed: [D012](decisions/D012-founder-answers-q2-q4-q5.md))
The positioning rests on three documents that are not in the project: the **research brief (30 May
2026)**, the **competitor review v9 (30 Sep 2026)** and the **90-day plan (7 Oct 2026)**. They are
the source of figures like "70% of parents want an AI toy to help their child learn" and the Pookie
price. A fourth source, **"the deck"**, sits behind "10 new words learnt", "maps your emotions and
triggers" and the Chaitra video (docx §2, §8, §11, §12). Until they arrive, those figures cannot appear in copy ([messaging](brand/messaging.md)).
Also: the docs are bylined "Nayantara · October 2026" (PDF) and "@NG" (docx). Who signs off copy as
"SKM" in this project? **Owner** SKM / founder.

### Q5. Local files that git does not hold — ANSWERED 2026-10-10: keep originals, delete only regenerable caches; done ([D012](decisions/D012-founder-answers-q2-q4-q5.md))
Not in any tag, so they are never deleted without you: the photoshoot originals (596 MB, the
**only** copy), the root "Website prompt" .docx/.pdf (14.6 MB), `pitch-deck/`, and `.agents/`
(needed: the marketing skills link into it). Also `security-review.md`, an open engagement that maps
the payment path inside the public repo: move it into the internal wiki, keep it, or close it out?
**Recommendation.** Keep all of those, and back up the photoshoot off this machine. I delete only
regenerable caches (`.next/` holds a stale build of the MID version, plus `storybook-static/`,
`docs/snapshots/`, `tsconfig.tsbuildinfo`, `launch-video/node_modules/`). Move `security-review.md`
into the private wiki once Q1 is settled. **Owner** founder.

## B. Facts only the founder or SKM can supply

Each one is a placeholder in copy until answered. Brief 4.2 and 9.7: never invented.

| ID | What we need | Why it matters | Who | Lands on |
|---|---|---|---|---|
| F1 | Returns window, warranty length, replacement process ("15-day returns" and "1-year warranty" appear in SKM's docs, unconfirmed) | Next to the CTA (9.1), Product JSON-LD (9.2), disclosures (9.7) | founder | [policies](product/policies.md) |
| F2 | Grievance officer (name, designation, contact, response times); DPDP retention period; is counsel reviewing? | E-Commerce Rules, DPDP, `/privacy` | founder | [policies](product/policies.md) |
| F3 | Country of origin; manufacturer or importer name and address (the Product JSON-LD already names Kheelona as `manufacturer`, `seo.ts:304`, and nothing documents it); MRP inclusive of taxes; other Legal Metrology declarations (net quantity, month and year of manufacture, consumer-care contact) | 9.7; `/contact` says "designed and built here", which nothing supports | founder | [policies](product/policies.md), [claims](product/claims.md) |
| F4 | Signed-off specs (size, weight, battery runtime with test conditions, charger, materials, box contents, wake word); **BIS/ISI and toy-safety certification**: standard, lab, dates, age grading, required warnings | 9.7, and the 3-7 age check (brief 3) | founder | [facts](product/facts.md), [age review](product/age-band-review.md) |
| F5 | Voice and data: every processor (any outside speech or AI provider, and its country), retention, whether voice trains any model, the product privacy policy date | 9.7: safety and privacy copy must match documented practice | founder | [facts](product/facts.md), [claims](product/claims.md) |
| F6 | Payment methods enabled on Razorpay (UPI, cards, net banking, wallets, EMI, Pay Later; a dashboard screenshot is enough); does a buyer get a GST invoice? | 9.1: show only methods we actually offer | founder | [policies](product/policies.md) |
| F7 | Kheelona+ price; what a parent keeps after the 6 included months; is "talking is free for life" true? | Unconfirmed claim in the positioning | founder | [facts](product/facts.md) |
| F8 | Product behaviour claims, per claim: ends turns with a question, hands back to family, weekly four-skills report by launch, mood reading, on-device-first processing, closed library, age-graded safety layer, red-teaming, "says it does not know", memory, new-word count, alerts, opt-in training, how a child's age is set | All live or in the positioning; none checkable until units ship | founder / product team | [claims](product/claims.md) |
| F9 | The child-development advisor: who, consent to name and face on the site, sign-off on the four thinking skills at age 3, age-by-age activities for 3 to 7, the grandparent line, and whether "Kheelu helps your child's brain grow" may be said (the founder's 2026-10-04 ruling: "conversation helps a young brain grow, Kheelu gives a child more of it") | Developmental claims at 3-7 | SKM / founder | [claims](product/claims.md), [positioning](brand/positioning.md) |
| F10 | Trademark check on "It asks. They think."; commitment to publish pilot results "good or bad" | Tagline and proof claims in the positioning | founder | [messaging](brand/messaging.md) |
| F11 | Proof for the recognition strip (NVIDIA Inception, Karnataka Elevate, nasscom, Founders Inc: acceptance email or listing URL) and for the team bios ("holds 14 patents filed in his own name", the Intel/Thunderbolt work) | Trust claims at the point of decision | founder | [facts](product/facts.md) |
| F12 | Ship date still 20 October? Post-dispatch offer and delivery lead time for new orders; how the ₹4,500 balance links are created (do they carry `order_ref` in notes?); are WhatsApp order confirmations actually sent, as the form promises? And should balance payments be recorded and measured at all (today no tool sees them, and the webhook logs them as unknown)? Recording them changes webhook logic, so it needs approval (brief 4.4) | Delivery next to CTA (9.1); the webhook logs balance payments as unknown orders | founder | [checkout](site/checkout.md), [pricing](product/pricing.md) |
| F13 | Every event tier ever printed on a QR code (id only) | Printed `/e/<tier>` URLs must keep working | founder | [url map](site/url-map.md) |

## C. Decided at Gate A (recommendations will be in `mockup/APPROVAL.md`; at most 7 reach the founder)

| ID | Decision | Notes |
|---|---|---|
| G1 | The one primary CTA label | Candidates: live "Pre-order Kheelu"; founder decision #9 (2026-08-23: no number on the button, price in the caption); mid-version "Reserve Kheelu for ₹499"; DS "Pre-order for ₹499" / sticky "Pre-order". The positioning defines none. Brief 9.1: same label everywhere. Owner page: [messaging](brand/messaging.md) |
| G2 | Contrast: the DS's white on Chilli (2.88:1) and Kheelu Blue (2.96:1) fail WCAG AA and axe rates them serious, while brief 9.6 requires zero serious issues; plus the DS shows two chilli CTAs on one screen (nav + hero) | [DS gaps](design-system/gaps.md) G-02 |
| G3 | Imagery beyond the DS: the 7 consented parent films, founder photos, recognition and partner logos (incl. Ideabaaz), real app screenshots, journal hero photos; and whether to disclose that DS children are AI-generated | Brief 2 says DS imagery only; the DS itself calls for real video and team photos |
| G4 | Motion spec: the DS defines press, hover and state motion only, nothing for reveals, sticky bar, drawers or sheets | [motion](design-system/motion.md) |
| G5 | Age and development wording at 3-7: SKM's "only with a grown-up nearby" condition for 3-year-olds; what to say about speech recognition under 4; Common Sense Media's "avoid AI toys at 5 and under"; the two under-3 journal articles (and the URL `/stories/brain-development-toys-for-a-2-year-old`); "toddlers"; dropping "friend" (DS says call Kheelu a friend); the wake-word wording | Mostly SKM; [age review](product/age-band-review.md) |
| G6 | Consent and DPDP posture at launch: today there is no banner and no opt-out, and Meta advanced matching is on | Brief 9.4: unchanged unless raised at Gate A |
| G7 | AI-crawler policy in `robots.txt` | Brief 9.3; current robots.txt allows the AI crawlers |
| G8 | Pages: `/faq` and `/how` as real pages, `/playos` (is SKM's "Kheelona OS" the same as PlayOS?), redirects for guessable 404s (`/kheelu`, `/careers`), and one-hop www legacy redirects | [url map](site/url-map.md) |
| G9 | Price display after sell-out: a read-only revalidated price block reading the live mode (no logic change, count never exposed), or static plus a manual sweep; the DS OfferCard cannot show the full-payment offer and has an "N left" counter we must not use | Changes how price is DISPLAYED, not charged: needs approval |
| G10 | Tracking: ViewContent also on Home (requested on the mid branch, never live); mapping the 8 PostHog `cta` values; pre-approving the two Lighthouse exceptions (best practices about 74 because of the pixel's cookie; store SEO about 66 because it is noindex) | [tracking](site/tracking-inventory.md) |
| G11 | DS: fonts cover Latin and Devanagari only, but language chips show Bengali, Telugu, Tamil and Kannada scripts; freeze DS v11 for this project; ask the DS owner for a stacked phone ComparisonTable, 44 px tap areas on AnnouncementBar and FeatureCard links, child-voice guidance for ages 6-7 (the DS covers 3-6: G-17), and removal of the retired microphone wording from its writing guides and the CampaignKit post "Not muted. / Off." ([claims §4.1](product/claims.md#41-the-retired-microphone-wording)) | [DS gaps](design-system/gaps.md) |

## D. Founder-side checks and access

| ID | Check | Why |
|---|---|---|
| C1 | GA4 admin for stream 15336032355: key events, enhanced measurement, Configure your domains, unwanted referrals (screenshots or read access) | Parity baseline |
| C2 | Meta: custom conversions export (ad account 1195520716116929); Events Manager connection method for the two September Purchases ("Multiple" proves CAPI and dedup); Vercel log lines `[meta-capi] SENT` for those orders; the retired pixel's "last received" keeps ageing (open since 2026-09-21) | Parity baseline; the rotated CAPI token is unproven |
| C3 | Confirm there is no Google Ads account, Merchant Center account or product feed | Brief 9.4 lists feeds |
| C4 | Razorpay: are `refund.processed` and `payment.failed` subscribed alongside `order.paid` and `payment.captured`? | Webhook parity |
| C5 | Meta ads re-tag to `utm_source=facebook` + `placement`, and campaigns renamed `<yyyy-mm>-<slug>` (waiting since 2026-09-20) | Paid traffic still arrives as an/fb/ig |
| C6 | Off-site entity facts: Play Store and App Store listings (still "Lumi"), profiles (YNOS, F6S), back-links, all updated to 3-7 | Brief 9.3; the listings drive wrong AI answers |
| C7 | PostHog "Internal / Test users" cohort has 0 members; Installation Health should read 7/7 (the Phase 1 PostHog Analyst re-reads it through the MCP first) | Test traffic may pollute the baseline |
| C8 | Vercel: does the dashboard override the build command? (The reset changes the `build` script) | Clean-up trap 1 |
| C9 | Is any `kheelona.com` asset URL (for example `/video/launch.mp4`) linked from social posts or partner pages? | Asset deletions in Phase 5 |
| C11 | Data exports for Phase 1 (or read access): **Search Console** Performance export (queries and pages, last 16 months); **Keyword Planner** volumes for India for the seed list in `research/keyword-map.md` (Phase 1); **GA4** landing pages, sources and devices from 2026-07-28 (PostHog only starts 2026-09-19). Agents do not drive your logged-in browser for these | Brief 6: sourced volumes, 90-day and 12-month windows |
| C10 | Security follow-ups: keep the CSP in Report-Only with an identical policy through launch (recommended); publish `/.well-known/security.txt`?; four latent checkout issues: leave the logic unchanged and propose fixes after launch (recommended), and you check the odd ₹0 event tier and the two test rows in Supabase | Brief 4.4 |

## E. Decided by the brief (no answer needed; recorded so nobody re-asks)

- **The published age band is 3-7**, everywhere (brief 2, 9.3, 9.8). This overrides the 2026-08-23
  law "3+, no published ceiling". The test that bans `suggestedMaxAge` changes with it in the build.
- **The drafted testimonials on named people do not move to the new site** (brief 4.2, 9.8: no
  fabricated social proof). This overrides "leave them as they are" (2026-07-28) for the new site
  only. Real, consented quotes are welcome (F-items).
- **"You deploy" (brief 2) means merging to `main` after the founder's explicit OK at Gate B**,
  since a push to `main` auto-deploys. The Vercel dashboard stays the founder's, and nobody runs
  the Vercel CLI ([settled decisions](legacy/settled-decisions.md)).
- **The latest positioning wins over earlier copy decisions** where they conflict, except where the
  founder has ruled on accuracy (for example the wake-word wording), which is logged as a conflict
  for Gate A, not resolved silently.
