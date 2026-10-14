import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import advikWhisper from "@ds/assets/Photo library/advik-02-whispering-to-kheelu-web.webp";
import iraStory from "@ds/assets/Photo library/ira-01-story-on-the-bed-web.webp";
import { ModesSection } from "./ModesSection";

/* ModesSection (task 3.3): Home fold 4 and product fold 4 with their approved words and photos; product fold 4's quiet
   line as products/kheelu/page.ts prints it since the live team's code check (D058 item 1; task 8b.1b). */

const MODES = [
  { tone: "blue", icon: "wifi-high", title: "AI mode", body: "Open conversation, on your home Wi‑Fi. It can’t browse the internet." },
  {
    id: "story-mode",
    tone: "sun",
    tint: true,
    icon: "book-open",
    title: "Story mode",
    body: "Stories, poems and jingles your child enjoys and learns from. No Wi‑Fi needed.",
  },
  { tone: "chilli", icon: "bluetooth", title: "Bluetooth mode", body: "Pair your phone and use it as a speaker." },
] as const;

const LANGUAGES = {
  title: "Up to 10 languages at launch",
  items: [
    { native: "English" },
    { native: "हिन्दी", english: "Hindi", lang: "hi" },
    { native: "বাংলা", english: "Bengali", lang: "bn" },
    { native: "తెలుగు", english: "Telugu", lang: "te" },
    { native: "தமிழ்", english: "Tamil", lang: "ta" },
    { native: "ಕನ್ನಡ", english: "Kannada", lang: "kn" },
    { native: "Español", english: "Spanish", lang: "es" },
    { native: "Français", english: "French", lang: "fr" },
  ],
  note: "It can switch between them mid-sentence.",
};

const meta = {
  title: "Sections/ModesSection",
  component: ModesSection,
} satisfies Meta<typeof ModesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 4: "What is Kheelu?" beside Ira's photo, the three modes, the languages. */
export const Home: Story = {
  args: {
    variant: "home",
    heading: {
      eyebrow: "Modes and languages",
      title: "What is {hand:Kheelu?}",
      lead: "Kheelu by Kheelona is a screen-free plush rabbit that talks with children aged 3 to 7. It answers your child, then asks a question back. It has three modes: AI mode for open conversation on home Wi‑Fi, Story mode for stories, poems and jingles with no Wi‑Fi needed, and Bluetooth mode, which makes it a speaker for your phone.",
      id: "what-title",
    },
    photo: {
      image: { src: iraStory, alt: "A laughing girl in a peach kurta sitting cross-legged on a block-print bedsheet, telling Kheelu a story with both hands." },
    },
    modes: MODES,
    languages: LANGUAGES,
    link: { label: "See what each mode does", href: "/products/kheelu" },
  },
};

/** Product fold 4: compact mode rows on phones, then the Good to know card (with its F4 placeholder). */
export const Product: Story = {
  args: {
    variant: "product",
    heading: {
      eyebrow: "How it works",
      title: "A toy that talks back, not a toy that {hand:repeats.}",
      lead: "Kheelu is a screen-free plush toy for ages 3 to 7 that holds a back-and-forth conversation. It answers your child, then asks a question back, so they do the thinking.",
      id: "modes-title",
    },
    photo: {
      image: { src: advikWhisper, alt: "A boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall window." },
      wide: true,
    },
    modes: MODES,
    languages: LANGUAGES,
    know: {
      title: "Good to know",
      id: "know-title",
      items: [
        { icon: "wifi-high", text: "AI mode needs your home Wi‑Fi. Story mode and Bluetooth mode work without it." },
        { icon: "wifi-slash", text: "It can’t browse the internet. When it doesn’t know something, it says so." },
        { icon: "microphone", text: "Each conversation starts with a press of the wake-up button. It switches itself off after a couple of minutes of quiet." },
        { icon: "sliders-horizontal", text: "At setup, you enter your child’s age in the parent app." },
        { icon: "battery-charging", text: "It charges with the charger in the box. {ph:F4 battery life per charge and charging time}" },
      ],
      image: { src: bellyModule, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." },
    },
    link: { label: "How setup works", href: "/setup" },
  },
};
