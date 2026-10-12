import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CSSProperties } from "react";
import advikSticker from "@ds/assets/Cast/advik-sticker.png";
import kabirSticker from "@ds/assets/Cast/kabir-sticker.png";
import myraSticker from "@ds/assets/Cast/myra-sticker.png";
import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import cloudBlue from "@ds/assets/Shapes/cloud-blue.svg";
import flowerChilli from "@ds/assets/Shapes/flower-chilli.svg";
import heartChilli from "@ds/assets/Shapes/heart-chilli.svg";
import starSun from "@ds/assets/Shapes/star-sun.svg";
import sunSun from "@ds/assets/Shapes/sun-sun.svg";
import { DoodleDefs } from "@/components/ui/Doodle/DoodleDefs";
import { ArtBoard } from "./ArtBoard";

/* ArtBoard (task 2.3; DS scrapbook board). Each story is one approved board, its layers placed as in the mockup.
   The word sticker is a story fixture in the DS markup; pages pass ui/Sticker (task 2.2). */

const COLUMN = "(min-width: 1024px) 560px, (min-width: 900px) 45vw, calc(100vw - 32px)";

const meta = {
  title: "UI/ArtBoard",
  component: ArtBoard,
  decorators: [
    (Story) => (
      <>
        <DoodleDefs />
        <div className="kh-section">
          <div className="kh-container">
            <div className="kh-split">
              <Story />
            </div>
          </div>
        </div>
      </>
    ),
  ],
  args: {
    tone: "blue",
    sizes: COLUMN,
    label: "Kheelu by Kheelona, the cream plush rabbit with rainbow ears, beside a smiling boy",
    layers: [
      { image: { src: sunSun, alt: "" }, left: 6, width: 30, top: 8 },
      { image: { src: advikSticker, alt: "" }, left: 38, width: 54, bottom: 0 },
      { image: { src: kheeluSticker, alt: "" }, left: 2, width: 44, bottom: 2, rotate: -6 },
      { doodle: { name: "chalk-question-mark" }, left: 43, width: 13, top: 2, rotate: 10 },
    ],
  },
} satisfies Meta<typeof ArtBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home hero (home.html:22-26): still doodle (pick 2), the largest sticker as the LCP image. */
export const HomeHero: Story = { args: { hero: true, lcp: true } };

/** Product hero with its word sticker (meet-kheelu.html:19-25). */
export const ProductHeroWithSticker: Story = {
  args: {
    hero: true,
    label: "Kheelu, the cream plush rabbit that talks back, beside a curious little girl in a mustard flowered frock.",
    layers: [
      { image: { src: starSun, alt: "" }, right: 4, width: 30, top: 6 },
      { image: { src: myraSticker, alt: "" }, left: 44, width: 48, bottom: 0 },
      { image: { src: kheeluSticker, alt: "" }, left: 3, width: 46, bottom: 2, rotate: -5 },
      { doodle: { name: "chalk-speech-bubble" }, left: 40, width: 15, top: 14, rotate: -8 },
    ],
    sticker: (
      <span className="kh-sticker kh-tone-sun kh-sticker--round" style={{ "--kh-tilt": "-8deg", left: "5%", top: "6%" } as CSSProperties}>
        <strong>It asks.</strong>They think.
      </span>
    ),
  },
};

/** Home close (home.html:382-386): below the first screen, the ink heart draws itself (pick 3). */
export const HomeClose: Story = {
  args: {
    tone: "sun",
    label: "A curious girl in a mustard flowered frock beside Kheelu, the cream plush rabbit",
    layers: [
      { image: { src: flowerChilli, alt: "" }, left: 6, width: 30, top: 7 },
      { image: { src: myraSticker, alt: "" }, left: 44, width: 48, bottom: 0 },
      { image: { src: kheeluSticker, alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
      { doodle: { name: "ink-heart" }, left: 82, width: 12, top: 9, rotate: 14 },
    ],
  },
};

/** The buyer's guide hero (ai-toys-for-kids-in-india.html:14-18): clamped to 480 px between 720 and 899 px. */
export const GuideHeroClamped: Story = {
  args: {
    tone: "sun",
    hero: true,
    clamp: true,
    label: "A little girl in a mustard floral frock beside Kheelu, the cream plush rabbit.",
    layers: [
      { image: { src: cloudBlue, alt: "" }, left: 52, width: 40, top: 7 },
      { image: { src: myraSticker, alt: "" }, left: 42, width: 50, bottom: 0 },
      { image: { src: kheeluSticker, alt: "" }, left: 4, width: 44, bottom: 3, rotate: -5 },
      { doodle: { name: "ink-question-mark" }, left: 44, width: 11, top: 14, rotate: -10 },
    ],
  },
};

/** The guide's close board (ai-toys-for-kids-in-india.html:139-143): clamped, the ink star draws. */
export const GuideClose: Story = {
  args: {
    tone: "sun",
    clamp: true,
    label: "A boy in glasses and a rust T-shirt beside Kheelu, the cream plush rabbit.",
    layers: [
      { image: { src: heartChilli, alt: "" }, left: 6, width: 26, top: 8 },
      { image: { src: kabirSticker, alt: "" }, left: 40, width: 54, bottom: 0 },
      { image: { src: kheeluSticker, alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
      { doodle: { name: "ink-star" }, left: 82, width: 11, top: 9, rotate: 14 },
    ],
  },
};

/** A board with no label whose raster carries the alt text, fading in on scroll (ai-toys-for-kids-in-india.html:85-88). */
export const NamedLayerRevealed: Story = {
  args: {
    label: undefined,
    reveal: true,
    layers: [
      { image: { src: starSun, alt: "" }, left: 6, width: 26, top: 7 },
      { image: { src: kheeluFront, alt: "Kheelu, the soft cream plush rabbit with rainbow ears and a speaker in its tummy." }, left: 22, width: 56, bottom: 4 },
    ],
  },
};

/** A fixed 4:3 ratio (the refund hero board from 900 px, refund.html:19-22; refund.css:14). */
export const Ratio: Story = {
  args: {
    hero: true,
    label: undefined,
    ratio: "4 / 3",
    layers: [
      { image: { src: sunSun, alt: "" }, right: 30, width: 24, bottom: 6 },
      { image: { src: kheeluSticker, alt: "" }, left: 7, width: 36, bottom: 0, rotate: -5 },
      { doodle: { name: "chalk-heart" }, left: 7, width: 10, top: 8, rotate: -12 },
    ],
  },
};
