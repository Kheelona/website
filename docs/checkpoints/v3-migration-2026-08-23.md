# Checkpoint: the v3 migration engagement (2026-08-23)

One day, one engagement, three commercial-and-design change-sets built, merged and
production-verified, plus the Phase B refinement pass. The founder's master prompt set
four roles (LEX/JONY/MARA/RIA) and two workstreams: replace the design system with
`Design/Kheelona-Design-System-v3/` and refresh every commercial fact. Twelve founder
decisions were taken live and recorded in `migration-to-new-dsx.md` — that file is the
engagement's tracker and stays the read-first pointer until the close-out below happens.

## What is live (merge `275ef01` + the Phase B fast-forward `1e3b36e`)

- **§8.26, the unit-cap offer**: ₹4,999 for the first 500 units, counted live from paid
  Supabase orders in `lib/store/mode.ts` (refund reopens a slot; the count never leaves
  the module — pages and `/api/health` carry only the MODE); then ₹7,999 paid in full
  through the same route with `balance_status='none'` (migration 0002, run by the
  founder before the merge). The 30 September deadline, ₹9,999, and the 1 October ship
  date are retired AND banned by the inverse-copy test, which inverted for the first
  time: "first 500 units" is now REQUIRED in the offer line. Ship date: 20 October 2026.
- **Ages 3+ everywhere**: hero "A best friend at 3. / A head start for school."
  (`HERO_PROMISE`, one source with PacePanel), GrowthArc 3→4→5→"Every year after",
  open-ended family chips, schema minimum-3-no-maximum. AAP/WHO citations kept their
  quoted ranges.
- **The v3 re-skin**: v3 ink ramp/surfaces/radii (all contrast recomputed, zero
  assertions inverted, the kicker ban survived), token gate reads v3's `kheelona.css`
  and FAILS HARD when missing (16 mappings after Phase B), fonts re-subset from v3 TTFs,
  Instrument Serif italic as `--font-editorial` with its first placements on the parent
  testimonials and founder pull-quotes, the v3 wordmark SVG in both chromes, the full
  icon set + `og.png` regenerated from the v3 mark/template
  (`tools/brand/render-icons.mjs`).
- **Phase B cleanups**: `line-soft` merged into `line` (43 sites) and deleted;
  `orange-deep` drained to `orange-ink` (fixing the known ~3.9:1 cream liability) and
  deleted from `@theme`; SEO keyword map fully placed and documented; living docs
  repointed at v3 (§8.27).
- **CS4 closed by inventory**: every live 2D Kheelu surface is ON-MODEL with v3's
  Foxy-Deer (the founder's decision #10: Foxy-Deer IS Kheelu's new design). The one
  off-model asset is the dormant 3D GLB — a founder-driven Tripo re-run gates any future
  `<StageGate stage="journey" />` revival.

## Evidence

- 792 tests / 92 files green at every merge (count lives in project-state `tests.count`).
- `qa:sweep` clean, every route, 390 + 1280, at each change-set — on a FRESH server
  after a stale-:3456 near-miss re-taught the `lsof` rule.
- Production, same night: `/api/health` → `preorder:"token"`; served pages verified by
  text; Lighthouse desktop home **99/100/100/100** (first run read 86 on a cold CDN —
  the control run rule caught it), lumi **99/100/100/100**, store **98/100/100/66**
  (store SEO low BY DESIGN, §8.25-aa).
- Rollback: `pre-v3-migration-2026-08-23` = `b27fd25`, pinned by hash.

## Gotchas this round adds to the pile

- **A unit-bounded offer has no honest `priceValidUntil`** — the JSON-LD offer dropped
  it, or Google would drop the offer on a day nothing changed (§8.26-g).
- **The inverse-list inverts as one move, in the test AND the qa lint** (§8.26-h) — the
  sweep lied for exactly as long as the two lists disagreed.
- **`qa:text` under-counts FAQ keywords**: closed `<details>` answers are not in
  innerText. Audit keyword placement in served HTML with `<script>` blocks stripped.
- **A comment between a metadata key and its string breaks `metadata-lengths`' regex
  reader** — comments go above the key.
- **v3's own accessibility note is wrong about white-on-orange** (2.88:1): the erratum
  and the site's extensions are recorded IN v3 at `guidelines/site-extensions.md`.

## Close-out, still open

1. Founder approval to DELETE `Design/design-system/` (the last gate; nothing reads it —
   the token gate now fails hard on v3 instead, so deletion disables nothing silently).
2. On approval: delete the folder, drop the `_adherence.oxlintrc.json` stale allowlist
   with it, final suite + sweep, mark `migration-to-new-dsx.md` COMPLETE, remove the
   CLAUDE.md read-first banner, and fold the engagement's facts into CLAUDE.md's STATE
   OF PLAY.
3. Standing operational item (FOUNDER-TODO): the manual marketing-copy sweep the day
   `/api/health` first reports `preorder:"full"`.
