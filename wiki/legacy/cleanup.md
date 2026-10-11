---
title: Clean-up list (Phase 0 step 6)
type: legacy-cleanup
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - wiki/raw/brief/kickoff-brief.md (sections 2 "Old work", 4.6, 4.8, 4.10, 7 Phase 0 steps 5-6)
  - "git ls-files, git grep, git diff, git merge-base at 77552ff = tag archive/pre-reset-2026-10-10 (main and reset/website-v2 both pointed there when these ran, 2026-10-10)"
  - "git diff --name-status main archive/mid-version-2026-10-10 (50827d1)"
  - "gh pr view 16; gh pr view 17; gh api repos/Kheelona/website/deployments?environment=Preview and /deployments/{id}/statuses; gh api repos/Kheelona/website/issues/16/comments (2026-10-10)"
  - "curl -I / GET with a browser User-Agent: kheelona.com asset URLs, Vercel preview URLs, kheelona.ai home page and two images (2026-10-10)"
  - "shasum -a 256 over every tracked file (877), the ignored photoshoot folder, storybook-static, .agents, docs/snapshots; compared with the 643 hashes in wiki/design-system/manifest.md"
  - "scratchpad reachability scan: static imports walked from the 35 Next.js entry points in src/app plus src/proxy.ts"
  - "scratchpad control run of tools/tokens/check-tokens.mjs with and without the old DS (repo untouched)"
  - package.json, tools/tokens/check-tokens.mjs, src/lib/email/templates.ts, src/lib/store/fulfil.ts, src/lib/seo.ts, src/lib/family.ts, Technical-Todo.md
  - "wiki/site/url-map.md section 5c (query H: destinations of the 67 synced Meta ad creatives)"
  - "PostHog project 617632, read-only, 2026-10-11 01:30-01:40 UTC: execute-sql over metaads_ad_creatives; actions-get-all; execute-sql over system.insights (queries under EV14, EV15)"
---

# Clean-up list (Phase 0 step 6)

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

> **DELETE-NOW total: 238,013,167 bytes (238.0 MB) in 423 tracked files**, out of 877 tracked files
> (279.3 MB). That is 85% of the repo's tracked bytes. Breakdown: old design system 85.2 MB, unused
> assets 146.3 MB, legacy docs and source files 6.4 MB, dead code 0.14 MB.
> Command: `git ls-files -z -- <every DELETE-NOW path below> | xargs -0 stat -f '%z' | awk '{t+=$1} END {print t}'`.
> Everything in that set is in the pushed tag `archive/pre-reset-2026-10-10` ([D001](../decisions/D001-branch-and-archive.md)),
> so it stays recoverable with `git show archive/pre-reset-2026-10-10:<path>`.

Every file in `public/`, one row each: [clean-up, public/ assets](cleanup-public-assets.md).

> **Executed 2026-10-10:** every DELETE-NOW row was deleted in commit `9059894`
> ([D006](../decisions/D006-cleanup-executed.md)). The other rows stand as listed.

This page only lists and recommends. The orchestrator deletes, on the branch, and logs it
(brief §7 step 6). Production is not affected until Gate B.

## How to read this page

| Recommendation | Meaning |
|---|---|
| **DELETE-NOW** | Tracked in git (the archive tag keeps it), and no live reference; or mandated by the brief (the old DS). Some rows say **paired**: the deletion must land in the same commit as the named edit, or the build or tests break. |
| **DELETE-WITH-REBUILD** | Still used by current pages or code that the reset rebuilds. Delete in Phase 5 when the named references go. |
| **KEEP** | Needed after the reset. The reason is given. |
| **FOUNDER** | Untracked or gitignored (NOT in the tag, so never delete it), outside this repo (remote branches, the PR, Vercel), or ambiguous. Each one names its question in [open questions](../open-questions.md). |

**Evidence commands** (cited by number in the tables). EV1 to EV13 ran 2026-10-10 at `77552ff`, the
commit tagged `archive/pre-reset-2026-10-10`; EV14 and EV15 are read-only PostHog queries.

| # | Command | What it proves |
|---|---|---|
| EV1 | `git grep -n -F "<path or name>" -- src test tools scripts next.config.ts vercel.json package.json tsconfig.json .storybook public supabase docs/utm-conventions.md` | References in code, config, tests and the ads tagging doc |
| EV2 | Reachability scan (scratchpad script): walks static `import`/`export ... from`/`import()` from every `src/app/**/{page,layout,route,not-found,robots,sitemap}` file and `src/proxy.ts` (35 entries); `next.config.ts` imports `src/lib/security-headers.ts` | Which modules no production entry point reaches. Result: 146 of 163 production modules reachable; the other 17 are all `src/features/ambient-stage/` |
| EV3 | `git grep -n -i -E "<img\|\.png\|\.jpg\|\.svg" -- src/lib/email src/lib/store src/app/api` | Exit 1, no hits: receipt emails embed **no images**, by design (`src/lib/email/templates.ts:23-29`, "no images that must load"). Emails link only to `STORE_URL/thanks?ref=…&t=…` (`src/lib/store/fulfil.ts:304`), WhatsApp and mailto. So no asset URL is pinned by a sent email |
| EV4 | `grep -n -E "\.(png\|jpg\|webp\|mp4\|svg\|glb)\|image" src/app/sitemap.ts src/app/llms.txt/route.ts src/app/pricing.md/route.ts src/app/robots.ts` | No hits: the sitemap, `llms.txt`, `pricing.md` and robots name no asset |
| EV5 | `git grep -n -E "image:\|images:\|thumbnailUrl\|contentUrl" -- src/lib/seo.ts 'src/app/(site)/stories'` | Assets pinned by structured data and share cards: `/og.png` (`seo.ts:41,127,400,414`, `layout.tsx:54`), `/brand/logo-mark.png` (`seo.ts:126`), `/product/lumi.png` (`seo.ts:314`), story heroes (`stories/[slug]/page.tsx:103`, `stories/page.tsx:59`), launch film (`seo.ts:268-269`, dead export) |
| EV6 | `git ls-files -z \| xargs -0 shasum -a 256`, grouped by hash | Identical-content groups (section 4) |
| EV7 | Tracked hashes vs the 643 hashes in [manifest](../design-system/manifest.md) | **0 matches: no file in the repo is byte-identical to anything in the new DS** |
| EV8 | `git merge-base --is-ancestor <branch> main`; `git rev-list --count main..<branch>` | Branch merge status (section 6) |
| EV9 | `gh pr view 16 --json …`; `gh api repos/Kheelona/website/deployments?environment=Preview` and each deployment's `statuses`; `curl` GET of each `environment_url` | PR and Vercel preview state (sections 2, 6) |
| EV10 | `curl -I -A "<browser UA>" https://kheelona.com/<asset>` for 11 asset URLs | All 200 on production today (expected: production is untouched until Gate B) |
| EV11 | Control run in the scratchpad: copied `tools/tokens/check-tokens.mjs` and its inputs, ran it without and with the old DS tokens, and without `ambient-stage/lib/tokens.ts` | Without old DS: `token-check: FAILED — …kheelona.css is missing`, exit 1. With it: `token-check: ok (16 mappings)`, exit 0. Without the 3D tokens file: `ENOENT`, exit 1 |
| EV12 | `git grep -n -E "readFileSync\|existsSync\|readdirSync\|ls-files" -- test src tools` | Which tests read docs or files from disk (paired changes) |
| EV13 | GET `https://kheelona.ai/` and `https://kheelona.ai/products/{lua,robu}.png`, then `shasum -a 256` | kheelona.ai serves its own copies (relative `src="/products/lua.png"`), byte-identical to ours (`dbc8bed2…`, `2d3887e8…`); it does not hotlink kheelona.com |
| EV14 | Meta ads, via the PostHog warehouse sync of `metaads_ad_creatives` (67 creatives). Destinations: [URL map §5c](../site/url-map.md) query H. Asset check for this page, per creative: `(lori\|lua\|robu)\.png\|profile\.png\|\.glb\|/models/\|/video/\|launch\.mp4` in `link_url`, `image_url`, `thumbnail_url`, `object_story_spec` or `asset_feed_spec`; `kheelona\.com/…\.(png\|jpg\|jpeg\|webp\|mp4\|glb\|svg)` in the link and spec fields; `image_url` or `thumbnail_url` containing `kheelona` | Destinations are only the product page (29), Home (4), and Instagram, Messenger and WhatsApp (10); 24 have none resolvable. **0 of 67** name a `public/` asset, link to an asset file, or host their image on kheelona.com. This is the last sync's view, not Ads Manager |
| EV15 | PostHog `actions-get-all`; `SELECT … FROM system.insights WHERE deleted = 0`, testing each saved query for asset paths, `pathname` and `current_url` | **0 actions.** 10 saved insights, all generic (active users, sessions, pageviews, DAUs, WAUs, retention, top referrers, a visit-to-interaction funnel, daily pageviews, daily unique visitors); none filters on a URL or names an asset |

**Not checkable from here** (see "Gaps" at the end): organic social posts and partner sites linking
to asset URLs ([open questions](../open-questions.md) C9); Vercel request logs. No product feed
exists in the repo (EV1 for `merchant`, `feed`, `catalog`: no hits); one outside it is
[open questions](../open-questions.md) C3.

## Paired changes and traps (read before deleting)

1. **The build breaks if the old DS goes alone.** `package.json:7` is
   `"build": "node tools/tokens/check-tokens.mjs && next build"`, and the gate exits 1 when
   `Design/Kheelona-Design-System-v3/tokens/kheelona.css` is missing (`tools/tokens/check-tokens.mjs:22-29`)
   and throws when `src/features/ambient-stage/lib/tokens.ts` is missing (`:33`). Proven by EV11. The
   same commit that deletes either must drop the gate from the build script (or repoint it at
   `design-system/` tokens; the Architect's call). Vercel's Next.js preset runs the package `build`
   script unless the dashboard overrides it; the dashboard is the founder's and was not checked
   ([open questions](../open-questions.md) C8).
2. **Stage deletions before running tests.** Several guard tests enumerate files with `git ls-files`
   (EV12: `src/lib/seo.test.ts:243`, `test/kheelu-art.test.ts:38`, `test/stories-parse.test.ts:34`,
   and others), which reads the index, so an unstaged deletion fails tests that look like broken
   code. Use `git rm`. Never `git add -A`: the repo is public ([lessons](../engineering/lessons.md)).
3. **Phase 0 doc work trips four tests** (EV12):
   - `test/meta-pixel-id.test.ts:25-26,36-58` reads `CLAUDE.md` and `docs/website-steps.md` and fails
     unless both name the live pixel id and `CLAUDE.md` names no other id unmarked. The schema
     rewrite of `CLAUDE.md` will fail it. The id itself lives on
     [tracking inventory](../site/tracking-inventory.md).
   - `test/preorder-copy.test.ts:120-122` needs `README.md` to contain `### Step 1`.
   - `test/utm.test.ts:18` parses `docs/utm-conventions.md`; `test/video-assets.test.ts:164,212`
     uses `public/video/launch.mp4` as a fixture and reads `docs/video-conventions.md`.
   - `test/schema-coverage.test.ts:80` reads `supabase/README.md`.
4. **Ignored contents stay on disk** when their tracked folder is deleted: `launch-video/node_modules/`
   (477 MB) and `Design/product-images/Kheelona photoshoot 2025/` (596 MB). Keep `.gitignore:18-19`
   (photoshoot guard) and `:65` (`pitch-deck/`) even after the folders around them go.
5. **Stale config after deletion** (harmless, tidy in Phase 4): `tsconfig.json:41-45` excludes
   `launch-video`, `tools`, `docs`, `design-concepts`, `3d-handoff`; `.gitignore:10,16,23,24` name
   `launch-video/out/`, `tools/cutout/cutout`, `3d-handoff/exports/`, `design-concepts/round-2-immersive/previews/`.

## 1. Old design system

| Item | Tracked? | Size | References found | Recommendation | Reason |
|---|---|---|---|---|---|
| `Design/Kheelona-Design-System-v3/` | Yes, 100 files | 85,160,423 B | EV1: **build gate** `tools/tokens/check-tokens.mjs:22-29` (run by `package.json:7`). Comments only: `src/app/layout.tsx:11`, `src/styles/globals.css:11,67`, `src/lib/shape-paths.ts:2`, `src/features/ambient-stage/lib/tokens.ts:2`, `tools/brand/render-icons.mjs:5`, `launch-video/src/{tokens.ts,fonts.ts,shapes.tsx}`. No test reads it (EV12). | **DELETE-NOW, paired** with the build-script change (trap 1) | Mandated: brief §2 "Old work", §7 step 5. Its knowledge is summarised in [laws summary](laws-summary.md) and [settled decisions](settled-decisions.md) |
| `tools/tokens/check-tokens.mjs` | Yes | 6,402 B | `package.json:7`; reads old DS (`:22,31`), `globals.css` (`:32`), 3D tokens (`:33`) | **DELETE-NOW, paired** with the row above | It checks three copies of the v3 palette, all retired by the reset. A new gate against `design-system/` tokens is a Phase 4 decision |
| `src/app/fonts/` (Glory, Instrument Sans, Instrument Serif Italic woff2 + 3 OFL licences) | Yes, 6 files | 167,001 B | `src/app/layout.tsx:15-37` | DELETE-WITH-REBUILD | v3 font subsets; the DS ships its own fonts ([DS overview](../design-system/overview.md), Typography). The 3 OFL files are byte-identical to the v3 copies (EV6) |
| v3 palette and shapes in code: `src/styles/globals.css` `@theme`, `src/lib/shape-paths.ts`, `src/components/atoms/Shapes.tsx`, `test/contrast-tokens.test.ts` | Yes | n/a | Imported by live pages (EV2) | DELETE-WITH-REBUILD | Replaced by DS tokens and components in Phase 5 |
| `public/brand/kheelona-wordmark.svg`, `public/brand/kheelona-mark.svg` | Yes, 2 files | 31,725 B | Wordmark: `Navbar.tsx:29`, `app/store/layout.tsx:40`. Mark: only `tools/brand/render-icons.mjs:23` | DELETE-WITH-REBUILD | Byte-identical to the v3 logo files (EV6); the DS has its own logo files ([DS overview](../design-system/overview.md#assets-by-group)) |
| `tools/brand/render-icons.mjs` | Yes | 2,685 B | No `package.json` script; reads the mark above | DELETE-WITH-REBUILD | The DS ships favicon and app-icon PNGs ready-made ([DS overview](../design-system/overview.md#assets-by-group)) |
| `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/favicon.ico` | Yes, 3 files | 299,982 B | Next.js file conventions; served at `/icon.png`, `/apple-icon.png`, `/favicon.ico` ([URL map](../site/url-map.md)) | DELETE-WITH-REBUILD (replace in place) | URLs stay; contents become the DS logo files |

## 2. Mid version (PR #16)

What it is: [D002](../decisions/D002-mid-version-identified.md). Its knowledge (founder rulings on
claims, shared content sources) is in [memory summary](memory-summary.md) and
[settled decisions](settled-decisions.md).

| Item | Tracked? | Size | References found | Recommendation | Reason |
|---|---|---|---|---|---|
| Mid-version files in the working tree | n/a | 0 | `git diff --name-status main archive/mid-version-2026-10-10`: 159 files (39 added, 20 deleted, 96 modified, 4 renamed). None exists on the branch, which was cut from production `77552ff` | Nothing to delete | Already absent by construction ([D001](../decisions/D001-branch-and-archive.md)) |
| Local branch `redesign-mockup-2026-10` | Yes | n/a | EV8: NOT merged (20 commits ahead of `main`, 0 behind); head `50827d1` = tag `archive/mid-version-2026-10-10`, which is on `origin` (`git ls-remote --tags origin`) | **DELETE-NOW** (`git branch -D`; the tag holds the same commit) | Archived; no further use |
| Remote branch `origin/redesign-mockup-2026-10` | Remote | n/a | Head of open PR #16 | FOUNDER ([Q2](../open-questions.md)) | Outside this repo (brief §7 step 6) |
| PR #16 "Redesign the site to the parent-first mockup, plus content doc v7 and MARKETING-TODO" | GitHub | +4,717 / −2,614 in 159 files, 20 commits | EV9: OPEN, not draft, MERGEABLE, created 2026-10-02, updated 2026-10-05 | FOUNDER ([Q2](../open-questions.md)) | Merging it by accident would deploy the mid version, since a push to `main` auto-deploys |
| Vercel previews of the mid version | Vercel | n/a | EV9: branch alias `website-git-redesign-mockup-2026-10-apoorvas-projects-5e91bf12.vercel.app` plus 7 per-commit previews (2026-10-02 to 2026-10-05). All answer 302 to Vercel SSO login; the alias sends `x-robots-tag: noindex` | FOUNDER ([Q2](../open-questions.md)) | Protected and not indexable, so no urgency; deletion is a dashboard action |
| `MARKETING-TODO.md` | Only in the tag | n/a | Exists only in the mid version: PR #17 (branch `marketing-todo`) merged into the PR #16 branch on 2026-10-02 12:00 UTC, not into `main` | No action | Read with `git show archive/mid-version-2026-10-10:MARKETING-TODO.md` if the positioning work wants it |
| Local `.next/` build | Ignored | 351 MB (207 MB of it cache) | `BUILD_ID` dated 2026-10-04; contains `how.html` and `faq.html`, which exist only in the mid version | FOUNDER ([Q5](../open-questions.md)) | A stale build of the mid version: `next start` without a rebuild would serve it. Regenerable; safe to remove locally |

## 3. Unused assets

### 3a. `public/` (summary; every file is listed in [clean-up, public/ assets](cleanup-public-assets.md))

No file in `public/` is byte-identical to anything in the new DS (EV7), and brief §2 allows only DS
imagery. So every image currently on the site goes or is replaced; the question per file is only
**when**.

| Item | Tracked? | Size | References found | Recommendation | Reason |
|---|---|---|---|---|---|
| `public/app/profile.png` | Yes | 51,701 B | EV1 path, basename: none. EV14: in no Meta ad creative. EV15: in no PostHog action or insight | **DELETE-NOW** | Unreferenced |
| `public/products/lori.png`, `lua.png`, `robu.png` | Yes, 3 files | 2,026,156 B | EV1: none. `src/lib/family.ts:3-5` is a comment saying they stay "for parity" with kheelona.ai. EV13: kheelona.ai serves its own byte-identical copies, so nothing there depends on ours. EV14, EV15: in no Meta ad creative, PostHog action or insight | **DELETE-NOW**; fix the `family.ts:3-5` comment in the same commit | A 2026-08-23 cleanup approved deleting them and held back only over that comment (`Technical-Todo.md:1201-1206`; [settled decisions](settled-decisions.md) marks it CONFIRM). Brief §2 (2026-10-10) is the newer instruction |
| `public/models/kheelona-mascot.glb`, `lumi-plush.glb` | Yes, 2 files | 1,924,680 B | Only `src/features/ambient-stage/components/actors.tsx`, which no route reaches (EV2, section 5). EV14, EV15: in no Meta ad creative, PostHog action or insight | **DELETE-NOW, paired** with `src/features/ambient-stage/` | The dormant 3D journey; unmounted since 2026-07-28 |
| `public/video/launch.mp4`, `launch-poster.jpg` | Yes, 2 files | 2,956,308 B | Only the dead export `LAUNCH_VIDEO` (`src/lib/seo.ts:263-272`, imported by nothing but `src/lib/seo.test.ts`) and a size fixture in `test/video-assets.test.ts:162-164`. Left Home's JSON-LD in V4 (`src/app/(site)/page.tsx:117`). EV14, EV15: in no Meta ad creative, PostHog action or insight | DELETE-WITH-REBUILD (with `LAUNCH_VIDEO` and the fixture) | Not on any live page; was in structured data until 2026-07-31, so a search engine may hold the URL. Organic social and partner links: [open questions](../open-questions.md) C9 |
| `public/mascot/mascot-*.png` | Yes, 7 files | 2,882,214 B | Built dynamically as `` `/mascot/mascot-${pose}.png` ``: `src/lib/kheelu-poses.ts:20` (guide, feelings gallery), `features/home/components/Journal.tsx:54`, `app/(site)/stories/page.tsx:135`, `stories/[slug]/page.tsx:209` | DELETE-WITH-REBUILD | Old mascot art; a plain filename grep misses these (EV1 finds no literal path) |
| `public/product/lumi.png` | Yes | 2,028,885 B | `src/lib/kheelu-art.ts`; Product JSON-LD `image` (`seo.ts:314`) | DELETE-WITH-REBUILD | Product art is replaced by DS photography; the Product `@id` is a separate matter ([URL map](../site/url-map.md)) |
| `public/products/ai-book.png`, `kheelu-speaker.png`, `magic-box.png` | Yes, 3 files | 2,614,052 B | `src/lib/family.ts`; `app/(site)/playos/page.tsx:186` | DELETE-WITH-REBUILD | Non-DS renders |
| `public/app/dashboard.png`, `onboarding.png` | Yes, 2 files | 106,582 B | `features/home/components/ParentAppSection.tsx:36`; `app/(site)/setup/page.tsx:42` | DELETE-WITH-REBUILD | Not DS imagery; real app screenshots are part of [open questions](../open-questions.md) G3. The DS's `AppScreens` is marked not for the site ([component map](../design-system/component-map.md#appscreens-and-campaignkit-not-for-the-site)) |
| `public/stories/*.jpg` | Yes, 19 files | 4,197,775 B | `src/lib/stories.ts`, `src/lib/stories-expansion.ts`; used as BlogPosting and ItemList `image` in JSON-LD (EV5) | DELETE-WITH-REBUILD | AI-generated journal photos: 19 of the 22 articles carry one as `hero` (`src/lib/stories.ts:26,59`; the other 3 have none; article list in [URL map](../site/url-map.md) §1b). Phase 5 gives each of the 19 a DS image before these go |
| `public/og.png` | Yes | 213,681 B | `layout.tsx:54`, `seo.ts:41,127,400,414`, `proxy.ts:190` | **KEEP the URL**, replace the file in Phase 5 | WhatsApp and social cards cache by URL; the URL must keep answering |
| `public/brand/logo-mark.png` | Yes | 11,320 B | Organization `logo` in JSON-LD (`seo.ts:126`) | **KEEP the URL**, replace the file in Phase 5 | Search engines cache the logo URL. Byte-identical to `src/app/icon.png` (EV6) |
| `public/team/*.jpg` (aman, apoorva, kashyap, ria) | Yes, 4 files | 143,399 B | `app/(site)/team/page.tsx` | FOUNDER ([G3](../open-questions.md)) | Real people; not in the DS ([DS gaps G-14](../design-system/gaps.md#g-14)). The mid version had already removed `ria.jpg` |
| `public/recognition/*.png` (karnataka-seal, nasscom, nvidia-inception) | Yes, 3 files | 131,371 B | `components/organisms/RecognitionStrip.tsx` | FOUNDER ([G3](../open-questions.md)) | Third-party marks used as proof; not in the DS |
| `public/partners/ideabaaz-startup-fest.png` | Yes | 7,121 B | `app/store/ideabaaz/page.tsx` (printed QR codes point at that page) | FOUNDER ([G3](../open-questions.md)) | Third-party mark on a store page that must keep working |
| `public/video/moments/*` (7 films, each `.mp4` + `.jpg` + `.webp`) | Yes, 21 files | 22,951,457 B | `src/lib/video-moments.ts` (Home, product page, store) | FOUNDER ([G3](../open-questions.md)) | Real customer films with consent; not in the DS ([DS gaps G-14](../design-system/gaps.md#g-14)). Brief §2 does not say whether films count as "imagery" |

### 3b. Design source folders and handoff kits

| Item | Tracked? | Size | References found | Recommendation | Reason |
|---|---|---|---|---|---|
| `Design/mascot-3d-images/` | Yes, 21 files | 11,360,346 B | EV1: none | **DELETE-NOW** | Tripo3D mascot references for the retired 3D pipeline |
| `Design/product-images/generated-2026-07/` | Yes, 19 files | 62,502,684 B | Comment only: `src/lib/family.ts:45` | **DELETE-NOW** | AI product renders from the blue-dino era; 3 are duplicated in `3d-handoff/` and `launch-video/` (EV6) |
| `Design/product-images/Lumi Blue/`, `Lumi pastel green/` | Yes, 7 files | 1,903,358 B | EV1: none | **DELETE-NOW** | Retired colourways (the art became a cream rabbit on 2026-08-25); all 5 views duplicated in `gemini-handoff/` (EV6) |
| `Design/product-images/Kheelona photoshoot 2025/` | **Ignored** (`.gitignore:18-19`) | 596 MB, 56 raw JPGs | EV1: none. Hash check: 0 of 56 match any tracked file | FOUNDER ([Q5](../open-questions.md)), **never delete** | Raw photoshoot originals; this may be the only copy. Not in the tag |
| `design-concepts/` | Yes, 91 files | 15,526,691 B | Only `tsconfig.json:44` (exclude) | **DELETE-NOW** | July 2026 concept pages and their assets; 8 files duplicate `launch-video/public` and `3d-handoff` (EV6) |
| `gemini-handoff/` | Yes, 21 files | 10,755,458 B | Comments only: `FamilyGrid.tsx:73`, `HeroStage.tsx:15`, `HeroStage.stories.tsx:14`, `stories-expansion.ts:279` | **DELETE-NOW** | Founder prompt kits for Gemini art; the reset uses only DS imagery (brief §2) |
| `3d-handoff/` | Yes, 8 files | 7,923,542 B | Only `tsconfig.json:45` (exclude) | **DELETE-NOW** | Reference renders for the GLB models deleted above |
| `launch-video/` | Yes, 55 files | 32,321,057 B | Only `tsconfig.json:41` (exclude) | **DELETE-NOW** | Remotion project that rendered the launch film; it is a second npm manifest with its own lockfile (a Dependabot surface). Its ignored `node_modules/` (477 MB) stays on disk: FOUNDER ([Q5](../open-questions.md)) |

## 4. Duplicates

EV6 found **30 identical-content groups, 18,800,489 redundant bytes** among the 877 tracked files.
**29 of the 30 disappear with the DELETE-NOW set**, because one copy sits in a folder deleted above.
The one that survives, `public/brand/logo-mark.png` = `src/app/icon.png` (11,320 B), is replaced in
Phase 5 on both paths (section 1, section 3a).

| Content (copies) | Bytes each | Resolved by deleting |
|---|---|---|
| `3d-handoff/lumi-right.png` = `Design/product-images/generated-2026-07/cut-lumi-right.png` | 2,279,707 | both folders |
| `gemini-handoff/hero-2026-08/ref-lumi-rabbit.png` = `public/product/lumi.png` | 2,028,885 | `gemini-handoff/` |
| `3d-handoff/lumi-front.png` = `generated-2026-07/cut-lumi-blue.png` = `launch-video/public/product-v2/cut-lumi-blue.png` | 1,945,120 | all three folders |
| `3d-handoff/lumi-left.png` = `generated-2026-07/cut-lumi-blue-left.png` | 1,796,740 | both |
| `gemini-handoff/hero-2026-07/sample-hero-whisper.png` = `gemini-handoff/hero-2026-08/sample-composition.png` | 1,717,215 | `gemini-handoff/` |
| `Design/product-images/Lumi Blue/{front,back,left,right} view` = `gemini-handoff/ref-blue-{front,back,left,right}.png` (4 groups) | 241,669 to 709,498 | both |
| `Lumi pastel green/lumi green front view.png` = `gemini-handoff/ref-green-front.png` | 130,371 | both |
| `Design/mascot-3d-images/Main_Refrence 1.png` = `gemini-handoff/hero-2026-07/ref-kheelu-main.png` = `gemini-handoff/hero-2026-08/ref-kheelu-main.png` | 541,704 | both |
| `design-concepts/assets/mascot-{grumpy,joy,hero-wink,silly,bliss}.png` = `launch-video/public/mascot-*.png` (5 groups) | 360,056 to 534,546 | both |
| `3d-handoff/mascot-{front,back,side}.png` = `design-concepts/assets/tripo/{front,back,side}.png` (3 groups) | 341,030 to 449,743 | both |
| `gemini-handoff/feedback-round-2026-07/ref-style-father-kites.jpg` = `public/stories/why-three-to-six-are-the-years-that-matter-most.jpg` | 270,923 | `gemini-handoff/` |
| `gemini-handoff/feedback-round-2026-07/ref-style-grandmother-moon.jpg` = `public/stories/how-children-learn-by-talking.jpg` | 270,146 | `gemini-handoff/` |
| `design-concepts/assets/{InstrumentSans,Glory}-VariableFont*.ttf` = `launch-video/public/…` (2 groups) | 87,336 and 193,312 | both |
| v3 `assets/logo/kheelona-wordmark.svg`, `kheelona-mark.svg` = `public/brand/` copies (2 groups) | 27,165 and 4,560 | old DS |
| v3 `assets/logo/spec-dimensions.png` = `design-concepts/assets/logo-mark.png` | 13,360 | both |
| v3 `fonts/OFL-{Glory,InstrumentSans,InstrumentSerif}.txt` = `src/app/fonts/` copies (3 groups) | 4,403 to 4,481 | old DS |
| **`public/brand/logo-mark.png` = `src/app/icon.png`** | 11,320 | **survives**; both replaced in Phase 5 |

Outside git: the ignored root file `Website prompt based on B + inputs - 24-Jul.pdf` is byte-identical
to the tracked `docs/revamp-2026-07/team-feedback-2026-07-30.pdf` (SHA-256 `842b9229d900d096…`), as
`.gitignore:58-60` says. `storybook-static/` holds 55 stale copies of `public/` and font files.

## 5. Dead code

| Item | Tracked? | Size | References found | Recommendation | Reason |
|---|---|---|---|---|---|
| `src/features/ambient-stage/` (3D stage: `StageGate`, `Stage`, `ThreeStage`, actors, 16 stories and tests) | Yes, 32 files | 67,956 B | EV2: none of its 16 production modules is reachable; EV1 `from '…ambient-stage'` outside the folder: exit 1. Read by the token gate (`check-tokens.mjs:33`). `<StageGate>` left the app in commit `6416c06` (2026-07-28) | **DELETE-NOW, paired** with the GLBs and the token-gate retirement (trap 1) | The old CLAUDE.md calls it "dormant, one prop away"; in fact no route has imported it for 10 weeks |
| Leftovers of the 3D stage | Yes | n/a | `src/styles/globals.css:435-484` (`html.scene-3d` rules); `test/setup.ts:85-94` (a `next/dynamic` mock whose only user was `StageGate`); `package.json:26-27,39-40,53` (`@react-three/drei`, `@react-three/fiber`, `three`, `zustand`, `@types/three`: EV1 finds no importer outside the feature) | DELETE-WITH-REBUILD (CSS, mock); packages: remove with `npm uninstall <names>` after the feature goes | Never a bare `npm install` ([lessons](../engineering/lessons.md)) |
| Dead export `LAUNCH_VIDEO` (`src/lib/seo.ts:263-272`) | Yes | n/a | Imported only by `src/lib/seo.test.ts:6,27,211-212` | DELETE-WITH-REBUILD (with the launch film, section 3a) | Unused since V4 |
| `tools/seo/replace-story.py` | Yes | 594 B | Docs only (`docs/checkpoints/seo-aeo-geo-2026-09-05.md:106`) | **DELETE-NOW** | Its own docstring: "Session tool for the 2026-09-05 SEO round; safe to delete afterwards" (line 4) |
| `tools/cutout/` (`keycut` Mach-O arm64 binary, `keycut.swift`, `main.swift`) | Yes, 3 files | 69,969 B | Docs and one comment (`app/(site)/team/page.tsx`) | **DELETE-NOW** | Background-removal for AI art; DS imagery arrives finished, and a compiled binary does not belong in git |
| Ignored `tools/cutout/cutout` binary | Ignored | 100 KB | n/a | FOUNDER ([Q5](../open-questions.md)) | Compiled from `main.swift`; regenerable |
| Current UI: `src/components/**`, `src/features/home/**`, `src/app/(site)/**` pages, `src/lib/kheelu-poses.ts`, `src/components/vendor/animate-ui/**` | Yes | n/a | Reachable today (EV2) | DELETE-WITH-REBUILD | Rebuilt on the DS in Phase 5. Not dead yet: deleting now would only break the branch for no gain |
| Old-UI guard tests (for example `test/a11y-v4`, `action-label`, `contrast-tokens`, `kicker-language`, `kheelu-art`, `interactions`) | Yes | n/a | Test their current subjects | DELETE-WITH-REBUILD | Go with their subjects. **KEEP** the checkout, tracking, redirect and security tests (`analytics-tags`, `campaign-cookie`, `click-id`, `posthog-proxy`, `preorder-money`, `store-host`, `store-secrets`, `security-headers`, `redirects-vs-assets`, `trailing-slash`, `proxy-trailing-slash`, `utm`, `schema-coverage`, `dependency-floor`): brief §4.3, §4.4 |
| Local build outputs: `storybook-static/` (30 MB, 2026-09-05), `tsconfig.tsbuildinfo` (368 KB), `next-env.d.ts`, `docs/snapshots/` (2.0 MB of QA screenshots), `.next/` (section 2) | Ignored | about 384 MB | n/a | FOUNDER ([Q5](../open-questions.md)) | All regenerable or disposable, but ignored files are not in the tag, so the founder says yes first |

## 6. Stale branches and remote items

| Item | Tracked? | Size | References found (EV8, EV9) | Recommendation | Reason |
|---|---|---|---|---|---|
| Local `dependency-bump-2026-09-05` | Yes | n/a | Merged into `main` (ancestor; 0 ahead, 104 behind); last commit 2026-09-05 | **DELETE-NOW** (`git branch -d`) | Fully merged |
| Local `launch-video-deps-2026-09-05` | Yes | n/a | Merged (0 ahead, 102 behind); 2026-09-05 | **DELETE-NOW** | Fully merged |
| Local `lumi-rabbit` | Yes | n/a | Merged (0 ahead, 134 behind); 2026-08-25 | **DELETE-NOW** | Fully merged |
| Local `security-hardening` | Yes | n/a | Merged (0 ahead, 164 behind); 2026-08-23 | **DELETE-NOW** | Fully merged |
| Local `redesign-mockup-2026-10` | Yes | n/a | See section 2 | **DELETE-NOW** | Tag holds it |
| `origin/lumi-rabbit` | Remote | n/a | Merged; its Vercel branch alias answers 404 | FOUNDER ([Q2](../open-questions.md)) | Remote |
| `origin/security-hardening` | Remote | n/a | Merged; its Vercel branch alias answers 410 | FOUNDER ([Q2](../open-questions.md)) | Remote |
| `origin/redesign-mockup-2026-10`, PR #16, its 7 previews | Remote | n/a | See section 2 | FOUNDER ([Q2](../open-questions.md)) | Remote |
| Older Vercel previews (11 GitHub deployment records, 2026-02-21 to 2026-04-13, the Wix-era app) | Vercel | n/a | Every `environment_url` answers 404 | Nothing to do | Already gone |
| `marketing-todo` remote branch (PR #17) | n/a | n/a | Not in `git ls-remote --heads origin` | Nothing to do | Already deleted |
| Git tags (`pre-*`, `v*-live-*`, `archive/*`, `archived-demo-website-2026-09-05`) | Yes | n/a | Rollback points named across the legacy docs | **KEEP** | Never delete history (brief §4.6) |

## 7. Legacy docs and source files

| Item | Tracked? | Size | References found | Recommendation | Reason |
|---|---|---|---|---|---|
| `kheelona homepage website content.pdf` | Yes | 163,369 B | EV1: none | **DELETE-NOW** | The old Home copy (source #1 under the old CLAUDE.md); replaced by SKM's positioning (brief §3). Nothing copies it into `wiki/raw/` (its only PDF is the positioning doc, `find wiki/raw -iname '*.pdf'`, 2026-10-10), so the tag is its one copy: `git show "archive/pre-reset-2026-10-10:kheelona homepage website content.pdf" > content.pdf` |
| `website-builder-prompt-final-kheelona.md` | Yes | 53,667 B | EV1: none | **DELETE-NOW** | The old master build spec; replaced by the brief |
| `FOUNDER-TODO.md` | Yes | 918 B | 75 mentions in 30 files (`git grep -c`), all docs plus 3 code comments (`refund/page.tsx`, `team/page.tsx`, `seo.ts`); no test | **DELETE-NOW** | A pointer to two files that are themselves retiring. (It says "82 references across 29 files"; the count is now 75 in 30) |
| `Technical-Todo.md` | Yes | 94,102 B | Comments in `products/kheelu/_components/ViewContentTracker.tsx:27`, `store/thanks/page.tsx:88`; holds the §8.26-g **sell-out copy sweep** checklist (line 1130) | DELETE-WITH-REBUILD | Delete only after its open items reach [open questions](../open-questions.md) (orchestrator, via [memory summary](memory-summary.md)) and the sell-out sweep reaches [checkout](../site/checkout.md) |
| `security-review.md` | Yes | 49,136 B | Comments only (`security-headers.ts:1`, `dependency-floor.test.ts:6`, `security-headers.test.ts:13`, `payment-probe.mjs:7`) | FOUNDER ([Q5](../open-questions.md)) | An open security engagement with items waiting on the founder, and an architecture map of the payment path in a public repo |
| `docs/revamp-2026-07/` (BUILD-V3 to V6, WORKING, copy-v2, research, keywords, benchmarks, team-feedback PDF) | Yes, 11 files | 5,465,321 B | Comments only: `app/(site)/page.tsx:66`, `playos/page.tsx:32`, `AnswerBlock.tsx:6`, `KheeluGuide.tsx:37`, `stories-expansion.ts:276` | **DELETE-NOW** | July 2026 specs, superseded twice |
| `docs/checkpoints/` | Yes, 33 files | 443,192 B | Comments only; `test/meta-pixel-id.test.ts` names the folder only to exempt it | **DELETE-NOW** | Round records; [memory summary](memory-summary.md), [laws summary](laws-summary.md) and [lessons](../engineering/lessons.md) cite them at the tag |
| `docs/qa-report.md`, `copy-reference.md`, `design-review-2026-07-10.md`, `redesign-plan-2026-07.md`, `stories-image-prompts.md`, `project-state.json` | Yes, 6 files | 230,286 B | Comments only (`stories/page.tsx` names `stories-image-prompts.md`) | **DELETE-NOW** | History of the old site |
| `docs/seo/` (handoffs, founder actions, app-store listings, outreach drafts) | Yes, 5 files | 55,397 B | EV1: none | **DELETE-NOW**; its open founder actions (Play Store text, profile back-links) are [open questions](../open-questions.md) C6 | Off-site actions are not code; the Search & AI Visibility agent may read them at the tag |
| `docs/website-steps.md` | Yes | 259,044 B | **`test/meta-pixel-id.test.ts:26` reads it** | DELETE-WITH-REBUILD (with that test, trap 3) | The laws, summarised in [laws summary](laws-summary.md) |
| `docs/video-conventions.md` | Yes | 8,739 B | `test/video-assets.test.ts:212`; `src/lib/video-moments.ts:19` | DELETE-WITH-REBUILD | Goes with the video section, whatever [open questions](../open-questions.md) G3 decides |
| `docs/standards/` (PROJECT_STRUCTURE, COMPONENT_GUIDELINES, STRUCTURE-MAP) | Yes, 3 files | 34,525 B | `AGENTS.md:10` | DELETE-WITH-REBUILD | Replaced by the Architect's structure page in Phase 4 (brief §9.12) |
| `docs/utm-conventions.md` | Yes | 8,287 B | `test/utm.test.ts:18` parses it; `src/lib/campaign.ts`, `tools/utm/build-link.mjs` | **KEEP** | Live ad-tagging rules; tracking parity (brief §4.3) |
| `docs/preorder-events.md`, `docs/store-go-live.md` | Yes, 2 files | 23,641 B | `npm run event-link` (`tools/store/event-link.mjs`) | **KEEP** | Runbooks for the unchanged checkout (₹99 event links, key rotation) |
| `docs/posthog-settings.md` | Yes | 6,274 B | EV1: none | **KEEP** | Record of PostHog dashboard settings; [tracking inventory](../site/tracking-inventory.md) owns the facts |
| `README.md`, `AGENTS.md` | Yes | 17,013 B | `test/preorder-copy.test.ts:120-122` reads README; old CLAUDE.md imports AGENTS.md | **KEEP** (rewrite README in Phase 5) | AGENTS.md's Next.js 16 warning still applies |
| `supabase/` (README + 4 migrations) | Yes, 5 files | 13,083 B | `test/schema-coverage.test.ts:80` | **KEEP** | The live order schema; migrations are applied by hand |
| `tools/qa/`, `tools/store/`, `tools/utm/` | Yes | n/a | `package.json` scripts `qa:*`, `event-link`, `utm` | **KEEP** | QA harness and checkout tools |
| `skills-lock.json` | Yes | 12,341 B | [Agent roster](../agents/roster.md): skills reinstall from it | **KEEP** | Needed by the agent team |
| `.agents/` | Ignored | 2.5 MB | `.claude/skills/*` are 47 symlinks into `.agents/skills/` | FOUNDER ([Q5](../open-questions.md)), keep | Deleting it breaks every installed marketing skill |
| `.storybook/` and `*.stories.tsx` | Yes | n/a | `npm run storybook` | **KEEP** for now | Whether Storybook stays is the Architect's call in Phase 4 |
| Root `Website prompt based on B + inputs - 24-Jul.pdf` (5.0 MB), `….docx` (6.2 MB), `Websit prompt … .docx` (3.4 MB) | Ignored (`.gitignore:35,60`) | 14.6 MB | EV1: none | FOUNDER ([Q5](../open-questions.md)) | The PDF duplicates a tracked file (section 4); the two .docx differ from each other and exist nowhere else |
| `pitch-deck/` | Ignored (`.gitignore:65`) | not measured | Not opened | FOUNDER ([Q5](../open-questions.md)), out of scope | Investor material |
| `.env`, `.env.local`, `.claude/settings.local.json` | Ignored | n/a | n/a | **KEEP**, never touch | Secrets and local settings (brief §4.7) |

## Open questions this page waits on

All are in [open questions](../open-questions.md); this page owns none of them.

| ID | Question | Rows here | Until answered |
|---|---|---|---|
| Q2 | PR #16, `origin/redesign-mockup-2026-10` and its previews; the merged remotes `origin/lumi-rabbit` and `origin/security-hardening` | §2, §6 | Nothing remote is deleted |
| Q5 | Ignored local files (photoshoot, root documents, `pitch-deck/`, `.agents/`, caches) and `security-review.md` | §2, §3b, §5, §7 | Nothing ignored or untracked is deleted |
| G3 | Imagery beyond the DS: team photos, recognition and partner marks, the 7 customer films, app screenshots | §3a, §7, [public/ assets](cleanup-public-assets.md) | The files stay in place |
| C8 | Does the Vercel dashboard override the build command? | Trap 1 | Check before the build-script change merges to `main` |
| C9 | Is any `kheelona.com` asset URL linked from social posts or partner pages? | Every `public/` deletion | Branch deletions need not wait (the tag restores any file); answer before Gate B deploys them, since production is untouched until then (brief §4.5) |
| C3 | Any product feed outside the repo (it could name image URLs) | Evidence | Same as C9 |

## Gaps

- **External references to asset URLs, partly checked.** Meta ad creatives (EV14): none names a
  `public/` asset. PostHog has no action or insight keyed on a URL (EV15). Still unknown: organic
  social posts and partner sites ([open questions](../open-questions.md) C9), and any feed outside
  the repo ([open questions](../open-questions.md) C3). EV14 is the warehouse's last sync, not Ads Manager.
- **No Vercel access** (the dashboard is the founder's and the CLI is not used): previews were found only
  through GitHub deployment records, the build-command override was not checked
  ([open questions](../open-questions.md) C8), and request logs for static assets were not read.
  PostHog does not record static-asset requests.
- The reachability scan follows static imports and `import()` only; the unused-export scan is a
  word-boundary grep. Dynamic asset paths were read by hand (mascot poses, video moments).
- `pitch-deck/` was not opened, by instruction.
