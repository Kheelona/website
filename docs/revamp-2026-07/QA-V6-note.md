# QA note: independent content review, V6 round (2026-07-31)

**VERDICT: REJECT — the listed blockers must be fixed first.** All four are line-edits; nothing structural. The round otherwise succeeds at its brief: the "what does my child get from 2 to 5" question is now answered clearly and credibly, and cross-page fact discipline is the best I have seen on a pre-order site. The blockers are the handful of places that discipline did not reach, and three of the four sit exactly where a skeptical parent or a lawyer would look first.

Reviewed: / , /products/lumi , /playos , /safety , /setup , /team , /stories , /contact , /privacy , /terms , the 404, /llms.txt , /pricing.md , all 19 journal article pages (6 read in full: the two Home-linked pieces plus the bilingual, toy-that-listens, should-kids-use-AI, and AI-tutor articles), FAQ JSON-LD on / , /products/lumi , /safety, the Product JSON-LD, and the live Tally form's field list (read only, nothing submitted).

---

## BLOCKERS

### B1. /privacy misdescribes what the reservation form collects — and the real form disagrees
- **Page:** /privacy (with a matching error on /contact)
- **Line:** "When you reserve Lumi, we ask for your name, your email, your WhatsApp number, your child's birth month, and your city." followed by "That is the whole list."
- **Reality:** the live Tally form (Y5XW7J) collects exactly five fields: Parent name, Kid's age (a number), City, WhatsApp number, and a required WhatsApp-consent checkbox. **No email field exists. No birth-month field exists.**
- Downstream breakage on the same page: "Reply to any email we have sent you and ask. That is all it takes." (Leaving the list) — there is no email thread to reply to, so the published exit route does not work. /contact repeats the email claim: "we write to you about your reservation by email, and on WhatsApp if you say yes to that."
- **Why it matters:** this site's entire pitch is "we tell you the truth about data." The privacy page — the page that says "It is written to be read" — asserts a collection list that is false in both directions, then closes with "That is the whole list." That is a trust wound and a DPDP-shaped compliance exposure on a live commercial site. Fix the list to the five real fields, fix the birth-month rationale ("Your child's birth month helps us plan for the right ages" → age), and give parents a leave-the-list route that actually exists (WhatsApp reply or hello@kheelona.com).

### B2. /terms promises the ₹4,999 hold to "everyone", the cap says 500 — on the same page
- **Page:** /terms
- **Line:** "The ₹4,999 price is held for everyone who joins the list before launch." Three scroll-lengths later, the reserve strip on the same page: "First 500 at ₹4,999. ₹9,999 after launch. The cap is real, not a countdown."
- **Why it matters:** if family number 501 joins before launch, the terms page has promised them the hold and the cap has denied it. Price wording must be identical everywhere; this is the one surface where it is not, and it is the legally-flavoured surface. One sentence fixes it: "The ₹4,999 price is held for the first 500 families on the list."

### B3. One journal article flat-claims "ten languages"; the site's ceiling is "up to 10" with 8 named
- **Page:** /stories/raising-a-bilingual-child-in-india
- **Line:** "Lumi speaks ten languages so the friend can meet your family where it lives, not drag it toward English."
- **Why it matters:** every other surface — Home footnote, both FAQ sets, llms.txt, pricing.md, and the two other articles that mention languages ("in up to 10 home languages") — holds the sanctioned line: 8 named, "up to 10" at launch. This is the only sentence on the site that commits to ten. If launch lands at nine, this article is the receipt. Two-word fix: "speaks up to ten languages."

### B4. /pricing.md carries four em-dashes; the voice law is zero
- **Page:** /pricing.md (served, public, and the page llms.txt sends AI agents to)
- **Lines:** "# Pricing — Lumi by Kheelona" · "Pre-order price: ₹4,999 — the first 500 units" · "Kheelu Speaker, ages 5 to 14 — in development, price not announced" · "AI books, ages 2 to 14 — in development, price not announced"
- **Why it matters:** the em-dash ban is absolute and machine-readable pages are still published content. llms.txt, by contrast, is clean, so this is the only offending surface. Mechanical fix: colon or comma in all four spots.

---

## MAJOR

### M1. /team says "Backed by" over the same four logos every other page calls "Recognised by"
- **Page:** /team ("Backed by") vs / and /playos ("Recognised by") — identical logo row: NVIDIA Inception Program, Karnataka Elevate, nasscom startups, Founders Inc.
- **Why it matters:** "Backed by" is an investment claim. NVIDIA Inception and nasscom startups are recognition programs, not backers; presenting them as backing is the kind of overclaim the rest of the site is scrupulous about avoiding ("No badge appears here before it is earned"). The code passes `label="Backed by"` only on /team, so this is a one-prop fix — pick one truthful label and use it everywhere.

### M2. /setup promises a minutes-long day one and never mentions WiFi
- **Page:** /setup
- **Lines:** "Four steps, no manual required." Steps: unbox and charge → open the parent app → teach the hello → step back and listen. Meanwhile the rest of the site is (correctly) precise that "AI mode runs on your home WiFi."
- **Why it matters:** connecting the toy to home WiFi is the single most failure-prone step of any smart device and the one a skeptical parent will look for on a setup page. Its absence undercuts the page's whole job (defusing setup anxiety) and sits oddly beside the site's own mode-precise connectivity answers. One clause inside step 2 ("connect Lumi to your home WiFi, set the languages…") closes the gap honestly.

---

## NITS

- **N1. /playos:** the top ArchitectureStack layer carries a bare "WiFi operated" chip. Every other connectivity statement on the site names the mode ("AI mode runs on your home WiFi"; Kheelu mode offline). A parent skimming the chips could conclude the toy is dead without WiFi, which Home's own "On the train — No signal? Kheelu-mode stories still play" contradicts. Suggest "AI mode on home WiFi".
- **N2. / (Home):** "One friend inside. More bodies on the way." — "bodies" is platform-architecture language (fine on the investor-voiced /playos: "many bodies", "the first body") that reads faintly eerie on the parent-facing homepage, in a section about a child's toy. Consider "More friends on the way."
- **N3. All FAQ sections:** only the first answer is present in the served HTML; the other answers exist solely in the FAQPage JSON-LD until the reader expands them with JavaScript. Search engines are covered; a no-JS reader or a DOM-reading agent sees eight questions and one answer. Worth server-rendering the answer bodies.
- **N4. /setup:** "only one of the four is yours to do alone" is a riddle — it is never said which one, and a first-time reader stalls on it. Either name the step or cut the clause.
- **N5. / (Home), feelings room:** the copy says "Lumi knows five feelings" while all five illustrations are Kheelu, the orange mascot. The site is otherwise careful to keep product and mascot separate; this is the one room where a first-visit parent could conflate the character in the pictures with the toy they are buying. A caption naming Kheelu ("Kheelu shows the five feelings Lumi knows") would keep the line clean.

---

## WHAT WORKS — do not touch

- **The question is answered, and answered where people look.** The Home "What your child gets, year by year" room (At 2 / At 3 / At 4 / By 5, ending "All of it walks into their first classroom with them") is the single best section of the site, and it is honest: hedged with "Every child grows at their own pace. Lumi follows theirs" rather than any outcome guarantee. The FAQ "What will my child actually get out of Lumi?" and the product page's "First words at 2 become stories, numbers, and questions by 5" reinforce it at two more depths. The parents' complaint from the last round is genuinely fixed.
- **The connectivity answer is best-in-class.** "For open conversation, yes: AI mode runs on your home WiFi. For everything else, no…" — mode-precise everywhere it appears, including llms.txt line 14, with zero blanket "works offline" claims anywhere on the site (verified by sweep).
- **The hero-to-finale spine holds.** "A best friend at 2. A head start by 5." is planted in the hero, paid off in the year-by-year room, echoed on the product page, and every route lands on the same white reserve finale with identical price/cap/date cards. Nothing is orphaned.
- **The trust register is distinctive and consistent.** "You do not have to trust a badge. You can check." · "The cap is real, not a countdown." · the status-honest standards table (Designed for / In progress, no earned badge claimed) · "We publish the full specs, battery, size, materials, and the wake word, before Lumi ships." The wake word, Kheelona+ pricing, hardware specs, and certifications are correctly gated on every surface checked.
- **The journal is genuinely good.** "Should kids use AI?" opening with "No, your child should not use AI. Not the AI most people mean by the word" and the AI-tutor article's "no, a three-year-old does not need an AI tutor" are the most credible pieces of marketing on the site. The bilingual article ("The mother tongue is not in the way of your child's future. It is under it") is the emotional high point — fix its one sentence (B3) and leave the rest alone.
- **Voice discipline is near-perfect.** Zero em-dashes on every HTML page (only pricing.md offends), zero italics, no hype vocabulary, no contractions outside the two sanctioned Lumi speech bubbles, second-person present throughout.
- **Testimonials:** the three pilot-parent quotes (Shweta, Priyamvada, Gaurav) are word-for-word unchanged from main — the settled decision is respected.

---

## FACTS TABLE (verified per page)

| Page | Lumi ages | Platform ages | Price ₹4,999/first 500 · ₹9,999 after | Ship 1 Sep 2026 | Languages 8 named / "up to 10" | Connectivity mode-precise | Kheelona+ per sanctioned line |
|---|---|---|---|---|---|---|---|
| / (Home) | 2 to 5 ✓ | 2 to 14 ✓ (Speaker 5 to 14, books 2 to 14) | ✓ | ✓ | ✓ (footnote + FAQ) | ✓ (day strip + FAQ) | ✓ |
| /products/lumi | 2 to 5 ✓ (incl. Product JSON-LD 2–5) | 2 to 14 ✓ | ✓ (JSON-LD offer 4999 INR, PreOrder, 2026-09-01) | ✓ | ✓ | ✓ (FAQ + modes) | ✓ |
| /playos | 2 to 5 ✓ (stack chip) | 2 to 14 ✓ | ✓ (finale) | ✓ (finale) | "Up to 10 home languages" ✓ | ⚠ bare "WiFi operated" chip (N1) | ✓ (finale) |
| /safety | ✓ (no band stated; "three-year-old" within band) | — | ✓ (finale) | ✓ (finale) | — | ✓ (mechanisms) | ✓ (finale) |
| /setup | — | — | ✓ (finale) | ✓ (finale) | — | ⚠ WiFi step missing (M2) | ✓ (finale) |
| /team | — | — | ✓ (finale) | ✓ (finale) | — | — | ✓ (finale) |
| /stories index | ✓ (titles consistent) | — | ✓ (finale) | ✓ (finale) | — | — | ✓ (finale) |
| /contact | — | — | ✓ (finale) | ✓ (finale) | — | — | ⚠ "by email" claim (B1) |
| /privacy | — | — | ✓ | ✓ ("the 1 September 2026 ship date") | — | — | ✗ collection list wrong (B1) |
| /terms | — | — | ✗ "held for everyone" vs 500 cap (B2) | ✓ | — | — | ✓ (finale) |
| 404 | — | — | ✓ (finale) | ✓ (finale) | — | — | ✓ (finale) |
| /llms.txt | 2 to 5 ✓ | 2 to 14 ✓ (Speaker 5 to 14) | ✓ | ✓ | ✓ (8 named, up to 10) | ✓ (line 14, mode-precise) | ✓ (6 months, lifetime smart features, pricing soon) |
| /pricing.md | 2 to 5 ✓ | Speaker 5–14, books 2–14 ✓ | ✓ | ✓ | ✓ | ✓ (modes line) | ✓ — but 4 em-dashes (B4) |
| Journal (19 articles swept, 6 read) | ✓ ("under five", "3 to 6" only as sleep research) | — | ✓ (finales only) | ✓ (finales only) | ✗ one flat "ten languages" (B3); two correct "up to 10" | ✓ (no offline claims) | ✓ (finales only) |

Never-stated gates verified across all surfaces: no Kheelona+ ₹ amount, no received certification, no wake word, no hardware specs, no guaranteed developmental outcomes. All clean.

---

# ADDENDUM: re-verification after commit 9688ef0 (2026-07-31)

**FINAL VERDICT: APPROVE — ship it.** Every blocker and major is fixed in the rendered output, the fixes introduce no new inconsistency, and a full before/after text diff of all ten routes plus pricing.md, llms.txt, and the bilingual article shows exactly the dispositioned changes and nothing else. Voice re-swept clean (zero em-dashes anywhere, the only contractions are the two sanctioned Lumi speech bubbles).

## Per-finding verification

| Finding | Status | Verified rendered line |
|---|---|---|
| B1 privacy/contact vs real form | **FIXED** | /privacy: "we ask for your name, your child's age, your city, your WhatsApp number, and your consent before we contact you on WhatsApp." · "Why we ask" now leads with the WhatsApp number and child's age · Leaving the list: "Reply to any WhatsApp message we have sent you, or write to hello@kheelona.com." · /contact: "we write to you about your reservation on WhatsApp, with your consent." All five claims now match the live form's five fields. |
| B2 terms hold vs 500 cap | **FIXED** | /terms: "The ₹4,999 price is held for the first 500 families on the list." No longer contradicts the cap. |
| B3 "ten languages" flat claim | **FIXED** | /stories/raising-a-bilingual-child-in-india: "Lumi speaks up to ten languages so the friend can meet your family where it lives". |
| B4 pricing.md em-dashes | **FIXED** | "# Pricing: Lumi by Kheelona" · "₹4,999 for the first 500 units" · two colons in the family section. Zero em-dash characters served. |
| M1 "Backed by" on /team | **FIXED** | /team logo row now reads "Recognised by", matching / and /playos. |
| M2 /setup missing WiFi step | **FIXED** | Step 2: "Connect Lumi to your home WiFi, set the languages you speak at home, …" — and the HowTo JSON-LD step text mirrors it word for word. |
| N1 bare "WiFi operated" chip | **FIXED** | /playos chip now "AI mode on home WiFi". |
| N2 "More bodies on the way" | **FIXED** | Home: "One friend inside. More friends on the way." (/playos keeps its investor-voiced "bodies", which is its sanctioned register.) |
| N3 FAQ answers not server-rendered | **DEFERRED — accepted.** It is a component change, not a copy edit, and FAQPage JSON-LD already carries every answer, so search engines and AI crawlers are covered in the meantime. Belongs on the design-team follow-up list as logged. |
| N4 /setup riddle clause | **FIXED** | Intro now ends "…made for homes, not IT departments." The clause is cut. |
| N5 feelings lede conflation | **FIXED** | Home: "Kheelu acts out the five feelings Lumi knows. Feeling comes first, and the learning follows." Mascot and product are now cleanly separated. |

## Residual observations (not blocking, no action required)

- /terms now denominates the cap in "families" ("the first 500 families on the list") while the finale cards say "First 500 units". Same cap, same promise; the wording is natural and I accept it. If a family ever reserves two units the two phrasings could technically diverge, so if the sentence is ever touched again, "the first 500 reservations" would close even that gap.
- /privacy's analytics section still contains the word "email" ("None of them ever sees your name, your email, or anything you type into the reservation form") — this is a true statement about what the measurement tools cannot see, not a collection claim. Correct as written.

## Regression sweep

Before/after diff of the extracted text of / , /products/lumi , /playos , /safety , /setup , /team , /stories , /contact , /privacy , /terms: only the eleven dispositioned edits appear. pricing.md diff shows only the four em-dash repairs; llms.txt is byte-identical; the bilingual article changed by exactly two words. Testimonial words, prices, ship date, age bands, language facts, connectivity lines, and every gated topic re-verified unchanged and clean.
