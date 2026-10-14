---
title: "Contact (/contact): page copy, Gate A mockup draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../../decisions/D058-follow-the-live-code-check-2026-10-14.md and ../../qa/live-main-reconciliation-2026-10-14.md (§2; task 8b.1 check, no copy change)
  - ../strategy.md (§2 journey row 6, §3.2 help line, §3.3 CTA placement, §4.4 footer and grievance link, §5 /contact row)
  - home.md (shared CTA block, price sentence, trust line; footer copy)
  - ../../product/facts.md (support channel 217-230, seller of record 232-240)
  - ../../product/policies.md (status at a glance 72-92, decided for the new site 102-124, seller details 136-147)
  - ../../product/claims.md (§3.1 origin lines 152-175)
  - ../../brand/voice.md (mechanics: "within 48 hours", "within one month")
  - ../../research/keyword-map.md (§4.1 /contact row, §5.2 /contact row, §6.9 C1)
  - ../tracking-inventory.md (§6 cta values; line 198: no Lead event on /contact)
  - "decisions D021, D022, D029, D032, D034, D038, D041, D042"
  - "mockup/partials/footer.html:14-18 (the seller block as the footer shows it)"
  - "wt:src/app/(site)/contact/page.tsx (the live /contact, working tree read 2026-10-11)"
  - "design-system/project/01-writing.md:49-61, 07-selling.md:49-55, 10-pages.md:38-40 (read-only)"
---

# Contact (`/contact`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the quoted **Copy**
> blocks are meant for the site. Draft for the Gate A mockup ([D043](../../decisions/D043-all-pages-as-mockups-before-build.md));
> CMO review next; the founder signs off ([D015](../../decisions/D015-founder-signs-off-copy.md)).
> Conventions (`{price-source}`, `{delivery-source}`, token and full mode) are as on [home.md](home.md#how-to-read-this-page).
> `wt:` = the working tree, read 2026-10-11.

## At a glance

| Item | Draft |
|---|---|
| Page job | Let a parent reach a person by the channel they prefer, show the grievance officer as the law requires, and show exactly who is selling |
| Real URL | `/contact` (mockup file `contact.html`) |
| Primary search cluster | **contact Kheelona** ([keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13)); secondaries: Kheelona WhatsApp, Kheelona email, customer care |
| Title (50 characters) | Contact Kheelona: WhatsApp, call or email the team |
| Meta description (142 characters) | Contact Kheelona: WhatsApp or call +91 91875 46483, or email hello@kheelona.com. We are a small team in Bengaluru and answer our own messages. |
| H1 (recommended) | Talk to the team behind Kheelu. |
| Mockup meta | `{"title": "Contact Kheelona: WhatsApp, call or email the team", "description": "<meta above>", "url": "/contact", "buybar": true, "active": "", "css": false}` |
| CTA | One chilli button, at the close: **Pre-order Kheelu**, `cta` = `finale`. The three contact buttons are secondary buttons, never chilli |
| Dependency | +91 91875 46483 must answer **calls** before this copy goes live ([D032](../../decisions/D032-grievance-block-and-call-line.md), line 25). The live page's "takes messages, not calls" (`wt:src/app/(site)/contact/page.tsx:174-175`) is retired |

---

## Fold 1 · Hero

**Fold job:** every way to reach us, as text and as one-tap buttons, inside the first phone screen.

**Copy:**

> **Eyebrow:** Contact Kheelona
>
> **H1:** Talk to the team behind Kheelu.
>
> **Lede:** To contact Kheelona, call or message us on WhatsApp at +91 91875 46483, or email hello@kheelona.com. Add your order number if you have one. We are a small team in Bengaluru, and we answer our own messages. For a formal complaint, see our grievance officer below.
>
> **[Message on WhatsApp]** → `https://wa.me/919187546483`
>
> **[Call +91 91875 46483]** → `tel:+919187546483`
>
> **[Email hello@kheelona.com]** → `mailto:hello@kheelona.com`

- **H1 accent:** `Hand` on "behind Kheelu."
- The lede is the answer-first block for "how do I contact Kheelona?" (46 words), with the number and email as text so a parent can copy them.
- **Buttons:** three `Button` secondary, full width on phones, stacked, each at least 44 px tall. Icons: `whatsapp-logo` on WhatsApp, `envelope-simple` on email; **no icon on the call button**, because the DS has no phone icon (gap [G-12](../../design-system/gaps.md)). Never chilli (one chilli per view, and these are not pre-order actions); never the blue `primary` (kept for the app, `07-selling.md:53`).
- No call hours and no reply time are stated for general messages: none is decided. Only the grievance times are (fold 3).
- **Image:** none. A contact page reads fastest as words and buttons.

**H1 options**

| | H1 | Why |
|---|---|---|
| **A (recommended)** | Talk to the team behind Kheelu. | The brief's page name; a person, not a form. The primary sits in the eyebrow, title, meta and the lede's first words |
| B | Contact Kheelona. A person answers. | Carries the primary in the H1; "a person answers" rests on the live "we answer our own messages" |
| C | Questions? Talk to us. | Shortest; loses the product name |

**Sources, fold 1**

| Claim | Source |
|---|---|
| WhatsApp and calls on +91 91875 46483 | [D032](../../decisions/D032-grievance-block-and-call-line.md) (lines 23-25); [facts, support channel](../../product/facts.md#support-channel) (line 223) |
| hello@kheelona.com | [facts, support channel](../../product/facts.md#support-channel) (line 224: founder-confirmed monitored inbox) |
| "We are a small team in Bengaluru, and we answer our own messages." | Live `/contact`, verbatim (`wt:…/contact/page.tsx:96`, PUBLISHED); "a small team in Bengaluru" is EXTERNAL ([claims §3.1](../../product/claims.md#31-origin-designed-and-built-here), lines 168, 173); [keyword map §6.9](../../research/keyword-map.md#69-trust-pages) C1 |
| Order number helps | [keyword map §6.9](../../research/keyword-map.md#69-trust-pages) C1; live route copy (`wt:…/contact/page.tsx:49`) |

---

## Fold 2 · Pick the route that fits

**Fold job:** send each kind of question to the place that answers it, so a parent rarely needs to wait for us.

**Copy:**

> **H2:** Pick the route that fits.
>
> **Before you order**
> What Kheelu does, what it costs and the questions parents ask are on the Meet Kheelu page.
> [Meet Kheelu] → `meet-kheelu.html`
>
> **About your order**
> Message or call us with your order number. Until we dispatch it, you can change your address, or cancel for a full refund.
> [Message us on WhatsApp] → `https://wa.me/919187546483`
>
> **More than one Kheelu**
> Each pre-order is for one Kheelu. For more, message us on WhatsApp.
> [Message us on WhatsApp] → `https://wa.me/919187546483`
>
> **Returns, refunds and delivery**
> 7-day returns, no questions asked, and a 6-month warranty. Delivery is included anywhere in India.
> [Refunds and returns] → `refund.html` · [Shipping] → `shipping.html`
>
> **Safety and privacy**
> When the microphone is on, where your child's voice goes and what you can delete, in plain words.
> [Safety] → `safety.html` · [Privacy] → `privacy.html`

- **H2 accent:** `Hand` on "fits".
- **Component:** five `FeatureCard`s (`plain`), one column on phones, two from 720 px. Icons: `question`, `package`, `users-three`, `arrow-counter-clockwise`, `shield-check`. Card links have no DS tap extension (gap G-01): the builder gives each a 44 px tap area.
- The two WhatsApp links get distinct accessible names: "Message us on WhatsApp about your order" and "Message us on WhatsApp about more than one Kheelu".
- **Dropped from the live page:** the "Pre-ordering Kheelu" card with its own chilli button and a bare "refundable ₹499" (it broke D028 and put two chilli buttons on the page); the "Partners, retailers and investors" card linking to kheelona.ai (the site speaks only to parents and family buyers, R9; [content boundary](../content-boundary.md)).

**Sources, fold 2**

| Claim | Source |
|---|---|
| Price and questions live on the product page | [strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline) (`/products/kheelu` row: OfferCard, FAQ) |
| Change the address until dispatch | [policies, status at a glance](../../product/policies.md#status-at-a-glance) (line 79: "Address changeable until dispatch") |
| Cancel for a full refund before dispatch | [policies](../../product/policies.md#status-at-a-glance) (lines 74-75: everything paid refundable in full before dispatch) |
| One Kheelu per pre-order; more via WhatsApp | [policies](../../product/policies.md#status-at-a-glance) (line 80, published on `/terms`) |
| 7-day returns, no questions asked; 6-month warranty | [D021](../../decisions/D021-returns-policy.md); [D022](../../decisions/D022-warranty-replacement-refund.md); [messaging, confirmed candidate lines](../../brand/messaging.md#confirmed-candidate-lines) |
| Delivery included anywhere in India | [pricing, tax, delivery, MRP](../../product/pricing.md#tax-delivery-mrp); [policies](../../product/policies.md#status-at-a-glance) (line 79) |
| What the safety and privacy pages cover | Live route copy, adapted (`wt:…/contact/page.tsx:59`); [strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline) (`/safety`, `/privacy` rows) |

---

## Fold 3 · Make a formal complaint

**Fold job:** show the grievance officer's name, designation and contact, and the response times, as the E-Commerce Rules require.

**Copy:**

> **H2:** Make a formal complaint.
>
> If something has gone wrong and we haven't put it right, you can complain formally to our grievance officer. Please include your order number.
>
> **Grievance Officer:** Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483. We acknowledge every complaint within 48 hours and resolve it within one month of receiving it.

- **H2 accent:** none (a legal block stays plain).
- The block is [D032](../../decisions/D032-grievance-block-and-call-line.md)'s published wording, verbatim, rendered from the one grievance content value that `/refund`, `/terms`, `/privacy` and the store footer also use. Email and number are links (`mailto:aman@kheelona.com`, `tel:+919187546483`).
- Never "5 days" or "30 days" ([D032](../../decisions/D032-grievance-block-and-call-line.md); [voice](../../brand/voice.md#ds-mechanics-that-apply-the-positioning-is-silent)). No complaint reference number is promised: none exists yet ([policies](../../product/policies.md#decided-for-the-new-site) line 120).
- The footer's "Grievance officer" link lands here ([strategy §4.4](../strategy.md#44-navigation)): give this section `id="grievance"` so the footer link can point at `contact.html#grievance` (a footer partial change, so a shared request to the main session; until then the link lands at the top of this page).
- **No image.**

**Sources, fold 3**

| Claim | Source |
|---|---|
| Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483 | [D029](../../decisions/D029-grievance-officer-legal-review.md); [D032](../../decisions/D032-grievance-block-and-call-line.md) (lines 20-22); [policies](../../product/policies.md#decided-for-the-new-site) (line 117) |
| Acknowledge within 48 hours; resolve within one month | [D032](../../decisions/D032-grievance-block-and-call-line.md) (lines 20-26); [policies](../../product/policies.md#decided-for-the-new-site) (lines 118-119) |
| Shown on /contact | [D032](../../decisions/D032-grievance-block-and-call-line.md) (line 28) |

---

## Fold 4 · Who you're buying from

**Fold job:** the seller's legal identity, exactly as the footer prints it, so a parent about to pay can see who is asking.

**Copy:**

> **H2:** Who you're buying from.
>
> Kheelu is designed here in Bengaluru, by parents who use it at home, and made in India. This is also the company you're buying from.
>
> **Kheelona Robotics Private Limited**
> GSTIN 29AAMCK1530E1ZN
> 5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India
> +91 91875 46483 (WhatsApp or call) · hello@kheelona.com

- **H2 accent:** `Hand` on "buying from."
- The four seller lines are character-for-character the footer's (`mockup/partials/footer.html:14-17`, without the "© 2026" prefix), rendered from the single seller source ([policies, seller details](../../product/policies.md#seller-details-as-published)). Use `<address>`.
- The address is the registered office, not a shop: the page never invites a visit ([B43](../gate-a-open-items.md): Jayanagar only; F14: no place to hear Kheelu before paying, [D038](../../decisions/D038-trust-content-rulings.md)).
- **Image (optional):** none. If the fold needs a colour moment, a `kh-section--band` background is enough.

**Sources, fold 4**

| Claim | Source |
|---|---|
| "Kheelu is designed here, by parents who use it at home." (with "in Bengaluru" added) | [claims §3.1](../../product/claims.md#31-origin-designed-and-built-here) (lines 155-156: the sanctioned line for the new `/contact`; "designed in Bengaluru" EXTERNAL, line 169) |
| Made in India | [D034](../../decisions/D034-origin-manufacturer-mrp.md); [claims §3.1](../../product/claims.md#31-origin-designed-and-built-here) (lines 152-154) |
| "This is also the company you're buying from." | Live `/contact`: "This is also the company you are buying from, in full." (`wt:…/contact/page.tsx:152`, PUBLISHED) |
| Legal name, GSTIN, registered address | [policies, seller details](../../product/policies.md#seller-details-as-published) (lines 140-142); footer partial (lines 14-16) |
| WhatsApp or call; email | [D032](../../decisions/D032-grievance-block-and-call-line.md); [facts, support channel](../../product/facts.md#support-channel); footer partial (line 17) |

---

## Fold 5 · Close

**Fold job:** for a parent whose question is answered, one calm next step.

**Copy:**

> **H2:** Ready when you are.
>
> **[Pre-order Kheelu]** → `store.html` (real: `https://store.kheelona.com`, `PREORDER_HREF`), `cta` = `finale`
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked
>
> [See how Kheelu works] → `meet-kheelu.html`

- **H2 accent:** `Hand` on "you are."
- HTML for the price sentence and delivery item exactly as on Home (`data-src` spans `TOKEN_PRICE`, `BALANCE_PRICE`, `LAUNCH_PRICE`, `DELIVERY_TEXT`). Trust items link: delivery → `shipping.html`, returns → `refund.html`.
- **No help line here:** the whole page is the help line.
- **Full mode:** the price sentence becomes "₹7,999`{price-source}` (incl. GST), paid in full when you order."
- The sticky bar steps aside while this button is on screen, so a phone view never shows two chilli buttons.
- No `Lead` or other new event: tracking stays exactly as live ([tracking inventory](../tracking-inventory.md) line 198).

**Sources, fold 5**

| Claim | Source |
|---|---|
| Label, destination, price sentence (d), trust line, full mode | [home.md, CTA block](home.md#cta-block); [D028](../../decisions/D028-price-wording.md); [D041](../../decisions/D041-gate-a-round-1.md); [D023](../../decisions/D023-new-order-delivery.md); [D021](../../decisions/D021-returns-policy.md) |
| `finale` value | [tracking inventory §6](../tracking-inventory.md#6-posthog-in-the-browser) (line 281) |

---

## Keyword placements

Primary cluster: **contact Kheelona**.

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary first | Yes | 50 characters |
| Meta ≤ 155: primary, a concrete fact | Yes | 142; the number and the email |
| One H1 | Yes | Fold 1 |
| Primary in title, H1 or first paragraph, and meta | Yes | Title, meta, eyebrow and the lede's first words ("To contact Kheelona"); not in the recommended H1 (option B carries it) |
| Answer-first block, 40 to 60 words | Yes | Hero lede, 46 words (under the H1, not a question-shaped heading) |
| An H2 with "WhatsApp (call or message) or email" (§5.2) | Partly | Carried by the hero buttons and lede rather than an H2; adding an H2 above the buttons would push them out of the first screen |
| Secondaries: Kheelona WhatsApp, Kheelona email, customer care | Yes | Hero, fold 2 |
| Banned or stale wording absent ("messages, not calls", "designed and built here", "5 days", "30 days", partners card) | Yes | None on the page |
| Density: "Kheelu" ≤ 2% | Yes | About 7 of about 430 words (1.6%) |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav | Pre-order Kheelu | `navbar` | Existing (partial) |
| Phone drawer | Pre-order Kheelu | `navbar-mobile` | Existing (partial) |
| Fold 5 close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | Reused from Home (partial) |
| Contact buttons (WhatsApp, call, email) | not pre-order actions | none | No new values in this step; if the founder wants contact taps counted, the main session names the values (G10) |

## Placeholders

None. Every line on the page has a source.

## Questions for the founder (website only)

None for this page. One dependency, not a choice: the number must take calls before the page goes live ([D032](../../decisions/D032-grievance-block-and-call-line.md)).

## Notes for the builder and the CMO

- `ContactPage` JSON-LD as live (`wt:…/contact/page.tsx:69-79`), pointing at the Organization node, which carries the number and email.
- The page never names the unrelated "Kheelona India" ([D039](../../decisions/D039-repo-and-setup-answers.md)); no Kheelona+ line (D041).

## Changes after approval (task 8b.1)

None to the copy. Task 8b.1 (2026-10-14) checked every fold against the claims
[D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) withdraws ([reconciliation map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded)).
None is on this page:

- The grievance block stays Aman Soni, Co-Founder and CTO, aman@kheelona.com (D058 item 4).
- The "Safety and privacy" card promises "what you can delete, in plain words". That stays true: `/privacy` now says
  what removing a chat does and what deleting the account deletes (D058 item 1).
- The page has no Kheelona+ line (D041).

The module (`src/content/en-IN/pages/contact.ts`) needs no change for D058.
