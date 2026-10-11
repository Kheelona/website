---
paths:
  - "src/lib/tracking/**"
  - "src/components/tracking/**"
  - "src/lib/fbq.ts"
  - "src/lib/posthog.ts"
---

# Tracking

Source: wiki/engineering/structure.md §9 (Phase 4 plan, 2026-10-12).

- IDs, event names and parameters never change (wiki/site/tracking-inventory.md); new events are additions in events.ts; every inventory destination stays in destinations.ts.
- New events go through track.ts; the frozen funnel stays byte-identical.
- Beta: PostHog gets env=beta through before_send only (never posthog.register); GA4, Meta and CAPI never on beta hosts.
- A tool change ships with its /privacy change in the same commit (test/analytics-tags.test.ts).
