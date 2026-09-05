# Technical TODO — the one open-items list

**Nothing on this page blocks the site.** kheelona.com is live, indexed, and taking paid pre-orders.

Created **2026-08-23**, merging the founder-gated queue that was `FOUNDER-TODO.md` (now a pointer)
with the engineering items scattered across `docs/design-review-2026-07-10.md` and
`docs/qa-report.md`. One list, one place to look.

**🔍 Every item below was verified against the code, the config and the live site on 2026-08-23**,
not carried forward on trust. Two turned out to be already done or not real and are recorded at the
bottom rather than deleted; one was re-rated once the design system was consulted. What each check
was is stated on the item, so the next review can repeat it instead of re-deriving it.

**Two rules carried over, because they are what made the old file worth keeping:** a decision
recorded here is not re-asked, and anything that turns out wrong gets corrected here rather than
argued twice.

**Settled decisions are NOT here.** They are in `docs/checkpoints/closed-rounds.md` — testimonials,
the waived counsel review, the ship-date history, the GST note, the store launch record. **Search
that file before re-asking the founder anything.**

**Legend.** 🧑 needs the founder (a fact, an account, a decision, or money) · 🤖 mine to do on
request. Priority is about consequence if it is never done, not about effort.

---

# 🟠 FROM THE DEPENDENCY SWEEP (2026-09-05)

*Record: `docs/checkpoints/dependency-sweep-2026-09-05.md`. Both manifests now read
`npm audit: found 0 vulnerabilities`. Rollback tag `pre-dependency-bump-2026-09-05` = `a03871f`.*

## ✅ CLOSED 2026-09-05: the preview deployment is gone

- [x] **`website-hdn2.vercel.app` now returns 404 `DEPLOYMENT_NOT_FOUND`.** The founder deleted the
      Vercel project `website-demo-pre-launch`; verified afterwards, along with a control check that
      `kheelona.com`, `/products/kheelu` and `store.kheelona.com` all still answer 200.
      It had been serving a build 37 commits behind main that still said "Lumi", still carried the
      doubled-brand title, and never received the §8.32-a `INDEXABLE_HOSTS` noindex fix.
      **Two steps were needed and only the second one worked**: deleting the `demo-website` branch
      (2026-09-05) left the URL answering 200, because Vercel keeps serving the last deployment for a
      project alias. Removing the project is what closed it.
      A 404 is the right ending rather than a noindex header: anything that had been indexed from
      that host will now drop out on its own.
      The branch is archived as the tag `archived-demo-website-2026-09-05` if the preview is ever
      wanted back.

## 🅿️ PARKED BY THE FOUNDER (2026-09-05, **re-confirmed 2026-09-06**): the mascot names itself on the home page

**Decision: leave it. Do not re-raise it.** Put to the founder a second time on 2026-09-06, with the
two options priced (delete three words / give the mascot its own name). Answer was the same: keep it
parked. **That is now two explicit decisions; treat it as settled.** Recorded here with the full diagnosis so that whoever
picks it up later starts from the answer rather than re-deriving it.

- [ ] **`src/features/home/components/Hero.tsx:22` says `"Hi, I'm Kheelu. Come in, I'll show you
      around."`** — the Foxy-Deer mascot introducing itself by the name the cream rabbit beside it
      now carries.

**It is ONE stale line, not an art problem.** That is the part worth keeping. Before the 2026-09-05
rename the line was correct: the mascot was Kheelu and the product was Lumi. The product took the
name and this line never moved with it. The rest of the site already treats them as two characters,
in **thirteen** places:

| Says the mascot IS Kheelu | Says the mascot is NOT Kheelu |
|---|---|
| `Hero.tsx:22` | `team/page.tsx:138` "They made me, **then Kheelu**" |
| | "I'll **mind Kheelu** till launch" — 11 pages, incl. `LegalDoc.tsx:71` |
| | `products/kheelu/page.tsx:147` "**This is** Kheelu. Go on, say hello." |

So the cheapest fix, whenever it is wanted, is deleting three words: `"Come in, I'll show you
around."` That alone makes the site consistent with all thirteen and needs no brand decision. The
alternative, if the narrator should have an identity, is giving the mascot its own name — every
other line already refers to Kheelu in the third person, so they all keep working unchanged.

**What would be expensive, and is NOT the recommended route:** truly merging them. That means
rewriting the thirteen lines AND reconciling the artwork, and the artwork actively fights it. Noted
because "share the name" was the original instinct and it is the option that looks cheapest and
is not.

*Also corrected here: an earlier note in this file and in CLAUDE.md claimed the mascot's name reached
users only through two `aria-label`s. That was wrong — it is spoken in the hero bubble, visible in
any screenshot of the home page.*

## ✅ CLOSED 2026-09-06: the store's 404 (and three others) never rendered at all

- [x] **It was not "unstyled" — it was blank.** Four routes answered with an empty
      `<html id="__next_error__">` document: no stylesheet, no text, no `lang`. The content
      appeared only after JavaScript hydrated, and not at all without it. Verified on production.
      Not only the store: `kheelona.com/stories/<unknown-slug>`, a public marketing URL pattern,
      did the same, and so did `/thanks` when a **validly signed link** pointed at an order that
      would not load — a person who had paid us, looking for their own order.
      Cause is Next's: a thrown `notFound()` takes the error path and answers with a
      client-rendered shell; a routing-level 404 does not (§8.34-a).
      Fixed two ways: `dynamicParams = false` on the stories route, and on the store the pages
      render while `src/proxy.ts` supplies the 404 via `NextResponse.rewrite(url, {status})`.
      Record: `docs/checkpoints/blank-404s-2026-09-06.md`.

## 🤖 Two follow-ons from that fix, neither urgent

- [ ] **`/thanks` cannot tell a missing order from a failed query.** `maybeSingle()` returns a null
      `data` for both, so a transient Supabase outage and a deleted order render the same page. The
      copy was written to be honest under both readings ("Your link is fine"), so nothing is
      misleading today — but "try again in a minute" is the right thing to say for an outage and we
      cannot say it. Wants the `error` half of the Supabase response read, on the payment path, so
      it is its own commit.
- [x] **WITHDRAWN 2026-09-06: `STORE_PAGES` is gone.** It existed only to tell the proxy which
      paths deserved a 404 status, and §8.34-f killed that: Vercel discards a rewrite's destination
      when it carries a 4xx. `routeForHost` is now simpler than before this round started.

## 🤖 Standing, now that floors exist for eight packages

- [ ] **Raising a floor is normal; lowering one re-opens an advisory.** `test/dependency-floor.test.ts`
      now floors `next`, `eslint-config-next`, `@storybook/nextjs-vite`, `postcss`, `sharp`, `nanoid`,
      `js-yaml`, `browserslist`, `brace-expansion` (per-major) and `fflate`, and bans `image-size`
      outright. If a future bump needs to go under one, the argument gets made in that file.

---

# 🟠 FROM THE AGENCY AUDIT ROUND (2026-09-05)

*Record: `docs/checkpoints/agency-audit-2026-09-05.md`. Laws §8.32. The code is committed and
pushed on `main` but **NOT deployed** — everything below assumes the founder has taken it live.*

## 🧑 Deploy, then do these three in Search Console

- [ ] **Take `main` live.** Commits `c5cca99` + `500bccb`. Rollback tag
      `pre-kheelu-rename-2026-09-05` = `63f6e70` restores `/products/lumi` as the live route.
- [x] **Ahrefs re-crawled 2026-09-05 after the deploy and confirms the fixes**: Incomplete Open
      Graph tags 31 → **0**, the schema.org validation error gone from the issue list, warnings
      45 → 13, Health Score still 100 with 0 errors. Independent of our own curl checks.
- [x] **GSC checked 2026-09-05, 19:15 IST.** Sitemap **Success**, read 5 Sept, 31 pages discovered.
      **`/products/kheelu` is INDEXED** — "URL is on Google", crawled 5 Sept 18:41 as Googlebot
      smartphone, discovery via sitemap, user-declared canonical read correctly. Google's parsed
      schema confirms the rename design end to end: `name: Kheelu by Kheelona`, `id` still
      `.../products/lumi#product` (the stable identifier, §8.32-b), `offers.url`
      `.../products/kheelu`, `founder` not `founders`, `contactPoint.url` with no `contactOption`.
- [ ] **`/products/lumi`: Google has NOT re-crawled it yet**, so the 308 is not registered. Last
      crawl **31 Aug 2026**, before the deploy; Google-selected canonical is still itself. Indexing
      was **requested on 2026-09-05** to pull it into the priority crawl queue. Nothing is wrong —
      it consolidates once Google re-fetches. **Re-inspect in a few days**; the tell is the crawl
      date moving past 5 Sept and the canonical switching to `/products/kheelu`.
      Also noted: its only referring page is a legacy Wix URL
      `www.kheelona.com/product/bd99df2b-…`, which our `/product/:slug([^.]+)` rule already
      redirects.

## 🅿️ Two GSC observations, neither urgent

- [ ] **Core Web Vitals report reads "No data"** on both mobile and desktop. This is the field-CWV
      gap flagged during the agency audit as genuinely unverifiable: the domain does not yet have
      enough real traffic for CrUX. Nothing to fix, and no lab score substitutes for it. It will
      populate on its own as traffic grows.
- [x] **RESOLVED 2026-09-06: "Review snippets: 4 valid" is legacy Wix, and decaying.** Read from
      the report rather than inferred. All four rows are the same URL,
      `https://kheelona.com/contact`, item name **"Lumi - AI-Powered Talking Toy"**, **last
      detected 27 July 2026** — the day *before* the current site went live on 28 July. "AI-Powered"
      is a hype phrase the voice lint bans and has never been in this codebase. The report's own
      trend steps 15 → 12 → 7 → 4, which is what dropping out of the index looks like.
      Confirmed live that `/contact` emits `Organization`, `WebSite`, `ContactPage` and
      `BreadcrumbList` and contains no `Review`, no `aggregateRating`, and neither "Lumi" nor
      "AI-Powered". **Nothing to fix; it clears itself.**
      *(Still not a defect, and still deliberate: `/products/kheelu`'s two "non-critical issues" are
      `Missing field 'aggregateRating' (optional)` and `Missing field 'review' (optional)`. Adding
      them to clear the warning would break the never-invent-a-review law.)*

- [ ] **Keep the `/products/lumi` history alongside the new route** when comparing organic
      performance. They are one page; a report that drops the old URL will read as a collapse that
      did not happen.

## 🧑 Reconcile the artwork, now that one name covers two drawings

- [ ] **Kheelu is a cream rabbit in the hero and a Foxy-Deer in the corner guide.** The rename made
      the product and the mascot one character, and the art did not follow. Users never see either
      one named — the mascot's name reaches them only through two `aria-label`s — so nothing reads
      as broken today and this is not urgent. It does need settling **before
      `gemini-handoff/hero-2026-08/` is used**, because that kit composes the two together.

## 🧑 Specifications, still blocked (agency D08) — re-asked 2026-09-06, still nothing signed off

- [ ] **Dimensions, weight, battery runtime WITH test conditions, charging, materials and cleaning,
      box contents, warranty.** Open as `TODO(claims-specs)` since July. The product page says we
      publish full specs before Kheelu ships, which stays honest while nothing is signed off. When
      the numbers exist they render in a table; a buying-critical fact that is still undecided shows
      the literal words "Not yet announced" rather than being hidden. **No placeholder, no invented
      number, and no empty table shell.**
      *Asked again on 2026-09-06; the founder's answer was that none are final yet. Nothing to build
      until numbers exist — the component would have no data to render and the law above forbids
      shipping the shell empty. Battery runtime needs its TEST CONDITIONS alongside the number, or
      the claim is not verifiable.*

## 🧑 Tag campaigns before ad spend scales — the tooling is done, the adoption is yours

- [x] **`npm run utm` exists (2026-09-06)** and builds a link to `docs/utm-conventions.md` or
      refuses and names the rule. It catches the two mistakes that are silent rather than loud:
      casing drift (`Paid_Social` and `paid_social` are two rows in every analytics tool that
      exists) and a value from outside the vocabulary, which reports cleanly and aggregates with
      nothing. `test/utm.test.ts` parses the doc's table so the tool and the doc cannot drift.
      Found while writing it, and previously recorded nowhere: **`create-order` already copies the
      landing URL's `utm_` values onto the order row**, so a paid pre-order can be traced to the ad
      that caused it and not merely to the visit. That half has worked all along; it has simply had
      nothing to record.
- [ ] 🧑 **Use it before Meta spend scales.** Every ad, bio link and printed QR gets a tagged
      destination:
      `npm run utm -- --source=instagram --medium=paid_social --campaign=2026-10-launch --path=/products/kheelu --content=rabbit-hero-a`
      An untagged click is untagged forever — this is cheap now and unrecoverable later. Printed QR
      codes especially: those cannot be changed after they go to print.

## 🧑 One redirect chain, and it lives in Vercel rather than this repo

- [x] **CLOSED 2026-09-06 as platform behaviour, not a defect.** Vercel's Domains panel already
      reads `www.kheelona.com ↳ 308 kheelona.com`, which is the correct setting; there is nothing
      to change. The second hop is Vercel's HTTPS upgrade, which runs at the edge before any
      routing rule is consulted, so no dashboard setting and nothing in this repo can reach it.
      `http://kheelona.com` looks like one hop only because the upgrade does not change the host.
      Affects only someone hand-typing `http://www`; search engines follow chains. **Do not re-open.**
      The measurements, kept because they are the evidence:

      | Request | Answer |
      |---|---|
      | `http://www.kheelona.com/` | 308 → `https://www.kheelona.com/` |
      | `https://www.kheelona.com/` | 308 → `https://kheelona.com/` |
      | `http://kheelona.com/` | 308 → `https://kheelona.com/` — **one hop, already correct** |

      So it is www-specific, and it affects only someone typing `http://www` by hand. The value is
      low and it is listed here for completeness, not urgency.
      **Nothing in this repo can fix it.** Vercel's edge performs the protocol upgrade before the
      request ever reaches `next.config.ts` or `src/proxy.ts`, so no redirect we write is consulted.
      Where to look: Vercel → the project → Settings → Domains → `www.kheelona.com`, which should be
      set to redirect to `kheelona.com` (307/308) rather than serving. If it already is, the second
      hop is Vercel's own HTTPS upgrade and **the chain is not removable** — in which case close
      this item as "platform behaviour" rather than leaving it open.
      Verify either way with:
      `curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' http://www.kheelona.com/`
      One hop looks like `308 -> https://kheelona.com/`.

## 🤖 Worth doing, not urgent

- [ ] **Ahrefs Site Audit and Search Console were not consulted this round.** Indexing coverage and
      field Core Web Vitals are genuinely unverified, and no file in the Ahrefs Web Analytics export
      can settle them — it carries no keyword, backlink, ranking or CWV data. Needs a browse of the
      dashboard rather than an export.

---

# 🔴 CRITICAL

**None.** Verified 2026-08-23: `/api/health` green on both hosts, all 15 routes 200, all seven
security headers live, the live pages carry no console errors or failed requests of their own, and
`npm audit` reports nothing in `next` itself. [2026-09-05: that phrasing was always slightly off — `next` never had an advisory of its own, it was flagged via postcss and sharp. Both manifests now read 0.]

# 🔴 MEASURED 2026-09-06: PRODUCTION FAILS ITS OWN BEST-PRACTICES GATE, AND THE META PIXEL IS WHY

- [ ] 🧑 **Lighthouse best-practices on production is 74. The gate is 90.** It has been since the
      Meta Pixel landed on 2026-09-01 and nobody saw it, because **Lighthouse had only ever been run
      locally, where the pixel is host-gated OFF** (§8.30). Local still reads 96; production reads
      74. Same page, same build.

      Attributed with a control rather than guessed — Lighthouse on production with facebook blocked:

      | Run | Perf | A11y | **BP** | SEO |
      |---|---|---|---|---|
      | live, all tags | 100 | 96 | **74** | 100 |
      | facebook blocked | 99 | 96 | **96** | 100 |
      | facebook + googletagmanager blocked | 98 | 96 | **96** | 100 |

      **The Meta Pixel alone costs 22 points. GA4 costs zero.** It splits in two:

      - **7 points are recoverable**: `errors-in-console` and `inspector-issues`, both caused by the
        CSP Report-Only violations above. Adding the three origins clears them and gets BP to **81**.
      - **The other ~19 are not**: `third-party-cookies` (weight 5 of 27) is the pixel's `fr` cookie
        from `facebook.com/tr/`. Lighthouse penalises third-party cookies outright now. **There is no
        configuration that keeps the pixel and passes this audit.**

      So **best-practices cannot reach 90 on production while the Meta Pixel runs.** That is a
      decision, not a bug, and it needs the same treatment §8.29 gave the CTA contrast: either
      accept it explicitly and write the number down so nobody "fixes" it, or drop the pixel.
      **Founder's call.** Nothing else on the site regressed — perf, a11y and SEO are unchanged, and
      a11y 96 still clears its gate comfortably.

      *Method note for whoever repeats this: run Lighthouse against **production**, not localhost.
      Every measurement tool on this site is host-gated, so a local score is a score for a page that
      is missing three of its four tags (§8.34-f is the same lesson in a different place).*

# 🟠 HIGH — but neither is actionable today, and that is deliberate

**🔴 READ THIS BEFORE FLIPPING — the reports have now been read, and the policy is NOT ready
(2026-09-06).** Lighthouse against **production** surfaced the Report-Only violations directly,
which is faster than waiting on the Vercel log and is the first time anyone has looked. Three
things are being refused today and **would break if the policy were enforced as it stands**:

| Refused | Directive that refuses it | Whose |
|---|---|---|
| frame `https://www.facebook.com/` | `frame-src` | Meta Pixel |
| send form data to `https://www.facebook.com/tr/` | `form-action` | Meta Pixel |
| load image `https://www.googletagmanager.com/a?…` | `img-src` | GA4 |

`www.facebook.com` is in `connect-src` and `img-src` but not `frame-src` or `form-action`, and
`www.googletagmanager.com` is in `script-src` and `connect-src` but not `img-src`. **Flipping now
would silently break Meta Pixel event delivery and part of GA4.** The three additions are the
prerequisite, and they are safe to make in Report-Only at any time — but `form-action` widening on
a payment host is a security judgement, so it is the founder's call, not mine.

- [ ] 🤖 **Flip the CSP from Report-Only to enforcing** (§8.28-a, owned by `security-review.md`).
      **Time-gated on purpose: do not do this before roughly 2026-08-26.** It needs a few days of
      real traffic first, read from the `[csp] blocked=… directive=…` lines that `/api/csp-report`
      writes to the Vercel log. `npm run qa:payment` already proves Razorpay's checkout sheet opens
      with zero violations, but GA4 is the one third party a local probe must never be pointed at
      (§8.28-g), so production Report-Only is the only thing that can clear it. Flipping early is the
      single way this engagement could break checkout. Then: `CSP_PHASE` in
      `src/lib/security-headers.ts` and the phase assertion in `test/security-headers.test.ts`.
      **⚑ RESET 2026-09-01 by the Meta Pixel.** Three origins joined the policy that day
      (`connect.facebook.net` in `script-src` and `connect-src`, `www.facebook.com` in `connect-src`
      and `img-src`), so the observation window starts again: the reports read before that date say
      nothing about whether the pixel is happy. Read a few more days of production Report-Only,
      specifically for `blocked=…facebook…` lines, before flipping. The same law as GA4 applies to
      why a local probe cannot settle it: **never point a probe at a measurement host** (§8.28-g),
      which is why the 2026-09-01 verification asserted only that the browser *attempted* the
      fbevents.js request and let the harness abort it.

- [ ] 🧑 **Post-dispatch returns and warranty terms, before the first Lumi ships.** They do not
      exist, because nothing has shipped, and `/refund` says exactly that rather than inventing a
      window. **The one open item that will actually block a step**, and the step is October.
      *Verified 2026-08-23: `/refund` still states the pre-dispatch-only promise honestly.*

# 🟡 MEDIUM — all three are dated or founder-deferred; none needs code today

- [x] ✅ **📅 31 August 2026: close the Ideabaaz page. CLOSED 2026-09-01 (founder: "we can mark it
      closed").** It closed itself: the `expires_on` backstop fired from ~05:30 IST on 1 September
      exactly as designed (§8.25-g-i), so every visit now renders the ended state with a link to the
      usual price. **The route was deliberately KEPT** rather than deleted or redirected, because
      printed fest QR codes point at it and an honest ended page beats a 404 for a late scan.
      The two tests that asserted the live ₹99 offer were removed the same day, with the reason
      recorded in `src/app/store/ideabaaz/page.test.tsx`; they had started failing on their own when
      the date passed, which is how the closure was noticed.
      **STILL OPEN FOR THE FOUNDER, both optional:** the belt-and-braces
      `update event_tiers set active = false where id = 'ideabaaz';` (expiry already does the job,
      and production data is yours, not Claude's), and the conversion readout
      `select count(*), sum(amount_paise) / 100 as rupees from preorders where tier = 'ideabaaz' and status = 'paid';`
      Each such booking consumed a first-500 unit at ₹4,999 and still owes ₹4,900 before dispatch.

- [ ] 🧑 **📅 5 September 2026: tighten DMARC to `p=quarantine`.** The two-week observation window
      ends then. **Read the reports at `dmarc@kheelona.com` FIRST** and confirm Google Workspace and
      Resend are both passing; only then edit the existing `_dmarc` TXT record in Cloudflare,
      changing `p=none` to `p=quarantine` and keeping `rua` and `fo`. Never add a second DMARC or SPF
      record, and never jump straight to `p=reject`. A scheduled agent will remind you:
      https://claude.ai/code/routines/trig_01T644UQuKPds5T1iV5abvqD

- [ ] 🧑 **📅 Before shipment: the two DPDP lines on `/privacy`** (F-12). India's DPDP Act 2023
      expects a stated **retention period** and a designated **grievance contact**. Founder decision
      2026-08-23: leave both until before shipment, reasonable while nothing has shipped and no
      product data is collected. Wording is counsel's; the page is already counsel-gated.
      *Verified 2026-08-23 on the live page: zero mentions of retention, "how long", grievance or
      officer. The gap is real and unchanged.*

# 🟢 LOW — facts, assets, confirmations and polish

## 🧑 Facts only the founder has. Each is a one-file edit on the word

*All four gates verified still in place in code on 2026-08-23.*

- [ ] **The Kheelona+ ₹ price.** The last gated commercial fact. Every surface says "pricing
      announced soon" and a ₹ amount stays forbidden until it is set.
- [ ] **Toy-safety certificates**, exact names and numbers when testing completes. Reinstates the
      standards FAQ and lets a badge appear. No badge appears before it is earned.
- [ ] **Final specs**: battery life, size and weight, materials, **the wake word**, charger details.
      *All three pages still carry the "before Lumi ships" promise: `/safety`, `/products/lumi`,
      `/setup`.*
- [ ] **Is there a camera in Lumi? Yes or no** (the surviving half of REV-b). *The gate comment is
      still at `src/app/(site)/products/lumi/page.tsx:82`.* If the answer is no, that is a one-line
      trust differentiator on a screen-free toy for young children, and worth saying out loud.

## 🧑 Two rows in Supabase

- [ ] Delete my probe: `delete from preorders where order_ref = 'KH-8FP8-PWDA';`
      And close out Shweta's, whose refund predates the automatic handling:
      `update preorders set status = 'refunded' where order_ref = 'KH-YPJ8-GHVT';`
      *Not verifiable from here: I hold no production database credentials, by design.*

## 🧑 Two one-line confirmations

- [ ] **Ria reads her /team card once** (R10-a). Drafted from her public profile and
      founder-approved, but she has not read it herself. *Not verifiable from here.*
- [ ] **One de-contracted line** (R11-b). The no-contractions rule overrode the published
      kheelona.ai phrasing on `/safety`. *Verified live 2026-08-23: the page still reads "Nothing
      stays that you cannot delete."* Say the word and the contraction goes back as a sanctioned
      exception.

## 🧑 Assets, whenever. The site is complete without all of these

- [ ] **Real photography** (R9-a) — still the single strongest conversion lever anyone has named: the
      plush in a child's hands, a fabric macro, a breathing-motion loop, and where the mic and button
      sit. Drop them in `~/Downloads`. *Verified: no new photography has landed since 2026-08-01.*
- [ ] **Real testimonial quotes or faces.** *Verified: still the four drafted attributions (Shweta,
      Priyamvada, Gaurav, "Pilot parent").* The standing decision is to keep them — see
      `closed-rounds.md`, and **do not re-raise it**; real ones swap in cleanly whenever.

## 🧑 Off-site, where I have no access

- [ ] **The Play Store listing still shows ₹2,999** (V3-h). It competes with the live pricing in
      Google's index for the brand's own name. The web half is done: the old Wix URLs are 301'd.
- [ ] **Investor "backed by" band on /team.** Names and logos when ready. The row is labelled
      "Recognised by" today because NVIDIA Inception and nasscom are recognition programmes rather
      than backers — `RecognitionStrip` takes a `label` prop, so switching it is one word.

## ✅ CLOSED 2026-09-05: Vercel bot protection no longer blocks scripted checks

*Verified: plain curl with a browser User-Agent got real JSON from `/api/health`, and fetched every
marketing page, the sitemap and the store. The entire post-deploy verification ran this way. If the
403 ever returns it is a Vercel Firewall setting, not an outage — a real browser still works.*

### The original item, kept for context

- [ ] 🧑 **Decide whether Vercel's Attack Challenge Mode should stay on** (observed 2026-09-01, while
      trying to verify the Meta Pixel on production). Every request to `https://kheelona.com/`,
      including **`/api/health`**, returns **HTTP 403** with a `Vercel Security Checkpoint`
      interstitial and an `x-vercel-mitigated: challenge` header. Real visitors in a real browser
      solve the JavaScript challenge and get through, so the site is not down. But three things
      follow, and none is obvious from the dashboard:
      **(1)** `/api/health` is unreachable to anything scripted, and `CLAUDE.md` tells every session
      to check it FIRST on any store question. A future session will read a challenge page as an
      outage. **(2)** No automated verification of production is possible at all, which is why the
      pixel could only be proven locally on 2026-09-01. **(3)** Ahrefs verifies its tag by FETCHING
      the page (which is the entire reason that tag is not host-gated, §8.21-c-i), and a challenged
      fetch cannot see it, so Ahrefs verification and any uptime monitor are likely failing quietly
      too. If this was switched on deliberately, an allowlist for `/api/health` is the smallest fix;
      if it switched itself on in response to traffic, it is worth knowing that it did.

## 🧑 Meta advertising, opened 2026-09-02

- [x] ✅ **Automatic Advanced Matching: DECIDED 2026-09-02, kept ON with all fields. Not open work.**
      Recommended off twice; the founder chose to keep it, and chose the full field set over the
      narrower one offered. **Do not re-raise it.** The consequence was handled the same day: AAM
      scrapes whatever Meta's script recognises, including city, state and pincode from the address
      form on `/thanks`, so `/privacy` stopped promising that the delivery address is never sent and
      stopped promising that nothing about the child is ever sent. Both sentences are now BANNED by
      `test/analytics-tags.test.ts` so they cannot be restored while AAM is on. The replacement
      wording is category-level at the founder's direction and discloses that form details can reach
      Meta and that Meta's script decides which. Law: §8.30-o. **What is still ours to hold is our own
      payload**: the same test fails if `child_age` or `order.address` ever enters `meta-capi.ts`.

- [ ] 🧑 **Generate `META_CAPI_TOKEN` and add it to Vercel.** Events Manager → dataset → Settings →
      Conversions API → Generate access token. Vercel: Production + Preview, **Secret**, and **no
      `NEXT_PUBLIC_` prefix** (`test/store-secrets.test.ts` fails the build if that ever appears).
      **Then redeploy** — a Vercel variable only applies to deployments created after it changes, so
      without that the running deployment keeps the absent value and the server Purchase stays
      silently off. The code shipped 2026-09-02 and is a no-op until the token lands, by design.
      Afterwards, confirm in Events Manager that a real order produces **one** Purchase and not two:
      that is the de-duplication working (§8.30-l).

- [x] ✅ **"Purchase needs a re-fire guard on /thanks": FALSE, raised three times, settled 2026-09-02.**
      No guard was added, and it is deliberately **not** in any known-limitations list, because a
      documented limitation that does not exist gets re-raised every quarter until somebody "fixes"
      it. Purchase fires from Razorpay's success handler in `PreorderForm.tsx`, which never renders on
      `/thanks`; that page renders `AddressForm`, whose only analytics call is `addressSaved`. **Why
      it keeps looking true:** `Purchase`, `eventID` and `thanks` sit in the same built JS chunk,
      because Next groups routes into shared chunks — co-location is not a call site. Grep the source,
      not the bundle. Full reasoning and the refutation are §8.30-p, with a pointer in the header
      comment of `src/app/store/thanks/page.tsx`.

- [ ] 🧑 **On the first real pre-order, check Events Manager shows ONE Purchase, not two.** This is the
      one genuine open question from the Meta work, and it answers two things at once: whether
      browser/server de-duplication is matching, and whether `META_CAPI_TOKEN` actually took — an
      absent token looks identical to a working one from outside, so a customer buying something is
      the only external proof. **Two Purchases means the `event_id` values are not matching**; both
      sides should read `purchase_<order_ref>` from `purchaseEventId()` in `src/lib/fbq.ts`. Bring it
      back to me if so.
      **Easier since 2026-09-02:** `/api/health` now reports `capi: "configured" | "missing"`
      (presence only, never the value), so whether the token took is one curl rather than a wait —
      `curl -s https://kheelona.com/api/health`. And every server send now logs
      `[meta-capi] SENT|SKIPPED|REJECTED|FAILED <event_id>` in the Vercel log, with
      `events_received` and `fbtrace_id` on the success line. Before this, success and "token
      missing" were both silent, which is why the first real order could not be answered (§8.30-q).

- [ ] 🧑 **Where was "Pay ₹0 and reserve" seen?** Reported by the reviewer on the store. The guard is
      in (`resolveTier` now refuses a non-positive amount), but the only way to reach that state is a
      signed **event-tier** link whose `event_tiers` row has `amount_paise` of 0 or NULL — never the
      main store, which serves ₹499. So there may be a bad row worth deleting. Worth knowing which
      link it was.

- [ ] 🤖 **Razorpay does not guarantee webhook ORDER, and `markRefunded` depends on it** (found by
      review 2026-09-02, not fixed, not urgent). `markRefunded` looks the order up by
      `rzp_payment_id`, which only `markPaid` ever sets. If `refund.processed` were delivered BEFORE
      `payment.captured`, the refund finds no row and returns `"unknown"`, the row stays `created`,
      and the later capture marks it paid and payable — straight into the dispatch queue. The
      2026-09-02 allow-list (§8.30-s) does **not** help here, because the row never became
      `refunded`. This is the same §8.25-ee failure from a third direction. Unlikely (Razorpay sends
      capture first in practice, and a refund cannot precede a payment by much) but not impossible,
      and the fix is probably to have `markRefunded` fall back to the payment's order id and to record
      a refund against a row it cannot yet match.

- [ ] 🤖 **`after()` from `next/server` was considered and rejected for the webhook** (2026-09-02).
      A review suggested moving `notifyPaid` off the webhook response path. It should NOT be done the
      obvious way: `after()` throws outside a request scope, and in the webhook that throw lands
      inside the handler's own `try`, which **deletes the `webhook_events` claim** and returns 500.
      Worse, once the response is sent there is no retry path, so a killed invocation loses the
      receipt and the Meta Purchase silently. Current worst case is one `Promise.allSettled` of three
      parallel calls bounded by a 5s timeout, which is acceptable. Revisit only with a real latency
      complaint from Razorpay.

## 🤖 QA harness

- [ ] **`qa:sweep`'s default `SWEEP_STORE` aims at production DNS, and two routes time out because
      of it** (found 2026-09-01). The default is `http://store.kheelona.com:3456`, and although
      `tools/qa/lib/browser.mjs` maps that name to 127.0.0.1 for local targets, the mapping does not
      take for the `store.` subdomain in this Chrome: `http://kheelona.com:3456/` resolves locally
      and loads, `http://store.kheelona.com:3456/` reports `ERR_TIMED_OUT`, and a wildcard
      `MAP *.kheelona.com` rule does not fix it either, so the rule syntax is not the cause.
      **The workaround is real and works today: `SWEEP_STORE=http://store.localhost:3456 npm run qa:sweep`
      is clean 34/34.** Two reasons to actually fix the default rather than remember the workaround.
      First, a session that runs the bare command sees two failures and may waste an hour deciding
      whether it broke the store, which is exactly what happened on 2026-09-01. Second, and more
      seriously, `store.kheelona.com` resolves to Vercel's production IPs, so the default quietly
      aims an automated sweep at live infrastructure while `security-review.md` is open with **no
      active testing against production** as one of its standing rules. Changing the default to
      `store.localhost` is a one-line edit in `tools/qa/sweep.mjs`; it was left alone on 2026-09-01
      only because that round was a pixel change and this is not its scope.

## 🤖 Engineering polish, all four from the R4 panel of 2026-07-10

*Verified 2026-08-23 that the surfaces still exist (`BrandShape`, `BEAT_WASHES`, the canopy, the
corridor fade), so none is moot — but all four are pre-v3 judgements about a design system that was
replaced on 2026-08-23, so each needs looking at with fresh eyes before it is worked, and none is
worth churning a live commercial site for on its own.*

- [ ] **Neutral audit in the shape dressing** (Design #7). PlayOS clouds were retinted white because
      cream read as gray under the cool sky; the wider audit was left for the next dressing pass.
- [ ] **Canopy placement retune across the wash seam** (Design #5). Needs an unhurried composition
      pass at three widths.
- [ ] **Dead zones after the hero and before the journal** (Design #9, UX #9). Still coupled to
      R4-a below, so that beats are retuned once rather than twice.
- [ ] **Consolidate the body-copy sizes** (UI #11). **Re-rated from MEDIUM to LOW on 2026-08-23**,
      and this is the interesting one. It is now eight distinct sizes across 149 usages (12, 13, 14,
      15, 16, 17, 18, 19px), not the six R4 counted, which looks like drift away from v3's scale
      (body 16 / caption 13 / lead 24). It is not: `Design/Kheelona-Design-System-v3/guidelines/site-extensions.md:27`
      records a **sanctioned extension** — "fluid type scale, `clamp()` steps anchored to v3's px
      scale", because v3's scale is fixed px and responsive surfaces need steps between its anchors.
      So this is cosmetic consolidation, not design-authority non-compliance, and the token gate
      deliberately checks colour only. A 10+ file sweep on a live payment site for no user-visible
      change is the definition of unnecessary risk, which is exactly why R4 deferred it.

## 🧑 Home ↔ Meet Kheelu overlap — re-rated MEDIUM to LOW on 2026-08-23

- [ ] **Which page owns the shared beats.** Open since V5, when the two pages measured ~60% the same.
      **That premise is stale and the rating was wrong: V6 restructured Home around the growth arc and
      the pages have diverged.** Home now owns the growth arc, the compare table, the price and 8 FAQ
      questions; Meet Lumi owns the audio demos, what is in the box, the parent app and 19 FAQ
      questions. What is genuinely still shared: three components (`LumiModes`, `AudioMoments`, `Faq`)
      and one identical testimonial quote, which beside a CTA is legitimate social proof rather than
      duplication.

      **The FAQ overlap is deliberate, which is what dropped this to LOW.** Exactly ONE question is
      shared verbatim ("What ages is Lumi for?"). The near-duplicates are worded differently on
      purpose, and the code says so: Meet Lumi's ages answer carries "learning toys for 5 and 6 year
      olds onward" as an SEO keyword decision (2026-08-12), and the internet answer has a comment
      recording that both pages "agree in substance and differ only in length" by design (V6 D7).
      Verified 2026-08-23: the substance of both overlapping answers does agree today.

      **The one real residual risk**, if this is ever picked up: the two FAQ lists are hardcoded in
      two page files, so they CAN drift, and §8.24-1 is the precedent — the offline claim was once
      wrong on one page and right on the other. Single-sourcing them would fight the deliberate
      per-page wording, so the honest options are to leave it, or to add a test asserting the
      overlapping answers agree in substance rather than in text. Neither needs a founder decision.

## 🅿️ Parked, and fine to leave parked

- [ ] 🧑 **Three R4 design calls**, each a yes or no: reorder Home so safety answers earlier than
      ~85% scroll depth (R4-a) · reuse the price band on Home after the compare table (R4-c) · a
      founder-credibility strip before the closing CTA (R4-e).
- [ ] 🧑 **Backlinks** (V3-i), parked at the founder's instruction. A new domain ranks on authority it
      does not have yet; the realistic first wave is directory and listing submissions plus any press
      from Elevate and NVIDIA Inception. The `directory-submissions` skill is installed and ready.
- [ ] 🧑 **Two optional Ahrefs buttons** (V4-d): keyword volumes need a plan upgrade, and connecting
      Search Console inside the Ahrefs project would surface real query impressions. The strategy
      depends on neither. Worth knowing: kheelona.com already ranks **#1 in India for "raising
      bilingual child in india"**.

## 🔁 Standing, triggered by an event rather than a date

- [ ] 🤖 **The sell-out copy sweep, the day the 500th unit sells.** The store flips to ₹7,999
      full-payment BY ITSELF, server-side, per request. The static marketing pages cannot: Home,
      `/products/lumi`, `/terms`, `llms.txt`, `pricing.md` and the JSON-LD price will still read
      "₹499 reserves one of the first 500 units". Trigger: `/api/health` reporting
      `"preorder":"full"`, or the internal order alert. Then ask for the sweep — a one-session edit
      (§8.26-g). *Verified 2026-09-01: health reports `token`, so not triggered.*
      **⚑ ADDED 2026-09-01, and this one is invisible on the page, so it is the easiest to miss:
      `src/app/(site)/products/lumi/_components/ViewContentTracker.tsx` reports the headline unit
      price to Meta as its `value`, read from `LAUNCH_AMOUNT_PAISE` (₹4,999). Change it to
      `FULL_AMOUNT_PAISE`.** The founder chose to send a value knowing it would need this manual
      follow-up (§8.30-j). Nothing breaks if it is missed — but every ViewContent from that day on
      under-reports the product by ₹3,000, which quietly skews any value-based audience or report
      built on it. The component's own header comment and `ViewContentTracker.test.tsx` both point
      back here.

---

# ✅ Recorded 2026-08-24 — a DECISION, not open work

- **The CTA contrast is 2.88:1, and that is deliberate (§8.29).** Every label on a solid orange fill
  is white as of 2026-08-24, which fails WCAG AA at every size. **Do not open this as a defect and do
  not re-raise it with the founder.** They were shown the ratio and the passing alternative
  (`orange-cta #C25210`, white at 4.66:1) and chose to keep brand orange so the site matches
  `.kh-button` in the v3 design system. Lighthouse a11y measured **96** afterwards, down from 100,
  `color-contrast` the only failing audit, **still above the 90 gate**. `test/action-label.test.ts`
  enforces it, `test/contrast-tokens.test.ts` pins the arithmetic, and `qa:sweep` prints the accepted
  nodes on every run while still failing any OTHER contrast pair. Reversing it is one mapping in
  `globals.css` plus a founder conversation. Record:
  `docs/checkpoints/white-cta-labels-2026-08-24.md`.

- **The store's descriptive paragraph is gone from `/store` and `/store/ideabaaz`**, by founder
  request. Not a regression: `OrderSummary` carries every fact. §8.25-b was corrected in the same
  commit, because it justified the one-tap CTA law by quoting that paragraph. The one consequence
  worth knowing: on a phone `OrderSummary` stacks below the form, so **the ship date is now first
  read after the form** rather than before it.

---

# ✅ Closed or corrected by the 2026-08-23 review

- **Journal cards should use each article's hero art** (R4 Design #14) — **DONE, and had been for a
  while.** It was deferred in July because seven journal heroes did not exist. V4 shot all of them.
  Verified: 19 of 19 articles carry `hero` + `heroAlt` (4 in `stories.ts`, 15 in
  `stories-expansion.ts`), 19 files sit in `public/stories/`, and the live `/stories` index renders
  them through the image optimizer at `src/app/(site)/stories/page.tsx:115`. Closed.

- **"Search Console verification and sitemap submission"** — **not a real item, removed.** The domain
  property is verified and the 24-page sitemap is processed and matches the 24 URLs the site emits
  (`closed-rounds.md`, launch row). What I had written was "for anything new", which is a description
  of routine operations rather than an open task.

- **"The Ahrefs tag is deliberately not host-restricted"** — **a recorded trade-off, not a todo.** It
  is ungated on purpose, because Ahrefs verifies an install by fetching the page, and the cost is
  that local and preview page views reach the property (§8.21-c). Verified still ungated in
  `src/app/layout.tsx`. The standing offer remains: say the word and I restrict it and verify another
  way. Moved here so the list stops implying someone forgot to do something.

---

## Recovering anything removed in the 2026-08-23 doc cleanup

Deleted deliberately, all recoverable from git history:

| Removed | Why |
|---|---|
| `docs/revamp-2026-07/PLAN-V6.md` | A 618-line step-by-step build plan, fully executed 2026-07-31. Its 60 unticked boxes were executed steps, not open work. The spec `BUILD-V6.md` and the checkpoint survive. |
| `docs/revamp-2026-07/HANDOFF-design-v6.md` | A design micro-polish list the file itself records as implemented the same day. |
| `docs/revamp-2026-07/QA-V6-note.md` | An independent content review whose four blockers were all fixed. Compressed to a paragraph in `docs/qa-report.md`'s V6 section first. |
| `src/components/vendor/animate-ui/backgrounds/hero-glow.tsx` (+ test, story) | The only source file with no importer. Its registry row had gone stale claiming "Used on: Home hero" and naming a kill switch at a path the `src/` reorg deleted. |
| `public/brand/kheelona-wordmark-white.svg` | Unreferenced, and not an input or output of `tools/brand/render-icons.mjs`, which reads the colour wordmark. |

**Approved for deletion but deliberately NOT deleted:** `public/products/lori.png`, `lua.png` and
`robu.png`. `src/lib/family.ts:3-5` states in code that those characters "stay published on
kheelona.ai, and their renders stay in `public/products/` untouched for **parity**", and the earlier
2026-08-23 cleanup round recorded keeping them for that same reason. A decision recorded is not
silently reversed, so they stay and this is the flag. Three PNGs. Say the word and they go, and
`family.ts` gets corrected in the same commit so the code stops claiming otherwise.
