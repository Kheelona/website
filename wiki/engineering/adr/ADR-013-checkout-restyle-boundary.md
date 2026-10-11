---
title: "ADR-013: Checkout restyle boundary: logic files frozen byte for byte, three D048 diffs reviewed, presentation files restyled under a logic signature and a rendered JSX contract, the checkout tests frozen"
type: adr
updated: 2026-10-12
sources:
  - ../../raw/brief/kickoff-brief.md (§4.4)
  - ../../site/checkout.md ("What must not change, and what the reset restyles", load-bearing details)
  - ../../site/tracking-inventory.md (rows 0, 5, 17, 18 of the parity checklist)
  - ../../decisions/D048-beta-deployment.md
  - ../lessons.md (§4 store and payment invariants; §5 freeze the tracking layer)
  - ../../qa/architecture-review-2026-10-12.md (B3, N9)
  - "src/features/preorder/components/PreorderForm.tsx:192-269 (form, fields, submit), src/app/store/thanks/page.tsx:60-125 (early return at 72, order read at 75, first `return (` at 90, ph-no-capture container at 118), read 2026-10-12"
  - "Selectors of the six checkout tests (grep 2026-10-12): exact copy strings such as 'Your Kheelu is reserved.', 'That page is not here.', '₹499 today', 'pre-order terms'"
  - "git diff --stat archive/pre-reset-2026-10-10 HEAD over the frozen paths (identical except package.json, vercel.json, src/lib/family.ts), 2026-10-12"
---

# ADR-013: The checkout restyle boundary

**Status:** accepted by the Architect, 2026-10-12; revised the same day after QA review B3.

## Context

Brief §4.4: checkout logic stays; restyle only; no change to payment, pricing, discount, tax or order
logic without the founder. The checkout page lists what must not change and the load-bearing details
inside the presentation layer (field names, `autocomplete`, `noValidate`, the single `onChange` that fires
`preorder_form_started`, the `ph-no-capture ph-mask` container on `/thanks`, store noindex, inputs at
16 px or more, no `<video>` until play, the refund promise beside the pay button). The frozen paths are
byte-identical to the tag `archive/pre-reset-2026-10-10` today. D048 needs three small, authorised changes
inside them.

Round 1 froze a presentation file's "logic region" from its opening line to its first `return (`. QA showed
that misses exactly what a restyle touches: the form's `onChange` and `noValidate`
(`PreorderForm.tsx:193`), every field's attributes (`:194-241`), the submit button and its three labels
(`:255-269`), and on `/thanks` everything after the first `return (` at line 90, including the paid and
confirming branches and the `ph-no-capture ph-mask` container. The six existing checkout test files were
also unowned and unfrozen, so a restyle could have edited them.

## Options

1. Freeze presentation files byte for byte. Blocks the restyle itself.
2. Freeze up to the first `return (` (round 1). Blind to the JSX.
3. Freeze every JSX attribute whose value is an expression. Blocks the restyle too: replacing a legacy
   `<Row label value>` with a DS component changes those attributes.
4. **Four proofs that together pin behaviour, not markup:** a byte freeze of the logic files and of the
   checkout tests; a reviewed logic signature per presentation file; a rendered contract seeded from the
   tag; and the behavioural tests and sandbox probe.

## Choice

Option 4.

| Class | Files | Rule | Proof |
|---|---|---|---|
| **Frozen** | `src/lib/store/**` except the three below; `src/app/api/**`; `src/proxy.ts`; `src/features/preorder/lib/**`; `src/lib/{fbq,posthog,campaign,click-id,trailing-slash,security-headers}.ts`; `src/lib/email/**`; `supabase/migrations/**`; the money block of `src/config/site.ts` (formatter, paise constants, derived prices, cap) | Zero diff | `test/guards/checkout-freeze.test.ts` byte-compares each file with `git show archive/pre-reset-2026-10-10:<path>` |
| **Frozen tests** | `src/features/preorder/components/{PreorderForm,OrderSummary,AddressForm}.test.tsx`, `src/app/store/_components/NotFoundPanel.test.tsx`, `src/app/store/thanks/page.test.tsx`, `src/app/store/ideabaaz/page.test.tsx` | Zero diff, except a **literal-only** reviewed patch: the token stream is unchanged once string, template and regular-expression literals are masked, so a selector can follow approved copy but no assertion can be added, removed or weakened | Same guard; the patches live in `test/guards/fixtures/authorised-diffs/` and are reviewed by QA |
| **Authorised diff (D048)** | `src/lib/store/host.ts` (`betastore.kheelona.com` is a store host); `src/lib/store/env.ts` (CAPI token absent on beta); `src/lib/store/posthog-server.ts` (`env` on every non-production build) | Only the lines named in [architecture §15.3](../architecture.md#153-beta-per-d048-the-exact-code-changes) | The same guard compares against a stored, reviewed patch; behaviour tests show production output identical to the tag |
| **Presentation** | `src/app/store/**/page.tsx`, `src/app/store/layout.tsx`, `src/app/store/not-found.tsx`, `src/app/store/_components/**`, `src/features/preorder/components/{PreorderForm,OrderSummary,AddressForm}.tsx` | Markup, classes, copy and presentation imports only | (a) **Logic signature** (`test/guards/checkout-signature.test.ts`): from the TypeScript AST, every statement outside JSX (declarations, hooks, handlers, awaits, early-return conditions), the conditions and `.map` callees inside JSX expression containers, and the contract attributes, normalised and compared with a stored signature seeded from the tag; a restyle regenerates it in the same commit and the diff is reviewed (only `copy.*` or `content.*` reads and presentation imports may appear). (b) **Rendered contract** (`test/guards/checkout-jsx-contract.test.tsx`), seeded from the tag and never edited: per component and state, the form's `noValidate` and single change handler, every field's `name`, `type`, `inputMode`, `autocomplete`, `maxLength`, `required`, the submit button's `type`, `disabled` and label per state, the refund sentence beside it, `ph-no-capture ph-mask` on the `/thanks` order container in the paid and created branches, store noindex (detail: [architecture §16.2](../architecture.md#162-the-jsx-contract)). (c) The frozen tests stay green and `npm run qa:payment` reaches the open Razorpay sheet in test mode |

Proof that the proofs work: the contract test is shown red in a scratch commit (never kept) by removing
`noValidate` and by dropping `ph-no-capture` from the paid branch; the signature test by adding a
condition; the freeze by a one-character edit to a frozen test assertion.

The fixtures are seeded from today's tree, which the freeze guard proves byte-identical to the tag in the
same run, so "seeded from the tag" holds without checking out the tag.

Two presentation rules that follow:

- **Delivery line on `/thanks` (F12 open, QA N9):** orders created before 2026-10-10 00:00 IST keep "Ships
  from 20 October 2026" as today; later orders show the D023 line. The choice lives in a new presentation
  module (`sections/store/OrderRows/delivery-line.ts`), not in the frozen page; the page's signature gains
  only the prop that passes the order it already reads.
- The B11 checkout events (payment window opened, payment failed with reason, form rejected by field) are
  new events, allowed by brief §9.4, but they add calls inside the frozen `checkout.ts` and the form's
  logic, so they sit in their own task (6.2), gated on the main session's confirmation, with a reviewed
  patch and signature.

## Consequences

- The store, `/thanks`, the event page, the partner page and the store's not-found page get the new look
  with no change to what is charged, stored or sent, and the proof covers the JSX where the restyle works.
- Every store task carries extra review: its signature diffs and any literal-only test patches.
- The Razorpay theme colour `#EF762F` stays (it equals `chilli-500`) because it lives in the frozen
  `checkout.ts`.
- Any future change to a frozen file needs a decision ID in its commit message and an updated reviewed
  patch, which keeps the boundary visible.
