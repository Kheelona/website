---
title: "D2C conversion plan v2: the selling copy, page by page (2026-10-15)"
type: page-copy
updated: 2026-10-15
sources:
  - "decisions/D064-quick-batch-2-landing-page-and-motion-2026-10-15.md (the Kabir hero, the films order, safety on /safety, the expert clip on Home, the languages section, the sticky scroll)"
  - "decisions/D065-selling-site-founder-answers-2026-10-15.md (the promise and the eyebrow, the short price line, first 500 on the cards only, G26, G28, G29, G30)"
  - "The main session's nine rulings of 2026-10-15 on v1's questions (the CMO's and a growth marketer's challenges), relayed in the build session's task text"
  - "engineering/tasks.md, quick batch 2: Q2.1, Q2.2, Q2.3, Q2.5, Q2.6, Q2.7, Q2.8"
  - "raw/brief/kickoff-brief.md §4, §6 (Copywriter), §9.1, §9.3, §9.8"
  - research/d2c-benchmarks.md §7 (beta 398c5ee measured at 390 × 844 and 1440 × 900; patterns C1-C15)
  - research/keyword-map.md §4.1, §5.1, §5.2
  - brand/positioning.md, brand/messaging.md, brand/voice.md, brand/audience.md
  - product/claims.md, product/facts.md, product/pricing.md, product/policies.md, product/age-band-review.md
  - site/strategy.md, site/content-boundary.md, site/tracking-inventory.md
  - "design-system/project/03-cast.md (the photo library and the cast rules), 07-selling.md, 10-pages.md (read-only)"
  - "decisions D009, D015, D016, D017, D018, D020, D021, D022, D023, D024, D025, D026, D027, D028, D033, D034, D036, D038, D040, D041, D044, D045, D049, D050, D054, D057, D058, D061, D063, D064, D065"
  - "open-questions.md F4, F7, G26-G30"
  - "src/content/en-IN at HEAD (pages/home.ts, products/kheelu/page.ts, products/kheelu/product.ts, pages/safety.ts, pages/setup.ts, pages/ai-toys-for-kids-in-india.ts, pages/team.ts, pages/contact.ts, stories/hub.ts, stories/articles/index.ts, store/store-page.ts, offer.ts, cta.ts, trust.ts, faqs.ts, films.ts, expert-video.ts, policies.ts, legal/refund.ts, seller.ts, share.ts, delivery.ts); src/lib/tracking/cta.ts"
  - test/guards/banned-phrases.data.ts (every line below checked against its patterns by hand; §12)
  - "The claims guard's findBanned run on v2 (376 lines, 3 failures), relayed in the check's task text"
  - "qa/cmo-review-d2c-plan-v2-2026-10-15.md (M1-M5, C1, m1-m14; the measured first screens and the screenshots in raw/qa/2026-10-15/cmo/plan-v2/)"
---

# D2C conversion plan v2 (2026-10-15)

**v2 checked: guard and CMO, 2026-10-15.** The claims guard's three failures and every CMO fix
([review](../qa/cmo-review-d2c-plan-v2-2026-10-15.md): M1-M5, C1, m1-m14) are applied below. C1, m10 and m14 are build
work (the Builder's and the Architect's), so the plan records them as conditions. Decisions they need are in §13
items 6-9.

**What changed in v2.** v1 was a plan with nine founder questions. The founder answered them in
[D064](../decisions/D064-quick-batch-2-landing-page-and-motion-2026-10-15.md) and
[D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md), and the main session ruled on the rest. This
version is the final copy, page by page and ready to build. Every v1 question is gone, and §13 lists only what is
still open. The main changes:
- **Home's hero** uses the founder's eyebrow and H1, a two-line lead that names Kheelu, and the Kabir photo.
- **The price line is shorter.** Every button carries "{price:token} today, refundable. {price:headline} in total."
  There is no "incl. GST" and no balance on a selling page, except the offer cards' two rows. "First 500" appears on
  the offer cards only.
- **One risk-reversal line** goes under every button: "Full refund until dispatch · {returnDays}-day returns".
  `{delivery}` stays beside it (brief §9.1).
- **Home has a new order.** The offer card moves up to fold 7, Home has 11 folds and three links away, and the
  compare table moves to the product page.
- **G26, G28, G29 and G30 are now in the copy**, in the founder's words.
- **The phone number** appears only on `/contact` and the legal pages.
- **Pictures:** no AI cast child sits beside anything real, and each cast child appears once per page.

Only the founder signs copy ([D015](../decisions/D015-founder-signs-off-copy.md)). The CMO reviews Home's folds 3-6
before Q2.7 is built, and every change to an approved page needs its deviation row ([deviations](../qa/deviations.md)).

**How to read the copy lines.**
- **Amounts are tokens, never typed:** `{price:token}`, `{price:headline}`, `{price:full}`, `{price:balance}`
  (offer cards only) and `{price:mrp}` ([pricing](../product/pricing.md)).
- **Other values:**
  - `{delivery}` is "Deliveries start mid-November" (`delivery.ts`, [D023](../decisions/D023-new-order-delivery.md)).
  - `{returnDays}`, `{warrantyMonths}` and `{retentionMonths}` come from `policies.ts`.
  - `{languageCeiling}` comes from `product.ts`.
  - `{film:learning-by-asking.seconds}` is film 1's length in seconds, from its duration in `films.ts` (0:30 → 30).
- **Accents:** `{hand:…}` and `{mark:…}` are the DS heading accents, at most one per heading (DS 10-pages.md:39).
- **New tracking values** are marked **NEW**. Every other `cta` value already exists in `src/lib/tracking/cta.ts`.
- **Sources:** every claim has a "Sources" line. "Built" means the words are on the page at HEAD and stay as they are.

---

## 1. Site-wide: the same on every selling page

### 1.1 The button and what sits beside it

| Element | Words | Source |
|---|---|---|
| Button | "Pre-order Kheelu" (everywhere: heroes, CTA blocks, offer cards, closes, the bar, the nav, the drawer) | [D041](../decisions/D041-gate-a-round-1.md) G1; [D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md) item 3; `PREORDER_LABEL` |
| Price line, token mode | "{price:token} today, refundable. {price:headline} in total." | D065 item 3; Q2.8 |
| Price line, full mode | "{price:full} in total, paid in full when you order." | D065 item 3; Q2.8 |
| Trust line, item 1: the one risk-reversal line, in the same words everywhere | "Full refund until dispatch · {returnDays}-day returns". "Full refund until dispatch" links to `/refund#before-dispatch` and "{returnDays}-day returns" to `/refund#returns` | Main-session ruling 3; [D021](../decisions/D021-returns-policy.md); `refund.ts` parts 1-2; [policies](../product/policies.md) |
| Trust line, item 2 | "{delivery}", linked to `/shipping#when` | Brief §9.1 (delivery beside the CTA); [D023](../decisions/D023-new-order-delivery.md); `trust.ts` |
| Offer cards only, a third row | "{warrantyMonths}-month warranty · UPI, card or net banking", each linked as `trust.ts` links it | Brief §9.1 (warranty and payment options at the decision point); [D022](../decisions/D022-warranty-replacement-refund.md); [D024](../decisions/D024-payment-methods-gst.md) |
| Help line (closes and the store only: not Home, heroes or the offer cards) | "Questions? Message us on WhatsApp." in these words everywhere, the store included (a WhatsApp link only; no number, no `tel:`) | [D063](../decisions/D063-quick-batch-1-choices-2026-10-15.md) item 2; D064 item 11; Q2.3; CMO m9 |

**Build condition C1 (Builder; QA test).** After every button, the nav drawer's included, the price line renders as
its own block element (a `<p>`). It is never a span inside the button or right after its label. Joined with a space,
"Pre-order Kheelu" and "{price:token} today, refundable." read as one string and fire `part-price-button`. Joined with
a line break, they pass (the guard and the CMO reproduced both; the rendered check reads `innerText`). A unit test
on `CtaBlock` and the drawer pins it. The copy does not change.

**Never beside a button on a selling page:** "incl. GST", the balance, the payment breakdown and "first 500". GST,
the balance and the breakdown stay at the store and `/thanks`, where the checkout's full sentence is untouched
([D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md) items 3-4). The offer cards' two split rows are
the one exception (ruling 5).

### 1.2 The phone buy bar (words only; behaviour as built, [strategy §3.4](strategy.md#34-phone-sticky-bar-benchmarks-a1-d1))

| Mode | Large | Small | Button (`sticky-bar`) |
|---|---|---|---|
| Token | "{price:token} today" | "refundable · {price:headline} in total" | "Pre-order Kheelu" |
| Full | "{price:full} in total" | "Paid in full · {delivery}" | "Pre-order Kheelu" |

Sources: D065 item 3; Q2.8; `offer.ts` `sticky`.

### 1.3 Navigation

- **Laptops:** the NavBar sticks to the top from 900 px, with its "Pre-order Kheelu" button. The `navbar` value is
  unchanged, and the 900-1023 px gap closes (ruling 2; Q2.5).
- **Phones:** the drawer's button (`navbar-mobile`) carries the price line from 1.1, as its own block under the
  button (C1).

### 1.4 Words that hold on every page

- **Ages:** "Ages 3 to 7". Wherever age is discussed: "It is not a toy for children under 3." and "If your child is 3,
  keep a grown-up nearby." ([D009](../decisions/D009-brief-readings.md); D041; `faqs.ts` `what-ages`).
- **First 500:** "{price:headline} for the first 500 units. {price:full} once they are gone." This line goes on the
  Home and product-page offer cards only, in token mode only (D065 item 4;
  [D061](../decisions/D061-advisor-proposal-what-we-take-2026-10-15.md) item 3).
- **Brain:** only in [D016](../decisions/D016-brain-wording.md)'s form, "Conversation helps a young brain grow.", with
  its Harvard source marker ([D026](../decisions/D026-public-statistics.md)). Brain development is otherwise a journal
  topic only.
- **The daily limit:** "Each Kheelu has a daily limit on how long it talks." Never say that a parent sets it (D065
  item 5, G28).
- **Not knowing:** "When it doesn’t know something, it says so instead of guessing." (D065 item 8, G29's second half).
- **Deleting chats:** "“Delete all chats” in the parent app deletes them from our servers." Never use "one tap" (D065
  item 7, G26; the guard's `one-tap-delete`).
- **Renewal:** "Nothing renews without you." This sits beside the price on the offer cards and in the product page's
  FAQ (D065 item 6, G30).
- **Not said anywhere**, because they are not confirmed (§13):
  - "Wi‑Fi off at rest"
  - "a single conversation cannot run on without end"
  - the pre-launch test, in any new line

### 1.5 Pictures (ruling 7; DS 03-cast)

- The photo library's children are AI-made characters. They never sit beside a real caption, quote, testimonial or
  "real children" film. Proof uses the seven films' posters and the parent app's real screens.
- Each cast child appears at most once per page, counting stickers on art boards.
  - Home: Kabir (hero), Ira (fold 5), Advik (fold 5), Tara (fold 5), Myra (the offer board).
  - Product page: Myra (hero board), Advik (fold 7), Ira (close board).
  - `/safety`: Tara (hero), Advik (FAQ), Ira (close board).

### 1.6 Motion and weight (ruling 9; [D049](../decisions/D049-motion-picks.md); D064 item 10)

- Nothing animates in the first screen. Below it, each heading's one accent draws itself once.
- Ruling 9 names the hero picture as Home's LCP. That holds on laptops. On phones it may not: at 360 × 590 the photo
  starts below the first screen, and at 390 the 5-line H1 is probably the largest element. The Architect and Builder
  measure the LCP element at 360, 390, 412, 1366 and 1440 px. The photo gets high priority only at sizes where it is
  in the first screen (CMO m14).
- Every picture below the first screen loads lazily, film posters included.
- The sticky-scroll section is laptop-only and pinned for at most about 2 viewports. On phones its points are stacked.
- Home's HTML stays at 60 KB or less.

### 1.7 The WhatsApp share text (proposed; the founder signs, because it changes D061 item 7's approved words)

- **Token:** "Kheelu is a screen-free talking toy for children aged 3 to 7. It answers every why, then asks one back.
  {price:headline} in total; {price:token} today reserves yours, refundable."
- **Full:** "Kheelu is a screen-free talking toy for children aged 3 to 7. It answers every why, then asks one back.
  {price:full} in total, paid in full when you order."

This is the approved text with a new price clause. The message is read cold, away from the page, so the token clause
leads with the total, as the metas do ([D028](../decisions/D028-price-wording.md); CMO m11). The full clause is the
site's short price line (D065 item 3). The link label "Share Kheelu on WhatsApp" and `share-whatsapp` are unchanged
(`share.ts`).

---

## 2. Home, `/` (the Meta ad landing page)

**Its job:** say what it is, prove it with real children, price it and close it. The target is about 13-14 phone
screens, with the offer card's heading by about screen 8. These are estimates, and the builder measures them.
Home links away three times (ruling 1):
1. "See how it works" (fold 5)
2. "See how we built safety in" (fold 8; built, CMO M3)
3. "Share Kheelu on WhatsApp" (fold 7)

The WhatsApp bubble ([D050](../decisions/D050-whatsapp-chat-button.md)) replaces Home's inline help lines. On Home's
phone first screen it waits for the buy bar (§2.0; the founder decides, §13 item 7). The Harvard source link is a
citation, not an exit, and the laptop hero's film link plays in the page.

| # | Fold | Job (one line) | Button (`cta`) |
|---|---|---|---|
| 1 | Hero | What it is, who it is for, the one action | `hero`; link `hero-film` **NEW** (laptops only) |
| 2 | Films, parents' words, recognised by | Proof with real children; quiet authority | none (fold 3's button is one screen below) |
| 3 | Why it matters | Why conversation matters, credited to conversation | `home-why` **NEW** |
| 4 | Languages | "Does it speak ours?" | none |
| 5 | Kheelu asks. Your child thinks. (sticky scroll) | What it is and what my child gets, in six points | `home-asks` **NEW**; link `home-asks-learn` **NEW** |
| 6 | The expert clip | An outside voice on screens and talk | none |
| 7 | The offer card | What I get, what I pay, no risk | `home-offer` **NEW**; `share-whatsapp` |
| 8 | Safety you can check (compact) | "Is it safe?" in five lines | `safety`; link `safety-learn` |
| 9 | A day with Kheelu | "When would we use it?" and "not all day" | none |
| 10 | Questions parents ask | The last doubts, decision questions first | none |
| 11 | Close | The last button, with the risk reversal | `finale` |

### 2.0 The first phone screen

The y values are in px from the top of the page. The CMO measured the plan's exact words in today's built hero
(Playwright, DS type 40/44 px), with the phone fix below applied
([review M1](../qa/cmo-review-d2c-plan-v2-2026-10-15.md); screenshots in `raw/qa/2026-10-15/cmo/plan-v2/`, the
`home-hero-fix-no-link-bubble-later-*` set). The button, price line, trust rows and photo are the CMO's measured
values. The nav, eyebrow, H1 and lead are read from the same screenshots (±8 px).

| Element | Words | y at 360 × 590 | y at 390 × 844 | y at 412 × 915 |
|---|---|---|---|---|
| Nav | Logo, menu (no button on phones) | 0-72 | 0-72 | 0-72 |
| Eyebrow | "Screen-free AI toy · Ages 3 to 7" | 96-112 | 96-112 | 96-112 |
| H1 | "The AI toy that answers every why, then asks your child {hand:one back.}" | 5 lines, 124-344 | 5 lines, 124-344 | 4 lines, 124-300 |
| Lead (2 lines) | "Kheelu by Kheelona is a soft plush rabbit. You can read every chat." | 356-412 | 356-412 | 312-368 |
| Button | "Pre-order Kheelu" (`hero`, `id="hero-cta"`, arrow) | 436-492 | 436-492 | 392-448 |
| Price line | "{price:token} today, refundable. {price:headline} in total." | 508-528 | 508-528 | 464-484 |
| Trust line (2 rows) | "Full refund until dispatch · {returnDays}-day returns" / "{delivery}" | 540-604: the risk-reversal row is inside, the delivery row ends below 590 | 540-604 | 496-560 |
| Secondary link | None on phones (CMO M1). Laptops only: see below | none | none | none |
| Hero photo (16:9, full width) | `kabir-02-block-rocket` | from 628: below the screen, as [D061](../decisions/D061-advisor-proposal-what-we-take-2026-10-15.md) item 14 allows | 628-847: Kheelu in view (3 px of its feet aside) | 584-816: wholly in view, Kheelu included |
| Phone buy bar | Hidden until the hero button leaves | hidden | hidden | hidden |
| WhatsApp bubble | Enters with the buy bar on Home's phone first screen (§13 item 7) | hidden | hidden | hidden |

- **The H1 wraps to 5 lines at 360 and 390, and 4 at 412** (measured). The founder's H1 cannot shrink (D065 item 1).
  So on phones under 900 px the hero has no secondary link, and the photo follows the trust line directly (CMO M1).
  Fold 2's films start right under the photo, so the proof is one thumb-scroll away. With the link, Kheelu drops out
  of the first screen at 390 × 844.
- **The WhatsApp bubble** stays hidden on Home's phone first screen and enters with the buy bar once the hero button
  leaves. Otherwise its 72 × 72 px corner covers Kheelu at every phone size. This changes D050's "persistent", so the
  founder decides (§13 item 7). If the founder says no, the Builder crops the photo so the bubble clears Kheelu at 390
  and 412.
- **`first-screen.spec` pins three sizes:**
  - At 360 × 590: the button, the price line and the risk-reversal row are inside.
  - At 390 × 844 and 412 × 915: Kheelu is wholly in view and clear of every floating element.
- **Laptop:** the text sits left and the photo right, and nothing animates. The secondary link stays: at 1366 × 768
  everything fits, with the link at 676-724. The photo is the LCP here (§1.6).

### Fold 1 · Hero

- **Place:** the first screen. **Job:** say what Kheelu is and who it is for, and offer the one action.
- **Eyebrow:** "Screen-free AI toy · Ages 3 to 7"
- **H1:** "The AI toy that answers every why, then asks your child {hand:one back.}"
- **Lead:** "Kheelu by Kheelona is a soft plush rabbit. You can read every chat." (67 characters: 2 lines at 360, 390 and 412, measured by the CMO).
  It names Kheelu and the brand, makes the toy tangible, and answers the first AI fear without repeating the H1.
  - Shorter fallback if the builder measures 3 lines: "Kheelu by Kheelona: a soft plush rabbit. You read every
    chat." (61)
- **Button:** "Pre-order Kheelu" (`hero`), then the price line and the trust line (1.1). No help line.
- **Secondary (laptops only, from 900 px):** "Watch Kheelu ask, in a {film:learning-by-asking.seconds}-second film"
  (`hero-film` **NEW**, a ghost link with a play icon), rendered "Watch Kheelu ask, in a 30-second film". The length
  comes from film 1's duration in `films.ts` ("0:30") and is never typed. It plays film 1, "Learning by asking", in
  fold 2's strip. On phones there is no secondary link (§2.0; CMO M1).
  - The label no longer says "real children". The only child beside it is Kabir, who is AI-made, so "real" would read
    as a label on him (ruling 7; DS 03-cast; CMO M2). "Real" stays in fold 2's H2, directly over the real posters.
  - Fallback: "Watch the seven films" (also clean).
- **Picture:** photo library `kabir-02-block-rocket`, cropped (D064 item 4; Q2.1), eager. It gets high priority only
  where it is in the first screen (§1.6; CMO m14).
  - **Alt:** "A boy in glasses and an olive T-shirt stacking wooden blocks into a tall tower on a patterned rug, with
    Kheelu, the cream plush rabbit from Kheelona, beside him." (CMO m4, from the DS photo.) The builder checks it
    against the crop.
- **Sources:**
  - The eyebrow and H1: D065 item 1 (the founder chose the H1 over voice rule 1; D016 unchanged); "Ages 3 to 7":
    [D009](../decisions/D009-brief-readings.md); answers, then asks back: [D017](../decisions/D017-live-behaviour-claims-confirmed.md).
  - "Soft plush rabbit": `product.ts` spec "What it is"; the guide's built "a soft plush rabbit, not a robot".
  - "Read every chat": [claims §1](../product/claims.md#1-confirmed-by-the-founder) (D017);
    [D058](../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 8.
  - The film link: film 1, "Learning by asking" ([D040](../decisions/D040-films-move-to-new-site.md); `films.ts`, whose
    caption shows Kheelu asking: "Kheelu asks her to explain carrom…").

### Fold 2 · Films, parents' words, recognised by

- **Place:** right under the hero. **Job:** prove it with real children, then show quiet authority.
- **Eyebrow:** "Seven films"
- **H2:** "Real children, {hand:real families.}"
- **Lead:** "Watch the children do the thinking. Then hear from two of their parents." (the product page's built lead)
  - Today's Home H2 "Kheelu asks. Watch them think." would make three "asks / think" headings on one page next to
    folds 5 and 11. The product page's built words take its place.
- **Strip:** the seven films in D064's order. The posters load lazily (ruling 9). The order:
  1. "Learning by asking"
  2. "A mother joins in"
  3. "A father’s view"
  4. "Real families"
  5. "Counting out loud"
  6. "Two languages"
  7. "In a parent’s words"
- **Proof line:** "Kids doing the talking. Parents, in their own words." (built)
- **Quotes** (built, word for word, each with "Watch the film"):
  - "They first thought it’s just another soft toy, but when it started speaking, they were very much surprised."
    (Nikita, Parent)
  - "I would recommend everyone to have one — so that there is play away from the screen." (Siddhant’s father, Parent)
- **Recognised by:** directly under the quotes, as a small label "Recognised by" rather than a heading (ruling 1).
  The four names come from `recognition.ts`, as `/team` shows them: names only, with no relationship.
- **Button:** none. Fold 3's button follows within about one phone screen, and the DS allows one chilli button per
  view (07-selling). `see-it-ask` stops firing (§11).
- **Pictures:** the films' real posters only, with their built alts (`films.ts`), and no cast photo (ruling 7).
- **Sources:** D040 (the films, consent); D064 item 1 (the order); D061 item 4 (the quotes; no disclosure line, item
  15); [D054](../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20 and D061 (the strip, names only).

### Fold 3 · Why it matters

- **Place:** after the films. **Job:** say why conversation matters, credit it to conversation, then offer the button.
- **Eyebrow:** "Why it matters"
- **H2:** "{mark:Conversation} helps a young brain grow."
- **Text:** "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young
  child and a caring adult help build and strengthen neural connections in the child’s brain.[^1]"
- **Card** (icon `chat-circle-dots`):
  - **Title:** "Where Kheelu comes in"
  - **Body:** "Kheelu is built around the same idea: it answers your child, then asks a question back. It doesn’t replace
    that time with you."
- **Source note:** "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts)." (built,
  linked)
- **Button:** "Pre-order Kheelu" (`home-why` **NEW**), the price line and the trust line.
- **Picture:** none. The Kabir chalk frame and its "Read more" link go, because Kabir is now the hero (one appearance
  per page).
- **Sources:**
  - The H2: D016 and [claims §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors), the Harvard
    row, keeping "a caring adult".
  - The text: the source-verification C07 first sentence, verbatim (built).
  - The card's first sentence: built, the CMO's F1 fix. "It doesn’t replace that time with you." is `faqs.ts`
    `speech`, approved, and voice rule 8.
  - D026 (the marker).

### Fold 4 · Languages

- **Place:** after "Why it matters" (D064 item 9). **Job:** answer "Does it speak ours?".
- **Eyebrow:** "Languages"
- **H2:** "Kheelu speaks up to {languageCeiling} {hand:languages} at launch."
- **Lead:** "Eight today: English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French. In AI mode, it can switch
  between them mid-sentence: when your child changes language, Kheelu changes with them." The names render from
  `product.ts`.
- **Chips:** the eight, each in its own script (built, `product.ts`).
- **Picture:** film 6, "Two languages", as a single-film player that plays in place, poster first (the expert fold's
  pattern). It is never a cast photo (ruling 1).
  - **Poster:** `/video/moments/a-story-in-two-languages.jpg`, alt "A girl on a sofa beside the cream Kheelu plush."
  - **Chip:** "Two languages · 0:31"
  - **Caption:** "In AI mode, Arha switches to English, and Kheelu switches with her."
  - **Play label:** "Play: Two languages. In AI mode, Arha switches to English, and Kheelu switches with her."
  - Lazy.
- **Button:** none.
- **Sources:** [facts, Languages](../product/facts.md#languages); D058 item 7 ("at launch"); D017 (switching);
  `faqs.ts` `languages` (the switching sentence, approved); D040 (film 6's caption).

### Fold 5 · Kheelu asks. Your child thinks. (the sticky scroll, D064 item 7)

- **Place:** after Languages. **Job:** say what Kheelu is and why to buy it, in six points.
- **Eyebrow:** "How it works"
- **H2:** "Kheelu asks. {hand:Your child thinks.}"
- **Laptop:** the left column is sticky: the heading, then a picture that changes with the active point and a progress
  line that fills. It is pinned for at most about 2 viewports.
- **Phones:** stacked, each point with its small picture, and no sticky.

| # | Point title · body | Picture · alt | Sources |
|---|---|---|---|
| 1 | **A soft plush rabbit. No screen.** Kheelu is a cream plush rabbit with a speaker in its tummy. Your child talks and listens instead of watching. | DS `Kheelu/kheelu-front.webp` · "Kheelu, the cream plush rabbit from Kheelona, with rainbow-lined ears and a speaker in its tummy." | `product.ts` spec; `/safety` fold 3's built "No screen." line; claims §1 (screen-free) |
| 2 | **Press and ask.** Your child presses the wake-up button and asks. A light shows Kheelu is listening. | DS `Kheelu/kheelu-belly-module.png` · "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." (built) | [D018](../decisions/D018-wake-up-button.md); the product page's step 1 (built) |
| 3 | **It answers, then asks one back.** It answers the question first. Then it asks your child a question back, so they do the thinking. | Photo library `advik-02-whispering-to-kheelu` · "A boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall window." (built) | D017 |
| 4 | **It can’t browse the internet.** And when it doesn’t know something, it says so instead of guessing. | Photo library `ira-02-drawing-the-dragon` · "A girl in a yellow printed frock drawing a dragon on a cotton dhurrie, with Kheelu beside her." (the builder checks) | D017; D065 item 8 |
| 5 | **You read every conversation.** Each one appears in the parent app, word for word, a few minutes after it ends. Kheelu remembers them too, so it can pick up where your child stopped. | Real app screen `app-transcript.webp` · "The parent app showing one conversation word for word: Kheelu greets Aarav, and when he asks for Hindi, Kheelu answers in Hindi." (built) | D017; D058 items 1 and 8; [D036](../decisions/D036-launch-feature-claims.md) (memory); [D044](../decisions/D044-app-screens-on-the-site.md) |
| 6 | **From age 3. Still asking back at 7.** Made for children aged 3 to 7. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby. You set your child’s age in the parent app, and Kheelu’s AI is given child-safety rules for that age. | Photo library `tara-02-evening-with-amma` · "A girl and her mother on a sofa in the evening lamp light, with Kheelu between them." (built) | D009; D041; `faqs.ts` `what-ages`; D058 item 1 (the mechanism) |

- **The pictures of points 3 and 4 are swapped** (CMO m3). Stacked on a phone, Advik's AI photo would otherwise sit
  directly above the real transcript of a boy named Aarav in point 5, and could be read as him (ruling 7).
- **Point 6 keeps the age lines in `what-ages`' order** (CMO m5), the same order as FAQ question 6 two folds later.
- **Under point 3, a small card**, labelled above the exchange "Illustrative example, not a recording." (built, word
  for word, AP-15):
  - Your child: “Why does the moon follow our car?”
  - Kheelu: “The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else
    looks like it follows you?”
  - Your child: “My shadow?”
- **Under the points, one line (not a heading):** "Other AI gives answers. Kheelu asks questions."
  ([messaging](../brand/messaging.md#taglines-and-hero): EXTERNAL; D017)
- **Button:** "Pre-order Kheelu" (`home-asks` **NEW**), the price line and the trust line.
- **Secondary:** "See how it works" (`home-asks-learn` **NEW**) → `/products/kheelu#modes`.
- **"What is Kheelu?"** keeps its answer-first block as FAQ question 1 (fold 10; ruling 1).

### Fold 6 · The expert clip (D064 item 8)

- **Place:** right after fold 5. **Job:** an outside voice on screens and talk.
- **Eyebrow:** "A video from an expert"
- **H2:** "Watching isn’t {hand:talking.}"
- **Player:** poster first, plays on a tap, lazy.
  - **Poster alt:** "Chaitra, smiling, seated at a desk, with window blinds behind her."
  - **Chip:** "0:34"
  - **Play label:** "Play the video from an expert: Chaitra, therapist and developmental coach. 34 seconds."
  - "With captions" leaves the chip and the label, because the burned-in captions come off (D064 item 8; Q2.6).
- **Credit:** "Chaitra, therapist and developmental coach"
- **Disclosure:** "Kheelona made this video with Chaitra and compensated her for it."
- **Rule:** nothing in this fold names Kheelu, and no line puts her and Kheelu in one sentence.
- **Button:** none.
- **Sources:** D061 items 12-13; [claims §4](../product/claims.md#4-retired-or-banned-wording), the expert table;
  D064 item 8. The founder accepted the risk of no captions.

### Fold 7 · What you get, and what you pay (the offer card, moved up)

- **Place:** after the expert clip. **Job:** what I get, what I pay, and that there is no risk.
- **Eyebrow:** "Pre-order"
- **H2:** "What you get, and {hand:what you pay.}" (built)
- **Lead:** "There every day at home, with no screen to switch off."
  - v2's "no class to get to" is out. It casts Kheelu in an enrichment class's role, which is tutor framing
    ([claims §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors); D063 item 4), and it came
    from messaging's INTERNAL column (the guard; CMO M4).
- **The card (the product is "Kheelu"):**

| Part | Token mode | Full mode |
|---|---|---|
| Price | "{price:headline}" | "{price:full}" |
| Split rows | "Today, refundable · {price:token}" / "Before delivery · {price:balance}" (no "incl. GST") | none |
| Later price | "{price:headline} for the first 500 units. {price:full} once they are gone." | none |

- **Perks, in order** (one perk list in `offer.ts`, in this order on both offer cards; CMO m8):
  1. (truck) "{delivery}. Pre-orders go out first, in the order they were placed."
  2. (package) "In the box: Kheelu plush toy, charger and quick-start card"
  3. (map-pin) "Delivery anywhere in India, included"
  4. (star) "6 months of Kheelona+ included. Nothing renews without you."
  5. (house) "Made in India"
- **Under the perks (small):** "Kheelona+ is our paid subscription, on top of the free parent app."
- **Button:** "Pre-order Kheelu" (`home-offer` **NEW**). The card's price block stands in for the price line here, so it
  is not repeated. Under the button go the trust line (1.1) and the card's third row, "{warrantyMonths}-month warranty
  · UPI, card or net banking".
- **Share link:** "Share Kheelu on WhatsApp" (`share-whatsapp`).
- **Dropped from the card:** "A GST invoice with every order". It moves to the store, whose "How can I pay?" answer
  already says so (D065 item 3: GST only at checkout).
- **Picture:** the built board, top-aligned with the card (D064 item 5). It shows a flower shape, the Myra sticker,
  the Kheelu sticker and an ink heart.
  - **Label:** "A curious girl in a mustard flowered frock beside Kheelu, the cream plush rabbit" (built)
- **Sources:**
  - Amounts: [pricing](../product/pricing.md). Split rows without GST: ruling 5; Q2.8.
  - The later line: D061 item 3; D065 item 4.
  - Dispatch order: [facts, ship date](../product/facts.md#ship-date) ("Order of dispatch", EXTERNAL).
  - The box, delivery anywhere and Made in India: `offer.ts`; [D034](../decisions/D034-origin-manufacturer-mrp.md).
  - Kheelona+: D058 item 3 (paid subscription, free parent app, no feature list); D065 item 6.
  - The lead: "Every day at home" is [messaging, against the alternatives](../brand/messaging.md#against-the-alternatives)
    (EXTERNAL; never "cheaper", voice conflict 8). "No screen to switch off" is claims §1 (screen-free).

### Fold 8 · Safety you can check (compact; D064 item 2, Q2.2)

- **Place:** after the offer. **Job:** answer "Is it safe?" in five checkable lines.
- **Eyebrow:** "Safety"
- **H2:** "Safety you can {hand:check.}"
- **Lines** (DS TrustList icons):
  1. (microphone) "It listens only after someone presses the wake-up button."
  2. (wifi-slash) "No web browsing."
  3. (eye) "You read every conversation in the parent app."
  4. (hand-heart) "We don’t sell your data."
  5. (clock) "Each Kheelu has a daily limit on how long it talks."
- **Picture:** the real privacy-centre screen `app-privacy.webp`, as it is (D065 item 7).
  - **Alt:** "The parent app’s privacy centre: chats kept for {retentionMonths} months, a switch to save voice recordings,
    buttons to download your child’s data and to delete all chats, and links to the privacy policy, terms and the
    grievance officer."
  - **Caption:** "The Kheelona app is live on Apple’s App Store and the Google Play Store." (built)
- **Link:** "See how we built safety in" (`safety-learn`) → `/safety`. This is the built label (`cta.ts:36`), approved
  at Gate A. The product page's `product-safety-learn` reads the same (`cta.ts:45`), so the two links match and
  nothing changes.
  - Not used: ruling 8's "How Kheelu keeps your child safe" and Q2.2's "How we keep Kheelu safe". Both put "safe" on
    Kheelu, where voice rule 6 names behaviours instead, messaging bans "Safe" used alone, D018 rules out absolute
    safety claims, and the BIS licence is applied for, not granted (claims §6) (the guard; CMO M3).
- **Button:** "Pre-order Kheelu" (`safety`), the price line and the trust line.
- **Sources:** lines 1-4 are Q2.2's words, claims-checked by the main session (D018; D017; D020). Line 5: D065 item 5.
  The alt: D065 item 7 (G26). The caption: D044.

### Fold 9 · A day with Kheelu

- **Place:** after safety. **Job:** answer "When would we use it?", and show it is not all day.
- **Eyebrow:** "Little moments"
- **H2:** "A day with Kheelu, {hand:sunrise to bedtime.}"
- **Lead:** "Not all day. A few moments, wherever the day goes."

| Moment (DS icon) | Line | Mode chip | Source |
|---|---|---|---|
| Breakfast (`sun`) | "The first ‘why’ of the day. Kheelu answers, then asks one back." | AI mode · home Wi‑Fi | D017; [facts, modes](../product/facts.md) |
| After school (`chat-circle-dots`) | "Yesterday’s question, picked up where your child stopped: Kheelu remembers earlier conversations." | AI mode · home Wi‑Fi | D036; the product page's built step 4 |
| While you cook (`question`) | "A question to think about, not a cartoon to watch." | AI mode · home Wi‑Fi | claims §1 (screen-free) |
| At Nani’s (`house`) | "Stories, poems and jingles in Story mode, with no Wi‑Fi needed." | Story mode · no Wi‑Fi needed | [D027](../decisions/D027-story-mode-wording.md); `faqs.ts` `wifi` (a grandparent’s home) |
| Bedtime (`moon`) | "One last story, lights low." | Story mode · no Wi‑Fi needed | D027 |

- **Closing line:** "Each Kheelu has a daily limit on how long it talks. In the parent app, you can see how long
  your child talked each day."
- **Picture:** the real activity screen `app-activity.webp`.
  - **Alt:** "The parent app’s activity screen for today: 22 minutes of talking, 3 chats and 9 questions asked, with
    today’s chats listed." (built)
  - **Caption:** as fold 8.
- **What it never says:**
  - games ([D044](../decisions/D044-app-screens-on-the-site.md))
  - rhymes or family songs (no fact)
  - that a parent sets the limit
  - (v2's "Bluetooth music" caution is gone: [D058](../decisions/D058-follow-the-live-code-check-2026-10-14.md) item
    2 keeps Bluetooth mode, and FAQ question 1 says "a speaker for your phone"; CMO m13.)
- **Button:** none.
- **Sources:** D065 item 5 (the limit); D044 (talking time per day).

### Fold 10 · Questions parents ask

- **Place:** before the close. **Job:** settle the last doubts, decision questions first.
- **Eyebrow:** "Questions"
- **H2:** "Questions parents {hand:ask.}" (built)
- **FAQPage:** the eight answers below. Question 1 is the page's answer-first block.

| # | Question | Answer (token mode; full mode where it differs) | `faqs.ts` id · source |
|---|---|---|---|
| 1 | "What is Kheelu?" | "Kheelu by Kheelona is a screen-free plush rabbit that talks with children aged 3 to 7. It answers your child, then asks a question back. It has three modes: AI mode for open conversation on home Wi‑Fi, Story mode for stories, poems and jingles with no Wi‑Fi needed, and Bluetooth mode, which makes it a speaker for your phone." (58 words; built, today's fold 4 lead) | `what-is-kheelu` (new id, built words) · D017, D027, D058 item 2 |
| 2 | "What if my child doesn’t like it?" | Built, unchanged | `not-right-for-us` · D021, D033 |
| 3 | Token: "How much is Kheelu, and how does the advance work?" · Full: "How much is Kheelu?" | Token: "Kheelu is {price:headline} in total, with delivery anywhere in India included. A refundable {price:token} reserves yours today, and the rest is due before delivery, by a payment link we send you. You can pay by UPI, card or net banking." (CMO m2: question 2 and the trust line already carry the refund) · Full: "Kheelu is {price:full} in total, paid in full when you order, with delivery anywhere in India included. You can pay by UPI, card or net banking. {delivery}. If it isn’t right for your family, you can return it within {returnDays} days of delivery, no questions asked." | `price-and-advance` (rewritten: no GST, no MRP, no "first 500", no balance amount) · D065 items 3-4; D024; `faqs.ts` `paying-today` (the link) |
| 4 | "Isn’t this just screen time in disguise?" | "No. There’s no screen to watch: your child talks, listens and does the thinking. Each Kheelu has a daily limit on how long it talks, and in the parent app you can see how long your child talked each day." (40 words) | `screen-time-in-disguise` (new) · claims §1; D065 item 5; D044 |
| 5 | "Won’t an AI toy make my child think less?" | Built, unchanged (its "says so instead of guessing" is now confirmed) | `think-less` · D017; D065 item 8 |
| 6 | "What ages is Kheelu for?" | Built, unchanged | `what-ages` · D009; D041; D058 item 1 |
| 7 | "When will my Kheelu arrive?" | Built, unchanged | `when-arrive` · D023; facts (dispatch order) |
| 8 | "Is Kheelu the same as Lumi?" | Built, unchanged | `same-as-lumi` · claims §4 (the Lumi row) |

- **No "See all questions" link:** `faq-more` stops firing on Home (ruling 1's three links).
- **No speech question on Home:** [D025](../decisions/D025-speech-and-language.md).

### Fold 11 · Close

- **Place:** last. **Job:** the last button, with the risk reversal.
- **Eyebrow:** "Pre-order"
- **H2:** "It asks. {hand:They think.}"
- **Lead:** "For your own child, or as a gift for a 3 to 7 year old in the family."
- **Button:** "Pre-order Kheelu" (`finale`), the price line and the trust line. The trust line carries the risk reversal
  in the same words as everywhere else (ruling 3), so the lead does not repeat it in other words.
- **Picture:** a DS board with no cast child, because all five children appear above. It holds the `sun-sun` shape,
  `kheelu-front-sticker` and an ink heart that draws itself.
  - **Label:** "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy." (`/team`'s built
    label)
- **Sources:** [messaging, taglines](../brand/messaging.md#taglines-and-hero) ("It asks. They think.", EXTERNAL; the
  founder accepted the trademark risk in [D038](../decisions/D038-trust-content-rulings.md)); the lead is the product
  page's built close lead.

### Home: title, meta, keywords

- **Title:** "Kheelu by Kheelona: a screen-free plush toy that talks" (54), unchanged.
- **Meta, token:** "Kheelu by Kheelona: a screen-free AI toy for ages 3 to 7 that answers every why, then asks one back.
  {price:headline} in total; reserve with a refundable {price:token}." (149 rendered)
- **Meta, full:** "Kheelu by Kheelona: a screen-free AI toy for ages 3 to 7 that answers every why, then asks one back.
  {price:full} in total, delivered anywhere in India." (146 rendered)
  - Both lead with the total ([D028](../decisions/D028-price-wording.md), the machine-read rule).
  - Both drop "incl. GST" (D065 item 3; Q2.8's grep of the HTML).
  - Both match the ad's H1.
- **Keyword placements** for the primary "Kheelu by Kheelona" (BRD-1; [keyword map §5.2](../research/keyword-map.md)):
  - Title: met.
  - Meta: met.
  - First 100 words: met (the lead).
  - Alt: met (the hero and point 1: "Kheelu, the cream plush rabbit from Kheelona").
  - "3 to 7" in the first screen: met.
  - Lumi (BRD-2): met (FAQ 8).
  - H1 carries "Kheelu": **not met.** The founder's H1 (D065 item 1) leads with the category, and the lead carries the
    brand in the first line.
  - H2 "What is Kheelu?": **moved** to FAQ question 1. The answer-first FAQPage block survives (ruling 1).
- **Phone length:** an estimate of about 13 phone screens at 390 × 844 (today 19.8), with the offer heading by about
  screen 8 (today 16.5). The builder measures.

---

## 3. The product page, `/products/kheelu`

**Its job:** the full selling page and the target of Home's "See how it works". Under D064 it loses the parent-app,
safety and expert folds. It gains Home's compare table and the sample chats. Its step heading stays as built (CMO
m7; §13 item 8).

| # | Fold | Job | Button (`cta`) |
|---|---|---|---|
| 1 | Hero | What it is, the promise, the action | `product-top` |
| 2 | Films and quotes | Proof with real children | none |
| 3 | Offer card | What you get and pay, no risk | `product-offer`; `share-whatsapp` |
| 4 | Recognised by | Quiet authority | none |
| 5 | Steps | How the loop works | none |
| 6 | What asking back sounds like | Hear it, written down | `product-ask` **NEW** |
| 7 | How it works | Modes, languages, good to know | none |
| 8 | Compare | Why not another AI or an app | none |
| 9 | Safety, one line | Where the safety facts live | link `product-safety-learn` |
| 10 | Details | Specs, box, safety, declarations | none |
| 11 | Questions | Every remaining doubt | none |
| 12 | Close | The last button | `product-foot` |

### 3.0 The first phone screen

The y values are read from the CMO's screenshots of the plan's exact words in today's built hero (±8 px;
`raw/qa/2026-10-15/cmo/plan-v2/product-hero-plan-v2-sim-*`). The CMO measured an H1 of 3 lines and the board from 540
at 360 × 590 (CMO m12). The first screen passes at 360, 390 and 412.

| Element | Words | y at 360 × 590 | y at 390 × 844 |
|---|---|---|---|
| Nav | Logo, menu | 0-72 | 0-72 |
| Eyebrow | "Screen-free AI toy · Ages 3 to 7" | 96-112 | 96-112 |
| H1 | "Kheelu talks back. {hand:The good kind.}" | 3 lines, 124-256 | 2 lines, 124-212 |
| Lead (2 lines) | "A soft plush rabbit that answers every why, then asks one back." | 268-324 | 228-284 |
| Button | "Pre-order Kheelu" (`product-top`, arrow, no id) | 348-404 | 304-360 |
| Price line | "{price:token} today, refundable. {price:headline} in total." | 420-440 | 376-396 |
| Trust line (2 rows) | "Full refund until dispatch · {returnDays}-day returns" / "{delivery}" | 452-516: both rows inside | 408-472 |
| Hero board (Myra, Kheelu, the sticker "It asks. / They think.") | The board's built label | from 540: Kheelu starts below 590 (D061 item 14) | about 496-765: Kheelu wholly in view (D061 item 1) |
| Phone buy bar | Steps aside while the hero button is on screen | hidden | hidden |

### Fold 1 · Hero

- **Eyebrow:** "Screen-free AI toy · Ages 3 to 7" (as Home; D065 item 1).
- **H1:** "Kheelu talks back. {hand:The good kind.}" (built; the BUY-4 keyword).
- **Lead:** "A soft plush rabbit that answers every why, then asks one back." (63 characters, 2 lines). It explains "the
  good kind" in the founder's words.
- **Button:** `product-top`, then the price line and the trust line. No help line.
- **Picture:** the built board: the star shape, the Myra sticker, the Kheelu sticker and a speech bubble.
  - **Label:** "Kheelu, the cream plush rabbit that talks back, beside a curious little girl in a mustard flowered frock."
    (built; the keyword map's alt)
- **Sources:** D065 items 1 and 3; D017; `product.ts`; D061 item 1.

### Fold 2 · Films and quotes (built)

- **Eyebrow:** "Seven films"
- **H2:** "Real children, {hand:real families.}"
- **Lead:** "Watch the children do the thinking. Then hear from two of their parents."
- **Proof line:** "Shared with each family’s written consent."
- **Strip and quotes:** the strip is anchored (the in-page links play its films). It follows D064's order if the
  strip cannot differ by page (Q2.1). The quotes are as on Home.
- **Sources:** D040; D061 item 4; D064 item 1.

### Fold 3 · Everything that comes with it (the offer)

- **Eyebrow:** "What you get"
- **H2:** "Everything that {hand:comes with it.}" (built)
- **The card:** the same as Home's fold 7, with the price, the split rows, the later-price line in token mode and the
  same note under the perks. The perks come from the same list in `offer.ts`, in Home's order, delivery first (CMO
  m8):
  1. "{delivery}. Pre-orders go out first, in the order they were placed."
  2. "In the box: Kheelu plush toy, charger and quick-start card"
  3. "Delivery anywhere in India, included"
  4. "6 months of Kheelona+ included. Nothing renews without you."
  5. "Made in India"
- **Button:** `product-offer`, then the trust line, the third row ("{warrantyMonths}-month warranty · UPI, card or net
  banking") and "Share Kheelu on WhatsApp" (`share-whatsapp`). No help line: §1.1 keeps it to the closes and the
  store, and the bubble and this page's close carry it (CMO m9).
- **Picture:** DS `Kheelu/kheelu-on-fur.jpg`.
  - **Alt:** "Kheelu by Kheelona, the cream plush rabbit that talks back, with rainbow ears and a speaker in its tummy."
    The built alt gains the page's keyword, which is true of the picture.
- **Sources:** as Home's fold 7.

### Fold 4 · Recognised by

The built names, shown as on Home: the same small "Recognised by" label strip, with no heading (CMO m10; the Builder's
change, ruling 1's style).

### Fold 5 · Steps

- **H2:** "What happens when your child presses it." (built, unchanged; CMO m7). D064 item 7 and ruling 1 cover Home
  only. The founder's Home heading "Kheelu asks. {hand:Your child thinks.}" here would be the page's fourth "asks"
  heading, so it is listed as a proposal for the founder, not applied (§13 item 8).
- **Steps** (built, unchanged):
  1. "Press and ask." · "Your child presses the wake-up button and asks. A light shows Kheelu is listening."
  2. "Kheelu answers." · "It answers the question first."
  3. "Then it asks one back." · "A question back, so your child does the thinking."
  4. "Next time, it remembers." · "It remembers earlier conversations, so it can pick up where your child stopped.
     You can read every one of them."
- **Picture:** none.
- **Sources:** D018, D017, D036.

### Fold 6 · What asking back sounds like (ruling 6)

- **H2:** "What {hand:asking back} sounds like." (built)
- **Tabs:** three. Every tab shows, above its exchange, "Illustrative example, not a recording."

| Tab | Your child | Kheelu | Your child |
|---|---|---|---|
| "The moon" | “Why does the moon follow our car?” | “The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else looks like it follows you?” | “My shadow?” |
| "The dosa pan" | “Why does the dosa pan sizzle?” | “The pan is very hot, and the batter has water in it. When the water touches the hot pan, it turns into steam, and that’s the sizzle. Why do you think the pan has to be hot first?” | “So the dosa gets crispy?” |
| "Spider legs" | “How many legs does a spider have?” | “Eight. That’s two more than an ant, which has six. What else do you know that has more than four legs?” | “A centipede?” |

- **Under the tabs:** "Hear it in two languages: watch [“Two languages”](#a-story-in-two-languages)." This is an
  in-page link that plays film 6 in fold 2's strip, as the languages answer does.
- **Button:** "Pre-order Kheelu" (`product-ask` **NEW**), the price line and the trust line.
- **Rules:**
  - The exchanges are AI mode only, each led by the child. Each one answers, then asks back, and nothing more (D017).
  - There is no Story-mode pairing ([D027](../decisions/D027-story-mode-wording.md)), and no skill is named (legal
    L7). There is no "big word" tab (ruling 6).
  - There are no exclamation marks.
  - The CMO and the founder sign the two new exchanges, and the builder checks the facts in them (water turning to
    steam; eight legs and six).
- **Sources:** D017; the moon exchange is built (AP-15); D040 (film 6).

### Fold 7 · How it works (built; `#modes`, the target of Home's link)

- **Eyebrow:** "How it works"
- **H2:** "A toy that talks back, not a toy that {hand:repeats.}"
- **Lead:** "Kheelu is a screen-free plush toy for ages 3 to 7 that holds a back-and-forth conversation. It answers
  your child, then asks a question back, so they do the thinking." (built; it is also the Product node's description)
- **Modes and languages:** built.
- **Good to know**, in order:
  1. (wifi-high) "AI mode needs your home Wi‑Fi. Story mode and Bluetooth mode work without it." (built)
  2. (wifi-slash) "It can’t browse the internet. When it doesn’t know something, it says so instead of guessing." (D065 item
     8 adds "instead of guessing")
  3. (microphone) "Each conversation starts with a press of the wake-up button. It switches itself off after a couple of
     minutes of quiet." (built; D058 item 1)
  4. (clock) "Each Kheelu has a daily limit on how long it talks." (**new**; D065 item 5)
  5. (sliders-horizontal) "At setup, you enter your child’s age in the parent app." (built)
  6. (battery-charging) "It charges with the charger in the box." (built). Its F4 half stays hidden until the founder
     sends it.
- **Pictures:**
  - `advik-02-whispering-to-kheelu`, with its built alt.
  - The belly module, with its built alt.
- **Link:** "How setup works" → `/setup` (built).

### Fold 8 · Compare (moved from Home)

- **Eyebrow:** "Compare"
- **H2:** "Other AI gives answers. Kheelu {hand:asks questions.}"
- **Lead:** "Thinking out loud, not tapping on a screen."
- **Rows, phone rows and caption:** as built on Home. The caption is "Kinds of products, not brands: what each one
  usually does."
- **Link:** none. `compare-learn` stays Home's, and it stops firing (§11).
- **Sources:** [messaging](../brand/messaging.md#against-the-alternatives) (categories only, never brands); D017;
  D044 (the app column).

### Fold 9 · Safety, one line (D064 item 2; ruling 8)

- **Line:** "When the microphone is on, how Kheelu answers, and what you can read and delete, fact by fact:"
- **Link:** "See how we built safety in" (`product-safety-learn`, a DS ghost link) → `/safety`. Built (`cta.ts:45`),
  approved at Gate A, and the same as Home's `safety-learn` (Home fold 8; CMO M3).
- **What leaves:** the parent-app fold and the safety fold, with its `product-safety` button. Their content moves to
  `/safety` (§4).

### Fold 10 · Details (built, unchanged)

The specs, the box, safety, declarations ("MRP {price:mrp} (incl. of all taxes)" stays: brief §9.7) and the link to
`/refund`. The Safety tab's line "Tested before launch by trying to make it say unsafe things." waits on G29's other
half (§13).

### Fold 11 · Questions parents ask

| # | Question | Answer | id · source |
|---|---|---|---|
| 1 | "Will Kheelu do the thinking for my child?" | Built | `do-the-thinking` · D017; D065 item 8 |
| 2 | "What is the difference between a talking toy and a toy that talks back?" | Built (CMP-4) | `talks-back` · D017 |
| 3 | "Is Kheelu right for a 3‑year‑old?" | Built | `right-for-a-three-year-old` · D009; D058 item 1 |
| 4 | Token: "What does Kheelu cost, and what is the advance for?" · Full: "What does Kheelu cost?" | Token: "Kheelu is {price:headline} in total, with delivery anywhere in India included. The {price:token} is a refundable advance that reserves yours; the rest is due before delivery. Pay by UPI, card or net banking, with no payment fees." · Full: "Kheelu is {price:full} in total, paid in full when you order, with delivery anywhere in India included. Pay by UPI, card or net banking, with no payment fees. {delivery}." | `cost-and-advance` (rewritten; the Product JSON-LD `offerDescription` reads it and it still leads with the total, D028) · D065 items 3-4; D024; [D042](../decisions/D042-policy-display-answers.md) |
| 5 | "Isn’t this just screen time in disguise?" | As Home's question 4 | `screen-time-in-disguise` (new) |
| 6 | "What if my child doesn’t like it, or it stops working?" | Built | `returns-and-warranty` · D021, D022, D033 |
| 7 | "Will my child still play with it after the first week?" | Built | `after-the-first-week` · D036, D027 |
| 8 | "Will Kheelona+ charge me after the 6 months?" | "No, not unless you sign up for it yourself. Every Kheelu comes with 6 months of Kheelona+, our paid subscription, on top of the free parent app. Nothing renews without you." | `after-six-months` (new) · D058 item 3; D065 item 6 (G30: it never starts charging without the parent's own sign-up). The question is one the confirmed facts answer (CMO M5). What keeps working without Kheelona+ is F7: once it is decided before Gate B, the answer adds it and "What happens after the 6 months of Kheelona+?" can return (§13 item 1) |
| 9 | "Which languages does Kheelu speak?" | Built | `languages` · facts; D058 item 7 |
| 10 | "Can Kheelu help my child’s speech?" | Built, last, with the D025 line, its source and the help line ("Still have a question?" plus a WhatsApp link only) | `speech` · D025 |

"When does delivery start?" (`delivery-start`) leaves the page. The offer card and the trust line carry `{delivery}`.

### Fold 12 · Close

- **Eyebrow:** "Pre-order"
- **H2:** "Bring home a toy that {hand:asks back.}" (built)
- **Lead:** "For your own child, or as a gift for a 3 to 7 year old in the family." (built)
- **Button:** `product-foot` (`id="reserve"`, built), then the price line, the trust line and the help line.
- **Picture:** the built board: a heart shape, the Ira sticker, the Kheelu sticker and an ink star.
  - **Label:** "A smiling girl in a peach kurta beside Kheelu, the cream plush rabbit." (built)

### Product page: title, meta, keywords

- **Title:** "Kheelu by Kheelona: the toy that talks back, ages 3 to 7" (56), unchanged.
- **Meta, token:** "Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3
  to 7. {price:headline} in total; {price:token} refundable advance." (149 rendered)
- **Meta, full:** "Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3 to
  7. {price:full} in total, delivery included." (143 rendered)
- **Keyword placements** for the primary "toys that talk back" (BUY-4):
  - Title: met.
  - H1 "talks back": met.
  - H2 "A toy that talks back, not a toy that repeats.": met.
  - Meta: met.
  - Alt: met (the hero board and the offer photo).
  - FAQ "talking toy vs toy that talks back" (CMP-4): met.
  - "3 to 7" in the first screen: met.

---

## 4. `/safety`

**Its job:** answer "are AI toys safe?" with checkable facts, now with the product page's safety and parent-app
material (D064 item 2; Q2.2), then let the convinced parent buy.

| # | Fold | Change from HEAD |
|---|---|---|
| 1 | Hero | None |
| 2 | Four facts | Fact 3 takes G26's words; a button follows |
| 3 | What you won’t find | A sixth item |
| 4 | Every conversation, word for word | **New here** (from the product page) |
| 5 | The grown-up holds the keys | Alt updated; the link to the product page's app fold goes |
| 6 | Retention · certification | Retention lines updated |
| 7 | Questions | None |
| 8 | Close | The price line, trust line and help line |

### Fold 1 · Hero (built)

- **Eyebrow:** "Safety"
- **H1:** "Are AI toys safe? Check ours, {hand:fact by fact.}"
- **Lead:** "Not all of them, so check before you buy one for a child aged 3 to 7. Ask when its microphone is on, how
  it understands your child, whether it can browse the internet, and whether you can read every conversation. Here’s
  how Kheelu answers each one, in plain words."
- **Button:** none. The bar shows from first paint.
- **Picture:** `tara-02-evening-with-amma`, with its built alt.

### Fold 2 · Four facts

- **Eyebrow:** "Four facts"
- **H2:** "Is Kheelu safe for {hand:my child?}"
- **Lead:** "Judge it by what it does. Here are the four facts that matter most, in full." (built)
- **Facts:**
  1. "Is Kheelu always listening?" Built.
  2. "How does Kheelu understand and answer my child?" Built.
  3. "Can I read every conversation?" **New answer:** "Yes, in the parent app, word for word, a few minutes after
     each one ends. “Delete all chats” in the app deletes them from our servers."
  4. "Do you sell my child’s data?" Built.
- **Picture:** the belly module, with its built alt.
- **Button:** "Pre-order Kheelu" (`safety-facts` **NEW**), the price line and the trust line. A worried parent is most
  convinced here, and today the next button is five folds away.
- **Sources:** D018, D020, D017 and D058 items 1 and 8 (built); D065 item 7 (the deletion line).

### Fold 3 · What you won’t find in Kheelu

- **Eyebrow:** "Never"
- **H2:** "What you {mark:won’t} find in Kheelu."
- **Items:** the five built items, plus a sixth (icon `clock`): "**No talking all day.** Each Kheelu has a daily limit
  on how long it talks." (D065 item 5). v2's "No endless talking." could read as the unconfirmed per-conversation
  limit (§1.4; CMO m6).
- **Link:** "How to choose an AI toy: five checks" → the guide (built).

### Fold 4 · Every conversation, word for word (from the product page)

- **Eyebrow:** "The parent app"
- **H2:** "Every conversation, {hand:word for word.}"
- **Lead:** "Each one appears in the parent app a few minutes after it ends. Search them, read a daily summary, or look
  back over the week or the month." (the product page's built words; D058 item 8)
- **Screens:**
  - `app-transcript.webp`, alt "A real parent-app screen showing a child’s conversation with Kheelu word for word, in
    Hindi and English."
  - `app-activity.webp`, alt "A real parent-app activity screen: a child’s talking time, chats and questions asked
    today, and each conversation listed by its first words."
  - **Caption:** "The Kheelona app is live on Apple’s App Store and the Google Play Store."
- **Dropped as duplicates of this page:**
  - the product page's four safety items (they equal fold 2)
  - its facts line (fold 3 says each)
  - its "See what we keep" link (fold 6 is on this page)
  - the Kheelona+ note (it is selling copy, and it lives on the offer cards)

### Fold 5 · The grown-up holds the keys (built, two changes)

- **Eyebrow:** "Parent controls"
- **H2:** "The grown-up holds {hand:the keys.}"
- **Lead:** "The parent app is where you set the rules."
- **Items:** the three built items (age, languages, voice recordings).
- **Privacy-screen alt (G26):** "A real screen from the Kheelu parent app: the privacy centre. Chats are kept for
  {retentionMonths} months, with a switch to save voice recordings and buttons to download your child’s data and to
  delete all chats."
- **The link "See what the app shows you" goes.** Its target, the product page's app fold, has left, and the screens
  are now in fold 4.

### Fold 6 · Retention and certification

- **Retention:** eyebrow "Retention", H2 "How long conversations are {hand:kept.}". The copy:
  1. "Your child’s conversations stay in your parent app for {retentionMonths} months, then they’re deleted
     automatically." (`RETENTION_LINE`)
  2. "Deleting your account deletes your child’s profile, conversations and recordings from our servers."
  3. "Kheelu remembers earlier conversations with your child, and you can read every one of them."
  - The old sentence about removing a single chat ("hides it on that phone") comes off. "Delete all chats" now
    deletes from the servers (fold 2), and whether removing one chat changed with the app is not on file (§14).
  - Link: "Read our privacy policy" (built).
- **Certification:** built, unchanged ("applied for, not yet granted").

### Fold 7 · Questions (built, unchanged)

The two questions ("Is Kheelu OK for a 3-year-old?" and "What do child-safety groups say about AI toys?"), their
sources and the `advik-02` photo. The second answer's "Before launch, we test it…" sentence waits on G29's other half
(§13).

### Fold 8 · Close

- **Eyebrow:** "Pre-order"
- **H2:** "Check it all for yourself, {hand:at home.}" (built)
- **Lead:** "The wake-up button, the light and every conversation in the parent app: you can check each one once it’s
  home." (built)
- **Button:** `finale`, then the price line, the trust line and the help line.
- **Picture:** the built board (the Ira sticker), with its built label.

### `/safety`: title, meta, keywords

- **Title and meta:** unchanged. The title is "Are AI toys safe? How Kheelu works · Kheelona" (45), and the meta has no
  price.
- **Keyword placements** for "are AI toys safe" (CMP-1):
  - Title, H1, meta and first 100 words: met.
  - H2 "Is Kheelu safe for my child?": met.

---

## 5. `/setup`

**Its job:** day one after buying, and a decision for anyone who arrives before buying (ruling 8). Folds 1-5 are
built and unchanged: the hero, "Before you start.", "Connect Kheelu to your home Wi‑Fi.", "Tell the app your child’s
age." and "Show your child the wake-up button.".

### Fold 6 · Then let them talk (G27, as its recommendation)

- **H2:** "Then {hand:let them talk.}"
- **Copy:**
  1. "The first conversation is your child’s. Kheelu answers, then asks a question back."
  2. "Later, open the parent app to read every word of it."
  3. "No Wi‑Fi for a while? Story mode’s stories, poems and jingles still play. AI mode needs your home Wi‑Fi, and
     Bluetooth mode needs only your paired phone."
- The two deletion sentences come off, so the fold keeps one idea. The answer to G26 would otherwise have changed them.
- **Picture:** the activity screen and its caption, as built.

### Fold 7 · Stuck? We’ll help (the phone number off: D063 item 2)

- **H2:** "Stuck? {hand:We’ll help.}"
- **Contact:** "[Message us on WhatsApp](…) or email [the support address](mailto:…). Tell us your order number, and what you
  see on Kheelu and in the app." The links come from `seller.ts`, with no number and no `tel:`.
- **Action:** "All the ways to reach us" → `/contact` (built). The call option lives there.
- **The line "Don’t have Kheelu yet? Meet Kheelu" goes.** Fold 8 does its job.

### Fold 8 · Close (new; ruling 8)

- **Eyebrow:** "Pre-order"
- **H2:** "Don’t have Kheelu {hand:yet?}"
- **Lead:** "Day one takes your phone, the parent app and your home Wi‑Fi password."
- **Button:** "Pre-order Kheelu" (`finale`: an existing value with a **new placement**, `/setup`, which the registry's
  page list gains), then the price line and the trust line. No help line (fold 7 is help).
- **Picture:** none (the centred close).
- **No phone buy bar on `/setup`**, as built. A help page does not chase an owner down the page.
- **Sources:** the lead restates this page's own folds 2-3 (setup.md, built).

**Title and meta:** unchanged ("How to set up Kheelu on day one · Kheelona", 42). The keywords (title, H1 "set up",
meta) are met as built.

---

## 6. The buyer's guide, `/ai-toys-for-kids-in-india`

Folds 1, 2 and 4 are built and unchanged: the answer-first hero with no button (the bar shows from first paint), the
five checks, and "AI robot or {hand:AI plush?}".

### Fold 3 · How Kheelu meets each check

- **Eyebrow:** "Kheelu’s answers"
- **H2:** "How Kheelu meets {hand:each check.}"
- **Items:** built, except two:
  - **"Every conversation":** "Yes, in the parent app, word for word. “Delete all chats” in the app deletes them from
    our servers." (G26; D065 item 7)
  - **"Open internet":** its last sentence becomes "When it doesn’t know something, it says so instead of guessing."
    (D065 item 8)
- **Pointer and link** (built): "See the full safety facts".
- **Button:** "Pre-order Kheelu" (`guide-answers` **NEW**), the price line and the trust line.

### Fold 5 · Questions

The answers are `what-is-an-ai-toy`, `ai-toy-or-tablet`, `ai-toy-age`, `wifi` and **`price-and-advance`** (Home's
rewritten price answer). It replaces `how-much`, which carried "incl. GST", "first 500" and the balance. The two
sources and the Ira photo are as built.

### Fold 6 · Close

- **Eyebrow:** "Pre-order"
- **H2:** "Five checks, answered. Now {hand:meet Kheelu.}" (built)
- **Lead:** "Bring it home and check all five answers for yourself." (built)
- **Button:** `finale`, then the price line, the trust line and the help line.
- **Picture:** the built board (the Kabir sticker), with its built label.

### The guide: title, meta, keywords

- **Title:** "AI toys for kids in India: how to choose one · Kheelona" (55), unchanged.
- **Meta, token:** "AI toys for kids in India: five checks to make before you buy, and how Kheelu meets each. Ages 3 to 7.
  {price:headline} in total; reserve with a refundable {price:token}." (151 rendered)
- **Meta, full:** "AI toys for kids in India: five checks to make before you buy, and how Kheelu meets each. Ages 3 to 7.
  {price:full} in total, delivered anywhere in India." (148 rendered)
- **Keyword placements** for "AI toys for kids in India" (BUY-5):
  - Title, H1, meta and first 100 words: met.
  - H2 "AI robot or AI plush?" (CMP-3): met.

---

## 7. The journal: the hub `/stories` and the articles' close

**The hub:** its hero and topic bands are unchanged. It keeps the shared close.

**The close, by topic** (`articlePageCopy.close`; the rebuild's topic rule, [journal pipeline](../engineering/journal-pipeline.md)):

| Topic | Close H2 | Lead | Button |
|---|---|---|---|
| Screen time | "A toy that talks, {hand:with no screen.}" | "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back, and each Kheelu has a daily limit on how long it talks." | `finale` |
| AI and safety | "A toy you can {hand:check.}" | "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It has no camera and can’t browse the internet, and you can read every conversation in the parent app." | `finale` |
| Learning; the hub | "A toy that {hand:asks back.}" (built) | "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back." (built) | `finale` |
| Talking and language | The built "keep reading" close, with no button | Built | none: [D054](../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 16, "no pitch on the six talking guides" (§13 item 5) |

- **Under every button:** the price line, the trust line, the help line, and the built ghost link "See how it works"
  (untracked).
- **Art:** built. It stays plain on the four safety guides (`PLAIN_CLOSE_ART`).
- **Why the learning topic keeps the shared lead:** those guides cite adult-child talk research, and a close about more
  back-and-forth would make Kheelu the caring adult (source verification C08; the CMO's F1).
- **Sources:** claims §1 (no camera, no browsing, reading every conversation); D017; D065 item 5.

---

## 8. `/team`

Folds 1, 3 and 5 are built and unchanged: the hero, the founders and "Recognised by.".

- **Fold 2, "Who makes Kheelu?"** (the phone number off: D063 item 2): "{seller.legalName}, a small company in
  Bengaluru, makes Kheelu. Its three co-founders are Apoorva Sahu, Aman Soni and Kashyap C.R. Kheelu is designed by
  parents in Bengaluru and made in India. You can reach the team on [WhatsApp](…) or at [the support
  address](mailto:…)." The names come from `organization.ts` and the links from `seller.ts`.
- **Fold 4, "Why we build Kheelu.":** the third copy line takes G26's words: "And you hold the keys. You can read every
  conversation in the parent app, and “Delete all chats” there deletes them from our servers. You set your child’s
  age, and Kheelu’s AI is given child-safety rules and that age on every conversation." The quote, subtitle and link
  are built.
- **Fold 6, the close:**
  - **H2:** "Bring Kheelu {hand:home.}" (built)
  - **Lead (new):** "Designed by parents in Bengaluru. Made in India."
  - **Button:** `finale`, then the price line, the trust line and the help line.
  - **Secondary:** "See how Kheelu works" (built, untracked).
  - **Picture:** none (the centred close). The page shows no cast child, so none reads as a founder's own.
- **Title and meta:** unchanged ("Kheelona founders: the parents building Kheelu", 46).
- **Keyword placements** for "Kheelona founders": the title, the lead and the H2 "The Kheelona founders." are met.
- **Sources:** claims §3.1 (the footer line); D034 (Made in India); D065 item 7; D058 item 1.

---

## 9. `/contact`

Everything is as built except two things:
- **The close:**
  - **H2:** "Ready when {hand:you are.}"
  - **Button:** `finale`, then the price line and the trust line. The trust line replaces the trust pair.
  - **Secondary:** "See how Kheelu works" (built). No help line, because the whole page is help.
- **The seller block:** it loses its GSTIN line (D063 item 3; Q2.3).

The number stays here, in the hero, the ways, the call button and the seller block (the E-Commerce Rules; D063 item 2).
The title and meta are unchanged ("Contact Kheelona: WhatsApp, call or email the team", 50).

---

## 10. The store's first screen (marketing words only)

The checkout's form, fields, consent row, pay button, price sentence and breakdown are untouched (ADR-013; D065 item
3).

| Element | Words | Source |
|---|---|---|
| Eyebrow | "Screen-free AI toy · Ages 3 to 7" (was "Ages 3 to 7") | D065 item 1 |
| H1 | "Pre-order Kheelu." (built) | `store-page.ts` |
| Picture | DS `kheelu-front.webp`, alt "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy." (built) | built |
| Price block | The checkout's own, mode-aware sentence and breakdown, GST included: unchanged | D065 item 3; [pricing](../product/pricing.md) |
| Trust line under the price | "Full refund until dispatch · {returnDays}-day returns" / "{delivery}" | Ruling 3; Q2.8 ("the store's top marketing line may take the risk-reversal line") |
| Help | "Questions? Message us on WhatsApp." (was "Need help?": one wording everywhere) | D063 item 2; Q2.3; CMO m9 |

- **Not added:** the first-500 line. It goes on the offer cards only (D065 item 4).
- **The films fold below the form:**
  - **H2:** "See Kheelu {hand:ask.}"
  - **Lead:** "Real children, real families. Press play on any of them."
  - Today's "in real homes" contradicts the founder's note that not every film was shot at home
    ([D057](../decisions/D057-journal-from-dashboard-and-three-wordings-2026-10-14.md) item 2). This is page copy, not
    checkout logic.

---

## 11. Tracking values

**New values, to register in `src/lib/tracking/cta.ts` and the [tracking inventory](tracking-inventory.md):**

| Value | Role | Element | Page |
|---|---|---|---|
| `hero-film` **NEW** | secondary | Home hero link "Watch Kheelu ask, in a 30-second film" (plays film 1 in the strip). Registry note: it fires on laptops only (from 900 px), because phones have no hero link (CMO M1) | `/` |
| `home-why` **NEW** | preorder | "Why it matters" button | `/` |
| `home-asks` **NEW** | preorder | Sticky-scroll section button | `/` |
| `home-asks-learn` **NEW** | secondary | Sticky-scroll link "See how it works" → `/products/kheelu#modes` | `/` |
| `home-offer` **NEW** | preorder | Home offer-card button (moved up) | `/` |
| `product-ask` **NEW** | preorder | Button after "What asking back sounds like." | `/products/kheelu` |
| `safety-facts` **NEW** | preorder | Button after the four facts | `/safety` |
| `guide-answers` **NEW** | preorder | Button after "How Kheelu meets each check." | `/ai-toys-for-kids-in-india` |

**Existing values:**
- **A new placement:** `finale` on `/setup`, with the same meaning (the close button). The registry's page list gains
  `/setup`.
- **Unchanged:** `hero`, `navbar` (its note changes to "shown from 900 px", sticky), `navbar-mobile`, `finale`,
  `product-top`, `product-foot`, `product-offer`, `sticky-bar`, `safety`, `safety-learn`, `product-safety-learn` (both
  keep the built label "See how we built safety in"), `share-whatsapp`, `whatsapp-float`, `refund-learn`,
  `shipping-learn`.
- **Stop firing** (they stay registered and are never reused; their placements leave):
  - `see-it-ask`: Home's films fold has no button.
  - `see-it-ask-learn`, `compare-learn`, `faq-more`: Home's exits go.
  - `hero-learn`: the hero's link changes.
  - `product-safety`: the product page's safety fold moves to `/safety`.

`home-arc` and `compare` stay reserved. No event name and no ID changes.

---

## 12. Checks and budgets

**The claims guard, checked by hand** against every pattern in `test/guards/banned-phrases.data.ts`, both with the
tokens and as rendered. **Then run:** `findBanned` read 376 lines of v2 and found three failures. Two were copy
("How Kheelu keeps your child safe"; "no class to get to"), and both are replaced above. The third is the button and
the price line joined with a space, which C1 settles as a build rule (§1.1). The CMO ran `findBanned` on every
replacement line in this check, and all are clean.
- **Brain** (`kheelu-brain`, `helps-child-brain-grow`, `brain-development-product`): the only brain line is "Conversation
  helps a young brain grow.", with no Kheelu in it.
- **Ages** (`open-ended-ages`, `dead-age-ranges`): only "3 to 7" and "under 3".
- **Offer** (`part-price-button`, `offer-no-payment`, `offer-reserving-free`, `cash-on-delivery`, `ships-20-october`):
  - No price follows "Pre-order" inside a string.
  - "No payment fees" passes.
  - No "is free" near "reserve".
- **D058's withdrawn claims** (`one-tap-delete`, `servers-in-india`, `closed-library`, `safety-layer`, `minute-of-quiet`,
  `four-skills-report`, `new-word-count`, `quiet-hours`, `topic-controls`, `attack-own-safety`, `keep-none-of-it`): none
  appear. "A couple of minutes of quiet" passes, and "deletes them from our servers" names no place.
- **Other patterns** (`adapts`, `lessons`, `answers-offline`, `expert-endorsement`, `dr-chaitra`, `backed-by`,
  `pilot-homes`, `safety-certified`, the never-say list, the en-IN spellings): none appear.
- **`part-price-button` and the joined strings:** confirmed by the guard and the CMO. Joined with a space, the button's
  label and the price line fire it; with a line break they pass. Build condition C1 (§1.1) makes the price line its
  own block after every button, the drawer's included, and a unit test pins it.

**Rules beyond the guard, checked by hand:**
- **Words:**
  - "safe" appears only in the questions parents type ("Are AI toys safe?", "Is Kheelu safe for my child?", both
    built). The safety links keep the built "See how we built safety in", with "safety" as a noun (CMO M3).
  - No "real" beside an AI-made child: the hero link says "Watch Kheelu ask, in a 30-second film" (CMO M2).
  - No tutor or class framing: "no class to get to" is out (CMO M4).
  - "AI toy" as a headline noun appears only in the founder's H1 (D065 item 1).
  - No "teaching", "tutor", "games", "rhymes", "incl. GST" on a selling page, or "first 500" off the cards.
  - No phone number outside `/contact` and the legal pages.
  - en-IN spelling throughout.
  - At most one accent per heading, and none drawn in a first screen.
- **Content:** nothing internal ([content boundary](content-boundary.md)): no research figure, persona, competitor or
  plan.

**Budgets (ruling 9):**
- Home's HTML stays at 60 KB or less. It has 11 folds against 12 today, and the compare table, the guides fold and the
  long safety copy leave.
- The posters and every picture below the first screen load lazily.
- Home's LCP: the Kabir photo on laptops. On phones the LCP element is measured at 360, 390 and 412 px (it may be the
  H1), and the photo gets high priority only where it is in the first screen (§1.6; CMO m14).
- The sticky section is pinned for at most about 2 viewports on laptops.

**Deviation rows:** one per changed approved fold. These are Home folds 1-11, product folds 1, 3, 4 (the strip's
style, m10), 6, 7, 8, 9 and 11 (fold 5 keeps its built H2, m7), `/safety` folds 2-6 and 8, `/setup` folds 6-8, guide folds 3, 5 and 6, the journal close, `/team` folds 2, 4 and 6,
`/contact` fold 5 and the store's top and films heading ([deviations](../qa/deviations.md)).

---

## 13. Still open

Each item gives the options and a recommendation. Everything v1 asked is answered (D064, D065, the main session's
rulings), so it is not repeated here.

1. **F7: what keeps working after the 6 months of Kheelona+, and its price.**
   - (a) Say only what is confirmed. v2 does this: "Nothing renews without you" and "the free parent app". Question 8
     now asks "Will Kheelona+ charge me after the 6 months?", which those facts answer (CMO M5).
   - (b) Once decided, add one sentence to the product page's question 8 naming what keeps working without
     Kheelona+, and bring back the question "What happens after the 6 months of Kheelona+?".
   - (c) (b) plus the price.
   - **Recommend (a) now and (b) before Gate B.** At the decision point, "our paid subscription" raises a question the
     page cannot yet answer.
2. **G28's other half: "Between conversations nothing is sent anywhere, and when Kheelu rests, its Wi‑Fi is switched
   off"**, and "a single conversation cannot run on without end". D065 item 5 confirmed only the daily limit.
   - (a) Leave both out. v2 does this.
   - (b) Once the live team confirms them on the shipping firmware, add the Wi-Fi line to the product page's "Good to
     know" and `/safety` fold 3.
   - **Recommend (a) until confirmed.**
3. **G29's other half: the pre-launch test** ("Tested before launch by trying to make it say unsafe things"). It
   appears in the product page's Safety tab and `/safety`'s second answer. D065 item 8 confirmed only "says so instead
   of guessing".
   - (a) The founder confirms the test took place, and the lines stay.
   - (b) If it is not confirmed, the lines come off, using the ready fallbacks on the copy pages.
   - **Recommend deciding before Gate B.** v2 adds no new use.
4. **G27: `/setup` fold 6's deletion sentences.**
   - (a) Drop them. v2 does this, as the open question recommends.
   - (b) Keep them in G26's new words.
   - **Recommend (a):** the fold is about the first conversation.
5. **The talking guides' close.** Ruling 8 asks every article to end in a decision, but the founder's D054 item 16
   says "no pitch on the six talking guides".
   - (a) Keep D054. v2 does this: they keep the "keep reading" close.
   - (b) Give them the button close, which reverses a founder decision and needs the founder.
   - **Recommend (a):** a pre-order button under a late-talker guide reads as a speech claim (D025).
6. **The two ruled labels: settled by the guard and the CMO, applied here at the main session's direction.** Rulings 4
   and 8 still name the old labels, so the main session records the change to them.
   - The hero link (ruling 4) is now "Watch Kheelu ask, in a 30-second film", on laptops only. Phones have no hero link
     (CMO M1, M2). v2's "Watch Kheelu with real children" sat directly beside the AI-made Kabir photo.
   - The safety links (ruling 8) keep the built "See how we built safety in" on Home and the product page (CMO M3).
     "How Kheelu keeps your child safe" put "safe" on Kheelu.
   - Nothing is left open here.
7. **For the founder: the WhatsApp bubble on Home's phone first screen** (CMO M1; it changes D050's "persistent").
   - (a) The bubble enters with the phone buy bar once the hero button leaves. v2 plans this (§2.0).
   - (b) The bubble stays persistent, and the Builder crops the photo so the bubble's 72 × 72 px corner clears
     Kheelu's face at 390 and 412.
   - **Recommend (a).** Otherwise the bubble covers Kheelu at every phone size, and a second, green action competes
     with the one orange button on the first screen.
8. **For the founder: the product page's step heading** (CMO m7).
   - (a) Keep the built "What happens when your child presses it." v2 does this.
   - (b) Use Home's "Kheelu asks. {hand:Your child thinks.}" here too, as the Copywriter's proposal.
   - **Recommend (a).** D064 item 7 and ruling 1 cover Home only, (b) would be the page's fourth "asks" heading, and
     Home's link lands on `#modes`, not on the steps.
9. **For the founder: the WhatsApp share text** (§1.7; CMO m11). It changes D061 item 7's approved words.
   - (a) The token text leads with the total: "… {price:headline} in total; {price:token} today reserves yours,
     refundable." v2 does this.
   - (b) Keep D061 item 7's approved text unchanged. It still carries "(incl. GST)", which D065 item 3 takes off the
     selling pages.
   - **Recommend (a).** The message is read away from the page, where the total comes first (D028), as in the metas.

---

## 14. Gaps

- **No customer reviews exist.** After the first deliveries, collect up to three real reviews with written consent
  (first name, city, child's age) for beside the offer cards and the closes:
  `[PLACEHOLDER: consented parent reviews after the first deliveries]`. Until then, the two film quotes are the proof.
  Never show a count of buyers.
- **No battery figure (F4).** The charging line keeps its hidden F4 half, and no line promises use on the go beyond
  Story mode with no Wi‑Fi.
- **Removing a single chat:** what it does since the app changed is not on file (D065 item 7 covers "Delete all chats"
  only). v2 never states it.
- **Alt texts for photos not yet on Home** (`kabir-02`, `ira-02`, `kheelu-front`) were written from DS 03-cast's
  descriptions; `kabir-02`'s now follows the CMO's reading of the photo (m4). The builder checks each against its crop,
  including that Kheelu is in `ira-02`. If it is not, swap in the DS's `ira-01-story-on-the-bed` with its built alt.
- **The first-screen y values** are now the CMO's measurements and screenshot readings (§2.0, §3.0); `first-screen.spec`
  pins them. **The phone lengths are still estimates.** The builder measures them at 360 × 590, 390 × 844 and 412 ×
  915.
- **`faqs.ts` after v2:**
  - New ids: `what-is-kheelu`, `screen-time-in-disguise`, `after-six-months`.
  - Rewritten: `price-and-advance`, `cost-and-advance`.
  - Unused: `how-much`, `delivery-start`.
  - Machine files (`/llms.txt`, `/pricing.md`) may keep "incl. GST" (Q2.8).
