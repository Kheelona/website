---
title: "Phase 4 kickoff: what the Architect starts from after Gate A"
type: plan
updated: 2026-10-11
sources: [../raw/brief/kickoff-brief.md, ../decisions/D043-all-pages-as-mockups-before-build.md, ../decisions/D046-gate-a-approved.md, ../decisions/D047-vercel-build-and-data-regions.md, ../site/gate-a-progress.md, ../site/strategy.md, ../site/tracking-inventory.md, ../site/checkout.md]
---

# Phase 4 kickoff (after Gate A, D046)

**First steps in the next session:** read [status](../status.md), this page, the brief's Phase 4 section
(`raw/brief/kickoff-brief.md` §7), then start the **architect** agent with this page as its input. Its
plan then goes to the **qa** agent for the architecture review. Phase 5 (builder) follows without another
founder stop until Gate B (D043, D046).

## 1. What was approved (the target)

| Source | What it holds |
|---|---|
| `mockup/pages/*.html`, `mockup/partials/*`, `mockup/css/*`, `mockup/mockup.css`, `mockup/mockup.js` | The 18 approved pages: structure, DS classes, behaviour (sticky bar, films, drawer, reveals) |
| `wiki/site/pages/*.md` | The copy for each page, with sources, meta titles and descriptions, and cta values |
| `design-system/project/` (read-only, v11, checksummed) | Tokens, `bundle.css` classes, assets, rules |
| `wiki/site/strategy.md` §3-§5 | CTA rules, URL plan, page outlines |
| [D040-D047](../index.md) | The founder's rulings since the morning of 2026-10-11 |

## 2. Hard constraints (each from CLAUDE.md or the brief)

Next.js 16 (read `node_modules/next/dist/docs/` before writing code) · checkout logic unchanged ·
tracking parity: every ID and event name unchanged ([inventory](../site/tracking-inventory.md)) · the DS
is the only visual source, through a token bridge, never edited · phones first · no Vercel CLI, nothing
pushed to `main` before Gate B · `npm install` only by name with `--save-exact` · secrets keep their
names, never `NEXT_PUBLIC_` · stage by name · `mockup/_work/` and the demo video never committed.

## 3. Decisions the architecture must make

1. **Components from the mockup's composed patterns.** Each `mk-*` helper becomes a component or a
   section: the price sentence (always the exact D028 text, amounts from one price source), the trust
   line, the phone sticky bar (G-09 behaviour: from first paint on pages with no hero CTA, steps aside
   for inline CTAs), the films strip (a rewrite of the live `VideoMoments`, keeping the live labels
   "Play: …", "Previous video", "Next video"), the app-screen device frame (D044), FAQ blocks feeding
   FAQPage JSON-LD word for word, the OfferCard, the phone comparison stack (G-05), source markers (G-18),
   the guides cards (fold 7b), legal-page layout (summary, contents, sections).
2. **One content model.** Price values (TOKEN, BALANCE, LAUNCH, FULL; MRP ₹7,999 as its own value,
   D034), the delivery line, policy constants (7-day returns from delivery, 6-month warranty, 48 hours /
   one month grievance, 36-month retention, refunds start within 2 working days), the seller block, page
   copy. **The production build must fail on any `[PLACEHOLDER` text.**
3. **Regions and data (D047).** Store server functions: an Indian Vercel region (today iad1; store LCP
   3.3 s on phones) weighed against Supabase in ap-southeast-2 until the founder moves it. Plan the move
   (keep env var names). /privacy must name the order-data location until then; toy conversations are on
   GCP India.
4. **Tracking module and event registry.** The eight existing `cta` values stay; reconcile the new ones
   used in the mockups (`see-it-ask`, `see-it-ask-learn`, `safety`, `safety-learn`, `sticky-bar`,
   `product-offer`, `product-safety`, `refund-learn`, and others in the page build reports); the three
   new checkout events (working default B11); `?internal=1` (B46); Meta ViewContent on Home (B9).
5. **SEO, AEO, GEO infrastructure.** Per-URL metadata from the copy pages; Product JSON-LD with
   `availabilityStarts` 2026-11-15 (D037), FAQPage, Organization; robots allowing AI crawlers except
   Bytespider (D041); llms.txt; one-hop 301s for `/playos` and the 2-year-old article (D041); guessable
   404 redirects (`/kheelu`, `/careers`).
6. **Media pipeline.** Films (≤ 4 MB each, posters, captions burned in), app screenshots, DS photo
   derivatives generated outside `design-system/`; performance budget for phones.
7. **Guardrails.** DS checksums, banned-word and claim guards (claims.md), placeholder guard, tracking
   parity test, sideways-scroll check by `clientWidth` (see [lessons](lessons.md)), axe with the D041
   white-on-Chilli exception reported apart.

## 4. Carried into Phase 5 (not blockers for the plan)

Reviews and fixes that did not run before approval ([gate-a-progress](../site/gate-a-progress.md)) ·
the two screenshot re-edits (D044) · rewriting the other 17 articles to the three approved templates ·
app fixes before launch (the "Khelu" spelling, 36-month retention in the app, the Hindi chat title) ·
founder to-dos ([Gate A open items §4](../site/gate-a-open-items.md#4-founder-to-dos-not-questions)).
