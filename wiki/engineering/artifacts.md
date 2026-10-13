---
title: Published artifacts catalogue
type: catalogue
updated: 2026-10-12
sources: [../raw/brief/kickoff-brief.md (§9.12 "Published artifacts", "Catalogues"), ../../mockup/APPROVAL.md, ../decisions/D048-beta-deployment.md, ../decisions/D049-motion-picks.md, architecture.md]
---

# Published artifacts catalogue

Every deliverable published with the Artifact tool, published once and updated in place for every
revision (brief §9.12). **Check this page before publishing anything**: a context reset must never
lead to a second copy. To update an artifact from a new session, pass its URL as `url` after reading
it (`action: "read"`); publishing without the URL creates a separate artifact.

| Artifact | URL (private to the founder) | Source | How it is built | Used for | Versions |
|---|---|---|---|---|---|
| Kheelona page mockups (was "Kheelu homepage mockup") | https://claude.ai/artifact/W6XpUUMXhdubxb4fvJpYxa | `mockup/index.html` (the frozen Gate A reference) | A publish copy of `mockup/index.html`: the page as a fragment, DS files (`tokens.css`, `bundle.css`, fonts, the images it uses) and `mockup.css` / `mockup.js` published beside it under `ds/…` paths with no spaces. The films are published beside the page under `films/` (each ≤ 4 MB; one publish ≈ 26 MB of 64 MB) | Gate A review on the founder's phone ([approval pack](../../mockup/APPROVAL.md)) | v1 2026-10-11 ("Gate A v1"); v2 2026-10-11 ("Gate A v2", CMO visual fixes); v3 2026-10-11 ("Gate A v3": the seven parent films as `films/*.mp4|jpg`, from `public/video/moments/`; more DS children; Kabir frame zoomed; `#ink` preview removed, D041); **v4 2026-10-11 ("All pages preview (v4)")**: the review index is the main page, all 18 pages served beside it (95 files, ~31 MB), built by `python3 mockup/_work/build_artifact_multi.py` (local only) and published with `root` = the repo and the map in `mockup/_work/artifact/files.json`. Owned by the account in use on 2026-10-11: a different Claude account cannot update it (publish a new artifact and add a row); v5 2026-10-11 ("v5: hero chosen (D045)", home and index only); **v6 2026-10-11 ("v6: Gate A approved (D046)")**: the approved set |
| Kheelu motion options | https://claude.ai/artifact/XgoMduGs3cLTaWawJ7RE5w (account apoorva@geekyants.work) | `mockup/_work/motion/` (local: build.py, motion.css, motion.js) | `python3 mockup/_work/motion/build.py`, published with `root` = repo and DS files under `ds/` | The founder picks one of three motion options for each of 8 places (answered: [D049](../decisions/D049-motion-picks.md)) | v1 2026-10-12 |

## Notes

- **Phase 4 (2026-10-12):** only the motion options page above was published (by the main session, for D049). From Phase 5 on, the founder reviews the built site on the
  beta hosts (betawebsite.kheelona.com, betastore.kheelona.com, [D048](../decisions/D048-beta-deployment.md);
  [architecture §15.4](architecture.md#154-founder-runbook-the-beta-vercel-dashboard-and-cloudflare-only-never-the-cli)).
  Those are deployments, not artifacts, and are not listed here. If a report or preview is ever published
  as an Artifact again, add a row first; the mockups row belongs to the previous Claude account and cannot
  be updated from a new one.

## Test support (never published)

Recorded here so a later task finds it before writing another (wave-3 close, "One of each helper"). Not an
Artifact: it lives in the repo, outside `src/`, and only tests import it.

| Support | Path | What it does | Used by | Task |
|---|---|---|---|---|
| Mockup comparison harness | `test/support/mockup-compare.ts` (its own test beside it) | Reads the approved Gate A mockup (`mockup/<slug>.html`: `mockupPage` shared, `parseMockup` fresh, `mockupFold`, `mockupCtaRun`), ports what the build prints differently (`mockupRoute`: a page file read as its route, store.html as the build's store; `portClass`: `mk-` to `ks-` or a test's rename table; value markers dropped, N22), and compares four ways: exact markup (`builtMarkup`, `renderedMarkup`, `canonical`, `asBuilt`; the 3.2 sections), skeleton and words (`skeleton`, `words`; the 3.4 sections), outline (`outline`: tags, ported classes and reveals down to the media primitives; the 3.3 sections, which compare their words apart), element by element (`mockupDiff`; the shells). Replaced `sections/CtaBlock/mockup-fold.test-support.ts`, `sections/ArticleBody/__fixtures__/approved-fold.ts` and `layouts/SiteShell/mockup-diff.ts`; since 4.5 also the own readers of five ui tests (`Checkbox`, `Field`, `Select`, `PolicyLinks`, `InAppBrowserNote`: exact markup, `canonical` of `asBuilt(mockupFold(…))`, their links written as the routes the mockup's addresses became) and of `ui/Tabs/approved-tabs.test-support.ts` (`mockupPage`, `mockupFold`) | Every section test that compares with the mockup (3.2, 3.3, 3.4 sections), both shells' parity tests, the legal template's test, and the ui tests above | 3.6, 4.5 |
| Page facts against the frozen mockups | `test/e2e/support/page-facts.ts` (data, Playwright-safe) and `test/support/mockup-facts.ts` (DOM) | The founder's page facts after Gate A (D055, D054 items 12 and 19) as accepted changes to each frozen mockup: per page, `edits` (`fill` a placeholder, `hide` the row or line around one, `reword` an approved element; matched by selector and words, first unused match in document order, an unmatched edit throws) and the sentences they change (`mockup`, `build`). `withFacts` applies the edits to a clone of the mockup's `main`, so a route or content test holds the build to it, markup and words alike; `blockSentences`, `factSentences` and `ruleReach` prove the listed sentences are exactly the ones the edits change and exactly what the page's text-parity rule (`deviations.ts`, `pageFacts(slug)`) excuses and accepts | The route and content tests of `/privacy`, `/refund`, `/shipping`, `/terms`, `/setup` and `/products/kheelu`, their parity-deviations tests, `test/e2e/support/deviations.ts` | 6.7 |
