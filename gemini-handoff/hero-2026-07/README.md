# Gemini handoff — HERO ART for the revamp (Kheelu talking to Lumi)

**STATUS 2026-07-24: WAITING ON FOUNDER.** One image (plus its 4K follow-up). This becomes the
Home hero of the revamped site, so it is worth a couple of regeneration passes to get right.
Download the result to `~/Downloads` and tell Claude "hero art is in".

Files in this folder:
- `sample-hero-whisper.png` — your own sample from the brief (the composition we are matching)
- `ref-kheelu-main.png` — canonical Kheelu (identity reference)
- `ref-lumi-blue-product.jpeg` — the real Lumi Blue product render (identity reference)

## THE IMAGE — "The whisper" (attach ALL THREE files above)

Start a new Gemini chat, attach all three images, paste:

> The first image is a rough sample of the scene I want. The second image shows the orange deer
> mascot character exactly as he must look. The third image shows the blue plush toy product
> exactly as it must look. Recreate the sample scene at the highest quality: the orange deer
> mascot kneels on one knee beside the blue plush toy and whispers to it behind his hand, one
> eye winking, mouth open in a delighted smile. The plush toy sits front-facing, tilted very
> slightly toward him, listening. The mascot is 100% faithful to the second image: orange-red
> fur, cream antlers, messy fur tuft between them, round teal-blue glasses, orange t-shirt,
> khaki cargo shorts, brown and cream sneakers, fluffy tail. The plush toy is 100% faithful to
> the third image: sky blue body, cream oval belly with the round white speaker panel, the small
> orange logo pill on the speaker, the row of small control buttons, soft purple ring around the
> panel, small black eyes, pink cheeks, pale blue paws, and the striped pastel party hat exactly
> as in the third image. Pixar-quality 3D render, soft even studio lighting, gentle natural
> contact shadows, pure white seamless background. No text anywhere except the tiny logo on the
> speaker. No props, no people, no extra characters. Square format 1:1.

**Then follow up with**: "Perfect. Now render this exact same image again at 4K resolution, at
least 2400 pixels on each side. Change nothing." → download that one.

## Quality gates — check BEFORE downloading

1. **One face each** — no double faces, no melted paws, five spikes maximum along any spine.
2. **Kheelu on-model**: round TEAL-BLUE glasses (never orange), cream antlers, orange tee,
   khaki cargo shorts, brown/cream sneakers. Wink + hand-cupped whisper as in the sample.
3. **Lumi = the real product**: belly speaker panel with button row present and clean. The tiny
   logo on the speaker must read "Kheelona" or be too small to read — if it shows garbled
   letters, regenerate or ask Gemini to "make the speaker logo clean and unreadable, everything
   else unchanged".
4. **Hat follows the product render** (pastel stripes, small ribbon tip as in
   `ref-lumi-blue-product.jpeg`) — not the old lavender curling ribbon.
5. Background pure white edge to edge (it gets cut out for the site), soft contact shadow only.
6. Nothing else in frame: no text, no captions, no floor line, no toys.

## What happens after

Claude ingests from `~/Downloads`: fidelity check against the two identity refs → background
removal via `tools/cutout` → the cutout becomes `public/hero/kheelu-lumi.png`, the Home
hero image, with the interactive speech bubbles built around it in code (they are HTML, not
part of the image). Until then the site preview uses an interim composed placeholder, so
nothing blocks the build.
