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

### Commit 1 — the tree rebased onto main's design system

`git checkout pre-cmo-merge-2026-10 -- .`, then every branch-only file removed except
`MARKETING-TODO.md`, this checkpoint and the three content data files (`src/lib/{comparison,faq,team}.ts`).
`git diff --name-status pre-cmo-merge-2026-10` now lists exactly those five additions, so every
design-system file, every page, the store, the analytics layer and CLAUDE.md are byte-identical to
main. The CMO's four commits stay in this branch's history as the reference for the content.

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | **0** |
| `npm test` | **1403 passed / 126 files** = main's 1397 + 6. Reconciled, not accepted: `preorder-copy` and `preorder-cta` each enumerate every `src/` file through `git ls-files`, so the three new data files add one case to each. |

### Commit 2 — the shared pieces, and the guide retired for the reserve bar

One commit, not two: the label rename and the guide removal touch the same page files, and splitting
them would have committed half-edited pages.

- **Config.** Nav = Meet Kheelu · How it helps · Safety · Stories · Our story (`/team`) · FAQ, on the
  URLs the site already ranks for; PlayOS to the footer. `PREORDER_LABEL` is DELETED (a stale import
  fails the build) for `RESERVE_LABEL` "Reserve Kheelu for ₹499" and `RESERVE_SHORT_LABEL` "Reserve
  ₹499", both commented as token-mode-only and line one of the §8.26-g sell-out sweep.
- **`CompareTable` takes `columns`/`rows`.** The branch's forked `ComparisonTable` is folded in; the
  buyer's guide keeps the category table as the default. **One deliberate departure from the plan:**
  no chip switcher on phones. The design system's existing phone layout (one card per claim, every
  column visible) already solves the width problem the chips were for, so adding a second phone
  pattern for one table would have been a fork of its own.
- **`lib/comparison.ts`** derives its Indian-language list from `KHEELU_LANGUAGES` and drops the
  monthly-fee row ("Talking is free for life", NOT founder-confirmed). "Camera: None" ships
  (confirmed 2026-10-04).
- **New:** `Tabs` (WAI-ARIA tabs on the v3 chip shape, `PRESS_TINT`, every panel kept in the DOM)
  and `StickyReserveBar` (phones only, `track="sticky-bar"`, **hidden while `#reserve` OR the footer
  is on screen**, re-armed per route). Both with a story and a test.
- **Extended:** `Faq` `openFirst`; `FinaleCTA` `title` with the default **"Kheelu ships from 20
  October 2026."** (the mockup's "Meet Kheelu on 20 October" promised delivery on the dispatch date);
  `ParentQuotes` per-card headlines from content doc v7; Navbar `aria-current` and the short label;
  Footer seller of record + WhatsApp "messages only", and NOT the mockup's "Made in Bengaluru".
- **The guide is gone.** `KheeluGuide` + story + test deleted; 85 `guide=`/`say=` props stripped from
  16 files; `Room`, `PageHero`, `LegalDoc` lose the props and the `data-guide`/`data-say` attributes;
  the guide's CSS block removed; `SiteChrome` mounts `StickyReserveBar` in its place. Reveals and the
  backdrop are untouched. The tests that asserted the attributes now assert their ABSENCE.

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | **0** |
| `npm test` | **1427 / 127 files**, run with every change STAGED (the guard tests read the index). Reconciled from 1403: −5 (KheeluGuide.test) +26 (new direct cases: Tabs 6, StickyReserveBar 6, CompareTable 4, Footer 3, Faq 2, ParentQuotes 2, Navbar 2, FinaleCTA 1) +3 (`preorder-cta`, `preorder-copy`, `stories-parse` each gain two new files and lose the guide's) = **1427** |

**Trap re-learned here, worth its line:** a `git stash` round-trip during reconciliation silently
UN-staged the guide's deletions (`git stash pop` restores the tree, not the index), which would have
skewed the parameterised counts. Re-staged by name before the counted run.
