import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import advikSticker from "@ds/assets/Cast/advik-sticker.png";
import myraSticker from "@ds/assets/Cast/myra-sticker.png";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import taraEvening from "@ds/assets/Photo library/tara-02-evening-with-amma-web.webp";
import cloudBlue from "@ds/assets/Shapes/cloud-blue.svg";
import heartChilli from "@ds/assets/Shapes/heart-chilli.svg";
import starSun from "@ds/assets/Shapes/star-sun.svg";
import sunSun from "@ds/assets/Shapes/sun-sun.svg";
import { Button } from "@/components/ui/Button/Button";
import { Actions } from "@/components/ui/Layout/Layout";
import { HeroSection } from "./HeroSection";

/* HeroSection (task 3.3): every layout with its approved words (home.html, meet-kheelu.html, safety.html,
   ai-toys-for-kids-in-india.html, team.html, setup.html, contact.html and stories.html fold 1). The CTA block is the
   page's (CtaBlock, task 3.2); a plain chilli button stands in for it here. test/e2e/motion-hero.spec.ts runs on these
   stories (D049 pick 2: nothing moves). */

const cta = (value: "hero" | "product-top") => (
  <Actions>
    <Button variant="cta" size="l" block arrow cta={value} href="/store" id={value === "hero" ? "hero-cta" : undefined}>
      Pre-order Kheelu
    </Button>
  </Actions>
);
const STICKER = { tone: "sun", variant: "round", lead: "It asks.", lines: ["They think."] } as const;

const meta = {
  title: "Sections/HeroSection",
  component: HeroSection,
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home (D045): the CTA block beside the board; the board's doodle stays still and its largest sticker is the LCP image.
 *  Under 720 px the board's phone composition (D061 item 1: 16:10, the same files) shows in its place, right under the
 *  words and the button, so Kheelu is on the first phone screen; view it at a phone width. */
export const HomeArt: Story = {
  args: {
    variant: "art",
    heading: {
      eyebrow: "Ages 3 to 7",
      title: "Kheelu answers every why. Then it {hand:asks one back.}",
      lead: "A screen-free plush toy by Kheelona. It answers your child first, then asks a question back, so they do the thinking.",
      id: "hero-title",
    },
    art: {
      tone: "blue",
      label: "Kheelu by Kheelona, the cream plush rabbit with rainbow ears, beside a smiling boy",
      layers: [
        { image: { src: sunSun, alt: "" }, left: 6, width: 30, top: 8 },
        { image: { src: advikSticker, alt: "" }, left: 38, width: 54, bottom: 0 },
        { image: { src: kheeluSticker, alt: "" }, left: 2, width: 44, bottom: 2, rotate: -6 },
        { doodle: { name: "chalk-question-mark", draw: true }, left: 43, width: 13, top: 2, rotate: 10 },
      ],
      sticker: { ...STICKER, tilt: 8 },
    },
    phoneLayers: [
      { image: { src: sunSun, alt: "" }, left: 3, width: 18, bottom: 5 },
      { image: { src: advikSticker, alt: "" }, left: 59, width: 34, bottom: 0 },
      { image: { src: kheeluSticker, alt: "" }, left: 37, width: 30, bottom: 4, rotate: -6 },
      { doodle: { name: "chalk-question-mark" }, left: 52, width: 8, top: 3, rotate: 10 },
    ],
    cta: cta("hero"),
  },
};

/** The product page: the word sticker top left, clear of Myra's face; under 720 px the phone composition (D061 item 1),
 *  its sticker top left too. */
export const Product: Story = {
  args: {
    variant: "product",
    heading: {
      eyebrow: "Ages 3 to 7",
      title: "Kheelu talks back. {hand:The good kind.}",
      lead: "A screen-free plush toy from Kheelona. It answers your child, then asks a question back, so they do the thinking.",
      id: "hero-title",
    },
    art: {
      tone: "blue",
      label: "Kheelu, the cream plush rabbit that talks back, beside a curious little girl in a mustard flowered frock.",
      layers: [
        { image: { src: starSun, alt: "" }, right: 4, width: 30, top: 6 },
        { image: { src: myraSticker, alt: "" }, left: 44, width: 48, bottom: 0 },
        { image: { src: kheeluSticker, alt: "" }, left: 3, width: 46, bottom: 2, rotate: -5 },
        { doodle: { name: "chalk-speech-bubble" }, left: 40, width: 15, top: 14, rotate: -8 },
      ],
      sticker: { ...STICKER, tilt: -8 },
    },
    phoneLayers: [
      { image: { src: starSun, alt: "" }, left: 3, width: 18, bottom: 5 },
      { image: { src: myraSticker, alt: "" }, left: 59, width: 34, bottom: 0 },
      { image: { src: kheeluSticker, alt: "" }, left: 37, width: 30, bottom: 4, rotate: -5 },
      { doodle: { name: "chalk-speech-bubble" }, left: 50, width: 11, top: 3, rotate: -8 },
    ],
    cta: cta("product-top"),
  },
};

/** Safety: the answer-first heading beside a wide photo. */
export const AnswerPhoto: Story = {
  args: {
    variant: "answer",
    heading: {
      eyebrow: "Safety",
      title: "Are AI toys safe? Check ours, {hand:fact by fact.}",
      lead: "Not all of them, so check before you buy one for a child aged 3 to 7. Here’s how Kheelu answers each one, in plain words.",
      id: "hero-title",
    },
    media: {
      kind: "photo",
      image: { src: taraEvening, alt: "A girl and her mother on a sofa in the evening lamp light, with Kheelu between them." },
      variant: "wide",
      xl: true,
    },
  },
};

/** The buyer's guide: the board, clamped to 480 px between 720 and 899 px. */
export const AnswerArt: Story = {
  args: {
    variant: "answer",
    heading: {
      eyebrow: "A guide for parents",
      title: "AI toys for kids in India: five checks {hand:before you buy.}",
      lead: "Before you buy an AI toy in India, put five questions to its maker. A good AI toy for a 3 to 7 year old answers all five plainly.",
      id: "hero-title",
    },
    media: {
      kind: "art",
      clamp: true,
      art: {
        tone: "sun",
        label: "A little girl in a mustard floral frock beside Kheelu, the cream plush rabbit.",
        layers: [
          { image: { src: cloudBlue, alt: "" }, left: 52, width: 40, top: 7 },
          { image: { src: myraSticker, alt: "" }, left: 42, width: 50, bottom: 0 },
          { image: { src: kheeluSticker, alt: "" }, left: 4, width: 44, bottom: 3, rotate: -5 },
          { doodle: { name: "ink-question-mark" }, left: 44, width: 11, top: 14, rotate: -10 },
        ],
      },
    },
  },
};

/** Team: the product-only board, which follows the words until 900 px. */
export const AnswerTeam: Story = {
  args: {
    variant: "answer",
    heading: {
      eyebrow: "Team",
      title: "The {hand:parents} building Kheelu.",
      lead: "Kheelu is designed by parents in Bengaluru. You’re trusting us near your child, so here is who we are.",
      id: "hero-title",
    },
    media: {
      kind: "art",
      stacked: true,
      art: {
        tone: "sun",
        label: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
        layers: [
          { image: { src: heartChilli, alt: "" }, left: 7, width: 30, top: 8 },
          { image: { src: kheeluSticker, alt: "" }, left: 24, width: 56, bottom: 4, rotate: -5 },
          { doodle: { name: "ink-spark-lines" }, left: 74, width: 16, top: 12, rotate: 12 },
        ],
      },
    },
  },
};

/** Setup: words only, centred from 900 px. */
export const AnswerWords: Story = {
  args: {
    variant: "answer",
    heading: {
      eyebrow: "Day one with Kheelu",
      title: "How to set up Kheelu on {hand:day one.}",
      lead: "Charge Kheelu, then open the parent app on your phone. The app connects Kheelu to your home Wi‑Fi and asks for your child’s age.",
      id: "hero-title",
    },
  },
};

/** Contact: the heading beside the three ways to reach the team. */
export const Contact: Story = {
  args: {
    variant: "contact",
    heading: {
      eyebrow: "Contact Kheelona",
      title: "Talk to the team {hand:behind Kheelu.}",
      lead: "To contact Kheelona, call or message us on WhatsApp at {nowrap:+91 91875 46483}, or email hello@kheelona.com. For a formal complaint, see our [grievance officer](#grievance) below.",
      id: "hero-title",
    },
    ways: [
      { label: "Message on WhatsApp", href: "https://wa.me/919187546483", icon: "whatsapp-logo" },
      { label: "Call +91 91875 46483", href: "tel:+919187546483" },
      { label: "Email hello@kheelona.com", href: "mailto:hello@kheelona.com", icon: "envelope-simple" },
    ],
  },
};

/** The stories hub: on the band, with the byline and the topic links. */
export const Hub: Story = {
  args: {
    variant: "hub",
    heading: {
      eyebrow: "Parenting guides",
      title: "Guides for parents of {hand:3 to 7 year olds}",
      lead: "Plain-words parenting guides on screen time, talking, play and AI toys. Each one answers the question first, then shows its sources.",
      id: "stories-title",
    },
    written: "Written by the Kheelona team in Bengaluru.",
    topics: {
      label: "Topics",
      id: "topics-label",
      links: [
        { label: "Screen time", href: "#screen-time" },
        { label: "Talking and language", href: "#talking" },
        { label: "AI toys and safety", href: "#ai-and-safety" },
        { label: "Learning and play", href: "#learning" },
      ],
    },
  },
};
