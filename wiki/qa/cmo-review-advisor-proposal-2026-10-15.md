---
title: "CMO review: the advisor's homepage proposal (AP-01 to AP-37), what we take and what we don't"
type: qa
updated: 2026-10-15
sources:
  - ../raw/brief/kickoff-brief.md (section 4 non-negotiables; section 6 CMO Reviewer)
  - ../raw/feedback/advisor-homepage-2026-10-12/recommendations.md (the AP-01 to AP-37 IDs)
  - ../raw/feedback/advisor-homepage-2026-10-12/content-docx.txt (sections 1-22, "Other screens", "Open items")
  - ../raw/feedback/advisor-homepage-2026-10-12/home-laptop.png, home-phone.png, ad-phone.png, reserve-laptop.png (+ .txt)
  - ../brand/positioning.md, ../brand/voice.md, ../brand/messaging.md, ../site/strategy.md ("In one screen", items 3-6, 8)
  - ../product/claims.md, ../product/facts.md (Languages), ../product/legal-requirements.md (PRICE-01, LM-02, DARK-01, DARK-03, ECOM-16)
  - ../decisions/D009, D015, D016, D017, D018, D021, D023, D024, D026, D027, D028, D034, D035, D036, D038, D040, D041 (G1, G4, G8), D044, D045, D046, D049, D050, D054 (item 20), D057 (item 2), D058 (items 1-3, 5-8)
  - ../engineering/adr/ADR-013-checkout-restyle-boundary.md; ../engineering/tasks.md ("Campaigns"); src/content/en-IN/campaigns/index.ts (empty registry)
  - ../research/posthog-audit.md (section 8, issues 1, 5, 6; section 11); ../research/d2c-benchmarks.md (A1, A5, X5, X14); ../research/keyword-map.md; ../research/source-verification.md (C01, C06, C09, C10, C13)
  - "Six specialist reviews of the proposal (copy, claims, SEO, data, market, tech), relayed by the main session, 2026-10-15. The data review's figures are one-off HogQL queries R1-R20 over 2026-09-19 to 2026-10-14 (kheelona.com and store.kheelona.com, human sessions), not yet saved under raw/posthog/"
  - "src/content/en-IN/pages/home.ts, products/kheelu/page.ts, offer.ts, faqs.ts (read 2026-10-15)"
  - "Screenshots, Playwright 1.63.0 Chromium, 1x, media and analytics requests blocked, betawebsite.kheelona.com, 2026-10-15: ../raw/qa/2026-10-15/cmo/advisor-review-*.png"
---

# CMO review: the advisor's homepage proposal

> Review only. Nothing here changes the site. Every change to an approved page is a deviation row the founder
> signs ([D015](../decisions/D015-founder-signs-off-copy.md), [D046](../decisions/D046-gate-a-approved.md)); the CMO's
> verdicts never replace the founder's. "The advisor" is the senior marketing person the founder asked for homepage
> content (12 October 2026).

## Verdict

**Take four ideas, not the page. 0 adopted as written · 7 adapted · 3 for the founder · 12 already on our site · 15 rejected.**

1. **The advisor worked from facts that are no longer true.** The page ships "Ships 20 Oct" (new orders deliver
   from mid-November, [D023](../decisions/D023-new-order-delivery.md)), cash on delivery (none,
   [D024](../decisions/D024-payment-methods-gst.md); checkout frozen, ADR-013), 15-day returns (7 days,
   [D021](../decisions/D021-returns-policy.md)), "Ages 3+" (3 to 7, D009), Marathi and Punjabi (our eight are English,
   Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French, [facts](../product/facts.md#languages)), and five
   parent-app features the live team withdrew on 12 October ([D058](../decisions/D058-follow-the-live-code-check-2026-10-14.md)).
   It also leads with the line the founder banned ("The AI toy that helps your child's brain grow", D016) and
   uses three drafted testimonials on real, named pilot parents (claims §5). None of that can ship, and the CI
   guard already blocks the worst of it.
2. **The structure is the old Home, which we already measured.** The advisor's headings repeat the old site's
   ("Watch a child meet Kheelu.", "The first families are already talking.", "Raising curious kids"). Over 26 days
   the old Home's lower two-thirds reached under 17% of organic phone views and about 1% of paid ones, and no
   buyer's view reached the comparison, the quotes, the FAQ or the closing price (data review, R9-R11). Our Home is
   10 folds and 15,626 px at 390 px; the advisor's is 22 sections. Our Home also already sends 56.0 KB of its
   60 KB HTML budget (tech review). We do not lengthen Home.
3. **The advisor is right about the one thing that matters most for paid phone traffic: show the parent Kheelu,
   and the ad's promise, on the first screen.** Neither our Home nor our product page shows Kheelu on a 360 × 590
   phone screen (screenshots below). Paid phone visitors: 410 sessions, 0 orders, 90.1% of their Home views never
   scroll (data review R3, R8; [audit §8 #1](../research/posthog-audit.md)). The fix is a phone ad page built from
   our approved blocks (AP-34, AP-09, AP-10), which needs the founder because D041 said "no new pages in v1".
4. **Three smaller ideas are worth taking in our words:** the later price as a true anchor beside the price
   (AP-28, founder), the "Recognised by" strip on Home (AP-11), and the ask-back loop told as four plain steps,
   with one written example of what asking back sounds like, on the product page (AP-14, AP-15). Two wording
   touches go last (AP-23, AP-30).
5. **Not taken, on purpose:** the colours (the DS is read-only), the brain hero, ₹499 on the button, the offer
   bar, the anchor menu, the looping video, the stats tiles, the feelings, day and age tiles, the counsellor video,
   the testimonials, "coming soon", cash on delivery and the new form fields.

**Before the advisor does more work,** the main session should send them our fact pack: pricing, policies, the
languages row, D016, D021, D023, D024, D041 and D058. Almost every rejection below traces to a stale fact, not to
a bad idea.

## First screens compared (phone first)

Screenshots in [../raw/qa/2026-10-15/cmo/](../raw/qa/2026-10-15/cmo/) (local, not committed, D039), file prefix
`advisor-review-`. 412 px and 1366 px were not captured for this review; the built-page reviews
([A](cmo-review-built-a-2026-10-14.md), [B](cmo-review-built-b-2026-10-14.md), [C](cmo-review-built-c-2026-10-14.md))
covered them.

| Criterion | Our beta | The advisor's design | Screenshot |
|---|---|---|---|
| Says the positioning, to parents of 3-7 year olds | **Pass.** "Ages 3 to 7"; D045 headline; the lead credits asking back | **Fail.** "Ages 3+"; the D016-banned promise as the H1 | `beta-home-360x590-00`, `advisor-ad-phone-360x590-00` |
| One obvious next step | **Pass.** One chilli button, "Pre-order Kheelu", price sentence beside it | **Pass** in shape (one button), **fail** in words: "Pre-order for ₹499" with no total (D028, DARK-03) | same |
| Five-second test on a phone: what it is | **Pass.** "A screen-free plush toy by Kheelona…" | Unclear: a banned promise, then "stories, rhymes and answers" | same |
| Five-second test: what it looks like | **Fail.** No picture of Kheelu inside 360 × 590 on Home or the product page; at 390 × 844 only the top edge of the art board shows (it starts at about 765 px) | **Pass in intent:** the film card holds the first screen (empty in the render) | `beta-home-390x844-00`, `beta-product-360x590-00`, `beta-product-390x844-00` |
| Buy in a few taps | **Pass.** One tap to the store; refundable advance, total, delivery and returns beside the button | **Fail.** A cash-on-delivery path the store does not have; wrong returns and date | `beta-home-360x590-00` |
| Motion | **Pass.** Still hero, nothing loops (D049) | **Fail.** A silent looping hero video: against D049, WCAG 2.2.2 needs a pause control, and megabytes on load inside WhatsApp's in-app browser (34-36% of phone sessions) | n/a |
| Speed | **Pass.** Lighthouse mobile 92-98 on every page ([status](../status.md)) | **Fail by construction:** 22 sections and an autoplay video do not fit Home's HTML or LCP budget (tech review) | n/a |
| Ad-landing readiness | **Fail.** Ads land on Home, where Kheelu is not in view and paid visitors do not scroll; the campaign registry is empty | **Right idea** (a phone ad screen), **wrong content** (banned H1, 15-day returns, COD) | `beta-home-360x590-00`, `advisor-ad-phone-360x590-00` |
| Laptop, 1440 px | **Pass.** Kheelu, the headline, the button, the price sentence, delivery and returns, all inside 900 px | Comparable layout; wrong facts in the bar, badge and price line | `beta-home-1440x900-00`, `advisor-home-1440-00` |

Also seen, not ours to fix in code: on beta phone pages the Vercel preview feedback button
(`vercel.live/_next-live/feedback/feedback.js`) floats at the right edge and covers the end of the price sentence
at 390 px (`beta-home-390x844-00`). Production does not load it. It is a Vercel project setting, so it is the
founder's (Vercel is the founder's); worth turning off for public beta testing.

## What the advisor gets right that we lack

1. **Kheelu on the first phone screen.** A toy page whose first screen has no toy fails the five-second test for
   the visitors who never scroll. Our laptop hero passes; our phone hero does not. (AP-09, AP-10)
2. **A first screen built for the ad visitor.** Message match with the Instagram ad and a single action. We built
   the route (`/lp/[slug]`) and left it empty. (AP-34)
3. **Product facts at a glance by the button:** no screen, the languages, and that the parent reads every
   conversation. Our first screen sells the mechanism but not the parent's control, which is what calms the AI
   fear. (AP-10)
4. **The later price as context.** We show "₹7,999 once they are gone" only in the price FAQ, which few phone
   visitors reach (old Home's FAQ: 11% of organic phone views, R9). The true anchor is unused. (AP-28)
5. **Institutional authority on Home.** With no reviews yet, "Recognised by" is the authority we have; today it
   is only on /team. (AP-11)
6. **The loop as four plain steps, with the button first.** "Press and ask" answers "is it always listening?"
   before a parent asks. Ours is spread across the hero, the films and the safety fold. (AP-14)
7. **A share action for the family.** Fathers and grandparents influence the purchase
   ([audience](../brand/audience.md)); the new site has no share link. (AP-28)
8. **The parent's own words** for two fears: "What if my child doesn't like it?" and "They're just playing."
   (AP-30, AP-23)

## Decision table

Priority: P1 moves pre-orders and fits before Gate B; P2 after the P1s; P3 later; "-" for ALREADY and REJECT.
"Copy" is for the Copywriter to finalise and the founder to sign; every amount renders from `{price:…}` tokens and
the date from `{delivery}`, never typed.

| ID | Decision | P | Why | Copy and where |
|---|---|---|---|---|
| AP-01 | REJECT | - | Sky-blue and navy are not DS tokens; design-system/ is read-only and the only source of visual decisions (brief §4). Baloo 2 headings, the Hand accent and chilli buttons are already ours | — |
| AP-02 | REJECT | - | Kheelu as the subject of brain growth is banned (D016; guard `helps-child-brain-grow`); "AI toy" as the headline noun breaks voice rule 1; the founder chose our H1 (D045). Fold 3 already carries the allowed form, "Conversation helps a young brain grow." with its Harvard source | — |
| AP-03 | ALREADY | - | "It asks. They think." is the hero sticker (D038, D045); fold 2 reads "Kheelu asks. Watch them think." | Home hero, fold 2 |
| AP-04 | REJECT | - | Gives a parent nothing to decide on; "becomes learning" reads as a learning outcome (legal L7); competes with the tagline. Our footer line is specific and checkable | — |
| AP-05 | REJECT | - | "Pre-order Kheelu" everywhere (D041 G1); ₹499 alone beside or inside a button breaks D028 and DARK-03 and is how an AI answer came to say "priced at ₹499"; the label is a registered tracking value. The WhatsApp secondary exists: the help line under every button and the bubble (D050). Persistent buttons produced all 3 buyers (R17) | — |
| AP-06 | REJECT | - | The band is 3 to 7 (D009); "3+" has no ceiling and, next to "AI toy", invites toddler use | — |
| AP-07 | REJECT | - | Three of four facts are wrong (20 Oct, COD, 15 days); on phones a strip costs the first screen D045 measured to 584 of 590 px; the true facts already sit under every button | — |
| AP-08 | REJECT | - | Anchors would drop the links visitors use (Team and Meet Kheelu are the most-tapped menu items, R15), the product page that sends 3x more visitors to the store (strategy item 4), and the internal links search needs. The sticky button exists (phone bar, laptop nav) | — |
| AP-09 | ADAPT | P1 | Put a film where the ad visitor looks first, without a looping video: a still poster of the ad's own film with Kheelu in frame, which plays inline only when tapped. Films are what buyers engage with (2 of 3 buyers played one, R5); only 4 of 410 paid phone sessions ever reached one | `/lp` first screen. Poster label: "Real children, real families. Tap to watch." Play label as D040: "Play: {chip}. {caption}". No video bytes before the tap; nothing loops (D049). Not "Real pilot homes" (D057 item 2). Home's still hero stays (D045, D049) |
| AP-10 | ADAPT | P1 | The facts row and the age-plus-screen-free badge help the five-second test; the "Watch" action becomes the poster itself. The ₹499 button, the strike-through and "3+" are out | `/lp` first screen. Eyebrow: "Ages 3 to 7 · Screen-free". Facts row: "No screen · Up to {languageCeiling} languages · You read every conversation" (count from product.ts; D017 for "read"). Home hero unchanged |
| AP-11 | ADAPT | P2 | Authority for a brand with no reviews; reuse the built, names-only strip (D054 item 20, B26), placed after the films so it never pushes the button or the proof down | Home, between fold 2 and fold 3; `/lp`, below the films. "Recognised by." with the /team strip as built (NVIDIA Inception Program, Karnataka Elevate, nasscom startups, Founders Inc as text). Never "Backed by" |
| AP-12 | REJECT | - | "85% of the brain" misstates NEP (C01), "2×" is banned (C06), "76 an hour" could not be verified (C13); a "Why now" stakes fold sells through fear (voice rule 4) and would push the films down. The NEP line in its verified words belongs in the early-years guide, not on Home | — |
| AP-13 | ALREADY | - | Fold 2 shows the same seven consented films with the founder's corrected captions (D040); the advisor revives film 6's retired caption and "Real homes" | Home fold 2; product page |
| AP-14 | ADAPT | P2 | Four plain steps make the loop clear in one glance and put the button first, which answers "always listening?". Their lines overclaim ("any question", "any story", "in your language", "tomorrow builds on today") | Product page, inside fold 4 "How it works", above the modes; `/lp` below the films if the page is approved. Heading: "What happens when your child {hand:presses it.}" 1 "Press and ask." Your child presses the wake-up button and asks. A light shows Kheelu is listening. 2 "Kheelu answers." It answers the question first. 3 "Then it asks one back." A question back, so your child does the thinking. 4 "Next time, it remembers." It remembers earlier conversations, so it can pick up where your child stopped. (D018, D017, D036 #2, faqs.ts) |
| AP-15 | ADAPT | P2 | The four-skills tabs are banned outcomes, story questions D027 says do not exist, and games (D044). The idea worth keeping: let a parent who will not press play read what asking back sounds like | Product page, near the films or in fold 4: home.md fold 2 variant b verbatim. "What {hand:asking back} sounds like." / *Illustrative example, not a recording.* / Your child: "Why does the moon follow our car?" / Kheelu: "The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else looks like it follows you?" / Your child: "My shadow?" / It answers first, then asks a question back. That's how your child ends up doing the thinking. The label is never removed |
| AP-16 | ALREADY | - | Fold 4 shows the eight languages in their scripts and "mid-sentence"; the advisor's list (Marathi, Punjabi) and "mid-story" are wrong | Home fold 4 |
| AP-17 | ALREADY | - | Screen-free is in the hero lead, fold 4 and the comparison's first row | Home |
| AP-18 | ALREADY | - | Fold 4 shows the three modes with what each needs. Not taking "play your own music": Bluetooth audio carries an open code-check risk (reconciliation, "the S3 cannot do Bluetooth audio"), so we do not amplify it | Home fold 4 |
| AP-19 | REJECT | - | The five moods are the list R5 retired; "ready to learn" is unsourced; feelings are companion framing, which the positioning refuses | — |
| AP-20 | REJECT | - | Games (D044), "family songs" (unconfirmed); a sunrise-to-bedtime day sells more device time to screen-wary parents | — |
| AP-21 | REJECT | - | "Grows with your child" is the banned "adapts" family; "6+" and "still teaching for years" break the band; no source for age-by-age abilities (no advisor, D038) | — |
| AP-22 | REJECT | - | Fold 3 already makes the science point once, with its source and a guide link. A child counsellor's video beside Kheelu reads as an endorsement we cannot yet support: no written permission, no recorded relationship, and D038 says there is no advisor (CCPA endorsement guidelines). Xu "learnt more words" is not supported (C10). Revisit for a guide page only once her written permission and relationship are on file | — |
| AP-23 | ADAPT | P3 | The child-plays, parent-sees contrast is warmer than ours and stays true; "see the learning" and five of the six features are withdrawn (D058) | Home fold 5 H2: "They're just playing. You read {hand:every word.}" Bullets unchanged |
| AP-24 | ALREADY | - | Fold 6 "Safety you can check" and /safety say it in code-checked words; "Safe by design", "Delete any of it", "Choose topics" and "used only for your reports" break D058 and D035. The hand-back is open (F8) | Home fold 6; /safety |
| AP-25 | ALREADY | - | Fold 7 compares kinds of products with defensible cells; the advisor's extra rows are withdrawn ("weekly progress") or unsourced; "Puzzles build hands" belittles what parents buy. The comparison drew 0 taps in 26 days (R17) | Home fold 7 |
| AP-26 | REJECT | - | Drafted words on real, named pilot parents ("the names are real; the quotes are not", claims §5; D009; ECOM-16); "already talking" is false popularity (DARK-02). Parents speaking in the consented films already do this job | — |
| AP-27 | ALREADY | - | /team carries the founders, credentials and recognition; the footer says "Designed by parents in Bengaluru. Made in India."; Team is in the menu. The block as written has false tiles ("Safety certified", "Backed by"), a removed card and "its own small language model" | /team; footer; AP-11 brings the strip to Home |
| AP-28 | FOUNDER | P1 | The later price is a true anchor we hide in the FAQ; D041 allowed "first 500" once, so moving it is the founder's call. The strike-through, COD, 15 days, "free" and 20 October are out. The share link is ours to add (P2, plan task 3) | See question 2. Offer cards (Home fold 9, product page fold 3), token mode only: "{price:headline} for the first 500 units. {price:full} once they are gone." Under Home's offer card, a text link: "Share Kheelu on WhatsApp" (new cta value; share text rewritten in D028's form) |
| AP-29 | REJECT | - | One product, one promise (voice.md row 10; B30); "for the school years" breaks the band; "coming soon" gives a parent a reason to wait | — |
| AP-30 | ADAPT | P3 | Our answers cover their eleven questions correctly; eight of theirs carry wrong facts. Their question wording is the parent's real fear | faqs.ts `not-right-for-us`: question becomes "What if my child doesn't like it?"; answer unchanged |
| AP-31 | ALREADY | - | Fold 7b "Guides for parents" links the same topics; journal readers rarely buy (R16), so it stays as it is | Home fold 7b |
| AP-32 | ALREADY | - | Fold 9 closes on the offer card and trust row; "Only 500" and "Ships 20 October" are scarcity and a wrong date | Home fold 9 |
| AP-33 | ALREADY | - | The footer has the promise line ("No web browsing", D058) and the origin line; a PlayOS link would point at a redirect (D041) and kheelona.ai still shows stale facts | Footer |
| AP-34 | FOUNDER | P1 | The single most valuable idea: a phone first screen that repeats the ad. Our data says paid phone visitors decide on the first screen and do not scroll; neither of our selling pages shows Kheelu there. The advisor's version fails on content (banned H1, ₹499-only button, 15 days, COD). A campaign page is a new URL, which D041 ruled out for v1 | See question 1. `/lp/meet-kheelu`, first screen at 360 × 590 in this priority: Kheelu in the film poster, the D045 H1, the buy bar with "{price:token} today · refundable · {price:headline} total (incl. GST)" and "Pre-order Kheelu" from first paint; then the facts row (AP-10), the lead, delivery and returns |
| AP-35 | REJECT | - | The store form and payment flow are frozen (ADR-013); COD does not exist (D024); pincode and home language add fields and data (DATA-12); "on its way … your delivery date" promises a timeline we do not publish | — |
| AP-36 | FOUNDER | P3 | Ten of the eleven open items are already answered (D034, D035, D018, D040, D054, D058; BIS applied for, not granted; the cut-off quote was never spoken). The one business question left is cash on delivery | See question 3 |
| AP-37 | ALREADY | - | It is our positioning's hierarchy, with D016 applied: conversation is the promise, asking back is the proof, screen-free and checkable safety are the foundation | Home folds 1-6 |

## Questions for the founder

**1. Where should the Meta ads land on phones? (AP-34, with AP-09 and AP-10)**
Paid phone traffic: 410 sessions, 0 orders; 90.1% of paid phone Home views never scroll; neither Home nor the
product page shows Kheelu on a 360 × 590 screen.
- (a) A new phone ad page, `/lp/meet-kheelu`, built only from approved blocks: the ad's film as a poster with
  Kheelu in frame, the D045 headline, "No screen · Up to 10 languages · You read every conversation", and the buy
  bar with the price from the first screen. Not in the menu or the sitemap. An exception to D041's "no new pages
  in v1". You confirm which film has ad consent, sign the copy, and point the ads at it.
- (b) `/products/kheelu`, unchanged, as the strategy planned.
- (c) Home, as today.

**Recommended: (a), with (b) as the stopgap until (a) is live.**

**2. Should the later price sit beside the price on the offer cards? (AP-28)**
- (a) No: keep "first 500" once, in the price FAQ (D041, as built).
- (b) Yes, as a plain fact under the price on the Home and product-page offer cards, only while the first-500 price
  is live: "₹4,999 for the first 500 units. ₹7,999 once they are gone." No strike-through, no counter, no "save".
- (c) A struck-through ₹7,999, as the advisor drew it. The legal review rules this out until ₹7,999 has actually
  been charged (PRICE-01).

**Recommended: (b).** It is the literal form the legal review allows, and it gives the ₹4,999 a true reference that
today only FAQ readers see.

**3. Cash on delivery: the advisor's open item 4. (AP-36, AP-35)**
- (a) No cash on delivery for pre-orders: keep D024 and the frozen checkout, and tell the advisor so.
- (b) Plan cash on delivery as a separate project after Gate B, for in-stock orders only, with its own decision
  and payment-sandbox QA.
- (c) Cash on delivery now. This breaks the brief's "checkout logic unchanged" and delays Gate B.

**Recommended: (a) now.** Consider (b) only if in-app-browser orders still fail at payment after launch (0 of 3 paid
so far, R13), once the "open in your browser" hint has had its chance.

Not asked, on purpose: the counsellor's permission (AP-22 is rejected for now), the brand line (AP-04) and the
hand-back line, which is already open as F8.

## Plan

| # | Task | Items | Pages | Effort | Founder |
|---|---|---|---|---|---|
| 1 | Phone ad landing page | AP-34, AP-09, AP-10 | `/lp/meet-kheelu` (new campaign entry) | M | Yes: question 1, the ad-consent film, copy sign-off, ads repointed |
| 2 | The later price on the offer cards | AP-28 (option b) | Home fold 9; product page fold 3 | S | Yes: question 2, deviation rows |
| 3 | Proof additions | AP-11, AP-14, AP-15, the share link from AP-28 | Home after fold 2 and fold 9; product page fold 4; `/lp` | M | Yes: deviation rows (D015) |
| 4 | Wording touches | AP-23, AP-30 | Home fold 5; faqs.ts | S | Yes: deviation rows |

**Task 1, the ad page.** Copywriter: copy from approved lines only (the D045 H1, the D028 sentence, trust.ts lines,
four faqs.ts picks: think-less, what-ages, price-and-advance, not-right-for-us); CMO review; founder signs. Builder:
first screen at 360 × 590 in AP-34's priority order, re-measured at 360 × 590, 390 × 844 and 412 × 915; the
poster as the LCP image (≤ 200 KB); the film inline on tap only (the FilmsStrip pattern: preload none,
playsinline, burned-in captions); the campaign buy-bar placement `tasks.md` deferred ("Campaigns"); cta registry
rows reusing `hero`, `sticky-bar` and `finale` on `/lp`; noindex and out of the sitemap. No new pixel event; a
ViewContent placement on `/lp` stays off unless the founder asks (tracking parity). QA: Lighthouse mobile ≥ 90,
axe clean, `cta.spec`. Founder: point each Meta creative at `/lp/meet-kheelu` with its own `utm_content`, so
PostHog compares it with the product page.

**Task 2.** Render the line from the offer source in token mode only (it disappears in full mode); add a guard that
no struck price appears; bump the machine-file pins if offer.ts changes (tasks.md "Machine-file pins").

**Task 3.** Reuse RecognitionStrip, StepsSection ("four") and the approved variant b exchange; no new components.
The share link is a `wa.me` text link (no new third-party request) with a new registered cta value (for example
`share-whatsapp`) and new share text in D028's form (the old text says "talking friend that teaches"). Check
Home's HTML against the 60 KB budget: if the strip does not fit, it goes on the product page instead.

**Task 4.** One deviation row each; the FAQ rename changes the question everywhere it appears, JSON-LD included.

## Notes outside the advisor's list

- **The screen-time worry** the advisor's testimonials lean on is best answered by the daily talk-time limit D058
  brought in, which is on no page yet (G28).
- **"When it doesn't know something, it says so"** sits in Home's think-less FAQ and the product page's "Good to
  know"; it comes off if G29 is not confirmed.
- **Instrumentation** before ads restart (data review): a film-play event under a new name, and section-view events,
  so the next review can measure `/lp` against the product page. Existing names stay untouched.
- **The advisor's open items 1-3, 5, 6 and 8-11** are answered by D034, BIS "applied for, not granted" (claims §6),
  D035, D058 item 7, D018, D040, D054 item 20, seller.ts and claims §5; the main session can send those answers
  with the fact pack.
