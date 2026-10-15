---
title: "D050: A persistent WhatsApp chat bubble on every page (bottom right; lifts above the phone buy bar; WhatsApp green)"
type: decision
updated: 2026-10-12
sources: ["founder, 2026-10-12, in session (verbatim below)", D032-grievance-block-and-call-line.md, D049-motion-picks.md, ../site/strategy.md (§3.4 sticky bar), ../design-system/gaps.md]
---

# D050: WhatsApp chat bubble

**Founder (verbatim):** "We also need a persistant WhtsApp bubble / button on bottom right of all pages, so
that if anyone has any questions, they can click and directly chat with us on whts app." Then chose:
"Floating bubble above the bar" and "WhatsApp green".

| Item | Spec |
|---|---|
| Where | Every page: marketing site, store, and the order-confirmation page (`/thanks`) |
| Link | `https://wa.me/919187546483?text=…` (+91 91875 46483, D032), opens WhatsApp in a new tab (`rel="noopener"`). Pre-filled text: site pages "Hi Kheelona! I have a question about Kheelu."; store "Hi Kheelona! I need help with my pre-order."; `/thanks` "Hi Kheelona! I have a question about my order." (never an order number or any personal data) |
| Look | A 56 px round bubble, **WhatsApp green with a white WhatsApp logo** (the DS `whatsapp-logo` icon), DS `shadow-lift`. The green is the founder's approved brand exception to the DS (gap G-20) |
| Phone (< 900 px) | Bottom right, 16 px from the edges plus the safe-area inset. On pages with the buy bar it **lifts above the bar** while the bar shows and drops back when the bar steps aside: translateY over duration-base, ease-standard, together with the bar. It never covers the bar, the price, a form field or the pay button: the last content of every page gets bottom padding so nothing hides under it. Hidden while the menu drawer or any dialog is open |
| Laptop (≥ 900 px) | Bottom right, 24 px from the edges; on hover or keyboard focus a "Chat on WhatsApp" label slides out to its left (opacity and transform, duration-base) |
| Motion | Appears with the page (no entrance animation); lift and label follow D049 timings; nothing moves with reduced motion on |
| Accessibility | A real link with the accessible name "Chat with us on WhatsApp"; 56 px target; visible focus ring; reachable by keyboard after the page content. Risk recorded: white on WhatsApp green is below 3:1 for the glyph, accepted with the brand exception (the link has a text name) |
| Tracking | `data-ph-capture-attribute-cta="whatsapp-float"` (a new value; PostHog autocapture, env=beta on beta hosts). No new Meta or GA4 event; nothing existing changes |
| Existing help lines | The Home help line ("Questions? WhatsApp or call…"), /contact and the footer stay as they are |

**Approved by.** Founder. **Date.** 2026-10-12.

**Changed later (2026-10-15).** The look: the bubble shows WhatsApp's own full-colour logo from Wikimedia Commons
instead of the DS glyph in white on green ([D064](D064-quick-batch-2-landing-page-and-motion-2026-10-15.md) item 3;
task Q2.4; [deviations](../qa/deviations.md) V53). The help lines: the phone number left every page but `/contact` and
the legal pages ([D063](D063-quick-batch-1-choices-2026-10-15.md); V52). Place, size, label, tracking and "persistent on
every page" are unchanged; the selling update keeps the bubble on the first phone screen (main-session ruling, plan §13
item 7 left for the founder).

**Changed later (2026-10-16).** On Home's phones the bubble waits, hidden and inert, until the phone buy bar first shows
(once the hero's button leaves the screen), then stays; laptops and every other page unchanged
([D066](D066-selling-update-founder-answers-2026-10-16.md) item 1; task Q2.17; deviations V68). It overturns the main
session's overnight ruling above.
