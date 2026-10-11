---
title: "Setup (/setup): page copy, Gate A mockup draft"
type: page-copy
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§2 rule for every page, §3.3 CTA placement, §5 /setup row)
  - home.md (conventions; the wake-up button and parent-app lines as approved there)
  - ../gate-a-open-items.md (A10 no "wake word" on customer pages, B35 one-tap delete wording)
  - ../../product/facts.md (modes 91-104, languages 106-118, listening 120-128, parent app 148-171, in the box 207-215, support channel 217-230)
  - ../../product/claims.md (§1, §2 safety layer line 115, §4 and §4.1 retired microphone wording rows 17, 19, 20)
  - ../../product/age-band-review.md
  - ../../research/keyword-map.md (§4.1 /setup row, §5.2 /setup row)
  - "decisions D017, D018, D023, D027, D032, D036, D041"
  - "Copy brief for this page group (main session, 2026-10-11): the parent app's setup steps as shown in the founder's app demo video mobileapp-live-demo-oct2026.mp4 (repo root, local only, never committed; log.md 2026-10-11 11:35). NOT yet filed on facts.md: see Gaps"
  - "wt:src/app/(site)/setup/page.tsx and wt:src/lib/setup-steps.ts (the live /setup, working tree read 2026-10-11)"
  - "design-system/project/04-kheelu.md:13 (belly unit), assets/Kheelu/README.md:9, 01-writing.md:92 (error tone), 07-selling.md:53 (no blue buttons on selling pages), 10-pages.md:40 (close every section) (read-only)"
---

# Setup (`/setup`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the quoted **Copy**
> blocks are meant for the site. Draft for the Gate A mockup ([D043](../../decisions/D043-all-pages-as-mockups-before-build.md));
> CMO review next; the founder signs off ([D015](../../decisions/D015-founder-signs-off-copy.md)).
> `wt:` = the working tree, read 2026-10-11. **"App demo"** below = the parent app's own setup screens in
> the founder's demo video, as relayed in this group's copy brief; these facts are not yet on an owner
> page (see [Gaps](#gaps)).

## At a glance

| Item | Draft |
|---|---|
| Page job | Day one: get a parent from the box to their child's first conversation, with the wake-up button, the parent app and the child's age, and a person to ask if it sticks |
| Real URL | `/setup` (mockup file `setup.html`) |
| Primary search cluster | **how to set up Kheelu** ([keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13)); secondaries: Kheelona app, connect Kheelu to Wi-Fi |
| Title (42 characters) | How to set up Kheelu on day one · Kheelona |
| Meta description (145 characters) | How to set up Kheelu: charge it, connect it to your home Wi-Fi with the parent app, set your child's age, and show your child the wake-up button. |
| H1 (recommended) | How to set up Kheelu on day one. |
| Mockup meta | `{"title": "How to set up Kheelu on day one · Kheelona", "description": "<meta above>", "url": "/setup", "buybar": false, "active": "", "css": false}` |
| CTA | **No chilli button.** The close links to Contact, plus a "Meet Kheelu" link ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline) /setup row: "Link to contact"; §2: every page ends with the CTA or a link to the product page). `buybar` false, so a reader following steps is not shown a buy bar (founder question 4) |

---

## Fold 1 · Hero

**Fold job:** the whole of day one in one answer, inside the first phone screen.

**Copy:**

> **Eyebrow:** Day one with Kheelu
>
> **H1:** How to set up Kheelu on day one.
>
> **Lede:** Charge Kheelu, then open the parent app on your phone. The app connects Kheelu to your home Wi-Fi and asks for your child's age. Then show your child the wake-up button: one press starts a conversation. Afterwards, you can read every word of it in the app.

- **H1 accent:** `Hand` on "day one".
- The lede is the answer-first block (47 words) for "how do I set up Kheelu?".
- **Image:** none in the hero (the steps carry the page); the belly unit photo sits in fold 5.

**H1 options**

| | H1 | Why |
|---|---|---|
| **A (recommended)** | How to set up Kheelu on day one. | Carries the primary cluster verbatim and the brief's "day one" |
| B | Day one with Kheelu. | The brief's page name; warmer, but the primary then lives only in the title, meta and lede |
| C | Setting up Kheelu, step by step. | Plain; promises steps, which the page delivers |

**Sources, fold 1**

| Claim | Source |
|---|---|
| Charge it; a charger comes in the box | App demo (the app asks the parent to charge Kheelu); [D041](../../decisions/D041-gate-a-round-1.md) (line 30: Kheelu plush toy, charger, quick-start card) |
| The app connects Kheelu to home Wi-Fi | App demo; AI mode runs on home Wi-Fi ([facts, modes](../../product/facts.md#modes-and-connectivity) line 98) |
| The app asks for the child's age | [D036](../../decisions/D036-launch-feature-claims.md) (lines 25-26: a parent enters the age in the app at setup) |
| One press of the wake-up button starts a conversation | [D018](../../decisions/D018-wake-up-button.md) (lines 24-27); [facts, listening](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) (line 124) |
| Read every word in the app | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [facts, parent app](../../product/facts.md#parent-app) (line 151: "the full conversation log word for word") |

---

## Fold 2 · Before you start

**Fold job:** the four things the app asks a parent to have ready, so nothing stops them halfway.

**Copy:**

> **H2:** Before you start.
>
> - Charge Kheelu with the charger in the box. <span class="mk-placeholder">[PLACEHOLDER F4: the charger type, and how long a full charge takes]</span>
> - Have your home Wi-Fi password ready.
> - Stay close to your Wi-Fi router.
> - Keep your phone with you, with the parent app installed. <span class="mk-placeholder">[PLACEHOLDER C6: where to get the parent app: App Store and Google Play links, and the listing name]</span>
>
> Kheelu connects to 2.4 GHz Wi-Fi. If your router shows two network names, choose the 2.4 GHz one.

- **H2 accent:** none (a plain checklist).
- **Icons** (DS, one per item): `battery-charging`, `lock-simple`, `wifi-high`, `download-simple`.
- **Why the app placeholder:** both store listings still use the old name, Lumi, so telling a parent what to search for would send them to a stale listing until C6 is done ([keyword map §7.5](../../research/keyword-map.md#7-geo-plan)). The placeholder holds the links and name.
- The 2.4 GHz note is a practical tip, not a product claim beyond the fact itself. It says nothing about 5 GHz support; if the founder knows Kheelu cannot use 5 GHz, a second sentence can say so.

**Sources, fold 2**

| Claim | Source |
|---|---|
| Charge first; a charger in the box | App demo; [D041](../../decisions/D041-gate-a-round-1.md) (line 30) |
| Have the Wi-Fi password ready; stay near the router | App demo |
| Phone with the parent app | App demo; [facts, parent app](../../product/facts.md#parent-app) (the app sets up the child's age, line 154) |
| 2.4 GHz Wi-Fi | App demo; consistent with the 2.4 GHz radio noted in the [legal requirements](../../product/legal-requirements.md) (H6, line 204) |
| Charger details and charge time unpublished | [facts, in the box](../../product/facts.md#in-the-box) (lines 209-215, F4); [facts, deliberately unpublished](../../product/facts.md#deliberately-unpublished) (battery life, charger) |

---

## Fold 3 · Connect Kheelu to your home Wi-Fi

**Fold job:** the four steps of the connection, in the order the app shows them.

**Copy:**

> **H2:** Connect Kheelu to your home Wi-Fi.
>
> **1 · Open the parent app.**
> Follow the steps on screen. The app walks you through the rest.
>
> **2 · Press and hold the button on Kheelu's back.**
> Hold it for 3 seconds, until the light starts pulsing blue.
>
> **3 · Join Kheelu's own Wi-Fi.**
> When the app asks, connect your phone to Kheelu's own small Wi-Fi network.
>
> **4 · Add your home Wi-Fi.**
> Finish in the app with your home Wi-Fi password. Kheelu then joins your home network.

- **H2 accent:** `Hand` on "home Wi-Fi". The H2 carries the secondary "connect Kheelu to Wi-Fi".
- **Component:** `StepLoop` (four steps, its maximum; steps stack on phones, arrows only on wider screens).
- **Steps 2 to 4 rest on the app demo only** (see [Gaps](#gaps)). Step 4's wording stays close to what the app asks (the password) and says no more about how the password reaches Kheelu.
- **The light's colour:** facts and D018 never name the colour of the light that shows while Kheelu is *listening*, because none was specified. This is a different state (setup), and the colour comes from the app's own instruction. The DS anatomy also describes "a soft blue light ring" (`04-kheelu.md:13`). Founder question 1 confirms it may be named here; if not, step 2 reads "until the light starts pulsing".
- No image (there is no DS back view of Kheelu, `assets/Kheelu/README.md:11`).

**Sources, fold 3**

| Claim | Source |
|---|---|
| The app guides the setup | App demo |
| Press and hold the button on Kheelu's back for 3 seconds until the light pulses blue | App demo; DS anatomy, light ring (`04-kheelu.md:13`) |
| Join Kheelu's own small Wi-Fi network | App demo |
| Finish with the home Wi-Fi password; Kheelu joins the home network | App demo |

---

## Fold 4 · Tell the app your child's age

**Fold job:** the one setting that changes what Kheelu says, plus the other choices the app offers.

**Copy:**

> **H2:** Tell the app your child's age.
>
> You enter your child's age in the parent app. Every reply Kheelu gives passes a safety layer set to that age.
>
> You can change it later. Kheelu picks up the change the next time it's online.
>
> Kheelu is made for children aged 3 to 7. If your child is 3, keep a grown-up nearby while they talk.
>
> While you're in the app, you can also choose your family's languages, pick which topics are open and set quiet hours.

- **H2 accent:** `Hand` on "your child's age".
- "Kheelu picks up the change the next time it's online" also tells a parent, without a separate warning, that a change made while Kheelu is offline (Story mode, no Wi-Fi) waits for the next connection.
- **Not used:** daily summary and parent alerts (wait on counsel's DPDP reading, [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 120); any claim about how well Kheelu understands a 3-year-old (B4: say nothing).
- **Image (optional):** none. The app screenshot is in fold 6, where it shows what a parent reads after the first conversation.

**Sources, fold 4**

| Claim | Source |
|---|---|
| The parent enters the age in the app; it can be changed | [D036](../../decisions/D036-launch-feature-claims.md) (lines 25-26); [facts, parent app](../../product/facts.md#parent-app) (line 154) |
| Every reply passes an age-graded safety layer set to that age | [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) (line 115); [D036](../../decisions/D036-launch-feature-claims.md) (#6) |
| Kheelu picks up the change the next time it's online | App demo |
| Ages 3 to 7 | [facts, age](../../product/facts.md#age) (line 83); [age-band review](../../product/age-band-review.md) |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) (line 33: "with a grown-up nearby" in age and safety answers) |
| Languages, topics, quiet hours in the app | [facts, parent app](../../product/facts.md#parent-app) (lines 150-153: language choice, topic controls, quiet hours; EXTERNAL per D017, lines 160-166) |

---

## Fold 5 · Show your child the wake-up button

**Fold job:** teach the one thing the child needs to know, and what the parent can see while Kheelu listens.

**Copy:**

> **H2:** Show your child the wake-up button.
>
> Kheelu only listens when someone presses its wake-up button. <span class="mk-placeholder">[PLACEHOLDER: where the wake-up button sits on Kheelu]</span>
>
> One press starts a conversation. A light on Kheelu shows whenever it's listening. After about a minute of quiet, it switches itself off, so the next chat starts with another press.
>
> *Image:* Kheelu's tummy unit, close up.

- **H2 accent:** `Hand` on "wake-up button".
- The first sentence is [D018](../../decisions/D018-wake-up-button.md)'s alternative safety heading, as a sentence. The second paragraph is D018's button and light lines, with "about a minute" as D018 requires. No colour is named for the listening light; no "wake word" phrase at all (A10); nothing about what is or is not recorded once a conversation starts (conversations are kept for parents, [D017](../../decisions/D017-live-behaviour-claims-confirmed.md)).
- This replaces the live step "Teach the hello. Show your child how to wake Kheelu up. One word, one friend…" (`wt:src/lib/setup-steps.ts:10`), which implies a wake word and is banned ([claims §4.1](../../product/claims.md#41-the-retired-microphone-wording) row 20).
- **Image:** `kheelu-belly-module.png` (DS: "for setup guides and 'how it works'", `assets/Kheelu/README.md:9`). Alt: "Kheelu's tummy unit up close, with its speaker, light ring and buttons." The caption makes no claim about which button is the wake-up button until the placeholder is filled.

**Sources, fold 5**

| Claim | Source |
|---|---|
| Listens only when someone presses the wake-up button; one press starts a conversation | [D018](../../decisions/D018-wake-up-button.md) (lines 10-12, 24-25, 32-33); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (line 73) |
| A light shows whenever it's listening | [D018](../../decisions/D018-wake-up-button.md) (lines 27-28, 34) |
| Switches itself off after about a minute of quiet; the next conversation needs another press | [D018](../../decisions/D018-wake-up-button.md) (lines 24-27) |
| Tummy unit with speaker, light ring and buttons | DS `04-kheelu.md:13`; `assets/Kheelu/README.md:9` |

---

## Fold 6 · Then let them talk

**Fold job:** hand day one to the child, and show the parent where the conversation will be waiting.

**Copy:**

> **H2:** Then let them talk.
>
> The first conversation is your child's. Kheelu answers, then asks a question back.
>
> Later, open the parent app to read every word of it. You can delete any conversation in one tap.
>
> No Wi-Fi for a while? Story mode's stories, poems and jingles still play. AI mode needs your home Wi-Fi, and Bluetooth mode needs only your paired phone.
>
> *Image:* the parent app's activity screen.
> *Caption:* The parent app's activity screen. The child's name and the activity shown are examples.

- **H2 accent:** `Hand` on "let them talk".
- **Image:** `mockup/assets/app/app-activity.webp` (the real app, from the founder's demo video, with the child's name replaced by "Aarav" and example activity, [log 2026-10-11 11:35](../../log.md)). The file was not yet in `mockup/assets/app/` when this was written; the builder checks the alt against it. Draft alt: "The parent app's activity screen on a phone, showing example activity for one child." The caption is required: the screen is real, the content is not.
- **Optional photo** (one DS child, used once on this page): `advik-02-whispering-to-kheelu`. Alt: "A boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall window." Keep it out of the same row as the app screenshot, so the illustrative child is never read as the "Aarav" in the app.
- The modes line answers the most likely day-one question (does it stop working without Wi-Fi?) per mode, never as a blanket "works offline" ([facts, modes](../../product/facts.md#modes-and-connectivity)).

**Sources, fold 6**

| Claim | Source |
|---|---|
| Answers, then asks a question back | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (line 70) |
| Read every word; delete any conversation in one tap | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (line 72); [gate-a open items](../gate-a-open-items.md) B35 |
| Story mode: stories, poems and jingles, no Wi-Fi needed | [D027](../../decisions/D027-story-mode-wording.md); [facts, modes](../../product/facts.md#modes-and-connectivity) (line 99) |
| AI mode on home Wi-Fi; Bluetooth mode needs only a paired phone | [facts, modes](../../product/facts.md#modes-and-connectivity) (lines 98, 100) |
| The app screenshot and its example content | [log](../../log.md) 2026-10-11 11:35 ("names replaced with 'Aarav' … activity filled with example content") |

---

## Fold 7 · Stuck? Talk to us

**Fold job:** a person to ask, by the channel a parent prefers, and what to tell them.

**Copy:**

> **H2:** Stuck? We'll help.
>
> WhatsApp or call us on +91 91875 46483, or email hello@kheelona.com. Tell us your order number, and what you see on Kheelu and in the app.
>
> [All the ways to reach us] → `contact.html`
>
> Don't have Kheelu yet? [Meet Kheelu] → `meet-kheelu.html`

- **H2 accent:** `Hand` on "We'll help."
- Tone follows the DS error pattern: own it, say what to do (`01-writing.md:92`).
- **Buttons:** "All the ways to reach us" as a secondary button (not chilli, not the app's blue `primary`, which the DS keeps off selling pages, `07-selling.md:53`); "Meet Kheelu" as a text link. The number and email are links (`wa.me/919187546483`, `tel:+919187546483`, `mailto:hello@kheelona.com`), each with a 44 px tap area. No `cta` attributes: neither is a pre-order button.
- No call hours or reply times are promised: none is decided.

**Sources, fold 7**

| Claim | Source |
|---|---|
| WhatsApp or call +91 91875 46483; hello@kheelona.com | [D032](../../decisions/D032-grievance-block-and-call-line.md) (lines 23-25); [facts, support channel](../../product/facts.md#support-channel) (lines 223-224) |
| Close every section with a next step; end with contact or the product page | DS `10-pages.md:40`; [strategy §2](../strategy.md#2-the-parents-journey-and-objections) (line 94), §5 /setup row |

---

## Keyword placements

Primary cluster: **how to set up Kheelu**.

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary near the start | Yes | 42 characters, "How to set up Kheelu" first |
| Meta ≤ 155 with the primary and a concrete fact | Yes | 145; four concrete steps |
| One H1 carrying "set up" | Yes | Recommended H1 A (B does not carry it) |
| Answer-first block, 40 to 60 words, in the first ~100 words | Yes | Hero lede, 47 words |
| An H2 per step / with a close variant | Yes | Folds 3 to 6, one H2 each; fold 3 carries "connect Kheelu to Wi-Fi" |
| "3 to 7" on the page | Yes | Fold 4 |
| Banned words absent (every wake-word phrase, "teach the hello", "toddler", "safe" alone, "works offline" as a blanket) | Yes | None on the page |
| Density: "Kheelu" ≤ 2% | Close | About 11 of about 560 words (2.0%), down from 4.6% live; "it" used where clear. Recheck on the built page |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav | Pre-order Kheelu | `navbar` | Existing (partial) |
| Phone drawer | Pre-order Kheelu | `navbar-mobile` | Existing (partial) |
| Page body | none (contact and product links only) | none | none |

## Placeholders

| Where | Placeholder | Needed |
|---|---|---|
| Fold 2, item 1 | `[PLACEHOLDER F4: the charger type, and how long a full charge takes]` | Final specs (F4); the live page promised charger details before shipping |
| Fold 2, item 4 | `[PLACEHOLDER C6: where to get the parent app: App Store and Google Play links, and the listing name]` | Store links once the listings are renamed from Lumi (C6) |
| Fold 5 | `[PLACEHOLDER: where the wake-up button sits on Kheelu]` | The button's position, and whether it is the same button held during setup (question 2) |

## Gaps

- **The setup flow is not on an owner page yet.** Steps 2 to 4 of fold 3, the 2.4 GHz note, "near the router",
  "know the Wi-Fi password" and "picks up the change the next time it's online" come from the parent app's own
  screens in the founder's demo video, relayed in this group's copy brief. `facts.md` has no setup row. Before
  the build, the main session should add one (with the video timestamps, the app version, and that the video
  stays local), so this page can cite it like every other fact. Until then the CMO reviews these lines as
  relayed, not verified.
- **The app may change before deliveries start** (mid-November, [D023](../../decisions/D023-new-order-delivery.md)). The setup steps should come from one content source the build can update in one place, like the price and delivery values.
- **HowTo structured data:** the live page emits `setupHowTo(SETUP_STEPS)` (`wt:src/app/(site)/setup/page.tsx:31`), whose step 3 is the banned wake-word step ([claims §4.1](../../product/claims.md#41-the-retired-microphone-wording) row 19). The new HowTo uses these steps.

## Questions for the founder (website only)

1. **The light's colour during setup.** The app tells parents to hold the button "until the light pulses blue". The site never names the colour of the light that shows while Kheelu is listening ([D018](../../decisions/D018-wake-up-button.md): not specified). (a) Name "blue" for setup only, as the app does; (b) say "until the light starts pulsing", no colour. **Recommend (a)** if the shipping app says blue: a parent looks for exactly what the app describes. Also please confirm the steps on this page match the app that will ship.
2. **Where is the wake-up button?** And is it the button on Kheelu's back that you hold for setup, or a different one? The page needs one sentence so a parent can show their child.
3. **Where to get the parent app.** The App Store and Google Play links, and the name parents should look for (both listings still say Lumi, C6).
4. **A pre-order button on /setup.** (a) No chilli button: a contact link and a "Meet Kheelu" link (strategy §5, as drafted); (b) add the standard close (button, price sentence, trust line) and the sticky bar, because until deliveries start in mid-November everyone reading this page is still deciding. **Recommend (a):** the page's job is to make day one feel easy, and "Meet Kheelu" already leads to the product page; switch to (b) if PostHog shows `/setup` visits that go nowhere.
