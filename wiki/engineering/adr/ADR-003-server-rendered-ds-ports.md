---
title: "ADR-003: Components are server-rendered ports of the DS markup; client islands only for behaviour"
type: adr
updated: 2026-10-12
sources:
  - ../../design-system/gaps.md (G-16)
  - ../../design-system/component-map.md
  - ../../raw/brief/kickoff-brief.md (§9.2 "All primary content is in the server-delivered HTML", §9.12)
  - design-system/project/components/bundle.js, index.d.ts (read-only)
  - mockup/mockup.js
  - ../lessons.md (§1 "Read window.location in an effect", §2 "An observer mounted in the layout must re-arm")
  - ../../qa/architecture-review-2026-10-12.md (N21), ../../decisions/D049-motion-picks.md, ../../decisions/D050-whatsapp-chat-button.md
  - "mockup/pages/meet-kheelu.html:279-311 (tab list hidden), mockup/css/meet-kheelu.css:81 (stacked panels), read 2026-10-12"
---

# ADR-003: Server-rendered ports of the DS components

**Status:** accepted by the Architect, 2026-10-12.

## Context

`bundle.js` is a client-only IIFE that reads React 18 from `window` and renders in the browser
([G-16](../../design-system/gaps.md#g-16)). The site runs React 19 on the server and must deliver
primary content in server HTML (brief §9.2), including to AI crawlers that run no JavaScript. The DS
allows the no-React route: "the `kh-` classes in `bundle.css` style the same markup the components
render" (`00-how-to-use.md:135`). The mockups use that route.

## Options

1. Load `bundle.js` and React 18 in the browser. Fails §9.2 and doubles React.
2. **Port each DS component used by the mockups as a React Server Component that emits the same
   markup and classes; port only the behaviour that needs JavaScript into small client components.**
3. Wrap a headless UI library for behaviour. Not needed: the behaviours are a dialog, tabs, a
   carousel's two buttons and observers, all native or a few lines (brief §9.12 order).

## Choice

Option 2.

- **Server by default.** Every component is a Server Component unless it handles an event or reads
  the browser. Client files are named `*.client.tsx` and stay small.
- **The markup reference is the approved mockup**, not `bundle.js`: same element types, classes,
  ARIA and order. `index.d.ts` gives the prop names; where the mockup composed something the DS lacks
  (G-05 comparison stack, G-09 sticky bar, G-11 film strip, breadcrumbs, spec list, order summary,
  G-18 source markers), the component reproduces the mockup's composition.
- **Client islands** (each one owned by one component): `NavDrawer` (native `<dialog>`), `FilmsStrip`
  controls, playback and the focused film (D049 pick 8), `StickyBuyBar` visibility, `MotionController`
  (reveals and doodle draws), the `WhatsAppFloat` lift and laptop label (D050), `CopyLinkButton` and
  `InAppBrowserNote` on the store, the frozen checkout forms, and the tracking gates. **No `Tabs` island:**
  the approved product page shows its three detail panels stacked (the mockup hides the tab list and
  `mockup.js` has no tabs code), so `ProductDetails` ships them stacked with no JavaScript (QA review N21;
  a tabs island stays possible later over the same markup).
- **The FAQ animation needs no island:** the D049 smooth open is CSS on `::details-content`, with the
  native instant open as the fallback.
- **Browser reads happen in effects**, never in render, so static pages stay static (lessons §1).
  Observers mounted in a layout re-arm on `usePathname()` (lessons §2).

## Consequences

- Every word on every page is in the HTML a crawler fetches; FAQ answers live in native `<details>`.
- JavaScript on a marketing page is React and Next's runtime plus a few small islands, inside the
  phone budget ([architecture §12](../architecture.md#12-performance-budget-phones-first)).
- A DS update (v12) means re-reading the changed components' markup and updating our ports; the DS
  checksum guard makes that visible.
