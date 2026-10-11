---
title: "Store confirmation (store.kheelona.com/thanks): page copy for the Gate A mockup"
type: page-copy
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../checkout.md (steps 9-15, address fields, failure and edge states, what must not change, copy the new checkout carries)
  - ../strategy.md (§2 stage 7, §5 store row), ../tracking-inventory.md (§6 replay deny list, ph-no-capture)
  - ../../product/pricing.md, ../../product/policies.md, ../../product/facts.md (ship date, support channel), ../../product/claims.md
  - ../../open-questions.md (F12), ../gate-a-open-items.md
  - ./store.md (header, footer, help line), ./home.md
  - "decisions D021, D023, D028, D032, D033, D041, D042, D043"
  - "wt: src/app/store/thanks/page.tsx, src/features/preorder/components/AddressForm.tsx, src/features/preorder/lib/{validate,india}.ts, src/lib/store/order-ref.ts, src/lib/email/templates.ts, src/app/(site)/{shipping,refund}/page.tsx (working tree of reset/website-v2, read 2026-10-11; no git access in this step. The line numbers match the tag citations on checkout.md for every range checked: thanks/page.tsx:60-216, AddressForm.tsx:40-163)"
  - design-system/project/01-writing.md, components/StepLoop/README.md (read-only)
---

# Store confirmation (`store.kheelona.com/thanks`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside the
> **Copy** blocks is meant for the site. All copy is a draft for Gate A; the founder signs it off
> ([D015](../../decisions/D015-founder-signs-off-copy.md), [D043](../../decisions/D043-all-pages-as-mockups-before-build.md)).

## How to read this page

- **Restyle only.** The page reads the order row and the signed token; nothing here changes how either works
  ([checkout, what must not change](../checkout.md#what-must-not-change-and-what-the-reset-restyles)).
- **Every amount comes from the order row, never from the store's current mode** (`wt:thanks/page.tsx:143-158`):
  "Paid today" is the amount paid, and the balance is ₹4,999 minus that amount. The mockup shows a token order:
  ₹499 `TOKEN_PRICE`, ₹4,500 `BALANCE_PRICE`, ₹4,999 `LAUNCH_PRICE`. Delivery is `DELIVERY_TEXT`.
- **The mockup shows the paid state** of a token order with no address yet. Full-mode orders and the other
  states are written out below for the build.
- **Order specifics are sample data**, shown as visible placeholders so nobody reads them as real.
- No em dashes. Ages 3 to 7 only. No "friend".

## At a glance

| Item | Draft |
|---|---|
| Page job | Tell a parent who has just paid that it worked, show exactly what they paid and still owe, get the delivery address while they are here, say what happens next, and offer a person. The same page opens weeks later from the email link ([checkout steps 11-15](../checkout.md#step-by-step)) |
| Real URL | `https://store.kheelona.com/thanks` (mockup file `store-confirmation.html`) |
| Indexing | `noindex, nofollow` (store layout, `wt:src/app/store/layout.tsx:28-31`); session replay off for `/thanks` ([tracking inventory §6](../tracking-inventory.md#6-posthog-in-the-browser)) |
| Primary search cluster | **None** (noindex, transactional) |
| Title (34 characters) | Your Kheelu is reserved · Kheelona |
| Meta description (94 characters) | Your Kheelu pre-order: order number, what you paid, what is still due and where to deliver it. |
| H1 | Your Kheelu is reserved. (as live) |
| Page meta for the build script | `"chrome": false`, `"buybar": false`, `"active": ""` |
| Container | The whole page body sits inside one element carrying `class="ph-no-capture ph-mask"`, as live (`wt:thanks/page.tsx:117-119`): the page prints an email address, an order number and a delivery address |
| Orange buttons | One: "Save my address" |
| Header and footer | The store header and footer, word for word as on [store.md](store.md#fold-0--store-header) (fold 0 and fold 7) |

---

## Fold 1 · Confirmed

**Fold job:** say it worked, in the first line, and where the proof was sent.

**Copy (paid state):**

> **Eyebrow:** Pre-order confirmed
>
> **H1:** Your Kheelu is reserved.
>
> We have your ₹499`TOKEN_PRICE`, and your place in the queue is held from the moment you paid. Your confirmation is on its way to <span class="mk-placeholder">[PLACEHOLDER: the email given at checkout]</span>.

- Eyebrow, H1 and lede are live, word for word (`wt:thanks/page.tsx:120-133`); the amount is the order row's
  `amount_paise`. Full-mode orders read "We have your ₹7,999…" from the same row.
- The DS confirmation rule, "say what happened" (`01-writing.md:106`): the eyebrow and H1 do exactly that.
- **Image:** none needed. If the designer adds the Kheelu cut-out beside the H1 on laptops, it is decorative
  (`alt=""`): the H1 already names Kheelu.

---

## Fold 2 · Your order

**Fold job:** the four facts a parent screenshots: order number, paid, still due, delivery.

**Copy, token order:**

> **H2:** Your order
>
> | | |
> |---|---|
> | Order number | <span class="mk-placeholder">[PLACEHOLDER: order number, KH-XXXX-XXXX]</span> |
> | Paid today | ₹499`TOKEN_PRICE` |
> | Due before delivery | ₹4,500`BALANCE_PRICE`, of the ₹4,999`LAUNCH_PRICE` price (incl. GST) |
> | Delivery | Deliveries start mid-November`DELIVERY_TEXT` |

**Full-mode order:** "Paid today" ₹7,999`FULL_PRICE`; "Due before delivery" reads "Nothing. You have paid in full."
(live wording, `wt:thanks/page.tsx:149-150`).

- Live rows: "Order number", "Paid today", "Due on dispatch", "Ships from" (`wt:thanks/page.tsx:146-160`). Two
  label changes, both copy: "Due on dispatch" becomes "Due before delivery", the founder's
  [D028](../../decisions/D028-price-wording.md) wording, so it matches the price sentence the parent read on the store;
  "Ships from 20 October 2026" becomes "Delivery: Deliveries start mid-November", the one delivery value for new
  orders ([D023](../../decisions/D023-new-order-delivery.md)). What this means for orders placed earlier is question 1.
- The balance is derived from the row, never typed: a ₹99 event token reads ₹4,900 (`wt:thanks/page.tsx:152-157`).
- The order number format is `KH-` plus two groups of four characters (`wt:src/lib/store/order-ref.ts:17-26`); the
  placeholder shows the shape only.
- The H2 is new (the live list has no heading); it gives the section a real `aria-labelledby` target. A DS `dl`
  card, label left and value right, wrapping on phones.

---

## Fold 3 · Where should it go? (the address step)

**Fold job:** collect the delivery address now, while making clear nothing depends on doing it this minute.

**Copy (no address yet):**

> **H2:** Where should it go?
>
> One last thing, and it takes under a minute. If you would rather do it later, the link in your email brings you straight back here.
>
> **Flat or house, and street**
>
> **Landmark or area (optional)**
>
> **PIN code**
>
> **City or town**
>
> **State** *(a list of the 36 states and union territories; first option "Choose your state")*
>
> **[Save my address]**
>
> Your order is already safe. This can wait if you are in the middle of something, and the link in your email brings you straight back here.

**Copy (address saved; reference state):**

> **H2:** Your delivery address
>
> This is where your Kheelu will go. Change it any time before dispatch.
>
> **We have your address.**
> That is everything we need. You can change it any time before dispatch: [message us on WhatsApp] and we will update it.
>
> [Change it here instead]

- Heading, body, field labels, button, saved state and the reassurance line are live
  (`wt:thanks/page.tsx:162-169`; `wt:AddressForm.tsx:89-114, 117-163, 184-190`). Two presentation additions:
  "(optional)" on the only optional field, and a "Choose your state" first option in the select.
- **What stays exactly as live** ([checkout, address fields](../checkout.md#address-fields-thanks)):

| Label | `name` | Input | `autocomplete` | Required |
|---|---|---|---|---|
| Flat or house, and street | `line1` | text, max 120 | `address-line1` | yes |
| Landmark or area | `line2` | text, max 120 | `address-line2` | no |
| PIN code | `pincode` | text, `inputMode=numeric`, max 6 | `postal-code` | yes |
| City or town | `city` | text, max 60 | `address-level2` | yes |
| State | `state` | select of 36 states and UTs | none | yes |

- Busy state, as live: "Saving…". Error messages, as live (`wt:validate.ts:94-118`): "We need the flat or house and
  the street." · "Please shorten this a little." · "Which city or town?" · "Pick your state from the list." · "A PIN
  code is six digits, and never starts with a zero." Network failure: "We could not reach our server. Your order is
  safe. Try again, or send us the address on WhatsApp." (`wt:AddressForm.tsx:82-85`).
- "Safe" here describes the order, not the toy, so it is outside the "safe as a product claim" ban
  ([messaging, words to stop using](../../brand/messaging.md#words-to-stop-using)). Kept as live.

---

## Fold 4 · What happens next

**Fold job:** remove the "now what?" after paying: three real steps, in order.

**Copy, token order (DS `StepLoop`):**

> **H2:** What happens next
>
> **1 · Check your email**
> Your confirmation has your order number and a link back to this page.
>
> **2 · Pay the balance**
> When your Kheelu is ready to leave us, we send a payment link for the ₹4,500`BALANCE_PRICE` balance on WhatsApp and by email.
>
> **3 · Track your delivery**
> When it is dispatched, we send you the courier and tracking details.

**Full-mode order, step 2:**

> **2 · Nothing more to pay**
> You have paid in full, so there is no balance link to wait for.

- StepLoop rules: three steps, titles of two to four words, one-sentence bodies, steps that really happen in
  order (`components/StepLoop/README.md:10-11`). The DS example order "reserve → we ship → pay ₹4,500" is wrong for
  Kheelu: a reserved Kheelu is dispatched only once the balance is paid
  (`wt:src/app/(site)/shipping/page.tsx:47`), so step 2 comes before step 3.
- Step 1: the acknowledgement email carries the order number and, when no address is on file, a link to this page
  (`wt:src/lib/email/templates.ts:118-123, 133`; [checkout steps 14-15](../checkout.md#step-by-step)).
- Step 2: the balance link on WhatsApp and by email is PUBLISHED wording (shipping page, receipt email); its timing
  for orders placed before 10 October is part of F12, so the step says only "when your Kheelu is ready to leave us".
- No "Nothing is charged automatically" in the step (one sentence per step); it is in fold 5.

---

## Fold 5 · Help, and changing your mind

**Fold job:** a person to reach, quoting the order, and the undo in plain words.

**Copy:**

> **H2:** Need anything?
>
> [WhatsApp] or [call +91 91875 46483], quoting your order number, or email [hello@kheelona.com].
>
> Changed your mind? Until we dispatch your Kheelu, message us with your order number and we refund everything you paid, with no fee and no reason needed. After delivery, you can still return it within 7 days, no questions asked. Nothing is ever charged automatically.
>
> [Refunds and returns] → `refund.html`

- Replaces the live "Anything at all, message us on WhatsApp at +91 91875 46483, quoting KH-…"
  (`wt:thanks/page.tsx:173-182`) with the call option ([D032](../../decisions/D032-grievance-block-and-call-line.md))
  and the email address. "Quoting your order number" keeps the placeholder out of a second place.
- The "Changed your mind?" paragraph is the receipt email's own promise (`wt:src/lib/email/templates.ts:148`), with
  D021's return window added: the peak-end moment of the purchase ends on the risk reversal.
- No orange button here; "Refunds and returns" is a text link, same tab (the parent has finished paying).

---

## Other states (as live; reference only, not in the mockup)

Each renders its own single H1 in place of folds 1 to 5; header and footer stay.

| State | Eyebrow | H1 | Body | Source |
|---|---|---|---|---|
| Paid, confirmation not yet in | Confirming your payment | Thank you. We are confirming it now. | Your payment is with our provider and we are waiting for their confirmation, which usually takes a few seconds. Nothing is lost if you refresh, and your order number is below either way. *(fold 2 and the address step still show)* | `wt:thanks/page.tsx:120-141` |
| Bare `/thanks`, expired or lost link | Your pre-order is safe | We need your link again. | This page opens from the link in your confirmation email, and that link has either expired or was opened somewhere else. Open the most recent email from us and tap it again, and you will land back here. Cannot find the email? [WhatsApp] or [call +91 91875 46483] and a person will pull up your order and add your address for you. | `wt:thanks/page.tsx:190-216`; call option per [D032](../../decisions/D032-grievance-block-and-call-line.md) |
| Signed link, order will not load | (none) | We cannot open that order right now. | Your link is fine. The order behind it did not load, which is ours to sort out and not yours. | `wt:thanks/page.tsx:89-97` |

## Phone order

Header → fold 1 → fold 2 → fold 3 → fold 4 → fold 5 → footer, one column at every width (live max width 680 px,
`wt:thanks/page.tsx:118`). Fold 2 sits above the address step so the order number is on the first screen.

## Tracking

| Element | `cta` value | Note |
|---|---|---|
| Save my address | none, as live | Fires `preorder_address_saved` from the form's code, unchanged (`wt:AddressForm.tsx:79`; [checkout step 12](../checkout.md#step-by-step)) |
| Links | none | Autocapture is suppressed inside the `ph-no-capture` container |
| Page | none | No Meta `Purchase` fires on this page; it fires from the store form's success handler (`wt:thanks/page.tsx:40-51`). Nothing here may add one |

## Keyword placements and entity facts

| Rule | Met | Where |
|---|---|---|
| Primary cluster placements | Not applicable | Noindex |
| Title ≤ 60, meta ≤ 155 | Yes | 34; 94 |
| One H1 | Yes | "Your Kheelu is reserved." (each other state has its own single H1) |
| Prices say "incl. GST" | Yes | Fold 2 balance row |
| Banned words (friend, lessons, adapts, wake word, product "safe", competitor names) | None present | Whole page ("safe" appears only about the order, as live) |

---

## Sources

Plain `path:line` = wiki file; `wt:` = working tree of `reset/website-v2` (see front matter).

| Claim or copy | Source |
|---|---|
| Paid-state eyebrow, H1, lede; confirming state; link-needed and cannot-open states | `wt:thanks/page.tsx:89-97, 120-141, 190-216`; [checkout.md:105, :153-155](../checkout.md#step-by-step) |
| Rows derive from the order row, never the mode; balance = ₹4,999 minus paid | `wt:thanks/page.tsx:143-158`; [pricing.md:117-120](../../product/pricing.md#what-the-client-may-and-may-not-send) |
| "Nothing. You have paid in full" | `wt:thanks/page.tsx:149-150` |
| "before delivery" wording | [D028:14-15](../../decisions/D028-price-wording.md); [D041:18](../../decisions/D041-gate-a-round-1.md) |
| Deliveries start mid-November (new orders) | [D023](../../decisions/D023-new-order-delivery.md); [facts.md:189](../../product/facts.md#ship-date) |
| Order number format | `wt:src/lib/store/order-ref.ts:17-26` |
| Address heading, body, fields, button, saved state, reassurance, errors | `wt:thanks/page.tsx:162-169`; `wt:AddressForm.tsx:82-85, 89-114, 117-163, 184-190`; `wt:validate.ts:94-118`; [checkout.md:130-140](../checkout.md#address-fields-thanks) |
| Address changeable any time before dispatch | `wt:AddressForm.tsx:96`; `wt:src/app/(site)/shipping/page.tsx:61` |
| Confirmation email carries the order number and a link back to this page | `wt:src/lib/email/templates.ts:118-123, 133, 180`; [checkout.md:108-109](../checkout.md#step-by-step) |
| Balance link on WhatsApp and by email when ready to leave; dispatched once paid; nothing charged automatically | `wt:src/app/(site)/shipping/page.tsx:46-47`; `wt:src/lib/email/templates.ts:145`; [policies.md:168, :170](../../product/policies.md#payment-methods) (F12 keeps timing for earlier orders open) |
| Courier and tracking details on dispatch | `wt:src/app/(site)/shipping/page.tsx:55`; [policies.md:79](../../product/policies.md#status-at-a-glance) |
| Refund in full before dispatch, no fee, no reason, ask with the order number | `wt:src/lib/email/templates.ts:148`; [policies.md:74](../../product/policies.md#status-at-a-glance) |
| Return within 7 days of delivery, no questions asked | [D021:11-21](../../decisions/D021-returns-policy.md) |
| WhatsApp or call +91 91875 46483; hello@kheelona.com | [D032:23](../../decisions/D032-grievance-block-and-call-line.md); [facts.md:223-224](../../product/facts.md#support-channel) |
| `ph-no-capture ph-mask` on the container; `/thanks` in the replay deny list | `wt:thanks/page.tsx:117-119`; [tracking-inventory.md:264-268](../tracking-inventory.md#6-posthog-in-the-browser); [checkout.md:256](../checkout.md#what-must-not-change-and-what-the-reset-restyles) |
| No Purchase event on this page | `wt:thanks/page.tsx:40-51` |
| StepLoop rules | DS `components/StepLoop/README.md:10-12` |
| Header and footer | [store.md, folds 0 and 7](store.md) and their sources |

## Placeholders

| Where | Placeholder | Needed |
|---|---|---|
| Fold 1 lede | `[PLACEHOLDER: the email given at checkout]` | Sample data: the real page prints the order row's email |
| Fold 2, Order number | `[PLACEHOLDER: order number, KH-XXXX-XXXX]` | Sample data: the real page prints the order row's reference |

No factual claim on this page lacks a source.

## Questions for the founder (website only)

1. **The delivery line for people who reserved before 10 October.** This page prints one delivery value for every
   order (it reads config, not the order: [checkout](../checkout.md#copy-the-new-checkout-carries)), so once the new
   site is live, a parent who was told "Ships from 20 October 2026" will read "Deliveries start mid-November" here and
   in later emails. (a) That is right: earlier reservations also deliver from mid-November, so one value for everyone;
   (b) earlier reservations still ship from 20 October, in which case the row needs a per-order date, which is a
   logic change for your approval. **Recommend (a)** if it is true (it is the only option without touching checkout
   logic); this is the website half of F12.

## Notes for the builder and gaps

- **DS gap:** no confirmation-page or receipt pattern ([G-11](../../design-system/gaps.md#g-11)); compose from
  `SectionHeading`, a `kh-` card with a `dl`, `TextField`, `Select`, `Button`, `StepLoop`.
- **Same checkout, outside this group:** the receipt email still says "Due on dispatch", "Ships from" and
  "(messages, not calls)" (`wt:src/lib/email/templates.ts:135-136, 160-162, 175`). Its facts and branching are logic;
  its labels are copy for the build, to match this page and [D032](../../decisions/D032-grievance-block-and-call-line.md).
- Production is untouched until Gate B ([D011](../../decisions/D011-production-held-until-gate-b.md)).
