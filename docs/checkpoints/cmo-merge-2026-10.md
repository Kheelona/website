# The CMO's sales-first content, merged onto our own design system (2026-10-04)

**Status: BUILT AND VERIFIED LOCALLY 2026-10-04, AWAITING THE FOUNDER'S REVIEW OF THE VERCEL PREVIEW.
NOT MERGED.** Running record, appended at every commit (living-documentation law, founder 2026-09-05). Branch **`redesign-mockup-2026-10`** (PR #16). Rollback tag
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

### Commit 6 — /team becomes "Our story" on its own URL; /contact stays a page

- **/team:** the mockup's "Why we built Kheelu." leads, and main's manifesto line ("Every object a
  child holds is about to wake up.") opens the lede, so the page keeps its strongest sentence. The
  founder cards (CEO first, as the mockup orders them) now read from `lib/team.ts`, shared with
  Home's team strip, and **each card carries the element id its Person `@id` points at**
  (`/team#apoorva-sahu`…): those fragments resolved to nothing on the page before. Beliefs, the
  mockup's **three promises** (with promise marks; its automatic late refund was dropped as
  unpublished policy), the recognition strip, a short "Talk to us" that hands over to /contact.
  Title: "Our story: parents building smart toys for toddlers" (keeps the SEO round's keyword).
- **/contact** keeps its page (the store footer and Razorpay's review rely on it) and takes the
  mockup's warmer line: "a real person answers".
- **Flagged, not changed:** /contact's "The toy is designed and built here" sits uneasily beside
  `lib/product-facts.ts`, which says manufacture origin has never been claimed. It predates this
  round; it is on the founder list rather than silently rewritten.

Gate: `tsc` 0; `npm test` 1445 / 128.

### Commit 7 — the two new pages, /how and /faq, and the machine files

- **/how "How it helps"** (new): serve and return in three steps, the research (Harvard, worded as
  the source words it, caring adult included; Romeo 2018 as the journal already summarises it),
  **"What this research does not show"**, three no-toy tips, where Kheelu fits ("not a medical or
  therapy device"), the full growth arc **without** its tutor line (`GrowthArc closing={false}`,
  so the V6 narrative stays in four places), and a finale headed "Give your child more
  conversations every day." **Not carried:** the mockup's promise to publish pilot results "good or
  bad" (unsigned public commitment), and its "wait five seconds" (an invented number; the tip now
  uses the journal's published "pause longer than feels natural").
- **/faq** (new real page; its 308 to `/products/kheelu#faq` is removed from `next.config.ts`, the
  only change to that file): four groups from `lib/faq.ts`, each its own closed `<details>` list,
  FAQPage over every visible answer. Fixed from the branch: the attachment answer lost an
  unpublished "see how long your child talks" and its contraction; the Lumi answer is main's full
  one again ("older listings still say Lumi", §8.36-a); the voice answer names our own servers in
  India; the Diwali answer states the order rule honestly.
- **The Lumi answer no longer cites the narrator.** It said Kheelu "took the name of the character
  who narrates this site"; with the guide retired that became false, so on /products/kheelu and
  /faq it now reads "when it was renamed Kheelu".
- **Sitemap** gains `/how` and `/faq` (0.7). **llms.txt** gains both pages, the "Our story" label,
  and one line of the founder-confirmed facts (no camera; wake-word listening; own servers in
  India; it says it is a toy). `LLMS_UPDATED` bumped to 2026-10-04 in the same commit.

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | **0** |
| `npm test` | **1450 / 128**. From 1445: +1 (GrowthArc can omit the tutor line) +4 (`preorder-copy` and `preorder-cta` each walk the two new page files) = **1450** |

### Commit 8 — the microphone sweep reaches every page, and the spec table

The first pass caught the pages being rebuilt; a grep across `src/` found four more:
- **`llms.txt`**: "The microphone wakes to a word and is off the rest of the time." → listens only for
  its wake word, nothing recorded or sent before it.
- **The buyer's guide** (`/ai-toys-for-kids-in-india`) and the journal's **"what to look for in a
  safe AI toy"** both told parents "Off should mean off, not muted and waiting". That is a bar no
  wake-word toy can meet (it has to listen for its word), so the advice now asks what happens
  BEFORE the wake word. The journal's own Kheelu line now says nothing is recorded or sent before
  the wake word and that voice data stays on our own servers in India. That article's `updated`
  date moves to 2026-10-04, because its visible text changed (§8.35-a).
- **`lib/product-facts.ts`** feeds BOTH `SpecTable` and `Product.additionalProperty`: "Microphone"
  and "Where the voice data goes" now state the confirmed facts. **This changes the Product JSON-LD
  on every page that emits it**, deliberately.
- **Left alone on purpose:** `/privacy` still says conversations "stay in your region". It is true
  (India is the region), and the page is counsel-gated and outside this round's scope. The DPDP
  journal article's "voice data stays in your region" is likewise true and untouched.

Gate: `npm test` 1450 / 128.

### Commit 9 — the guards, each proven against a control

Four new test files, and every one was shown to FAIL on a planted violation before it was trusted
(an absence measured by the wrong instrument is not an absence):

| Test | Pins | Control that proved it |
|---|---|---|
| `test/cmo-merge-routes.test.ts` (26) | `/products/kheelu`, `/team`, `/contact` are pages and not redirect sources; `/how`, `/faq` are real pages; the mockup's `/kheelu` and `/story` were not built; `/products/lumi` still lands in one hop; every nav and footer link is a real page; the branch's placeholder and "verify" bans | — (structural; read from the config and the route tree) |
| `test/claims-gated.test.ts` (15) | bans, comments stripped: "free for life", every "microphone is off" form, "Kheelu helps/grows… brain", the mockup's two efficacy lines, "Meet Kheelu on 20 October", "We plan to be here for years", "publish the results… good or bad", "Made in Bengaluru/India", "how long your child talks", "Bedtime stories only after 7"; and pins that the three CONFIRMED claims reached their pages | a temp file with "free for life" + "the microphone is off" failed 2 cases; the same words in a comment failed none |
| `test/analytics-freeze.test.ts` (30) | the 13 frozen paths have no diff against `pre-cmo-merge-2026-10`; 15 config constants (pixel id, hosts, PostHog key/paths, replay deny list…) are line-identical; `next.config.ts` differs only by the `/faq` redirect. Skips, named, in a clone without the tag. **A round guard: retire after production verification.** | appending a comment to `lib/fbq.ts` and swapping the pixel id back to the retired one failed exactly those 2 cases |
| `test/cta-tracking.test.ts` (17) | only the ten agreed `cta` values exist, each still emitted; every store-bound `Button` carries `track`; no raw anchor reaches the store; ViewContent mounted on Home and `/products/kheelu` and nowhere else | renaming `home-reserve` failed 2 cases |

Also: `/how` and `/faq` joined `test/metadata-lengths.test.ts` and `qa:sweep` (36 → 40).

| Gate | Result |
|---|---|
| `npm test` | **1542 / 132**. From 1450: +26 +15 +30 +17 (the four new files) +4 (metadata-lengths, two pages) = **1542** |

### Verification on the finished branch (before docs and review)

All against a fresh `next build` served on **port 3460**. **3456 is held by a `next-server`
started 2026-09-20** (a stale build, the documented trap); it was left running, not killed, and
nothing here was measured against it. A first set of screenshots WAS taken from it by mistake and
discarded once `lsof` showed the start date.

| Check | Result |
|---|---|
| `npx next build` | passes, token gate included; `/how` and `/faq` prerender static |
| `qa:sweep` (`SWEEP_BASE=http://127.0.0.1:3460 SWEEP_STORE=http://store.localhost:3460`) | **clean, axe and voice, 40/40** (was 36). Accepted white-on-orange **113** (was 90): 43 at 390px + 70 at 1280px. The +23 = 8 from the two new pages (2 per page per width) + 15 from Home and the Kheelu page, whose desktop comparison now has 10 action-filled cells instead of 7 and whose Home gained two reserve buttons (`home-reserve`, `home-arc` moved). No OTHER contrast pair fails. |
| `qa:payment` (sandbox keys; the Supabase stub already running since 2026-09-20 with `STUB_WRITABLE=1`, same file) | **clean 10/10**: four fields, create-order 200, real sandbox order, amount from our tier table (49900), address token minted, Checkout sheet opens, nothing refused by the CSP, no page errors, signed webhook 200, forged webhook 400 |
| **Analytics probe**: the build under the real hostnames (`kheelona.com:3460`, `store.kheelona.com:3460` mapped to 127.0.0.1), fresh profile per route, every third-party request AND every same-origin `/ingest` request aborted, so nothing was delivered | On all 8 routes (Home, Kheelu, /how, /faq, /safety, /team, store, store /thanks): `fbq` queue holds `init 1051265191046395` and exactly one `PageView`, no other pixel; `fbevents.js` attempted; GA4 `G-7LMKSFEXZ9` attempted; PostHog made 5 requests, ALL to `/ingest`, **zero** to any `posthog.com` host. `ViewContent` = 1 on Home and the Kheelu page, 0 elsewhere. CTA values on the page: Home `navbar, hero, home-arc, compare, home-reserve, finale, sticky-bar`; Kheelu `navbar, product-top, product-foot, finale, sticky-bar`. |
| **The probe's control**: same build at `http://127.0.0.1:3460/` (a host in no list) | nothing initialised, nothing attempted, zero `/ingest`: the gate and the instrument both behave, so the positive rows above mean something |
| **Not verifiable locally, stated plainly** | The session RECORDER cannot load in the probe because `/ingest` (and so PostHog's remote config) is blocked by design; its control (loads on `store.kheelona.com/`, NOT on `/thanks`) is a production check after the merge, exactly as on 2026-09-19. The replay code is byte-identical to main (freeze test). |

### Commit 10 — the records

CLAUDE.md banner (what supersedes `main` on this branch, the two traps, the gate); **§8.42 a-h** in
`docs/website-steps.md`; a "THE CMO MERGE" section at the top of `Technical-Todo.md` (the founder's
review list, the post-deploy list, and mine, including retiring the freeze test and the pre-existing
`SectionHeading` leading defect found this round); the sell-out sweep now names `RESERVE_LABEL`,
`RESERVE_SHORT_LABEL`, the reserve bar's line and the tracker's new path; `MARKETING-TODO.md` marks
the claims settled and lists what the merge changed from the branch; `project-state.json` carries the
phase, the handoff and 1542 / 132.

**Next:** push the branch (PR #16 and its preview update), founder review, then `--no-ff` merge and
the production checks of section D.
