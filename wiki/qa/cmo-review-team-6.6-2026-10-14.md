---
title: "CMO review of the fix pass: /team copy for task 6.6 (D054 item 20: background lines, photos, the recognition strip), 2026-10-14"
type: qa
updated: 2026-10-14
sources:
  - "../site/pages/team.md (Copywriter's fix pass, task 6.6; worktree w6b-6.6, `git diff HEAD`; HEAD's copy of the page is the Gate A commit 42a65b3, D046)"
  - "../decisions/D054-founder-answers-open-questions-2026-10-14.md (item 20, lines 76-83); D046; D038 (line 14, amended); D015"
  - "archive/pre-reset-2026-10-10:src/app/(site)/team/page.tsx (lines 44, 58, 94: the three live bios; read with git show, 2026-10-14)"
  - "archive/pre-reset-2026-10-10:src/components/organisms/RecognitionStrip.tsx (lines 15-32, 58-75; identical to the working-tree file, diff 2026-10-14)"
  - "../raw/research/geo/site-files-2026-10-10/home-jsonld.json (lines 22, 44); ../raw/research/geo/engine-captures-2026-10-10/bing-prompts.json (line 406); ../raw/research/geo/site-files-2026-10-10/llms.txt (lines 78-79)"
  - "../product/claims.md (§4 retired or banned wording; §6 certifications); ../product/facts.md (company facts, lines 278-309); ../site/gate-a-open-items.md (B24-B26); ../site/content-boundary.md (grey list, line 47)"
  - "../brand/voice.md (rules 1, 6); ../brand/positioning.md (BIS under application, L1)"
  - "design-system/project/01-writing.md:23, 69-70; 07-selling.md:71-72 (read-only)"
  - "public/team/{apoorva,aman,kashyap}.jpg and public/recognition/{nvidia-inception,karnataka-seal,nasscom}.png (viewed by eye, 2026-10-14)"
  - "test/guards/banned-phrases.data.ts (findBanned, 51 entries, node 24.13.0, 2026-10-14: 0 hits over the 60 quoted lines of team.md and the three founder alts; 1 hit, us-program, on the alt 'NVIDIA Inception Program')"
---

# CMO review of the fix pass: `/team` copy for task 6.6

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). This reviews the four fixes that
> [D054](../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20 asked for on the Gate A-approved
> [team copy](../site/pages/team.md) ([D046](../decisions/D046-gate-a-approved.md)). It is a copy review before the
> build, so there are no screenshots, motion or Lighthouse results yet; those come in the post-build CMO review. It is
> input only: the founder alone signs off copy ([D015](../decisions/D015-founder-signs-off-copy.md)).

## Verdict

**PASS. Nothing blocks.** All four fixes are applied as asked. Each background line traces to the founder's live bio at
the tag, with nothing added and nothing rounded up. The retired model wording is absent. The recognition fold names the
four programmes exactly as the live strip did and claims no relationship. No approved line moved.

There are four minor findings:

- **M1** is the most important one for the founder. `karnataka-seal.png` is the Government of Karnataka's state
  emblem, not a Karnataka Elevate mark.
- **M2:** the word "certification" in Kashyap's line.
- **M3:** a build-side spelling-guard ruling on the NVIDIA alt.
- **M4:** source and note hygiene.

| Page | Verdict | Blocking | Minor |
|---|---|---|---|
| [Team (`/team`)](../site/pages/team.md) | **PASS** | none | M1 (founder, then Copywriter), M2 (Copywriter; founder Q4), M3 (main session, then Builder), M4 (Copywriter, notes only) |

## The four fixes

| # | Fix asked (D054 item 20) | Where | Status | Check |
|---|---|---|---|---|
| 1 | Fold 3: each `[PLACEHOLDER F11: …]` becomes that founder's background line, from the live bio; one or two sentences; live facts only; never "the small language model we train ourselves" | `team.md:127, 133, 139` | **Applied** | See "Facts against the tag" below. Sentence counts: 2, 1 and 2. The banned model wording is absent from every quoted line. |
| 2 | Fold 3 photos: the B24 placeholder goes; the photos are the live site's, with the drafted alts | `team.md:146-149` | **Applied** | The B24 placeholder option is gone. The files are `public/team/apoorva.jpg`, `aman.jpg` and `kashyap.jpg`, the live site's (the tag's `page.tsx:39, 53, 89`). The alts are unchanged from Gate A and accurate (see "Photo alts"). |
| 3 | Fold 5 "Recognised by.": shown, naming the programmes as the live strip did, with the three marks; Founders Inc as text; names only (B26) | `team.md:224-233` | **Applied** | Order, names, marks and alts match the tag's `RecognitionStrip.tsx` exactly (lines 15-29 and 58-75): NVIDIA Inception Program as a mark with alt; the seal (alt `""`) beside "Karnataka Elevate"; nasscom startups as a mark with alt; "Founders Inc" as text. The H2 "Recognised by." is unchanged. No "backed by", "funded by", "partner", "investor" or "member of" anywhere. See M1 on the seal. |
| 4 | Update the notes (placeholders, sources, the D038 proof-gate notes) | front matter; `team.md:142-172, 228-244, 297, 308-357` | **Applied** | The placeholders table now reads "None". The D038 hidden-slot notes now point to D054. Questions 1 and 2 are marked answered, and 3 to 5 are new. `memberOf` is ruled out of the JSON-LD (B26). A Person description must use the fold 3 line, never the live one. A "Changes after approval" table was added. See M4 for three leftovers. |

**No other line changed.** `git diff HEAD -- wiki/site/pages/team.md` changes no quoted Copy line except the three
fold 3 placeholders and the fold 5 placeholder. The hero, fold 2, the names, roles, job lines and LinkedIn links of
fold 3, fold 4, the "Recognised by." H2 and fold 6 are byte-identical to the Gate A text.

## Facts against the tag

Read with `git show 'archive/pre-reset-2026-10-10:src/app/(site)/team/page.tsx'`, which closes the copywriter's
verification gap (`team.md:354-357`).

| Founder | New line (`team.md`) | Live bio at the tag | Verdict |
|---|---|---|---|
| Apoorva (`:127`) | "He is a Chartered Accountant with 15 years in finance and company-building. He was the first student at his family's pre-school, in 1994." | `:94`: "his family runs the pre-school where he was the first student, in 1994 … Fifteen years in finance and company-building later, he is a Chartered Accountant who learned to ship AI." Also the live Person description: "Chartered Accountant with fifteen years in finance and company-building" (`home-jsonld.json:22`) | **PASS.** Same facts. "15" is "Fifteen" in numerals (DS `01-writing.md:23`). Nothing rounded. "Learned to ship AI" and the coaching centre are left out, which is allowed. |
| Aman (`:133`) | "He studied AI, shipped machine learning in production, and holds 14 patents filed in his own name." | `:44`, verbatim, the same sentence (also `bing-prompts.json:406`) | **PASS.** Verbatim. "Filed" is kept, so it does not become "granted". "The small language model we train ourselves" is out (claims §4 row 7). |
| Kashyap (`:139`) | "He has spent over a decade in hardware, taking products from a blank page to certification. That includes years at Intel, leading Thunderbolt 4 and 5 compliance." | `:58`: "Over a decade, including years at Intel leading Thunderbolt 4 and 5 compliance, he took hardware from a blank page to certified products on real shelves." The live Person description: "has taken products from a blank page to certification for over a decade" (`home-jsonld.json:44`) | **PASS** on facts: nothing added or inflated. "The Kheelona Magic Box", "the battery that lasts" and "safe to hug" stay out. See M2 on how "certification" reads under "builds the toy itself". |

## Per criterion

| Criterion | Verdict | Evidence |
|---|---|---|
| Every fact traced to the live bio at the tag or to D054; no new claim; nothing rounded up | **PASS** | The table above. Fold 5 names match the tag's strip and the live `/llms.txt:78-79`. |
| Retired or banned wording never used (claims §4; `banned-phrases.data.ts`) | **PASS** | `findBanned` over all 60 quoted lines and the three founder alts: 0 hits. No "own the model" family, "safe" alone, "toddlers" or advisor. "Certification" is in neither claims §4 nor the guard; DS `01-writing.md:69` is about product claims (M2). |
| Recognition fold: programmes named only, no investment, endorsement or "backed by" claim | **PASS (words)** | The label is the DS's and the live one. No relationship is stated. `memberOf` is dropped from the JSON-LD (`team.md:330`). The seal is a visual risk: M1. |
| Photo alts describe the people plainly | **PASS** | Checked by eye. Apoorva: glasses, black T-shirt. Aman: glasses, olive crew-neck sweater. Kashyap: smiling, beige T-shirt with orange and grey stripes. No adjectives, no claim. |
| Positioning and voice: for parents of 3-7 | **PASS** | The lines are short and specific (voice rule 6), and "AI" appears only in body text (rule 1). The pre-school line ties the team to early years. The credentials answer the page's job: "is this a real company, and can they build it?". The content boundary's grey list (`content-boundary.md:47`) asks for short credentials; these are one or two sentences each. |
| Internal leakage (survey figures, competitor names or prices, unit counts, analytics) | **PASS** | None in any changed line, alt or builder note. |
| One obvious next step | **PASS (unchanged)** | Fold 6 is "Pre-order Kheelu", `cta` = `finale`. Fold 5 has no outbound links, as live. |
| Every other line unchanged from the approved page | **PASS** | `git diff`, as above. |
| Screenshots (phone and laptop), motion, Lighthouse, ad-landing readiness | **Not applicable yet** | No built page. These are due in the post-build CMO review of task 6.6. |

## Issues

### M1 (minor, founder first, then Copywriter): the "Karnataka seal" is the Government of Karnataka's state emblem

- **What.** `public/recognition/karnataka-seal.png` (viewed 2026-10-14) is the state emblem: the Gandabherunda with
  the lion capital on top, ringed by the words "GOVERNMENT OF KARNATAKA". It is not a Karnataka Elevate programme mark.
- **Why it matters.** Under "Recognised by.", a government seal on a toy company's page can read to a parent as
  government approval of the company or of Kheelu. The DS rules this out: "never endorsements of the product"
  (`01-writing.md:70`) and "certified or approved (until true)" (`01-writing.md:69`). Kheelu holds no certificate,
  and BIS is under application (claims §6; L1). The DS also says "Use logos only with permission"
  (`07-selling.md:71`), and the wiki holds no permission record. The copy's words are fine. The copywriter was
  right to raise this as question 3 (`team.md:322`). Not legal advice.
- **Why it is not blocking.** The founder ordered the three marks by name (D054 item 20), the fix asked for
  `karnataka-seal.png` beside its name, and the live site shows it today. This verdict does not replace the
  founder's.
- **Fix (CMO recommendation; the founder decides on question 3).** Unless the founder holds Karnataka Elevate's
  written terms allowing its startups to use this seal, show "Karnataka Elevate" as text only, as Founders Inc
  already is. In `team.md:226`, change ``· `[seal: karnataka-seal.png]` Karnataka Elevate ·`` to
  `· Karnataka Elevate ·`. Then delete the seal alt bullet (`:232`), and in `:228` change "the Karnataka seal sits
  beside the words 'Karnataka Elevate'" to "Karnataka Elevate is text only". The row keeps all four names. If the
  founder keeps the seal, leave its alt empty, as live. Do not write "Government of Karnataka" into the alt: that
  would turn the visual risk into a stated relationship.

### M2 (minor, Copywriter; founder question 4): "certification" in Kashyap's line reads as if it could cover Kheelu

- **What.** `team.md:139`: "He has spent over a decade in hardware, taking products from a blank page to
  certification." The fact is live (the tag's `:58`; `home-jsonld.json:44`), and the fix listed it. But the present
  perfect, right under "Kashyap builds the toy itself", lets a parent read "certification" as part of the work on
  Kheelu. Kheelu holds no toy-safety certificate, and its BIS licence is not granted (claims §6). The live bio's own
  past tense ("he took hardware … to certified products") reads as a track record.
- **Fix (keeps every live fact, adds none).** Replace `team.md:139` with: "Over a decade in hardware, including years
  at Intel leading Thunderbolt 4 and 5 compliance, he took products from a blank page to certification." This is one
  sentence of 24 words, the live sentence's own shape and tense, and the guard finds nothing in it. Update question 4
  (`:323`) to offer it as option (c), and make it the CMO's pick over (a) as written and (b) dropping the clause.
  Option (b) loses a fact the founder asked to show.

### M3 (minor, main session, then Builder): the NVIDIA alt against the en-IN spelling guard

- **What.** The alt "NVIDIA Inception Program" (`team.md:230`) matches the guard's `us-program` entry
  (`test/guards/banned-phrases.data.ts:134`; confirmed with `findBanned`). The copy page passes because the Copy
  block names the file, not the alt. The build will fail as soon as the alt is a content string. The content module
  still says `programme("NVIDIA Inception")` behind the D038 gate (`src/content/en-IN/pages/team.ts:146`).
- **Fix.** Rule option (a) of question 5 (`team.md:324`). An alt says what the image says; the mark reads "NVIDIA
  INCEPTION PROGRAM"; it is the live alt and the name the fix asked for; and the programme's name is not ours to
  respell. Add a narrow allowance to `us-program`: `allowSentence: /^NVIDIA Inception Program$/`, the same pattern as
  `lumi` and `us-center`. Builder, in task 6.6:
  - set the entry's name to "NVIDIA Inception Program";
  - drop the gated `background()` and `programme()` helpers (`team.ts:36-39`);
  - update the absence assertions (`src/content/en-IN/pages/team.test.ts:280`,
    `src/app/(site)/team/page.test.tsx:168`) and the team rules in `test/e2e/support/deviations.ts`;
  - add the three marks to `sections/RecognitionStrip` (`team.md:331`);
  - update `mockup/team.html`.

### M4 (minor, Copywriter, notes only): sources and one stale note

- **What, and the fix.**
  1. The fold 3 sources cite the tag without line numbers (`team.md:165, 166, 168`). The pre-school row rests on "as
     recorded … in this page's F11 placeholder", a placeholder that is now gone. Cite the tag lines this review
     read: Apoorva `archive/pre-reset-2026-10-10:src/app/(site)/team/page.tsx:94` (both facts), Aman `:44`
     (verbatim), Kashyap `:58`. Do the same for the strip in the fold 5 sources (`:240, 243, 244`):
     `archive/pre-reset-2026-10-10:src/components/organisms/RecognitionStrip.tsx:15-29, 32, 58-75`, identical to
     the working-tree file.
  2. Delete "One check for the main session" (`team.md:354-357`), or mark it done with a link to this review: the
     comparison with the tag is made above and matches.
  3. `team.md:152` still says Kashyap's pull-quote stays out because it "rests on unproven credentials and
     'certified'". D054 lifted the proof gate, so give the reason that still holds: "Kashyap's says 'a safe, certified
     toy', a certification claim about Kheelu (claims §6) and 'safe' alone."

## Optional (the founder's taste, not failures)

- **Apoorva's order.** Leading with the pre-school line ("He was the first student at his family's pre-school, in
  1994. He is a Chartered Accountant with 15 years in finance and company-building.") puts the warmer, early-years
  detail first for a parent. The facts are the same; this is a choice, not a fix.
- **Jargon.** "Shipped machine learning in production" and "Thunderbolt 4 and 5 compliance" are engineer's words.
  "14 patents" and "Intel" carry the trust for a parent. The founder asked for the live facts, so they stay unless the
  founder prefers plainer words.

## How this was checked

- `git diff HEAD -- wiki/site/pages/team.md` in the worktree. HEAD's copy is the Gate A commit (`42a65b3`, D046).
- `git show` of the tag's `team/page.tsx` and `RecognitionStrip.tsx`, and a diff of the latter against the working
  tree (identical).
- The raw captures quoted in the page's sources: `home-jsonld.json:22, 44`, `bing-prompts.json:406` and
  `llms.txt:78-79`, each matching the quote cited.
- `findBanned` from `test/guards/banned-phrases.data.ts` (51 entries), run with node 24.13.0 from the session
  scratchpad, over the 60 quoted lines, the five alts and the proposed M2 line.
- The three photos and three marks, viewed by eye.
- D054 item 20; claims §4 and §6; facts lines 278-309; gate-a-open-items B24-B26; content-boundary line 47; voice
  rules; DS `01-writing.md:23, 69-70` and `07-selling.md:71-72`.
