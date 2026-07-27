# Gemini kit — the pipeline art (Kheelu Speaker + AI books)

**For: Apoorva. Gate V3-c.** The Home pipeline room and /playos both show three bodies now:
Lumi (real photo), the **Kheelu Speaker**, and **AI books**. The two unbuilt ones currently
render a calm "In the workshop" mark, on purpose — a stand-in render that looked like a real
product would be a claim we have not earned. These prompts replace those marks.

Standing rule: **you generate, Claude ingests.** Run these in gemini.google.com, drop the
results in `~/Downloads`, and say "pipeline art is in".

## Reference images to attach

Attach these with every prompt so the new bodies inherit the family look:

| File | Why |
|---|---|
| `../../site/public/product/lumi-blue-2.png` | The house style anchor: real product photo, soft studio light, plain background, three-quarter view. |
| `../../site/public/mascot/mascot-hero-wink.png` | Kheelu's colour language (orange body, blue glasses) and the soft-shape feel. |
| `../../site/public/products/magic-box.png` | The hardware idiom already published: matte, rounded, no screen. |

## Prompt A — the Kheelu Speaker

```
A friendly smart speaker for a child's room, product photograph on a plain
white background, soft studio lighting, three-quarter view, centred, full
object in frame.

Form: a rounded matte-white body about the size of a small melon, with a warm
fabric grille across the front in a soft orange, and a single soft-glowing ring
of light near the top. Two small rounded ear shapes on top, echoing a friendly
animal without being a character. No screen anywhere. No visible buttons except
one large soft round button on top. A short blue accent line, matching the blue
of the attached mascot's glasses.

Feel: calm, sturdy, hug-adjacent, made for a 5 to 14 year old's desk. Not
gadgety, not glossy, no chrome, no sharp edges, no logos, no text.

Aspect ratio 3:4. Photorealistic product render. Plain background, no props, no
shadows on the backdrop.
```

Follow-up in the same chat: `Same object, same angle, at 4K.`

## Prompt B — the AI book

```
An open illustrated children's storybook, product photograph on a plain white
background, soft studio lighting, three-quarter view from slightly above,
centred, full object in frame.

The book lies open. Warm illustrated pages, no readable text, colours drawn from
the attached references: soft orange, sky blue, cream. Along the spine sits a
slim matte-white strip with a subtle fabric speaker grille, integrated into the
binding as if it belongs there. No screen, no buttons, no wires, no logos, no
legible words anywhere.

Feel: a real picture book that happens to be able to speak. Cloth-bound, thick
pages, made for small hands.

Aspect ratio 3:4. Photorealistic. Plain background, no props.
```

Follow-up: `Same book, same angle, at 4K.`

## Prompt C — optional, the learning-room illustration

Only if you would rather the Home learning room carried an illustration than the conversation
card it uses today. Say the word first; the card is doing its job.

```
A warm flat illustration in a children's brand style: a small child sitting
cross-legged on a rug, listening to a sky-blue plush toy that sits facing them.
Between them, three or four soft floating shapes suggest a story being told: a
tortoise, a hare, a question mark. Soft orange, sky blue, cream, warm off-white
background. No text, no letters, no numbers.

Flat vector illustration, generous negative space, no outlines around the
shapes, nothing photorealistic. Aspect ratio 4:3.
```

## Gates each render must pass before it ships

1. **No screen.** Anywhere. On any body. It is the whole promise.
2. **No text or logos** in the image (fake words read as a broken product).
3. **Plain background** so `tools/cutout` can lift it cleanly.
4. **Full object in frame**, nothing cropped at an edge.
5. Colours stay inside the four brand colours plus neutrals: `#EF762F`, `#F1A23B`,
   `#FFFFFF`, `#29A0D7`.
6. The Speaker must not read as a character with a face. Kheelu is the mascot; the Speaker is
   a product that carries his name.

## What Claude does with them

1. Cuts them out with `tools/cutout` (Swift + Apple Vision) so nothing ships with a baked
   background.
2. Drops the results into `site/public/products/` and points `site/src/lib/family.ts` at them
   (`img: null` → the real path), which lights up both the Home pipeline room and /playos.
3. Updates the alt text from "coming soon" to a real description.
