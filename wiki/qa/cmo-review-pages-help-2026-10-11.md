---
title: "CMO review: Gate A mockups for /team, /setup, /contact and the 404 page, 2026-10-11"
type: qa
updated: 2026-10-11
sources:
  - ../../mockup/pages/team.html, setup.html, contact.html, 404.html and mockup/css/<slug>.css (built 2026-10-11 11:16 PDT with node mockup/build.mjs team setup contact 404)
  - ../../mockup/pages/home.html (the built homepage: reference for the close, price sentence, trust line and help line)
  - ../site/pages/team.md, setup.md, contact.md, 404.md (Copywriter drafts, 2026-10-11)
  - ../site/strategy.md (§2 rule for every page, §3 CTA rules, §5 page rows, §7 search rules)
  - ../site/gate-a-open-items.md, ../site/content-boundary.md, ../site/tracking-inventory.md (§6 cta values)
  - ../product/claims.md (§3.1 origin, §4.1, the D044 additions), ../product/facts.md, ../product/policies.md
  - ../brand/voice.md, ../brand/messaging.md, ../research/keyword-map.md (§4.1, §5.2, §6.9 B10, C1)
  - "../decisions/D018, D029, D032, D034, D036, D038, D040-D044"
  - "node mockup/tools/check.cjs (360 x 640, 390 x 844, 1440 x 900; axe; sideways scroll; errors), 2026-10-11 11:16 PDT"
  - "CMO extra captures (412 x 915, 1366 x 768, 360 x 590 in-app height, no-JavaScript render, tap-target sizes) with the same cached Playwright, scratchpad script, 2026-10-11 11:20 PDT"
  - "Founder's app demo video mobileapp-live-demo-oct2026.mp4 (repo root, local only, never committed): frames at 0:13, 0:22, 0:46, 0:50, 0:52 read with ffmpeg 2026-10-11 11:18 PDT; two crops without personal data saved as evidence"
  - "node scripts/ds-checksums.mjs: design-system/ intact, 643 files match the manifest (2026-10-11 11:15 PDT)"
---

# CMO review: /team, /setup, /contact and the 404 page (Gate A mockups)

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). This review reads the
> built mockups as SKM would, phone first. It is input only: the founder alone signs off copy
> ([D015](../decisions/D015-founder-signs-off-copy.md)), and where a page and a decision disagree, the
> decision wins. Evidence: `raw/qa/2026-10-11/cmo/pages-help/` (55 files: 1x viewport screenshots, the
> check reports, two app-demo crops). Shot names below are relative to that folder.

## Verdict

| Page | Verdict | Blocking fixes |
|---|---|---|
| `/team` | **Pass with fixes** | 1 (copy): the first screen never says what Kheelu is, the age band or the page's search term |
| `/setup` | **Pass with fixes** | 2: step 2 states two values the app itself still shows as placeholders; the app screenshot still shows "Games" (D044) |
| `/contact` | **Pass** | none; five should-fix items |
| 404 | **Pass** | none; one should-fix item |

All four pages are on-voice, use only DS components and tokens, carry the one label "Pre-order Kheelu"
with the exact D041 price sentence and the Home trust line beside every in-page CTA, never show two
orange buttons in one phone view, have one h1, valid `aria-labelledby` targets, no sideways scroll, no
console errors, and no axe violation apart from the founder's accepted white-on-Chilli exception (D041).
They work without JavaScript (the sticky bar stays hidden; all content shows). No internal material leaks.

## Pass/fail by criterion

| # | Criterion | Team | Setup | Contact | 404 | Evidence |
|---|---|---|---|---|---|---|
| 1 | Says what the positioning says, to parents of 3-7 | **FAIL** (M-T1) | PASS | PASS (S-C4) | PASS | `team-phone-360-00`, `team-phone-390-00`; `setup-phone-360-07`; `contact-phone-360-02`; `404-phone-360-00` |
| 2 | One obvious next step per screen | PASS | PASS | PASS (S-C1) | PASS (S-4a) | `team-phone-360-06`; `setup-phone-360-08`; `contact-inapp-360x590-00`; `404-phone-412-00` |
| 3 | Five-second test, 360 px phone | **FAIL** (M-T1) | PASS | PASS | PASS | `team-inapp-360x590-00`; `setup-inapp-360x590-00`; `contact-phone-360-00`; `404-phone-360-00` |
| 4 | CTA label, price sentence, trust line, never two orange in a phone view, `cta` values | PASS | PASS (no chilli by design, strategy §5) | PASS | PASS | identical sentence on Home, team, contact, 404 (grep); `orangeInFirstView` ≤ 1 at every width (`cmo-extra-report.json`); values `finale`, `navbar`, `navbar-mobile`, `sticky-bar` |
| 5 | Claims: nothing beyond claims.md and decisions | PASS | **FAIL** (M-S1, M-S2) | PASS | PASS | `app-demo-0050s-wake-step-brackets.png`; `setup-phone-360-03`, `setup-phone-360-07`; contact lines traced to policies 79-80, 117, pricing 238, claims §3.1 |
| 6 | Voice (plain en-IN, no em dashes, banned words absent) | PASS | PASS | PASS | PASS | regex scan of the four pages: no dashes, "best friend", "safe" alone, "toddler", "lessons", "wake word", "adapts", "brain", Kheelona+ |
| 7 | DS fidelity (no improvised visuals) | PASS (S-T1) | PASS | PASS | PASS | page CSS uses tokens only; px only in media queries; `team-laptop-1440-01`, `setup-laptop-1440-01` |
| 8 | Imagery rules (DS assets only, no cast beside films, each child once) | PASS | **FAIL** via the shared app asset (M-S2) | n/a (no images) | n/a | team: product only, belly unit visible (DS 04-kheelu:32); setup: `kheelu-belly-module.png` (DS: "for setup guides") |
| 9 | Motion | PASS | PASS | PASS | PASS | no reveals on these pages; the only motion is the sticky bar (opacity and transform, 200 ms; opacity only under reduced motion). The faded bar in `team-phone-360-06` and `contact-phone-360-06` is a capture taken mid-fade, not a defect |
| 10 | Accessibility basics (one h1, landmarks, alt, 44 px targets) | PASS (S-T3) | PASS | PASS (S-C3) | PASS | `*-report.json`; tap targets under 44 px are listed in `cmo-extra-report.json` |
| 11 | Search basics (primary cluster in title, H1, first answer) | **FAIL** (M-T1) | PASS | PASS by strategy §7 (S-C2) | n/a (noindex) | team: title and fold 2 only; contact: title, eyebrow, lede's first words; setup: title, H1, lede |
| 12 | Ad-landing readiness (contact and policies easy to find) | PASS | PASS | PASS | PASS | footer Help column and grievance link on every page (`team-phone-360-07`); none of these pages is an ad destination |
| 13 | Lighthouse | NOT RUN | NOT RUN | NOT RUN | NOT RUN | QA runs Lighthouse on the build (Phase 6); speed note S-T5 |
| – | Internal leakage (survey, competitors, unit counts, analytics) | PASS | PASS | PASS | PASS | page text and metadata |

Widths captured: 360, 390, 412 and the 360 x 590 in-app height for phones; 1366 and 1440 for laptops.

## Blocking fixes

### M-T1 · /team: the first screen never says what Kheelu is, for whom, or "Kheelona founders" (→ Copywriter)

- **Where:** fold 1 lede (`team-phone-360-00`, `team-phone-390-00`, `team-inapp-360x590-00`).
- **Now:** "Kheelu is designed by parents in Bengaluru. You’re trusting us near your child, so here is who we are."
- **Why it fails:** a parent who lands here (3 organic and 1 ChatGPT landings, keyword map §4.1) sees
  "The parents building Kheelu", a toy, and the sticky bar asking for ₹499, but nowhere on the page is
  Kheelu described or "ages 3 to 7" stated (only the meta has it). The page's primary term is in the title
  and in fold 2, not in the H1 or the first paragraph (strategy §7; keyword map §5.2 wants it in the H1).
- **Fix (one line, all claims already EXTERNAL):** "Kheelona’s founders are parents in Bengaluru, building
  Kheelu: a screen-free plush toy that talks, for children aged 3 to 7. You’re trusting us near your child,
  so here is who we are." The H1 can stay as option A (the founder's pick); if the founder prefers the lede
  unchanged, take H1 option B ("Meet the Kheelona founders.") and add the descriptor and age to fold 2.

### M-S1 · /setup step 2 states two values the app itself still shows as placeholders (→ Copywriter)

- **Where:** fold 3, step 2 (`setup-phone-360-03`, `setup-laptop-1440-01`).
- **Now:** "Press and hold the button on Kheelu’s back. Hold it for 3 seconds, until the light starts pulsing blue."
- **Evidence:** the app's own screen at 0:50 of the demo reads "Press and hold the button on Khelu's [back]
  for 3 seconds, until its light pulses [blue]." with both words still in square brackets
  (`app-demo-0050s-wake-step-brackets.png`). The DS anatomy shows the buttons on the belly unit and has no
  back view (DS `04-kheelu.md:13, 27`); D018 never names a light colour. `setup.md` cites "App demo" for both
  values without noting the brackets, and fold 5 already holds a placeholder for where the button is, so the
  page contradicts itself.
- **Fix:** "Press and hold Kheelu’s setup button. <span class="mk-placeholder">[PLACEHOLDER: which button and
  where; the app's own screen still shows "[back]"]</span>" / "Hold it for 3 seconds, until its light starts
  pulsing." Name a colour only if the founder confirms it (founder question 1). Correct the source row in
  `setup.md` fold 3.

### M-S2 · /setup shows the app's "Games" category, which D044 rules out (→ main session for the asset; Copywriter for the caption)

- **Where:** fold 6 (`setup-phone-360-07`, `setup-laptop-1440-02`). The shared file
  `mockup/assets/app/app-activity.webp` (last modified 10:58 PDT, before the D044 edits; `app-privacy.webp`
  was re-cut at 11:24) still shows the legend "Questions · Stories · Games" and the app's auto Hindi title.
- **Why it fails:** D044 and claims.md (D044 additions): "Games: NOT a launch feature: never claimed or shown";
  the auto title is to be replaced with "हिंदी में बातें".
- **Fix:** re-cut `app-activity.webp` per D044 (shared asset, outside this group; it is also on Home and Meet
  Kheelu). Change the caption to D044's wording: "Names changed; some content added for illustration."

## Should fix (not blocking)

### /team
- **S-T1 (Builder):** Apoorva Sahu and Aman Soni both show "AS" in identical sun-tone avatars, and the quote
  repeats "AS" (`team-phone-360-02`, `team-laptop-1440-01`). Give each founder a different DS tone (sun, blue,
  chilli) until photos arrive (B24, founder question 3).
- **S-T2 (Copywriter):** link "our grievance officer" in Aman's card to `contact.html#grievance`.
- **S-T3 (Builder):** the WhatsApp, phone and email links inside the fold 2 answer are 24 px tall. They pass
  WCAG 2.5.8 as inline links, but not the project's 44 px rule; reuse the `.mk-help` tap area, or leave them as
  text since the close's help line carries full-size targets.
- **S-T4 (Copywriter):** say in the "Recognised by." placeholder that the whole section stays hidden until a
  proof is filed (D038), so the founder does not read it as an empty strip that ships.
- **S-T5 (Architect, Builder):** the hero uses the 1.5 MB DS master `kheelu-front-sticker.png`; the build serves a
  WebP derivative at display size (brief §4.1 allows derivatives). Same asset on Home and other pages.
- **CMO view on the Copywriter's bio question (team.md Q1):** option (b) is fine for the positioning: the
  pre-school story says "this team comes from education" without a credential. The founder decides under D038.

### /setup
- **S-S1 (Copywriter):** use the app's own wording in "Before you start" (`app-demo-0046s-before-you-start.png`):
  "Charge Kheelu with the charger in the box, at least half full, or keep it plugged in." Then the F4 placeholder
  covers the charger type only. "Stay close to your Wi-Fi router" can follow the app: "Set up in the same room
  as your router."
- **S-S2 (Copywriter):** add the app's reassurance to step 3, where parents tend to give up on this kind of setup:
  "Your phone may say ‘No internet’ for a minute. That’s normal." (demo 0:52). Name the network only after
  founder question 2.
- **S-S3 (main session):** file the setup flow on `facts.md` (setup.md Gaps). Checked against the video: charge at
  least half or plugged in, know the Wi-Fi password, same room as the router, "connects to 2.4 GHz Wi-Fi",
  Kheelu "makes its own small Wi-Fi network for setup", "picks up changes the next time it's online" (profile
  screen, 0:13), hold for 3 seconds. Still placeholders in the app: "[back]", "[blue]". The page must never print
  the setup network's default password, which the app shows.
- **CMO view on setup.md Q4:** agree with (a), no chilli button on /setup, as built. The laptop nav keeps its
  button; "Meet Kheelu" closes the page.

### /contact
- **S-C1 (Copywriter, Builder):** at the 360 x 590 in-app height only half of the WhatsApp button shows; Call and
  Email sit below (`contact-inapp-360x590-00`). Shorten the lede so the three buttons fit, for example: "Call or
  message us on WhatsApp, or email us, with your order number if you have one. We are a small team in Bengaluru,
  and we answer our own messages. For a formal complaint, see our grievance officer below." The number and the
  email stay in the button text, so the answer-first facts stay in the HTML.
- **S-C2 (Copywriter):** keyword map §5.2 puts "Contact" in the H1. "Contact the team behind Kheelu." keeps the
  hand accent and the warmth.
- **S-C3 (Builder):** the seller block's phone and email links, and the grievance card's links, are 24 px tall
  (`cmo-extra-report.json`); give them the 44 px tap area.
- **S-C4 (Copywriter):** the page never says what Kheelu is. Add one line to the "Before you order" card: "Kheelu
  is a screen-free plush toy that talks, for ages 3 to 7."
- **Launch dependency (founder, D032):** "Call" appears three times on this page; the number must take calls before go-live.

### 404
- **S-4a (Copywriter, Builder):** list "Meet Kheelu" first. The product page converts 3x better than Home
  (strategy, "In one screen" item 4), and a lost visitor who came for Kheelu should meet it first. Order: Meet Kheelu, Home, Stories, Contact.

## Notes for other groups (main session)

- The `app-activity.webp` fix (M-S2) also applies to Home and Meet Kheelu.
- The footer logo and tagline sit at the viewport edge (24 px) on laptops while page content starts at the
  container edge (`setup-laptop-1440-04`, `team-laptop-1440-03`); a shared partial, already
  seen on Home, so only flagged here.

## Founder questions (website only)

1. **The setup button and light.** The app's own setup screen still says "button on Khelu's [back]" and "light pulses
   [blue]" in brackets. Which button does a parent hold for setup, where is it, and is it the wake-up button? Does the
   light pulse blue during setup?
2. **The setup Wi-Fi name.** In the app, Kheelu's setup network is called "lumi_by_kheelona". Will it be renamed
   before deliveries start? If not, may /setup name it and say Lumi was Kheelu's earlier name?
3. **Founder photos (B24).** The three photos already on the live /team are outside the design system (brief §2).
   May the new /team use them?
4. **A reply time on /contact (optional).** May the page promise a reply window, for example "within one working
   day"? Today it promises none, because none is decided.
