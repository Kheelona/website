# Checkpoint: R10 — click reliability, Ria on Team, stable ambient, hero fold

**Date:** 2026-07-11 · **Commit:** `107344b` · **Live:** https://website-hdn2.vercel.app (verified) · **Previous checkpoint:** `r9-friend-feedback-kheelu.md` · **Rollback tags:** `r7-live-2026-07-10` (pre-R9)

## What shipped (founder round, 5 items, all decisions via question batches)

1. **Story clicks fixed — new HARD RULE: tilt never wraps a whole-card link.** The vendored Tilt (`components/vendor/animate-ui/primitives/tilt.tsx`) springs `rotateX/rotateY` under the cursor; mousedown/mouseup land on mismatched elements → the browser drops the click (intermittent, edge-biased). TiltCard removed from `/stories` listing cards, home `Journal` cards, `MeetLumi` SKU cards; rule documented in `ui/TiltCard.tsx` header. Tilt remains on non-interactive cards only. Live-verified with center + corner clicks.
2. **Ria Mangala Rewari on /team** — Head of Marketing (NOT co-founder) · tag "The voice" · purple family · between Kashyap and Apoorva · LinkedIn `ria-mangala`. Photo: founder-supplied transparent PNG, square-cropped 480px at `site/public/team/ria.png`. Bio facts from her published profile (The Ideagator co-founder 7 yrs; 1,000+ trained). Quote drafted from her own published clarity line — **Ria's personal sign-off pending: FOUNDER-TODO R10-a**. Manifesto + card heading now "a brain, a body, a business, and a voice"; meta description updated.
3. **LinkedIn**: all four chips carry founder-confirmed URLs.
4. **Ambient shapes stabilized** (founder liked them; they "showed up then went away"): root cause — fixed lateral offset (3.1–5.6) put NEAR shapes outside the frustum and FAR shapes inside the copy column (projection shrinks with depth), so they ghost-faded constantly. Now `x = side·dist·(0.367+r1·0.102)` → every shape projects into the ~0.72–0.92 NDC margin band on 16:9 desktop; narrower windows push them outward (safe; phones keep DOM art). Ghost ramp asymmetric (dim λ3.2, recover λ6); all shapes ease in from opacity 0 (no mount pop). Densities unchanged. NOTE: dormant journey shares ShapeField; retune on return. **Founder visual confirmation on live still open** (WebGL invisible to automation tabs).
5. **StagedIntro retired (founder pick: fold into hero)**: its three verbatim sentences continue the PDF hero paragraph inside the hero as a muted paragraph (lines 1+2 comma-joined — sanctioned deviation, copy-reference R10). `<Beat id="intro">` removed; LaunchVideo gained `CurveDivider from="white" flip` (KheeluIntro white now precedes it).

## Verification record
Build 28 pages, tsc clean, token gate 17 ok, SSR probes pass. Lighthouse desktop: home 99/100/100/100, team + stories all-100s. Live probes + live click storm pass (qa-report R10).

## Open queue (all founder-gated; no engineering work dangling)
- **R10-a** Ria reads her card (bio/quote one-line tweaks on request) + photo crop check.
- Founder look at the stabilized ambient shapes on live Home.
- R9-a real photography (shot list in FOUNDER-TODO) · R9-b testimonial face · R9-c Kheelu voice check · R4-a..f · R5-a new logo · Tally URL · GA4 · claims (certs/specs/ship date/contact email).
