# Vendored component registry (R6, founder-approved 2026-07-10)

The centralized, reusable database of externally-sourced components. Rules:

1. **Copy, never depend**: components are vendored source (shadcn-style "open code"), pinned to a source commit in each file header. No registry CLIs, no components.json, no CVA.
2. **Restyle to brand tokens only** — the token drift gate (`tools/tokens/check-tokens.mjs`) must stay green; no new palette entries via vendored code.
3. **Every file header records**: source URL + registry item + commit, license, and the full list of brand modifications.
4. **Gates travel with the component**: decorative pieces must be `aria-hidden`, respect `prefers-reduced-motion`, cost nothing when JS is off, and have a kill switch (stop rendering at the single call site listed below).
5. New sources (Vengeance UI, Aceternity, Magic UI cherry-picks) get their own folder here and a row below.

## Sources

| Source | License | Verified |
|---|---|---|
| Animate UI (`imskyleen/animate-ui` @ `efeb96ffd7a3`) | MIT + Commons Clause — free commercial use inside a product/site; reselling the components themselves is barred (we don't) | 2026-07-10 |

## Index

| Component | File | From | Brand changes | Used on | Perf notes / kill switch |
|---|---|---|---|---|---|
| getStrictContext | `animate-ui/lib/get-strict-context.tsx` | `lib-get-strict-context` | none | tilt internals | — |
| Slot (motion) | `animate-ui/primitives/slot.tsx` | `primitives-animate-slot` | cn import | tilt internals | — |
| Tilt / TiltContent | `animate-ui/primitives/tilt.tsx` | `primitives-effects-tilt` | import paths | via `ui/TiltCard` on every card surface | transform-only; gating in TiltCard (hover+fine pointer+motion-ok). Kill: render plain div in `ui/TiltCard.tsx` |
| Ripple press effect | grafted into `ui/Button.tsx` (credited) | `primitives-buttons-ripple` | rebuilt for our Link pill: span ripples on pointerdown, brand white ripple, no whileHover scale (we have lift), reduced-motion off | every CTA | 600ms span per press. Kill: `ripple={false}` default in Button |

## Decisions log

- **HeroGlowBackground removed 2026-08-23** (doc-cleanup round). It was vendored for the Home hero,
  but the mount went with a later hero rewrite and nothing has imported it since: only its own test
  and story referenced it. Its index row had gone stale in a way worth noting, because it is how dead
  vendored code hides — the row still said "Used on: Home hero" and named a kill switch in
  `sections/home/Hero.tsx`, a path the `src/` reorg deleted. Recoverable from git history if the
  calm-glow treatment is ever wanted again.

- **Animate UI = primary registry** (founder 2026-07-10): rides our existing `motion` dep; a11y/perf-first philosophy; Radix-compatible.
- Bubble background's goo filter deemed off-brand + GPU-heavy → calm rebuild vendored instead (kept the blob/drift concept).
- Animated Radix accordion/sheet from Animate UI evaluated, NOT adopted: ours already carry the a11y contracts (entrance-only animations, sr-only titles) from R4; swapping risked regressions for equal polish.
- Hamburger↔X icon morph skipped: trigger and close live in different trees (Navbar vs Sheet portal); a shared morph adds state plumbing for a micro-gain. Lucide icons keep the family consistent instead.
