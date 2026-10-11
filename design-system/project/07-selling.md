# Selling

The brand is calm, and the page still sells. These patterns turn a parent's curiosity into a pre-order without pressure tricks.

## The parent's path, and what answers each step

| Parent is thinking | We answer with | Component |
|---|---|---|
| "What is this?" | One line plus a real child with Kheelu | `SectionHeading` hero, photo or `SocialPost` |
| "Will my child actually like it?" | Children meeting Kheelu, the five feelings, stories | `FeelingChip`, video, `ImaginationFrame` |
| "What will my child get from it?" | The loop, and year-by-year growth | `StepLoop`, `AgeTimeline` |
| "Is an AI toy safe?" | Mechanisms they can check | `TrustList`, `FAQ`, link to the Safety page |
| "Can I see what it says?" | The parent app | `AppSummaryCard`, `ParentControl` |
| "Why not a phone, or a regular toy?" | A fair comparison | `ComparisonTable` |
| "Do other parents like it?" | Real pilot parents | `Testimonial` |
| "What does it cost, and is it risky?" | Price, the ₹499 refundable reserve, the ship date | `OfferCard`, `StickyBuyBar` |

## Product page skeleton

The `HomePage`, `HomePageTrust` and `HomePageBuy` templates in the Pages group show this skeleton built (see **Pages: putting it together**).

1. `AnnouncementBar`: the offer and ship date.
2. `NavBar`.
3. **Hero:** headline, lead, cta, trust line, and the child with Kheelu.
4. **Watch a child meet Kheelu:** real video.
5. **How it works:** `StepLoop`.
6. **Year by year:** `AgeTimeline`.
7. **A day with Kheelu:** the moments of the day and the three modes (`ModeSwitch` visual).
8. **Safety:** `TrustList` plus a link.
9. **Feelings:** `FeelingChip` cards.
10. **Parent app:** `AppSummaryCard`.
11. **Compare:** `ComparisonTable`.
12. **Parents say:** `Testimonial` ×3.
13. **Questions:** `FAQ` (price, ages, languages, shipping, internet, safety).
14. **Close:** `OfferCard` with a WhatsApp share link.
15. `Footer`.

Put a cta after sections 3, 8, 11 and 14, and keep `StickyBuyBar` on phones throughout.

## Price and offer rules

- Lead with the **barrier price** where it helps ("Reserve for ₹499") and always show the full price nearby ("₹4,999 for the first 500, then ₹7,999").
- Only show a struck-through price that is real: ₹7,999 is the announced later price. Label it as the later price for screen readers ("Later price ₹7,999"), and never call it MRP unless it is.
- Always say **refundable** next to the deposit and **including GST** near the price.
- **Unit counts** ("312 of 500 left") come only from live inventory. If you can't wire it live, don't show a number. "First 500 only" is enough.
- **Countdowns** are allowed only for a real deadline, and are never reset per visitor.
- Ship date: "Ships from 20 Oct 2026". If it changes, update everywhere the same day.

## CTA hierarchy

- **One `cta` per view:** "Pre-order Kheelu" (or "Pre-order for ₹499" in the offer card).
- **Secondary** (`Button` secondary): learning actions such as "See how we built safety in" and "See what the app shows you".
- **Not on selling pages:** the blue `primary` button. It is for everyday actions in the app and setup (Continue, Save, Connect Kheelu), so a selling view never shows a blue button competing with the chilli one.
- **Tertiary** (`Button` ghost or text link): "Read the science", "See all stories".
- **Sharing** (secondary with the WhatsApp icon): "Share on WhatsApp".

## Objections and the proof for each

| Objection | Proof to show | Never say |
|---|---|---|
| "AI for a 3-year-old? Is it safe?" | Wake word; on-device filtering; closed library; read and delete everything | "Completely safe" |
| "It's just another screen." | Screen-free; no app for the child; stories offline | "Screens are ruining kids" |
| "₹4,999 is a lot for a toy." | Years of use ("grows with them"); languages; 6 months of Kheelona+; ₹499 refundable to reserve | "Cheaper than tuition" |
| "Will it speak our language?" | Language chips in native script; a story-in-two-languages video | Promising a language before it's announced |
| "My child will get bored." | Memory; stories that ask back; the five feelings; real children over weeks | "Never boring" |
| "Is it listening all the time?" | "Not muted. Off." Wake-word explanation | Technical jargon |

## Trust signals

- **Real pilot parents** use first name and "Pilot parent" (with their consent), never with cast photos.
- **Recognitions:** NVIDIA Inception, Karnataka Elevate, NASSCOM Startups, Founders Inc. Show them as a quiet "Recognised by" row of names. Use logos only with permission.
- **The founders:** "Designed by parents in Bengaluru". Show real team photos on the Team page.
- **Policies:** link refund, shipping and privacy near the price.

## What we never do to sell

- Fake reviews, fake scarcity, fake "just bought" pop-ups or fake countdowns.
- Fear about screens or development to push the sale.
- Selling to children, including through Kheelu itself.
- Dark patterns: pre-ticked add-ons, hidden balances, confirm-shaming ("No, I don't care about my child").
