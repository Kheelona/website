---
title: "D011: Production is held until Gate B; review happens locally"
type: decision
updated: 2026-10-10
sources: ["founder's answer to Q3, 2026-10-10", ../open-questions.md]
---

# D011: Production held until Gate B; review is local

**Context.** [Q3](../open-questions.md) offered a narrow copy-only hotfix before shipping starts
on 20 October 2026. The live site still carries wording the founder ruled inaccurate on 2026-10-04
(the retired microphone wording, 15 places; [claims §4.1](../product/claims.md#41-the-retired-microphone-wording)),
promises returns and warranty terms as "coming", and lacks the DPDP retention period and a
grievance officer.

**Choice (founder, 2026-10-10).** Hold everything until Gate B. Until the work is final, reviews
happen **locally** (a local build on this machine), not on a deployed preview.

**Consequences.**
- Nothing is merged to `main` before Gate B, so production keeps the issues above until launch.
  This is the founder's accepted risk. The reset fixes all of them, and F1, F2 and F12 are still
  needed for the new site's copy.
- Review packs (Gate A included) are built for local viewing first. The brief's private artifact
  link is still allowed: it is not a deploy.

**Approved by.** Founder. **Date.** 2026-10-10.
