import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import appPrivacy from "@/assets/app/app-privacy.webp";
import { Button } from "@/components/ui/Button/Button";
import { Actions } from "@/components/ui/Layout/Layout";
import { TrustSection } from "./TrustSection";

/* TrustSection (task 3.3): every layout (home.html and meet-kheelu.html fold 6, safety.html folds 2 and 3,
   ai-toys-for-kids-in-india.html fold 3), in the words the site prints since the live team's code check (D058; task
   8b.1b): home.ts, safety.ts and ai-toys-for-kids-in-india.ts. The CTA block is the page's (CtaBlock, task 3.2); a plain
   chilli button stands in for it here. */

const SAFETY_ITEMS = [
  {
    icon: "microphone",
    title: "You’ll always see when it’s listening.",
    body: "Its microphone turns on only when someone presses the wake-up button. It stays on while your child talks and switches itself off after a couple of minutes of quiet. A light on Kheelu shows whenever it’s listening. Left alone, it hears nothing and sends nothing.",
  },
  {
    icon: "lock-simple",
    title: "How it understands and answers.",
    body: "To understand and answer your child, Kheelu uses trusted speech and AI providers. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so.",
  },
  {
    icon: "eye",
    title: "You can read every conversation.",
    body: "In the parent app. Removing a chat there hides it on that phone. Deleting your account deletes your child’s profile, conversations and recordings from our servers.",
  },
  { icon: "hand-heart", title: "We don’t sell your data.", body: "Your child’s data is never used to advertise to them." },
] as const;

const FACTS = [
  { icon: "eye-slash", text: "No camera" },
  { icon: "wifi-slash", text: "It can’t browse the internet" },
  { icon: "smiley", text: "It says it’s a toy, and never asks your child to keep a secret from you" },
] as const;

const SCREENS = {
  images: [
    {
      src: appPrivacy,
      alt: "The parent app's privacy centre: keep chats for 36 months, a switch to save voice recordings, download your child's data, and links to the privacy policy, terms and the grievance officer.",
    },
  ],
  caption: "The Kheelona app is live on Apple’s App Store and the Google Play Store.",
} as const;

const cta = (value: "safety" | "product-safety") => (
  <Actions center>
    <Button variant="cta" size="l" cta={value} href="/store">
      Pre-order Kheelu
    </Button>
  </Actions>
);

const meta = {
  title: "Sections/TrustSection",
  component: TrustSection,
} satisfies Meta<typeof TrustSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 6: the four facts beside the privacy screen, the facts line, then the CTA block. */
export const SafetyHome: Story = {
  args: {
    variant: "safety",
    placement: "home",
    band: true,
    heading: { eyebrow: "Safety", title: "Safety you can {hand:check.}", id: "safety-title" },
    items: SAFETY_ITEMS,
    screens: SCREENS,
    facts: FACTS,
    cta: cta("safety"),
  },
};

/** Product fold 6: the 7:5 split, the screen alone and sticky on laptops. */
export const SafetyProduct: Story = {
  args: { ...SafetyHome.args, variant: "safety", placement: "product", id: "safety", cta: cta("product-safety") } as Story["args"],
};

/** Safety fold 2: the four facts in full, the tummy unit beside the heading. */
export const Facts: Story = {
  args: {
    variant: "facts",
    id: "facts",
    band: true,
    heading: {
      eyebrow: "Four facts",
      title: "Is Kheelu safe for {hand:my child?}",
      lead: "Judge it by what it does. Here are the four facts that matter most, in full.",
      id: "facts-title",
    },
    items: [
      {
        icon: "microphone",
        title: "Is Kheelu always listening?",
        body: "No. Kheelu has no wake word to listen for. Its microphone turns on only when someone presses the wake-up button. It stays on while your child is talking and switches itself off after a couple of minutes of quiet. Until the next press, nothing is heard, recorded or sent. A light on Kheelu shows whenever it’s listening.",
      },
      {
        icon: "eye",
        title: "Can I read every conversation?",
        body: "Yes, in the parent app, word for word, a few minutes after each one ends. Delete them all by deleting your account.",
      },
    ],
    photo: { src: bellyModule, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." },
  },
};

/** Safety fold 3: five "never" items, three then two on laptops. */
export const Never: Story = {
  args: {
    variant: "never",
    heading: { eyebrow: "Never", title: "What you {mark:won’t} find in Kheelu.", id: "never-title" },
    items: [
      { icon: "eye-slash", title: "No camera.", body: "It can’t see your child or your home." },
      { icon: "speaker-high", title: "No screen.", body: "Your child talks and listens instead of watching." },
      { icon: "wifi-slash", title: "No web browsing.", body: "It can’t browse or search the web." },
      { icon: "x", title: "No ads.", body: "Not in the toy, and not in the parent app." },
      { icon: "smiley", title: "No secrets.", body: "It never asks your child to keep one from you." },
    ],
    link: { label: "How to choose an AI toy: five checks", href: "/ai-toys-for-kids-in-india" },
  },
};

/** Safety fold 3 since task Q2.11: six items with the daily limit (D065 item 5), three and three on laptops. */
export const NeverSix: Story = {
  args: {
    ...Never.args,
    variant: "never",
    items: [
      ...(Never.args?.items ?? []),
      { icon: "clock", title: "No talking all day.", body: "Each Kheelu has a daily limit on how long it talks." },
    ],
  },
};

/** Buyer's guide fold 3: the five answers, the pointer line, the secondary link. */
export const Meets: Story = {
  args: {
    variant: "meets",
    heading: {
      eyebrow: "Kheelu’s answers",
      title: "How Kheelu meets {hand:each check.}",
      lead: "Kheelu by Kheelona is a screen-free plush toy for children aged 3 to 7. Its answers, in the same order:",
      id: "answers-title",
    },
    items: [
      { icon: "eye-slash", title: "Screen or camera", body: "Neither. No screen and no camera." },
      {
        icon: "microphone",
        title: "Microphone",
        body: "On only after someone presses the wake-up button. A light shows whenever it’s listening, and it switches itself off after a couple of minutes of quiet.",
      },
      {
        icon: "wifi-slash",
        title: "Open internet",
        body: "It can’t browse the internet. Its answers are generated by an AI model. The model is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top. When it doesn’t know something, it says so.",
      },
      {
        icon: "eye",
        title: "Every conversation",
        body: "Yes, in the parent app, word for word. Removing a chat in the app hides it on that phone. Deleting your account deletes the conversations and recordings from our servers.",
      },
      { icon: "translate", title: "Languages", body: "Eight today, with up to 10 at launch. It can switch between them mid-sentence." },
    ],
    pointer: "How Kheelu understands and answers your child, and how long conversations are kept, are on our safety page.",
    link: { label: "See the full safety facts", href: "/safety", icon: "shield-check" },
  },
};
