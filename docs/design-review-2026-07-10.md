# Design panel review — 2026-07-10 (R4 elevate + polish cycle)

Three senior reviewers (Brand/Visual Design, UI Craft, UX/Conversion) independently audited the live demo (https://website-hdn2.vercel.app, the pre-R4 build) from a 61-screenshot evidence pack (desktop 1440 + mobile) plus source reading. This note is the merged, deduped, dev-ready list. Each item carries a disposition:

- **FIXED-R4** — implemented in this cycle (commit refs in qa-report)
- **FOUNDER** — needs a founder decision or founder-generated art; parked in the founder list below
- **DEFERRED** — real but low-risk; queued for a later sprint
- **REJECTED** — conflicts with a locked decision; reason recorded

Locked context the panel worked within: copy verbatim; palette/type tokens locked; warm-never-flashy; D1+D4 journey direction founder-picked; new generated imagery is founder-gated.

## Must

1. **3D shapes collide with copy** (Design #1/#6, UX #4) — shapes sat over the Feelings captions, the MeetLumi paragraph, PlayOS rows, compare cells. → **FIXED-R4**: legibility ghost-fade in `site/lib/three/exclusion.ts` — every floating shape's projection is tested per frame against measured `[data-content]` rects (cached document coords, zero frame-loop DOM reads) and fades to 14% opacity when it would cross copy. Applies to the journey and the new interior ambient stages.
2. **Footer invisible under the WebGL sky** (found during verification; the "footer unreachable" report) — the fixed canvas inside `main` (z-10) painted its opaque sky over the footer (stacking order), on every route with a scene. → **FIXED-R4**: `Footer` is `relative z-20`.
3. **Mobile: duplicate/overlapping Lumi renders + 1.3MB invisible GLB payload** (Design #3, UX #3) — phones downloaded both models yet keep DOM art. → **FIXED-R4**: `lite` tier no longer mounts or preloads any GLB (`ThreeStage` gates models to `full`; module-scope preload removed); phones show ambient sky + DOM art only.
4. **Mobile header pill overlaps the wordmark** (Design #2, UX #1) — partially a capture-viewport artifact (the "390px" shots actually rendered at 640-767px, the one band where pill + hamburger coexist). Real weakness fixed: → **FIXED-R4** `Button` is `whitespace-nowrap` (no two-line pills crowding the logo); logo already `shrink-0`. True ≤640px viewports never show the header pill. Verified in mobile-emulation QA.
5. **Sticky mobile CTA permanently occludes ~90px** (Design #13, UX #2) — → **FIXED-R4**: `StickyMobileCTA` now ducks away on scroll-down and returns on first scroll-up (300ms, ease-calm), still hides entirely while #reserve is on screen.
6. **Safety chapter arrives at ~85% scroll depth** (UX #5) — for a trust-first audience the gating objection is answered last. Proposed: move the teal safety band to directly after MeetLumi. → **FOUNDER**: this reorders the founder-approved Home narrative (PDF section order). Recommended, one-line decision; implementation is a section + beat-dressing swap.
7. **Lumi plush reads cold/gray at the moment of sale** (Design #4) — → **FIXED-R4** (partial): warmer key + peach rim light in `LumiInset`; product-page pedestal circle is now a soft radial halo instead of a hard disc; transit fade keeps the plush out of neighboring copy. A true warm 2D beauty shot for the /products/lumi hero remains **FOUNDER** (Gemini kit).

## Should

8. **Mid-page CTAs lack the risk-reversal microcopy** (Design #10, UX #6) — → **FIXED-R4**: the sanctioned "₹9,999 after launch. No payment now…" line now sits under the MeetLumi CTA and the new compare-table CTA.
9. **Compare table = conviction peak with no action** (UX #7/#14) — → **FIXED-R4**: Reserve button + reassurance line added below the table (existing strings only). Importing the /products/lumi price band ("Under ₹4 a day…") onto Home is **FOUNDER** (copy placement decision).
10. **Hero doesn't declare the 3D world** (Design #8) — → **FIXED-R4**: soft contact shadow under the mascot + one intentional three-shape cluster arcing the hero clearing with depth stepping.
11. **Muddy gray/tan neutrals in the shape dressing** (Design #7) — → **FIXED-R4**: PlayOS clouds retinted white (cream read as gray under the cool sky). Remaining neutral audit is **DEFERRED** to the next dressing pass.
12. **Wash seams cut hard / safety canopy blob dangles across the seam** (Design #5) — partially addressed by the corridor fade; canopy placement retune **DEFERRED** (needs an unhurried composition pass at 3 widths).
13. **kheelona.ai exit link mid-funnel** (UX #10) — → **FIXED-R4**: opens in a new tab (`rel=noopener`); de-emphasis styling kept as-is since the string is sanctioned copy.
14. **Short story slug 404s** (UX #11) — → **FIXED-R4**: permanent redirect `/stories/why-three-to-six-matters-most` → the full slug in `next.config.ts`.
15. **Hero sells the mascot, not the product** (UX #8) — bringing the plush into the hero composition is a hero-staging change. → **FOUNDER** (the hero staging was founder-blessed; recommend as an A/B once traffic exists).
16. **Dead zones after hero / before journal** (Design #9, UX #9) — → **DEFERRED**: pacing changes interact with beat mapping; schedule with the safety-reorder decision so beats are retuned once, not twice.

## Could

17. **Interiors feel flat vs Home** (Design #11) — → **FIXED-R4**: per-route `AmbientStage` rooms (measured washes, corridor-faded shape field, per-route accents, kill switch per route). No GLBs on interiors by design.
18. **Eyebrow color inconsistency** (Design #12) — → **FIXED-R4**: default orange-deep everywhere (playos was 2.68:1 blue-on-cool, a real WCAG fail; journal purple normalized too). Deliberate exceptions: ink on teal (safety), documented in `Eyebrow.tsx`.
19. **Two CTA labels for one action** (UX #12) — → **REJECTED**: the two-label system is the documented CTA architecture (`docs/copy-reference.md`): "Reserve Lumi at ₹4,999" at desire peaks, "Join the pre-order list" as nav/utility.
20. **No team/founder proof in the Home journey** (UX #13) — → **FOUNDER**: adding a founder strip to the finale is a new Home section (copy placement + beat change).
21. **Journal cards read as placeholder stamps** (Design #14) — cards should use the articles' hero art where it exists. → **DEFERRED** (needs the 7 missing journal heroes first, which are **FOUNDER** art per `docs/stories-image-prompts.md`).

## UI craft panel (landed after first synthesis; all triaged same-day)

22. **[Must] White-on-orange text fails contrast (2.88:1) in the compare table and finale** (UI #1) — mathematically real; axe missed it behind layered backgrounds. → **FIXED-R4**: compare column uses ink-on-orange (Button precedent, ~5.9:1); the finale band is orange-deep `#D85F1B` (white bold ≥19px = 3.76:1, passes large-text), the 15px consent line is ink-head (4.52:1). Wash mapping, scene-3d CSS, and the finale sky stop updated together.
23. **[Must] Navbar CTA pill never hides on mobile** (UI #2) — root cause of the overlapped wordmark: `cn()` is a plain join, so Button's base `inline-flex` fought the caller's `hidden`. → **FIXED-R4**: display gate moved to a wrapper div (`hidden sm:block`). Deliberate decision NOT to adopt tailwind-merge (keeps `cn` dependency-free); the rule "display gates live on wrappers, not on Button" is now written at the call site.
24. **[Must] 900px vs 1024px handoff mismatch = mascot-less hero at 900-1023px** (UI #4, worsened by R4's model gating) — → **FIXED-R4**: the `data-hero-fallback`/`data-scene-hide` media query is 1024px, exactly matching the tier gate that mounts models.
25. **[Must] Corridor fade hardening** (UI #3) — reviewer read pre-fix screenshots but flagged real coefficients: radius now 0.75×scale (covers the extruded silhouette), feather widened to 0.14 NDC; the Lumi plush also transit-fades between beats.
26. **[Should] Doubled mobile art** (UI #5) — covered by the lite-tier model removal + the 1024px alignment above. **FIXED-R4**.
27. **[Should] Sticky CTA reserved space** (UI #6) — → **FIXED-R4**: bar also hides while the footer is on screen; duck-on-scroll-down from the first synthesis stands.
28. **[Should] Live sky under borderline `ink-muted` copy** (UI #7) — → **REJECTED**: the sky can only show wash-token colors (measured from the page's own washes; the finale stays opaque), so the luminance floor equals the tokens the ratios were computed against; corridor fade keeps shapes out from under copy.
29. **[Should] Compare table radius break + orphaned header cell** (UI #8) — → **FIXED-R4**: pill corners use `--radius-card`; first column header carries sr-only "What matters".
30. **[Could] Legal H1s off the type scale** (UI #9) — → **FIXED-R4**: aligned to the site-wide H1 clamp.
31. **[Could] Card hover without elevation; no focus-visible treatment** (UI #10) — → **FIXED-R4**: brand-tinted hover shadow + `focus-visible` rings on journal/stories cards and FAQ triggers.
32. **[Could] Six body-copy sizes** (UI #11) — → **DEFERRED**: worthwhile token consolidation, but a 10+ file sweep this late in the cycle trades unnecessary risk; queued for the next sprint.

## Founder list (decisions/art, no code blocked)

- Reorder Home so Safety follows MeetLumi (Must #6) — one yes/no.
- Warm Lumi beauty shot for /products/lumi hero (Must #7) — Gemini handoff kit ready on request.
- Home price band reuse ("Under ₹4 a day…", "Reserving now does not commit you to buy.") after the compare table (Should #9).
- Hero composition including the plush next to Robu (Should #15).
- Founder strip in the Home finale (Could #20).
- 7 journal hero images (Could #21, prompts already in `docs/stories-image-prompts.md`).

## Re-review round (same day) — outcome

All four re-reviewers reported. Designer: FIX-LIST (1 item — team-page numerals off the normalized accent) → fixed. UX: FIX-LIST (2 hygiene items — founder items propagated to FOUNDER-TODO.md ✓; evidence-capture harness caveats recorded for next run ✓). UI craft: FIX-LIST (finale price line to font-bold for the WCAG ≥700 large-text threshold ✓; art-handoff keyed to a full-tier `scene-3d-full` class covering the tablet-rotation edge ✓; notes: ink on #D85F1B measures 4.52:1 not 4.6:1 — still passes 4.5). Fresh-eyes QA: FIX-FIRST → all items landed: sticky-CTA observers re-key on pathname, deferred-signal path re-runs detectTier, GLTF scaling made idempotent via cached raw height, ambient sky orange aligned to #D85F1B, sheet closes on ≥1024px resize, §8.13 rewritten to match the shipped ghost-fade, unused exit animations and TTFs removed.

One infrastructure find from this round, recorded for posterity: hours of "dead canvas" symptoms during verification were Chrome freezing requestAnimationFrame in hidden/occluded automation tabs — not a site bug. The chase still produced real hardening (single dynamic entry for the three stack, eliminating duplicate fiber chunks). 3D verification requires a visible window; noted in §8.13.

## Panel verification notes

The ghost-fade, footer fix, ambient interiors, mobile GLB removal, sticky-CTA duck, and CTA microcopy were verified on the local prod build (screenshots + Lighthouse) before this doc was finalized. Full route-matrix results live in `docs/qa-report.md` (R4 section).
