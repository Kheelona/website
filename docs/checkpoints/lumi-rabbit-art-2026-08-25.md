# Checkpoint: Lumi becomes the rabbit (2026-08-25)

The product changed. The blue dino plush (striped party hat, belly speaker) is now a **cream rabbit**
(long floppy ears with pastel rainbow inner fur, rainbow foot pads, grey heart nose, glowing belly
speaker, **no hat**). One colourway, where the site shipped three.

| | |
|---|---|
| Branch | `lumi-rabbit`, commit `9f80a8b` |
| Rollback tag | `pre-lumi-rabbit-2026-08-25`, cut BEFORE the merge |
| Status | **Merged and live** once the two held copy lines are approved |
| Source asset | founder-supplied `Lumi(new).png`, 1122×1402 RGBA |

---

## 1. Why a rename was not enough

The founder's instinct was to rename the old file and drop the new one in its place, and for **8 of
the 10 references that would have worked**. It broke on four things:

1. **The hero was a baked composite.** `public/hero/kheelu-lumi.png` held Kheelu *and* the old Lumi
   in one render.
2. **Three colourways, one product.**
3. **The filename and all ten alt strings said "blue"** (and six said "party hat").
4. **The supplied PNG needed re-matting** before it could ship.

## 2. The central fix, which is the part worth keeping

The same asset was described **independently at ten call sites**: a hard-coded `src`, a hard-coded
`width`/`height` pair, and a differently-worded `alt` at each. That is the whole reason "change the
plush" was a ten-file job with ten chances to leave one behind.

Lumi is a **rotating SKU by brand law** — its look is *expected* to change again. So the art now gets
the treatment prices, CTA labels and ages already have: **`src/lib/lumi-art.ts`**, exporting
`LUMI_ART` (path, real pixel dimensions, the one description) and `lumiAlt()` for contextual
variants. **The next plush change is that file plus a PNG.**

## 3. The asset, and the cutout tool we did NOT use

The supplied file's background was gone, but the matte was soft everywhere: the body sat at
**alpha 251–254 rather than 255**, with a faint white haze reaching the frame edge. Of the α 1–15
pixels sampled, **6379 were far from the silhouette against 3521 near it** — frame haze, not subject.

Cleaned by thresholding to the house profile (α ≥ 250 → 255, α < 16 → 0, the 16–249 anti-aliased edge
kept) and **proven by compositing over black and looking**, because `sips -g hasAlpha` is not proof —
`logo-mark.png` once reported alpha while carrying a baked white plate.

**`tools/cutout` was deliberately not run, and this is the finding worth carrying forward.** Its
neutral-halo pass erases any pixel with `8 ≤ α < 240` where `min(rgb) > 170 && max-min < 24`. Cream
fur measures **(236,225,213): min 213, spread 23**. That rule would have eaten this plush's own edge.
It was written for a *blue* product. **A cutout heuristic tuned to one product colour is not safe on
the next one.**

## 4. The hero, and the flag that travels with it

Extraction from the composite was tried and rejected: **Kheelu's glasses are blue and the dino's
belly panel and hat are cream**, so there is no colour seam, and no clean vertical seam either. The
hero therefore shows **Lumi alone**, with `gemini-handoff/hero-2026-08/` prepared for the founder to
regenerate the whisper composite (Gemini goes through the founder, never Claude).

**`data-hero-has-kheelu` came off with it.** `KheeluGuide` reads that attribute to suppress the
corner guide while the hero is on screen, because two Kheelus in one viewport was the craft flaw V5-5
fixed. With Kheelu out of the artwork the guide greets normally again — verified visually, he now
appears in the corner on Home. `HeroStage.test.tsx` **asserts its absence**, so restoring the
composite without restoring the flag turns the suite red. That is the reminder, and it is written
into the handoff README as well.

The mobile height moved **350px → 400px**. The rabbit's silhouette is narrower than the composite it
replaced (0.82 against 0.93), so the old height would have shrunk the rendered area by 12.5% and put
the LCP back in play — the exact regression that cost two live rounds (R11).

## 5. Gates

886 tests, tsc 0, build 0, token-check 16 mappings, eslint **identical to main** (37 problems),
`qa:sweep` **34/34 clean with 79 accepted — identical to the live baseline captured before any edit**.

Lighthouse, mobile, devtools throttling: home **99**, lumi **98**, a11y **96** (`color-contrast`
only, the accepted §8.29 pair), **LCP 2.0s, CLS 0**.

**The LCP was observed, not inferred.** A `PerformanceObserver` run reports the priority Lumi image as
the LCP element on both hero routes, as the only entry, at **3.1× the H1's area**. Area alone would
have been a proxy; the observer is the fact.

Best-practices reads 96 locally from three **localhost-only** console errors — Vercel Analytics has
no local runtime so its script 404s, the MIME error follows from that, and `upgrade-insecure-requests`
is ignored over plain HTTP. Confirm 100 on production after deploy rather than assuming it.

## 6. The test-count arithmetic, stated so it is not a mystery later

878 → 886. **+8** `test/lumi-art.test.ts`, **+2** HeroStage, **−1** ColorwayPicker (three colourways
became one), **−1** `test/redirects-vs-assets.test.ts`, whose `it.each` enumerates directories under
`public/` — and `public/hero/` went away with the retired composite.

## 7. Three things worth carrying forward

**A guard test must be scoped to the claim, not to the words.** `lumi-art.test.ts` first flagged
three innocent lines because it searched for "sky blue" — and **"Why is the sky blue?" is the child's
question and one of the site's best copy lines**. A guard that cries wolf on the product's strongest
writing gets deleted, not obeyed. It is now scoped to *a plush described as* sky blue.

**It was also proven red before it was trusted** (§8.28-g): putting the retired path and the retired
alt back turned exactly the two intended assertions red, and restoring turned them green.

**The repo had no test that an image referenced by code exists, or that a `width`/`height` pair
matched the file.** That gap is how `og.png` shipped a retired age band on every social share through
three copy rounds — *pixels carry claims, and the voice lint cannot read them*. `lumi-art.test.ts`
now reads the PNG IHDR and asserts both.

## 8. Not done, deliberately

- **`og.png`** — checked: **Kheelu only, no product**. Needed no change.
- **`launch.mp4` / `launch-poster.jpg`** — show the **v1** plush and were *already* stale;
  `LAUNCH_VIDEO` (`seo.ts`) is imported by nothing but its own test, so the film is not on the live
  site. A separate Remotion job.
- **`public/models/lumi-plush.glb`** and `LumiInset`'s blue rim light — dormant (`StageGate`
  unmounted). Same treatment the v3 migration gave the off-model Kheelu GLB: flagged, and any journey
  revival is gated on a re-run.
- **`lori.png` / `lua.png` / `robu.png`** — kheelona.ai parity, law at `family.ts:3-5`. Untouched.
