# The CMO's sales-first content, merged onto our own design system (2026-10-04)

**Status: IN PROGRESS.** Running record, appended at every commit (living-documentation law,
founder 2026-09-05). Branch **`redesign-mockup-2026-10`** (PR #16). Rollback tag
**`pre-cmo-merge-2026-10` = `77552ff`** (main before any of this, and before the CMO branch).

---

## Why this round exists

The CMO's mockup arrived as PR #16 (four commits, 2026-10-02, 227 files). It carries two different
things in one diff:

| Kind | What it is | Fate |
|---|---|---|
| **Content and folds** | a sales-first page order, a comparison against a smart speaker, a tablet and a robot toy, safety written as "can and can't do", the new `/how` and `/faq` pages, a price fold, the founders on Home, a sticky reserve bar, content doc v7 copy | **Kept**, rebuilt on the shared components |
| **A design-system swap** | v4 tokens, Fraunces + DM Sans, dark mode, ~60 hand-built `kh-*` classes, pages that bypass the registry, the 2.88:1 CTA exception "retired" without a founder decision | **Dropped.** Founder: "we will still continue using our website Design System" |

The founder's framing: the current site is product-focused, the CMO's is sales-focused, and the job
is the best of both without breaking any feature, SEO / GEO / AEO, the Google listing, or analytics.

## Founder decisions, 2026-10-04

| | Decision | Consequence |
|---|---|---|
| URLs | **Keep `/products/kheelu`, `/team`, `/contact`.** Add only `/how` and `/faq` | Nothing indexed moves; the product page already moved once on 2026-09-05. The branch's `/kheelu` and `/story` are not built |
| Mascot | **Drop the Kheelu guide, add the sticky reserve bar.** Scroll reveals and the backdrop STAY | All 48 `say=` lines go. The bar inherits the dock's hide-at-`#reserve` behaviour, which the branch had lost |
| Claims | **Confirmed TRUE: no camera; it says it is a toy and never asks for a secret; voice goes only to Kheelona's own servers, in India.** NOT confirmed: "talking is free for life" | The three ship. "Free for life" stays off and is banned by a test |
| Brain claim | **Research-anchored.** Conversation helps a young brain grow and Kheelu gives a child more of it; never "Kheelu grows the brain" | Consistent with `/how`'s own "we have not yet shown…" line, defensible under the ad-standards code, nothing contradictory for an answer engine to quote |
| Analytics | **The Meta Pixel and PostHog integrations must be carried forward properly** | Frozen byte-identical to `77552ff` and guarded by a test (below) |

Defaults taken in the approved plan, open to the founder: nav = Meet Kheelu · How it helps · Safety
· Stories · Our story (`/team`) · FAQ, with PlayOS moving to the footer (reverses V4 D6); the CTA
label becomes the CMO's "Reserve Kheelu for ₹499" and joins the §8.26-g sell-out sweep; the
microphone wording is swept to the CMO's accurate wake-word version; the finale reads "Kheelu ships
from 20 October" (not "Meet Kheelu on…", which implies delivery that day); Home's parent-app card
uses the REAL dashboard screenshot rather than sample screens with an unconfirmed control; the
footer keeps "Designed by parents in Bengaluru" (manufacture has never been claimed).

## The analytics freeze (founder requirement)

Both integrations live almost entirely outside the pages, so that layer is frozen byte-identical to
`pre-cmo-merge-2026-10` and a test fails if any of it moves:

- `src/app/layout.tsx` (every tag mounts here), `src/components/molecules/{MetaPixel,PostHogGate}.tsx`
- `src/lib/{fbq,posthog,click-id,campaign}.ts`
- `src/proxy.ts` (the `kh_utm` cookie, `kh_fbclid`, the `/ingest` exclusion), `src/lib/security-headers.ts`
- `src/lib/store/**`, `src/app/api/**`, `src/app/store/**`, `src/features/preorder/**`
- `next.config.ts` changes ONLY by losing the `/faq` redirect; `src/config/site.ts` changes ONLY in
  nav, footer and label constants

Pages touch the integrations in exactly three ways, each mapped: the CTA `track` values (kept names
for surviving folds; new: `home-reserve`, `sticky-bar` only), `ViewContentTracker` (stays on
`/products/kheelu`, added to Home per the founder request recorded on the branch), and
`ph-no-capture` on `/thanks` (store untouched).

**The Vercel preview will show NO pixel and NO PostHog, and that is correct**: `*.vercel.app` is in
no host list. Analytics is verified on a local production build under the real hostnames with every
measurement request blocked, then on production after the merge.

---

## Running record

### Commit 0 — this file

Branch checked out tracking `origin/redesign-mockup-2026-10`; tag `pre-cmo-merge-2026-10` cut at
`77552ff`. The branch's changed files were snapshotted outside the repo for reference before the
tree is rebased onto main's design system in commit 1.
