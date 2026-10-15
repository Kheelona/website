---
title: "Where the rebuild stands: everything up to 2026-10-15 (evening), the selling update"
type: engineering
updated: 2026-10-15
sources: [../status.md, ../log.md, tasks.md, ../qa/gate-b-pack.md, ../qa/deviations.md, ../decisions/D046-gate-a-approved.md, ../decisions/D061-advisor-proposal-what-we-take-2026-10-15.md, ../decisions/D062-quick-visual-changes-until-final-2026-10-15.md, ../decisions/D064-quick-batch-2-landing-page-and-motion-2026-10-15.md, ../decisions/D065-selling-site-founder-answers-2026-10-15.md, ../site/d2c-conversion-plan-2026-10-15.md, ../open-questions.md]
---

# Where the rebuild stands (2026-10-15, evening)

A summary to hand over or resume from. Each fact lives on its linked page; this page only points to them.
**The work is in the quick-changes phase ([D062](../decisions/D062-quick-visual-changes-until-final-2026-10-15.md)):
the founder asked for a site that sells, not only informs ([D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md)),
and "the selling update" is built and merged locally; it is not on beta yet.**

## 1. Where it lives

- **Beta (public, D060):** https://betawebsite.kheelona.com and https://betastore.kheelona.com, branch `beta` at
  `398c5ee` (wave 8c). The selling update reaches it with the next push.
- **The rebuild's branch:** `reset/website-v2` (local, ahead of beta: waves q2a, q2b, q2c and their docs). Push with
  `git push origin reset/website-v2:refs/heads/beta` (the http buffer flags, [build runbook](build-runbook.md) §5).
- **Production:** https://kheelona.com and https://store.kheelona.com run `main` (`8c4718a`), untouched until Gate B.
- **Docs:** [status](../status.md), [log](../log.md), [index](../index.md).

## 2. What is built

The full approved page set (Gate A, D046), phone first, on Next.js 16.3.8, the design system the only visual source.

| Wave | What it added | Where it is recorded |
|---|---|---|
| 1-8c | every page, the store restyle, tracking, SEO, motion; the founder's answers; the live site's changes; the advisor's proposal (D061) | [tasks](tasks.md), [log](../log.md), V1-V48 in [deviations](../qa/deviations.md) |
| q2a | the Kabir hero photo, the films order, the offer picture aligned, the GSTIN and phone off the pages, WhatsApp's own logo, tighter footer rows, the expert clip without burned words, the short price line and one risk-reversal line, motion (line drawing, micro-interactions), the sticky laptop nav from 900 px | tasks Q2.1-Q2.8; V49-V57 |
| q2b, the selling update | Home end to end (eleven folds: hero, films with quotes and "Recognised by", why it matters, languages, the sticky scroll "Kheelu asks. Your child thinks.", the expert clip, the offer moved up, compact safety, a day with Kheelu, questions, close); the product page (offer up, sample chats on tabs, compare table, safety in one line, new questions, the statutory consumer-care phone); `/safety` (G26, the daily limit, every conversation word for word); every other page's close | tasks Q2.9-Q2.12; [plan v2](../site/d2c-conversion-plan-2026-10-15.md); V58-V64 |
| q2c | the follow-ups: the Kheelona+ note inside both offer cards, one help line "Questions? Message us on WhatsApp." with a 44 px tap area, the footer's parity rule, `/privacy` names "Delete all chats" | tasks Q2.13-Q2.14; [log](../log.md) 2026-10-15 21:40 |

New button-tracking values (`hero-film`, `home-why`, `home-asks`, `home-asks-learn`, `home-offer`, `product-ask`,
`safety-facts`, `guide-answers`, and `finale` on `/setup`) are registered; every existing ID and event name is
unchanged ([tracking inventory](../site/tracking-inventory.md) §6).

## 3. Quality at `5b245a26` (2026-10-15, 21:40 IST)

`npm run verify`: 315 files, 6917 tests passed; no new duplicated code; the design system intact (643 files); the
production build green (20 journal pages, no open placeholder). Per D062 the full Playwright suites, Lighthouse and beta
QA wait for the final pass. **The cross-page consistency review** (four lenses at 360/390/412/1024-1440, then a verifier
per serious finding; `wf_78365aa5-dfe`) was **paused** at the founder's request for docs; resume it with its run id.

## 4. Rulings taken while the founder slept (to confirm)

The WhatsApp bubble stays visible on Home's first phone screen (D050; plan §13 item 7 is the founder's), with the hero
photo cropped clear of it; the share text stays as D061 item 7 (plan §1.7 to sign); plan §13 items 1-6 and 8 as
recommended; two product-page answers approved short (37 and 31 words) because nothing confirmed can lengthen them
(F7); the machine files show the WhatsApp address in plain text; the store's checkout column keeps "Rather talk to a
person?" ([log](../log.md) 19:10 and 21:40).

## 5. Next

1. Resume the consistency review; fix what it confirms (Home's phone length, about 18 screens, gets the CMO's ruling).
2. Push `beta`, check the deploy (build runbook §5), report to the founder with links and the rulings above.
3. Then the final pass (D062): full Playwright re-based on the approved beta (cta.spec, parity), Lighthouse on mains
   power, beta QA, tracking evidence, accessibility, store and payment sandbox, production integrations, legal sign-off,
   the [Gate B pack](../qa/gate-b-pack.md).

## 6. Waiting on the founder

Sign plan §1.7 and §13 item 7; F7 (after the 6 months of Kheelona+); G28's Wi-Fi line and G29's pre-launch test before
Gate B; G18, G21, G27, G32; for Aman G25, G31, G33 ([For Aman](for-aman.md)); the Vercel toolbar off; V1-V64 and the
legal pages at Gate B; F4 values before dispatch ([open questions](../open-questions.md) §G).
