/** The four real Kheelu audio moments (team feedback 2026-07-30, BUILD-V4 §3 F3).
 *
 *  Transcripts are the team's words VERBATIM with two punctuation-only edits
 *  for the voice-lint law (recorded in BUILD-V4 D8): the em-dash in the
 *  breathing clip became a comma, and the stray comma before "floating logs"
 *  was dropped. Exclamation marks and contractions are sanctioned here —
 *  this is quoted toy speech, the one place they are allowed.
 *
 *  The MP3s are founder-supplied (FOUNDER-TODO V4-b; Claude's sandbox cannot
 *  reach Google Drive). Until they land in public/audio/, AudioMoments hides
 *  the play control per card and the transcript still reads as a demo card. */
export type AudioMomentData = {
  id: string;
  /** What this exchange teaches, in kicker style. */
  chip: string;
  /** Exactly what the audio says. */
  transcript: string;
  /** Path under /public. */
  src: string;
};

export const AUDIO_MOMENTS: readonly AudioMomentData[] = [
  {
    id: "knight",
    chip: "Thinking games",
    transcript:
      "Oh no, the bridge is out! To help the knight cross the river, should we build a boat out of heavy rocks or floating logs? Choose one.",
    src: "/audio/lumi-demo-knight.mp3",
  },
  {
    id: "shoes",
    chip: "Everyday skills",
    transcript:
      "Wait, I forgot... do we need to put our shoes on before or after our socks? Can you show me how you do it?",
    src: "/audio/lumi-demo-shoes.mp3",
  },
  {
    id: "breathe",
    chip: "Big feelings",
    transcript:
      "I'm feeling a little overwhelmed by that loud noise, can we take three big breaths together?",
    src: "/audio/lumi-demo-breathe.mp3",
  },
  {
    id: "apples",
    chip: "Numbers",
    /* "4", not the team doc's "40": the founder-supplied MP3's filename (the
       TTS generation prompt) says four, and the transcript's one job is to
       match the audio. Flagged to the founder 2026-07-31; also the better
       number for ages 2 to 5. */
    transcript:
      "We have 4 apples for our picnic, but a sneaky squirrel just ran off with 2! How many do we have left to share?",
    src: "/audio/lumi-demo-apples.mp3",
  },
] as const;

/** The compact pair for /products/kheelu's Story-mode room (BUILD-V4 §4.1):
 *  one thinking game, one numbers game — the two clearest "lesson in play"
 *  moments, without repeating the whole Home grid. */
export const KHEELU_PAGE_MOMENTS: readonly AudioMomentData[] = [
  AUDIO_MOMENTS[0],
  AUDIO_MOMENTS[3],
];
