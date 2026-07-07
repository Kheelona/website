# Gemini handoff — 3 image fixes + 3 Veo shots

**STATUS 2026-07-07 night: founder generated IMAGE 1-3 and SHOT 1-2 (in ~/Downloads, pending ingest). SHOT 3 pending Gemini credit reset. Orbit download still open, optional.**

Everything you need is in this folder (`gemini-handoff/`). For each item: start a **new chat** in Gemini, attach the listed image(s), paste the prompt, wait, then use the follow-up line to get the 4K version (images only). Download everything to `~/Downloads` — Claude watches that folder and takes over from there.

**One quality rule for all images**: before downloading, check the hat — it must end in a **thin lavender ribbon that curls upward** (never a pom-pom ball, never a bare cone).

---

## IMAGE 1 — Green front (fixes the pom-pom)

**Attach BOTH**: `ref-green-front.png` + `ref-blue-front.png`

> The first photo shows the pastel green colorway of this plush toy (use it for the color). The second photo shows the blue colorway with the correct party hat (use it for the hat shape). Create a high-resolution studio product photograph of the GREEN toy, 100% faithful to the photos: pastel green body, cream oval belly, small black eyes, pink cheeks. The hat is exactly as in the blue photo: striped with dark blue at the base, then pink, then teal, then cream, ending in a thin soft lavender ribbon that curls upward. It must NOT be a pom-pom. Front view, toy fills the frame, centered. Pure white seamless studio background, soft even professional lighting, gentle natural contact shadow, crisp fabric texture in sharp focus. No text, no props, no people. Portrait orientation 3:4.

**Then follow up with**: "Perfect. Now render this exact same image again at 4K resolution, at least 2400 pixels tall. Change nothing." → download that one.

---

## IMAGE 2 — Right profile (fixes pink spikes + pink soles)

**Attach BOTH**: `ref-blue-right.png` + `ref-blue-back.png`

> The first photo shows this plush toy from its right side; the second shows its back. Create a high-resolution studio product photograph of the toy in RIGHT PROFILE view, 100% faithful. Along the spine it has five rounded pastel spikes in this exact order from top: peach, yellow, light blue, purple, green (see the back photo). The foot pads are the same pale blue as the body, never pink. The striped party hat ends in a thin soft lavender ribbon curling upward. Toy fills the frame, centered. Pure white seamless studio background, soft even lighting, gentle contact shadow, sharp fabric texture. No text, no props, no people. Portrait orientation 3:4.

**Then the same 4K follow-up** → download.

---

## IMAGE 3 — Left profile (fixes the pom-pom + spike colors)

**Attach BOTH**: `ref-blue-left.png` + `ref-blue-back.png`

> The first photo shows this plush toy angled to its left side; the second shows its back. Create a high-resolution studio product photograph of the toy in LEFT PROFILE view, 100% faithful. Along the spine it has five rounded pastel spikes in this exact order from top: peach, yellow, light blue, purple, green (see the back photo). The foot pads are the same pale blue as the body. The striped party hat ends in a thin soft lavender ribbon curling upward, never a pom-pom. Toy fills the frame, centered. Pure white seamless studio background, soft even lighting, gentle contact shadow, sharp fabric texture. No text, no props, no people. Portrait orientation 3:4.

**Then the same 4K follow-up** → download.

---

## VIDEO — three 8s Veo 3 shots for the "Two friends" film

These three clips become the new launch film: Claude stitches them in Remotion, adds the on-screen copy and the orange end card, so the clips themselves must have **no text**. Generate each in a new chat with the seed image attached. If a result has warped faces or melted limbs, regenerate once before moving on.

### SHOT 1 — Hello (attach `seed-1-hello.png`)

> Animate this exact scene into an 8 second video. The orange deer mascot waves hello and does one happy little hop; the blue plush toy responds with a gentle bounce and tilts toward him, as if saying hi back. The camera pushes in very slowly. Both characters keep their exact appearance, colors and proportions from the image. Soft, playful children's film feel, smooth gentle motion, warm light. No text, no captions, no new characters, no new objects.

### SHOT 2 — Play (attach `seed-2-play.png`)

> Animate this exact scene into an 8 second video. The orange deer mascot and the blue plush toy bounce joyfully together on the soft white mat, taking turns, like two best friends playing. The mascot claps once with delight. The camera makes a slow, subtle arc around them. Both characters keep their exact appearance, colors and proportions from the image. Bright, happy children's film feel, bouncy but smooth motion. No text, no captions, no new characters, no new objects.

### SHOT 3 — Cuddle (attach `seed-3-cuddle.png`)

> Animate this exact scene into an 8 second video. The orange deer mascot slowly leans his head against the blue plush toy; both settle into a calm, cozy cuddle with a soft breathing motion. The camera zooms in very slowly and gently. Warm, quiet, end-of-day feel, like the last scene of a bedtime story. Both characters keep their exact appearance from the image. No text, no captions, no new characters, no new objects.

---

## Also, if easy: the orbit video from earlier
The chat "Plush Toy Orbit Video Generation" already has a finished 8s orbit of Lumi — just hit its download button. It upgrades the V3 film as a bonus.

## When you're done
Everything sits in `~/Downloads`. Tell Claude "files are in" — the pipeline (fidelity check → cutout → site/film integration) runs from there.
