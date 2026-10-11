---
title: "D049: Motion picks for the build (1A 2A 3B 4A 5A 6B 7B 8B)"
type: decision
updated: 2026-10-12
sources: ["founder's picks on the motion options page https://claude.ai/artifact/XgoMduGs3cLTaWawJ7RE5w, 2026-10-12", ../../mockup/_work/motion/motion.css (local reference implementation), ../../mockup/APPROVAL.md (§6 motion spec), D041-gate-a-round-1.md]
---

# D049: Motion picks

The founder asked to choose the animation wherever motion is used; three options per place were shown
live. Timings are DS tokens (`tokens.css`: duration-fast 120 ms, duration-base 200 ms, duration-enter
240 ms, duration-draw 800 ms, ease-standard, ease-bounce). Everything respects `prefers-reduced-motion`
(nothing moves; reveals become plain, instant states). Nothing loops; no carousel moves by itself.

| # | Place | Pick | Build spec |
|---|---|---|---|
| 1 | Sections appearing on scroll (below the first screen only) | **A Fade and rise** | opacity 0→1 and translateY(space-4)→0, duration-enter, ease-standard, once per section (IntersectionObserver) |
| 2 | Hero picture on arrival | **A Still** | No hero motion at all (the hero, H1, price sentence and CTA never move: Gate A spec) |
| 3 | Hand-drawn doodles | **B Draw themselves** | The doodle SVG is inlined; every path gets `pathLength="1"`, `stroke-dasharray: 1`, stroke-dashoffset 1→0 over duration-draw, ease-standard, once when it enters; several doodles start ~300-600 ms apart. Doodles stay decorative (`aria-hidden`) |
| 4 | Phone buy bar | **A Slide up** | opacity and translateY(100%)→0, duration-base, ease-standard, once; then it only steps aside for inline CTAs (G-09) |
| 5 | Phone menu | **A Slide from the side** | native `<dialog>`; the panel translateX(100%)→0 over duration-enter; the scrim fades |
| 6 | Orange button | **B Press and arrow nudge** | hover (pointer devices): the arrow icon translateX(5px) over duration-fast; press: the DS press (translateY onto the ink edge, `shadow-press` removed) |
| 7 | FAQ answers | **B Smooth open** | the answer opens with `grid-template-rows: 0fr→1fr` over duration-enter (the one allowed non-transform animation: it moves content below, which is expected on an accordion) and the plus rotates 45° into a cross |
| 8 | Parent films strip | **B Focus grows** | native scroll-snap; the film in focus scales to 1.04-1.1 over duration-base (transform only); others unchanged |

Reference implementation of every option: `mockup/_work/motion/motion.css` (local) and the published page.

**Approved by.** Founder. **Date.** 2026-10-12.
