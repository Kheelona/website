---
title: "Source excerpt (ABSTRACT ONLY): Chouinard 2007, Children's questions, Monographs of the SRCD (C13)"
type: source-excerpt
updated: 2026-10-10
sources: ["https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:17394580%20AND%20SRC:MED&resultType=core&format=json", "https://pubmed.ncbi.nlm.nih.gov/17394580/", "https://academic.oup.com/srcdmo/issue/72/1", "https://academic.oup.com/srcdmo/article/72/1/14/8250887", "https://doi.org/10.1111/j.1540-5834.2007.00412.x"]
---

# Chouinard (2007), *Monographs of the Society for Research in Child Development* 72(1)

- **Citation:** Chouinard MM. "Children's questions: a mechanism for cognitive development."
  *Monographs of the Society for Research in Child Development*, 2007; 72(1). DOI
  10.1111/j.1540-5834.2007.00412.x. PMID 17394580. Per the Oxford Academic table of contents: six
  chapters on pp. 1-108, then references, and commentaries by Paul L. Harris (pp. 113-120) and
  Michael P. Maratsos (pp. 121-126).
- **What could be read (2026-10-10, plain GET, no login):**
  - The PubMed abstract, through the Europe PMC record for PMID 17394580 (`isOpenAccess: N`).
  - The Oxford Academic issue table of contents (the SRCD Monographs back issues now sit there),
    read through the WebFetch tool: chapter II is "Analysis of the CHILDES Database, pp. 14–44";
    every item is marked "available to Subscribers Only".
  - The Oxford Academic page for chapter II, read through WebFetch: an extract only, "You do not
    currently have access to this article". The tool reported the extract gives the age range
    "children aged 1;2–5;2 years" and a research question, and **no questions-per-hour figure**.
- **What could NOT be read:** the monograph text itself. Wiley Online Library (the DOI target)
  returned HTTP 403 to both curl and WebFetch; Oxford Academic returned 403 to curl and only the
  extract to WebFetch; no author or repository copy was found by search. **So the "76 per hour"
  figure was NOT seen in Chouinard's own words.**
- **Typography note:** no em dashes in the passages below; words verbatim.

## Exact passages (abstract)

**Locator: PubMed abstract, the Study 1 sentences**
> "Study 1 analyzed questions taken from four children's transcripts in the CHILDES database (age
> 1;2-5;1). This methodology allowed detailed, veridical analysis of every question asked by the
> children during their recording sessions. Results indicate that children ask many
> information-seeking questions and get informative answers. When they do not get an informative
> response, they keep asking; attention is not enough."

**Locator: PubMed abstract, the Study 4 sentences (the only causal test in the monograph)**
> "Sixty-seven 4-year-olds were asked to figure out which of two items were hidden in a box. Half of
> the children were allowed to ask questions to help them figure this out. Despite many ways in which
> they could fail to use questions correctly, children who were allowed to ask questions were
> significantly more likely to identify the object hidden in the box, an overt indication of their
> change in knowledge state."

**Locator: PubMed abstract, closing sentence**
> "Thus, the ability to ask questions is a powerful tool that allows children to gather information
> they need in order to learn about the world and solve problems in it."

The abstract gives **no per-hour rate**. It says "many".

## How the figure is reported by others (secondary, for comparison only)

- Lazaroff and Vlach (2022): "an average of 76 information-seeking questions per hour by the time
  they reach preschool age" ([C13-lazaroff-vlach-2022-frontiers.md](C13-lazaroff-vlach-2022-frontiers.md)).
- Frazier, Gelman and Wellman (2009), describing Study 1 specifically: "These information-seeking
  questions were frequent, occurring at an average of 76 per hour"
  ([C13-frazier-gelman-wellman-2009-secondary.md](C13-frazier-gelman-wellman-2009-secondary.md)).
- Ruggeri, Lombrozo, Griffiths and Xu (2016): "preschool-aged children ask on average over 100
  questions per hour (Chouinard, 2007)"
  ([C13-ruggeri-2016-secondary.md](C13-ruggeri-2016-secondary.md)).

The two figures are compatible if 76 is the information-seeking subset and "over 100" is all
questions, but that reconciliation is an inference; it was not checked against the monograph.
