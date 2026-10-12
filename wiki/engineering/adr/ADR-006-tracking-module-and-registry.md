---
title: "ADR-006: One tracking module: a declarative event and CTA registry, a dispatcher for new events, and the existing funnel frozen and proven against the registry"
type: adr
updated: 2026-10-12
sources:
  - ../../raw/brief/kickoff-brief.md (§6 Architect "Tracking", §9.4)
  - ../../site/tracking-inventory.md (every ID, event, parameter, the eight cta values, the parity checklist)
  - ../../site/gate-a-open-items.md (B9, B11, B46)
  - ../../decisions/D040-films-move-to-new-site.md (live "Play:" labels), ../../decisions/D048-beta-deployment.md
  - ../../site/pages/*.md ("CTA tracking values" sections), mockup/pages/*.html and mockup/partials/*.html (data-ph-capture-attribute-cta values, grep 2026-10-12)
  - ../lessons.md (§5 "Freeze the tracking layer and prove the freeze")
  - ../../decisions/D050-whatsapp-chat-button.md (cta whatsapp-float), ../../qa/architecture-review-2026-10-12.md (N2, N3)
---

# ADR-006: The tracking module

**Status:** accepted by the Architect, 2026-10-12.

## Context

Brief §6 asks for a single tracking module with an event registry: components fire named events and
the module sends each to every destination, so parity is easy to prove. Brief §9.4 makes parity a
launch blocker: same IDs, event names and parameters; new events may be added, existing ones may not
change. The existing funnel (`src/features/preorder/lib/analytics.ts`, `src/lib/fbq.ts`,
`src/lib/posthog.ts`, the three gates, the edge cookies, the server events) is proven on production and
sits inside the frozen checkout zone ([ADR-013](ADR-013-checkout-restyle-boundary.md)). The mid version
froze it byte for byte and proved the freeze with a diff test (lessons §5).

## Options

1. Rewrite the funnel as calls through a new dispatcher. Cleanest shape, but every existing event's
   code changes, which is exactly what parity forbids without proof.
2. **Keep the proven funnel files byte-identical; add a declarative registry that lists every event
   (existing and new), its destinations and parameters; route only new events through a small
   dispatcher; prove with tests that the frozen code emits exactly what the registry says.**
3. No registry; keep events scattered. Fails the brief.

## Choice

Option 2. Detail and the full tables: [architecture §8](../architecture.md#8-tracking-module-and-event-registry).

- `src/lib/tracking/destinations.ts`: the 17 destinations of the inventory's "At a glance" table,
  including Vercel Web Analytics and Ahrefs (automatic pageviews only) and the non-code rows (DNS
  verification, the warehouse sync, the ones found absent), so the registry test covers every inventory
  row (QA review N2). `src/lib/tracking/events.ts`: the event registry (name, destinations, parameters,
  status `existing | new`, where it fires). `src/lib/tracking/cta.ts`: the CTA value registry (the eight
  existing values unchanged, plus the new ones reconciled from the mockups and `whatsapp-float` for the
  D050 bubble). `src/lib/tracking/track.ts`:
  the dispatcher for new events, which sends to GA4 (`window.gtag`) and PostHog (`phCapture`) as the
  registry says; never Meta, enforced by `tracking-parity` (wording corrected at the wave-2 close, 2026-10-12).
- The gates and `ViewContentTracker` move to `src/components/tracking/`; their bodies stay as they are
  except the two reviewed changes below.
- The CTA attribute `data-ph-capture-attribute-cta` is written only by the `Button` primitive from a
  typed `cta` prop (`CtaId`), so no free-text value can appear.
- Reviewed, additive changes: (a) PostHog stamps `env: "beta"` on every event on beta hosts through
  `before_send` only, with no persistent `register` (D048; QA review N3);
  (b) `?internal=1` registers a lasting PostHog property `internal: true` and `?internal=0` clears it
  (B46); (c) Meta `ViewContent` also fires on Home with the same payload (B9), its value from the
  offer ([ADR-005](ADR-005-offer-follows-live-mode.md)); (d) three new checkout events (B11), in a
  separate gated task because they touch the checkout's handlers.
- Freeze and parity are proven by tests: a byte-compare of every frozen file against the tag
  `archive/pre-reset-2026-10-10`, an options fixture for the PostHog init (production options must equal
  the tag's), spies proving each funnel call emits exactly the registry's names and parameters, and a
  registry-to-inventory test.

## Consequences

- Parity is provable from the test suite before any network capture, then confirmed by QA's network
  evidence (inventory checklist).
- Adding a destination later (for example a consent-gated one before May 2027, D042) is a change to the
  dispatcher and the gates, not to call sites.
- The frozen funnel keeps its own internal duplication (GA4, Meta and PostHog calls side by side).
  That duplication is the proven state; refactoring it is deferred until after launch and needs its own
  parity proof.
