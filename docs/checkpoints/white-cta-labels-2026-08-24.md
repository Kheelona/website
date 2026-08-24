# Checkpoint: white CTA labels (§8.29) and two paragraphs removed (2026-08-24)

The first round after the 2026-08-23 four-round day. Two founder requests, both small in code and
one of them large in consequence. Merged and live the same day.

| | |
|---|---|
| Merge | `f2a09e7` (`--no-ff`) · revert with `git revert -m 1 f2a09e7` |
| Rollback tag | **`pre-white-cta-labels-2026-08-24` = `fbbbe17`**, cut BEFORE the merge and re-checked afterwards |
| Follow-up | `4a8c318` (the `/store` paragraph) · revert with `git revert 4a8c318` |
| Law | **§8.29** (new) · **§8.22-a** superseded · **§8.25-b** corrected |

---

## 1. The decision, and the number under it

The founder asked for white text on the orange background everywhere, design system first.

**White on brand Deep Orange `#EF762F` is 2.88:1.** It fails WCAG AA at every size — it does not even
reach the 3:1 large-text floor. The site had been on ink labels since V4 D1 for exactly that reason,
at 5.99:1.

This was put to the founder with the arithmetic and with the alternative that satisfies both goals:
**`orange-cta` `#C25210`**, a deeper orange that carries white at **4.66:1** and passes, and which
already existed in the repo as a dormant token kept for this case. **The founder chose to keep brand
orange and accept the 2.88:1**, so that the site matches `.kh-button` in
`Design/Kheelona-Design-System-v3/tokens/kheelona.css`, which has always specified white on orange.

That is a founder decision on brand, taken with the cost in front of them. **It is not an oversight,
and anyone proposing to "fix" the contrast is reversing a decision, not correcting a mistake.**

**It overrides, for this one pair only,** the standing rule that accessibility outranks styling
preference. Nothing else moved: `orange-ink` `#B54A0D` (orange TEXT on a light wash) still has to
clear 4.5:1, and the pale `bg-orange/15` chips keep ink labels, because white on a tint is invisible.

### Where it is recorded, so it cannot be rediscovered as a bug

Four places, deliberately:

1. **`docs/website-steps.md` §8.29** — the law, with the ratio written out.
2. **The v3 design system**, `guidelines/site-extensions.md` errata 1 — which used to say the
   opposite. Rewritten to keep the arithmetic and record the decision on top of it.
3. **`test/contrast-tokens.test.ts`** — as runnable arithmetic: the 2.88 pinned, what was given up
   (5.99), and what the passing alternative is. If anyone darkens `action`, the test says the pair
   changed side.
4. **Every `qa:sweep` run** — printed, never silenced.

## 2. What changed in the code

**Twelve surfaces**, all `bg-action` + an ink label → `text-white`: the `Button` atom's two filled
variants (which covers the navbar pill, every marketing CTA and `FinaleCTA`), `CompareTable`'s brand
column (×2), the `AudioMoments` play button, the `KheeluGuide` dock chip, `PreorderForm` and
`AddressForm`'s submit buttons, and four inline store CTA anchors.

**The fill did not move.** `--color-action` still points at `--color-orange`, so the token gate is
still 16 mappings and reversing this is one mapping.

**Two paragraphs removed.** `/store/ideabaaz` first, then `/store` (both mode branches — the token
wording and the sold-out wording), plus the four config imports each orphaned. Nothing was lost:
`OrderSummary` already carried every fact.

## 3. The part that was not a delete

**§8.25-b is the law that makes every pre-order CTA a ONE-TAP link to the store.** Its justification,
written into the law, was that *"the store page carries all three itself, above its own form"* — and
it quoted the `/store` paragraph by name, warning that weakening it is *"a conversion change, not a
wording change."*

Deleting the paragraph and leaving that quotation would have left the most load-bearing sentence in
the store's design describing a page that no longer exists. §8.25-b now records where the three facts
actually live:

| Fact | Where it lives now |
|---|---|
| Price | the `h1` and `OrderSummary` |
| Refund promise | `PreorderForm`'s line under the submit button, and `OrderSummary` |
| Ship date | `OrderSummary` **only** |

**The known cost, stated rather than discovered later:** `OrderSummary` is an `aside` that sits beside
the form on desktop but stacks BELOW it on a phone, so on mobile the ship date is now first read
AFTER the form. Verified on a 390px full-page render, the width the original one-tap decision was
measured at. `src/app/store/page.tsx` carries the same note in its doc comment, because the obvious
future "fix" is to put the paragraph back.

## 4. Keeping the a11y gate alive instead of red or blind

`qa:sweep` runs axe at wcag2aa over 17 routes and was clean 34/34. After this change `color-contrast`
fails on every route with a CTA.

Both easy answers were wrong. Disabling the rule blinds the sweep to every future contrast bug.
Leaving it permanently red trains everyone to ignore the gate. So the sweep **classifies**: nodes
reporting exactly `fgColor #ffffff` on `bgColor #ef762f` are counted as accepted and printed as
`(accepted: n white-on-orange, §8.29)`. **Any other contrast pair still fails.**

## 5. Gates

878 tests (100 files, up from 869/99), tsc 0, build 0, token-check 16 mappings, `qa:sweep` clean
34/34 with 79 accepted, `qa:payment` clean on sandbox keys, eslint **identical to main** (37 problems
before and after, a pre-existing baseline).

**Lighthouse accessibility measured, not assumed: 96** on Home, `/products/lumi` and the store, down
from 100, with `color-contrast` the only failing audit. **Still above the 90 gate**, which was not a
foregone conclusion and is the reason it was measured before claiming anything.

Production verified after each push: health green (`preorder:token`), 14/14 routes 200, all six
security headers with exactly one HSTS, the compare table's 12 cells and 2 headers all `text-white`,
**zero** ink-on-action across seven pages on both hosts, and both payment buttons seen white-on-orange
in a real browser.

## 6. Three things worth carrying forward

**A gate that cannot fail is not a gate — so both new guards were broken on purpose first (§8.28-g).**
`test/action-label.test.ts` was proven red by putting an ink label back, and it names the offending
`file:line`. The sweep's filter was proven **narrow** by putting a NON-white label on the same orange
fill: every route failed, while the genuine white-on-orange nodes were still counted separately. A
blanket rule-disable would have "passed" that test too.

**`lsof -tiTCP:3456` before trusting any local render.** The first control run looked half-broken (10
failures, Home inexplicably "ok") and was briefly misread as a pass. The cause was `kill %2` in a
fresh Bash shell, where that job reference does not exist, so a stale server kept serving a stale
build. Re-run with explicit PIDs, the control was unambiguous. This trap was already in `CLAUDE.md`
and still cost a re-run.

**A guard test must strip comments before scanning.** `test/action-label.test.ts` initially failed on
`Button.tsx`'s own doc comment, which describes the rule the test enforces. A guard that trips on the
documentation of the thing it guards is a guard nobody keeps.

## 7. Not done, deliberately

Nothing from this round is outstanding. The accepted contrast deviation is recorded in
`docs/project-state.json` under `blockers` with `status: "accepted"` so it reads as a decision rather
than as work.
