import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import advikWhisper from "@ds/assets/Photo library/advik-02-whispering-to-kheelu-web.webp";
import iraStory from "@ds/assets/Photo library/ira-01-story-on-the-bed-web.webp";
import type { FaqItem } from "@/content/types";
import { buildOffer } from "@/lib/offer/offer";
import { FaqSection } from "./FaqSection";

/* FaqSection (task 3.3): every layout of the approved FAQ folds, with their words (home.html and meet-kheelu.html
   fold 8, safety.html fold 7, ai-toys-for-kids-in-india.html fold 5, store.html fold 5). */

const offer = buildOffer("token");

const HOME: FaqItem[] = [
  {
    id: "think-less",
    question: "Won’t an AI toy make my child think less?",
    answer:
      "That’s exactly what Kheelu is designed against. Most AI gives answers. Kheelu answers your child, then asks them a question back, so they do the thinking. It can’t browse the internet, and when it doesn’t know something, it says so instead of guessing. You can read every conversation in the parent app.",
  },
  {
    id: "price-and-advance",
    question: { token: "How much is Kheelu, and how does the advance work?", full: "How much is Kheelu?" },
    answer: {
      token:
        "Kheelu is {price:headline} (incl. GST) for the first 500 units, with delivery anywhere in India included. Its MRP is {price:mrp} (incl. of all taxes). A refundable {price:token} advance reserves yours today, and the remaining {price:balance} is due before delivery. You can pay by UPI, card or net banking, and you get a GST invoice.",
      full: "Kheelu is {price:full} (incl. GST), paid in full when you order, with delivery anywhere in India included.",
    },
  },
  {
    id: "when-arrive",
    question: "When will my Kheelu arrive?",
    answer:
      "{delivery}. Pre-orders are served first, in the order they were placed, and you get a tracking link when it leaves us. Delivery is included anywhere in India, with nothing to pay at the door. We don’t ship outside India. A reserved Kheelu is sent once the rest of the price is paid.",
  },
];

const SPEECH: FaqItem = {
  id: "speech",
  question: "Can Kheelu help my child’s speech?",
  answer:
    "Kheelu is a toy, not a therapy or treatment. Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult support early language and social skills.[^1] Kheelu doesn’t replace that time with you. If you’re worried about your child’s speech, talk to your paediatrician.",
};

const SAFETY: FaqItem[] = [
  {
    id: "age-three",
    question: "Is Kheelu OK for a 3-year-old?",
    answer:
      "Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. If your child is 3, keep a grown-up nearby. Common Sense Media advises against AI toys at this age. Its advice in full, and our answer, are in the next question.",
  },
  {
    id: "child-safety-groups",
    question: "What do child-safety groups say about AI toys?",
    answer:
      "In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as “smart toys with voice-based interactions”, to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.[^1] We make Kheelu for ages 3 to 7, so you should hear this from us.",
    detail: [
      { kind: "p", text: "Here is what Kheelu does about each concern:" },
      {
        kind: "list",
        items: [
          { lead: "Attachment:", text: "Kheelu tells your child it’s a toy, and it never asks them to keep a secret from you." },
          { lead: "Data:", text: "[the four facts at the top of this page](#facts). We don’t sell your data." },
          { lead: "At 3:", text: "keep a grown-up nearby." },
        ],
      },
    ],
  },
];

const STORE: FaqItem[] = [
  {
    id: "paying-today",
    question: "What am I paying today?",
    answer:
      "A refundable {price:token} today reserves your Kheelu, and it is part of the {price:headline} price (incl. GST), not an extra fee. The remaining {price:balance} is due before delivery, by a payment link we send on WhatsApp and by email. Nothing is ever charged automatically.",
  },
  {
    id: "how-to-pay",
    question: "How can I pay?",
    answer:
      "By UPI, debit or credit card, or net banking, in Razorpay’s payment window. There are no payment fees and nothing recurring. Your card number, UPI ID and bank details go to Razorpay, not to us, and every order comes with a GST invoice.",
  },
];

const HEADING = { eyebrow: "Questions", title: "Questions parents {hand:ask.}", id: "faq-title" };

/** A stand-in for the inline sources (SourcesSection `inline`, task 3.4), as the mockup prints them. */
const notes = (
  <div>
    <p className="kh-caption" id="src-1">
      <strong>Sources</strong> [1] Common Sense Media, “Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks”
      (press release), 2026, paragraph 1. <a href="https://www.commonsensemedia.org/">commonsensemedia.org</a>
    </p>
  </div>
);

const meta = {
  title: "Sections/FaqSection",
  component: FaqSection,
  args: { heading: HEADING, items: HOME, offer },
} satisfies Meta<typeof FaqSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 8: the heading column, the questions and "See all questions" (`faq-more`). */
export const Home: Story = {
  args: { more: { label: "See all questions", href: "/products/kheelu#faq", cta: "faq-more" } },
};

/** Home fold 8 once the cap is reached: the price answer in full mode. */
export const HomeFullMode: Story = {
  args: { offer: buildOffer("full") },
};

/** Product fold 8: on the band, with the D025 line, its source and the help line. */
export const Product: Story = {
  args: {
    band: true,
    items: [...HOME, SPEECH],
    sourceMarker: "Source",
    disclaimer: {
      icon: "info",
      text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.",
    },
    sources: {
      label: "Sources",
      items: [
        {
          citation:
            "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
          href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
          label: "developingchild.harvard.edu/key-concept/serve-and-return",
        },
      ],
    },
    help: {
      icon: "whatsapp-logo",
      lead: "Still have a question?",
      contact: "[WhatsApp](https://wa.me/919187546483) or {nowrap:[call +91 91875 46483](tel:+919187546483)}",
    },
  },
};

/** Safety fold 7: on the band, the wide photo, the first answer open, the sources, then the guide link. */
export const PhotoSafety: Story = {
  args: {
    variant: "photo",
    band: true,
    items: SAFETY,
    firstOpen: true,
    sourceMarker: "Source",
    photo: {
      image: { src: advikWhisper, alt: "A boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall window." },
      sizes: "(min-width: 1024px) 440px, (min-width: 900px) 40vw, calc(100vw - 32px)",
      variant: "wide",
    },
    notes,
    more: { label: "How to choose an AI toy", href: "/ai-toys-for-kids-in-india" },
  },
};

/** Buyer's guide fold 5: the portrait photo, clamped on tablets and laptops. */
export const PhotoGuide: Story = {
  args: {
    variant: "photo",
    items: HOME,
    photo: {
      image: { src: iraStory, alt: "A laughing girl in a peach kurta sitting cross-legged on a block-print bedsheet, telling Kheelu a story with both hands." },
      sizes: "(min-width: 900px) 360px, (min-width: 720px) 420px, calc(100vw - 32px)",
      clamp: true,
    },
  },
};

/** Store fold 5: the store's heading and the questions at the column's width. */
export const Store: Story = {
  args: { variant: "store", heading: { title: "Questions before you pay", id: "faq-title" }, items: STORE },
};
