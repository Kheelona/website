---
title: "CMO review, rounds 1 and 2: claims and the parent app on the site's pages (task 8b.1, D058)"
type: qa
updated: 2026-10-14
sources:
  - ../raw/brief/kickoff-brief.md (section 4 non-negotiables; section 6 CMO Reviewer)
  - ../decisions/D058-follow-the-live-code-check-2026-10-14.md (items 1-9)
  - ../decisions/D015-founder-signs-off-copy.md
  - ../decisions/D035-model-training-opt-out.md (customer pages say nothing about training and never imply there is none)
  - live-main-reconciliation-2026-10-14.md (§1 rows P1-P14, T1-T8; §2 the withdrawn claims)
  - "origin/main 8c4718a, read directly by this review with git show: src/app/(site)/privacy/page.tsx:200-252, src/app/(site)/terms/page.tsx:73-86, src/app/(site)/safety/page.tsx:45-48, 96-108; commit message of c630a49 (#19)"
  - "../site/pages/{privacy,terms,home,meet-kheelu,safety,setup,ai-toys-for-kids-in-india,team,stories,404,contact,store}.md (worktree w8b-8b.1, git diff against 0d8344b)"
  - ../brand/voice.md, ../brand/messaging.md (words to stop using; claims guardrails), ../product/claims.md §4, ../site/content-boundary.md
  - ../research/keyword-map.md (RT1 and P1 drafts, lines 690-696)
  - "test/guards/banned-phrases.test.ts and placeholders.test.ts, run in the worktree 2026-10-14: 2 files, 229 tests passed"
  - test/guards/answer-length.test.ts (40-60 words; counting rules used for the word counts below)
  - "Round 2: the twelve pages as of 2026-10-14 00:52 (worktree w8b-8b.1); round 1's text of home, meet-kheelu, safety and terms rebuilt from round 1's own diffs against 0d8344b; Copy-block lines of privacy, setup, ai-toys-for-kids-in-india and store diffed against 0d8344b"
  - "Round 2: origin/main 8c4718a read with git show: src/app/(site)/privacy/page.tsx:200-252, src/app/(site)/terms/page.tsx:76-87, src/app/(site)/safety/page.tsx:38-48, src/features/home/components/TrustRoom.tsx:27"
  - "Round 2: mockup/assets/app/app-activity.webp and app-privacy.webp (viewed 2026-10-14); test/guards/banned-phrases.test.ts and placeholders.test.ts re-run in the worktree (2 files, 229 tests passed)"
---

# CMO review, round 1: claims and the parent app (task 8b.1)

**Verdict: FAIL. 1 blocking issue, 14 minor.**

The copywriters did careful work. Every withdrawn claim on the twelve pages is gone: one-tap delete, "servers in
India", "providers keep none of it", the closed library, the age-graded safety layer, topics, quiet hours, the
new-word count, the four-skills report, "about a minute" and "the app is part of Kheelona+". Every replacement line
traces to D058, the map or the live code. No other copy line moved. Two lines were reordered to keep a word count or
a pronoun right, and both are recorded. Every changed FAQ answer is inside 40-60 words, and the banned-phrase guard
passes over every Copy block.

The one blocking gap is fix (g). `/privacy` says the app collects no location, but it leaves out the live page's
reason why the phone asks for location permission during setup. Every parent who sets Kheelu up will see that
prompt. Without the reason, "collects no location" reads as a contradiction at exactly the moment a parent is
deciding whether to trust us.

This is a copy review, so there is no built page and no screenshot. The founder signs off every line here
([D015](../decisions/D015-founder-signs-off-copy.md)), with D029's legal sign-off for `/privacy` and `/terms`. This
review does not replace either.

**Read against origin/main directly.** The copywriters had no shell, so they wrote from the map's quotes and asked
for a check. I read `origin/main` (`8c4718a`) with `git show`. The results are under
[Checks done here](#checks-done-here-against-originmain). Three of the copywriters' notes say "the live page gives
none". In each case it does, and that answers three open questions (m2).

## Fix by fix

| Fix | Pages it reaches | Applied? | Note |
|---|---|---|---|
| (a) one-tap delete goes; remove hides on that phone; account deletion deletes account, profile, conversations, recordings; 36 months stays | privacy (short 5, §2, RT1, §8, §9), terms §10, home folds 5-6, meet-kheelu folds 6 and 8, safety folds 2 and 5, setup fold 6, ai-toys fold 3, team fold 4 | Yes | Seven wordings across the pages (m7). Whether "from our servers" covers the training data is open (m6) |
| (b) "servers in India" and "keep none of it" go; processors named on /privacy; "Kheelona's servers" elsewhere | privacy §2, short 3, P1, RT1, §7; home, meet-kheelu and safety item 2 | Yes | Home, the product page and /safety name no place now, and do not add "Kheelona's servers". I accept that: the next sentence, "They don't keep it", would read as our servers keeping nothing (safety question 7, option (a), which I endorse). D020's no-keep, no-train promise is intact |
| (c) closed library and age-graded layer go; AI model with child-safety rules and the age, Google's filters on top; cannot browse | privacy §2, terms §9 and §12, home fold 5 and FAQ, meet-kheelu specs, Safety tab and FAQ 3, safety folds 4 and 7, setup fold 4, ai-toys fold 3 and Q3, team | Yes | Six wordings of the one fact; two read unclearly (m8) |
| (d) topics and quiet hours go | safety fold 4, setup fold 4 | Yes | /safety fold 4 gains "Voice recordings" in their place. D058 item 1 brings the switch in, and it depends on backend PR #39 (safety question 9) |
| (e) new-word count and four-skills report go; word for word, a few minutes after, daily summary, search, week or month | home fold 5, meet-kheelu fold 5 and specs, privacy §2, terms §10 | Yes | meet-kheelu fold 5's H2 had to change, because it named the report. See the positioning note (m14) |
| (f) "a couple of minutes of quiet" | privacy (x2), home, meet-kheelu (x3), safety, setup, ai-toys | Yes | |
| (g) /privacy: Wi-Fi name stays on the phone; no location, with the live reason | privacy §2 | **Partly** | The reason is missing: **B1** |
| (h) footer "No web browsing." | home.md Footer (`navigation.ts:75`) | Yes | /safety fold 3's own "No open internet." is not the footer (m12) |
| (i) Kheelona+ line, verbatim, no feature list, app not inside Kheelona+ | home close, meet-kheelu OfferCard and fold 5, store (both modes), terms §3 | Yes | Verbatim in all six places. On the store it now reads into the price sentence (m10) |
| (j) #18's app sections on /privacy and /terms | privacy §2, §7, §8, §9; terms §10, §12 | Yes, except P7 | Row by row below |
| Keep: own-model training and opt-out; Bluetooth; the eight languages; 36 months; Aman Soni | privacy §3 and §14, terms §11 and §16, home fold 4, meet-kheelu, setup fold 6, ai-toys Q4 | Yes | Nothing about training on any customer page (D035) |

## #18 completeness, against the live text

| Row | Live (`origin/main` `privacy/page.tsx`, `terms/page.tsx`) | Rebuild | Verdict |
|---|---|---|---|
| P3 | :216 mobile number, one-time code by SMS; your name and relation, if you add them | privacy §2, account item | Pass (a sentence fragment, m3) |
| P4 | :217 first name, age, pronouns, languages, "so Kheelu can talk with them properly"; photo only if added | privacy §2, profile item | Pass. The purpose is not carried (m2) |
| P5 | :218 voice sent to our servers; written record; recording kept "unless you turn off Save voice recordings in the app's privacy settings" | privacy §2, §8, §9 | Pass, wording matches |
| P6 | :219 toy ID, "the name you give it", battery and Wi-Fi strength, last online | privacy §2 | Pass ("its name" is unclear, m3) |
| P7 | :225 no location; "Your phone asks for location permission while you set up Kheelu only because Android and iPhone require it before an app can read the name of your WiFi network, and that name stays on your phone." | privacy.md:228-229: "collects no location"; the name "stays on your phone" | **Fail: the reason is missing (B1)** |
| P8 | :226 no advertising, no advertising or analytics tools in the app | privacy.md:228 | Pass |
| P9 | :232-233 the eight named, each with its job; "Some of them process it outside India." | privacy §7, one row; §2 | Pass on names and "outside India". The jobs are not carried (m1) |
| P10 | :239 privacy settings: Save voice recordings, download data, delete account | privacy §9 | Pass. The training switch is missing from the list (m4) |
| P11 | :240 removing a chat hides it on that phone; delete the account or write to us | privacy §9 | Pass |
| P12 | :241 deleting the account removes account, profile, conversations and recordings "from our servers" | privacy §8, §9 (without "from our servers") | Pass. Saying less is safe; the note's reason is wrong (m2) |
| T2 | :81 18 or over; responsible for how your child uses Kheelu | terms §10 | Pass |
| T3 | :82 free; one-time code; "keep that code to yourself and tell us if you think someone else is using your account" | terms §10 | Pass ("nothing is sold inside it" dropped by D058 item 3). The code-safety clause is not carried (m9) |
| T4 | :83 replies generated by a model; can be wrong; conversation, not advice | terms §12 | Pass |
| T5 | :84 conversations need home Wi-Fi; downloaded stories and songs play without it | terms §10 | Pass |
| T6 | :85 don't break in, copy, "or use the app or Kheelu to harm anyone"; "If you do, we can close the account." | terms §10 | Pass. The close condition matches; the harm clause is not carried (m9) |
| T7 | :86 stop and delete at any time from privacy settings | terms §10 | Pass |

## Verdict per page and criterion

Criteria: **1** each fix that reaches the page is applied as asked · **2** every withdrawn claim gone · **3** no new
or inflated claim (each new line traces to D058, the map or the live code) · **4** nothing changed that D058 or the
map did not ask for; every other line is the approved one · **5** #18's app sections complete (privacy and terms
only) · **6** changed FAQ answers 40-60 words · **7** no banned wording · **8** calm, plain, one idea per fold; serves
a parent of a 3-7 year old.

| Page | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| privacy | **FAIL** (g, B1) | Pass | Pass | Pass | **FAIL** (P7, B1) | P1 56 pass; RT1 32 (minor m5; was 38 at Gate A, not under the guard) | Pass | Pass, minors m1-m4 |
| terms | Pass | Pass | Pass | Pass (§9 reorder recorded) | Pass (m9) | n/a | Pass | Pass, minor m9 |
| home | Pass | Pass | Pass | Pass ("At setup" swap recorded) | n/a | Age FAQ 58 | Pass | Pass, minors m7, m8 |
| meet-kheelu | Pass | Pass | Pass | Pass (fold 5 H2 needed: it named the report) | n/a | FAQ 3 59, FAQ 7 42 | Pass | Pass, minors m7, m14 |
| safety | Pass | Pass | Pass | Pass ("Voice recordings" item is D058 item 1's) | n/a | Fold 2 items 1-2: 57, 42 | Pass | Pass, minors m7, m8, m12 |
| setup | Pass | Pass | Pass | Pass | n/a | n/a | Pass | Pass, minor m7 |
| ai-toys-for-kids-in-india | Pass | Pass | Pass | Pass | n/a | Q3 59 | Pass | Pass, minor m13 |
| team | Pass | Pass | Pass | Pass | n/a | n/a | Pass | Pass |
| stories | n/a (no copy change; checked) | Pass | Pass | Pass | n/a | n/a | Pass | Pass |
| 404 | n/a (no copy change; checked) | Pass | Pass | Pass | n/a | n/a | Pass | Pass |
| contact | n/a (no copy change; checked) | Pass | Pass | Pass | n/a | n/a | Pass | Pass |
| store | Pass | Pass | Pass | Pass | n/a | n/a | Pass | Pass, minor m10 |

Word counts use the answer-length guard's rules: hyphenated words count as one, and a token counts as one word.

## Blocking

**B1 · /privacy, Section 2: fix (g) is half applied (criteria 1 and 5).** At `privacy.md:228-229` the page says
"The parent app collects no location … The name of your Wi-Fi network stays on your phone". It leaves out the live
reason why the phone asks for location permission during setup (`origin/main privacy/page.tsx:225`). The task names
"(the live reason)", and the reason is what makes "collects no location" believable to a parent who has just tapped
"Allow location" on their phone. **Fix (Copywriter):** replace the paragraph with:

> The parent app collects no location. Your phone asks for location permission while you set Kheelu up. That is only
> because Android and iPhone require it before an app can read the name of your Wi-Fi network, and that name stays on
> your phone. Your account doesn't keep the Wi-Fi password. The app has no advertising or analytics tools.

Then update row 12 of "Changes after approval (task 8b.1)", the Section 2 note (P7) and the sources row for P7, citing
`privacy/page.tsx:225`.

## Minor

**m1 · /privacy §7: one row for eight companies under "Each of these companies does one job for us."**
(`privacy.md:471-475`). The approved lead now reads wrong. Question 13 assumes the live page gives no jobs. It does
(`privacy/page.tsx:232`): Google Cloud hosts our servers and stores recordings and photos; Google's Gemini turns what
your child says into Kheelu's reply; Sarvam AI does speech for some Kheelu voices; Twilio sends the sign-in codes;
Aiven and Redis run our databases; New Relic and Sentry help us find errors on our servers. **Fix (Copywriter, then
CTO):** before Gate B, take question 13's option (b). Use one row per job, in the live words above. The CTO gives each
row's "Where". Until then, keep the one row but correct question 13's premise and the §7 sources note ("the map gives
none" becomes "the live page gives each job at `privacy/page.tsx:232`; regions per company wait on the CTO").

**m2 · /privacy notes and questions rest on "the live page gives none", and it does.** (a) Question 10
(`privacy.md:927`): the live P4 gives a purpose, "so Kheelu can talk with them properly" (`:217`). **Fix
(Copywriter):** profile item becomes "**Your child's profile:** their first name, pronouns and languages, which the
parent app asks for so Kheelu can talk with them properly, and a photo only if you add one." Then mark question 10
answered by the live page. (b) The Section 9 note (`privacy.md:626-630`) says the live P12 "names none". It reads
"from our servers" (`:241`). Correct the note. The page's choice to leave the words out is still right while question
11 is open. (c) Question 13: see m1.

**m3 · /privacy §2, the account item has a sentence fragment and an unclear "its name".** (`privacy.md:223-226`).
**Fix (Copywriter):** split it into two items, in the live words:
"- **Your parent-app account:** your phone number, which you sign in with using a one-time code, and your name and how
you're related to your child, if you add them.
- **Kheelu's setup:** its serial or device ID, the name you give it, its battery and Wi-Fi strength, when it was last
online, and your phone's model and operating system."

**m4 · /privacy §9: the list "In the app's privacy settings, you can:" leaves out the training switch.**
(`privacy.md:577-581`). Short-version item 4 and §3 say training is turned off "with a switch in the parent app"
(D058 item 5), but the live code check's list of the app's settings names no such switch (map, question C). A parent
reading §9 will look for it and not find it. **Fix (CTO, then Copywriter):** the CTO says where the switch is. If it is
in the privacy settings, add "- turn off training of Kheelona's own model ([Section 3](#training));". If it is
elsewhere, add one sentence after the list saying where. Apply question 7 option (b) at the same time.

**m5 · /privacy RT1 answer-first block is 32 words** (`privacy.md:530-531`; 38 at Gate A; the keyword map's RT1 asks
40-60, and the guard does not cover this block). **Fix (Copywriter, founder's OK):** add one fact the page already
states, as the second sentence: "You can read every one of them there, word for word." That makes 43 words.

**m6 · What deleting the account reaches: "from our servers" on four customer pages, but not on /privacy or /terms**
(home.md:672, meet-kheelu.md:464, safety.md:284, ai-toys-for-kids-in-india.md:170, all "deletes … from our
servers"). This is D058's and the live wording, so it is not inflated. But the training data sits on our servers too
(D055 item 12), and no decision says account deletion removes it (privacy question 11). If it does not, those four
lines imply that no training copy remains, and D035 forbids customer pages from implying there is none. **Fix
(CTO answers question 11 before Gate B; then Copywriter):** if (b), add "and takes them out of our training data"
to privacy §8 and §9 and terms §10. If (c), drop "from our servers" on the four customer pages, and add (c)'s sentence
to privacy §9 and terms §10.

**m7 · The deletion line is worded seven ways, and on Home it leads the safety fact with a limit.** Home fold 6
item 3 (`home.md:672`, the ad landing page) now reads "In the parent app. Removing a chat there hides it on that
phone. …" A parent scanning "Safety you can check" meets a caveat before the reassurance. /safety fold 2 item 3 says
it better: "Yes, in the parent app, word for word, a few minutes after each one ends. Delete them all by deleting your
account." The hide-on-that-phone detail belongs on /safety fold 5 and /privacy §9, where it already is. The copywriters
kept it on Home and the product page because the real privacy screenshot beside them shows a "Delete all chats"
button. **Fix:** (1) Builder: crop the button out of the privacy screenshot (meet-kheelu question 11, option (b), as
D044 cropped the banner) if it only hides chats. (2) Copywriter, once the crop is done: Home item 3 body becomes "In
the parent app, word for word, a few minutes after each one ends. Delete them all by deleting your account." The
product page's item 3 becomes "Your child's conversations stay in your parent app for 36 months, then they're deleted
automatically. Delete them all sooner by deleting your account." On /setup fold 6 (`setup.md:285`), drop the two
deletion sentences, so the first-conversation fold keeps one idea; deletion is covered on /safety and /privacy. If the
button stays on the screen, keep the copywriters' sentences as they are.

**m8 · The safety-mechanism sentence is worded six ways, and two forms read unclearly.** (a) /safety fold 4
(`safety.md:227`): "the AI model that answers your child is given it, with child-safety rules": "it" is far from
"age". **Fix (Copywriter):** "Enter it when you set Kheelu up, and change it later if you need to. On every
conversation, the AI model that answers your child is given that age and child-safety rules." This is /setup's wording,
without the filters, which fold 7 names. (b) Home fold 5 bullet 3 (`home.md:608`): "The AI model gets …" comes before
the page has mentioned any AI model. **Fix:** "You set your child's age in the app. The AI model that answers your
child gets child-safety rules for that age, with Google's safety filters on top." This adds no "Kheelu", so the
density is unaffected. Leave the FAQ form as it is: at 58 words it has no room.

**m9 · /terms §10 and §12: two live clauses not carried, and two phrasing points.** (`terms.md:397-406, 456-460`).
**Fix (Copywriter):** (1) T3: after "You sign in with your phone number and a one-time code." add "Keep the code to
yourself, and tell us if you think someone else is using your account." (2) T6: "Don't try to break into our systems,
copy the service, or use the app or Kheelu to harm anyone. If you do, we can close your account." (3) "Deleting it
deletes the account, …" becomes "That deletes the account, your child's profile, and their conversations and voice
recordings." (4) §12 has six sentences, about 95 words, in one paragraph. Break it after "It cannot browse or search
the web." so it reads on a phone. Optional: §10's "Stories and songs you've downloaded" is the app's own word ("songs",
c630a49), while the rest of the site says Story mode plays "stories, poems and jingles" (D027). Keep "songs" only if
the app's Play section uses it.

**m10 · Kheelona+ as "our paid subscription", at the moment of payment.** (a) Store fold 4, token mode
(`store.md:265`): the next sentence, "The price is ₹4,999 …", can now be read as Kheelona+'s price. **Fix
(Copywriter):** store question 5 option (b), "Kheelu's price is ₹4,999 …". (b) The same sentence on Home's close, the
product OfferCard and the store raises "will it start charging me after six months?", while the store says "nothing
recurring" and "nothing is ever charged automatically". **Fix (founder, through the main session):** before Gate B,
confirm store question 6 option (b), that Kheelona+ never charges without the parent's own sign-up. If it could
renew by itself, those store lines must change first. (c) /terms §10's "The parent app is free." comes just before
the list of what the app shows, so a parent may read every feature in that list as free for good. D058 item 3 says
that is not decided. **Fix (Copywriter):** put the feature paragraph first and the "free" sentence after it, or
accept the reading at Gate B.

**m11 · "We test it before launch by trying to make it say unsafe things" and "when it isn't sure, it says it doesn't
know"** (terms.md:458, safety.md:366, meet-kheelu.md:552; the doesn't-know line also on ai-toys fold 3 and Home's
thinking-less FAQ). D058 withdraws "We attack our own safety layer before every release" and names neither of these.
But the live team's own rewrite of the same answer, "Could Kheelu say something wrong?" (c630a49), dropped both the
red-team sentence and any doesn't-know line. **Fix (founder and Aman, before Gate B):** confirm the pre-launch test
took place, and that the model's child-safety rules tell it to say when it doesn't know (terms question 9, safety
question 6, meet-kheelu question 12, ai-toys question 3). If either is not confirmed, the Copywriter cuts that half
wherever it appears.

**m12 · /safety fold 3's "No open internet."** (`safety.md:190`). The footer changed this for the live team's reason:
Kheelu does use the internet, on home Wi-Fi. **Fix (Copywriter, founder's OK):** safety question 5 option (a), retitle
it "No web browsing." and keep the body. The product page's spec row "Open internet: It can't browse it" and the
buyer's guide's check 3 can stay, since both answer precisely.

**m13 · Buyer's guide check 4 now sets a bar Kheelu only partly meets.** (`ai-toys-for-kids-in-india.md:118`):
"Ask whether you can read every word, and delete it yourself." Kheelu's answer (fold 3) is that you delete by
deleting the account, while the meta promises "how Kheelu meets each". **Fix (Copywriter, founder's OK):** "Ask
whether you can read every word, and how you delete it."

**m14 · Positioning note: the four thinking skills are now on no page.** SKM's "model parents repeat" (words,
reasons, stories, questions) was EXTERNAL only as what the weekly report covers (D036). D058 item 8 takes the report
off until it ships, so meet-kheelu fold 5 and Home fold 5 no longer name it. That is right. Naming the skills without
the report would turn them into an outcome claim (legal review L7). **Fix:** no copy change now. The main session logs
it for the founder and SKM: when the report ships, meet-kheelu fold 5's H2 "Their week, in four thinking skills." and
its chips come back.

## Checks done here against origin/main

The copywriters' "Checks" sections asked for these. Each comes from `git show origin/main:<path>` at `8c4718a`.

- **P7 (no location):** the reason is missing. B1.
- **P5 (the switch):** "unless you turn off Save voice recordings in the app's privacy settings" (`privacy/page.tsx:218`).
  The rebuild matches. PR #39 must still be live before Gate B (safety question 9; privacy Checks).
- **T6 (closing the account):** "If you do, we can close the account." (`terms/page.tsx:85`). The rebuild's "If you
  do, we can close your account." matches.
- **New Relic and Sentry beside "no analytics tools in the app":** "New Relic and Sentry help us find errors on our
  servers" (`privacy/page.tsx:232`). They run on the server, so the app line holds as the live team wrote it.
- **Safety question 8:** the talk-time limit reads "Each Kheelu has a daily limit on how long it talks, and a single
  conversation cannot run on without end." (`safety/page.tsx:48`). No parent sets it, so it is not a fold 4 control;
  option (b) fits. The Wi-Fi line reads "Between conversations nothing is sent anywhere, and when Kheelu rests, its WiFi
  is switched off." (`:45`).
- **Privacy questions 10 and 13; the Section 9 note:** answered by the live page (m1, m2).

## The brief's other checks, for this round

- **Internal leakage:** none. No survey figures, competitor names or prices, unit counts or analytics. The processors
  on `/privacy` are a legal disclosure the founder decided (D058 item 6). "Google's safety filters" names a supplier,
  not a competitor.
- **One next step, five seconds, a few taps:** no CTA, hero, price or checkout line changed. The Kheelona+ sentence adds
  a question at the close and the store (m10).
- **Ad-landing message match:** unchanged. Home's safety fold is the one ad-landing change worth tightening (m7).
- **Visual (360-1440 px), motion, Lighthouse:** not applicable. There is no built page in this round. They are checked
  on the built pages after the builder carries these lines into `src/content`.

## Routing

- **Copywriter:** B1; m1-m5, m7-m9, m10 (a) and (c), m12, m13.
- **Builder:** m7 (1), the screenshot crop.
- **CTO, through the main session:** m1 (regions per company), m4 (where the training switch is), m6 (privacy question 11).
- **Founder, through the main session:** m10 (b), m11 (with Aman), m14, and the founder's OK on m5, m12 and m13.

## Round 2

**Verdict: PASS. No blocking issue. 5 new minor findings. Round 1's points that wait on the CTO, the founder and
Aman, or the builder are carried below, not re-raised.**

The copywriters applied every round-1 fix routed to them, in the words asked, and recorded each one in the page's
"Changes after approval (task 8b.1)" section. The one blocking gap, B1, is closed: `/privacy` Section 2 now gives the
live reason the phone asks for location permission, word for word against `origin/main` `privacy/page.tsx:225`. No
withdrawn claim came back. Every clause added in round 2 is either the live page's own wording (P4, P6, P7, T3, T6)
or a fact the page already states (RT1). No FAQ answer changed, and the guards pass. The fixes that wait on someone
else are staged as questions on the pages, with the wording ready.

This is still a copy review, so there is no built page and no screenshot of one. The founder signs off every line
([D015](../decisions/D015-founder-signs-off-copy.md)), and `/privacy` and `/terms` also take D029's legal sign-off.
This review replaces neither.

### How round 2 was checked

- **Exactly what changed since round 1.** Round 1's own diffs of home, meet-kheelu, safety and terms (saved at
  00:29-00:32) were re-applied to `0d8344b` to rebuild the round-1 text, then diffed against the current pages.
  Privacy, setup, the buyer's guide and the store have no round-1 snapshot. For those four, every Copy-block line was
  diffed against `0d8344b`, and each difference was matched to a row of the page's changes table. Team, stories, 404
  and contact were last written at 00:19-00:21, before round 1 (00:41), so they are unchanged.
- **Live wording.** `git show origin/main` at `8c4718a`: `privacy/page.tsx:200-252`, `terms/page.tsx:76-87`,
  `safety/page.tsx:38-48`, `TrustRoom.tsx:27`.
- **Guards.** `test/guards/banned-phrases.test.ts` and `placeholders.test.ts`, run in the worktree: 2 files, 229
  tests passed. The placeholders it lists are the known F4 tokens in `src/`, not copy pages.
- **App screens.** `mockup/assets/app/app-activity.webp` and `app-privacy.webp`, viewed for r2-m2 and r2-m3.
- **Sweep.** Every Copy block on the twelve pages was searched for the withdrawn words: one tap, in India or servers
  in, keep none, closed or curated library, age-graded or safety layer, topics, quiet hours, new words, four
  thinking skills, weekly report, about a minute, open internet, the app inside Kheelona+, attack, region. None is
  left. "Open internet" remains only in the buyer's guide's check 3 and the product page's spec row, both kept in
  round 1 (m12). "In India" remains only in delivery lines and "Made in India".

### Round-1 findings, one by one

| Round 1 | Routed to | Round 2 | Where now | Verdict |
|---|---|---|---|---|
| **B1** P7's reason | Copywriter | Applied word for word; changes row 12; the note and source row follow | privacy.md:229-232 | **Pass.** Matches `privacy/page.tsx:225`, split for a phone |
| m1 §7 one row | Copywriter (note), CTO (regions) | Q13's premise corrected; per-job rows drafted from `:232`; the §7 note fixed | privacy.md:509, 989-1011 | Pass as asked; the regions wait on the CTO |
| m2 (a) P4 purpose | Copywriter | "so Kheelu can talk with them properly"; Q10 marked answered | privacy.md:222-223 | Pass (`:217`) |
| m2 (b) §9 note | Copywriter | Corrected: the live P12 says "from our servers" | privacy.md:654-662 | Pass |
| m3 account and setup | Copywriter | Two items, in the live words | privacy.md:224-227 | Pass (`:216`, `:219`) |
| m4 training switch | CTO, then Copywriter | A §9 note and a CTO check; Q7 tied to the answer | privacy.md:644-649, 1033-1037 | Waiting on the CTO |
| m5 RT1 length | Copywriter, founder's OK | "You can read every one of them there, word for word." as the second sentence: 43 words; Q14 | privacy.md:547-549 | Pass |
| m6 "from our servers" | CTO | Q11 now lists four customer pages; each of them has a matching question | privacy Q11; home Q14; meet-kheelu Q14; safety Q11; ai-toys Q5 | Waiting on the CTO. The reach list is incomplete (r2-m1) |
| m7 deletion line on Home | Builder (crop), then Copywriter | Wording staged; the copy waits on the crop | home Q15; meet-kheelu Q11; setup Q8 | Waiting on the builder; see r2-m2 and r2-m3 |
| m8 (a) /safety fold 4 | Copywriter | "is given that age and child-safety rules" | safety.md:232 | Pass |
| m8 (b) Home fold 5 | Copywriter | "The AI model that answers your child gets …"; no "Kheelu" added; the FAQ form left alone | home.md:609 | Pass |
| m9 (1)-(4) /terms §10, §12 | Copywriter | Code rule (T3), harm clause (T6), "That deletes …", §12 split in two | terms.md:401-411, 469-475 | Pass (`terms/page.tsx:82`, `:85`) |
| m9 optional "songs" | Copywriter | Kept as a check, not changed | terms.md:737 | Answered by the live text (r2-m5) |
| m10 (a) store price | Copywriter | "Kheelu's price is …", token mode only | store.md:266 | Pass |
| m10 (b) Kheelona+ renewal | Founder | Store Q6 asks; /terms points to it | store Q6; terms.md:717-720 | Waiting on the founder |
| m10 (c) "free" order | Copywriter | Feature paragraph first, then "The parent app is free."; no word changed | terms.md:398-402 | Pass |
| m11 test and doesn't-know | Founder and Aman | Each page's question now covers every place it appears, with the fallback wording and its word count | terms Q9; safety Q6; meet-kheelu Q12; ai-toys Q3; home Q13 | Waiting on the founder and Aman |
| m12 /safety fold 3 | Copywriter, founder's OK | "No web browsing."; body unchanged; Q5 | safety.md:191 | Pass |
| m13 buyer's guide check 4 | Copywriter, founder's OK | "…and how you delete it."; Q6 | ai-toys-for-kids-in-india.md:119 | Pass |
| m14 four thinking skills | Main session | Nothing on the pages; noted in meet-kheelu's round-2 block | meet-kheelu.md:1120-1125 | For the log |

### Verdict per page and criterion (round 2)

The same criteria 1-8 as round 1.

| Page | Round-2 copy change | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| privacy | B1, m2, m3, m5 | Pass (fix (g) complete) | Pass | Pass | Pass | **Pass** (P3-P12 complete) | P1 56, RT1 43 | Pass | Pass; r2-m1, r2-m5 |
| terms | m9 (1)-(4), m10 (c) | Pass | Pass | Pass | Pass | Pass (T2-T7 complete) | n/a | Pass | Pass; r2-m5 |
| home | m8 (b) | Pass | Pass | Pass | Pass | n/a | none changed (age FAQ 58) | Pass | Pass; m7 open |
| meet-kheelu | none | Pass | Pass | Pass | Pass | n/a | none changed | Pass | Pass; m7 open |
| safety | m8 (a), m12 | Pass | Pass | Pass | Pass | n/a | none changed | Pass | Pass; r2-m4 |
| setup | none | Pass | Pass | Pass | Pass | n/a | n/a | Pass | Pass; r2-m2 |
| ai-toys-for-kids-in-india | m13 | Pass | Pass | Pass | Pass | n/a | none changed | Pass | Pass |
| team | none | Pass | Pass | Pass | Pass | n/a | n/a | Pass | Pass; r2-m1 |
| stories, 404, contact | none | n/a | Pass | Pass | Pass | n/a | n/a | Pass | Pass |
| store | m10 (a) | Pass | Pass | Pass | Pass | n/a | n/a | Pass | Pass |

On criterion 4 (nothing changed that D058 or the map did not ask for): every round-2 copy change was asked for by
round 1, and each serves a D058 line or a map row. Three of them reach beyond D058's own words, and each carries a
question for the founder's OK at Gate B: RT1's added sentence (privacy Q14), "No web browsing." on /safety fold 3
(safety Q5) and check 4's ending (ai-toys Q6).

### New in round 2: minor

**r2-m1 · Privacy question 11 does not list every line its answer reaches.** Q11, and the matching questions on Home,
the product page, /safety and the buyer's guide, list four customer pages that say account deletion deletes the data
"from our servers". Three more customer lines make the same everything-is-gone promise in other words:
/safety fold 2 item 3, "Delete them all by deleting your account." (`safety.md:121`); /team, "and delete them all by
deleting your account" (`team.md:188`); /setup fold 6, "Deleting your account deletes every conversation and
recording." (`setup.md:286`). The first two are the live team's own phrase ("Delete it all by deleting your
account.", `TrustRoom.tsx:27`), so they are D058's. The point is only that the CTO's answer reaches them too, and so
does round 1's m7 wording for Home and the product page, which borrows /safety's line. For the CTO: the live
`/safety` code comment says "deleting the account deletes everything" (`safety/page.tsx:42`), but it does not mention
the training data. **Fix (Copywriter, notes only now):** add the three lines to privacy Q11's list and to home Q14,
meet-kheelu Q14, safety Q11 and ai-toys Q5. If the CTO answers (c), these lines lose "all" and "every" in the same
commit as "from our servers" ("Delete them by deleting your account."); for /setup, see r2-m2.

**r2-m2 · /setup fold 6: take question 8's option (b) now.** Round 1 tied dropping fold 6's two deletion sentences to
the crop of the privacy screenshot. On /setup that tie does not hold. Fold 6's picture is the activity screen
(`mockup/assets/app/app-activity.webp`: Activity, chat search, Today, Week and Month, and a list of chats), and it has
no delete control. So nothing on screen needs the "hides it on that phone" explanation, and the first-conversation
fold carries a second idea for no reason. Dropping the sentences also takes /setup out of r2-m1. **Fix (Copywriter,
founder's OK at Gate B):** apply setup Q8 option (b). Fold 6's second paragraph becomes "Later, open the parent app to
read every word of it." Update the fold 6 note, the sources row and the changes table. Deletion stays on /safety fold
5 and /privacy Section 9.

**r2-m3 · The privacy-centre screenshot predates the code check, and it has no "Delete account" row** (refines m7).
`app-privacy.webp`, from the founder's demo video (logged 2026-10-11), shows "Keep chats for 36 months", "Save voice
recordings", "Download Aarav's data" and "Delete all chats". It shows no "Delete account" row. But /privacy §9 and
/terms §10 say, in the live team's code-checked words (`privacy/page.tsx:239`, `terms/page.tsx:86`), that the account
is deleted in the app's privacy settings. The screenshot appears on Home's built fold 6, the product page's fold 6 and
/safety fold 4. If the builder only crops "Delete all chats" (m7), the screen will show no way to delete anything,
beside copy that tells the parent to delete the account. **Fix (founder, then Builder):** if the current app's privacy
centre shows "Delete account", replace the screenshot with a fresh capture (names replaced, as D044 did), cropped so
"Delete all chats" does not show if it only hides chats. Then Home Q15 and meet-kheelu Q11 take their staged wording.
If the app has no such row, crop as m7, and the CTO says where account deletion lives, so /privacy §9 and /terms §10
name the right place.

**r2-m4 · D058's two added safety facts are on no page, and safety question 8 is out of date.** D058 item 1 brings in
"the daily talk-time limit" and "Kheelu's WiFi off at rest". Neither is on any of the twelve pages (searched for
talk-time, talk time, daily limit, how long it talks, switched off, rests). Safety Q8 (`safety.md:597-603`) still says
their live sentences could not be read, and it still recommends (a), which applies only "if a parent sets it". Round
1 read both sentences: "Each Kheelu has a daily limit on how long it talks, and a single conversation cannot run on
without end." (`safety/page.tsx:48`) and "Between conversations nothing is sent anywhere, and when Kheelu rests, its
WiFi is switched off." (`:45`). No parent sets the limit. Q8's option (b), "leave both to /privacy and the product
page", points at pages that do not carry them either. These two facts are not in the task's fix list (a)-(j), so this
is minor. They are true, calming and specific, which is what a parent checking safety wants. **Fix (Copywriter,
founder's OK):** rewrite Q8 with the two live sentences and the fact that no parent sets the limit. Offer this:
/safety fold 3 ("What you won't find in Kheelu") gains a sixth item in the live words, for example "**No endless
talking.** Each Kheelu has a daily limit on how long it talks, and a single conversation can't run on without end."
The Wi-Fi line goes beside the wake-up button on the product page, as Q8 suggests. /safety fold 2 item 1 has no room
for it: it is at 57 of 60 words. Update the fold 4 note (`safety.md:259-262`) and the placeholders note
(`safety.md:543-544`), which repeat "not read".

**r2-m5 · Stale notes (notes only, no copy).**
(a) `privacy.md:25` and `:1163-1164`, and `terms.md:24` and `:831`, still say origin/main "was not re-read" in task
8b.1, while each page's Checks now says the check is done (`privacy.md:1030`; terms Checks). `safety.md:20`, `:598`
and `:684`, and `setup.md:27` and `:508`, say the same of the copywriters' pass. That is true, but each should add
that the CMO review read origin/main.
(b) Privacy Q10's quoted tail (`privacy.md:964-966`) ends "the live page gives no reason for any of them". Mark it as
superseded by the answer above it.
(c) /terms' "songs" check (`terms.md:737-739`) can close. The live T5 reads "Stories and songs you download to Kheelu
through the app's Play section also work without it." (`terms/page.tsx:84`), so "songs" is the app's own Play-section
word, as the code check found. "Stories and songs you've downloaded" stays.
**Fix (Copywriter):** one line each.

### Carried from round 1 (not re-raised; each is a question on the pages)

- **CTO:** m1 (a region for each processor, then privacy Q13 (b) before Gate B); m4 (where the training switch is,
  then privacy Q7 (b)); m6 (privacy Q11, with r2-m1's three lines added).
- **Founder and Aman:** m10 (b) (Kheelona+ never charges without the parent's own sign-up: store Q6); m11 (the
  pre-launch test and the doesn't-know rule: terms Q9 and its four sibling questions). The founder's OK goes on m5,
  m12 and m13 (privacy Q14, safety Q5, ai-toys Q6) and on r2-m2 and r2-m4.
- **Builder:** m7's screenshot, now r2-m3.
- **Main session:** m14 (the four thinking skills come back with the weekly report), for the log.

### The brief's other checks, round 2

- **Internal leakage:** none. Round 2 adds no survey figures, competitor names or prices, unit counts or analytics.
  The processor names on /privacy are D058 item 6's legal disclosure.
- **One next step, five seconds, a few taps:** unchanged. No CTA, hero, price or checkout line moved. The store's small
  print now names Kheelu's price unambiguously (m10 (a)), which removes a doubt at the moment of payment.
- **Ad-landing message match (Home):** fold 5's bullet now introduces the AI model properly (m8 (b)). Fold 6 item 3
  still leads with the limit until the screenshot is settled (m7, r2-m3).
- **Visual (360-1440 px), motion, Lighthouse:** not applicable, because there is no built page. These are checked on
  the built pages once the builder carries these lines into `src/content`.

### Routing, round 2

- **Copywriter:** r2-m1 (notes), r2-m2, r2-m4, r2-m5.
- **Builder:** r2-m3, after the founder's answer.
- **CTO, through the main session:** m1, m4, m6 (with r2-m1).
- **Founder, through the main session:** r2-m3 (a fresh privacy-centre capture), m10 (b), m11 (with Aman), and the OK
  on m5, m12, m13, r2-m2 and r2-m4.
