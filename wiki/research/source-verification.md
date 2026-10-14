---
title: Source verification (public statistics and research claims, D026)
type: research
updated: 2026-10-14
sources:
  - ../decisions/D026-public-statistics.md
  - ../decisions/D013-internal-vs-external-content.md
  - ../decisions/D016-brain-wording.md
  - ../decisions/D025-speech-and-language.md
  - "../raw/positioning/Kheelona Positioning Strategy.docx (SKM strategy, cited as docx L<line>) and ../raw/positioning/Kheelona Positioning (1).pdf (SKM deck, cited as pdf p.<page>)"
  - "../raw/research/sources/ (95 excerpt files, C01 to C45, written by the verifiers on 2026-10-10 and checked quote by quote by the re-check)"
  - "Workflow run wf_dc801a61-c52, 2026-10-10 local (2026-10-11 UTC): one extraction agent, seven family verifiers, seven adversarial re-checks. Working copies of every fetched source are in the session scratchpad (sources/<family>/ and sources/recheck-*/), not in the repo"
  - "Copywriter spot-checks, 2026-10-10: key quotes for C01, C03, C05, C06, C14, C16, C31, C32, C36, C38, C40, C42 and C43 re-found in the re-check's saved copies of the primary sources"
  - ../product/claims.md
  - ../product/age-band-review.md
  - ../site/content-boundary.md
  - "design-system/project/components/index.d.ts, components/bundle.css, tokens.css, tokens.json, 08-accessibility.md (DS v11, read-only); ../design-system/component-map.md; src/components/molecules/FootnotesRow.tsx (pre-reset code)"
---

# Source verification

The founder's rule ([D026](../decisions/D026-public-statistics.md)): a public statistic from SKM's
positioning may go on the site only after an **independent check against its ORIGINAL public source**,
a second proof on top of SKM's, and every figure carries a **marker linking to its source**. SKM's
internal survey figures never go on the site ([D013](../decisions/D013-internal-vs-external-content.md)).
This page is that check. It is INTERNAL: the Copywriter, the CMO Reviewer and QA work from it; only the
lines in [section 4](#4-ready-to-use-website-lines) are meant for the site, and each still needs the
founder's sign-off at Gate A ([D015](../decisions/D015-founder-signs-off-copy.md)).

## 1. Method

1. **The rule.** [D026](../decisions/D026-public-statistics.md): check every figure against the
   original public source, never against SKM's summary or a secondary article such as a news site;
   if the source does not say exactly that, reword the figure to what it says, or drop it. Public only.
   Pair each figure with what a parent can do, so the page informs rather than alarms.
2. **Extraction.** One agent read both SKM documents (the strategy docx and the deck PDF) and listed
   every public, checkable claim with SKM's exact wording, the source SKM gave (or that it gave none)
   and every place the claim already sits in the wiki and on today's site. That gave **30 claims from
   SKM (C01 to C30)**. A further **15 claims (C31 to C45) are not in SKM**: they are statistics and
   research lines already live in the journal or drafted in the wiki, in the same source families,
   checked here so the new site does not carry them over unverified.
3. **One independent verifier per source family** (seven families: NEP and Indian frameworks, screen
   time, conversation research, AI and children's questions, AI risk and advice, language and
   bilingualism, other). Rules: plain GET only, no logins; record the URL and fetch date of everything
   read; quote the source's exact words; for paywalled work try the publisher's abstract, PubMed or PMC,
   the authors' own copy or an official PDF, and say exactly what could be read. Each verifier saved its
   exact passages as an excerpt file in [../raw/research/sources/](../raw/research/sources/C01-nep-2020-para-1-1.md)
   (95 files) and its working copies in the session scratchpad.
4. **An adversarial re-check of every usable claim.** Every claim the first verifier rated SUPPORTED
   or SUPPORTED-WITH-REWORDING (39 of 45) went to a second agent who re-fetched the sources
   independently, tried to refute the verdict, and checked every excerpt file quote by quote against
   its own fetch. Claims the first pass already rejected (C04, C13, C15, C28, C41, C45) were not
   re-checked, because a re-check can only make a verdict stricter.
5. **The stricter verdict wins.** Where the two passes disagreed, the stricter verdict stands. That
   happened twice: **C12** and **C32** were SUPPORTED on the first pass and SUPPORTED-WITH-REWORDING on
   the re-check. Where both passes agreed on the verdict but the re-check tightened the wording, the
   re-check's wording is used. No verdict was loosened.
6. **A third look by the Copywriter.** Before writing the site lines, the key quotes behind them were
   re-found in the re-check's saved copies of the primary sources (list in the front matter). One
   wording was made stricter than both agents' (C09, see its line).

**Verdict scale.** SUPPORTED: the source says it, as worded. SUPPORTED-WITH-REWORDING: the source
supports a narrower or differently worded claim, and **only the supportable wording may be used, never
SKM's**. NOT-SUPPORTED: no public source read says it. MISATTRIBUTED: the source cited does not say it,
but another does. COULD-NOT-VERIFY: the primary source could not be read, or the claim is about
something that does not exist yet.

**Dates.** Every source was fetched on 2026-10-10 local time (Pacific); some records also give the
UTC time, which is 2026-10-11. "Fetched" in the tables means that day unless it says otherwise.

## 2. Results

| Final verdict | Count | Claims |
|---|---|---|
| SUPPORTED | 1 | C36 |
| SUPPORTED-WITH-REWORDING | 38 | C01, C02, C03, C05 to C12, C14, C16 to C27, C29 to C35, C37 to C40, C42 to C44 |
| NOT-SUPPORTED | 4 | C15, C28, C41, C45 |
| MISATTRIBUTED | 0 | none as a final verdict; nine misattributions sit inside supported claims ([section 5](#5-do-not-use)) |
| COULD-NOT-VERIFY | 2 | C04, C13 |
| **Total** | **45** | |

What it means for the site:

- **Not one of SKM's 30 claims survives in SKM's own words.** 26 are supportable only when reworded;
  4 are not usable at all. The only claim supported exactly as written (C36, Fairplay) is not SKM's.
- **SKM leaned on secondary sources, and every claim built on one had to be narrowed against the
  original**: EducationWorld (NEP), Pune Pulse (the screen-time figure, dated seven months after the paper), the LENA vendor
  blog (Romeo), the Cooney Center essay (Xu), KQED (Common Sense Media), the Toy Association (the
  California law), Wikipedia (midbrain activation) and a retailer's buying guide.
- **26 claims can go on the site** with the lines in [section 4](#4-ready-to-use-website-lines): 13
  from SKM (C01, C02, C03, C05 to C11, C14, C16, C20) and 13 from the live journal and wiki drafts (C31 to
  C40, C42 to C44). Two of them wait on a decision: C16 (G5) and C37 (on hold, see its line).
- **13 supported claims stay INTERNAL** (C12, C17, C18, C19, C21 to C27, C29, C30): future modules,
  legal context, market and competitor material ([D013](../decisions/D013-internal-vs-external-content.md)).

## 3. Every claim

Columns: SKM's wording (shortened, with its location), the source SKM gave, the final verdict (first
pass / re-check), the primary source read, a short exact quote, the supportable wording, caveats
(including lines on today's site and in wiki drafts that fail), and the excerpt files. Quotes that
contain a dash in the original are shortened with [...] so this page carries none.

### 3.1 NEP 2020 and Indian frameworks

| ID | SKM's wording | SKM's source | Final verdict | Primary source | Exact quote | Supportable wording | Caveats | Excerpts |
|---|---|---|---|---|---|---|---|---|
| C01 | "over 85% of a child's brain develops by age 6" (docx L67); "over 85% of brain development happens by age 6" (docx L330, pdf p.11) | EducationWorld, a secondary news site (docx rId3); pdf: none | **SUPPORTED-WITH-REWORDING** (S-W-R / S-W-R). Site: EXTERNAL | Ministry of Human Resource Development (now Ministry of Education), Government of India, *National Education Policy 2020*, 2020, chapter 1, para 1.1, printed p.7. https://ncert.nic.in/pdf/nep/NEP_2020.pdf (NCERT copy; the Ministry's own PDFs answered 404). Fetched 2026-10-10, re-fetched the same night, SHA-256 matched | "Over 85% of a child's cumulative brain development occurs prior to the age of 6" | NEP 2020 says "over 85% of a child's cumulative brain development occurs prior to the age of 6". Always attributed to NEP | (1) NEP cites no source for 85% and has no reference list; NCF-FS 2022 (s.1.1.1) and NIPUN Bharat repeat it, also uncited: repetition, not proof. No scientific original was found (the Harvard pages give no 85%). So never "research shows". (2) Keep "cumulative" and "prior to"; "85% of a child's brain develops by 6" misstates it. (3) "Schools and preschools now repeat this to parents" has no source: drop it. (4) [D016](../decisions/D016-brain-wording.md): never in a sentence about Kheelu. (5) Wiki drafts with SKM's wording, to rewrite before reuse: brand/positioning.md:96-97, brand/messaging.md:269, brand/audience.md:163 | [C01](../raw/research/sources/C01-nep-2020-para-1-1.md) |
| C02 | "sets the foundational years at 3 to 8" (docx L67, L40) | Same EducationWorld link | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | NEP 2020 (as C01), chapter 4, para 4.1, printed p.11; corroborated by National Steering Committee for National Curriculum Frameworks, *National Curriculum Framework for Foundational Stage 2022*, s.1.1.2 d, p.16, https://ncert.nic.in/pdf/NCF_for_Foundational_Stage_20_October_2022.pdf. Fetched 2026-10-10 | "Foundational Stage (in two parts, that is, 3 years of Anganwadi/pre-school + 2 years in primary school in Grades 1-2; both together covering ages 3-8)" | NEP 2020 treats ages 3 to 8 as the Foundational Stage of school education: three years of Anganwadi or pre-school, then Grades 1 and 2 | (1) A stage of the school structure, not a statement about brain years; never place it after the 85% line as if one supports the other. (2) "Foundational years" is SKM's paraphrase. (3) Context for the 3+ band only, never an endorsement. (4) research/keyword-map.md (about L539): capitalise "Foundational Stage" and add "of school education" | [C02 NEP](../raw/research/sources/C02-nep-2020-para-4-1.md), [C02 NCF-FS](../raw/research/sources/C02-ncf-fs-2022-foundational-stage.md) |
| C03 | "The four skills map onto what NEP 2020 asks the early years to build (cognitive development, early language, communication)" (docx L93; L242) | None at those lines | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | NEP 2020 (as C01), chapter 1, para 1.2 (last sentence) and 1.6, printed p.7. Fetched 2026-10-10 | "The overall aim of ECCE will be to attain optimal outcomes in the domains of: [...] cognitive development, [...] and the development of communication and early language, literacy, and numeracy." | NEP 2020 names cognitive development, and communication and early language, among the outcomes early childhood care and education should aim for | (1) Three of five domains, as aims for Anganwadis, pre-schools and Grades 1 and 2, not for home products. (2) NEP never mentions toys or devices: "maps onto NEP", "NEP-aligned" and "what NEP asks the early years to build" are banned. (3) Any line on what Kheelu builds needs F8/F9 sign-off and D016 | [C03](../raw/research/sources/C03-nep-2020-para-1-2.md) |
| C04 | "Each activity tied to NCF Foundational Stage (2022) and NIPUN Bharat goals [...] Claim: 'Aligned with NCF goals'" (pdf p.14); tables at 6 to 7 (pdf p.16) | None | **COULD-NOT-VERIFY** (first pass only). Site: INTERNAL | *NCF for Foundational Stage 2022*, Foreword p.5 and C-8.7 p.61; NIPUN Bharat summary, Press Information Bureau, 2021, PDF pp.7 and 11, https://static.pib.gov.in/WriteReadData/specificdocs/documents/2021/jul/doc20217531.pdf (full guidelines: 404). Fetched 2026-10-10 | "This is the first ever integrated Curriculum Framework for children between ages 3-8 in India." | None for the site | The claim is about activities that do not exist yet and an advisor sign-off that has not happened. Tables at 6 to 7 run ahead of both documents (NCF-FS ends at "multiplication as repeated addition"; NIPUN puts simple multiplication at Grade 3, about age 8) | [C04 NCF-FS](../raw/research/sources/C04-ncf-fs-2022.md), [C04 NIPUN](../raw/research/sources/C04-nipun-bharat-2021.md) |
| C05 | "These early years are when a child's brain grows fastest" (docx L276). Live: stories.ts:66 "builds connections faster than it ever will again"; stories.ts:52, Journal.tsx:15, page.tsx:277-278 "grows fastest" | None | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Center on the Developing Child at Harvard University, "Brain Architecture" (Key Concepts; metadata 2024-10-08, modified 2026-03-19), Fast Facts, https://developingchild.harvard.edu/key-concept/brain-architecture/; the same page archived 2020-01-03 (estimate note), https://web.archive.org/web/20200103123651id_/https://developingchild.harvard.edu/science/key-concepts/brain-architecture/; NCF-FS 2022, s.1.1.3, p.17. Fetched 2026-10-10 | "More than 1 million new neural connections are formed every second in the first few years of life." / "The early years are the most active period for establishing neural connections" / NCF-FS: "brain development is most rapid in the first eight years of a child's life" | The early years are the most active time for building connections in the brain; Harvard's Center estimates more than a million new ones a second in the first few years. Or: NCF-FS says brain development is most rapid in the first eight years | (1) The million is an estimate by the Center's own 2020 note ("All of these numbers are estimates"; it replaced 700 to 1,000): always attribute it and call it an estimate. (2) "Grows fastest" becomes "builds connections fastest". (3) Neither source puts the peak at 2 to 5 or 3 to 6: never present Kheelu's 3+ band as the peak. (4) The live slug `why-three-to-six-are-the-years-that-matter-most` claims what no source says; changing it needs a 308 and is the founder's call. (5) D016 | [Brain Architecture](../raw/research/sources/C05-harvard-brain-architecture.md), [InBrief](../raw/research/sources/C05-harvard-inbrief-science-of-ecd.md), [NCF-FS](../raw/research/sources/C05-ncf-fs-2022-brain-development.md) |

### 3.2 Screen time

| ID | SKM's wording | SKM's source | Final verdict | Primary source | Exact quote | Supportable wording | Caveats | Excerpts |
|---|---|---|---|---|---|---|---|---|
| C06 | "Indian children under 5 average about 2.2 hours of screen time a day, roughly double the guideline (AIIMS Raipur meta-analysis via Pune Pulse, Jan 2026)" (docx L69) | Pune Pulse, a secondary news site, 2 Jan 2026 (docx rId4); no link to the paper | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Khobragade A W and Shenoy M S (AIIMS Raipur), "Screen Time Among Under-Five Children in India: A Systematic Review and Meta-Analysis", *Cureus* 17(6):e85458, 6 June 2025, DOI 10.7759/cureus.85458; Abstract, Results, Table 1, Limitations. https://pmc.ncbi.nlm.nih.gov/articles/PMC12229826/. Fetched 2026-10-10 (both passes) | "The pooled daily screen time among under-five children was 2.22 hours (95% CI: 1.80-2.63)" / "Under-five children in India are exposed to more screen time each day than is advised." | Across 10 studies from India covering 2,857 children under five, children averaged about 2.2 hours of screen time a day, more than the guidelines advise | (1) Misdated and secondary in SKM: the paper is June 2025; cite its DOI, never Pune Pulse. (2) Never "double": the paper does not say it, and a pooled mean for ages 0 to 5 against age-specific limits is not like for like. (3) "Studies from India", not "Indian children average": 10 cross-sectional studies (2019 to 2023) from a few states, I-squared 100%; keep "about". (4) Sample includes under-2s and under-3s: not a figure for 3-year-olds. (5) Under-2 subgroup (1.23 h) is 2 studies, 292 children. (6) Pune Pulse's "60 to 70 per cent" is not in the paper. (7) "Parents want a better use of that time" has no public source. (8) Cite the IAP itself for limits, never this paper's paraphrase of it | [C06](../raw/research/sources/C06-khobragade-shenoy-2025-cureus-under-five-screen-time.md) |
| C31 | Not in SKM (its "double the guideline" implies one). Live: stories-expansion.ts:26 "The WHO guideline from 2019 is the one most others lean on..."; :359; ai-toys page.tsx:127 | Live cites NCBI Bookshelf NBK541169 | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | World Health Organization, *Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age*, 2019, ISBN 9789241550536, Recommendations: sedentary time, printed p.8. https://iris.who.int/handle/10665/311664 (WHO's own PDF; NBK541169 served a reCAPTCHA and was not read). Fetched 2026-10-10 | "For those aged 2 years, sedentary screen time should be no more than 1 hour; less is better." Children 3-4: "Sedentary screen time should be no more than 1 hour; less is better." Graded "Strong recommendations, very low quality evidence" | Under one, screen time is not recommended; at one, sedentary screen time is not recommended; at two, and at three and four, no more than one hour a day, and less is better | (1) The limit is for sedentary (passive) screen time. (2) "The one most others lean on" is not in the document: drop it. (3) The WHO grades the evidence very low, so the FAQ's "the research on screen time at this age is consistent enough" (ai-toys page.tsx:127) overstates. (4) WHO stops at age 4: any "from two" line ends "until five". (5) WHO says nothing about video calls. (6) Locator error in the excerpt file, see [5.5](#55-corrections-to-excerpt-files) | [C31](../raw/research/sources/C31-who-2019-guidelines-under-5.md) |
| C32 | Not in SKM. Live: stories-expansion.ts:26 "The Indian Academy of Pediatrics wrote its own guidance in 2022, for Indian homes..." | Live cites the journal PDF and PubMed | **S-W-R** (SUPPORTED / S-W-R; stricter wins). Site: EXTERNAL | Gupta P, Shah D et al. for the IAP Guideline Committee, "Indian Academy of Pediatrics Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents", *Indian Pediatrics* 59(3):235-244, March 2022 (online 29 Dec 2021); p.235 abstract, p.239 items 1 to 3. https://www.indianpediatrics.net/mar2022/235.pdf. Fetched 2026-10-10 | "children below 2 years age should not be exposed to any type of screen, whereas exposure should be limited to a maximum of one hour of supervised screen time per day for children 24-59 months age, and less than two hours per day for children 5-10 years age." | Published in 2022, for Indian children and families: no screens below two, at most one hour of supervised screen time a day from two to five, under two hours a day from five to ten | (1) "Wrote ... in 2022" is inaccurate (meeting March 2021, online December 2021): say "published". (2) "For Indian homes" becomes "for Indian children and families". (3) Under two it allows "minimal and occasional" video calls with distant close family. (4) The 5 to 10 band counts homework screen time. (5) Sessions "not more than 20-30 min", always supervised. (6) keyword-map ST2 cites the IAP for "no fixed number from 6": wrong, the IAP sets one | [C32](../raw/research/sources/C32-iap-2022-screen-time-digital-wellness.md) |
| C33 | Not in SKM. Live: stories-expansion.ts:26 "about an hour a day of high-quality programmes"; :238 "a young child learns from media mostly when an adult talks about it"; :326; keyword-map "from 6, consistent limits" | Live cites publications.aap.org | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | AAP Council on Communications and Media, "Media and Young Minds", *Pediatrics* 138(5):e20162591, November 2016, DOI 10.1542/peds.2016-2591, Recommendations: Families. Ages 5 to 18: "Media Use in School-Aged Children and Adolescents", e20162592, and the AAP news release of 21 October 2016. The live AAP site answered 403; read from the publisher's full text archived 2020-01-02, https://web.archive.org/web/20200102063046/https://pediatrics.aappublications.org/content/138/5/e20162591. Fetched 2026-10-10 | "For children 2 to 5 years of age, limit screen use to 1 hour per day of high-quality programming, coview with your children, help children understand what they are seeing" | No more than an hour a day of high-quality programmes for two to five, watched together; no media other than video-chatting before 18 to 24 months; for 5 to 18, consistent limits on hours and types of media, with no fixed number | (1) "About an hour" turns a ceiling into a target. (2) :238 and :326 overstate: the "chief factor ... parents watching with them and reteaching" line is about toddlers; for 3 to 5 the AAP says well-designed programmes "can improve" outcomes. (3) MISATTRIBUTED inside the claim: the 6+ advice is not in Media and Young Minds. (4) The AAP's under-2 line is 18 to 24 months: "no screens under two" overstates the AAP. (5) Exact forms: "avoid fast-paced programs", "apps with lots of distracting content", "No screens 1 hour before bedtime". (6) Link the DOI | [Young Minds](../raw/research/sources/C33-aap-2016-media-and-young-minds.md), [5 to 18](../raw/research/sources/C33-aap-2016-school-aged-media-use.md), [release](../raw/research/sources/C33-aap-2016-news-release.md) |
| C34 | Not in SKM. Live: stories-expansion.ts:356 "proposed by the French psychiatrist Serge Tisseron in 2008: no screens before 3, no personal games console before 6 [...]. It is a framework, not a finding." | Live cites https://www.3-6-9-12.org/ | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Serge Tisseron, association 3-6-9-12, "Les balises 3-6-9-12+" (in French), sections "Les repères 3-6-9-12 en 2008" and "De 3 à 6 ans"; home and "Qui sommes-nous ?" pages. https://www.3-6-9-12.org/les-balises-3-6-9-12/. Fetched 2026-10-10 | "Pas d'écran avant trois ans. Pas d'outil numérique personnel avant six ans [...]. Pas d'Internet accompagné avant neuf ans [...]. Pas d'Internet seul avant 12 ans révolus." | Set out in 2008 by the psychiatrist Serge Tisseron: no screens before 3, no device or console of their own before 6, the internet with an adult from 9, alone from 12. A framework, not a study | (1) "French" is not on his pages: drop it. (2) The rule is about a personal device; a family tablet is allowed. (3) NOT SUPPORTED: :356/:358 "the one the strongest research agrees with", "the part the medical bodies agree with" (the bodies allow up to an hour from two, so "none before 3" is stricter). (4) COULD NOT VERIFY: :358 "four doorways: nursery, school, reading, secondary school". (5) NOT SUPPORTED: "He has since revised the later doorways" (restated positively "sans rien changer au fonds"; separate 3-6-13-18 markers for AI, 2020). (6) His 3 to 6 marker: half an hour a day at 3 to one hour at most at 6 | [C34](../raw/research/sources/C34-tisseron-3-6-9-12-balises.md) |
| C35 | Not in SKM. Live: stories-expansion.ts:59 "The tantrum after the screen is so common it has its own research literature." | None | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Hiniker A, Suh H, Cao S, Kientz J A (University of Washington), "Screen Time Tantrums: How Families Manage Screen Media Experiences for Toddlers and Preschoolers", *CHI 2016*, pp. 648-660, DOI 10.1145/2858036.2858278, ABSTRACT ONLY (ACM 403; read from https://web.archive.org/web/20210212133113/https://dl.acm.org/doi/10.1145/2858036.2858278); University of Washington News release, 5 May 2016. Fetched 2026-10-10 | "Transitioning away from screens is often painful, and predictive factors determine the pain of a transition." | Common enough that researchers have studied it: a 2016 University of Washington study of families with children aged 1 to 5 found that "transitioning away from screens is often painful" | (1) "So common it has its own research literature" overstates: a 2024 paper says "only a few studies". (2) "Most houses some evenings" is in no source. (3) The 59/19/22 per cent split is from the release, not the paper. (4) Do not use ">90% of families" (second-hand, unverified). (5) UW found two-minute warnings made children more upset: keyword-map ST3's "warn before the screen goes off" runs against it. (6) Routines and natural stopping points helped | [C35 paper and release](../raw/research/sources/C35-hiniker-2016-screen-time-tantrums.md), [C35 2024](../raw/research/sources/C35-gavrilova-veraksa-2024-screen-time-tantrums.md) |

### 3.3 Conversation research

| ID | SKM's wording | SKM's source | Final verdict | Primary source | Exact quote | Supportable wording | Caveats | Excerpts |
|---|---|---|---|---|---|---|---|---|
| C07 | "'serve and return' exchanges build and strengthen neural connections, and support early language and later higher-level thinking" (docx L99-102); "Harvard research shows back-and-forth conversation helps build young children's brains" (docx L333); "Back-and-forth conversation builds young brains" (pdf p.5) | Harvard Center on the Developing Child (primary); SKM's URL answers 301 to the canonical page | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts; undated, metadata 2024-10-08, modified 2026-04-01), Key Takeaways 1 and 3 and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/. Fetched 2026-10-10 (both passes) | "Serve and return interactions [...] responsive, back-and-forth exchanges between a young child and a caring adult [...] play a key role in shaping brain architecture." | The Center says serve and return exchanges between a young child and a caring adult help build and strengthen neural connections, and support the early language and social skills that later, more complex thinking builds on | (1) A summary page, not a study: "Harvard's Center ... says", never "Harvard research shows" or "Harvard-proven". (2) Every sentence is about an adult; keep "a caring adult". (3) Includes non-verbal turns; gives no age range (do not attach "3 to 7"). (4) Nothing about toys: never call Kheelu's loop serve and return (D016); the company line stays separate and unmarked. (5) "Never replaces the caring adult" is an unsourced promise. (6) Live lines that fail: page.tsx:277-279 (calls Kheelu's loop serve and return, drops the adult); stories.ts:114 ("wires language, logic, and confidence"); stories.ts:118 ("keeps serve and return going", also a banned product label); stories-expansion.ts:208 ("works in Bengali exactly as well"); :324 ("builds vocabulary, logic and confidence"). :238 is accurate | [Serve and Return](../raw/research/sources/C07-harvard-serve-and-return.md), [5 Steps](../raw/research/sources/C07-harvard-5-steps-how-to-page.md) |
| C08 | "research shows back-and-forth conversation is one of the best things for it" (docx L276). Live: stories-expansion.ts:420 "The strongest finding in early development is that brains grow through serve and return" | None | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Center on the Developing Child at Harvard University with the National Scientific Council on the Developing Child, "Serve & Return Interaction Shapes Brain Circuitry", 9 September 2011, page description. https://developingchild.harvard.edu/resources/videos/serve-return-interaction-shapes-brain-circuitry/; and *InBrief: The Science of Early Childhood Development*, 2007, p.1, point 2. Fetched 2026-10-10 | "One of the most essential experiences in shaping the architecture of the developing brain is "serve and return" interaction between children and significant adults in their lives." | Quote "one of the most essential experiences" (2011) or "a major ingredient" (2007) exactly, attributed to the Center | (1) "One of the best things" and "the strongest finding in early development" are NOT SUPPORTED: no source ranks findings. (2) About significant adults and caregivers, not conversation in general or a toy; "a person" becomes "an adult". (3) "Especially in the earliest years" points to infancy and toddlerhood, not 3 to 7. (4) The "grows fastest" opening of docx L276 is C05, a separate claim | [2011 page](../raw/research/sources/C08-harvard-serve-return-shapes-brain-circuitry.md), [InBrief](../raw/research/sources/C08-harvard-inbrief-science-of-ecd.md) |
| C09 | "In 4 to 6 year olds, the number of conversational turns, not words heard, predicted language scores and activity in Broca's area" (docx L103-106; pdf p.5; L238) | LENA blog, the recorder vendor's secondary summary (docx rId16) | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Romeo R R, Leonard J A, Robinson S T, West M R, Mackey A P, Rowe M L, Gabrieli J D E, "Beyond the 30-Million-Word Gap: Children's Conversational Exposure Is Associated With Language-Related Brain Function", *Psychological Science* 29(5):700-710, 2018, DOI 10.1177/0956797617742725; Abstract, Method, Results, Discussion. https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/. Fetched 2026-10-10 | "Only conversational turns significantly predicted additional variance in verbal scores after education and income were partialled out" | 36 children aged 4 to 6: more conversational turns with adults went with more Broca's-area activity during a story task (adult words showed no such link) and predicted language scores after income and parents' education were accounted for. A link, not cause | (1) Ages 4 years 6 months to 6 years 10 months: never a finding about three-year-olds. (2) Correlational ("causation cannot be implied"). (3) "Words heard/overheard" misdescribes the adult-word count, which includes overheard speech; adult words did correlate with language scores on their own (r = .36). (4) Typically developing native English speakers; no late talkers. (5) Cite the paper, never the LENA blog, which says more than the paper. (6) Live lines that fail: stories-expansion.ts:28 and :324 ("overheard"); :456 ("Researchers at MIT", in the three-year-old article; authors were at Harvard, MIT and Penn); :393 ("more than flashcards ... far more than any toy": no such comparison, and a D025 risk) | [Psych Sci 2018](../raw/research/sources/C09-romeo-2018-psychological-science.md), [J Neurosci 2018](../raw/research/sources/C09-romeo-2018-journal-of-neuroscience.md), [DCN 2021](../raw/research/sources/C09-romeo-2021-developmental-cognitive-neuroscience.md), [LENA](../raw/research/sources/C09-lena-blog-2018-secondary.md) |
| C45 | Not in SKM. Live: stories.ts:69 "There is a second finding hiding in the first. Children learn fastest from exchanges that feel good." | None | **NOT-SUPPORTED** (first pass only). Site: cut | Closest: National Scientific Council on the Developing Child, "Children's Emotional Development Is Built into the Architecture of Their Brains", Working Paper 2, 2004, PDF p.4, https://developingchild.harvard.edu/wp-content/uploads/2004/04/Childrens-Emotional-Development-Is-Built-into-the-Architecture-of-Their-Brains.pdf; LEGO Foundation white paper 2017. Fetched 2026-10-10 | "emotions support executive functions when they are well regulated but interfere with attention and decision-making when they are poorly controlled." | None as worded | No source says "fastest" or ranks exchanges that "feel good". The LEGO Foundation paper is a toy company's foundation white paper, not peer reviewed: not a footnote for a toy brand. The Working Paper alternative was not re-checked | [WP2](../raw/research/sources/C45-harvard-working-paper-2-emotional-development.md), [LEGO](../raw/research/sources/C45-lego-foundation-learning-through-play-2017.md) |

### 3.4 AI and children's questions

| ID | SKM's wording | SKM's source | Final verdict | Primary source | Exact quote | Supportable wording | Caveats | Excerpts |
|---|---|---|---|---|---|---|---|---|
| C10 | "Children who talked with an AI that asked questions during a story understood it better and learnt more words than children who only listened, in some cases as much as with a human partner" (docx L107-110; pdf p.5, p.15; L336) | Joan Ganz Cooney Center essay by Ying Xu, October 2024 (secondary; names no study) | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Xu Y, Aubele J, Vigil V, Bustamante A S, Kim Y-S, Warschauer M (University of California, Irvine), "Dialogue with a conversational agent promotes children's story comprehension via enhancing engagement", *Child Development* 93(2):e149-e167, 2022, DOI 10.1111/cdev.13708 (PMC9299009); Abstract, Results RQ1, Table 4. https://doi.org/10.1111/cdev.13708. Fetched 2026-10-10 | "a conversational agent can replicate the benefits of dialogic reading with a human partner by enhancing children's narrative-relevant vocalizations, reducing irrelevant vocalizations, and improving story comprehension." | 117 children aged 3 to 6: children whose smart speaker asked questions understood the story better than children whose speaker only read it, and about as well as children asked the same questions by an adult | (1) "Learnt more words" and "builds vocabulary" are NOT SUPPORTED: vocabulary was a baseline measure only (the claim came from the essay). (2) The comparison group is the speaker-only group (against adult-read-without-questions, p = .06). (3) MISATTRIBUTED inside the claim: UC Irvine work, not Harvard. (4) The paper names no country. (5) One scripted Google Home Mini, one book, one session, immediate test, higher-SES centres: not Kheelu | [Xu 2022](../raw/research/sources/C10-xu-2022-child-development.md), [essay](../raw/research/sources/C10-cooney-center-2024-secondary.md) |
| C11 | "children lead conversations and add their own ideas more with people than with AI" (docx L111-114; L337); "Harvard's Ying Xu found that children lead conversations more with people than with AI" (L377) | Same Cooney Center essay | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Xu Y, Wang D, Collins P, Lee H, Warschauer M, "Same benefits, different communication patterns: Comparing Children's reading with a conversational agent vs. a human partner", *Computers & Education* 161:104059, 2021, DOI 10.1016/j.compedu.2020.104059; Abstract, s.3.3, s.4.3.1, s.5.2. https://escholarship.org/content/qt7544r8x5/qt7544r8x5.pdf. Fetched 2026-10-10 | "those who read with an adult responded to questions with higher productivity, lexical diversity, and topical relevance. And the two groups responded to questions with a similar level of accuracy." | 90 children aged 3 to 6 in a US study: asked story questions by an adult, children gave longer answers with more different words than when a smart speaker asked; accuracy was similar | (1) "Lead", "steer" and "add their own ideas" were never measured; "steer" is only in Xu's 2024 essay. (2) REFUTED short form: "Children still say more to the people around them than to a machine" (the adult was a researcher reading a script). (3) The comparison uses 64 of the 90; the length gap is on harder questions only; the speaker won on intelligibility. (4) MISATTRIBUTED: docx L377, wrong finding and wrong institution. (5) D016 | [Xu 2021](../raw/research/sources/C11-xu-2021-computers-and-education.md) |
| C12 | "AI dialogue helped children learn science from TV (Xu 2024) [...] Could claim: 'Explores early science through questions'" (pdf p.16) | None | **S-W-R** (SUPPORTED / S-W-R; stricter wins). Site: INTERNAL (future module) | Xu Y, He K, Levine J, Ritchie D, Pan Z, Bustamante A, Warschauer M, "Artificial intelligence enhances children's science learning from television shows", *Journal of Educational Psychology* 116(7):1071-1092, 2024, DOI 10.1037/edu0000889. Read: the authors' manuscript (marked "under review"), pp. 2, 17, 28-30, https://par.nsf.gov/servlets/purl/10526787; version of record blocked. Fetched 2026-10-10 | "children in the interactive condition scored 0.32 standard deviations higher than those in the non-interactive condition (p < .001)" | Internal note only: at one US school, 246 children mostly aged 4 to 7 scored higher on a test about two episodes when an AI-powered character asked them questions than after the ordinary broadcast | (1) The published version was not read. (2) Ages 3.58 to 7.66, mean 6.21; one charter school, 95% Hispanic or Latine. (3) Against questions-only, p = .06 once outliers are kept. (4) TV, immediate test. (5) "Explores early science" is unsupported | [C12](../raw/research/sources/C12-xu-2024-journal-of-educational-psychology.md) |
| C13 | "Preschoolers ask about 76 information-seeking questions an hour, and the act of asking is linked to how they think" (docx L115-118; L178); "Preschoolers ask about 76 questions an hour. Kheelu turns them into more thinking." (pdf p.7) | Lazaroff and Vlach 2022 (primary for their study, secondary for the 76) | **COULD-NOT-VERIFY** (first pass only). Site: cut | Chouinard M M, "Children's questions: a mechanism for cognitive development", *Monographs of the Society for Research in Child Development* 72(1), 2007, DOI 10.1111/j.1540-5834.2007.00412.x: abstract only (Wiley 403; chapter II not readable). Lazaroff and Vlach 2022, PMC9403714. Fetched 2026-10-10 | Chouinard abstract: "Results indicate that children ask many information-seeking questions and get informative answers." (no per-hour figure) | None until Chouinard chapter II (pp. 14-44) is read | (1) Two secondaries give 76 (information-seeking), a third "over 100" (all questions). (2) The base is four children's transcripts, ages 1;2 to 5;1. (3) pdf p.7 drops "information-seeking". (4) Lazaroff and Vlach: a correlation in 83 children aged 4 to 10, mostly school age. (5) "Kheelu turns them into more thinking" is unsupported and brushes D016. (6) Live stories-expansion.ts:298 "hundreds of them a day" is unsourced | [Chouinard](../raw/research/sources/C13-chouinard-2007-abstract-only.md), [Lazaroff and Vlach](../raw/research/sources/C13-lazaroff-vlach-2022-frontiers.md), [Frazier 2009](../raw/research/sources/C13-frazier-gelman-wellman-2009-secondary.md), [Ruggeri 2016](../raw/research/sources/C13-ruggeri-2016-secondary.md) |

### 3.5 AI risk and advice

| ID | SKM's wording | SKM's source | Final verdict | Primary source | Exact quote | Supportable wording | Caveats | Excerpts |
|---|---|---|---|---|---|---|---|---|
| C14 | "In May 2026 Brookings warned of 'cognitive stunting': children letting AI do their thinking" (docx L5, L86, L119-122; pdf p.3), with "children must learn to think before they learn to prompt" | Brookings (primary publisher; a commentary) | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Rebecca Winthrop (Center for Universal Education), "Is it time to measure cognitive stunting?", Brookings Institution, commentary, 19 May 2026 (modified 10 June 2026); sections "Cognitive stunting" and "Early evidence on AI and cognitive development". https://www.brookings.edu/articles/is-it-time-to-measure-cognitive-stunting/. Fetched 2026-10-10 | "Overreliance on AI reduces children's opportunities to engage in effortful thinking, thereby stunting their cognitive development." | In a May 2026 Brookings commentary, Rebecca Winthrop described the worry as "cognitive stunting": relying too heavily on AI "reduces children's opportunities to engage in effortful thinking". She calls the evidence early | (1) One author's view ("sole views of its author(s)"): "Rebecca Winthrop of Brookings", never "Brookings warns". (2) She first made the argument at Davos in January 2026. (3) "Overreliance", not any use. (4) The prompt line is hers, attributed "as educationalists like to say". (5) Evidence is about students; nothing measured at 3 to 7. (6) She names "AI companions not designed for learning", a group a reader may put an AI toy in. (7) "Widely reported" is not on the page. (8) D016 | [C14](../raw/research/sources/C14-brookings-cognitive-stunting.md) |
| C15 | "Parents increasingly worry AI will do their child's thinking for them (Brookings, May 2026)." (docx L25) | The same Brookings commentary | **NOT-SUPPORTED** (first pass only). Site: cut | As C14; full text searched for parent, worr, concern, fear. Fetched 2026-10-10 | "No educator, parent, or pediatrician wants children to use AI in ways that undermine their cognitive development." | None | The commentary says nothing about parents' worry or a trend. If the line rests on SKM's survey, it is INTERNAL (D013) | [C15](../raw/research/sources/C15-brookings-parents-worry.md) |
| C16 | "Common Sense Media (Jan 2026) advised against AI companion toys for children 5 and under, mainly over attachment (KQED)." (docx L87); "safety groups draw a line at 5" (L40) | KQED, a secondary news site | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL IF CONFIRMED (G5) | Common Sense Media, press release, 22 January 2026, para 1, https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks; Youth AI Safety Institute, "AI Toys" risk assessment (updated 22 January 2026), "What we found", https://institute.commonsensemedia.org/risk-assessments/ai-toys; full PDF pp.3-4, 7. Fetched 2026-10-10 | "recommending that parents avoid giving AI toys [...] smart toys with voice-based interactions [...] to children age 5 and under, and exercise extreme caution before purchasing them for children age 6 to 12." | Common Sense Media advised parents not to give AI toys to children aged 5 and under, and to use extreme caution for 6 to 12; in its tests of three toys it rated 27% of replies not appropriate for kids, and raised concerns about attachment by design, data and reliability | (1) "Mainly over attachment" is NOT SUPPORTED: four findings. (2) The 27% comes from structured tests of three toys on accounts set to ages 6 to 13: never a general rate. (3) "Extreme caution" is the press release's; the page says "caution". (4) Its scope ("smart toys with voice-based interactions", designed for ages 3 to 12) covers a toy like Kheelu: G5, handle honestly. (5) KQED's "6 to 13" is wrong. (6) Only Common Sense draws a line at 5. (7) Partly funded by industry. (8) Owner: [age-band review §4](../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band) | [press release](../raw/research/sources/C16-common-sense-press-release-2026-01-22.md), [risk assessment](../raw/research/sources/C16-common-sense-ai-toys-risk-assessment.md) |
| C17 | "California banned companion-chatbot toys for under-16s from 2027 (Toy Association). A brain-development framing keeps Kheelu clear of that label." (docx L87; L132) | The Toy Association news page (industry body, secondary to the law) | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL | California SB 867 (Padilla), Chapter 189, Statutes of 2026, Business and Professions Code 22601(g) and 22604.5(a)-(b), https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB867; Cal. Const. art. IV, s.8(c)(1); SB 1119, Chapter 190. Read in a real browser tab (curl 403). Fetched 2026-10-10 | "No person shall manufacture, sell, or exchange, possess with intent to sell or exchange, or expose or offer for sale or exchange to any retailer any toy that includes a companion chatbot." | Internal: from 1 January 2027 until 1 January 2031, no one may make or sell in California a toy for children under 16 that includes a companion chatbot; SB 1119 adds operator duties for users under 18 from 1 July 2027 | (1) The start date follows from the constitution; the bill gives none. (2) "Under 18" was the May 2026 draft. (3) Temporary, California only, civil liability. (4) NOT SUPPORTED: "A brain-development framing keeps Kheelu clear": the test is functional (a system able to "sustain a relationship across multiple interactions"), not a label. Whether Kheelu is caught is for counsel | [SB 867](../raw/research/sources/C17-ca-sb-867-chaptered.md), [SB 1119](../raw/research/sources/C17-ca-sb-1119-chaptered.md), [signing](../raw/research/sources/C17-governor-signing-release-2026-09-10.md), [Toy Association](../raw/research/sources/C17-toy-association-news-secondary.md) |
| C36 | Not in SKM. Live: stories.ts:139 "In November 2025 Fairplay [...] published an advisory signed by more than 150 experts and organisations telling parents not to buy AI toys that season." | Live cites Fairplay | **SUPPORTED** (SUPPORTED / SUPPORTED). Site: EXTERNAL | Fairplay, "AI Toys Unsafe for Kids this Holiday Season, Advisory Warns", press release, 20 November 2025; the AI Toys Advisory page https://fairplayforkids.org/pf/aitoyadvisory/; advisory PDF "AI Toys are NOT Safe for Kids". Fetched 2026-10-10 | "the advisory is signed by about 80 experts and 80 organizations" | The live line as written | (1) "78 organisations and 80 experts" is the web page's count; the PDFs list a few more, so use "more than 150" or "about 80 experts and 80 organizations". (2) Framed around "this holiday season"; sets no age line, so it cannot support "safety groups draw a line at 5", and "at any age" goes beyond it | [C36](../raw/research/sources/C36-fairplay-ai-toys-advisory.md) |
| C37 | Not in SKM. Wiki draft (keyword-map L513): "General chatbots are built for adults, and the best-known ones set a minimum age of 13 or older in their own terms" | Providers' own terms | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL, HOLD (see its line) | OpenAI Terms of Use (rest of world, effective 1 January 2026), https://openai.com/policies/row-terms-of-use/; Microsoft Copilot Terms of Use (effective 18 August 2026); Anthropic Consumer Terms (effective 8 October 2025); Google Terms of Service (effective 30 July 2026); Gemini Apps Help 16109150. Fetched 2026-10-10 (OpenAI in a real browser tab; curl 403) | OpenAI: "You must be at least 13 years old or the minimum age required in your country to consent to use the Services." | General chatbots set their own age rules: ChatGPT and Copilot at least 13 (older in some countries), Claude 18; Gemini allows a child under 13 only through a supervised account a parent turns on | (1) "Built for adults" and "the best-known set 13 or older" are false (Gemini); "most" is unsupported. (2) Meta AI not read: do not name it. (3) Terms change: keep effective dates, re-read before publishing. (4) Gemini supervised access in India is not confirmed. (5) Kheelu itself uses outside AI providers ([D019](../decisions/D019-voice-providers.md)), so this line invites the question of their terms | [OpenAI](../raw/research/sources/C37-openai-terms-of-use.md), [Microsoft](../raw/research/sources/C37-microsoft-copilot-terms.md), [Anthropic](../raw/research/sources/C37-anthropic-consumer-terms.md), [Google](../raw/research/sources/C37-google-terms-age-requirements.md), [Gemini](../raw/research/sources/C37-google-gemini-under-13.md) |

### 3.6 Language and bilingualism

| ID | SKM's wording | SKM's source | Final verdict | Primary source | Exact quote | Supportable wording | Caveats | Excerpts |
|---|---|---|---|---|---|---|---|---|
| C28 | "Kheelu asks questions in our language, so your grandchild thinks in it too." (docx L288); "in English and the family's own language" (L7, L241) | None | **NOT-SUPPORTED** (first pass only). Site: cut | No source says it. Closest: Byers-Heinlein and Lew-Williams 2013, s.3 (as C38), https://pmc.ncbi.nlm.nih.gov/articles/PMC6168212/. Fetched 2026-10-10 | "learn more words and grammar in that language" | None for "thinks in it" | (1) A claim about how a child thinks, and an outcome for Kheelu (D016, D025). (2) The research is about people, not a toy. (3) The verifier's substitute line ("children who hear more of a language learn more of its words") was NOT re-checked: re-check before use. (4) L7 and L241 are product facts: name Kheelu's eight languages, or say "if it is one of Kheelu's eight" | [C28](../raw/research/sources/C28-byers-heinlein-2013-language-exposure.md) |
| C38 | Not in SKM. Live: stories-expansion.ts:204-205 (a 2013 review; "Add the two lists together and the total matches"; two-year-olds adjust) | Live cites PMC6168212 | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Byers-Heinlein K (Concordia) and Lew-Williams C (Northwestern), "Bilingualism in the Early Years: What the Science Says", *LEARNing Landscapes* 7(1):95-112, 2013, DOI 10.36510/learnland.v7i1.632, pp. 97 and 104; AAP and ASHA, "Young Children Learning Multiple Languages: Parent FAQs", HealthyChildren.org, updated 20 November 2025. Fetched 2026-10-10 | "Bilingual children are not more likely than monolingual children to have difficulties with language, to show delays in learning, or to be diagnosed with a language disorder" | As quoted; counting each idea once across languages, bilingual children know about the same number of words; even bilingual two-year-olds show some ability to match their language to the listener; usually by 3 they can separate their languages (AAP and ASHA) | (1) "Two developmental psychologists" is wrong: "researchers who study bilingual infants and children". (2) "Add the two lists together and the total matches" contradicts the review's method (translation pairs counted once). (3) "It fades as each language fills out" and "Correcting it teaches a child that one of their languages is wrong" are in no source. (4) The vocabulary evidence is US toddlers under about 30 months: no numbers for 3 to 6 or for Indian homes. (5) Do not mix the review's and AAP/ASHA's counting methods in one line. (6) D025 | [review](../raw/research/sources/C38-byers-heinlein-lew-williams-2013.md), [AAP and ASHA](../raw/research/sources/C38-aap-asha-multiple-languages-faq.md) |
| C39 | Not in SKM. Live: stories-expansion.ts:206 "That is why India's own National Education Policy 2020 asks schools [...] to teach in the home language or mother tongue until at least Grade 5 and preferably until Grade 8 [...] children learn best in a language they already understand." | Press Information Bureau release, 2022 (government secondary) | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | NEP 2020 (as C01), chapter 4, para 4.11, printed p.13. Fetched 2026-10-10 (hash matched C01) | "Wherever possible, the medium of instruction until at least Grade 5, but preferably till Grade 8 and beyond, will be the home language/mother tongue/local language/regional language." | NEP 2020 says that wherever possible children should be taught in their home language, mother tongue, or local or regional language until at least Grade 5, preferably till Grade 8 and beyond; its stated reason: young children "learn and grasp nontrivial concepts more quickly in their home language/mother tongue" | (1) "Nontrivial concepts", not "new concepts". (2) Keep "local or regional language". (3) "It is well understood" is the policy's assertion; it cites no study. (4) A schools policy, "wherever possible", not a law; nothing about home or toys. (5) Remove "That is why" and "children learn best in a language they already understand". (6) Para 4.12's "2 and 8" is uncited: not research. (7) The marker links NEP, not the PIB release | [NEP 4.11](../raw/research/sources/C39-nep-2020-para-4-11.md), [PIB](../raw/research/sources/C39-pib-2022-education-in-mother-tongue-secondary.md) |
| C40 | Not in SKM. Live, unsourced: stories-expansion.ts:183 ("The brain does not file languages in separate purses [...] a head start on words in every language"), :394 ("Speech researchers consistently find that it does not"), :206 ("Concepts learned in the mother tongue transfer") | None | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | AAP and ASHA Parent FAQs (as C38), https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx; ASHA Practice Portal, "Late Language Emergence", Assessment: Cultural and Linguistic Considerations; Cummins J, "Bilingual Children's Mother Tongue: Why is it important for education?", *Sprogforum* 19, 2001, p.18 (archived journal PDF). Fetched 2026-10-10 | "Speech or language problems are not caused by learning multiple languages." | Learning more than one language does not cause speech or language problems; counted together, a bilingual child's words should total about the same as a child of the same age learning one; a strong model in any language helps the next; Cummins argues concepts carry over (one researcher's argument) | (1) NOT SUPPORTED: "separate purses", "a head start on words in every language" (the review says the languages "travel on independent developmental paths") and "far faster". (2) "Speech researchers consistently find" overstates (ASHA is hedged). (3) The asha.org consumer page now redirects to CHSA, ASHA's consumer affiliate: cite the AAP and ASHA FAQ. (4) Cummins writes about pupils in school; a position piece, not a study. (5) Marathi is not one of Kheelu's eight. (6) D025: keep the in-article disclaimer | [ASHA Portal](../raw/research/sources/C40-asha-late-language-emergence.md), [CHSA](../raw/research/sources/C40-chsa-asha-learning-more-than-one-language.md), [Cummins 2001](../raw/research/sources/C40-cummins-2001-sprogforum-mother-tongue.md), [Cummins 1979](../raw/research/sources/C40-cummins-1979-linguistic-interdependence.md) |
| C41 | Not in SKM. Live, unsourced: stories-expansion.ts:456 "Between three and four a child's vocabulary roughly doubles"; :180 "Between three and six the collection explodes [...] several a day" | None | **NOT-SUPPORTED** (first pass only). Site: cut | None found. Closest: Bloom P, "Précis of How Children Learn the Meanings of Words", *Behavioral and Brain Sciences* 24(6), 2001, p.1095, DOI 10.1017/S0140525X01000139 (a third-party copy of the published PDF). Fetched 2026-10-10 | "this comes to over ten new words per day" | None for either line | (1) Bloom's rate is arithmetic over roughly ages 1 to 17, not a rate for 3 to 6. (2) Consumer pages are unsourced and disagree. (3) The Bloom substitute was not re-checked and is not a 3 to 7 figure. Cut both live lines (claims.md §8 and age-band-review row 45 already flag :456) | [Bloom](../raw/research/sources/C41-bloom-2001-bbs-precis.md), [Cincinnati](../raw/research/sources/C41-cincinnati-childrens-4-5-years-secondary.md), [KidsHealth](../raw/research/sources/C41-kidshealth-2-to-3-secondary.md) |

### 3.7 Other

| ID | SKM's wording | SKM's source | Final verdict | Primary source | Exact quote | Supportable wording | Caveats | Excerpts |
|---|---|---|---|---|---|---|---|---|
| C18 | "ASCI requires claims to be substantiated, and its education guidelines bar ads that play on 'parental or student anxieties' or create fear of missing out (ASCI, Mar 2023)" (docx L23, L88; pdf p.3, p.14) | ASCI press release PDF and the ASCI Code page (primary) | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL (governs copy) | ASCI, *Codes and Guidelines* book (PDF created August 2025): Code chapter I, 1.1 and 1.2 (PDF p.18); Guidelines for Advertising of Educational Institutions, Programmes and Platforms, guideline 8 (signed 9 March 2023, PDF p.35); press release, 14 March 2023. https://www.ascionline.in/wp-content/uploads/guidelines/ASCI_Codes_Guidelines_Book.pdf. Fetched 2026-10-10 | Code 1.2: "Where advertising claims are expressly stated to be based on, or supported by independent research or assessment, its source and date should be indicated in the advertisement." | Factual claims must be capable of substantiation; research-based claims show source and date; education ads must not create false urgency or fear of missing out that could heighten students' or parents' anxieties | (1) Guideline 8 covers false urgency and fear of missing out only; "parental or student anxieties" is the proposed text in the press release. (2) Signed five days before the consultation opened: cite "dated 9 March 2023". (3) Names education providers, not toys; the general Code binds all ads. (4) Code 1.2 independently supports this page's footnote format (source and date) | [book](../raw/research/sources/C18-asci-codes-guidelines-book.md), [Code page](../raw/research/sources/C18-asci-code-page.md), [press release](../raw/research/sources/C18-asci-education-press-release-2023.md) |
| C19 | "'midbrain activation' classes have been exposed by rationalists for years (Wikipedia)" (docx L23, L88); "'Brain' pseudoscience has made parents wary" (pdf p.3) | Wikipedia (tertiary) | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL | Mohamed Nazeer, "Debunking midbrain activation of children", *The Hindu*, 21 April 2015, https://www.thehindu.com/news/national/kerala/debunking-midbrain-activation-of-children/article7124550.ece; DH News Service, "Rationalist exposes mid-brain activation fraud", *Deccan Herald*, 22 October 2017. Fetched 2026-10-10 | "science educators and rationalists dub them as a pseudo-science meant to take gullible parents for a ride." | Since at least 2015, science educators and rationalists have publicly called "midbrain activation" classes a pseudoscience | (1) Newspaper reports of allegations; "fraud" is the rationalist's word. (2) "Has made parents wary" is NOT SUPPORTED (nothing measures it). (3) One exposed scheme was sold as a "Whole Brain Development Programme", close to our category words: a reason for D016's care | [The Hindu](../raw/research/sources/C19-thehindu-2015-midbrain-activation.md), [Deccan Herald](../raw/research/sources/C19-deccanherald-2017-midbrain-activation.md), [Wikipedia](../raw/research/sources/C19-wikipedia-midbrain-activation.md) |
| C20 | "close to the tracking of children India's DPDP Act restricts" (docx L56). Live: stories.ts:144 ("already answers the last one": may not track, monitor or advertise); stories-expansion.ts:538 ("Section 9 requires verifiable consent") | None; live cites the MeitY PDF and Indian Kanoon | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL (legal wording: counsel) | *The Digital Personal Data Protection Act, 2023* (No. 22 of 2023), Gazette of India, 11 August 2023, s.2(f) and s.9, https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf; MeitY notification G.S.R. 843(E), 13 November 2025, clause (c); DPDP Rules 2025. Fetched 2026-10-10 | s.9(3): "A Data Fiduciary shall not undertake tracking or behavioural monitoring of children or targeted advertising directed at children." | The Act treats anyone under 18 as a child; s.9 requires a parent's verifiable consent before processing a child's data and bars tracking, behavioural monitoring and targeted advertising at children; under the current notification s.9 comes into force in May 2027 | (1) s.9 IS NOT YET IN FORCE: live stories.ts:144 is wrong on timing. (2) s.9 says nothing about selling or sharing. (3) A reported Removal of Difficulties Order (5 October 2026) was seen only in a law firm's summary: re-check the Gazette before publishing a date. (4) Never claim Kheelu "complies with section 9" on this basis. (5) Link MeitY, not a mirror | [Act](../raw/research/sources/C20-dpdp-act-2023-official-text.md), [G.S.R. 843(E)](../raw/research/sources/C20-dpdp-commencement-gsr-843e-2025.md), [Rules](../raw/research/sources/C20-dpdp-rules-2025.md) |
| C21 | "math-story RCT, Science 2015: first-graders ~3 months ahead in maths. Could claim: 'Builds early number sense'" (pdf p.15) | None | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL (future module) | Berkowitz, Schaeffer, Maloney, Peterson, Gregor, Levine and Beilock, "Math at home adds up to achievement in school", *Science* 350(6257):196-198, 2015, p.197 (authors' lab copy), https://hpl.uchicago.edu/files/2018/07/Berkowitz-et-al-2015-Science-23pubcr.pdf; Frank, Technical Comment, *Science* 351(6278):1161, 2016. Fetched 2026-10-10 | "children in the math group outperforming those in the reading group by almost 3 months in math achievement by school year's end" (children of high-math-anxious parents) | 587 first-graders: among children of more maths-anxious parents, those given the maths app ended the year almost three months ahead; a reanalysis found no significant overall effect | (1) The 3 months holds only for children of more maths-anxious parents (or in a non-randomised heavy-use comparison). (2) Contested. (3) First grade, a parent-led app: cannot support "Builds early number sense" | [Berkowitz](../raw/research/sources/C21-berkowitz-2015-science.md), [Frank](../raw/research/sources/C21-frank-2016-science-comment.md), [response](../raw/research/sources/C21-berkowitz-2016-science-response.md), [UChicago](../raw/research/sources/C21-uchicago-news-2015-secondary.md) |
| C22 | "Number talk predicts number knowledge (Levine 2010)." (pdf p.15) | None | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL (future module) | Levine, Suriyakham, Rowe, Huttenlocher and Gunderson, "What counts in the development of young children's number knowledge?", *Developmental Psychology* 46(5):1309-1319, 2010; PubMed abstract and author manuscript, https://pmc.ncbi.nlm.nih.gov/articles/PMC2998540/. Fetched 2026-10-10 | "this variation predicted children's knowledge of the cardinal meanings of number words at 46 months, even when socioeconomic status and other measures of parent and child talk were controlled." | 44 Chicago-area children: parents' number talk to toddlers (14 to 30 months) predicted number-word knowledge at 46 months, after SES; correlational | About parents' talk, not a device; small US sample; a 2011 erratum was not read | [C22](../raw/research/sources/C22-levine-2010-developmental-psychology.md) |
| C23 | "National Early Literacy Panel: working with spoken sounds and remembering what was said strongly predict later reading. Could claim: 'Gets children ready to read'" (pdf p.15) | None | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL (future module) | National Early Literacy Panel, *Developing Early Literacy*, National Institute for Literacy, 2008, Executive Summary p.vii and ch.2 pp.56-69. https://www.nichd.nih.gov/publications/pubs/Documents/NELPReport09.pdf. Fetched 2026-10-10 | "six variables representing early literacy skills or precursor literacy skills had medium to large predictive relationships with later measures of literacy development." | Phonological awareness and phonological memory are among six early skills with medium to large predictive links to later reading and spelling, after IQ and SES | "Strongly" overstates; phonological memory's link to decoding is weak; most children were 4 or older; correlational, so practising them with a toy is not shown to "get children ready to read" | [NELP 2008](../raw/research/sources/C23-nelp-2008-developing-early-literacy.md), [NELP 2009](../raw/research/sources/C23-nelp-early-beginnings-2009.md) |
| C24 | "Knowing letter names and shapes predicts reading, and voice alone can't teach shapes. Could claim: 'Learns letters and numbers'" (pdf p.16) | None | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL (future module) | NELP 2008 (as C23), Executive Summary p.vii, ch.2 pp.60 and 69 | "Children's AK yielded a strong relationship of 0.50 averaged across 52 studies involving 7,570 children." | Knowing the names and sounds of printed letters, measured in kindergarten or earlier, is one of six skills with medium to large predictive links to later reading and spelling | Alphabet knowledge is names and sounds, not shapes; "voice alone can't teach shapes" is our own reasoning; nothing supports numerals; correlational | [C24](../raw/research/sources/C24-nelp-2008-alphabet-knowledge.md) |
| C25 | "'Red Light, Purple Light' RCT, 2019, ages 3 to 5: bigger maths gains; self-control gains not yet significant. Could claim: 'Practises focus through play'" (pdf p.15) | None | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL (future module) | McClelland, Tominey, Schmitt, Hatfield, Purpura, Gonzales and Tracy, "Red Light, Purple Light! Results of an Intervention to Promote School Readiness for Children From Low-Income Backgrounds", *Frontiers in Psychology* 10:2365, 2019, https://pmc.ncbi.nlm.nih.gov/articles/PMC6817624/. Fetched 2026-10-10 | "children participating in either version of the intervention gained significantly more in math across the school year compared to children in the BAU group" | 157 Head Start preschoolers aged 3 to 5: teacher-led games went with significantly larger maths gains; self-regulation gains were not statistically significant | "Not significant", never "not yet"; teacher-delivered, not a toy; control classrooms started higher | [C25](../raw/research/sources/C25-mcclelland-2019-frontiers-red-light-purple-light.md) |
| C26 | "A 2-minute spoken check every 4 weeks, like ASER's graded oral tasks. Claim: 'In our pilot, children...'" (pdf p.14) | None | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL (claim ladder) | ASER Centre (Pratham), *ASER 2024* Assessment tasks, p.38, https://asercentre.org/wp-content/uploads/2022/12/ASER-2024-assessment-tasks.pdf; ASER tools page. Fetched 2026-10-10 | "ASER is a 'floor test' that focuses on basic reading and arithmetic, rather than grade-level competencies." | ASER's levelled floor test is given at home and records the highest level a child can comfortably reach | Ages 5 to 16; partly printed tasks, not purely spoken; "2-minute" and "every 4 weeks" are our design; "In our pilot" only after a pilot; no ASER endorsement | [tasks](../raw/research/sources/C26-aser-2024-assessment-tasks.md), [tools](../raw/research/sources/C26-aser-tools-page.md) |
| C27 | "speech recognition is weaker under 4" (docx L40) | None | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL (G5) | Dutta, Hansen, Irvin and Buzhardt, "Activity focused Speech Recognition of Preschool Children in Early Childhood Classrooms", BEA 2022, pp. 92-100, https://aclanthology.org/2022.bea-1.13.pdf; Shivakumar and Georgiou, *Computer Speech and Language* 63:101077, 2020 (PMC7199459). Fetched 2026-10-10 | "Automatic Speech Recognition (ASR) for children is still significantly less accurate than that of adults" | Speech recognition is less accurate for children than adults, and less accurate the younger the child; a system for 3 to 5 year olds in noisy classrooms still got about 40% of words wrong | No source tests under-4s separately: "under 4" is unsourced; the 40% is not a prediction for Kheelu | [Dutta](../raw/research/sources/C27-dutta-hansen-2022-preschool-asr.md), [Shivakumar](../raw/research/sources/C27-shivakumar-georgiou-2020-child-asr.md) |
| C29 | "Search 'brain development toys' in India and you get puzzles, tangrams and activity books at ₹99 to ₹429 (MagicDrop buying guide, Jul 2026)" (docx L70; pdf p.3) | MagicDrop, a retailer's affiliate page | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL (D013) | MagicDrop.in, "Best Brain Development Toys in India 2026", updated 6 July 2026, https://magicdrop.in/drops/brain-development-toys. Fetched 2026-10-10 | "Disclosure: MagicDrop.in earns affiliate commission when you buy through links on our site" | One affiliate guide lists six products from ₹99 to ₹429, none a talking toy | One affiliate page, not search results; "they build hand skills and focus" repeats sellers' labels | [C29](../raw/research/sources/C29-magicdrop-brain-development-toys-2026.md) |
| C30 | Miko Mini, MyWonder, Pookie wording and prices (docx L75-84; pdf p.4); "₹1,599 'ChatGPT robots'" (L131) | Competitors' pages; ₹1,599 has none | **S-W-R** (S-W-R / S-W-R). Site: INTERNAL (D013) | The competitors' own pages: https://in.miko.ai/products/miko-mini, https://mywonder.in/, https://scoobies.co.in/pages/pookie. Fetched 2026-10-10 | Miko: "AI-powered conversational robot for kids." | Quotes and prices as of 10 October 2026 (internal) | SKM's Pookie quote is not on the page; "engaging STEAM content" is only in Miko's meta description; ₹1,599 unverified; never name competitors on the site | [Miko](../raw/research/sources/C30-miko-mini-product-page.md), [MyWonder](../raw/research/sources/C30-mywonder-home-page.md), [Pookie](../raw/research/sources/C30-scoobies-pookie-page.md) |
| C42 | Not in SKM. Live, unsourced: stories-expansion.ts:132 "talk to your pediatrician or a speech-language professional if your child says very few words by two and a half, is hard for family to understand at three, loses words [...]" | None | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL (D025) | CDC, "Learn the Signs. Act Early." milestone pages at 18 months, 30 months and 3 years (reviewed 16 May 2026), https://www.cdc.gov/act-early/milestones/30-months.html; Zubler et al., "Evidence-Informed Milestones for Developmental Surveillance Tools", *Pediatrics* 149(3), 2022, Table 4 (PMC9680195); ASHA Communication Milestones. Fetched 2026-10-10 (CDC through rendered text; cdc.gov refuses scripted requests) | 30 months: "Says about 50 words"; 3 years: "Talks well enough for others to understand, most of the time"; "If your child is not meeting one or more milestones, has lost skills he or she once had, or you have other concerns, act early." | Talk to your child's doctor or a speech-language therapist if, by two and a half, the child is not yet saying about 50 words; if at three others still cannot understand them most of the time; if they lose skills; or if they do not follow simple requests like "give it to me" | (1) "Give it to me" is on the 18-month page, which has no excerpt file; the Copywriter re-found it in Zubler Table 4 (18 months). (2) US milestones set at the age by which 75% or more reach them: a reason to ask, not a diagnosis. (3) "Very few words" was a gloss. (4) No IAP guidance found. (5) D025 | [CDC](../raw/research/sources/C42-cdc-milestones-30-months-and-3-years.md), [Zubler](../raw/research/sources/C42-zubler-2022-pediatrics-milestones.md), [ASHA](../raw/research/sources/C42-asha-communication-milestones-2-to-4-years.md) |
| C43 | Not in SKM. Live, unsourced: stories-expansion.ts:158 "Sleep is when the day's learning gets filed, and children aged 3 to 6 need ten to thirteen hours of it." | None | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Paruthi et al., "Recommended Amount of Sleep for Pediatric Populations: A Consensus Statement of the American Academy of Sleep Medicine", *J Clin Sleep Med* 12(6):785-786, 2016, DOI 10.5664/jcsm.5866 (PMC4877308); Kurdziel, Duclos and Spencer, "Sleep spindles in midday naps enhance learning in preschool children", *PNAS* 110(43), 2013 (PMC3808582). Fetched 2026-10-10 | "Children 3 to 5 years of age should sleep 10 to 13 hours per 24 hours (including naps) on a regular basis to promote optimal health." | 3 to 5: 10 to 13 hours in 24, naps included; 6 to 12: 9 to 12 hours; in one small US study preschoolers remembered more of a morning memory game after a nap than after staying awake | (1) "3 to 6 need 10 to 13" is wrong at 6. (2) "Learning gets filed" states a mechanism as fact; the AASM reports an association. (3) Kurdziel: 40 children, 36 to 67 months, one game, six US classrooms. (4) US body; WHO sleep guidance not read here | [AASM](../raw/research/sources/C43-aasm-2016-pediatric-sleep-consensus.md), [Kurdziel](../raw/research/sources/C43-kurdziel-2013-pnas-preschool-naps.md) |
| C44 | Not in SKM. Live, unsourced: stories-expansion.ts:158 "chronic stress is one of the few things reliably shown to work against a growing brain." | None | **S-W-R** (S-W-R / S-W-R). Site: EXTERNAL | Center on the Developing Child at Harvard University, "Toxic Stress" (Key Concepts; metadata 2024-11-06, modified 2025-03-13), https://developingchild.harvard.edu/key-concept/toxic-stress/; AAP technical report, Shonkoff, Garner et al., *Pediatrics* 129(1):e232-e246, 2012 (abstract only). Fetched 2026-10-10 | "Toxic stress can disrupt the healthy development of brain architecture and other bodily systems, increasing risk for stress-related disease well into adulthood." | Not all stress is bad; serious, ongoing adversity without a caring adult to buffer it can disrupt how a young child's brain develops; supportive relationships help protect against it | (1) About TOXIC stress (abuse, neglect, violence, family hardship, no buffering), not everyday stress. (2) "One of the few things reliably shown" is NOT SUPPORTED. (3) D016 | [Harvard](../raw/research/sources/C44-harvard-center-toxic-stress.md), [AAP 2012](../raw/research/sources/C44-aap-2012-toxic-stress-technical-report.md) |

## 4. Ready-to-use website lines

For the 26 claims that are supported and EXTERNAL. Drafts for the founder's sign-off at Gate A
([D015](../decisions/D015-founder-signs-off-copy.md)).

**How the markers work on the site.** Each marked line carries a superscript number that links to the
page's "Sources" list (D026 allows a superscript number or an asterisk; numbers keep working when a
page has more than one source). Number the notes per page in reading order and reuse a number when
the same source comes back. Each note follows one format: `¹ <Publisher or authors>, <title>, <year>,
<section/page>. <URL>`. ASCI's Code also asks that research-based claims show their source and date
(C18). The footnotes below are numbered within each block; renumber them on the page.

**Rules that apply to every line.**
- A **house line** is Kheelona's own voice: it carries no marker and never sits inside a marked
  sentence, so a reader can always tell the source's words from ours.
- **[D016](../decisions/D016-brain-wording.md):** no marked line makes Kheelu its subject, and no
  brain line sits in the same sentence as Kheelu. The one company line (C07) uses the approved form:
  conversation helps, and Kheelu gives a child more of it.
- **[D025](../decisions/D025-speech-and-language.md):** C09, C11, C38, C40 and C42 are speech and
  language lines. They stand on the public sources cited. The disclaimer ("Kheelu is a toy, not a
  therapy or treatment. If you're worried about your child's speech, talk to your paediatrician.")
  goes on Terms and Meet Kheelu, not Home; an article about speech delay keeps its one-line
  disclaimer inside the article.
- **Ages:** every study line states the ages the study covered. None presents a study of older
  children as covering 3-year-olds.
- **Calm:** each figure is paired with something a parent can do, from the source where possible.

### C01 · NEP 2020: the first six years
**Where:** an early-years journal article or the `/how` "why talking matters" section; never in a
sentence about Kheelu.
> India's National Education Policy 2020 says that "over 85% of a child's cumulative brain
> development occurs prior to the age of 6".¹ The same policy describes good early learning as
> "play-based, activity-based, and inquiry-based".²

¹ Ministry of Human Resource Development (now Ministry of Education), Government of India, "National Education Policy 2020", 2020, chapter 1, para 1.1, p. 7. https://ncert.nic.in/pdf/nep/NEP_2020.pdf
² Ministry of Human Resource Development (now Ministry of Education), Government of India, "National Education Policy 2020", 2020, chapter 1, para 1.2, p. 7. https://ncert.nic.in/pdf/nep/NEP_2020.pdf

House line (optional, no marker): *In practice: play with your child, and follow their questions.*
Keep the quote as quoted; never "research shows", never "85% of the brain".

### C02 · The Foundational Stage
**Where:** the age FAQ ("Why 3 to 7?") or a journal article, as context only.
> India's National Education Policy 2020 treats ages 3 to 8 as the Foundational Stage of school
> education: three years of Anganwadi or pre-school, then Grades 1 and 2.¹

¹ Ministry of Human Resource Development (now Ministry of Education), Government of India, "National Education Policy 2020", 2020, chapter 4, para 4.1, p. 11. https://ncert.nic.in/pdf/nep/NEP_2020.pdf

Never directly after the C01 line, and never "NEP recommends" anything about Kheelu.

### C03 · What early education aims for
**Where:** `/how` or a learning article.
> India's National Education Policy 2020 names cognitive development, and communication and early
> language, among the outcomes that early childhood care and education should aim for.¹

¹ Ministry of Human Resource Development (now Ministry of Education), Government of India, "National Education Policy 2020", 2020, chapter 1, para 1.2, p. 7. https://ncert.nic.in/pdf/nep/NEP_2020.pdf

Any sentence about Kheelu's skills comes separately and claims no NEP alignment.

### C05 · The early years and brain connections
**Where:** an early-years article; `/how`. Also replaces the live "grows fastest" lines.
> The early years are the most active time for building connections in the brain. Harvard's Center
> on the Developing Child estimates that more than a million new ones form every second in the
> first few years of life.¹ It says back-and-forth exchanges between a young child and a caring
> adult help build and strengthen those connections.²

¹ Center on the Developing Child at Harvard University, "Brain Architecture" (Key Concepts), 2024, updated 2026, Fast Facts. https://developingchild.harvard.edu/key-concept/brain-architecture/
² Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways. https://developingchild.harvard.edu/key-concept/serve-and-return/

Indian alternative:
> India's National Curriculum Framework for the Foundational Stage says brain development is most
> rapid in the first eight years of a child's life.¹

¹ National Steering Committee for National Curriculum Frameworks, "National Curriculum Framework for Foundational Stage 2022", 2022, section 1.1.3, p. 17. https://ncert.nic.in/pdf/NCF_for_Foundational_Stage_20_October_2022.pdf

Short form for headings and teasers: "the early years, when a child's brain builds connections
fastest", with the Harvard marker. Always "estimates"; never a peak age band.

### C06 · Screen time in India
**Where:** the screen-time article; the `/how` "why screen-free" section; the AI-toys guide.
> Across 10 studies from India, covering 2,857 children under five, children averaged about 2.2
> hours of screen time a day. That is more than the guidelines advise.¹ For three and four year
> olds, the WHO and the Indian Academy of Pediatrics both say no more than an hour a day, and less
> is better.²³ From five to ten, the Indian Academy of Pediatrics says under two hours a day.³

¹ Khobragade and Shenoy, AIIMS Raipur, "Screen Time Among Under-Five Children in India: A Systematic Review and Meta-Analysis", Cureus, 2025, Results. https://doi.org/10.7759/cureus.85458
² World Health Organization, "Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age", 2019, Recommendations: sedentary time, p. 8. https://iris.who.int/handle/10665/311664
³ Indian Academy of Pediatrics, "Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents", Indian Pediatrics, 2022, p. 239. https://www.indianpediatrics.net/mar2022/235.pdf

Never "double", never "Indian children average".

### C07 · Serve and return
**Where:** `/how`; Meet Kheelu ("why it asks back"); the talking article.
> Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between
> a young child and a caring adult help build and strengthen neural connections in the child's
> brain. They also support the early language and social skills that later, more complex thinking
> builds on.¹

¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/

Company line, in its own sentence or card, no marker: *Kheelu is built around the same idea. It
answers, then asks a question back, so your child gets more turns in the day.*
House line: *You can do it anywhere: answer your child, then ask one back.*
Never call Kheelu's loop "serve and return"; never drop "a caring adult".

### C08 · "One of the most essential experiences"
**Where:** the talking article; `/how`.
> Harvard's Center on the Developing Child calls "serve and return", the back and forth between
> young children and the significant adults in their lives, "one of the most essential experiences
> in shaping the architecture of the developing brain".¹ When your child reaches out with a sound, a
> look or a gesture and you respond, that is serve and return.¹

¹ Center on the Developing Child at Harvard University, "Serve & Return Interaction Shapes Brain Circuitry", 2011, page description. https://developingchild.harvard.edu/resources/videos/serve-return-interaction-shapes-brain-circuitry/

Do not follow it with a sentence that makes Kheelu the source of that experience.

### C09 · Turns, not just words (ages 4 to 6)
**Where:** the talking article; `/how`. Never in a three-year-old article without the ages.
> In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational
> turns with adults showed more activity in Broca's area, a language region of the brain, while
> listening to a story. The number of adult words they heard showed no such link. Turns also
> predicted the children's language scores once family income and parents' education were taken
> into account. The study shows a link, not cause and effect.¹ In the study, a turn was an adult
> speaking and the child replying, or the other way round.¹

¹ Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, "Beyond the 30-Million-Word Gap: Children's Conversational Exposure Is Associated With Language-Related Brain Function", Psychological Science, 2018, Abstract and Results. https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/

Stricter than both verifiers' draft: it does not say turns beat adult words for language scores,
because adult words also correlated with those scores on their own.

### C10 · Questions during a story (ages 3 to 6)
**Where:** Meet Kheelu ("why it asks questions"), as a description of the study; the AI-toys guide.
> In a study by researchers at the University of California, Irvine, 117 children aged 3 to 6
> heard a picture book read aloud by a smart speaker. Children whose speaker stopped to ask them
> questions understood the story better than children whose speaker only read it, and about as well
> as children asked the same questions by an adult.¹ In the same study, questions helped whether an
> adult or the speaker asked them.¹ The study used a smart speaker, not Kheelu.

¹ Xu, Aubele, Vigil, Bustamante, Kim and Warschauer, "Dialogue with a conversational agent promotes children's story comprehension via enhancing engagement", Child Development, 2022, Results. https://doi.org/10.1111/cdev.13708

House line: *When you read together, pause once or twice and ask what your child thinks will
happen.* Never "learnt more words", "builds vocabulary" or "Harvard".

### C11 · An adult still draws out more words (ages 3 to 6)
**Where:** "Should kids use AI?"; the FAQ "Will it replace me?".
> In a related US study of 90 children aged 3 to 6, children asked about a story by an adult
> researcher gave longer answers, using more different words, than children asked the same
> questions by a smart speaker. Both groups answered about equally accurately.¹

¹ Xu, Wang, Collins, Lee and Warschauer, "Same benefits, different communication patterns: Comparing Children's reading with a conversational agent vs. a human partner", Computers & Education, 2021, Abstract and section 4.3. https://doi.org/10.1016/j.compedu.2020.104059

House line: *After any story, from a book, a speaker or a toy, ask your child to tell it back to
you.* Never "children lead", "steer" or "add their own ideas".

### C14 · "Cognitive stunting"
**Where:** "Should kids use AI?"; the AI-toys guide.
> In a May 2026 commentary for the Brookings Institution, Rebecca Winthrop, who directs its Center
> for Universal Education, described one worry about children and AI as "cognitive stunting":
> relying too heavily on AI "reduces children's opportunities to engage in effortful thinking".¹
> She calls the evidence early, and asks for ways to measure children's cognitive development alongside
> their AI use.¹

¹ Rebecca Winthrop, Brookings Institution, "Is it time to measure cognitive stunting?", 2026, sections "Cognitive stunting" and "Early evidence on AI and cognitive development". https://www.brookings.edu/articles/is-it-time-to-measure-cognitive-stunting/

House line: *Give your child time to think before anyone, or anything, gives the answer.* Never
"Brookings warns"; never a Kheelu line inside this paragraph.

### C16 · Common Sense Media on AI toys
**Status:** EXTERNAL IF CONFIRMED: the founder decides whether and where (G5;
[age-band review §4](../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band) owns it).
Its scope covers a talking toy like Kheelu, so if the site addresses it, it should quote it whole.
**Where:** the AI-toy safety article; the `/safety` FAQ.
> In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as
> "smart toys with voice-based interactions", to children aged 5 and under, and to use extreme
> caution before buying them for children aged 6 to 12.¹ When it tested three AI toys, it rated 27%
> of their replies as not appropriate for kids. It also raised concerns about toys designed to create
> emotional attachment, the data they collect and how reliably they work.²

¹ Common Sense Media, "Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks" (press release), 2026, paragraph 1. https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks
² Common Sense Media Youth AI Safety Institute, "AI Toys" (risk assessment), 2026, "What we found". https://institute.commonsensemedia.org/risk-assessments/ai-toys

House line: *Before any AI toy comes home, ask what it does with your child's voice, what you can
see as a parent, and how it handles a hard question.* Never name the toys tested.

### C20 · India's data law and children
**Where:** "What India's data law asks of a toy that listens". Legal wording: founder and counsel
review (F2, [D029](../decisions/D029-grievance-officer-legal-review.md)); re-read the Gazette for any
change to the commencement date before publishing.
> India's Digital Personal Data Protection Act, 2023 treats anyone under 18 as a child.¹ Section 9
> says a company must get a parent's verifiable consent before processing a child's personal data,
> and must not track children, monitor their behaviour or aim targeted advertising at them.¹ Under
> the current government notification, section 9 is due to come into force in May 2027.²

¹ Government of India, "The Digital Personal Data Protection Act, 2023" (No. 22 of 2023), 2023, sections 2(f) and 9. https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf
² Ministry of Electronics and Information Technology, Notification G.S.R. 843(E), 2025, clause (c). https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf

House line: *Whichever toy you choose, ask the company how it gets your consent, and whether it
tracks your child or shows them ads.* Never "Kheelu complies with section 9".

### C31 · The WHO guideline
**Where:** the screen-time article; the AI-toys guide FAQ.
> The World Health Organization's 2019 guideline: under one, screen time is not recommended; at
> one, sedentary screen time is not recommended; at two, and at three and four, no more than one
> hour a day, and less is better.¹

FAQ form:
> A tablet gives your child something to watch, and both the WHO and the AAP put a ceiling on it:
> no more than an hour a day from age two until five.¹²

¹ World Health Organization, "Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age", 2019, Recommendations: sedentary time, p. 8. https://iris.who.int/handle/10665/311664
² American Academy of Pediatrics, Council on Communications and Media, "Media and Young Minds", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2591

Drop "the research ... is consistent enough"; the WHO grades its own evidence very low.

### C32 · The Indian Academy of Pediatrics
**Where:** the screen-time article; `/how`.
> The Indian Academy of Pediatrics published its own guidelines in 2022, for Indian children and
> families: no screens below two years, at most one hour of supervised screen time a day from two to
> five, and under two hours a day from five to ten.¹ For two to five year olds, it asks for sessions
> of no more than 20 to 30 minutes, always supervised by a caregiver.¹

¹ Indian Academy of Pediatrics, "Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents", Indian Pediatrics, 2022, p. 239. https://www.indianpediatrics.net/mar2022/235.pdf

### C33 · The American Academy of Pediatrics
**Where:** the screen-time article.
> The American Academy of Pediatrics says no more than one hour a day of high-quality programmes for
> ages two to five, and no screens other than video calls before 18 to 24 months.¹ It asks parents
> to watch with their children, help them understand what they are seeing, and switch screens off
> an hour before bedtime.¹ For children aged 5 to 18, it sets no fixed number of hours: it asks
> families to place consistent limits on hours per day and on the types of media used.²

¹ American Academy of Pediatrics, Council on Communications and Media, "Media and Young Minds", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2591
² American Academy of Pediatrics, Council on Communications and Media, "Media Use in School-Aged Children and Adolescents", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2592

Never "about an hour"; it is a ceiling.

### C34 · The 3-6-9-12 rule
**Where:** the "3-6-9-12 rule" article.
> The 3-6-9-12 rule was set out in 2008 by the psychiatrist Serge Tisseron: no screens before 3, no
> device or games console of their own before 6, the internet with an adult from 9, and alone from
> 12.¹ It is a framework, not a study. Its first marker is stricter than the medical bodies: the WHO
> and the IAP advise no screens under two, and the AAP none before 18 to 24 months (the IAP and the
> AAP make room for video calls), and all three set a ceiling of one hour a day from two.²³⁴ For
> ages 3 to 6, Tisseron's own markers suggest from half an hour a day at 3 to an hour at most at 6.⁵

¹ Serge Tisseron, association 3-6-9-12, "Les balises 3-6-9-12+" (in French), 2008 markers, section "Les repères 3-6-9-12 en 2008". https://www.3-6-9-12.org/les-balises-3-6-9-12/
² World Health Organization, "Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age", 2019, Recommendations: sedentary time, p. 8. https://iris.who.int/handle/10665/311664
³ Indian Academy of Pediatrics, "Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents", Indian Pediatrics, 2022, p. 239. https://www.indianpediatrics.net/mar2022/235.pdf
⁴ American Academy of Pediatrics, Council on Communications and Media, "Media and Young Minds", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2591
⁵ Serge Tisseron, association 3-6-9-12, "Les balises 3-6-9-12+" (in French), undated page, section "De 3 à 6 ans". https://www.3-6-9-12.org/les-balises-3-6-9-12/

Never "French", "the one the strongest research agrees with" or "four doorways".

### C35 · Tantrums at the off switch
**Where:** the screen-time-and-tantrums article.
> If this is your house some evenings, you are not alone. Meltdowns at the off switch are common
> enough that researchers have studied them: a 2016 University of Washington study of families with
> children aged 1 to 5 found that "transitioning away from screens is often painful".¹ In that
> study, routines and stopping at a natural break made the switch easier, and children given a
> two-minute warning were more upset when the screen went away.²

¹ Hiniker, Suh, Cao and Kientz, "Screen Time Tantrums: How Families Manage Screen Media Experiences for Toddlers and Preschoolers", 2016, CHI 2016 proceedings pp. 648-660, abstract. https://doi.org/10.1145/2858036.2858278
² University of Washington News (Jennifer Langston), "Two-minute warnings make kids' 'screen time' tantrums worse", 2016, the university's release about the study. https://www.washington.edu/news/2016/05/05/two-minute-warnings-make-kids-screen-time-tantrums-worse/

Note ² is the university's own account of its study (the full paper could not be read); cite it by
name, as here. Never a countdown tip.

### C36 · Fairplay's advisory
**Where:** the AI-toy safety article.
> In November 2025 Fairplay, a children's advocacy group, published an advisory signed by more than
> 150 experts and organisations telling parents not to buy AI toys that season.¹

¹ Fairplay, "AI Toys are NOT Safe for Kids" (advisory), 2025, opening paragraph. https://fairplayforkids.org/pf/aitoyadvisory/

House line: *Whatever you decide, ask the hard questions before an AI toy comes home.* Never
"at any age"; it sets no age line.

### C37 · Can a young child use a chatbot?
**Status: HOLD.** Kheelu itself uses outside AI providers ([D019](../decisions/D019-voice-providers.md)).
Publishing other chatbots' age rules invites the question of what Kheelu's own providers' terms say
about children. Publish only after the founder and counsel confirm that answer.
**Where:** the AI-toys guide FAQ.
> Not on their own. General chatbots set their own age rules. ChatGPT's and Microsoft Copilot's
> terms require users to be at least 13, and older in some countries; Claude's require 18.¹²³
> Google's Gemini lets a child under 13 use it only through a supervised account that a parent has
> turned on.⁴

¹ OpenAI, "Terms of Use", effective 1 January 2026, "Minimum age". https://openai.com/policies/row-terms-of-use/
² Microsoft, "Microsoft Copilot Terms of Use", effective 18 August 2026, "Who can use Copilot". https://www.microsoft.com/en-us/microsoft-copilot/for-individuals/termsofuse
³ Anthropic, "Consumer Terms of Service", effective 8 October 2025, section 2. https://www.anthropic.com/legal/consumer-terms
⁴ Google, "Guide your child's Gemini Apps experience" (Gemini Apps Help), undated help page, opening paragraph. https://support.google.com/gemini/answer/16109150?hl=en

House line: *If AI is part of a young child's play, it should be built for their age and fully
visible to you.* Re-read every term before publishing; never name Meta AI.

### C38 · Bilingual children
**Where:** the bilingual article.
> Do bilingual children fall behind? A 2013 review of the research, written for parents by two
> researchers who study bilingual infants and children, says it plainly: bilingual children are not
> more likely than monolingual children to have difficulties with language, to show delays in
> learning, or to be diagnosed with a language disorder.¹ They may know fewer words in each language
> on its own. Count the ideas they have a word for in either language, counting *paani* and *water*
> once, and the total is about the same as for a child growing up with one language.¹

> Mixing languages is a stage. The same review notes that even bilingual two-year-olds show some
> ability to match their language to the language the other person is using.¹ Usually by age 3,
> children learning more than one language can separate them.²

¹ Krista Byers-Heinlein and Casey Lew-Williams, "Bilingualism in the Early Years: What the Science Says", LEARNing Landscapes, 2013, pp. 97 and 104. https://doi.org/10.36510/learnland.v7i1.632
² American Academy of Pediatrics and American Speech-Language-Hearing Association, "Young Children Learning Multiple Languages: Parent FAQs", HealthyChildren.org, 2025 (updated 20 November). https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx

Speech and language (D025). No numbers for ages 3 to 6.

### C39 · NEP and the home language
**Where:** the bilingual article.
> India's National Education Policy 2020 says that, wherever possible, children should be taught in
> their home language, mother tongue, or local or regional language until at least Grade 5, and
> preferably till Grade 8 and beyond.¹ The policy gives its reason in the same paragraph: young
> children "learn and grasp nontrivial concepts more quickly in their home language/mother
> tongue".¹

¹ Ministry of Human Resource Development (now Ministry of Education), Government of India, "National Education Policy 2020", 2020, chapter 4, para 4.11, p. 13. https://ncert.nic.in/pdf/nep/NEP_2020.pdf

A schools policy, not a law and not about toys; never "That is why" after a transfer claim.

### C40 · A second language does not cause delay
**Where:** the late-talker article (with its in-article disclaimer); the words article; the
bilingual article.
> A second home language does not cause speech delay. Asked whether using more than one language
> can cause a speech or language disorder, the American Academy of Pediatrics and the American
> Speech-Language-Hearing Association answer no: "Speech or language problems are not caused by
> learning multiple languages."¹ A bilingual child may split their words across two languages.
> Counted together, the total should be about the same as for a child of the same age learning one
> language.¹ Keep both languages.

> Words collected in Telugu or Bangla count towards that total.¹ And a strong model in any
> language helps build a foundation for learning others.²

> Jim Cummins, a University of Toronto researcher on bilingual education, argues that concepts
> learned in the mother tongue carry over to a second language. A child who can tell the time in
> one language, he writes, does not need to re-learn the concept in another, only the new labels
> for it.³

¹ American Academy of Pediatrics and American Speech-Language-Hearing Association, "Young Children Learning Multiple Languages: Parent FAQs", HealthyChildren.org, 2025 (updated 20 November). https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx
² American Speech-Language-Hearing Association, "Late Language Emergence" (Practice Portal), undated, Assessment: Cultural and Linguistic Considerations. https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/
³ Jim Cummins, "Bilingual Children's Mother Tongue: Why is it important for education?", Sprogforum 19, 2001, p. 18. https://web.archive.org/web/20120905180920/http://inet.dpb.dpu.dk/infodok/sprogforum/Espr19/CumminsENG.pdf

"Keep both languages" is a house line. The AAP and ASHA count raw totals; do not put this next to
the C38 "count each idea once" line without its own marker.

### C42 · When to ask about speech
**Where:** the late-talker or speech article only, with its in-article disclaimer; never Home.
> As a general guide, talk to your child's doctor or a speech-language therapist if, by two and a
> half, your child is not yet saying about 50 words;¹ if, at three, others still cannot understand
> them most of the time;² if they lose words or skills they used to have, at any age;¹ or if they
> do not seem to follow simple requests like "give it to me".³ Missing one is a reason to ask, not
> a diagnosis.

¹ US Centers for Disease Control and Prevention, "Learn the Signs. Act Early.": milestones by 30 months, 2026 (reviewed 16 May), Language/Communication and "act early". https://www.cdc.gov/act-early/milestones/30-months.html
² US Centers for Disease Control and Prevention, "Learn the Signs. Act Early.": milestones by 3 years, 2026 (reviewed 16 May), Language/Communication. https://www.cdc.gov/act-early/milestones/3-years.html
³ US Centers for Disease Control and Prevention, "Learn the Signs. Act Early.": milestones by 18 months, 2026 (reviewed 16 May), Language/Communication. https://www.cdc.gov/act-early/milestones/18-months.html

US milestones, set at the age by which most children reach them. Re-open note ³ before publishing
(no excerpt file was saved for the 18-month page).

**Re-read 2026-10-14:** [source verification, 2026-10-14](source-verification-2026-10-14.md) re-checked C42 for
the "3-year-old not talking in sentences?" guide ([talking-late-or-talking-little](../site/pages/story-talking-late-or-talking-little.md)):
the CDC's "sentences with four or more words" item at 4 years
([excerpt](../raw/research/sources/C42-cdc-milestones-4-years.md)) and the 30-month items against Zubler 2022
Table 4 ([cross-check](../raw/research/sources/C42-zubler-2022-table-4-cross-check.md)), both SUPPORTED, with ready
lines on that page. That guide is on the CDC re-read list in [section 7](#7-before-any-line-is-published)
([CMO review 5.20b](../qa/cmo-review-article-fixes-5.20b-2026-10-14.md) question 4).

### C43 · Sleep
**Where:** "What actually builds a sharp brain"; a bedtime FAQ.
> Children aged 3 to 5 need 10 to 13 hours of sleep in every 24, naps included, and children aged 6
> to 12 need 9 to 12 hours. Getting the recommended hours regularly goes with better attention,
> behaviour, learning and memory.¹ In one small US study, preschoolers remembered more of a memory
> game they had learned that morning after a nap than after staying awake.²

¹ Paruthi and colleagues for the American Academy of Sleep Medicine, "Recommended Amount of Sleep for Pediatric Populations: A Consensus Statement of the American Academy of Sleep Medicine", Journal of Clinical Sleep Medicine, 2016, Recommendations. https://doi.org/10.5664/jcsm.5866
² Kurdziel, Duclos and Spencer, "Sleep spindles in midday naps enhance learning in preschool children", PNAS, 2013, Abstract and Results. https://doi.org/10.1073/pnas.1306418110

Never "sleep is when learning gets filed".

### C44 · Stress
**Where:** "What actually builds a sharp brain".
> Not all stress is bad. But serious, ongoing adversity, such as abuse, neglect, violence or the
> strain of family hardship, can disrupt how a young child's brain develops when no caring adult is
> there to buffer it. Scientists call this toxic stress.¹ Supportive relationships with caring
> adults help protect against it.¹

¹ Center on the Developing Child at Harvard University, "Toxic Stress" (Key Concepts), 2024, updated 2025, Key Takeaways and Fast Facts. https://developingchild.harvard.edu/key-concept/toxic-stress/

Never "chronic stress is one of the few things reliably shown".

## 5. Do not use

### 5.1 NOT-SUPPORTED (4)

| ID | Claim | Reason |
|---|---|---|
| C15 | "Parents increasingly worry AI will do their child's thinking for them (Brookings)" | The Brookings commentary says nothing about parents' worry or a trend. If it rests on SKM's survey, it is INTERNAL ([D013](../decisions/D013-internal-vs-external-content.md)) |
| C28 | "Kheelu asks questions in our language, so your grandchild thinks in it too" | No source says conversation makes a child "think in" a language; it is an outcome claim for Kheelu (D016, D025). The verifier's substitute line was not re-checked |
| C41 | "Between three and four a child's vocabulary roughly doubles"; "Between three and six the collection explodes" (live) | No source found; the nearest estimate (Bloom 2001) averages ages 1 to 17 and was not re-checked. Cut both lines |
| C45 | "Children learn fastest from exchanges that feel good" (live) | No source says "fastest" or ranks exchanges that feel good |

### 5.2 COULD-NOT-VERIFY (2)

| ID | Claim | Reason |
|---|---|---|
| C04 | "Aligned with NCF goals" / activities tied to NCF-FS and NIPUN Bharat | About activities that do not exist yet and an advisor sign-off that has not happened; the tables module runs ahead of both documents |
| C13 | "Preschoolers ask about 76 information-seeking questions an hour" | The original (Chouinard 2007) is paywalled and its chapter II was not read; the base is four children; others cite "over 100" |

### 5.3 MISATTRIBUTED (0 as a final verdict)

No claim was misattributed as a whole, but nine attributions inside supported claims are wrong and
must not be carried over: C06 (Pune Pulse, January 2026, for a Cureus paper of June 2025); C09
("Researchers at MIT", live; SKM's trail runs through the LENA vendor blog); C10 ("Harvard" for UC
Irvine work; "learnt more words" came from an essay, not the study); C11 (docx L377, "Harvard's Ying
Xu found" a finding never measured); C13 (the 76 figure cited through a secondary); C17 (the Toy
Association's summary for the bill; "under 18" from a superseded draft); C33 (the AAP's age-6+
advice credited to "Media and Young Minds", and in keyword-map ST2 to the IAP); C38 ("two
developmental psychologists"); C40 (the asha.org consumer page, now published by CHSA).

### 5.4 Supported, but INTERNAL: no site line (13)

| ID | Why it stays off the site |
|---|---|
| C12 | Future science module; the published version was not read |
| C17 | Legal context for strategy; whether it touches Kheelu is for counsel |
| C18 | ASCI rules govern our copy; they are not copy |
| C19 | Background on why "brain" claims need care |
| C21, C22, C23, C24, C25 | Evidence for future modules; none supports a claim about Kheelu |
| C26 | The claim ladder; "In our pilot" only after a pilot |
| C27 | Open question G5 (speech recognition and young children) |
| C29, C30 | Market and competitor material ([D013](../decisions/D013-internal-vs-external-content.md); [content boundary](../site/content-boundary.md)) |

### 5.5 Corrections to excerpt files

`wiki/raw/` is immutable, so these are recorded here rather than fixed there.
- **C31:** the WHO line "In a 24-hour day, infants (less than 1 year) should:" is on printed p. viii
  (PDF p. 10), not p. ix, and it heads only the infant panel. The words are quoted correctly.
- **C36:** the excerpt calls the November 2025 PDF "8 pages"; the file served on 2026-10-10 has 13.
- **C14:** the excerpt's "Nothing in it is about children aged 3 to 7" goes slightly too far: the
  commentary names measurement tools for ages 3 to 6, though it reports no finding at those ages.
- **C42:** no excerpt file was saved for the CDC 18-month page; the milestone was re-found in Zubler
  2022, Table 4.

## 6. Footnote mechanism in the design system

**Finding: DS v11 cannot express "marker + linked source note".** Gap paragraph for the orchestrator:

> DS v11 has no footnote, citation or "Sources" component: none in `components/` or
> `index.d.ts`, and none in the [component map](../design-system/component-map.md). It has the parts
> for the note text only: the type token `kh-body-s`, whose stated use includes "footnotes"
> (`tokens.json:411`), `kh-caption` for "attributions [...] legal fine print" (`tokens.json:452`), and
> a `--link` colour (`tokens.css:33`, `:59`). It has no style for an inline superscript marker, no
> style for a link inside running text (link styles exist only inside components, such as
> `.kh-card__link` at `bundle.css:210` and `.kh-announce a` at `:410`), no numbered notes list and no
> back-link from note to marker. A superscript numeral is also far below the DS's own 48 × 48
> `tap-min` for parents (`08-accessibility.md:33`), the same class of problem as
> [G-01](../design-system/gaps.md#g-01). Props typed `ReactNode` can carry a composed marker (FAQ
> answers, FeatureCard children, SectionHeading `lead`, TrustList and StepLoop `body`;
> `index.d.ts:47, 65, 71, 89, 129`), but string-only props cannot: OfferCard `fine` (`index.d.ts:105`)
> and ComparisonTable `caption` (`:123`). Markers inside FAQ answers sit in closed `<details>`, so the
> notes list must work for content hidden at load, and the journal articles that will carry most
> notes have no article template yet ([G-11](../design-system/gaps.md#g-11)). The pre-reset site had
> its own `Footnote` and `FootnotesRow` (`src/components/molecules/FootnotesRow.tsx`: a superscript
> link to an ordered list, numbering synced by hand), which is not part of the DS. What is needed: an
> inline marker with an extended 48 px tap area and an accessible name ("Source 1"), a per-page
> ordered "Sources" list in `kh-body-s` carrying publisher or authors, title, year, section or page
> and URL, and a back-link to each marker. Owner: the founder (DS owner) with the Architect.

## 7. Before any line is published

- **Founder sign-off** on every line at Gate A ([D015](../decisions/D015-founder-signs-off-copy.md)),
  and the G5 call on C16.
- **Re-read the sources that change:** the chatbot terms (C37), the DPDP Gazette for the
  commencement date (C20), the Harvard key concept pages (C05, C07, C44 all show recent edits), the
  Brookings commentary (C14), Common Sense Media's pages (C16) and the CDC milestone pages (C42), including
  the "3-year-old not talking in sentences?" article
  ([talking-late-or-talking-little](../site/pages/story-talking-late-or-talking-little.md); CMO review 5.18 M4,
  [CMO review 5.20b](../qa/cmo-review-article-fixes-5.20b-2026-10-14.md) question 4).
- **Update 2026-10-14:** [source verification, 2026-10-14](source-verification-2026-10-14.md) re-read C34
  (Tisseron's 2020 3-6-13-18 markers about AI, and the "De 3 à 6 ans" daily minutes, both SUPPORTED) and C42 (the
  CDC "sentences with four or more words" item at 4 years, and the 30-month items against Zubler 2022 Table 4,
  SUPPORTED), with ready lines. Its finding on Tisseron's markers ("no connected toys before 6") is open question P25.
- **Counsel** for the legal lines (C20) and for the C37 hold.
- **What could not be read**, so nothing here leans on it: Chouinard 2007 chapter II (C13); the
  published version of Xu 2024 (C12); the full Hiniker 2016 paper (C35, abstract only); the AAP
  publisher site (read from the publisher's archived full text); NCBI Bookshelf for the WHO guideline
  (the WHO's own PDF was read instead).
- **Live lines to retire or rewrite** when the journal is rebuilt are listed in the caveats above,
  claim by claim; the keyword-map drafts ST2, ST3, SR2 and the [CITE] placeholders follow the same
  rows.
