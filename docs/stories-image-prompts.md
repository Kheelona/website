# Journal hero images — remaining prompts

7 of 14 articles have hero images (generated with Gemini, 2026-07-06, style locked below).
These are the ready-to-paste prompts for the other 7. Generate in Gemini (or any image
model), download the PNG, then run the conversion step at the bottom.

## Locked style (keep every image consistent)

Every prompt starts with the same frame and ends with the same constraints:

> Create a 16:9 image, warm soft 3D illustration style like a modern animated film: **[SCENE]**, warm cream and soft orange palette with gentle blue accents, absolutely no text or words in the image.

Indian families, homes, and streets. Golden lamp light or dusk light. Cozy, hopeful mood.
Never show the Lumi product or the mascot in these (journal images stay product-free).

## Prompts by article slug

### what-to-look-for-in-a-safe-ai-toy
Create a 16:9 image, warm soft 3D illustration style like a modern animated film: an Indian mother sitting on a sofa at night reading a small toy's box and leaflet carefully with a warm reading lamp beside her, her child asleep on her shoulder, thoughtful protective mood, warm cream and soft orange palette with gentle blue accents, absolutely no text or words in the image.

### talking-late-or-talking-little
Create a 16:9 image, warm soft 3D illustration style like a modern animated film: an Indian father kneeling to eye level with his quiet 3 year old in a doorway, listening with full patient attention as the child shyly holds up a toy car to show him, soft morning light, tender unhurried mood, warm cream and soft orange palette with gentle blue accents, absolutely no text or words in the image.

### what-actually-builds-a-sharp-brain
Create a 16:9 image, warm soft 3D illustration style like a modern animated film: a 5 year old Indian child crouched on a balcony watching a line of ants with total concentration while her mother watches her from the doorway smiling, potted plants and evening light, curious absorbed mood, warm cream and soft orange palette with gentle blue accents, absolutely no text or words in the image.

### how-children-collect-words
Create a 16:9 image, warm soft 3D illustration style like a modern animated film: an Indian vegetable market scene where a 4 year old child sits in the front of the shopping bag trolley pointing excitedly at bright vegetables while the vendor and mother laugh mid-conversation, string lights, lively warm mood, warm cream and soft orange palette with gentle blue accents, absolutely no text or words in the image.

### raising-a-bilingual-child-in-india
Create a 16:9 image, warm soft 3D illustration style like a modern animated film: three generations of an Indian family on a veranda swing in the evening, grandmother mid-story with expressive hands, a 4 year old child wide-eyed on her lap, parents listening behind, jasmine plants and warm bulb light, storytelling mood, warm cream and soft orange palette with gentle blue accents, absolutely no text or words in the image.

### should-kids-use-ai
Create a 16:9 image, warm soft 3D illustration style like a modern animated film: an Indian mother and father at their kitchen table late at night having a quiet serious conversation, a small unopened gift box between them, tea cups, one warm pendant lamp, thoughtful deciding mood, warm cream and soft orange palette with gentle blue accents, absolutely no text or words in the image.

### busy-hands-no-screens
Create a 16:9 image, warm soft 3D illustration style like a modern animated film: an Indian kitchen where a 4 year old stands on a stool beside her grandmother rolling small lumpy rotis with flour on her nose and cheeks, both laughing, steel plates and warm afternoon light, joyful hands-busy mood, warm cream and soft orange palette with gentle blue accents, absolutely no text or words in the image.

## After generating: conversion + wiring

1. Download the PNG, then convert (from repo root):
   ```bash
   sips -Z 1440 -s format jpeg -s formatOptions 78 <downloaded>.png \
     --out public/stories/<slug>.jpg
   ```
2. In `src/lib/stories.ts` or `src/lib/stories-expansion.ts`, add to the article:
   ```ts
   hero: "/stories/<slug>.jpg",
   heroAlt: "<one plain sentence describing the scene>",
   ```
3. `npm run build` — the article page and its JSON-LD pick the image up automatically.

## Gemini web UI notes (if driving it manually)

- The composer's Return key does not submit; click the arrow button.
- Batch up to 3 scenes per prompt ("Create three separate images...") — they generate sequentially.
- Hover a generated image for its download icon (top right of the image).
