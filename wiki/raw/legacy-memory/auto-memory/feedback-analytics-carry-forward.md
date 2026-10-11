---
name: feedback-analytics-carry-forward
description: On any redesign or content merge, the founder explicitly requires the Meta Pixel and PostHog integrations to carry forward intact; plan it as a freeze plus proof
metadata:
  type: feedback
---

When I presented the CMO-merge plan (2026-10-04) without a dedicated analytics section, the founder rejected the plan once with: "Make sure the pixel and post hog integrations are properly carried forward in this." The approved version froze the measurement layer byte-identical to a tag, guarded it with a test, mapped every page-level touchpoint (CTA `track` values, ViewContent mounts), and verified with a host-mapped local probe plus production checks.

**Why:** analytics is how the founder measures ad spend and conversion; a redesign that silently breaks it is invisible until the numbers go wrong.
**How to apply:** any plan that touches pages, layout or chrome gets an explicit "analytics carry-forward" section up front: what is frozen, how pages touch it, how it is proven (with a control), and what only production can confirm.

Related: [[project-cmo-merge-2026-10]] · [[project-posthog-2026-09]] · [[project-meta-pixel-2026-09]]
