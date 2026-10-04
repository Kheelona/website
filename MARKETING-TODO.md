# Marketing TODO: website content

**The content list for kheelona.com: copy, claims and assets the site still needs.** Engineering
items stay in `Technical-Todo.md`; founder decisions stay in `docs/checkpoints/closed-rounds.md`.

Source: the two content docs from the team, `Kheelona-website-content-Final.docx` and
`Kheelona-website-content-mobile-Final.docx` (version 7, received 2026-10-02). They are a later
revision than the mockup the redesign (PR #16) was built from. Each row below was checked against the
branch `redesign-mockup-2026-10` on **2026-10-02**. The working copy with comment threads is the
"Content feedback check: redesign vs Final docs" doc on claude.ai.

> **⚑ UPDATED 2026-10-04, THE CMO MERGE (`docs/checkpoints/cmo-merge-2026-10.md`).** The branch was
> rebuilt on the site's own design system and its existing URLs, so read every "✅ done in PR #16"
> below as "content kept"; the pages that carry it are `/products/kheelu` (not `/kheelu`) and
> `/team` (not `/story`), and `/how` and `/faq` are new. The **Claims to settle** table at the
> bottom is now settled (founder, 2026-10-04). The placeholder guard moved to
> `test/cmo-merge-routes.test.ts`, and banned claims live in `test/claims-gated.test.ts`.
> Also changed from the branch, each recorded in the checkpoint: the Harvard line quotes its source;
> the /how pilot-results promise and "wait five seconds" were not carried; the shut-down answer says
> what needs our servers rather than "we plan to be here for years"; the attachment FAQ lost "see how
> long your child talks"; Home's parent-app card shows the real screenshot, not sample screens with
> an unconfirmed "bedtime stories after 7 pm" control; the finale says "ships from 20 October", not
> "Meet Kheelu on 20 October".

**Rules that shape what ships:**

- The site never shows a bracketed placeholder. A block that needs a fact the team has not supplied
  stays hidden; `test/cmo-merge-routes.test.ts` fails on a bracketed placeholder in `src/`.
- No smart speaker, tablet or robot toy brand is named anywhere, including alt text, ads and keywords.
- Ages render as "3+". The site publishes no age ceiling (founder decision #8), so the docs' "3 to 7"
  is shown as 3+.
- Prices and CTA labels come from `src/config/site.ts`, never typed into a page.

**Legend:** ✅ done in PR #16 · ↩️ tried, then reverted by founder call · ⏳ open, copy only (no fact
needed) · 🧑 open, needs a fact or a decision from the team · ⛔ not doing, by decision.

---

## Status by page

### Home

| Item | Content doc v7 | Status |
| --- | --- | --- |
| Hero | One line, "Kheelu is an AI toy built to help your child's brain grow.", and one button | ↩️ Built (`3591084`), then reverted (`b7fb2f7`): it left the hero half empty and lost the link to the films. The hero keeps the pill, "Screens make children watch. Kheelu makes them think.", lead, Reserve + Watch buttons, price note and four ticks |
| Hero ticks | Move into the comparison table | ✅ In the table; also still in the hero (see above) |
| Trust strip | 4th item "Safety tests: [status]" | 🧑 Needs the test status; "Ships 20 October 2026" stands in |
| Videos | Lead "Filmed at home by families in our pilot." | ✅ |
| Pilot parents | Heading "What pilot parents told us."; card 3 "Less screen time" | ✅ |
| Pilot parents | Lead with families, cities, start month; pilot numbers grid; city and age per parent; written consent | 🧑 Needs the pilot numbers and consents |
| How it works | Intro "Child-development researchers call it 'serve and return'…" | ⏳ |
| How it works | Step 4 "Kheelu adapts" | 🧑 Confirm with the product team; "Kheelu remembers" (published copy) stands in |
| How it works | Age tabs, short copy | 🧑 Confirm the activities; published growth-arc copy stands in |
| How it works | "Why conversation?" ending + "Read the research" | ✅ |
| Comparison (screen 6) | "Thinking of a smart speaker or a tablet instead?", 4 columns, chip switcher on phones | ✅ Rows from `src/lib/comparison.ts` |
| Comparison | Price row and "checked on [date]" | 🧑 Needs checked market ranges and a date |
| Comparison | Every cell checked against current products; Kheelu has no camera; language list | 🧑 Verify |
| Safety | Heading, lead, four cards, "See how safety works" | ✅ |
| Safety | Voice path "Our servers in India" | 🧑 Confirm server location and any third-party AI processing; "Our own servers, in your region" stands in |
| Two more things to know | Heading, two cards, body copy | ✅ |
| Two more things to know | Control "Bedtime stories only after 7 pm" | ✅ |
| Two more things to know | 20-second audio clip per language | 🧑 Needs the clips; chips are not tappable until then |
| Two more things to know | Real parent-app screenshots | 🧑 Sample screens labelled "sample data" stand in |
| Price | Rows "Pay when it ships", "Price after launch", "Kheelona+ (optional)" | ⏳ Copy only |
| Price | "Free for 6 months, then [₹X/month]" | 🧑 Needs the Kheelona+ price |
| Price | "[X] of 500 left" progress bar | 🧑 Needs a decision: the live count is never published (§8.26) |
| Price | "[1-year] warranty" promise | 🧑 Needs the warranty length |
| Price | Note "Secure online payment. Takes about a minute." | ⏳ |
| Team | Kashyap "A decade shipping certified devices."; Ria "Marketing." | ⏳ |
| Team | Advisor card | 🧑 Needs a named advisor with credentials |
| Team | All four founders are parents | 🧑 Confirm |
| FAQ | The docs' six questions | ⏳ for "Is an AI toy safe for a 3-year-old?" and "Will it arrive before Diwali?"; 🧑 for speech understanding, voice training and subscription |
| Final call to action | "Meet Kheelu on 20 October." | ✅ |

### How it helps

| Item | Status |
| --- | --- |
| Headline "How talking helps a young brain grow.", intro, pace line | ✅ |
| Serve, Return, Again; research cards; "What this research does not show"; three tips; Where Kheelu fits | ✅ |
| Age by age, short copy | 🧑 Confirm the activities |
| "Reviewed by [advisor]" | 🧑 Needs the advisor |

### Meet Kheelu

| Item | Status |
| --- | --- |
| Headline "An AI toy that supports your child's brain development." and intro | ✅ |
| Three ways to play: Talk, Stories, Music | ✅ |
| When parents reach for Kheelu | ✅ |
| Comparison table, same as Home | ✅ |
| "What's free, and what's paid": talking, safety controls, log, stories and Bluetooth free for life | 🧑 Policy decision. Today's sanctioned wording (`KHEELONA_PLUS_LINE`) puts the parent app inside Kheelona+ |
| Specs: size, weight, material, battery, charging, wake word | 🧑 Needs every value |
| In the box: Kheelu, charger [cable], quick-start card | 🧑 Needs the cable type |

### Safety

| Item | Status |
| --- | --- |
| Headline "How we keep Kheelu safe.", intro, "The four basics" | ✅ |
| Four basics card copy (wake-word wording, "connects only to our servers", age filter + how it's tested) | ⏳ wording; 🧑 describe the filter tests |
| The hard moments: mumbling, big questions, a toy not a person, independent check | 🧑 Confirm each behaviour, and that the app flags sensitive topics |
| Certificates: BIS, toy lab, battery with dates | 🧑 Needs dates; today's list (toy-safety, COPPA, GDPR-K, DPDP, ISO 27001) stands in |
| Shut-down: "Stories mode and Bluetooth music work without our servers, so Kheelu keeps playing" | 🧑 Confirm the commitment, plus any other (data export, refunds) |
| "What you control" | ✅ |

### Our story

| Item | Status |
| --- | --- |
| Founder story, one true paragraph in first person | 🧑 Needs a founder; the published "why" paragraph stands in |
| Team bios, short form | ⏳ Full approved bios are live today |
| Ria's one-line background | 🧑 |
| Child-development advisor | 🧑 |
| "Two promises" | ⏳ Three are live (the third is the token refund) |
| Talk to us: hours | 🧑 Needs support hours |

### FAQ page

| Item | Status |
| --- | --- |
| "Will my child get too attached?" | ✅ 🧑 Confirm the app shows usage time |
| "Is it always listening?" (wake-word wording); "Does it need WiFi?" | ✅ |
| "Will it arrive before Diwali?"; "Can I buy it from outside India?" | ✅ City estimates 🧑 |
| "What ages is it for?" "works best from [3 to 7]" | ⛔ No age ceiling is published |
| "Does it understand a 3-year-old's speech?" | 🧑 Needs a pilot rate |
| "Can two children share one Kheelu?" | 🧑 |
| "Is my child's voice used to train AI?" | 🧑 Check the AI vendor's terms |
| "What if it breaks?" | 🧑 Warranty and replacement process |
| "Can I give it as a gift?" | 🧑 Gift note and delivery-date options |

### Global and reserve flow

| Item | Status |
| --- | --- |
| Nav, mobile menu, sticky reserve bar, footer brand line | ✅ |
| Footer "Reserve" link | ⏳ |
| Grievance officer | 🧑 Needs a name and email (DPDP) |
| 3-step reserve flow (pincode, queue position, "move up the line" referral) | ⛔ Reserve opens the existing Razorpay store, so payment and tracking stay intact |

---

## Claims to settle

| Claim | Where it still stands | Status |
| --- | --- | --- |
| The mic is "off, not muted" until the wake word (Appendix B retires it) | **Swept everywhere 2026-10-04**: Home, /safety, the Kheelu page's four steps, the buyer's guide, the safe-AI-toy journal article, `llms.txt`, and `lib/product-facts.ts` (so the Product JSON-LD too). `/privacy` untouched (counsel-gated). | ✅ Banned by `test/claims-gated.test.ts` |
| Servers are in India; no third-party AI processes audio outside India | **Founder-confirmed 2026-10-04**: "our own servers, in India" on Home, /safety, /faq, the spec table and `llms.txt` | ✅ |
| Kheelu says it's a toy and never asks for a secret | **Founder-confirmed 2026-10-04**: Home safety card, the attachment FAQ, `llms.txt` | ✅ |
| Talking, safety controls and the log are free for life | **NOT confirmed (2026-10-04)**: the comparison's monthly-fee row is removed; only `KHEELONA_PLUS_LINE` ("smart features are yours for life") ships | ⛔ Banned by `test/claims-gated.test.ts` until confirmed |
| Kheelu has no camera | **Founder-confirmed 2026-10-04**: comparison row "Camera in your home: None" | ✅ |
| Brain claims ("helps your child's brain grow", "supports brain development") | **Research-anchored (founder, 2026-10-04)**: conversation helps a young brain grow, Kheelu gives a child more of it; never Kheelu's own effect | ✅ Banned wording pinned |

## Assets and facts the team owes (Appendix C)

- [ ] Real, consented photo of a child with Kheelu for the hero
- [ ] Wake word
- [ ] Pilot numbers: families, weeks, cities, languages; city and child's age per quoted parent; written consent from every parent in quotes and films
- [ ] Named child-development advisor with credentials
- [ ] Kheelona+ monthly price; free-for-life policy
- [ ] Warranty length and replacement process
- [ ] Specs: size, weight, material, battery hours, charger and cable
- [ ] BIS, toy-safety and battery certification dates; safety-test status for the trust strip
- [ ] First-time-understood rate from the pilot; voice-training answer from the AI vendor's terms
- [ ] Grievance officer, support hours, delivery estimates by city
- [ ] Founder story paragraph; Ria's one-line background
- [ ] 20-second audio clip per language; real parent-app screenshots
- [ ] Gift options; a way for families outside India to register interest
- [ ] Market price ranges for smart speakers, tablets and robot toys, with a "checked on" date
