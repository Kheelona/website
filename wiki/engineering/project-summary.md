---
title: "Where the rebuild stands: everything up to 2026-10-15, and the quick-changes phase"
type: engineering
updated: 2026-10-15
sources: [../status.md, ../log.md, tasks.md, ../qa/gate-b-pack.md, ../qa/deviations.md, ../decisions/D046-gate-a-approved.md, ../decisions/D061-advisor-proposal-what-we-take-2026-10-15.md, ../decisions/D062-quick-visual-changes-until-final-2026-10-15.md, ../open-questions.md]
---

# Where the rebuild stands (2026-10-15)

A summary to hand over or resume from. Each fact lives on its linked page; this page only points to them.
**From here on the work is quick visual changes, batch by batch, until the founder says the website is final; the
detailed QA and the integrations come once it is final ([D062](../decisions/D062-quick-visual-changes-until-final-2026-10-15.md)).**

## 1. Where it lives

- **Beta (public, D060):** https://betawebsite.kheelona.com and https://betastore.kheelona.com. Noindex, no payment
  (D051), Meta and GA4 off, PostHog `env=beta`. It serves branch `beta` at `398c5ee`.
- **The rebuild's branch:** `reset/website-v2` (pushed to `beta` with `git push origin reset/website-v2:refs/heads/beta`).
- **Production:** https://kheelona.com and https://store.kheelona.com still run the live site from `main` (`8c4718a`),
  untouched until Gate B. `main` already merged into the rebuild (8b.3), so the Gate B merge needs no force-push.
- **Docs:** [status](../status.md) (one screen), [log](../log.md) (every step), [index](../index.md) (every page).

## 2. What is built

The full approved page set (Gate A, D046), phone first, on Next.js 16.3.8 with the design system as the only visual
source: Home, the product page (`/products/kheelu`), `/safety`, `/setup`, `/team`, `/contact`, the buyer's guide
(`/ai-toys-for-kids-in-india`), the journal hub and its 20 guides (`/stories`), the four legal pages, the campaign
landing route, the store and `/thanks` (checkout logic unchanged, ADR-013), and the machine files (`/llms.txt`,
`/pricing.md`, sitemap, robots). Motion as the founder picked it (D049); the WhatsApp bubble on every page (D050).

| Wave | What it added | Where it is recorded |
|---|---|---|
| 1-7 | tokens and primitives, sections, every page, the store restyle, tracking, SEO, motion | [tasks](tasks.md), [log](../log.md) |
| 8 | the founder's answers to the built-page reviews (D054-D056) | [tasks](tasks.md) wave 8 |
| 8b | the live site's changes: the claims after the live team's code check (D058), the journal from the admin dashboard (ADR-014, D057, D059), `main` merged in | [journal pipeline](journal-pipeline.md), [reconciliation](../qa/live-main-reconciliation-2026-10-14.md) |
| 8c | the marketing advisor's proposal, reviewed and decided (D061): Kheelu on the first phone screen, the later price, "Made in India" and the share link on the offer cards, parents' quotes, the recognition strip, four steps, the example conversation, the expert clip, FAQ wording, guards for stale facts; then the CMO's built-page fixes and Home's React error on Vercel | [the review](../research/advisor-homepage-proposal-review.md), [CMO 8c](../qa/cmo-review-wave-8c-2026-10-15.md), rows V38-V48 in [deviations](../qa/deviations.md) |

Every change to the approved Gate A pages is a row in [deviations](../qa/deviations.md) (V1-V48) for the founder's
signature at Gate B.

## 3. The decisions that shape it (latest first)

| Decision | In one line |
|---|---|
| [D062](../decisions/D062-quick-visual-changes-until-final-2026-10-15.md) | quick visual changes until the site is final; detailed QA and integrations after |
| [D061](../decisions/D061-advisor-proposal-what-we-take-2026-10-15.md) | the advisor's proposal: what we take (items 1-15) |
| [D060](../decisions/D060-beta-open-to-the-public-2026-10-14.md) | beta open to the public |
| [D059](../decisions/D059-journal-voice-uploads-and-timing-2026-10-14.md), [D057](../decisions/D057-journal-from-dashboard-and-three-wordings-2026-10-14.md) | the journal from the dashboard; the switch after Gate B |
| [D058](../decisions/D058-follow-the-live-code-check-2026-10-14.md) | the site follows the live team's code check (withdrawn app features, claims) |
| [D052](../decisions/D052-qa-checkpoints.md) | QA at checkpoints (paused for the quick-changes phase, D062) |
| [D051](../decisions/D051-beta-without-store-integrations.md), [D048](../decisions/D048-beta-deployment.md) | beta without store integrations |
| [D046](../decisions/D046-gate-a-approved.md) | Gate A approved: the mockups are the reference |

The full list: [index](../index.md), Decisions.

## 4. Quality at the end of the full-QA phase (`398c5ee`, 2026-10-15)

`npm run verify`: 308 files, 6536 tests passed. Production build green (the 20 journal pages prerendered, no open
placeholder). Playwright on Home and the product page: 156 passed; the store stand-in run: 453 passed; the last full
run (wave 8b close): 1613 passed. Lighthouse local: Home 93, product 94, store 98; on beta Home 91, product 99; with the
tags 83-85 on battery (to re-measure on mains power). The CMO's review of wave 8c passed; its 12 minor findings were fixed
(8c.7, 8c.8). Two Vercel-only traps were found and fixed on the way ([lessons](lessons.md) §1): prerendered pages live in
`.next/server/route-cache` under Vercel's adapter, and Vercel renders Home as `/index`.

## 5. How a quick-change batch runs now (D062)

1. The founder lists the changes; the main session asks only what it cannot decide.
2. A builder (or the main session for a one-line edit) makes them in a worktree.
3. `npm run verify` and the production build, green; one quick review only for a risky change.
4. Merge, push `beta`, check the Vercel deploy, tell the founder what to look at.
5. Log, status and the deviation rows updated in the same batch.

Always kept: no secrets; checkout logic unchanged; tracking IDs and events unchanged; the claims guard (a line that breaks
the claims rules is rewritten and the founder told); the design system untouched.

## 6. Deferred to the final pass (once the website is final)

Full Playwright with the parity suites re-based on the approved beta; Lighthouse on mains power with the tags
(`/stories` included); the CMO's built-page review; beta QA (task 7.2, on hold); tracking parity evidence;
accessibility; the store and the payment sandbox; the production integrations (Supabase, Razorpay, email, Meta and GA4
events); the share message's ₹ sign on an Android and an iOS WhatsApp; legal sign-off; the [Gate B pack](../qa/gate-b-pack.md).

## 7. Waiting on the founder

- Sign the deviation rows V1-V48 at Gate B; the legal sign-off of `/privacy`, `/terms`, `/refund`, `/shipping` (D029;
  a production build refuses their drafts).
- Open questions G18, G21, G26-G30, G32 ([open questions](../open-questions.md) §G); F4 values before dispatch.
- Turn off the Vercel toolbar for the beta project (Settings → General → Vercel Toolbar).
- Forward [For the advisor](../brand/for-the-advisor.md) and [For Aman](for-aman.md) (the live site's Next.js security
  patch, G25; the journal's backend changes; G31).

## 8. The first quick-change batch (requested 2026-10-15)

Home's films ("Kheelu asks. Watch them think."): the 2nd film replaced with the 4th and the 3rd with the 7th; "Safety
you can check." collapsible, half as wide, its four items shorter; the WhatsApp logo from Wikimedia Commons' WhatsApp.svg;
hero image options for the founder; "What you get, and what you pay.": the girl's picture aligned with the offer card;
the footer's link gaps smaller; the GSTIN and the phone number removed from the site; "What is Kheelu?" redesigned as a
sticky-scroll section with the year-by-year content the founder shared. Progress: [log](../log.md).
