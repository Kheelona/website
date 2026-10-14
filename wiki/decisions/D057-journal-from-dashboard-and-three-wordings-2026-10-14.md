---
title: "D057: The journal comes from the admin dashboard; the films heading, the /terms age line and a refused event link's words"
type: decision
updated: 2026-10-14
sources: ["founder's answers in the build session, 2026-10-14 (one round of four questions after wave 8 closed)", ../open-questions.md, ../site/pages/meet-kheelu.md, ../site/pages/terms.md, ../site/pages/store.md, ../qa/cmo-review-copy-fixes-7.1b-2026-10-14.md, ../qa/cmo-review-store-fixes-7.1c-2026-10-14.md, D056-founder-answers-built-page-reviews-2026-10-14.md]
---

# D057: The journal comes from the admin dashboard; three wordings

## Context

Wave 8 closed on 2026-10-14. Its fixes left four questions for the founder ([open questions](../open-questions.md)
G19, G20, G22, G23). G23 came from the beta push: since 2026-10-13 the live site's journal is written in the admin
dashboard (admin.kheelona.com → Blog) and pulled in at each build (`tools/blog/sync.mjs` on `main`, PRs #20-#22),
while the rebuild holds its 20 guides as code modules. Each answer below is the founder's, with the option they picked.

## Choices

1. **The journal (G23): dashboard posts.** The new site keeps the sync and shows the dashboard's published posts in
   the new article design, so writers keep publishing from the dashboard. The rebuild's rewritten guides (the
   related-guide ring, share images and the CMO fixes) go into the dashboard as posts. The rest of G23 (the live
   team's changes to `/privacy`, `/terms` and the product claims, PRs #18 and #19) is brought into the rebuild before
   Gate B in any case.
2. **The films heading (G19): "Real children, *real families.*"** on the product page (Home's approved words, the Hand
   accent on "real families."), with the eyebrow **"Seven films"** (the count checked in D040). It replaces D056 item
   2's "Real families, in their own homes." and the eyebrow "Real homes": on 2026-10-11 the founder said not every film
   was shot at home.
3. **`/terms` section 9's age line (G20): aligned.** "For 3-year-olds, we advise having a grown-up nearby." becomes
   "If your child is 3, keep a grown-up nearby.", the sentence every FAQ answer now uses; signed off with the other
   legal pages (D029).
4. **A refused event link's words (G22, part 2): "This link is incomplete, or not one of ours. You can pre-order at the
   usual price in our store."** for a link whose signature fails (a QR link cut short when forwarded, or a forged one).
   Part 1 of G22 stands as recorded: before any event tier is switched on again, a reviewed presentation map from the
   create-order error to the per-reason words (ADR-013).

## Why

The founder's own answers, given on request; each followed the recommendation offered.

## What it changes in the build

Items 2, 3 and 4 are applied by the main session (copy pages, modules, parity rules). Item 1 needs design and build
work before Gate B: the rebuild's journal reads the dashboard's posts at build time, rendered by its own article
template; the guides' rewritten content is prepared for the dashboard. Planned in [tasks](../engineering/tasks.md).

**Approved by.** Founder. **Date.** 2026-10-14.
