---
title: "Team (/team): page copy, Gate A mockup draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§2 journey row 6, §3.2-3.3 CTA rules, §4.4 navigation, §5 /team row, §7 search rules)
  - home.md (shared CTA block, price sentence, trust line, help line; the conventions for {price-source} and {delivery-source})
  - ../gate-a-open-items.md (B6 "toddlers", B24 founder photos, B25 recognition, B26 relationships)
  - ../content-boundary.md (grey list: team-bio credentials, recognition)
  - ../../product/facts.md (company facts lines 278-309, support channel 217-230, seller 232-240)
  - ../../product/claims.md (§1, §2, §3.1 origin, §4 banned wording, §6 battery)
  - ../../product/policies.md (seller details 136-147, grievance officer 117)
  - ../../product/age-band-review.md (row 26, "toddlers" in the /team title)
  - ../../brand/messaging.md (objection answers row 1, words to stop using), ../../brand/voice.md
  - ../../research/keyword-map.md (§4.1 /team row, §5.2 /team row, §6.9 B10)
  - ../tracking-inventory.md (§6, the eight cta values)
  - "decisions D017, D018, D029, D032, D034, D036, D038, D041, D043, D054 (item 20: F11, G3, B24, B25; task 6.6)"
  - "wt:src/app/(site)/team/page.tsx (working tree read 2026-10-11; the live /team, founder-published from kheelona.ai per its lines 25-31)"
  - "../../raw/research/geo/site-files-2026-10-10/home-jsonld.json:22, 44 (the live Person descriptions, captured 2026-10-10)"
  - "../../raw/research/geo/engine-captures-2026-10-10/bing-prompts.json:406 (Bing's snippet of live /team, captured 2026-10-11)"
  - "../../raw/research/geo/site-files-2026-10-10/llms.txt:78-79 (the live recognition list)"
  - "wt:src/components/organisms/RecognitionStrip.tsx:15-32 (the live strip, legacy until task 6.3; read 2026-10-14)"
  - "design-system/project/07-selling.md:71-72, 01-writing.md:11-26, 01-writing.md:69-70, 10-pages.md:38-40 (read-only)"
  - "public/team/{apoorva,aman,kashyap}.jpg (viewed 2026-10-11 for alt text)"
  - "public/recognition/{nvidia-inception,karnataka-seal,nasscom}.png (viewed 2026-10-14 for alt text)"
---

# Team (`/team`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the quoted **Copy**
> blocks are meant for the site. Draft for the Gate A mockup ([D043](../../decisions/D043-all-pages-as-mockups-before-build.md));
> CMO review next; the founder signs off ([D015](../../decisions/D015-founder-signs-off-copy.md)).
> Conventions (`{price-source}`, `{delivery-source}`, token and full mode) are as on [home.md](home.md#how-to-read-this-page).
> `wt:` = the working tree, read 2026-10-11.

## At a glance

| Item | Draft |
|---|---|
| Page job | Answer "Who are these people, and is this a real company?" (strategy §2, stage 6) and hand a reassured parent to the store |
| Real URL | `/team` (mockup file `team.html`) |
| Primary search cluster | **Kheelona founders** ([keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13)); secondaries: who makes Kheelu, Kheelona Robotics Private Limited, the three founders' names |
| Title (46 characters) | Kheelona founders: the parents building Kheelu |
| Meta description (147 characters) | Meet the Kheelona founders, Apoorva Sahu, Aman Soni and Kashyap C.R: parents in Bengaluru building Kheelu, a screen-free plush toy for ages 3 to 7. |
| H1 (recommended) | The parents building Kheelu. |
| Mockup meta | `{"title": "Kheelona founders: the parents building Kheelu", "description": "<meta above>", "url": "/team", "buybar": true, "active": "team", "css": false}` |
| CTA | One chilli button, at the close: **Pre-order Kheelu**, `cta` = `finale`; the phone sticky bar (`sticky-bar`, from the partial) steps aside while it is on screen |

Machine-read text (title, meta) carries no price, so D028's order question does not arise here.

---

## Fold 1 · Hero

**Fold job:** say whose page this is, in one phone screen, and why a parent should read on.

**Copy:**

> **Eyebrow:** Team
>
> **H1:** The parents building Kheelu.
>
> **Lede:** Kheelu is designed by parents in Bengaluru. You're trusting us near your child, so here is who we are.

- **H1 accent:** `Hand` on "parents".
- **No CTA in the hero** (strategy §3.3: other pages carry the close and the sticky bar). The sticky bar shows from first paint, as on every page without a hero CTA.
- **Image:** a scrapbook board with the product only, no cast child (cast photos beside founders could read as the founders' own children). `kh-art kh-tone-sun`, one shape, `kheelu-front-sticker.png`, tilted. Alt for the board: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy."
- "Toddlers" is gone from the title and the page (B6; [age-band review](../../product/age-band-review.md) row 26).

**H1 options**

| | H1 | Why |
|---|---|---|
| **A (recommended)** | The parents building Kheelu. | The brief's page name; warm, says who in four words; the primary sits in the title, meta and the fold 3 H2 |
| B | Meet the Kheelona founders. | Carries the primary verbatim in the H1; plainer, less warm |
| C | The people behind Kheelu. | Neutral, if the founder prefers not to lead with "parents" |

**Sources, fold 1**

| Claim | Source |
|---|---|
| Designed by parents in Bengaluru | [claims §3.1](../../product/claims.md#31-origin-designed-and-built-here) (lines 167-173, EXTERNAL); footer `made` line ([home.md, footer](home.md#footer)) |
| "The parents building Kheelu" | Brief for this page (strategy §5 /team row); live "We are parents who build." (`wt:src/app/(site)/team/page.tsx:149`, PUBLISHED) |
| "You're trusting us near your child, so here is who we are." | Live: "You are trusting us near your child. You should know who we are." (`wt:src/app/(site)/team/page.tsx:165`, PUBLISHED) |
| Product description in the alt | [facts, identity](../../product/facts.md#identity) (line 74); DS `01-writing.md:113` |

---

## Fold 2 · Who makes Kheelu?

**Fold job:** the answer-first block for search and answer engines: the company, the three founders, where it is designed and made, and how to reach them.

**Copy:**

> **H2:** Who makes Kheelu?
>
> Kheelona Robotics Private Limited, a small company in Bengaluru, makes Kheelu. Its three co-founders are Apoorva Sahu, Aman Soni and Kashyap C.R. Kheelu is designed by parents in Bengaluru and made in India. You can reach the team on WhatsApp or by phone at +91 91875 46483, or at hello@kheelona.com.

- 50 words; feeds `AboutPage` JSON-LD and the keyword map's B10 answer (updated for D032 calls and D034 origin).
- The phone and email render from the support source ([facts, support channel](../../product/facts.md#support-channel)); `tel:` and `wa.me` links as on Home.
- **No CTA, no image.**

**Sources, fold 2**

| Claim | Source |
|---|---|
| Kheelona Robotics Private Limited; Bengaluru | [policies, seller details](../../product/policies.md#seller-details-as-published) (lines 140-142); [facts, seller of record](../../product/facts.md#seller-of-record) (line 234) |
| "a small company in Bengaluru" | [claims §3.1](../../product/claims.md#31-origin-designed-and-built-here) ("a small team in Bengaluru", EXTERNAL); [keyword map §6.9](../../research/keyword-map.md#69-trust-pages) B10 |
| Three co-founders and their names | [facts, company facts](../../product/facts.md#company-facts-the-site-uses-as-proof) (lines 301-308: names EXTERNAL) |
| Designed by parents in Bengaluru; made in India | [claims §3.1](../../product/claims.md#31-origin-designed-and-built-here); [D034](../../decisions/D034-origin-manufacturer-mrp.md) |
| WhatsApp or phone +91 91875 46483; hello@kheelona.com | [D032](../../decisions/D032-grievance-block-and-call-line.md) (lines 23-25, takes calls); [facts, support channel](../../product/facts.md#support-channel) (lines 223-224) |

---

## Fold 3 · The Kheelona founders

**Fold job:** put a face, a name, a job and a background to each founder.

**Copy:**

> **H2:** The Kheelona founders.
>
> **Apoorva Sahu**
> Co-Founder and CEO
> Apoorva leads Kheelona and owns the promise we make to your family.
> He is a Chartered Accountant with 15 years in finance and company-building. He was the first student at his family's pre-school, in 1994.
> [Apoorva on LinkedIn] → https://www.linkedin.com/in/sahu-apoorva/
>
> **Aman Soni**
> Co-Founder and CTO
> Aman builds the part your child talks to: how Kheelu listens and replies, and the safety layer every reply passes. He is also our grievance officer.
> He studied AI, shipped machine learning in production, and holds 14 patents filed in his own name.
> [Aman on LinkedIn] → https://www.linkedin.com/in/aman-soni-6b17b6223/
>
> **Kashyap C.R**
> Co-Founder and Chief Hardware Officer
> Kashyap builds the toy itself: the hardware inside the plush, and how it is powered and charged.
> He has spent over a decade in hardware, taking products from a blank page to certification. That includes years at Intel, leading Thunderbolt 4 and 5 compliance.
> [Kashyap on LinkedIn] → https://www.linkedin.com/in/kashyap-c-r-7ba18177/

- **H2 accent:** `Hand` on "founders". The H2 carries the primary cluster.
- **Order:** Apoorva, Aman, Kashyap (the order on the live `/llms.txt`, facts line 303).
- **Cards are composed** from DS parts (`kh-card`-style panel, `kh-heading`): the DS has no founder card, and `CastCard` is not for the public site ([component map](../../design-system/component-map.md)). One column on phones.
- **Background lines** sit as their own short paragraph under each job line, one or two sentences each: the live bio's facts and nothing more ([D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20). "15 years" is the live bio's "fifteen years" in numerals (DS `01-writing.md:23`, numerals for facts).
- **Photos:** the founders' real photos, the live site's: `public/team/apoorva.jpg`, `aman.jpg`, `kashyap.jpg` ([D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20, settling B24; DS: "Show real team photos on the Team page", `07-selling.md:72`). One per card. Alt texts, written from the photos:
  - "Apoorva Sahu, Co-Founder and CEO of Kheelona, in glasses and a black T-shirt."
  - "Aman Soni, Co-Founder and CTO of Kheelona, in glasses and an olive sweater."
  - "Kashyap C.R, Co-Founder and Chief Hardware Officer of Kheelona, smiling, in a striped T-shirt."
- **LinkedIn links** are text links (the DS has no LinkedIn icon, [G-12](../../design-system/gaps.md)), each at least 44 px tall, opening in the same tab is fine; aria-label "Apoorva Sahu on LinkedIn" etc. They let a parent check that the people are real; what the profiles say is not our claim.
- **The background lines show, in the mockup and the build alike.** [D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20 (2026-10-14) amends [D038](../../decisions/D038-trust-content-rulings.md) for F11: the proof files are no longer a precondition, so these lines are not hidden slots any more. The name, role, job line and LinkedIn link of each card are unchanged.
- **Removed from the live bios on purpose:** Ria Mangala Rewari's card (removed at the founder's request, [facts](../../product/facts.md#company-facts-the-site-uses-as-proof) line 308); "the small language model we train ourselves" (the "own the model" family, [claims §4](../../product/claims.md#4-retired-or-banned-wording); training is disclosed on `/terms` and `/privacy` only, [D035](../../decisions/D035-model-training-opt-out.md)); "the battery that lasts" (battery life unpublished, [claims §6](../../product/claims.md#6-certifications) line 312); "making it safe to hug" ("safe" alone); "the Kheelona Magic Box" (not defined anywhere in the wiki); the tags "The brain / The body"; and all three pull-quotes except Apoorva's (Aman's says the toy thinks "on the device", which D019 and D036 rule out; Kashyap's rests on unproven credentials and "certified").

**Sources, fold 3**

| Claim | Source |
|---|---|
| Names | [facts, company facts](../../product/facts.md#company-facts-the-site-uses-as-proof) (lines 301-308, EXTERNAL) |
| Roles: Co-Founder and CEO; Co-Founder and CTO; Co-Founder and Chief Hardware Officer | Live `/team` (`wt:src/app/(site)/team/page.tsx:37, 51, 87`, PUBLISHED, founder-published from kheelona.ai); the CTO title is also founder-confirmed in [D032](../../decisions/D032-grievance-block-and-call-line.md) (line 20) and [D029](../../decisions/D029-grievance-officer-legal-review.md) |
| Apoorva "owns the promise we make to your family" | Live bio: "the promise this brand makes to your family" (`wt:…/team/page.tsx:94`, PUBLISHED) |
| Aman: how Kheelu listens and replies, the safety layer | Live bio: "the voice loop your child talks to, the safety filters" (`wt:…/team/page.tsx:44`, PUBLISHED); every reply passes an age-graded safety layer ([claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 115; [D036](../../decisions/D036-launch-feature-claims.md) #6) |
| Aman is the grievance officer | [D029](../../decisions/D029-grievance-officer-legal-review.md); [D032](../../decisions/D032-grievance-block-and-call-line.md) (line 20); [policies](../../product/policies.md#decided-for-the-new-site) (line 117) |
| Kashyap: the hardware, how it is powered and charged | Live bio: "He owns the hardware and the power" (`wt:…/team/page.tsx:58`, PUBLISHED); a charger comes in the box ([D041](../../decisions/D041-gate-a-round-1.md) line 30) |
| Background lines shown (all three) | [D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20 (lines 76-83: "the founders' background lines, from the live bios"; proof no longer a precondition; amends [D038](../../decisions/D038-trust-content-rulings.md) line 14) |
| Apoorva: a Chartered Accountant with 15 years in finance and company-building | Live Person description: "Chartered Accountant with fifteen years in finance and company-building" ([raw `home-jsonld.json`](../../raw/research/geo/site-files-2026-10-10/home-jsonld.json) line 22, captured 2026-10-10); live `/team` bio, Apoorva's card (`archive/pre-reset-2026-10-10:src/app/(site)/team/page.tsx`) |
| Apoorva: the first student at his family's pre-school, in 1994 | Live `/team` bio, Apoorva's card (tag as above), as recorded from the working tree at Gate A (`wt:`, read 2026-10-11) in this page's F11 placeholder; the live Person description tells the same story in other words: "who grew up inside education businesses" ([raw `home-jsonld.json`](../../raw/research/geo/site-files-2026-10-10/home-jsonld.json) line 22) |
| Aman: studied AI, shipped machine learning in production, holds 14 patents filed in his own name | Live `/team`, verbatim: "He studied AI, shipped machine learning in production, and holds 14 patents filed in his own name." (Bing's snippet of kheelona.com/team, [raw `bing-prompts.json`](../../raw/research/geo/engine-captures-2026-10-10/bing-prompts.json) line 406, captured 2026-10-11); [facts, company facts](../../product/facts.md#company-facts-the-site-uses-as-proof) (line 301) |
| Kashyap: over a decade in hardware, taking products from a blank page to certification | Live Person description: "has taken products from a blank page to certification for over a decade" ([raw `home-jsonld.json`](../../raw/research/geo/site-files-2026-10-10/home-jsonld.json) line 44, captured 2026-10-10); live `/team` bio, Kashyap's card (tag as above) |
| Kashyap: years at Intel, leading Thunderbolt 4 and 5 compliance | Live `/team`: "years at Intel leading Thunderbolt 4 and 5 compliance" ([facts, company facts](../../product/facts.md#company-facts-the-site-uses-as-proof) line 302); live Person description, "led Thunderbolt 4 and 5 compliance at Intel" ([raw `home-jsonld.json`](../../raw/research/geo/site-files-2026-10-10/home-jsonld.json) line 44) |
| Kept out of the live bios | "the small language model we train ourselves" ([claims §4](../../product/claims.md#4-retired-or-banned-wording) row 7; restated in D054 item 20); "He owns the backend and …" (replaced by the approved job lines) |
| LinkedIn URLs | Live `/team` (`wt:…/team/page.tsx:43, 57, 93`) |
| Photos | `public/team/*.jpg`, the live site's ([cleanup, public assets](../../legacy/cleanup-public-assets.md) lines 75-77); [D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20 (B24); DS `07-selling.md:72` |

---

## Fold 4 · Why we build Kheelu

**Fold job:** give the founders' reason in the product's own terms (the mechanism and the parent's control), not a vision statement.

**Copy:**

> **H2:** Why we build Kheelu.
>
> We are parents who build. We watched our own children reach for screens.
>
> Most AI gives children answers. We built a toy that answers, then asks your child a question back, so they do the thinking.
>
> And you hold the keys. You can read every conversation in the parent app and delete any of them in one tap. You set your child's age, and every reply passes a safety layer set to it.
>
> No screen. No camera. It can't browse the internet.
>
> *(pull quote)* "The hard part of AI for children is not the model. It is the trust. So we build that first, and everything else second."
> Apoorva Sahu, Co-Founder and CEO
>
> [See how we built safety in] → `safety.html`

- **H2 accent:** `Mark` under "Why".
- About 75 words of body plus the quote: one idea (why), four short paragraphs, phone-first.
- **Not used from the live page:** the manifesto hero ("Every object a child holds is about to wake up … build the mind that wakes them"): it is the platform story for investors ([content boundary](../content-boundary.md); voice rule 12, one product, one promise). The beliefs "Screen-free is not nostalgia. It is the next product." (investor framing) and "A toy should be kept, not outgrown." (implies use past 7, against the 3 to 7 band). "Safety is not a feature. It is the whole product." is fine but repeats the safety link; left out for length. "felt the same knot you feel" is left out: it presumes the reader's worry (voice rule 4, never fear).
- The quote is the founder's own published line, kept verbatim; it is an opinion, not a product claim. It sits on a page with no cast photos, as the DS requires for quotes ([DS overview, imagery](../../design-system/overview.md#imagery)).
- The secondary link uses the DS's own second action wording (`01-writing.md:53`). No `cta` attribute (not a pre-order button).
- **No image** (the founder photos are in fold 3).

**Sources, fold 4**

| Claim | Source |
|---|---|
| "We are parents who build. We watched our own children reach for screens." | Live `/team`, verbatim (`wt:…/team/page.tsx:149-150`, PUBLISHED) |
| Most AI gives answers; Kheelu answers, then asks a question back, so they do the thinking | [messaging, objection answers](../../brand/messaging.md#objection-answers) row 1 (EXTERNAL); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (line 70) |
| "you hold the keys" | DS brand pillar "The grown-up holds the keys" (`01-writing.md:13`); live belief "The parent holds the keys. Always." (`wt:…/team/page.tsx:104`) |
| Read every conversation; delete in one tap | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (line 72) |
| You set your child's age; every reply passes a safety layer set to it | [D036](../../decisions/D036-launch-feature-claims.md) (#6 and lines 25-26); [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) (line 115) |
| No screen; no camera; can't browse the internet | [messaging, proof points](../../brand/messaging.md#proof-points) #1; [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (lines 68, 71) |
| Apoorva's quote | Live `/team`, verbatim (`wt:…/team/page.tsx:95-96`; "Pull-quotes verbatim", line 28) |

---

## Fold 5 · Recognised by

**Fold job:** a quiet row of the four programmes, as the live strip shows them: three marks and one name.

**Copy:**

> **H2:** Recognised by.
>
> `[mark: nvidia-inception.png]` · `[seal: karnataka-seal.png]` Karnataka Elevate · `[mark: nasscom.png]` · Founders Inc

- **Shown now** ([D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20, which amends [D038](../../decisions/D038-trust-content-rulings.md) for F11, G3, B24 and B25): one row, in the live strip's order (`wt:src/components/organisms/RecognitionStrip.tsx:15-29`). The NVIDIA Inception and nasscom startups entries are their marks; the Karnataka seal sits beside the words "Karnataka Elevate"; Founders Inc is text only. The marks are the live site's, already in `public/recognition/`: `nvidia-inception.png`, `karnataka-seal.png`, `nasscom.png`. On a phone the row may wrap; the order stays.
- **Alt texts** (the words on each mark, as live, `RecognitionStrip.tsx:58-75`):
  - NVIDIA mark: "NVIDIA Inception Program" (the programme's own name, printed on the mark; a proper noun, so its US spelling stays. See question 5: the en-IN spelling guard matches "Program", which is why the Copy block above names the file, not the alt).
  - nasscom mark: "nasscom startups".
  - Karnataka seal: empty alt (`alt=""`): it is decorative, and its name is the text beside it, as live.
- **Names only** ([B26](../gate-a-open-items.md)). "Recognised by" is the DS's label and the live one; never "backed by", "funded by", "partners", "investors", "member of", or anything that says a programme invested in, backed or endorsed Kheelona or Kheelu (`01-writing.md:70`: "never endorsements of the product"). No links out, as live.
- **Logos and permission.** The DS says "Use logos only with permission" (`07-selling.md:71`). D054 item 20 is the founder's ruling to show the three marks (G3); the permission record is the founder's (question 3, the Karnataka seal especially).

**Sources, fold 5**

| Claim | Source |
|---|---|
| The four programmes, their names and order; three marks, Founders Inc as text | The live strip (`wt:src/components/organisms/RecognitionStrip.tsx:15-29`, legacy until task 6.3, matching the tag as cited on [facts](../../product/facts.md#company-facts-the-site-uses-as-proof) lines 287-295); live `/llms.txt`: "Recognised by the NVIDIA Inception Program, Karnataka Elevate, nasscom startups, and Founders Inc." ([raw `llms.txt`](../../raw/research/geo/site-files-2026-10-10/llms.txt) lines 78-79, captured 2026-10-10) |
| Shown now, with the marks, without proof files | [D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20 (lines 76-78) |
| Names only, no relationship stated | [gate-a open items](../gate-a-open-items.md) B26 (line 81); [facts](../../product/facts.md#company-facts-the-site-uses-as-proof) lines 294-299 |
| "Recognised by" label | DS `07-selling.md:71`; `01-writing.md:70`; the live strip's label (`wt:src/components/organisms/RecognitionStrip.tsx:32`) |
| Alt texts | The marks as viewed (`public/recognition/*.png`, 2026-10-14); the live alts (`wt:src/components/organisms/RecognitionStrip.tsx:58-75`) |

---

## Fold 6 · Close

**Fold job:** one clear next step for a parent who now trusts the people behind the toy.

**Copy:**

> **H2:** Bring Kheelu home.
>
> **[Pre-order Kheelu]** → `store.html` (real: `https://store.kheelona.com`, `PREORDER_HREF`), `cta` = `finale`
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked
>
> Questions? WhatsApp or call +91 91875 46483
>
> [See how Kheelu works] → `meet-kheelu.html`

- **H2 accent:** `Hand` on "home".
- HTML for the price sentence and delivery item exactly as on Home: `<span data-src="TOKEN_PRICE">`, `BALANCE_PRICE`, `LAUNCH_PRICE`, `DELIVERY_TEXT`. Trust items link: delivery → `shipping.html`, returns → `refund.html`. Help line: `wa.me/919187546483` and `tel:+919187546483`, as on Home.
- **Full mode:** the price sentence becomes "₹7,999`{price-source}` (incl. GST), paid in full when you order." Nothing else changes.
- The ghost link is a learning action (DS `07-selling.md:52`), no `cta` attribute. Only one chilli button in the fold; the sticky bar steps aside while this button is on screen (`mockup.js`, DS gap G-09).
- **Image (optional):** none needed; if the fold looks bare, `kheelu-on-fur.jpg` (DS offer picture) with the product alt from fold 1. No cast child on this page.

**Sources, fold 6**

| Claim | Source |
|---|---|
| Label, destination, price sentence (d), trust line, help line, full mode | [home.md, CTA block](home.md#cta-block) (and its sources table); [D028](../../decisions/D028-price-wording.md); [D041](../../decisions/D041-gate-a-round-1.md) (label, sentence (d)); [D023](../../decisions/D023-new-order-delivery.md); [D021](../../decisions/D021-returns-policy.md); [D032](../../decisions/D032-grievance-block-and-call-line.md) |
| `finale` value | [tracking inventory §6](../tracking-inventory.md#6-posthog-in-the-browser) (line 281: every page's FinaleCTA) |

---

## Keyword placements

Primary cluster: **Kheelona founders**.

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules); [strategy §7](../strategy.md#7-search-and-ai-visibility-rules-the-pages-follow)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary near the start | Yes | 46 characters, primary first |
| Meta ≤ 155: primary plus one concrete fact | Yes | 147; the three names, Bengaluru, ages 3 to 7 |
| One H1 | Yes | Fold 1 |
| Primary in title, H1 or first paragraph, and meta | Yes | Title, meta; fold 3 H2 "The Kheelona founders."; "co-founders" in fold 2's first sentence block |
| Answer-first block, 40 to 60 words | Yes | Fold 2, 50 words |
| An H2 with the primary | Yes | Fold 3 |
| Alt text carries the term only where true | Yes | Founder photo alts name each founder "of Kheelona" |
| Secondaries: who makes Kheelu; Kheelona Robotics Private Limited; the founders' names | Yes | Fold 2 |
| "3 to 7" stated | Yes | Meta (the page has no product hero, so the band sits in the meta and in fold 2's company context rather than a first-screen chip) |
| Banned words absent ("toddlers", "best friend", "safe" alone, advisor, "own the model", wake-word lines) | Yes | None on the page |
| Density: "Kheelu" ≤ 2% | Yes | About 9 of about 590 words in `<main>` (1.5%): task 6.6 added about 70 words (the three background lines and the strip's two text names) and no "Kheelu"; recheck on the built page |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav | Pre-order Kheelu | `navbar` | Existing (partial) |
| Phone drawer | Pre-order Kheelu | `navbar-mobile` | Existing (partial) |
| Fold 6 close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New on Home, reused (partial) |

## Placeholders

None. Task 6.6 filled the five that were here (the three F11 background lines, the B24 founder photos and the F11
programme names) from the live site, under [D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20.
`{price-source}` and `{delivery-source}` in fold 6 are source markers, not placeholders ([home.md](home.md#how-to-read-this-page)).

No claim on the page lacks a source.

## Questions for the founder (website only)

1. **Bio lines before proof is filed.** (a) Show only name, role and what each founder does at Kheelona, with every background line hidden until its proof is filed ([D038](../../decisions/D038-trust-content-rulings.md) as written); (b) the same, plus personal history that has no document behind it (Apoorva's family pre-school, where he was the first student in 1994) on your word, with credentials (patents, Intel, CA, years in finance) still proof-gated. **Recommend (b):** the pre-school line is a story, not a credential, and it is the one detail that tells a parent this team comes from education; the cards read complete either way.
   **Answered 2026-10-14 ([D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20):** all three founders' background lines show, credentials included, from the live bios; the proof files are no longer a precondition.
2. **Recognition labels (B26).** Is "Recognised by" right for Karnataka Elevate and Founders Inc, or is the relationship something else (award, grant, investor)? Until you say, each shows by name only, and only once its proof is filed.
   **Answered 2026-10-14 (D054 item 20):** the strip shows now, as live, under "Recognised by", names only. A relationship (award, grant, investor) would be a new claim with its own source.
3. **Permission for the three marks (DS `07-selling.md:71`: "Use logos only with permission").** D054 item 20 shows them; the wiki holds no permission record. The Karnataka seal is the Government of Karnataka's emblem, which carries the lion capital at its top, so it is the one to check first (not legal advice). (a) Show all three marks, as D054 says, if you hold each programme's permission or badge terms; (b) show any mark you hold no permission for as its name in text, as Founders Inc already is (a one-line change). **Recommend (a) for NVIDIA Inception and nasscom startups if you have their member-badge terms, and (b) for the Karnataka seal unless Karnataka Elevate's terms let its startups use it.** "Karnataka Elevate" in text keeps the row complete.
4. **"Certification" in Kashyap's line.** The DS lists "certified or approved (until true)" under never say (`01-writing.md:69`), and Kheelu holds no toy-safety certificate yet ([claims §6](../../product/claims.md#6-certifications)). His line is about his own career, true per the live bio, but it sits under "Kashyap builds the toy itself", so a parent could read it as a claim about Kheelu. (a) Keep it as written; (b) drop the clause: "He has spent over a decade in hardware. That includes years at Intel, leading Thunderbolt 4 and 5 compliance." **Recommend (a):** the line describes his own work, you ruled the live lines show, and the page claims no certificate for Kheelu anywhere.
5. **The NVIDIA alt and the en-IN spelling guard (for the main session).** The mark reads "NVIDIA Inception Program", and the guard's `us-program` entry (`test/guards/banned-phrases.data.ts:134`) matches "Program" in every content string. (a) Alt "NVIDIA Inception Program", with a narrow allowance for that proper noun in the guard (the main session's ruling; the guard already lets other proper nouns through); (b) alt "NVIDIA Inception", the name the build's content module already uses (`src/content/en-IN/pages/team.ts:146`), with no guard change. **Recommend (a):** an alt should say what the image says, and the programme's name is not ours to respell.

## Notes for the builder and the CMO

- The page never names the unrelated "Kheelona India" ([D039](../../decisions/D039-repo-and-setup-answers.md)); the company's legal name in fold 2 is what tells search engines the two apart.
- No advisor anywhere ([D038](../../decisions/D038-trust-content-rulings.md)); no Kheelona+ line (D041: keep the topic out of most places).
- `AboutPage` JSON-LD as live (`wt:…/team/page.tsx:120-131`), with fold 2's answer as its description. The Organization node carries no `memberOf`: D054 item 20 lifts the proof gate (keyword map §7), but the page names the programmes and states no relationship (B26), and JSON-LD restates only what the page shows. If a founder's Person node carries a description, it is that founder's background line from fold 3, never the live one ("… the small language model Kheelona trains itself", [claims §4](../../product/claims.md#4-retired-or-banned-wording) row 7).
- Fold 5's marks: the section component today prints the programmes as a line of text (`src/components/sections/RecognitionStrip/RecognitionStrip.tsx`, task 3.4, B25), so the three marks and their alts are new work for the builder.

## Changes after approval (task 6.6)

The founder's answers of 2026-10-14, [D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 20
(amends [D038](../../decisions/D038-trust-content-rulings.md) for F11, G3, B24 and B25). Every other word of the Gate A
copy ([D046](../../decisions/D046-gate-a-approved.md)) is unchanged: the hero, fold 2, the names, roles, job lines and
LinkedIn links of fold 3, fold 4, the "Recognised by." heading and fold 6.

| # | Where | What changed | Why |
|---|---|---|---|
| 1 | Fold 3, Copy | Each founder's `[PLACEHOLDER F11: …]` became a background line from the live bio: Apoorva (a Chartered Accountant with 15 years in finance and company-building; the first student at his family's pre-school, in 1994), Aman (studied AI, shipped machine learning in production, 14 patents filed in his own name; the live sentence verbatim), Kashyap (over a decade in hardware, taking products from a blank page to certification; years at Intel leading Thunderbolt 4 and 5 compliance) | D054 item 20: "the founders' background lines, from the live bios"; proof files no longer a precondition. Live facts only; "the small language model we train ourselves" stays out (D054 item 20; claims §4 row 7). Sources: fold 3 table |
| 2 | Fold 3, notes | The `[PLACEHOLDER B24: founder photo]` option is gone: the photos are the live `apoorva.jpg`, `aman.jpg` and `kashyap.jpg`, with the alts drafted at Gate A (unchanged) | D054 item 20 ("The founder photos are the live site's"; B24) |
| 3 | Fold 3, fold job and notes | "with nothing that waits on proof shown as fact" left the fold job; the D038 hidden-slot note became the D054 note; a note on the background lines (one or two sentences; "15" in numerals) was added | D054 item 20 supersedes D038's proof gate for these items; DS `01-writing.md:23` |
| 4 | Fold 5, Copy | The F11 placeholder became the strip as live: the NVIDIA Inception mark, the Karnataka seal beside "Karnataka Elevate", the nasscom startups mark, and "Founders Inc" as text | D054 item 20 ("Add the `/team` recognition strip now, as the live site shows it"); names only, no relationship or investment claim (B26) |
| 5 | Fold 5, fold job, notes and sources | "Text only, no logos" (B25) and "hidden until at least one proof is filed" (D038) replaced; the three alts, the names-only rule and the logo-permission note added | Same; DS `07-selling.md:71`, `01-writing.md:70` |
| 6 | Sources (front matter, fold 3, fold 5), placeholders, questions, keyword density, builder notes | Updated so the page stays true: three raw captures and the live strip cited; the placeholders table emptied; questions 1 and 2 marked answered, 3 to 5 added; density re-estimated (about 70 words added, no "Kheelu"); `memberOf` and the Person descriptions ruled for the builder | So the notes describe the copy as it now stands |

**Checked against the copy rules.** No banned or retired wording in any quoted line (claims §4;
`test/guards/banned-phrases.data.ts`, the en-IN spelling entries included: the quoted lines name the NVIDIA mark by its
file, so "Program" appears only in the alt note); nothing implies an age under 3; no programme is said to have invested
in, backed or endorsed Kheelona.

**One check for the main session.** The copywriter's session had no shell, so the tag file was not re-read for this
change. The lines rest on the raw captures cited in the fold 3 sources and on the live-bio summary recorded at Gate A
from the working tree. Before the merge, compare them with
`git show 'archive/pre-reset-2026-10-10:src/app/(site)/team/page.tsx'` (the three founders' bio lines).
