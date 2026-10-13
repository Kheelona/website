---
title: "Story: Raising a bilingual child in India (/stories/raising-a-bilingual-child-in-india): page copy, task 5.18 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§4.1 "the other 20 articles", §5 /stories/* row)
  - ../gate-a-open-items.md (B5, B14, B15, B28, B45)
  - ../pages/stories.md (fold 3 card, the keep close)
  - ../pages/story-talking-toys-and-late-talkers.md (the approved speech and language model, task 5.6; its myth 1 uses the same AAP and ASHA source)
  - ../../engineering/tasks.md (Wave 5 part C paragraph, row 5.18, the note on the 18 articles without a mockup)
  - ../../research/keyword-map.md (§2.3 LRN-10, §4.2, §5.1 rules 1-10, §5.2, §6.8 LD3)
  - ../../research/source-verification.md (§3.6 C28, C38, C39, C40; §4 ready lines C38, C39, C40; §5.3)
  - "../../raw/research/sources/: C38-aap-asha-multiple-languages-faq.md, C38-byers-heinlein-lew-williams-2013.md, C40-asha-late-language-emergence.md, C40-cummins-2001-sprogforum-mother-tongue.md, C39-nep-2020-para-4-11.md, C28-byers-heinlein-2013-language-exposure.md (read, not used: not re-checked)"
  - ../../product/claims.md (§1 speech disclaimer, §4), ../../product/age-band-review.md (row 44)
  - ../../brand/voice.md (conflict 12, the language claim), ../../brand/messaging.md (words to stop using)
  - ../../decisions/D013, D015, D016, D025, D026, D041
  - "src/lib/stories-expansion.ts:187-217 (the live article; text and facts as input only), read in the task worktree at base aa4b39e"
  - "src/content/en-IN/stories/articles/raising-a-bilingual-child-in-india.ts (stub: card, related list, dates); src/content/types.ts (Article shape); src/layouts/ArticleTemplate/ArticleTemplate.tsx"
  - test/guards/banned-phrases.data.ts (checked against every Copy block)
  - ../../qa/cmo-review-articles-5.18-2026-10-14.md (M11, the read time)
  - design-system/project/03-cast.md:50, 120; 01-writing.md:19-26, 38, 111-113 (read-only)
---

# Story: Raising a bilingual child in India

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for CMO review, then the founder's sign-off
> on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md); tasks.md, Wave 5 part C).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁵` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused
  when a source returns; in the module each is `[^n]`. Every statement about speech or language carries one
  ([D025](../../decisions/D025-speech-and-language.md)). Lines without a marker are plain advice in our own voice
  and make no research claim.
- **No mockup exists for this article.** Text parity is against this page's Copy blocks; visual acceptance is
  template parity with `story-learning-toys-for-a-three-year-old.html` for the shared parts (tasks.md, the note
  below the Wave 5 table). Each fold names the template block that renders it (`src/content/types.ts`, `Article`).
- Links show the real path.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/raising-a-bilingual-child-in-india` (no mockup) |
| Page job | Answer "will two languages confuse my child?" for a parent of a 3 to 7 year old in India: what the research and India's education policy say, why mixing is normal, and what keeps a home language alive. **No Kheelu pitch and no pre-order close** (a talking-and-language page: B5 as extended by the task notes; D025); it ends on the keep-reading close. The journal's most-seen article in search (GSC 99 impressions, keyword map LRN-10), so it gets the most care |
| Primary cluster | **raising a bilingual child** (LRN-10); secondaries "will English confuse my child", "mother tongue" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (45 characters) | Raising a bilingual child in India · Kheelona |
| Meta description (145 characters) | Raising a bilingual child in India: what the research says about two languages, why mixing words is normal, and what keeps a home language alive. |
| H1 | Raising a bilingual child in India |
| Card (hub, unchanged) | "Raising a bilingual child in India" · "Does a bilingual home confuse a young child? What the research says, and what keeps a home language alive." (approved hub copy, [stories.md fold 3](stories.md#fold-3--talking-and-language-talking), word for word) |
| Byline line | The Kheelona team · First published 28 Jul 2026 · 3 min read (CMO review M11) |
| CTA | None in the page body. No finale CTA, no sticky bar. The site chrome keeps its own button |
| In-text product link | None (question 1) |
| Template settings | `close: "keep"` (keep-reading close, no pre-order button; no phone buy bar); crumb topic `talking`; `og: DEFAULT_OG` |
| Dates | `published` 2026-07-28 (live, unchanged); `updated` 2026-10-13, the rewrite's date (main-session ruling at the wave 5 part C merge, as task 5.6 set it for the three approved guides) |

**What changed from the live article** (`src/lib/stories-expansion.ts:187-217`): every research statement now
carries a marker; "does not ... delay their speech or cost them English" becomes the AAP and ASHA's own words
(learning more than one language does not cause speech or language problems; using the home language will not stop
a child learning English); "the mother tongue is the foundation the second language is built on" becomes ASHA's
"strong model in any language" line; "two developmental psychologists" becomes "two researchers who study
bilingual infants and children", and "add the two lists together and the total matches" becomes the review's own
method, counting each idea once ([source verification C38](../../research/source-verification.md#c38--bilingual-children));
"it fades as each language fills out" and "correcting it teaches a child that one of their languages is wrong" are
cut (no source); "in most Indian homes, English has school, screens and half the world working for it" and "the
mother tongue is the one at risk" are cut (no verified source; the closest, C28, was never re-checked); "concepts
... transfer ... far faster" becomes Jim Cummins's argument, attributed, without "far faster" (C40); "That is why
India's own NEP ..." becomes the policy on its own, from the policy's text rather than the PIB release, without
"children learn best in a language they already understand" (C39); the Harvard line "the loop works in Bengali
exactly as well" is cut (C07 caveat 6); "the war is lost the moment the language becomes homework" and "children
keep languages that are useful and loved" survive only as plain tips; the Kheelu paragraph (its languages line and
"the friend") is cut (no pitch); the meta loses the unsourced "why the mother tongue is the one at risk"; the byline
(a person removed from the site at the founder's request) becomes the Kheelona team.

**Overlap.** The approved late-talker page's myth 1 cites the same AAP and ASHA answer in two sentences; this page
owns the topic and goes further (the review, mixing, NEP, keeping a language alive). `how-children-collect-words`
keeps only the word count across languages and links here.

---

## Fold 1 · Article head

**Fold job:** say what the page answers and for whom, in the first phone screen.

**Renders as:** `head` (title, lead, author `TEAM_BYLINE`, readMinutes, image); crumbs from the template.

**Copy:**

> **Breadcrumb:** Stories › Talking and language
>
> **H1:** Raising a bilingual child in India
>
> What the research says about two languages at home, and what keeps a home language alive.
>
> The Kheelona team · First published 28 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "bilingual child". The H1 is the live title, as the keyword map asks (§5.2: "keep").
- **Lead:** the card's summary without its opening question, because fold 2's H2 asks that question one line
  later. The card itself is unchanged.
- **Dates and read time:** "First published" is the stub's `published` (`2026-07-28`, the live date). Read time
  3 min: the CMO review counts about 696 words from the H1 to fold 9 (3.48), and the build derives `readMinutes`
  from the final module text with the shared rule, `round(words / 200)`
  ([CMO review M11](../../qa/cmo-review-articles-5.18-2026-10-14.md); this draft's earlier "4 min" came from an
  estimate of 700 words rounded up).
- **Image** (`kh-photo`, 4:5): `tara-04-reading-nook-web.webp`. Alt: "A girl in a coral kurta sits cross-legged in a
  cushioned window seat, reading a picture book aloud." (`03-cast.md:120`, "multilingual books"; the cast's
  multilingual-homes child, `03-cast.md:50`; no Kheelu in the photo; checked by eye.) No name or age in the alt.
  **No Kheelu in any image on this page** (no pitch).

---

## Fold 2 · The answer first, and the one-line disclaimer

**Fold job:** answer the worry in 40 to 60 words, then say once, early, that a toy is not a treatment.

**Renders as:** `answer` { `question`, `answer`, `detail: [{ kind: "disclaimer" }]` }.

**Copy:**

> **H2:** Will a bilingual home confuse your child?
>
> No. Growing up bilingual does not cause speech or language problems, and mixing two languages in one sentence is normal.¹ Speaking your home language will not stop your child learning English.¹ A strong model in any language helps build a foundation for learning others.² So keep speaking yours every day.
>
> *Kheelu is a toy, not a therapy or treatment. If you're worried about your child's speech, talk to your paediatrician.*

- Answer: 50 words (markers excluded). Sentences 1 and 2 are the AAP and ASHA parent guidance (its quoted line,
  and its answers on mixing and on keeping a heritage language); sentence 3 is ASHA's Practice Portal, as in the
  verified C40 line. The last sentence is a house line.
- The disclaimer is [D025](../../decisions/D025-speech-and-language.md)'s line, verbatim (working default B45), as on
  the approved late-talker page. It is the only mention of Kheelu on the page.
- The keyword map's LD3 draft ends on Kheelu's languages: left out here (no pitch).

---

## Fold 3 · The scene

**Renders as:** `part` without a title, two `p`.

**Copy:**

> You may know this moment. You ask something in Kannada, and your child answers in English. Part of you is proud. Part of you wonders whether the home language is slipping away.
>
> Under it sits an older worry: are two languages too much for a young child? Here is what the research says, and what keeps a home language going.

---

## Fold 4 · Confusion and delay

**Fold job:** the research answer in full, with its method and its limits.

**Renders as:** `part` titled, three `p`.

**Copy:**

> **H2:** Does a second language confuse or delay a young child?
>
> No. A 2013 review of the research, written for parents by two researchers who study bilingual infants and children, says it plainly: bilingual children are not more likely than monolingual children to have difficulties with language, to show delays in learning, or to be diagnosed with a language disorder.³
>
> They may know fewer words in each language on its own. Count the ideas they have a word for in either language, counting "paani" and "water" once, and the total is about the same as for a child growing up with one language.³ Most of the studies it draws on were done in North America and Europe.³
>
> The American Academy of Pediatrics and the American Speech-Language-Hearing Association say the same in their advice for parents: "Speech or language problems are not caused by learning multiple languages."¹

- Paragraphs 1 and 2 are the verified C38 line ([source verification §4 C38](../../research/source-verification.md#c38--bilingual-children)),
  without its opening question "Do bilingual children fall behind?" (it repeats the H2 and leans on worry).
  The limit sentence is from the review's population (excerpt `C38-byers-heinlein-lew-williams-2013.md:52-53`).
- The review counts each idea once; the AAP and ASHA count raw totals. The two methods sit in different
  paragraphs with their own markers, and this page never states the AAP and ASHA total, as the C40 note asks.
- "Infants" names the researchers' field, not this page's audience (age-band review row 44: research
  statements about younger children are fine).

---

## Fold 5 · Mixing

**Renders as:** `part` titled, two `p`.

**Copy:**

> **H2:** Is mixing two languages a problem?
>
> No. Mixing words or grammar from two languages in one sentence is normal, and it isn't confusion.¹ Usually by age 3, children learning more than one language can keep them apart, and use the one that suits the person they're talking to.¹
>
> So when your child answers your Tamil in English, answer back in Tamil, warmly.

- The AAP and ASHA's answer to "Will learning more than one language confuse my child?" (excerpt
  `C38-aap-asha-multiple-languages-faq.md:29-31`); the C38 ready line gives its first half. The last line is house
  advice; the live "correcting it teaches a child that one of their languages is wrong" had no source and is gone.

---

## Fold 6 · The home language and English

**Fold job:** the "mother tongue" worry: is the home language in the way?

**Renders as:** `part` titled, two `p`.

**Copy:**

> **H2:** Is the home language in the way of English?
>
> No. ASHA, the US association of speech and hearing professionals, says in its guidance for clinicians that a strong model in any language helps build a foundation for learning others.²
>
> Jim Cummins, a University of Toronto researcher on bilingual education, argues that concepts learned in the mother tongue carry over to a second language. A child who can tell the time in one language, he writes, does not need to re-learn the concept in another, only the new labels for it.⁴ He was writing about children at school.⁴

- ASHA: the C40 line, attributed this time (the answer gave it in short). Cummins: the verified C40 line, verbatim,
  plus its own caveat (pupils in school; an argument, so "argues", never "research shows"). "Far faster" from the
  live article is gone.
- "Mother tongue" (the secondary) appears here as Cummins's term, never as our claim (DS `01-writing.md:38`:
  avoid "mother-tongue education (as a claim)").

---

## Fold 7 · India's education policy

**Renders as:** `part` titled, two `p`.

**Copy:**

> **H2:** What does India's education policy say?
>
> India's National Education Policy 2020 says that, wherever possible, children should be taught in their home language, mother tongue, or local or regional language until at least Grade 5, and preferably till Grade 8 and beyond.⁵ The policy gives its reason in the same paragraph: young children "learn and grasp nontrivial concepts more quickly in their home language/mother tongue".⁵
>
> It is a policy for schools, followed wherever possible, not a law.

- The verified C39 line, verbatim ([source verification §4 C39](../../research/source-verification.md#c39--nep-and-the-home-language)).
  The marker links the policy's own text (NCERT copy), never the PIB release; no "That is why" bridge from fold 6,
  so the policy is never offered as proof of Cummins's argument. The last line is the C39 caveat, said plainly.

---

## Fold 8 · Keeping a home language alive

**Fold job:** what a parent can do this week; advice only.

**Renders as:** `part` titled; `list` (variant `tips`, one icon each, the builder picks from the icons the
approved modules use); `callout` (lead "Try this:").

**Copy:**

> **H2:** What keeps a home language alive?
>
> - Give it jobs: the songs, the food words, the jokes and the stories one grandparent tells best.
> - Speak it without apology, at home and outside.
> - When your child answers in English, reply in your language, warmly.
> - Read in it, even if the books take some finding.
> - Keep calls with grandparents and cousins in their language.
> - Let it carry the good moments, not only "eat your food" and "time for bed".
>
> **Try this:** this week, ask a grandparent to tell your child one story in the home language, on a call or in person.

- House advice; nothing here claims a result. The live "children keep languages that are useful and loved, and
  drop languages that are neither" is a research-sounding claim with no source, so only its advice survives.

---

## Fold 9 · Who speaks what

**Renders as:** `part` titled, one `p`.

**Copy:**

> **H2:** Who speaks what, day to day?
>
> Families do this in different ways: one language for each parent, one language at home and English at school, or grandparents who keep the home language going. Pick a pattern your household can keep, and change it when life changes.

- The live H2, kept. Advice only; the live "none of them is the rule" is dropped (it read as a finding).

---

## Fold 10 · Sources (article foot)

**Renders as:** `sources[]` (citation, href) through `SourcesSection`; the same list is the BlogPosting
`citation` array.

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ American Academy of Pediatrics and American Speech-Language-Hearing Association, "Young Children Learning Multiple Languages: Parent FAQs", HealthyChildren.org, 2025 (updated 20 November). https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx
>
> ² American Speech-Language-Hearing Association, "Late Language Emergence" (Practice Portal), undated, Assessment: Cultural and Linguistic Considerations. https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/
>
> ³ Krista Byers-Heinlein and Casey Lew-Williams, "Bilingualism in the Early Years: What the Science Says", LEARNing Landscapes, 2013, pp. 97 and 104. https://doi.org/10.36510/learnland.v7i1.632
>
> ⁴ Jim Cummins, "Bilingual Children's Mother Tongue: Why is it important for education?", Sprogforum 19, 2001, p. 18. https://web.archive.org/web/20120905180920/http://inet.dpb.dpu.dk/infodok/sprogforum/Espr19/CumminsENG.pdf
>
> ⁵ Ministry of Human Resource Development (now Ministry of Education), Government of India, "National Education Policy 2020", 2020, chapter 4, para 4.11, p. 13. https://ncert.nic.in/pdf/nep/NEP_2020.pdf

- Note 4 is the journal's own PDF as archived (the live host did not answer on 2026-10-10). The asha.org consumer
  page is not cited: it now redirects to CHSA (C40 caveat 3).

---

## Fold 11 · Close: keep reading (no CTA)

**Fold job:** end with a calm next step that is not a purchase.

**Renders as:** `close: "keep"` → `RelatedGuides` (keep variant): heading and hub link from
`articlePageCopy.keep`; titles are the related modules' card titles.

**Copy:**

> **H2:** Keep reading
>
> - Late talker? What helps a child find their words
> - Should kids use AI? An honest answer from people who build it
> - Does a three-year-old need an AI tutor?
>
> [All guides for parents of 3 to 7 year olds] → `/stories`

| Title | Real URL |
|---|---|
| Late talker? What helps a child find their words | `/stories/talking-toys-and-late-talkers` |
| Should kids use AI? An honest answer from people who build it | `/stories/should-kids-use-ai` |
| Does a three-year-old need an AI tutor? | `/stories/does-a-three-year-old-need-an-ai-tutor` |

- The stub's `related` list, unchanged and in its order (task notes). Two of the three are AI guides from the
  legacy ring; see the note for the main session.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 45 characters; the live title, kept as the map asks |
| Meta ≤ 155: primary plus a concrete fact | Yes | 145 characters; the three things the page gives |
| One H1 with the primary | Yes | "Raising a bilingual child in India" |
| Primary in an answer-first block in the first ~100 words | Yes | H1, then the fold 2 question H2 ("bilingual home") and its 50-word answer ("growing up bilingual") |
| An H2 with the primary or a close variant | Yes | Fold 2 "Will a bilingual home confuse your child?" |
| Secondaries | Yes | "will English confuse my child": fold 2 H2 and answer; "mother tongue": folds 6 and 7 |
| Health terms only in a learn article, with public sources, beside the D025 line | Yes | "speech", "language disorder" appear only with markers ([§5.1](../../research/keyword-map.md#5-placement-rules) rules 8, 10) |
| Alt text | Yes | Describes the scene; no keyword forced |
| Density | Yes | "raising a bilingual child" once in `<main>` (H1) of about 700 words (0.6%, counting its 4 words); "bilingual" 6 times (0.9%); "Kheelu" once (the disclaimer) |
| Words never placed | Yes | No product, no "thinks in it" outcome (voice conflict 12), no tutor, lessons, adapts, competitor names; no dead age range |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing (site chrome, unchanged) |
| Page body | none | none | No finale CTA, no sticky bar (keep close) |

## Placeholders

None.

## Questions for the founder (website only)

1. **No pitch on the talking-and-language guides.** This is the journal's most-seen guide in search, and the live
   version ended on Kheelu's languages. (a) No product link, no pre-order button, no sticky bar; Kheelu named only
   in the D025 line (as drafted); (b) the same, with the disclaimer reworded to name no product; (c) one calm,
   factual line about Kheelu's languages with the one in-text product link, and the journal close. **Recommend
   (a)**: it matches the approved late-talker page, and a language pitch right under a speech disclaimer reads as
   selling to a worried parent. The hub, nav and every other guide still lead to Kheelu.

## Sources

| Claim | Source |
|---|---|
| Learning more than one language does not cause speech or language problems (the quoted line) | [source verification C40](../../research/source-verification.md#c40--a-second-language-does-not-cause-delay); excerpt `C38-aap-asha-multiple-languages-faq.md:20-22` |
| Mixing words or grammar in one sentence is normal, not confusion; usually by 3, children can separate their languages and use the one that suits the listener | [source verification C38](../../research/source-verification.md#c38--bilingual-children) (second ready line); excerpt `C38-aap-asha-multiple-languages-faq.md:29-31` |
| Using the home language will not stop a child learning English | excerpt `C38-aap-asha-multiple-languages-faq.md:32-33` (the "heritage language" answer, paraphrased) |
| A strong model in any language helps build a foundation for learning others; ASHA's Practice Portal is guidance for clinicians | [source verification C40](../../research/source-verification.md#c40--a-second-language-does-not-cause-delay); excerpt `C40-asha-late-language-emergence.md:10, 23-27` |
| 2013 review: not more likely to have difficulties, delays or a disorder; fewer words per language, about the same counting each idea once; written for parents by researchers of bilingual infants and children; mostly North American and European research | [source verification C38](../../research/source-verification.md#c38--bilingual-children); excerpt `C38-byers-heinlein-lew-williams-2013.md:17-35, 47-53` |
| Cummins: concepts carry over; the telling-time example; written about pupils at school | [source verification C40](../../research/source-verification.md#c40--a-second-language-does-not-cause-delay) (third ready line, caveat 4); excerpt `C40-cummins-2001-sprogforum-mother-tongue.md:19-31, 45-49` |
| NEP 2020 para 4.11: home language until at least Grade 5, preferably till Grade 8 and beyond, wherever possible; its reason; a policy, not a law | [source verification C39](../../research/source-verification.md#c39--nep-and-the-home-language); excerpt `C39-nep-2020-para-4-11.md:19-32, 45-53` |
| Disclaimer line | [D025](../../decisions/D025-speech-and-language.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder); working default B45 |
| No pitch on speech and language pages | Working default [B5](../gate-a-open-items.md#3-other-website-items-on-working-defaults); task notes (5.18); [B14](../gate-a-open-items.md#3-other-website-items-on-working-defaults) |
| Cut lines | [source verification §3.6](../../research/source-verification.md#36-language-and-bilingualism) C38 caveats 1-3, C39 caveats 1-5, C40 caveat 1, C28 (not re-checked); C07 caveat 6 |
| Ages 3 to 7 only; research about younger children is fine as research | [content boundary](../content-boundary.md); [age-band review](../../product/age-band-review.md) row 44 |
| Card title and summary; related list; dates | stub `src/content/en-IN/stories/articles/raising-a-bilingual-child-in-india.ts`; [stories.md fold 3](stories.md#fold-3--talking-and-language-talking); `src/lib/stories-expansion.ts:194-195` |
| Photo | DS `03-cast.md:50, 120`; file checked by eye |

**For the main session (not the founder).** (1) The stub's `related` list (late talker, should kids use AI, an AI
tutor) is the legacy ring, kept as the task notes ask; two AI guides are an odd next step from a language page. A
later swap to `how-children-collect-words` and `how-to-get-your-child-talking` would need the incoming-link count
rebalanced (`articles.test.ts`, three incoming each). (2) `updated`: the same ruling as the other 17 (stub date or
rewrite date).
