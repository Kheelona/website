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

**The settings that were measured rather than guessed** (2026-09-19, a 38s montage arriving at 41MB):

```
ffmpeg -y -i <source>.mp4 -c:v libx264 -crf 32 -preset veryslow \
  -profile:v high -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 80k public/video/moments/<id>.mp4
```

That produced **3.00MB from 41MB** with subtitles still crisp. Two things were checked and are worth
not re-deriving: **keep the native 1080x1920** — a 720x1280 encode at CRF 28 came out both *larger*
(2.69MB) and visibly softer on the caption text — and **compare the subtitle band, not the whole
frame**, because that is the first thing to fall apart and the only thing a viewer must be able to
read. `-movflags +faststart` matters: without it the moov atom sits at the end and playback waits
for the whole file.

If a clip will not fit 4MB, shorten it rather than raising the ceiling. The budget is set against a
parent on mobile data in India, not against a disk.

### 2. Export the poster

One still, **1080x1920**, `.jpg`. Pick a frame with a face in it, the plush visible, and a subtitle
that is a **short complete line** rather than a fragment.

*Corrected 2026-09-19, on the first real upload.* This step used to say "with the subtitles NOT
showing". On a montage of continuous dialogue **no such frame exists** — every frame sampled across
38 seconds carried a caption. Chasing one wastes time, and a mid-sentence fragment is the thing
actually worth avoiding, because that is what reads as a loading fault.

```
ffmpeg -y -ss <seconds> -i public/video/moments/<id>.mp4 -vframes 1 -q:v 3 \
  public/video/moments/<id>.jpg
```

### 3. Export the silent loop

Three seconds, **1080x1920**, animated `.webp`, **no audio track at all**. Only the tile currently
in the centre plays this, and it is what makes the row feel alive without putting a `<video>` on the
page.

Keep it under about 400KB. If it will not compress, drop the frame rate to 12fps before dropping
resolution. Real numbers: 36 frames at 540x960 lands around 300KB.

**`ffmpeg` on this machine has NO `libwebp` encoder**, so `-c:v libwebp` fails with
`Unknown encoder`. Go through frames and `img2webp` (from Homebrew's `webp`) instead:

```
ffmpeg -y -ss <start> -t 3 -i public/video/moments/<id>.mp4 \
  -vf "fps=12,scale=540:960" /tmp/frames/f_%03d.png
img2webp -loop 0 -lossy -q 55 -d 83 /tmp/frames/f_*.png \
  -o public/video/moments/<id>.webp
```

Verify it really is animated: `webpinfo <file>.webp` should say `Animation: 1` and
`Loop count : 0`. Note `ffprobe` reports `0,0` for an animated WebP and that is an ffprobe
limitation, not a broken file.

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

## What the section does at each count (§8.37-j)

The count picks a **treatment**, and nothing is ever hidden except nothing:

| Videos | What renders |
|---|---|
| 0 | The section does not render, and both pages omit the room. A heading above an empty shelf is worse than no heading. |
| 1 or 2 | A centred, static row. No arrows, no dots, no rotation, no silent loop. A lone film gets a wider tile so it reads as one film rather than a gap where two others should be. |
| 3 or more | The carousel. |

*This replaced a rule that hid the section below three videos. The first real upload is what showed
it was wrong: holding back real footage of real children because only one clip had arrived is a
worse answer than showing it well.*

**The lede follows the count too**, from `videoLede()` in `src/lib/video-moments.ts`, because "Press
play on any of them" over a single film is a plural promise. Do not hardcode that sentence on a page.

## Two things to check on the source export

- **A burned-in "sound on" badge.** Reels exported for Instagram or TikTok often carry a small grey
  speaker chip in a corner. Our player has native controls with its own volume, so that badge is a
  foreign UI element that does nothing when tapped. It is cosmetic, not blocking, but a clean
  re-export is better. *(The first upload has one.)*
- **A child's name spoken or captioned in the video.** A first name is acceptable under the label
  rule, and consent covers publication, but it is worth a deliberate look rather than a surprise
  after launch. *(The first upload contains one, in a caption.)*

## What never goes in

Stock footage. A frame of the launch film. A reconstruction with a colleague's child. Anything
without consent. The never-invent law is stricter about social proof than it is about copy, because
a fake parent is a lie about a person rather than about a product.
