---
name: gemini-asset-pipeline
description: Gemini renders/Veo shots are FOUNDER-generated from Claude prompt kits (hard rule); ingest from ~/Downloads; recipes in repo docs
metadata: 
  node_type: memory
  type: project
  originSessionId: 3f76f5ad-1ca6-488a-b052-f8e61f9b574c
  modified: 2026-07-31T12:46:16.064Z
---

**Hard rule (founder directive 2026-07-07, in CLAUDE.md hard gates): Claude never drives gemini.google.com. Claude prepares a kit (reference images + copy-paste prompts + quality checklist — pattern: `gemini-handoff/README.md`), the founder generates and downloads to `~/Downloads`, Claude ingests from there.** The earlier browser-automation route works but is fragile (Chrome download prompts freeze all injected input; recipes and workarounds are archived in `docs/qa-report.md` asset-quality entry and `design-concepts/README.md` "Gemini image/video pipeline") — reference only, do not repeat.

Session state 2026-07-08 (SHIPPED + COMMITTED, 001fe78):
- Film LIVE on site (FilmTwoFriendsVeo 25s → launch.mp4 3MB + poster). Site is 2D EVERYWHERE (all GLBs/R3F/three deps removed; MascotScene parallax carries the dimensional feel). Repo cleaned of superseded drafts/renders/teasers. keycut UNION mode is the final cutout recipe.
- Open: optional Cuddle shot (extends film to ~900f), colorway strip (cut-lumi-green/pink staged, copy founder-gated), launch-critical FOUNDER-TODO items (Tally URL, Vercel auth).
- Quality gates when ingesting renders: hat ends in a thin lavender ribbon curling up (never a pom-pom — Gemini's favorite error), spine spikes top→bottom peach/yellow/lightblue/purple/green, pale blue soles. Thin ribbons get eaten by the Vision cutout → use `tools/cutout/keycut.swift` hybrid mode.
- The real 2025 photoshoot toy is PINK (relevant to the approved pink colorway).

**BAKED-BACKGROUND TRAP (2026-07-31, cost a re-ship of the favicon).** `sips -g hasAlpha` returning
`yes` is NOT proof an asset is cut out: `public/brand/logo-mark.png` reports alpha yet is fully opaque
across the original canvas, so the K mark sits on a solid white plate. It looked fine on the site's
white header and shipped a white box into every dark browser tab. **Always composite a "transparent"
asset over a DARK background and look before using it.** Fix is `tools/cutout/keycut <in> <out> 40`
(region-grow key; tol 40 left the least edge residue). Note that keying a plate also removes any
white keyline contiguous with it — usually an improvement at icon sizes, but check. Related: the
design-system copy `Design/design-system/assets/logo-mark.png` is still a FIGMA SCREENSHOT, not a
logo; and iOS app icons must be OPAQUE (transparency renders black), plated in footer cocoa #2A1608
per founder call, never brand orange (the orange K disappears into it).

See [[feedback-founder-working-style]] for why the human-in-the-loop split exists and [[project-kheelona-com-build-prompt]] for overall project state.
