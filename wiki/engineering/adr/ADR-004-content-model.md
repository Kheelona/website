---
title: "ADR-004: One content model in typed TypeScript modules, with a placeholder type the production build refuses"
type: adr
updated: 2026-10-12
sources:
  - ../../raw/brief/kickoff-brief.md (§6 Architect "Content model", §4.2, §9.8)
  - ../../site/content-boundary.md
  - ../../site/pages/*.md (copy, meta, cta values, full-mode variants, placeholders)
  - ../../product/pricing.md, ../../product/policies.md, ../../product/facts.md
  - ../phase-4-kickoff.md (§3 decision 2)
  - src/config/site.ts, src/lib/stories.ts, src/lib/stories-expansion.ts, src/lib/product-facts.ts (read 2026-10-12)
---

# ADR-004: The content model

**Status:** accepted by the Architect, 2026-10-12.

## Context

Brief §6: copy, product facts, prices, CTA labels, FAQs and trust items live in one source and render
wherever they are needed; nothing hard-coded in components; a future Hindi version possible without a
rewrite. The content boundary says the content model holds EXTERNAL items only. The kickoff adds: price
values from one price source (TOKEN, BALANCE, LAUNCH, FULL; MRP ₹7,999 as its own value, D034), the
delivery line, policy constants, the seller block, and **a production build that fails on any
`[PLACEHOLDER` text**. The copy pages carry about 110 placeholders today (privacy 33, product 21,
refund 20, team 10, others), most waiting on founder facts.

The current code keeps money in `src/config/site.ts` (paise constants, `formatInr`), and article text in
TypeScript (`src/lib/stories*.ts`). Checkout code imports `site.ts`, which is frozen
([ADR-013](ADR-013-checkout-restyle-boundary.md)).

## Options

1. A headless CMS. Adds a vendor, credentials and a second source; the founder signs off copy in the
   wiki, not in a CMS (D015).
2. MDX for prose and TypeScript for data. Adds `@next/mdx` and a second authoring model.
3. **Typed TypeScript modules under `src/content/<locale>/`, an inline markup mini-language for rich
   text, the money staying in `src/config/site.ts`, and a branded `Placeholder` type.**

## Choice

Option 3.

- **Locale folder:** `src/content/en-IN/...`; shapes in `src/content/types.ts`; every module uses
  `satisfies` so a future `hi-IN` folder must have the same shape. Routes stay unprefixed in v1.
- **Money stays where the checkout reads it**: `src/config/site.ts` (paise, frozen). One addition,
  `MRP_AMOUNT_PAISE = 799_900` and `MRP_PRICE`, its own value per D034, added in task 1.3. Content never
  types a ₹ amount: it uses tokens (`{price:token}`, `{price:balance}`, `{price:headline}`,
  `{price:full}`, `{price:mrp}`) resolved by the offer view model ([ADR-005](ADR-005-offer-follows-live-mode.md)).
- **Rich text:** one inline syntax, parsed by one `RichText` primitive and one plain-text serialiser:
  `{hand:…}`, `{mark:…}`, `{nowrap:…}`, `[label](href)`, `[^n]` (source marker), `{price:…}`,
  `{delivery}`, `{ph:ID note}`. The serialiser produces the exact visible text for JSON-LD (FAQPage
  answers word for word), `llms.txt` and meta descriptions.
- **Mode variants:** any string that changes with the offer mode is `{ token: string; full: string }`.
- **Placeholders:** `{ph:F4 size and weight}` in rich text, or `placeholder('F4', 'size and weight')`
  in data, both of type `Placeholder`. They render `[PLACEHOLDER F4: size and weight]` in the
  `ks-placeholder` style (the mockup's dashed marker) on every environment except production.
  `scripts/guards/placeholders.mjs` scans `src/` for `{ph:`, `placeholder(` and the literal
  `[PLACEHOLDER`; it **exits 1 when `SITE_ENV` is `production`** and prints the count otherwise. A second
  pass after `next build` scans the prerendered HTML in `.next/server/app` the same way. Legal
  documents carry `status: 'draft' | 'approved'`; a draft document is a placeholder by definition.
- **Proof-gated content** (D038: founder bios, recognition) is not a placeholder: it is
  `gated: { proof: 'F11' }` and is **not rendered** until the gate is lifted, on any environment.
- **Copy precedence for builders:** (1) a founder decision logged after Gate A; (2) the approved
  mockup's visible text; (3) the copy page for what the mockup does not show (full-mode variants,
  meta, alt text, schema). A conflict is reported, never resolved silently (brief §3).
- **Boundary:** `src/content/**` holds EXTERNAL items only; ESLint `no-restricted-imports` bars `src/`
  from importing `wiki/`, `mockup/` or any `design-system/**/*.md`; the banned-phrases guard covers
  internal leakage (survey figures, competitor names, counts).

## Consequences

- A new campaign page, product or story is a new content module plus one registry line; no component
  changes (the scalability test, brief §6).
- Every price on every page, in JSON-LD, `llms.txt`, `pricing.md`, meta descriptions and the Meta
  `ViewContent` value comes from the same constants the checkout charges from.
- Beta can show the founder every gap in place; production cannot ship one. If the production build
  fails, Vercel keeps the previous deployment live.
- The 18 articles still to be rewritten are content-only tasks (one module each).
