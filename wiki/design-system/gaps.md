---
title: Design system gap register
type: design-system
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - design-system/project/README.md
  - design-system/project/01-writing.md
  - design-system/project/02-imagery.md
  - design-system/project/04-kheelu.md
  - design-system/project/06-surfaces.md
  - design-system/project/07-selling.md
  - design-system/project/08-accessibility.md
  - design-system/project/10-pages.md
  - design-system/project/components/bundle.css
  - design-system/project/components/bundle.js
  - design-system/project/components/index.d.ts
  - design-system/project/components/*/README.md
  - design-system/project/assets/ (file listing, sizes via ls, dimensions via sips)
  - design-system/project/fonts/*.woff2 (CoreText glyph check, 2026-10-10)
  - "Headless Chrome on design-system/site/home-page.html at 360x640, 390x844, 412x915, 1366x768, 2026-10-10"
  - "axe-core 4.12.1, WCAG A/AA tags, design-system/site/home-page.html at 390 and 1366 px, 2026-10-10"
  - "WCAG 2 relative-luminance contrast computed from tokens.css hex values, re-run 2026-10-10"
  - docs/checkpoints/migration-to-new-dsx.md (line 52, at the tag)
  - src/config/site.ts (lines 90-94), src/lib/seo.ts (lines 161-167), package.json (line 36), all at the tag
  - wiki/raw/brief/kickoff-brief.md (sections 4.1, 9.1, 9.2, 9.6, 9.9-9.12)
---

# Design system gap register

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

DS citations (`design-system/…`; short forms such as `README.md:134` or `bundle.css:410` are files
under `design-system/project/`) refer to DS v11 as delivered and checksummed in the
[manifest](manifest.md); the DS is in no git tag ([D004](../decisions/D004-internal-material-uncommitted.md)).
**Values on this page are quoted as evidence for the gap they sit under**; the DS files win if they
ever disagree.

Things a sales site needs that DS v11 cannot express from its parts, or where the DS and the brief
pull apart. Per brief §4.1: compose from DS parts first; if that is impossible, log the gap here and ask
the founder; **never improvise**. This page logs gaps only; it proposes no new tokens or values.
The decisions live in [open questions](../open-questions.md) (IDs in the table) and `decisions/`.

**Severity:** **High** = blocks a brief acceptance criterion or Gate A · **Medium** = needs a decision
before build · **Low** = note for the build.
**Route:** *Compose* (buildable from DS parts) · *Pipeline* (a look-identical derivative, allowed by
§4.1) · *Founder* (a decision, the founder owns the DS) · *Architect* (engineering, Phase 4).

## Summary

| ID | Gap | Severity | Route | Open question | Status |
|---|---|---|---|---|---|
| [G-01](#g-01) | Tap targets under 44 × 44 px in three components | Medium | Founder (DS change) or avoid the element | G11 | Open |
| [G-02](#g-02) | White on Chilli and white on Kheelu Blue fail WCAG AA; axe flags them serious | **High** | Founder | G2 | Open |
| [G-03](#g-03) | No breakpoint or grid tokens; the 12/4-column grid exists only in prose | Medium | Founder / Architect | – | Open |
| [G-04](#g-04) | `kh-split` lets a fixed-width child push the page wider than a phone | Medium | Compose (avoid) / Founder | – | Open |
| [G-05](#g-05) | `ComparisonTable` scrolls sideways on phones; its scroll area is not keyboard-focusable | **High** | Founder | G11 | Open |
| [G-06](#g-06) | Two chilli CTAs in one view (nav and hero) against "one cta per view" | Medium | Founder | G2 | Open |
| [G-07](#g-07) | The DS varies the CTA label by situation; the brief wants one label everywhere | **High** | Founder | G1 | Open |
| [G-08](#g-08) | `OfferCard` cannot show the paid-in-full offer; its unit counter clashes with the never-publish rule | **High** | Founder / checkout | G9 | Open |
| [G-09](#g-09) | `StickyBuyBar` behaviour (show, hide, phone-only, safe area) is described but not built | Medium | Compose + Architect | G4 (motion) | Open |
| [G-10](#g-10) | No motion for reveals, overlays, the sticky bar or doodles; two DS motions break "transform and opacity only" | **High** (Gate A item) | Founder, at Gate A | G4 | Open |
| [G-11](#g-11) | No component for breadcrumbs, articles, video, gallery, spec table, checkout summary or confirmation, consent banner | Medium | Compose where possible / Founder | G3 (video), G6 (consent) | Open |
| [G-12](#g-12) | Icons missing for payments, receipts, gifts, phone, external links, Facebook, LinkedIn, Google Play | Low | Founder | – | Open |
| [G-13](#g-13) | Fonts cover Latin and Devanagari only; native-script language names fall back to system fonts | Medium | Founder | G11 | Open |
| [G-14](#g-14) | Imagery gaps: one product angle, no mascot, no team photos, no video, no OG image, no web stickers | Medium | Founder / Pipeline | G3 | Open |
| [G-15](#g-15) | "The web version on claude.ai wins": our checksummed copy can silently go stale | Low | Founder | G11 (freeze v11) | Open |
| [G-16](#g-16) | `bundle.js` is a client-only React 18 global; the site needs server HTML on React 19 | Medium | Architect | – | Open |
| [G-17](#g-17) | Kheelu's child-facing voice is specified for ages 3–6; the site's band is 3–7 | Low | Founder (DS owner) | – (returned to the orchestrator) | Open |

## Gaps

### G-01
**Tap targets under 44 × 44 px.** Brief §9.10: "Tap targets are at least 44 × 44 px; if a DS component is
smaller, flag it as a DS gap." The DS's own floor is `tap-min` (`README.md:134`; `tokens.css:87`), which
is stricter than the brief. The ask to the DS owner for 44 px tap areas on the AnnouncementBar and
FeatureCard links is [open questions](../open-questions.md) G11.

| Element | Measured (360 px, 2026-10-10) | Why | Source |
|---|---|---|---|
| `AnnouncementBar` link ("Pre-order") | 65 × 20 px | No tap extension on `.kh-announce a` | `bundle.css:410` |
| `FeatureCard` `link` | 24 px tall | `.kh-card__link` has no padding or extension | `bundle.css:210` |
| `AppSummaryCard` `link` | 24 px tall | `.kh-app__link` likewise (app component, but shown on the site) | `bundle.css:561` |
| `NavBar` link "Team" (desktop) | 41 px wide at 1366 px | Tap area extended vertically only | `bundle.css:633` |
| Inline links in body copy (`link`) | text height | No extension; WCAG 2.5.8 exempts inline links, the brief's rule does not say | `08-accessibility.md:33` |

Not affected (checked): buttons (size `s` extends its tap area, `bundle.css:127`), icon buttons, tags,
toast actions, nav links vertically, footer links (`:651`), FAQ questions, form rows.

### G-02
**White on Chilli and white on Kheelu Blue fail WCAG AA.** Open as [open questions](../open-questions.md)
G2. Computed from `tokens.css`: white on `chilli-500` **2.88:1**, white on `blue-500` **2.96:1** (both
below the 4.5:1 text minimum and the 3:1 large-text and non-text minimum). The DS keeps both as brand
decisions (9 and 10 Oct 2026) and names the passing alternative, ink on the fill (5.49:1 and 5.34:1),
which "needs the owner's OK" (`08-accessibility.md:25`).

- **axe-core 4.12.1** on the DS sample home page: **11 serious `color-contrast` nodes** at 390 and
  1366 px: the nav and hero cta labels, chilli and blue stickers, the selected `ModeSwitch` option, the
  chilli `FeatureCard` block title, and more. Brief §9.6 requires zero critical or serious axe issues and
  "contrast requirements are met using DS tokens".
- Same ratio for **checked states**: the white tick, dot and thumb on Blue in `Checkbox`, `RadioGroup`,
  `Switch` and selected `Tag` (2.96:1, below the 3:1 non-text minimum of WCAG 1.4.11). Matters if the
  checkout uses them. Blue fills against the grounds are 2.44–2.96:1, which the DS acknowledges
  (`08-accessibility.md:21`); the `ProgressBar` fill on its track is one of them.
- History: the live site made the same call for white on `#EF762F` (the same hex as `chilli-500`) on 2026-08-24 (§8.29 in the
  legacy laws; see [settled decisions](../legacy/settled-decisions.md)).

### G-03
**No breakpoint or grid tokens.** The DS describes a 12-column desktop grid and a 4-column phone grid
(`README.md:131`) but ships no grid classes for it; the built layout classes are `kh-split` and
`kh-cols` (`10-pages.md:16-32`). Breakpoints exist only as four `min-width` queries, **720, 768, 900 and
1024 px** (`bundle.css:175-1147`). Brief §9.12 replaces Tailwind's breakpoints "where the DS defines
them", so the bridge has no DS-sanctioned breakpoint set to use. See [tokens](tokens.md).

### G-04
**Phones scroll sideways when a `kh-split` holds a fixed-width child.** On phones `kh-split` is a grid
with no column template (`bundle.css:1136`), so the **390 px** `kh-device` frame (`bundle.css:1169`) sets
the column width. On `HomePageTrust`'s parent-app fold the page measured **406 px wide at 360 and at
390 px** (headless Chrome, 2026-10-10), breaking brief §9.10 ("nothing scrolls sideways"). The DS says
`kh-device` "is not part of the page" (`HomePagePhone/README.md`), yet `HomePageTrust` uses it in the
page. Avoidable by not putting `kh-device` in a page split.

### G-05
**`ComparisonTable` scrolls sideways on phones.** The README says so ("On phones the table scrolls
sideways with the first column fixed", `ComparisonTable/README.md`); the CSS sets **`min-width: 640px`**
inside an `overflow-x: auto` wrapper (`bundle.css:336-337`). Brief §9.10: nothing scrolls sideways.
axe-core also reports **`scrollable-region-focusable` (serious)** on `.kh-compare-wrap` at 390 px:
keyboard users cannot reach the hidden columns. The DS has no stacked phone variant; asking the DS owner
for one is [open questions](../open-questions.md) G11.

### G-06
**Two chilli CTAs in the first view.** Open as part of [open questions](../open-questions.md) G2. The DS
rule is one `cta` per view (`README.md:11`, `:16`; `07-selling.md:51`), yet `NavBar` always carries a
chilli cta (`NavBar/README.md`) and the templates put a hero cta under it. Measured at 360×640: nav cta
at 78–118 px, hero cta at 516–572 px, both on the first screen; the same at 1366×768 (render
`renders/home-page-desktop-top.jpg`). Either the nav cta is an accepted exception or the rule needs
restating.

### G-07
**The DS varies the CTA label by situation; the brief wants one label everywhere.** Brief §9.1: "one
primary action per screen, with the same label everywhere." The DS writing guide gives a different main
action for each situation (`01-writing.md:51-56`; `07-selling.md:51`), and `OfferCard` and
`StickyBuyBar` default to two of them (`bundle.js:292`, `:312`). Every label is a prop, so one label can
run everywhere without changing the DS; the open point is whether that breaks the DS's writing rule.
That rule also says to put the price on the CTA when it lowers the barrier (`01-writing.md:60`), which
pulls against **founder decision #9 of 2026-08-23: no number on the button, the price in the caption**
(`docs/checkpoints/migration-to-new-dsx.md:52`; the live label follows it, `src/config/site.ts:90-94`).
The candidate labels and the decision are owned by [messaging](../brand/messaging.md#cta-labels); the
choice is [open questions](../open-questions.md) G1.

### G-08
**`OfferCard` cannot express the post-cap offer.** Open as [open questions](../open-questions.md) G9.
It always renders the "Reserve today, refundable / When it ships" split from `deposit` and `balance`
(`bundle.js:287-289`); there is no prop to hide it. Once the token offer sells out, the live offer is paid in
full with no token and no balance (live terms, owned by [pricing](../product/pricing.md)). Also,
`unitsLeft`/`unitsTotal` render "N of M left at this price" (`bundle.js:275-280`; allowed by
`07-selling.md:45` when wired live), while the live store's law is that the count is never published
(see [checkout](../site/checkout.md)). And the default copy "When it ships" for the balance and
"Delivery across India" (`bundle.js:289`, `:293`) must match the live terms.

### G-09
**`StickyBuyBar` behaviour is described, not built.** Rules: phone-only, on screens narrower than
**900 px**, appears after the hero cta leaves, hides while the `OfferCard` is visible, never covers the
consent banner or FAQ answers, page padding equal to its height (`StickyBuyBar/README.md`;
`10-pages.md:73`; `06-surfaces.md:27`). The component is only `position: sticky; bottom: 0`
(`bundle.css:414-430`; `bundle.js:307-313`): no show or hide logic, no width rule, no entrance
motion, no `env(safe-area-inset-bottom)`. Composable with a small script, but the motion is undefined
([G-10](#g-10); [open questions](../open-questions.md) G4).

### G-10
**Motion is undefined beyond small interactions.** Open as [open questions](../open-questions.md) G4.
Full analysis: [motion](motion.md). In short: `duration-enter`, `ease-bounce` and `duration-draw` are
defined but used by no component; there is no motion for section reveals, the sticky bar, `NavDrawer`
(its README says it "slides in"), `BottomSheet`, `Dialog` or `Toast`; no distance beyond the **4 px**
button press. Two DS motions break brief §9.11's "transform and opacity only": the progress bar animates
`width` (`bundle.css:680`) and the chalk draw-on is a stroke reveal (`README.md:160`). The reduced-motion
rule removes the tooltip fade although the README says to keep fades (`bundle.css:1176-1180` vs
`README.md:161`). The spinner speed (**0.9s**) is a literal, not a token (`bundle.css:669`). Brief §9.11:
propose a motion spec at Gate A and log it as a DS gap.

### G-11
**No component for several things the site needs.**

| Need | Brief or source | Composable from DS parts? |
|---|---|---|
| Breadcrumbs on deeper pages | Brief §9.2 | Likely: `link` text, `Icon caret-right`, `kh-caption` or `kh-body-s`. Needs a pattern agreed once |
| Long-form article layout (19+ `/stories` articles, policy pages) | Current site; brief §9.2 Article schema | Partly: `kh-body-l` for reading (`tokens.json` usage), `SectionHeading` for the title. No styles for in-article headings, lists, quotes, source lists or bylines |
| Video player and the "Watch a child meet Kheelu" fold | `07-selling.md:26`; `10-pages.md:14` | No: only `IconButton` "play". The DS requires real video and captions (`08-accessibility.md:49`). Whether the consented films come across: [open questions](../open-questions.md) G3 |
| Product image gallery | Brief §9.11 ("smooth gallery") | No assets to fill it ([G-14](#g-14)); a scroll-snap row of `kh-photo` is composable |
| Plain spec table (label and value) | Live product page | Not cleanly: `ComparisonTable` adds tick and cross icons and highlights a column |
| Checkout order summary, step indicator, confirmation page | Brief §4.4 (restyle the checkout) | Partly: `TextField`, `Select`, `RadioGroup`, `Checkbox`, `Alert`, `Button loading`, `ProgressBar`. No order-summary or receipt pattern. Steps depend on the [checkout inventory](../site/checkout.md) |
| Consent or cookie banner | Referenced by `StickyBuyBar/README.md` ("never cover the cookie or consent banner") | Only if one is needed: [open questions](../open-questions.md) G6; current consent behaviour is owned by [tracking inventory](../site/tracking-inventory.md) |
| 404 page | Brief §9.2 | Yes: `EmptyState` plus `Button` |

### G-12
**Icons the site may need are not among the 76.** Present and sufficient for the current site's icon use
(close, plus, arrows, play, pause, menu, chevrons, check; also `instagram-logo`, `whatsapp-logo`,
`youtube-logo`). Missing: a payment or card icon, receipt, gift (the DS names gift-givers as an
audience, `05-asset-playbook.md:53`), phone, external link, `facebook-logo`, `linkedin-logo`, a Google
Play logo (the live `Organization.sameAs` lists LinkedIn, Instagram, Facebook and a Play Store developer
page, `src/lib/seo.ts:161-167`). The DS forbids other icon sets (`Icon/README.md`). Low: text links work.

### G-13
**Native-script language names have no DS font.** Open as [open questions](../open-questions.md) G11.
`LanguageChips` shows বাংলা, తెలుగు, தமிழ், ಕನ್ನಡ by default (`bundle.js:238-248`) and its README says to
load the Baloo sister families from Google Fonts (`LanguageChips/README.md`); body text in Indian scripts
should use Noto Sans (`README.md:126`). None of these are in `fonts/`. CoreText check (2026-10-10):
Baloo 2 and Kalam include Devanagari; **no shipped font has Bengali, Telugu, Tamil or Kannada**; Nunito
has the ₹ sign. Brief §4.1 forbids new fonts, so these chips would render in the phone's system font.
Also, the default language list sets no `lang` attribute although `08-accessibility.md:54` requires one
(fixable by passing our own list).

### G-14
**Imagery the site needs that the DS does not contain.** Brief §2: only the photos, illustrations and
art in the DS. Imagery beyond the DS, and whether to disclose that the DS children are AI-generated, is
[open questions](../open-questions.md) G3.

| Missing | Evidence | Effect |
|---|---|---|
| Product angles: back, three-quarter, in-hand for scale, light ring lit and unlit, packaging, quick-start card | "Still needed" (`04-kheelu.md:27`; `assets/Kheelu/README.md`) | No product gallery; one front view for every product shot |
| The illustrated Kheelu mascot | "not in this system yet" (`04-kheelu.md:66`) | The current site's mascot art cannot be used |
| Real team photos | "Show real team photos on the Team page" (`07-selling.md:72`) | `/team` has no DS imagery for founders |
| Real video | Video fold "only with real video" (`10-pages.md:14`) | The site's existing consented films are not in the DS |
| An OG or WhatsApp image at **1200×630** | Size in `06-surfaces.md:15`; `kheelu-on-fur.jpg` is **1600×1600** | Must be composed (the `CampaignKit` WhatsApp preview is the pattern) |
| Web versions of stickers and cut-outs | Cast stickers and cut-outs are PNG only, **about 1.0–1.5 MB each**; `kheelu-front-sticker.png` is **1.5 MB** with no WebP | The DS hero board would far exceed its own **200 KB** hero limit (`06-surfaces.md:29`) unless the pipeline makes derivatives (allowed by §4.1) |
| Article images for 19+ stories | Only 25 library photos, each child at most twice per page (`10-pages.md:67`) | Heavy reuse across `/stories` |

### G-15
**The DS says another copy wins.** "The web version on claude.ai is the source of truth. If this copy and
the web disagree, the web wins." (`design-system/README.md:26`; `00-how-to-use.md:7`). Brief §4.1 keeps
`design-system/` exactly as delivered and checksummed. If the owner publishes v12 on claude.ai, nothing
here tells us. No claude.ai link to the DS is in the repo. Freezing v11 for this project is
[open questions](../open-questions.md) G11.

### G-16
**The component bundle cannot render the site as delivered.** `bundle.js` is an IIFE that reads
`window.React` (React 18.3.1, `design-system.json` `libraries`) and renders in the browser
(`bundle.js:1-7`, `:756`). Brief §9.2 needs primary content in server HTML; the stack is Next 16.3.4 on
React 19.2.4 (`package.json:33`, `:36`). The DS allows the no-React route: "the `kh-` classes in
`bundle.css` style the same markup the components render" (`00-how-to-use.md:135`). So components must
be reproduced as server-rendered markup with the `kh-` classes, with behaviour (drawer focus trap, menu
keys, tabs) ported, and a parity check against `bundle.js` output. Architect, Phase 4.

### G-17
**Kheelu's child-facing voice stops at 6.** The DS writing guide says Kheelu "speaks to 3–6 year olds"
and sets sentence length for ages 3 and 5 only (`01-writing.md:75-77`). The published band is 3–7
(brief §2; [open questions](../open-questions.md) section E). Affects child-facing audio, video and
quoted speech only, not parent copy. Flagged by [brand voice](../brand/voice.md#where-they-conflict)
(row 13) and [positioning](../brand/positioning.md) (row 12). Ask the DS owner for guidance at 6–7; no
open-question ID yet (returned to the orchestrator). Now part of [open questions](../open-questions.md) G11.

### G-18
**No footnote or source-citation pattern.** The founder requires every public statistic on the site
to carry a marker linking to its source ([D026](../decisions/D026-public-statistics.md)). DS v11 has
the note text styles (`kh-body-s`, listed for footnotes, `tokens.json:411`; `kh-caption`,
`tokens.json:452`) and a `--link` colour, but no inline marker, no in-text link style outside
components, no numbered notes list and no back-link, and a superscript numeral is far below the
48 px `tap-min`. String-only props (OfferCard `fine`, ComparisonTable `caption`) cannot carry a
marker. Full finding: [source verification §6](../research/source-verification.md). Proposal for
Gate A ([open questions](../open-questions.md) G15): compose from DS parts (a "Sources" block in
`kh-body-s` at the end of the section, each figure followed by a short linked label rather than a
bare superscript, so the tap target meets 48 px), and ask the DS owner for a footnote pattern.

## Checked, no gap found

| Area | Finding | Source |
|---|---|---|
| Focus states | A global `:focus-visible` ring with an offset on every focusable element, ink on brand fills; no `outline: none` found | `bundle.css:18-20` |
| Hover dependence | Hover only darkens or underlines; tooltips never hold essential information | `bundle.css:114-124`; `Tooltip/README.md` |
| Forms | Visible labels, hints via `aria-describedby`, native inputs and `<select>`, consent never pre-ticked | `08-accessibility.md:36-37`; `Checkbox/README.md` |
| FAQ and dialogs | Native `<details>` and `<dialog>`, as brief §9.12 prefers | `bundle.js:259-266`; `Dialog/README.md` |
| Hard-coded colours in `bundle.css` | None (0 hex values) | grep, 2026-10-10 |
| ₹ glyph | Present in Nunito, Baloo 2 and Kalam | CoreText check |
| Hero cta in the first phone screen | Yes at 360×640 (bottom at 572 px) on the DS sample | Headless Chrome |
| The DS's allowed contrast pairs (`08-accessibility.md:9-23`) | All pass AA: ink on cream 14.57:1, ink on Sunshine 10.75:1, `ink-600` muted text 5.96–7.22:1 on cream, band and white | Computed from `tokens.css` hex, 2026-10-10 |
