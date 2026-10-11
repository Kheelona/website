---
title: "Google Trends, India: relative interest for category, talking/AI, brand and player terms (2026-10-10)"
type: raw-capture
updated: 2026-10-10
sources:
  - "https://trends.google.com/trends/explore?geo=IN&hl=en-IN&date=<window>&q=<terms>, loaded in a fresh headless Chrome profile (not the founder's browser) after the Trends home page; the page's own widget API responses recorded, 2026-10-11 02:09-02:23 UTC"
  - "Nine further attempts 2026-10-11 02:17-02:47 UTC all answered HTTP 429 (Too Many Requests); see 'Not captured' below"
---

# Google Trends, India (2026-10-10)

**What Trends gives.** Interest **relative to the highest point in one comparison** (0-100), for up
to five terms at once, India only, all categories, web search. It is **not volume**, and numbers
from different comparisons are **not on the same scale**. Keyword Planner volumes are in
[legacy-gsc-keyword-planner-2026-09.md](legacy-gsc-keyword-planner-2026-09.md).

**Access.** A plain GET to Trends answers 429. Loading the Trends home page first in a fresh headless
browser, then the explore page, worked for five comparisons; after that this IP was rate-limited
again (429 on all nine retries, spaced 45 s, 90 s and 180 s, until 02:47 UTC).

**Method files** (scratchpad): `scripts/trends.mjs`, `scripts/trends-parse.mjs`,
`out/trends-*.json`, `out/trends-parsed-*.json`.

## Readings (from this capture only)

1. **"educational toys" (19) and "learning toys" (22) are the category heads**; "brain development
   toys" averages 4 and "montessori toys" 6 in the same comparison; **"screen free toys" averages 0**
   (too little search to register in India). From mid-June to September 2026 "learning toys" ran at roughly twice
   "educational toys" (for example 41 vs 16, 47 vs 23, 45 vs 22).
2. **"brain development toys" related queries are baby-first**: top = baby brain development toys
   (100), kids brain development toys (33), for 2 year old (30), for 1 year old (20), **for 3 year
   old (13)**.
3. **"educational toys" related queries name ages 3-7 directly**: for 5 year old (10), for 3 year
   olds (9), for 4 year olds (8), for 3 4 year olds (5), for 5 year olds (4), for 7 year olds (3),
   for 6 year olds (2). Rising: "educational toys for 3 4 year olds" +300%, "for 4 year olds" +90%.
4. **"ai toys" is not a toy signal.** Its top related queries are "ai news" (100), "gemini ai" (35),
   "claude ai" (15); "ai toys for kids" (60) is the only toy-shaped one. Its single peak (100) is the
   week of 30 Nov-6 Dec 2025.
5. **"talking toy" is a cactus.** Top related: "cactus talking toy" (100), "cactus toy" (100), the
   long Amazon title of a dancing-cactus mimic toy (Breakout). Not a signal for a ₹4,999 AI toy.
6. **"speech toys" averages 1**; "interactive toys" is mostly pet toys (dog toys 100, cat toys 84).
7. **Brands, 12 months**: Miko 67, Skillmatics 25, Smartivity 17, PlayShifu 1, **Kheelona 0**.
   "Miko" is ambiguous (Genshin Impact's "Yae Miko" fills its autocomplete), so its line overstates
   the robot. Over 5 years "miko robot" averages 2 against "talking toy" 7; its related queries are
   price-led: miko robot price (100), price india (38), price in india (31), amazon (20).
8. **Seasonality is not readable at this volume.** Weekly values for the category terms jump between
   0 and single digits, which itself says absolute volumes are small. "educational toys" peaked in
   the week of 8-14 Feb 2026 (72; "learning toys" 40), not around Diwali (week of 19-25 Oct 2025:
   8). The cause of the February peak is not known.

## Not captured (429): retry from another session or ask for an export

- Ages compared directly: toys for 3 / 4 / 5 / 6 / 7 year old (12 months).
- Category heads over 5 years with "gift for kids" and "toys for kids" (for seasonality).
- Learn terms: screen time, speech delay, brain development, ai for kids, against educational toys.
- A bridge comparison anchoring "educational toys" against talking toy, gift for kids, toys for 3
  year old and screen time, which would put B and A on one scale.

## A. Category heads, 12 months

URL: `https://trends.google.com/trends/explore?date=today%2012-m&geo=IN&q=educational%20toys,learning%20toys,brain%20development%20toys,montessori%20toys,screen%20free%20toys&hl=en-IN`  
Captured: 2026-10-11T02:11:06.244Z · window 5 – 11 Oct 2025 to 11 – 17 Oct 2026 (54 points; the last is partial)

| Term | Average interest (0-100, this comparison only) |
|---|---|
| educational toys | 19 |
| learning toys | 22 |
| brain development toys | 4 |
| montessori toys | 6 |
| screen free toys | 0 |

<details><summary>Series (each point: educational toys / learning toys / brain development toys / montessori toys / screen free toys)</summary>

- 5 – 11 Oct 2025: 8,8,5,5,0
- 12 – 18 Oct 2025: 9,5,4,0,0
- 19 – 25 Oct 2025: 8,8,0,0,0
- 26 Oct – 1 Nov 2025: 11,9,0,7,0
- 2 – 8 Nov 2025: 14,13,5,5,0
- 9 – 15 Nov 2025: 13,10,4,0,0
- 16 – 22 Nov 2025: 11,12,0,6,0
- 23 – 29 Nov 2025: 21,18,5,9,0
- 30 Nov – 6 Dec 2025: 19,19,5,8,0
- 7 – 13 Dec 2025: 25,14,4,8,0
- 14 – 20 Dec 2025: 23,17,5,6,4
- 21 – 27 Dec 2025: 18,15,4,6,0
- 28 Dec 2025 – 3 Jan 2026: 16,14,6,7,0
- 4 – 10 Jan 2026: 19,12,4,7,0
- 11 – 17 Jan 2026: 16,16,5,4,0
- 18 – 24 Jan 2026: 14,12,3,5,0
- 25 – 31 Jan 2026: 15,15,5,5,0
- 1 – 7 Feb 2026: 15,14,0,8,0
- 8 – 14 Feb 2026: 72,40,0,16,0
- 15 – 21 Feb 2026: 100,60,6,27,0
- 22 – 28 Feb 2026: 37,27,8,11,0
- 1 – 7 Mar 2026: 13,10,7,0,0
- 8 – 14 Mar 2026: 18,14,4,5,0
- 15 – 21 Mar 2026: 18,13,5,8,0
- 22 – 28 Mar 2026: 15,13,4,7,0
- 29 Mar – 4 Apr 2026: 16,13,4,6,4
- 5 – 11 Apr 2026: 17,12,0,4,0
- 12 – 18 Apr 2026: 16,12,0,5,0
- 19 – 25 Apr 2026: 14,18,0,6,5
- 26 Apr – 2 May 2026: 18,12,4,4,0
- 3 – 9 May 2026: 17,15,0,7,0
- 10 – 16 May 2026: 19,17,0,12,0
- 17 – 23 May 2026: 27,22,0,15,0
- 24 – 30 May 2026: 19,16,4,8,0
- 31 May – 6 Jun 2026: 15,20,3,5,0
- 7 – 13 Jun 2026: 13,24,0,5,0
- 14 – 20 Jun 2026: 16,41,8,5,0
- 21 – 27 Jun 2026: 22,44,6,5,0
- 28 Jun – 4 Jul 2026: 17,40,8,7,0
- 5 – 11 Jul 2026: 17,29,9,5,0
- 12 – 18 Jul 2026: 13,33,7,5,0
- 19 – 25 Jul 2026: 19,32,7,5,0
- 26 Jul – 1 Aug 2026: 15,36,10,3,0
- 2 – 8 Aug 2026: 21,49,10,6,0
- 9 – 15 Aug 2026: 23,47,7,6,0
- 16 – 22 Aug 2026: 24,42,8,5,0
- 23 – 29 Aug 2026: 16,28,5,6,0
- 30 Aug – 5 Sept 2026: 18,30,6,6,0
- 6 – 12 Sept 2026: 22,45,8,5,0
- 13 – 19 Sept 2026: 20,32,5,6,0
- 20 – 26 Sept 2026: 10,21,0,0,0
- 27 Sept – 3 Oct 2026: 10,10,4,5,0
- 4 – 10 Oct 2026: 10,13,4,5,0
- 11 – 17 Oct 2026: 0,0,0,0,0 (partial)

</details>

Related queries (Google labels them by the term they expand; a blank list means Trends had too little data):

- **learning toys**. Top: toys for learning (100) · children learning toys (50) · kids learning toys (25) · learning toys for kids (18) · toys for kids (18) · baby learning toys (13) · learning resources toys (7) · learning toys for toddlers (6) · learning toys for 1 year old (3) · learning toys for 2 year old (3) · alphabet learning toys (3) · learning toys for 2 year olds (2) · what is machine learning (2) · best dog toys for chewers (1) · learning toys for 3 year olds (1) · learning toys for 4 year olds (1) · best learning toys for 2 year old (1) · what is machine learning used for (<1) · machine learning algorithms (<1) · deep learning tutorials (<1) · machine learning models (<1). Rising: what is machine learning used for (Breakout) · machine learning algorithms (Breakout) · deep learning tutorials (Breakout) · machine learning models (Breakout) · what is machine learning (+550%) · children learning toys (+450%) · learning resources toys (+350%) · best dog toys for chewers (+100%)
- **brain development toys**. Top: baby brain development toys (100) · kids brain development toys (33) · brain development toys for 2 year old (30) · brain development toys for 1 year old (20) · brain development toys for 3 year old (13). Rising: *(none)*
- **educational toys**. Top: kids toys (100) · toys for kids (81) · educational toys for kids (80) · educational toys for children (51) · wooden educational toys (43) · baby educational toys (36) · educational toys for toddlers (21) · educational toys for 1 year old (12) · educational toys for 2 year old (11) · educational toys for 5 year old (10) · educational toys for 3 year olds (9) · educational toys for 4 year olds (8) · educational toys for 3 4 year olds (5) · educational toys for 5 year olds (4) · educational toys for 2 year olds (4) · educational toys for 7 year olds (3) · educational toys for 10 year olds (3) · educational toys for 6 year olds (2) · open-ended toys must be wooden toys truefalse check (1) · best dog toys for chewers (1). Rising: best dog toys for chewers (Breakout) · educational toys for children (+550%) · educational toys for 3 4 year olds (+300%) · educational toys for 4 year olds (+90%) · open-ended toys must be wooden toys truefalse check (+70%) · educational toys for toddlers (+60%) · wooden educational toys (+50%)
- **screen free toys**. Top: *(none)*. Rising: *(none)*
- **montessori toys**. Top: wooden montessori toys (100) · montessori baby toys (90) · montessori toys for 1 year old (43) · montessori busy board (35) · what is montessori toys (33) · montessori toys for 2 year old (29) · montessori toys for babies (19) · montessori toys for 3 year old (18) · montessori toys for 6 month old (6) · montessori toys for 4 year olds (<1). Rising: what is montessori toys (+200%) · montessori busy board (+150%) · wooden montessori toys (+60%) · montessori baby toys (+40%)

## B. Talking, AI and smart toys, 12 months

URL: `https://trends.google.com/trends/explore?date=today%2012-m&geo=IN&q=talking%20toy,ai%20toys,smart%20toys,interactive%20toys,speech%20toys&hl=en-IN`  
Captured: 2026-10-11T02:13:26.537Z · window 5 – 11 Oct 2025 to 11 – 17 Oct 2026 (54 points; the last is partial)

| Term | Average interest (0-100, this comparison only) |
|---|---|
| talking toy | 21 |
| ai toys | 34 |
| smart toys | 12 |
| interactive toys | 9 |
| speech toys | 1 |

<details><summary>Series (each point: talking toy / ai toys / smart toys / interactive toys / speech toys)</summary>

- 5 – 11 Oct 2025: 13,13,9,9,0
- 12 – 18 Oct 2025: 17,10,7,7,0
- 19 – 25 Oct 2025: 18,9,0,0,0
- 26 Oct – 1 Nov 2025: 18,22,0,0,0
- 2 – 8 Nov 2025: 17,38,14,7,0
- 9 – 15 Nov 2025: 13,39,0,0,0
- 16 – 22 Nov 2025: 21,36,7,0,8
- 23 – 29 Nov 2025: 20,76,19,9,0
- 30 Nov – 6 Dec 2025: 27,100,27,15,0
- 7 – 13 Dec 2025: 27,89,19,8,0
- 14 – 20 Dec 2025: 18,58,15,10,0
- 21 – 27 Dec 2025: 21,49,12,11,0
- 28 Dec 2025 – 3 Jan 2026: 16,39,12,8,0
- 4 – 10 Jan 2026: 16,35,9,0,0
- 11 – 17 Jan 2026: 18,33,12,8,0
- 18 – 24 Jan 2026: 20,40,12,14,0
- 25 – 31 Jan 2026: 12,39,10,9,7
- 1 – 7 Feb 2026: 21,36,13,12,0
- 8 – 14 Feb 2026: 26,43,37,58,7
- 15 – 21 Feb 2026: 25,61,45,70,11
- 22 – 28 Feb 2026: 19,48,22,27,10
- 1 – 7 Mar 2026: 14,34,14,8,0
- 8 – 14 Mar 2026: 16,40,9,9,0
- 15 – 21 Mar 2026: 19,41,15,7,0
- 22 – 28 Mar 2026: 16,33,11,11,0
- 29 Mar – 4 Apr 2026: 16,37,17,7,0
- 5 – 11 Apr 2026: 23,35,7,8,8
- 12 – 18 Apr 2026: 19,32,13,10,0
- 19 – 25 Apr 2026: 24,35,15,0,0
- 26 Apr – 2 May 2026: 16,37,11,0,0
- 3 – 9 May 2026: 14,48,13,9,0
- 10 – 16 May 2026: 17,46,13,9,0
- 17 – 23 May 2026: 14,31,15,9,0
- 24 – 30 May 2026: 19,38,12,9,0
- 31 May – 6 Jun 2026: 21,42,19,8,0
- 7 – 13 Jun 2026: 21,36,13,9,0
- 14 – 20 Jun 2026: 22,28,8,0,0
- 21 – 27 Jun 2026: 21,40,9,10,0
- 28 Jun – 4 Jul 2026: 32,33,12,8,0
- 5 – 11 Jul 2026: 23,36,13,6,7
- 12 – 18 Jul 2026: 27,24,9,0,0
- 19 – 25 Jul 2026: 28,16,0,0,0
- 26 Jul – 1 Aug 2026: 26,14,6,8,0
- 2 – 8 Aug 2026: 27,19,11,12,9
- 9 – 15 Aug 2026: 33,18,9,0,0
- 16 – 22 Aug 2026: 31,13,11,8,0
- 23 – 29 Aug 2026: 28,15,12,0,0
- 30 Aug – 5 Sept 2026: 22,26,13,0,0
- 6 – 12 Sept 2026: 36,26,11,11,0
- 13 – 19 Sept 2026: 24,25,11,11,0
- 20 – 26 Sept 2026: 27,20,19,0,0
- 27 Sept – 3 Oct 2026: 31,11,7,4,2
- 4 – 10 Oct 2026: 18,13,8,6,2
- 11 – 17 Oct 2026: 0,0,0,0,0 (partial)

</details>

Related queries (Google labels them by the term they expand; a blank list means Trends had too little data):

- **speech toys**. Top: *(none)*. Rising: *(none)*
- **interactive toys**. Top: dog toys (100) · cat toys (84) · interactive toys for kids (67) · baby interactive toys (45) · interactive toys for dogs (40) · interactive toys for cats (32) · interactive talking toys (14) · interactive toys for 1 year old (10) · interactive toys for 2 year olds (3). Rising: dog toys (+70%) · interactive toys for cats (+60%) · cat toys (+50%)
- **smart toys**. Top: smart toys for kids (100) · smart watch (79) · what is a smart home (11) · what is a smart plug (6). Rising: what is a smart home (Breakout) · what is a smart plug (Breakout)
- **ai toys**. Top: ai news (100) · kids toys (76) · ai toys for kids (60) · gemini ai (35) · claude ai (15). Rising: ai news (+1,500%) · claude ai (+400%)
- **talking toy**. Top: cactus talking toy (100) · cactus toy (100) · talking toy for baby (22) · indian lifestyle cactus talking toy dancing cactus repeats what you say,electronic plush toy lighting,singing cactus recording repeat your words educa (10). Rising: indian lifestyle cactus talking toy dancing cactus repeats what you say,electronic plush toy lighting,singing cactus recording repeat your words educa (Breakout)

## C. Brands, 12 months

URL: `https://trends.google.com/trends/explore?date=today%2012-m&geo=IN&q=Miko,PlayShifu,Smartivity,Skillmatics,Kheelona&hl=en-IN`  
Captured: 2026-10-11T02:17:33.397Z · window 5 – 11 Oct 2025 to 11 – 17 Oct 2026 (54 points; the last is partial)

| Term | Average interest (0-100, this comparison only) |
|---|---|
| Miko | 67 |
| PlayShifu | 1 |
| Smartivity | 17 |
| Skillmatics | 25 |
| Kheelona | 0 |

<details><summary>Series (each point: Miko / PlayShifu / Smartivity / Skillmatics / Kheelona)</summary>

- 5 – 11 Oct 2025: 76,0,8,20,0
- 12 – 18 Oct 2025: 50,0,12,22,0
- 19 – 25 Oct 2025: 60,0,8,19,0
- 26 Oct – 1 Nov 2025: 64,0,9,20,0
- 2 – 8 Nov 2025: 69,0,15,18,0
- 9 – 15 Nov 2025: 74,0,21,28,0
- 16 – 22 Nov 2025: 58,0,20,20,0
- 23 – 29 Nov 2025: 68,0,17,25,0
- 30 Nov – 6 Dec 2025: 74,0,12,24,0
- 7 – 13 Dec 2025: 100,0,14,36,0
- 14 – 20 Dec 2025: 65,0,16,26,0
- 21 – 27 Dec 2025: 72,9,20,30,0
- 28 Dec 2025 – 3 Jan 2026: 91,9,15,22,0
- 4 – 10 Jan 2026: 79,0,17,27,0
- 11 – 17 Jan 2026: 89,7,14,19,0
- 18 – 24 Jan 2026: 75,0,20,26,0
- 25 – 31 Jan 2026: 58,0,17,25,0
- 1 – 7 Feb 2026: 56,0,11,21,0
- 8 – 14 Feb 2026: 76,0,16,23,0
- 15 – 21 Feb 2026: 69,0,12,22,0
- 22 – 28 Feb 2026: 82,8,13,17,0
- 1 – 7 Mar 2026: 55,0,17,23,0
- 8 – 14 Mar 2026: 58,0,16,15,0
- 15 – 21 Mar 2026: 55,0,15,24,0
- 22 – 28 Mar 2026: 66,0,16,22,0
- 29 Mar – 4 Apr 2026: 64,0,12,21,0
- 5 – 11 Apr 2026: 63,0,15,14,0
- 12 – 18 Apr 2026: 62,0,10,19,0
- 19 – 25 Apr 2026: 66,0,9,20,0
- 26 Apr – 2 May 2026: 60,0,20,18,0
- 3 – 9 May 2026: 65,0,20,26,0
- 10 – 16 May 2026: 67,0,29,37,0
- 17 – 23 May 2026: 64,0,58,51,0
- 24 – 30 May 2026: 74,0,24,36,0
- 31 May – 6 Jun 2026: 80,0,21,29,0
- 7 – 13 Jun 2026: 62,0,15,22,0
- 14 – 20 Jun 2026: 59,0,10,24,0
- 21 – 27 Jun 2026: 60,7,22,27,0
- 28 Jun – 4 Jul 2026: 75,0,17,22,0
- 5 – 11 Jul 2026: 77,0,15,21,0
- 12 – 18 Jul 2026: 76,0,12,21,0
- 19 – 25 Jul 2026: 67,0,18,23,0
- 26 Jul – 1 Aug 2026: 62,0,14,28,0
- 2 – 8 Aug 2026: 53,0,16,26,0
- 9 – 15 Aug 2026: 66,0,19,31,0
- 16 – 22 Aug 2026: 76,0,19,37,0
- 23 – 29 Aug 2026: 76,0,20,41,0
- 30 Aug – 5 Sept 2026: 66,0,21,28,0
- 6 – 12 Sept 2026: 70,0,19,20,0
- 13 – 19 Sept 2026: 68,0,17,28,0
- 20 – 26 Sept 2026: 63,0,19,33,0
- 27 Sept – 3 Oct 2026: 64,4,18,26,0
- 4 – 10 Oct 2026: 59,4,16,25,0
- 11 – 17 Oct 2026: 0,0,0,0,0 (partial)

</details>

Related queries (Google labels them by the term they expand; a blank list means Trends had too little data):

- **PlayShifu**. Top: *(none)*. Rising: *(none)*
- **Skillmatics**. Top: *(none)*. Rising: *(none)*
- **Smartivity**. Top: *(none)*. Rising: *(none)*
- **Kheelona**. Top: *(none)*. Rising: *(none)*
- **Miko**. Top: *(none)*. Rising: *(none)*

## D. AI toy, talking toy and players, 5 years

URL: `https://trends.google.com/trends/explore?date=today%205-y&geo=IN&q=ai%20toys,ai%20toy,talking%20toy,miko%20robot,yoto&hl=en-IN`  
Captured: 2026-10-11T02:22:57.536Z · window 10 – 16 Oct 2021 to 11 – 17 Oct 2026 (262 points; the last is partial)

| Term | Average interest (0-100, this comparison only) |
|---|---|
| ai toys | 2 |
| ai toy | 4 |
| talking toy | 7 |
| miko robot | 2 |
| yoto | 5 |

<details><summary>Series (each point: ai toys / ai toy / talking toy / miko robot / yoto)</summary>

- 10 – 16 Oct 2021: 0,0,5,2,0
- 17 – 23 Oct 2021: 0,0,4,2,0
- 24 – 30 Oct 2021: 0,0,4,3,0
- 31 Oct – 6 Nov 2021: 0,0,4,3,0
- 7 – 13 Nov 2021: 0,0,4,2,0
- 14 – 20 Nov 2021: 0,0,8,3,0
- 21 – 27 Nov 2021: 0,0,13,3,2
- 28 Nov – 4 Dec 2021: 0,0,9,4,2
- 5 – 11 Dec 2021: 0,0,10,4,0
- 12 – 18 Dec 2021: 0,0,9,5,0
- 19 – 25 Dec 2021: 0,0,8,4,0
- 26 Dec 2021 – 1 Jan 2022: 0,0,9,4,0
- 2 – 8 Jan 2022: 0,0,9,3,0
- 9 – 15 Jan 2022: 0,0,13,3,2
- 16 – 22 Jan 2022: 0,0,12,2,0
- 23 – 29 Jan 2022: 0,0,14,4,2
- 30 Jan – 5 Feb 2022: 0,0,18,3,2
- 6 – 12 Feb 2022: 0,0,18,4,0
- 13 – 19 Feb 2022: 0,0,17,4,2
- 20 – 26 Feb 2022: 0,0,19,4,2
- 27 Feb – 5 Mar 2022: 0,0,17,6,2
- 6 – 12 Mar 2022: 0,0,13,5,0
- 13 – 19 Mar 2022: 0,0,10,3,2
- 20 – 26 Mar 2022: 0,0,12,4,1
- 27 Mar – 2 Apr 2022: 0,0,11,3,2
- 3 – 9 Apr 2022: 0,0,11,3,2
- 10 – 16 Apr 2022: 0,0,8,3,2
- 17 – 23 Apr 2022: 0,1,10,3,2
- 24 – 30 Apr 2022: 0,2,12,4,1
- 1 – 7 May 2022: 0,0,12,4,3
- 8 – 14 May 2022: 0,0,12,3,2
- 15 – 21 May 2022: 0,0,13,4,2
- 22 – 28 May 2022: 0,0,13,5,0
- 29 May – 4 Jun 2022: 0,0,13,4,0
- 5 – 11 Jun 2022: 0,0,13,4,2
- 12 – 18 Jun 2022: 0,0,10,4,3
- 19 – 25 Jun 2022: 0,0,10,3,2
- 26 Jun – 2 Jul 2022: 0,0,10,4,3
- 3 – 9 Jul 2022: 0,0,8,3,3
- 10 – 16 Jul 2022: 0,0,10,3,3
- 17 – 23 Jul 2022: 0,0,11,2,3
- 24 – 30 Jul 2022: 0,0,11,2,3
- 31 Jul – 6 Aug 2022: 0,0,9,2,4
- 7 – 13 Aug 2022: 0,0,11,4,2
- 14 – 20 Aug 2022: 0,0,10,3,3
- 21 – 27 Aug 2022: 0,0,10,2,3
- 28 Aug – 3 Sept 2022: 0,0,8,3,4
- 4 – 10 Sept 2022: 0,0,7,3,4
- 11 – 17 Sept 2022: 0,0,8,2,3
- 18 – 24 Sept 2022: 0,0,7,2,5
- 25 Sept – 1 Oct 2022: 0,0,9,3,4
- 2 – 8 Oct 2022: 0,0,8,2,4
- 9 – 15 Oct 2022: 0,0,8,2,4
- 16 – 22 Oct 2022: 0,0,9,2,4
- 23 – 29 Oct 2022: 0,0,8,2,4
- 30 Oct – 5 Nov 2022: 0,0,8,2,3
- 6 – 12 Nov 2022: 0,0,8,2,4
- 13 – 19 Nov 2022: 0,0,9,3,4
- 20 – 26 Nov 2022: 0,0,10,3,2
- 27 Nov – 3 Dec 2022: 0,0,10,5,5
- 4 – 10 Dec 2022: 0,0,9,1,3
- 11 – 17 Dec 2022: 0,0,9,1,3
- 18 – 24 Dec 2022: 0,1,8,3,3
- 25 – 31 Dec 2022: 0,0,10,3,4
- 1 – 7 Jan 2023: 0,0,9,2,7
- 8 – 14 Jan 2023: 0,0,8,2,14
- 15 – 21 Jan 2023: 0,1,9,3,21
- 22 – 28 Jan 2023: 0,0,7,3,17
- 29 Jan – 4 Feb 2023: 0,1,8,3,16
- 5 – 11 Feb 2023: 0,1,9,2,13
- 12 – 18 Feb 2023: 0,0,10,2,9
- 19 – 25 Feb 2023: 0,1,9,1,8
- 26 Feb – 4 Mar 2023: 0,1,9,2,9
- 5 – 11 Mar 2023: 0,0,8,2,8
- 12 – 18 Mar 2023: 0,2,9,2,8
- 19 – 25 Mar 2023: 0,1,8,4,8
- 26 Mar – 1 Apr 2023: 0,0,8,2,7
- 2 – 8 Apr 2023: 0,0,9,3,8
- 9 – 15 Apr 2023: 0,0,7,1,6
- 16 – 22 Apr 2023: 0,0,8,2,7
- 23 – 29 Apr 2023: 0,0,9,2,5
- 30 Apr – 6 May 2023: 0,0,7,2,4
- 7 – 13 May 2023: 0,1,7,1,5
- 14 – 20 May 2023: 1,1,6,2,5
- 21 – 27 May 2023: 0,1,8,2,5
- 28 May – 3 Jun 2023: 0,2,7,2,6
- 4 – 10 Jun 2023: 0,2,9,2,7
- 11 – 17 Jun 2023: 1,1,8,2,6
- 18 – 24 Jun 2023: 0,0,8,2,7
- 25 Jun – 1 Jul 2023: 1,1,7,2,8
- 2 – 8 Jul 2023: 0,1,7,2,9
- 9 – 15 Jul 2023: 0,0,7,2,9
- 16 – 22 Jul 2023: 0,1,7,2,11
- 23 – 29 Jul 2023: 2,0,8,2,9
- 30 Jul – 5 Aug 2023: 2,0,7,2,9
- 6 – 12 Aug 2023: 0,1,7,2,8
- 13 – 19 Aug 2023: 0,0,8,2,8
- 20 – 26 Aug 2023: 0,2,6,2,8
- 27 Aug – 2 Sept 2023: 0,0,9,1,10
- 3 – 9 Sept 2023: 1,2,6,2,11
- 10 – 16 Sept 2023: 0,1,7,1,9
- 17 – 23 Sept 2023: 2,2,5,2,12
- 24 – 30 Sept 2023: 0,1,4,1,9
- 1 – 7 Oct 2023: 0,2,5,2,9
- 8 – 14 Oct 2023: 0,1,7,1,12
- 15 – 21 Oct 2023: 0,1,4,1,10
- 22 – 28 Oct 2023: 0,0,5,2,15
- 29 Oct – 4 Nov 2023: 0,2,5,2,14
- 5 – 11 Nov 2023: 0,0,6,2,13
- 12 – 18 Nov 2023: 0,0,6,2,13
- 19 – 25 Nov 2023: 1,26,5,2,19
- 26 Nov – 2 Dec 2023: 1,3,7,2,19
- 3 – 9 Dec 2023: 0,2,7,1,18
- 10 – 16 Dec 2023: 1,3,7,2,17
- 17 – 23 Dec 2023: 0,4,6,2,20
- 24 – 30 Dec 2023: 2,2,7,2,20
- 31 Dec 2023 – 6 Jan 2024: 0,2,6,2,20
- 7 – 13 Jan 2024: 0,3,7,2,13
- 14 – 20 Jan 2024: 0,3,7,2,10
- 21 – 27 Jan 2024: 1,3,4,1,12
- 28 Jan – 3 Feb 2024: 0,4,7,2,8
- 4 – 10 Feb 2024: 2,2,7,0,11
- 11 – 17 Feb 2024: 2,3,5,0,13
- 18 – 24 Feb 2024: 2,3,6,2,11
- 25 Feb – 2 Mar 2024: 0,3,5,0,13
- 3 – 9 Mar 2024: 2,2,7,2,14
- 10 – 16 Mar 2024: 0,3,5,0,14
- 17 – 23 Mar 2024: 2,2,5,0,8
- 24 – 30 Mar 2024: 0,0,5,2,10
- 31 Mar – 6 Apr 2024: 0,0,5,2,9
- 7 – 13 Apr 2024: 2,2,6,0,13
- 14 – 20 Apr 2024: 0,0,4,0,12
- 21 – 27 Apr 2024: 1,2,5,0,9
- 28 Apr – 4 May 2024: 1,2,5,2,10
- 5 – 11 May 2024: 0,2,4,0,9
- 12 – 18 May 2024: 0,2,4,0,9
- 19 – 25 May 2024: 3,2,4,2,8
- 26 May – 1 Jun 2024: 0,3,4,0,10
- 2 – 8 Jun 2024: 0,2,5,2,7
- 9 – 15 Jun 2024: 1,2,6,0,7
- 16 – 22 Jun 2024: 2,2,3,0,9
- 23 – 29 Jun 2024: 2,2,4,0,6
- 30 Jun – 6 Jul 2024: 0,2,3,1,7
- 7 – 13 Jul 2024: 1,2,5,0,6
- 14 – 20 Jul 2024: 0,2,4,2,6
- 21 – 27 Jul 2024: 2,2,2,2,8
- 28 Jul – 3 Aug 2024: 0,1,4,0,8
- 4 – 10 Aug 2024: 2,3,5,2,8
- 11 – 17 Aug 2024: 2,1,6,0,7
- 18 – 24 Aug 2024: 0,3,5,2,8
- 25 – 31 Aug 2024: 1,3,5,0,8
- 1 – 7 Sept 2024: 3,2,4,2,7
- 8 – 14 Sept 2024: 2,0,5,0,8
- 15 – 21 Sept 2024: 2,2,4,0,7
- 22 – 28 Sept 2024: 2,3,4,0,8
- 29 Sept – 5 Oct 2024: 1,2,4,0,9
- 6 – 12 Oct 2024: 0,3,5,0,10
- 13 – 19 Oct 2024: 0,2,5,0,8
- 20 – 26 Oct 2024: 2,4,4,0,5
- 27 Oct – 2 Nov 2024: 3,2,5,0,3
- 3 – 9 Nov 2024: 2,2,4,0,5
- 10 – 16 Nov 2024: 0,2,4,0,5
- 17 – 23 Nov 2024: 2,3,4,0,4
- 24 – 30 Nov 2024: 3,2,4,0,4
- 1 – 7 Dec 2024: 2,3,3,0,5
- 8 – 14 Dec 2024: 2,2,4,0,5
- 15 – 21 Dec 2024: 2,0,4,0,4
- 22 – 28 Dec 2024: 2,3,4,0,4
- 29 Dec 2024 – 4 Jan 2025: 0,3,4,0,3
- 5 – 11 Jan 2025: 2,3,4,0,3
- 12 – 18 Jan 2025: 0,2,4,0,3
- 19 – 25 Jan 2025: 2,5,4,0,4
- 26 Jan – 1 Feb 2025: 2,3,4,2,3
- 2 – 8 Feb 2025: 2,4,6,0,4
- 9 – 15 Feb 2025: 2,4,5,0,2
- 16 – 22 Feb 2025: 3,3,4,0,4
- 23 Feb – 1 Mar 2025: 0,2,4,0,4
- 2 – 8 Mar 2025: 3,2,4,0,2
- 9 – 15 Mar 2025: 0,2,4,3,3
- 16 – 22 Mar 2025: 2,3,4,0,5
- 23 – 29 Mar 2025: 2,3,4,0,4
- 30 Mar – 5 Apr 2025: 4,5,5,2,4
- 6 – 12 Apr 2025: 3,11,4,0,3
- 13 – 19 Apr 2025: 2,12,3,2,3
- 20 – 26 Apr 2025: 2,5,4,0,0
- 27 Apr – 3 May 2025: 2,2,4,2,0
- 4 – 10 May 2025: 3,3,4,0,2
- 11 – 17 May 2025: 3,0,5,0,2
- 18 – 24 May 2025: 2,4,6,0,3
- 25 – 31 May 2025: 2,4,5,0,2
- 1 – 7 Jun 2025: 3,5,4,0,2
- 8 – 14 Jun 2025: 4,5,4,0,3
- 15 – 21 Jun 2025: 3,3,5,0,3
- 22 – 28 Jun 2025: 3,5,4,0,2
- 29 Jun – 5 Jul 2025: 4,3,4,2,2
- 6 – 12 Jul 2025: 3,5,6,3,2
- 13 – 19 Jul 2025: 5,5,4,2,2
- 20 – 26 Jul 2025: 3,4,5,0,3
- 27 Jul – 2 Aug 2025: 2,5,4,2,2
- 3 – 9 Aug 2025: 3,6,6,0,3
- 10 – 16 Aug 2025: 3,6,4,0,2
- 17 – 23 Aug 2025: 2,3,5,1,3
- 24 – 30 Aug 2025: 4,4,4,0,2
- 31 Aug – 6 Sept 2025: 2,5,4,0,2
- 7 – 13 Sept 2025: 7,100,3,0,0
- 14 – 20 Sept 2025: 5,30,5,2,3
- 21 – 27 Sept 2025: 3,8,4,0,2
- 28 Sept – 4 Oct 2025: 2,5,3,2,2
- 5 – 11 Oct 2025: 3,5,3,2,2
- 12 – 18 Oct 2025: 2,4,4,0,2
- 19 – 25 Oct 2025: 2,5,4,0,2
- 26 Oct – 1 Nov 2025: 5,9,4,0,2
- 2 – 8 Nov 2025: 9,13,4,0,3
- 9 – 15 Nov 2025: 9,15,3,2,4
- 16 – 22 Nov 2025: 8,14,5,0,5
- 23 – 29 Nov 2025: 18,22,5,0,5
- 30 Nov – 6 Dec 2025: 23,28,6,0,6
- 7 – 13 Dec 2025: 21,25,6,3,5
- 14 – 20 Dec 2025: 13,19,4,2,5
- 21 – 27 Dec 2025: 11,17,5,3,6
- 28 Dec 2025 – 3 Jan 2026: 9,12,4,3,4
- 4 – 10 Jan 2026: 8,12,4,2,5
- 11 – 17 Jan 2026: 8,13,4,2,4
- 18 – 24 Jan 2026: 9,13,5,2,4
- 25 – 31 Jan 2026: 9,16,3,0,3
- 1 – 7 Feb 2026: 8,12,5,0,3
- 8 – 14 Feb 2026: 10,13,6,2,3
- 15 – 21 Feb 2026: 14,21,6,1,4
- 22 – 28 Feb 2026: 11,17,4,0,4
- 1 – 7 Mar 2026: 8,10,3,2,2
- 8 – 14 Mar 2026: 9,14,4,2,2
- 15 – 21 Mar 2026: 9,15,4,2,2
- 22 – 28 Mar 2026: 8,11,4,2,3
- 29 Mar – 4 Apr 2026: 9,12,4,0,3
- 5 – 11 Apr 2026: 8,14,5,0,3
- 12 – 18 Apr 2026: 7,13,4,0,3
- 19 – 25 Apr 2026: 8,12,6,0,1
- 26 Apr – 2 May 2026: 8,14,4,0,3
- 3 – 9 May 2026: 11,13,3,2,1
- 10 – 16 May 2026: 11,11,4,0,3
- 17 – 23 May 2026: 7,12,3,2,3
- 24 – 30 May 2026: 9,17,4,0,2
- 31 May – 6 Jun 2026: 10,13,5,2,3
- 7 – 13 Jun 2026: 8,15,5,1,3
- 14 – 20 Jun 2026: 6,14,5,1,3
- 21 – 27 Jun 2026: 9,14,5,0,3
- 28 Jun – 4 Jul 2026: 8,14,7,2,3
- 5 – 11 Jul 2026: 8,13,5,1,2
- 12 – 18 Jul 2026: 6,8,6,0,3
- 19 – 25 Jul 2026: 4,9,7,0,3
- 26 Jul – 1 Aug 2026: 3,8,6,0,4
- 2 – 8 Aug 2026: 4,9,6,0,4
- 9 – 15 Aug 2026: 4,9,8,0,5
- 16 – 22 Aug 2026: 3,6,7,0,5
- 23 – 29 Aug 2026: 4,8,7,2,3
- 30 Aug – 5 Sept 2026: 6,14,5,0,3
- 6 – 12 Sept 2026: 6,10,8,0,3
- 13 – 19 Sept 2026: 6,12,6,0,3
- 20 – 26 Sept 2026: 5,9,6,0,2
- 27 Sept – 3 Oct 2026: 3,7,7,1,3
- 4 – 10 Oct 2026: 3,7,4,1,2
- 11 – 17 Oct 2026: 0,0,0,0,0 (partial)

</details>

Related queries (Google labels them by the term they expand; a blank list means Trends had too little data):

- **yoto**. Top: yoto box (100) · yoto vape (7) · yoto player (6) · yoto price (5) · yoto box.in (5) · yoto app (4) · yoto mini (3) · yoto hookah (3) · yoto box app (3) · yoto review (3) · yoto meaning (2) · what is yoto (2) · yoto box review (2) · yoto company (2) · yoto thanos (2) · yoto box free products (2) · yoto cards (2) · yoto box is real or fake (1) · yotobox (1) · yoto lounge (1) · yoto mini player (1) · toniebox (1) · yoto club (1). Rising: yoto box (Breakout) · yoto vape (Breakout) · yoto box.in (Breakout) · yoto mini (Breakout) · yoto hookah (Breakout) · yoto box app (Breakout) · yoto box review (Breakout) · yoto box free products (Breakout) · yoto box is real or fake (Breakout) · yotobox (Breakout) · yoto lounge (Breakout) · yoto mini player (Breakout) · toniebox (Breakout) · yoto club (Breakout) · yoto thanos (+400%) · yoto cards (+350%) · yoto review (+300%) · yoto player (+180%) · yoto app (+170%) · what is yoto (+70%) · yoto price (+60%)
- **miko robot**. Top: miko robot price (100) · miko robot price india (38) · miko robot price in india (31) · miko robot amazon (20) · what is miko robot (14). Rising: *(none)*
- **ai toys**. Top: kids toys (100) · ai toys for kids (73) · gemini ai (45) · hot toys (19) · adult toys (16) · openai (16) · claude ai (14). Rising: gemini ai (Breakout) · adult toys (Breakout) · openai (Breakout) · claude ai (Breakout) · kids toys (+140%)
- **talking toy**. Top: cactus toy (100) · talking toy cactus (98) · talking toy price (23) · talking toys (21) · kids talking toy (14) · talking toy for baby (7) · talking cactus toy amazon (3) · indian lifestyle cactus talking toy dancing cactus repeats what you say,electronic plush toy lighting,singing cactus recording repeat your words educa (<1). Rising: indian lifestyle cactus talking toy dancing cactus repeats what you say,electronic plush toy lighting,singing cactus recording repeat your words educa (Breakout) · talking cactus toy amazon (+1,950%) · cactus toy (+1,500%) · talking toy cactus (+1,500%)
- **ai toy**. Top: gemini ai (100) · ai robot (97) · robot toy (97) · ai robot toy (96) · sex toy (80) · character ai (74) · toy car (71) · ai toys (63) · toys (62) · toy story (42) · ai news today (38) · chatgpt ai (29) · open ai (28) · ai toy trend (23) · meta ai (15) · claude ai (15) · toy story 5 (14) · ai mode (14). Rising: gemini ai (Breakout) · chatgpt ai (Breakout) · open ai (Breakout) · ai toy trend (Breakout) · meta ai (Breakout) · claude ai (Breakout) · ai mode (Breakout) · ai news today (+350%) · character ai (+300%) · toy story (+50%) · toy story 5 (+50%)
