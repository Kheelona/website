---
name: brand-kheelu-lumi-law
description: "The settled Kheelona brand hierarchy — Kheelu (mascot/narrator) vs Lumi (product, rotating SKU) — and Kheelu's voice rules"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3ff8e50c-c811-4660-979d-78521f9883a3
  modified: 2026-08-22T20:54:55.480Z
---

**⚑ 2026-10-04 (CMO merge, branch `redesign-mockup-2026-10`, PR #16, awaiting merge): THE KHEELU GUIDE (corner narrator + say lines) IS RETIRED by the founder**, replaced on phones by a `StickyReserveBar`; reveals and backdrop stay. Since 2026-09-05 the PRODUCT is named Kheelu (was Lumi), so "Kheelu narrates" below is history once the branch merges. Mascot drawings still illustrate journal pages. See [[project-cmo-merge-2026-10]].

Settled by the founder 2026-07-10 (R9 question batch), applies to ALL Kheelona surfaces:

- **Lumi = the product**: the plush (currently a dragon, 3 SKUs Green/Pink/Blue, Blue leads). It is a **rotating SKU** — fast-fashion style, the look changes every 30–45 days post-launch while the function/core/AI stays. **Never publish the rotation strategy on the site.** The product owns the hero.
- **Kheelu = the permanent brand mascot** and the **site narrator** — founder: "the website is told by Kheelu. He is telling his story." Founder chose FULL narrator prominence knowingly. He is male ("he"). **DESIGN UPDATE (founder, 2026-08-23): "Foxy-Deer is the new Kheelu"** — the design-system-v3 Foxy-Deer character (fox body + deer antlers, blue glasses, orange K-mark tee; art in `Design/Kheelona-Design-System-v3/assets/mascot/`) IS Kheelu's new look. Same name, role, say-lines; new art. The old orange deer/squirrel art is superseded; the dormant 3D model still shows the old design (needs a new Tripo run, founder-driven).
- **Kheelu's voice**: warm first person from his founder-published intro card ("Hi! I'm Kheelu. I love asking questions, discovering new things and learning together with you!"; traits: Naturally Curious, Kind & Caring, Smart Explorer, Playful & Fun). His quoted speech is the ONE sanctioned contraction zone; body copy keeps house rules. New Kheelu lines need founder approval — list exact lines in the plan (the R9 pattern).
- Implementation on kheelona.com: `site/components/ui/KheeluSays.tsx` (bubble device) + `KheeluIntro.tsx`; approved line inventory in `docs/copy-reference.md` R9. /safety deliberately has NO Kheelu (gravity wins).
- Also real + publishable: urgency cap "first 500 units at ₹4,999" — retired 2026-08-22, then **UN-RETIRED by the founder 2026-08-23**: the cap is BACK as the whole urgency story (₹4,999 first 500 units → ₹7,999 after, counted from Supabase paid orders; the 30 Sep date deadline died instead). See `migration-to-new-dsx.md` in the repo for the full 2026-08-23 decision set (ages 3+, ship 20 Oct 2026, italics law reversed, serif adopted).

- **CTA labels are WHITE on brand orange (§8.29, founder 2026-08-24).** Every label on a SOLID orange fill is `text-white`, matching `.kh-button` in the v3 design system. **This is a KNOWINGLY ACCEPTED WCAG failure, not a bug: white on `#EF762F` is 2.88:1 and fails AA at every size** (it does not even reach the 3:1 large-text floor). The founder was shown that ratio AND the passing alternative (`orange-cta` `#C25210`, white at 4.66:1, still defined and dormant) and chose brand orange. **Never "fix" this contrast** — doing so reverses a founder decision. Lighthouse a11y is 96 as a result, still above the 90 gate. Pale `bg-orange/15` tints are NOT fills and keep ink text. Reversing it is ONE mapping in `globals.css`. Guarded by `test/action-label.test.ts`; `npm run qa:sweep` PRINTS the accepted nodes rather than silencing them, and any other contrast pair still fails it. Same round removed the store's prose paragraph from `/store` and `/store/ideabaaz`, which forced a correction to §8.25-b because that law justified one-tap CTAs by quoting it.

**Why:** the reviewer's biggest finding was brand ambiguity (mascot mistaken for the product); this hierarchy resolves it and shapes every future design/copy call.
**How to apply:** product visuals lead conversions; Kheelu carries story/transition moments; caption/alt both correctly everywhere; check any new SKU art against the current-drop reality before shipping.

Related: [[project-kheelona-com-build-prompt]] · [[feedback-founder-working-style]]

**ACCEPTED-COST DECISION #2 (founder 2026-09-06, §8.34-h): production Lighthouse BEST-PRACTICES is 74 (~81 with the CSP fix) against a gate of 90, and that is KEPT.** The whole gap is the Meta Pixel's third-party `fr` cookie — production with facebook blocked measures 96, GA4 costs zero, and `third-party-cookies` (weight 5 of 27) has no passing configuration. It costs nothing in search: only Performance feeds ranking and that is 100. The alternative (dropping the browser pixel) keeps server-side Purchase via CAPI but loses PageView/ViewContent/InitiateCheckout/Lead and weakens Purchase matching, because CAPI reads the `_fbp` cookie the pixel sets. **NEVER "fix" it**, same as the 2.88:1 contrast. And **measure Lighthouse on PRODUCTION** — every tag is host-gated, so local reads a misleading 96 (§8.34-g).
