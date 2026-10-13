---
title: "Source verification, 2026-10-14: Tisseron's AI markers and daily minutes (C34); the CDC sentence and two-word items (C42)"
type: research
updated: 2026-10-14
sources:
  - source-verification.md
  - ../decisions/D026-public-statistics.md
  - ../decisions/D025-speech-and-language.md
  - ../raw/research/sources/C34-tisseron-2020-ai-markers-3-6-13-18.md
  - ../raw/research/sources/C34-tisseron-3-6-ages-minutes-2026-10-14.md
  - ../raw/research/sources/C34-tisseron-3-6-9-12-balises.md
  - ../raw/research/sources/C42-cdc-milestones-4-years.md
  - ../raw/research/sources/C42-zubler-2022-table-4-cross-check.md
  - ../raw/research/sources/C42-cdc-milestones-30-months-and-3-years.md
  - ../raw/research/sources/C42-zubler-2022-pediatrics-milestones.md
  - ../raw/qa/2026-10-14/cmo/articles-5.17/tisseron-balises-wayback-20260608053003.txt
  - ../qa/cmo-review-articles-5.17-2026-10-14.md
  - ../qa/cmo-review-articles-5.18-2026-10-14.md
  - ../site/pages/story-screen-time-rules-parents-swear-by.md
  - ../site/pages/story-talking-late-or-talking-little.md
  - ../product/facts.md
  - "https://www.asha.org/public/developmental-milestones/communication-milestones-2-to-3-years/ and .../communication-milestones-3-to-4-years/ (read 2026-10-14, plain GET, HTTP 200; no excerpt file: a negative finding only)"
---

# Source verification, 2026-10-14

Step 1 of task 5.20 ([tasks](../engineering/tasks.md), "Article copy fixes before Gate B": sources first).
It answers three source questions from the CMO reviews of the articles: 5.17 M1 (Tisseron's 2020 markers
about AI, and his daily minutes for ages 3 to 6), 5.18 M2 (a sourced sentence milestone for "3-year-old not
talking in sentences?") and 5.18 M4 (the CDC two-word item, checked against Zubler 2022 Table 4). It extends
[source verification](source-verification.md) (C34 and C42) and does not change that page.

**Method.** As [source verification §1](source-verification.md#1-method), under
[D026](../decisions/D026-public-statistics.md): the original public page, plain GET where it answers; exact
quotes saved as new excerpt files in `raw/research/sources/` (raw is immutable, so nothing existing was
edited). The two Tisseron pages were read live. The CDC refuses plain requests (HTTP 403, again today), so
each CDC page was read twice: the live page through the WebFetch rendering tool, and the Internet Archive's
raw capture of the same page (same 16 May 2026 review) for a plain-text read. The two reads agree word for
word. Zubler 2022 was read as full-text XML from PubMed Central. Verdicts use the same scale.

**Dates.** "2026-10-14" is the project date used across the wiki; this machine's clock read 2026-10-13
08:05 PDT (15:05 UTC) when the reads began.

## Summary

| Check | Verdict | What can be said | Excerpt |
|---|---|---|---|
| 1a. Tisseron's 3-6-13-18 markers about AI | **SUPPORTED** (the year 2020 rests on the association's own word) | The four markers, word for word. For ages 3 to 7 they say: no digital tool before 3, **no connected toys before 6** | [C34 AI markers](../raw/research/sources/C34-tisseron-2020-ai-markers-3-6-13-18.md) |
| 1b. Tisseron's daily minutes, 3 to 6 | **SUPPORTED**: live, same words as the June capture | From half an hour a day at 3 to an hour at most at 6, as time shared with a parent | [C34 minutes](../raw/research/sources/C34-tisseron-3-6-ages-minutes-2026-10-14.md) |
| 2. CDC sentence milestone | **SUPPORTED as a 4-year item only** | "Says sentences with four or more words" is a milestone by **4 years**; the CDC has no sentence milestone at 3 | [C42 CDC 4 years](../raw/research/sources/C42-cdc-milestones-4-years.md), [C42 Zubler Table 4](../raw/research/sources/C42-zubler-2022-table-4-cross-check.md) |
| 3. CDC 30-month items (50 words; two words with an action word) | **SUPPORTED**, cross-checked | Both items match Zubler 2022 Table 4 at 30 months, with normative data | same two files |

**The finding that matters most (1a).** Tisseron's AI page is about Kheelu's own category. Its second
paragraph describes talking plush toys with a Wi-Fi voice box, "proposées dès l’âge de trois ans comme une
alternative aux écrans" (offered from age three as an alternative to screens), and its second marker is
"Pas de jouets connectés avant 6 ans" (no connected toys before 6). Kheelu is a plush toy with a speaker in
its tummy whose AI mode runs on home WiFi, sold as a "screen-free AI toy" for ages 3 to 7
([facts](../product/facts.md), rows "What it is", "Look", "Schema category", "AI mode"). The 3-6-9-12
article's note ¹ links the page whose first paragraph announces these markers, and the site menu links the
AI page. A line that names the AI markers without saying "no connected toys before 6" would be a selective
quote. Whether the article keeps its product line next to this is a positioning decision for the founder at
Gate B. It is not a source question, and this page does not decide it.

## 1. Serge Tisseron, association 3-6-9-12 (C34)

### 1a. The 3-6-13-18 markers about AI · SUPPORTED

**Read:** "Les balises 3-6-13-18 et l'IA", https://www.3-6-9-12.org/les-balises-3-6-13-18/, live, plain GET,
HTTP 200, 2026-10-14. The page shows no date; metadata: published and modified 14 July 2026. There is no
English version: the English alternate is the general milestones page, with no AI-marker text. The year
comes from two places. "Les balises 3-6-9-12+" (opening paragraph, live) says: "En 2020, il crée les
balises 3-6-13-18, pour faire face aux risques de l’intelligence artificielle pour le développement,
l’imagination et la santé mentale des enfants et des adolescents." The AI page says: "C’est pourquoi nous
avons proposé en 2020 les repères 3-6-13-18 pour les chatbots."

**The four markers, exact** (translations are this agent's):

| Marker | French (source) | English |
|---|---|---|
| 3 | "Pas d’outil numérique avant 3 ans. Un enfant a besoin de voix humaine, d’amour et de limites pour se construire." | No digital tool before 3. A child needs a human voice, love and limits to grow. |
| 6 | "Pas de jouets connectés avant 6 ans. L’IA écoute, mais elle ne comprend pas l’enfant, et elle risque de lui imposer des modes de pensée et des valeurs qui ne sont pas celles des parents." | No connected toys before 6. AI listens, but it does not understand the child, and it risks imposing on the child ways of thinking and values that are not the parents'. |
| 13 | "Pas d’Internet ni de chatbots généralistes avant 12 ans révolus, mais un usage accompagné pour développer l’esprit critique et découvrir comment se servir de l’IA en apprenant à douter et à raisonner." | No Internet or general-purpose chatbots before the age of 12, but use alongside an adult, to develop critical thinking and discover how to use AI by learning to doubt and to reason. |
| 18 | "Pas de compagnon digital avant 18 ans. Les IA ne font en effet que construire un double de l’utilisateur qui lui est ensuite présenté comme un interlocuteur toujours en accord avec lui. En plus, les machines simulent les émotions, mais ne construisent pas de lien réel. L’amour, l’amitié et le jugement ne s’automatisent pas." | No digital companion before 18. AIs only build a double of the user, presented back to them as someone who always agrees. Machines simulate emotions but build no real bond. Love, friendship and judgement cannot be automated. |

The page's opening line: "Peluches connectées, chatbots et compagnons numériques : face aux risques de
l’intelligence artificielle pour le développement, l’imagination et la santé mentale des enfants et des
adolescents, il devient urgent de fixer des limites adaptées à chaque âge." (Connected plush toys, chatbots
and digital companions: faced with the risks of AI for the development, imagination and mental health of
children and teenagers, it is becoming urgent to set limits suited to each age.) The plush-toy paragraph
is quoted in full in the [excerpt](../raw/research/sources/C34-tisseron-2020-ai-markers-3-6-13-18.md).

**Ready-to-use line** (end of fold 3 of the 3-6-9-12 article; it replaces the CMO's "Fix, now" paragraph or
follows its first sentence):

> In 2020, he added a second set of markers, 3-6-13-18, for artificial intelligence.¹ For young children,
> they say no digital tool before 3 and no connected toys before 6: AI listens, but it does not understand
> the child, and may impose ways of thinking and values that are not the parents'.² The later markers are
> no internet or general-purpose chatbots before 12, except used with an adult, and no digital companion
> before 18.²

Short form, if the fold needs fewer words: "In 2020, he added a second set of markers, 3-6-13-18, for
artificial intelligence.¹ For young children, they say no digital tool before 3 and no connected toys
before 6.²"

¹ Serge Tisseron, association 3-6-9-12, "Les balises 3-6-9-12+" (in French), undated page, opening paragraph. https://www.3-6-9-12.org/les-balises-3-6-9-12/
² Serge Tisseron, association 3-6-9-12, "Les balises 3-6-13-18 et l'IA" (in French), undated page, the four markers. https://www.3-6-9-12.org/les-balises-3-6-13-18/

**Caveats.**
1. **It concerns our own product category** (see the summary). The CMO's "Fix, now" sentence ("In 2020, he
   added a separate set of markers, 3-6-13-18, about the risks of artificial intelligence for the
   development, imagination and mental health of children and teenagers") matches the balises page's
   opening word for word, but on its own it leaves out the marker that applies to Kheelu. The before-Gate-B
   part of M1 asks what the markers say for ages 3 to 7. The answer is the two markers above.
2. **The year 2020 rests on the association alone.** The AI page went online on 14 July 2026 and cites 2025
   products and the 2024 AI Act. The Internet Archive's 8 June 2026 capture of the balises page does not
   mention 3-6-13-18, and the archive holds no capture of the AI page's URL. sergetisseron.com has no
   result for "3-6-13-18", and two web searches found no 2020 record. "In 2020, he added" is what the
   source says, so it may stand with marker ¹. Do not imply the current wording dates from 2020, or that
   the "connected toys" marker was written before talking plush toys came to market.
3. **Scope wording.** The page calls them "repères ... pour les chatbots", but its title, opening line and
   second marker cover connected plush toys and digital companions too. "For artificial intelligence"
   matches the balises page ("risques de l’intelligence artificielle").
4. **A framework, not research.** The same rule as for the 2008 markers (C34): no study is cited for the
   markers. The page quotes the EU AI Act (Annex III, point 1). That quote was not checked against the
   Act, so the site must not repeat it from this page.
5. **The 3 marker has changed.** In the 2008 markers it was "Pas d’écran avant trois ans" (no screen before
   three); in the AI markers it is "Pas d’outil numérique avant 3 ans" (no digital tool before 3). Keep
   the two apart.
6. The existing C34 rules still apply: never "French", never "revised" (the 2010s restatement was "sans rien
   changer au fonds"), never "four doorways".

### 1b. "De 3 à 6 ans": the daily minutes · SUPPORTED

**Read:** "Les balises 3-6-9-12+", https://www.3-6-9-12.org/les-balises-3-6-9-12/, live (the host resolved
today), plain GET, HTTP 200, 2026-10-14. Metadata: modified 14 July 2026. The passage is still on the page,
word for word the same as the 8 June 2026 capture
(`raw/qa/2026-10-14/cmo/articles-5.17/tisseron-balises-wayback-20260608053003.txt`, line 16):

> "De 3 à 6 ans : limitons les écrans, partageons-les, parlons en famille"
>
> "A cet âge, l’enfant renforce ses acquisitions et commence son apprentissage de l’autorégulation. Les
> limites imposées au temps d’écran doivent en faire partie : de une demi heure à 3 ans à 1 heure maximum par
> jour à 6 ans. L’écran est un temps de partage avec un parent."

(Translation: "From 3 to 6: let's limit screens, share them, talk as a family." "At this age, the child
strengthens what they have learned and begins learning self-regulation. Limits on screen time should be
part of this: from half an hour at 3 to 1 hour a day at most at 6. Screen time is time shared with a
parent.")

**Ready-to-use line** (fold 5 of the 3-6-9-12 article). The existing C34 ready line's last sentence ("For
ages 3 to 6, Tisseron's own markers suggest from half an hour a day at 3 to an hour at most at 6") is
supported as written. This version adds the source's next sentence:

> For ages 3 to 6, his markers set a daily limit that rises from half an hour at 3 to an hour at most at 6,
> and treat screen time as time shared with a parent.¹

¹ Serge Tisseron, association 3-6-9-12, "Les balises 3-6-9-12+" (in French), undated page, section "De 3 à 6 ans". https://www.3-6-9-12.org/les-balises-3-6-9-12/

**Caveats.**
1. "par jour" (a day) is written after the hour at 6. The sentence gives one range, so "half an hour a day
   at 3" is the natural reading. "maximum" applies to the hour at 6.
2. The source says "doivent" (should, must); "suggest" in the old ready line is softer but not wrong for a
   framework. It is stricter than the medical bodies' ceiling of one hour from two until five (C31 to C33;
   CMO 5.17 M2), so do not merge the two into one number.
3. The copy page currently says "For the number of minutes, turn to the medical bodies"
   ([story-screen-time-rules-parents-swear-by](../site/pages/story-screen-time-rules-parents-swear-by.md),
   line 141). Its note on what was left out (lines 297-298) is now out of date. Both are for the Copywriter.
4. The same section also says: never a screen in the bedroom; screens in a shared room; avoid them in the
   evening, at the table or to calm the child; set a daily time slot. All are quoted in the
   [excerpt](../raw/research/sources/C34-tisseron-3-6-ages-minutes-2026-10-14.md) if the article wants them.

## 2. A sentence milestone: CDC, milestones by 4 years (C42) · SUPPORTED as a 4-year item only

**Read:** https://www.cdc.gov/act-early/milestones/4-years.html, "Updated: May 16, 2026", "Reviewed: May 16,
2026". The live page was read through WebFetch, because a plain GET returns 403. The plain read is the
Internet Archive raw capture of 9 September 2026, whose `cdc:last_updated` is May 16, 2026. Both read
2026-10-14 and agree word for word.

Language/Communication Milestones, all four:

> "Says sentences with four or more words"
> "Says some words from a song, story, or nursery rhyme"
> "Talks about at least one thing that happened during her day, like “I played soccer.”"
> "Answers simple questions like “What is a coat for?” or “What is a crayon for?”"

**Zubler et al. (2022), Table 4** (PMC9680195, read 2026-10-14):

> "Says sentences with ≥4 words e | 4 y | New | — | ASQ-3 | ASHA (11)"

Footnote e: "SME agreement that additional research would be beneficial." "—": "Empty cells indicate that
type/category of data was not available to support inclusion of that milestone." It is one of the "22
(13.8%) of the final milestones" the experts marked "candidates for additional research".

**At 3 years the CDC has no sentence milestone.** Its five language items are conversation of at least two
back-and-forth exchanges, who/what/where/why questions, naming the action in a picture, first name, and
being understood by others most of the time. "Sentences" appears only in a tip: "speaking to him in longer
sentences than his, using real words" (3-year page, capture of 5 October 2026). ASHA's current public pages
give no sentence-length item either. "Communication Milestones: 2 to 3 Years" has "Uses word combinations
often but may occasionally repeat some words or phrases"; "3 to 4 Years" has no item on sentence length
(both read 2026-10-14, plain GET, HTTP 200).

**Ready-to-use lines** for "3-year-old not talking in sentences?"
([copy page](../site/pages/story-talking-late-or-talking-little.md)), with the D025 disclaimer the page
already carries:

Answer, one clause (the CMO's M2; keep the answer at 60 words or fewer):

> Sentences of four or more words are on the CDC's list of milestones by 4, not 3.¹

Fold 6, one bullet in "Talk to your child's doctor if:":

> - by 4, your child doesn't yet say sentences of four or more words;¹

¹ US Centers for Disease Control and Prevention, "Learn the Signs. Act Early.": milestones by 4 years, 2026 (reviewed 16 May), Language/Communication. https://www.cdc.gov/act-early/milestones/4-years.html

(The page's existing note for Zubler 2022, Table 1 and Table 4, also covers the item, as a second marker if
wanted.)

**Caveats.**
1. **NOT SUPPORTED:** any line that a 3-year-old "should" talk in sentences, or that most 3-year-olds do. No
   source read gives a sentence milestone at 3. That is also the honest, calming answer to the page's
   question.
2. **Weaker evidence than the other C42 items.** There is no normative data, only one screening tool and
   one clinical-opinion source (ASHA), and the experts flagged it for more research. Use it as a checklist
   item ("is on the list of milestones by 4"). Do not attach a figure to it ("3 in 4 four-year-olds ..."). The
   page's general "at least 3 in 4" line (Zubler Table 1) can stay, because it describes the checklists as
   a whole.
3. US milestones, and a reason to ask, not a diagnosis (C42 caveat 2). Never on Home (D025).
4. The CDC tips are usable with a marker if the Copywriter wants a "what helps" line. The 4-year page says
   "Spend time speaking to your child in complete sentences, using "grown-up" words." The 3-year tip is
   quoted above. Both are in the [CDC excerpt](../raw/research/sources/C42-cdc-milestones-4-years.md).

## 3. The CDC 30-month items against Zubler 2022 Table 4 (C42) · SUPPORTED

**Read:** the CDC 30-month page, "Updated: May 16, 2026", "Reviewed: May 16, 2026" (live through WebFetch,
plus a plain read of the archive capture of 2 October 2026), and Zubler 2022 Table 4 (PMC XML), all
2026-10-14.

| Item | CDC 30 months (exact) | Zubler 2022, Table 4 (exact) | Evidence in the table |
|---|---|---|---|
| 50 words | "Says about 50 words" | "Says ~50 words \| 30 mo \| New" | Normative data: Accardo and Capute, Lancaster et al, Tamis-Lemonda et al; ASQ-3; five clinical-opinion sources |
| Two words with an action word | "Says two or more words together, with one action word, like “Doggie run”" | "Says ≥2 words, with 1 action word, like “Doggie run.” \| 30 mo \| New" | Normative data: Accardo and Capute, Ertem et al, Lancaster et al, Tamis-Lemonda et al; ASQ-3, Bayley III; five clinical-opinion sources; no footnote e |

Same items. The only difference is the CDC's added "together". The plain two-word item ("Says at least 2
words together, like “More milk.”") is a 24-month milestone in both.

**Ready-to-use lines.** The copy page's lines stand as written: the answer's "Most children put two or more
words together, like "Doggie run", before they turn 3.¹ ²" and the fold 6 bullet "at 3, your child doesn't
yet put two or more words together, with one action word, like "Doggie run";¹". Both rest on a 30-month
milestone, so "before they turn 3" and "at 3" are on the safe side. To quote the item exactly in the answer,
add "with one action word". Notes ¹ (CDC 30 months) and ² (Zubler, Table 1 and Table 4) are unchanged and
now both verified for this item.

**Caveats.**
1. The copy page's note that the two-word item "was not cross-checked against Zubler's table"
   (lines 276-279) is now out of date. CMO 5.18 M4 also asks to add this article to the
   [source verification §7](source-verification.md#7-before-any-line-is-published) re-read list for the CDC
   pages; that list belongs to the main session.
2. cdc.gov still refuses scripted requests (403). Re-read through a browser before publishing, as §7 says.

## For the main session (not done here)

- Link this page from [source verification](source-verification.md) C34 and C42, and from §5.5 if wanted:
  C34's ready-line note ⁵ now has an excerpt file, and the C42 two-word item is cross-checked. The
  18-month note (C42 ³) still has no CDC excerpt of its own; it was not in scope today.
- Put the positioning question in 1a to the founder before the 3-6-9-12 article goes to Gate B.
