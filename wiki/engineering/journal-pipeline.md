---
title: "The journal from the admin dashboard: the build-time snapshot, the post-to-Article map, images, VideoEmbed, guards, the migration of the 20 guides, the merge of main, tasks and the backend changes (task 8b.2 design)"
type: engineering
updated: 2026-10-14
sources:
  - ../decisions/D057-journal-from-dashboard-and-three-wordings-2026-10-14.md (item 1), ../decisions/D058-follow-the-live-code-check-2026-10-14.md
  - ../decisions/D015-founder-signs-off-copy.md, D025-speech-and-language.md, D026-public-statistics.md, D041-gate-a-round-1.md, D053-remove-the-3-6-9-12-article.md, D054-founder-answers-open-questions-2026-10-14.md (items 9, 14, 16, 18)
  - ../qa/live-main-reconciliation-2026-10-14.md (§2, §3, §4), tasks.md ("### 8b.1", "### 8b.2", "### 8b.3")
  - adr/ADR-014-journal-from-the-dashboard.md (the decision this page details), adr/ADR-004, ADR-010, ADR-011, ADR-012, ADR-013
  - "origin/main 8c4718a (commits 91f8032, 82e1b60, 8c4718a), read with git show on 2026-10-14: tools/blog/sync.mjs, tools/blog/validate.mjs, src/lib/stories.ts, src/lib/stories.data.json, src/app/(site)/stories/[slug]/page.tsx, src/components/organisms/ArticleBody.tsx, src/components/molecules/VideoEmbed.tsx, src/lib/security-headers.ts, next.config.ts, package.json:7, test/blog-sync.test.ts, CLAUDE.md:3-16"
  - "GET https://api.kheelona.com/v1/public/blog/posts, 2026-10-14 07:14 UTC, the one request this design made: HTTP 200; body {status: 'success', data: {posts: [22]}}; headers X-Robots-Tag 'noindex, nofollow', Cache-Control 'public, max-age=30', RateLimit-Policy '1500;w=900', Access-Control-Allow-Origin '*'; the posts are data-identical to main's src/lib/stories.data.json (key-order-insensitive compare, as main:tools/blog/sync.mjs:76-87)"
  - "Scratch analysis, 2026-10-14 (scripts in the session scratchpad, nothing written to the repo): node and mark counts of the 22 posts; the TypeScript AST of the 20 article modules (titles, leads, summaries, answers, block kinds, part structure, question groups, read times); contraction, exclamation and brace counts; test/guards/banned-phrases.data.ts findBanned() over the 22 posts; git merge-file of next.config.ts (base 24e92e3, ours HEAD, theirs origin/main)"
  - "Rebuild files read 2026-10-14: src/content/types.ts, src/content/en-IN/stories/{hub,topics}.ts, stories/articles/*.ts and their tests, src/content/en-IN/{routes,organization,policies}.ts, src/layouts/ArticleTemplate/*, src/components/sections/ArticleBody/*, src/lib/content/rich-text.ts, src/lib/seo/{metadata.ts,schema/blog-posting.ts}, src/layouts/SiteShell/sticky-bar-paths.ts, src/app/(site)/stories/[slug]/page.tsx, src/app/sitemap.ts, src/app/llms.txt/route.ts, src/config/{redirects,env}.ts, src/lib/security-headers.ts, next.config.ts, package.json, scripts/run-steps.mjs, scripts/steps/**, scripts/assets/build-og.mjs, test/guards/{checkout-freeze,build-steps,banned-phrases}.test.ts, test/guards/fixtures/authorised-diffs/src__lib__security-headers.ts.patch, test/security-headers.test.ts, test/internal-links.test.ts, test/e2e/support/routes.ts, .github/workflows/verify.yml"
  - "node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md (remotePatterns :533-611, qualities :698-712, maximumRedirects :820-840); 05-config/01-next-config-js/redirects.md:39; 04-functions/generate-static-params.md:376; node_modules/next/dist/server/config.js:584-603 (a URL pattern keeps its empty search); Next 16.3.8"
  - architecture.md (§5.4, §6.1, §9, §10, §11.3, §12, §14, §15), structure.md, components.md, assets.md, lessons.md (§1)
  - ../brand/voice.md, design-system/project/01-writing.md (read-only), ../legacy/settled-decisions.md:126, ../product/facts.md:304-310
---

# The journal from the admin dashboard (task 8b.2 design)

The decision and its options are [ADR-014](adr/ADR-014-journal-from-the-dashboard.md). This page is the design the
builder works from: the data flow, the maps from a dashboard post to the rebuild's `Article`, the image rule,
VideoEmbed, the guard plan, the migration of the 20 guides, the merge of `origin/main`, the tasks, the backend's list
and the founder's questions. "main:" line numbers are `origin/main` at `8c4718a`; the rest are this branch at
`0d8344b`.

## 0. The design in ten lines

1. The build reads a committed snapshot of the published posts, `src/content/en-IN/stories/posts.generated.json`.
   A production build refreshes it from the API before `next build` (prebuild step 15); everything else (local, CI,
   e2e, beta) reads the committed file. No request at runtime.
2. Until the 20 guides are imported into the dashboard after Gate B, production also reads the committed file
   (`JOURNAL_SOURCE = "snapshot"` in `src/config/journal.ts`); one commit flips it to `"api"` once the import is
   proven identical.
3. Main's failure rules stay and grow: unreachable API, malformed post, banned claim, fewer than 4 posts, or a drop
   below half fails the build and Vercel keeps the last good deploy. Main's env names stay (`BLOG_SYNC`,
   `BLOG_API_URL`, `BLOG_ALLOW_SHRINK`).
4. One pure adapter, `postToArticle`, turns a post into the rebuild's `Article`; ArticleTemplate, the hub, the
   sitemap, the sticky bar and every article guard keep reading `Article`s. No second article renderer.
5. The post gains eight nullable fields (`metaTitle`, `cardTitle`, `accent`, `lead`, `summary`, `answer`, `photo`,
   `related`), a constrained `theme`, and six node attributes; markers are `[^n]` typed in the text. The close, the
   D025 line, read time, share card, no-wrap phrases, bold lead-ins and breakout parts are derived, never stored.
6. Images: the head is a DS photo named by key, with its 7.1f share card; an uploaded cover is the fallback
   (founder question Q2); a talking guide with neither is refused (P19).
7. VideoEmbed becomes `ui/VideoEmbed` (a still until pressed, DS parts, no event); `frame-src` gains the two player
   hosts production already allows, by a reviewed checkout-freeze patch citing D057 item 1.
8. Guards in three layers: the prebuild validator (structure, claims, counts), the adapter in `next build`
   (vocabulary), and `npm run verify` on the committed snapshot (everything, editorial rules included).
9. The 20 guides are corrected per D058 in their modules first, exported into the snapshot in the dashboard's JSON,
   and the site renders from that file at Gate B; the backend imports the same file after Gate B.
10. A slug that is a redirect source (D041, D053) is dropped with a warning: the redirect wins.

## 1. What exists

### 1.1 Main's pipeline (PRs #20-#22)

| Piece | What it does | Where |
|---|---|---|
| Authoring | Writers draft at admin.kheelona.com → Blog; an admin publishes; publishing POSTs a Vercel Deploy Hook | main:CLAUDE.md:3-5 |
| Build script | `node tools/tokens/check-tokens.mjs && node tools/blog/sync.mjs && next build` | main:package.json:7 |
| Fetch | `GET ${BLOG_API_URL ?? https://api.kheelona.com/v1}/public/blog/posts`, 3 tries, 20 s timeout each, a 2, 4 and 6 s wait after each failure, reads `body.data.posts` | main:tools/blog/sync.mjs:26-29, :38-55 |
| Overrides | `BLOG_SYNC=off` (committed snapshot, no network), `BLOG_API_URL`, `BLOG_ALLOW_SHRINK=1` (one build) | main:tools/blog/sync.mjs:13-16, :31-36 |
| Validation | slug pattern, duplicates, title/description/theme/author present, ISO dates, updated ≥ published, pose of six, tint of three, hero string or null, sources a list, top-level blocks in an eight-node whitelist | main:tools/blog/validate.mjs:9-22, :25-66 |
| Shrink | fail when the last count was ≥ 4 and the new one is below half | main:tools/blog/validate.mjs:68-78; sync.mjs:72-74 |
| No-op writes | compares data with sorted keys, writes only on a change (jsonb reorders keys) | main:tools/blog/sync.mjs:76-88 (#21) |
| Snapshot | `src/lib/stories.data.json`, imported by `src/lib/stories.ts` | main:tools/blog/sync.mjs:25; main:src/lib/stories.ts:1, :79 |
| Post type | ProseMirror doc; text marks `bold`, `link`; `hardBreak`; headings 2 and 3; lists; blockquote; rule; image (src, alt, caption, width, height); videoEmbed (provider, videoId, title, caption) | main:src/lib/stories.ts:13-46 |
| Bylines | one of the people on main's `/team` or "Kheelona" for the company; `authorRef` throws on anything else | main:src/lib/stories.ts:53-56; main:CLAUDE.md:15-16 |
| Read time | derived, 200 words a minute, at least 1 | main:src/lib/stories.ts:108-120 |
| Related | an automatic ring over the theme-sorted journal: one back, two forward | main:src/lib/stories.ts:176-222 |
| Page | static (`dynamicParams = false`), cover through `next/image`, og:image on this domain through `/_next/image?url=…&w=1200&q=75` because the API answers noindex | main:src/app/(site)/stories/[slug]/page.tsx:38, :40-47, :180-190 |
| Body | `organisms/ArticleBody`: whitelisted nodes only, anything else renders nothing | main:src/components/organisms/ArticleBody.tsx:41-112 |
| Video | `molecules/VideoEmbed`: a still until pressed, youtube-nocookie or Vimeo `dnt=1`, thumbnails from i.ytimg.com | main:src/components/molecules/VideoEmbed.tsx:10-29 |
| Headers, images | `frame-src` gains the two player hosts; `remotePatterns` for the API's image path and `i.ytimg.com/vi/**` | main:src/lib/security-headers.ts:81-87, :171-178; main:next.config.ts:14-21 |
| Tests | the snapshot validates; bad posts and shrink refused | main:test/blog-sync.test.ts:10-31 |
| Voice law | enforced at publish by the backend: no em dashes, exclamation marks, contractions, vague link labels or bare URLs | main:CLAUDE.md:11-12 (the backend itself was not read) |

### 1.2 The live posts (the API, 2026-10-14)

- **22 posts**, the same data as main's snapshot; newest `published` and `updated` 2026-09-11, so none written since
  the dashboard went live (also [map §3](../qa/live-main-reconciliation-2026-10-14.md#3-the-journal-from-the-admin-dashboard-20-22)).
- **Sixteen fields on every post:** `slug`, `title`, `description`, `theme`, `author`, `published`, `updated`, `pose`,
  `tint`, `hero` (19 site paths `/stories/<slug>.jpg`, 3 null), `heroAlt`, `heroWidth`, `heroHeight` (1440 x 803 or
  null), `ageNote` (2 posts), `sources` (`{label, url}`, non-empty on 9 posts), `body`.
- **What the bodies use:** paragraph 187, heading 92 (level 2 only), text 360, the `link` mark only. No bold, list,
  blockquote, rule, image, video or hard break in any post. Sources are listed but never marked in the text.
- **Text:** straight apostrophes only; no contraction, em dash, exclamation mark, brace or bracket anywhere.
- **Themes:** six (Screen-free living, Talking together, How children grow, AI and childhood, Safety, Languages at
  home). **Bylines:** Ria Mangala Rewari 8, Apoorva Sahu 6, Aman Soni 4, Kashyap C.R 4; none "Kheelona".
- **The rebuild's banned list on them** (`findBanned`, test/guards/banned-phrases.data.ts:152-165): 16 hits in 11
  posts (the wake-word family in questions-parents-ask-about-ai-toys, "stays in your region" in
  ai-toys-and-indias-data-law, dead age ranges, US spellings); some may be negations. The live posts are not what the
  rebuild will publish (§9), but this is why the sync must not read them before the import.

### 1.3 What the rebuild's article needs

`Article` (src/content/types.ts:451-472) is rendered by ArticleTemplate (src/layouts/ArticleTemplate/ArticleTemplate.tsx:36-89):
ArticleHead (crumbs to the hub topic, the h1 with its accent, lead, byline with first-published date and read time,
the head photo as the LCP image), ArticleBody (the answer card first, titled and untitled parts, photos between parts,
the numbered sources last), then by `close` either RelatedGuides `related` and the journal close with the pre-order
button, or RelatedGuides `keep` with no button (B5), then BlogPosting and BreadcrumbList
(src/layouts/ArticleTemplate/article-page.ts:91-108). The registry is a typed record over the URL plan's 20 slugs
(src/content/en-IN/stories/articles/index.ts:37-58; src/content/en-IN/routes.ts:18-39); the hub holds slug lists
(src/content/en-IN/stories/hub.ts:26-65). The 20 modules use these blocks: paragraphs (with bold lead-ins, two "gut"
lines), h3 (2 guides), lists (bullets, steps; tips in 11, checks in 3), callouts (9), question groups (2 guides),
facts with a breakout part (3), one figure between parts, and the D025 line under the answer in all 7 talking guides
(AST scan, 2026-10-14).

## 2. Data flow

```
writer drafts ─► admin publishes ─► backend validates (voice law, B-list fields) ─► Deploy Hook ─► Vercel builds `main`
                                                                                                        │
  npm run build ─► prebuild (scripts/run-steps.mjs):                                                    ▼
    10-ds-checksums  ─►  15-journal-sync ─────────────────────────────►  20-compose-css  ─►  30-placeholders
                          │ mode = api?  GET /v1/public/blog/posts (3 x 20 s)                (scans src/, the
                          │              validate (structure, claims) ─ shrink ─ compare      snapshot included)
                          │              write posts.generated.json if the data changed
                          │ mode = snapshot?  validate the committed file, no network
                          ▼
  next build ─► src/content/en-IN/stories/journal.ts: posts ─► postToArticle ─► registry (slug → Article)
                   │ refuses unknown vocabulary (topic, byline, photo, icon); drops redirect slugs
                   ├─► /stories/[slug] (generateStaticParams, dynamicParams = false) ─► ArticleTemplate
                   ├─► /stories hub (topics, featured, rows) · sitemap (lastModified = updated) · sticky bar paths
                   └─► BlogPosting, BreadcrumbList, og:image
  postbuild ─► 10-placeholders-html ─► 20-journal-pages (one prerendered page per post, at least 4)
```

### 2.1 Where the journal comes from

| Run | `SITE_ENV` (src/config/env.ts) | Source | Network |
|---|---|---|---|
| `npm run verify` (local and CI, .github/workflows/verify.yml runs only this) | – (Vitest) | the committed snapshot | none |
| `npm run dev`, Storybook (predev steps) | development | the committed snapshot | none |
| `npm run verify:e2e` (local production build) | development | the committed snapshot | none |
| Gate B dry run (`KH_SITE_ENV=production`) | production | the committed snapshot while `JOURNAL_SOURCE = "snapshot"`; set `BLOG_SYNC=off` after the flip for an offline run | none |
| Beta (branch `beta`) | beta | the committed snapshot, always (beta shows what Gate B ships) | none |
| Production, before the flip | production | the committed snapshot (`JOURNAL_SOURCE = "snapshot"`) | none |
| Production, after the flip | production | the API, validated, written into the build's clone | 1 GET |
| By hand: refresh the committed file | any | `BLOG_SYNC=on node scripts/journal/sync-posts.mjs` | 1 GET |
| By hand: prove the import | any | `node scripts/journal/sync-posts.mjs --check` (compare, never write; exit 1 on any difference, per post and field) | 1 GET |

The mode, in order: `BLOG_SYNC=off` → snapshot; `BLOG_SYNC=on` → API; otherwise API only when
`resolveSiteEnv(process.env) === "production"` and `JOURNAL_SOURCE === "api"`. CI needs no change (no workflow edit,
which would need the token's workflow scope, open question G23).

### 2.2 The build step

- `scripts/steps/prebuild/15-journal-sync.mjs` spawns `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON
  scripts/journal/sync-posts.mjs`, the pattern of step 30 (scripts/steps/prebuild/30-placeholders.mjs:14-25). It sits
  after the DS check (10, which fails fast without the network) and before step 30, whose source scan then reads the
  fresh file. The runner needs no change (scripts/run-steps.mjs:20, :46-57); `package.json` does not change.
- `scripts/journal/sync-posts.mjs` ports main's fetch, retries, envelope, shrink rule and data compare
  (main:tools/blog/sync.mjs:38-88) and adds the mode, the `--check` flag, the post order (by slug) and the key order
  (the contract's, §3), so the committed file diffs cleanly whatever order the API returns.
- `src/lib/journal/validate.ts` is erasable-only TypeScript **with no imports** (the rule `src/config/env.ts` follows,
  architecture §15.2), so the Node script imports it by type stripping and Vitest and the adapter import the same file.
  The script passes in what it needs: the topic titles (`src/content/en-IN/stories/topics.ts` has no imports) and
  `findBanned` (`test/guards/banned-phrases.data.ts`, importable by Node: checked 2026-10-14, 51 entries).
- `src/config/journal.ts` (no imports): `JOURNAL_SOURCE`, `JOURNAL_API` (`https://api.kheelona.com/v1`) and
  `JOURNAL_IMAGES` (`https://api.kheelona.com/v1/public/blog/images/`), read by the script, `next.config.ts` (relative
  import, structure §2) and the adapter.

### 2.3 Failure rules

| Situation | Production with the API | Snapshot builds |
|---|---|---|
| API unreachable after 3 tries, a non-2xx answer, no `data.posts` list | build fails; Vercel keeps the last deploy; for an urgent code deploy the founder sets `BLOG_SYNC=off` in Vercel for one deploy (lessons §1: a variable applies to deployments created after it changes) | – |
| A post breaks a build rule (§8.2: structure, claims, retired offer terms, unknown vocabulary) | build fails; the log names the post and the rule | build fails (the committed file is held to the same rules) |
| Fewer than half the last count (last ≥ 4) | fails unless `BLOG_ALLOW_SHRINK=1` for one build (main's rule) | – |
| Zero posts, or fewer than 4 (every article offers three others) | always fails | always fails |
| A slug that is a redirect source | dropped from the journal with a warning (§10) | same |
| An editorial rule (§8.2) | warning in the log; the build goes on | same |
| Data unchanged | file untouched | – |
| A post did not become a page (postbuild 20) | fails | fails |

Vercel never commits what its build writes, so the committed file only moves when someone refreshes it by hand
(runbook: refresh, run `npm run verify`, commit, before every push to `main`) and in the flip commit (§9.5).

### 2.4 The snapshot file

- **Place and name:** `src/content/en-IN/stories/posts.generated.json`. It is content (structure §3.3: every word the
  site publishes) and generated (structure §2: `*.generated.*`, which `jscpd` already ignores), and never edited by
  hand. The placeholder scan reads it like any file under `src/`.
- **Shape:** `{ "generated": "GENERATED by scripts/journal/sync-posts.mjs from https://api.kheelona.com/v1/public/blog/posts; do not edit. Refresh: BLOG_SYNC=on node scripts/journal/sync-posts.mjs", "posts": [ … ] }`.
  The note says "the export of task 8b.2e" until the flip. No timestamp (it would rewrite the file on every run).
- **Tests read it:** `journal.ts` imports it (`resolveJsonModule`, tsconfig.json) and casts after validation, as main
  did (main:src/lib/stories.ts:79); every article guard runs on the adapted articles (§8.3).

## 3. The post contract

Today's fields are main's (main:src/lib/stories.ts:48-77); the additions are the backend list B1-B2 (§13). Every
addition is nullable (`related` may be empty), so a post written before the change still validates; the rebuild's defaults are in §4.

```ts
type Post = {
  slug: string;                 // ^[a-z0-9]+(-[a-z0-9]+)*$, unique; never a redirect source (§10)
  title: string;                // the h1 and the BlogPosting headline (the searched phrase, D054 item 16)
  description: string;          // meta description, ≤ 155 characters
  theme: "Screen time" | "Talking and language" | "AI toys and safety" | "Learning and play";  // topics.ts:14-35
  author: "Apoorva Sahu" | "Aman Soni" | "Kashyap C.R" | "Kheelona";                         // organization.ts:73-96
  published: string; updated: string;                    // YYYY-MM-DD, updated ≥ published
  pose: string; tint: string;                            // kept for the backend; the new design shows neither
  hero: string | null;                                   // an upload under JOURNAL_IMAGES, or null
  heroAlt: string; heroWidth: number | null; heroHeight: number | null;   // required with an upload
  ageNote: string | null;
  sources: { label: string; url: string }[];             // url https://
  body: { type: "doc"; content: Block[] };
  // additions (B1)
  metaTitle: string | null;     // the <title> as written, ≤ 60 characters, unique
  cardTitle: string | null;     // the hub card and other guides' related links
  accent: string | null;        // a phrase that occurs once in `title`, set in the hand face (one per headline)
  lead: string | null;          // the line under the h1
  summary: string | null;       // the hub card's line
  answer: { question: string; text: string } | null;     // question ends "?"; text 40-60 words
  photo: string | null;         // a DS image key the site publishes (§6)
  related: string[];            // [] or three distinct published slugs, not its own
};
type Block =
  | { type: "paragraph"; content?: Inline[] }
  | { type: "heading"; attrs: { level: 2 | 3; anchor?: string | null }; content?: Inline[] }        // anchor: kebab-case, h2 only (B2)
  | { type: "bulletList"; attrs?: { style?: "bullets" | "checks" | "tips" | "facts" }; content: ListItem[] }  // (B2)
  | { type: "orderedList"; content: ListItem[] }
  | { type: "blockquote"; attrs?: { style?: "callout" | "questions"; icon?: string | null }; content: Block[] } // (B2)
  | { type: "horizontalRule" }
  | { type: "image"; attrs: { src: string; alt: string; caption: string; width: number | null; height: number | null; photo?: string | null } } // photo (B2)
  | { type: "videoEmbed"; attrs: { provider: "youtube" | "vimeo"; videoId: string; title: string; caption: string } };
type ListItem = { type: "listItem"; attrs?: { icon?: string | null }; content: [{ type: "paragraph"; content?: Inline[] }] }; // icon (B2)
type Inline = { type: "text"; text: string; marks?: ({ type: "bold" } | { type: "link"; attrs: { href: string } })[] } | { type: "hardBreak" };
```

Text in `answer` and the body may carry the rebuild's tokens `[^n]` (source marker n), `{price:token|balance|headline|full|mrp|launch}`
and `{delivery}`; no other brace or bracket, and no typed ₹ (prices follow the live offer, ADR-005). The rich-text parser
has no escape (an unmatched `}` or `]` throws, src/lib/content/rich-text.ts:105-119), so this rule is what lets post
text pass through it untouched. Every other field is plain text.

## 4. Field map: a post to an `Article` (question 2)

"Glance rows" are the copy pages' "At a glance" table (for example wiki/site/pages/story-what-to-look-for-in-a-safe-ai-toy.md):
Title → `metaTitle`; Meta description → `description`; H1 → `title` + `accent`; Byline line → `author`, `published`,
derived read time; CTA → the close, derived from the topic; In-text product link → a body link.

| `Article` field (types.ts:451-472) | The post carries | Derived | New field | Notes |
|---|---|---|---|---|
| `slug` | `slug` | | | |
| `meta.title` | | `${title} · Kheelona` when ≤ 60, else `title` | `metaTitle` | 16 of the 20 have a meta title other than their card title, and 11 an h1 other than it (AST scan), so both fields are needed to keep them |
| `meta.description` | `description` | | | ≤ 155, unique |
| `meta.og` (image, alt) | | from `photo`: `/og/<key>.jpg` and the photo's alt; from an upload: §6 | | 7.1f's cards kept (share-cards.test.ts:32-56) |
| `card.title` | | `title` | `cardTitle` | the related-guide label too (article-page.ts:50-58) |
| `card.summary` | | `lead`, else `description` | `summary` | equal to the lead in 16 of 20 guides |
| `related` | | the ring (§8.2 row 19) fills what is missing | `related` | 7.1d's curated ring goes in the field (D057 item 1) |
| `published`, `updated` | `published`, `updated` | | | the import keeps the given dates (B5) |
| `head.title` | `title` | `{nowrap:…}` on "N-year-old" compounds; `{hand:…}` around `accent` | `accent` | the 20 h1s each carry one accent |
| `head.lead` | | | `lead` | all 20 have one |
| `head.author` | `author` | "Kheelona" shows as "The Kheelona team" (`TEAM_BYLINE`, organization.ts:96) | | BlogPosting: a founder is their Person, anyone else the Organization (blog-posting.ts:36-41) |
| `head.readMinutes` | | words of the answer and the body at 200 a minute, rounded, at least 1 (main:src/lib/stories.ts:116-120) | | stored 2-5 today; derivation may move 3 guides by a minute (should-kids-use-ai, talking-toys-and-late-talkers, the-gentle-way-off-the-phone, by the scratch count); for the Gate B list |
| `head.image` | `hero` (fallback) | | `photo` | §6 |
| `answer.question`, `answer.answer` | | | `answer` | 20 of 20 have one; the answer-first block is architecture §9.5 |
| `answer.detail` | | the D025 line for the talking topic, held once in `topics.ts` | | all 7 talking guides carry it today, no other guide does |
| `body` | `body` | §5 | node attributes (B2) | |
| `sources` | `sources` (`label` → `citation`, `url` → `href`) | | | `href` must be https (types.ts:445-448) |
| in-text markers | | | none: `[^n]` typed in the text | D026 |
| `close` | | `keep` for the talking topic, `journal` otherwise | | today's 7 `keep` guides are exactly the talking topic; D054 item 16, B5 |
| hub topic | `theme` | the topic whose title it is | constrained values (B1) | the six live themes are refused (§9) |
| hub featured and order | | `hub.ts` as overrides; a post it does not list joins its topic, newest first | | rebuild-side curation; a featured slug that left or has no photo is skipped with a warning |
| plain close art | | `PLAIN_CLOSE_ART` (articles/index.ts:142-147) stays a rebuild-side slug list | | a missing slug is ignored |
| (no FAQ list on articles) | | the answer card and question groups are the article's FAQ-like parts; JSON-LD stays BlogPosting and BreadcrumbList (architecture §9.2) | | |

## 5. Body map (question 2)

### 5.1 Block nodes

| Post node | Article block | Markup and DS classes (ProseBlocks.tsx, ArticleBody.tsx) | Needs |
|---|---|---|---|
| nodes before the first h2 | an untitled `ArticlePart` | `div.ks-part` | – |
| `heading` 2 | starts an `ArticlePart` (`title`; `id` = `anchor`) | `section.ks-part` named by `h2.kh-title` | `anchor` (B2, optional; one use: `#brain-development`, D041) |
| `horizontalRule` | ends the part; what follows is an untitled part | `div.ks-part` | – (the 20 guides have no untitled part after the first) |
| `heading` 3 | `h3` | `h3.kh-subtitle` | – |
| `paragraph` | `p`; a leading bold run is `lead`; all bold is `variant: "gut"`; empty is skipped; a hard break splits it | `p`, `strong`, `p.ks-gut` (weight 800, article-body.css:138-140) | – |
| `bulletList` | `list` `bullets` / `checks` / `tips` | `ul`; `ul.ks-checks` with the check icon; `ul.kh-card.kh-card--tint.kh-tone-sun.ks-tips` with an icon per item (ProseBlocks.tsx:49-77) | `style`, item `icon` (B2); a tip without an icon is refused, as today (ProseBlocks.tsx:52) |
| `bulletList` style `facts` | `facts` (item icon, bold title, body); its part becomes `breakout`; an `image` with a DS key right after it is its figure | `TrustList` facts, `.ks-facts-list`, `.ks-belly` (ProseBlocks.tsx:125-139) | `style`, item `icon` (B2) |
| `orderedList` | `list` `steps` | `ol` | – |
| `listItem` | one item; a leading bold run is its lead | `li` | one paragraph per item (B2: no nested list) |
| `blockquote` style `callout` (the default) | `callout` (icon, lead, text) | `Card` tint Sunshine `.ks-try` with `ContentIcon` | `style`, `icon` (B2) |
| `blockquote` style `questions` | `questions`: each h3 is a question, the paragraphs after it its answer | `div.ks-questions` | `style` (B2); headings allowed inside a blockquote |
| `image` with `photo` | `figure` with the DS image (alt from the photo table); between parts when it is the last node before an h2, else inside the part; `wide` when its ratio is 1.6 or more | `Photo` (`figure.kh-photo`, `--wide`) | `photo` (B2) |
| `image` upload | `figure` with a remote `ImageRef` (§6) | `Photo` | `width`, `height` required |
| `videoEmbed` | new block `{ kind: "video", provider, videoId, title, caption }` | `ui/VideoEmbed` (§7) | – |

Why `questions` needs an explicit container: answers run to two or four paragraphs and a plain paragraph follows the
group in the safe-AI-toy guide (AST scan), so "an h3 and the paragraphs after it" cannot tell where the group ends.

### 5.2 Inline

| Post inline | Becomes (`RichTextString`, rendered by `ui/RichText`) |
|---|---|
| text | itself; `[^n]`, `{price:…}` and `{delivery}` pass through as tokens; any other brace or bracket is refused (§3) |
| `bold` | a paragraph's or item's leading run → `lead`; a whole paragraph → `gut`; elsewhere → plain text with a warning (the inline syntax has no bold) |
| `link` | `[label](href)`: a site path renders through `next/link`, https as `<a>` (RichText); the parser's address rules apply (rich-text.ts:219-237) |
| `hardBreak` | splits a paragraph; a space anywhere else |
| (derived) | `{nowrap:…}` on every "N-year-old" compound with its trailing comma or `’s`, as the approved heads and bodies wrap them; `{hand:…}` from `accent`, h1 only |

### 5.3 What the approved design shows that a post cannot express today

| In the approved design | Resolution |
|---|---|
| Three titles: meta (searched phrase), card, h1 | `metaTitle`, `cardTitle` (B1) |
| The hand-lettered accent in the h1 | `accent` (B1) |
| The lead and the hub card's summary | `lead`, `summary` (B1) |
| The answer card (question, 40-60 words) | `answer` (B1) |
| The D025 line under the answer on talking guides | derived from the topic |
| Source markers linking to numbered notes (D026) | `[^n]` in the text |
| DS head photo and its 1200 x 630 card | `photo` (B1) |
| The curated related ring (7.1d) | `related` (B1) |
| No pitch on talking guides (keep close, no product link) | derived from the topic; a talking post linking `/products/*` or the store is refused |
| Tips and checks with icons, facts with icons and a breakout, the "Try this" callout, question groups | `bulletList.style`, `listItem.icon`, `blockquote.style` and `.icon` (B2) |
| A DS photo inside the body; the belly photo in the facts list | `image.photo` (B2) |
| A fragment on a part (`#brain-development`) | `heading.anchor` (B2) |
| No-wrap phrases, bold lead-ins, the gut line | derived |
| Facts shared with other pages (`RETENTION_LINE` from policies.ts:50, the help line from seller.ts, the age-3 sentence) | literal text in the post; a verify guard holds each to the current value (§8.2 row 24) |

### 5.4 What a post carries that the new design does not show

`pose` and `tint` (main's mascot box and card tint, main:src/app/(site)/stories/[slug]/page.tsx:215-247), the theme
eyebrow (the crumbs name the topic instead), `ageNote`'s "Before you pre-order" box (main:…/page.tsx:197-213; mapped
to a `disclaimer` line at the end of the body; none of the 20 guides uses it), and main's "More reads like this" box
and Kheelu line: none is in the approved article design (D046).

## 6. Images (question 3)

**The rule: a post names its head photo by DS key; without a key its uploaded cover shows; without either it has no
head photo, and a talking guide is refused.** Q2 asks the founder whether uploads may show at all.

| Image | DS key (`photo`) | Upload (`hero`) | Neither |
|---|---|---|---|
| Head (ArticleHead, the LCP image) | the static `@ds` import from `src/content/en-IN/stories/photos.ts`; layout by its shape (portrait 4:5, wide 16:9) as now | `next/image` of the exact API URL; `heroWidth`, `heroHeight`, `heroAlt` required | the words alone (ArticleHead supports it) |
| Share card (og:image, Twitter, BlogPosting image) | `/og/<key>.jpg`, 1200 x 630, cut by `scripts/assets/build-og.mjs` (STORY_CARDS, :49-63) | `/_next/image?url=<encoded>&w=1200&q=75` at the cover's own size, as main does for uploads (main:src/app/(site)/stories/[slug]/page.tsx:40-47); `pageMeta` takes an optional size instead of always 1200 x 630 (src/lib/seo/metadata.ts:33, :93) | `DEFAULT_OG` (`/og.png`); refused for the talking topic, where it would be the product shot (P19, share-cards.test.ts:45-47) |
| Alt | the photo table's (one alt per DS image by construction; the 13 head photos have one alt each today) | `heroAlt` | – |
| Hub featured card | the head photo | the cover | the hub skips the featured card |
| Body figure | `image.photo` | `image.src` with its size | – |
| Video still | – | – | YouTube: `https://i.ytimg.com/vi/<id>/hqdefault.jpg` through `next/image`; Vimeo: none |

- **Keys.** `photos.ts` lists the 13 head photos that have cards today (public/og/, assets.md §3) and the DS images the
  bodies use (`advik-04-floor-train`, `kheelu-belly-module`). A new head photo is a `STORY_CARDS` line, a `photos.ts`
  row and a regenerated card (an assets task); an unknown key fails the build.
- **`next.config.ts`:** `images.remotePatterns: [new URL("https://api.kheelona.com/v1/public/blog/images/**"), new URL("https://i.ytimg.com/vi/**")]`
  (main:next.config.ts:18-21). A `URL` pattern keeps its empty `search`, so no query string passes
  (next/dist/server/config.js:584-603; image.md:589). Add `maximumRedirects: 0`: the optimiser follows redirects
  without checking `remotePatterns` again (image.md:611, :820-832). `qualities` stays Next 16's default `[75]`
  (image.md:712), which the share-card URL uses. The two URLs come from `src/config/journal.ts`.
- **No uploads exist yet** (all 22 live covers are site paths or null), so the API's image path is untested; the
  first upload is checked on a local production build before any post with one goes live (8b.2g).
- **Main's covers** (`/stories/<slug>.jpg`) are not in the rebuild (deleted with the legacy public files); a site-path
  `hero` is refused. None of the 20 exported guides has one.

## 7. VideoEmbed (question 4)

- **Where:** `src/components/ui/VideoEmbed/` (a primitive the article body renders, like `Photo`): `VideoEmbed.tsx`
  (server: `figure`, the still through `Photo`'s frame at 16:9, the caption as `kh-caption`), `VideoEmbed.client.tsx`
  (the island: the play `IconButton` with `ICON_PLAY`, as FilmsStrip does, FilmsStrip.client.tsx:6, :170; it never
  imports `Icon`, `Button` or `PreorderButton`, test/guards/client-icons.test.ts), `embed.ts` (the player and still URLs
  built from provider and id only, ported from main:src/components/molecules/VideoEmbed.tsx:10-20), its CSS (`ks-video`,
  DS tokens only), test and story. A new `video` block kind in `ProseBlock` (types.ts:414-423) and one `case` in
  `ProseBlocks`.
- **Behaviour:** nothing from YouTube or Vimeo loads before the press: the still is fetched by our optimiser, so the
  reader's browser contacts neither (main's reasoning: ~500 KB and third-party connections at rest,
  main:…/VideoEmbed.tsx:22-29). On press, the iframe (`https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0&modestbranding=1`
  or `https://player.vimeo.com/video/<id>?autoplay=1&dnt=1`, `allow="autoplay; encrypted-media; picture-in-picture;
  fullscreen"`, `referrerPolicy="strict-origin-when-cross-origin"`) replaces the button and takes focus. The button's
  name is "Play video: <title>"; `title` is required (§8.2). No `<video>` element; no tracking event (none exists for
  the films either, src/lib/tracking/events.ts).
- **Motion (architecture §11.3):** no new hook and no animation of its own; the DS IconButton's own tap feedback only;
  nothing autoplays before a press; not inside `data-reveal` (articles have none); reduced motion changes nothing.
  `motion-properties` is unaffected.
- **Performance:** the still is lazy and never the LCP; the island's JavaScript loads only on a page with a video.
- **`frame-src`, a reviewed checkout-freeze patch.** `src/lib/security-headers.ts` is frozen
  (test/guards/checkout-freeze.test.ts:34-42) and already carries D054 item 9's reviewed diff. The patch file
  `test/guards/fixtures/authorised-diffs/src__lib__security-headers.ts.patch` is regenerated with
  `git diff archive/pre-reset-2026-10-10 -- src/lib/security-headers.ts`, its header adding: "D057 item 1 (founder,
  2026-10-14): the journal comes from the admin dashboard, whose posts may embed YouTube or Vimeo videos. `frame-src`
  gains `https://www.youtube-nocookie.com` and `https://player.vimeo.com`, exact origins, frame-src only, as production
  has served since 2026-10-13 (origin/main src/lib/security-headers.ts:81-87, :177). The phase stays report. Nothing
  else changes." The diff adds the `videoPlayers` source and its use in `frame-src` (src/lib/security-headers.ts:180)
  and nothing else. `test/security-headers.test.ts` asserts both hosts in `frame-src` and in no other directive.

## 8. Guards (question 5)

### 8.1 Three layers

1. **Prebuild** (`validate.ts` through `sync-posts.mjs`): what would break rendering, the law or the count. Fails the
   build in every mode.
2. **The adapter in `next build`** (`postToArticle`, `journal.ts`): the site's vocabulary (topic, byline, photo, icon,
   the talking rules). Throws, so the build fails with the post and the reason, the way the rebuild's article helpers
   already throw (article-page.ts:25-29, :39-47).
3. **`npm run verify`** on the committed snapshot: every rule, the editorial ones included, as errors.

The backend should check at publish what writers can fix in the editor (B1-B3), so a failed deploy is the exception.

### 8.2 Rule by rule

| # | Rule | Prebuild | Adapter | Build warning | Verify | Backend | From |
|---|---|---|---|---|---|---|---|
| 1 | A list; at least 4 posts; no drop below half (last ≥ 4) without `BLOG_ALLOW_SHRINK=1` | error | | | error | | main validate.mjs:68-78 |
| 2 | Slug pattern; unique | error | | | error | yes | main validate.mjs:36-39 |
| 3 | Title, description, theme, author present; ISO dates; updated ≥ published | error | | | error | yes | main validate.mjs:40-47 |
| 4 | Nodes, marks and attributes of the contract (§3); heading level 2 or 3; one paragraph per list item; blockquote content per style | error | | | error | B2 | main validate.mjs:13-22, 56-63 |
| 5 | Text tokens only `[^n]`, `{price:…}`, `{delivery}`; no typed ₹ | error | | | error | optional | rich-text.ts:105-119; "never types a rupee amount" (articles.test.ts:173) |
| 6 | Markers point at a source (n ≤ sources) | error | | | error | | approved-articles.test.tsx:83 |
| 7 | Every source cited by a marker (D026) | | | warning | error | | approved-articles.test.tsx:83 |
| 8 | Links: a site path or https, mailto, tel | error | | | error | "bare URL" | rich-text.ts:219-237 |
| 9 | Internal links land on a route, not a redirect or 404 | | | warning | error | | test/internal-links.test.ts |
| 10 | Theme is a topic title | error | error | | error | B1 enum | articles.test.ts:167 |
| 11 | Byline from the list (Ria Mangala Rewari refused: ../legacy/settled-decisions.md:126) | | error | | error | B4 | blog-posting.ts:36-41 |
| 12 | Photo key known (a head key has a card); icon names are DS icons | | error | | error | B1, B2 enums | share-cards.test.ts:36-43; ProseBlocks.tsx:49-53 |
| 13 | An upload: under `JOURNAL_IMAGES`, with width, height and alt; no site-path cover | error | | | error | yes | |
| 14 | Video: provider, an 11-character YouTube id or a numeric Vimeo id, a title | error | | | error | yes | |
| 15 | Banned claims and retired offer terms (`findBanned` kinds `claim`, `offer`) over every text field | error | | | error | optional (same list) | test/guards/banned-phrases.data.ts |
| 16 | en-IN spelling (kind `spelling`) | | | warning | error | | banned-phrases (N24) |
| 17 | A slug that is a redirect source | | drop | warning | error | unpublish | §10 |
| 18 | Talking topic: no link to `/products/*` or the store; a head photo or cover (P19) | | error | | error | | approved-articles.test.tsx:101; share-cards.test.ts:45 |
| 19 | Related: [] or three published slugs; missing ones filled from the ring | | fills | warning | error (exactly 3 valid; every post offered by ≥ 3) | B1 | articles.test.ts:100-113; internal-links |
| 20 | No head photo shared with a guide it links to or that links to it | | | warning | error | | screen-time-articles.test.tsx:494-501 |
| 21 | One alt per DS image | | by construction (photos.ts) | | photos.ts test | | screen-time-articles.test.tsx:482-491 |
| 22 | Answer present; 40-60 words; question ends "?" | | | warning | error | B1 | test/guards/answer-length.test.ts |
| 23 | Meta title ≤ 60, description ≤ 155, both unique; accent occurs once in the title | | | warning (a bad accent is left out) | error | B1 | articles.test.ts:140; test/metadata-lengths.test.ts |
| 24 | Fact lines current: a post that prints the retention line, the help line or the age-3 sentence prints today's | | | | error | | approved-articles.test.tsx:122-133 (replaced) |
| 25 | Every topic has a post; hub featured slugs present with a photo | | skips | warning | error | | hub.ts:102-114 |
| 26 | One prerendered `/stories/<slug>` page per post | postbuild error | | | | | new |
| 27 | Placeholders | the brace rule makes `{ph:` impossible in a post; step 30 still scans | | | | | ADR-004 |
| 28 | Age band and internal material in the rendered page | | | | e2e `content-integrity` (unchanged) | | architecture §14 |

### 8.3 What happens to the existing article tests

The round-trip property is what keeps them honest: for every one of the 20 modules,
`postToArticle(articleToPost(module))` equals the module except the listed derivations (read time, no-wrap spans).
Then a test that read a module reads the same `Article` from the registry.

| Test | After the switch |
|---|---|
| `src/content/en-IN/stories/articles/index.test.ts`, `articles.test.ts`, `share-cards.test.ts`, `hub.test.ts`, `routes.test.ts`, `sticky-bar-paths.test.ts`, the stories page tests | over the registry built from the snapshot; `articles.test.ts`' stub-era `SWAPS` and `LEGACY_RING` go (tasks.md wave 8 follow-ups) |
| `screen-time-articles.test.tsx`, `talking-articles.test.tsx`, `ai-safety-and-learning.test.tsx` (each guide against its copy page, D013) | against frozen fixtures, `test/fixtures/journal/approved/<slug>.json` (the export the founder signs at Gate B), because the dashboard now owns the words; their journal-wide rules (rows 20, 21) move to a snapshot test |
| `approved-articles.test.tsx` (the three mockup articles' markup, markers, the D025 placement) | markup on the fixtures; markers on the snapshot; "retention line from policies.ts" replaced by row 24 |
| `ArticleTemplate.test.tsx`, `test/scalability-article.test.tsx` | fixture posts through the adapter (one per block kind, an upload, a video, a talking guide): a new story needs only content |
| `test/internal-links.test.ts`, `test/metadata-lengths.test.ts`, `test/guards/answer-length.test.ts`, `test/machine-files.test.ts` | read articles from the registry, not article modules by path |
| `test/guards/banned-phrases.test.ts` (item 4, strings in `src/content/**`) | also every text field of the snapshot |
| `test/guards/generated-icons.test.ts` (the cards) | derives the card list from `photos.ts` |
| `test/e2e/support/routes.ts`, `test/e2e-harness.test.ts` | `ARTICLE_SLUGS` and each close from the snapshot and `topics.ts` (Playwright can read JSON) |
| e2e visual and text parity of the three approved article pages | hold while the snapshot equals the fixtures; once a writer edits one of them, the template's proof is the fixture tests (a main-session ruling at the switch) |
| main's `test/blog-sync.test.ts` | its cases ported to `test/journal-sync.test.ts` (main:test/blog-sync.test.ts:11-31) |

### 8.4 The backend's voice law and the rebuild's copy

The backend refuses em dashes, exclamation marks, contractions, vague link labels and bare URLs at publish
(main:CLAUDE.md:11-12). That is the legacy site's hard gate (../legacy/memory-summary.md:252). The rebuild's copy follows
the positioning and the DS writing guide, which allows one exclamation mark a page (design-system/project/01-writing.md:21)
and itself writes "don't" and "can't" (:14, :33), and the founder approved the guides with contractions (D046, D015).

| Rule | The 20 guides (scratch count, 2026-10-14) | Effect |
|---|---|---|
| Em dashes | none | fits |
| Exclamation marks | 2, both inside a child's quoted words (how-children-learn-by-talking.ts:86 "It’s a moon!"; does-a-three-year-old-need-an-ai-tutor.ts:64 "A star!") | refused under today's law |
| Contractions | about 90 (can’t 22, you’re 14, doesn’t 13, don’t 13, it’s 10, isn’t 4, others), and `RETENTION_LINE` itself ("they’re", policies.ts:50) | refused under today's law |
| Vague link labels | none (labels are the linked page's name) | fits |
| Bare URLs | none in the text (the notes print addresses from the `sources` field, D026) | fits |

So the import of the 20 is refused unless the law changes or the guides change (Q1). The rebuild does not enforce the
voice law itself: the backend does at publish, and the rebuild's own rules (banned phrases, en-IN spelling, the DS
mechanics) stay as they are. Unknown: whether the backend's contraction check reads the curly apostrophe (’) the
rebuild uses (question to Aman, §13).

## 9. Migration of the 20 guides (question 6)

### 9.1 Order of work

| Step | Who | When | Result |
|---|---|---|---|
| 1. Correct the 20 per D058 (§9.2), the voice per Q1, bylines per D054 item 14 | copywriter fix mode, CMO, builder (8b.2a) | now, with 8b.1 | copy pages and modules corrected; deviation rows for the changed approved lines |
| 2. Export the modules into the snapshot; the site reads it; the modules go | builder (8b.2e) | after 8b.2a and 8b.2d | `posts.generated.json` is the journal; beta and Gate B show exactly it |
| 3. Backend changes, then a dry run of the file through the publish validator (no publish) | Aman (8b.2f) | the changes from now; the dry run after step 2; both before Gate B | the B-list done; zero refusals |
| 4. The founder signs the changed lines (D015) | founder | Gate B | the readiness pack lists them |
| 5. Merge to `main` | main session | Gate B | production builds from the committed file (`JOURNAL_SOURCE = "snapshot"`); the dashboard is not read |
| 6. Import: upsert the 20 by slug, dates kept, published; unpublish the two main-only posts | Aman (8b.2g) | after Gate B | the dashboard holds the corrected guides |
| 7. `node scripts/journal/sync-posts.mjs --check` exits 0 | main session | after step 6 | the API returns the file unchanged; `--check` also lists any post the API has and the file lacks (one written on the live site since the export), and each is brought to the contract (theme, byline, photo) in the dashboard before the flip, or the first synced build refuses it |
| 8. The flip: `JOURNAL_SOURCE = "api"`, one commit, pushed to `main` | main session, founder's OK | after step 7 | writers publish again |

Between steps 5 and 8 a publish still triggers a build, which still reads the committed file: nothing breaks and
nothing new shows (a publishing pause, Q3). Before Gate B the live site keeps main's journal unchanged; a post a writer
publishes there before Gate B is not in the export, so it leaves the site at the merge and comes back at the flip
(step 7).

### 9.2 The D058 corrections still in the guides

From the [map §2](../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded) and a grep
of the modules (2026-10-14):

| Guide | Lines | Withdrawn claim |
|---|---|---|
| what-to-look-for-in-a-safe-ai-toy.ts | :142 | "after about a minute of quiet" (D018 → "a couple of minutes") |
| | :147 | "on servers in India"; providers keep nothing and never train (D058 items 1, 6) |
| | :152 | `RETENTION_LINE`: "in one tap" (policies.ts:50; 8b.1 rewords it) |
| | :158 | "a curated, closed content library", "an age-graded safety layer" |
| | :162 | "We attack our own safety layer before every release" |
| should-kids-use-ai.ts | :150, :155, :157, :162 | about a minute; servers in India; `RETENTION_LINE`; closed library and age-graded layer |
| questions-parents-ask-about-ai-toys.ts | :53, :101, :117 | about a minute |
| | :108, :109 | servers in India; `RETENTION_LINE` |
| | :136 | closed library and age-graded layer |
| ai-toys-and-indias-data-law.ts | :157, :159 | servers in India; `RETENTION_LINE` |

Only these four guides print `RETENTION_LINE`; once exported, the line is literal text in the post and
row 24 of §8.2 keeps it equal to policies.ts.

### 9.3 The export

- **Format:** the snapshot itself: the dashboard's post JSON (§3), one object per guide, sorted by slug. If Aman's
  import tool prefers one file per post, `node scripts/journal/sync-posts.mjs --split <dir>` writes `<slug>.json` into
  a local folder (never committed).
- **Mapping back** (`articleToPost`, `src/lib/journal/from-article.ts`, deleted with the modules): the h1 without
  tokens → `title`, its `{hand:}` phrase → `accent`; `metaTitle`, `cardTitle` (null when equal to the title), `lead`,
  `summary` (null when equal to the lead), `description`; the topic's title → `theme`; `TEAM_BYLINE` → "Kheelona";
  the head photo → `photo`, `hero` null, `heroAlt` the photo's alt; `answer`; `related`; sources; dates; blocks → nodes
  per §5 (a part title → h2 with `anchor`; tips, checks and facts → `bulletList` styles with item icons; callouts and
  question groups → `blockquote` styles; the body figure → `image` with `photo`); `pose` and `tint` copied from the live
  post of the same slug (so the post still passes main's validator, main:tools/blog/validate.mjs:48-51).
- **Proof:** the round trip (§8.3) on all 20, then a build before and after the switch with the prerendered HTML of
  every `/stories/*` page, the hub, the sitemap and `llms.txt` compared; only the listed derivations may differ.

### 9.4 Bylines

The rewrites carry "The Kheelona team" on 13 guides, Apoorva Sahu on 4 and Aman Soni on 3 (D054 item 14, each person
only if they read and own the page before Gate B). The dashboard's company byline is "Kheelona"
(main:src/lib/stories.ts:53-56), shown as "The Kheelona team". The live posts' 8 bylines for Ria Mangala Rewari go:
the founder took her off the site entirely on 2026-10-04 (../legacy/settled-decisions.md:126; ../product/facts.md:304-310),
the rebuild's `/team` does not list her, and the build refuses her byline. The backend removes her from the author list
(B4). Kashyap C.R's 3 bylines among the 20 (screen time by age, tantrums, the gentle way) become the team's too; he stays a valid byline (organization.ts:87).

### 9.5 Who publishes, and what the site shows until then

An admin (Aman) runs the import after the founder's Gate B OK; writers do not touch the 20 before the flip. Until the
flip the site shows the committed snapshot, which is the export the founder signed. The flip commit refreshes nothing
by hand: the first production build after it syncs, and its log reads "20 posts (unchanged)".

## 10. Slugs and redirects (question 7)

`screen-time-rules-parents-swear-by` (308 to `/stories#screen-time`, D053) and
`brain-development-toys-for-a-2-year-old` (308 to the 3-year-old guide, D041) are redirects (src/config/redirects.ts:151-152,
:158), and so is `why-three-to-six-matters-most` (:33-34). Next checks redirects before pages and `public/`
(redirects.md:39), so a published post at one of those slugs could never be seen; but it would still be prerendered,
listed in the sitemap and the hub, and offered in related rings.

- **Rule: the redirect wins.** The adapter drops every post whose slug is the source of a plain `/stories/<slug>`
  redirect, read from `REDIRECTS` (one table, never retyped), with a build warning naming the post; the verify suite
  fails on it so it gets unpublished. Not an allow-list: that would make every new post a code change.
- The import unpublishes the two (B5). The shrink rule counts posts before the drop.
- A slug that disappears from the API (unpublished or renamed) is listed by the sync as a warning ("add a redirect if
  renamed"); a mass loss is the shrink rule.

## 11. Merging `origin/main` (task 8b.3, question 8)

`git merge-tree` (map §4) and a `git merge-file` of `next.config.ts` (scratch, 2026-10-14) give:

| Main's file (journal commits) | Merge state | Resolution |
|---|---|---|
| `tools/blog/sync.mjs`, `tools/blog/validate.mjs` | clean adds | `git rm` in the merge commit: ported to `scripts/journal/sync-posts.mjs` and `src/lib/journal/validate.ts` |
| `src/lib/stories.data.json` | clean add | `git rm`: the snapshot is `src/content/en-IN/stories/posts.generated.json` |
| `src/lib/stories.ts`, `src/lib/stories.test.ts` | modify/delete | stay deleted: the type → `src/lib/journal/post.ts`, read time and the ring → `src/lib/journal/` |
| `test/blog-sync.test.ts` | clean add | `git rm`: replaced by `test/journal-sync.test.ts` |
| `src/components/organisms/ArticleBody.{tsx,test.tsx,stories.tsx}` | clean adds | `git rm`: `sections/ArticleBody` renders adapted posts |
| `src/components/molecules/VideoEmbed.{tsx,test.tsx,stories.tsx}` | location conflict | `git rm`: ported to `src/components/ui/VideoEmbed/` |
| `src/app/(site)/stories/[slug]/page.tsx` | content conflict | ours |
| `src/lib/security-headers.ts` | content conflict | ours (with 8b.2c's `frame-src`, byte-equal to the reviewed patch) |
| `next.config.ts` | **merges cleanly today**: main's `remotePatterns` hunk would land in ours unseen | once 8b.2b adds its own block at the same place it conflicts; resolve to ours, then check the file equals ours |
| `package.json` | content conflict | ours (main's build line goes; prebuild step 15 runs the sync) |
| `CLAUDE.md` | content conflict | ours; the journal facts live on this page |
| `test/internal-links.test.ts` | content conflict | ours |
| `src/lib/seo.ts` | modify/delete | stays deleted |
| `RichParagraph.*`, `src/lib/stories-expansion.ts` | deleted on both sides | clean |
| `public/stories/*.jpg` | unchanged on main, deleted here | stay deleted |

After the merge: `git diff HEAD^1 --stat` names none of main's journal files; `npm run verify` (checkout-freeze
included), `npm run build` and a beta build green. Main may gain more journal commits before the merge: re-run
`git merge-tree` against the then `origin/main` first.

## 12. Tasks for the builder

Same format as [tasks](tasks.md#how-to-read-a-task) (every task: stage by name, `npm run verify` green, the test-file
grep rule, catalogue rows in the same commit). Waves: **i** = 8b.2a, 8b.2b, 8b.2c in parallel (and with 8b.1);
**ii** = 8b.2d; **iii** = 8b.2e; then 8b.3, 8b.2f with Aman, 7.2, 7.3, 8b.2g.

### 8b.2a The 20 guides corrected per D058 (copywriter fix mode, CMO, builder; risk high; wave i)

- **Owns:** `wiki/site/pages/story-*.md` (20); `src/content/en-IN/stories/articles/<slug>.ts` (20); the expectation
  lines of the four article test files where the words change.
- **Inputs:** D058; §9.2; map §2; D054 item 14; the founder's answer to Q1; 8b.1's `RETENTION_LINE`.
- **Acceptance:** none of §9.2's claims in any guide, D058's wording where the guide speaks of the subject; the D058
  banned entries (8b.1) green on all 20; if Q1 = B, no contraction and no "!" in the 20; copy pages equal modules (the
  existing parity tests); CMO sign-off; a deviation row per changed approved line for the Gate B pack.
- **Test:** the four article test files; banned-phrases; targeted e2e on the four claim-bearing guides.

### 8b.2b The sync, its validator and the source switch (builder; risk high; wave i)

- **Owns:** `scripts/journal/sync-posts.mjs`; `src/lib/journal/{post,validate}.ts` and tests; `src/config/journal.ts`;
  `scripts/steps/prebuild/15-journal-sync.mjs`; `scripts/steps/postbuild/20-journal-pages.mjs`;
  `test/journal-sync.test.ts`; `test/guards/build-steps.test.ts` (pins the two steps and their order, :29-34, :53-55);
  `next.config.ts` (`images.remotePatterns`, `maximumRedirects: 0`) and `test/guards/next-config.test.ts`;
  `test/fixtures/journal/posts.fixture.json`; the artifacts.md row for the fixture.
- **Acceptance:** main's behaviours ported with their cases (3 tries, 20 s, back-off, `data.posts`, data compare,
  shrink 22 → 0 and 22 → 10 refused, 22 → 11 and 22 → 25 accepted); §2.1's mode table proven for every row (no network
  in verify, dev, e2e, beta or production before the flip); §2.3's rows each proven red; `--check` and `--split`;
  §8.2's prebuild rows each red on a planted post, the message naming post and rule; `validate.ts` has no import
  (a test, like env.ts's); the postbuild step red on a planted missing page; exactly the two remote patterns, empty
  search; a `KH_SITE_ENV=beta` build green; no `package.json` change.
- **Risk:** high (every deploy runs it). **Test:** as above; `npm run verify:e2e` once.

### 8b.2c VideoEmbed, the frame-src patch and two content types (builder; risk high, a frozen file; wave i)

- **Owns:** `src/components/ui/VideoEmbed/` (all files); `src/components/sections/ArticleBody/ProseBlocks.tsx`,
  `ArticleBody.test.tsx`, `ArticleBody.stories.tsx` (a video case); `src/content/types.ts` (`VideoBlock` in
  `ProseBlock`; a remote `ImageRef` form for `JOURNAL_IMAGES` URLs) and `src/components/ui/Photo/` tests (a remote
  case); `src/lib/security-headers.ts`, its reviewed patch, `test/security-headers.test.ts`; components.md rows
  (VideoEmbed, ArticleBody, Photo).
- **Acceptance:** SCA; §7 in full: no request to YouTube, Vimeo or i.ytimg.com from the browser before the press;
  iframe and focus after; `client-icons` green; no new motion hook; the patch adds only `videoPlayers` and its
  `frame-src` use, its header cites D057 item 1; `checkout-freeze` green; `CSP_PHASE` still `"report"`.
- **Test:** VideoEmbed unit and story; ArticleBody's video case; security-headers; checkout-freeze.

### 8b.2d The adapter and the photo table (builder; risk high; wave ii, after 8b.2b and 8b.2c)

- **Owns:** `src/lib/journal/{to-article,from-article,ring,read-minutes,nowrap}.ts` and tests;
  `src/content/en-IN/stories/photos.ts` (new) and its test; `src/content/en-IN/stories/topics.ts` (the dashboard
  title, the close and the D025 line per topic) and `topics.test.ts`; `src/lib/seo/metadata.ts` (an optional og
  size) and its test; `test/fixtures/journal/*.json` (one post per block kind, an upload, a video, a talking guide);
  assets.md rows (the journal's DS images).
- **Acceptance:** §4 and §5 implemented; the adapter's §8.2 rows each red on a planted post; the round trip
  `postToArticle(articleToPost(m))` equals each of the 20 modules except a listed set (read time, no-wrap spans), for
  the main session to rule; the ring reproduces main's three properties on a fixture journal
  (main:src/lib/stories.ts:189-207); no consumer switched yet (the registry still reads the modules).
- **Test:** unit tests per file; the round-trip test over the 20 modules.

### 8b.2e The switch: the snapshot becomes the journal (builder; risk high; wave iii, after 8b.2a and 8b.2d)

- **Owns:** `src/content/en-IN/stories/posts.generated.json` (written once by the export); `journal.ts` (new, the
  registry); `articles/index.ts` (keeps the page copy and `PLAIN_CLOSE_ART`, re-exports the registry); the 20 modules
  (deleted with `from-article.ts`); `routes.ts` (`ARTICLE_SLUGS` and the article routes' `module` derived), `hub.ts`,
  `src/app/sitemap.ts`, `src/layouts/ArticleTemplate/article-page.ts` (`articlePath` by path, not module),
  `src/layouts/SiteShell/sticky-bar-paths.ts`, `src/app/(site)/stories/[slug]/page.tsx` (its comment); every test of
  §8.3 and `test/fixtures/journal/approved/` (the frozen export); `test/e2e/support/routes.ts`; artifacts.md and
  components.md (ArticleTemplate) rows.
- **Acceptance:** the prerendered HTML of every `/stories/*` page, the hub, the sitemap and `llms.txt` equal before and
  after the switch except the ruled list; `npm run verify` and `npm run verify:e2e` green; every moved assertion listed
  with its new home (no guard weakened); the hits of the test-file grep rule listed; a new fixture post renders with
  no code change (scalability).
- **Rulings needed at merge:** the copy-page and mockup tests on fixtures; article parity once a writer edits.

### 8b.2f The backend pack and the dry run (main session with Aman; after 8b.2e)

- **Owns:** nothing in the repo. The main session sends §13 to the founder for Aman; Aman runs the committed file
  through the publish validator without publishing and answers §13's questions.
- **Acceptance:** each B-item done or dated; zero refusals, or each refusal resolved through Q1.

### 8b.2g After Gate B: import, check, flip (Aman, main session, founder; risk normal)

- **Acceptance:** the import done (B5); `--check` exits 0; the flip commit (`JOURNAL_SOURCE = "api"`) merged with the
  founder's OK; the first production build log shows the sync with 20 posts unchanged; a test upload (if Q2 = R2)
  renders through `/_next/image` on a local production build before any post with one is published; the runbook
  says writers may publish again.

## 13. For Aman: the backend changes

To pass on as written. Nothing here changes the API's address, its envelope or any existing field.

- **B1. New post fields**, nullable, returned by `/v1/public/blog/posts`, set in the admin form, checked at publish:
  `metaTitle` (≤ 60 characters, unique), `cardTitle`, `accent` (must occur exactly once in `title`), `lead`,
  `summary`, `answer` (`{ question, text }`: question ends "?", text 40 to 60 words), `photo` (one of the keys listed
  below), `related` (empty or three distinct published slugs, not the post's own). `theme` becomes a choice of four:
  "Screen time", "Talking and language", "AI toys and safety", "Learning and play".
- **B2. Editor nodes:** `bulletList.attrs.style` ("bullets", "checks", "tips", "facts"); `listItem.attrs.icon` (a DS
  icon name, required for tips and facts; one paragraph per item, no nested lists); `blockquote.attrs.style`
  ("callout" or "questions") and `blockquote.attrs.icon` (required for a callout; a questions block holds level-3
  headings and paragraphs); `image.attrs.photo` (a key; the site then ignores `src`); `heading.attrs.anchor`
  (kebab-case, level 2 only). Keep the sanitiser's whitelist to these.
- **B3. Text:** allow `[^1]`-style markers and `{price:headline}` / `{delivery}` in body text; refuse any other `{`,
  `}`, `[`, `]`. The voice law: see the founder's answer to Q1.
- **B4. Authors:** remove "Ria Mangala Rewari" (the founder's ruling of 2026-10-04); keep the three founders and
  "Kheelona".
- **B5. Import after Gate B:** upsert the 20 posts of `src/content/en-IN/stories/posts.generated.json` by slug,
  published, keeping `published` and `updated` as given; unpublish `screen-time-rules-parents-swear-by` and
  `brain-development-toys-for-a-2-year-old`. Before that, run the file through the publish checks without publishing.
- **Keys and icons** the site accepts: the 13 head photos `advik-01-counting-carriages`, `advik-04-floor-train`,
  `ira-01-story-on-the-bed`, `ira-02-drawing-the-dragon`, `ira-04-paper-crown`, `kabir-02-block-rocket`,
  `kabir-03-homework-desk`, `kabir-04-planet-book`, `myra-04-drawing-at-home`, `tara-01-naming-feelings`,
  `tara-02-evening-with-amma`, `tara-03-bedtime-with-baba`, `tara-04-reading-nook`; body images also
  `kheelu-belly-module`; icons: the 76 names in `src/assets/icons.generated.ts`.
- **Questions:** Does anything besides kheelona.com read `/v1/public/blog/posts` (the parent app)? It would show
  `[^n]` and `{price:…}` as text and no cover for the 20. Do uploads under `/v1/public/blog/images/` answer 200
  without a redirect? Does the contraction check read the curly apostrophe (’)? Can an edit to a published post be
  saved without going live? Does the Deploy Hook build only `main`?

## 14. Questions only the founder can answer

- **Q1. The voice law against the approved guides.** The backend refuses contractions and every "!"; the 20 guides
  carry about 90 contractions and two "!" inside a child's quoted words (§8.4). (A) The backend follows the DS writing
  guide: contractions allowed, at most one "!" a post, the em-dash, link-label and bare-URL rules kept.
  (B) The guides are de-contracted for the dashboard (copywriter, about 90 edits; the two "!" become full stops) and
  the founder signs the changed lines at Gate B. **Recommendation: A**: the approved copy and the DS writing guide both
  use contractions, and B changes about 90 approved lines for a rule the rebuild does not otherwise follow.
- **Q2. Uploaded images.** (R2) A DS photo by key first, the writer's upload as the fallback, shown in the DS photo
  frame; the admin who publishes checks that any photo of a child has the parents' consent, as for the films (D040).
  (R1) DS photos only; a post without a key does not publish. **Recommendation: R2**: writers keep publishing new
  topics without waiting for new DS photos, and the 20 guides all use DS keys either way.
- **Q3. When the dashboard takes over.** (a) After Gate B: the site launches from the corrected export, the import
  follows, and writers pause publishing from the Gate B merge until the flip, a day or two (a post published on the
  live site before Gate B is off the site in that window). (b) Before Gate B: the
  live site's current code would render the new posts in the old design with the markers printed as text, so it would
  need the dashboard to hold unpublished revisions (Aman to confirm). **Recommendation: a.**

## 15. Risks

| Risk | Mitigation |
|---|---|
| The backend changes are not ready by Gate B | the site launches from the committed export; writers wait; nothing breaks |
| Another consumer reads the posts API (the parent app?) and shows tokens as text | Aman's answer (§13); if yes, markers become an inline node instead of text |
| The test re-pointing (about 25 files) weakens a guard unseen | the round trip and the HTML compare (8b.2e); every moved assertion listed |
| After the flip an API outage holds every deploy, code fixes included | `BLOG_SYNC=off` for one deploy (founder, Vercel); the runbook entry |
| A published post ships an editorial fault (short answer, no marker, nobody links to it) | build warning; `npm run verify` red at the next refresh; the backend checks at publish (B1) |
| A false positive in the banned list blocks a publish | the message names the phrase; the backend may run the same list at publish |
| Unpublishing a post leaves in-text links to it in other posts | related lists refill from the ring; text links warn at build and fail verify |
| The three approved article pages' parity specs meet edited words | fixtures carry the template's proof (ruling at 8b.2e) |
| Main gains more journal commits before 8b.3 | re-run `git merge-tree` first (§11) |
| `next.config.ts` takes main's `remotePatterns` silently in the merge | §11's check |
| Uploads: unknown dimensions, a redirecting image host, a child's photo without consent | required size, `maximumRedirects: 0`, a local check of the first upload (8b.2g), Q2 |

## 16. For the main session: pages and rules to update

- **architecture.md:** §5.4 (a story is a published post), §6.1 (the stories row: the snapshot, journal.ts, photos.ts),
  §9.2 (BlogPosting dates from the post), §10 (uploads and video stills), §14 (the prebuild step 15, postbuild 20, the
  journal rows), §17 (a Hindi journal would need the dashboard to hold locales).
- **structure.md:** §1 (`scripts/journal/`, steps 15 and postbuild 20, `src/lib/journal/`, `src/config/journal.ts`),
  §3.3 (`stories/posts.generated.json`, `journal.ts`, `photos.ts`; `articles/` keeps `index.ts` only), §4 ("A story": a
  dashboard post), §5 (the article rows).
- **dependencies.md:** no new package (Node `fetch`, `AbortSignal.timeout`, `next/image`, Vitest).
- **Proposed `.claude/rules/journal.md`** (paths: `scripts/journal/**`, `src/lib/journal/**`, `src/content/en-IN/stories/**`):

```markdown
# The journal (ADR-014; wiki/engineering/journal-pipeline.md)
- Article words come from the admin dashboard. Never hand-edit src/content/en-IN/stories/posts.generated.json; refresh it
  with `BLOG_SYNC=on node scripts/journal/sync-posts.mjs`, run `npm run verify`, commit it.
- Pages read Articles from journal.ts; a new block kind needs the dashboard's node first, then the contract (§3), the
  adapter, ProseBlocks and the validator together.
- src/lib/journal/validate.ts and src/config/journal.ts import nothing (Node imports them by type stripping).
- Keep main's env names: BLOG_SYNC, BLOG_API_URL, BLOG_ALLOW_SHRINK. No request to the API outside the prebuild sync.
- Topic rules (the close, the D025 line), the photo table and the hub's overrides are the rebuild's; words are the post's.
```

- **`.claude/rules/content.md`, last line:** "The stories hub holds slug lists only; an article's card text, related
  links and dates live in its dashboard post (src/content/en-IN/stories/posts.generated.json)."
