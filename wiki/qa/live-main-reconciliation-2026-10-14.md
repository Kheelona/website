---
title: "What the live site changed since the branch point, mapped against the rebuild (2026-10-14)"
type: qa
updated: 2026-10-14
sources: ["git origin/main at 8c4718a: dd04e6d (#18), c630a49 (#19), 91f8032 (#20), 82e1b60 (#21), 8c4718a (#22), 70abe43, f031909; merge-base 24e92e3/77552ff", "git merge-tree --write-tree HEAD origin/main (dry run, 2026-10-14)", "GET https://api.kheelona.com/v1/public/blog/posts (2026-10-14, 22 posts)", "read-only agent run by the main session, 2026-10-14", ../open-questions.md, ../decisions/D057-journal-from-dashboard-and-three-wordings-2026-10-14.md]
---

# The live site since the branch point, against the rebuild

Found at the beta push on 2026-10-14 ([log](../log.md); [open questions](../open-questions.md) G23-G24). A read-only
agent mapped each live change against `reset/website-v2`; line numbers are `origin/main` at `8c4718a` ("main") and the
rebuild at `fda50f8`. Nothing was changed by the mapping.

**Headline.** Aman's two content commits (12 Oct) say every sentence was "checked against iot-firmware,
backend-service and Kheelona_App on 2026-10-12". They withdraw, as untrue today, several claims the rebuild still
makes: one-tap delete, 36-month automatic deletion, "servers in India", the "closed library", topic controls, quiet
hours, the new-word count, "about a minute" of quiet. In the rebuild each rests on a logged founder decision (D017,
D018, D020, D036, D055), so each needs the founder's ruling (CLAUDE.md: the latest logged decision wins).

## 1. #18 (dd04e6d): the parent app on `/privacy` and `/terms`, for the App Store and Play

The commit says "Save voice recordings" is honoured server-side only from backend-service PR #39 (to deploy first), and
removed the old "When Kheelu ships" section because it "promised region pinning and one-tap deletion, and neither is
true of the app today".

### `/privacy` (main `src/app/(site)/privacy/page.tsx`)

| # | Live text (main line) | Rebuild | Status |
|---|---|---|---|
| P1 | :9 meta and :272 lede cover the pre-order and the parent app | privacy.ts:58, :116 | Covered |
| P2 | :208-210 "This part covers the Kheelona parent app, on Android and iPhone, and the Kheelu toy it sets up." | privacy.ts:116 | Covered |
| P3 | :216 mobile number and SMS one-time code; "Your name and how you are related to your child, if you add them." | privacy.ts:174 phone number and one-time code | Partly: the parent's name and relationship missing |
| P4 | :217 child's first name, age, pronouns, languages; a photo only if the parent adds one | privacy.ts:171, :164 | Partly: pronouns, languages, the optional photo missing |
| P5 | :218 a written record of each conversation; the voice recording kept "unless you turn off Save voice recordings in the app's privacy settings" | privacy.ts:156, :160, :410 (36 months) | Partly: no Save voice recordings switch |
| P6 | :219 the toy's ID, its name, battery and WiFi strength, last online | privacy.ts:174 device ID, Wi-Fi network name, phone model and OS | Partly |
| P7 | :225 the app collects no location; the WiFi name "stays on your phone" | privacy.ts:174 the account keeps the WiFi network name (D055 item 13) | **Conflict** |
| P8 | :226 no advertising, "no advertising or analytics tools" in the app; never used to advertise or profile the child | privacy.ts:68, :467, :466, :468 | Partly |
| P9 | :232-233 names Google Cloud, Google's Gemini, Sarvam AI, Twilio, Aiven, Redis, New Relic, Sentry; "Some of them process it outside India." | providers unnamed (privacy.ts:148, D055 item 16); "on servers in India" (:146, :370, :372-374) | **Conflict** (D020 item 6, D055 item 16) |
| P10 | :239 in the app's privacy settings: turn off Save voice recordings, download the child's data, delete the account | a training switch "in the parent app" (:83, :204); rights by request (:441-450) | Not covered; the live text names no training switch |
| P11 | :240 "Removing a chat in the app hides it on that phone." To remove conversations from the servers, delete the account or write to us | privacy.ts:434 "you can delete any conversation in one tap…" | **Conflict** |
| P12 | :241 deleting the account removes the account, the child's profile, conversations and recordings | privacy.ts:412-413 keeps them until their 36 months end (D055 item 18) | **Conflict** |
| P13 | :251 kept while the account is open, deleted when it is deleted; "no timed expiry" (code comment) | `RETENTION_LINE` 36 months then automatic deletion (policies.ts:38, :50) | **Conflict** |
| P14 | :252 grievance officer at `connect@kheelona.com` (`GRIEVANCE_EMAIL`) | Aman Soni, aman@kheelona.com (seller.ts:101-109; D029, D032) | **Conflict** |

### `/terms` (main `src/app/(site)/terms/page.tsx`)

| # | Live text | Rebuild | Status |
|---|---|---|---|
| T1 | title "Terms, in plain words."; lede covers the pre-order and the parent app | terms.ts:55 "Kheelu pre-order terms · Kheelona"; :70-71 | Partly |
| T2 | :81 the app: 18 or over; "you are responsible for how your child uses Kheelu" | terms.ts:112, :297 | Mostly (no "responsible for" line) |
| T3 | :82 "The app is free and nothing is sold inside it." Sign-in by one-time code | terms.ts:139, offer.ts:51, page.ts:178: the parent app is part of Kheelona+, included for 6 months | **Conflict** |
| T4 | :83 replies are generated by a computer model and can be wrong: conversation, not advice | terms.ts:334 "a curated, closed content library… an answer can sometimes be wrong" | Partly; "closed library" contradicts "generated" |
| T5 | :84 conversations need home WiFi; downloaded stories and songs play without it | faqs.ts:180 only | Not covered on /terms |
| T6 | :85 do not break into the systems or copy the service; we can close the account | – | Not covered |
| T7 | :86 stop using the app and delete the account at any time from its privacy settings | – | Not covered |
| T8 | :98 the terms cover the pre-order and the app; Indian law | terms.ts:112, :359 | Covered |

`src/config/site.ts` (main :176-179) adds `GRIEVANCE_EMAIL = "connect@kheelona.com"` ("the same address the parent
app's 'Contact our grievance officer' opens… Founder to confirm the officer's name").

## 2. #19 (c630a49): claims withdrawn or reworded

Retired as untrue, to come back "only when it ships": the wake word (dropped in firmware 2026-07-23; a conversation
"ends after ~2 minutes of quiet"); on-device thinking and filtering ("The toy runs no model and no filter"); the "closed
library" ("Replies are generated by Google's Gemini"); region pinning; one-tap deletion; topic controls, quiet hours,
counting new words, a daily "thing to do together", parent alerts ("none are in the app"); Story-mode quizzing offline.
Left for the founder: Bluetooth mode ("no code in this firmware; the S3 cannot do Bluetooth audio"), the eight named
languages ("the app offers a different nine"), PlayOS's own-model claims, the team bio.

**Where the rebuild still says what main withdrew** (main's replacement in brackets):

| Claim | Rebuild (file:line) | Main now says |
|---|---|---|
| Topic controls, quiet hours | safety.ts:128-129, setup.ts:102; safety.md:214-215, setup.md:198 | removed; "Pick up to two languages you speak at home" |
| A new-word count | home.ts:216, products/kheelu/page.ts:175, product.ts:116 (feeds `llms.txt`), privacy.ts:167; home.md:603, meet-kheelu.md:391/520, privacy.md:210 (D036 #8) | the app "shows what they asked and talked about each day" |
| A "curated, closed content library" | faqs.ts:143, terms.ts:334, ai-toys-for-kids-in-india.ts:126, should-kids-use-ai.ts:162, what-to-look-for-in-a-safe-ai-toy.ts:158, questions-parents-ask-about-ai-toys.ts:136 (D036 #5) | "an AI model that is given child-safety rules and your child's age on every conversation"; replies generated by Gemini |
| One-tap delete | `RETENTION_LINE` (policies.ts:50, 8 surfaces), home.ts:257, safety.ts:83, setup.ts:134, ai-toys…:128, team.ts:136, terms.ts:301, privacy.ts:88/:434, faqs.ts:111; 17 copy pages (D017, D020 item 7) | "Delete it all by deleting your account"; removing a chat hides it on that phone |
| 36-month automatic deletion; closing the account keeps data 36 months | policies.ts:38/:50, privacy.ts:404-413, terms.ts:301 (D020 item 7, D055 item 18) | no timed expiry; deleting the account deletes the data |
| "On servers in India"; providers keep none of it | privacy.ts:78/:132/:146/:370/:404, home.ts:255, safety.ts:81, page.ts:213, 4 articles; 8 copy pages (D020 item 6) | "To Kheelona's servers"; Gemini; "Some of them process it outside India" |
| "About a minute of quiet" | 13 places incl. product.ts:105 (feeds `llms.txt`), page.ts:155/:208, safety.ts:76, setup.ts:114; 9 copy pages (D018) | "a couple of minutes of quiet" |
| The account keeps the WiFi network name | privacy.ts:174 (D055 item 13) | the name stays on the phone |
| "We attack our own safety layer before every release" | what-to-look-for-in-a-safe-ai-toy.ts:162, questions-parents-ask-about-ai-toys.ts:136 (D036 #7) | dropped (not in the retired list) |
| "Age-graded safety layer" wording | product.ts:131, faqs.ts:41/86/143/174, home.ts:218, safety.ts:126, setup.ts:99, privacy.ts:164, terms.ts:286/334, team.ts:113/136, 3 articles | "child-safety rules set for your child's age, with Google's safety filters on top" |
| Bluetooth mode | product.ts:72, home.ts:175/:193, page.ts:55/:153, faqs.ts:180, setup.ts:135 | left for the founder (no firmware code) |
| Eight languages, up to 10, switching mid-sentence | home.ts:196-198, page.ts:143-145 | left for the founder (the app offers a different nine; up to two home languages) |
| "No open internet" (footer) | navigation.ts:75 | "No web browsing." |

Already avoided by the rebuild: the wake word, on-device thinking, Story-mode quizzing, "one simple thing to do
together", parent alerts, "the small language model built only for children", `pricing.md`'s old feature list.

Main added, true per its code check, and absent from the rebuild: a daily talk-time limit; "when Kheelu rests, its
WiFi is switched off"; conversations appear "a few minutes after it ends"; search over the log; up to two home
languages; the Save voice recordings switch.

## 3. The journal from the admin dashboard (#20-#22)

- **Authoring:** writers draft at admin.kheelona.com → Blog; an admin publishes; publishing POSTs a Vercel Deploy Hook.
- **Sync:** main's `build` is `check-tokens && node tools/blog/sync.mjs && next build`; the sync GETs
  `https://api.kheelona.com/v1/public/blog/posts` (3 tries, 20 s) and writes `src/lib/stories.data.json`; articles stay
  static (`dynamicParams = false`). The build fails on an unreachable API, a post that fails `validate.mjs` (slug,
  duplicates, required fields, ISO dates, pose of six, tint of three, hero, sources, body blocks outside the whitelist:
  paragraph, heading, bulletList, orderedList, blockquote, horizontalRule, image, videoEmbed) or a drop below half the
  last count; Vercel keeps the last good deploy. `BLOG_SYNC=off`, `BLOG_ALLOW_SHRINK=1`, `BLOG_API_URL` override.
- **Voice law at publish (backend):** no em dashes, exclamation marks, contractions, vague link labels or bare URLs. The
  rebuild's copy uses contractions.
- **Rendering:** `organisms/ArticleBody` (whitelisted nodes only); `molecules/VideoEmbed` (a still until pressed;
  youtube-nocookie or Vimeo `dnt=1`; thumbnails from `i.ytimg.com`).
- **Headers and images:** `security-headers.ts` adds `https://www.youtube-nocookie.com` and `https://player.vimeo.com`
  to `frame-src`; `next.config.ts` `remotePatterns` for `api.kheelona.com/v1/public/blog/images/**` and
  `i.ytimg.com/vi/**`; covers served through `kheelona.com/_next/image` (the API answers `X-Robots-Tag: noindex`).
- **Posts:** 22 on main and 22 from the live API (data-identical; newest 2026-09-11; **none written after 2026-10-13**).
  20 slugs are in both; `screen-time-rules-parents-swear-by` (D053) and `brain-development-toys-for-a-2-year-old` (D041)
  are main only, both redirected in the rebuild. The dashboard holds the pre-reset texts with #19's edits; the rebuild's
  20 are rewrites. Dashboard bylines include "Ria Mangala Rewari", who is not on the rebuild's `/team`.
- **Checkout freeze:** `security-headers.ts` is a frozen file in the rebuild (`test/guards/checkout-freeze.test.ts:41`,
  tag plus a reviewed patch); main's `frame-src` lines need a regenerated patch citing a decision.

## 4. Merging main into the rebuild (needed before Gate B; no force-push)

`git merge-tree` (dry run): content conflicts in CLAUDE.md, package.json, the privacy, terms, safety, setup, home,
ai-toys and stories/[slug] pages, llms.txt, pricing.md, security-headers.ts, test/internal-links.test.ts;
modify/delete conflicts in files the rebuild deleted (playos and products/kheelu pages, Footer, KheeluModes,
AnswerBlock.stories, ParentAppSection, TrustRoom and its test, product-facts.ts, seo.ts, setup-steps.ts, stories.ts and
its test); location conflicts for VideoEmbed; clean adds: tools/blog/*, stories.data.json, ArticleBody,
test/blog-sync.test.ts. The two CLAUDE.md commits 70abe43 and f031909 are whitespace only; the substantive CLAUDE.md
text is 91f8032's journal paragraph.

## For the founder (open questions G24)

- **A. The journal pipeline:** answered by D057 item 1 (dashboard posts in the new design).
- **B. Grievance contact:** Aman Soni, aman@kheelona.com (D029, D032) or connect@kheelona.com (what the app opens).
- **C. Kheelona's own model training and its switch in the parent app** (D035, D055 item 12): main's `/privacy` names no
  such switch.
- **D. Bluetooth mode:** no firmware code, per main.
- **E. Languages:** eight named, up to 10, switching mid-sentence, against the app's nine and up to two home languages.
- **F. D036 items main did not retire explicitly:** the weekly four-skills report, "says it doesn't know", red-teaming,
  the "age-graded safety layer" wording, the light while listening.
- **G. Naming the processors** (Gemini, Sarvam, Twilio and others) against D055 item 16 (unnamed).
- **H. Is the app free?** Main's terms: "The app is free and nothing is sold inside it"; the rebuild: Kheelona+ for 6
  months includes the parent app.
- **I. The app's privacy screen shows "keep chats for 36 months"** while main says the backend has no timed expiry.
