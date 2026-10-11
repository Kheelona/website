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
