---
name: tripo3d-mascot-pipeline
description: Tripo3D pipeline for Kheelona 3D assets — v3 mascot verified 2026-07-09 (rigged, clip-less, procedural idle on site); founder now drives the UI themselves; Lumi v3 pending
metadata:
  node_type: memory
  type: project
  originSessionId: 4e9c5c38-2812-4aba-b525-35791dfdb732
---

For [[project-kheelona-com-build-prompt]]: 3D assets are generated on **Tripo3D via the web UI** (studio.tripo3d.ai, founder logged in Chrome). The REST-API route was abandoned — `TRIPO_API_KEY` in the repo-root `.env` stayed a dummy; do not plan around it.

**Current state (2026-07-09, for the immersive redesign):** the founder now drives the Tripo UI THEMSELVES from Claude-prepared kits (`3d-handoff/README.md`), Claude verifies from `~/Downloads` — same split as the Gemini rule.
- **Mascot v3 FINAL:** `3d-handoff/exports/kheelona-mascot-v3-raw.glb` (+ meshopt `-1k.glb` 524KB / `-2k.glb` 714KB). Pipeline: high-detail gen (1.96M faces) → Retopo 30,192 → texture regen after bake degraded (front-ref, style None) → auto-rig v2.5 Animals/Humanoid. All visual gates pass (no Janus, wink, K mark). **Animation presets retarget-break the chibi body (wait/idle crumple it) → founder decision: ship CLIP-LESS rigged GLB; the site does the idle procedurally.** Skeleton verified post-compression: 42 bones incl. `Head`, `NeckTwist01/02`, `Spine01/02`, `Hip` — drive Head for cursor-follow, Spine for breathing. 20 skinned meshes, 1 material.
- **Lumi v3 pending:** founder generating (retopo ~20k, texture check, GLB export Pack UV ON + Bottom Center Pivot ON, NO rig).
- The v2 GLBs live only in git history (commit 3556157); superseded by v3.
- Credits: ~470 as of 2026-07-09 morning. Verification harness: scratchpad `viewer.html` (three + MeshoptDecoder) + `sheet.js` (Playwright 8-angle contact sheet); gltf-transform `optimize --compress meshopt --no-simplify` for rigged models.

**How to apply (if generating again):**
- Clean the input images first with `tools/cutout` (Vision subject lift) — dirty inputs with shadows/stray fragments were the likely cause of the v1 two-face artifact.
- The extension's `file_upload` tool no longer accepts host paths. Use the relay trick: serve inputs on `127.0.0.1:<port>` (python http.server, loopback bind), arm a `postMessage` listener + one-time click handler in the Tripo tab that `window.open`s the relay page (real click = user activation), then inject received bytes into the slot `<input type=file>` via `DataTransfer` (find inputs by slot label text, never by index).
- Verify exports OFFLINE before accepting: render an 8-angle contact sheet in a local three.js page (drag-orbit in Tripo's viewer does not respond to synthetic pointer events).

**Browser-automation gotcha (this project):** Chrome throttles IntersectionObserver/rAF/video in unfocused tabs — the site's 3D hero and reveals can look missing/inert in automated captures while being fine for real users. One real interaction (scroll/click) wakes them. Also: full-page screenshots often drop animated composited layers; use `zoom` on the region or JS DOM probes to verify.
