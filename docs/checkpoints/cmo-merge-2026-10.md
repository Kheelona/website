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

### Commit 3 — Home, sales-first, on the room grammar

The CMO's order with main's proof kept in it: hero (the mockup's H1 and ticks, main's offer card
and LCP stage) → trust strip + "Recognised by" logos → films (`VideoMoments`, `#watch`) → "What
pilot parents told us." → how it works (four steps, age tabs, "Why conversation?", the tutor line,
`cta=home-arc`) → the product-type comparison (`cta=compare`) → "What Kheelu can and cannot do." +
the voice path → "Two more things to know." (languages in their own scripts carrying Home's ONLY
footnote-1 marker and the bilingual-article link; the REAL parent-app screenshot) → the price
(`PriceTable`, three promises, `cta=home-reserve`, Kheelona+ band) → the founders → eight FAQs +
"See all questions" → the journal (now previewed with each article's own photo) → the finale.

- **The Harvard line was checked against its source** (developingchild.harvard.edu, 2026-10-04):
  the page says serve-and-return exchanges "play a key role in shaping brain architecture" and
  defines them as being "between a young child and a caring adult". The mockup's "building block"
  is not on that page, so Home now quotes the page's own claim AND its adult, and sends the reader
  to `/how` for where the research stops.
- **Microphone sweep starts here:** Home's safety FAQ now reads "listens only for its wake word and
  records or sends nothing until it hears it", not "the microphone is off".
- **Contraction-free:** the mockup's "can't", "it's" became "cannot", "it is" (voice law; Kheelu's
  quoted speech is the only exemption).
- **ViewContent on Home** (founder request recorded on the branch): `ViewContentTracker` moved to
  molecules with the same payload. Counts step up from deploy.
- **Retired with their stories and tests:** `features/home/{Family,KheeluOrbit,ParentAppSection}`,
  `FeelingsGallery` + `lib/feelings.ts`, `HowItWorksLoop` (registry member; nothing else used it),
  and `lib/kheelu-poses.ts` (its last users were the guide, the gallery and the orbit). Their CSS
  went too (orbit keyframes, the feelings dialog). **Correction to the plan:** the mascot drawings
  do NOT leave the site entirely; the journal pages still illustrate articles with
  `/mascot/mascot-*.png` through `Story.pose`. Out of scope for this round, recorded so nobody
  believes the art conflict is fully settled.
- **A contrast catch before it shipped:** the voice-path note was `ink-muted` on the cool wash
  (4.21:1, banned); it is `text-ink`.

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | **0** |
| `npm test` | **1445 / 128 files**, staged. From 1427: −16 (Family 3, KheeluOrbit 3, ParentAppSection 3, FeelingsGallery 4, HowItWorksLoop 3) +25 (TrustStrip 3, HowItWorks 5, AgeTabs 3, TwoReasons 5, PriceRoom 5, TeamStrip 4) +10 (Hero 6→9, Compare 3→5, TrustRoom 3→5, Journal 3→4, a11y-v4 4→6) −1 (parameterised: `preorder-copy` and `preorder-cta` each lose one net source file, `stories-parse` gains one) = **1445** |

### Commit 4 — Meet Kheelu stays product-deep, on its own URL

`/products/kheelu`, unchanged URL, Product `@id` and FAQ (all 18). The mockup's research-anchored
hero ("An AI toy built for the conversations that help a young brain grow.") over the colourway
picker; then the three modes (`KheeluModes` IS the mockup's "three ways to play", so no second,
shorter list that could drift) → chat demo → the guarded four-step path with the page's only PlayOS
link (step 01 swept: "nothing is recorded and nothing is sent", not "the microphone is off") →
Story mode + films → **"When parents reach for Kheelu."** (the mockup's day; "quiet hours switch
Kheelu off" became "keep Kheelu quiet", the published feature) → PacePanel → parent app +
Kheelona+ band (the mockup's what's-included table says exactly that, so it is said once) → **the
shared comparison** → **Specs (`SpecTable`, the same source as `additionalProperty`) beside what is
in the box** → **the product family, moved here from Home** → PriceTable (`cta=product-foot`) → FAQ
→ finale. The pilot quotes left this page; Home carries them (the V5-6 repetition lesson).

Gate: `tsc` 0; `npm test` 1445 / 128 (unchanged: no test reads this page directly; the page-level
CTA and ViewContent guards land with the guards commit).

### Commit 5 — /safety: the mockup's structure, the answers kept visible

"How we keep Kheelu safe." → the flagship answer (visible, AEO) → "The four basics." with the
listening answer → where the voice goes (answer + the three stops + the four custody promises; the
first renamed "Kept in India", founder-confirmed) → the two follow-up answers → "Certificates: what
is done and what is next." (adds the already-published "Toy-safety certification: In progress") →
"What if Kheelona ever shuts down?" → "What you control." → the safety FAQ → a WhatsApp band → the
finale.

- **The microphone sweep, completed for this page:** the flagship answer, the listening answer,
  the first basic and the toddler checklist no longer say "off" or "Not muted. Off."; they say it
  listens only for its wake word and records or sends nothing before it.
- **"Our own servers, in India"** replaces "your region" and "Kheelona's own voice brain", per the
  founder's confirmation.
- **The drafted "Is an AI toy OK for a three-year-old?" answer is removed.** It was
  GATED:founder-signoff from the day it was written, shipped to production unsigned, and the
  mockup dropped it too. Its one new fact (it says it is a toy) is now confirmed and lives on Home.
- **The shut-down answer is the true one, not the mockup's.** "We plan to be here for years" was a
  promise nobody signed; the page now says AI mode needs our servers while Story mode and Bluetooth
  do not, and stops there.
- **Kept visible, deliberately unlike the mockup:** the answers stay AnswerBlocks rather than one
  accordion, because this page ranks for "are AI toys safe" and engines quote what they can see.

Gate: `tsc` 0; `npm test` 1445 / 128.
