/// <reference types="next/image-types/global" />
import counting from "@ds/assets/Photo library/advik-01-counting-carriages-web.webp";
import floorTrain from "@ds/assets/Photo library/advik-04-floor-train-web.webp";
import storyOnTheBed from "@ds/assets/Photo library/ira-01-story-on-the-bed-web.webp";
import drawingTheDragon from "@ds/assets/Photo library/ira-02-drawing-the-dragon-web.webp";
import paperCrown from "@ds/assets/Photo library/ira-04-paper-crown-web.webp";
import blockRocket from "@ds/assets/Photo library/kabir-02-block-rocket-web.webp";
import homeworkDesk from "@ds/assets/Photo library/kabir-03-homework-desk-web.webp";
import planetBook from "@ds/assets/Photo library/kabir-04-planet-book-web.webp";
import drawingAtHome from "@ds/assets/Photo library/myra-04-drawing-at-home-web.webp";
import namingFeelings from "@ds/assets/Photo library/tara-01-naming-feelings-web.webp";
import eveningWithAmma from "@ds/assets/Photo library/tara-02-evening-with-amma-web.webp";
import bedtimeWithBaba from "@ds/assets/Photo library/tara-03-bedtime-with-baba-web.webp";
import readingNook from "@ds/assets/Photo library/tara-04-reading-nook-web.webp";
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import type { JournalPhoto } from "@/lib/journal/to-article";

/**
 * The journal's photo table (ADR-014; journal-pipeline §6; assets.md §1): every design-system image a dashboard post
 * may name by key (`photo` for the head, `image.photo` in the body), with the image's one alt (so no image is ever
 * worded twice, §8.2 row 21), the share card of a photo that may head a guide (`/og/<key>.jpg`, cut by
 * scripts/assets/build-og.mjs `STORY_CARDS`, task 7.1f), and `wide` on a photo at least 1.6 times as wide as tall (a
 * body photo's 16:9 frame, §5.1). The head photos are the 13 that head the 20 rewritten guides; the body images are the
 * learning-toys guide's floor train and the safe-AI-toy guide's tummy unit. Each alt is the one the guides use today
 * (photos.test.ts holds them equal). A new head photo is a `STORY_CARDS` line, a row here and a regenerated card (an
 * assets task); a key not here fails the build (§8.2 row 12).
 */
export const photos = {
  "advik-01-counting-carriages": {
    image: {
      src: counting,
      alt: "A smiling boy in a navy-and-white striped T-shirt sits cross-legged on a red floor, lining up a blue wooden train, with Kheelu sitting beside him in front of a low bookshelf.",
    },
    card: "/og/advik-01-counting-carriages.jpg",
  },
  "advik-04-floor-train": {
    image: { src: floorTrain, alt: "A boy in a green T-shirt lying on a red floor, smiling as he pushes a blue wooden train." },
    card: "/og/advik-04-floor-train.jpg",
    wide: true,
  },
  "ira-01-story-on-the-bed": {
    image: {
      src: storyOnTheBed,
      alt: "A laughing girl in a peach kurta sitting cross-legged on a block-print bedsheet, telling Kheelu a story with both hands.",
    },
    card: "/og/ira-01-story-on-the-bed.jpg",
  },
  "ira-02-drawing-the-dragon": {
    image: {
      src: drawingTheDragon,
      alt: "A laughing girl in a yellow frock lies on her tummy on a rug, a blue crayon in her hand, a big drawing of a green dragon in front of her and Kheelu sitting beside her.",
    },
    card: "/og/ira-02-drawing-the-dragon.jpg",
    wide: true,
  },
  "ira-04-paper-crown": {
    image: {
      src: paperCrown,
      alt: "A laughing girl with a long braid holds a yellow paper crown on her head, beside a low table scattered with crayons and paper scraps.",
    },
    card: "/og/ira-04-paper-crown.jpg",
  },
  "kabir-02-block-rocket": {
    image: {
      src: blockRocket,
      alt: "A boy in round glasses and an olive T-shirt kneels on a patterned rug, grinning as he stacks wooden blocks into a tall tower, with Kheelu sitting beside it.",
    },
    card: "/og/kabir-02-block-rocket.jpg",
    wide: true,
  },
  "kabir-03-homework-desk": {
    image: {
      src: homeworkDesk,
      alt: "A boy in round glasses and a white school shirt grins, one finger at his nose, as he writes in an exercise book at a wooden desk by a window, Kheelu sitting at the far end of the desk.",
    },
    card: "/og/kabir-03-homework-desk.jpg",
  },
  "kabir-04-planet-book": {
    image: {
      src: planetBook,
      alt: "A boy in round glasses and a mustard T-shirt lies on a striped rug, chin in his hands, wide-eyed over a picture book about planets.",
    },
    card: "/og/kabir-04-planet-book.jpg",
    wide: true,
  },
  "myra-04-drawing-at-home": {
    image: {
      src: drawingAtHome,
      alt: "A little girl in a red polka-dot frock, tongue out in concentration, scribbling with an orange crayon at a low table.",
    },
    card: "/og/myra-04-drawing-at-home.jpg",
  },
  "tara-01-naming-feelings": {
    image: {
      src: namingFeelings,
      alt: "A curly-haired girl in denim dungarees sits on a wooden floor by a sunlit window lined with potted plants, Kheelu in her lap, touching its chin with one finger.",
    },
    card: "/og/tara-01-naming-feelings.jpg",
  },
  "tara-02-evening-with-amma": {
    image: {
      src: eveningWithAmma,
      alt: "A laughing girl holds Kheelu on the sofa while her mother, a steel tumbler in one hand and a phone in the other, laughs with her.",
    },
    card: "/og/tara-02-evening-with-amma.jpg",
    wide: true,
  },
  "tara-03-bedtime-with-baba": {
    image: {
      src: bedtimeWithBaba,
      alt: "A father in glasses laughs as he reads a picture book aloud at bedtime, while his daughter, tucked in under a patchwork quilt, hugs Kheelu and smiles up at him.",
    },
    card: "/og/tara-03-bedtime-with-baba.jpg",
  },
  "tara-04-reading-nook": {
    image: {
      src: readingNook,
      alt: "A girl with curly hair, in a coral kurta, sits cross-legged on a window seat and reads a picture book aloud, one finger on the page.",
    },
    card: "/og/tara-04-reading-nook.jpg",
  },
  "kheelu-belly-module": {
    image: { src: bellyModule, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." },
  },
} as const satisfies Readonly<Record<string, JournalPhoto>>;

/** A key of the photo table. */
export type PhotoKey = keyof typeof photos;
