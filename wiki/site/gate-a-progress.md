---
title: "Gate A progress: every page mockup, its copy, review and fix status; how to resume"
type: tracker
updated: 2026-10-11
sources: [../decisions/D043-all-pages-as-mockups-before-build.md, ../decisions/D044-app-screens-on-the-site.md, ../../mockup/build.mjs, ../../mockup/tools/check.cjs]
---

# Gate A progress (D043): all pages as mockups

**Gate A APPROVED 2026-10-11 (D046).** Pending items below move into Phase 5 QA. **Read this first when resuming.** The founder reviews every page together through one private link;
their approval of the set is Gate A, then Phase 4 and the build (D043). Workflows were stopped on
2026-10-11 at ~13:05 PDT because the account's quota ran low; everything below is on disk.

## How the mockups work

- One body per page: `mockup/pages/<slug>.html` (meta comment first), page CSS in `mockup/css/<slug>.css`.
- Shared parts: `mockup/partials/` (nav, footer, buybar, drawer), `mockup/mockup.css`, `mockup/mockup.js`.
- Build: `node mockup/build.mjs [slug …]` writes `mockup/<slug>.html`. `mockup/index.html` = review index.
- Check: `node mockup/tools/check.cjs <outDir> <slug …>` (screens at 360/390/1440, sideways scroll via
  clientWidth, page errors, axe; white-on-Chilli reported as the D041 exception).
- Copy for each page: `wiki/site/pages/<slug>.md` (copy and mockup must match).
- Publishing: `python3 mockup/_work/build_artifact_multi.py` (local only) builds the whole set into
  `mockup/_work/artifact/` (index = main page fragment, every other page a full file, `files.json` = the
  publish map). **v4 (all pages preview) was published 2026-10-11 13:30 PDT** to the link below.
- Local-only work files (never commit; listed in `.git/info/exclude`): `mockup/_work/` (app-demo frames,
  edited screenshot masters and their scripts, the artifact builder) and `mobileapp-live-demo-oct2026.mp4`.

## Page status

| Page (slug) | Real URL | Copy | Mockup | Review | Fixes |
|---|---|---|---|---|---|
| home | / | ✓ (home.md, round 2; hero D045; fold 7b D046) | ✓ | CMO v2 ✓; v3-v6 changes not re-reviewed | hero (D045), captions, phone sizes, Myra, guides fold (D046) |
| meet-kheelu | /products/kheelu | ✓ | ✓ | **pending** | pending |
| safety | /safety | ✓ | ✓ | **pending** | pending |
| ai-toys-for-kids-in-india | /ai-toys-for-kids-in-india | ✓ | ✓ | **pending** | pending |
| stories (hub) | /stories | ✓ | ✓ | **pending** | pending |
| story-learning-toys-for-a-three-year-old | /stories/… | ✓ | ✓ | **pending** | pending |
| story-what-to-look-for-in-a-safe-ai-toy | /stories/… | ✓ | ✓ | **pending** | pending |
| story-talking-toys-and-late-talkers | /stories/… | ✓ | ✓ | **pending** | pending |
| team | /team | ✓ | ✓ | CMO: pass with fixes ([review](../qa/cmo-review-pages-help-2026-10-11.md)) | **pending**: first screen must say what Kheelu is, the age band, the search term |
| setup | /setup | ✓ | ✓ | CMO: pass with fixes | **pending**: step 2 states two values the app shows as placeholders; the screenshot still shows "Games" (fixed by the activity re-edit) |
| contact | /contact | ✓ | ✓ | CMO: pass (5 should-fix) | optional |
| 404 | (any) | ✓ | ✓ | CMO: pass (1 should-fix) | optional |
| privacy | /privacy | ✓ (draft) | ✓ | **pending** (legal verifier) | pending |
| terms | /terms | ✓ (draft) | ✓ | **pending** (legal verifier) | pending |
| refund | /refund | ✓ (draft) | ✓ | legal: done ([review](../qa/legal-review-pages-legal-b-2026-10-11.md)) | ✓ applied |
| shipping | /shipping | ✓ (draft) | ✓ | legal: done (same review) | ✓ applied (with refund) |
| store | store.kheelona.com | ✓ | ✓ | **pending** | pending |
| store-confirmation | store.kheelona.com/thanks | ✓ | ✓ | **pending** | pending |
| Cross-page check (links, same facts everywhere, CTA values, SEO per URL) | – | – | – | **not run** | – |

## App screenshots (D044) in `mockup/assets/app/`

| File | State | Remaining |
|---|---|---|
| app-privacy.webp (576×1032) | **Round 2 done, verified**: banner cropped, 36 months, Kheelu | – |
| app-transcript.webp (576×1209) | Round 1 only | Round 2: first line "Kheelu remembers! Hello, Aarav. Ready to hop for bubbles again?"; remove the AI summary card; app-bar title "हिंदी में बातें" without the overlap |
| app-activity.webp (576×1209) | Round 1 only | Round 2: remove Games (legend and bar); Chats = 3; card 2 title "हिंदी में बातें"; previews in the app's own format |

The round-2 spec is in [D044](../decisions/D044-app-screens-on-the-site.md) and in the workflow script
`~/.claude/projects/-Users-apoorvasahu-Documents-kheelona-com-website/a7840453-29e0-4cce-aaef-7d40bff98747/workflows/scripts/app-screens-round-2-wf_552b667d-b1e.js`
(its paths point at the old session scratchpad; the same files now live in `mockup/_work/appshots/`).

## Resume plan (in order)

1. Finish the two screenshots (round 2 above).
2. Run the pending reviews and fixes: CMO for meet-kheelu, safety + buyer's guide, stories + 3 articles,
   store + confirmation; the legal verifier for privacy + terms; apply the team/setup fixes. The
   all-pages workflow script is
   `…/workflows/scripts/all-pages-mockups-wf_0391b3a0-0fc.js` (same folder as above); its copy and build
   steps are done, so a re-run should start at review.
3. Cross-page check, then `node mockup/build.mjs` and the checks for every page.
4. Rebuild and republish the set (`build_artifact_multi.py`, then the Artifact publish with `root` = repo
   and the map in `files.json`) to https://claude.ai/artifact/W6XpUUMXhdubxb4fvJpYxa; update the index's
   status note (`mockup/pages/index.html`). **A new Claude account cannot update this artifact** (it belongs to
   the current account): publish a new artifact from the new account and record it in
   [artifacts](../engineering/artifacts.md).
5. Rewrite `mockup/APPROVAL.md` as the full-set approval pack; tell the founder all pages are ready.
6. Commit locally, staging by name (never `mockup/_work/` or the demo video); nothing has been committed
   since `c0f1668`.
