---
title: "CMO built-page review, group A (conversion pages), 2026-10-14"
type: qa
updated: 2026-10-14
sources:
  - raw/brief/kickoff-brief.md (section 4, section 6 CMO Reviewer)
  - brand/positioning.md, brand/messaging.md, brand/voice.md, brand/audience.md
  - site/strategy.md, site/content-boundary.md, product/claims.md, product/facts.md
  - qa/deviations.md (V1-V16)
  - decisions/D046, D049, D050, D051, D053, D054, D055 (and D016-D041 as cited)
  - "site/pages/home.md, meet-kheelu.md, ai-toys-for-kids-in-india.md, safety.md, team.md, contact.md, setup.md, 404.md"
  - "mockup/home.html, meet-kheelu.html, ai-toys-for-kids-in-india.html, safety.html, team.html, contact.html, setup.html, 404.html (frozen, D046)"
  - "Local production build, branch reset/website-v2 at a5124aa (.next BUILD_ID G4RikeesMHpGqaQPS4YHg229e6d3), next start on port 3581, 2026-10-14"
  - "Screenshots and probes: raw/qa/2026-10-14/cmo-built/a/ (local only, never committed, D039)"
---

# CMO built-page review, group A, 2026-10-14

Task 7.1 acceptance: the CMO pass on the built conversion pages, including the reviews that never ran before Gate A
([Gate A progress](../site/gate-a-progress.md): product page, safety and the buyer's guide were "pending"; Home's
v3-v6 changes were not re-reviewed). I judged the pages as SKM would. These verdicts do not replace the founder's,
and only the founder signs off copy ([D015](../decisions/D015-founder-signs-off-copy.md)).

**Pages:** `/`, `/products/kheelu`, `/ai-toys-for-kids-in-india`, `/safety`, `/team`, `/contact`, `/setup`, and the
404 page (`/no-such-page-cmo-check`, which returns 404 with noindex).

**Not re-raised (known and open with the founder):** G16 (the Karnataka seal on `/team`), G17 (refund timing
wording), G18 (one CSP host), the hidden F4 spec rows (V15, V16), the setup light's colour (V8). Lighthouse belongs to
the main session (status: 92-98 on mobile at M1). Parity, axe and the sideways-scroll check are already covered by
the automated suites.

## Verdict

**Not ready for Gate B until two blocking issues are fixed.** Both are small. Everything else that is the
positioning's job passes. Every page leads with the mechanism (Kheelu answers, then asks back, so the child does
the thinking), names ages 3 to 7, and keeps the promise on conversation, never on Kheelu
([D016](../decisions/D016-brain-wording.md)). Safety is told as checkable facts in the founder's order
([D020](../decisions/D020-provider-terms-and-no-sale.md)). The two ad landing pages pass the five-second offer test
inside 360 × 590. The phone pages show exactly one chilli button at every scroll position. Nothing internal leaks
into the copy, metadata or JSON-LD. Motion follows [D049](../decisions/D049-motion-picks.md): the hero, H1, price,
chilli buttons and offer card never move.

| Criterion | `/` | `/products/kheelu` | guide | `/safety` | `/team` | `/contact` | `/setup` | 404 |
|---|---|---|---|---|---|---|---|---|
| 1. Says the positioning, to parents of 3-7 year olds | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 2. No internal leakage (copy, meta, JSON-LD) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 3. One obvious next step per screen | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 4. Five-second offer test on a phone | PASS (M11) | PASS (M11) | n/a | n/a | n/a | n/a | n/a | n/a |
| 5. Visual and interaction vs mockup and DS, phone first | **FAIL B1** (M9) | **FAIL B1** | **FAIL B1** | **FAIL B1** | **FAIL B1** (M10) | PASS | **FAIL B1** | **FAIL B1** |
| 6. Motion (D049; nothing on hero, H1, price, chilli, offer card) | PASS (M2) | PASS (M1) | PASS | PASS | PASS | PASS | PASS | PASS |
| 7. WhatsApp bubble (D050) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 8. Sticky buy bar | PASS | PASS | PASS | PASS | PASS | PASS | n/a (none, by design) | n/a (none) |
| 9. Ad-landing readiness | **FAIL B1** | **FAIL B1** | n/a | n/a | n/a | n/a | n/a | n/a |
| 10. Nothing unfinished, contradictory or untrue | PASS (M5, M7) | **FAIL B2** (M3, M6, M7) | PASS | PASS (M4, M7) | PASS | PASS | PASS | PASS |

Screenshots are in `wiki/raw/qa/2026-10-14/cmo-built/a/` (local only, about 119 MB, never committed, D039). Names
follow `<page>-<width>-<on|reduced>-<NN>.png`, where `on` means motion on and `reduced` means
prefers-reduced-motion. Page keys: home, product, guide, safety, team, contact, setup, 404. Each NN is one scrolled
viewport at 1x, at 360 × 800, 390 × 844, 412 × 915, 1366 × 768 and 1440 × 900, which gives 734 build chunks. The
subfolders hold the rest: `mockup/` (the frozen mockup, reduced motion, 360/390/1440, 231 chunks), `states/`
(360 × 590 first screens, drawer, FAQ, details tabs, films, laptop bubble label), `anchor/` (hash landings, frame by
frame), `flick/` (reveals after a fast scroll) and `taps/` (tap-area overlays).

## Blocking (fix before beta and Gate B)

### B1. Tap areas collide: tapping "7-day returns" or "WhatsApp" can start a phone call (Builder)

**What a parent sees.** These are real touch taps on the first phone screen of both ad landing pages, at 25%, 50%
and 75% across each link's text:

| Page, width | Tapped | Opened |
|---|---|---|
| `/` and `/products/kheelu`, 390 | "7-day returns, no questions asked" (`/refund`) | `/refund`, then **WhatsApp**, then **`tel:` call** |
| `/` and `/products/kheelu`, 360 | "WhatsApp" in the help line | **`tel:` call**, **`tel:` call**, WhatsApp |
| `/`, 360 | "7-day returns, no questions asked" | `/refund`, **WhatsApp**, `/refund` |

A hit-test scan of every link on the eight pages (9 points across each link's text box) found the same overlap here:

- **Hero help lines:** `/` and `/products/kheelu` at 360, 390 and 1440. At 1440, clicking "Deliveries start
  mid-November" hits the call link at 6 of 9 points.
- **Close-section help lines:** guide (360, 390), `/safety` (360), `/team` (360, 9 of 9 points), 404 (360).
- **Home close trust row:** "Delivery included anywhere in India" and "UPI, card or net banking" at 390 and 1440.
- **`/setup` "Stuck?" paragraph:** the email link's area covers the phone number's line at 360 and 390.
- **`/contact`:** clean.

The returns line is the page's main risk reversal ([D021](../decisions/D021-returns-policy.md)), and on phones it
mostly opens a call or a chat instead. The misfires also count as call and WhatsApp clicks in the analytics.

**Evidence:**
- `taps/taps-home-360-tap-areas.png`, `taps/taps-home-390-tap-areas.png`, `taps/taps-product-390-tap-areas.png`:
  the invisible areas drawn in, the help line's in red over the trust row's in blue.
- `state-home-360x590-first.png`, `home-390-on-00.png`: the screens as a parent sees them.
- The frozen mockup gives identical results, so this was copied faithfully from `mockup/mockup.css:29-31`, where
  CMO M3 added the 44 px tap areas.

**Cause.** `.ks-trust a::before` and `.ks-help a::before` each reach 12 px above and below the link
(`inset: calc(var(--space-3) * -1) 0`). But the help line sits about 4 px under the trust row
(`.ks-help { margin: 0 }`), and its two links wrap onto consecutive lines at 360. The later link's area therefore
lies on top of the earlier link's text.

**Files:**
- `src/components/ui/HelpLine/help-line.css:10-12` (margin) and `:23-27` (the `::before`)
- `src/components/ui/TrustLine/trust-line.css:19-23`
- The close blocks that stack them: `src/components/sections/CtaBlock/selling-lines.tsx:43`, `close-section.css`,
  `offer-section.css`
- The `/setup` paragraph: `src/content/en-IN/pages/setup.ts:152`, styled by `help-line.css`

**Fix:**
1. Wherever a help line follows a trust line, separate them by at least two tap extensions:
   `.ks-trust + .ks-help { margin-block-start: var(--space-5) }`, or the same gap in the CtaBlock and close
   layouts. `--space-5` is 24 px in the DS tokens, exactly two 12 px extensions. This also cures the cramped look of
   the help line under the returns line (`home-390-on-16.png`).
2. For links that wrap or sit inline in running text (the help line at 360, the `/setup` paragraph), cut the
   extension to `inset: calc(var(--space-1) * -1) 0`. The 28 px link box already meets axe's target size, and
   WCAG 2.5.8 exempts inline links.
3. Re-run a hit test on all eight pages at 360, 390 and 1440: `elementFromPoint` at 9 points across each link must
   return that link.

The main session adds a deviation row, because the hero chunk moves by a few pixels against the frozen mockup.

### B2. "Seven families, in their own homes." states a count nobody has checked (Copywriter, or founder confirms)

The product page's films heading (`product-390-on-01.png`, `product-1440-on-00.png` at the foot) counts families.
The copy page's source supports **seven films**, not seven families
([meet-kheelu fold 2 sources](../site/pages/meet-kheelu.md)). The films themselves point the other way:

- Arha is in two of them: film 4, "Arha's mother asks the questions", and film 6, "Arha switches to English"
  (`src/content/en-IN/films.ts`).
- The lede says the two parent films are "two of their parents", so those families overlap with the children's.
- Film 2 is a montage of several children.

A family count is the kind of number brief §4.2 forbids inventing.

**Fix (Copywriter, then content):** change the H2 to **"Real families, in their *own homes.*"** (keep the Hand
accent). Edit [meet-kheelu.md](../site/pages/meet-kheelu.md) line 189,
`src/content/en-IN/products/kheelu/page.ts:106` and the story at
`src/components/sections/FilmsStrip/FilmsStrip.stories.tsx:52`. The main session adds a text-parity deviation row.
**Or** the founder confirms that seven distinct families appear across the seven films, and the line stays.

## Minor (fix when convenient; none holds Gate B)

| # | Page | Issue | Evidence | Fix, file and owner |
|---|---|---|---|---|
| M1 | Product (also any hash link) | **Slow, distracting glide on a full-page landing with a hash.** With motion on, `/faq` (the 308 to `/products/kheelu#faq`) and a direct `/products/kheelu#faq` scroll from the top through about 10,600 px in about 1.5 s, passing half-blank reveal blocks on the way. With reduced motion the page jumps at once. The same happens on D053's 308 to `/stories#screen-time`. | `anchor/anchor-faqredirect-on-00…13.png` (y 0 → 124 → 992 → 4,092 → … → 10,640); `anchor/anchor-direct-on-03.png`; `anchor/anchor-*-reduced-*.png` | **Builder:** turn smooth scrolling on only after the first load's hash scroll, so it serves in-page clicks (skip link, "#faq" on the same page). For example, MotionController adds a class after load and `src/motion/motion.css:28-30` keys on `html[data-scroll-behavior="smooth"].<class>`. Keep `data-scroll-behavior` on `<html>` (`src/app/layout.tsx:51`) for Next's route-change reset. Same frame test after. |
| M2 | Home → product | **"See all questions" lands below the questions.** Client navigation to `/products/kheelu#faq` stops 464 px (phone) or 394 px (laptop) past the FAQ's top, so the heading and the first three questions sit above the screen. A direct load lands at the section's top (offset 0). It happens with reduced motion too, so motion is not the cause; the sections have the same heights in both cases. | `anchor/homelink-faq-390-on-settled.png`, `anchor/homelink-faq-1440-on-settled.png` | **Builder:** fix the hash scroll after a `<Link>` to a hash on another route. For example, on mount scroll `location.hash`'s element into view once the page's layout has settled (or rely on `scroll-margin-top` and a single `scrollIntoView`). The link: `src/content/en-IN/pages/home.ts:362` (`faq-more`). |
| M3 | Product | **The 6-month note sits next to the safety promises.** "The parent app is part of Kheelona+, included for 6 months with every Kheelu." stays in the app fold. Home removed this exact line under [D041](../decisions/D041-gate-a-round-1.md) F7 ([home.md](../site/pages/home.md) line 186, a1: "ignore this line of discussion at most places"). Here it sits above "You can read and delete every conversation" and invites "and after six months?", which the page cannot answer. The OfferCard already says "6 months of Kheelona+ included". | `product-390-on-07.png` | **Copywriter, founder OKs at the copy sign-off:** drop the note from [meet-kheelu.md](../site/pages/meet-kheelu.md) line 392 and `src/content/en-IN/products/kheelu/page.ts:178`. Text-parity deviation row. |
| M4 | `/safety` | **The warning is open; the answer is closed.** The open FAQ ends "Common Sense Media advises against AI toys at this age. Its advice in full, and our answer, follow below." The answer below is collapsed, so a parent reads the warning without Kheelona's answer. | `safety-390-on-07.png` | **Builder:** open both items in this fold. Today the fold sets `firstOpen: true` (`src/content/en-IN/pages/safety.ts:172`); FaqSection needs an all-open or per-item `open`. Add a deviation row. **Or Copywriter:** "…and our answer, are in the next question." ([safety.md](../site/pages/safety.md) line 320; `src/content/en-IN/faqs.ts:125`). |
| M5 | Home (and the stories hub) | **Stale summary after D053.** The "Screen time" guide card promises "which rules hold up". That was the 3-6-9-12 rules guide, which [D053](../decisions/D053-remove-the-3-6-9-12-article.md) took off the journal. | `home-390-on-13.png` | **Copywriter:** "How much, what the guidelines say, and what to do when the screen goes off." ([stories.md](../site/pages/stories.md) line 113 → `src/content/en-IN/stories/topics.ts:18`, which feeds Home fold 7b and the hub). The main session decides on a deviation row. |
| M6 | Product | **The sources line reads like research notes.** "…(Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts." Home shows the clean form. | `anchor/homelink-faq-390-on-settled.png` (foot) | **Copywriter:** use Home's form on the product page: "Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts)." ([meet-kheelu.md](../site/pages/meet-kheelu.md) line 624 → `src/content/en-IN/products/kheelu/page.ts:279`). The journal articles carry the same long form; that is group B's call. |
| M7 | Home, product, safety | **No "examples" note on the app screens.** The screens show a named child (Aarav) and chats, and the caption only says the app is live. `/setup`'s caption already says "The child's name and the activity shown are examples." [D046](../decisions/D046-gate-a-approved.md) recorded this risk and invited the CMO to ask. On a page that sells privacy, a parent may read these as a real child's conversations. | `home-390-on-08.png`, `home-390-on-10.png`, `product-390-on-07.png`, `setup-390-on-05.png` | **Copywriter, founder decides** (he wrote the current caption): add "Names and chats shown are examples." to `APP_CAPTION` in `src/content/en-IN/pages/home.ts:40` and `src/content/en-IN/products/kheelu/page.ts:45`, and to the caption at `src/content/en-IN/pages/safety.ts:139`. Copy pages first. |
| M8 | Five pages | **The age-3 advice is worded five ways.** "For 3-year-olds, we advise having a grown-up nearby" (Home FAQ) · "At 3, play with a grown-up nearby" (product) · "At 3, we advise play with…" (guide) · "If your child is 3, we advise play with…" (safety) · "If your child is 3, keep a grown-up nearby while they talk" (setup). "We advise play" is awkward. | page text, `pages` sweep | **Copywriter:** one sentence everywhere, for example "If your child is 3, keep a grown-up nearby while they play." (`src/content/en-IN/faqs.ts:41, 86, 125, 151, 174`; `src/content/en-IN/pages/setup.ts:101`). |
| M9 | Home, laptop | **Narrow safety cards.** The four cards sit in a 2 × 2 grid beside the phone, giving about 22-25 characters a line ("How it understands and answers." runs 13 lines). The DS writing guide asks for about 60 (`01-writing.md` L22). This came from the mockup. | `home-1440-on-06.png` vs `mockup/home-1440-reduced-06.png` | **Builder, after Gate B is fine:** one column of cards beside the phone, or the cards full width above it, at 900 px and up (TrustSection; `src/content/en-IN/pages/home.ts:238-275`). Needs a deviation row. |
| M10 | `/team` | **The quote uses initials.** It shows the "AS" badge just below the founders' photo cards (V7). | `team-1440-on-02.png`, `team-390-on-04.png` (top) | **Builder:** give the quote's avatar the live photo `apoorva.jpg` (alt empty, name printed beside it) at `src/content/en-IN/pages/team.ts:143`. The main session extends V7. |
| M11 | `/`, product | **No picture of Kheelu on the first phone screen.** At 360 × 590 the screen is all text; at 390 × 844 only the art's top edge shows. This is the approved layout, so not a defect. | `states/state-home-360x590-first.png`, `states/state-product-360x590-first.png` | **Test idea for the founder** (Meta landings show the rabbit in the ad, so visual message match matters): on phones, a compact Kheelu cut-out beside the eyebrow, or the hero art above the trust line. Measure `cta=hero` and `cta=product-top` taps. |

Optional, for the founder only: in the product hero and the Home close, Myra's expression reads unsure at the
moment of price. Myra is the founder's own pick (D046). A smiling DS cast cut-out would sit better beside the
OfferCard. No action unless the founder wants it.

## Page by page

### `/` (Home)

- **Message: PASS.** The hero holds the [D045](../decisions/D045-hero-headline.md) H1, the age chip, the mechanism
  lead and the "It asks. They think." sticker (`home-390-on-00.png`, `home-1440-on-00.png`). The promise credits
  conversation, cites Harvard and keeps "a caring adult" (`home-390-on-03.png`, `-04`). Safety follows the D020
  order: button and light, providers, read and delete, no sale (`home-390-on-09.png`, `-10`). The comparison names
  categories, not brands (`home-390-on-11.png`, `-12`). The guides fold (D046) claims no outcome
  (`home-390-on-13.png`).
- **Leakage: PASS.** Text, title, description, OG, FAQPage and Organization JSON-LD were swept for competitor names,
  survey figures, unit counts beyond "first 500", analytics and banned wording. Only allowed forms matched
  (for example "Conversation helps a young brain grow", "no wake word").
- **Next step: PASS.** I measured every 211 px at 390. Exactly one chilli button shows at each position: the bar
  steps aside for `hero`, `see-it-ask`, `safety` and `finale` and returns between them (`home-390-on-01.png`,
  `-02`, `-15`). The laptop's nav plus hero pair is the accepted G2 exception.
- **Five seconds: PASS.** Inside 360 × 590: age, what it is, the mechanism, the CTA, the D028 price sentence,
  delivery and returns (`states/state-home-360x590-first.png`). See M11.
- **Visual: FAIL (B1).** The page matches `mockup/home-390-reduced-00/16.png` and `mockup/home-1440-*`; V2 (the
  films with motion on) shows as approved. B1 in the hero and close; M9 on laptops.
- **Motion: PASS.** Nothing animates on the first screen (no animations in the first 600 ms above the fold). Reveals
  reach full view within about 150 ms of a fast scroll (`flick/flick-home-390-*.png`). Doodles draw, the FAQ opens
  smoothly and the films grow in focus (`states/state-home-390-films-2.png`). With reduced motion, the only change
  is the bar's 200 ms opacity fade, with no movement. M2 is the Home → FAQ link.
- **Bubble: PASS.** It lifts 16 px above the bar and drops back with it, is hidden while the drawer is open, and
  the footer clears it (`home-390-on-01.png`, `home-390-on-18.png`, `states/state-product-390-drawer-open.png`).
  It overlaps body text and FAQ toggles mid-scroll, which comes with a floating button; it never covers the bar,
  the price or a CTA.
- **Bar: PASS.** "₹499 today / refundable · ₹4,999 total (incl. GST)" beside "Pre-order Kheelu", as in the mockup.
  It appears once the hero CTA leaves the screen.
- **Ad landing: FAIL (B1).** Otherwise ready: the message matches the mechanism line, the help line sits in the
  hero, returns and delivery are linked to `/refund` and `/shipping`, the footer lists every policy, and a UTM- and
  fbclid-tagged landing returns 200.
- **Claims: PASS.** See M5 and M7.

### `/products/kheelu` (first CMO pass; it was pending at Gate A)

- **Message: PASS.**
  - H1 "Kheelu talks back. The good kind.", with the mechanism lead (`product-390-on-00.png`).
  - "A toy that talks back, not a toy that repeats" passes the fairness check: it names a category, not a brand.
  - The four skills appear as what the weekly report shows ([D036](../decisions/D036-launch-feature-claims.md)).
  - The [D025](../decisions/D025-speech-and-language.md) disclaimer sits under the FAQ.
  - The speech answer keeps "a caring adult" and adds "Kheelu doesn't replace that time with you".
  - The Safety tab says "applied for, not yet granted" (`states/state-product-390-details-tab2.png`).
- **Leakage: PASS.** The Product JSON-LD keeps the `…/products/lumi#product` id by design (ADR-012) and leads with
  ₹4,999 and 2026-11-15 ([D037](../decisions/D037-delivery-date-in-schema.md)).
- **Next step: PASS.** I measured it the same way as Home. The bar steps aside for `product-top`, `product-offer`,
  `product-safety` and `product-foot`.
- **Five seconds: PASS.** `states/state-product-360x590-first.png`. See M11.
- **Visual: FAIL (B1).** The page matches `mockup/product-390-reduced-07.png`. V3, V6 and V16 show as approved
  (`product-1440-on-02.png`, `states/state-product-390-details*.png`).
- **Motion: PASS.** No hero, price, chilli button or offer card sits inside a reveal block (checked on all eight
  pages). M1 is the hash glide.
- **Bubble and bar: PASS.**
- **Ad landing: FAIL (B1).** Otherwise ready.
- **Claims: FAIL (B2).** See also M3, M6 and M7.

### `/ai-toys-for-kids-in-india`

- **Message: PASS.** It answers first with five checks in category terms and no brands. "How Kheelu meets each"
  uses confirmed facts only. The plush-or-robot section is fair (`guide-390-on-00.png`, `-01`, `-03`, `-04`).
- **Leakage and next step: PASS.** The bar shows from first paint (there is no hero CTA), and the finale closes the
  page.
- **Visual: FAIL (B1).** In the close help line at 360 and 390, tapping "WhatsApp" opens the call link at 7 of 9
  points.
- **Motion: PASS.**
- One small judgement, no action needed: Kheelu's answer to check 5 says "Eight today … up to 10 at launch", right
  after the advice "Ask which languages it speaks today, not which ones are coming." It is honest. Dropping "with up
  to 10 at launch" here would read stronger (Copywriter's option).

### `/safety`

- **Message: PASS.** It answers first. The four facts appear in the D020 order, with the
  [D018](../decisions/D018-wake-up-button.md) lines verbatim. The "never" list, parent controls (topics and quiet
  hours are live claims, [claims](../product/claims.md) line 120), retention (36 months) and the honest
  certification status all follow (`safety-390-on-00.png`, `-04`, `-07`).
- **Leakage: PASS.** The Common Sense Media 27% is the verified C16 line, with sources shown.
- **Next step, motion, bubble, bar: PASS.**
- **Visual: FAIL (B1, at 360).**
- **Claims: PASS.** See M4 and M7.

### `/team`

- **Message: PASS.** The first screen says what Kheelu is, for ages 3 to 7 (the Gate A fix, V7)
  (`team-390-on-00.png`). Recognition and bios follow D054 item 20.
- **Leakage, next step, motion (no reveals on this page), bar: PASS.**
- **Visual: FAIL (B1, at 360).** See also M10. On the close at 390, the bubble sits over the end of the help line
  (`team-390-on-04.png`); fixing B1's spacing will move it.

### `/contact`

- **PASS on every criterion.** Three equal contact routes, the D032 grievance block verbatim, the seller block and a
  finale CTA (`contact-390-on-00.png`, `-01`). The tap scan found no collisions. Two WhatsApp affordances (the
  button and the bubble) show at once, as D050 keeps.

### `/setup`

- **Message: PASS.** The page is post-purchase. It uses the wake-up button wording, the app links (D055), the
  2.4 GHz tip (from the app demo) and the example-data caption (`setup-390-on-00.png`, `-02`, `-05`). V8 and V15
  show as approved.
- **Next step: PASS.** Contact, then "Don't have Kheelu yet? Meet Kheelu" (`setup-390-on-06.png`). There is no bar,
  by design.
- **Visual: FAIL (B1).** The "Stuck?" paragraph's email area covers the phone number's line at 360 and 390 (scan).
  Real taps on the link's first line worked.

### 404

- **PASS on message, next step and motion.** It returns status 404 with noindex, offers four routes and a finale
  (`404-390-on-00.png`, `-01`).
- **Visual: FAIL (B1, at 360).**

## Method

- **Server.** I ran the local production build (not rebuilt) with
  `SUPABASE_URL= SUPABASE_SERVICE_ROLE_KEY= npx next start` on **port 3581**. Port 3571 was already held by another
  `next start` from this checkout (PID 74151, started 19:11); I left it alone. I stopped only my own server.
- **Screenshots.** Playwright 1.63.0, deviceScaleFactor 1. Each chunk was taken after a 1.4 s settle with motion
  on, or 0.3 s with reduced motion.
- **Text and metadata.** I extracted each page's visible text, metadata, JSON-LD and CTAs at 390 and checked them
  against the copy pages, [claims](../product/claims.md), [messaging](../brand/messaging.md) and
  [content boundary](../site/content-boundary.md).
- **Motion probes:**
  - `document.getAnimations()` during the first 600 ms;
  - the hero, H1, price, chilli buttons and offer card tested for containment in `[data-reveal]` or `[data-draw]`;
  - the faded area right after fast scrolls;
  - every animation recorded with reduced motion on;
  - hash landings captured frame by frame (direct, through the `/faq` redirect, and through Home's link).
- **Sticky bar and bubble.** Their positions and the in-view chilli CTAs, every 211 px down `/`, the product page
  and the guide.
- **Taps.** A hit-test scan (`elementFromPoint`, 9 points per link box) on the build and on the mockup at 360, 390
  and 1440; real `touchscreen.tap` checks; and a CSS overlay that draws the `::before` tap areas.

## For the founder

1. **B2:** confirm that seven distinct families appear in the seven films, or accept "Real families, in their own
   homes."
2. **M3:** drop the "parent app … 6 months" note on the product page, as Home did under D041.
3. **M7:** add a short "examples" note to the app-screen captions on Home, the product page and `/safety`.
4. Copy changes M4 (wording option), M5, M6 and M8 need your sign-off
   ([D015](../decisions/D015-founder-signs-off-copy.md)).
5. **M11** is a test idea: a Kheelu picture on the first phone screen.
