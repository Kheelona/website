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

### Commit 1 — the carousel, its data source and its tests

`src/lib/video-moments.ts` · `src/components/organisms/VideoMoments.tsx` (+ story + test) ·
`src/styles/globals.css`.

**The list ships EMPTY, and that is the deliverable.** No real footage exists yet, so
`VIDEO_MOMENTS` is `[]`, `VideoMoments` returns `null` below three rows, and both pages will omit
the section entirely. Seeding it with the launch film or stock footage to "show the design" is
forbidden in the file header: the never-invent law is stricter about social proof than about copy,
because a fake parent is a lie about a person.

**Two promises are made per row, in the type.** `hasOpenCaptions: true` and `consentOnFile: true` are
literal `true` rather than `boolean`, so a row that omits either fails to compile. They are the two
things this section rests on and the two that would be quietest to forget at speed.

**Three things the tests caught or pinned, in the order they happened:**

1. **A broken file kept a DISABLED play button.** Its own test failed, and the test was right: a
   disabled control still announces "Play: ..." to a screen reader, promising something that cannot
   happen. Fixed by extracting `Tile`, which renders the bare still when broken. The card degrades to
   copy, never to a dead control (the AudioMoments law).
2. **`setRotating` inside an effect was a lint ERROR**, not a style note: reading a media query that
   way is a cascading render. Replaced with `useSyncExternalStore`, which is what an external store
   like `matchMedia` is for, with a `false` server snapshot so nothing moves before the client has
   asked the platform.
3. **The gate guard is now a test.** `puts NO video element in the DOM at rest` fails the moment
   anybody puts a `<video>` back into a tile, and its comment names axe's rule and impact so the next
   person does not have to rediscover why.

**Motion is one switch, and it is three-valued.** `motionOverride` is `null` (follow the OS), `true`
or `false` (the visitor said so). `rotating = motionOverride ?? motionWelcome` governs the advance
AND the centred tile's silent loop, so the single Pause control stops everything that moves
(WCAG 2.2.2), and someone who prefers reduced motion can still start it deliberately.

**The centred tile is found geometrically**, by one IntersectionObserver with a 2% band at the
track's horizontal middle. No breakpoint is ever consulted, so the same rule gives the middle of
three on a desktop and the leading tile on a phone.

Gates: tsc 0, eslint clean on every new file, 23/23 on the new suite.

*Observed, not fixed, because it predates this round:* `AudioMoments.tsx:162` carries an unused
`eslint-disable` for `jsx-a11y/media-has-caption`. The rule is not enabled in this config, so the
directive warns. Mine were removed and their reasoning kept as plain comments.

### Commit 2 — wired into both pages, plus the rulebook and its guard

`src/app/(site)/page.tsx` · `src/app/store/page.tsx` · `docs/video-conventions.md` ·
`test/video-assets.test.ts`.

**On Home the room sits DIRECTLY ABOVE `parent-voices`.** That room's Kheelu line already reads
"Real families, real words", and the four quotes under it are still drafted attributions on named
people that the founder has decided to keep (`closed-rounds.md`). Footage of a real child is the
evidence those words are standing in for, so it now reads first and the quotes become the caption
rather than the claim. The whole room is behind `hasVideoMoments()`, so a short library means no
heading over an empty shelf.

**On the store it sits below the WHOLE grid**, not under the form. Reasoning in the plan and in the
code comment: that page's own header records that `OrderSummary` already stacks below the form on a
phone, so the ship date is "first read after the form". A carousel between them would push the
refund promise, the balance due and the ship date beneath it on the page that takes money. Flagged
to the founder as a deviation from the literal brief; desktop is identical either way.

**The guard test proves its own validator before trusting it.** `VIDEO_MOMENTS` is empty, so running
the rules against it passes vacuously and would keep passing if every rule were deleted. So
`test/video-assets.test.ts` exercises each rule in BOTH directions against fixtures first (bad id,
wrong aspect, wrong path, empty label, banned dash, missing file) and only then applies the same
function to the real list. It also parses `docs/video-conventions.md` and asserts the doc publishes
the same numbers the code enforces, the way `test/utm.test.ts` does for UTM conventions.

**A test count that did not reconcile turned out to be the guards working.** 1179 + 38 new should be
1217; the suite read 1222. Chased rather than accepted, with a per-file diff against a worktree at
the rollback tag. The five are `preorder-copy` +2, `preorder-cta` +2 and `stories-parse` +1: all three
are `it.each` over globbed source files, and the new component, story and lib files fell into their
globs and passed. The repo's standing copy and voice guards picked up the new code on their own,
which is the system behaving exactly as designed.

Gates: tsc 0, eslint clean, **1222 tests / 118 files**, all passing.

### ⚠ A SECOND SESSION IS WORKING IN THIS REPO AT THE SAME TIME

Discovered mid-round, on `main`: commit `3468edf` "Open the PostHog round with its running record"
is not mine, and `package.json`, `package-lock.json` and `src/config/site.ts` carry uncommitted
changes adding `posthog-js` and `POSTHOG_KEY`. A fifth measurement tool.

Nothing of mine is affected and nothing of theirs was touched: every commit in this round was staged
by name, which is the §8.34-era rule about never running `git add -A` here, earning its keep for a
reason nobody anticipated. But two agents on one branch and one working tree is a real hazard, and
**`npx next build` from here would build a mixed tree**, so that gate is deliberately NOT run until
the founder says how to proceed. Raised with the founder rather than worked around.

Worth noting for whoever reconciles the two rounds: PostHog is measurement tool number five, so
§8.21-c binds it (touching a measurement tool means touching `/privacy` in the SAME commit) and
`test/analytics-tags.test.ts` currently counts four.

### Commit 3 — verified in a real browser, laws written, fixtures removed

**The verification cost an hour and produced the round's most reusable finding.** Recorded as
§8.37-e because it will cost the next person the same hour otherwise.

Four throwaway fixtures were generated from `launch.mp4` (cropped to 9:16, three exports each: mp4,
poster jpg, and a 3s silent animated webp via `img2webp`, since **this ffmpeg build has no `libwebp`
encoder** — a gotcha now in the rulebook). Rows were added temporarily, never committed, and every
asset was deleted afterwards. `public/video/` is back to `launch.mp4` + its poster.

**The scare:** against `http://127.0.0.1:3007`, the carousel looked dead. No animated loop, no dot
marked current, and pressing play did nothing. Three symptoms pointing at one conclusion.

**It was none of them.** Next 16 blocks cross-origin dev requests and does not treat `127.0.0.1` as
the dev server's own origin, so the client chunks never loaded and the page never hydrated. The dev
server said so in its own log the whole time (`allowedDevOrigins`).

**Two controls found it, and both were needed.** `AudioMoments`, shipped and working for months, was
equally inert on the same page, so the fault could not be the new component. Then the same probe
against **production** returned `hydrated: true` with a working `AudioMoments`, so the probe was
sound. Only then was the dev server the remaining suspect. Guessing at the component would have
"fixed" code that was never broken.

**Verified on `http://localhost:3007`, hydrated, in a plain headless browser:**

| Promise | Result |
|---|---|
| No `<video>` on the page at rest | `videos: 0` ✓ |
| Exactly one silent loop, on the centred tile | `pictures: 1` ✓ |
| The centred tile is the one marked current | dot 2 `aria-current="true"` ✓ |
| Motion runs when the OS welcomes it | toggle reads "Pause the video carousel" ✓ |
| Play mounts one video and stops the loop | `videos: 1`, `pictures: 0`, toggle flips to "Play" ✓ |
| A second play replaces the first, never adds | `videos: 1`, src `demo-three.mp4` ✓ |

Screenshots taken at 1280 and 390 after hydration. Mobile shows one tile with the next peeking,
arrows hidden, dots and the pause control below, which is the approved design.

**Also learned:** `tools/qa/` screenshots are server-render evidence only (§8.37-f). `loadSettled`
waits for `domcontentloaded`, forces reveals, settles 1500ms, and never waits for React; `openPage`
turns on request interception, which additionally breaks the dev HMR websocket. A `qa:shot` image
proves what the server sent and how it is styled, and nothing about any click. `qa:sweep` is
unaffected, because axe over server-rendered HTML is exactly its job and §8.37-a is a property of
the page at rest.

Laws written as **§8.37 a-h**.

### What is NOT done, and why

- **`npx next build` and `npm run qa:sweep` were NOT run.** Both would operate on a working tree
  that now contains another session's in-progress PostHog work (`PostHogGate`, `lib/posthog.ts`,
  edits to `layout.tsx`, `/privacy`, `security-headers.ts` and two test files). A build or sweep
  from here measures a mixture of two rounds and would be evidence for neither. **Deliberately held
  until the founder says how the two rounds should be sequenced.** Everything that can be gated
  independently has been: `tsc` 0, eslint clean, and 38/38 on this round's own suites with the live
  empty library restored.
- **No video files exist yet**, so nothing renders on the live site. That is the designed state.
- **The Kheelu say line `"Real homes, real kids. Press play."` needs founder approval**, per the
  standing rule that every mascot speech line is approved before shipping. 33 characters, inside the
  48-character limit, and deliberately distinct from the neighbouring room's "Real families, real
  words."

### Commit 4 — the audio demos removed, the video section in their slot

Founder decision the same day: the "Hear it for yourself / Play, learn, together" room was a
stand-in built because no real user video existed, and it goes now that a home for real video
exists. The founder was shown the argument for keeping the demos on `/products/kheelu` (the only
place a parent could hear what Kheelu actually says) and chose full removal. **Settled.**

Deleted: `AudioMoments` (+ story + test), `src/lib/audio-moments.ts`, the four MP3s in
`public/audio/`, the `.audio-eq` rules and the `eq-bounce` keyframes.

**The room survived the swap, and that was the whole design problem.** Home's `learning` room held
three things unrelated to the media, each of which would have broken something on the way out: the
languages line carries Home's ONLY `fn-languages` marker (delete it and the note at the page bottom
is orphaned), the bilingual paragraph is Home's ONLY internal link to an article that already ranks
first in India, and the CTA is there under the strongest-fold rule. All three stay.

**Two headings, because the library is empty.** A heading promising films above no films is a lie
the page tells by itself, so the room is the video room at three or more videos and an honest
language heading until then, switching with no deploy. The say line is **omitted entirely** in the
empty state rather than substituted, because every mascot line is founder approved and "press play"
is false with nothing to press. `"Real homes, real kids. Press play."` was approved for the
populated state.

A copy flaw caught by looking at the render rather than the diff: the interim lede said "Kheelu
speaks the languages you speak at home" directly above a line reading "In the languages you speak at
home, up to ten of them." The lede is gone; the title carries it.

**Three findings, none of which was a bug in the new code.**

1. **The guard tests enumerate through `git ls-files`, which reports the INDEX.** A `git stash`/`pop`
   moved the deletions from staged to unstaged and eleven tests across seven files failed, every one
   reading a file that was not on disk. `git add -u` and all 1256 passed. Stage deletions before
   running the suite.
2. **A deletion moves parameterised counts in files nobody edited.** 1268 → 1256 reconciles exactly:
   AudioMoments' own 6, `preorder-copy` −2, `preorder-cta` −2 and `stories-parse` −1 as the deleted
   files left those `it.each` globs, and `redirects-vs-assets` −1 because `public/audio/` stopped
   existing as a directory for §8.21-b to guard.
3. **`qa:sweep` is 36 route/width combinations, not the 34 quoted throughout the docs.**
   `/ai-toys-for-kids-in-india` joined the route list on 2026-09-11 and the prose never caught up.

**The a11y gate moved rather than disappeared:** `test/a11y-v4.test.tsx` ran axe over `AudioMoments`
and now runs it over `VideoMoments`.

### Gates, all green, all run this time

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | 0 |
| `npx eslint` on every touched file | 0 (repo-wide errors are pre-existing: 40 problems at HEAD, 39 after) |
| `npx next build` | 0 |
| `npm test` | **1256 passed / 119 files** |
| `qa:sweep` (36 combos) | **clean**, 90 accepted white-on-orange (§8.29), **zero `video-caption`** |

Laws: **§8.37-i** added, and §8.22-e/f/h and §8.29-a corrected where they named `AudioMoments`.

### Commit 5 — the first real video, and what it changed

Source: `kheelu-montage-reel_38s_9x16_1080x1920_v03-nocards_final.mp4`, 41MB, 37.9s, 1080x1920 H.264
+ AAC. A montage of **three children in three homes** with the cream Kheelu, subtitles burned in and
a "Kheelu" speaker chip on the toy's lines. Exactly the content the section was built for.

Shipped as `first-conversations`: **3.00MB** mp4 (CRF 32, veryslow, faststart, 80k AAC), a 1080x1920
poster at t=4s, and a 540x960 / 36-frame silent loop at 0.30MB.

**Two rulebook steps were wrong and are corrected, both found by doing the work rather than reading
it.** The poster step said to pick a frame with no subtitle showing; on continuous dialogue no such
frame exists, so the rule is now "a short complete line, never a fragment". And the encode: measured
side by side, **720x1280 at CRF 28 was both larger and softer** than native 1080x1920 at CRF 32, so
the rulebook now says keep native resolution and judge on the subtitle band, which is the first
thing to fall apart.

**The 3-video minimum was wrong and is replaced (§8.37-j).** `VIDEO_MIN_TO_SHOW = 3` hid the section
below three videos. Holding back real footage because only one clip had arrived is a worse answer
than showing it well, so the count now picks a TREATMENT: 0 renders nothing, 1 or 2 render a centred
static row with no carousel chrome and no motion at all, 3+ is the carousel. The static state has no
Pause control because it has nothing to pause, which is correct rather than missing, and a test holds
that line with the OS reporting motion is welcome.

**A plural promise over a single film, caught in a screenshot.** The lede read "Press play on any of
them" above one video. Three pages render this section, so the sentence is now `videoLede()` in the
lib and is pinned by tests.

**Verified hydrated, in a real browser, against the production build:** 0 `<video>` at rest, 1 tile,
no carousel chrome, no silent loop; on play, one unmuted video playing `first-conversations.mp4`,
37.9s duration. `qa:sweep` clean 36/36 with the real file in place and **zero `video-caption`
violations**, which is the first time §8.37-a has been tested against real content.

**Two things for the founder, neither blocking.** The export carries a burned-in grey **"sound on"
badge** top-right, a social-platform convention that does nothing here because the player has native
controls; a clean re-export would remove it and swapping the file is one command. And a child's
**first name is spoken and captioned** ("You are so smart, Arha."); consent covers publication and a
first name is within the label rule, but it deserved a deliberate look rather than a surprise.

Gates: tsc 0, eslint clean on every touched file, `next build` 0, **1263 tests / 119 files**,
`qa:sweep` clean 36/36.

### Commit 6 — the second video: a real parent testimonial

`a-parent-speaks`. Source 44MB / 46.4s / 1080x1920, a named parent (Nikita Ravi) speaking to camera
about her two children, subtitles burned in and no "sound on" badge in this export.

**Encoded at CRF 34, not 32.** CRF 32 landed at **4.02MB, just over the 4MB budget**, and the guard
test would have refused it. A talking head compresses better than a montage, so CRF 34 gives 3.27MB
with the subtitle band still indistinguishable from source at 1:1. Checked by cropping the caption
band from source and both candidates and stacking them, which is the §8.37-j method.

**Two videos is still a static centred row**, per §8.37-j, and `videoLede()` flipped itself to the
plural ("Press play on any of them") because there is now a choice to make. Verified in a hydrated
browser: 0 `<video>` at rest, 2 tiles, no carousel chrome; playing the testimonial mounts one 46.4s
video, and clicking the other tile SWAPS rather than adds. The one-at-a-time rule holds across real
files.

**The play badge was moved and moved back, and the reasoning is in the code.** On the testimonial
thumbnail the centred badge sits over the speaker's eyes, which on a testimonial is the one thing
worth not covering. Lowering it to ~66% took it off her eyes and onto her mouth: a talking head
occupies the entire middle band, so **no vertical position clears a centred face** — only a corner
does, and a corner badge reads less like "press this" than the convention every video platform uses.
Reverted to centred, which is also what the founder specified (soft, ~50% transparency). Recorded
rather than churned, and raised with the founder as their call.

### 🧑 Three content notes on the testimonial, none blocking, all the founder's call

1. **An em dash is burned into the video**: the closing caption reads "A must-buy toy — Kheelu."
   The Brand Bible bans em dashes site-wide and that rule is described as non-negotiable. Nothing in
   this repo can reach a pixel, so it is a re-export or nothing. Swapping the file is one command.
2. **"Completely safe" is spoken as a claim.** "So I feel Kheelu is that toy which is completely
   safe." It is prefaced with "I feel" and it is her own opinion in her own testimonial, which is
   defensible. Flagged once because this site deliberately publishes no safety claim it has not
   earned: the standards FAQ is removed until a certificate lands, and no badge appears before it is
   earned. A parent's opinion is a different thing from our claim, and the distinction is worth
   making deliberately rather than by default.
3. **She names herself and both children** on camera. That is normal for a testimonial given with
   consent, and the site's own label copy adds nothing beyond her first name.

Gates: tsc 0, eslint clean, `next build` 0, **1263 tests / 119 files**, `qa:sweep` clean 36/36.

### Commit 7 — seven videos, the carousel is live, and two real defects found by looking

The library is now **7 of a permitted 12, 22.36MB of a permitted ~48MB**. `a-parent-speaks` was
REPLACED with the founder's v02 reframe (same id, new file) and five new films were added.

**Order, and it is a founder instruction rather than a preference.** The montage is the central video
and the parent testimonial sits to its right:

| # | id | why here |
|---|---|---|
| 0 | `a-mother-joins-in` | a parent in the loop, left of centre |
| **1** | **`first-conversations`** | **THE CENTRE TILE at rest (founder, 2026-09-19)** |
| 2 | `a-parent-speaks` | directly to its right (founder) |
| 3 | `a-story-in-two-languages` | |
| 4 | `a-father-speaks` | |
| 5 | `counting-out-loud` | Siddhant himself, straight after his father |
| 6 | `learning-by-asking` | |

**The centre slot is pinned by a test, not a comment**, via `VIDEO_CENTRE_INDEX`/`VIDEO_CENTRE_ID`.
The failure mode is silent: appending rows is harmless, but INSERTING one near the top moves the
montage out of the centre and nothing on the page would look broken.

**🔴 DEFECT FOUND BY MEASURING, NOT BY LOOKING: "Next" was skipping a video.** The centre went
1 → 3 → 5. `scrollToIndex` left-aligned the target, and left-aligning tile N makes tile N+1 the
centred one on a three-up desktop, so each press advanced the centre by two. **The relationship
between "leftmost" and "centre" depends on how many tiles fit, which is exactly the thing this
component refuses to know.** Fixed by having `scrollToIndex` CENTRE its target and by snapping on
`snap-center`: one instruction that means the same at every width. Verified by driving the control
and reading `aria-current`: desktop now **1 → 2 → 3 → 4 → 5**, mobile **0 → 1 → 2 → 3 → 4**.
This is the same lesson as §8.37-c, arrived at from the opposite direction.

**A test that counted the wrong thing.** `querySelectorAll("li")` returned 14 for 7 videos: once the
carousel appears its dots are list items too. Scoped to `[data-video-id]`. It had been passing only
because there had never been carousel chrome on the page.

**The stale poster was the documented `/_next/image` trap.** A replaced `public/` image served the
old bytes through the optimizer; `rm -rf .next/cache/images` fixed it. Worth knowing that this bites
on POSTERS specifically, because swapping a poster while keeping the filename is exactly the
workflow the rulebook encourages.

**Poster frames were chosen to avoid em dashes** where a clean caption existed, so every thumbnail
on the page reads cleanly even though the captions inside the films do not. Nikita's poster moved
from t=2 to t=8 for two reasons: the reframe puts her eyes above the play badge at that moment, and
the caption there is "I stay in Yelahanka, Bengaluru", which is local credibility on an India-first
product.

**Encoding, measured per file rather than assumed.** The reframe needed CRF 36 to fit the 4MB budget
(it is zoomed, so more detail per pixel); the five new films fit at CRF 32. The loop for
`a-father-speaks` and `a-mother-joins-in` needed 10fps at 480x854 to come under 400KB.

### 🧑 Two things for the founder

1. **Em dashes are burned into every new film's captions** ("one more — so that there is play away
   from the screen"). Founder decision 2026-09-19: **ship now, re-export later.** Recorded as a
   dated exception rather than an oversight, and queued in `Technical-Todo.md`.
2. **On a phone the montage is SECOND, not first.** "Central" is a three-up desktop idea; a phone
   shows one tile, so the same order puts `a-mother-joins-in` first and the montage next to it.
   With 60% of traffic on phones this is worth a deliberate look. Moving the montage to index 0
   would make it first on mobile and leftmost (not central) on desktop: the two cannot both hold,
   and the instruction named the centre.

Gates: tsc 0, eslint clean, `next build` 0, **1266 tests / 119 files**, `qa:sweep` clean 36/36 with
seven real videos and **zero `video-caption` violations**.

