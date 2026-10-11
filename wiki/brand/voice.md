---
title: Voice and tone (positioning vs the design system's writing guide)
type: brand
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - wiki/raw/positioning/Kheelona Positioning Strategy.docx
  - wiki/raw/positioning/Kheelona Positioning (1).pdf
  - wiki/raw/brief/kickoff-brief.md (sections 3, 4, 6, 9.8)
  - design-system/project/01-writing.md, 07-selling.md (read-only; also 00-how-to-use.md, 03-cast.md, 04-kheelu.md, 06-surfaces.md, README.md for cross-checks)
  - tag archive/pre-reset-2026-10-10 (= 77552ff, production): src/config/site.ts
  - https://kheelona.com/ (GET 2026-10-10)
  - "INTERNAL note (2026-10-10): wiki/decisions/D013-internal-vs-external-content.md, wiki/site/content-boundary.md"
  - "Founder's rulings D032-D038 and the CTO's adapts-family ruling applied 2026-10-11 (wiki/qa/rulings-check-2026-10-11.md)"
  - "Founder's rulings applied 2026-10-11: wiki/decisions/D015-founder-signs-off-copy.md and D016 to D028; wiki/open-questions.md section F (R5 and R9, answered 2026-10-10)"
---

# Voice and tone

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)): it shapes what the site says and how; nothing here is published as is. What may be published: [content boundary](../site/content-boundary.md).

Citation key: [positioning.md](positioning.md#the-two-source-documents). DS line numbers are lines of the
files in `design-system/project/` as delivered.

## Which source decides

- The brief: the design system wins "for anything visual"; the positioning wins "for audience, message and
  brand"; a conflict that changes what a customer sees goes to the founder, not resolved silently (brief §3
  L48–56).
- The writing guide lives inside the design system, which other teams share and which is read-only (brief §4
  L62–66). So: **where the positioning speaks, website copy follows the positioning; where it is silent
  (mechanics, CTA wording, alt text, Kheelu's voice to children), the DS writing guide applies.** Conflicts are
  recorded here and raised; the DS files are never edited.
- **A founder ruling wins over both** (brief §3, as applied in [D026](../decisions/D026-public-statistics.md)), and only the founder signs off
  copy ([D015](../decisions/D015-founder-signs-off-copy.md)). The rulings that bind voice are listed [below the rules](#founder-rulings-that-bind-the-voice).

## Voice rules from the positioning

The positioning has no separate "voice" chapter; these rules are stated across it.

| # | Rule | Cite |
|---|---|---|
| 1 | **Outcome first, technology second.** "AI" stays as the engine, in the sub-line, never the headline noun | docx §1 L13; §9 L274; §10 L351–353 |
| 2 | **Always say how.** Never say "brain development" without the mechanism: conversation, and Kheelu asking questions | docx §2 L20–21 |
| 3 | **Every brain claim can be backed up**: "built to support", not "boosts"; signed off by the child-development advisor. There is no advisor ([D038](../decisions/D038-trust-content-rulings.md)), so every claim rests on a cited public source ([D026](../decisions/D026-public-statistics.md)) and none implies expert sign-off | docx §1 L14; §10 L326–328 |
| 4 | **Never use fear.** No "don't miss the window", no "your child will fall behind" (ASCI bars playing on parental anxiety). Cited public figures used to persuade ("85% by age 6", "2.2 hours of screen time") are allowed by the founder, as SKM framed them, only after independent verification at the original source, each with a linked marker and paired with what a parent can do ([D026](../decisions/D026-public-statistics.md); both verified with rewording, [source verification](../research/source-verification.md) C01, C06) | docx §1 L14; §2 L22–23; §10 L331 |
| 5 | **Borrow warmth, never sell friendship.** "A toy, not a friend." | docx §2 L30; §7 L221 |
| 6 | **Specifics over adjectives.** Name the safety behaviours instead of saying "safe". "Specifics are believed; adjectives aren't." | docx §10 L363–365; §2 L32 |
| 7 | **State the honest limit.** "We say Kheelu is *built around* this idea, not that Kheelu is proven." | pdf p.5; docx §4 L127 |
| 8 | **The parent stays central.** "Never a replacement for you. Kheelu sends the conversation back to you." | docx §7 L225; §9 L309 |
| 9 | **Growth is personal, never comparative**: "compared only with their child's own past". As copy, describe what the weekly report shows ([D036](../decisions/D036-launch-feature-claims.md)), never a promised outcome, and never the "adapts" family ("grows with your child", "at your child's pace": BANNED, [claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish)) | docx §7 L196; §8 L245 |
| 10 | **No health or therapy language**; Kheelu is not a therapy device. The disclaimer itself may be said, on Terms and `/products/kheelu` only, not on Home; speech and language are discussed with public sources only, never as an outcome for Kheelu ([D025](../decisions/D025-speech-and-language.md)) | docx §6 L180; §10 L341–343 |
| 11 | **Learning progress, never emotional profiling**. Reading the child's feelings or mood, in any words, is banned ([R5](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)) | docx §2 L54–56; §10 L344–346 |
| 12 | **One product, one promise**: no Kheelona OS, wearables or robots to parents | docx §1 L15; §10 L369–371 |
| 13 | **No competitor names in public** | docx §10 L372–374 |
| 14 | **Short and repeatable**: "a simple model they can repeat"; the master line is four words | docx §1 L12; §9 L260 |
| 15 | **The child does the thinking** is the recurring frame: "Kheelu doesn't think for your child, it makes them think." | docx §2 L25 |
| 16 | **Creative shows a child thinking**: first 3 seconds of an ad, "a child pausing, then answering 'because…'"; "never the toy alone". *(Execution is visual, so the DS governs how.)* | docx §11 L385; pdf p.13 |
| 17 | **[3–7]** For 3-year-olds, the docs add "with a grown-up nearby" and "never show them alone in ads". Whether this survives the 3–7 override is open: [open questions](../open-questions.md) G5 | docx §2 L39; §12 L410 |

Word lists (say / never say, stop / say instead) are owned by
[messaging.md](messaging.md#claims-guardrails) and [messaging.md](messaging.md#words-to-stop-using).
The lines quoted in the rules above are rules, not copy. Where one is used as copy, it takes the Site
value its owner page gives it: "a toy, not a friend" and the hand-back on
[messaging.md](messaging.md#against-the-alternatives) (G5; F8), "Kheelu doesn't think for your child, it
makes them think" on [positioning.md](positioning.md#the-promise) (F8).

### Founder rulings that bind the voice

Each is owned by its decision; this list only says how it shapes tone and wording.
- **The brain:** promises credit conversation (conversation helps a young brain grow, Kheelu gives a
  child more of it), never "Kheelu grows / develops the brain"; "brain development" is a search topic,
  not a product label ([D016](../decisions/D016-brain-wording.md)). Rules 2 and 3 now work inside this.
- **Mechanism, never an absolute:** the microphone is described by the wake-up button, the light and
  the minute of quiet; never "no risk", "zero risk" or "nothing is ever recorded" ([D018](../decisions/D018-wake-up-button.md)). This is rule 6
  applied to listening.
- **Speech and language:** public sources only, never an outcome for Kheelu; the disclaimer on Terms
  and `/products/kheelu`, not Home ([D025](../decisions/D025-speech-and-language.md)).
- **Public statistics:** factual, verified at the original source, marked and linked, paired with what a
  parent can do ([D026](../decisions/D026-public-statistics.md)).
- **Not a tutor:** "lessons" is dropped everywhere; Story mode is stories, poems and jingles ([D027](../decisions/D027-story-mode-wording.md)).
- **Price, written plainly:** ₹499 first beside the CTA with the ₹4,999 total in the same sentence;
  machine-read text leads with ₹4,999 ([D028](../decisions/D028-price-wording.md)).
- **One audience:** parents of 3-7 year olds and family buying for them; no corporate-gifting or
  preschool voice on the site ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)).

The confirmed lines themselves: [messaging.md, confirmed candidate lines](messaging.md#confirmed-candidate-lines).

## Where the positioning and the DS writing guide agree

| Topic | Positioning | Design system |
|---|---|---|
| Proof before promise | Every claim backed up, advisor sign-off (docx §1 L14) | "Proof over promise" (`01-writing.md` L12); "Only claim what kheelona.com already states, or what has written sign-off from the founders" (L65) |
| No outcome guarantees | Never "boosts IQ", "makes your child smarter", "genius" (docx §10 L328) | Avoid "genius, IQ, smarter than, guaranteed results" (L34); never "makes your child smarter" (L69) |
| No fear | ASCI; no fear (docx §2 L22–23) | "Don't shame parents" (L33); never "fear about screens or development to push the sale" (`07-selling.md` L78); follow ASCI (L71) |
| Parents are not replaced | "Never a replacement for you" (docx §7 L225) | Never "replaces parents/teachers" (L69) |
| No health claims | No speech delay, ADHD, autism, therapy (docx §10 L343) | Never "medical or developmental diagnoses" (L69) |
| Asking back | Kheelu ends most turns with a question (docx §10 L376) | Kheelu's voice: "Serve and return. Answer, then ask one question back." (L78) |
| Honest about being a toy | "Always says it's a toy, never asks for a secret"; hand-back to Amma (docx §9 L307, L309) | "Never claims to be human, never asks a child to keep secrets… 'Let's ask Amma together.'" (L82) |
| Specific safety, no absolutes | The four safety behaviours, not "safe" (docx §10 L363–365) | Avoid "100% safe, completely safe, certified safe" (L35); objection proof is mechanisms (`07-selling.md` L61) |
| Not certified until it is | BIS date still needed (docx §8 L251) | "No badge appears here before it is earned." (L36); never "certified" until true (L69) |
| Research said carefully | "Built around the same idea"; never "Harvard-proven" (docx §10 L333–334) | "Say carefully: learning benefits… 'serve and return'… link to the science article" (L68) |
| Short, two-beat lines | "It asks. They think." (docx §9 L258) | Sentence case with full stops; "two short sentences" (L20, L43) |
| Not a gadget | "Not another gadget" (docx §6 L175) | Avoid "smart device, assistant, bot, gadget" (L32) |
| No AI hype | AI as the engine (docx §1 L13) | Avoid "revolutionary, cutting-edge… powered by GPT" (L37); no "AI" glows in imagery (README L10) |
| Home languages | Grandparent message in "our language" (docx §9 L288) | "Indian at heart… home languages" (L15) |
| Real families only | Pilot videos from real families (docx §11 L388–389) | Testimonials from real pilot parents with consent; cast photos are fictional and never quoted (`07-selling.md` L70; `03-cast.md` L5) |

## Where they conflict

| # | Topic | Positioning says | Design system says | Decides (brief §3) | Recommendation | Customer sees it? |
|---|---|---|---|---|---|---|
| 1 | **"Friend"** | Stop "companion, friend, best friend"; say "a toy that talks with your child" (docx §10 L354–356; §2 L30) | Use "friend": "Kheelu is a friend, not an appliance" (`01-writing.md` L32). Approved description: "a screen-free AI friend for ages 3+" (`04-kheelu.md` L44, L70; project `README.md` L1); example lead (`00-how-to-use.md` L117); share text "screen-free AI friend" (`06-surfaces.md` L73) | Message and brand: **positioning** | **Founder, 2026-10-11 ([D041](../decisions/D041-gate-a-round-1.md)): "friend" is fine.** The DS wording may be used; "best friend" stays banned (claims §8) and Kheelu still says it's a toy | Yes |
| 2 | **The headline pattern** | No friendship; refuse the tutor/edtech frame (docx §5 L133) | Model headline "A best friend at 3. A head start for school." (`01-writing.md` L20, L43). It is the live H1 (kheelona.com, 2026-10-10) | Positioning | Retire it with the reset. Site: **BANNED** ("best friend", [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)) | Yes |
| 3 | **Wake-word wording** | "It only listens after its wake word" (docx §9 L307) | "Not muted. Off." (`01-writing.md` L11; `07-selling.md` L66); "the microphone is off until the wake word" (`04-kheelu.md` L73) | Accuracy, not voice: **settled by the founder** ([D018](../decisions/D018-wake-up-button.md)) | Kheelu has no wake word. Both lines, and the 2026-10-04 replacement "listens only for its wake word", are **BANNED**; use the wake-up button and light lines ([messaging.md](messaging.md#confirmed-candidate-lines), **EXTERNAL**). The DS examples stay in the DS (read-only) and are logged for its owner as a gap (D018) | Yes |
| 4 | **Hero example** | "Kheelu helps your child's brain grow, one conversation at a time." (docx §9 L271) | "Kheelu listens, remembers, and grows with your child." (`01-writing.md` L89) | Positioning | Neither as written. SKM's line is **BANNED** ([messaging.md](messaging.md#taglines-and-hero); [claims.md §4](../product/claims.md#4-retired-or-banned-wording)): Kheelu as the subject of brain growth ([D016](../decisions/D016-brain-wording.md), settled). The sanctioned brain form is on [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors). In the DS example, "remembers" is **EXTERNAL** within the live memory claim ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), [messaging.md](messaging.md#proof-points) #17) and "grows with your child" is **BANNED** (the "adapts" family, CTO ruling 2026-10-11, [claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish); [messaging.md](messaging.md#proof-points) #18) | Yes |
| 5 | **Outcome vocabulary** | Four thinking skills: Words, Reasons, Stories, Questions (docx §1 L12) | "head start, confidence, words, numbers" (`01-writing.md` L34); "school readiness" (`03-cast.md` L58) | Positioning | Lead with the four skills as what the weekly report covers ([D036](../decisions/D036-launch-feature-claims.md)), never as an outcome Kheelu delivers (legal review L7); "head start" is not banned but should not lead | Yes |
| 6 | **"AI" up front** | Never the headline noun (docx §10 L351–353) | Lead line "A screen-free AI friend…" (`00-how-to-use.md` L117; `04-kheelu.md` L70) | Positioning | "AI" only in sub-lines | Yes |
| 7 | **Feelings as a reason to buy** | Learning progress only; never emotion profiling; never sell friendship (docx §2 L30, L54–56; §10 L344–346) | The five feelings answer "Will my child like it?" and fill a product-page section (`07-selling.md` L10, L30, L65) | The expressions are visual (DS); selling on them is message (positioning) | Keep feelings as Kheelu's expressions in art; do not make them a selling argument. Any line that has Kheelu read the child's feelings or mood ("the feeling gets read … the answer meets the mood", "maps emotions and triggers"): **BANNED** ([R5](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time), like "adapts"; the live row: [claims.md §2](../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)) | Yes |
| 8 | **Price objection** | Anchor against enrichment-class spend (docx §7 L226) | Never "Cheaper than tuition"; answer with years of use, languages, Kheelona+, the refundable ₹499 (`07-selling.md` L63). Lead with the barrier price, the full price nearby (`07-selling.md` L42) | Compatible; the founder set the price wording ([D028](../decisions/D028-price-wording.md)) | Compare value ("every day at home"), never "cheaper"; no fee number without a source. The refundable ₹499 always has the ₹4,999 total (incl. GST) in the same sentence, and machine-read text leads with ₹4,999 ([D028](../decisions/D028-price-wording.md)). Kheelona+ only in [D027](../decisions/D027-story-mode-wording.md)'s line | Yes |
| 9 | **CTA label** | Candidates, sources and decisions: [messaging.md, CTA labels](messaging.md#cta-labels) | | | Decided at Gate A: [open questions](../open-questions.md) G1 | Yes |
| 10 | **Other products and the platform** | One product, one promise; platform story for investors (docx §1 L15; §10 L369–371) | Names PlayOS, Kheelu Speaker (5+) and AI books "coming soon" (`04-kheelu.md` L44–48) | Brand: positioning | Selling pages show Kheelu only; `/playos`: [open questions](../open-questions.md) G8. Wherever `/playos` copy goes, "Nothing rented that matters" and the "own the model" family are **BANNED** ([D019](../decisions/D019-voice-providers.md)) | Yes |
| 11 | **Where data goes** | "Servers in India" only if true for the AI processing too (docx §10 L366–368) | Can say "data is region-pinned" (`01-writing.md` L67; `04-kheelu.md` L76) | Accuracy: **settled by the founder** ([D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)) | SKM's outside-provider test is answered: multiple outside providers, processing on servers in India for every provider. Site: "data is region-pinned" (live as the "Region-pinned" title on `/safety`, `src/app/(site)/safety/page.tsx:42`) is **BANNED**, the same family as "stays in your region" ([claims.md §4](../product/claims.md#4-retired-or-banned-wording)); "only Kheelona's own servers, in India" is **BANNED** ([D019](../decisions/D019-voice-providers.md)); "on servers in India" is **EXTERNAL** inside D020's providers line ([messaging.md](messaging.md#confirmed-candidate-lines)) | Yes |
| 12 | **Language claim** | "So your grandchild thinks in it too" (docx §9 L288) | Avoid "mother-tongue education (as a claim)" (`01-writing.md` L38) | Positioning, under its own substantiation rule (docx §1 L14); the founder ruled ([D025](../decisions/D025-speech-and-language.md)) | The DS is right here: the clause is a language outcome credited to Kheelu, which [D025](../decisions/D025-speech-and-language.md) rules out. Describe what happens instead ("Kheelu asks questions in your language"). Site: **BANNED** as written ([messaging.md](messaging.md#proof-points) #33) | Yes |
| 13 | **Kheelu's voice to children [3–7]** | Users are 3 to 7 (brief §2) | Kheelu speaks to "3–6 year olds"; sentence length given for ages 3 and 5 only (`01-writing.md` L75–77) | Visual/DS content: DS gap | Log for [../design-system/gaps.md](../design-system/gaps.md); ask for guidance at 6–7 | Only in child-facing audio or video |
| 14 | **Memory wording** | Never "long-term memory"; say "remembers what your child has learnt and loves" (docx §10 L345–346) | PlayOS as "one memory of each child" (`04-kheelu.md` L45) | Positioning | Use SKM's sanctioned form. Site: "remembers what your child has learnt" **EXTERNAL** within the live memory claim ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), [messaging.md](messaging.md#proof-points) #17); "and loves" **EXTERNAL IF CONFIRMED** (F8); PlayOS's "one memory of each child" **EXTERNAL IF CONFIRMED** (F8, G8) | If used |

## DS mechanics that apply (the positioning is silent)

From `01-writing.md`: "you" for the parent and "your child" (L19); sentence case, full stops in headlines
(L20); at most one exclamation mark a page (L21); 2–3 sentence paragraphs, about 60-character lines (L22);
numerals for facts (L23); ₹4,999, never "Rs" or "INR", dates as 20 Oct 2026 (L24); "Wi-Fi", "parent app",
"Story mode", "AI mode", "Bluetooth mode" spelled exactly (L25); avoid "genuinely", "honestly",
"straightforward" (L26); Hinglish only in organic social, never in pricing or safety (L100); the alt-text
pattern (L111–113); tone by surface (L85–95). The brief adds en-IN spelling throughout (brief §9.8).

Two places where the live site departs from those mechanics, for the Copywriter to resolve with the
[checkout](../site/checkout.md) and [tracking](../site/tracking-inventory.md) owners: the WhatsApp share text
uses "Rs" on purpose because "the rupee sign garbles in some WhatsApp clients" (`src/config/site.ts:159–165`),
and the ship date renders as "20 October 2026" (`site.ts:138`) rather than "20 Oct 2026".

**Mechanics points in the founder's draft lines** (2026-10-10/11), for the founder at Gate A ([D015](../decisions/D015-founder-signs-off-copy.md)),
since a draft is not final copy: [D027](../decisions/D027-story-mode-wording.md)'s Story-mode line spells "No WiFi needed", where the DS spells
"Wi-Fi" (L25): copy renders "Wi-Fi", subject to the founder's OK at Gate A; and [D028](../decisions/D028-price-wording.md)'s rule puts the ₹4,999
total in the same sentence as ₹499, while its draft is two sentences: a one-sentence form is on
[messaging.md](messaging.md#confirmed-candidate-lines) for the founder to pick. Grievance times say "within 48 hours" and
"within one month", never "30 days" ([D032](../decisions/D032-grievance-block-and-call-line.md)). The button is the "wake-up button", en-IN and hyphenated ([D018](../decisions/D018-wake-up-button.md)). The mid-November
delivery date renders from one content value, never hand-typed ([D023](../decisions/D023-new-order-delivery.md)).
