# Adding a video to the website

**The rulebook. Follow it every time, in this order.** Laws: `docs/website-steps.md` §8.37.
The half of this a machine can check is enforced by `test/video-assets.test.ts`, and that test
parses this file, so the numbers here and the numbers in the code cannot drift apart.

Written 2026-09-19, when the video carousel shipped with an empty library.

---

## Before anything else: two gates

**1. Written parental consent, in hand, for every child who appears.** Not implied, not verbal, not
"they said it was fine on WhatsApp". The signed document stays with the founder and never enters
this repo. The row you add later asserts `consentOnFile: true`, and that assertion is the only
record the code has. **If consent is missing, stop here.**

**2. The repository is PUBLIC.** Until that changes, anything you commit can be cloned and
downloaded by anyone, and git history keeps it even after a delete. This matters more for footage of
children than for anything else this repo has ever held. If the repo has been made private, delete
this paragraph and say so in the checkpoint.

---

## The checklist

### 1. Export the video

| Setting | Value |
|---|---|
| Orientation | Vertical |
| Resolution | **1080x1920** (9:16) |
| Codec | H.264 (`.mp4`), AAC audio |
| Length | About 20 to 30 seconds |
| File size | **4MB** maximum |
| Subtitles | **Burned into the frame** |

**The subtitles are not optional and they are not a style choice.** They are how this site meets
WCAG 1.2.2, because the player ships no caption track. A video without them on screen is an
accessibility regression that no test can see, which is exactly why it is first on this list.

Roughly 30 seconds of 1080x1920 H.264 fits 4MB at about 1100kbps. If it does not fit, shorten it
rather than raising the bitrate ceiling: the budget is set against a parent on mobile data in India,
not against a disk.

### 2. Export the poster

One still, **1080x1920**, `.jpg`. Pick a frame with a face in it and with the subtitles NOT showing,
because this is what a visitor sees before pressing play and a frozen half-sentence reads as a
loading fault.

### 3. Export the silent loop

Three seconds, **1080x1920**, animated `.webp`, **no audio track at all**. Only the tile currently
in the centre plays this, and it is what makes the row feel alive without putting a `<video>` on the
page.

Keep it under about 400KB. If it will not compress, drop the frame rate to 12fps before dropping
resolution.

**This one is optional.** A row with no `preview` simply stays still, which is a fine way to publish
a video today and add its loop later.

### 4. Name the three files

All three share one basename, which is also the row's `id`, in lowercase kebab-case:

```
public/video/moments/<id>.mp4
public/video/moments/<id>.jpg
public/video/moments/<id>.webp
```

Name it after what happens, not after the file it came off a phone as: `aarav-asks-why`, never
`IMG_4417` or `final_v3_FINAL`.

### 5. Add the row

In `src/lib/video-moments.ts`, appended to `VIDEO_MOMENTS`:

```ts
{
  id: "aarav-asks-why",
  chip: "A parent in Pune",
  label: "He is three, and he has found the question Kheelu answers.",
  alt: "A boy sitting on a rug holding the cream Kheelu plush.",
  src: `${VIDEO_DIR}/aarav-asks-why.mp4`,
  poster: `${VIDEO_DIR}/aarav-asks-why.jpg`,
  preview: `${VIDEO_DIR}/aarav-asks-why.webp`,
  width: VIDEO_ASPECT.width,
  height: VIDEO_ASPECT.height,
  hasOpenCaptions: true,
  consentOnFile: true,
}
```

**Writing the three strings.**

- `chip` is who this is, in kicker style. "A parent in Pune", "Sent in by a family". Never a full
  name, and never a child's name: a first name in the label is fine, a full name is not.
- `label` says what the moment IS, in the site's voice. **It is not a transcript** — the speech is
  already on screen. Second person or plain statement, no hype, no dash characters.
- `alt` describes the SCENE for someone who cannot see it, never the speech. "A boy on a rug holding
  the cream Kheelu plush", not "Aarav asking Kheelu why the sky is blue".

### 6. Check the count

The library caps at **12 videos**, about 48MB. Past that the honest answer is a CDN rather than a
larger number in `VIDEO_MAX_COUNT`, and that is a conversation, not an edit.

### 7. Run the gates

```
npm test                      # test/video-assets.test.ts checks steps 1, 4, 5 and 6
npx tsc --noEmit              # a row missing either assertion fails here
npx next build
SWEEP_STORE=http://store.localhost:3456 npm run qa:sweep     # must stay clean
```

`qa:sweep` is the one that matters most. If it ever reports a `video-caption` violation, a `<video>`
element has got onto the page at rest and the carousel's whole accessibility position has broken.
Fix that before shipping; do not add it to the sweep's accepted list.

### 8. Commit by name

**Never `git add -A` in this repo.** Stage the three asset files and the data file by name, and read
`git status --short` before committing, accounting for every `??` line.

---

## What the section does with fewer than three videos

Nothing. `VideoMoments` renders `null`, and both pages leave the whole room out. This is deliberate:
a heading that announces real families above an empty shelf is worse than no heading. So videos can
land one at a time and the section appears on its own when the third arrives.

## What never goes in

Stock footage. A frame of the launch film. A reconstruction with a colleague's child. Anything
without consent. The never-invent law is stricter about social proof than it is about copy, because
a fake parent is a lie about a person rather than about a product.
