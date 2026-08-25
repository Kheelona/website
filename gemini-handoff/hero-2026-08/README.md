# Gemini handoff — HERO ART, rebuilt for the rabbit Lumi

**STATUS 2026-08-25: WAITING ON FOUNDER.** One image (plus its 4K follow-up). This becomes the Home
hero again. Download the result to `~/Downloads` and tell Claude "hero art is in".

## Why this exists

The plush changed from the blue dino to the cream rabbit. The hero artwork that stood at
`public/hero/kheelu-lumi.png` was a **single baked render with Kheelu AND the old Lumi in one PNG**,
so no file swap could replace half of it. Extraction was tried and rejected: Kheelu's glasses are
blue and the dino's belly panel and hat are cream, so there is no colour seam and no vertical seam to
cut on.

**Until this lands, the Home hero shows the new Lumi ALONE.** That is deliberate and shipped, not
broken. It is better than a home page advertising a product that will not arrive.

Files in this folder:
- `sample-composition.png` — the composition we are matching (the previous hero, blue dino)
- `ref-kheelu-main.png` — canonical Kheelu, identity reference, UNCHANGED
- `ref-lumi-rabbit.png` — the new Lumi, identity reference (the exact cutout the site ships)

## THE IMAGE — "The whisper", rabbit edition (attach ALL THREE files above)

Start a new Gemini chat, attach all three images, paste:

> The first image is the composition I want to recreate. The second image shows the orange deer
> mascot character exactly as he must look. The third image shows the plush toy product exactly as
> it must look. Recreate the first image's scene at the highest quality, but replace the blue plush
> toy with the plush toy from the third image: the orange deer mascot kneels on one knee beside the
> plush rabbit and whispers to it behind his cupped hand, one eye winking, mouth open in a delighted
> smile. The plush rabbit sits front-facing, tilted very slightly toward him, listening. The mascot
> is 100% faithful to the second image: orange-red fur, cream antlers, messy fur tuft between them,
> round teal-blue glasses, orange t-shirt, khaki cargo shorts, brown and cream sneakers, fluffy
> tail. The plush rabbit is 100% faithful to the third image: soft cream and ivory fur, two long
> floppy ears lying down along its sides with pastel rainbow inner fur, a small grey heart-shaped
> nose, small black eyes, a round cream speaker panel on its belly with a soft pale blue glowing
> ring and a row of small control buttons below it, and two large oval foot pads in the same pastel
> rainbow fur. The rabbit wears NO hat and NO clothing. Pixar-quality 3D render, soft even studio
> lighting, gentle natural contact shadows, pure white seamless background. No text anywhere. No
> props, no people, no extra characters. Square format 1:1.

**Then follow up with**: "Perfect. Now render this exact same image again at 4K resolution, at least
2400 pixels on each side. Change nothing." → download that one.

## Quality gates — check BEFORE downloading

1. **One face each** — no double faces, no melted paws.
2. **Kheelu on-model**: round TEAL-BLUE glasses (never orange), cream antlers, orange tee, khaki
   cargo shorts, brown/cream sneakers. Wink + hand-cupped whisper as in the sample.
3. **Lumi = the real product.** The belly speaker panel with its button row must be present and
   clean. **The ears are the identity of this product** — two long floppy ears lying DOWN along the
   body, not standing up, with the pastel rainbow inner fur clearly visible on both.
4. **NO party hat.** The old plush wore one; this one does not. If a hat appears, regenerate.
5. **Both foot pads rainbow**, matching the ears.
6. Background pure white edge to edge (it gets cut out for the site), soft contact shadow only.
7. Nothing else in frame: no text, no captions, no floor line, no toys.

## What happens after

Claude ingests from `~/Downloads`: fidelity check against the two identity refs → background removal
→ the cutout becomes `public/hero/kheelu-lumi.png`.

**Then three code steps, which are the easy half to forget:**
1. Point `HeroStage.tsx`'s image back at `/hero/kheelu-lumi.png` (it currently reads `LUMI_ART`).
2. **Restore `data-hero-has-kheelu`** on the wrapper. `KheeluGuide` reads it to suppress the corner
   guide, because two Kheelus in one viewport was the craft flaw V5-5 fixed. It is absent today
   precisely because Kheelu is absent from the hero. `HeroStage.test.tsx` asserts the current state
   and will go red, which is the reminder.
3. **Re-measure the LCP.** The composite is a wider silhouette than the rabbit alone, so the
   `h-[400px]` mobile height was tuned for the rabbit and must be re-checked, not inherited.

**Cutout caution, learned on this asset:** do NOT run `tools/cutout` blindly on cream fur. Its
neutral-halo pass erases pixels where `min(rgb) > 170` and `max-min < 24`; cream fur measures
(236,225,213) — min 213, spread 23 — so the rule eats the plush's own edge. That rule was written
for a blue product. Use `keycut`, or threshold the alpha directly, and always verify by compositing
over a dark plate.
