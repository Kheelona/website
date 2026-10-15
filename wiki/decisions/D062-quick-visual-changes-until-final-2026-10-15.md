---
title: "D062: Quick visual changes from here on; detailed QA and integrations once the website is final"
type: decision
updated: 2026-10-15
sources: ["founder's messages in the build session, 2026-10-15 (after wave 8c reached beta)", D052-qa-checkpoints.md, D061-advisor-proposal-what-we-take-2026-10-15.md, ../engineering/project-summary.md]
---

# D062: Quick visual changes from here on; detailed QA once the website is final

## Context

Wave 8c (the advisor's proposal, D061) is built, reviewed and live on beta (`398c5ee`). The founder now wants to look at
the site and ask for visual changes quickly, in batches, until the site is final; [the summary](../engineering/project-summary.md)
records everything up to this point.

## The founder's words

> "now we are going to do quick visual changes from here on, and till we do final changes, we will keep it quick
> changes."
>
> "These are some quick visual changes, let's do them and we will do detailed QA and other integrations once website
> is final."

## Choice: the quick-changes phase

Until the founder says the website is final, each batch of changes runs light:

- **Per batch:** build the changes; run `npm run verify` (lint, types, unit tests, the guards, the DS checksums) and the
  production build; push `beta` so the founder can look; update the log, status and the deviation rows. One quick
  review only where a change is risky (new interaction, money, tracking); none for simple visual edits.
- **Not per batch** (deferred to the final pass): the full Playwright suites (visual and text parity, first-screen, axe,
  no-JS), Lighthouse, the CMO's built-page reviews, multi-round agent reviews, beta QA.
- **Kept on every batch, because they cost nothing and protect the business:** no secrets in the repo; the checkout's
  logic unchanged (ADR-013); every tracking ID and event name unchanged; the claims guard (a line that breaks the claims
  rules is rewritten, and the founder is told which and why); the design system untouched; the journal's build steps.
- **The Gate A mockup:** visual changes now depart from it on purpose. Each change is still a deviation row; at the final
  pass the approved beta becomes the visual reference (the founder's sign-off replaces the Gate A mockup for looks), and
  the parity suites are re-based on it.

## Deferred to the final pass (once the website is final)

Full Playwright with re-based parity; Lighthouse on mains power, with the tags (`/stories` included); the CMO's
built-page review; beta QA (task 7.2, held since 2026-10-15); tracking parity evidence; accessibility; the store and the
payment sandbox; the integrations on production (Supabase, Razorpay, email, Meta and GA4 events); the WhatsApp ₹ check;
legal sign-off; the Gate B pack. D052 (QA at checkpoints) applies again from that pass.

**Approved by.** Founder. **Date.** 2026-10-15.
