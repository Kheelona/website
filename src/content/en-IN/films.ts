import type { Film } from "@/content/types";

/**
 * The seven parent films (D040): real families, written parental consent held for every child,
 * subtitles burned in. Chips, captions, lengths and poster alt texts as the approved film strip
 * shows them (mockup home.html fold 2; the same on the product page and the store). Film 2's chip
 * and alt and film 6's caption are the founder's (home.md, "Founder answers after round 2"; D040).
 * Files stay at their live URLs under /video/moments/. How a page loads the posters (eager or
 * lazy) is the page's choice, not the film's (types.ts, Film).
 */

/** Every film is a 1080 x 1920 phone recording; the poster is its first frame. */
function film(id: string, chip: string, caption: string, duration: Film["duration"], alt: string): Film {
  return {
    id,
    chip,
    caption,
    duration,
    poster: { src: `/video/moments/${id}.jpg`, width: 1080, height: 1920, alt },
    video: `/video/moments/${id}.mp4`,
    hasOpenCaptions: true,
    consentOnFile: true,
  };
}

/** In the strip's order (the montage first, the parent film to its right on laptops). */
export const films = [
  film(
    "learning-by-asking",
    "Learning by asking",
    "Kheelu asks her to explain carrom, and thanks her for the reminder.",
    "0:30",
    "A young girl on a playmat holding the cream Kheelu plush.",
  ),
  film(
    "first-conversations",
    "Real families",
    "Children asking Kheelu their own questions, in their own languages.",
    "0:38",
    "Children talking to the cream Kheelu plush.",
  ),
  film(
    "a-parent-speaks",
    "In a parent’s words",
    "Nikita on what changed when the toy spoke back.",
    "0:46",
    "A parent speaking to camera at home.",
  ),
  film(
    "a-mother-joins-in",
    "A mother joins in",
    "Arha’s mother asks the questions, and Kheelu answers her by name.",
    "0:28",
    "A girl and her mother on a sofa with the cream Kheelu plush.",
  ),
  film(
    "counting-out-loud",
    "Counting out loud",
    "Three bricks and two more, worked out on the floor with Kheelu.",
    "0:31",
    "A boy on the floor with Lego bricks and the cream Kheelu plush.",
  ),
  film(
    "a-story-in-two-languages",
    "Two languages",
    "In AI mode, Arha switches to English, and Kheelu switches with her.",
    "0:31",
    "A girl on a sofa beside the cream Kheelu plush.",
  ),
  film(
    "a-father-speaks",
    "A father’s view",
    "Siddhant’s father on what play away from a screen looks like.",
    "0:30",
    "A father seated at home, speaking to camera.",
  ),
] as const satisfies readonly Film[];

/** The film strip's own labels. A play button reads "Play: {chip}. {caption}" (D040). */
export const filmsStrip = {
  listLabel: "Seven films of families with Kheelu",
  previous: "Previous video",
  next: "Next video",
  /** Read before each length by screen readers only. */
  length: "Length",
  play: "Play:",
  /** The position line's word: "1 of 7" on phones, "1–3 of 7" on laptops (mockup.js §4). */
  of: "of",
} as const;
