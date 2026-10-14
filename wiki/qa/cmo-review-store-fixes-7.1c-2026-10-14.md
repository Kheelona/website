---
title: "CMO review, round 1: the store copy fixes of task 7.1c (store.md, store-confirmation.md)"
type: qa
updated: 2026-10-14
sources:
  - ../raw/brief/kickoff-brief.md (section 4 non-negotiables; section 6, CMO Reviewer)
  - ../site/pages/store.md, ../site/pages/store-confirmation.md (worktree w8-7.1c, uncommitted; diffed against HEAD fdb7580)
  - ./cmo-review-built-c-2026-10-14.md (m1, m4, m5; "Needs the founder" 2)
  - ../decisions/D015-founder-signs-off-copy.md, D028-price-wording.md, D032-grievance-block-and-call-line.md, D041-gate-a-round-1.md, D046-gate-a-approved.md, D050-whatsapp-chat-button.md, D056-founder-answers-built-page-reviews-2026-10-14.md (item 3)
  - ../brand/voice.md, ../brand/messaging.md (words to stop using), ../product/claims.md (§4), ../site/content-boundary.md, ../site/checkout.md (variants, failure states), ../site/tracking-inventory.md (row 18), ./deviations.md (V4)
  - "Code read in the worktree, 2026-10-14: src/lib/store/tiers.ts:42-47, 64-127, 129-146; src/app/store/e/[event]/page.tsx:53-83; src/app/store/e/[event]/page.test.tsx:101-108; src/content/en-IN/store/event-page.ts:44-115; src/app/api/preorder/create-order/route.ts:54-63; src/features/preorder/components/PreorderForm.tsx:158-159; src/app/store/thanks/page.tsx:87-129, 148-150, 198-209; src/content/en-IN/store/confirmation.ts:59-102; src/app/store/_components/NotFoundPanel.tsx:34-84; src/app/store/_components/TierCheckout.tsx:94-107; src/content/en-IN/seller.ts:86-123; src/content/en-IN/store/store-page.ts:79-84; src/content/en-IN/store/in-app-note.ts:1-17; src/components/ui/InAppBrowserNote/InAppBrowserNote.client.tsx:12"
---

# CMO review, round 1: the store copy fixes of task 7.1c (2026-10-14)

**Verdict: PASS. No blocking issues; 3 minor issues.** All four fixes are applied as asked. No new line names a
price, so every new line is true in token and full mode alike, and [D028](../decisions/D028-price-wording.md) cannot be
broken by them. Each new screen has one obvious next step, a calm tone and no banned wording. Every approved Copy line
is unchanged: the diff against HEAD (`fdb7580`) only adds lines, apart from the front matter and three team-note rows in
store-confirmation.md's "At a glance" and keyword tables. Those rows record the m4 and m5 changes. Both pages end with a "Changes after approval (task 7.1c)" table that matches the diff.

This is a copy review. Nothing is built yet, so there are no screenshots. Only the founder signs off copy
([D015](../decisions/D015-founder-signs-off-copy.md)), and this verdict does not replace that sign-off.

## Verdict per page and criterion

Key: **P** pass · **m** pass, with a minor issue below · n/a.

| Criterion | store.md | store-confirmation.md |
|---|---|---|
| Fix applied as asked | P: m1 (one body per reason); D056 item 3 (the note ships, words unchanged) | P: m4 (secondary WhatsApp button and the call line); m5 (title per state) |
| Honest in token and full mode; no price the page does not show | P (no amount on the refused screen; the header, the payments line, the footer and the bubble text carry none either) | P (titles and the help line carry no amount) |
| One obvious next step per screen | P (one button, "Pre-order at the usual price") | P (one secondary button; the call line comes second, after "Or") |
| Calm, plain, on-voice for parents of 3-7 year olds | P; m3 (founder's call on "not one of ours") | P |
| Every unchanged line is the approved one; nothing changed that the findings did not ask for | P | P |
| No banned wording; no internal leakage (counts, figures, competitors) | P | P |
| Changes recorded and sourced | m1 (the gap note leaves out the case that names ₹499) | m2 (the builder note specifies a link the panel cannot take yet) |

## Each fix, checked

### (1) C m1: the refused event link (store.md, "Event link refused")

- **The reasons match the code.** `tiers.ts:46` has six reasons, and the table covers all six: `cap-reached` and
  `not-yet` share one line. An inactive tier comes back as `unknown` (`tiers.ts:87, 90`), as the page says. So does a
  tier with a zero amount (`tiers.ts:119-121`).
- **Kept word for word from the live text** (`tiers.ts:139-144`): the first sentences of `expired`, `full` and
  `bad-signature`. In the second sentences, only "on this page" becomes "in our store", and the `bad-signature` line
  also swaps "₹499" for "the usual price". Checked letter by letter.
- **`unknown` gets its own first sentence**, "The price on this event link is not available." That is correct. Its link
  passed the signature check (`tiers.ts:78-80` comes first), so the live "This link is not one of ours" would be false.
- **The two mode refusals** no longer say "Kheelu is now ₹7,999", "first 500 units" or "Refresh this page". Those were a
  price the panel does not show, an extra mention of the offer term ([D041](../decisions/D041-gate-a-round-1.md)), and
  advice that cannot help: a refresh brings back the same refusal.
- **True in both modes.**
  - `cap-reached` happens only at `/e/launch` in full mode, where the usual price is ₹7,999.
  - `not-yet` happens only at `/e/full` in token mode, where the usual price is ₹4,999 with ₹499 today.
  - Neither line names a figure, so each is true. "Right now" is honest because the mode can flip back (`tiers.ts:130-132`).
- **Unchanged:** the H1, the button and the WhatsApp line match `event-page.ts:45, 73-75`, and so does the panel's
  closing line asserted in `page.test.tsx:106-107`.
- **No amount anywhere on the screen.** `StoreClose` (`TierCheckout.tsx:100-106`) prints the payments line and the
  bubble, and the bubble's store text is "Hi Kheelona! I need help with my pre-order." (`seller.ts:118`).

### (2) C m4: the /thanks "cannot open" state (store-confirmation.md:231, :237-239)

- **The new button and line:** "[Message us on WhatsApp]" as a secondary button, then "Or [call +91 91875 46483] with
  your order number and a person will find it."
- **Every word is already approved:**
  - The button label is the store's not-switched-on button (`store-page.ts:82`).
  - "call +91 91875 46483" is the seller help line (`seller.ts:95`; [D032](../decisions/D032-grievance-block-and-call-line.md)).
  - The tail is the dead end's live line (`event-page.ts:113`), which this state prints today through
    `NotFoundPanel.tsx:72-79`.
- **The approved body is unchanged** (`confirmation.ts:101`).
- **One next step, and not orange.** There is one button, and it is not orange. That is correct: the reader may already
  have paid, so a button to buy would be the wrong offer (`thanks/page.tsx:114-121`). WhatsApp and call now match the
  link-needed state ("WhatsApp or call", D032).
- **Watch:** like every call link on the site, this line depends on the number really taking calls before Gate B
  ([D032](../decisions/D032-grievance-block-and-call-line.md), still a founder to-do in status). The fix adds no new
  dependency.

### (3) C m5: the /thanks tab title (store-confirmation.md:45-46, :233-235, :259)

- **Which state gets which title:**
  - The paid state keeps "Your Kheelu is reserved · Kheelona" (34 characters).
  - The confirming, link-needed and cannot-open states get "Your Kheelu pre-order · Kheelona" (32 characters).
- **Both counts are correct**, and both titles are under 60 characters.
- **True in every state.** The page says "reserved" only when the order row is paid (`thanks/page.tsx:131, 153`).
  "Pre-order" matches the store's own title, "Pre-order Kheelu · Kheelona".
- **The approved meta description is unchanged.** It is the same in every state.

### (4) D056 item 3: the in-app browser note ships (store.md:139-143)

- **The Copy block is byte-identical** (store.md:125-129; it matches `in-app-note.ts:13-16`).
- **The new bullet** records that the note ships switched on. It cites D056 item 3 and says deviation V4 retires when it
  ships, as [D056](../decisions/D056-founder-answers-built-page-reviews-2026-10-14.md) says.
- **"Only inside the Instagram, Facebook or WhatsApp browser" is still true.** The detection checks for those three
  (`InAppBrowserNote.client.tsx:12`).
- **The B12 bullet above it still says "shipped once QA's sandbox test confirms"**, but the new bullet says plainly that
  it supersedes that condition. Acceptable.

## Minor issues

| # | Page and criterion | What is wrong | Fix (route) |
|---|---|---|---|
| m1 | store.md, "Changes recorded and sourced" (the gap bullet, store.md:443-446) | The bullet names only "the allocation runs out, the date passes". The copywriter's report adds that "the words name no wrong price for these reasons". But if an event tier is switched off, deleted or zeroed between page load and Pay, create-order answers 409 `unknown` (`route.ts:58-62`), and the form prints that message as is (`PreorderForm.tsx:159`). It is the default line, "This link is not one of ours. You can pre-order at ₹499 on this page." (`tiers.ts:144`). That line puts ₹499 beside a button with no total (D028) and is **false in full mode**. "Not one of ours" is false for a signed link, and "on this page" points to the event checkout, not the store. This is a likely case: a tier switched off when an event day ends, while a parent who scanned earlier finishes the form at home. A signing-secret rotation would do the same through `bad-signature`. (For completeness: on `/`, the `not-yet` line "…reserve it for ₹499." also gives ₹499 with no total. That is a D028 shape, but true in that mode.) The copy pages put no such line on screen, so this is not blocking here. But the gap is recorded as smaller than it is | **Copywriter:** extend the bullet: "…create-order answers 409 with `tierRefusalMessage`. For `expired` and `full` that is the live line with '…on this page'. For a tier switched off, removed or zeroed mid-session (`unknown`, and `bad-signature` if the signing secret changes), it is the default line 'This link is not one of ours. You can pre-order at ₹499 on this page.', which names ₹499 with no total and is false in full mode." **Main session (founder):** choose option (c) from the report. It is a presentation map in the form from the 409 `error` code to the store.md bodies, with "in our store" linking to `/`, used only on the event checkout (on `/`, "Refresh this page" is the right advice for the mode refusals). Make (c) a condition before any event tier is next switched on: option (a) holds only while no event tier is active. **Builder** builds (c) (a checkout file: signature regenerated and reviewed, ADR-013); **QA** adds the 409 `unknown` case to the event-page tests |
| m2 | store-confirmation.md, "Changes recorded and sourced" (builder note, :327-334) | The note asks for the call line as the panel's `note`, with its number as a `tel:` link. But `NotFoundPanel`'s `note` is a `string` (`NotFoundPanel.tsx:57`, printed at :73), so it cannot carry a link. Also, the panel renders outside the /thanks `ph-no-capture ph-mask` container: the cannot-open branch returns at `thanks/page.tsx:122-128`, before the container at :150. So the class has to sit on the new button and link (or on a wrapper) for tracking row 18 to hold, as the note says | **Builder:** widen `note` to `ReactNode` (presentation only; the store's not-switched-on state still passes a string). Pass `Or <a href={seller.support.tel}>call +91 91875 46483</a> with your order number and a person will find it.`, the number from `seller.support.phone`, with `ph-no-capture` on the button and the link. **Copywriter:** add one clause to the note: "(`note` takes a link once widened to a React node)". **QA:** check row 18 on the cannot-open state. As built, its muted WhatsApp link sits outside the container and has no `ph-no-capture` (code read only, not observed at runtime) |
| m3 | store.md, "Calm, plain, on-voice" (the `bad-signature` row, store.md:419) | "This link is not one of ours." stays word for word, which is all m1 asked. But a QR link cut short when it is forwarded also fails the signature check. A parent who scanned our own code would then read what sounds like a scam warning (the same worry as review C m6). This is the copywriter's open question 3 | Keep (a) for this round. The main session takes it to the founder together with m6. My lean for that decision is (b): "This link is incomplete, or not one of ours. You can pre-order at the usual price in our store." It is true whether the link was cut short or forged, and calmer. (Main session, founder, then Copywriter) |

## The copywriter's open questions: CMO view

1. **The tab title while a payment is confirming:** I agree with **(a)**, "Your Kheelu pre-order · Kheelona". That
   state's H1 does not say "reserved". It is also the state a parent sees if the payment never lands, since only `paid`
   gets the paid head (`thanks/page.tsx:131, 153`). A tab saying "reserved" there would be the m5 problem again.
2. **The form's 409 gap:** I agree with the direction, but not with "the words name no wrong price". See m1: the
   `unknown` case names ₹499. Option (a) is fine only while no event tier is live; (c) has to come before the next one.
3. **"Not one of ours":** keep (a) now, and decide it with m6. See m3.

## Not in this round

- **C m2 (the age band on `/e/<tier>`).** Task 7.1c gives it to the Builder, with the words from the Copywriter. Neither
  page records the eyebrow words yet; review C's example was `{tier label} · Ages 3 to 7`. If the build composes it from
  the approved "Ages 3 to 7" and the tier's own label, no new copy is needed. If it uses any other words, they need a
  copy line and a CMO check first.
- **C m3 (`/e/<tier>` without keys).** It reuses the store's approved not-switched-on words, so it needs no copy change.

## Considered, no issue

- **"In our store" on the store host.** The parent is already on `store.kheelona.com/e/…`. Still, the sentence reads as
  "our normal pre-order page" and echoes the button label just below it. Clear enough.
- **"With your order number" now follows only the call option.** The WhatsApp button has no tail. The order number is in
  the confirmation email that opened this page, and a person asks for it on WhatsApp. Adding a sentence for this would
  mean new, unapproved words.
- **"The allocation for this event has all gone."** "Allocation" is a little formal, but it is the live sentence, names
  no count, and m1 did not ask to change it.
