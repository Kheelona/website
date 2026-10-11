# Photo library

25 approved photos of the cast: five of each child, shot like a portrait-studio session. Each child keeps exactly the same face, while the room, outfit, light and moment change. All are AI-generated (Nano Banana Pro via ElevenLabs, October 2026) from the Cast portraits and the real Kheelu photo, then checked by hand. The full table (setting, outfit and best use for every photo) and the checks are in **The cast** under "Photo library".

Per child: three photos with Kheelu (a 4:5 home moment, a 16:9 wide scene with space for a headline, and a third shot) and two without (a play or learning scene, and a 1:1 portrait on a plain coloured wall).

Each photo comes in two files:

- `<child>-<nn>-<scene>.jpg`: the master at 2K (4:5 is 1856×2304, 16:9 is 2752×1536, 9:16 is 1536×2752, 1:1 is 2048×2048). Use it for decks, print and crops.
- `<child>-<nn>-<scene>-web.webp`: 1500px on the long edge, for the website, email and previews.

Rules:

- Settings are home, studio sweep or plain wall only. Never add outdoor photos to this group.
- Never mirror, lighten skin, smooth faces or change features.
- Never present these children as customers or put them next to a testimonial.
- Add a new photo only if it will be reused at least three times. Make it with **Making cast photos (step by step)**, which has the exact prompts, checks and export script, and log it in `tools/photo/library-log.json`.
