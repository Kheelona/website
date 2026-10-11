---
title: "D009: Four questions the brief already answers"
type: decision
updated: 2026-10-10
sources: [../raw/brief/kickoff-brief.md, ../legacy/settled-decisions.md]
---

# D009: Four questions the brief already answers

Phase 0 agents raised these as open questions. Each is answered by the brief, so they are recorded
here rather than put to the founder (brief 10: take the most reasonable reading, log it, keep moving).

1. **The published age band is 3-7, everywhere** (brief 2, 9.3 "the 3-7 age band", 9.8 "appears
   everywhere"). This replaces the 2026-08-23 law "3+, no published ceiling". The test banning
   `suggestedMaxAge` changes with the build. Brief 3 still applies: never imply suitability under 3,
   and check every claim at age 3 ([age review](../product/age-band-review.md)).
2. **The drafted testimonials on named people do not move to the new site** (brief 4.2, 9.8: no
   fabricated social proof; parent stories only if real, with consent noted). The 2026-07-28
   decision to leave them as they are covers the live site only, and production is untouched until
   Gate B.
3. **"You deploy" (brief 2) means merging to `main` after the founder's explicit OK at Gate B.** A
   push to `main` auto-deploys; the Vercel dashboard stays the founder's; nobody runs the Vercel CLI.
4. **Where SKM's positioning and an earlier founder ruling on accuracy conflict** (for example the
   wake-word wording), the conflict goes to Gate A as a decision. It is not resolved silently
   (brief 3: "flag it to me").

**Approved by.** CTO reading of the brief. **Date.** 2026-10-10.
