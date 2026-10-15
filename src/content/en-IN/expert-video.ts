import type { FilmsSingleConfig, SingleFilm } from "@/components/sections/FilmsStrip/films-strip.types";

/**
 * The expert clip (task 8c.6; D061 items 12-13): 34 seconds of the founder's own expert video, cut to its general part
 * (screens and talk) before she speaks about herself or about Kheelu, hosted on this site like the films (poster first,
 * played on a tap) and shown on Home after "Kheelu asks. Your child thinks." (task Q2.9; until then on the product page,
 * right after the offer). The founder chose the CMO's cut, the credit
 * "Chaitra, therapist and developmental coach" (never "Dr." or "doctor" in our words, though her coat's badge shows it,
 * as it is), "a video from an expert", and a disclosure beside the clip, because she was paid or given a Kheelu. Her
 * written permission is on file with the founder. Nothing here names Kheelu: the fold never says Kheelu fills the gap she
 * describes. The full video is never linked or embedded.
 *
 * No words are burned into the file (task Q2.6; D064 item 8): the founder removed the captions and the burned disclosure
 * entirely, an accepted risk against the design system's caption rule (DS 08-accessibility), so the chip and the play
 * control give the clip's length only. The disclosure lives on the page, under the credit, visible before the tap. How the
 * file was made (the cut, the framing, the encoder): wiki/engineering/assets.md, the clip's row.
 */

/** The clip as the fold shows it: the files under public/video/expert, the chip, the play control's name, the credit
 *  and the disclosure, visible before the tap. */
export const expertClip = {
  video: "/video/expert/expert-clip.mp4",
  poster: {
    src: "/video/expert/expert-clip.jpg",
    width: 1280,
    height: 720,
    alt: "Chaitra, smiling, seated at a desk, with window blinds behind her.",
  },
  still: "/video/expert/expert-clip.webp",
  chip: "0:34",
  play: "Play the video from an expert: Chaitra, therapist and developmental coach. 34 seconds.",
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
