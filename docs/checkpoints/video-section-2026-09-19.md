# Video section: three-up carousel of real families (2026-09-19)

**Status: IN PROGRESS.** This file is the running record, appended at every commit, per the
living-documentation law (founder, 2026-09-05).

Rollback tag **`pre-video-section-2026-09-19` = `818132f`**.
Baseline gates before any change: **1179 tests / 116 files**, `tsc` 0, `qa:sweep` clean 34/34.

---

## Why this round exists

The site had no video anywhere except the dormant launch film, and the strongest social proof it
could carry — parents and children actually using Kheelu — was absent. The four written testimonials
are still drafted placeholders on named people. Real footage of a four-year-old talking to the toy
answers the question the copy structurally cannot.

The founder asked for a section showing three videos at a time that advances and loops, on the home
page and on `store.kheelona.com` below the pre-order form.

## The twelve decisions, taken in one question round on 2026-09-19

| | Decision |
|---|---|
| Placement | Home page + `store.kheelona.com` |
| Hosting | Self-hosted MP4 under `public/`. No CDN, no YouTube, no Vimeo |
| Content | Parent videos, UGC, and children talking to Kheelu |
| Adding videos | Code-managed list plus a written checklist. No CLI, no CMS |
| Advancing | Auto-advance with manual override |
| At rest | Centre tile plays a silent animated loop; all three carry a soft play button |
| Mobile | One tile with a peek of the next, swipeable |
| Captions | Burned into the video file. No separate transcript, no `.vtt` |
| Format | Vertical 9:16, 1080x1920 |
| Consent | Written parental consent already held (founder, 2026-09-19) |
| Store position | Below the whole grid, not between form and OrderSummary (see below) |
| Guard test | Kept — the repo's existing testing discipline, not new tooling |

## Three findings that shaped the build, each verified rather than assumed

### 1. Self-hosting needs no CSP change, and that is why it won

`media-src 'self'` has been in the policy since the security round (`src/lib/security-headers.ts`).
A YouTube or Vimeo embed would have needed `frame-src` opened AND would have added third-party
cookies to a best-practices score already sitting at an accepted 74 (§8.34-h). Self-hosting costs
nothing on either axis. The trade it does carry is repo weight and the public-repo exposure below.

### 2. axe's `video-caption` rule would have failed the checkout page

Read out of the installed axe-core 4.12.1 rather than recalled:

```
id: 'video-caption', impact: 'critical', selector: 'video', none: [ 'caption' ]
```

**No matcher.** Any `<video>` element in the DOM fails it — muted, paused, autoplaying, silent, it
does not matter. `qa:sweep` runs axe with default rules and filters exactly one accepted pair (the
white-on-orange contrast, §8.29), so a `<video>` present at rest would have put a **critical**
violation on the home page and on the page that takes money, and ended the clean 34/34.

**The content itself complies.** The founder's videos carry burned-in subtitles, and open captions
satisfy WCAG 1.2.2 — the automated rule simply cannot see them. So this was never an accessibility
trade, only a detection one.

**The resolution is the facade:** at rest a tile is an image and a button; the `<video>` is injected
into the DOM only when someone presses play. The sweep stays green truthfully, and it is also the
fastest-loading option available, which is why it was the recommendation before the rule was read.

`no-autoplay-audio` is also enabled, but a silent animated WebP is not a media element, so the
centre tile's motion is out of scope for both rules.

### 3. The store's mobile stacking order is already a recorded cost

`src/app/store/page.tsx` states in its own header that removing the prose paragraph left
`OrderSummary` stacking below the form on a phone, so the ship date is "first read after the form".
Placing a video carousel literally below the form would have pushed the refund promise, the balance
due and the ship date beneath it, on the checkout page. The section therefore sits **below the whole
two-column grid**: identical to the brief on desktop, and on mobile the order stays
heading -> form -> order summary -> videos. Raised with the founder in the plan.

## Two risks recorded rather than absorbed

- **The GitHub repo is PUBLIC and these are videos of real children.** Written consent covers
  publishing them on the site; it does not make a public repo a sensible home for the masters, and
  git history makes removal permanent only in the working tree. This is the strongest argument yet
  for the repo-visibility item already open in `Technical-Todo.md`. Recommended: flip to private
  before the first video lands. Vercel keeps deploying on the Hobby plan.
- **Video in git is permanent weight.** At the 4MB budget ten videos is 40MB in every clone forever.
  The rulebook caps the library at 12 videos / ~48MB; past that the honest answer is a CDN.

## Running record

