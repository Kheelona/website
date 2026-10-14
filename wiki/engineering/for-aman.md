---
title: "For Aman (CTO): what the website rebuild needs from the live site, the backend and the app"
type: engineering
updated: 2026-10-14
sources: [../open-questions.md, journal-pipeline.md, ../decisions/D058-follow-the-live-code-check-2026-10-14.md, ../decisions/D059-journal-voice-uploads-and-timing-2026-10-14.md, ../qa/live-main-reconciliation-2026-10-14.md]
---

# For Aman: what the rebuild needs (2026-10-14)

The founder passes this page on. Each item links to the page that holds it; nothing here is decided on this page.
The rebuild is on `reset/website-v2` and on beta (behind Vercel's login); production (`main`) is untouched until the
founder's Gate B.

## Now

1. **Patch the live site's packages** ([open questions](../open-questions.md) G25). GitHub's Dependabot flags `main`:
   Next.js below 16.3.6 (critical, GHSA-vcvr-r3jv-pc5j) and below 16.3.8 (high, GHSA-cjq9-62q9-8jv4), sharp below
   0.35.5 (high, GHSA-wq5f-xc86-pv6w), source-map-js below 1.2.2 (high, GHSA-68fv-2mgg-jv7q). Bump `next` to 16.3.8 and
   `sharp` to 0.35.5 on `main` and refresh the lock. The rebuild already runs these versions; don't wait for Gate B.

## Before Gate B

2. **The journal's backend changes** ([journal pipeline §13](journal-pipeline.md#13-for-aman-the-backend-changes)):
   B1 new post fields, B2 editor nodes, B3 text tokens, B4 authors, B5 the import after Gate B, the accepted photo keys
   and icons, and five questions (other readers of `/v1/public/blog/posts`; uploads answering 200 without a redirect;
   the curly apostrophe; saving a published post's edit without going live; whether the Deploy Hook builds only
   `main`). The founder ruled the dashboard's voice check follows the design system, so contractions are allowed
   ([D059](../decisions/D059-journal-voice-uploads-and-timing-2026-10-14.md) item 1).
3. **Five facts for `/privacy`** ([open questions](../open-questions.md) G31): (1) does deleting the account also take
   a child's recordings and transcripts out of the training data; (2) with "Save voice recordings" off, are new
   recordings kept out of training, and what happens to recordings already kept; (3) each processor's region, one row
   per job; (4) where in the app the training switch is; (5) whether backend PR #39 (the server honouring "Save voice
   recordings") is in production.
4. **The model's rules** ([open questions](../open-questions.md) G29): do the child-safety rules given to the model
   tell it to say when it doesn't know? The site says "When it doesn't know something, it says so." on several
   pages; it comes off if that isn't true.
5. **The app's grievance link** ([D058](../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 4): the
   grievance officer is Aman Soni, aman@kheelona.com; the app's "Contact our grievance officer" opens
   connect@kheelona.com. The founder decides the change.

## After Gate B

6. **The journal moves to the dashboard**: a dry run of the import with the committed file
   ([journal pipeline §12](journal-pipeline.md#12-tasks-for-the-builder), 8b.2f), then the import, a check and the
   switch of `JOURNAL_SOURCE` to `"api"` (8b.2g). Until then the site builds from the committed snapshot, and the
   dashboard's posts don't reach the new site.
7. **Merging the live site's history**: the rebuild merges `main`'s commits before Gate B (task 8b.3); the live
   team's #18 and #19 changes are already in the rebuild's pages, in the code-checked words
   ([D058](../decisions/D058-follow-the-live-code-check-2026-10-14.md); the
   [reconciliation map](../qa/live-main-reconciliation-2026-10-14.md)).
