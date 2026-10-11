---
title: AEO question bank (raw capture, 2026-10-10)
type: raw-research
updated: 2026-10-10
sources:
  - "WebSearch (Claude's web search tool, US index), queries listed per question, run 2026-10-11 01:59-02:40 UTC (2026-10-10 evening PDT)"
  - "Bing web search, cc=IN, en-IN, logged out, headless Chrome: engine-captures-2026-10-10/paa-1.json, bing-*.json"
  - "Google and Bing autocomplete, India, 16 seeds: engine-captures-2026-10-10/autocomplete.tsv (captured 2026-10-11 02:33 UTC)"
  - "PostHog project 617632, query-web-stats, 2026-09-19 to 2026-10-10 (landing pages of AI-assistant visits; see ai-answer-audit-2026-10-10.md)"
  - "Legacy: git show archive/pre-reset-2026-10-10:docs/checkpoints/seo-aeo-geo-2026-09-11.md section 4e (Keyword Planner India, read 2026-09-11)"
  - ../../../product/facts.md
  - ../../../product/claims.md
  - ../../../product/pricing.md
  - ../../../product/age-band-review.md
---

# AEO question bank (raw capture, 2026-10-10)

Real questions Indian parents of 3 to 7 year olds ask, where we found them, and a 40 to 60 word
answer-first draft for each. This is raw research for `research/keyword-map.md` and the
Copywriter, not copy. Nothing here is approved.

## How the questions were collected

- **Quora and Indian parenting sites** (Momspresso, FirstCry Parenting, ParentCircle, Parentune)
  through WebSearch restricted to those domains. Each question cites the thread it came from.
- **Bing "People also ask"** (India market). Bing showed a PAA block for one seed of seven
  ("how much screen time for a 3 year old"); the rest returned none. Raw: `paa-1.json`.
- **Google and Bing autocomplete** (hl/market en-IN), 16 seeds. Raw: `autocomplete.tsv`.
- **What AI assistants already send us**: PostHog shows visitors tagged `utm_source=chatgpt.com`
  landing on `/`, `/products/kheelu`, `/refund` and `/team` (audit file). Those landings tell us
  the brand questions people ask ChatGPT: what it is, what it costs, refunds, who makes it.
- **Not reachable**: Reddit (WebSearch refuses the domain; a direct visit asks for a login or
  returns 403), Google People Also Ask (Google answered 429 "unusual traffic"). Both are gaps.
- Search volumes are **not** in this file; the only volumes quoted are the legacy Keyword Planner
  reads (India, Sept 2025 to Aug 2026, read 2026-09-11) and they are labelled as such.

## Rules the drafts follow

- Facts come only from [facts](../../../product/facts.md), [pricing](../../../product/pricing.md)
  and the **CONFIRMED** rows of [claims](../../../product/claims.md). Anything else is marked:
  - `[PLACEHOLDER Fx]` a fact the founder or SKM must supply ([open questions](../../../open-questions.md) section B).
  - `[CONFIRM Fx]` / `[CONFIRM G5]` wording that is published or founder-ruled but not yet a
    CONFIRMED claim (F8 behaviour claims, F5 "in India", G5 final wake-word wording).
  - `[SOURCE RE-CHECK]` a third-party figure the wiki has not re-verified (WHO, AAP, OpenAI terms).
- Research anchors the wiki has checked (claims.md section 8): Harvard Center on the Developing
  Child "serve and return" and Romeo et al. 2018. Common Sense Media's January 2026 advice is
  quoted from [age-band review §4](../../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band).
- Never: brain-growth claims about Kheelu, health or speech-delay claims, "boosts", "smarter",
  "IQ", the retired microphone wording, "free for life", any certification, a delivery promise.
- Ages render as **3 to 7** (brief section 2). Prices are the token-mode lines from
  [pricing](../../../product/pricing.md) and change at sell-out (G9 and the sell-out sweep).
- Word counts exclude bracketed markers, since those get replaced. 29 of the 34 drafts are 40 to
  60 words now; five (B4, B6, B8, B9, B10) stay short until their F-items are answered, and each
  says so in a note.

## Screen time

### ST1. How much screen time is OK for a 3-year-old? (age 3 · learn)
- **Asked:** Bing PAA "How much screen time should a 3 year old have?" and "How much screen time
  should a 4 year old have?" (`paa-1.json`, 2026-10-11 02:30 UTC); Quora "What is the best amount
  of screen time in a day for a three-year-old girl?"
  (https://www.quora.com/What-is-the-best-amount-of-screen-time-in-a-day-for-a-three-year-old-girl);
  autocomplete "screen time for 3 year old", "recommended screen time for 3 year old" (Google, en-IN).
- **Existing page:** `/stories/how-much-screen-time-for-a-3-to-6-year-old`.
- **Draft:** Less than most families manage, and less is better. [SOURCE RE-CHECK: WHO 2019, no more than one hour of sedentary screen time a day at ages 3 to 4.] What the screen replaces matters as much as the minutes: talking, playing, sleeping and moving about. When your child does watch, sit with them and talk about what you saw together.

### ST2. How much screen time for a 5, 6 or 7-year-old? (ages 5-7 · learn)
- **Asked:** Bing autocomplete "how much screen time for 6 year old", "... 7 year old" (en-IN);
  Quora "How to set screen time for 3 kids (9, 7, and 4 years old)"
  (https://www.quora.com/How-do-I-set-screen-time-for-3-kids-9-7-and-4-years-old).
- **Draft:** There is no single safe number at 5, 6 or 7. [SOURCE RE-CHECK: AAP 2016, consistent family limits for ages 6 and up rather than a fixed hour.] Set the limits together as a family, keep screens away from meals and bedtime, and make sure sleep, outdoor play, homework and conversation come first. Then judge what is left by what your child is actually watching.

### ST3. How do I get my 3-year-old off the phone without tantrums? (ages 3-4 · learn)
- **Asked:** Quora "What are some creative ways to dissuade a three-year-old from using a
  smartphone and TV, control his tantrums and help him focus on play?"
  (https://www.quora.com/What-are-some-creative-ways-to-dissuade-a-three-year-old-from-using-a-smartphone-and-TV-control-his-tantrums-and-help-him-focus-on-play);
  Quora "How to reduce a toddler's screen time"; FirstCry "7 Tricks To Break TV, Computer and Phone
  Addiction in Kids" (https://parenting.firstcry.com/articles/7-tricks-to-un-glue-your-kids-from-mobile-phones-tv-and-computers/).
- **Existing page:** `/stories/screen-time-and-tantrums`, `/stories/the-gentle-way-off-the-phone`.
- **Draft:** Cut back slowly, warn before the screen goes off, and use the same short phrase every time. Stay calm through the protest; giving in teaches that protest works. Then fill the gap with something that answers back: talk, stories, songs and play with you. A screen-free toy that talks can cover the moments your hands are full.

### ST4. Is screen time bad for my child's speech? (ages 3-5 · learn)
- **Asked:** Quora "Why does too much screen time hurt children's development?"
  (https://www.quora.com/Why-does-too-much-screen-time-hurt-childrens-development); Quora "How to
  reverse the effect of excessive screen time on my 19-month-old" (under 3: answer stays general).
- **Draft:** The screen is only part of it; what it replaces matters more. Research links back-and-forth conversation with a caring adult to young children's language and brain development (Harvard Center on the Developing Child; Romeo et al. 2018). A screen talks at a child and never waits for a reply, so long hours can crowd out the talk that builds language.

### ST5. What can my 6 or 7-year-old do at home instead of screens? (ages 6-7 · learn)
- **Asked:** Quora "How to keep your 6 year old busy while not allowing screen time? I tried word
  search and my kid likes it" (https://www.quora.com/How-do-you-keep-your-6-year-old-busy-while-not-allowing-screen-time-I-tried-word-search-and-my-kid-likes-it-Any-other-suggestions);
  ParentCircle "Screen Free Activities for 1 to 9 Year Olds"
  (https://www.parentcircle.com/screen-free-activities-for-kids-1-9-year-olds/article).
- **Draft:** Anything that asks something back: board games and word games, building sets, crafts, simple cooking, treasure hunts with written clues, and reading aloud together. Let your child explain the rules, tell the story or make up the clues, because talking it through is part of the fun. Keep one screen-free hour a day as a family habit everyone shares.

## Language development

### LD1. How can I help my 3-year-old talk more? (ages 3-4 · learn)
- **Asked:** Google autocomplete "how to make my child talk more", "how to get my child talking";
  Bing autocomplete "how to get my toddler to talk", "how to encourage children to talk" (en-IN).
- **Existing page:** `/stories/how-to-get-your-child-talking`, `/stories/how-children-learn-by-talking`.
- **Draft:** Talk with your child, not at them. Ask open questions, wait for the answer, and build on what they say. Read the same books often and let them finish the lines. Research links these back-and-forth turns to language and brain development (Harvard; Romeo et al. 2018). If you are worried about speech, ask your paediatrician or a speech therapist.

### LD2. My 3-year-old is not speaking in sentences. Should I worry? (age 3 · learn · health-adjacent)
- **Asked:** Quora "Why is my 3-year-old not talking in sentences?"
  (https://www.quora.com/Why-is-my-3-year-old-not-talking-in-sentences); Quora "Is it normal for a
  3-year-old to not speak?"; Momspresso "Your 3-Year-Old Child Is Not Speaking In Sentences. Should
  You Be Worried?" (https://www.momspresso.com/parenting/peaceful-positive-parenting/article/your-3yearold-child-is-not-speaking-in-sentences-should-you-be-worried);
  Bing autocomplete "my 4 year old doesn't speak clearly".
- **Never** position Kheelu as help for late talking or speech delay (positioning never-say list,
  [claims §4](../../../product/claims.md#4-retired-or-banned-wording)). This answer names no product.
- **Draft:** Children reach speech milestones at different times, so one missed milestone is not a diagnosis. If your child is not joining words together, is hard to understand, or does not seem to follow what you say, ask your paediatrician about a hearing check and a speech and language assessment. Meanwhile, keep talking, reading and singing together every day.

### LD3. Will English confuse my child if we speak Hindi (or Tamil, Kannada, Bengali) at home? (ages 3-5 · learn)
- **Asked:** FirstCry "Your Toddler's Language Skills in a Bilingual Household"
  (https://parenting.firstcry.com/articles/your-toddlers-language-skills-in-a-bilingual-household/);
  Quora "Does being in a bilingual family cause a child to be a late talker?"; autocomplete
  "bilingual children language development" (Google and Bing, en-IN).
- **Existing page:** `/stories/raising-a-bilingual-child-in-india`.
- **Draft:** No. Young children can learn two or more languages, and mixing words early on is normal. Your home language is a foundation for English, not a competitor, so keep using it every day. [SOURCE RE-CHECK: the bilingual research cited in /stories/raising-a-bilingual-child-in-india.] Kheelu speaks English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French, and switches mid-sentence.

### LD4. What games help a young child's speech? (ages 3-4 · learn)
- **Asked:** Quora "What are effective games and activities to encourage toddler speech
  development?" (https://www.quora.com/What-are-effective-games-and-activities-to-encourage-toddler-speech-development).
- **Draft:** Games where your child has to talk to take a turn: describe-and-guess, pretend shop, "what happens next?" with a picture book, and songs with gaps for them to fill. The talking is the point, so pause and wait for the answer. Research links these turns of conversation to young children's language development (Harvard; Romeo et al. 2018).

## Learning toys

### LT1. What are the best learning toys for a 3-year-old? (age 3 · learn and buy)
- **Asked:** Quora "What are some good, cheap and fun educational toys for kids (around age
  three)?" and "Which are some creative toys for 3-year-old kids?"; ParentCircle "How to Choose
  Best Educational Toys for Preschoolers" (https://www.parentcircle.com/tips-to-choose-educational-toys-for-preschoolers-3-5-year-olds/article);
  autocomplete "learning toys for 3 year olds", "best learning toys for 3 year olds" (en-IN).
- **Demand (legacy, labelled):** Keyword Planner India, Sept 2025 to Aug 2026, read 2026-09-11:
  "learning toys for 3 year olds" and "educational toys for 3 year olds" 1k to 10k a month each.
- **Existing page:** `/stories/learning-toys-for-a-three-year-old`.
- **Draft:** Toys that get your child building, imagining and talking: blocks, puzzles, pretend-play sets, art supplies and picture books. At 3, much learning happens through back-and-forth conversation, so a toy that answers back and asks a question in return can add to it. Choose sturdy toys graded for ages 3 and up, with no small parts.

### LT2. What are good educational toys for a 5-year-old? (age 5 · learn and buy)
- **Asked:** Quora "What are some developmental, cognitive, logic-building toys or games for kids,
  ages 3-5?" (https://www.quora.com/What-are-some-developmental-cognitive-logic-building-toys-or-games-for-kids-ages-3-5);
  autocomplete "learning toys for 5 year olds", "educational toys for 5 year old boys" (en-IN).
- **Draft:** At 5, look for toys with rules, choices and stories: board games, building sets, simple science kits and story cards your child can retell. [PLACEHOLDER F9: age-by-age activities for 5, signed off by the child-development advisor.] Kheelu, a screen-free talking toy for ages 3 to 7, tells stories your child can interrupt, question and be quizzed on.

### LT3. Do learning toys actually work? (ages 3-7 · learn)
- **Asked:** Quora "What kind of toys help toddlers learn faster?"
  (https://www.quora.com/What-kind-of-toys-help-toddlers-learn-faster); Quora "Which educational toy
  for toddlers do you find to be the best educationally and is fun for the toddlers?"
- **Draft:** No toy teaches on its own. Children learn most through play and conversation with the people around them, and research links back-and-forth talk to language and brain development (Harvard; Romeo et al. 2018). The best learning toys get your child doing, talking and asking. Be wary of any toy that promises a smarter child or a higher IQ.

## AI toys and safety

### AI1. Are AI toys safe for kids? (ages 3-7 · learn and compare)
- **Asked:** Google autocomplete "are ai toys safe", "are ai toys safe for kids"; Bing
  autocomplete "ai smart toy safety", "is ai safe for kids" (en-IN). Legacy Keyword Planner
  (read 2026-09-11): "are ai toys safe" 10 to 100 a month, three-month change +∞, competition Low.
- **Existing page:** `/safety` ("Are AI toys safe? How Kheelu is built to be"),
  `/stories/what-to-look-for-in-a-safe-ai-toy`.
- **Gate A:** how the site answers Common Sense Media's advice is [G5](../../../open-questions.md).
- **Draft:** Not all of them. In January 2026 Common Sense Media advised that children aged 5 and under should not be given AI toys, and urged extreme caution up to age 12. Before you buy any AI toy, check what it records, where your child's voice goes, whether it can reach the open internet, and whether you can read every conversation.

### AI2. Is Kheelu safe for my child? (ages 3-7 · buy)
- **Asked:** our Bing probe "Is Kheelu safe for kids" (no useful result: Bing does not yet know
  the name, see the audit file); Quora "Would you let your kids play with AI robots?"
  (https://www.quora.com/Would-you-let-your-kids-play-with-AI-robots-1).
- **Draft:** Kheelu has no camera and no screen. It tells your child it is a toy, and it never asks your child to keep a secret from you. It listens only for its wake word and records or sends nothing before it [CONFIRM G5 wording]. Voice goes only to Kheelona's own servers in India [CONFIRM F5]. Toy-safety certification: [PLACEHOLDER F4].

### AI3. Does an AI toy record everything my child says? (ages 3-7 · learn and compare)
- **Asked:** Common Sense Media "Parents' Ultimate Guide to AI Toys"
  (https://www.commonsensemedia.org/articles/parents-ultimate-guide-to-ai-toys) and Fairplay "AI
  Toys Advisory" (https://fairplayforkids.org/pf/aitoyadvisory/) both raise it; the live journal
  already answers "Does it record everything my child says?" (`/stories/questions-parents-ask-about-ai-toys`).
- **Draft:** Some AI toys listen all the time, so ask when the microphone listens and what happens to the audio. Kheelu listens only for its wake word and records or sends nothing before it [CONFIRM G5 wording]. After that, your child's voice goes only to Kheelona's own servers in India [CONFIRM F5]. How long recordings are kept: [PLACEHOLDER F2, F5].

### AI4. Can an AI toy say something inappropriate to my child? (ages 3-7 · compare)
- **Asked:** Quora "What are the disadvantages for the kids to have an interactive robot?"
  (https://www.quora.com/What-are-the-disadvantages-for-the-kids-to-have-an-interactive-robot);
  news result on Bing for "What is Kheelu AI toy": Hindustan Times "OpenAI blocks toymaker after
  AI teddy bear teaches kids dangerous ..." (bing-prompts.json).
- **Draft:** It can happen: Common Sense Media reported in January 2026 that 27% of the AI toy outputs it tested were not appropriate for children. Ask whether a toy can reach the open internet and whether you can read every conversation. Kheelu answers from a closed library and cannot browse [CONFIRM F8], and the parent app shows every conversation [CONFIRM F8].

### AI5. Should my young child use ChatGPT or another AI chatbot? (ages 3-7 · learn)
- **Asked:** Quora "Is ChatGPT AI good for kids?" (https://www.quora.com/Is-ChatGPT-AI-good-for-kids);
  Common Sense Media "AI Chatbots and Your Child: Age and Stage Guidance"
  (https://www.commonsensemedia.org/articles/ai-chatbots-and-your-child-age-and-stage-guidance).
- **Existing page:** `/stories/should-kids-use-ai`.
- **Draft:** Not a general chatbot. ChatGPT's own terms say users must be at least 13 [SOURCE RE-CHECK: OpenAI terms of use], and chatbots built for adults are not made for small children. If AI is part of your child's play, it should be built for their age, unable to reach the open internet, and fully visible to you as a parent.

### AI6. Will my child get too attached to an AI toy, or think it is a person? (ages 3-7 · learn)
- **Asked:** Common Sense Media press release, 22 January 2026; HealthyChildren.org "How AI
  Chatbots Affect Kids" (https://www.healthychildren.org/English/family-life/Media/Pages/are-ai-chatbots-safe-for-kids.aspx);
  Google autocomplete "do ai robots have feelings" (en-IN).
- **Draft:** Young children cannot always tell an AI from a real person, which is one reason Common Sense Media urges caution with AI toys. Look for a toy that says plainly what it is and never pretends otherwise. Kheelu tells your child it is a toy, and it never asks a child to keep a secret from a parent.

## Talking toys

### TT1. Are talking toys good for a young child's speech? (ages 3-4 · learn)
- **Asked:** Quora "Are there any toys that can help with language development in toddlers?"
  (https://www.quora.com/Are-there-any-toys-that-can-help-with-language-development-in-toddlers).
  Autocomplete also shows "learning toys for 3 year old with speech delay" and "... with autism"
  (Google, en-IN): demand exists, but health claims are banned, so no page targets those.
- **Draft:** A toy that only plays recordings or repeats words talks at a child. What builds language is back-and-forth: a question, a wait, an answer, another question. Research links those turns to young children's language development (Harvard; Romeo et al. 2018). A talking toy can add to conversation with you, but it does not replace it, and it is not therapy.

### TT2. What is the difference between a talking toy and a toy that talks back? (ages 3-7 · learn and compare)
- **Asked:** Google autocomplete "toys that talk back to kids", "toys that talk back"; Bing
  autocomplete "toys that talk back and repeat what you say" (en-IN). Legacy Keyword Planner (read
  2026-09-11): "toys that talk back" 100 to 1k a month, India.
- **Existing page:** `/stories/a-toy-that-talks-vs-a-toy-that-listens`.
- **Draft:** Most talking toys play fixed phrases or repeat what your child says back to them. A toy that talks back listens and gives a new answer each time, so your child can ask why, change the story or answer a question in return. Kheelu is a screen-free plush toy that talks with your child and answers back.

### TT3. Is a talking toy like Kheelu OK for my 2-year-old? (under 3 · out of band)
- **Asked:** Bing autocomplete "talking toys for toddlers 1-3", "talking toys for 2+ year olds";
  Google autocomplete "talking toy for baby" (en-IN).
- **Rule:** never imply the product suits children under 3 (brief section 3).
- **Draft:** No. Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. [PLACEHOLDER F4: toy-safety age grading and required warnings.] For a two-year-old, what does the most for language is simple: talking, reading and singing with you, every day, and waiting for them to answer.

## Gifts

### G1. What is a good birthday gift for a 4-year-old that is not a screen? (age 4 · gift)
- **Asked:** Quora "What's a good birthday gift for a 2-to-4-year-old that is fun and educational?"
  (https://www.quora.com/What-s-a-good-birthday-gift-for-a-2-to-4-year-old-that-is-fun-and-educational);
  Quora "What is a good gift for a 4-year-old that is not just a toy?"; autocomplete "gift for 3
  year old boy india", "gift for 6 year old boy india" (Google, en-IN).
- **Draft:** Something your child can build, imagine or talk with: blocks, a puzzle, picture books, an art kit or a pretend-play set. If you want a gift that keeps answering back, Kheelu is a screen-free talking plush toy for ages 3 to 7, at ₹4,999 for the first 500 units. Shipping starts 20 October 2026 [CONFIRM F12].

### G2. Will Kheelu arrive in time for Diwali? (ages 3-7 · gift)
- **Asked:** seasonal: FirstCry "15 Amazing Diwali Gift Ideas for Kids"
  (https://parenting.firstcry.com/articles/12-amazing-diwali-gift-ideas-for-kids/), Momspresso
  "8 Very Thoughtful Diwali Gift Ideas For Kids". Timing question inferred, not seen verbatim.
- **Draft:** Shipping starts 20 October 2026, and pre-orders are served first, in the order they were placed. [PLACEHOLDER F12: delivery time from dispatch to your city, and when an order placed today ships.] If you need it by a date, message us on WhatsApp before you reserve. The ₹499 reservation is refundable in full until we ship.

## About Kheelu (the entity questions answer engines get)

### B1. What is Kheelu? (brand · learn)
- **Asked:** our probes on Bing and WebSearch; legacy Perplexity prompt "What is Kheelona and what
  is the Kheelu AI toy?" (2026-09-11). PostHog: 63 visitors tagged `utm_source=chatgpt.com` landed on Home.
- **Draft:** Kheelu is a screen-free plush toy from Kheelona, a Bengaluru company, that talks with children aged 3 to 7 and answers back. It has three modes: AI mode for open conversation on home WiFi, Story mode for stories your child can question offline, and Bluetooth mode as a speaker. It has no screen and no camera.

### B2. Is Kheelu the same as Lumi? (brand · learn)
- **Asked:** Bing "Kheelona Lumi toy" (rewritten to "Khilona"); the App Store, Play Store, YNOS
  and kheelona.ai still say Lumi (entity file). Live answer exists on `/products/kheelu`.
- **Draft:** Yes. Kheelu is the same toy that was called Lumi until 5 September 2026: same product, new name. Older app-store listings and directory pages may still say Lumi. Lumi toys sold by other companies, including a talking plush sold in Romania and across Europe, are different products and are not made by Kheelona.

### B3. How much does Kheelu cost in India? (brand · buy)
- **Asked:** our Bing probe "Kheelu toy price India"; Bing's AI summary got this wrong on
  2026-10-11 ("priced at ₹499", audit file). Changes at sell-out ([pricing](../../../product/pricing.md)).
- **Draft:** ₹4,999 for the first 500 units, with GST and delivery anywhere in India included. A refundable ₹499 reserves one now, and the ₹4,500 balance is due before dispatch. Once those 500 are gone, Kheelu is ₹7,999, paid in full. Every Kheelu includes 6 months of Kheelona+, the stories, lessons, languages and parent app.

### B4. What ages is Kheelu for? (brand · buy)
- **Asked:** our Bing probe "Kheelu AI toy age"; the off-site sources disagree (3+, 4+, 2 to 8:
  entity file).
- **Draft:** Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. [PLACEHOLDER F9: what Kheelu offers at 3, at 5 and at 7, signed off by the child-development advisor.] [PLACEHOLDER F4: toy-safety age grading and any required warnings.] [G5: whether a grown-up should be nearby at 3.]
- **Note:** 21 words before placeholders; it reaches 40 to 60 only once F9 is answered.

### B5. Does Kheelu need WiFi or the internet? (brand · buy)
- **Asked:** WebSearch summaries of competing toys flag "needs an app or Wi-Fi" as a buying check;
  the live Home FAQ answers it.
- **Draft:** Only for open conversation. AI mode runs on your home WiFi and connects only to Kheelona's own servers [CONFIRM F5 wording]. Story mode stories and lessons work offline, and Bluetooth mode needs only a paired phone, so Kheelu still plays on a train. It cannot browse or search the open internet [CONFIRM F8].

### B6. Does Kheelu need a subscription? (brand · buy)
- **Asked:** Bing's AI summary invented "a lifetime subscription to Kheelona+" (audit file); the
  live product FAQ asks it.
- **Draft:** Every Kheelu includes 6 months of Kheelona+: the stories, lessons, languages and the parent app. Kheelu's smart features are yours for life, Kheelona+ pricing is announced soon, and nothing renews without you. [PLACEHOLDER F7: the Kheelona+ price, and exactly what a family keeps after the 6 months.]
- **Note:** 32 words before the placeholder; F7 completes it, and also decides whether "smart features are yours for life" needs a definition, since one engine already misread it.

### B7. Which languages does Kheelu speak? (brand · buy)
- **Asked:** live FAQ; competitor answers lead with language counts (WebSearch, "screen-free AI
  plush toy India ... Hindi").
- **Draft:** English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French are named today, with up to 10 languages at launch. Kheelu can switch languages mid-sentence, in the languages you speak at home, so a grandparent's Kannada and a cousin's English can both be part of the same conversation with your child.
- **Note:** the closing clause is copy colour, not a tested behaviour; keep or cut at review.

### B8. When will I get Kheelu? (brand · buy)
- **Asked:** PostHog landings; standard pre-order question (brief 9.1: delivery next to the CTA).
- **Draft:** Shipping starts 20 October 2026, and pre-orders are served first, in the order they were placed [CONFIRM F12]. [PLACEHOLDER F12: delivery time from dispatch, and the date for orders placed now.] If you reserved for ₹499, the ₹4,500 balance is due by payment link before your Kheelu is dispatched to you.
- **Note:** 37 words before the placeholder; F12 completes it.

### B9. Can I get my money back? (brand · buy)
- **Asked:** PostHog: a ChatGPT-tagged visitor landed on `/refund` (6 pageviews in that session
  group, 2026-09-19 to 2026-10-10).
- **Draft:** Yes. The ₹499 reservation, and anything you pay before dispatch, is refundable in full until Kheelu ships. Message us on WhatsApp (messages only, not calls) or email us; both are listed on every page. [PLACEHOLDER F1: the returns window, replacement and warranty once Kheelu is delivered.]
- **Note:** 37 words before the placeholder; F1 completes it.

### B10. Who makes Kheelu? (brand · trust)
- **Asked:** PostHog: a ChatGPT-tagged visitor landed on `/team`; YNOS lists the brand as
  "Khaeelon" with two founders (entity file).
- **Draft:** Kheelu is made by Kheelona Robotics Private Limited, a company in Bengaluru with three co-founders: Apoorva Sahu, Aman Soni and Kashyap C.R. Pre-orders are paid on store.kheelona.com, and support is on WhatsApp and email. [PLACEHOLDER F3: manufacturer or importer, and country of origin.] [CHECK: founding year; schema says 2025.]
- **Note:** 34 words before the placeholders; F3 completes it.

### B11. Does Kheelu have a camera? (brand · trust)
- **Asked:** not seen verbatim; added because the sister site describes a "camera and edge
  inference" module tier and a camera baby monitor (Lori) under the same brand, and engines mix the
  two (audit file).
- **Draft:** No. Kheelu has no camera and no screen. It listens only for its wake word and records or sends nothing before it [CONFIRM G5 wording]. Some AI toys and robots do carry cameras, and Kheelona's separate baby-monitor product does, so it is worth checking any toy you are considering for your child.
- **Note:** naming Lori on the consumer site is a messaging call; cut that clause if the family stays off the site.

## Questions seen but deliberately not drafted

| Question or query | Where seen | Why not |
|---|---|---|
| "gift for 3 year old girl under 500", "gift for 6 year old boy under 500" | Google autocomplete, en-IN | Price intent far below ₹4,999; the ₹499 token is not the price and must never read as one |
| "learning toys for 3 year old with speech delay / with autism" | Google autocomplete, en-IN | Health claims are banned (claims §4); no page should target them |
| "talking toy for baby", "talking toys for toddlers 1-3" | Google and Bing autocomplete | Under 3; only TT3's "not for under 3" answer applies |
| "ai toys for kids reddit", "are ai toys real" | Google autocomplete | Navigational or too vague; Reddit could not be read (gap) |
| "how much screen time for 2 year old", "... 1 year old" | Google and Bing autocomplete | Under 3; the journal's under-3 articles are a G5 question |

## Gaps in this capture

- No Google People Also Ask (429), no Reddit (blocked), no Hindi or Hinglish phrasings seen in any
  source checked. Hinglish demand stays a noted future opportunity, unmeasured.
- No search volumes beyond the legacy Keyword Planner read (C11 asks for a fresh export).
- Bing showed PAA for one seed in seven, so Bing PAA coverage is thin.
