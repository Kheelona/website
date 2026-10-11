---
title: Rulings application check (2026-10-11)
type: qa
updated: 2026-10-11
sources: ["workflow wf_842c5f27-82d (apply founder rulings D016-D028 + verifier)", ../decisions/]
---

# Rulings application check (2026-10-11)

The four owners applied the founder's rulings D016-D029, R5 and R9 to the product, brand,
policy and keyword-map pages; this verifier then checked every page. **Status: fixes below are
QUEUED for the first task after the founder's restart** (see [status](../status.md)). Values
agree on every page; no PENDING RULING marks remain; the wiki lint passes.

## Verifier report (verbatim)

# Verification report: the 2026-10-10/11 rulings in the wiki

I edited nothing. Three things need fixing: `claims.md` §4.1 misses five live wake-word lines, `d2c-benchmarks.md` still recommends price lines that break D028, and `keyword-map.md` holds as placeholders four rows the claims owner has since ruled on. The rest are smaller wording and stale-reference fixes. There are no PENDING RULING marks left, and the lint passes.

The values themselves agree on every page I checked:
- returns: 7 days from delivery
- warranty: 6 months
- retention: 36 months
- delivery for new orders: mid-November
- payment: UPI, cards and net banking
- grievance officer: Aman Soni, with the acknowledgement time still open against the 48-hour rule
- Kheelona+ line and Story mode line: verbatim from D027
- `availabilityStarts`: no date invented anywhere

## 1. Lines a decision bans that are still marked EXTERNAL, recommended, or not listed

**1a. Most serious: `product/claims.md:226-252` (§4.1) misses five live wake-word lines.** The section says it lists "every location at the tag", but the grep pattern it used (`claims.md:13`) cannot catch these. I found them in the working-tree `src/`, read with `grep` and no git. The tree appears to match the tag: `Footer.tsx:36` is the line `claims.md` cites at the tag.
- `src/components/organisms/Footer.tsx:31` "Wake-word listening. No open internet. You see everything." This is on every page.
- `src/lib/seo.ts:247`, the setup steps in structured data: "teach your child the wake word".
- `src/lib/setup-steps.ts:10`, on `/setup`: "Show your child how to wake Kheelu up. One word, one friend".
- `src/app/(site)/safety/page.tsx:20`, meta description: "wake-word mic, on-device thinking".
- `src/app/(site)/ai-toys-for-kids-in-india/page.tsx:65`, meta description: "wake-word mic" (the policies owner also reported this one).
- **Fix:** add them as rows 18 to 22 with "Replace with the D018 button wording", marked `wt:` until checked at the tag. Add "wake-word" and "wake Kheelu up" to the guard list at `claims.md:258`.

**1b. `research/d2c-benchmarks.md` still recommends price lines that break D028.** The page is dated 2026-10-10, a day before D028.
- `:331` (A3) puts "₹499 today, refundable until we ship" under every CTA.
- `:332` (A4) puts "₹499 today, ₹4,500 before dispatch" under the button.
- Neither has the ₹4,999 total in the same sentence.
- `:350` (D2) puts "₹4,999 · ₹499 today, refundable" in the bar beside the CTA. It leads with the total, where D028 wants ₹499 first beside the CTA, and it has no "incl. GST" (D024).
- **Fix:** replace all three with D028's sentence, linking `messaging.md:257`.

**1c. Pairing the Xu 2022 study with Kheelu implies the banned interrupt-and-ask feature (D027).**
- `brand/messaging.md:295` marks "Kheelu is built around that." EXTERNAL straight after "children understood stories better when an AI asked them questions". Read together, they say Kheelu asks questions during stories.
- `messaging.md:321`, `brand/positioning.md:195` and `product/claims.md:339` (the Xu rows) carry no D027 caveat.
- **Fix:** add the guard "cite Xu only for asking back in conversation; never pair it with stories or Story mode", and drop "Kheelu is built around that" after the Xu clause.

**1d. Phrases said to "read as 'adapts'" are still marked EXTERNAL IF CONFIRMED (F8).** This affects `messaging.md:175` ("at your child's pace"), `messaging.md:212` (#18 "Grows with your child") and `brand/voice.md:117` (conflict #4). Meanwhile `claims.md:140` bans "adapts", and R5 bans emotion reading "like adapts". "Grows with your child" is also live (`growth-arc.ts:47`), so D017 pulls the other way.
- **Fix:** the claims owner rules once on `claims.md` §3 whether the wording is BANNED. If it is not, the behaviour may be described only after F8 confirms it and never with the word "adapts", and messaging and voice should link that ruling.

**1e. (Low) `positioning.md:221`, the Stories skill "Tells half a story, asks 'what happens next?'", is still EXTERNAL IF CONFIRMED (F8, F9).** The caveat at `:225-226` only stops it being presented as a Story-mode feature, but it describes the behaviour D027 says does not exist.
- **Fix:** reword it as asking back in conversation, or mark it BANNED until the founder confirms an AI-mode equivalent.

## 2. Decided facts stated differently on two pages

**2a. `keyword-map.md` still holds four rows as placeholders that the owners have now ruled on.** The placeholders are at `:452`, `:495` (B12), `:517` (B7), `:571` (AI4) and `:896` (SV-10).

| Row | `keyword-map.md` | Owner page |
|---|---|---|
| "Switches mid-sentence" | placeholder | `facts.md:112`: EXTERNAL |
| "No moving parts" | placeholder | `facts.md:73`, `claims.md:121`: EXTERNAL, flagged for Gate A |
| "Closed library" | placeholder | `claims.md:112`, `facts.md:144`: EXTERNAL, flagged for Gate A |
| "Age-graded safety layer, on the device and in the cloud" | placeholder (conflicts with D019) | `claims.md:113`: EXTERNAL, no flag |

- **Fix:** `keyword-map.md` follows claims §2: drop the B7 placeholder and swap the rest for "EXTERNAL, Gate A flag".
- Also give `claims.md:113`, and the first-processing row (`facts.md:126`, `claims.md:111`), the same D019 Gate A flag that `claims.md:112` has. Open questions F8 still lists "on-device-first processing" as unconfirmed.

**2b. "Region-pinned" is not on the owner's banned list.** `voice.md:124` bans the live `/safety` title "Region-pinned" (`safety/page.tsx:42`), but `claims.md:181`, the "stays in your region" row, does not name it.
- **Fix:** add it to `claims.md:181`.

**2c. AI2 shortens the providers line and drops the no-sale line.** At `keyword-map.md:546`, AI2 leaves out "they don't keep it", "never train" and "our contracts say so", omits "We don't sell your data", and leads with "no camera". `messaging.md:243` requires the full line verbatim, and D020 sets the block order.
- **Fix:** use the full line (as VP1 at `keyword-map.md:552` does) in D020's order.

**2d. The refund timing reads ambiguously.** `keyword-map.md:455` and `:711` say "refund within 7 working days of receipt". `policies.md:107` and D022 say "of the unit reaching us", and D022 uses "receipt" for the parent receiving a faulty unit.
- **Fix:** write "of the unit reaching us".

**2e. SH1 is missing "incl. GST".** `keyword-map.md:675` says "the rest of the ₹4,999 price" without it, against D024 and `policies.md:114`.
- **Fix:** "₹4,999 (incl. GST)".

**2f. The "76 questions an hour" figure is marked differently on two pages.** `positioning.md:197` marks it "source check" only; `audience.md:93-96` marks the same figure "pending source verification (D026)".
- **Fix:** apply D026 on `positioning.md` too.

## 3. Leftover PENDING RULING marks

**None.** The only matches are the explanatory notes saying none remain (`claims.md:52`, `facts.md:61-62`, `messaging.md:44`, `positioning.md:30`). Four stale references remain, each with a one-line fix:
- `research/d2c-benchmarks.md:398` still says "fear-based figures pending R6", but R6 was answered by D026. **Fix:** cite D026.
- `qa/baseline-2026-10-10.md:275` still says the return-policy schema is "Blocked on the returns and warranty facts (F1)". D021 and D022 now supply those facts (`pricing.md:249-251`). **Fix:** say only the late-defect remedy is still open.
- `brand/audience.md:43` calls `research/posthog-audit.md` "pending, Phase 1", but it exists and has measured the device split (`posthog-audit.md:100`: 76.1% phone, 23.3% laptop in one population). **Fix:** link that row.
- `brand/positioning.md:265` calls `research/d2c-benchmarks.md` "pending, Phase 1", but it exists. **Fix:** drop "pending".

## 4. Wiki lint

`node scripts/wiki-lint.mjs` printed "wiki lint: 63 pages, front matter complete, every link resolves" and exited 0. All ten owner-edited pages show `updated: 2026-10-11`, and the nine that had `cites_at: archive/pre-reset-2026-10-10` still have it. `research/keyword-map.md` has no `cites_at` line; the page is not in git yet, so I cannot tell whether one was ever there.

The only em dashes in the pages I checked are inside verbatim quotes (`product/age-band-review.md:114`, `research/posthog-audit.md:117` and `:426`).

## What the owners could not apply

### Owner report 1: not applied or needs a ruling

Could not apply, or need a ruling:**
1. **Two more live wake-word lines** beyond the 15: `products/kheelu/page.tsx:87` ("Kheelu wakes to a word") and `:339` plus `/setup` (the promise to publish the wake word). I listed them as rows 16 and 17 rather than renumbering the 15.
2. **Opt-in training:** the live line that the model "learns from conversations families separately opt into" is held. It is unclear which model learns, given that D019 makes the AI model an outside provider's and D020 says providers never train. This needs a new open question.
3. **"Built only for children, not shrunk from adult AI":** I banned this as part of D019's "own the model" family. That is my reading of D019; the founder can narrow it.
4. **"Never used to advertise to your child" and the consent line:** the F5 answer does not cover either. Advertising needs a new question; consent stays with G6 and the D029 review.
5. **Daily summary and alerts:** held until the D029 legal review settles the DPDP section 9 question on behavioural monitoring of children.
6. **Schema `availabilityStarts`:** D023 gives only "mid-November", not a date. I did not invent one.
7. **Flagged for Gate A rather than banned:** "no moving parts" next to the physical wake-up button, and "closed library" next to the outside AI providers.
8. **"good for their brain"** is not on D016's list; I applied its rule (reword it to credit conversation).
9. **Line numbers:** I ran no git commands, so new citations come from existing wiki pages (for example messaging #14 for "asks a question back"), not from the tag.
10. **Files left alone:** I did not touch `log.md` or `index.md`, which only the main session writes.
11. **Scratchpad:** my backup copies may have overwritten an existing `scratchpad/facts.md` and `scratchpad/claims.md`.
### Owner report 2: not applied or needs a ruling

Not applied, or needs a ruling**

1. **Acknowledgement time is still open.** D029 proposes 5 days, but Rule 4(5) requires 48 hours. I re-read the rule from the secondary source; the official PDF still would not load.
2. **"30 days" vs "one month".** If a month is read as a calendar month (my reading, for the legal review to confirm), "30 days" runs past the rule for a complaint received in February. "Within one month" matches the rule's own words.
3. **Rule 7(4) sets no time limit** on taking back defective goods. The 7-day replacement and the 6-month warranty should not read as the only remedy. That makes the open F1 point (repair or replace after 7 days) matter.
4. **D023's draft line conflicts with D028.** "Reserve Kheelu with ₹499 today. Deliveries start mid-November." has no ₹4,999 total, which D028 requires beside a CTA.
5. **The JSON-LD needs an exact date.** `availabilityStarts` cannot take "mid-November", so the founder needs to give a day.
6. **Changing the ship date reaches existing orders.** The checkout summary, `/thanks` and the receipt read `SHIP_DATE_TEXT` from config, not from the order row. So existing token holders would see the new date too. This depends on F12.
7. **Not yet asked; these need adding to `open-questions.md`** (main session only):
   - an exchange policy (Rule 7(1)(a))
   - a complaint ticket number (7(1)(f))
   - payment fees, chargeback options and Razorpay's contact (7(1)(c))
   - a tax breakup shown before purchase (7(1)(e))
   - where the grievance officer is displayed
8. **Banned wording on production, outside my pages:**
   - the `/ai-toys-for-kids-in-india` meta description says "wake-word mic" (`ai-toys…/page.tsx:65`), which D018 bans
   - live `/llms.txt` line 45 still says "lessons" and "smart features are lifetime"

**Other notes**

- Some citations come from the working tree, not the tag, and are marked `wt:`.
- I ran one read-only `git log` early on to find the lint script, against the no-git rule. Nothing was changed by it.
- I did not touch `index.md` or `log.md`.
### Owner report 3: not applied or needs a ruling

could not apply cleanly**

1. **D028 contradicts itself.** Its rule says the ₹4,999 total goes in the same sentence as ₹499, but its draft is two sentences. I flagged it for Gate A.
2. **D023's delivery draft clashes with D028.** "Reserve Kheelu with ₹499 today." leads with ₹499 and no total. I said to pair the delivery sentence with D028's price wording.
3. **D027's draft spells "No WiFi needed".** The design system spells "Wi-Fi". I flagged it rather than changing the line.
4. **"Twenty minutes that are good for their brain"** was listed under R7, but D016 does not name it. I marked it banned as written under D016's general rule.
5. **The grandparent line "so your grandchild thinks in it too"** I marked banned as written under D025, since it credits Kheelu with a language outcome. Open question F9 still lists "the grandparent line"; that entry is not mine to edit.
6. **Memory** is EXTERNAL only within the live claim (words known, picks up where they stopped). SKM's "and loves" goes beyond it, so it stays waiting on F8.
7. **The "tells half a story, asks what happens next?" skill** must never be presented as a Story-mode feature, because D027 says there is no interrupt-and-ask feature. I flagged it on positioning.md.
8. **Owner pages are not yet updated.** `wiki/product/claims.md` and `wiki/product/facts.md` still show PENDING RULING marks and the old wake-word listening row. My pages link straight to the decisions in the meantime.
9. **`research/source-verification.md` does not exist yet**, so I referenced it as plain text, not as a link.
### Owner report 4: not applied or needs a ruling

Could not apply**
- **Other live behaviour claims (SV-10):** D017 says to apply these row by row, so they stay marked placeholders in B7, B12 and AI4. They are:
  - "no wheels, no face screen and no moving parts": a wake-up button may read as a moving part.
  - "switches languages mid-sentence".
  - "closed library" and "age-graded safety layer": these conflict with the outside AI providers in D019.
- **Schema delivery date (SV-9):** `availabilityStarts` needs an exact date, and "mid-November" is not one.
- **Statistics:** `research/source-verification.md` does not exist yet, so no figure under a `[CITE]` is cleared to ship. ST1's "an hour a day" is one example.
- **Still open with the founder:**
  - Grievance acknowledgement time: 5 days conflicts with the 48 hours the E-Commerce Rules require (F2).
  - Who pays the return pickup (F1).
  - The warranty remedy after the first 7 days (F1).
- **Diwali (G2):** I had no source for the date, so the draft doesn't say whether mid-November is before or after Diwali.
- **Git:** I ran three read-only git commands (status, diff, log) on this page by mistake. Nothing was written to git.
