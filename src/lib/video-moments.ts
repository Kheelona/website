/** Real families on film: the ONE source for the video carousel (§8.37).
 *
 *  WHY THIS EXISTS. Until now the only social proof on this site was four
 *  testimonial quotes that are still drafted placeholders on named people
 *  (closed-rounds.md: the founder's standing decision is to keep them). A
 *  parent deciding whether a talking toy works with a real three year old
 *  cannot learn that from prose. Footage of a real child asking Kheelu a real
 *  question is the only thing on this site that answers it.
 *
 *  AN EMPTY LIST RENDERS NOTHING, AND THAT IS CORRECT. `VideoMoments` returns
 *  null when this array is empty and both pages omit the section entirely, so
 *  an empty library costs a visitor nothing and shows them no placeholder.
 *  One or two videos render as a centred static row rather than a carousel
 *  (§8.37-j); three or more earn the carousel chrome. Never seed this with stock footage,
 *  a demo clip, or a frame of the launch film to "show the design" — the
 *  never-invent law covers social proof more strictly than it covers copy,
 *  because a fake parent is a lie about a person rather than about a product.
 *
 *  ADDING ONE IS A CHECKLIST, NOT A GUESS: `docs/video-conventions.md` is the
 *  rulebook and `test/video-assets.test.ts` enforces the half of it a machine
 *  can check. Read the doc before adding a row.
 *
 *  TWO PROMISES ARE MADE PER ROW, IN THE TYPE, and that is the point of this
 *  file. `hasOpenCaptions` and `consentOnFile` are literal `true` rather than
 *  booleans, so a row that omits either one fails to compile. They are the two
 *  things this section rests on and the two things that would be quietest to
 *  forget at speed:
 *
 *    - OPEN CAPTIONS. Every file carries its subtitles burned into the frame
 *      (founder, 2026-09-19). That satisfies WCAG 1.2.2 on its own. It has to
 *      be true of the FILE, because nothing in this repo can verify it and
 *      nothing in the markup re-states it: axe cannot read a caption that is
 *      painted into the video, which is also why there is no `<video>` on the
 *      page at rest. See §8.37-b.
 *    - CONSENT. Written parental consent is held for every child who appears
 *      (founder, 2026-09-19). A row asserts it; the signed document lives with
 *      the founder, never in this repo. */
export type VideoMoment = {
  /** Also the asset basename: `<id>.mp4`, `<id>.jpg`, `<id>.webp`. */
  id: string;
  /** Kicker chip above the tile. Who this is, in kicker style. */
  chip: string;
  /** The visible line under the tile. NOT a transcript: the speech is already
   *  burned into the frame, so this says what the moment IS, in the site's
   *  voice, for someone scanning the row without pressing play. */
  label: string;
  /** Alt text for the still. Describes the SCENE, never the speech. */
  alt: string;
  /** The video, under /public. */
  src: string;
  /** The still, under /public. Shown at rest and under reduced motion. */
  poster: string;
  /** A silent animated loop, under /public. Played only by whichever tile is
   *  currently centred. Optional: a row without one simply stays still, which
   *  is a graceful way to add a video before its loop has been exported. */
  preview?: string;
  /** Real pixels. Declared so the tile reserves its box and nothing shifts. */
  width: number;
  height: number;
  /** Subtitles are burned into the file. See the header. */
  hasOpenCaptions: true;
  /** Written parental consent is held. See the header. */
  consentOnFile: true;
};

/** Vertical, because the footage is shot on phones and 60% of this site's
 *  traffic is a phone (founder, 2026-09-19). The tile reserves this ratio
 *  before any image loads. */
export const VIDEO_ASPECT = { width: 1080, height: 1920 } as const;

/** The per-file ceiling the rulebook sets, in bytes. Four megabytes is about
 *  twenty-five seconds of 1080x1920 H.264 at a sane bitrate, and it is chosen
 *  against a parent on mobile data rather than against a disk. */
export const VIDEO_MAX_BYTES = 4 * 1024 * 1024;

/** The library ceiling. Past this the honest answer is a CDN rather than a
 *  bigger number here: these files live in a git repo forever and in every
 *  clone, so the cost is permanent and shared. */
export const VIDEO_MAX_COUNT = 12;

/** Where every asset lives. One directory, so the rulebook has one answer. */
export const VIDEO_DIR = "/video/moments";

/** EMPTY UNTIL THE FOUNDER SUPPLIES FILES. See the header before adding a row.
 *
 *  The shape a row takes, for whoever adds the first one:
 *
 *    {
 *      id: "aarav-asks-why",
 *      chip: "A parent in Pune",
 *      label: "Aarav is three, and he has found the question Kheelu answers.",
 *      alt: "A boy sitting on a rug holding the cream Kheelu plush.",
 *      src: `${VIDEO_DIR}/aarav-asks-why.mp4`,
 *      poster: `${VIDEO_DIR}/aarav-asks-why.jpg`,
 *      preview: `${VIDEO_DIR}/aarav-asks-why.webp`,
 *      width: VIDEO_ASPECT.width,
 *      height: VIDEO_ASPECT.height,
 *      hasOpenCaptions: true,
 *      consentOnFile: true,
 *    } */
export const VIDEO_MOMENTS: readonly VideoMoment[] = [
  {
    id: "a-mother-joins-in",
    chip: "A mother joins in",
    label:
      "Arha's mother asks the questions, and Kheelu answers her by name.",
    alt: "A girl and her mother on a sofa with the cream Kheelu plush.",
    src: `${VIDEO_DIR}/a-mother-joins-in.mp4`,
    poster: `${VIDEO_DIR}/a-mother-joins-in.jpg`,
    preview: `${VIDEO_DIR}/a-mother-joins-in.webp`,
    width: VIDEO_ASPECT.width,
    height: VIDEO_ASPECT.height,
    hasOpenCaptions: true,
    consentOnFile: true,
  },
  /* ── THE CENTRE SLOT. Index 1 is the middle tile of the three visible at
     rest on a desktop, and the founder's instruction (2026-09-19) is that the
     montage is the central video. Appending rows is safe; INSERTING one above
     this line silently moves it out of the centre, so a test pins the index.
     The parent testimonial sits directly to its right, also by instruction. ── */
  {
    id: "first-conversations",
    chip: "Real homes",
    label:
      "Children asking Kheelu their own questions, in their own languages.",
    alt: "Children at home, talking to the cream Kheelu plush.",
    src: `${VIDEO_DIR}/first-conversations.mp4`,
    poster: `${VIDEO_DIR}/first-conversations.jpg`,
    preview: `${VIDEO_DIR}/first-conversations.webp`,
    width: VIDEO_ASPECT.width,
    height: VIDEO_ASPECT.height,
    hasOpenCaptions: true,
    consentOnFile: true,
  },
  {
    id: "a-parent-speaks",
    chip: "In a parent's words",
    label: "Nikita on what changed when the toy spoke back.",
    alt: "A parent speaking to camera at home.",
    src: `${VIDEO_DIR}/a-parent-speaks.mp4`,
    poster: `${VIDEO_DIR}/a-parent-speaks.jpg`,
    preview: `${VIDEO_DIR}/a-parent-speaks.webp`,
    width: VIDEO_ASPECT.width,
    height: VIDEO_ASPECT.height,
    hasOpenCaptions: true,
    consentOnFile: true,
  },
  {
    id: "a-story-in-two-languages",
    chip: "Two languages",
    label:
      "Arha would rather speak English today, so the story follows her.",
    alt: "A girl on a sofa beside the cream Kheelu plush.",
    src: `${VIDEO_DIR}/a-story-in-two-languages.mp4`,
    poster: `${VIDEO_DIR}/a-story-in-two-languages.jpg`,
    preview: `${VIDEO_DIR}/a-story-in-two-languages.webp`,
    width: VIDEO_ASPECT.width,
    height: VIDEO_ASPECT.height,
    hasOpenCaptions: true,
    consentOnFile: true,
  },
  {
    id: "a-father-speaks",
    chip: "A father's view",
    label:
      "Siddhant's father on what play away from a screen looks like.",
    alt: "A father seated at home, speaking to camera.",
    src: `${VIDEO_DIR}/a-father-speaks.mp4`,
    poster: `${VIDEO_DIR}/a-father-speaks.jpg`,
    preview: `${VIDEO_DIR}/a-father-speaks.webp`,
    width: VIDEO_ASPECT.width,
    height: VIDEO_ASPECT.height,
    hasOpenCaptions: true,
    consentOnFile: true,
  },
  {
    id: "counting-out-loud",
    chip: "Counting out loud",
    label:
      "Three bricks and two more, worked out on the floor with Kheelu.",
    alt: "A boy on the floor with Lego bricks and the cream Kheelu plush.",
    src: `${VIDEO_DIR}/counting-out-loud.mp4`,
    poster: `${VIDEO_DIR}/counting-out-loud.jpg`,
    preview: `${VIDEO_DIR}/counting-out-loud.webp`,
    width: VIDEO_ASPECT.width,
    height: VIDEO_ASPECT.height,
    hasOpenCaptions: true,
    consentOnFile: true,
  },
  {
    id: "learning-by-asking",
    chip: "Learning by asking",
    label:
      "Kheelu asks her to explain carrom, and thanks her for the reminder.",
    alt: "A young girl on a playmat holding the cream Kheelu plush.",
    src: `${VIDEO_DIR}/learning-by-asking.mp4`,
    poster: `${VIDEO_DIR}/learning-by-asking.jpg`,
    preview: `${VIDEO_DIR}/learning-by-asking.webp`,
    width: VIDEO_ASPECT.width,
    height: VIDEO_ASPECT.height,
    hasOpenCaptions: true,
    consentOnFile: true,
  },
];

/** How many videos it takes before the section is a CAROUSEL rather than a
 *  plain row.
 *
 *  This was `VIDEO_MIN_TO_SHOW = 3` and it meant the section did not render at
 *  all below three, on the reasoning that one tile in a three-across row reads
 *  as two things that failed to load. That reasoning was right about the
 *  LAYOUT and wrong about the CONCLUSION, and the first real video is what
 *  showed it: hiding real footage of real children because only one had
 *  arrived is a worse answer than showing it well (2026-09-19, §8.37-j).
 *
 *  So the count now picks a TREATMENT, and nothing is ever hidden:
 *    - 0 videos: the section does not render. Still true, still the point.
 *    - 1 or 2: a centred, static row. No arrows, no dots, no rotation and no
 *      silent loop, because carousel chrome over a set that cannot advance is
 *      furniture pretending to be a control. A single tile is allowed to be
 *      wider, so it reads as one film rather than a gap where two others
 *      should be.
 *    - 3 or more: the carousel, exactly as designed. */
export const VIDEO_MIN_FOR_CAROUSEL = 3;

/** The section's lede, which has to agree with how many films are under it.
 *
 *  Single-sourced because three pages render this section and "Press play on
 *  any of them" over ONE film is the kind of plural promise that survives
 *  every review by being technically small and visibly wrong. It shipped that
 *  way for exactly one screenshot. */
export function videoLede(
  moments: readonly VideoMoment[] = VIDEO_MOMENTS,
): string {
  return moments.length > 1
    ? "Real children in real homes. Press play on any of them."
    : "Real children in real homes. Press play.";
}

/** The video that must hold the centre tile at rest, and the one to its right.
 *
 *  Founder instruction, 2026-09-19: the montage is the central video and the
 *  parent testimonial sits to its right. On a desktop three tiles are visible
 *  at rest, so "centre" is index 1 and "its right" is index 2. On a phone one
 *  tile shows at a time, so the same order simply makes the montage second.
 *
 *  Pinned as constants rather than left as a comment because the failure mode
 *  is silent: appending rows is harmless, but INSERTING one near the top moves
 *  the montage out of the centre and nothing would look broken. */
export const VIDEO_CENTRE_INDEX = 1;
export const VIDEO_CENTRE_ID = "first-conversations";
export const VIDEO_RIGHT_OF_CENTRE_ID = "a-parent-speaks";

/** Is there anything at all to show? */
export function hasVideoMoments(
  moments: readonly VideoMoment[] = VIDEO_MOMENTS,
): boolean {
  return moments.length > 0;
}

/** Enough to advance through, so the carousel chrome earns its place. */
export function isVideoCarousel(
  moments: readonly VideoMoment[] = VIDEO_MOMENTS,
): boolean {
  return moments.length >= VIDEO_MIN_FOR_CAROUSEL;
}
