import type { FilmsSingleConfig, SingleFilm } from "@/components/sections/FilmsStrip/films-strip.types";

/**
 * The expert clip (task 8c.6; D061 items 12-13): 34 seconds of the founder's own expert video, cut to its general part
 * (screens and talk) before she speaks about herself or about Kheelu, hosted on this site like the films (poster first,
 * played on a tap) and shown on the product page right after the offer. The founder chose the CMO's cut, the credit
 * "Chaitra, therapist and developmental coach" (never "Dr." or "doctor" in our words, though her coat's badge shows it,
 * as it is), "a video from an expert", and a disclosure beside the clip, because she was paid or given a Kheelu. Her
 * written permission is on file with the founder. Nothing here names Kheelu: the fold never says Kheelu fills the gap she
 * describes. The full video is never linked or embedded.
 *
 * The captions and the disclosure below are burned into the file (DS 08-accessibility, WCAG 1.2.2: the player ships no
 * caption track), so these are the words the file publishes, word for word as tasks.md 8c.6 gives them; each card shows
 * from `from` to `to`, in seconds of the clip, timed against its audio. How the file was made (the cut, the framing, the
 * caption style, the encoder): wiki/engineering/assets.md, the clip's row.
 */

/** A caption card burned into the clip: at most two lines, and when it shows (seconds of the clip). */
export interface BurnedCaption {
  readonly lines: readonly [string] | readonly [string, string];
  readonly from: number;
  readonly to: number;
}

/** The eleven caption cards, in order (stretch 1 is 0-24.5 s of the clip, stretch 2 from 24.5 s). */
export const expertCaptions = [
  { lines: ["Hey, have you ever noticed,", "in a room full of people,"], from: 0.15, to: 3.95 },
  { lines: ["children can be completely", "silent and isolated?"], from: 4.05, to: 7.6 },
  { lines: ["Not to the peaceful", "kind of silence,"], from: 7.8, to: 10.4 },
  { lines: ["but a heavy digital silence."], from: 10.55, to: 12.95 },
  { lines: ["You look around, and every child", "is looking into a glowing screen."], from: 13.15, to: 17.75 },
  { lines: ["They aren’t talking.", "They aren’t playing."], from: 17.85, to: 19.7 },
  { lines: ["They’re just consuming."], from: 19.7, to: 21.4 },
  { lines: ["I see this every single day", "in my practice."], from: 21.6, to: 24.45 },
  { lines: ["A child with a tablet", "isn’t busy."], from: 24.8, to: 27.7 },
  { lines: ["They’re often just alone", "in the digital world"], from: 27.8, to: 31.6 },
  { lines: ["that doesn’t talk back."], from: 31.75, to: 33.7 },
] as const satisfies readonly BurnedCaption[];

/** Burned into the first five seconds, so the file carries its disclosure wherever it travels without the page. */
export const expertBurnedDisclosure = {
  lines: ["Made with Kheelona.", "Chaitra was compensated."],
  from: 0,
  to: 5,
} as const satisfies BurnedCaption;

/** The clip as the fold shows it: the files under public/video/expert, the chip, the play control's name, the credit
 *  and the disclosure, visible before the tap. */
export const expertClip = {
  video: "/video/expert/expert-clip.mp4",
  poster: {
    src: "/video/expert/expert-clip.jpg",
    width: 1280,
    height: 720,
    alt: "Chaitra, smiling, seated in a white coat, with window blinds behind her.",
  },
  still: "/video/expert/expert-clip.webp",
  chip: "0:34 · With captions",
  play: "Play the video from an expert: Chaitra, therapist and developmental coach. 34 seconds, with captions.",
  name: "The video from an expert: Chaitra, therapist and developmental coach",
  credit: "Chaitra, therapist and developmental coach",
  disclosure: "Kheelona made this video with Chaitra and compensated her for it.",
} as const satisfies SingleFilm;

/** The product page's fold (`#expert`), right after the offer card and before the four steps. */
export const expertFold = {
  layout: "single",
  id: "expert",
  heading: { id: "expert-title", eyebrow: "A video from an expert", title: "Watching isn’t {hand:talking.}" },
  film: expertClip,
} as const satisfies FilmsSingleConfig;
