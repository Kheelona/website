---
title: "ADR-014: The journal comes from the admin dashboard: a build-time snapshot of the published posts, adapted to the rebuild's Article model and rendered by its own ArticleTemplate"
type: adr
updated: 2026-10-14
sources:
  - ../../decisions/D057-journal-from-dashboard-and-three-wordings-2026-10-14.md (item 1)
  - ../../decisions/D058-follow-the-live-code-check-2026-10-14.md
  - ../../qa/live-main-reconciliation-2026-10-14.md (§3, §4)
  - ../tasks.md ("### 8b.2", "### 8b.3")
  - ADR-004-content-model.md (option 1 rejected a CMS; this ADR supersedes it for articles only), ADR-010-media-pipeline.md, ADR-011-guardrails-and-qa-harness.md, ADR-012-seo-urls-and-schema.md, ADR-013-checkout-restyle-boundary.md
  - "origin/main 8c4718a, read with git show 2026-10-14: tools/blog/sync.mjs, tools/blog/validate.mjs, src/lib/stories.ts, src/lib/stories.data.json, src/app/(site)/stories/[slug]/page.tsx, src/components/organisms/ArticleBody.tsx, src/components/molecules/VideoEmbed.tsx, src/lib/security-headers.ts, next.config.ts, package.json:7, test/blog-sync.test.ts, CLAUDE.md:3-16"
  - "GET https://api.kheelona.com/v1/public/blog/posts, 2026-10-14 07:14 UTC (one request): 22 posts, data-identical to main's snapshot"
  - "src/content/types.ts:195-197, :361-423, :451-472; src/layouts/ArticleTemplate/ArticleTemplate.tsx:36-89; src/content/en-IN/stories/articles/index.ts:37-63; scripts/run-steps.mjs:20-57 (read 2026-10-14)"
  - ../journal-pipeline.md (the full design this ADR summarises)
---

# ADR-014: The journal comes from the admin dashboard

**Status:** proposed by the Architect, 2026-10-14, for QA review and the main session (task 8b.2 design). The founder
questions it raises are in [journal-pipeline §14](../journal-pipeline.md#14-questions-only-the-founder-can-answer).

## Context

Since 2026-10-13 the live site's journal is written in the admin dashboard: writers draft at admin.kheelona.com → Blog,
an admin publishes, publishing POSTs a Vercel Deploy Hook, and the build pulls the published posts from
`https://api.kheelona.com/v1/public/blog/posts` (main:CLAUDE.md:3-8; main:tools/blog/sync.mjs:2-17). The sync fails
the build on an unreachable API, a malformed post or a drop below half the last count, so Vercel keeps the last good
deploy (main:tools/blog/sync.mjs:9-11, :62-74; main:tools/blog/validate.mjs:25-78). Posts are ProseMirror documents
whitelisted to eight block nodes (main:src/lib/stories.ts:13-46).

The rebuild holds its 20 rewritten guides as typed modules (`src/content/en-IN/stories/articles/<slug>.ts`) under
[ADR-004](ADR-004-content-model.md), whose option 1 (a CMS) was rejected. The founder ruled that the rebuild's journal
comes from the dashboard, rendered by the rebuild's own article template, and that the 20 guides, corrected per D058,
go into the dashboard as posts (D057 item 1; D058 "What it changes in the build").

The two models do not line up. The rebuild's `Article` (src/content/types.ts:451-472) has three titles (meta, card,
h1 with a hand-lettered accent), a lead and a card summary, an answer-first block, numbered sources with in-text markers
(D026), a DS head photo with its 1200 x 630 share card (task 7.1f), a curated ring of three related guides (task 7.1d),
a close variant, and prose blocks the dashboard cannot express today (tips, checks, facts, callouts, question groups).
A post has one title, a description, an uploaded cover, a sources list without markers and eight node types; the 22
live posts use only paragraphs, level-2 headings and links (API response, 2026-10-14).

## Options

1. **Keep the 20 guides as code modules and ignore the dashboard.** Contradicts D057 item 1. Rejected.
2. **Port main's pipeline and main's article page (`organisms/ArticleBody`, the old story page).** Fast, but it renders
   the old design, which D057 rules out, and it would be a second article template beside `ArticleTemplate`.
   Rejected.
3. **Fetch the API at request time (ISR or dynamic pages).** Pages would depend on the API at runtime, an unknown slug
   could no longer stop at the router (`dynamicParams = false`, lessons §1), and an API outage would become page errors
   instead of a held deploy. Rejected.
4. **A second renderer for ProseMirror documents beside ArticleTemplate.** Two article renderers, every article guard
   written twice, and the scalability test split in two. Rejected.
5. **A build-time snapshot of the published posts, adapted to the rebuild's `Article` model by one pure function, and
   rendered by the existing ArticleTemplate; the post gains a few fields and node attributes so it can carry the
   approved design; everything else is derived.** Chosen.

## Decision

Option 5, in these parts (detail and field maps in [journal-pipeline](../journal-pipeline.md)):

- **Snapshot.** `src/content/en-IN/stories/posts.generated.json` (committed; `{ generated, source, posts }`), written
  only by `scripts/journal/sync-posts.mjs` (or, once, by the export of the 20 guides). Prebuild step
  `scripts/steps/prebuild/15-journal-sync.mjs` runs it; Vitest, CI, the local e2e and beta read the committed file.
- **Source switch.** The sync calls the API only on a production build with `JOURNAL_SOURCE = "api"` (a committed
  constant in `src/config/journal.ts`, "snapshot" until the 20 guides are imported and checked after Gate B) unless
  `BLOG_SYNC=off`; `BLOG_SYNC=on` forces it by hand. Main's env names stay: `BLOG_SYNC`, `BLOG_API_URL`,
  `BLOG_ALLOW_SHRINK`.
- **Failure rules (main's, kept and widened).** Unreachable API, a malformed post, a banned claim, fewer than 4 posts,
  or a drop below half the last count (unless `BLOG_ALLOW_SHRINK=1`) fails the build; Vercel keeps the last good deploy.
  Editorial rules (answer length, markers, ring coverage, spelling, meta lengths) print warnings at build and fail
  `npm run verify` on the committed snapshot. A postbuild step checks that every post became a prerendered page.
- **Adapter.** `postToArticle` (`src/lib/journal/to-article.ts`, pure, no content imports) maps a post to an `Article`;
  `src/content/en-IN/stories/journal.ts` wires it to the topics, the DS photo table and the bylines and becomes the
  article registry. Pages, the hub, the sitemap, the sticky bar and every article guard keep reading `Article`s.
- **Post additions (backend).** Nullable fields `metaTitle`, `cardTitle`, `accent`, `lead`, `summary`, `answer`,
  `photo`, and `related` (empty or three slugs); `theme` constrained to the four topic titles; node attributes for list styles, item icons,
  blockquote styles (callout, questions), DS images in the body and heading anchors. Source markers are typed as
  `[^n]` in the text, as in the rebuild's own syntax. Close variant, the D025 line, breakout parts, the bold lead-ins,
  no-wrap phrases, read time and share card are derived, never stored.
- **Images.** A post names its head photo by DS key (`photo`): the static DS import is the head and `/og/<key>.jpg`
  the share card. Without a key, its uploaded cover shows through `next/image` from the exact API path; without
  either, no photo, and a talking guide is refused (P19: never the product shot). Founder question Q2.
- **VideoEmbed** is ported to `ui/VideoEmbed` (a still until pressed, DS parts only, no events); `frame-src` gains
  `https://www.youtube-nocookie.com` and `https://player.vimeo.com` by a regenerated, reviewed checkout-freeze patch
  citing D057 item 1, as production has run since 2026-10-13 (main:src/lib/security-headers.ts:81-87, :171-178).
- **Redirect wins.** A post whose slug is a redirect source (D041, D053) is dropped from the journal with a warning.
- **Migration.** The corrected 20 guides are exported into the snapshot (the dashboard's JSON) and the site renders
  from it at Gate B; the backend imports that file after Gate B, the sync's `--check` proves the API returns it
  unchanged, then `JOURNAL_SOURCE` flips to `"api"`.

No new npm package (Node's `fetch` and `AbortSignal.timeout`, `next/image` `remotePatterns`, the existing Vitest).

## Consequences

- **Scalability (brief §6).** A new story is a published dashboard post: a topic, a byline from the list, a DS photo
  key or an upload, the words. No module, no route line, no component (architecture §5.4 changes accordingly).
- **ADR-004 is superseded for articles only.** Article words now live in the dashboard; the copy pages
  `wiki/site/pages/story-*.md` become the record of what the founder signed at Gate B. Every other content module is
  unchanged.
- **Type safety moves from compile time to build time.** `ArticleSlug` stops being a literal union; the registry,
  routes, hub and sitemap derive from the snapshot, and the adapter and validator refuse what the template cannot
  render.
- **Writers can publish things the rebuild's editorial guards would reject** (a short answer, a missing marker, a
  new post nobody links to). They ship with a build warning and turn `npm run verify` red at the next snapshot refresh.
  Claims, retired offer terms, broken structure and unknown vocabulary never ship.
- **The build depends on the API after the flip**, as main's does: an outage holds every deploy, code fixes included,
  until it recovers or the founder sets `BLOG_SYNC=off` for one deploy.
- **The backend team must change the dashboard** (journal-pipeline §13) and, for the 20 guides to import, either relax
  its publish-time voice law to the DS writing guide or have the guides de-contracted (founder question Q1).
- **Test churn is large** (about 25 test files read article modules today); the round-trip property (export a module,
  adapt it back, get the same `Article`) is what lets them move without weakening a guard.
- **The merge of `origin/main` (8b.3)** drops main's `tools/blog/*`, `src/lib/stories*`, `organisms/ArticleBody` and
  `molecules/VideoEmbed`, keeps the rebuild's versions of every conflicting file, and must check `next.config.ts`, whose
  `remotePatterns` hunk from main merges cleanly today (journal-pipeline §11).
