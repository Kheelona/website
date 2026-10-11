---
title: "Store (store.kheelona.com): page copy for the Gate A mockup"
type: page-copy
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§2 stage 7, §3.2, §3.3 store row, §5 store row, §6 issues 2, 3, 4, 9, 10)
  - ../checkout.md (step by step, form fields, failure states, what must not change, copy the new checkout carries)
  - ../gate-a-open-items.md (B12, B13), ../../open-questions.md (G13, F12)
  - ../../product/claims.md (§1, §4), ../../product/facts.md (identity, age, ship date, support channel, Kheelona+), ../../product/pricing.md, ../../product/policies.md, ../../product/age-band-review.md (row 9)
  - ../../brand/messaging.md (confirmed candidate lines, CTA labels), ../../brand/voice.md, ../content-boundary.md, ../tracking-inventory.md (§6)
  - ../../research/keyword-map.md (§6 PM1), ../../research/d2c-benchmarks.md (A3, A4, A5, A8, A11)
  - ./home.md (CTA block, compact block, fold 2 films table, fold 8 answers)
  - "decisions D021, D022, D023, D024, D028, D032, D033, D040, D041, D042, D043"
  - "wt: src/app/store/page.tsx, src/app/store/layout.tsx, src/features/preorder/components/{PreorderForm,OrderSummary}.tsx, src/features/preorder/lib/validate.ts, src/lib/store/tiers.ts, src/config/site.ts, src/app/(site)/{shipping,refund}/page.tsx (working tree of reset/website-v2, read 2026-10-11; no git access in this step, so the tag was not read with git show. The line numbers match the tag citations on checkout.md for every range checked: PreorderForm.tsx:194-241, store/page.tsx:45-126, layout.tsx:28-95)"
  - design-system/project/01-writing.md, 08-accessibility.md, components/Alert/README.md, components/FAQ/README.md (read-only)
---

# Store (`store.kheelona.com`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside the
> **Copy** blocks is meant for the site. Notes, sources and questions are for the team. All copy is a draft
> for Gate A; the founder signs it off ([D015](../../decisions/D015-founder-signs-off-copy.md),
> [D043](../../decisions/D043-all-pages-as-mockups-before-build.md)).

## How to read this page

- **Restyle only.** Checkout logic, field names, validation, the consent row, the payment flow and the pay
  button's wording stay exactly as live ([checkout, what must not change](../checkout.md#what-must-not-change-and-what-the-reset-restyles);
  brief §4.4). What changes is layout, headings, hints and the reassurance around the form.
- **Amounts** are written as they render today, followed by their source constant in backticks:
  ₹499 `TOKEN_PRICE`, ₹4,500 `BALANCE_PRICE`, ₹4,999 `LAUNCH_PRICE`, ₹7,999 `FULL_PRICE`
  ([pricing, single source](../../product/pricing.md#the-single-source-srcconfigsitets)). In the mockup each sits in
  `<span data-src="…">`. On the real store the pay button, the price line and the summary follow the live
  mode on the server ([pricing](../../product/pricing.md#where-price-text-appears-and-whether-it-follows-the-mode)).
- **Delivery** is the one content value `DELIVERY_TEXT`, "Deliveries start mid-November"
  ([D023](../../decisions/D023-new-order-delivery.md)).
- **Token mode** = while ₹499 reservations are open (live today). **Full mode** = after the first 500 units,
  ₹7,999 paid in full. Every fold says what changes in full mode.
- No em dashes. Ages 3 to 7 only. The word "friend" does not appear on this page.

## At a glance

| Item | Draft |
|---|---|
| Page job | Take the payment. A parent who tapped "Pre-order Kheelu" reaches one form; every buying question (what am I paying now, what if we change our minds, when does it come, how do I pay, will this work inside WhatsApp) is answered beside it, and nothing sends them away mid-purchase ([strategy §2 stage 7, §6 issues 2-4](../strategy.md#6-how-each-top-posthog-issue-gets-fixed)) |
| Real URL | `https://store.kheelona.com/` (mockup file `store.html`) |
| Indexing | `noindex, nofollow`, as live (`wt:src/app/store/layout.tsx:28-31`; [checkout](../checkout.md#what-must-not-change-and-what-the-reset-restyles)) |
| Primary search cluster | **None**: the store is noindex ([strategy §5, store row](../strategy.md#5-each-page-purpose-primary-cluster-outline)). The title and description still show in WhatsApp and browser link previews, so they follow the machine-read price rule ([D028](../../decisions/D028-price-wording.md)) |
| Title (27 characters) | Pre-order Kheelu · Kheelona |
| Meta description, token mode (146 characters) | Pre-order Kheelu by Kheelona, a screen-free plush toy that talks, for ages 3 to 7. ₹4,999 (incl. GST); reserve yours today with a refundable ₹499. |
| Meta description, full mode (144 characters) | Pre-order Kheelu by Kheelona, a screen-free plush toy that talks, for ages 3 to 7. ₹7,999 (incl. GST), with delivery anywhere in India included. |
| H1 (recommended, option A) | Pre-order Kheelu. |
| Page meta for the build script | `"chrome": false` (own minimal header and footer), `"buybar": false`, `"active": ""` |
| The one action | The store's own pay button: **Pay ₹499 and reserve** (full mode: **Pay ₹7,999 and pre-order**), live label kept. There is no "Pre-order Kheelu" button on this page ([strategy §3.3, store row](../strategy.md#33-placement-and-repetition)) |
| Orange buttons | Exactly one: the pay button. "Copy link" in the in-app note is a secondary button |

---

## Fold 0 · Store header

**Fold job:** say whose store this is and offer a person, without five ways to leave.

**Copy:**

> *(logo)* Kheelona → `home.html` (real: `https://kheelona.com`), `aria-label` "Kheelona home"
>
> Need help? [WhatsApp] or [call]

- "WhatsApp" links to `https://wa.me/919187546483`; "call" links to `tel:+919187546483`. Each link gets a
  44 px tap area. Replaces the live "Need help? WhatsApp us" (`wt:src/app/store/layout.tsx:48-53`): the
  number now takes calls ([D032](../../decisions/D032-grievance-block-and-call-line.md)).
- No site nav, no sticky bar (live chrome by design, `wt:src/app/store/layout.tsx:12-18`).
- Logo markup: copy from `mockup/partials/nav.html`. Logo alt "Kheelona".

---

## Fold 1 · Heading and price (first phone screen)

**Fold job:** confirm the parent is in the right place and say, before anything else, what they pay today, the
total, and when it comes.

**Copy, token mode:**

> **Eyebrow:** Ages 3 to 7
>
> **H1:** Pre-order Kheelu.
>
> Reserve yours for ₹499`TOKEN_PRICE` today, refundable until dispatch, then pay ₹4,500`BALANCE_PRICE` before delivery: ₹4,999`LAUNCH_PRICE` in total (incl. GST).
>
> Deliveries start mid-November`DELIVERY_TEXT` · 7-day returns, no questions asked

**Full mode:** the H1 is unchanged; the price sentence becomes "₹7,999`FULL_PRICE` (incl. GST), paid in full when
you order." The micro-line is unchanged.

- The price sentence is the exact [D028](../../decisions/D028-price-wording.md) text the founder chose as option (d)
  ([D041](../../decisions/D041-gate-a-round-1.md)). Mockup HTML, verbatim from `mockup/pages/home.html:15`:
  `Reserve yours for <span data-src="TOKEN_PRICE">₹499</span> today, refundable until dispatch, then pay <span data-src="BALANCE_PRICE">₹4,500</span> before delivery: <span data-src="LAUNCH_PRICE">₹4,999</span> in total (incl. GST).`
- The micro-line is Home's compact trust line ([home.md, CTA block](home.md#cta-block)). Its items link to their
  terms in a new tab, so a half-filled form survives: delivery → `shipping.html`, returns → `refund.html`.
- Eyebrow "Ages 3 to 7" puts the band first ([benchmarks A9](../../research/d2c-benchmarks.md#31-adopt)); the live
  kicker "Pre-order" (`wt:src/app/store/page.tsx:58-60`) would repeat the H1.
- **Image:** small Kheelu cut-out beside the heading (`kheelu-front.webp`), small on purpose so the form stays high
  on a phone (the live reasoning, `wt:src/app/store/page.tsx:67-69`). Alt: "Kheelu by Kheelona: the cream plush
  rabbit with rainbow ears and a speaker in its tummy." No DS cast child on this page.

**H1 options for the founder** (question 1 below):

| | H1 | Why |
|---|---|---|
| **A (recommended)** | Pre-order Kheelu. | The words on the button the parent just tapped, so they know they landed right; the same in both modes; carries no amount, so ₹499 always arrives with its total in the next sentence |
| B | Reserve your Kheelu. (full mode: Pre-order your Kheelu.) | Matches the pay button's verb in each mode, but reads "Reserve… Reserve yours for ₹499" with the price sentence under it |
| C | Reserve Kheelu for ₹499. (live, `wt:src/app/store/page.tsx:61-65`) | Live wording, but a heading that says ₹499 with no total is the shape [D028](../../decisions/D028-price-wording.md) exists to stop ([pricing, D028 table](../../product/pricing.md#price-wording-for-the-new-site-d028)) |

---

## Fold 2 · In-app browser note (shown as an example)

**Fold job:** stop a UPI payment failing inside Instagram, Facebook or WhatsApp, before the parent types anything.

**Copy (DS `Alert`, tone `info`, icon `info`):**

> **Paying by UPI? Open this page in Chrome or Safari.**
>
> Do it first, so you don't type your details twice. Copy the link and paste it into Chrome or Safari: store.kheelona.com
>
> [Copy link] *(after a tap: "Link copied.")*

**Mockup-only review note** (styled as a review annotation, never part of the site):

> Example. On the real store this note appears only when the page opens inside the Instagram, Facebook or
> WhatsApp browser.

- Wording from the founder-facing item G13 ("Paying by UPI? Open in Chrome or Safari", with copy link;
  [open questions](../../open-questions.md) G13), working default B12: presentation only, shipped once QA's
  sandbox test confirms the failure ([gate-a-open-items](../gate-a-open-items.md#3-other-website-items-on-working-defaults)).
- The address is printed in full so the note works without JavaScript; the button is a secondary button with the
  `copy` icon, never orange. Confirmation follows the DS pattern "say what happened" (`01-writing.md:106`).
- It sits above the form on purpose: a parent who switches browser after typing loses what they typed.
- No `cta` attribute: it is not a pre-order CTA (see [Tracking](#tracking)).

---

## Fold 3 · Your details (the form) and what sits beside the pay button

**Fold job:** four fields and one tick, then the pay button with the price, the terms and a person beside it.

**Copy:**

> **H2:** Your details
>
> **Your name**
>
> **Indian WhatsApp number** *(a fixed "+91" shown inside the field, before the digits)*
> Hint, token mode: For messages about your order, including the link to pay the balance before dispatch.
> Hint, full mode: For messages about your order.
>
> **Email**
> Hint: We email your confirmation here.
>
> **Your child's age**
> Hint: Kheelu is made for children aged 3 to 7. Just the number is fine, like 4.
>
> ☐ I accept the [pre-order terms] and the [refund policy], and I am happy to hear about my own order on WhatsApp.
>
> **[Pay ₹499`TOKEN_PRICE` and reserve]** *(full mode: Pay ₹7,999`FULL_PRICE` and pre-order)*
>
> Reserve yours for ₹499`TOKEN_PRICE` today, refundable until dispatch, then pay ₹4,500`BALANCE_PRICE` before delivery: ₹4,999`LAUNCH_PRICE` in total (incl. GST).
>
> 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking · Delivery included anywhere in India
>
> The button opens Razorpay's payment window. We never see your card details, and nothing is ever charged automatically.
>
> Rather talk to a person? [WhatsApp] or [call +91 91875 46483]

**Full mode, beside the button:** "₹7,999`FULL_PRICE` (incl. GST), paid in full when you order." replaces the
price sentence; everything else is unchanged.

**What stays exactly as live (load-bearing, [checkout](../checkout.md#what-must-not-change-and-what-the-reset-restyles)):**

| Field | `name` | Input | `autocomplete` | Required | Live source |
|---|---|---|---|---|---|
| Your name | `parentName` | text, maxLength 80 | `name` | yes | `wt:PreorderForm.tsx:194-201` |
| Indian WhatsApp number | `phone` | `tel`, `inputMode=tel` | `tel` | yes | `wt:PreorderForm.tsx:202-215` |
| Email | `email` | `email`, `inputMode=email` | `email` | yes | `wt:PreorderForm.tsx:216-224` |
| Your child's age | `childAge` | text, maxLength 20 | none | yes (B13) | `wt:PreorderForm.tsx:227-234` |
| Consent | `accepted` | checkbox, **not pre-ticked** | none | yes | `wt:PreorderForm.tsx:236-241` |

- `noValidate` on the form, the shared validators, and the single `onChange` on `<form>` that fires
  `preorder_form_started` stay ([checkout](../checkout.md#what-must-not-change-and-what-the-reset-restyles)).
  Inputs at 16 px or more so iOS does not zoom mid-payment.
- **Phone label and +91 (presentation only):** the label says "Indian WhatsApp number" and the field shows a fixed
  +91 before the digits; the validator is unchanged and still accepts +91, 0 and spaces (`wt:validate.ts:41-49`;
  [strategy §6 issues 3 and 9](../strategy.md#6-how-each-top-posthog-issue-gets-fixed); G13). The +91 is decoration,
  not part of the value; the label carries "Indian" for screen readers.
- **Phone hint changed:** the live hint, "Where we send your confirmation, and the balance link before dispatch."
  (`wt:PreorderForm.tsx:209-213`), promises a WhatsApp confirmation that no code sends: the only automatic message
  is the email ([checkout, after the step table](../checkout.md#step-by-step); F12). The new hint claims only what
  the consent row and the published balance step say (question 2).
- **Email hint (new):** the confirmation email is automatic ([checkout step 14](../checkout.md#step-by-step)).
- **Child-age hint changed:** "nearly 3" invites an order for a child under 3; the age-band review asks for "built
  for children aged 3 to 7" ([age-band review row 9](../../product/age-band-review.md)). The field stays required free
  text with an example (B13). "Made for" matches Home's age answer ([home.md fold 8](home.md#fold-8--questions-parents-ask)).
- **Consent row:** verbatim, links to `https://kheelona.com/terms` and `/refund` (mockup `terms.html`,
  `refund.html`) in a new tab, each with a visually hidden "(opens in a new tab)". The whole row toggles the box
  ([strategy §6 issue 10](../strategy.md#6-how-each-top-posthog-issue-gets-fixed)).
- **Pay button:** live label pattern `Pay ${amountLabel} and ${reserve | pre-order}` (`wt:PreorderForm.tsx:265-267`),
  white on Chilli (the founder's accepted exception, [D041](../../decisions/D041-gate-a-round-1.md)). Busy states,
  as live: "Setting up your payment…" then "Opening the payment window…" (`wt:PreorderForm.tsx:268-269`).
- **Beside the button:** the D028 sentence carries the refund promise ("refundable until dispatch") that must stay
  next to the pay button ([checkout](../checkout.md#what-must-not-change-and-what-the-reset-restyles)); it replaces the
  live line "₹499 today, ₹4,500 when your Kheelu is ready to ship, for the ₹4,999 price…"
  (`wt:PreorderForm.tsx:272-287`), which has no "incl. GST" and puts the total after the advance in a looser form.
  The trust row is Home's full row, each item linked in a new tab: returns and warranty → `refund.html`, payment →
  `terms.html`, delivery → `shipping.html` ([benchmarks A5](../../research/d2c-benchmarks.md#31-adopt)).
- **Help line:** replaces "Rather do this over a message? WhatsApp us and a person will help."
  (`wt:PreorderForm.tsx:288-297`) with the call option ([D032](../../decisions/D032-grievance-block-and-call-line.md)).
  Inline, never a floating bubble ([strategy §3.2](../strategy.md#32-what-sits-beside-every-cta)).

**Error messages, as live** (they come from the shared validator, `wt:validate.ts:62-89`; shown under the field,
linked with `aria-describedby`, and the page scrolls to the first one, `wt:PreorderForm.tsx:97-108`):

| Field | Message |
|---|---|
| Name | We need a name to put on the order. · That is longer than we can fit on a label. |
| Phone | We need a 10 digit Indian mobile number, the one you use on WhatsApp. |
| Email | We need an email address, so we can send your confirmation. |
| Child's age, empty | Tell us your child's age, so we send you the right thing. |
| Child's age, too long | Just the age is enough, like 3, or 2 and 5 for two children. **Proposed:** Just the age is enough, like 4, or 3 and 6 for two children. (question 3) |
| Consent | Please tick the box to accept the pre-order terms. |

---

## Fold 4 · What you are agreeing to (order summary)

**Fold job:** say exactly what leaves the account today, what leaves it later, what can be undone, and when it comes.
On laptops this card sits beside the form; on phones it follows the pay button.

**Copy, token mode:**

> **H2:** What you are agreeing to
>
> **₹499`TOKEN_PRICE` today**
> A refundable advance, part of the ₹4,999`LAUNCH_PRICE` price (incl. GST).
>
> **₹4,500`BALANCE_PRICE` before delivery**
> The rest of the price, by a payment link we send on WhatsApp and by email. Never charged automatically.
>
> **Refundable in full**
> Ask any time before we dispatch your Kheelu. No fee, and no reason needed.
>
> **Deliveries start mid-November`DELIVERY_TEXT`**
> Pre-orders go out first, in the order they were placed.
>
> *(small print)* Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app. The price is ₹4,999`LAUNCH_PRICE` (incl. GST) for the first 500 units, and ₹7,999`FULL_PRICE` (incl. GST) once they are gone. Delivery anywhere in India is included, and every order comes with a GST invoice.

**Copy, full mode:**

> **₹7,999`FULL_PRICE` today**
> The whole price, incl. GST.
>
> **Nothing due before delivery**
> You have paid the whole price. No balance link, and nothing automatic.
>
> **Refundable in full** · **Deliveries start mid-November`DELIVERY_TEXT`** *(as token mode)*
>
> *(small print)* Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app. The first 500 units at ₹4,999`LAUNCH_PRICE` have been reserved, and this order is at the ₹7,999`FULL_PRICE` price (incl. GST). Delivery anywhere in India is included, and every order comes with a GST invoice.

- Restyle of the live `OrderSummary` (`wt:OrderSummary.tsx:40-103`), heading kept. Changes, all copy:
  - The first line's note no longer prints the tier label. Live it reads "₹499 today / Pre-order price" and, in full
    mode, "₹7,999 today / Launch price" (`wt:src/lib/store/tiers.ts:50, 54`): the first reads as if ₹499 were the
    price ([D028](../../decisions/D028-price-wording.md)) and the second calls the full price a launch price. The label
    lives in a logic file, so the restyled card simply does not print it.
  - "on dispatch" becomes "before delivery", the founder's D028 wording, so the card and the price sentence agree.
  - The Kheelona+ line is the first sentence of [D027](../../decisions/D027-story-mode-wording.md)'s sanctioned line,
    verbatim: it lists the offer and says nothing about after six months ([D041](../../decisions/D041-gate-a-round-1.md)).
    Live prints `KHEELONA_PLUS_SHORT` (`wt:OrderSummary.tsx:98`).
  - "All prices include GST." becomes "incl. GST" beside each price ([D024](../../decisions/D024-payment-methods-gst.md)),
    and the GST invoice is added (D024).
- "First 500 units" appears once on the page, here, as an offer term and never as a count or badge
  ([D041](../../decisions/D041-gate-a-round-1.md); [pricing](../../product/pricing.md#live-state): the count is never published).
- The four promise marks (`PromiseMark`) of the live card are production art; the mockup uses DS icons instead
  (`currency-inr`, `calendar-check`, `arrow-counter-clockwise`, `truck`).

---

## Fold 5 · Questions before you pay (FAQ)

**Fold job:** answer the four questions that stop a parent at the form, each under 60 words, from confirmed facts.

**Copy (DS `FAQ`, all items closed):**

> **H2:** Questions before you pay
>
> **What am I paying today?**
> A refundable ₹499`TOKEN_PRICE` today reserves your Kheelu, and it is part of the ₹4,999`LAUNCH_PRICE` price (incl. GST), not an extra fee. The remaining ₹4,500`BALANCE_PRICE` is due before delivery, by a payment link we send on WhatsApp and by email. Nothing is ever charged automatically. *(44 words)*
>
> **What if I change my mind?**
> Until we dispatch your Kheelu, message us with your order number and you get all of your money back, with no fee and no reason needed. We start your refund within 2 working days of your request; your bank takes 5-7 working days. After delivery, you can still return it within 7 days, no questions asked. *(56 words)*
>
> **When will my Kheelu arrive?**
> Deliveries start mid-November`DELIVERY_TEXT`. Pre-orders go out first, in the order they were placed, and we send you a tracking link when yours leaves us. Delivery anywhere in India is included, with nothing to pay at the door. We don't ship outside India. A reserved Kheelu is dispatched once the balance is paid. *(52 words)*
>
> **How can I pay?**
> By UPI, debit or credit card, or net banking, in Razorpay's payment window. There are no payment fees and nothing recurring. Your card number, UPI ID and bank details go to Razorpay, not to us, and every order comes with a GST invoice. *(43 words)*

**Full mode:**

> **What am I paying today?**
> The whole price: ₹7,999`FULL_PRICE` (incl. GST), with delivery anywhere in India included. There is nothing more to pay before dispatch: no balance link, and nothing charged automatically. Until we dispatch your Kheelu, all of it is refundable. *(37 words)*
>
> **When will my Kheelu arrive?** drops its last sentence ("A reserved Kheelu is dispatched once the balance is paid."). The other two answers are unchanged.

- Four questions, the brief's 3 to 4; the DS FAQ's own "checkout reassurance" use (`components/FAQ/README.md:5`).
  Each answer avoids repeating the summary card word for word: the card states the terms, the answers add how,
  how long and what happens next.
- "Refundable" sits beside the ₹499 and the total is in the same sentence ([D028](../../decisions/D028-price-wording.md)).
- No FAQPage JSON-LD here: the page is noindex.

---

## Fold 6 · Films (keep, recommended; question 4)

**Fold job:** for a parent still unsure at the form, show real children with Kheelu, below everything that answers
the money questions.

**Copy:**

> **H2:** See Kheelu ask, in real homes.
>
> **Lede:** Real children in real homes. Press play on any of them.
>
> *(the seven films: chips, captions, poster alts and play labels exactly as on Home, [home.md fold 2 table](home.md#fold-2--see-it-ask), with film 6's D040 caption "In AI mode, Arha switches to English, and Kheelu switches with her.")*
>
> [Back to your details] → `#details`

- Live keeps the films below the whole grid (`wt:src/app/store/page.tsx:99-123`) under the heading "Families already
  using Kheelu.", which is **banned**: Kheelu has not shipped ([claims §4](../../product/claims.md#4-retired-or-banned-wording)).
  The heading and lede here are Home's, so the page adds no new proof claim ([D040](../../decisions/D040-films-move-to-new-site.md):
  claim only what the films show).
- Below the FAQ, never between the form and the summary: the live comment explains why
  (`wt:src/app/store/page.tsx:99-112`). No `<video>` element until play is pressed; posters lazy-load.
- "Back to your details" is a ghost link, not a button; no DS cast photo near the films.

---

## Fold 7 · Store footer

**Fold job:** prove who is being paid, and give the legally required ways to reach a person and complain.

**Copy:**

> [Pre-order terms] · [Refunds and cancellation] · [Shipping and delivery] · [Privacy] · [Contact]
>
> **Kheelona Robotics Private Limited**
> 5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India
> GSTIN 29AAMCK1530E1ZN
> +91 91875 46483 (WhatsApp or call) · hello@kheelona.com
>
> Grievance Officer: Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483. We acknowledge every complaint within 48 hours and resolve it within one month of receiving it.
>
> No payment fees. Nothing recurring. Payments by Razorpay. [How to raise a chargeback with your bank] → `refund.html#chargeback`
>
> © 2026 Kheelona Robotics Private Limited

- Policy links keep the live labels and point at kheelona.com (mockup: `terms.html`, `refund.html`, `shipping.html`,
  `privacy.html`, `contact.html`) (`wt:src/app/store/layout.tsx:61-77`). Recommend a new tab, like the consent row's
  links, so a half-filled form survives.
- The seller block renders from the one seller source; the live "which takes messages and not calls"
  (`wt:src/app/store/layout.tsx:88-89`) is retired ([D032](../../decisions/D032-grievance-block-and-call-line.md)).
  Legal block markup: copy from `mockup/partials/footer.html:13-19`.
- The grievance block is D032's published wording, required on the store footer (D032; [policies](../../product/policies.md#decided-for-the-new-site)).
- The payments line is [D042](../../decisions/D042-policy-display-answers.md)'s wording for the store footer. The
  chargeback how-to lives on `/refund`; this page links to it (anchor dependency in [Notes](#notes-for-the-builder-and-gaps)).

---

## Other states (as live; reference only, not in the mockup)

| State | Copy | Source |
|---|---|---|
| Payment window closed | You closed the payment window, and nothing was charged. Your details are still here when you want to finish. | `wt:PreorderForm.tsx:147-153` |
| Payment window would not open | The payment window would not open, which usually means a blocked script or a shaky connection. Nothing was charged. Try again, or message us on WhatsApp and we will take it from there. | `wt:PreorderForm.tsx:176-181` |
| Provider unreachable | We could not reach our payment provider. Nothing was charged. Please try again in a moment. | `wt:PreorderForm.tsx:182-187` |
| Server refusal (default) | We could not start that. Please try again. (the server's own messages for 409, 429, 500 and 502 are logic, listed on [checkout, failure states](../checkout.md#failure-and-edge-states-all-render-a-page-none-throw)) | `wt:PreorderForm.tsx:131-136` |
| Store not switched on | **Pre-orders open here shortly.** Our store is not switched on yet. Nothing is wrong at your end, and nothing has been charged. [Message us on WhatsApp] We will reserve one for you by hand in the meantime. | `wt:src/app/store/page.tsx:128-149` |

Failure messages show in a DS `Alert` (`danger`, `role="alert"`) above the pay button, as live.

## Phone order and laptop layout

- **Phone (360 px first):** header → fold 1 → fold 2 (only in in-app browsers; shown in the mockup) → fold 3 →
  fold 4 → fold 5 → fold 6 → footer. The first screen holds the eyebrow, H1, price sentence and micro-line.
- **Laptop:** two columns as live (`wt:src/app/store/page.tsx:54`): left, folds 1 to 3; right, fold 4 then fold 5,
  sticky. Films and footer span the width below.

## Tracking

| Element | `cta` value | Note |
|---|---|---|
| Pay button | **none**, as live | A plain `<button>`, not the `Button` atom (`wt:PreorderForm.tsx:255-270`); the funnel events (`preorder_start`, `begin_checkout`, Meta `InitiateCheckout`, `purchase`) fire from the form's code and are unchanged ([tracking inventory](../tracking-inventory.md)). Adding a `cta` value would be a new property (G10) |
| Copy link | none | Not a pre-order CTA; autocapture records its text. The new checkout events (B11) are separate additions |
| Film play buttons | none | Labels "Play: {chip}. {caption}", "Previous video", "Next video", as live ([D040](../../decisions/D040-films-move-to-new-site.md)) |
| Header, footer, trust links | none | Plain links |

## Keyword placements and entity facts

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules); [strategy §7](../strategy.md#7-search-and-ai-visibility-rules-the-pages-follow)) | Met | Where |
|---|---|---|
| Primary cluster in title, H1, first paragraph, meta | Not applicable | Noindex; no cluster assigned |
| Title ≤ 60, meta ≤ 155 | Yes | 27; 146 (token) and 144 (full) |
| One H1 | Yes | "Pre-order Kheelu." |
| Machine-read text leads with ₹4,999 (incl. GST), advance second | Yes | Meta description ([D028](../../decisions/D028-price-wording.md)) |
| Entity facts identical: "Kheelu by Kheelona", 3 to 7, incl. GST | Yes | Meta, eyebrow, age hint, image alt |
| Banned words (friend, best friend, lessons, adapts, wake word, safe as a product claim, competitor names, "Families already using Kheelu") | None present | Whole page |

---

## Sources

Plain `path:line` = wiki file; `wt:` = working tree of `reset/website-v2` (see front matter).

| Claim or copy | Source |
|---|---|
| Restyle only; field names, autocomplete, `noValidate`, `onChange`, consent unticked, pay button wording, policy links to kheelona.com, noindex, no `<video>` before play, refund promise beside the pay button | [checkout.md:237-265](../checkout.md#what-must-not-change-and-what-the-reset-restyles); brief §4.4 |
| The five fields, labels, validation | [checkout.md:116-126](../checkout.md#form-fields-store-page); `wt:PreorderForm.tsx:194-241`; `wt:validate.ts:58-92` |
| Store purpose, contents beside the form, +91 label, in-app hint | [strategy.md:214](../strategy.md#5-each-page-purpose-primary-cluster-outline), [:92](../strategy.md#2-the-parents-journey-and-objections), [:223-225, :230-231](../strategy.md#6-how-each-top-posthog-issue-gets-fixed) |
| "Paying by UPI? Open in Chrome or Safari", copy link; fixed +91; child age free text with an example | [open-questions.md:119](../../open-questions.md) (G13); [gate-a-open-items.md:68-69](../gate-a-open-items.md#3-other-website-items-on-working-defaults) (B12, B13) |
| Price sentence (option d), exact text | [D028:14-21](../../decisions/D028-price-wording.md); [D041:18](../../decisions/D041-gate-a-round-1.md); `mockup/pages/home.html:15` |
| Full-mode sentence "₹7,999 (incl. GST), paid in full when you order." | [home.md:53](home.md#at-a-glance); [pricing.md:69, :103](../../product/pricing.md#how-the-price-is-decided-server-only) |
| Amounts ₹499, ₹4,500, ₹4,999, ₹7,999; first 500 units | [pricing.md:66-72](../../product/pricing.md#the-single-source-srcconfigsitets) |
| Machine-read text leads with ₹4,999 | [D028:17-18](../../decisions/D028-price-wording.md); [pricing.md:176](../../product/pricing.md#price-wording-for-the-new-site-d028) |
| Deliveries start mid-November | [D023](../../decisions/D023-new-order-delivery.md); [facts.md:189](../../product/facts.md#ship-date) |
| Pre-orders go out first, in the order placed | [facts.md:192](../../product/facts.md#ship-date); `wt:OrderSummary.tsx:56` |
| 7-day returns, no questions asked; return within 7 days of delivery | [D021:11-21](../../decisions/D021-returns-policy.md); [messaging.md:248-249](../../brand/messaging.md#confirmed-candidate-lines) |
| 6-month warranty | [D022](../../decisions/D022-warranty-replacement-refund.md); [policies.md:106](../../product/policies.md#decided-for-the-new-site) |
| UPI, card or net banking; incl. GST; GST invoice with every order | [D024](../../decisions/D024-payment-methods-gst.md); [policies.md:115-116](../../product/policies.md#decided-for-the-new-site); [messaging.md:259](../../brand/messaging.md#confirmed-candidate-lines) |
| Delivery included anywhere in India; nothing to pay at the door; no shipping outside India; tracking link | [pricing.md:238](../../product/pricing.md#tax-delivery-mrp); [policies.md:79](../../product/policies.md#status-at-a-glance); `wt:src/app/(site)/shipping/page.tsx:39-40, 55` |
| Balance by a payment link on WhatsApp and by email; never charged automatically; dispatched once the balance is paid | [policies.md:168, :170](../../product/policies.md#payment-methods); `wt:src/app/(site)/shipping/page.tsx:46-47`; `wt:OrderSummary.tsx:46` (PUBLISHED; F12 keeps the timing for existing orders open) |
| ₹499 is part of the price, not an extra fee | [pricing.md:139](../../product/pricing.md#where-price-text-appears-and-whether-it-follows-the-mode) (`/terms` "That ₹499 is part of the price") |
| Refundable in full before dispatch, no fee, no reason; ask with the order number | [policies.md:74](../../product/policies.md#status-at-a-glance); `wt:src/app/(site)/refund/page.tsx:32`; `wt:OrderSummary.tsx:50-51` |
| Refund starts within 2 working days; bank takes 5-7 working days | [D042:15](../../decisions/D042-policy-display-answers.md); [policies.md:131](../../product/policies.md#founder-answers-of-2026-10-11-d042-d041) |
| No payment fees; nothing recurring; payments by Razorpay; chargeback how-to | [D042:14](../../decisions/D042-policy-display-answers.md); [policies.md:130](../../product/policies.md#founder-answers-of-2026-10-11-d042-d041) |
| Card number, UPI ID and bank details go to Razorpay, not to us; we never see card details | [policies.md:81](../../product/policies.md#status-at-a-glance) (`/privacy` line 36); [keyword-map.md:541](../../research/keyword-map.md) (PM1); `wt:PreorderForm.tsx:277` |
| The button opens Razorpay's payment window | [checkout.md:101](../checkout.md#step-by-step) (step 7); `wt:PreorderForm.tsx:269` |
| Confirmation by email; no WhatsApp confirmation sent by code | [checkout.md:108, :112-114](../checkout.md#step-by-step); [open-questions.md:96](../../open-questions.md) (F12) |
| Messages about the order on WhatsApp | Consent row, `wt:PreorderForm.tsx:236-241` |
| Ages 3 to 7; "made for children aged 3 to 7"; no "nearly 3" | [facts.md:83](../../product/facts.md#age); [age-band-review.md:70](../../product/age-band-review.md) (row 9); [home.md fold 8](home.md#fold-8--questions-parents-ask) |
| Kheelona+ sentence; nothing about after six months | [D027](../../decisions/D027-story-mode-wording.md); [facts.md:179](../../product/facts.md#kheelona); [D041:24](../../decisions/D041-gate-a-round-1.md) |
| First 500 units once, never a counter | [D041:31](../../decisions/D041-gate-a-round-1.md); [pricing.md:58](../../product/pricing.md#live-state) |
| Help: WhatsApp or call +91 91875 46483; hello@kheelona.com | [D032:23](../../decisions/D032-grievance-block-and-call-line.md); [facts.md:223-224](../../product/facts.md#support-channel) |
| Seller block | [policies.md:136-144](../../product/policies.md#seller-details-as-published) |
| Grievance block, wording and store-footer placement | [D032:20-28](../../decisions/D032-grievance-block-and-call-line.md); [messaging.md:255](../../brand/messaging.md#confirmed-candidate-lines) |
| Product alt text | DS `01-writing.md:113`; [home.md:194-196](home.md#fold-1--hero); [facts.md:74](../../product/facts.md#identity) |
| Films: chips, captions, alts, heading, lede; "Families already using Kheelu." banned | [home.md:241-258](home.md#fold-2--see-it-ask); [D040:21-26](../../decisions/D040-films-move-to-new-site.md); [claims.md:197, :298](../../product/claims.md#4-retired-or-banned-wording) |
| Pay button has no `cta` attribute; cta values | `wt:PreorderForm.tsx:255-270`; [tracking-inventory.md:269-283](../tracking-inventory.md#6-posthog-in-the-browser) |
| White text on the Chilli pay button | [D041:19](../../decisions/D041-gate-a-round-1.md) |

## Placeholders

None. Every line on this page has a source. (The chargeback link depends on an anchor on `/refund`; see Notes.)

## Questions for the founder (website only)

1. **Store heading.** (A) "Pre-order Kheelu." (B) "Reserve your Kheelu." / "Pre-order your Kheelu." (C) the live "Reserve
   Kheelu for ₹499.". **Recommend A:** it repeats the button the parent just tapped, works in both modes, and never
   shows ₹499 without its total.
2. **Is a WhatsApp confirmation sent to every buyer?** The live phone hint says "Where we send your confirmation";
   the code sends only the email. (a) Use the new hint, "For messages about your order, including the link to pay
   the balance before dispatch."; (b) keep "Where we send your confirmation" if someone sends one by hand to every
   buyer. **Recommend (a)** unless you confirm (b).
3. **The child-age error message mentions a 2-year-old.** "Just the age is enough, like 3, or 2 and 5 for two
   children." sits in the shared validator (a logic file). (a) Change the words only, to "Just the age is enough,
   like 4, or 3 and 6 for two children." (no change to what is accepted); (b) leave it. **Recommend (a):** it is
   the only place on the store that suggests a child under 3.
4. **Films on the store.** (a) Keep the seven films below the questions, as live, with Home's heading (the live
   heading is banned); (b) drop them so the store is only the form and its answers. **Recommend (a):** live parity,
   real proof at the moment of doubt, and nothing loads until play is pressed.

## Notes for the builder and gaps

- **Anchor dependency:** the footer links to `refund.html#chargeback`. The `/refund` copy (another group) must carry
  the chargeback how-to under that id ([D042](../../decisions/D042-policy-display-answers.md)); if it uses another id,
  change the link.
- **Review annotation style** for the in-app note: use an existing `mk-` review style; if none fits, request a shared
  helper (do not write a new one here).
- **DS gaps:** no checkout-summary or confirmation component ([G-11](../../design-system/gaps.md#g-11)): compose the
  summary from `kh-` card, list and icon parts; no payment or phone icons ([G-12](../../design-system/gaps.md#g-12)).
- **The DS accessibility guide** names "a regulated checkout" as the one place ink on Chilli might be needed
  (`08-accessibility.md:25`); the founder's D041 exception covers the pay button, so it stays white.
- **Outside this group, same checkout:** the receipt email still prints "Due on dispatch", "Ships from 20 October
  2026" and "(messages, not calls)" (`wt:src/lib/email/templates.ts:135-136, 175`); the event page `/e/<tier>` says
  "A screen-free talking friend for ages 3+" ([age-band review](../../product/age-band-review.md) row 10). Both need
  the same treatment in the build.
- Production is untouched until Gate B ([D011](../../decisions/D011-production-held-until-gate-b.md)).
