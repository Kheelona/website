---
title: "Safety (/safety): page copy, Gate A mockup draft"
type: page-copy
updated: 2026-10-16
cites_at: archive/pre-reset-2026-10-10
sources:
  - "../../qa/cmo-review-built-a-2026-10-14.md (M4: the open FAQ pointed to a collapsed answer; M8: one wording for the age-3 advice; task 7.1b)"
  - "../../qa/cmo-review-copy-fixes-7.1b-2026-10-14.md (minor 1 and the section \"M8: the one wording\": the CMO's pick, \"If your child is 3, keep a grown-up nearby.\")"
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
  - "../../decisions/D058-follow-the-live-code-check-2026-10-14.md (items 1, 6, 7, 9: the live team's code check of 12 Oct; task 8b.1)"
  - "../../qa/live-main-reconciliation-2026-10-14.md (§2 the claims #19 withdrew, c630a49; §1 rows P5, P10-P12, #18, dd04e6d), quoted there; origin/main not read directly in task 8b.1 (no shell in that run)"
  - "../../qa/cmo-review-claims-8b.1-2026-10-14.md (round 2 of task 8b.1: m8 and m12 applied; m6 and m11 as questions 11 and 6)"
  - "../../engineering/tasks.md (8b.1b: the main session's ruling on fold 4's alt, 2026-10-14)"
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
> No. Kheelu has no wake word to listen for. Its microphone turns on only when someone presses the wake-up button. It stays on while your child is talking and switches itself off after a couple of minutes of quiet. Until the next press, nothing is heard, recorded or sent. A light on Kheelu shows whenever it's listening.
>
> **2 · How does Kheelu understand and answer my child?**
> To understand and answer your child, Kheelu uses trusted speech and AI providers. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so.
>
> **3 · Can I read every conversation?**
> Yes, in the parent app, word for word, a few minutes after each one ends. Delete them all by deleting your account.
>
> **4 · Do you sell my child's data?**
> No. We don't sell your data, and your child's data is never used to advertise to them.

Word counts: 57 · 42 · 22 · 17 (task 8b.1; approved at Gate A as 56 · 46 · 15 · 17).

- **H2 accent:** `Hand` on "my child?". The H2 is the keyword map's planned close variant
  ([§5.2](../../research/keyword-map.md#52-per-page)); the lead does not answer "yes": the four facts do.
- **Why question headings here (not Home's statement headings):** `/safety` is the page answer engines read for
  safety ([strategy §7](../strategy.md#7-search-and-ai-visibility-rules-the-pages-follow)), so each fact is an
  answer-first block that feeds FAQPage JSON-LD. The bodies are the same founder lines as Home's block, so
  nothing new is claimed (since task 8b.1, as D058 corrects them; Home's block should take the same words). Component: `TrustList` (one column on phones), `kh-trust__title` for the question.
- **Item 1** is [D018](../../decisions/D018-wake-up-button.md)'s FAQ answer verbatim plus D018's light line (the
  keyword map's AL1), except that "about a minute of quiet" is now "a couple of minutes of quiet", the live team's
  code-checked figure ([D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1; task 8b.1). It keeps "Kheelu has no wake word to listen for": Home leaves that phrase out (working
  default A10), but this is the page where parents check listening, and the old page and answer engines still say
  "wake word" (founder question 3). It says nothing about what is kept once a conversation starts: "nothing is
  heard, recorded or sent" is about the off state only (D018).
- **Item 2** is [D020](../../decisions/D020-provider-terms-and-no-sale.md)'s providers line in full,
  training clause included (kept on customer pages by [D041](../../decisions/D041-gate-a-round-1.md)), less ", on
  servers in India": [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 6 withdrew it (some
  processors work outside India; `/privacy` names them). The providers' promise (reply only, keep nothing, never
  train, by contract) is unchanged (D058; D020 items 1-4). No place is named here: "through Kheelona's servers" would
  let "They don't keep it" read as our servers, which do keep conversations for the parent app (question 7). The question
  names only the reply path, never "where does my child's voice go?", which under
  [D035](../../decisions/D035-model-training-opt-out.md) would promise the voice's whole journey (CMO review F2).
  Nothing on the page mentions training otherwise, and nothing implies there is none.
- **Item 3:** retention has its own fold (fold 5), as the strategy outline asks. One-tap delete is gone (D058 item 1):
  the app shows each conversation "a few minutes after it ends", and in the app a parent deletes conversations by
  deleting the account, in the live team's words "Delete it all by deleting your account" (map §2; #18 adds "or write
  to us", map P11, which `/privacy` carries). Fold 5 says what removing a chat does and everything deleting the
  account deletes.
- **Item 4:** "no ads" moved to fold 3's list, so the two lines say different things (data use vs ads shown).
- **Image:** `kheelu-belly-module.png` beside item 1 (DS: "the belly unit (speaker, light ring, buttons)",
  `assets/Kheelu/README.md:9`). Alt: "Kheelu's tummy unit up close, with its speaker, light ring and buttons." The
  copy never says what the light looks like: no colour or pattern is specified, and the DS has no photo of it lit.
- **No CTA here** (strategy §3.3: the close and the sticky bar only on this page).

**Sources, fold 2**

| Claim | Source |
|---|---|
| No wake word | [D018](../../decisions/D018-wake-up-button.md) lines 12-14, 40; [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 73; [facts](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) line 125 |
| Microphone on only after a press of the wake-up button; stays on while the child talks; until the next press nothing is heard, recorded or sent | [D018](../../decisions/D018-wake-up-button.md) lines 26-29 and the FAQ draft, lines 40-43 (verbatim); [facts](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) line 124 |
| Off after a couple of minutes of quiet | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1 (line 29: "a conversation ends after a couple of minutes of quiet"); D018's narrowing note, line 10; [map](../../qa/live-main-reconciliation-2026-10-14.md) §2, lines 64 and 80 (c630a49) |
| A light on Kheelu shows whenever it's listening | [D018](../../decisions/D018-wake-up-button.md) lines 29-30, 36 (light line, verbatim) |
| Trusted speech and AI providers; reply only; keep nothing; never train; by contract | [D019](../../decisions/D019-voice-providers.md); [D020](../../decisions/D020-provider-terms-and-no-sale.md) lines 13-17, 24-26 (verbatim less the place); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 74; scope per [D035](../../decisions/D035-model-training-opt-out.md) and [claims](../../product/claims.md) lines 122, 334; kept on customer pages: [D041](../../decisions/D041-gate-a-round-1.md) line 23. "On servers in India" withdrawn: [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 6 (lines 41-43); D020's narrowing note, line 10; [map](../../qa/live-main-reconciliation-2026-10-14.md) §2, line 79 |
| Read every conversation, word for word | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 72; [facts, parent app](../../product/facts.md#parent-app) lines 150-151 ("the full conversation log word for word"); [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 8 (line 45) |
| A few minutes after each one ends | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1 (lines 31-32: "conversations readable a few minutes after they end"); [map](../../qa/live-main-reconciliation-2026-10-14.md) lines 91-92 (c630a49) |
| Delete them all by deleting your account (no one-tap delete) | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1 (lines 25-26); D017's narrowing note, line 10; [map](../../qa/live-main-reconciliation-2026-10-14.md) §2, line 77 ("Delete it all by deleting your account"), §1 rows P10-P12, lines 39-41 (dd04e6d) |
| We don't sell your data | [D020](../../decisions/D020-provider-terms-and-no-sale.md) lines 18, 27; [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 75 |
| Never used to advertise to your child | [D038](../../decisions/D038-trust-content-rulings.md) (F17); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 76 |
| The order: button and light, providers, read and delete, no sale | [D020](../../decisions/D020-provider-terms-and-no-sale.md) lines 32-34 ("read and delete" now reads "read, and delete by deleting the account", D058 item 1); [messaging, confirmed candidate lines](../../brand/messaging.md#confirmed-candidate-lines) line 247 |
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
> - **No web browsing.** It can't browse or search the web.
> - **No ads.** Not in the toy, and not in the parent app.
> - **No secrets.** It never asks your child to keep one from you.
>
> [How to choose an AI toy: five checks] → `ai-toys-for-kids-in-india.html`

- **H2 accent:** `Mark` underline on "won't".
- Component: `kh-trustline` or a short `TrustList` with icons (Phosphor Bold: camera-slash, eye-slash or monitor,
  wifi-slash, prohibit, lock, whichever exist in `assets/Icons`; never icons that say "AI").
- "No secrets" here, "says it's a toy" in fold 7 (attachment), so the two founder-confirmed halves are both on the
  page without repeating each other.
- **"No web browsing." (task 8b.1 round 2; question 5, option (a); [CMO review of task 8b.1](../../qa/cmo-review-claims-8b.1-2026-10-14.md)
  m12).** The title was "No open internet.". The live team changed the footer's same words to "No web browsing."
  because Kheelu does use the internet, on home Wi-Fi (c630a49; [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md)
  item 1), and the same reason applies here. The body is unchanged, and the title now says exactly what it says.
- Link closes the section (DS `10-pages.md:34-40`); it is an internal link, not a money CTA, so no `cta` attribute.

**Sources, fold 3**

| Claim | Source |
|---|---|
| No camera; cannot see the child or the home | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 68; [facts, internet and camera](../../product/facts.md#internet-and-camera) line 146; [keyword map §6.3](../../research/keyword-map.md#63-safety-safety) B11, line 566 |
| No screen (screen-free) | [messaging, proof points](../../brand/messaging.md#proof-points) #1, line 196; [facts, identity](../../product/facts.md#identity) line 73 |
| No web browsing; can't browse or search the internet | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 71; [facts](../../product/facts.md#internet-and-camera) line 144 ("Open internet: No", line 145); the title's words: the live footer's "No web browsing." ([D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1; [map](../../qa/live-main-reconciliation-2026-10-14.md) §2, line 86, c630a49) |
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
> - **Your child's age.** Enter it when you set Kheelu up, and change it later if you need to. On every conversation, the AI model that answers your child is given that age and child-safety rules.
> - **Languages.** Pick the ones you speak at home.
> - **Voice recordings.** Turn off Save voice recordings, and only the written record of each conversation is kept.
>
> *(real screenshot)* Caption: The Kheelona app is live on Apple’s App Store and the Google Play Store. ([D046](../../decisions/D046-gate-a-approved.md)'s caption; the mockup and the build carry it.)
>
> [See what the app shows you] → `meet-kheelu.html#app`

- **H2:** the DS's own line for Meera's message ("the grown-up holds the keys", `03-cast.md:14`), also the live
  page's heading (`safety/page.tsx:329`). Accent: `Hand` on "the keys."
- **Image:** `mockup/assets/app/app-privacy.webp` (the real privacy-centre screen from the founder's demo video,
  names replaced, [log](../../log.md) line 465), in the DS phone frame (`kh-device`). Alt (task 8b.1b, with the CMO's
  m3 of 2026-10-14): "A real screen from the Kheelu parent app: the privacy centre. Chats are kept for 36 months, with a
  switch to save voice recordings and a button to download your child's data." (36 is `RETENTION_MONTHS`.) It leaves out the screen's "delete all chats" button, which hides chats on
  that phone ([D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1), as Home's and the product
  page's alts do (task 8b.1). **The file was not in `mockup/assets/app/` when this copy was written** (it was made
  in parallel): the builder checked the alt against the image. The list does not claim that the screenshot shows
  these controls.
- Never put a DS cast photo beside this real screen, so a "real" caption cannot be read onto an AI-made family.
- **Task 8b.1 ([D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md)):** "Topics" and "Quiet hours"
  are gone: neither is in the app (the live team's code check, c630a49; D058 item 1). The age line no longer names an
  "age-graded safety layer": the AI model is given the child's age and child-safety rules on every conversation (D058
  item 1; Google's filters are named in fold 7's answer). Since round 2 the sentence says "is given that age and
  child-safety rules" (was "is given it, with child-safety rules", where "it" sat far from "age"; CMO review of task
  8b.1, m8): `/setup` fold 4's wording, without the filters. "Languages" stays word for word (D058 item 7; it names no
  number). "Voice recordings" is new: the "Save voice recordings" switch is among what D058 item 1 brings in from the
  live team's code check, and it is the one parent control in the app's privacy settings this fold can name (map §1
  P5, P10; [D044](../../decisions/D044-app-screens-on-the-site.md) line 20: "off keeps text only"). It depends on
  backend-service PR #39 reaching production (map §1, line 22; question 9). Icon: `microphone-slash` (DS
  `assets/Icons`).
- **Not here, on purpose:** the weekly report and the new-word count (withdrawn, D058 items 1 and 8); the app's
  report as D058 item 8 describes it (the product page owns it); alerts (none are in the app, map §2 line 66); the
  daily talk-time limit and "when Kheelu rests, its WiFi is switched off" (code-checked, but their live sentences were
  not read in this pass: question 8); any Kheelona+ line ([D041](../../decisions/D041-gate-a-round-1.md): keep the
  six-month topic out of most places; only where the offer is listed).
- Link: internal, no `cta` attribute.

**Sources, fold 4**

| Claim | Source |
|---|---|
| A parent enters the child's age in the app at setup and can change it | [D036](../../decisions/D036-launch-feature-claims.md) lines 27-28 |
| On every conversation, the AI model that answers your child is given that age and child-safety rules | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1 (lines 27-28: "replies are generated by an AI model given child-safety rules and the child's age on every conversation"); D036's narrowing note, line 10; [map](../../qa/live-main-reconciliation-2026-10-14.md) §2, lines 76 and 83 (c630a49) |
| Language choice in the parent app | [facts, parent app](../../product/facts.md#parent-app) lines 150-153 (EXTERNAL under [D017](../../decisions/D017-live-behaviour-claims-confirmed.md)); kept as the rebuild has it: [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 7 (line 44) |
| No topic controls, no quiet hours (both removed) | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1 (line 29); [map](../../qa/live-main-reconciliation-2026-10-14.md) §2, line 74 |
| Turn off Save voice recordings and only the written record is kept | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1 (line 32); [map](../../qa/live-main-reconciliation-2026-10-14.md) §1 rows P5 and P10, lines 34 and 39 (dd04e6d: "a written record of each conversation"; the voice recording kept "unless you turn off Save voice recordings in the app's privacy settings"); [D044](../../decisions/D044-app-screens-on-the-site.md) line 20; [claims, D044 additions](../../product/claims.md#d044-additions-2026-10-11-what-the-real-app-screens-may-show) line 399 ("off keeps text only") |
| Real screenshot, privacy centre, names changed, example content | [log](../../log.md) line 465; caption verbatim from the D043 mockup brief |

---

## Fold 5 · How long conversations are kept

**Fold job:** state the retention period and how a parent deletes sooner (deleting the account), next to the memory claim.

**Copy:**

> **Eyebrow:** Retention
>
> **H2:** How long conversations are kept.
>
> Your child's conversations stay in your parent app for 36 months, then they're deleted automatically.
>
> Removing a chat in the app hides it on that phone. Deleting your account deletes your child's profile, conversations and recordings from our servers.
>
> Kheelu remembers earlier conversations with your child, and you can read every one of them.
>
> [Read our privacy policy] → `privacy.html`

- **H2 accent:** `Hand` on "kept."
- The retention line is [D020](../../decisions/D020-provider-terms-and-no-sale.md)'s first sentence, verbatim; its
  second, "You can delete any of them sooner, in one tap.", is withdrawn ([D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md)
  items 1 and 9: one-tap delete is not in the app; 36 months then deleted automatically stays). That line says
  "conversations", never "recordings": D020 sets the period for transcripts only
  ([messaging #11](../../brand/messaging.md#proof-points)). "Remembers" sits beside the parent's controls, as
  [D036](../../decisions/D036-launch-feature-claims.md)'s copy rule asks.
- **The new second paragraph (task 8b.1)** is D058's own wording for deletion: removing a chat hides it on that phone;
  deleting the account deletes the account, the child's profile, and the conversations and recordings from our
  servers. It names recordings because the account deletion covers them (map §1 P5, P12). Both sentences are
  short, so a parent who taps "remove" is not misled into thinking a chat is gone from our servers. Builder: the
  shared `RETENTION_LINE` becomes the first sentence only; this paragraph is the page's own.
- The privacy link is where the full data detail, including the training disclosure, lives
  ([D035](../../decisions/D035-model-training-opt-out.md)): pointing there keeps this page from reading as the whole
  story, without stating training on a customer page.

**Sources, fold 5**

| Claim | Source |
|---|---|
| 36 months, then deleted automatically | [D020](../../decisions/D020-provider-terms-and-no-sale.md) lines 20-21, 28-29 (verbatim, first sentence); [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 9 (lines 47-48); D020's narrowing note, line 10; [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 78; [facts](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) line 132 |
| Removing a chat in the app hides it on that phone; deleting the account deletes the child's profile, conversations and recordings from our servers | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1 (lines 25-26); D017's narrowing note, line 10; [map](../../qa/live-main-reconciliation-2026-10-14.md) §1 rows P11-P12, lines 40-41 (dd04e6d), and §2, line 77 (c630a49) |
| Kheelu remembers earlier conversations | [D036](../../decisions/D036-launch-feature-claims.md) line 19 (placement rule lines 32-33); [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 118 (never "long-term memory") |
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
> Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. If your child is 3, keep a grown-up nearby. Common Sense Media advises against AI toys at this age. Its advice in full, and our answer, are in the next question.
>
> **What do child-safety groups say about AI toys?**
> In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as "smart toys with voice-based interactions", to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.¹ We make Kheelu for ages 3 to 7, so you should hear this from us.
>
> When it tested three AI toys, it rated 27% of their replies as not appropriate for kids. It also raised concerns about toys designed to create emotional attachment, the data they collect and how reliably they work.²
>
> Here is what Kheelu does about each concern:
> - **Replies:** its answers are generated by an AI model that is given child-safety rules and your child's age on every conversation, with Google's safety filters on top. It can't browse or search the web. When it doesn't know something, it says so. Before launch, we test it by trying to make it say things it shouldn't. You can read every conversation.
> - **Attachment:** Kheelu tells your child it's a toy, and it never asks them to keep a secret from you.
> - **Data:** the four facts at the top of this page. We don't sell your data.
> - **How well it works:** if it isn't right for your family, return it within 7 days of delivery, no questions asked.
> - **At 3:** keep a grown-up nearby.
>
> **Sources**
> ¹ Common Sense Media, "Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks" (press release), 2026, paragraph 1. https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks
> ² Common Sense Media Youth AI Safety Institute, "AI Toys" (risk assessment), 2026, "What we found". https://institute.commonsensemedia.org/risk-assessments/ai-toys
>
> [How to choose an AI toy] → `ai-toys-for-kids-in-india.html`

Word counts: 50 · first block 57 (the answer-first part: the C16 sentence and our one line), then the detail.
(Approved at 50; in task 7.1b, M8 takes three words out and M4 adds three.)

- **H2 accent:** `Hand` on "ask."
- `FAQ` component; **first item open** (DS: first item open on safety pages). Both answers, exactly as shown, join
  fold 2's four in the page's FAQPage JSON-LD.
- **Question 1 points to question 2 as "the next question", not to text "below" (task 7.1b, CMO review A M4).** Question 2
  is closed when the page loads, so question 1 says its answer is "in the next question", not that it "follows
  below". That way a parent who reads the warning knows to open question 2 for our answer. The JSON-LD keeps the
  same order (question 1, then question 2), so "the next question" stays true there.
- **The age-3 advice uses the site's one wording (task 7.1b, CMO review A M8):** "If your child is 3, keep a
  grown-up nearby.", the sentence Home's age answer and `/setup` print, as the CMO picked it in the
  [copy review of task 7.1b](../../qa/cmo-review-copy-fixes-7.1b-2026-10-14.md) (minor 1). Under the "At 3:" lead, the
  bullet keeps just the instruction, "keep a grown-up nearby.", so it does not say "3" twice.
- **Question 2 is drafted as "the one signed answer"** the age-band review asks for
  ([§4](../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band)), to be reused on the journal's
  safety article. It runs on the main session's working default B3 ("cite it in full, with one signed answer
  reused everywhere", [Gate A open items](../gate-a-open-items.md) line 60), not on a founder decision, so it is
  founder question 1. The Common Sense Media paragraphs are the verified C16 line verbatim
  ([source verification](../../research/source-verification.md) lines 354-361); the toys tested are never named.
  Each bullet restates only confirmed facts; some repeat other folds on purpose, because this answer must stand
  alone wherever it is reused.
- **The "Replies" bullet (task 8b.1, [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1).**
  The "curated, closed content library" and the "age-graded safety layer" are withdrawn (the live team's code check:
  "Replies are generated by Google's Gemini", c630a49). The bullet now says what the code does, in D058's words: an AI
  model, given child-safety rules and the child's age on every conversation, with Google's safety filters on top. "It
  can't browse or search the web" joins it, so the bullet still answers the 27% finding without the library. "When it
  doesn't know something, it says so" (D036 #3) and "Before launch, we test it …" (D036 #7) stay word for word: D058
  does not name them, and D036's narrowing note keeps them (question 6). The answer-first part of question 2 is
  unchanged (57 words).
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
| At 3, keep a grown-up nearby (both places) | [D041](../../decisions/D041-gate-a-round-1.md) line 33 ("with a grown-up nearby" in age and safety answers); one wording: [CMO review A](../../qa/cmo-review-built-a-2026-10-14.md) M8; the wording itself: [CMO copy review 7.1b](../../qa/cmo-review-copy-fixes-7.1b-2026-10-14.md) minor 1 |
| Its advice in full, and our answer, are in the next question | Fold 7's own order (question 2 follows question 1); [CMO review A](../../qa/cmo-review-built-a-2026-10-14.md) M4 (the CMO's own wording) |
| Common Sense Media's advice, the 27% finding, its concerns | [source verification](../../research/source-verification.md) C16, lines 349-361 (verified line, verbatim; status EXTERNAL IF CONFIRMED, used here on working default B3, [Gate A open items](../gate-a-open-items.md) line 60); [age-band review §4](../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band) lines 113-132 |
| Answers generated by an AI model given child-safety rules and the child's age on every conversation, with Google's safety filters on top | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1 (lines 27-28; the closed library and the age-graded safety layer go); D036's narrowing note, line 10; [map](../../qa/live-main-reconciliation-2026-10-14.md) §2, lines 64-65, 76 and 83 (c630a49) |
| It can't browse or search the web | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 71; [facts](../../product/facts.md#internet-and-camera) line 144 |
| Says when it doesn't know | [D036](../../decisions/D036-launch-feature-claims.md) line 20; [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 117 |
| Tested before launch by trying to make it say unsafe things | [D036](../../decisions/D036-launch-feature-claims.md) line 25 (red-teamed; not named by D058, whose withdrawn "We attack our own safety layer before every release" is the old live line, claims §2 line 116: question 6); [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 116 |
| Says it is a toy; never asks a child to keep a secret | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 69 |
| We don't sell your data | [D020](../../decisions/D020-provider-terms-and-no-sale.md) line 27 |
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
- Footer: as on Home ([home.md, footer](home.md#footer)). Task 8b.1: the footer's "No open internet." becomes "No
  web browsing." there and in `navigation.ts:75` ([D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md)
  item 1; [map](../../qa/live-main-reconciliation-2026-10-14.md) §2, line 86, c630a49); this page does not list the
  footer's words, so nothing changes here. Fold 3's own "No open internet." became "No web browsing." in round 2
  (question 5).

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
| Answer-first blocks, 40 to 60 words | Yes | Lead (50); fold 2 items 1 and 2 (57, 42 since task 8b.1; 56, 46 as approved); FAQ (50, as approved: task 7.1b's M8 and M4 cancel out; 57 before the detail) |
| Alt text: no keyword where it isn't true | Yes | No alt carries the primary |
| Words never placed (toddler, best friend, tutor, lessons, adapts, wake-word lines, competitor names, "safe" as a claim, "region-pinned", "own servers", COPPA labels, health terms) | Yes | "No wake word" is the corrective form D018 allows, not a wake-word line (founder question 3). Task 8b.1 adds none: "from our servers" is not "only our own servers" |
| Density: primary 0.5% to 2% | Just under the floor since task 8b.1 (question 10) | 1 occurrence (H1) of 4 words in about 880 words of `<main>` = about 0.45% (about 830 words and 0.48% as approved; task 8b.1 adds about 47 words: the Save voice recordings item, the deletion paragraph and the code-checked "Replies" bullet). QA re-measures on the built page |
| Density: "Kheelu" ≤ 2% | About 2.0% | About 18 of about 880 words (task 8b.1 adds no "Kheelu"), mostly in founder-verbatim lines (D018, D020) and FAQ answers that must stand alone. QA re-measures on the built page; if over, swap "Kheelu" for "it" in the fold 3 heading and the fold 7 bullet first |

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
and alerts (counsel, L6), training (D035: terms and privacy only). Task 8b.1 adds no placeholder: the daily talk-time
limit and "when Kheelu rests, its WiFi is switched off" are left off until their live sentences are read (question 8),
not held as placeholders, so the approved folds keep their shape.

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
5. **Applied in task 8b.1 round 2, option (a), for your OK at Gate B** ([CMO review of task 8b.1](../../qa/cmo-review-claims-8b.1-2026-10-14.md)
   m12, "with the founder's OK"): fold 3 now reads "**No web browsing.** It can't browse or search the web." If you
   prefer (b), the title goes back. The question as asked: **Fold 3's "No open internet." (new, task 8b.1).** The live team's code check changed the footer's "No open
   internet." to "No web browsing." (c630a49; [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md)
   item 1), and the footer follows it. Fold 3's own item still reads "**No open internet.** It can't browse or search
   the web." (a) Retitle it "No web browsing." and keep its body, so the site says this one way and nobody reads "no
   internet" when AI mode runs on home Wi-Fi; (b) keep it as approved, since the body already says exactly what is
   true. **Recommend (a):** the live team's reason for the footer applies here too. One title (`safety.ts:102`); not
   changed in this pass because no fix named it.
6. **Two "Replies" lines D058 does not name (new, task 8b.1).** "When it doesn't know something, it says so." (D036
   #3) and "Before launch, we test it by trying to make it say things it shouldn't." (D036 #7). The code check left
   both open (map, "For the founder" F). D058 withdrew the old live line "We attack our own safety layer before every
   release", and D036's narrowing note keeps #3 and #7. (a) Keep both, as now; (b) drop the before-launch test along
   with its withdrawn sibling; (c) drop both. **Recommend (a)**, if you confirm the before-launch test still happens.
   Both are your own confirmations (2026-10-11), and neither rests on the closed library or the safety layer.
   **The CMO review of task 8b.1 (m11) adds:** the live team's own rewrite of the same answer, "Could Kheelu say
   something wrong?" (c630a49), dropped both lines. So you and Aman confirm both before Gate B: that the test took
   place, and that the child-safety rules tell the model to say when it doesn't know. Whichever is not confirmed
   comes out of the "Replies" bullet (and wherever else it appears: `/terms` question 9, the product page's question
   12, the buyer's guide's question 3, Home's question 13). The bullet still reads whole without either.
7. **The providers line names no place now (new, task 8b.1).** Fold 2 item 2 drops ", on servers in India" (D058
   item 6). (a) Name no place, as now: the providers' promise reads whole, and `/privacy` names who they are and says
   some work outside India. (b) "…uses trusted speech and AI providers, through Kheelona's servers.": true, but "They
   don't keep it" could then be read as our servers keeping nothing, and they keep conversations for the parent app.
   **Recommend (a).** Home's safety block carries the same founder line (home.md fold 6), so both pages should use the
   same words.
8. **Two code-checked facts not on this page yet (new, task 8b.1).** D058 item 1 brings in the daily talk-time limit
   and "when Kheelu rests, its WiFi is switched off". This pass could not read their live sentences (no shell for
   `git show origin/main`, c630a49), and the map does not say whether a parent sets the limit. (a) Add "Daily talk
   time" to fold 4 as a parent control once the main session supplies the live sentence, but only if a parent sets it.
   Leave the WiFi line to the product page, where "rests" can be explained beside the wake-up button. (b) Leave both
   to `/privacy` and the product page. **Recommend (a):** a daily limit a parent sets belongs with the other controls
   on this page.
9. **"Voice recordings" in fold 4 depends on a backend release (new, task 8b.1).** The live team's #18 says the
   server honours the Save voice recordings switch only from backend-service PR #39, which is "to deploy first" (map
   §1, line 22). (a) Keep the item and put "PR #39 in production" on the Gate B checklist; (b) take the item off
   `/safety` until then (`/privacy` names the switch). **Recommend (a):** with the check on the list, the line is true
   at launch.
10. **Primary-keyword density (new, task 8b.1, for the CMO).** The code-checked lines add about 47 words, so "are AI
    toys safe" (once, in the H1) goes from about 0.48% to about 0.45% of `<main>`, against the keyword map's 0.5%
    floor. (a) Accept it: the primary leads the title, the meta description and the H1, and the 50-word answer-first
    lead answers it. (b) Use the question once more, for example as fold 7's eyebrow, which changes an approved line.
    **Recommend (a)**; QA measures the built page.
11. **"From our servers" in fold 5 (new, task 8b.1 round 2; CMO review of task 8b.1, m6).** "Deleting your account
    deletes your child's profile, conversations and recordings from our servers." is D058's and the live wording. Our
    training data is on our servers too (D055 item 12), and no decision says deleting the account takes a child's
    data out of it ([privacy.md](privacy.md#questions-for-the-founder-website-only) question 11, for the CTO). If it
    does not, the line implies no training copy remains, which [D035](../../decisions/D035-model-training-opt-out.md)
    forbids on customer pages. (a) Keep it, if the CTO confirms account deletion also takes the data out of the
    training data; (b) otherwise, drop "from our servers" here and on Home, the product page and the buyer's guide.
    **Recommend: the CTO answers privacy question 11 before Gate B, then (a) or (b).**

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
and M8), with the age-3 wording the CMO then picked in the [copy review of task 7.1b](../../qa/cmo-review-copy-fixes-7.1b-2026-10-14.md)
(minor 1). The founder signs off copy ([D015](../../decisions/D015-founder-signs-off-copy.md)), and the review lists
both under "Copy changes M4 (wording option) … and M8 need your sign-off". Every other line of the Copy blocks stays
word for word as approved at Gate A ([D046](../../decisions/D046-gate-a-approved.md)). No new claim, and the age band
stays 3 to 7.

- **Fold 7, question 1, last sentence (CMO review A M4).** "Its advice in full, and our answer, follow below."
  becomes "Its advice in full, and our answer, are in the next question." This is the CMO's own wording. On the
  built page question 1 is open and question 2 is closed, so a parent read the warning while our answer stayed
  hidden "below". The new sentence tells them where the answer is. The other fix the CMO offered, the builder
  opening both items, is [question 4](#questions-for-the-founder-website-only-d030); I recommend the copy fix.
- **Fold 7, question 1, the age-3 sentence (CMO review A M8).** "If your child is 3, we advise play with a grown-up
  nearby." becomes "If your child is 3, keep a grown-up nearby.", the one wording M8 asks for and the sentence Home's
  age answer and `/setup` print. Same source: [D041](../../decisions/D041-gate-a-round-1.md) line 33.
- **Fold 7, question 2, the "At 3:" bullet (CMO review A M8).** "we advise play with a grown-up nearby." becomes
  "keep a grown-up nearby.", the same wording as question 1 without repeating "If your child is 3" under the "At 3:"
  lead.
- **Why not "…while they play" (CMO copy review 7.1b, minor 1).** This page first took M8's example, "If your child is
  3, keep a grown-up nearby while they play." (the journal guides' closing line). The CMO's copy review found that it
  left two wordings, Home's short one and this one, and picked the short sentence for every page M8 names: the long
  form would take three FAQ answers over the 60-word answer guard (Home 61, the product page 62, the buyer's guide
  61). The short sentence is the long one's opening, so it says nothing new.
- **Notes kept true:** question 1 is 50 words again (M8 takes three words out, M4 adds three; inside 40 to 60). The
  fold 7 notes and source rows and the keyword placements row are updated to match. The page total (about 830 words),
  "Kheelu" count (18), primary density, title, meta description, H1 and the hero's answer-first block are unchanged.
  There are still no placeholders.
- **For the builder (not edited here):** `src/content/en-IN/faqs.ts:125` (`age-three`, the whole answer as above)
  and `:151` (`child-safety-groups`, the "At 3:" item's text). The Storybook copy of both is in
  `src/components/sections/FaqSection/FaqSection.stories.tsx:49` and `:63`. `src/content/en-IN/pages/safety.ts:172`
  keeps `firstOpen: true`. Neither FAQ is in `llms.txt` (`src/app/llms.txt/route.ts:42-53` lists other ids), so no
  machine-file hash changes because of this page.
- **Deviations for the main session to list at the merge** (`safety` key): the frozen mockup
  (`mockup/safety.html:173` and `:183`) still reads "If your child is 3, we advise play with a grown-up nearby. …
  follow below." and "we advise play with a grown-up nearby." Both lines now differ from it on purpose.

## Changes after approval (task 8b.1)

Applied from the founder's [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) (2026-10-14: "What
Aman has pushed [is] correct; follow that.") and the [reconciliation map](../../qa/live-main-reconciliation-2026-10-14.md)
(§2: the claims the live team withdrew in #19, `c630a49`, after checking firmware, backend and app on 12 Oct; §1: #18's
parent-app facts, `dd04e6d`). The live words are quoted from D058's "In the site's words" and from the map. This
pass had no shell, so `git show origin/main:<path>` was not read directly: the CMO's review checks the quoted words
against `c630a49` before the modules change. Every other line of the Copy blocks stays word for word as approved
(Gate A, [D046](../../decisions/D046-gate-a-approved.md); task 7.1b above). Ages stay 3 to 7; no price changes.
Nothing new is claimed beyond the code-checked wording and D058.

- **Fold 2, item 1 (D058 item 1).** "…switches itself off after about a minute of quiet." becomes "…after a couple of
  minutes of quiet." The code check found that a conversation "ends after ~2 minutes of quiet" (map line 64), and
  D018 is narrowed to match. 56 → 57 words.
- **Fold 2, item 2 (D058 item 6).** ", on servers in India" comes out, because some processors work outside India and
  `/privacy` names them. The providers' promise (reply only, keep nothing, never train, by contract) is unchanged
  (D020 items 1-4; D058 keeps it). 46 → 42 words, inside 40 to 60. No place is named in its stead (question 7).
- **Fold 2, item 3 (D058 item 1).** "Yes, in the parent app, word for word. Delete any of them in one tap." becomes "Yes,
  in the parent app, word for word, a few minutes after each one ends. Delete them all by deleting your account." The
  app has no one-tap delete. Conversations are readable a few minutes after they end (a code-checked addition, D058
  lines 31-32), and the second sentence is the live "Delete it all by deleting your account" (map line 77).
- **Fold 4 (D058 items 1 and 7).** In the age item, "The age-graded safety layer follows it." becomes "On every
  conversation, the AI model that answers your child is given it, with child-safety rules." "Topics" and "Quiet
  hours" come off: neither is in the app. "Languages" stays word for word. A new item from what D058 item 1 brings
  in: "**Voice recordings.** Turn off Save voice recordings, and only the written record of each conversation is
  kept." (map §1 P5, P10, dd04e6d; D044 line 20). It depends on backend PR #39 (question 9).
- **Fold 5 (D058 items 1 and 9).** The retention line keeps "Your child's conversations stay in your parent app for
  36 months, then they're deleted automatically." and loses "You can delete any of them sooner, in one tap." A new
  paragraph says what deleting does: "Removing a chat in the app hides it on that phone. Deleting your account deletes
  your child's profile, conversations and recordings from our servers." (D058 lines 25-26; map P11-P12). The fold job
  is reworded to match.
- **Fold 7, question 2, the "Replies:" bullet (D058 item 1).** "its answers come from a curated, closed content
  library, and every reply passes an age-graded safety layer." becomes "its answers are generated by an AI model that
  is given child-safety rules and your child's age on every conversation, with Google's safety filters on top. It
  can't browse or search the web." The rest of the bullet stays (question 6). The answer-first part of question 2 (57
  words) and question 1 (50) are unchanged, so both stay inside the FAQ guard.
- **Not changed, on purpose:**
  - The H1, title, meta description and fold 1 lead: none states a withdrawn claim.
  - "Kheelu has no wake word" and the light line: D018 stands, narrowed only on the quiet time.
  - The providers' don't-keep and don't-train promise, and "We don't sell your data".
  - "No ads": #18 also says the app has "no advertising or analytics tools" (map P8).
  - "Pick the ones you speak at home" (D058 item 7).
  - Fold 3's "No open internet.": no fix names it (question 5; changed in round 2, below). The footer's own "No web browsing." is home.md's and
    `navigation.ts:75`'s.
  - Kheelona+ (D058 item 3) and Bluetooth mode (item 2) do not appear on this page.
  - Training (D035; D058 item 5) stays on `/terms` and `/privacy` only, and nothing here implies there is none.
- **Notes kept true:**
  - Updated: the fold 2, 4, 5 and 7 notes and source rows; the footer note; keyword placements (item word counts;
    densities, question 10); placeholders (none added).
  - D018, D020 and D036 are now cited by their current line numbers (D058's narrowing notes moved them down by two).
  - Questions 5 to 10 are new.
- **For the builder (not edited here):**
  - `src/content/en-IN/pages/safety.ts` changes at `:76` (item 1), `:81` (item 2), `:83` (item 3) and `:126` (the age
    line).
  - In the same file, remove `:128-129` (Topics, Quiet hours) and add `{ icon: "microphone-slash", title: "Voice
    recordings.", body: … }` after Languages.
  - Fold 5's copy at `:152` becomes three paragraphs: `RETENTION_LINE`, the new deletion paragraph, then the memory
    line.
  - `src/content/en-IN/policies.ts:50`: `RETENTION_LINE` keeps its first sentence only (fix a). It is shared with
    Home, the product page, `/privacy` and four article modules (out of scope, 8b.2), so every page using it must
    agree.
  - `src/content/en-IN/faqs.ts:143`: the "Replies:" text.
  - Fold 2's items are FAQPage questions, so the page's JSON-LD changes with them.
  - `FaqSection.stories.tsx` has no "Replies" item, so no story literal changes.
  - `llms.txt` reads neither fold 2 nor these FAQs (`route.ts` reads `SAFETY_FACTS`, its own FAQ list and trust
    items), so this page alone changes no machine-file hash.
  - The fold 4 screenshot's built alt (`safety.ts:136`) mentions a button "to delete all chats". That matches the
    screen. But next to fold 5's "Removing a chat … hides it on that phone", a parent could take it to mean deletion
    from our servers. Ask the main session what that button does, and keep the alt to what is certain.
- **Deviations for the main session to list at the merge** (`safety` key): in the frozen mockup, `mockup/safety.html`
  lines 70-72 (fold 2 items 1-3), 112-114 (the age line, Topics, Quiet hours), 142 (retention) and 179 ("Replies")
  still show the withdrawn words. The built lines now differ from it on purpose, and fold 4 gains an item the mockup
  does not have.

**Round 2, after the [CMO review of task 8b.1](../../qa/cmo-review-claims-8b.1-2026-10-14.md)** (2026-10-14):
- **Fold 4, the age item (m8).** "On every conversation, the AI model that answers your child is given it, with
  child-safety rules." becomes "On every conversation, the AI model that answers your child is given that age and
  child-safety rules." ("it" sat far from "age"; `/setup` fold 4's wording, without the filters, which fold 7 names).
  Same fact (D058 item 1). Builder: `src/content/en-IN/pages/safety.ts:135`.
- **Fold 3, the internet item (m12; question 5, option (a), for the founder's OK).** "**No open internet.**" becomes
  "**No web browsing.**"; the body, "It can't browse or search the web.", stays. The live footer's words (D058 item
  1). Builder: `safety.ts:102`. The mockup (`mockup/safety.html`, fold 3) keeps the old title: one more text-parity
  row under the `safety` key.
- **Not changed, on purpose:** fold 2 item 3 (the CMO's model form for Home, m7); fold 5's "from our servers" (m6,
  question 11) and fold 7's test and doesn't-know lines (m11, question 6), which wait on the CTO, the founder and
  Aman. The bullet "Can't browse or search the web" rows of the product page and the buyer's guide's check 3 stay
  (m12). Every other word of the Copy blocks is as above. No new claim; no placeholder; "Kheelu" count unchanged.
- **Notes kept true:** the fold 3 and fold 4 notes and source rows, the footer note, questions 5 and 6, and the new
  question 11.

## Changes after approval (task 8b.1b)

A main-session ruling on a follow-up of task 8b.1 ([tasks](../../engineering/tasks.md), 8b.1b, 2026-10-14), from the
builder note above on the fold 4 screenshot's alt. No line of the Copy blocks changes.

| # | Where | What changed | Why (finding or source line) |
|---|---|---|---|
| 1 | Fold 4, the privacy screen's alt (`src/content/en-IN/pages/safety.ts:148`) | "A real screen from the Kheelu parent app: the privacy centre. Chats are kept for 36 months, with buttons to download your child's data and to delete all chats." becomes "A real screen from the Kheelu parent app: the privacy centre. Chats are kept for 36 months, with a button to download your child's data." | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1, lines 25-26: removing a chat in the app hides it on that phone, so "delete all chats" read beside fold 5 could be taken for deletion from our servers (the builder note above; the CMO's r2-m3 on task 8b.1). Home's and the product page's alts dropped the same words in task 8b.1. "Keep chats for 36 months" stays on screen and in the alt (D058 item 9, lines 47-48). The fold 4 image note above carries the new alt |
| 2 | Fold 4, the privacy screen's alt, and the age control's line | The alt becomes "…Chats are kept for 36 months, with a switch to save voice recordings and a button to download your child's data." (it names the switch the new third control is about, as Home's alt does); "child-safety" in the age control's line takes a non-breaking hyphen (the build's "Wi‑Fi" convention), so it never splits at 360 or 1440; the third control runs the full width from 720 px; fold 4's caption in the Copy block is corrected to D046's, which the mockup and the build already carry (d1) | The CMO's built-page review of 2026-10-14, m1-m3 ([review](../../qa/cmo-review-hidden-blocks-8b-2026-10-14.md)); main session, for the founder's sign-off at Gate B (D015, deviations V28) |

The frozen mockup (`mockup/safety.html`, fold 4) keeps the old alt: the `safety` rule of task 8b.1's claim fixes
(`CLAIM_FIXES.safety` in `test/e2e/support/deviations.ts`) now swaps the image's alt too, so the content test holds the
module to the new words. An alt is not visible text, so the text and visual passes are unchanged.

## Changes after approval (task Q2.17)

The founder's answers on the built selling update ([D066](../../decisions/D066-selling-update-founder-answers-2026-10-16.md),
2026-10-16), recorded by the builder of task Q2.17. Each line departs from the frozen mockup (`mockup/safety.html`), so
it is a parity deviation (`FOUNDER_ANSWERS.safety` in `test/e2e/support/deviations.ts`; the main session writes its
deviations.md row). The founder signs the words at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

| # | Where | What changed | Why |
|---|---|---|---|
| 1 | Fold 7, the second question's "Replies" line (`faqs.ts` `child-safety-groups`) | "Before launch, we test it by trying to make it say things it shouldn't." comes off; the line keeps "When it doesn't know something, it says so." and ends "You can read every conversation." | D066 item 6: G29's other half is not true, so it comes off everywhere (the plan v2 §13 item 3 (b)); "it says so" stays ([D065](../../decisions/D065-selling-site-founder-answers-2026-10-15.md) item 8) |
