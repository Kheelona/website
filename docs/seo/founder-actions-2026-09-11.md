# Founder actions — 2026-09-11

**Nothing in this file has been sent, posted or published, and nothing will be by an agent.** These
are drafts for you to paste, edit or discard. Evidence for every one is in
`docs/checkpoints/seo-aeo-geo-2026-09-11.md`.

Ordered by what they are worth, not by effort.

---

## 1. Both app store listings · **the highest-value thing on this page**

> **📄 Hand this to the app developer: `docs/seo/app-store-listings-2026-09-12.md`.** It is written
> to stand alone for someone who has not read any of this, covers **Google Play AND the Apple App
> Store**, and every field is copy-and-paste ready with its character count verified against the
> store's limit. Two decisions are flagged as the founder's rather than the developer's: whether to
> rename the app, and which phone number is public.
>
> Added for Apple on 2026-09-12, none of it in the original draft below: the description there also
> says "Lumi"; **Promotional Text can be updated with no new build**, which is the fastest possible
> win; the **Support URL is missing entirely**; and the 4+ age rating is Apple's lowest tier, so it
> is correct and must not be "fixed" to match Play's 3+.



**Why this is first.** Asked "What is Kheelona?" on 2026-09-11, Perplexity answered that the
flagship product is "a talking robot companion called **Lumi**", aged "2 to 8", in "limited beta".
Seven of its ten citations were third-party profiles, and the first was the Play Store listing.

Read directly, that listing contains **"Lumi" seven times and "Kheelu" zero**. The description
"App to Manage Lumi toy" is carried in `og:description`, `twitter:description`, `itemprop=description`
**and inside a `SoftwareApplication` JSON-LD block**. That is a machine-readable statement, on a
Google-owned domain, that this company's product is called Lumi. It outranks our own site in every
model's view of the world, and it will keep doing so until it changes.

You decided on 2026-09-05 to leave this. That decision was made before this evidence existed.

### Short description (80 character limit)

> Read every word your child says to Kheelu, and choose what it can talk about.

*(76 characters. Replaces "App to Manage Lumi toy".)*

### Full description

> Kheelona's parent app is where you see everything Kheelu says and hears.
>
> Kheelu is a screen-free plush toy for children aged 3 and up. It holds a real conversation,
> tells stories your child can interrupt and be quizzed on, and speaks the languages you speak at
> home. This app is the parent's side of it.
>
> What you can do here
>
> Read the full conversation log, word for word, and delete any of it in one tap.
> See a daily summary of what your child talked about and asked.
> Choose which topics are open and which wait.
> Set quiet hours and pick the languages for your home.
> Track the new words your child has learned.
>
> How Kheelu works
>
> The microphone wakes to a word and is off the rest of the time. The first thinking happens on the
> device. Answers come from a closed library, so Kheelu cannot browse or search the open internet,
> and every reply passes an age-graded safety check. Conversations stay in your region and are never
> sold or used to advertise to your child.
>
> Three modes: AI mode for open conversation on home WiFi, Story mode for stories and lessons that
> work offline, and Bluetooth mode so Kheelu becomes the speaker for your own playlist.
>
> Kheelu was called Lumi until September 2026. It is the same toy.
>
> Kheelona Robotics Private Limited, Bengaluru. kheelona.com

### Three other fields on the same screen

| Field | Now | Change to | Why |
|---|---|---|---|
| App name | `kheelona` | `Kheelona: Kheelu parent app` (27 chars) | Store search matches on the name, and "Kheelu" currently appears nowhere in the listing. **Lower confidence than the rest** — renaming an app can disturb store ranking, so this one is genuinely your call. |
| Privacy policy URL | `https://www.kheelona.com/privacy` | `https://kheelona.com/privacy` | The `www` host 308s to the apex. One wasted redirect hop on the most trust-bearing outbound link Google holds about this company. Thirty seconds, no downside. |
| Developer phone | `+91 98965 97969` | see below | The site publishes WhatsApp-only **+91 91875 46483** and says so on every support surface. Two numbers for one company is an entity-consistency problem and, more practically, a parent who rings the Play number reaches something the site has never promised to answer. Either point Play at the WhatsApp number, or tell me and I will make the site acknowledge a second line. |

**How to verify it worked:** after Google recrawls, `curl -s "https://play.google.com/store/apps/details?id=com.kheelona.toyapp&hl=en_IN" | grep -c -i lumi` should fall from 7 to at most 1 (the "was called Lumi" sentence). Then re-run the Perplexity prompt in section 6.

---

## 2. ~~Take down the "Beta" privacy policy~~ · ✅ **FOUND AND FIXED IN CODE — nothing for you to do**

I said I could not find where this lived. I found it, and it turned out not to be your job at all.

**What it was.** Perplexity cited **`https://www.kheelona.com/privacy-policy`** and quoted a page
titled *"Kheelona Robotics Privacy Policy (Beta)"* off it, naming `legals@kheelona.com`, a Grievance
Officer, and a *"Limited Beta Launch"*. That citation is where its claim that this company is
"currently in a limited beta launch phase" came from.

**Why I missed it first time.** I tested `kheelona.com/privacy`, `kheelona.ai/privacy`,
`kheelona.ai/privacy-policy`, `www.kheelona.com/privacy` and `app.kheelona.com/privacy`. The real
path was **`/privacy-policy`**, a spelling I never tried. Reading the citation URL out of the
Perplexity thread took one query and would have found it immediately; guessing paths did not.

**Where the document is now: gone.** It was a Wix-era page and has never existed in this repo — no
commit on any branch has ever contained that wording, and it is absent from the `pre-revamp-2026-07`
tag. Nothing to take down.

**What was actually broken, and it was ours.** `/privacy-policy` had **no redirect**, so it answered
404. Its sibling `/terms-conditions` got one on 2026-09-05 and this did not. **A 404 does not
correct a stale index — it leaves the crawler holding the last thing it saw**, which is exactly what
happened. Fixed with a 308 to `/privacy`, pinned by a test that now treats the two legacy legal URLs
as a pair so they cannot be split again.

## 3. ~~Re-link Ahrefs' Google account~~ · ✅ **FIXED by the founder, 2026-09-11, verified**

Ahrefs' GSC Insights tab reads *"The linked Google Account doesn't allow access to the required
data"*, and its Search Console data **stops on 20 August 2026**. Three weeks of the project
dashboard have been stale and nothing said so.

**Ownership verification is a different thing and does not fix this.** The project's Settings →
Ownership verification page is green and says *"Website verified via Google Search Console"* with
`connect@kheelona.com` linked. That only proves you own the site so Ahrefs will crawl it. The data
pull is separate, and re-checked on 2026-09-11 after that page went green it still fails.

**The exact error**, from Dashboard → GSC Insights → the red banner → **Show details**:

> Website not found. Your website needs to be verified in the Google Search Console of a Google
> Account that's connected with your workspace.

**The likely cause, and why the fix is a re-link rather than anything else.** `connect@kheelona.com`
could not open `sc-domain:kheelona.com` at the start of 2026-09-11 — the property sat under a
**"Not verified"** heading on that account until you granted access mid-session. Ahrefs is still
holding the OAuth token it was given *before* that, so its cached view of which properties that
account can read does not include this one. Nothing about the token refreshes on its own.

**What to do:** Ahrefs → Dashboard → GSC Insights → the red banner → **Show details** → **Unlink**,
then link `connect@kheelona.com` again and complete Google's consent screen. That forces a fresh
property list. I did not do this myself: it is an OAuth grant on your Google account and it belongs
to you.

**How to verify it worked:** the red banner disappears and the chart runs to within two or three
days of today instead of stopping on 20 August.

### ✅ Done, and verified two ways (2026-09-11)

The founder re-linked it. Checked immediately afterwards:

- **Dashboard → GSC Insights: the red banner is gone.** It had read *"The linked Google Account
  doesn't allow access to the required data"* on every load for three weeks.
- **Settings → Ownership verification → Google Search Console** now reads **"Website verified via
  Google Search Console."** with `connect@kheelona.com` linked and **no error text**. The same panel
  twenty minutes earlier carried *"Website not found. Your website needs to be verified in the Google
  Search Console of a Google Account that's connected with your workspace."*

**One thing still to expect, and it is not a fault.** The chart still ends on **20 August**
(53 clicks / 635 impressions) because Ahrefs backfills Search Console data on its own schedule rather
than on reconnect. The connection is what was broken and the connection is fixed. If the chart has
not caught up within about 48 hours, that is worth a second look; until then it is just lag.

**The lesson worth keeping:** ownership verification going green did NOT fix this and is not
evidence about it. They are two separate integrations sharing one Google account, and only the
second one carries the data.

---

## 4. Profile back-links and descriptions · carried over from 2026-09-05

Still open from the last round, and now with a measured reason. LinkedIn's description
("India's First Robotic brand focusing on Tiny Explorers") is one of the sources feeding the word
**robot** into every AI description of a plush toy.

| Where | Do | Draft |
|---|---|---|
| LinkedIn company page | Add `https://kheelona.com` as the website, and replace the tagline | "Screen-free talking toys for children aged 3 and up. Kheelu holds a real conversation in the languages you speak at home, with no screen anywhere." |
| Instagram bio | Add `https://kheelona.com` | "Kheelu. A screen-free talking friend for ages 3+. Pre-orders open, ships 20 October 2026." |
| Facebook page | Add `https://kheelona.com` | Same as Instagram. |
| YNOS profile | Correct the founder list | Three co-founders: Apoorva Sahu, Aman Soni, Kashyap C.R. Currently lists two. |
| F6S profile | Replace "Lumi" with "Kheelu" | The description there still names the product Lumi and is cited by Perplexity. |

---

## 5. Two things I am NOT recommending, and why

**Do not buy links or submit to paid directories.** Referring domains read 328 against a Domain
Rating of 0, which is the signature of a lot of low-value inbound. Adding more of it will not move
DR and could attract exactly the scrutiny a children's brand cannot afford.

**Do not chase "best AI toy in India" in Google.** Keyword Planner, India, twelve months: that
phrasing and every variant of it returns **no data**. The demand for that question is real but it
currently lives in answer engines, not in Google's query stream. That is what this round built for.

---

## 6. The measurement, so it can be repeated for free

Ahrefs' Brand Radar AI visibility is paywalled on the Basic plan, and Search Console offers no AI
Mode data for this property. Both instruments the last round named are unavailable. These two prompts
cost nothing and are the replacement. Run them in a logged-out or private window.

1. **`best AI toy for a 4 year old in India`** — record which products are named, in order, and which
   domains are cited. Baseline 2026-09-11: YUMI, Pookie by Scoobies, Miko Mini, AIVY, Mirana.
   Kheelona absent. Citations included two roundup sites (`bestreviewsonline.in`, `keyirobot`) and
   four vendors' own product pages.
2. **`What is Kheelona and what is the Kheelu AI toy?`** — record the product name, the age range,
   whether it says plush or robot, and whether it says beta. Baseline 2026-09-11: "Lumi", "2 to 8",
   "robot", "limited beta", two founders. All five wrong.

**Success at the 2026-10-03 re-measure looks like:** prompt 2 says Kheelu, plush, 3+, taking
pre-orders. Prompt 1 is a longer game and naming Kheelona at all would be a good result.
