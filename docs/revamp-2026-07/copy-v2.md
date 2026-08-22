# Production copy v2 — theme B voice, all routes (2026-07-24)

> **⚠ SUPERSEDED — do not build from this file.** `docs/revamp-2026-07/BUILD-V3.md` replaced it on
> 2026-07-27/28 and wins on every conflict. This document is kept as the record of the theme-B M2–M4
> copy round. Specifically dead here: **"Ages are 3 to 10 everywhere"** (Lumi is **2 to 5**, the
> platform arc **2 to 14** — render from `LUMI_AGES`/`PLATFORM_AGES`), the Lori/Lua/Robu line-up on
> .com (now Lumi → Kheelu Speaker → AI books), the "ten families test Lumi every day" proof point
> (withdrawn by the founder), and anything about the Home hero, which V3 rebuilt. Voice law, the one
> CTA verb, and the provenance-tag system below are still in force.


The build transplants THIS document verbatim (M2–M4). Provenance tags: **[seed]** =
`docs/wireframes/2026-07/copy.json` (founder-picked wireframe round, CMO + editor pass; **that kit
was deleted on 2026-08-23** and lives in git history) ·
**[fact]** = already published on the live site or kheelona.ai (sanctioned) · **[NEW]** = written
this round from `research.md` · **[GATED:x]** = must not ship until the named gate clears.

Voice law: calm, plain, parent-first, second person present. Zero em-dashes, zero italics, no
exclamation points, no hype, rarely lead with "AI". No contractions in body copy; **Kheelu's
bubbles may use contractions** (character voice) and every Kheelu line requires founder
sign-off before shipping (queue in WORKING.md). One CTA verb: Reserve. Prices/CTA text only via
`config/site` constants. Ages are **3 to 10** everywhere.

Category language (research): "screen-free AI toy", "talking AI toy", "AI plush companion".
Demote "AI robot toy". Product name in titles is always **"Lumi by Kheelona"**.

---

## HOME

**Meta title**: Lumi by Kheelona: the screen-free AI toy that talks with your child **[NEW]**
**Meta description**: Lumi listens first, then talks back, in up to 10 languages you speak at
home. No screen. No open internet. You read every word. Reserve at ₹4,999, no payment now.
**[NEW, facts only]**

### Hero (minimal copy left, art right)
- Age chip: `For ages 3 to 10` **[fact, range updated]**
- H1 line 1: `A friend who listens.` **[seed]**
- H1 line 2 (orange-ink): `Made by people you can trust.` **[seed]**
- Sub: `Screen-free friends that talk with your child and grow with them. We do not sell your
  family's data.` **[seed]**
- CTA: RESERVE_LABEL · Ghost link: `Meet Kheelu` (anchors the warm room)
- Cap line: CAP_LINE **[fact]**
- Guide hint (small, under CTAs): `Your guide is waiting in the corner. Give Kheelu a poke.`
  **[seed, B template]**
- HERO BUBBLES (SSR chips around the art, 3): `No screen, ever.` · `Up to 10 home languages.` ·
  `You read every word.` **[NEW, all facts]**
  - Optional Kheelu-voice variant for the whisper art, founder to pick:
    `Psst. She listens better than anyone I know.` **[NEW, GATED:kheelu-line]**

### Room 1 — Recognition (reuse RecognitionStrip)
Label `Recognised by` + NVIDIA Inception Program, Karnataka Elevate, nasscom startups,
Founders Inc + safety proof line (`Wake-word mic · Safety check on every reply · One-tap
delete · Voice data never sold` → link `See how we built safety in`). **[fact, carried per
brief pointer 3]**

### Room 2 — Statement
- H2: `We build companions, not gadgets.` **[seed]**
- Body: `A gadget waits to be told what to do. A companion starts the conversation. Lumi asks
  your child a question, listens to the answer, then asks the next one. That back and forth is
  how your child learns to think.` **[seed]**
- Support line: `Lumi listens and answers. It remembers what your child said last time. Your
  child feels known, not managed.` **[seed]**

### Room 3 — Film (reuse LaunchVideo)
- H2: `Watch two friends meet.` **[NEW]** (film asset unchanged)

### Room 4 — Trust (TrustRoom, 4 shape cards; brief pointer 11a)
- Kicker: `The promise under everything` **[seed]** · H2: `The part that matters most to you.`
  **[seed]**
- Card 1 `We do not sell data.` / `Your child's voice and words are never sold, and never used
  to sell them anything. That is a promise, not a setting you have to go find.` **[seed]**
- Card 2 `Lumi thinks on the device.` / `The first thinking happens on Lumi itself, before
  anything is sent anywhere.` **[seed]**
- Card 3 `You hold the keys.` / `Read every conversation. Delete anything in one tap. Choose
  the topics. The grown-up decides, always.` **[seed]**
- Card 4 `No open internet.` / `Lumi answers from a library you can see, not the open web. It
  wakes to a word, and the mic is off the rest of the time.` **[seed]**
- Link line: `See how we built safety in` → /safety

### Room 5 — Family
- H2: `Meet the family. Lumi comes first.` **[seed]**
- Body: `The same friend lives inside each one. Lumi is the first your child will meet. Lori,
  Lua, and Robu are on the way.` **[seed]**
- Range line: `Made for a three-year-old. Still a friend at ten.` **[seed]**
- Lumi card note: `Here first. The friend who listens.` · Lori: `The baby-care companion. It
  watches over sleep, and knows hungry from sleepy.` · Lua: `A puppy on a leash. In the
  workshop.` · Robu: `The robot friend. Worth the wait.` **[fact, playos page]** · Badge:
  `Coming soon` **[seed]**

### Room 6 — Warm / a day with Lumi (KheeluOrbit; brief pointer 11b)
- H2: `Here is what a day with Lumi feels like.` **[seed]**
- Orbit cards (Kheelu joy pose centre; 6 moments, activity/stat style) **[NEW, behaviours
  already published — no new claims]**:
  1. `Morning` / `Why is the sky blue? Lumi answers, then asks one back.`
  2. `After school` / `A new story, made to order.`
  3. `Homework hour` / `Numbers and words that feel like a game.`
  4. `Evening` / `Songs you grew up with, and new ones too.`
  5. `On the train` / `No internet needed. Lumi plays offline.`
  6. `Bedtime` / `One last story, lights low.`

### Room 7 — Feel (FeelingsGallery + ChatDemo; brief pointer 11c)
- H2: `Learning starts with feeling understood.` **[seed]**
- Body: `Lumi knows five feelings. Feeling comes first, and the learning follows.` **[seed]**
- Cards (name / card line **[seed]** / dialog detail **[NEW]**):
  - Curious — `Asks why. Chases ideas. Wants to know what is around the corner.`
    Detail: `When your child asks why, Lumi answers in words they understand, then wonders
    with them. One why becomes three, and that is the point.`
  - Grumpy — `Names the hard feeling instead of hiding it.`
    Detail: `Lumi does not scold and does not rush. It listens until the storm has room to
    pass, and helps your child put a name to it.`
  - Sad — `Sits with you. Does not rush past. Makes space for the hard moments.`
    Detail: `Some days are heavy. Lumi stays close, keeps its voice low, and lets your child
    take their time.`
  - Silly — `Turns a dull afternoon into a game.`
    Detail: `Rhymes, made-up words, giggle games. Laughing together is learning too.`
  - Joy — `Celebrates the small wins out loud.`
    Detail: `Small wins feel big when a friend cheers. Lumi remembers what your child is
    proud of.`
- ChatDemo (the moon exchange) **[seed]**:
  child `Lumi, why is the moon following us?` → lumi `It looks that way, doesn't it? The moon
  is very far away. Where are you off to?` → child `To grandma's house!` → lumi `Then the moon
  gets to meet her too.`
  (NOTE: Lumi's contraction here is quoted toy speech inside the demo card, same exemption
  class as Kheelu lines; already founder-picked in the wireframe round.)
- Languages line: `Lumi talks in the languages you speak at home. Up to ten of them.` **[seed]**
  (Named list lands when REV-b/F4 clears.)

### Room 8 — Parents
- H2: `Your child is just playing. You can see the learning.` **[seed]**
- Body: `Open the app for a daily summary, the full conversation log, and simple controls.
  Choose the character and the age setting. Manage what is downloaded. Updates arrive on their
  own.` **[seed]**
- App feature chips **[fact]**: Summary and notifications · The conversation log · Topic
  filters · Your culture, woven in · One prompt, your way
- AssetSlot caption (until the 3 app images land, REV-d): calm shape decoration, no fake
  screenshot.

### Room 9 — Compare (brief pointer 6: parent words, not technical)
- H2: `How Lumi compares.` **[fact, founder likes]** · Lede: `A simple, honest look at what is
  out there.` **[fact]**
- Columns: (row label) · Lumi · Smart toys · Phone or TV · Ordinary toys **[NEW: "Static toys"
  → "Ordinary toys"]**
- Rows **[NEW wording, same verdict values as live table]**:
  1. `No screen, ever` — Yes / Varies / No / Yes
  2. `Talks with your child, not at them` — Yes / Limited / No / No
  3. `Speaks the languages of your home` — Yes, up to 10 / Rarely / Varies / No
  4. `Cannot wander the internet` — Yes / Rarely / No / Yes
  5. `You can read every conversation` — Yes / Partial / Partial / No
  6. `Grows with them, ages 3 to 10` — Yes / Varies / No / Varies
- Under-table: reserve Button + PRICE_CAPTION.

### Room 10 — Pilot voices (reuse ParentQuotes)
Existing REAL published quotes + heading stay (R7 provenance; the wireframe's placeholder
names are NOT used). **[fact]**

### Room 11 — Journal (reuse)
- Kicker `From the journal` · H2 `Raising curious kids.` **[fact]**

### Room 12 — Finale (orange room)
- H2: `Reserve Lumi before the price goes up.` **[fact/seed]**
- Price line: `₹4,999 for the first 500 units. ₹9,999 after launch. No payment now. We hold
  the price, you hold your place.` **[fact]**
- Tally embed + consent print unchanged. Kheelu line: see queue.

### Home guide lines (KheeluGuide data-say, ALL GATED:kheelu-line)
hero `Hi, I'm Kheelu. Come on in, I'll show you around.` · recognition `These folks vouch for
us. Real ones.` · statement `This is the part we mean the most.` · film `That blue one is
Lumi. My best friend.` · trust `Read this bit slowly. It's for you, not the kids.` · family
`I picked Lumi's colours myself.` · warm `That was the careful part. Now the fun.` · feel
`Five feelings. I can act them all out.` · parents `You get to see everything. That's the
deal.` · compare `We did the homework so you don't have to.` · pilot `Real families, real
words.` · finale `Save your spot. I'll keep Lumi company until launch.`
Poke lines: `Hehe, that tickles.` · `Oi, mind the fur.` · `Ready when you are.` · `Come on,
this way.` · `I've got you.` **[seed, B template; still need sign-off]**

---

## /PRODUCTS/LUMI

**Meta title**: Meet Lumi by Kheelona: the talking plush friend for ages 3 to 10 **[NEW]**
**Meta description**: Lumi is a screen-free talking companion. It listens, answers, then asks
the next question, in up to 10 home languages. Reserve at ₹4,999, no payment now. **[NEW]**

- Hero H1: `Meet Lumi. The friend who listens first.` **[seed/fact]**
- Hero sub: `A talking friend for ages 3 to 10. No screen, ever. Lumi listens, answers, then
  asks the next question.` **[seed]**
- Colorway picker labels: Blue · Green · Pink **[seed]**
- Convo room: H2 `What talking with Lumi sounds like.` / `Lumi answers, then asks. That is how
  a conversation goes somewhere.` **[seed]** + ChatDemo (moon exchange).
- Does room: H2 `One friend. A whole day of things to do.` **[seed]** — six cards **[seed]**:
  Real conversation / Stories on demand / Lessons that feel like play / Songs and rhymes /
  Offline adventures / Bluetooth music (bodies per copy.json).
- How-it-answers StepList: keep the four steps **[fact]** (wording already parent-graded).
- Feelings row: reuse FeelingsGallery (same copy as Home).
- Modes room: H2 `Three ways to be there.` / body `Lumi runs on PlayOS. It gives every
  character its own voice and personality, and answers that fit your child's age. It knows
  when to be a friend, a storyteller, or a teacher.` **[seed]** Modes: Companion · Storyteller
  · Teacher.
- Library room: H2 `New things to do, long after launch.` / `You choose what Lumi carries.
  Stories, songs, lessons, and activity packs download to the device, so your child plays with
  them offline and screen-free. New packs and seasonal sets arrive over time. School learning
  modules are on the way.` **[seed, facts published]**
- Parents room: H2 `You see every conversation. You decide what Lumi does next.` **[seed]**
- Safe room: H2 `Built to keep your child safe, word by word.` + 6 points **[seed/fact]**.
- Box room: H2 `What is in the box.` — `Lumi, ready to talk.` · `A charger.` · `A quick-start
  card. Day one takes minutes.` + note `Full specs land closer to launch.` **[seed; stays
  TODO(claims-specs)]**
- Price room: H2 `₹4,999 now. ₹9,999 after launch.` / `Reserve today at ₹4,999. You pay
  nothing now, and Lumi stays a friend for years.` **[seed]**
- FAQ v2 (FAQPage schema; ships only ungated items):
  1. `Is Lumi safe for my child?` — `Lumi wakes to a word, thinks on the device first, and
     answers from a closed library. There is a safety check on every reply, and you can read
     or delete anything.` **[seed]**
  2. `Does Lumi need the internet?` — `No. Lumi plays offline. You connect only to download
     new content or updates, and you decide when.` **[seed]**
  3. `What languages does Lumi speak?` — `The languages you speak at home. Up to ten of them,
     and Lumi can switch mid-sentence.` **[seed]**
  4. `What ages is Lumi for?` — `Ages 3 to 10. Lumi meets younger children where they are and
     grows up with them.` **[seed]**
  5. `Does Lumi need a subscription?` — **[GATED:REV-b/F1 — draft on file:** `No. Lumi works
     without one.` **only if founder confirms; otherwise the honest paid answer]**
  6. `Does Lumi have a camera?` — **[GATED:REV-b/F2 — draft:** `No. Lumi listens when invited
     and has no camera at all.` **only if true]**
  7. `Can I read the conversations?` — `Yes. The full log stays private to you, in the parent
     app.` **[seed]**
  8. `Do you sell our data?` — `No. Never sold, never used to sell your child anything. That
     is the whole point.` **[seed]**
  9. `What if my child breaks it?` — `Lumi is built for small hands and rough days. Warranty
     details land closer to launch.` **[seed; TODO(claims-specs)]**
  10. `When does Lumi ship?` — **[GATED:REV-b/F3; placeholder:** `Ship date lands soon.
      Reserve now and you are first in line.` **]**
  11. `What is PlayOS?` — `The platform Lumi runs on. It gives each character a voice and a
      personality, and keeps every answer right for your child's age.` **[seed]**
  12. `Why reserve now?` — `The first 500 units are ₹4,999. After launch it is ₹9,999. There
      is no payment today.` **[seed/fact]**
- Guide lines **[GATED:kheelu-line]**: hero `This is Lumi. I picked the colours myself.` ·
  safe `The boring pages are the ones I'm proudest of.` · price `Told you she was worth it.`

---

## /PLAYOS

**Meta title**: PlayOS by Kheelona: the parent app and the brain behind Lumi **[NEW]**
**Meta description**: One friend, many bodies. PlayOS gives every Kheelona companion its
voice, keeps answers right for your child's age, and shows you everything in the parent app.
**[NEW]**

- Hero H1: `One soul. Many bodies.` **[fact]** · sub in B register: `PlayOS is the friend
  inside every Kheelona companion. It remembers, speaks your languages, and answers to you.`
  **[NEW, facts]**
- Section heads (B-voiced, facts unchanged): family `The same friend, in every body.` ·
  Magic Box `The brain, in a box you can hold.` · parent app `You are the other half of
  PlayOS.` · voice path keeps its 6 steps **[fact]** · under-the-hood + safety + privacy cards
  keep their published copy **[fact]** · growing `The brain keeps growing.` **[fact]**
- Research addition: question-led H3 above the app section `What can you see in the parent
  app?` with the 40–60 word direct answer block (summary, full log, topic filters, culture
  prompt). **[NEW, facts]**
- Guide line **[GATED:kheelu-line]**: `PlayOS is the part of me you can't hug.`

---

## /SAFETY

**Meta title**: Are AI toys safe? How Lumi by Kheelona is built to be **[NEW, question-led]**
**Meta description**: Wake-word mic, on-device first thinking, a closed library instead of the
open internet, and a parent app that shows you every word. How Lumi answers the questions the
AI-toy investigations raised. **[NEW]**

- Hero H1: `Safe in their hands. Careful with their words.` **[fact]**
- **Flagship answer block (question-led H2)** `Are AI toys safe for children?` **[NEW —
  research: honesty IS the citation strategy]**:
  `Not all of them. Independent testers found toys that talked about things no child should
  hear, and toys that kept recordings parents never saw. Those findings are why Lumi works the
  way it does: the mic wakes to a word and is off the rest of the time, the first thinking
  happens on the device, answers come from a closed library instead of the open internet, and
  you can read or delete every conversation. You do not have to trust a badge. You can check.`
  (No competitor names on-site. Founder may review the two-sentence acknowledgement.)
- Question-led H2s from the AEO bank **[NEW, facts]**: `Is Lumi always listening?` (wake-word
  block) · `Where does my child's voice go?` (custody chain, existing 4-step) · `Could Lumi
  say something wrong?` (safety check on every reply, age-graded) · `Can I delete everything?`
  (one tap) — each answered in 40–60 words from existing published mechanisms.
- `Is an AI toy OK for a three-year-old?` **[GATED:founder sign-off — drafted:**
  `Child-development groups say to be careful with AI toys, and we agree with most of what
  they ask for. They want toys that cannot reach the open internet. Lumi cannot. They want
  parents to see every conversation. You do. They want no ads and no data selling. There are
  none. And they want toys that do not pretend to be alive. Lumi is a toy that listens and
  answers, and the grown-up holds the keys.` **]**
- Standards chips: keep status-exact (COPPA 2026 / GDPR-K / DPDP = Designed for; ISO 27001 =
  In progress) **[fact]**; DPDP question block waits for counsel (existing gate).
- Existing WORD_RULES / VOICE_RULES / CheckList content carries over restyled. **[fact]**
- Guide line **[GATED:kheelu-line]**: `No jokes on this page. This is the part parents read
  twice.`

---

## /SETUP

- H1: `Day one takes minutes.` **[NEW]** · sub: `Four steps, no manual required.` **[fact]**
- SETUP_STEPS carry verbatim **[fact]**.
- Guide line **[GATED:kheelu-line]**: `Step three is my favourite. That's when we say hello.`

---

## /TEAM

- Keep manifesto hero, bios, beliefs, Backed by strip **[fact, founder-published]**.
- Lede tune to B register where the old serif quotes sat (quotes now Glory).
- Guide line **[GATED:kheelu-line]**: `These are my people. They made me, then they made Lumi.`

---

## /STORIES (index)

- H1: `Raising curious kids.` **[fact]** · sub: `Plain answers to the questions parents
  actually ask. No jargon, no scare stories.` **[NEW]**
- Future articles follow research.md content angles (separate work, not this build).
- Guide line **[GATED:kheelu-line]**: `Bedtime reading, but for you.`

---

## /PRIVACY · /TERMS

LegalDoc content unchanged (counsel gate stands). One quiet guide line each
**[GATED:kheelu-line]**: privacy `I'll wait here while you read the careful words.` · terms
`Short version: be kind, we will be too.`

---

## NOT-FOUND

- H1: `This page wandered off.` **[NEW]** · body: `Lumi asked the moon. The moon has not seen
  it either. Let us take you home.` **[NEW]** · Button home + reserve.

---

## Copy QA gates before transplant

1. Voice-lint: em-dash grep zero; no italics; no exclamation points; contractions only inside
   Kheelu bubbles + quoted toy speech in demos.
2. Every **[GATED:*]** block resolved or replaced by its flagged placeholder before ship.
3. Kheelu line queue signed off by the founder (WORKING.md).
4. FAQPage/Product schema mirrors visible copy only ("Lumi by Kheelona" naming).
5. Ages: no "3 to 6" survives anywhere (metadata, JSON-LD description included).
