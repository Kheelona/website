# Migration to Design System v3 — the engagement record

**READ THIS FIRST, EVERY SESSION, until the migration is marked complete.** (CLAUDE.md
points here; that pointer and this rule are removed only when the DONE box at the bottom
is ticked.) Context can be cleared at any time — this file must always be enough to
resume cold. Update it after EVERY change-set, QA run, and review verdict.

The full approved plan lives at
`~/.claude/plans/kheelona-com-claude-glittery-waffle.md`; this file is the living
status + decision record. The engagement is the founder's master prompt of 2026-08-23:
four roles (LEX writer / JONY designer / MARA CMO / RIA QA), full v3 design-system
replacement + content refresh + SEO integration, all work on `demo-website`, the founder
merges to `main` manually at the ⛳ checkpoints.

## Status dashboard

**🟢 CS1 + CS2 + CS3 ARE MERGED TO MAIN AND LIVE (2026-08-23, merge `275ef01`).** The founder
ran migration 0002 first, verified the preview, and ordered the merge. Production verified:
`/api/health` → `"preorder":"token"`; live home serves the 3+ hero, the two-line offer card
and the v3 re-skin; the live store serves the token-mode first-500 offer with the 20 October
date. Rollback: tag `pre-v3-migration-2026-08-23` = `b27fd25` (pushed). One founder tweak
landed post-preview: the hero offer card breaks between its two clauses (`PREORDER_OFFER_LINES`).

| Change-set | State |
|---|---|
| Step 0 — setup (this file, CLAUDE.md pointer) | ✅ done (`7a44db7`) |
| CS1 — commercial restructure (500-unit cap, ₹7,999 full mode, ship 20 Oct) | **✅ BUILT + GATED (`d23970f`) — ⛳ waiting on founder: run migration 0002 in Supabase, then merge to main.** Laws recorded as §8.26 in website-steps.md; FOUNDER-TODO carries the merge order-of-operations and the standing sell-out sweep item. |
| CS2 — Ages 3+ repositioning | **✅ BUILT + GATED — ⛳ founder approves the new copy on the preview before merge.** The lines that need your eye: hero "A best friend at 3. / A head start for school." (one source, `HERO_PROMISE`, also closes PacePanel); GrowthArc re-anchored 3 → 4 → 5 → "Every year after: Growing right alongside."; home pipeline line "Starts talking at 3. Still teaching for years."; family chips Lumi 3+ / Kheelu Speaker 5+ / AI books 3+; Compare row "Yes, for years with the family"; playos "many bodies as they grow". Schema audience = min 3, no max; "2 to 5"/"2 to 14" joined the dead-ranges guard. AAP/WHO citations in two journal articles keep their quoted ranges (they cite the health bodies, not us). SEO keyword placement continues per page in Phase B. NOTE for CS3: the rebuilt og.png must carry ages 3+ (the old one's pixels are now stale). |
| CS3 — DS v3 Phase 0 + Phase A (tokens, fonts incl. serif, logo, guard tests) | **✅ BUILT + GATED (`d6d3e73` + `6fc6a63`) — ⛳ founder reviews the before/after shots + the preview, then merges.** What changed at a glance: v3 ink ramp + surfaces (cream/cool/sun now the v3 tints, subtle cooling), radii snap to 24px, token gate reads v3 and FAILS-HARD when missing (18 mappings), fonts re-subset from v3 TTFs (identical coverage), Instrument Serif ITALIC added as `--font-editorial` (placements come per page in Phase B — nothing renders it yet), navbar/store wordmark now the v3 SVG, full favicon set + logo-mark.png + og.png regenerated from the v3 mark/template (og carries ages 3+ and the new mascot). Contrast recomputed everywhere; ZERO assertions inverted; ink-muted kicker ban survives. line-soft aliased (merge in B); orange-deep kept until its ~8 accent call-sites drain in B; BEAT_WASHES intermediates flagged for B. |
| CS4 — Kheelu redesign (Foxy-Deer art) | **Mostly pre-existing, pending inventory**: the live hero art and guide avatar are already on-model with v3's Foxy-Deer (the character clearly descends from the current Kheelu art). Remaining: per-surface comparison against v3's poses/reference sheets, swap only where off-model, founder judges each. The dormant 3D journey still holds the old-design GLBs (new Tripo run, founder-driven, out of scope). |
| Phase B — per-page LEX/JONY/RIA/MARA refinement | pending |
| Final — cross-page audit, v3 gap docs, old-system deletion (founder approval) | pending |

## Founder decisions (2026-08-23, live Q&A — SUPERSEDE all prior repo law and docs)

1. **₹4,999 for the FIRST 500 UNITS**, counted from Supabase paid orders. Then
   **₹7,999 = the launch price**. ₹9,999 is dead. Existing token holders keep ₹4,999
   and count toward the 500.
2. **The 30 September 2026 date deadline is retired entirely.** Urgency is units only.
3. **Post-500 orders pay ₹7,999 in full upfront** — no token, no balance. Second
   checkout mode; server decides the mode, client never sends a price (§8.25-c-i).
4. **No public counter.** The count is never exposed — pages/API/health carry only the
   MODE (`token` | `full`).
5. **Live-count semantics**: a refunded ₹4,999 order reopens a slot (no ratchet).
6. **Full-payment orders carry the same refund promise**: refundable in full any time
   before dispatch — no fee, no deduction, no reason required.
7. **Ship date: 20 October 2026** (was 1 October).
8. **Ages: everything says "3+".** `2 to 5` and `2 to 14` both die; the V6 hero
   ("A best friend at 2. / A head start by 5.") and GrowthArc are rewritten — LEX
   drafts, founder approves before merge.
9. **CTA label stays "Pre-order Lumi"** (no number on the button; price in the caption).
10. **Foxy-Deer is Kheelu's NEW DESIGN** — same character, name, narrator role and
    say-lines; the art becomes v3's Foxy-Deer poses.
11. **v3 editorial serif is ADOPTED**: Instrument Serif italic enters the site for
    editorial accents (titles/pull-quotes only, one per composition). The former
    zero-italics law and the 2026-07-24 serif retirement are REVERSED by founder order.
12. Unchanged and confirmed: ₹499 refundable token, adjusts against the price
    (₹499 + ₹4,500 = ₹4,999), all prices GST-inclusive, one-tap CTA to the store,
    WhatsApp-only support.

**Standing assumptions (defaulted, founder may veto at any review):**
- ₹99 event-tier paid orders count toward the 500 (`.neq(tier,'full')` in the count).
- Kheelona+ 6-month inclusion applies to ₹7,999 full-payment orders too.
- Event pages always render the token ladder (an event token is a token).
- Static marketing pages cannot flip themselves at sell-out: a **manual copy sweep at
  500 sold** is a named FOUNDER-TODO item; the trigger is `/api/health`'s new
  `preorder` field and the internal alert email.

## Design authority

- **v3 is law** for tokens/styles/logo/fonts: `Design/Kheelona-Design-System-v3/`
  (`tokens/kheelona.css` is the import of record; guidelines in `guidelines/`).
- Palette + 30/30/20/10/5/5 ratio, tints, ink ramp, type roles: see the "Brand colours
  & fonts" section of the approved plan. Key corrections we carry AGAINST v3 (to be
  filed as gap-proposal errata INTO v3): white-on-orange is 2.88:1 and FAILS AA at every
  size (v3 §6 note is wrong; site keeps ink-head labels on orange CTAs), site keeps
  `orange-ink #b54a0d` / `blue-ink #1b6e96` as documented extensions (only orange/blue
  ≥4.5:1 on every wash), v3 has no motion tokens (site eases stay as extensions), no
  fluid type scale (site keeps clamps anchored to v3 steps), BRAND.md still says ages
  2–5 (decision is 3+).
- Old system `Design/design-system/` stays untouched until the final audit passes AND
  the founder approves deletion. `tools/tokens/check-tokens.mjs` gets repointed to v3
  and made fail-hard in CS3 (today it silently passes if the DS css is missing).

## Consistency log (approved patterns/terms — check all new work against this)

- CTA verb: **"Pre-order Lumi"** everywhere, one destination (`STORE_URL`), one tap.
- Offer sentence: exactly ONE wording lives in `PREORDER_OFFER_LINE`; `PRICE_CAPTION`
  is the only other price string (V6 D11: two sanctioned strings, no paraphrase).
- Ages: render ONLY from `LUMI_AGES` ("3+" after CS2), format "Ages 3+".
- Support: WhatsApp only, every visible label says so.
- Buttons: brand orange fill, `ink-head` label — never white text on the action fill.
- Kickers: 13px sans uppercase in `orange-ink`.
- Kheelu: say lines ≤48 chars, contractions allowed in his bubbles only, founder
  approves every line before shipping.
- Voice: no hype, no exclamation marks, no em-dashes (en-dash inside number ranges),
  second person present tense, rarely lead with "AI".

## QA log

| Date | Change-set | Gate | Result |
|---|---|---|---|
| 2026-08-23 | CS1 | `npm test` | PASS — 790 tests, 92 files, exit 0 (count lives in project-state `tests.count`) |
| 2026-08-23 | CS1 | `npx tsc --noEmit` | PASS |
| 2026-08-23 | CS1 | `npm run build` (token gate + next build) | PASS |
| 2026-08-23 | CS1 | `npm run qa:sweep` (16 routes × 390/1280) | PASS — clean axe + voice after the lint list inverted with the test (§8.26-h) |
| 2026-08-23 | CS1 | `qa:text` on /, /terms | PASS — rendered offer copy reads the new ladder verbatim |
| 2026-08-23 | CS2 | `npm test` + `tsc` + `npm run build` | PASS — suite green (count in project-state `tests.count`) |
| 2026-08-23 | CS2 | `qa:sweep` + `qa:text` on /, /playos, /products/lumi | PASS — **after killing a stale 3456 server that was serving the CS1 build**; first text read showed old copy and would have been a false verify. Lesson re-learned: `lsof -tiTCP:3456` before trusting any local render. |
| 2026-08-23 | CS3 P0 | suite + build | PASS — zero visual change proven by unchanged sun value |
| 2026-08-23 | CS3 PA | suite + tsc + build (token gate v3, 18 mappings) | PASS — no contrast assertion inverted at the v3 values |
| 2026-08-23 | CS3 PA | `qa:sweep` (fresh server) + before/after shots home/lumi/safety ×390/1280 | PASS — shots in the session scratchpad `reskin-shots/`, side-by-sides sent to the founder |

## Open questions / waiting on founder

- None blocking. Future: fresh v3 exports if a needed Foxy-Deer pose is thumbnail-only
  (8 of 17 poses are ≤360px); JONY token-spec sign-offs land in CS3 Phase 0 notes here.

## Completion

- [ ] All change-sets merged to main by the founder
- [ ] MARA final cross-page audit PASSED
- [ ] RIA full-site regression PASSED
- [ ] v3 gap-proposal docs written into v3
- [ ] Old design system deleted (founder-approved)
- [ ] CLAUDE.md standing instruction removed; this file marked COMPLETE
