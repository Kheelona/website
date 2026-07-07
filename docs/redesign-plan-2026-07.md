# Ground-up immersive 3D redesign — kheelona.com

## Context

The founder has rejected the current site design: "it feels like we have forcefully put together various sections. It does not look like one single flowing smooth website." The new mandate is a completely immersive design that parents love and that stays informative, featuring a browser-native interactive 3D scene (WebGL/React Three Fiber), not a flat video background. **Content/copy is okay and stays; UI/UX/design is rebuilt from the ground up.**

This explicitly reverses two recorded decisions, with founder authority:
- "2D everywhere" (2026-07-08, commit `3bc6e02`) — R3F/three.js/GLBs return.
- "3D on site stays SUBTLE" (2026-07-06) — the new target is immersive.

Both reversals get recorded in `docs/project-state.json` approvals and `docs/website-steps.md` when execution starts.

**What is NOT reopened** (inherited hard gates):
- Copy verbatim + voice-lint (zero em-dashes, no hype, exact names). Copy currently lives inline in section TSX files, so the rebuild must transplant strings exactly (they carry `Copy verbatim` comments and `TODO(claims-*)` markers).
- Lighthouse Accessibility/BP/SEO 90+ every page; Perf 90+ desktop. All copy SSR'd and readable without JS; the 3D layer is decorative (`aria-hidden`), never the copy carrier.
- `prefers-reduced-motion` → static; `saveData` → light; no-WebGL → graceful fallback.
- Design tokens locked from `Design/design-system/` (palette, Glory/Instrument Sans/Instrument Serif).
- Never invent claims; Tally finale; ParentVoices stays unmounted until real quotes.
- All external AI generation (Gemini/Veo/Tripo) is founder-run from Claude-prepared kits.

**Founder decisions from this planning round** (2026-07-08):
1. Wireframes = interactive HTML mock-ups (like the earlier concept round: real tokens + copy, CSS-approximated motion, annotated 3D beats).
2. Scope per direction = full Home + one interior page (`/products/lumi`) + nav model.
3. 3D assets = hybrid: founder generates character models from a Claude-prepared handoff kit (which images, which tool, which format — Claude guides); the world itself is built from brand shapes + approved cutouts.
4. Mobile = adaptive tiers (full 3D on capable devices incl. modern phones; automatic lite tier on low-end/save-data/reduced-motion).
5. **FOUR directions, not three**: the founder likes the Storybook direction itself — what's rejected is its current UI/UX execution (stacked sections). So a fourth wireframe rebuilds the storybook feel natively on the new immersive-3D path.

## Prior art to avoid repeating

The 2026-07-06 concept round produced A·Storybook (warm washes — became the current rejected site), B·Playmat (white canvas + shape clusters — rejected then, but the lane is untried at 3D fidelity), C·Sunshine (color blocks — its finale shipped). Founder clarification (2026-07-08): **the storybook direction itself is liked; what's rejected is how it was put together** (flat stacked sections). So direction 4 keeps the storybook soul but rebuilds it as a native 3D experience, while directions 1–3 explore genuinely new metaphors. The founder's core complaint is *stacked sections*; all four directions are built around **one continuous spatial experience** where the locked Home content beats become places/moments in a single scene instead of stacked blocks.

## The four wireframe directions

All four: same locked copy beats (Hero → intro → why-we-exist → feelings → Meet Lumi → PlayOS → compare → safety → journal → finale), same tokens/fonts, mascot as the star, Tally finale. They differ in world metaphor, camera behavior, and where immersion comes from.

### Direction 1 — "Lumi's World" (the journey)
One persistent warm dreamscape built from oversized brand shapes: flower meadows, squircle hills, floating polygon clouds, soft depth fog. Scroll = a slow camera dolly along a path through the world; every content beat is a *place* (hero clearing → feelings grove with the five mascot poses among flowers → Lumi's home → PlayOS sky with voice-wave particles → teal safety garden → journal meadow → orange sunset finale). The mascot travels with you as guide. World color grades continuously between the wash tones; there are no section edges at all. Metaphor: a bedtime-story journey. Most cinematic of the three.

### Direction 2 — "A Day with Lumi" (the conversation)
The camera never travels; it stays in one intimate space, a soft abstract child's corner where the mascot and Lumi sit together. Scroll moves the scene through the *moments of one day*: morning hello (hero) → curious questions (feelings, each pose swapped in beside Lumi) → learning play (PlayOS beats as glowing voice-threads between the two characters) → calm-down moment (safety) → goodnight under a warm lamp (orange finale). Light does the storytelling: cream dawn → sun midday → teal dusk → orange lamplight. Copy reads as the dialogue around the pair. Immersion from lighting, depth-of-field and voice particles rather than travel. Metaphor: what life with Lumi feels like. Most intimate; mirrors the product itself; benefits most from the founder-generated character models.

### Direction 3 — "The Playmat" (the tabletop)
The untried B lane at 3D fidelity: an endless bright cream-white playmat seen from a soft high angle, scattered with chunky physical brand-shape toys (extruded flowers, squircles, triangles with plush-soft shadows). Scroll glides the camera across the mat between play zones; content sits on flat cards laid on the mat among the toys. Shapes wobble gently away from the pointer (playful physics-lite); the mascot hops zone to zone. Feelings zone = five tinted shape-circles each holding a pose; compare zone laid out like a board game; the finale = the mat tilts up into the orange card. Metaphor: playing on the floor with your child. Cleanest and most modern; least dependent on character models.

### Direction 4 — "The Pop-up Storybook" (the storybook, reborn in 3D)
The loved storybook feel rebuilt natively in 3D instead of flat washes: the whole site is one giant pop-up book seen from a reader's gentle angle. Scrolling turns the pages in one continuous motion — and each content beat is a pop-up spread where layered paper-craft scenery (brand-shape suns, flower meadows, cloud arches in the wash colors) rises and unfolds as the page opens. The mascot hops from spread to spread like the story's hero; Lumi pops up at Meet Lumi; the safety spread unfolds a sheltering teal canopy; the last page opens into the orange finale with the character lineup standing up out of the page. Page-turns replace section seams entirely — the exact cure for "forcefully put together." Warmth from soft paper depth and the cream palette, not flat washes. Metaphor: the bedtime book you read together. Closest to the brand's existing soul; the round's "evolve what you loved" option against three fresh metaphors.

## Execution — Stage A: wireframe round (before any site code changes)

Deliverables, all in a new `design-concepts/round-2-immersive/`:
1. `direction-1-world.html`, `direction-2-day.html`, `direction-3-playmat.html`, `direction-4-popup-book.html` — single-file, full-scroll interactive mock-ups: real tokens/fonts (reuse the asset approach of `design-concepts/concept-a.html` et al.), real verbatim copy, CSS transform/parallax approximations of the camera behavior, and inline annotation chips describing exactly what the live 3D scene does at each beat ("3D: camera dollies into the grove; five mascots turn toward the cursor").
2. Inside each file: the `/products/lumi` interior treatment (second scroll region or linked second file) + the nav model (how navigation works inside a continuous experience: progress rail / chapter dots / classic navbar hybrid).
3. `README.md` — one-paragraph pitch per direction + how to view.
4. Browser-verify each mock-up (screenshots at 1280 + 375), then send all three to the founder for the pick. Known gotchas honored: `overflow-x: clip`, no scroll-snap wheel traps, reduced-motion media queries even in mock-ups.

Also in Stage A, so generation runs in parallel with the founder's review:
5. `3d-handoff/README.md` — the founder's model-generation kit (gemini-handoff pattern):
   - **Mascot (rigged, idle clip)** — source images: the front/side/back cutout set recoverable from git (`git show 5e69528:site/public/tripo-inputs/mascot-{front,side,back}.png`) refreshed with today's approved cutouts in `site/public/mascot/`; tool: Tripo3D web UI (745 credits, settings already proven: Smart Mesh, multi-view, ~10k–20k polys, 2K texture, auto-rig "Good for Animals" → idle preset); export **GLB with skeleton + animation track**; download to `~/Downloads`.
   - **Lumi plush (static)** — source images: the NEW approved 4-view Gemini set `Design/product-images/generated-2026-07/cut-lumi-{blue,blue-left,right,back}.png` (better inputs than the v1 attempt the founder judged low quality); same recipe, no rig; export **GLB**.
   - Quality gates in the kit: hat ribbon (thin lavender curl, never pom-pom), spike order (peach/yellow/light-blue/purple/green), single face (no Janus), foot pads pale blue. Claude verifies from 8 angles in a local viewer before accepting (contact-sheet pattern from `design-concepts/README.md`).
   - Models are needed for the build, not the wireframes; directions 3 and 4 can ship without them (shapes + layered cutouts carry those worlds), direction 2 leans on them hardest.

**GATE: founder picks one direction (and can redline it). No site code changes until the pick.**

## Execution — Stage B: build the picked direction

### Technical architecture (validated by a dedicated architecture study; shared across all four directions)

**Prime directive:** the current 2D server-rendered page IS the product for crawlers, no-JS, reduced-motion, saveData and no-WebGL users. The 3D stage is a decorative client-only layer that crossfades the *environment* in on capable devices — the deleted `MascotHero` pattern (static image always mounted, gated `aria-hidden` 3D layer, crossfade on ready) promoted from one component to the whole page.

**Canvas model.** ONE persistent `<Canvas>` — `position: fixed; inset: 0; z-index: 0; pointer-events: none; aria-hidden` — behind the DOM (`main` at z-10). **Native scroll only**: drei `ScrollControls`, Lenis and scroll-snap are all disqualified (hijack native scroll; break sticky navbar, `#reserve` anchors, the `overflow-x: clip` contract, and the documented wheel-trap gotcha). Instead: each content section wraps in a thin `<Beat data-beat>` server component; a beat registry measures rects once (re-measures on `ResizeObserver`), a passive scroll listener writes into a vanilla zustand store (zustand ships inside R3F — zero new deps), and the scene reads `{activeBeat, beatProgress, globalProgress}` transiently in `useFrame` (no React re-renders), damping toward targets via `THREE.MathUtils.damp` (the old `HeroScene` idiom). Camera = `CatmullRomCurve3` position + look-at paths with per-beat dwell easing. The camera path control points and world dressing are the ONLY direction-specific layer — all four wireframe directions sit on identical infrastructure (direction 4's page-turn is camera + hinged plane groups on the same rig).

**The wash handoff (the "one flowing site" fix).** Today's opaque section washes + CurveDividers ARE the fallback experience. `Section`/`CurveDivider` gain `data-wash`/`data-curve` attrs; once the scene paints its first frame, `html.scene-3d` is set and CSS fades the DOM washes to transparent while the scene's background/fog lerps through the SAME wash tokens (cream→cool→teal→sun→orange) keyed to beat progress — the founder's color journey becomes one continuous gradient instead of hard-joined blocks. On `webglcontextlost` or mid-session reduced-motion, `scene-3d` is removed and the washes fade back — live degradation, never a blank screen.

**Gating (`StageGate.tsx`, generalized MascotHero).** Server + first client render return null (zero hydration mismatch). Then gates in order: reduced-motion → saveData → WebGL2 probe → device tier → wait for `window` load + `requestIdleCallback` (whole-page stage must never compete with LCP; LCP stays the hero H1/static PNG). Only then `dynamic(() => import('./ThreeStage'), {ssr:false})` (confirmed legal in the modified Next: client components only).

**Adaptive tiers** (founder decision — lite tier explicitly targets mobile; the old `pointer:fine` gate is dropped):
- `full` (desktop-class): DPR [1, 1.75], antialias, both GLBs, sparkles/contact shadows, full instance counts, `frameloop="always"` (pause on tab hidden).
- `lite` (most phones): DPR [1, 1.5], no antialias, reduced actors/instances, 30fps invalidate ticker, `frameloop="demand"`.
- `static`: reduced-motion / saveData / no WebGL2 / very low-end / runtime demotion → stage never mounts; today's site. drei `PerformanceMonitor` + `AdaptiveDpr` demote full→lite→static at runtime.

**Assets.**
- Founder-generated GLBs (Stage A `3d-handoff/` kit) land in `~/Downloads` → 8-angle contact-sheet verification (pattern in `design-concepts/README.md`) → compress → `site/public/models/`. Git-history GLBs (`git show 3556157:site/public/models/*.glb`, blobs verified present) are development stand-ins until then.
- Compression: gltf-transform with **meshopt, not Draco** (drei bundles the meshopt decoder; Draco pulls a ~300KB decoder from a Google CDN). Mascot gets `--no-simplify` (simplification corrupts skin weights on the rigged idle clip; verify the clip plays post-compression in a dev playground route). Textures capped 1024px WebP; KTX2 kept as an escalation lever only if mobile memory profiling demands it.
- 2D art as depth-layered alpha planes (`SpriteCutout`: plane + `alphaTest`, optional Billboard): mascot poses + Lumi cutouts resized to ≤768/1024px WebP copies (resizing existing approved assets, not generation).
- Brand shapes: the 7 SVG paths move to a shared `site/lib/shape-paths.ts` (DOM `Shapes.tsx` keeps identical rendering); scene extrudes them via `SVGLoader` from `three-stdlib` (not `three/examples/jsm` — Turbopack resolution) + `ExtrudeGeometry`, cached per kind; fields via drei `<Instances>` (one draw call per shape kind, per-instance token colors; ≤80/kind full, ≤30 lite).

**Code structure.** New `site/lib/three/` (`tier.ts`, `scroll-store.ts`, `beats.ts`, `tokens.ts` JS mirror of the `@theme` colors, `shape-geometry.ts`) and `site/components/three/` (`StageGate`, `ThreeStage`, `CameraRig`, `WashBackdrop`, `directions/{journey,conversation,playmat,popup-book}.tsx` — only one survives the pick, `chapters/` one per content beat, `actors/` MascotModel/LumiModel/SpriteCutout/BrandShape/ShapeField, plus the restored `MascotHero`/`HeroScene`/`LumiHero`/`LumiTurntable` for subpage insets). Untouched survivors: `Reveal`/`RevealObserver`, `TallyEmbed`, `Faq`, `CompareTable`, `Navbar`, `Footer`, `StickyMobileCTA`, `Button`, `Eyebrow`, `lib/stories*`, `MascotScene` (it IS the lite/static hero). `motion` stays for DOM only — no `framer-motion-3d` (incompatible with R3F 9/React 19). Copy is transplanted verbatim from the current section components (they are the copy source of record in code).

### Build order (each phase has a hard checkpoint)
0. Record both decision reversals in `docs/project-state.json` + update `docs/website-steps.md` (blueprint is law) with the chosen direction's beat/wash storyboard; work on a branch — the current site stays intact until swap.
1. **Deps + assets**: read `node_modules/next/dist/docs/` first (modified Next warning); `npm i three@^0.185.1 @react-three/fiber@^9.6.1 @react-three/drei@^10.7.7` (the exact trio proven in this repo at commit `3556157` with Lighthouse 99 desktop) + `@types/three`; restore + optimize GLBs; dev playground route to verify idle clip + Turbopack build + single `three` instance. Checkpoint: build green, Lighthouse `/` unchanged, three absent from entry chunks (`next experimental-analyze`).
2. **Infrastructure**: tier/store/beats/StageGate/ThreeStage with empty scene + WashBackdrop + wash-handoff CSS. Checkpoint: continuous animated wash gradient behind unchanged copy; no-JS and reduced-motion render today's site pixel-identical; Lighthouse ≥ current.
3. **Hero beat vertical slice** (LCP-critical, validate first): CameraRig + chosen direction skeleton + MascotModel crossfade over the static PNG. Checkpoint: desktop Perf ≥90 (target 95+), LCP element still H1/PNG, TBT delta <50ms, mobile ≥85 on Moto-G-class throttle.
4. **Remaining chapters** in page order (Feelings = 5 SpriteCutout poses, MeetLumi = LumiModel, Finale = shape-field celebration settling on the orange CTA wash). Checkpoint per 2–3 chapters: full-scroll run at 6× CPU throttle, dropped frames <10%.
5. **Founder GLB ingest** when ready (contact-sheet gate → meshopt → swap stand-ins).
6. **Tiers + interior pages**: lite budgets + demotion wiring; `/products/lumi` per its approved wireframe (restored LumiTurntable inset via drei `<View>` if needed); remaining 7 routes get the direction's language with light ambient variants.
7. **QA matrix** (below) → founder screenshot review on the localhost:3456 prod build → iterate → commit per milestone.

### Known risks (each has a planned mitigation)
- Modified Next 16.2.10 / Turbopack: bundled docs consulted (confirmed: Turbopack default, `dynamic ssr:false` client-only, `experimental-analyze`); `turbopack.resolveAlias` fallback for three subpath issues; prefer `three-stdlib` imports.
- Hydration: gates start false on server and first client render; `matchMedia`/`navigator` only in effects.
- iOS Safari: DPR cap 1.5, texture budget <48MB decoded on lite, `powerPreference: low-power`, `svh` not `vh` in the hero, context-lost/restored handlers, real-device test.
- Scroll jank: transient store (no setState on scroll), cached rects, passive listeners, no backdrop-blur scrims on mobile, fixed canvas is compositor-static.
- Copy-over-canvas contrast: every copy block over active 3D gets a readability treatment (calm scene region per beat, or a soft token-tinted DOM panel); verified manually per beat — Lighthouse can't audit canvas backgrounds.
- Perf 90+ desktop is the binding gate: if a page can't hold it, the scene budget shrinks (instances, DPR) before anything else gives.

## Verification

Stage A (mock-ups): browser-verify each direction at 1280 + 375 with screenshots; reduced-motion media query respected even in mock-ups; voice-lint grep for `—` empty; founder receives files + screenshots for the pick.

Stage B (the build), logged in `docs/qa-report.md` per repo convention:
1. Lighthouse desktop + mobile on all 9 routes: A11y/BP/SEO ≥90 everywhere, Perf ≥90 desktop / ≥85 mobile; LCP element assertion (stays H1/static PNG).
2. No-JS audit: every page fully readable with JavaScript disabled (stage never mounts, washes intact).
3. Reduced-motion audit: OS setting on → today's static site; also toggled mid-scroll → stage tears down cleanly.
4. saveData override → no GLB/three network requests.
5. No-WebGL (`--disable-webgl2`) → static site, zero console errors; simulated `webglcontextlost` → washes fade back live.
6. Low-end throttle (6× CPU, Fast-3G, Moto-G profile) → lite tier engages, scroll stays responsive, dropped frames <10%.
7. Cross-browser: Chrome/Firefox/Safari desktop, Android Chrome, iOS Safari real device (memory, tab-restore context loss).
8. SEO snapshot: curl the SSR HTML of `/` and diff visible text against `docs/copy-reference.md` — all verbatim copy present.
9. Voice-lint grep for `—` over `app/ components/ lib/` stays empty; responsive screenshots at 375/768/1280/1536.
10. Founder screenshot-verify before every go-ahead (working style); founder judges on the localhost:3456 prod build.
