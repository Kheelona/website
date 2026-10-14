---
title: "CMO review, round 1: the four claim-bearing guides corrected per D058 (task 8b.2a)"
type: qa
updated: 2026-10-14
sources:
  - ../raw/brief/kickoff-brief.md (section 4 non-negotiables; section 6 CMO Reviewer)
  - ../decisions/D058-follow-the-live-code-check-2026-10-14.md (items 1, 5-7, 9; lines 25-30, 40-48)
  - ../decisions/D059-journal-voice-uploads-and-timing-2026-10-14.md (item 1, contractions stay)
  - ../decisions/D020-provider-terms-and-no-sale.md (items 1-4, lines 13-17), D035-model-training-opt-out.md, D036-launch-feature-claims.md (#3, line 20; how the age is set, line 27), D015-founder-signs-off-copy.md
  - ../engineering/journal-pipeline.md (§9.2, the lines to correct; §12, task 8b.2a)
  - live-main-reconciliation-2026-10-14.md (§2, lines 64-90)
  - "origin/main c630a49 (Aman, 2026-10-12), read by this review with git show: src/app/(site)/safety/page.tsx:45-47, 96, 104, 108, 134; src/features/home/components/TrustRoom.tsx:27; src/lib/stories-expansion.ts:237-239; src/app/llms.txt/route.ts; commit message"
  - "origin/main 8c4718a, read with git show: src/app/(site)/privacy/page.tsx:232-233, 238-241"
  - "worktree w8b-8b.1 (82e6096): src/content/en-IN/policies.ts:50; wiki/qa/cmo-review-claims-8b.1-2026-10-14.md (m6, m7, m11, m12, m13, r2-m1)"
  - "the four copy pages in worktree w8b-8b.2a, Copy-block lines diffed against HEAD 7448270 (2026-10-14)"
  - "test/guards/banned-phrases.test.ts and placeholders.test.ts, run in worktree w8b-8b.2a, 2026-10-14: 2 files, 229 tests passed"
  - test/guards/answer-length.test.ts (word-count rule used below)
  - ../brand/voice.md, ../brand/messaging.md (claims guardrails)
---

# CMO review, round 1: the four claim-bearing guides corrected per D058 (task 8b.2a)

**Verdict: PASS. No blocking issue. 9 minor.**

Every correction §9.2 lists is in place in all four guides. None of the withdrawn wording is left: "about a minute",
"on servers in India", "in one tap", "a curated, closed content library", "an age-graded safety layer" and "We
attack our own safety layer before every release". Each replacement matches the live team's code-checked wording in
`c630a49`, which I read directly. No Copy line changed beyond the ones the fix list names. The kept facts stand:
the providers' promise as D020 items 1-4 state it, 36 months then deleted, and the languages. Training (D035) is
neither mentioned nor contradicted. Contractions stay, and the banned-phrase guard passes.

The minor findings are mostly consistency across the four guides. The most important one for a parent is **m1**.
Three guides tell parents to ask "in which country" and add "A vague answer is an answer". Since "on servers in India"
went, our own answer names no place. On the data-law guide that gap is the sharpest on the site.

This is a copy review, so there is no built page and no screenshot. The founder signs off every changed line at Gate B
([D015](../decisions/D015-founder-signs-off-copy.md)), and counsel reads the data-law guide's fold 9 (D029). This
review replaces neither.

## How this was checked

- **What changed.** For each guide, I diffed the Copy-block lines (`^>`) against `HEAD` `7448270`. Only the lines
  in the table below differ. Titles, meta descriptions, H1s, leads, answer blocks (except the hard-questions one,
  which is on the list), closes and CTAs are unchanged.
- **Live words.** I read `c630a49` with `git show`, which the copywriters could not do (their notes ask for this
  check). The matching lines are listed under [Checks against c630a49](#checks-against-c630a49).
- **`RETENTION_LINE`.** Task 8b.1 cuts it to its first sentence (8b.1's pages; `policies.ts:50` still carries the
  one-tap clause until 8b.1's code lands). All four guides quote that first sentence only.
- **Guards.** `banned-phrases.test.ts` and `placeholders.test.ts` both pass in this worktree (2 files, 229 tests).
  They cover every Copy block of `wiki/site/pages/*.md`.
- **Counts.** These use the answer-length guard's rule. The hard-questions answer is 58 words (40-60). Its fold 6
  answer is 48 words, as before. The safe-AI-toy internet item is 37 words (32 before). The counts on all four pages
  check out, and every read time is unchanged.

## Fix by fix

| Fix (§9.2, the task) | safe-AI-toy | should-kids | hard-questions | data-law |
|---|---|---|---|---|
| "about a minute" → "a couple of minutes of quiet" | Applied, fold 5 :190 | Applied, fold 8 :272 | Applied ×3: fold 2 :126, fold 5 :188, :202 | n/a (no timing on the page) |
| ", on servers in India" goes; no place named; D020 items 1-4 kept word for word | Applied :192 | Applied :274 | Applied :193 | Applied :271 |
| Closed library and age-graded layer → AI model, child-safety rules and the age on every conversation, Google's safety filters on top, no browsing | Applied :198 ("or search" missing, m6) | Applied :280 ("or search" missing, m6) | Applied :246 | n/a |
| "We attack our own safety layer…" goes | Applied (the whole "Tested by us first." item is gone) | n/a | Applied :246 | n/a |
| One-tap deletion goes (only ever in `RETENTION_LINE` in these four) | Applied :194, plus "Delete them all sooner by deleting your account." | Applied :276, plus the same sentence | Applied :195, nothing added (m2) | Applied :273, nothing added (m2) |
| Keep: own-model training not contradicted (D035); Bluetooth; languages; 36 months | Pass (no training, Bluetooth or language line on the page; 36 months kept) | Pass | Pass (fold 7's eight languages and "up to 10" unchanged) | Pass |
| Contractions stay (D059 item 1) | Pass | Pass | Pass | Pass |
| "Changes after approval (task 8b.2a)" cites D058 and c630a49 | Pass :437 | Pass :529 | Pass :523 | Pass :543 |

## Verdict per article and criterion

Criteria: **1** each fix that reaches the guide is applied as asked · **2** none of §9.2's withdrawn claims is left,
and no other withdrawn claim is on the page · **3** no new or inflated claim (every new word traces to D058 or
`c630a49`, or to a decision D058 leaves standing) · **4** no Copy line changed that D058 did not ask for, and every
other line is the approved one · **5** the kept facts are kept (D035 not contradicted; 36 months; languages) ·
**6** answer blocks are 40-60 words, and contractions stay · **7** no banned wording · **8** the changed lines are
still the guide's voice: plain, calm, phone-first, for parents of 3-7 year olds.

| Guide | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| what-to-look-for-in-a-safe-ai-toy | Pass (m6) | Pass | Pass | Pass | Pass | Pass (answer 54, unchanged) | Pass | Pass; m1, m3, m4, m5, m7 |
| should-kids-use-ai | Pass (m6) | Pass (fold 7's "closed set" is advice, not a claim: m4) | Pass | Pass | Pass | Pass (answer 59, unchanged) | Pass | Pass; m3, m4, m5 |
| questions-parents-ask-about-ai-toys | Pass | Pass | Pass ("or search" is in the code-checked fact) | Pass | Pass | Pass (answer 58; was 57) | Pass | Pass; m1, m2, m7 |
| ai-toys-and-indias-data-law | Pass | Pass | Pass | Pass | Pass | Pass (answer 59, unchanged) | Pass | Pass; m1, m2 |

On criterion 4: the safe-AI-toy and should-kids guides add one sentence where the one-tap clause was, "Delete them all
sooner by deleting your account." That is the withdrawn claim taking the code-checked wording, which D058 allows ("go
or take the code-checked wording"). It is the live team's own "Delete it all by deleting your account."
(`TrustRoom.tsx:27`) in the form I set for the product page in task 8b.1 (m7). So it is not a line D058 did not ask
for.

## Checks against c630a49

Each replacement matches the live team's words:

- **Quiet.** "ends after a couple of minutes of quiet" (`safety/page.tsx:45`, `:96`; the product page's step 01).
- **Replies.** "Every conversation carries child-safety rules and your child's age, Google's safety filters sit on
  top" (`safety/page.tsx:104`). "an AI model that is given child-safety rules and your child's age on every
  conversation" (`:134`). "Kheelu cannot browse or search the internet" (`:47`, `:134`).
- **Deletion.** "Delete it all by deleting your account." (`TrustRoom.tsx:27`). On the live `/privacy`: "Removing a
  chat in the app hides it on that phone. To remove conversations from our servers, delete your account, or write to
  us and we will do it for you." (`privacy/page.tsx:240`).
- **Where.** "To Kheelona's servers" (`safety/page.tsx`, FAQ). "Some of them process it outside India." On the live
  `/privacy` this is said of all eight processors (`privacy/page.tsx:232-233`), not of the speech and AI providers
  alone (see m1).
- **Testing.** The live safety answer "Could Kheelu say something wrong?" drops the red-team sentence and gives no
  doesn't-know line (`safety/page.tsx:104`). That bears on m7.
- **The providers' promise.** The live `/privacy` does not repeat "They don't keep it … never train" (it says "Each of
  them handles this data only to do that job for us", `:233`). The task keeps the promise as D020 items 1-4 state it,
  and so does `/safety` after task 8b.1. It rests on the founder's statement that the contracts say so (D020 line 5),
  and the founder signs it at Gate B. It is scoped to "speech and AI providers", so it does not reach Google Cloud's
  storage of recordings for Kheelona.

## Minor

**m1 · The guides ask "in which country", and our answer now names none (safe-AI-toy, hard-questions, data-law;
criterion 8).** Safe-AI-toy fold 4 (`:155`), hard-questions fold 5 (`:191`) and data-law fold 8 (`:240`) all tell
parents to ask where the voice is processed "and in which country". Two of them then say "A vague answer is an
answer." Our voice item now gives no place (`:192`, `:193`, `:271`). Dropping the place was right: it was the fix,
and D058 item 6 withdraws "servers in India". But the guide now gives exactly the answer it tells parents to
distrust. All three copywriter questions (safe Q6 `:370`, hard-questions Q6 `:440`, data-law Q7 `:444`) recommend
adding D058 item 6's fact, and I agree.

The drafted sentence needs one change. "Some of them process it outside India." puts "them" right after "speech and
AI providers". The live `/privacy` says it of all eight processors (`privacy/page.tsx:232-233`: hosting, databases and
error tools included). Which of them work outside India is not on record yet (task 8b.1, m1: the regions wait on the
CTO). Narrowing the subject goes beyond the code check.

**Fix (founder's OK through the main session, then Copywriter; on the data-law guide, counsel reads it with fold 9,
D029).** After "Our contracts with them say so." add:

- safe-AI-toy fold 5 (`:192`; module `:147`): "Some of the companies that handle your child's data process it outside
  India. Our [privacy policy](https://kheelona.com/privacy) names them."
- hard-questions fold 5 (`:193`; module `:108`) and data-law fold 9 (`:271`; module `:157`): "Some of the companies
  that handle your child's data process it outside India." The privacy link already closes each fold.
- should-kids fold 8 (`:274`): optional. The guide does not ask the country question, but the same sentence keeps
  the voice item identical in all four guides.

Then record the change in each page's "Changes after approval" section and Sources (D058 item 6; `privacy/page.tsx:233`).
Do not take option (c), cutting "in which country" from the questions: that would edit the question to fit the answer.

**m2 · The deletion sentence differs between the guides, and the data-law guide no longer answers its own question
(hard-questions, data-law; criterion 8).** The safe-AI-toy and should-kids guides follow `RETENTION_LINE` with
"Delete them all sooner by deleting your account." The hard-questions guide (`:195`) and the data-law guide (`:273`)
end on "…then they're deleted automatically." with nothing after it. Data-law fold 8 asks "Can I read what my child
said, and delete it myself?" (`:243`), and fold 9 now answers only the first half (its question 8, `:454`). In the
hard-questions guide, the paragraph loses the "you're in control" half it had when it was approved.

**Fix (Copywriter; the founder signs it with the other changed lines at Gate B).** In both guides, add "Delete them
all sooner by deleting your account." after the retention sentence. In the data-law guide this answers question 8 with
this short form, not option (b): (b)'s "from our servers" waits on the CTO (task 8b.1, m6). Then all four guides say
retention and deletion the same way. For the builder: data-law `:159` and hard-questions `:109` become
`` `… ${RETENTION_LINE} Delete them all sooner by deleting your account.` ``. I endorse safe-AI-toy Q5 and
should-kids Q6 option (a).

**m3 · "all" depends on the CTO's answer to privacy question 11 (safe-AI-toy, should-kids, and m2's two lines;
criterion 3).** "Delete them all" is D058's and the live team's wording, so it is not inflated. But in task 8b.1 the
same promise on `/safety` and `/team` was tied to whether account deletion also clears the training data (8b.1 review,
m6 and r2-m1). **Fix:** Copywriter: add one line to safe-AI-toy Q5 (`:364`) and should-kids Q6 (`:447`), and to the
data-law and hard-questions notes once m2 is applied: "If the CTO answers privacy question 11 (c), this becomes
'Delete them sooner by deleting your account.'" Main session: add the four guides to privacy Q11's list of lines
(8b.1's file).

**m4 · Two advice lines set a bar that Kheelu's own answer misses (safe-AI-toy, should-kids; criterion 8).**

- (a) Should-kids fold 7 (`:244`; module `:121`) asks "Can it reach the open internet, or only a closed set of
  material?". That presents a closed set as the good answer, two folds before "**No open internet.**" (`:280`). Fold
  8 now says plainly that an AI model generates the answers, so this is not a claim about Kheelu. But it still holds
  up the design D058 withdrew. The live article never had the clause: its checklist reads "Can it reach the open
  internet?" (`c630a49`, `stories-expansion.ts:239`).
- (b) Safe-AI-toy fold 4 (`:152`) asks for "delete any of it yourself, without emailing anyone", and should-kids fold
  7 (`:246`) for "delete any of it yourself". Removing one chat in the app only hides it on that phone. To remove a
  single conversation from our servers, a parent writes to us (`privacy/page.tsx:240`). Each guide's next fold
  promises an answer "on each point above".

**Fix (founder's OK, then Copywriter):** take should-kids Q4 (a): "Can it reach the open internet?". Take safe-AI-toy
Q4 (a): "Ask whether you can read every conversation, word for word, and how you delete it, without emailing anyone."
Take should-kids Q5 (a): "Can you read every conversation, and how do you delete it?". This is the m13 form the buyer's
guide took in task 8b.1. Data-law fold 8's "delete it myself" can stay once m2 is applied, since account deletion in
the app meets it.

**m5 · "No open internet." is still the item title (safe-AI-toy `:198`, should-kids `:280`; criterion 8).** `/safety`
fold 3 now reads "No web browsing." (task 8b.1, m12, round 2, waiting on the founder's OK), and so does the footer.
The live team changed both because Kheelu does use the internet to reach the AI model, and the item's body now says
so. **Fix (founder's OK, Copywriter):** follow the founder's `/safety` answer, as both copywriters recommend (safe Q3
`:350`, should-kids Q7 `:450`). If the founder approves the `/safety` title, both guides take "**No web browsing.**"
with the body unchanged. Otherwise keep it.

**m6 · "browse or search" (safe-AI-toy `:198`, should-kids `:280`; criterion 1).** The fix's code-checked fact ends
"and it cannot browse or search the web". The hard-questions guide says "can't browse or search the internet"
(`:246`), but the other two keep "Kheelu can't browse the internet." **Fix (Copywriter):** both items begin "Kheelu
can't browse or search the internet." (+2 words each; read times unchanged). Optional, for one form across the four
guides and a shorter sentence on a phone: hard-questions `:246` becomes "Kheelu can't browse or search the internet.
Its replies are generated by an AI model. On every conversation, the model is given child-safety rules and your
child's age, with Google's safety filters on top. You set that age in the parent app, and you can read every
conversation afterwards." (48 words, as now).

**m7 · The doesn't-know line is on two guides, but only one of them asks about it (safe-AI-toy `:200`,
hard-questions `:251`; criterion 3, carried from task 8b.1 m11).** D058 leaves D036 #3 standing, so neither line is a
withdrawn claim. But the live team's own rewrite dropped every doesn't-know line. I endorse safe-AI-toy Q7 (`:378`)
option (a): keep the line until the founder and Aman confirm the child-safety rules tell the model to say so. The
hard-questions guide's "When Kheelu doesn't know, it says so, instead of guessing." has no such question. **Fix
(Copywriter, then founder and Aman):** add a question to the hard-questions page that mirrors safe Q7. Its fallback, if
the rule is not confirmed: fold 6's second item asks "Any AI toy can get something wrong, so ask how you would find
out." and answers "No AI is perfect, so every word Kheelu says is in the parent app for you to read. If an answer ever
sounds odd, look it up together. That is a good conversation too." (the live line, `safety/page.tsx:104`, plus the
approved close). If it is not confirmed, the safe-AI-toy guide also cuts "Ask, too, what the toy does when it doesn't
know something. The answer you want: it says so." from fold 4 (`:158`), together with the fold 5 item. Main session:
add both guides to m11's list (terms Q9 and its siblings).

**m8 · Notes still say c630a49 was not read (safe-AI-toy `:444`, should-kids `:537`; notes only).** It has been read
now, and the quoted words match (see above). **Fix (Copywriter, one line each):** "The CMO review of task 8b.2a read
c630a49 with git show (2026-10-14); the quoted words match." The hard-questions and data-law sections, which cite it
"via map §2", can add the same line.

**m9 · The builder notes depend on 8b.1 landing first (all four; for the builder and the main session, no copy).** The
built line keeps the one-tap clause until 8b.1's `RETENTION_LINE` merges. `approved-articles.test.tsx:129-130` pins the
safe-AI-toy retention string exactly. The safe-AI-toy mockup's lines 111, 112, 113, 115 and 118 become text-parity
deviations; I checked each line against the frozen file, and the order is right. The hard-questions, should-kids and
data-law guides have no mockup, so their changed lines go into the Gate B list for the founder, not into
`deviations.ts`. **Fix (main session):** schedule the 8b.2a module edits after 8b.1's `policies.ts` change, or in the
same merge, so no build prints "in one tap" beside the new deletion sentence. If m2 is applied, the test pin takes the
added sentence on all three guides that print it.

## Also for the main session (not findings on these pages)

- The copywriter reports that `wiki/product/claims.md` (rows 72-74, 77-78, 115-116) and `wiki/brand/messaging.md` still
  carry the withdrawn wording. They are the main session's pages, and they are the source the next writer will copy
  from.
- I found no internal leakage. The changed lines add no survey figures, competitor names or prices, unit counts or
  analytics. "Google's safety filters" names a supplier, in D058's own words, not a competitor.

## The brief's other checks, for this round

- **Positioning, ages 3-7:** unchanged. Each guide still opens its Kheelu fold with the age band and Common Sense Media's
  advice for that range, and keeps "If your child is 3, keep a grown-up nearby". The changed lines describe mechanisms
  (a button, a model given rules and the age, filters, account deletion). None of them says "safe" about Kheelu.
- **One next step:** unchanged. No close, CTA, price or sticky-bar line moved.
- **Ad-landing:** not applicable (journal guides, not ad landings).
- **Visual (360-1440 px), motion, Lighthouse:** not applicable, because there is no built page. These are checked on
  the built guides after task 8b.2e.

## Routing

- **Copywriter:** m2, m3 (notes), m6, m8; m1, m4 and m5 once the founder has answered.
- **Founder, through the main session:** m1 (the country sentence; counsel on the data-law guide), m4, m5, and m7 with
  Aman.
- **CTO, through the main session:** m3 (privacy question 11).
- **Main session:** m3 (Q11's list), m7 (m11's list), m9 (merge order), and the claims and messaging pages above.
- **Builder:** m9, after 8b.1's `RETENTION_LINE`.
