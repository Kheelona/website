---
title: "CMO review: wave 8c (the advisor's proposal, D061) as built, on the public beta, phone first"
type: qa
updated: 2026-10-15
sources:
  - ../raw/brief/kickoff-brief.md (section 4 non-negotiables; section 6 CMO Reviewer)
  - ../decisions/D061-advisor-proposal-what-we-take-2026-10-15.md (items 1-14)
  - deviations.md (V38-V48)
  - cmo-review-advisor-proposal-2026-10-15.md (the copy set for each adapted item; AP-09 to AP-34)
  - ../research/advisor-homepage-proposal-review.md
  - ../decisions/D015, D016, D018, D021, D024, D028, D034, D036, D038, D040, D041, D045, D049, D050, D051, D060
  - ../brand/positioning.md, ../brand/messaging.md, ../brand/voice.md, ../brand/audience.md, ../site/strategy.md ("In one screen"), ../site/content-boundary.md
  - ../product/claims.md (§3 advisor row; §4 the D061 stale-fact rows and the expert-clip rows; line 123 memory), ../product/facts.md (Languages)
  - ../engineering/tasks.md (8c.1-8c.6 and the 8c.1-8c.4 merge rulings); ../log.md (2026-10-15 08:00-09:31)
  - "src/content/en-IN/offer.ts, share.ts, films.ts:101-119, faqs.ts:78-82, 129-146, expert-video.ts; src/content/en-IN/products/kheelu/page.ts:119-195; src/components/chrome/StickyBuyBar/StickyBuyBar.client.tsx:196-197; src/components/sections/FilmsStrip/films-strip.css:179-185 (read at f5238bb, 2026-10-15)"
  - "design-system/project/02-imagery.md:49 (never cover the face); 10-pages.md:52"
  - "Beta as served, 2026-10-15: https://betawebsite.kheelona.com/ and /products/kheelu (deploy cf60e8a, x-nextjs-prerender 1, noindex), https://betastore.kheelona.com/"
  - "Screenshots: Playwright 1.63.0 (repo package), Chromium headless shell, 1x, scrolled viewport chunks at 360x640, 390x844, 412x915, 1366x768, 1440x900; PostHog and vercel.live requests blocked; clip and film playback in Google Chrome (channel chrome, --mute-audio): ../raw/qa/2026-10-15/cmo-8c/ (local only, never committed, D039), with measurements.json"
  - "Lighthouse 13.4.1 (repo package), mobile, simulated throttling, 2 runs per page against beta from the US, PostHog and vercel.live blocked: ../raw/qa/2026-10-15/cmo-8c/lh-*.json"
  - "Film subtitle frames: public/video/moments/a-parent-speaks.mp4 0:09-0:15, a-father-speaks.mp4 0:17-0:23 (ffmpeg): ../raw/qa/2026-10-15/cmo-8c/film-*.png"
---

# CMO review: wave 8c as built, on the public beta

> Review only. Only the founder signs off copy ([D015](../decisions/D015-founder-signs-off-copy.md)); every change
> here is a deviation row (V38-V48) the founder signs at Gate B. Beta is noindex, takes no payment and runs no Meta or
> GA4 ([D051](../decisions/D051-beta-without-store-integrations.md)); its SEO score is low on purpose.

## Verdict

**Pass. No blocking issue; 12 minor.** Wave 8c does what D061 asked. A parent who opens the Home page from an
Instagram ad on a 390 or 412 px phone now sees Kheelu beside a child, the sticker "It asks. They think.", the
headline, the button and the price sentence, all on the first screen. Before this wave, the first screen showed only
the top edge of the art board. Every new line matches its decision word for word, and none breaks a claim, D016, the
3-to-7 age band or a voice rule. The quotes match the films' subtitles exactly. The share message is the text the
founder approved. Nothing changed on betastore.

The most important finding is not part of wave 8c. **On beta, the Home page throws a React hydration error (#418) on every
load**: Vercel's prerendered Home HTML has no sticky buy bar, but the browser's render adds one, so React throws away
the whole page and rebuilds it in the browser. This is the page the ads land on, and production runs on Vercel too.
Nothing visible breaks, so it is not blocking, but it should be fixed and guarded before Gate B (m1).

Next most important: the product page's offer card now sits about 680 px lower, most of a phone screen (m2). The expert clip has
four small finishing issues (m3-m6).

## Phone first screens (8c.1; D061 items 1, 5, 6, 14)

Measured on beta, in px from the top of the page ([measurements.json](../raw/qa/2026-10-15/cmo-8c/measurements.json)).
"Before" values are from tasks.md 8c.1 (buyer's-advocate probes, 2026-10-15).

| Page, viewport | h1 ends | Button | Price sentence | Kheelu (before → after) | Inside the first screen? | WhatsApp bubble |
|---|---|---|---|---|---|---|
| Home 390 × 844 | 256 | 376-432 | 448-508 | 916-1123 → **712-838** | **Yes**, all four | 772-828 × 318-374: clear of Kheelu, the sticker (617-735 × 27-145), the child's face and every hero link |
| Home 412 × 915 | 256 | 376-432 | 448-488 | **698-832**, whole board 588-873 | **Yes** | 843-899 × 340-396: clear; the help line (893-940) sits left of it |
| Product 390 × 844 | 212 | 332-388 | 404-464 | 793-1006 → **701-826** | **Yes** | clear |
| Product 412 × 915 | 212 | 332-388 | 404-444 | **689-822** | **Yes** | clear of "call +91 …" (869-896 × 16-161) |
| Home 360 × 640 | 256 | 376-432 | 448-508 | board top 797 (at 360 × 590) → 608; Kheelu 703-819 | Words yes; Kheelu just below, as the founder chose (D061 item 14) | 568-624 × 288-344: clear of "7-day returns" (ends at x 265) |
| Product 360 × 640 | 256 | 376-432 | 448-508 | 734-848 | Same | clear |
| Home / product 1440 × 900 | 388 / 323 | 484-540 / 419-475 | 556-596 / 491-531 | inside the board, unchanged | Yes, laptop unchanged | clear |

Screenshots: `home-390x844-00`, `home-412x915-00`, `home-360x640-00`, `product-390x844-00`, `product-412x915-00`,
`product-360x640-00`, `home-1440x900-00`, `product-1440x900-00`.

## The eight checks

| # | Check | Verdict | What I saw | Screenshots |
|---|---|---|---|---|
| 1 | First phone screen, Home and product | **Pass** | As the table above. The headline (D045), the button "Pre-order Kheelu" and the D028 price sentence keep their approved order. The picture is the approved hero art's Kheelu (D061 item 5), and no label line was added (item 6; "Ages 3 to 7" is the approved eyebrow). The 4:3 phone board is the recorded DS exception (V38). At 360 × 640, Kheelu starts 63 px (Home) and 94 px (product) below the screen, the same layout as the 360 × 590 case the founder accepted. | as above |
| 2 | Offer cards: later price, Made in India, share link | **Pass** | In token mode both cards read "₹4,999 for the first 500 units. ₹7,999 once they are gone." under the amount, with no strike-through, counter or "save" (D061 item 3; V39). "Made in India" is the last perk on both cards (item 10; V47). The ghost link "Know a parent who needs this? Share Kheelu on WhatsApp" opens a new tab (`target=_blank rel=noopener`) and is tracked as `share-whatsapp`. Tapping it opened wa.me with exactly the approved message (item 7; I aborted the request, nothing was sent): "Kheelu is a screen-free talking toy for children aged 3 to 7. It answers every why, then asks one back. ₹4,999 (incl. GST); pre-order with ₹499 today, refundable until dispatch. https://kheelona.com/?utm_source=whatsapp&utm_medium=referral&utm_campaign=2026-10-share". Home now says "first 500" twice, as D061 allows. | `home-390x844-16`, `-17`, `product-390x844-03`, `-04`, `product-390x844-share-link`, `home-1440x900-10`, `-11`, `product-1440x900-03` |
| 3 | Parents' quotes and "Watch the film" | **Pass** | The two DS quote cards sit under the strip on both pages. I compared them with the burned-in subtitles frame by frame and they match word for word (V43 records the first quote's full stop where the film has a comma). "Siddhant's father" is the founder's naming (the film's chip says "Siddhant's dad"). Each "Watch the film" button scrolls to its own film and plays it: "In a parent's words" and "A father's view" at 390 and 360, one film at a time. No video bytes load before a tap (0 media requests at load). | `home-390x844-02`, `-03`, `product-390x844-02`, `product-390x844-watch-film-1`, `-2`, `home-360x640-watch-film-1`, `-2`, `film-a-parent-speaks-subtitles-0009-0015`, `film-a-father-speaks-subtitles-0017-0023` |
| 4 | "Recognised by." strip | **Pass** | The /team strip as built, with names only: NVIDIA Inception Program, Karnataka Elevate (seal and name), nasscom startups, Founders Inc as text. No "Backed by" (claims §4). It sits on Home after the films and on the product page after the films, before the offer (V44). 274 px tall at 390. | `home-390x844-03`, `product-390x844-03`, `home-1440x900-02` |
| 5 | Expert clip, four steps, example conversation | **Pass**, with m3-m6 | The fold has the eyebrow "A video from an expert", the H2 "Watching isn't *talking.*", the poster with the chip "0:34 · With captions", the credit "Chaitra, therapist and developmental coach" and the disclosure "Kheelona made this video with Chaitra and compensated her for it." (V48; D061 items 12-13). It never says Dr. or doctor, never puts her and Kheelu in one sentence and never links the full video. Played once with the sound off: it plays only on a tap, `expert-clip.mp4` is the only file fetched, the burned-in disclosure shows from 0 to 5 s (seen at 1.6 s and 3.3 s, gone at 5.6 s), the captions read clearly in white pills, and the clip ends on "that doesn't talk back.", right above "What happens when your child presses it.". The four steps match 8c.3 word for word, and step 4 puts "remembers" beside "You can read every one of them." (D036; claims line 123). The example keeps "Illustrative example, not a recording." (V46). | `product-390x844-05`, `-06`, `-07`, `product-390x844-expert-poster`, `product-390x844-expert-play-*`, `product-1440x900-04`, `-05`, `-06` |
| 6 | FAQ wording and the languages question | **Pass**, with m7, m8 | Home's fourth question is now "What if my child doesn't like it?" with the answer unchanged, in the page, the FAQPage JSON-LD and `/llms.txt` (V41). The product page's FAQ adds "Which languages does Kheelu speak?" with "up to 10 languages at launch, including" the 8 named, and mid-sentence switching in AI mode. All are facts.md and D017 wording, and the question is also in the JSON-LD and `/llms.txt` (V42). | `home-1440x900-10`; JSON-LD read from both pages |
| 7 | Page order and length on a phone | **Pass**, with m2 | Home at 390 is 16,681 px (15,626 px in the morning's review). The films now start about 200 px higher, at 1,077 px, because the 4:3 phone board is shorter than the old 1:1 board. The quotes add 608 px and the strip 274 px, so the films fold is 2,009 px and its own button moves about 600 px lower. Home's offer card (fold 9, at the end) moves down about 680 px, to 14,028 px; the phone buy bar carries the buy there, as before. The product page at 390 is 17,537 px, in this order: hero, films with quotes, strip, **offer at 3,127 px (3.7 screens)**, expert, steps, example, then the rest, as 8c.3 and 8c.6 set it. The phone buy bar and the hero button keep a buy action on every screen, so nothing cuts the buy path. The product page's offer is now about 680 px lower than before, most of a phone screen (m2). | `measurements.json`; all chunks |
| 8 | Every new line against claims, D016, ages 3 to 7, voice | **Pass** | No brain line, no outcome claim, no open-ended age, no COD, no "ships 20 Oct", no "certified", no "Dr." (scanned page text, metadata and JSON-LD on both pages). "Made in India" follows D034. The share text says "aged 3 to 7" and leads with the total (D028). "first 500 units" is the one unit count the boundary allows. The quotes are real and consented (D040, D061 item 4). The expert's credit is hers, not Kheelu's (voice rule 10 is about Kheelu). /lp/meet-kheelu returns 404 (item 2: no ad page). | scan output in this session |

## The standing CMO checks

| Criterion | Verdict | Evidence |
|---|---|---|
| Says the positioning, to parents of 3-7 year olds | **Pass** | Conversation is the promise (H1, steps, example), asking back is the proof (films, quotes, example), screen-free is the foundation (lead, the father's "play away from the screen", the expert's "Watching isn't talking."). |
| No internal leakage (pages, metadata, JSON-LD) | **Pass** | No survey figures, competitor names, prices or analytics in the new lines. "first 500" is allowed by the [content boundary](../site/content-boundary.md). |
| One obvious next step on every screen | **Pass** | On phones, the hero chilli button, then the buy bar (hidden while an inline button shows); on laptops, the nav button. |
| Five-second test on a phone | **Pass** at 390 and 412 (was fail). At 360 the words pass and the picture starts just below the screen (founder's choice). | first-screen screenshots |
| Buy in a few taps | **Pass** | One tap to betastore from the hero, the bar, both offer cards and the films fold. The store is unchanged (`store-390x844-00`: "Pre-orders open here shortly", D051). |
| Motion | **Pass** | Nothing new moves on its own. The clip and films play only on a tap, with no autoplay, loop or muted preview (D049). "Watch the film" brings its film into view and starts it, which helps. |
| Lighthouse (beta, mobile, my 2 runs) | **Pass** (warm) | Home: Performance 76 cold, then 91; Accessibility 97; Best Practices 92; SEO 69 (noindex on purpose). Product: 86, then 99; 97; 96; 69. The Accessibility deduction is white on chilli (the D041 exception). Home's Best Practices deduction is m1's hydration error, plus beta's Vercel feedback script (CSP report). QA's local 8c close run: Home 93, product 94 ([log](../log.md), 09:26). |
| Ad-landing readiness | **Pass**, with m1 | The first phone screen now matches the ad creative the positioning sets: a child, Kheelu, "It asks. They think." It has one action, the price, delivery and returns. WhatsApp help is a tap away (bubble, help line) and the policies are in the trust lines and the footer. m1 is the remaining engineering risk on this page. |

## Minor issues and fixes

| # | Where | Issue | Fix | Route |
|---|---|---|---|---|
| m1 | Home on beta, every width; `src/components/chrome/StickyBuyBar/StickyBuyBar.client.tsx:196-197` | **React hydration error #418 on every Home load.** Beta's prerendered Home HTML has no `kh-buybar` (0 matches), while the product page has it (4) and so does the local build's `.next/server/app/index.html` (4). The browser renders the bar (`paths.includes(usePathname())`), the trees differ, and React rebuilds the whole document in the browser. The head's preloads disappear and the style attributes are rewritten. It shows in Lighthouse as `errors-in-console`. Not from wave 8c (this file last changed in 7.1a, `f351373`; no e2e test listens for page errors), but it hits the ad landing page and will follow to production on Vercel. | Builder: decide the bar's presence from a value the server and the browser share. Pass the page's own path down (PageTemplate already gets `path="/"` in `src/app/(site)/page.tsx`) instead of reading `usePathname()`, or normalise the prerender's pathname. Then check that beta's Home HTML carries the bar. QA: fail any route on a `pageerror` in the e2e fixture (`test/e2e/support/fixtures.ts`), prove it red on today's beta Home, and add it to the beta smoke before Gate B. | Builder, QA (speed: Architect) |
| m2 | Product page at 390; `products/kheelu/page.ts:119-141` | The offer card moved about 680 px lower, most of a phone screen (now at 3,127 px). Above it, the quotes add 608 px and the strip 274 px; the shorter hero gives back about 200 px. The buy path itself is intact (hero button with price, the buy bar). | Main session to rule (V44 placed the strip), then Builder: on the product page, move "Recognised by." from before the offer to after the share link, before the expert fold. That gives back 274 px and keeps films → offer adjacent. Or keep it and compare with section-view events once ads restart. | Builder |
| m3 | Expert clip at 390 (`expert-play-2_5s`) | After a tap, the browser's control bar covers the first caption ("Hey, have you ever noticed, / in a room full of people,"), the hook, for about 3 s. | Builder: re-encode with the caption band raised clear of the controls (bottom of the pills at about 80% of the frame height). The clip's build script is beside the local source (log 09:14). The films have the same pattern; out of scope here. | Builder |
| m4 | Expert clip, burned-in disclosure (`product-390x844-expert-disclosure-zoom4x`) | "Made with Kheelona. / Chaitra was compensated." renders about 7 px tall at 390 and smaller at 360. The printed line covers the page. The burned-in line exists for when the file travels without the page, and on a phone it would barely be readable then. | Builder: re-encode the disclosure for its 5 s at the caption size (the same white pills, Nunito ExtraBold), top left. | Builder |
| m5 | Expert poster at 360 and 390 (`product-360x640-expert-poster-zoom4x`, `product-390x844-expert-poster-zoom2x`) | The play button sits on her chin and the chip "0:34 · With captions" on her hairline, so the face is boxed in. DS `02-imagery.md:49`: never cover the face. | Builder: pick a poster frame where her face sits in the upper third, clear of the centre, or move the play button down onto the coat. Keep the chip off the hair. | Builder |
| m6 | Expert fold at 1366 and 1440 (`product-1440x900-04`); `films-strip.css:179-185` | `.ks-clip` takes the strip's full width, so the poster is 944 × 531 px. That makes it the largest picture on the product page, larger than Kheelu's hero board (480 px), and the coat badge reads clearly at that size. The toy should stay the hero. | Builder: cap `.ks-clip` at the narrow measure on laptops (about 640-720 px), centred. | Builder |
| m7 | Product page FAQ; `faqs.ts:131` | Home now asks "What if my child doesn't like it?" (V41), but the product page still asks "What if it isn't right for us, or stops working?", so the two selling pages disagree on the parent's fear. | Copywriter (founder signs): "What if my child doesn't like it, or it stops working?" The answer is unchanged and the JSON-LD follows. | Copywriter |
| m8 | Product page languages answer; `faqs.ts:145` | "You can watch it happen in the film “Two languages”." points to a film about 12,000 px above, which the reader cannot tap from the answer. | Builder: make the film's name a button that plays film 6, using the quotes' "Watch the film" mechanism. Or Copywriter: drop the sentence on the page and keep it in `/llms.txt`. | Builder or Copywriter |
| m9 | Quotes on Home and the product page | The expert is disclosed as compensated, but the two parents' written quotes carry no disclosure, and "I would recommend everyone to have one" is now a text testimonial on both selling pages. [D040](../decisions/D040-films-move-to-new-site.md) recorded this risk for the films (CCPA endorsement guidelines; ECOM-16) and the founder accepted it. The new placement makes the asymmetry easy to see. | Founder (via the main session): confirm whether either family received Kheelu free or at a discount. If yes, Copywriter: one line under the quotes, for example "Pilot families, filmed and quoted with their permission; each family was given a Kheelu." | Founder, Copywriter |
| m10 | Expert fold at 360 (`product-360x640-07`) | The WhatsApp bubble crosses the centred credit and disclosure lines as they scroll past. It is the one line on the page with a legal job. | Builder: left-align the credit and disclosure on phones, or keep them out of the bubble's column, as task 8c.5 did for the hero help line. | Builder |
| m11 | Product page; `page.ts:195` | The idea "answers first, then asks back" appears in step 3, then again 700 px later as the example's closing line, then in the modes lead. That is four times in about 1,700 px of a phone page. | Copywriter (founder signs; V46 says word for word): drop the example's closing sentence on the product page. Step 3 already says it. | Copywriter |
| m12 | Beta only | The Vercel feedback script (`vercel.live/_next-live/feedback/feedback.js`) still loads on beta and appears as a CSP issue in Lighthouse. It was not visible in my captures. | Founder: turn the Vercel toolbar off for the beta project (a dashboard setting; Vercel is the founder's). | Founder |

## Test ideas (after launch, with section-view events)

- **Product page:** the strip after the offer vs before it (m2): does the offer's reach rise without losing film plays?
- **Home films fold:** one quote (the father's, which carries the screen-free foundation) vs two. One would shorten
  the fold by about 300 px and bring its button closer to the films.
- **Share label** (the live site's own label, reused; founder's call only). Alternatives that name the audience
  instead of presuming need: "Know a parent of a 3 to 7 year old? Share Kheelu on WhatsApp"; "Send Kheelu to a
  parent on WhatsApp".

## Notes for the founder (not issues)

- Until Gate B, the share message links to kheelona.com, which is today's production site ("Ships 20 October 2026",
  "ages 3+", D011). Anyone who tries the share link from beta lands on the old site. After the Gate B merge the link
  lands on the new Home.
- The rupee sign in the share message still needs the Android and iOS WhatsApp check the Gate B pack lists (V40).
- The clip's line "I see this every single day in my practice", together with the coat and badge, strengthens the
  medical reading you accepted (D061 item 13). Nothing in our own words says doctor.
- Recorded DS departures stand as filed: the 4:3 phone board (V38), the steps' two-sentence bodies (V45), and the quote
  cards without the DS initials avatar (tasks.md, 8c merge rulings).
