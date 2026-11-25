---
title: "D072: the address form takes any house/street and city, and the PIN code must belong to the picked state"
type: decision
updated: 2026-11-25
sources: ["the founder's choice in chat, 2026-11-25 (one-by-one sign-off: checkout code)", "src/features/preorder/lib/validate.ts (validateAddress)", "src/lib/address/pin-state.ts", "src/features/preorder/components/AddressForm.tsx", "src/app/api/preorder/address/route.ts", "test/guards/fixtures/authorised-diffs/src__features__preorder__lib__validate.ts.patch", "test/guards/fixtures/authorised-diffs/src__features__preorder__lib__validate.test.ts.patch", "Department of Posts, All India Pincode Directory (data.gov.in, Open Government Data Licence - India), read 2026-11-25"]
---

# D072: the address form takes any house/street and city, and the PIN code must belong to the picked state

**Context.** The address is asked after the parent has paid (`/thanks`, or the link in the acknowledgement email), so a
form that refuses an answer leaves a paid order with no address. On 25 November 2026 an iPhone test of the test store
showed a house called "10" refused, because the house and street needed five characters (`line1.length < 5`), and the
city needed two. The same form accepted any six-digit PIN code against any state, so a mistyped digit or a wrong state in
the list would only show up when the parcel went to the wrong sorting office.

**Options.** The founder was shown the options on 25 November 2026 and picked one: **open-ended house/street and city, and
the PIN code must match the state**. (The other options shown are in the working notes, not reproduced here.)

**Choice.** `validateAddress` (one function, run in the form and in `POST /api/preorder/address`) changes in three places:

| Field | Before | Now |
|---|---|---|
| House or flat, and street (`line1`) | 5 to 120 characters after trim | 1 to 120 after trim. "10" saves; empty or spaces only keeps "We need the flat or house and the street."; over 120 keeps "Please shorten this a little." |
| City or town (`city`) | 2 to 60 | 1 to 60 after trim. "X" saves; empty keeps "Which city or town?" |
| PIN code (`pincode`) | six digits, never starting with zero | the same format check and message first; then, when the state is valid, the first three digits must belong to the picked state, else the field shows **"This PIN code belongs to a different state. Please check your PIN code and state."** (approved word for word) |

Landmark or area (`line2`), the state list and the PIN format are unchanged. No mismatch line is shown while the state
itself is invalid, and the format message wins over the mismatch.

**The table (`src/lib/address/pin-state.ts`).** The first three digits of a PIN code, listed per state and union territory
from the Department of Posts' All India Pincode Directory (two public copies, read 25 November 2026; the source is named
in the file). It may only ever stop an obvious mismatch, so it is deliberately generous:

- a prefix shared by several states accepts every one of them (Delhi/Uttar Pradesh 110, Chandigarh/Punjab/Haryana 160,
  Kerala/Lakshadweep 682, Puducherry with Tamil Nadu, Kerala or Andhra Pradesh, and so on);
- a prefix no state lists is unknown and is always allowed, and 9xx (the Army Postal Service) is left out on purpose;
- by hand, each one only widening: Andhra Pradesh and Telangana share every prefix from 500 to 535 (one state until 2014),
  Jammu and Kashmir and Ladakh share every prefix from 180 to 199 (one until 2019), and Chandigarh's tricity takes 160,
  134 and 140 as well.

Every one of the 322,043 post offices in the directory passes the table with its own state; one real PIN code per state is
a unit test.

**Why.** A parent who has paid must never be blocked by our own form, and a gap in our list must never block them either.
So the bar for an answer is "something was typed", and the PIN check refuses only what the directory says is another
state. The mismatch line tells the parent what to check (the PIN code and the state) without saying which one is wrong,
because we cannot know.

**Frozen files.** `src/features/preorder/lib/validate.ts` is in the checkout freeze (ADR-013 class 1) and changes only with
its reviewed patch, `test/guards/fixtures/authorised-diffs/src__features__preorder__lib__validate.ts.patch`, which names
this decision. The frozen `validate.test.ts` takes one literal-only patch (its good-PIN assertion uses a Karnataka PIN
now, because its fixture address is in Karnataka). The table is a new file outside the frozen folder
(`src/lib/address/`), because a new file inside `src/features/preorder/lib/` fails the guard. The new assertions live in
new test files: `src/lib/address/pin-state.test.ts`, `test/address-validation-d072.test.ts`,
`test/address-form-pin-state.test.tsx`, `test/address-route-pin-state.test.ts`.

**Approved by** the founder, one by one (checkout code), in chat on 2026-11-25. Spec: K-184 B8.

**Rollback.** Revert the pull request: `validate.ts` and `validate.test.ts` go back to the tag's bytes, the two patches and
`src/lib/address/` go, and saved addresses are unaffected either way (no data, schema or env change).
