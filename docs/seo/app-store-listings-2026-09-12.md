# App store listings: what to change, and the exact text

**For: the Kheelona app developer.  From: Kheelona (via the website team).  Date: 12 September 2026.**

Everything below is copy-and-paste ready. Nothing here changes the app itself, only the **store
listing text**. No code, no build required for most of it.

---

## Why we are asking

The toy was renamed from **Lumi** to **Kheelu** on 5 September 2026. The website was updated the
same day. **Both app store listings still say Lumi**, and that is now causing a measurable problem
outside the app stores.

On 11 September we asked ChatGPT-style AI search engines "What is Kheelona?". The answer came back:

> *"Its flagship product is a talking robot companion called **Lumi**… for ages **2 to 8**…
> currently in a **limited beta** launch phase."*

All of that is wrong. Kheelu is a plush toy, for ages 3+, and we have been taking real paid
pre-orders since 22 August.

**Seven of the ten sources that answer cited were third-party profiles, and the Google Play listing
was the loudest one.** The Play listing contains the word "Lumi" seven times and "Kheelu" zero
times — including inside a machine-readable `SoftwareApplication` block that Google publishes from
it. Because it sits on a Google-owned domain, it currently outweighs our own website in what AI
search engines believe about us.

So this is not tidying. It is the single highest-leverage fix available to us right now.

---

# PART 1 · Google Play Console

**Where:** Play Console → your app → **Grow → Store presence → Main store listing**

Store listing changes go through review but **do not need a new APK/AAB upload**.

### 1.1 App name  ·  limit 30 characters

**Currently:** `kheelona`

**Change to:**
```
Kheelona: Kheelu Parent App
```
*(27 characters)*

> ⚠️ **This one is your call, not ours.** Renaming an app can disturb store search ranking. The
> reason we suggest it: the word "Kheelu" currently appears nowhere in the listing, so nobody
> searching the product's actual name can find the app. If you would rather not touch the name,
> **skip this and do everything else** — the rest matters more.

### 1.2 Short description  ·  limit 80 characters

**Currently:** `App to Manage Lumi toy`

**Change to:**
```
Read every word your child says to Kheelu, and choose what it can talk about.
```
*(77 characters)*

### 1.3 Full description  ·  limit 4000 characters

**Currently:** a bullet list beginning "New Learning Toys / Traditional toys…"

**Replace the whole thing with:**

```
Kheelona's parent app is where you see everything Kheelu says and hears.

Kheelu is a screen-free plush toy for children aged 3 and up. It holds a real conversation, tells stories your child can interrupt and be quizzed on, and speaks the languages you speak at home. This app is the parent's side of it.

WHAT YOU CAN DO HERE

Read the full conversation log, word for word, and delete any of it in one tap.
See a daily summary of what your child talked about and asked.
Choose which topics are open and which wait.
Set quiet hours and pick the languages for your home.
Track the new words your child has learned.

HOW KHEELU WORKS

The microphone wakes to a word and is off the rest of the time. The first thinking happens on the device. Answers come from a closed library, so Kheelu cannot browse or search the open internet, and every reply passes an age-graded safety check.

Conversations stay in your region and are never sold or used to advertise to your child.

Three modes: AI mode for open conversation on home WiFi, Story mode for stories and lessons that work offline, and Bluetooth mode so Kheelu becomes the speaker for your own playlist.

Kheelu was called Lumi until September 2026. It is the same toy.

Kheelona Robotics Private Limited, Bengaluru.
kheelona.com
```

> The line **"Kheelu was called Lumi until September 2026. It is the same toy."** is deliberate.
> Please keep it. It is what lets a search engine connect the old name to the new one instead of
> treating them as two different products.

### 1.4 Privacy policy URL

**Where:** Play Console → **Policy → App content → Privacy policy**

**Currently:** `https://www.kheelona.com/privacy`
**Change to:** `https://kheelona.com/privacy`  *(drop the `www.`)*

The `www` version redirects, which wastes a hop on the most trust-bearing link Google holds about us.
Thirty seconds, no downside.

### 1.5 Developer phone number

**Where:** Play Console → **Grow → Store presence → Store settings → Store listing contact details**

**Currently:** `+91 98965 97969`

The website publishes **WhatsApp only, on +91 91875 46483**, and says so on every support page. Two
different numbers for one company is confusing for customers and for search engines.

**Please confirm with Kheelona which number should be public**, then make both match. Do not change
this one unilaterally.

---

# PART 2 · Apple App Store Connect

**Where:** App Store Connect → Kheelona → the iOS app

> **Note on Apple's rules:** the **description, subtitle, keywords and app name** can normally only
> be edited as part of a new version submission. **Promotional Text**, the **Privacy Policy URL** and
> the **Support URL** can be updated without shipping a new build. You will know your own release
> schedule best — if a version is going out anyway, fold these in.

### 2.1 Description  ·  limit 4000 characters

**Currently:**
> "The Smart AI Companion for Interactive Learning and Cognitive Growth. The Kheelona App seamlessly
> connects users with **Lumi** and other Kheelona toys, creating a dynamic ecosystem for interactive
> learning and entertainment. Powered by advanced artificial intelligence and Large Language Models
> (LLMs), Kheelona operates as a responsive social companion designed to support early childhood
> development."

**Replace with the same text as Google Play (section 1.3 above).** Using identical wording on both
stores is deliberate: consistent facts across sources is exactly what makes a search engine trust
them.

### 2.2 Subtitle  ·  limit 30 characters

**Currently:** `Smart Brain Development Toy`

**Suggested:**
```
Kheelu's parent app
```
*(19 characters)*

> ⚠️ **Also your call.** "Smart Brain Development Toy" carries useful search keywords, but it
> describes the **toy** rather than the app, which can read as misleading for an app listing. If you
> prefer to keep the keywords, a middle option is `Kheelu brain development toy` (28 characters).

### 2.3 Promotional Text  ·  limit 170 characters  ·  *no new build needed*

This field can be updated today, independently of everything else. Use it as the quick win:

```
Kheelu is our screen-free talking toy for ages 3+. This is the parent app: read every conversation, set the topics, pick your languages. Kheelu was previously Lumi.
```
*(164 characters, limit 170)*

### 2.4 Privacy Policy URL

**Currently:** `https://www.kheelona.com/privacy`
**Change to:** `https://kheelona.com/privacy`

### 2.5 Support URL  ·  **currently missing**

There is **no support URL on the Apple listing at all.** Please add:

```
https://kheelona.com/contact
```

### 2.6 Age rating — leave it alone

The Apple listing shows **4+** and Google Play shows **Rated for 3+**. This looks like an
inconsistency and is **not one**: 4+ is simply the lowest rating tier Apple offers, so it is already
as low as it can go. **No change needed. Please do not "fix" this.**

---

# PART 3 · How to check it worked

About a week after the changes go live, anyone can run this and should see the count fall from 7 to
at most 1 (the one deliberate "was called Lumi" sentence):

```bash
curl -s "https://play.google.com/store/apps/details?id=com.kheelona.toyapp&hl=en_IN" \
  | grep -o -i lumi | wc -l
```

The real test is the one that prompted all this. Ask any AI search engine
**"What is Kheelona and what is the Kheelu AI toy?"** and check the answer says **Kheelu**, **plush
toy**, **ages 3+**, and **taking pre-orders**. Today it says Lumi, robot, 2 to 8, and limited beta.

---

# Summary checklist

**Google Play**
- [ ] App name → `Kheelona: Kheelu Parent App` *(optional, your call)*
- [ ] Short description → new 77-character line
- [ ] Full description → replace entirely
- [ ] Privacy policy URL → drop the `www.`
- [ ] Developer phone → confirm with Kheelona first

**Apple App Store**
- [ ] Description → same text as Play
- [ ] Subtitle → `Kheelu's parent app` *(optional, your call)*
- [ ] Promotional Text → new 164-character line *(can ship immediately)*
- [ ] Privacy policy URL → drop the `www.`
- [ ] Support URL → add `https://kheelona.com/contact`
- [ ] Age rating → **no change**

Questions to Kheelona, not to the store: the phone number, and whether to rename the app.
