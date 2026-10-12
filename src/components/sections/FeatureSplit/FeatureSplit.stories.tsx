import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import kabirImagining from "@ds/assets/Photo library/kabir-01-imagining-space-web.webp";
import starSun from "@ds/assets/Shapes/star-sun.svg";
import appActivity from "@/assets/app/app-activity.webp";
import appPrivacy from "@/assets/app/app-privacy.webp";
import appTranscript from "@/assets/app/app-transcript.webp";
import { DoodleDefs } from "@/components/ui/Doodle/DoodleDefs";
import { FeatureSplit } from "./FeatureSplit";

/* FeatureSplit (task 3.3): every layout with its approved words (home.html folds 3 and 5, meet-kheelu.html fold 5,
   safety.html folds 4 to 6, ai-toys-for-kids-in-india.html fold 4, setup.html folds 2 and 4 to 6, team.html fold 4). */

const CAPTION = "The Kheelona app is live on Apple’s App Store and the Google Play Store.";
const TRANSCRIPT = { src: appTranscript, alt: "The parent app showing one conversation word for word: Kheelu greets Aarav, and when he asks for Hindi, Kheelu answers in Hindi." };
const ACTIVITY = { src: appActivity, alt: "The parent app's activity screen for today: 22 minutes of talking, 3 chats and 9 questions asked, with today's chats listed." };
const PRIVACY = { src: appPrivacy, alt: "A real screen from the Kheelu parent app: the privacy centre." };

/** The page's one shared chalk filter (SiteShell renders it), which the drawn doodles use. */
const withDoodleDefs: Decorator = (Story) => (
  <>
    <DoodleDefs />
    <Story />
  </>
);

const meta = {
  title: "Sections/FeatureSplit",
  component: FeatureSplit,
  decorators: [withDoodleDefs],
} satisfies Meta<typeof FeatureSplit>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 3: the sourced words and the Kheelu card beside Kabir's imagination frame (its doodles draw in turn). */
export const Imagination: Story = {
  args: {
    variant: "imagination",
    heading: { eyebrow: "Why it matters", title: "{mark:Conversation} helps a young brain grow.", id: "why-title", align: "center" },
    text: "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^1]",
    card: {
      tone: "sun",
      tint: true,
      icon: "chat-circle-dots",
      title: "Where Kheelu comes in",
      body: "Kheelu is built around the same idea: it answers your child, then asks a question back.",
    },
    aside: "You can do it anywhere, too: answer your child, then ask one back.",
    frame: {
      photo: {
        src: kabirImagining,
        alt: "A boy in glasses and a rust T-shirt holding Kheelu against a dark wall, looking up at a chalk planet, stars and a thought cloud drawn around his question.",
      },
      zoom: true,
      question: "why does the moon follow our car?",
      doodles: [
        { doodle: { name: "chalk-planet" }, left: 4, top: 30, width: 20, rotate: -10 },
        { doodle: { name: "chalk-star" }, left: 16, top: 22, width: 8, rotate: -18 },
        { doodle: { name: "chalk-star" }, left: 86, top: 48, width: 7, rotate: 12 },
        { doodle: { name: "chalk-thought-cloud" }, left: 72, top: 22, width: 20 },
      ],
    },
    sources: {
      label: "Sources",
      marker: "Source",
      items: [
        {
          citation: "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts).",
          href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
        },
      ],
    },
    link: { label: "Read more: how children learn by talking", href: "/stories" },
  },
};

/** Home fold 5: the parent app's four lines beside two real screens. */
export const AppScreensHome: Story = {
  args: {
    variant: "app-screens",
    placement: "home",
    id: "app",
    heading: { eyebrow: "The parent app", title: "You see {hand:every conversation.}", id: "see-title" },
    items: [
      { icon: "eye", body: "Read every conversation in the parent app, word for word." },
      { icon: "chart-line-up", body: "Every week, the app gives you a report on four thinking skills (words, reasons, stories and questions) and a new-word count." },
      { icon: "sliders-horizontal", body: "You set your child’s age in the app, and the age-graded safety layer follows it." },
      { icon: "trash", body: "Your child’s conversations stay in your parent app for 36 months, then they’re deleted automatically. You can delete any of them sooner, in one tap." },
    ],
    screens: { images: [TRANSCRIPT, ACTIVITY], caption: CAPTION },
    link: { label: "See what the app shows you", href: "/products/kheelu", icon: "eye" },
  },
};

/** Product fold 5: the four thinking skills and the Kheelona+ note beside the screens. */
export const AppScreensProduct: Story = {
  args: {
    variant: "app-screens",
    placement: "product",
    id: "app",
    heading: {
      eyebrow: "The parent app",
      title: "Their week, in four {hand:thinking skills.}",
      lead: "Every week, the parent app gives you a report on four thinking skills: words, reasons, stories and questions, plus a new-word count. And you can read every conversation, word for word.",
      id: "app-title",
    },
    skills: { label: "The four thinking skills", items: ["Words", "Reasons", "Stories", "Questions"] },
    note: "The parent app is part of Kheelona+, included for 6 months with every Kheelu.",
    screens: { images: [TRANSCRIPT, ACTIVITY], caption: CAPTION },
    link: { label: "See what we keep, and for how long", href: "#safety" },
  },
};

/** Safety fold 4: the parent controls beside the one privacy screen in the plain DS frame. */
export const AppScreensSafety: Story = {
  args: {
    variant: "app-screens",
    placement: "safety",
    band: true,
    heading: { eyebrow: "Parent controls", title: "The grown-up holds {hand:the keys.}", lead: "The parent app is where you set the rules.", id: "controls-title" },
    items: [
      { icon: "sliders-horizontal", title: "Your child’s age.", body: "Enter it when you set Kheelu up, and change it later if you need to. The age-graded safety layer follows it." },
      { icon: "book-open", title: "Topics.", body: "You choose what’s open, and what waits." },
      { icon: "moon", title: "Quiet hours.", body: "They’re yours to set." },
      { icon: "translate", title: "Languages.", body: "Pick the ones you speak at home." },
    ],
    screens: { images: [PRIVACY], caption: CAPTION },
    link: { label: "See what the app shows you", href: "/products/kheelu#app", icon: "eye" },
  },
};

/** The buyer's guide fold 4: the words beside Kheelu alone on a 4:3 board (1:1 from 900 px). */
export const PhotoGuidePlush: Story = {
  args: {
    variant: "photo",
    split: "start",
    band: true,
    heading: { eyebrow: "Plush or robot", title: "AI robot or {hand:AI plush?}", id: "plush-title" },
    text: "It depends on what you want your child to do. A robot toy with a screen often shows faces, games and videos, so your child watches. A plush toy that talks has no screen, so your child talks and listens instead. Kheelu is a soft plush rabbit, not a robot, with a speaker in its tummy.",
    media: {
      kind: "art",
      plush: true,
      art: {
        tone: "blue",
        layers: [
          { image: { src: starSun, alt: "" }, left: 6, width: 26, top: 7 },
          { image: { src: kheeluFront, alt: "Kheelu, the soft cream plush rabbit with rainbow ears and a speaker in its tummy." }, left: 22, width: 56, bottom: 4 },
        ],
      },
    },
    link: { label: "See what Kheelu does", href: "/products/kheelu" },
  },
};

/** Setup fold 4: the heading beside its paragraphs, no media. */
export const PhotoNone: Story = {
  args: {
    variant: "photo",
    split: "end",
    band: true,
    heading: { title: "Tell the app {hand:your child’s age.}", id: "age-title" },
    copy: [
      "You enter your child’s age in the parent app. Every reply Kheelu gives passes a safety layer set to that age.",
      "You can change it later. Kheelu picks up the change the next time it’s online.",
    ],
  },
};

/** Setup fold 5: the words (with an open fact) beside the square tummy-unit photo. */
export const PhotoSetupBelly: Story = {
  args: {
    variant: "photo",
    heading: { title: "Show your child the {hand:wake-up button.}", id: "button-title" },
    copy: [
      "Kheelu only listens when someone presses its wake-up button. {ph:where the wake-up button sits on Kheelu}",
      "One press starts a conversation. A light on Kheelu shows whenever it’s listening.",
    ],
    media: { kind: "photo", image: { src: bellyModule, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." }, variant: "square", fit: "belly" },
  },
};

/** Setup fold 6: the activity screenshot as a photo, at its own ratio, with its caption. */
export const PhotoSetupShot: Story = {
  args: {
    variant: "photo",
    split: "start",
    band: true,
    heading: { title: "Then {hand:let them talk.}", id: "talk-title" },
    copy: ["The first conversation is your child’s. Kheelu answers, then asks a question back."],
    media: {
      kind: "photo",
      image: { src: appActivity, alt: "The parent app’s activity screen on a phone, showing example activity for one child." },
      ratio: "576 / 1209",
      caption: "The parent app’s activity screen. The child’s name and the activity shown are examples.",
      fit: "shot",
    },
  },
};

/** Setup fold 2: the checklist under its heading (the Wi-Fi tip arrives in `after`). */
export const Ticks: Story = {
  args: {
    variant: "ticks",
    band: true,
    heading: { title: "Before you start.", id: "before-title" },
    items: [
      { icon: "battery-charging", body: "Charge Kheelu with the charger in the box. {ph:F4 the charger type, and how long a full charge takes}" },
      { icon: "lock-simple", body: "Have your home Wi‑Fi password ready." },
      { icon: "wifi-high", body: "Stay close to your Wi‑Fi router." },
    ],
  },
};

/** Safety folds 5 and 6: two short folds as quiet cards. */
export const Pair: Story = {
  args: {
    variant: "pair",
    cards: [
      {
        heading: { eyebrow: "Retention", title: "How long conversations are {hand:kept.}", id: "kept-title" },
        copy: ["Your child’s conversations stay in your parent app for 36 months, then they’re deleted automatically. You can delete any of them sooner, in one tap."],
        link: { label: "Read our privacy policy", href: "/privacy" },
      },
      {
        heading: { eyebrow: "Certification", title: "Toy-safety certification: where it {hand:stands.}", id: "cert-title" },
        copy: ["We have applied for Kheelu’s BIS licence for toy safety. It has not been granted yet, so no toy-safety certificate has been issued to us so far."],
      },
    ],
  },
};

/** Team fold 4: why we build, beside the founder's quote. */
export const QuoteTeam: Story = {
  args: {
    variant: "quote",
    band: true,
    heading: { title: "{mark:Why} we build Kheelu.", id: "why-title" },
    copy: [
      "We are parents who build. We watched our own children reach for screens.",
      "Most AI gives children answers. We built a toy that answers, then asks your child a question back, so they do the thinking.",
    ],
    subtitle: "No screen. No camera. It can’t browse the internet.",
    quote: {
      text: "The hard part of AI for children is not the model. It is the trust. So we build that first, and everything else second.",
      name: "Apoorva Sahu",
      role: "Co-Founder and CEO",
      initials: "AS",
      tone: "sun",
    },
    link: { label: "See how we built safety in", href: "/safety", icon: "shield-check" },
  },
};
