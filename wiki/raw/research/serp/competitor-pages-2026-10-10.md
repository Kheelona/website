---
title: "Competitor pages: titles, meta descriptions, H1, H2 and schema (2026-10-10)"
type: raw-capture
updated: 2026-10-10
sources:
  - "GET of each URL below with an iPhone Safari User-Agent and Accept-Language en-IN, redirects followed, one request at a time, 2 s apart; pass 1 2026-10-11 02:24-02:25 UTC, pass 2 02:38 UTC"
  - "Competitor set: brief §6 (Miko, PlayShifu, Smartivity, Skillmatics, Yoto, tonies), wiki/brand/positioning.md 'Competitors named' (MyWonder, Pookie), the September Perplexity answers in legacy-gsc-keyword-planner-2026-09.md (YUMI, AIVY, Kanha AI, Haivivi), and retailers parents shop (FirstCry, Hamleys, Lovevery)"
---

# Competitor pages (2026-10-10)

**What this is.** The words competitors put in the places search engines and answer engines read
first: `<title>`, meta description, H1, H2s and JSON-LD types, from the server HTML (no JavaScript
run). Visual and journey benchmarking is Market Research's job (`raw/research/benchmarks/`); this
file is only about **which search phrases each page targets**.

**Limits.** Server HTML only, so a page that builds its headings in JavaScript shows "(none)".
H2 lists drop cart, region and footer chrome. In the table, a `|` inside a competitor's title is
shown as `/` (table syntax); quoted text is otherwise verbatim. No Google ranking positions: WebSearch is US-only and
Google's results page was not scraped, so **who ranks in India for a phrase is not known** from this
capture.

**Method files** (scratchpad): `scripts/pagemeta.mjs`, `scripts/competitors*.txt`,
`out/competitor-pages-1.json`, `out/competitor-pages-2.json`.

## Readings (from this capture only)

1. **Skillmatics runs the clearest age template in India.** `/collections/3-6-years`: title "Buy
   Educational Toys for 3-5 Year Olds | Skillmatics"; meta "Buy learning toys for 3-5 years old
   kids, starting at Rs. 222"; H1 "Screen-Free & Engaging Activities for Kids Ages 3+"; one H2 per
   age ("Educational Toys For 3-Year-Olds", "Best Learning Toys For 4-Year-Olds", "Learning Toys for
   5-Year-Olds", "Learning Toys for 6-Year-Olds"); a "How to Pick…" H2; and **ItemList +
   BreadcrumbList + FAQPage** schema. `/collections/6-9-years` repeats it ("Buy Educational Toys for
   6-7 Year Old Kids"). Its home H1 is "Best Kids Educational Toys Brand In India". It also has a
   **return-gifts landing page** (`/pages/return-gifts-for-kids`).
2. **Miko India sells on "educational", "learning partner" and age 5-10**: home title "Miko 3 AI
   Robot – The Ultimate Educational Partner for Kids"; meta "…makes learning engaging for ages
   5-10"; Miko Mini "Interactive Learning Partner for Kids". It keeps a **comparison page**
   (`/pages/miko-mini-vs-miko-3`). Product schema only on the product page.
3. **The Indian AI-plush rivals target "AI" plus "plush", "companion" or "screen-free":**
   Pookie "AI Learning Plush Toy for Kids | Safe & Fun" ("kids 3+", "₹6,999"), with **FAQ H2s that
   are the questions parents ask** (age group, internet connectivity, privacy and data security,
   parental controls, battery life); MyWonder "Screenfree Conversational AI Learn-While-You-Play
   Device for Children"; AIVY "India's Own AI Plush Companion for Kids"; Kanha AI "Voice-First Child
   Companion" ("screen-free", "inspired by the spirit of Krishna").
4. **"Screen-free" is already claimed in titles**: tonies "#1 Screen-Free Audio Player for Kids",
   MyWonder, Skillmatics' H1 and meta ("100% safe, screen-free educational games"), Yoto's meta.
5. **Yoto and tonies do not sell in India directly**: yotoplay.com redirects to the UK store from an
   Indian IP; tonies.com/en-in/ is a 404. Indian autocomplete still asks for both
   ([google-autocomplete-in-2026-10-10.md](google-autocomplete-in-2026-10-10.md)).
6. **PlayShifu's age pages carry no unique title** (every page reuses the home title) and render no
   H2 in server HTML; FirstCry's category page and Hamleys' home ship generic or empty titles. Their
   pages are weak keyword evidence.
7. **No competitor page captured here uses "brain development toy" as its noun.** PlayShifu's meta
   mentions "enhanced brain development"; Skillmatics an H2 on "Cognitive Potential". The phrase is
   used by marketplace listings instead (see [amazon-in-2026-10-10.md](amazon-in-2026-10-10.md),
   [firstcry-suggest-2026-10-10.md](firstcry-suggest-2026-10-10.md)).
8. **Dead or wrong hosts** (recorded so nobody re-tries): `skillmatics.com` redirects to an
   unrelated US resort; `yumiai.in` did not resolve; `yumi.ai` is an unrelated finance site. YUMI's
   India presence found in this session is an Amazon.in listing ("Yumi Bear - AI Powered Talking
   Toy", ₹7,999).

## Pages
| # | URL (final) | Status | Title (chars) | Meta description | H1 | Main H2s (chrome removed) | JSON-LD types |
|---|---|---|---|---|---|---|---|
| 1 | https://miko.ai/ | 200 | Miko AI-Powered Robot: Smart Learning Partner for Kids (54) | Discover the Miko Robot, your child's new best friend for learning and entertainment. This AI-powered educational robot is designed to engage, educate, and entertain kids while fostering their cognitive development. Explore the world of Miko and unlock a world of interactive adventures today! | (none) | Meet Miko / Loved by the kids / Safe AI for Everyday Learning. / Safety, Privacy & Responsible AI / Safe AI for Everyday Learning. / Safe AI for Everyday Learning. | Organization, WebSite, SearchAction |
| 2 | https://in.miko.ai/ | 200 | Miko 3 AI Robot – The Ultimate Educational Partner for Kids – Miko India (72) | Gift your child the Miko 3 AI Robot, an interactive friend combining education and fun. With voice commands, educational games, face recognition, and multilingual support, Miko 3 makes learning engaging for ages 5-10. Enjoy special savings and enhance your child's learning journey with Miko 3. | (none) | Meet Miko / With the warmth of protection and bursts of laughter! / Loved by the kids / Intelligent Quotient / Emotional Quotient / Social Quotient | Organization, WebSite, SearchAction |
| 3 | https://in.miko.ai/products/miko-mini | 200 | Miko Mini AI Robot – Interactive Learning Partner for Kids – Miko India (71) | Discover Miko Mini, the tiny AI-powered robot that ignites curiosity, builds lifelong skills, and fosters empathy. With meaningful interactions, realistic reactions, amazing dance moves, and engaging STEAM content, it's the perfect teacher and friend for kids. | Miko Mini | Miko Mini / Nurturing the Young Minds, With More Conversations & Endless Fun! / Miko is Fun! Learn How / Game for Anything / Study Buddy / Simply Secure | Organization, Product, Brand, Offer |
| 4 | https://www.playshifu.com/ | 200 | PlayShifu / Learning And Educational Toys For Kids / STEM Toys (62) | Discover award-winning educational toys for kids that make learning fun! Our STEM toys combine physical & digital play for enhanced brain development. | Shop By Age / Buy More, Save More / Shop By Interest / More | Interactive learning toys for all ages / Handpicked bundles at unbeatable prices! | (none) |
| 5 | https://smartivity.com/ | 200 | Toys For Kids / Buy Educational DIY STEAM Toys Online for Boys – Smartivity USA (79) | Buy DIY STEAM Fun Toys For 8 to14 Years Kids Online. STEM DIY Educational Learning Toys, Science Chemistry Experiments Kits, Mechanical Toys, Engineering Projects, And Construction Based Activities &amp; Games For Kids. | Build it. Play it. Learn how it works. | Shop Early Holiday Deals / Kits kids can't put down / What they get out of it / The right build for every builder / Real kids, real play / What is your kid into? / Proudly award-winning / Over 10 million kits delivered worldwide! | Organization, WebSite, SearchAction |
| 6 | https://www.skillmatics.in/ (from https://skillmatics.in/) | 200 | Skillmatics: Buy Learning & Educational Toys For Kids Online in India (69) | Skillmatics India brings you educational toys & games online. Enjoy fun learning with 100% safe, screen-free educational games that promote your child. | Best Kids Educational Toys Brand In India: Skillmatics | Shop By Age / Now Trending / Handpicked For You / 1 crore+ Happy Families / Blogs / How Educational Toys Help Kids In Unlocking Their Cognitive Potential? / Types of Educational Toys Based on Learning Skills / Shop Learning Child Toys from Skillmatics India for all Age Groups | Organization, ContactPoint, WebSite, SearchAction, FAQPage, Question, Answer |
| 7 | https://www.innsofaurora.com/ (from https://skillmatics.com/) | 200 | Inns of Aurora Resort & Spa / Finger Lakes Lodging / Aurora, NY Hotels (70) | Tucked among a storybook village are the Inns of Aurora, our Finger Lakes lodging. Book your stay at our Aurora, NY hotels for a resort experience like no other. | The Iconic Finger Lakes Resort | The Spa / Weddings / Upcoming Activities / Stay Up-To-Date / Stay Up-To-Date | BreadcrumbList, ListItem, Organization, ImageObject, WebPage, WebSite |
| 8 | https://uk.yotoplay.com/ (from https://yotoplay.com/) | 200 | Autumn Sale / Save on Yoto Players, Bundles & Cards / Yoto UK (61) | More stories, more adventures and screen-free fun await. Shop Yoto’s Autumn Sale for 30% off selected bundles, 20% off selected players and cards, and up to 20% off selected accessories. | Autumn savings: up to 30% off. | This is Yoto / Discover a world of audio | (none) |
| 9 | https://tonies.com/en-gb/ | 200 | tonies® #1 Screen-Free Audio Player for Kids / Fun Educational Toys (67) | tonies® offers the Toniebox, a screen-free audio player for kids! Enjoy fun, educational storytelling with Tonies audio characters to inspire creativity. | (none) | Featured / Toniebox Lite / Discover something new / How Tonies works / Meet the whole gang / Songs, stories, games and more / More to explore / Discover the Toniebox | Corporation, WebSite |
| 10 | https://mywonder.in/ | 200 | Screenfree Conversational AI Learn-While-You-Play Device for Children – MyWonder (80) | Safe, Age-appropriate & Independent Learning through Play | (none) | Why Parents Choose MyWonder? Learning , Play & Growth / Listen to 1000+ Hours of Audio From World's Best Publishers / Families Love MyWonder Safe, Personal & Adaptive / Real time insights for Parents / Kids love MyWonder. Don't Miss This! / MyWonder is backed by Antler. Google for Startups AI India Accelerator 2025 Alumni. / Questions? | Organization, WebSite, SearchAction |
| 11 | https://scoobies.co.in/pages/pookie | 200 | AI Learning Plush Toy for Kids / Safe & Fun / Scoobies (54) | Meet Pookie, the AI-powered plush toy that sparks imagination and teaches through interactive play. Safe, emotional AI for kids 3+. Shop now for ₹6,999! | I'm Pookie / ₹ 6,999 / Artificial Intelligence and Privacy / Made to move with your child's imagination | ₹ 8,999 / Family-Friendly Screen-Light Play / Controlled by You — Simple Smart / Privacy You Can Trust / Safe & Smart AI / Playful Learning / Emotion-Aware Companion / Parent-Friendly Controls | Organization |
| 12 | https://scoobies.co.in/ | 200 | Kids Stationery, Toys & School Supplies Online – Scoobies (57) | Shop premium kids stationery, toys, backpacks, bottles & school supplies at Scoobies. Discover fun, creative, and high-quality collections for kids in India. | (none) | Moving Fast / Best in Scoobies | Organization, WebSite, SearchAction |
| 13 | https://yumiai.in/ | TypeError: fetch failed |  | (none) | (none) | (none) | (none) |
| 14 | https://aivytoys.com/ | 200 | AIVY – India's Own AI Plush Companion for Kids (46) | (none) | Meet AIVY — The Friend Who Thinks & Cuddles | Everything a Child Dreams of. Built Into One Huggable Friend. / Two Personalities. One Mission — Make Kids Smile 😄 / Premium Technology, Wrapped in Softness. / You're Always In Control. 💚 / Families Are Already Falling in Love 💕 / Pre-Order AIVY Today. Completely FREE. Zero Payment. / AIVY Goes Global 🌍 Showcased at Spielwarenmesse 2026 | (none) |
| 15 | https://www.haivivi.com/ | 200 | Haivivi Store Global (20) | (none) | (none) | PingPal / BubblePal / Get Ready for a Fantastic AI Ride with Haivivi! | Organization, WebSite, SearchAction |
| 16 | https://lovevery.com/ | 200 | Lovevery / Stage-Based Play for Your Child's Developing Brain (61) | Award-winning, Montessori-inspired toys and Play Kits for babies and toddlers. Right toys, right tools, right time with Lovevery.  | Experience the joy of learning through play | Explore The Play Kits by Age / We did all the research so you don’t have to | (none) |
| 17 | https://www.firstcry.com/ | 200 | Baby Products Online India, Kids Online Shopping, Baby Care Products at FirstCry.com (84) | Baby Products Online India, Kids Online Shopping, Baby Care Products at FirstCry.com | (none) | (none) | (none) |
| 18 | https://hamleys.in/ | 200 |  | Shop online with ease and explore a wide variety of quality products, latest arrivals, and exclusive deals—all in one place | (none) | (none) | Organization, ContactPoint, PostalAddress, WebSite |
| 19 | https://www.skillmatics.in/collections/3-6-years | 200 | Buy Educational Toys for 3-5 Year Olds / Skillmatics (52) | Buy learning toys for 3-5 years old kids, starting at Rs. 222. Boost your child’s creativity and problem-solving skills through play. Shop now. | Screen-Free & Engaging Activities for Kids Ages 3+ | Shop Parent-Approved Learning & Educational Toys for 3-6 Year Old Kids in India / Explore Top Categories of Toys for 3-6 Year Olds / Educational Toys For 3-Year-Olds / Arts & Craft Toys for 3-6 Year Old Boys and Girls / STEM Toys for 3-6 Year Old Kids / Best Learning Toys For 4-Year-Olds / Learning Toys for 5-Year-Olds / Learning Toys for 6-Year-Olds | Organization, ContactPoint, ItemList, ListItem, BreadcrumbList, FAQPage, Question, Answer |
| 20 | https://www.skillmatics.in/collections/6-9-years | 200 | Buy Educational Toys for 6-7 Year Old Kids / Skillmatics (56) | Buy educational toys for 6-7 year old boys. Discover fun learning games, activity toys, and brain-boosting gifts for growing children. Prices start at Rs. 222. Shop now. | Thoughtfully Designed Activities for Kids Ages 6+ | Educational & Learning Toys for Kids Aged 6-9 Years / Best Educational Toys for 6 Year Olds / Shop Learning Toys For 7-9 Year Olds / Creative Toys and Art Activities for 6-9 Year Olds / How to Choose Toys for 6-9 Year Old Kids / Benefits of Educational Games for 6-9 Year Olds / Why Choose Skillmatics To Buy Kids Learning Toys? | Organization, ContactPoint, ItemList, ListItem, BreadcrumbList, FAQPage, Question, Answer |
| 21 | https://www.skillmatics.in/pages/return-gifts-for-kids | 200 | Buy Return Gifts for Kids / Upto 25% Off / Skillmatics India (60) | Buy the best return gifts for kids at Skillmatics and enjoy up to 25% off! Explore fun, educational, and age-appropriate party favours that children will love. Shop now! | Planning a Birthday Party? Shop Return Gifts for Kids They'll Actually Love | 1 crore + Happy Families / Return Gifts by Age / Frequently Asked Questions / Shop Fun Playful Game For Kids Birthday Return Gifts / Occasions When You Can Give Party Return Gifts To Kids / Benefits of Educational Return Gifts For Kids / Why Choose Skillmatics To Buy Return Gifts Online? | Organization, ContactPoint |
| 22 | https://www.playshifu.com/shop/agerange/educational-toys-4-6-years | 200 | PlayShifu / Learning And Educational Toys For Kids / STEM Toys (62) | Discover award-winning educational toys for kids that make learning fun! Our STEM toys combine physical & digital play for enhanced brain development. | Shop By Interest / More / Support | (none) | (none) |
| 23 | https://www.playshifu.com/shop/agerange/educational-toys-6-8-years | 200 | PlayShifu / Learning And Educational Toys For Kids / STEM Toys (62) | Discover award-winning educational toys for kids that make learning fun! Our STEM toys combine physical & digital play for enhanced brain development. | Shop By Interest / More / Support | (none) | (none) |
| 24 | https://in.miko.ai/pages/miko-mini-vs-miko-3 | 200 | Miko Mini Vs Miko 3 – Miko India (32) | (none) | (none) | Retailers / Explore | Organization |
| 25 | https://miko.ai/blogs/overview | 200 | Overview – Miko (15) | (none) | Miko Blog | Category Picks / Retailers | Organization |
| 26 | https://mywonder.in/pages/my-wonder-companion | 200 | My Wonder Companion – MyWonder (30) | (none) | (none) | Safe , Independent Play for Children / Loved Across Homes / Rediscover the Joy of Parenting | Organization |
| 27 | https://www.smartivity.in/ (from https://smartivity.in/) | 200 | Toys For Kids / Buy DIY STEM Toys, Art & Craft Kits f... (56) | Buy DIY STEAM Fun Toys for 1 to 14-Year-Old Kids Online. STEM DIY Educational & Learning Toys, Science Chemistry Experiments Kits, Mechanical Toys, Engineering Projects, and Construction-Based Activities & Games for Kids. Perfect Art & Craft And Hobby Kits, Great Birthday Gifts For Ki... | Smarter kids, through play . / India's No. 1 Educational & Learning Toys Store Online: Smartivity | Proudly award-winning / Over 10 million kits delivered worldwide! / As featured in / Let customers speak for us / The Science Behind Smartivity: STEM toys for early learning / Why is STEM/STEAM education so important? / Educational Stem Toys / Kids Learning Toys | Organization, WebSite, SearchAction |
| 28 | https://www.firstcry.com/learning-and-educational-toys/5/106 | 200 | Baby Products Online India, Kids Online Shopping, Baby Care Products at FirstCry.com (84) | Baby Products Online India, Kids Online Shopping, Baby Care Products at FirstCry.com | (none) | (none) | (none) |
| 29 | https://kanhaji.ai/ | 200 | Kanha AI – Voice-First Child Companion (38) | Kanha AI is a safe, screen-free voice-first AI companion for children, inspired by the spirit of Krishna. It encourages curiosity, healthy routines and emotional growth while parents stay in control. | (none) | (none) | (none) |
| 30 | https://www.yumiai.in/ | TypeError: fetch failed |  | (none) | (none) | (none) | (none) |
| 31 | https://yumi.ai/ | 200 |  | (none) | Capital Re&#8209imagined | (none) | (none) |
| 32 | https://us.yotoplay.com/ | 200 | Fall Sale / Save on Yoto Players, Bundles & Content / Yoto USA (62) | Bring screen-free stories, music and play home with Yoto. Shop the Fall Sale for 30% off selected bundles, 25% off selected players, up to 25% off selected accessories and 20% off content packs. | Fall into savings: up to 30% off. | Discover a world of audio | (none) |
| 33 | https://tonies.com/en-in/ | 404 |  | (none) | Oops! This page got lost in the Tonieverse | (none) | (none) |
| 34 | https://hamleys.in/collections/learning-and-education | 404 | Hamleys India – Buy Toys, Games, LEGO, Barbie, Hot Wheels, Soft Toys & Gifts Online (83) | Shop premium toys & games online at Hamleys India. Explore LEGO sets, Barbie dolls, Hot Wheels cars, soft toys, puzzles, board games & more. Perfect gifts for kids of all ages with safe, high-quality designs. Order now to avail great discounts & offers at Hamleys India Online. Get fast delivery, easy returns & Cash on Delivery (COD) available. Order now for exciting offers! Discover top-quality toys, perfect for gifting and playtime! | (none) | (none) | (none) |
