---
title: "The advisor's homepage proposal (2026-10-12): the review, the decisions and what we build"
type: research
updated: 2026-10-15
sources:
  - ../raw/feedback/advisor-homepage-2026-10-12/ (local only, git-ignored: the content document, the clickable design rendered, recommendations.md with AP-01..AP-37)
  - "workflow wf_13c2e74f-ae8, 2026-10-15: six reviews (copywriter, claims and compliance, search visibility, PostHog read-only, benchmarks, architect), the CMO's decisions, two challengers"
  - ../qa/cmo-review-advisor-proposal-2026-10-15.md
  - ../decisions/D061-advisor-proposal-what-we-take-2026-10-15.md
---

# The advisor's homepage proposal: review and decisions

**What it was.** A senior marketing advisor wrote a homepage for the founder (12 October 2026): a content document
(22 sections, a phone first screen for ads, a reserve page, 11 open items) and a clickable design. Both are kept
local and uncommitted (a third party's draft with names); the 37 recommendations are numbered AP-01..AP-37 in
`raw/feedback/advisor-homepage-2026-10-12/recommendations.md`.

**How it was reviewed (2026-10-15).** Six independent reviews, then the CMO decided each item, then a buyer's
advocate and a guardrails auditor challenged the decisions; the founder answered the four questions that were theirs
([D061](../decisions/D061-advisor-proposal-what-we-take-2026-10-15.md)). The CMO's full table, with the copy for each
adapted item: [cmo-review-advisor-proposal-2026-10-15](../qa/cmo-review-advisor-proposal-2026-10-15.md).

## The verdict: take four ideas, not the page

Out of 37 items: 0 adopted as written, 7 adapted, 12 the site already does, 15 rejected, 3 for the founder.

- **Built on facts that changed.** Ships 20 October (now mid-November, D023), cash on delivery (none, D024), 15-day
  returns (7 days, D021), "Ages 3+" (3 to 7), Marathi and Punjabi (the 8 named languages, D058 item 7), five parent-app
  features withdrawn on 12 October (D058), the brain headline (D016), and three testimonials that are drafted words on
  real pilot parents (D009). The claims review traced each one; the banned-phrase guard caught only three of them
  (the brain line, 15-day returns, "grows with your child"), so 8c.4 adds the rest.
- **Its structure is the old Home, already measured.** On the live site the lower two-thirds of that long page reached
  under 17% of organic phone views and about 1% of paid ones; no buyer reached the comparison, the quotes or the FAQ
  (PostHog review). Beta Home already uses 56 of its 60 KB HTML budget.
- **It is right about the biggest gap.** Paid phone visitors decide on the first screen (410 sessions, 0 orders, 90%
  of Home views never scrolled), and neither Home nor the product page shows Kheelu there. Films are the most-clicked
  Home element and 2 of 3 buyers played one, yet only 4 of 410 paid phone sessions reached a film (PostHog review).
- **Persistent buttons sell.** The phone buy bar and the laptop navbar button produced all three purchases in the
  audit window; in-page buttons produced none (PostHog review). Nothing here moves them.

## What we build (wave 8c, [tasks](../engineering/tasks.md))

| Item | What | Where | Founder |
|---|---|---|---|
| AP-09, AP-03 | Kheelu on the first phone screen, with the approved headline, button and price; the WhatsApp bubble clear of the hero sticker | Home, product page (phones) | D061 item 1; deviation row |
| AP-28 | "₹4,999 for the first 500 units. ₹7,999 once they are gone." on the offer cards, while the first-500 price is live | Home, product page | D061 item 3; deviation row |
| AP-28 | "Share Kheelu on WhatsApp" under the offer cards; new share text; new `cta` value | Home, product page | signs the text |
| AP-26 | Two parents' own words from the consented films, word for word, each with "Watch the film" | Home and product films folds | D061 item 4; deviation row |
| AP-11 | "Recognised by" strip (the /team strip as built) | Home after the films; product page before the offer | deviation row |
| AP-14, AP-15 | Four plain steps (the memory step with the parent's control) and the labelled example conversation | Product page | deviation row |
| AP-30 | FAQ question "What if my child doesn't like it?"; a languages FAQ if no page answers it | faqs.ts | deviation row |
| (guard) | Banned-phrase entries for the advisor's stale facts | test/guards | — |
| (people) | [A fact pack for the advisor](../brand/for-the-advisor.md) | wiki | forwards it |

## The challenges, and how they were resolved

- **A new ad page vs the product page vs Home** (buyer's advocate: fix the product page first; guardrails: the CMO's
  /lp design was not built from approved parts and broke the buy-bar and D049 rules): the founder kept the ads on Home
  and chose Kheelu on both first phone screens, so no /lp page is built.
- **The film quotes** (buyer's advocate: readable proof for parents who never press play): the founder approved them;
  lines are chosen for claims ("completely safe", "more than an hour" and "make him jump" are left out).
- **The memory step** (guardrails: D036 puts "remembers" next to the parent's controls): step 4 carries "You can read
  every one of them."
- **The share text** (guardrails: the existing `WHATSAPP_SHARE_HREF` is pinned by a parity test and breaks D028 and
  D041): a new constant in a content module; the old one is left alone.
- **The `hero` cta value** (guardrails: never reused on another placement): no /lp, so no reuse.
- **Home fold 5's heading** (guardrails: "They're just playing. You read every word." reads as covert monitoring):
  kept as approved unless the founder chooses otherwise.
- **Cash on delivery** (buyer's advocate: decide a post-launch project now; guardrails: already decided, D024): stays
  off; parked as a post-launch idea with its trigger.
- **The facts row** "Up to 10 languages" needs "at launch" wherever it appears (guardrails); not built now (it was for
  the ad page).

Also found: on beta phone pages the Vercel preview-comments button covers the end of the price sentence at 390 px
(a Vercel setting, preview only; it never loads in production).
