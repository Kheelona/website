---
title: Open questions
type: open-questions
updated: 2026-10-10
sources: [raw/brief/kickoff-brief.md, "Phase 0 inventory workflow wf_fee145da-3a0 (99 agent questions, deduplicated here)"]
---

# Open questions

Everything waiting on the founder (who also answers items marked SKM: [D015](decisions/D015-founder-signs-off-copy.md)). Owned by the orchestrator; agents return questions and
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

### Q4. Missing inputs from SKM — ANSWERED 2026-10-10: not needed; internal research never goes on the site ([D013](decisions/D013-internal-vs-external-content.md), [content boundary](site/content-boundary.md)). Sign-off: only the founder signs off copy ([D015](decisions/D015-founder-signs-off-copy.md))
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
| F1 | **PARTLY ANSWERED 2026-10-10** ([D021](decisions/D021-returns-policy.md)): 7-day returns, no questions asked, opened OK if undamaged and complete with the box. Warranty, faulty units, pickup and refund: [D022](decisions/D022-warranty-replacement-refund.md). **Still open (minor): the warranty remedy for a defect found after the first 7 days (repair or replace), and whether pickup is free.** Was: Returns window, warranty length, replacement process ("15-day returns" and "1-year warranty" appear in SKM's docs, unconfirmed) | Next to the CTA (9.1), Product JSON-LD (9.2), disclosures (9.7) | founder | [policies](product/policies.md) |
| F2 | **ANSWERED 2026-10-11** ([D029](decisions/D029-grievance-officer-legal-review.md)): Aman Soni, Co-Founder and CTO, aman@kheelona.com; resolve in 30 days; the founder approves legal pages after an independent review; retention 36 months (D020). **Open: the acknowledgement time (5 days proposed vs the 48 hours the E-Commerce Rules require).** Was: Grievance officer (name, designation, contact, response times); DPDP retention period; is counsel reviewing? | E-Commerce Rules, DPDP, `/privacy` | founder | [policies](product/policies.md) |
| F3 | Country of origin; manufacturer or importer name and address (the Product JSON-LD already names Kheelona as `manufacturer`, `seo.ts:304`, and nothing documents it); MRP inclusive of taxes; other Legal Metrology declarations (net quantity, month and year of manufacture, consumer-care contact) | 9.7; `/contact` says "designed and built here", which nothing supports | founder | [policies](product/policies.md), [claims](product/claims.md) |
| F4 | Signed-off specs (size, weight, battery runtime with test conditions, charger, materials, box contents, wake word); **BIS/ISI and toy-safety certification**: standard, lab, dates, age grading, required warnings | 9.7, and the 3-7 age check (brief 3) | founder | [facts](product/facts.md), [age review](product/age-band-review.md) |
| F5 | **ANSWERED 2026-10-10** ([D019](decisions/D019-voice-providers.md), [D020](decisions/D020-provider-terms-and-no-sale.md)): multiple outside providers; they process only to reply, keep nothing, never train, by contract; we don't sell data. Processing is on servers in India for every provider. Transcripts are kept 36 months, then deleted automatically; one-tap delete sooner. Was: Voice and data: every processor (any outside speech or AI provider, and its country), retention, whether voice trains any model, the product privacy policy date | 9.7: safety and privacy copy must match documented practice | founder | [facts](product/facts.md), [claims](product/claims.md) |
| F6 | **ANSWERED 2026-10-10** ([D024](decisions/D024-payment-methods-gst.md)): UPI, cards, net banking; GST invoice; prices include GST. Was: Payment methods enabled on Razorpay (UPI, cards, net banking, wallets, EMI, Pay Later; a dashboard screenshot is enough); does a buyer get a GST invoice? | 9.1: show only methods we actually offer | founder | [policies](product/policies.md) |
| F7 | Kheelona+ price; what a parent keeps after the 6 included months; is "talking is free for life" true? | Unconfirmed claim in the positioning | founder | [facts](product/facts.md) |
| F8 | Product behaviour claims, per claim: ends turns with a question, hands back to family, weekly four-skills report by launch, mood reading, on-device-first processing, closed library, age-graded safety layer, red-teaming, "says it does not know", memory, new-word count, alerts, opt-in training, how a child's age is set | All live or in the positioning; none checkable until units ship | founder / product team | [claims](product/claims.md) |
| F9 | The child-development advisor: who, consent to name and face on the site, sign-off on the four thinking skills at age 3, age-by-age activities for 3 to 7, the grandparent line, and whether "Kheelu helps your child's brain grow" may be said (the founder's 2026-10-04 ruling: "conversation helps a young brain grow, Kheelu gives a child more of it") | Developmental claims at 3-7 | SKM / founder | [claims](product/claims.md), [positioning](brand/positioning.md) |
| F10 | Trademark check on "It asks. They think."; commitment to publish pilot results "good or bad" | Tagline and proof claims in the positioning | founder | [messaging](brand/messaging.md) |
| F11 | Proof for the recognition strip (NVIDIA Inception, Karnataka Elevate, nasscom, Founders Inc: acceptance email or listing URL) and for the team bios ("holds 14 patents filed in his own name", the Intel/Thunderbolt work) | Trust claims at the point of decision | founder | [facts](product/facts.md) |
| F12 | **PARTLY ANSWERED 2026-10-10** ([D023](decisions/D023-new-order-delivery.md)): new orders keep the ₹499 advance; deliveries start mid-November. **Still open: do existing token orders dispatch from 20 Oct; balance-link timing and channel; WhatsApp confirmations; balance measurement.** Was: Ship date still 20 October? Post-dispatch offer and delivery lead time for new orders; how the ₹4,500 balance links are created (do they carry `order_ref` in notes?); are WhatsApp order confirmations actually sent, as the form promises? And should balance payments be recorded and measured at all (today no tool sees them, and the webhook logs them as unknown)? Recording them changes webhook logic, so it needs approval (brief 4.4) | Delivery next to CTA (9.1); the webhook logs balance payments as unknown orders | founder | [checkout](site/checkout.md), [pricing](product/pricing.md) |
| F13 | Every event tier ever printed on a QR code (id only) | Printed `/e/<tier>` URLs must keep working | founder | [url map](site/url-map.md) |
| F14 | Is there a real place or session where a parent can hear Kheelu before paying (e.g. a Bengaluru demo)? Benchmarks: hearing it in their own language is a buying trigger; MyWonder lists trial venues | Only confirmed sessions are listed | founder | [benchmarks](research/d2c-benchmarks.md) |
| F15 | The exact first-delivery DATE for new orders (Product JSON-LD `availabilityStarts` cannot take "mid-November"), and whether EXISTING token orders still dispatch from 20 October (the checkout, `/thanks` and receipts read the date from config, not from the order, so changing it reaches existing token holders too) | Schema accuracy; existing customers' expectations | founder | [pricing](product/pricing.md), [checkout](site/checkout.md) |
| F16 | Opt-in training: the live site says the model "learns from conversations families separately opt into". Which model learns, given the providers never train (D020)? Is there any opt-in training today? | Privacy claim accuracy (DPDP) | founder | [claims](product/claims.md) |
| F17 | "Never used to advertise to your child": true as written? (D020 covers no-sale, not advertising) | Privacy claim; DPDP s.9 bans targeted advertising at children | founder | [claims](product/claims.md) |

## C. Decided at Gate A (recommendations will be in `mockup/APPROVAL.md`; at most 7 reach the founder)

| ID | Decision | Notes |
|---|---|---|
| G1 | The one primary CTA label | Candidates: live "Pre-order Kheelu"; founder decision #9 (2026-08-23: no number on the button, price in the caption); mid-version "Reserve Kheelu for ₹499"; DS "Pre-order for ₹499" / sticky "Pre-order". The positioning defines none. Brief 9.1: same label everywhere. Owner page: [messaging](brand/messaging.md) |
| G2 | Contrast: the DS's white on Chilli (2.88:1) and Kheelu Blue (2.96:1) fail WCAG AA and axe rates them serious, while brief 9.6 requires zero serious issues; plus the DS shows two chilli CTAs on one screen (nav + hero) | [DS gaps](design-system/gaps.md) G-02 |
| G3 | Imagery beyond the DS: the 7 consented parent films, founder photos, recognition and partner logos (incl. Ideabaaz), real app screenshots, journal hero photos; and whether to disclose that DS children are AI-generated | Brief 2 says DS imagery only; the DS itself calls for real video and team photos |
| G4 | Motion spec: the DS defines press, hover and state motion only, nothing for reveals, sticky bar, drawers or sheets | [motion](design-system/motion.md) Also decides the phone sticky buy bar: benchmarks recommend visible from first paint, stepping aside while the inline CTA is on screen (Yoto); DS gap G-09 (bar show/hide not built). Where WhatsApp help sits next to it (no floating bubble over the bar). |
| G5 | Age and development wording at 3-7: SKM's "only with a grown-up nearby" condition for 3-year-olds; what to say about speech recognition under 4; Common Sense Media's "avoid AI toys at 5 and under"; the two under-3 journal articles (and the URL `/stories/brain-development-toys-for-a-2-year-old`); "toddlers"; dropping "friend" (DS says call Kheelu a friend); the wake-word wording | Mostly SKM; [age review](product/age-band-review.md) |
| G6 | Consent and DPDP posture at launch: today there is no banner and no opt-out, and Meta advanced matching is on | Brief 9.4: unchanged unless raised at Gate A |
| G7 | AI-crawler policy in `robots.txt` | Brief 9.3; current robots.txt allows the AI crawlers Keyword map SV-1 recommends allowing them: ChatGPT sent 83 of 802 human sessions (10.3%) and one of two paid orders. |
| G8 | Pages: `/faq` and `/how` as real pages, `/playos` (is SKM's "Kheelona OS" the same as PlayOS?), redirects for guessable 404s (`/kheelu`, `/careers`), and one-hop www legacy redirects | [url map](site/url-map.md) Keyword map: merge /stories/what-to-look-for-in-a-safe-ai-toy into /ai-toys-for-kids-in-india (SV-3); redirect the two under-3 articles (SV-4, with G5); a new /stories/learning-toys-for-4-to-7-year-olds (SV-5); `llms.txt` may describe businesses answer engines confuse with us (SV-7, with C14). |
| G9 | Price display after sell-out: a read-only revalidated price block reading the live mode (no logic change, count never exposed), or static plus a manual sweep; the DS OfferCard cannot show the full-payment offer and has an "N left" counter we must not use | Changes how price is DISPLAYED, not charged: needs approval |
| G10 | Tracking: ViewContent also on Home (requested on the mid branch, never live); mapping the 8 PostHog `cta` values; pre-approving the two Lighthouse exceptions (best practices about 74 because of the pixel's cookie; store SEO about 66 because it is noindex) | [tracking](site/tracking-inventory.md) |
| G11 | DS: fonts cover Latin and Devanagari only, but language chips show Bengali, Telugu, Tamil and Kannada scripts; freeze DS v11 for this project; ask the DS owner for a stacked phone ComparisonTable, 44 px tap areas on AnnouncementBar and FeatureCard links, child-voice guidance for ages 6-7 (the DS covers 3-6: G-17), and removal of the retired microphone wording from its writing guides and the CampaignKit post "Not muted. / Off." ([claims §4.1](product/claims.md#41-the-retired-microphone-wording)) | [DS gaps](design-system/gaps.md) |
| G12 | Tracking additions (allowed by brief 9.4: new events, no existing one changed): payment window opened, payment failed with Razorpay's reason code, form rejected with the field name only; optionally the PostHog session id on the order (needs a migration: approval) | The two biggest leaks are invisible today ([PostHog audit](research/posthog-audit.md)) |
| G13 | Checkout presentation: an in-app-browser hint on the store page ("Paying by UPI? Open in Chrome or Safari", with copy link) once QA's sandbox test confirms the failure; the child-age field as free text with an example (presentation) or a 3-7 picker (a stored-data change: approval) | Presentation vs logic (brief 4.4) Also: the phone field shows a fixed +91 prefix (presentation only; validators unchanged), as GoKwik and Razorpay Magic checkouts do. |
| G14 | Search demand names competitors ("miko robot price in india", "yoto player india") and centres on speech and language ("toys for speech delay 3 year old"): does the site ever name a competitor, and how does it answer speech-delay searches without a health claim (R4)? | `research/keyword-map.md` (Phase 1, in progress) |
| G15 | How source markers look on the site (D026): the DS has no footnote pattern (gap G-18). Recommendation: compose from DS parts, a short linked label after each figure (tap target 48 px) plus a "Sources" block in `kh-body-s` per section; ask the DS owner for a pattern | [source verification](research/source-verification.md) §6 |

## D. Founder-side checks and access

| ID | Check | Why |
|---|---|---|
| C1 | GA4 admin for stream 15336032355: key events, enhanced measurement, Configure your domains, unwanted referrals (screenshots or read access) | Parity baseline |
| C2 | Meta: custom conversions export (ad account 1195520716116929); Events Manager connection method for the two September Purchases ("Multiple" proves CAPI and dedup); Vercel log lines `[meta-capi] SENT` for those orders; the retired pixel's "last received" keeps ageing (open since 2026-09-21) | Parity baseline; the rotated CAPI token is unproven |
| C3 | Confirm there is no Google Ads account, Merchant Center account or product feed | Brief 9.4 lists feeds |
| C4 | Razorpay: are `refund.processed` and `payment.failed` subscribed alongside `order.paid` and `payment.captured`? | Webhook parity |
| C5 | Meta ads re-tag to `utm_source=facebook` + `placement`, and campaigns renamed `<yyyy-mm>-<slug>` (waiting since 2026-09-20). When ads resume: land them on `/products/kheelu` (product-page visitors reached the store 3x as often as Home-only), exclude Audience Network and Threads (median visits 3 s), and tag store links sent in WhatsApp chats (`utm_source=whatsapp&utm_medium=chat`: 2 of 5 orders came that way, recorded as Direct) ([PostHog audit](research/posthog-audit.md)) | Paid traffic still arrives as an/fb/ig |
| C6 | Off-site entity facts: Play Store and App Store listings (still "Lumi"), profiles (YNOS, F6S, the UNCLAIMED CB Insights profile that Bing's AI copies), back-links, all updated to 3-7. Also: the two app listings declare **opposite data practices** (Play: "no data collected"; App Store: contact info and user content linked to you); owned profiles carry banned or unconfirmed claims (Instagram bio "AI toys that develop brains", App Store subtitle "Smart Brain Development Toy"); **kheelona.ai** is the largest "Lumi" source found (28 mentions, the old art) (`raw/research/geo/entity-consistency-2026-10-10.md`) | Brief 9.3; the listings drive wrong AI answers |
| C7 | PostHog "Internal / Test users" cohort has 0 members (about 48 sessions from 4 team-like devices are in the data). Proposal: the new site supports an opt-in `?internal=1` link that sets a lasting PostHog property for the cohort (a new property, no existing event changes). Installation Health: 0 active issues via MCP, consistent with 7/7 | Test traffic may pollute the baseline |
| C8 | Vercel: does the dashboard override the build command? (The reset changes the `build` script) | Clean-up trap 1 |
| C9 | Is any `kheelona.com` asset URL (for example `/video/launch.mp4`) linked from social posts or partner pages? | Asset deletions in Phase 5 |
| C11 | Data exports for Phase 1 (or read access): **Search Console** Performance export (queries and pages, last 16 months); **Keyword Planner** volumes for India for the seed list in `research/keyword-map.md` (Phase 1); **GA4** landing pages, sources and devices from 2026-07-28 (PostHog only starts 2026-09-19). For Keyword Planner include singular and plural forms and the terms never measured (ages 4-7, gift, speech and language, story, Hinglish). Agents do not drive your logged-in browser for these | Brief 6: sourced volumes, 90-day and 12-month windows |
| C12 | Razorpay export of payment ATTEMPTS (status, method and error reason only; no customer details) for the 3 orders created but never paid (2026-09-20, 2026-09-22 twice) and any failed payments since 2026-09-19. All 3 unpaid orders were in in-app browsers (Instagram, WhatsApp); both paid orders in normal Chrome | Only way to tell a failed UPI step from a closed window |
| C13 | PostHog settings (dashboard only, tracking unchanged): purchase_confirmed as the conversion goal; revenue analytics in INR on `purchase_confirmed.value`; `$virt_is_bot = false` in the test-account filter; `https://store.kheelona.com` in authorised URLs; **keep or export the paid-ad-day replays, which start expiring on 2026-10-19** | Time-sensitive |
| C14 | Is "Kheelona India" (cradle mobiles on Amazon.in, Instagram @kheelona_india) connected to Kheelona Robotics? | Entity confusion in search and AI answers |
| C15 | Run the two legacy GEO prompts yourself on Perplexity, ChatGPT, Gemini and Google AI Mode in a private window (agents were blocked by sign-in walls and rate limits) | The AI-answer baseline |
| C16 | The public GitHub repo's "website" field points at a dead Vercel URL (404); answer engines read the repo. May I set it to https://kheelona.com? | One repo setting |
| C17 | Supabase region (needed before Phase 4 decides where the store's server functions run: today every store request renders in Vercel iad1, Washington D.C., so Indian visitors wait on a US round trip) | Store LCP on phones is 3.3 s ([QA baseline](qa/baseline-2026-10-10.md)) |
| C18 | Meta Events Manager: (1) is the `openbridge` gateway the pixel config names (us-east-1 / us-central1 hosts, not in our CSP) the business-level Conversions API connection? (2) automatic advanced matching attaches Kheelona's OWN WhatsApp number as the visitor's phone on 39 of 39 PageViews (it reads it from the page): check the AAM field settings and Event Match Quality | Tracking parity and match quality; raised at Gate A under G6 too |
| C19 | Open an official Kheelona YouTube channel for the consented films? (the @KHEELONA handle belongs to an unrelated channel; YouTube shows toy-review demand in Hindi and Tamil) | Entity confusion; G3 |
| C20 | After the first deliveries: a process to collect real, consented reviews (a WhatsApp or email ask after 2-3 weeks, with consent recorded) | The biggest trust device the benchmarks use that Kheelona cannot use yet (brief 4.2) |
| C10 | Security follow-ups: keep the CSP in Report-Only with an identical policy through launch (recommended); publish `/.well-known/security.txt`?; four latent checkout issues: leave the logic unchanged and propose fixes after launch (recommended), and you check the odd ₹0 event tier and the two test rows in Supabase | Brief 4.4 QA adds: the Report-Only CSP's inert `upgrade-insecure-requests` costs 4 Best Practices points (73 to 77) and could be dropped in the new site's policy; the pixel's openbridge hosts are not in connect-src (C18). |

## F. Content rulings from the D013 classification pass (ask one at a time)

Raised by `wf_68f4ef5c-ad8` (classifiers + leak verifier, 2026-10-10). The verifier found **no
leaks** (no internal material marked EXTERNAL). These need the founder's ruling:

| ID | Ruling needed | Notes |
|---|---|---|
| R1 | **ANSWERED 2026-10-10: (c) all real**, [D017](decisions/D017-live-behaviour-claims-confirmed.md). Live, founder-approved behaviour claims ("answers, then asks a question back", "cannot browse", parents read every conversation, one-tap delete): publish now, or hold until the product team confirms each (F8)? | Applied unevenly today; one ruling settles about 50 "if confirmed" marks |
| R2 | **SUPERSEDED 2026-10-10: there is no wake word; a wake-up button turns the mic on** ([D018](decisions/D018-wake-up-button.md)). Was: the founder's 2026-10-04 wake-word wording ("listens only for its wake word; records or sends nothing before it"): use now, or wait for G5? | Without it the site cannot answer "Is it always listening?" |
| R3 | **ANSWERED 2026-10-10: (b) multiple outside providers; the line is retired** ([D019](decisions/D019-voice-providers.md)). Was: "Voice goes only to Kheelona's own servers, in India" (confirmed 2026-10-04): publish, or hold until F5 because `/playos` says "Nothing rented that matters"? | The only confirmed claim held back |
| R4 | **ANSWERED 2026-10-10: (a) with placement rules** ([D025](decisions/D025-speech-and-language.md)). Was: May the site say "not a therapy device / not a treatment for speech delay", or is any health wording out? | Live today in one article |
| R5 | **ANSWERED 2026-10-10: (b) dropped from the new site; BANNED like "adapts"** (founder; covers "the feeling gets read", mood reading, "maps emotions and triggers"). Was: "The feeling gets read" (PlayOS reading the child's mood): ban it like "adapts", or hold for F8? | The positioning drops emotion reading |
| R6 | **ANSWERED 2026-10-10: (c) use as SKM wrote them, after independent verification against the original source, each with a linked source marker** ([D026](decisions/D026-public-statistics.md)). Was: Fear-based public figures ("85% of brain development by age 6", "2.2 hours of screen time, double the guideline"): allowed if cited, or out under the DS no-fear rule? | DS `07-selling.md`; voice rule 4 |
| R7 | **ANSWERED 2026-10-10: (b)**, [D016](decisions/D016-brain-wording.md). One ruling on the brain wording (F9) settles six lines: "brain-development toy", "Built to support your child's brain development", "a gift that grows young minds", "good for their brain", "so they think, talk and wonder more", SKM's hero | The founder's 2026-10-04 rule is the default |
| R8 | **ANSWERED 2026-10-10: (a) drop "lessons"; Story mode = stories, poems and jingles; no interrupt-and-ask feature** ([D027](decisions/D027-story-mode-wording.md)). Was: "Lessons": SKM bans the word, but it is in the sanctioned Kheelona+ line and the Story-mode spec | |
| R9 | **ANSWERED 2026-10-10: (a) parents of 3-7 year olds and family buying for them; nothing else** (founder). Was: Is the site for parents and family gift buyers only? (corporate HR gifting and preschools marked INTERNAL) | Follows from D013 |
| R10 | **ANSWERED:** Kheelona+ line ([D027](decisions/D027-story-mode-wording.md)); price wording ([D028](decisions/D028-price-wording.md), 2026-10-11). Bing's AI says Kheelu is "priced at ₹499" with "a lifetime subscription to Kheelona+", most likely from our own wording ("₹499 reserves..." and the sanctioned "smart features are lifetime" line). May the new copy reword the price and the Kheelona+ line so machines cannot misread them? | `raw/research/geo/ai-answer-audit-2026-10-10.md` |

## L. Legal actions from the Indian-law review (founder's; ask one at a time)

From [legal requirements](product/legal-requirements.md) (65 verified rows; a check against the
law's own text, not legal advice). The page owns the provisions; this list only tracks the asks.

| ID | Action | Why / provision | When |
|---|---|---|---|
| L1 | **BIS licence and ISI mark for Kheelu (IS 15644, relevant IS 9873 parts): status?** Our records show no certificate. The review reads the Toys QCO as barring import, sale or dispatch of an unmarked toy; ask counsel whether paid pre-orders count as "exhibit for sale". Merges F4's certification part | Toys (Quality Control) Order para 3; BIS Act s.17(1). **BLOCKER** | Before the first dispatch (20 Oct) |
| L2 | Grievance acknowledgement: publish **48 hours** (not 5 days) and "resolve within one month"; add a phone number that takes calls and a complaint reference number | E-Commerce Rules 4(4), 4(5); SPDI Rule 5(9). **BLOCKER** for publishing | Wording at Gate A |
| L3 | Charger and battery BIS registration numbers (Compulsory Registration Order) and WPC radio approval for Wi-Fi/Bluetooth | Electronics CRO 2021; DoT/WPC ETA (official text not fetched) | Before the first dispatch |
| L4 | Legal Metrology declarations on the listing and box, with ONE MRP of at least ₹7,999 (nothing may sell above the printed MRP, and the post-500 price is ₹7,999); merges F3 | Legal Metrology (Packaged Commodities) Rules | Before the first dispatch |
| L5 | Returns completeness: exchange policy, who pays return shipping, and a refund option for faulty or not-as-described units beyond the 7-day replacement (merges the F1 remainder) | E-Commerce Rules 7(1)(a), 7(4) | Before the first dispatch |
| L6 | A product privacy policy matching D018-D020 and the signed provider contracts, and a verifiable parental-consent step at setup; no tracking or behavioural monitoring of children (daily summaries and alerts need a reading) | DPDP Act s.9; DPDP Rules (duties from 13 May 2027, counsel to confirm the date) | Before the toy connects to servers |
| L7 | Copy fixes the review requires (CTO will apply in the new copy): drop "free" from Kheelona+ and say what stops after 6 months; the store's "Pre-order price" row becomes "Refundable advance"; no learning-outcome claims; no "Families already using Kheelu" | CCPA misleading-ads and dark-pattern guidelines; ASCI | New site |
| L8 | Dated duties: join the National Consumer Helpline before 1 January 2027; first dark-pattern self-audit in December 2026; five more E-Commerce duties from 1 January 2027 (Amendment Rules 2026) | E-Commerce (Amendment) Rules 2026; dark-pattern guidelines | Dec 2026 / Jan 2027 |

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
