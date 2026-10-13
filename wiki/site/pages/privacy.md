---
title: "Privacy (/privacy): page copy, Gate A draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../../decisions/D054-founder-answers-open-questions-2026-10-14.md (item 10: the B11 events in the Google Analytics and PostHog blocks, approved after Gate A)
  - ../strategy.md (§3, §4.4 footer, §5 policy-pages row, line 213)
  - ../gate-a-open-items.md (the founder's 2026-10-11 answers and working defaults B13, B34, B35, B43, B47)
  - ../../product/legal-requirements.md (§1 H11-H16, §2.1, §2.7, §2.8 DATA-00 to DATA-31, §4 /privacy checklist lines 494-514, grievance block lines 489-492)
  - ../../product/policies.md, ../../product/facts.md, ../../product/claims.md (§1, §4, §7), ../../product/pricing.md
  - ../tracking-inventory.md (§1-§11, §15), ../checkout.md (form fields, steps 6, 11, 14)
  - ../../research/keyword-map.md (§4 line 226, §5.2 line 346, §6 P1 and RT1 lines 690-696)
  - ../../brand/voice.md, ../../brand/messaging.md, ../content-boundary.md
  - ../../legacy/settled-decisions.md (privacy and data, line 70)
  - "src/app/(site)/privacy/page.tsx and src/lib/legal.ts at tag archive/pre-reset-2026-10-10 (git show, 2026-10-11)"
  - "decisions D017-D043; binding here: D017, D018, D019, D020, D023, D024, D029, D030, D032, D035, D036, D038, D040, D041, D042"
  - ../../raw/feedback/2026-10-11-gate-a-answers.md
---

# Privacy (`/privacy`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside the
> **Copy** blocks is meant for the site. Everything else is a note for the team. Draft for the founder's
> approval under [D029](../../decisions/D029-grievance-officer-legal-review.md): a check against the law's own
> text, not legal advice. No lawyer reviews it before launch (B47), so nothing the legal review marks
> "counsel advised" is written here as settled.

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes, sources and checklists are INTERNAL.
- `[PLACEHOLDER: …]` = a fact we do not have. On the page it renders as a visible
  `<span class="mk-placeholder">`. 23 distinct gaps (33 marks in the copy, because some repeat or fill one
  table column), listed under [Placeholders](#placeholders). Most of them are product facts the toy and app need
  before any unit connects (legal review H11); the founder can answer several at once (questions 1 to 3).
- `{support-source}` = the support number and email, rendered from one value
  ([facts, support channel](../../product/facts.md#support-channel)). `{grievance-source}` = the grievance block
  ([D032](../../decisions/D032-grievance-block-and-call-line.md)). `{seller-source}` = the seller block
  ([policies, seller details](../../product/policies.md#seller-details-as-published)).
- **Drafter's addition** = wording no decision covers yet, written to meet a legal-review item. The founder
  approves each one (listed under [Drafter's additions](#drafters-additions-need-the-founders-ok)).
- Phone first: every fold is written for a 360 px screen. No section hides text in an accordion: legal text
  stays visible (the live page's own rule, "burying them here would be a way of hiding them",
  `terms/page.tsx:76` at the tag).

## At a glance

| Item | Draft |
|---|---|
| Page job | Tell a parent, plainly and completely, what Kheelona collects on the website, the store, Kheelu and the parent app; who else handles it and where; how long it is kept; the training opt-out; their choices and rights; who to complain to. Build trust by being specific. Never sell |
| Real URL | `https://kheelona.com/privacy` (mockup file `privacy.html`) |
| Primary search cluster | **Kheelona privacy policy** (trust; secondary: children's data, how long conversations are kept (RT1), DPDP) ([keyword map §4](../../research/keyword-map.md#4-one-primary-cluster-per-url), line 226) |
| Meta title (39 characters) | Kheelona privacy policy, in plain words |
| Meta description (143 characters) | How Kheelona handles your data and your child's: what we collect, every tool we use, 36 months for conversations, and how to opt out or delete. |
| H1 | Recommended **"Privacy, in plain words."** (live H1, carries "Privacy" per [keyword map §5.2](../../research/keyword-map.md#5-placement-rules)); options below |
| CTA | **None.** No "Pre-order Kheelu" button and no sticky bar on policy pages: the close links back to the product page ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline), line 213). So no price sentence and no `cta` value on this page. The shared nav and drawer keep `navbar` and `navbar-mobile` |
| Mockup meta | `{"title": "Kheelona privacy policy, in plain words", "description": "<meta above>", "url": "/privacy", "buybar": false, "active": "", "css": true}` |
| Images | None. A text-only page loads fastest on phones; no DS child or cast photo is needed |
| Length | About 3,200 words of copy, placeholders included (a long page by design: the website, store, toy and app in one policy) |

**H1 options**

1. **Privacy, in plain words.** (recommended: the live H1, short, carries the keyword)
2. Your family's data, in plain words.
3. What we keep, and what we never do.

---

## Fold 0 · Draft note (very top of `<main>`)

Quiet, small type, above the H1. Not an `Alert` with an icon: a plain `kh-body-s` line in a muted tone.

**Copy:**

> Draft for the founder's approval; not legal advice.

## Fold 1 · Header

`section aria-labelledby="privacy-title"`

**Copy:**

> *(eyebrow)* Privacy policy
>
> # Privacy, in plain words.
>
> What we collect on kheelona.com, in our store, through Kheelu and in its parent app; why; who else
> handles it; and what you can do about it.
>
> Last updated: [PLACEHOLDER: the date the founder approves this text]

## Fold 2 · The short version

`section aria-labelledby="short-title"`. Eight items, each a short title and one line. Component hint: the
`TrustList` panel pattern (title plus one checkable line), stacked one per row on phones; Kheelu Blue icons.
No item uses "Kheelu thinks on the device" from the DS example (banned, [D036](../../decisions/D036-launch-feature-claims.md)).

**Copy:**

> ## The short version.
>
> 1. **We don't sell your data.** Your child's data is never used to advertise to your child. Kheelu and the
>    parent app show no ads.
> 2. **Kheelu only listens when someone presses its button.** A light shows while it listens, and it switches
>    itself off after about a minute of quiet.
> 3. **Outside providers only produce the reply.** Trusted speech and AI providers, on servers in India,
>    process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to
>    train their AI.
> 4. **Our own model learns, unless you turn it off.** Kheelona's own model learns from your child's voice
>    recordings and conversation transcripts. It's on by default. [PLACEHOLDER: how a parent turns it off]
> 5. **You can read and delete every conversation.** Delete any of them in one tap. We delete transcripts
>    automatically after 36 months.
> 6. **This website measures visits.** We use analytics and advertising tools, all named below. One of them,
>    the Meta Pixel, follows visits to other sites. There is no cookie banner today.
> 7. **Card, UPI and bank details go to Razorpay.** They never reach us.
> 8. **We acknowledge every complaint within 48 hours.** And we resolve it within one month.

Icon hints (DS `assets/Icons`, all eight files checked to exist on 2026-10-11): `shield-check`, `microphone`,
`lock-simple`, `sliders-horizontal`, `chat-circle-dots`, `chart-line-up`, `currency-inr`, `envelope-simple`.

## Fold 3 · On this page

`nav aria-label="On this page"`. Each link a full 44 px row, jumping to the section id.

**Copy:**

> **On this page**
>
> 1. Who we are → `#who`
> 2. Kheelu, the parent app and your child's voice → `#kheelu`
> 3. Kheelona's own model → `#training`
> 4. When you pre-order → `#store`
> 5. How we measure visits → `#measuring`
> 6. Your choices about cookies and tracking → `#choices`
> 7. Everyone who handles your data → `#who-else`
> 8. How long we keep things → `#keep`
> 9. Deleting, and your other rights → `#rights`
> 10. What we never do → `#never`
> 11. Keeping data safe → `#security`
> 12. Films of real families → `#films`
> 13. Which law applies → `#law`
> 14. Questions and complaints → `#contact`

---

## Section 1 · Who we are (`#who`)

**Copy:**

> ## Who we are, and what this page covers.
>
> Kheelona Robotics Private Limited ("Kheelona", "we") makes Kheelu and runs kheelona.com, our store at
> store.kheelona.com and the Kheelu parent app. This page explains how we handle personal data in all four
> places: what we collect, why, who else handles it, how long we keep it, and the choices and rights you have.
>
> Our registered office is at 5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main,
> 5th Block Jayanagar, Bengaluru 560041, Karnataka, India`{seller-source}`. You can reach us on WhatsApp or by
> phone at +91 91875 46483, or at hello@kheelona.com`{support-source}`.
>
> Kheelu is made for children aged 3 to 7. This website, our store and the parent app are meant for parents
> and other adults, not for children.

## Section 2 · Kheelu, the parent app and your child's voice (`#kheelu`)

The first paragraph is the answer-first block for "What does Kheelona do with my child's data?"
([keyword map P1](../../research/keyword-map.md#6-question-bank-answer-first-drafts), lines 690-693), with the
placeholder it already carried.

**Copy:**

> ## Kheelu, the parent app and your child's voice.
>
> We don't sell your data. Trusted speech and AI providers, on servers in India, process your child's voice
> only to produce Kheelu's reply; they don't keep it or train on it, and our contracts say so. Kheelona's own
> model learns from conversations unless you turn this off. Conversations stay in your parent app for 36
> months, then they're deleted automatically.
>
> ### When Kheelu listens.
>
> Kheelu has no wake word, so it never listens for one. Its microphone turns on only when someone presses the
> wake-up button. It stays on while your child talks and switches itself off after about a minute of quiet. A
> light on Kheelu shows whenever it's listening. Until the next press, nothing is heard, recorded or sent.
>
> While the light is on, Kheelu hears whoever is speaking near it, so a brother, sister, friend or grown-up in
> the room can end up in a conversation too. You can read and delete any conversation in the parent app.
>
> ### Where your child's voice goes.
>
> In AI mode, Kheelu uses your home Wi-Fi. To understand and answer your child, Kheelu uses trusted speech and
> AI providers, on servers in India. They process your child's voice only to produce Kheelu's reply. They
> don't keep it, and they never use it to train their AI. Our contracts with them say so. "Trusted" means we
> chose them carefully; it is not a certification.
>
> [PLACEHOLDER: the names of the speech and AI providers, or the line "We tell you which providers we use if
> you ask."]
>
> Kheelu cannot browse the internet. It has no camera, so it takes no photos or video.
>
> ### What we keep, and why.
>
> - **Conversation transcripts:** the words of each conversation, written out. We keep them so you can read
>   them in the parent app and so Kheelu can remember earlier conversations with your child.
> - **Voice recordings:** used to train Kheelona's own model (next section). [PLACEHOLDER: whether recordings
>   are used for anything else]
> - **Your child's age:** you enter it in the parent app when you set Kheelu up, and you can change it later.
>   Every reply passes an age-graded safety layer set to that age.
> - **The weekly report and the new-word count** in the parent app, worked out from your child's
>   conversations.
> - [PLACEHOLDER: parent alerts, if they ship in the app: what sets one off and what it uses]
> - [PLACEHOLDER: any other detail about your child the parent app asks for, for example a first name]
> - **Your parent-app account and Kheelu's setup:** [PLACEHOLDER: the account details (for example phone
>   number or email, and whether you sign in with a password or a one-time code) and the device and Wi-Fi
>   details the app keeps]
>
> ### Your consent.
>
> A parent or guardian sets Kheelu up in the parent app. [PLACEHOLDER: how you give consent for your child's
> data at setup, and how we check that a parent or guardian is giving it; this step is not built yet]

Notes:
- The listening paragraph is [D018](../../decisions/D018-wake-up-button.md)'s body and FAQ lines, near
  verbatim. No "no risk", no disconnect claim, no "nothing is ever recorded" (conversations are kept).
- The providers paragraph is [D020](../../decisions/D020-provider-terms-and-no-sale.md)'s line verbatim, with its
  "trusted" guardrail stated on the page, because a policy page should explain its own adjectives.
- Not written: "the first thinking happens on the toy" ([facts](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes)
  flags it beside the providers line); "on-device-first" ([D036](../../decisions/D036-launch-feature-claims.md));
  any "we keep nothing" form ([D035](../../decisions/D035-model-training-opt-out.md)); "Nothing is collected
  without your consent" (no flow exists, [legal DATA-14](../../product/legal-requirements.md)).
- Alerts and the daily summary are off the customer pages in v1 (B34, a working default). D036 confirms alerts
  for launch, so the policy holds a placeholder rather than silence: if the app ships them, the policy must say
  so. Whether any parent-app feature counts as "behavioural monitoring" under DPDP s.9(3) is a counsel point
  (H14); the page describes the features and draws no legal conclusion.
- The parent app is part of Kheelona+; the page does not mention Kheelona+ or what happens after the six
  included months ([D041](../../decisions/D041-gate-a-round-1.md) F7). The 36-month line assumes the app stays
  readable; that risk is recorded in D041 (legal review L7).

## Section 3 · Kheelona's own model (`#training`)

Disclosed here and on `/terms` only, never on customer pages ([D035](../../decisions/D035-model-training-opt-out.md)).
D035 asks the page to say what is used, by whom, why, that it is on by default, how to turn it off, and the
retention. Three of those are facts we do not have yet, so they are placeholders.

**Copy:**

> ## Kheelona's own model learns from conversations.
>
> Our outside speech and AI providers never train on your child's voice. Kheelona's own AI model does learn
> from conversations, and here is exactly how.
>
> - **What it uses:** your child's voice recordings and the transcripts of their conversations with Kheelu.
> - **Who uses it:** Kheelona, to train our own model. We don't sell it.
> - **Why:** [PLACEHOLDER: the purpose in the founder's words, for example "to make Kheelu better at
>   understanding and answering children aged 3 to 7"]
> - **Where:** [PLACEHOLDER: where our model is trained (country or region)]
> - **It's on by default.** You can turn it off at any time: [PLACEHOLDER: how a parent turns training off,
>   for example a setting in the parent app]. From then on, your child's conversations are not used to train
>   our model. [PLACEHOLDER: what happens to recordings and transcripts already used before you turned it off]
> - [PLACEHOLDER: confirm that turning it off changes nothing else about how Kheelu or the parent app works]

Notes:
- "From then on, … not used to train our model" is the plain meaning of the opt-out D035 describes; nothing
  more is promised.
- Risk recorded in D035, not re-raised: an opt-out default is unlikely to meet DPDP s.6(1) and s.9(1) once those
  duties apply (May 2027). The page states the practice and makes no compliance claim.

## Section 4 · When you pre-order (`#store`)

**Copy:**

> ## When you pre-order on our store.
>
> Before you pay, we ask for four things: your name, your WhatsApp number, your email address and your child's
> age. After you pay, we ask for your delivery address.
>
> We use your WhatsApp number and email to tell you about your own order: the confirmation, the balance
> payment link and any change to the delivery date. Your address is how your Kheelu reaches you. We ask your
> child's age because Kheelu is made for children aged 3 to 7, and it helps us plan for the right ages. We
> don't ask for your child's name, school or photo.
>
> When you tick the box at checkout, you accept the pre-order terms and the refund policy, and agree to hear
> about your own order on WhatsApp. The box is never ticked for you, and we store the time you ticked it.
>
> If you start a pre-order and don't pay, the details you entered are still saved, as an unpaid order.
> [PLACEHOLDER: how long we keep unpaid orders]
>
> Your browser also tells us a few things: the page or advertisement that brought you, your device and
> browser, and your network address (IP address). If you have a Meta cookie on your device, we read the
> identifier in it. We keep these with your order, so we can tell which of our pages and advertisements work.
>
> ### Paying.
>
> Razorpay, an Indian payment company, takes your payment on its own secure form. Your card number, UPI ID and
> bank details go to Razorpay, never to us. We receive a payment reference and the amount. Razorpay's form sets
> its own cookies while you pay.

Notes:
- The fields mirror the store form exactly ([checkout, form fields](../checkout.md), lines 116-140); the child's
  age stays a required field (B13, presentation only; checkout logic unchanged, brief 4.4). If the store form
  changes, this paragraph changes in the same commit (the live page's own rule, `privacy/page.tsx:25-28`).
- "Unpaid order": create-order saves the row before payment ([checkout](../checkout.md), step 6, line 100).

## Section 5 · How we measure visits (`#measuring`)

One short block per tool (an `h3` and two to four sentences), never a count of tools (the live page had to
retire a count four times, `privacy/page.tsx:151-176`). Every tool in the
[tracking inventory](../tracking-inventory.md#at-a-glance) that touches a visitor is named; tracking parity
keeps all of them on the new site.

**Copy:**

> ## How we measure visits and advertising.
>
> We measure how people use this website and our store, so we can see which parts help you decide and which
> advertisements are worth paying for. These tools run on kheelona.com and store.kheelona.com, and they load
> as soon as you open a page.
>
> ### Vercel Web Analytics
> Counts page views. It sets no cookies and does not follow you to other sites.
>
> ### Ahrefs Web Analytics
> Counts page views. It sets no cookies and does not follow you to other sites.
>
> ### Google Analytics
> Counts visits and the steps of a pre-order: starting the form, being asked to correct an answer (which answers,
> never what you typed), opening and closing the payment window, a payment that fails (with Razorpay’s code for
> why), paying, and saving your address. It is told your order number and the amount paid. It sets cookies in your
> browser to tell a returning visit from a new one. Google keeps this data for 14 months.
>
> ### Meta Pixel
> From Meta, the company behind Facebook, Instagram and WhatsApp. It sets a cookie and does follow you to other
> sites. It tells Meta which pages you looked at, and whether you pre-ordered and for how much. It's how we know
> whether an advertisement brought someone here, and how you may later see a Kheelona advertisement on Facebook
> or Instagram. Meta's script also reads what it recognises on our forms and sends it as one-way codes, never
> in readable form.
>
> ### Meta Conversions API
> When a pre-order is paid, our own server reports it to Meta: one-way codes of your email, phone number and
> first name, together with your network address, your browser, the identifiers in Meta's cookie on your
> device, the amount and the order number. A one-way code lets Meta check whether you match an account it
> already knows; it is not your details themselves.
>
> ### PostHog
> Records which buttons and links you tap, and a replay of your screen as you move through the site, so we can
> find the places where the pre-order form confuses people. It is told the same steps of a pre-order as Google
> Analytics. It also tells us when something breaks or loads
> slowly. Anything you type is hidden before the recording leaves your browser, and nothing is recorded on the
> order confirmation page. PostHog also receives your network address, which tells us your country. It does not
> follow you to other sites and is never used to advertise to you. It stores what it collects on servers in the
> United States.
>
> When you pre-order, we store the anonymous identifier PostHog gave your browser alongside your order, so we
> can see that a visit turned into an order. It identifies a browser, not a person, and we don't ask PostHog to
> build a profile from it. Our server also tells PostHog when a pre-order is paid, with the order number, the
> amount and the campaign that brought you.
>
> ### Our own cookies
> - **kh_utm** remembers which campaign brought you, for as long as your visit lasts.
> - **kh_fbclid** remembers which advertisement click brought you, for as long as your visit lasts. Meta can
>   match that click back to your account, which is how an advertisement gets credited with a sale. We cannot,
>   and we never learn who you are on Meta.
> - **kh_order** lets the confirmation page show your order, for 2 hours.

Notes:
- Search Console, Bing Webmaster Tools and Meta's domain check collect nothing about visitors
  ([tracking inventory §12](../tracking-inventory.md#12-search-console-bing-and-meta-domain-verification)), so
  they are not listed. The Meta Ads data PostHog syncs is our ad account's performance, not visitor data.
- The `?internal=1` team link (B46) marks team devices only; not a visitor-facing practice, not listed.
- Resend's own open and click tracking is a dashboard setting nobody has read
  ([tracking inventory §11](../tracking-inventory.md#11-resend-order-emails)); the page claims nothing about it.
  CTO check before sign-off.
- **Changed after Gate A** ([D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 10,
  2026-10-14): the Google Analytics block names the two new steps a parent can meet (being asked to correct an
  answer; a payment that fails), and the PostHog block says it is told the same steps. They are the three new
  checkout events of task 6.2 (B11), which send field names and Razorpay's codes only, never what a parent typed.
  The approved mockup keeps its Gate A text; the difference is [deviation V10](../../qa/deviations.md).

## Section 6 · Your choices (`#choices`)

**Copy:**

> ## Your choices about cookies and tracking.
>
> We don't show a cookie banner today: the tools above load when you open a page. Before the consent duties of
> India's Digital Personal Data Protection Act, 2023 apply in May 2027, we will add a choice, so you can say yes
> or no to our analytics and advertising tools.
>
> Until then, here is what works.
>
> - **Your browser can block** the tools that load from another company's address, and most of the Meta
>   Pixel. Private browsing, an ad blocker or turning off third-party cookies all help, and none of them stop
>   the site or the store from working.
> - **Two things blocking can't stop.** PostHog reports through our own address, so an ad blocker usually can't
>   tell it apart from the site itself. And the report our server sends to Meta when a pre-order is paid comes
>   from us, not from your browser.
> - **You can turn off personalised advertising** in your own Facebook or Instagram settings.
> - **You can ask us to delete your details** at any time (see [Deleting, and your other rights](#section-9--deleting-and-your-other-rights-rights)).

Notes:
- "May 2027", not a day: the start date is 13 or 14 May 2027, a counsel point (legal review DATA-00). D042 plans
  the consent gate before 13 May 2027.
- One consent state must later switch every tag and both server routes (legal review H16); that is Phase 4/5
  work, not copy.

## Section 7 · Everyone who handles your data (`#who-else`)

On phones, one stacked row per recipient (name in bold, then "What" and "Where" lines), not a wide table.

**Copy:**

> ## Everyone who handles your data, and where.
>
> Each of these companies does one job for us.
>
> | Who | What they do for us | Where |
> |---|---|---|
> | Speech and AI providers [PLACEHOLDER: names, or "on request"] | Turn your child's voice into Kheelu's reply | Servers in India |
> | [PLACEHOLDER: who stores conversations and runs the parent app] | Stores conversations, your child's age and your parent-app account | [PLACEHOLDER: region] |
> | Razorpay | Takes your payment | [PLACEHOLDER: region] |
> | Supabase | Stores your order | [PLACEHOLDER: region] |
> | Resend | Sends our order emails | [PLACEHOLDER: region] |
> | Vercel | Hosts this website and the store, and runs the store's server code; Vercel Web Analytics | [PLACEHOLDER: region of the store's server code on the new site] |
> | Google | Google Analytics | [PLACEHOLDER: region] |
> | Meta | Meta Pixel and Conversions API; WhatsApp, when you message or call us | [PLACEHOLDER: region] |
> | PostHog | Taps, screen replays and errors on this site | United States |
> | Ahrefs | Counts page views | [PLACEHOLDER: region] |
>
> Inside Kheelona, only our team can read your order. We also share data when Indian law requires it, for
> example with tax authorities or in answer to a lawful order.

Notes:
- Known locations only: the providers ([D020](../../decisions/D020-provider-terms-and-no-sale.md) item 6) and
  PostHog (US cloud, [tracking inventory §6](../tracking-inventory.md#6-posthog-in-the-browser); live
  `privacy/page.tsx:86`). Everything else waits on the CTO's written region map (legal review H12, DATA-26) and
  the Supabase region (C17). Today the store's server code runs in Washington, D.C., USA (Vercel iad1,
  [open questions](../../open-questions.md) C17), but Phase 4 may move it, so the page does not state today's
  region for the new site.
- "Only our team can read your order" is the live line (`privacy/page.tsx:55`). Who can read transcripts is not
  documented, so it is not claimed (Section 11 placeholder).
- The last sentence (lawful sharing) is a drafter's addition.

## Section 8 · How long we keep things (`#keep`)

The first paragraph is the answer-first block for "How long are my child's conversations kept?"
([keyword map RT1](../../research/keyword-map.md#6-question-bank-answer-first-drafts), lines 695-696).

**Copy:**

> ## How long we keep things.
>
> Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. You can
> delete any of them sooner, in one tap. The speech and AI providers that help Kheelu reply keep none of it.
>
> - **Conversation transcripts:** 36 months, then deleted automatically, unless you delete them sooner.
> - **Voice recordings:** [PLACEHOLDER: how long we keep voice recordings, and whether the same 36 months
>   applies]
> - **If you close your parent-app account:** [PLACEHOLDER: what happens to your child's conversations and
>   recordings]
> - **Orders you've paid for:** as long as Indian tax law requires, even after a refund. [PLACEHOLDER: the
>   period, from our CA]
> - **Unpaid orders:** [PLACEHOLDER: how long we keep them]
> - **Google Analytics:** 14 months.
> - **PostHog:** screen recordings for 30 days. [PLACEHOLDER: how long PostHog keeps the other events]
> - **Meta** keeps what it receives under its own policy.
> - **Our cookies:** kh_utm and kh_fbclid for as long as your visit lasts; kh_order for 2 hours.

Notes:
- 36 months is [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 7, verbatim in its customer form.
  D035 ties the training disclosure to this period but does not say recordings follow it, so the recordings row
  is a placeholder.
- Early-end triggers (withdrawal, delete, account closure) are what legal review DATA-20 asks for; only delete
  is documented (D017).
- Never "Nothing is kept that you cannot delete" (retired, legal review H15).

## Section 9 · Deleting, and your other rights (`#rights`)

**Copy:**

> ## Deleting, and your other rights.
>
> ### Deleting a conversation.
>
> In the parent app, you can delete any conversation in one tap. It disappears from your app straight away.
> [PLACEHOLDER: how soon a deleted conversation is erased from our systems and backups, any period the law
> requires us to keep records, and whether it is also removed from Kheelu's memory and from our model's training
> data]
>
> ### Asking us.
>
> You can ask us to:
>
> - show you the personal data we hold about you and your child, and tell you who we have shared it with;
> - correct anything that is wrong or out of date;
> - delete your details or your child's;
> - withdraw a consent you gave, as easily as you gave it;
> - from May 2027, when the DPDP Act's duties apply, name someone who can use these rights for you if you die
>   or can no longer act for yourself.
>
> Write to hello@kheelona.com, or message or call +91 91875 46483`{support-source}`. Tell us your order number,
> or the email or phone number on your order or your parent-app account, so we can find your data. If you have
> an open pre-order, deleting your details means cancelling it, so we refund you at the same time.
>
> We acknowledge every request within 48 hours and answer it within one month. If you're not happy with our
> answer, contact our grievance officer (below). From May 2027, you can also complain to the Data Protection
> Board of India.

Notes:
- One-tap delete is [D017](../../decisions/D017-live-behaviour-claims-confirmed.md). B35: customer pages say
  "Delete any of them in one tap"; this page carries the precise wording. What happens beyond the app is not
  documented, and the legal review's suggested line ("erased from our systems after the minimum period the law
  sets", H15) rests on a counsel reading of DPDP Rule 8(3), so it is a placeholder, not copy.
- The rights list follows legal review DATA-22 (DPDP s.11-14, Rules 14(1), 14(4), 14(5); SPDI Rule 5(6) for
  review and correction now) and DATA-30 (no waiver of a Board complaint).
- "48 hours … one month" for rights requests extends the D032 complaint promise: a drafter's addition. DPDP
  Rule 14(3) needs a published response period of at most 90 days from May 2027; one month meets it.

## Section 10 · What we never do (`#never`)

**Copy:**

> ## What we never do.
>
> - We never sell your data, and we never sell your child's data.
> - We never use your child's data to advertise to your child. Kheelu and the parent app show no ads.
> - We never use what you type into the pre-order form to profile your child.
> - Kheelu cannot browse the internet, and it has no camera.
>
> We do advertise Kheelu to parents on Facebook and Instagram, and the Meta tools above are how we measure that.

## Section 11 · Keeping data safe (`#security`)

**Copy:**

> ## Keeping data safe.
>
> Payments happen on Razorpay's own form, so card, UPI and bank details never reach us. Only our team can read
> your order.
>
> [PLACEHOLDER: our security practices (for example encryption, who at Kheelona can read conversations, and
> backups), taken from our written security policy; this section will say only what that policy documents]
>
> [PLACEHOLDER: what we do, and how quickly we tell you, if your data is ever exposed, once our incident plan is
> written]

Notes: legal review DATA-06 and DATA-25 (describe only what is documented), DATA-24 (the breach line only once
the runbook exists). No "ISO 27001" or framework claims (B36).

## Section 12 · Films of real families (`#films`)

**Copy:**

> ## Films of real families.
>
> The films on this website show pilot families, filmed with their permission. A parent gave written consent
> for every child who appears. If you or your child appear in one of our films and you want it taken down,
> write to hello@kheelona.com`{support-source}`.

Notes: [D040](../../decisions/D040-films-move-to-new-site.md) (consent held, signed records with the founder);
"Pilot families, filmed with their permission." is legal review DARK-02's line. The take-down route is legal
review DATA-29 and a drafter's addition. No material-connection line (D040, risk recorded). The AI-image
disclosure lives on `/terms` only ([D041](../../decisions/D041-gate-a-round-1.md)).

## Section 13 · Which law applies (`#law`)

**Copy:**

> ## Which law applies, and changes to this page.
>
> Today, this policy follows India's Information Technology Act, 2000 and the Information Technology
> (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. Most
> duties of India's Digital Personal Data Protection Act, 2023 and its Rules of 2025 apply from May 2027. We are
> preparing for them, including the choice about our analytics and advertising tools described above.
>
> When we change this page, we update the date at the top. If a change affects how we use data you have already
> given us, we tell you by email or WhatsApp before it takes effect.

Notes:
- Legal review DATA-00 (SPDI now, DPDP from 13 or 14 May 2027: "May 2027" on the page). No "compliant" or
  "designed for DPDP" claim (B36).
- The IT (Intermediary Guidelines) Rules 2021 named in this step's brief are not in the legal review: they bind
  intermediaries that host other people's content, which Kheelona's own-stock site is not. The page cites
  nothing under them. Flag for the CTO, not a founder question.
- The change-notice sentence is a drafter's addition (related to DPDP s.5(2), notice to earlier customers).

## Section 14 · Questions and complaints (`#contact`)

The grievance block is [D032](../../decisions/D032-grievance-block-and-call-line.md)'s wording verbatim, from one
content value shared with `/contact`, `/refund`, `/terms` and the store footer. The seller block is the live
`SELLER_SECTION` minus the retired "messages, not calls" line.

**Copy:**

> ## Questions and complaints.
>
> For anything about your data, write to hello@kheelona.com, or message or call us on WhatsApp at
> +91 91875 46483`{support-source}`.
>
> **Grievance Officer:** Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483. We acknowledge every
> complaint within 48 hours and resolve it within one month of receiving it.`{grievance-source}`
> [PLACEHOLDER: how you get a complaint reference to track your complaint; not set up yet]
>
> **Who we are:** Kheelona Robotics Private Limited, registered at 5th Floor, No 51 (Old Site No 1), Kokarya
> Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India. GSTIN
> 29AAMCK1530E1ZN.`{seller-source}`

## Close

No orange button. A secondary button back to the product page, then the related policy links, then the help
line (Home's help line, [home.md](home.md#cta-block)).

**Copy:**

> **[Meet Kheelu]** → `meet-kheelu.html` (real URL `/products/kheelu`), `kh-btn--secondary`, no `cta` value
>
> Also read: Terms → `terms.html` · Refunds → `refund.html` · Shipping → `shipping.html` · Safety → `safety.html`
>
> Questions? WhatsApp or call +91 91875 46483`{support-source}`

---

## Sources

Plain `path:line` = tag `archive/pre-reset-2026-10-10`. Wiki paths are relative to `wiki/`.

| Claim on the page | Source |
|---|---|
| Draft note; founder approves; no lawyer; counsel points not settled | [D029](../../decisions/D029-grievance-officer-legal-review.md); gate-a-open-items.md:94 (B47) |
| Scope: website, store, toy and app in one policy | product/legal-requirements.md:424 (DATA-01), 496 |
| Seller name, address, GSTIN | product/policies.md:140-144; `src/lib/legal.ts:18-24` |
| Support WhatsApp (calls and messages), email | product/facts.md:223-224; [D032](../../decisions/D032-grievance-block-and-call-line.md) |
| Ages 3 to 7 | product/facts.md:83 |
| We don't sell your data | [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 5; product/claims.md:75; `privacy/page.tsx:189` |
| Never used to advertise to your child; no ads in Kheelu or the app | [D038](../../decisions/D038-trust-content-rulings.md) (F17); product/claims.md:76 |
| No wake word; wake-up button; about a minute; the light; "until the next press" | [D018](../../decisions/D018-wake-up-button.md):24-41; product/facts.md:124; product/claims.md:73 |
| Other people near Kheelu while the light is on | product/legal-requirements.md:447 (DATA-18), 504; mechanism from D018 |
| AI mode uses home Wi-Fi | product/facts.md:98 |
| Providers line, verbatim; "trusted" guardrail | [D020](../../decisions/D020-provider-terms-and-no-sale.md):21-24, 34-36; product/facts.md:127; product/claims.md:74 |
| Cannot browse the internet; no camera | product/claims.md:71, 68; product/facts.md:144, 146 |
| Transcripts read in the app; one-tap delete | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); product/facts.md:130; product/claims.md:72 |
| Kheelu remembers earlier conversations; weekly report; new-word count; age-graded layer; parent sets the age at setup | [D036](../../decisions/D036-launch-feature-claims.md):16-26; site/pages/home.md:751 |
| Alerts confirmed but trigger undefined; off the customer pages in v1 | [D036](../../decisions/D036-launch-feature-claims.md):19-20; gate-a-open-items.md:84 (B34) |
| Consent at setup not built | product/legal-requirements.md:443 (DATA-14), 503; product/claims.md:335 |
| Own-model training: voice and transcripts, by default, opt-out, terms and privacy only | [D035](../../decisions/D035-model-training-opt-out.md):14-29; product/claims.md:330, 333 |
| Store fields, address after payment, consent tick not pre-ticked with a timestamp | site/checkout.md:116-140 (121, 123, 124), 62; product/policies.md:92; `privacy/page.tsx:29-30` |
| Why each field; no child's name, school or photo | `privacy/page.tsx:30, 43` |
| Unpaid orders saved before payment | site/checkout.md:100 (step 6) |
| Campaign, device, IP and Meta cookie identifier kept with the order | `privacy/page.tsx:30`; site/tracking-inventory.md:346-349 (stored on the order row) |
| Razorpay form, details never reach us, payment reference, Razorpay cookies | `privacy/page.tsx:36-37`; site/tracking-inventory.md:365-371 |
| Tools load on first view; no banner | site/tracking-inventory.md:445-447 (§15) |
| Vercel Web Analytics: page views, no cookies | site/tracking-inventory.md:97-108; `privacy/page.tsx:70` |
| Ahrefs: page views, no cookies | site/tracking-inventory.md:110-121; `privacy/page.tsx:70` |
| Google Analytics events, order number and amount, cookies | site/tracking-inventory.md:132-160; `privacy/page.tsx:70` |
| Google Analytics keeps 14 months | legacy/settled-decisions.md:70 |
| Meta Pixel: cookie, follows to other sites, pages, purchase and amount, ads on Facebook and Instagram, form reading as one-way codes | site/tracking-inventory.md:170-206; `privacy/page.tsx:71, 124, 140` |
| Conversions API payload | site/tracking-inventory.md:214-229; `privacy/page.tsx:140` |
| PostHog: taps, replay, errors, performance, inputs masked, no recording on confirmation, IP stored, US, not for ads, 30-day recordings | site/tracking-inventory.md:241-264, 290-295; `privacy/page.tsx:85-86`; [D031](../../decisions/D031-posthog-settings-and-replays.md) |
| PostHog id stored with the order; no profile; server event | site/tracking-inventory.md:289-290, 305-317; `privacy/page.tsx:99` |
| kh_utm, kh_fbclid, kh_order; Meta can match the click, we cannot | site/tracking-inventory.md:341-345; `privacy/page.tsx:115` |
| Consent gate before the DPDP consent duties (May 2027) | [D042](../../decisions/D042-policy-display-answers.md); product/policies.md:132; product/legal-requirements.md:79, 423 (DATA-00) |
| How to limit tracking; the two gaps; Facebook and Instagram settings | `privacy/page.tsx:168, 177`; site/tracking-inventory.md:319-331 (proxy) |
| Recipients list; PostHog US; providers in India; regions unknown | site/tracking-inventory.md:68-95; product/legal-requirements.md:282-295 (H12), 455 (DATA-26), 499; open-questions.md:142 (C17) |
| Only our team can read your order | `privacy/page.tsx:55` |
| 36 months, then automatic deletion; providers keep nothing (RT1) | [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 7, line 26; research/keyword-map.md:695-696; product/facts.md:132 |
| Paid orders kept for tax, even after a refund | `privacy/page.tsx:56` |
| Delete wording beyond the app is a placeholder | gate-a-open-items.md:86 (B35); product/legal-requirements.md:325-336 (H15), 450 (DATA-21) |
| Rights, identifiers, nomination, Board complaint | product/legal-requirements.md:451 (DATA-22), 459 (DATA-30), 510 |
| Delete details means cancelling, refund at the same time | `privacy/page.tsx:196` |
| We advertise on Facebook and Instagram | `privacy/page.tsx:190` |
| Never profile your child from the form | `privacy/page.tsx:49, 141` |
| Security and breach lines only once documented | product/legal-requirements.md:428 (DATA-06), 453 (DATA-24), 454 (DATA-25), 509, 512 |
| Films: pilot families, written consent, take-down route | [D040](../../decisions/D040-films-move-to-new-site.md):19-26; product/legal-requirements.md:387 (DARK-02), 458 (DATA-29) |
| SPDI now, DPDP from May 2027 | product/legal-requirements.md:79, 423 (DATA-00), 497 |
| Grievance block, 48 hours, one month, calls | [D032](../../decisions/D032-grievance-block-and-call-line.md):20-29; product/policies.md:117-119; product/legal-requirements.md:489-492 |
| Complaint reference not set up | product/policies.md:120; gate-a-open-items.md:110; product/legal-requirements.md:363 (ECOM-04) |
| No CTA, link back to the product page | site/strategy.md:213 |
| Meta title and H1 keyword | research/keyword-map.md:226, 346 |

## Placeholders

| # | Where | Placeholder | Who supplies it |
|---|---|---|---|
| 1 | Header | Last-updated date | Founder (on approval) |
| 2 | Short version 4; Section 3 | How a parent turns training off | Founder / product team (D035) |
| 3 | Section 2 | Provider names, or "we tell you on request" | Founder (question 3) |
| 4 | Section 2 | Whether voice recordings are used for anything besides training | Product team |
| 5 | Section 2 | Parent alerts: trigger and data used, if they ship | Product team (D036) |
| 6 | Section 2 | Other child details the app asks for | Product team |
| 7 | Section 2 | Parent-app account details; device and Wi-Fi setup data | Product team (DATA-05) |
| 8 | Section 2 | How consent is given at setup and how the adult is checked | Product team (DATA-14; flow not built) |
| 9 | Section 3 | Purpose of training, in the founder's words | Founder (question 1) |
| 10 | Section 3 | Where the model is trained | CTO |
| 11 | Section 3 | What happens to data already used after opt-out | Founder / CTO (question 2) |
| 12 | Section 3 | Turning training off changes nothing else | Founder (question 1) |
| 13 | Section 4; Section 8 | Retention of unpaid orders | CTO |
| 14 | Section 7 | Who stores conversations and runs the parent app | CTO |
| 15 | Section 7 | Region per recipient (seven rows), incl. the store's server code on the new site | CTO's region map (H12, DATA-26); C17 |
| 16 | Section 8 | Voice-recording retention | Founder (question 2) |
| 17 | Section 8 | Effect of closing the parent-app account | Product team |
| 18 | Section 8 | Tax-record retention period | CA |
| 19 | Section 8 | PostHog event retention (other than recordings) | CTO (dashboard) |
| 20 | Section 9 | Erasure beyond the app; memory; training data | CTO / founder (question 2) |
| 21 | Section 11 | Security practices from the written policy | CTO (DATA-06) |
| 22 | Section 11 | Incident notice | CTO (DATA-24) |
| 23 | Section 14 | Complaint reference | CTO (ECOM-04; operational under D030) |

## Drafter's additions (need the founder's OK)

Written to meet a legal-review item; no decision covers the exact wording yet.

1. "This website, our store and the parent app are meant for parents and other adults" (DATA-13).
2. The other-people line: siblings and visitors can end up in a conversation (DATA-18).
3. "We also share data when Indian law requires it" (SPDI Rule 4(1)(iv), disclosure).
4. The rights list and how to ask (DATA-22), with "we acknowledge every request within 48 hours and answer it
   within one month" (extends D032 from complaints to rights requests).
5. The film take-down route (DATA-29).
6. Notice by email or WhatsApp before a change that affects data already given (DPDP s.5(2)).

## Questions for the founder (website only)

Each lands on this page or `/terms`. Shared with [terms.md](terms.md).

1. **Training opt-out, how and why.** Where does a parent turn training off (recommend: one switch in the parent
   app's settings, plus "or ask us on WhatsApp or by email"), and may the page say turning it off changes nothing
   else about Kheelu? And the purpose in your words: is "to make Kheelu better at understanding and answering
   children aged 3 to 7" right?
2. **What "delete" and "opt out" reach.** When a parent deletes a conversation or turns training off, is it also
   removed from Kheelu's memory and from data already used for training? And are voice recordings kept for the
   same 36 months as transcripts? (Recommend the page states only what the product does; the CTO may answer the
   technical half.)
3. **Name the speech and AI providers?** (a) Name them on `/privacy`; (b) "We tell you which providers we use if
   you ask." **Recommend (b)** until the provider contracts are checked against the providers line (your
   to-do, legal review H12); the DPDP access right covers naming from May 2027.
4. **The drafter's additions** above, on both pages: approve as a set, or strike any.
5. **No pre-order button on the policy pages.** `/privacy` and `/terms` end with a link back to Meet Kheelu, no
   orange button and no sticky bar (strategy §5). **Recommend yes**: these pages build trust, and the footer and
   nav still reach the store.

## Checks before sign-off (CTO, not founder questions)

- Region map for every recipient and the transcript store (H12, DATA-26); the Supabase region (C17).
- Resend open and click tracking: off or on? The page claims nothing until it is read.
- Provider contracts against the D020 line (founder to-do, gate-a-open-items §4).
- The store form fields and tools: if Phase 4 changes either, this page changes in the same commit.

## Risks recorded, not re-raised

- Opt-out training default vs DPDP consent ([D035](../../decisions/D035-model-training-opt-out.md)).
- Kheelona+ after six months unstated; the 36-month line assumes the app stays readable
  ([D041](../../decisions/D041-gate-a-round-1.md), legal review L7, DARK-04).
- No consent banner until before May 2027 ([D042](../../decisions/D042-policy-display-answers.md); legal review
  H16, DATA-11).
- No material-connection line beside the films ([D040](../../decisions/D040-films-move-to-new-site.md)).

## Keyword placements

| Place | Carries |
|---|---|
| Meta title | "Kheelona privacy policy" |
| H1 | "Privacy" |
| H2 | "How long we keep things." (RT1, conversation retention); "Kheelu, the parent app and your child's voice." (children's data, P1) |
| Body | "Digital Personal Data Protection Act, 2023" once in `#choices` and once in `#law` (secondary; the journal article owns DPDP) |
| Density | "Kheelu" is a product noun here, not a keyword target; no density check needed on a legal page |
