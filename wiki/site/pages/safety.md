---
title: "Safety (/safety): page copy, Gate A mockup draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - "../../qa/cmo-review-built-a-2026-10-14.md (M4: the open FAQ pointed to a collapsed answer; M8: one wording for the age-3 advice; task 7.1b)"
  - ../strategy.md (§3.2-3.5 CTA rules, §4 URL plan, §5 the /safety row, §7 search rules)
  - ../gate-a-open-items.md (working defaults A10, B3, B6, B14, B32, B35, B36)
  - ../../decisions/D017-live-behaviour-claims-confirmed.md, D018, D019, D020, D021, D023, D024, D028, D032, D035, D036, D038, D040, D041, D042, D043
  - ../../product/claims.md (§1, §2, §4, §4.1, §6, §7), ../../product/facts.md, ../../product/pricing.md, ../../product/policies.md, ../../product/age-band-review.md (§2 rows 22-25, §4)
  - ../../brand/messaging.md (confirmed candidate lines, words to stop using), ../../brand/voice.md
  - ../../research/keyword-map.md (§4.1 /safety row, §5.1-5.2, §6.3), ../../research/source-verification.md (C16)
  - ../content-boundary.md, ../tracking-inventory.md (§6), ./home.md (the approved CTA block, sticky bar and safety block)
  - ../../design-system/overview.md; design-system/project/03-cast.md:100-126, assets/Kheelu/README.md, assets/Cast/README.md, 07-selling.md, 10-pages.md (read-only)
  - "Live source refreshed: src/app/(site)/safety/page.tsx (working tree, no local changes to src/ per git status 2026-10-11, so it matches tag archive/pre-reset-2026-10-10)"
  - "wiki/log.md:465 (the real app screenshots: transcript, activity, privacy centre)"
---

# Safety (`/safety`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text in the
> **Copy** blocks is for the site. Everything else is a note for the builder, the CMO Reviewer and QA. All
> copy is a draft until the founder signs it off at Gate A ([D015](../../decisions/D015-founder-signs-off-copy.md),
> [D043](../../decisions/D043-all-pages-as-mockups-before-build.md)).

## How to read this page

- Conventions as on [home.md](home.md#how-to-read-this-page): `{price-source}` = rendered from the single price
  source ([pricing](../../product/pricing.md)): ₹499 `TOKEN_PRICE`, ₹4,500 `BALANCE_PRICE`, ₹4,999 `LAUNCH_PRICE`,
  ₹7,999 `FULL_PRICE`. `{delivery-source}` = the one delivery value (`DELIVERY_TEXT`,
  [D023](../../decisions/D023-new-order-delivery.md)). In the mockup these are `<span data-src="...">`.
- `¹ ²` = source markers ([D026](../../decisions/D026-public-statistics.md); DS gap G-18), as on Home.
- No `[PLACEHOLDER]` is needed on this page (see [Placeholders](#placeholders)).
- Word counts exclude markers.

## At a glance

| Item | Draft |
|---|---|
| Page job | Answer "are AI toys safe?" for a parent of a 3 to 7 year old with facts they can check, in the founder's order, then hand them to the store |
| Real URL | `/safety` (mockup file `safety.html`; nav `active`: `safety`) |
| Primary search cluster | **are AI toys safe** (CMP-1, [keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13)) |
| Secondaries placed | is Kheelu safe (fold 2 H2); is it always listening (fold 2, AL1); does Kheelu have a camera (fold 3); is AI safe for kids (fold 1 lead) |
| Title (45 characters) | Are AI toys safe? How Kheelu works · Kheelona |
| Meta description (152 characters) | Are AI toys safe? Check Kheelu: its mic turns on only when someone presses its button, no camera, no internet browsing, and you read every conversation. |
| H1 | Options in [fold 1](#fold-1--hero-answer-first); recommended **B** "Are AI toys safe? Check ours, fact by fact." |
| CTA | One: the close, **Pre-order Kheelu**, `cta` = `finale`; plus the phone sticky bar (`sticky-bar`), from first paint because there is no hero CTA |
| Mockup meta | `{"title": "Are AI toys safe? How Kheelu works · Kheelona", "description": "<meta above>", "url": "/safety", "buybar": true, "active": "safety"}` |

The meta carries no price: `/safety` is a compare-intent page, not commercial ([keyword map §5.1](../../research/keyword-map.md#5-placement-rules) rule 5).
The word "safe" appears only inside the two questions parents type ("Are AI toys safe?", "Is Kheelu safe for my
child?"); no sentence calls Kheelu safe ([messaging, words to stop using](../../brand/messaging.md#words-to-stop-using)).

---

## Fold 1 · Hero (answer first)

**Fold job:** say, in the first phone screen, that the honest answer is "check", and that this page lets the parent check Kheelu.

**Copy:**

> **Eyebrow:** Safety
>
> **H1:** Are AI toys safe? Check ours, fact by fact.
>
> **Lead (answer-first, 50 words):** Not all of them, so check before you buy one for a child aged 3 to 7. Ask when its microphone is on, how it understands your child, whether it can browse the internet, and whether you can read every conversation. Here's how Kheelu answers each one, in plain words.

- **H1 accent:** `Hand` on "fact by fact."
- **No CTA in the hero** ([strategy §3.3](../strategy.md#33-placement-and-repetition): other pages carry the close
  and the sticky bar). The sticky bar shows from first paint on this page (mockup system, log 2026-10-11 11:30),
  so the first phone screen still has the button and the D028 short price.
- **Image** (under the words on phones): `tara-02-evening-with-amma-web.webp` (DS: "the parent app, family proof";
  Meera's lead message is safety and "the grown-up holds the keys", `03-cast.md:14`, `:118`). Alt: "A girl and
  her mother on a sofa in the evening lamp light, with Kheelu between them." No imagination layer on a safety
  page (DS `02-imagery.md:57`). No keyword in the alt ([keyword map §5.2](../../research/keyword-map.md#52-per-page)).

**H1 options (founder picks; all carry the primary at the start, no outcome claim, "safe" only as the question):**

| | H1 | Why |
|---|---|---|
| A | Are AI toys safe? How Kheelu works. | The brief's own wording; plain; matches the title |
| **B (recommended)** | Are AI toys safe? Check ours, fact by fact. | The hook is an invitation, not a promise: it answers the question the way the page does (mechanisms you can check), and echoes Home's "Safety you can check." |
| C | Are AI toys safe? Here's everything you can check. | Same idea, softer; "everything" slightly overpromises (the provider contracts are not something a parent can read) |
| D | Are AI toys safe? Don't take our word for it. | Strongest hook, but it can read as defensive on a trust page |

**Sources, fold 1**

| Claim | Source |
|---|---|
| "Not all of them" (some AI toys fall short) | [source verification](../../research/source-verification.md) C16, lines 354-358 (Common Sense Media rated 27% of tested AI toys' replies not appropriate for kids; quoted in full in fold 7); [keyword map §6.3](../../research/keyword-map.md#63-safety-safety) AI1 draft, line 549 |
| Ages 3 to 7 | [facts, age](../../product/facts.md#age) line 83; [age-band review](../../product/age-band-review.md) line 41 |
| The four checks named in the lead | [keyword map §6.3](../../research/keyword-map.md#63-safety-safety) AI1 (line 549), reworded so "how it understands your child" replaces "where your child's voice goes" (CMO review F2 on Home, [home.md](home.md) lines 511-516; [D035](../../decisions/D035-model-training-opt-out.md)) |
| Image | DS `03-cast.md:118`; cast are AI-generated characters, never customers (`03-cast.md:5`) |

---

## Fold 2 · Four facts (the D020 order, in full)

**Fold job:** answer "is it always listening, how does it understand my child, can I see it, do you sell it?" in the founder's order, each fact in full.

**Copy:**

> **Eyebrow:** Four facts
>
> **H2:** Is Kheelu safe for my child?
>
> **Lead:** Judge it by what it does. Here are the four facts that matter most, in full.
>
> **1 · Is Kheelu always listening?**
> No. Kheelu has no wake word to listen for. Its microphone turns on only when someone presses the wake-up button. It stays on while your child is talking and switches itself off after about a minute of quiet. Until the next press, nothing is heard, recorded or sent. A light on Kheelu shows whenever it's listening.
>
> **2 · How does Kheelu understand and answer my child?**
> To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so.
>
> **3 · Can I read every conversation?**
> Yes, in the parent app, word for word. Delete any of them in one tap.
>
> **4 · Do you sell my child's data?**
> No. We don't sell your data, and your child's data is never used to advertise to them.

Word counts: 56 · 46 · 15 · 17.

- **H2 accent:** `Hand` on "my child?". The H2 is the keyword map's planned close variant
  ([§5.2](../../research/keyword-map.md#52-per-page)); the lead does not answer "yes": the four facts do.
- **Why question headings here (not Home's statement headings):** `/safety` is the page answer engines read for
  safety ([strategy §7](../strategy.md#7-search-and-ai-visibility-rules-the-pages-follow)), so each fact is an
  answer-first block that feeds FAQPage JSON-LD. The bodies are the same founder lines as Home's block, so
  nothing new is claimed. Component: `TrustList` (one column on phones), `kh-trust__title` for the question.
- **Item 1** is [D018](../../decisions/D018-wake-up-button.md)'s FAQ answer verbatim plus D018's light line (the
  keyword map's AL1). It keeps "Kheelu has no wake word to listen for": Home leaves that phrase out (working
  default A10), but this is the page where parents check listening, and the old page and answer engines still say
  "wake word" (founder question 3). It says nothing about what is kept once a conversation starts: "nothing is
  heard, recorded or sent" is about the off state only (D018).
- **Item 2** is [D020](../../decisions/D020-provider-terms-and-no-sale.md)'s providers line, verbatim and in full,
  training clause included (kept on customer pages by [D041](../../decisions/D041-gate-a-round-1.md)). The question
  names only the reply path, never "where does my child's voice go?", which under
  [D035](../../decisions/D035-model-training-opt-out.md) would promise the voice's whole journey (CMO review F2).
  Nothing on the page mentions training otherwise, and nothing implies there is none.
- **Item 3:** retention has its own fold (fold 5), as the strategy outline asks.
- **Item 4:** "no ads" moved to fold 3's list, so the two lines say different things (data use vs ads shown).
- **Image:** `kheelu-belly-module.png` beside item 1 (DS: "the belly unit (speaker, light ring, buttons)",
  `assets/Kheelu/README.md:9`). Alt: "Kheelu's tummy unit up close, with its speaker, light ring and buttons." The
  copy never says what the light looks like: no colour or pattern is specified, and the DS has no photo of it lit.
- **No CTA here** (strategy §3.3: the close and the sticky bar only on this page).

**Sources, fold 2**

| Claim | Source |
|---|---|
| No wake word | [D018](../../decisions/D018-wake-up-button.md) lines 10-12, 38; [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 73; [facts](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) line 125 |
| Microphone on only after a press of the wake-up button; stays on while the child talks; off after about a minute of quiet; until the next press nothing is heard, recorded or sent | [D018](../../decisions/D018-wake-up-button.md) lines 24-27 and the FAQ draft, lines 38-41 (verbatim); [facts](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) line 124 |
| A light on Kheelu shows whenever it's listening | [D018](../../decisions/D018-wake-up-button.md) lines 27-28, 34 (light line, verbatim) |
| Trusted speech and AI providers, on servers in India; reply only; keep nothing; never train; by contract | [D019](../../decisions/D019-voice-providers.md); [D020](../../decisions/D020-provider-terms-and-no-sale.md) lines 11-17, 22-24 (verbatim); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 74; scope per [D035](../../decisions/D035-model-training-opt-out.md) and [claims](../../product/claims.md) lines 122, 334; kept on customer pages: [D041](../../decisions/D041-gate-a-round-1.md) line 23 |
| Read every conversation, word for word; delete any in one tap | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 72; [facts, parent app](../../product/facts.md#parent-app) lines 150-151 ("the full conversation log word for word") |
| We don't sell your data | [D020](../../decisions/D020-provider-terms-and-no-sale.md) lines 16, 25; [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 75 |
| Never used to advertise to your child | [D038](../../decisions/D038-trust-content-rulings.md) (F17); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 76 |
| The order: button and light, providers, read and delete, no sale | [D020](../../decisions/D020-provider-terms-and-no-sale.md) lines 30-32; [messaging, confirmed candidate lines](../../brand/messaging.md#confirmed-candidate-lines) line 247 |
| Belly unit: speaker, light ring, buttons | DS `assets/Kheelu/README.md:9` |

---

## Fold 3 · What you won't find in Kheelu

**Fold job:** list what Kheelu never has or does, in one glance.

**Copy:**

> **Eyebrow:** Never
>
> **H2:** What you won't find in Kheelu.
>
> - **No camera.** It can't see your child or your home.
> - **No screen.** Your child talks and listens instead of watching.
> - **No open internet.** It can't browse or search the web.
> - **No ads.** Not in the toy, and not in the parent app.
> - **No secrets.** It never asks your child to keep one from you.
>
> [How to choose an AI toy: five checks] → `ai-toys-for-kids-in-india.html`

- **H2 accent:** `Mark` underline on "won't".
- Component: `kh-trustline` or a short `TrustList` with icons (Phosphor Bold: camera-slash, eye-slash or monitor,
  wifi-slash, prohibit, lock, whichever exist in `assets/Icons`; never icons that say "AI").
- "No secrets" here, "says it's a toy" in fold 7 (attachment), so the two founder-confirmed halves are both on the
  page without repeating each other.
- Link closes the section (DS `10-pages.md:34-40`); it is an internal link, not a money CTA, so no `cta` attribute.

**Sources, fold 3**

| Claim | Source |
|---|---|
| No camera; cannot see the child or the home | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 68; [facts, internet and camera](../../product/facts.md#internet-and-camera) line 146; [keyword map §6.3](../../research/keyword-map.md#63-safety-safety) B11, line 566 |
| No screen (screen-free) | [messaging, proof points](../../brand/messaging.md#proof-points) #1, line 196; [facts, identity](../../product/facts.md#identity) line 73 |
| Can't browse or search the internet | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 71; [facts](../../product/facts.md#internet-and-camera) line 144 ("Open internet: No", line 145) |
| No ads in Kheelu or the app | [D038](../../decisions/D038-trust-content-rulings.md) (F17); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 76 |
| Never asks a child to keep a secret from a parent | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 69 (founder, 2026-10-04) |

---

## Fold 4 · The grown-up holds the keys (parent controls)

**Fold job:** show the parent what they control in the app, with a real screen.

**Copy:**

> **Eyebrow:** Parent controls
>
> **H2:** The grown-up holds the keys.
>
> **Lead:** The parent app is where you set the rules.
>
> - **Your child's age.** Enter it when you set Kheelu up, and change it later if you need to. The age-graded safety layer follows it.
> - **Topics.** You choose what's open, and what waits.
> - **Quiet hours.** They're yours to set.
> - **Languages.** Pick the ones you speak at home.
>
> *(real screenshot)* Caption: Real app screens, October 2026. Names changed; some content added for illustration.
>
> [See what the app shows you] → `meet-kheelu.html#app`

- **H2:** the DS's own line for Meera's message ("the grown-up holds the keys", `03-cast.md:14`), also the live
  page's heading (`safety/page.tsx:329`). Accent: `Hand` on "the keys."
- **Image:** `mockup/assets/app/app-privacy.webp` (the real privacy-centre screen from the founder's demo video,
  names replaced, [log](../../log.md) line 465), in the DS phone frame (`kh-device`). Alt: "A real screen from the
  Kheelu parent app: the privacy centre." **The file was not in `mockup/assets/app/` when this copy was written**
  (it is being made in parallel): the builder checks the alt against the image and makes it describe what is
  actually on screen. The list does not claim that the screenshot shows these four controls.
- Never put a DS cast photo beside this real screen, so a "real" caption cannot be read onto an AI-made family.
- **Not here, on purpose:** the weekly report and new-word count (Home fold 5 and the product page own them); the
  daily summary and alerts (wait on counsel, L6, [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed));
  any Kheelona+ line ([D041](../../decisions/D041-gate-a-round-1.md): keep the six-month topic out of most places;
  only where the offer is listed).
- Link: internal, no `cta` attribute.

**Sources, fold 4**

| Claim | Source |
|---|---|
| A parent enters the child's age in the app at setup and can change it; the age-graded safety layer follows it | [D036](../../decisions/D036-launch-feature-claims.md) lines 22, 25-26; [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 115; wording from [claims §3](../../product/claims.md#3-not-confirmed-do-not-publish) line 142 ("say instead") |
| Topic controls, quiet hours, language choice in the parent app | [facts, parent app](../../product/facts.md#parent-app) lines 150-153, 160-166 (EXTERNAL feature by feature under [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); only the daily summary and alerts wait); [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 120; live wording `src/app/(site)/safety/page.tsx:64-69` |
| Real screenshot, privacy centre, names changed, example content | [log](../../log.md) line 465; caption verbatim from the D043 mockup brief |

---

## Fold 5 · How long conversations are kept

**Fold job:** state the retention period and the parent's power to delete sooner, next to the memory claim.

**Copy:**

> **Eyebrow:** Retention
>
> **H2:** How long conversations are kept.
>
> Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. You can delete any of them sooner, in one tap.
>
> Kheelu remembers earlier conversations with your child, and you can read every one of them.
>
> [Read our privacy policy] → `privacy.html`

- **H2 accent:** `Hand` on "kept."
- The retention line is [D020](../../decisions/D020-provider-terms-and-no-sale.md)'s, verbatim. It says
  "conversations", never "recordings": D020 sets the period for transcripts only
  ([messaging #11](../../brand/messaging.md#proof-points)). "Remembers" sits beside the parent's controls, as
  [D036](../../decisions/D036-launch-feature-claims.md)'s copy rule asks.
- The privacy link is where the full data detail, including the training disclosure, lives
  ([D035](../../decisions/D035-model-training-opt-out.md)): pointing there keeps this page from reading as the whole
  story, without stating training on a customer page.

**Sources, fold 5**

| Claim | Source |
|---|---|
| 36 months, then deleted automatically; delete any sooner in one tap | [D020](../../decisions/D020-provider-terms-and-no-sale.md) lines 18-19, 26-27 (verbatim); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 78; [facts](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) line 132 |
| Kheelu remembers earlier conversations | [D036](../../decisions/D036-launch-feature-claims.md) line 17 (placement rule lines 30-31); [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 118 (never "long-term memory") |
| Read every conversation | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 72 |

---

## Fold 6 · Toy-safety certification

**Fold job:** say plainly where certification stands, with no mark and no badge.

**Copy:**

> **Eyebrow:** Certification
>
> **H2:** Toy-safety certification: where it stands.
>
> We have applied for Kheelu's BIS licence for toy safety. It has not been granted yet, so no toy-safety certificate has been issued to us so far. Until one is, you won't see a mark or a badge from us.

- No ISI wording, no standard number, no date, no "before Kheelu ships" promise: a BIS line with the licence
  number appears only after grant ([legal requirements](../../product/legal-requirements.md) BIS-02; the live
  "before Kheelu ships" promise is not carried over, because the founder has not committed to a date).
- The live "standards we build against" chips (COPPA, GDPR-K, DPDP "Designed for"; ISO 27001 "In progress") are
  dropped (working default B36). The live "Safe in their hands" heading is dropped ("safe" alone).
- **No image, no link** needed beyond the section close; DS asks every section to close with a button or link, so
  the builder may add "Questions? WhatsApp or call +91 91875 46483" as the inline help line here, or leave the
  section to flow into the FAQ. Recommended: no link (the FAQ follows directly).

**Sources, fold 6**

| Claim | Source |
|---|---|
| BIS licence applied for, not granted (no licence number yet) | [claims §6](../../product/claims.md#6-certifications) line 309 (founder, 2026-10-11, L1: "applied for, not yet granted" is EXTERNAL); [messaging #32](../../brand/messaging.md#proof-points) line 227 |
| No toy-safety certificate issued yet; no badge before it is earned | [claims §6](../../product/claims.md#6-certifications) line 308 (the honest "none issued yet" status is EXTERNAL; live wording "no badge is claimed before it is earned", `src/lib/product-facts.ts:89-92`) |

---

## Fold 7 · Questions parents ask

**Fold job:** answer the two hard questions left: a 3-year-old, and what child-safety groups say.

**Copy:**

> **Eyebrow:** Questions
>
> **H2:** Questions parents ask.
>
> **Is Kheelu OK for a 3-year-old?** *(open by default)*
> Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play. Common Sense Media advises against AI toys at this age. Its advice in full, and our answer, are in the next question.
>
> **What do child-safety groups say about AI toys?**
> In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as "smart toys with voice-based interactions", to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.¹ We make Kheelu for ages 3 to 7, so you should hear this from us.
>
> When it tested three AI toys, it rated 27% of their replies as not appropriate for kids. It also raised concerns about toys designed to create emotional attachment, the data they collect and how reliably they work.²
>
> Here is what Kheelu does about each concern:
> - **Replies:** its answers come from a curated, closed content library, and every reply passes an age-graded safety layer. When it doesn't know something, it says so. Before launch, we test it by trying to make it say things it shouldn't. You can read every conversation.
> - **Attachment:** Kheelu tells your child it's a toy, and it never asks them to keep a secret from you.
> - **Data:** the four facts at the top of this page. We don't sell your data.
> - **How well it works:** if it isn't right for your family, return it within 7 days of delivery, no questions asked.
> - **At 3:** keep a grown-up nearby while they play.
>
> **Sources**
> ¹ Common Sense Media, "Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks" (press release), 2026, paragraph 1. https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks
> ² Common Sense Media Youth AI Safety Institute, "AI Toys" (risk assessment), 2026, "What we found". https://institute.commonsensemedia.org/risk-assessments/ai-toys
>
> [How to choose an AI toy] → `ai-toys-for-kids-in-india.html`

Word counts: 53 · first block 57 (the answer-first part: the C16 sentence and our one line), then the detail.
(Approved at 50; task 7.1b's M4 sentence adds three words.)

- **H2 accent:** `Hand` on "ask."
- `FAQ` component; **first item open** (DS: first item open on safety pages). Both answers, exactly as shown, join
  fold 2's four in the page's FAQPage JSON-LD.
- **Question 1 points to question 2 as "the next question", not to text "below" (task 7.1b, CMO review A M4).** Question 2
  is closed when the page loads, so question 1 says its answer is "in the next question", not that it "follows
  below". That way a parent who reads the warning knows to open question 2 for our answer. The JSON-LD keeps the
  same order (question 1, then question 2), so "the next question" stays true there.
- **The age-3 advice uses the site's one wording (task 7.1b, CMO review A M8):** "If your child is 3, keep a
  grown-up nearby while they play." Under the "At 3:" lead, the bullet keeps just the instruction, "keep a grown-up
  nearby while they play.", so it does not say "3" twice.
- **Question 2 is drafted as "the one signed answer"** the age-band review asks for
  ([§4](../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band)), to be reused on the journal's
  safety article. It runs on the main session's working default B3 ("cite it in full, with one signed answer
  reused everywhere", [Gate A open items](../gate-a-open-items.md) line 60), not on a founder decision, so it is
  founder question 1. The Common Sense Media paragraphs are the verified C16 line verbatim
  ([source verification](../../research/source-verification.md) lines 354-361); the toys tested are never named.
  Each bullet restates only confirmed facts; some repeat other folds on purpose, because this answer must stand
  alone wherever it is reused.
- The "At 3" advice is the founder's ([D041](../../decisions/D041-gate-a-round-1.md) line 33). Nothing is said
  about how well Kheelu understands a 3-year-old's speech (working default B4).
- No speech or language question here ([D025](../../decisions/D025-speech-and-language.md)).
- **Not used, on purpose:** "Will my child think Kheelu is a person?" (AI6; its facts are in fold 3 and the
  attachment bullet); "Is Kheelu always listening?" as a separate FAQ (fold 2 item 1 already is that answer);
  "Where does my child's voice go?" (VP1: the D035 problem above). Re-read both Common Sense Media pages before
  publishing ([source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).
- **Image (laptop, beside the FAQ; under it on phones):** `advik-02-whispering-to-kheelu-web.webp` (DS: "trust",
  `03-cast.md:108`). Alt: "A boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall
  window." Never beside the Common Sense Media quote as if he were a tested child: place it by the heading.

**Sources, fold 7**

| Claim | Source |
|---|---|
| Made for 3 to 7; not a toy for children under 3 | [facts, age](../../product/facts.md#age) line 83; [keyword map §7.1](../../research/keyword-map.md#7-geo-plan) ("3 to 7; not for under 3"); approved Home FAQ, [home.md](home.md) lines 598-599 |
| At 3, keep a grown-up nearby while they play (both places) | [D041](../../decisions/D041-gate-a-round-1.md) line 33 ("with a grown-up nearby" in age and safety answers); the one wording: [CMO review A](../../qa/cmo-review-built-a-2026-10-14.md) M8 |
| Its advice in full, and our answer, are in the next question | Fold 7's own order (question 2 follows question 1); [CMO review A](../../qa/cmo-review-built-a-2026-10-14.md) M4 (the CMO's own wording) |
| Common Sense Media's advice, the 27% finding, its concerns | [source verification](../../research/source-verification.md) C16, lines 349-361 (verified line, verbatim; status EXTERNAL IF CONFIRMED, used here on working default B3, [Gate A open items](../gate-a-open-items.md) line 60); [age-band review §4](../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band) lines 113-132 |
| Curated, closed content library | [D036](../../decisions/D036-launch-feature-claims.md) line 21; [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 114 (Gate A flag honoured: Kheelu is called an AI toy on the page and the providers line is in fold 2, so nothing suggests no AI model is involved) |
| Every reply passes an age-graded safety layer | [D036](../../decisions/D036-launch-feature-claims.md) line 22; [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 115 |
| Says when it doesn't know | [D036](../../decisions/D036-launch-feature-claims.md) line 18; [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 117 |
| Tested before launch by trying to make it say unsafe things | [D036](../../decisions/D036-launch-feature-claims.md) line 23 (red-teamed); [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 116 |
| Says it is a toy; never asks a child to keep a secret | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 69 |
| We don't sell your data | [D020](../../decisions/D020-provider-terms-and-no-sale.md) line 25 |
| Return within 7 days of delivery, no questions asked | [D021](../../decisions/D021-returns-policy.md) lines 11, 19-20; [policies](../../product/policies.md#decided-for-the-new-site) line 104 |
| Image | DS `03-cast.md:108` |

---

## Fold 8 · Close

**Fold job:** the one action, with the price sentence, delivery and returns beside it, and a person to ask.

**Copy:**

> **Eyebrow:** Pre-order
>
> **H2:** Check it all for yourself, at home.
>
> The wake-up button, the light and every conversation in the parent app: you can check each one once it's home.
>
> **[Pre-order Kheelu]** → `store.html` (real: `https://store.kheelona.com`, `PREORDER_HREF`, same tab)
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked
>
> Questions? WhatsApp or call +91 91875 46483

- **CTA:** `Button cta l block` on phones, `cta` = `finale` (existing value: every page's FinaleCTA,
  [tracking inventory §6](../tracking-inventory.md#6-posthog-in-the-browser) line 281).
- **Full mode:** the price sentence becomes "₹7,999`{price-source}` (incl. GST), paid in full when you order."
  Everything else unchanged ([home.md, CTA block](home.md#cta-block)).
- **Links:** "Deliveries start mid-November" → `shipping.html`; "7-day returns, no questions asked" → `refund.html`;
  WhatsApp → `https://wa.me/919187546483`; call → `tel:+919187546483` (as on Home).
- **H2 accent:** `Hand` on "at home."
- **One chilli button per phone view:** the sticky bar must step aside while this button is on screen (see
  [Notes for the builder](#notes-for-the-builder)).
- **Image:** a `kh-art` board (one brand block, one shape, `ira-sticker.png` bottom-aligned, `kheelu-front-sticker.png`
  tilted, one doodle), as Home's close. `role="img"` label: "A girl in a pink embroidered kurta beside Kheelu, the
  cream plush rabbit." (Ira's sticker is cut from her portrait, `03-cast.md:116`; the builder confirms the outfit
  against the file.)

**Sources, fold 8**

| Claim | Source |
|---|---|
| Label "Pre-order Kheelu", no price on the button | [D041](../../decisions/D041-gate-a-round-1.md) line 16; [strategy §3.1](../strategy.md#31-the-one-action-and-its-label-gate-a-g1) |
| Price sentence, option (d) | [D041](../../decisions/D041-gate-a-round-1.md) line 18; [D028](../../decisions/D028-price-wording.md); amounts: [pricing](../../product/pricing.md) lines 68-72 |
| Refundable until dispatch | [policies](../../product/policies.md#status-at-a-glance) line 74 |
| Full mode: ₹7,999 paid in full | [pricing](../../product/pricing.md) line 69 |
| Deliveries start mid-November | [D023](../../decisions/D023-new-order-delivery.md) lines 10-14; [facts, ship date](../../product/facts.md#ship-date) line 189 |
| 7-day returns, no questions asked | [D021](../../decisions/D021-returns-policy.md) line 19 |
| WhatsApp or call +91 91875 46483 | [D032](../../decisions/D032-grievance-block-and-call-line.md); [facts, support channel](../../product/facts.md#support-channel) line 223 |
| The button, the light and the conversations can be checked at home | fold 2 sources (D018 button and light; D017 read every conversation) |

---

## Phone sticky bar, nav and footer (shared partials, not rewritten)

- Sticky bar (D041 line 27, [home.md](home.md#phone-sticky-bar)): price "₹499`{price-source}` today", note
  "refundable · ₹4,999`{price-source}` total (incl. GST)", cta "Pre-order Kheelu", `cta` = `sticky-bar`. On this page
  it shows from first paint (no hero CTA) and steps aside while the close's button is on screen.
- Nav: Meet Kheelu · **Safety** (active) · Stories · Team, plus Pre-order Kheelu (`navbar`; drawer `navbar-mobile`).
- Footer: as on Home ([home.md, footer](home.md#footer)).

---

## Keyword placements

Primary cluster for `/safety`: **are AI toys safe** ([keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13), line 219).

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60 characters, primary near the start | Yes | 45 characters, primary first |
| Meta ≤ 155: primary, a concrete fact | Yes | 152; primary first; facts: the button, no camera, no browsing, read every conversation (the keyword map's "no camera") |
| One H1 carrying the primary | Yes | All four options start "Are AI toys safe?" |
| Primary in an answer-first block in the first ~100 words | Yes | H1 (question) plus the 50-word lead that answers it |
| "3 to 7" in the first screen | Yes | Lead, sentence 1 |
| An H2 with a close variant | Yes | Fold 2: "Is Kheelu safe for my child?" |
| Answer-first blocks, 40 to 60 words | Yes | Lead (50); fold 2 items 1 and 2 (56, 46); FAQ (53, was 50 before task 7.1b; 57 before the detail) |
| Alt text: no keyword where it isn't true | Yes | No alt carries the primary |
| Words never placed (toddler, best friend, tutor, lessons, adapts, wake-word lines, competitor names, "safe" as a claim, "region-pinned", "own servers", COPPA labels, health terms) | Yes | "No wake word" is the corrective form D018 allows, not a wake-word line (founder question 3) |
| Density: primary 0.5% to 2% | Yes, at the floor | 1 occurrence (H1) of 4 words in about 830 words of `<main>` = about 0.5% |
| Density: "Kheelu" ≤ 2% | About 2.1% | About 18 of about 830 words, mostly in founder-verbatim lines (D018, D020) and FAQ answers that must stand alone. QA re-measures on the built page; if over, swap "Kheelu" for "it" in the fold 3 heading and the fold 7 bullet first |

---

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New (named on Home) |
| Laptop nav / phone drawer | Pre-order Kheelu | `navbar` / `navbar-mobile` | Existing (partials) |
| Internal links (fold 3, 4, 5, 7) | How to choose an AI toy · See what the app shows you · Read our privacy policy | none | Not money CTAs |

---

## Placeholders

None. Every claim on the page has a source above. Items that would have needed one are left off by rule:
battery and materials (F4), box contents (not on this page), Kheelona+ after six months (D041), the daily summary
and alerts (counsel, L6), training (D035: terms and privacy only).

---

## Questions for the founder (website only, D030)

1. **Common Sense Media on `/safety` (working default B3, needs your sign-off).** (a) Cite its January 2026
   advice in full inside the FAQ, with the drafted answer (what Kheelu does about each concern; "at 3, a grown-up
   nearby"), and reuse the same answer in the journal's safety article; (b) leave it off the site; (c) cite it
   only in the journal article. **Recommend (a):** the advice is public, answer engines already repeat it, and a
   parent who finds it after reading our page would trust us less for leaving it out. The drafted answer states
   only confirmed facts and never names the toys tested.
2. **The `/safety` H1.** Options A to D in [fold 1](#fold-1--hero-answer-first). **Recommend B**, "Are AI toys
   safe? Check ours, fact by fact."; A if you prefer the brief's plain wording.
3. **"No wake word" on this page.** Home leaves the phrase out (A10). Here, D018's own FAQ answer opens "Kheelu
   has no wake word to listen for." (a) Keep it on `/safety` only, where parents check listening and where the
   old page and answer engines still say "wake word"; (b) drop it here too. **Recommend (a)**; the build's
   banned-phrase guard then needs a `/safety` exception for "no wake word".
4. **The open FAQ that pointed to a closed answer (new, task 7.1b; [CMO review A](../../qa/cmo-review-built-a-2026-10-14.md)
   M4; for the CMO, then your sign-off, D015).** (a) The copy fix, now in the Copy block: "Its advice in full, and
   our answer, are in the next question." Only the words change: one text-parity row, the first item stays open as
   the DS asks, and the fold stays short on phones. (b) The builder opens both items and the copy keeps "follow
   below". This needs a FaqSection change (all-open or per-item `open`) and a deviation row, breaks the DS's
   first-item-open pattern for safety pages, and on a phone makes the fold longer by the whole second answer, its five
   bullets and the two sources. (c) Both. **Recommend (a):** it fixes what the parent reads at the smallest cost,
   needs no component change and keeps the DS pattern.

---

## Notes for the builder

- **Sticky bar and the close button:** the shared bar rule is "stays until the OfferCard's own button shows"
  (D041). This page has no OfferCard, so the bar must also step aside while the close's `finale` button is on
  screen, or a phone view shows two chilli buttons (shared change to `mockup.js`/partials: a request for the main
  session, not something this page may edit).
- **Source markers** (DS gap G-18): one note under fold 7, two markers; same pattern as Home's fold 3.
- **App screenshot:** `mockup/assets/app/app-privacy.webp` did not exist at copy time; check the alt against it.
- **Live page changes, for the record:** the live H1 "Safe in their hands. Careful with their words.", "Region-pinned",
  "Parent-consented", "Nothing leaves without consent", the wake-word rules, "on-device and cloud filters", the
  "toddlers" FAQ, the unsigned "OK for a three-year-old?" answer and the frameworks chips are all gone (claims
  §4, §4.1 rows 2-5 and 21; age-band review rows 22-25; working defaults B6, B36).

---

## Changes after approval (task 7.1b)

Applied from the CMO's built-page review of 2026-10-14 ([group A](../../qa/cmo-review-built-a-2026-10-14.md), M4
and M8). The founder signs off copy ([D015](../../decisions/D015-founder-signs-off-copy.md)), and the review lists
both under "Copy changes M4 (wording option) … and M8 need your sign-off". Every other line of the Copy blocks stays
word for word as approved at Gate A ([D046](../../decisions/D046-gate-a-approved.md)). No new claim, and the age band
stays 3 to 7.

- **Fold 7, question 1, last sentence (CMO review A M4).** "Its advice in full, and our answer, follow below."
  becomes "Its advice in full, and our answer, are in the next question." This is the CMO's own wording. On the
  built page question 1 is open and question 2 is closed, so a parent read the warning while our answer stayed
  hidden "below". The new sentence tells them where the answer is. The other fix the CMO offered, the builder
  opening both items, is [question 4](#questions-for-the-founder-website-only-d030); I recommend the copy fix.
- **Fold 7, question 1, the age-3 sentence (CMO review A M8).** "If your child is 3, we advise play with a grown-up
  nearby." becomes "If your child is 3, keep a grown-up nearby while they play.", the one wording M8 asks for. The
  journal articles already use these exact words. Same source: [D041](../../decisions/D041-gate-a-round-1.md)
  line 33.
- **Fold 7, question 2, the "At 3:" bullet (CMO review A M8).** "we advise play with a grown-up nearby." becomes
  "keep a grown-up nearby while they play.", the same wording as question 1 without repeating "If your child is 3"
  under the "At 3:" lead.
- **Notes kept true:** question 1 is 53 words (was 50; still inside 40 to 60). The fold 7 notes and source rows and
  the keyword placements row are updated to match. The page total (about 830 words), "Kheelu" count (18), primary
  density, title, meta description, H1 and the hero's answer-first block are unchanged. There are still no
  placeholders.
- **For the builder (not edited here):** `src/content/en-IN/faqs.ts:125` (`age-three`, the whole answer as above)
  and `:151` (`child-safety-groups`, the "At 3:" item's text). The Storybook copy of both is in
  `src/components/sections/FaqSection/FaqSection.stories.tsx:49` and `:63`. `src/content/en-IN/pages/safety.ts:172`
  keeps `firstOpen: true`. Neither FAQ is in `llms.txt` (`src/app/llms.txt/route.ts:42-53` lists other ids), so no
  machine-file hash changes because of this page.
- **Deviations for the main session to list at the merge** (`safety` key): the frozen mockup
  (`mockup/safety.html:173` and `:183`) still reads "If your child is 3, we advise play with a grown-up nearby. …
  follow below." and "we advise play with a grown-up nearby." Both lines now differ from it on purpose.
