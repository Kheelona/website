# Making new assets (for agents)

This section is for any agent or person asked to make something new for Kheelona: an ad, a post, a web section, a slide, an app screen, an image. Read it all before you start. The goal is **more sales with fewer, better assets**, all of which look like they came from one careful team.

## The decision ladder: always start at the top

1. **Reuse.** Is there a component, asset or past artwork that already does the job? Check the Components list, the asset groups (Logo, Kheelu, Cast, Photo library, Doodles, Crayon, Shapes, Icons) and the campaign folders first.
2. **Recompose.** Can you build it from what exists: a component plus a cast sticker, Kheelu's sticker, a doodle and a crayon mark? Most social posts, slides and web sections should end here.
3. **Adapt.** Can you crop, reframe, re-tone (`kh-tone-chilli`, `-blue` or `-sun`) or translate an existing asset?
4. **Generate.** Only now make new imagery with AI, following the protocol below and using the cast and the real Kheelu as references.
5. **Commission.** For hero campaigns, packaging, new product photos and anything with real children, brief a photographer or illustrator. Use this system as the brief.

Climbing down the ladder costs time, money and consistency. Write one line explaining why the rung above didn't work.

## When to create something new

- **A real gap:** no existing asset shows the feature, moment or message (for example a new language launch, a new safety feature, the Kheelu Speaker).
- **A new format:** a channel needs a size we don't have (for example a 9:16 story from a 4:5 post). Recompose first.
- **Ad fatigue, shown in data:** frequency above about 3 per week, or click-through falling for two weeks, on a live ad. Make 2–3 variants of the winning idea, not a new idea.
- **A new truth to prove:** a new review score, award, certification (once earned) or press mention.
- **A moment that matters to Indian families:** back-to-school (April and June), summer holidays, monsoon, Raksha Bandhan, Onam, Diwali, Children's Day (14 Nov), Christmas, Pongal/Sankranti, and Eid. Show the family moment, not religious symbols as decoration.

## When NOT to create

- An existing asset already does the job. Using it again is consistency, not laziness.
- It would show something Kheelu doesn't do: a screen, a camera, games on a phone, internet browsing, walking or moving, glowing eyes.
- It needs a new recurring child or parent. Use the cast. New cast members need founder approval and a full character sheet.
- It uses a real child's face, name, school or location without the parent's written consent. Even with consent, never show a real child's full name with their city.
- The claim isn't on the approved list in **Writing**.
- It's decoration for its own sake ("make it pop"). Add one doodle or one crayon mark from the library instead of a new illustration.
- You already have three untested variants. Test them first.
- It would copy another brand's layout, character or campaign, including the inspiration references in **Photography, chalk & crayon**.

## Before you make anything: write the brief

Fill this in. Ask for anything you can't fill.

```
Audience:     Primary parent / gift-giver / existing owner
The one job:  Stop the scroll / explain a feature / reassure on safety / close the sale / get a share
One message:  (one sentence, from the approved claims)
Proof:        (fact, demo, real testimonial, the science link)
Surface/size: (see Surfaces)
CTA:          (from the CTA table in Writing)
Cast & scene: (which character, which moment of the day)
Language(s):  English master + which regional versions
Deadline, owner, success metric: (e.g. CTR, pre-orders, shares)
```

## Who we sell to (India)

- **The intentional parent (primary).** 28–40, in metros and large cities (Bengaluru, Delhi NCR, Mumbai, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad), in upper-middle-class households, often with two working parents. Worries: screen time, school readiness, the home language fading, and whether AI is safe for a small child. Researches carefully and trusts other parents, WhatsApp groups and parenting creators. Gets persuaded by **safety proof, real children, and the parent app.**
- **The gift-giver.** Grandparents, aunts and uncles, including relatives abroad buying for a child in India. Wants a meaningful gift that isn't another screen. Gets persuaded by **joy, home languages and simplicity.**
- **The existing owner.** Wants to get more from Kheelu, share it and renew Kheelona+ later. Gets persuaded by **progress (new words, stories) and community.**

## Recipes

Build with the components; don't redraw them.

| Asset | Build it from | Notes |
|---|---|---|
| Instagram post, 4:5 | `SocialPost`: one tone, one cast sticker, optional Kheelu sticker, headline + one `hand` phrase | Keep the footer pill. Use one chilli pill per post at most |
| Story or Reel cover, 9:16 | `SocialPost` layout stretched to 1080×1920, or a 9:16 library photo | Keep text in the safe zone, below the top 14% and above the bottom third (the app's bars and Reel captions cover the rest). On a photo, use its calm top third, never a face or Kheelu |
| Performance ad | `SocialPost` + a price sticker (`Sticker round`, "₹499 reserves yours") | First 3 seconds: a child plus Kheelu, never a logo |
| Web section | `SectionHeading` + one of `FeatureCard` grid, `StepLoop`, `AgeTimeline`, `TrustList`, `ComparisonTable`, `FAQ` | Close every section with a `Button` cta or a link |
| Product page | Follow the page skeleton in **Selling** | `StickyBuyBar` on phones |
| Deck slide | `DeckSlide` title / statement / facts | One idea per slide; statement slides on the chalkboard |
| App screen | `TabBar`, `ListItem`, `AppSummaryCard`, `ParentControl`, `ModeSwitch`, form controls, `Alert`, `Toast`, `Dialog`, `EmptyState`, `Button` (primary) | Day theme by default; Bedtime after 7 pm or by setting |
| Email | 600px single column: hero image, `SectionHeading`, 2–3 `FeatureCard`s, one cta | Live text, never all-image |
| WhatsApp share | `kheelu-on-fur.jpg` or a 1:1 `SocialPost` + one line + link | Must make sense without the image |
| Print (quick-start card, insert) | Fur ground, ink text, Kalam for one line, Phosphor icons | At least 9pt; avoid thin chalk lines in print |

## AI generation protocol

**Tool:** the ElevenLabs Full Connector (image models). Use **Google Nano Banana Pro (`gemini-3-pro-image`)** for photoreal people and character consistency, at 4:5 or the needed ratio and 2K. For photos of the cast, follow **Making cast photos (step by step)**: it has the exact prompts, references, settings and checks.

**Always:**

1. Put the references on the flow first: the character's `*-portrait.jpg` and Kheelu's `kheelu-front.png`. Say in the prompt what each reference is for, and that the face, hair, skin tone and age must stay exactly the same while the clothes, pose, room and light change.
2. Start from the prompt blocks in **Making cast photos (step by step)**. Describe the light (window, side), camera (35mm, eye level), colour (Portra-like, matte) and imperfections (flyaways, creased cotton, a lived-in room).
3. Set the scene at home, in a studio or against a plain wall. Never outdoors.
4. Generate at least two variations per scene, compare them against the character sheet and the Kheelu anatomy table, and keep the best one. Discard any that fails the checklist below rather than fixing it in retouching. Small clean-ups are fine: trimming a dark film edge, or blanking garbled text on a book page or label (`tools/photo/`). Never retouch a face, hands or Kheelu.
5. Fix product errors by compositing the real Kheelu photo, not by regenerating until it looks close.
6. Name the file with an `-ai` suffix, and log the model, prompt, references, generation ID and date in the campaign notes.

**Never:**

- Generate Kheelu from text alone, change its design or invent new products.
- Generate new children, real people, celebrities, or children who resemble a real customer.
- Show children in swimwear, bath time, undressed or in any setting a parent would find inappropriate. Children are fully and everyday-dressed, in safe, supervised home settings.
- Show unsafe behaviour: a child alone near water, stairs or a stove, or a toddler with small parts.
- Make "testimonial" or "real customer" imagery.
- Put readable text in generated images. Add text in layout, in our fonts.

**The anti-AI-look checklist** (reject if any fail):

- [ ] Skin has texture and is matte, not glossy or porcelain.
- [ ] Hands have five fingers, natural nails and believable grips.
- [ ] Teeth and eyes look real for the age; no doll eyes, no perfect adult teeth on a 4-year-old.
- [ ] Hair has flyaways and real partings.
- [ ] The light comes from one believable source; there's no rim-glow halo.
- [ ] The room is a plausible Indian home, with no impossible furniture or garbled text on objects.
- [ ] The child looks their age and like their character sheet.
- [ ] Kheelu passes the anatomy table.
- [ ] Squint test: it looks like a phone or film photo, not a render.

**Disclosure:** never present AI-generated people as real. Follow each ad platform's AI-content labelling rules and the ASCI code. If someone asks whether a person in an ad is real, the answer is "an illustrative family".

## Making it in code (web, app, decks)

- Load `tokens.css`, `components/bundle.css` and React 18, then `components/bundle.js` (`window.Kheelona`). Use the components; don't copy their markup and restyle it.
- Use tokens for every value. If you need a value that isn't a token, the design probably needs to change, not the system. Raise it.
- Marketing artwork (`SocialPost`, `DeckSlide`) locks to the Day theme with `data-theme="light"`. App screens follow the user's theme.
- Export social and slides at 2x: 1080×1350 posts and 1920×1080 slides.

## Naming and storage

- **Campaign files:** `channel-campaign-format-variant-yyyymmdd.ext`, for example `ig-diwali26-post45-b-20261020.png`.
- **AI images:** add `-ai` before the date.
- **Cast scenes:** `castname-scene-ratio-v1.jpg`, for example `tara-bedtime-45-v1.jpg`.
- Add an asset to this design system only if at least three future outputs will reuse it (a new doodle, a new Kheelu angle, a new cast scene). Everything else lives in the campaign folder.
- Every new asset group needs a README that says what each file is for.

## The ship gate: check before anything goes out

**Brand**
- [ ] Only tokens; cream ground, one brand colour per block, sunshine as the only accent, one chilli CTA, the official logo.
- [ ] Baloo 2 / Nunito / Kalam only; one handwritten phrase at most.
- [ ] Cast and Kheelu used correctly; Imagination-layer rules followed.

**Sales**
- [ ] One message, one CTA, and the CTA is visible without scrolling on a phone.
- [ ] Price, offer and dates match the store today.
- [ ] Urgency is real (unit counts come from live inventory, or aren't shown).

**Truth and safety**
- [ ] Every claim is on the approved list.
- [ ] No real child without written consent; no AI person passed off as real.
- [ ] Nothing a careful parent would object to.

**Accessibility and India fit**
- [ ] Text contrast passes (see the token notes); captions on all video; alt text written.
- [ ] Rupee and date formats are right; languages are named in their own scripts.
- [ ] Cast balance across regions, genders and skin tones holds across the campaign.
