---
title: "CMO built-page review: the four blocks the visual pass hides whole (task 8b.1b checkpoint, D052, D058)"
type: qa
updated: 2026-10-14
sources:
  - ../raw/brief/kickoff-brief.md (section 4 non-negotiables; section 6 CMO Reviewer)
  - ../engineering/tasks.md (8b.1b, "Checkpoint (D052)")
  - ../decisions/D058-follow-the-live-code-check-2026-10-14.md (items 1, 3, 6, 8, 9)
  - ../decisions/D052-qa-checkpoints.md
  - ../decisions/D046-gate-a-approved.md (line 20, the app-screen caption)
  - ../decisions/D015-founder-signs-off-copy.md
  - deviations.md (V27, V28, V32, V33; V11 for the §7 regions)
  - ../site/pages/meet-kheelu.md (fold 5; "Changes after approval (task 8b.1)"; questions 10, 13)
  - ../site/pages/safety.md (fold 4; "Changes after approval (task 8b.1)" round 2; "(task 8b.1b)"; questions 8, 9)
  - ../site/pages/privacy.md (Section 7; "Changes after approval (task 8b.1)" row 13)
  - ../site/pages/terms.md (Section 10; "Changes after approval (task 8b.1)" rows 3-8, round 2 rows 11-14)
  - cmo-review-claims-8b.1-2026-10-14.md (m1, m7, m9; carried items)
  - ../open-questions.md (G26, G28, G31)
  - "design-system/project/components/TrustList/README.md:3 ('A two-by-two grid'); design-system/project/components/bundle.css:353-358 (kh-trust); design-system/project/assets/Icons/microphone-slash.svg"
  - "mockup/meet-kheelu.html:232-261, mockup/safety.html:104-131, mockup/privacy.html:216-249, mockup/terms.html:204-209; mockup/css/shipping.css:20-22, refund.css:20-22 (odd-item span; text-wrap on a hyphen split)"
  - "src/content/en-IN/products/kheelu/page.ts:165-196; src/content/en-IN/pages/safety.ts:114-154; src/content/en-IN/legal/privacy.ts:374-418; src/content/en-IN/legal/terms.ts:292-323; src/content/en-IN/offer.ts:16; src/components/sections/FeatureSplit/FeatureSplit.tsx:181-232, feature-split.css:30-36; src/components/sections/TrustSection/trust-section.css:37-43"
  - "Production build in .next (BUILD_ID written 2026-10-14 11:27, after dae33e6; every module above last changed before it), served with next start on port 3700; Playwright 1.63.0 Chromium; @axe-core/playwright 4.12.1; run 2026-10-14"
---

# CMO built-page review: the four hidden blocks (task 8b.1b checkpoint)

**Verdict: PASS. No blocking issue; 3 minor, all on `/safety` fold 4.**

| Block | Verdict |
|---|---|
| 1. `/products/kheelu` fold 5, the words column | **Pass** on every criterion |
| 2. `/safety` fold 4, the parent controls list and the privacy screen's alt | **Fail (minor)** on two criteria: a hyphen split and a lone word in the age item (m1); three cards in the DS's two-by-two grid leave an empty cell from 720 px (m2). Alt: pass, with one optional improvement (m3) |
| 3. `/privacy` §7, both lists (the phone list and the laptop table) | **Pass**. One known minor from the 8b.1 review is carried, not re-raised (C1) |
| 4. `/terms` `#account` | **Pass** on every criterion |

The words in all four blocks match their copy pages and deviation rows exactly. Not one line repeats a claim D058
withdrew. The blocks use the DS's own components, type steps, colours, spacing and icons, the same as the mockup's
neighbouring blocks. axe finds no violations. Nothing overflows at any width from 360 to 1440 px. Motion is the
mockup's (one 0.24 s reveal), and it is instant under reduced motion.

The two `/safety` fixes are small, have been tried on the live build, and are for the Builder. The page can go to
beta as it is, but both should be fixed before Gate B.

The founder signs off every line ([D015](../decisions/D015-founder-signs-off-copy.md)), and `/privacy` and `/terms`
also need D029's legal sign-off. This review replaces neither.

## How it was run

- **Build.** The production build in `.next` (written 2026-10-14 11:27, after `dae33e6`). Every module behind these
  blocks last changed before that. It was served with `next start -p 3700` with the store's keys empty, and stopped
  afterwards. Nothing was rebuilt or installed.
- **Screenshots.** Playwright 1.63.0 Chromium at 1x, in scrolled viewport chunks, never one full-page image.
  - Phones: 360×780 and 390×844, with mobile emulation and touch.
  - Laptop: 1440×900.
  - Each block was captured on the build and on the frozen mockup (`mockup/<slug>.html`, opened from disk).
  - Overflow was spot-checked at 412, 768, 1024 and 1366 px.
- **Measurements.** Taken from the DOM for each block:
  - the visible text;
  - every element's edges against the viewport;
  - the line breaks of every text block (lone last words, words split across lines);
  - tap-target sizes;
  - computed type, colour and spacing, compared with the mockup;
  - icon paths, against the DS SVGs;
  - `data-reveal` and reduced motion;
  - axe on the block alone.
- **Where the files are.** Screenshots and measurements are in
  `/private/tmp/claude-501/-Users-apoorvasahu-Documents-kheelona-com-website/a7840453-29e0-4cce-aaef-7d40bff98747/scratchpad/cmo-8b/`
  (`<block>-<build|mock>-<width>-<nn>.png`, `measure.json`, `structure-axe.json`). The main session asked for them
  there, outside the repo. They are local and uncommitted, like the other raw screenshots
  ([D039](../decisions/D039-repo-and-setup-answers.md)).
- **Withdrawn claims.** Each block's built text and image alts were checked against every claim D058 withdrew:
  - one-tap delete;
  - servers in India;
  - a curated or closed library;
  - an age-graded safety layer;
  - quiet hours and topic controls;
  - the new-word count and the weekly four-skills report;
  - "about a minute of quiet";
  - attacking our own safety layer;
  - "providers keep none of it";
  - "delete all chats".

  All twelve block-and-width captures are clean.

## Block 1 · `/products/kheelu` fold 5, the words column (V27)

| Criterion | Verdict | Evidence |
|---|---|---|
| Words match the copy page and V27 exactly | Pass | Eyebrow "The parent app"; H2 "Every conversation, word for word." with `Hand` on "word for word."; the lead "Each one appears in the parent app a few minutes after it ends. Search them, read a daily summary, or look back over the week or the month."; the note is D058 item 3's sentence verbatim (`offer.ts:16`, through `offerCopy.plus`). The chips are gone. meet-kheelu.md fold 5 Copy block; V27 |
| DS components and tokens, like the neighbours | Pass | `kh-heading` with eyebrow 13/16 Nunito 800, H2 32/38 (phones) and 40/44 (1440) Baloo 2 800, lead 18/28 and 20/30 Nunito 500 in `--text-muted`, note `kh-body-s` 14/20, 16 px above it. All identical to the mockup's values. The 16 px from lead to note is the mockup's own note margin (`meet-kheelu.css:69` → `feature-split.css:30`). On laptops the column bottom-aligns to the phones as in the mockup (`align-self: end`) |
| No overflow, bad wraps, lone words or crowding at 360 | Pass | 360: H2 2 lines, lead 4, note 2. No lone last word, no split word, no overflow. At 1440 the note ends on "parent app.", a two-word last line, which is fine. `kheelu-f5-build-360-00.png`, `-390-00.png`, `-1440-00.png` |
| Tap targets | Pass | The words column has none. The fold's link "See what we keep, and for how long" is 328×60 at 360 and 333×48 from 390, above 44 px. It wraps to two lines at 360, leaving "long" alone, but the mockup does the same and the link sits outside this block |
| One obvious idea on a phone | Pass | "Every conversation, word for word." is the clearest promise the app section has had. The four capabilities follow in one sentence, and the note answers "do I pay for the app?" right beside the screens |
| No claim D058 withdrew | Pass | No four skills, no new-word count, no weekly report, no "part of Kheelona+" |
| Motion | Pass | As in the mockup, the words do not reveal. The phones figure reveals once (0.24 s), and instantly under reduced motion |
| Accessibility | Pass | axe: 0 violations at 390 and 1440 |

Founder questions on this page that this review does not rule on: question 10 (the Kheelona+ sentence twice on the
page) and question 13 (the daily summary and the legal hold).

## Block 2 · `/safety` fold 4, the parent controls and the privacy screen (V28)

| Criterion | Verdict | Evidence |
|---|---|---|
| Words match the copy page and V28 exactly | Pass | Age item: "Enter it when you set Kheelu up, and change it later if you need to. On every conversation, the AI model that answers your child is given that age and child-safety rules." (round 2, m8). Languages is unchanged. "Voice recordings. Turn off Save voice recordings, and only the written record of each conversation is kept." Topics and Quiet hours are gone. The link is "See what the app shows you" → `/products/kheelu#app`. safety.md fold 4; V28 |
| The privacy screen's alt (changed in 8b.1b) | Pass | "A real screen from the Kheelu parent app: the privacy centre. Chats are kept for 36 months, with a button to download your child’s data." This is V28's text exactly. It is true to the screen ("Privacy centre", "Keep chats for 36 months", "Download Aarav's data") and no longer names "Delete all chats". See m3 for one optional addition |
| DS components and tokens, like the neighbours | Pass | DS `kh-trust` panels: 48 px blue icon circle, 20/26 Baloo 2 700 title, 16/24 body in `--text-muted`, 24 px padding, 16 px gap, cream on the band, 32 px under the lead. All identical to the mockup's computed values. The new icon is the DS's own `microphone-slash` (its path matches `design-system/project/assets/Icons/microphone-slash.svg`), in the same 24 px bold weight as its neighbours |
| No overflow, bad wraps, lone words or crowding at 360 | **Fail (minor), m1** | No overflow at any width. The age item, now 7 lines in a 216 px text column, splits **"child- / safety rules."** across its hyphen at 360 and at 1440. At 390 it leaves **"rules."** alone on the last line. `safety-f4-build-360-00.png`, `-390-00.png`, `-1440-00.png` |
| Uses the DS component as the DS defines it, at every width | **Fail (minor), m2** | From 720 px `kh-trust` has two columns. The DS describes TrustList as "a two-by-two grid" (`TrustList/README.md:3`), and the mockup had four items. With three, the bottom-right cell is empty, and the Languages card stretches to the age card's height, so most of it is blank. `safety-f4-build-1440-00.png`, `safety-f4-grid-as-built-768.png` (mockup: `safety-f4-mock-1440-00.png`). Phones are not affected: the list is one column below 720 px |
| Tap targets | Pass | "See what the app shows you" is 298×48. The list has no other targets |
| One obvious idea on a phone | Pass | "The grown-up holds the keys": three controls, each a thing the parent sets. The age item now also says how the age is used. That is longer, but it is one checkable sentence, as the DS asks for TrustList bodies |
| No claim D058 withdrew | Pass | No age-graded layer, no topics, no quiet hours, no "delete all chats" in the alt |
| Motion | Pass | The list and the screen each reveal once (0.24 s), as in the mockup (`data-reveal` on the same two elements), and instantly under reduced motion |
| Accessibility | Pass | axe: 0 violations at 390 and 1440 |

Still visible and waiting on the founder: the screen beside the list still shows a red "Delete all chats" button
(G26). The CMO's view is unchanged: crop it, as m7 of the 8b.1 review said, if it only hides chats on that phone.

## Block 3 · `/privacy` §7, both lists (V32; V11's regions)

| Criterion | Verdict | Evidence |
|---|---|---|
| Words match the copy page and V32 exactly | Pass | The first row is "Google Cloud, Google’s Gemini, Sarvam AI, Twilio, Aiven, Redis, New Relic and Sentry" / "Run Kheelu and the parent app for us, from Kheelu’s replies to storing conversations, your child’s age and your parent-app account" / "India, and some of them outside India". The other eight rows and their regions are V11's (Razorpay India; Supabase Australia; Resend United States; Vercel India (Mumbai) for the store's server code; Google data centres around the world; Meta the United States and other countries; PostHog and Ahrefs United States). The lead and the closing paragraph are unchanged. The phone list and the laptop table carry the same nine rows from one data source (`privacy.ts:385-413`). privacy.md Section 7; V32 |
| DS components and tokens, like the neighbours | Pass | Phones: the mockup's stacked rows (`kh-label` 16/20 800, `kh-body-s` "What:" and "Where:" lines, 12×16 padding, white panel). Laptops: DS `kh-compare` in its scroll region. Every computed value equals the mockup's. The list shows up to 767 px and the table from 768, as in the mockup |
| No overflow, bad wraps, lone words or crowding at 360 | Pass | No overflow at any width. At 360 the eight names make a three-line label, which reads as a list of names, not a crowd. "Where: India, and some of them outside India" fits on one line. At 1440 the narrow "Where" column ends "…outside / India" on a single word. The mockup's table had lone words too ("account", "Analytics"), and the one-row-per-company fix below removes this one. `privacy-s7-build-360-00.png`, `-01.png`, `-390-00.png`, `-1440-00.png`, `-01.png` |
| Tap targets | Pass | None in the lists. The table's scroll region is keyboard-focusable, as in the mockup |
| One obvious idea | Pass | "Who handles your data, and where." See C1 below |
| No claim D058 withdrew | Pass | No "servers in India". The region is D058 item 6's wording |
| Accessibility | Pass | axe: 0 violations at 390 and 1440 |

**C1 (carried, minor; not re-raised).** The lead "Each of these companies does one job for us." sits over a first
row of eight companies doing many jobs. This was m1 of the
[8b.1 review](cmo-review-claims-8b.1-2026-10-14.md). It reads right once each company has its own row (privacy
question 13 (b)), which waits on Aman's regions ([open questions](../open-questions.md) G31 item 3).

## Block 4 · `/terms` `#account` (V33)

| Criterion | Verdict | Evidence |
|---|---|---|
| Words match the copy page and V33 exactly | Pass | Seven paragraphs in round 2's order: who the app is for, plus "You’re responsible for how your child uses Kheelu."; what the app shows (word for word, a few minutes after, daily summary, search, week or month) and the 36 months; "The parent app is free." with the one-time code and its rule; home Wi-Fi with downloaded stories and songs; the misuse rule, including the harm clause; deleting the account in its privacy settings ("That deletes …"); the Privacy link. terms.md Section 10; V33 |
| DS components and tokens, like the neighbours | Pass | The same `kh-title` H2 (24/30 Baloo 2 700) and body paragraphs (16/24 on phones, 18/28 on laptops, 16 px apart) as sections 9, 11 and 12 and as the mockup. "Wi‑Fi" carries a non-breaking hyphen (`terms.ts:312`), which renders correctly in Nunito |
| No overflow, bad wraps, lone words or crowding at 360 | Pass | Every paragraph is 2 to 5 lines, with no lone last word and no split word at 360 or 390. At 1440 the last paragraph ends on "terms.", as in the mockup. `terms-account-build-360-00.png`, `-01.png`, `-390-00.png`, `-1440-00.png` |
| Tap targets | Pass | The inline "Privacy" link (54×22) is a link in running text, which the target-size rule exempts. It is the same as the mockup and the neighbouring sections |
| One obvious idea | Pass | "The parent app": each paragraph is one rule a parent can act on |
| No claim D058 withdrew | Pass | No one-tap delete. "Free" opens the sign-in paragraph, not the feature list (m10 (c)) |
| Accessibility | Pass | axe: 0 violations at 390 and 1440 |

## Issues and fixes

| # | Severity | Block | Issue | Fix | Route |
|---|---|---|---|---|---|
| m1 | Minor | `/safety` fold 4, age item | "child-safety" splits across its hyphen at 360 and 1440 ("…given that age and child- / safety rules."), and "rules." sits alone on the last line at 390 | Two changes, both needed. **(1)** A non-breaking hyphen (U+2011) in "child‑safety" at `src/content/en-IN/pages/safety.ts:135`. This is the build's convention for "Wi‑Fi" (`terms.ts:312`, `privacy.ts`). The same character also goes in the `CLAIM_FIXES.safety` sentences that accept it (`test/e2e/support/deviations.ts:574` and `:631`) and in the story literal (`FeatureSplit.stories.tsx:142`). The wording does not change. **(2)** Add `.ks-sf-controls .kh-trust__body { text-wrap: pretty; }` to `src/components/sections/FeatureSplit/feature-split.css` after line 36. The mockup sets the same kind of wrap rule for a hyphen split (`refund.css:22`, `shipping.css:22`), and so does the build (`store-details.css:74`). **Tried on the build:** with both, the item breaks cleanly at 360, 390, 412 and 1440 ("…given that age and / child‑safety rules."). Neither works alone: the hyphen alone still leaves "rules." at 390, and `pretty` alone splits at the hyphen at 390. As a bonus, the Languages item's lone "home." (in the mockup too) goes as well. `safety-f4-agefix-both-360.png`, `safety-f4-grid-proposed-1440.png` | Builder |
| m2 | Minor | `/safety` fold 4, the list from 720 px | Three items in the DS's two-by-two TrustList grid leave the bottom-right cell empty, and the Languages card stretches to the 7-line age card, so most of it is blank | **(1)** Give the controls list the build's own odd-item class, `ks-trust--span-last` (`trust-section.css:37-43`, catalogued as shared in [components](../engineering/components.md) and already used on this page by fold 3's fifth "never" item). In `FeatureSplit.tsx:190` the safety className becomes `"ks-sf-controls ks-trust--span-last"`. **(2)** Narrow that shared rule to `.ks-trust--span-last .kh-trust__item:last-child:nth-child(odd)`, as the mockup writes it (`shipping.css:20`, `refund.css:20`). Then it stays right if a fourth control arrives. Its two current users have five items, so they do not move. **Tried on the build:** Voice recordings runs full width beneath the two cards at 768 and 1440, matching fold 3 (`safety-f4-grid-proposed-1440.png`; before: `safety-f4-build-1440-00.png`, `safety-f4-grid-as-built-768.png`). **If G28 puts the daily talk-time limit here** (safety.md question 8 (a): only if a parent sets it), it is the natural fourth control and restores the two-by-two grid. The narrowed rule then does nothing | Builder (the content route, if G28 is answered: Copywriter, then the founder) |
| m3 | Minor, optional | `/safety` fold 4, the privacy screen's alt | The alt names "Keep chats" and "Download" but not the "Save voice recordings" switch. That switch is exactly what the new third control is about, and the same screen's alt on the product page names it (`page.ts:230`) | Alt: "A real screen from the Kheelu parent app: the privacy centre. Chats are kept for 36 months, with a switch to save voice recordings and a button to download your child’s data." It is still true to the screen and still leaves "delete all chats" out. Steps: safety.md fold 4 image note and a "Changes after approval" row; then `safety.ts:148` and the alt swap in `CLAIM_FIXES.safety` (`deviations.ts:594`); the main session amends V28 | Copywriter, then Builder |
| d1 | Minor, wiki only | Copy pages | The Copy blocks still give the old screen caption ("Real app screens, October 2026. Names changed; some content added for illustration.") at `meet-kheelu.md:406` and `safety.md:237`. D046 line 20 replaced it with "The Kheelona app is live on Apple’s App Store and the Google Play Store.", which the mockup and the build show. safety.md's round-2 note also cites `safety.ts:126` for the age line, which is now line 135 | Put D046's caption in both Copy blocks and update the line reference. No change to the site | Copywriter |

## Not ruled here (waiting on others)

- **G26:** the "Delete all chats" button visible on the privacy screen (Home, the product page, `/safety`). This is
  the founder's call. The CMO recommends cropping it.
- **G28:** the daily talk-time limit. If a parent sets it, it belongs in `/safety` fold 4 (see m2).
- **G31 item 3:** one `/privacy` §7 row per processor, with its region (C1). This is for Aman.
- **Question 9 on `/safety`:** "Voice recordings" depends on backend PR #39 reaching production (G31 item 5). The
  item is true at launch only if it does.
- **The product page's questions 10 and 13; `/terms`' "songs" check (8b.1 review m9):** for the founder.
- **Lighthouse:** not part of this checkpoint. QA's wave 8 run gave ≥ 92 on every page, and none of these fixes
  touches a script or an image.
