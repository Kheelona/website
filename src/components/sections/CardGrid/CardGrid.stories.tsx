import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardGrid } from "./CardGrid";

/* CardGrid (task 3.3): Home's guides for parents (home.html fold 7b) and the contact page's route cards (contact.html
   fold 2), with their approved words. */

const meta = {
  title: "Sections/CardGrid",
  component: CardGrid,
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 7b: three topic cards on the band, revealing once. */
export const Guides: Story = {
  args: {
    variant: "guides",
    band: true,
    heading: {
      eyebrow: "Guides for parents",
      title: "How we can {nowrap:{hand:help},} from 3 to 7.",
      lead: "Short, sourced guides from the Kheelona team, for the questions every parent of a young child asks.",
      id: "guides-title",
      align: "center",
    },
    items: [
      {
        tone: "blue",
        icon: "clock",
        title: "Screen time",
        body: "How much, which rules hold up, and what to do when the screen goes off.",
        links: [{ label: "Read the screen-time guides", href: "/stories#screen-time" }],
      },
      {
        tone: "sun",
        icon: "translate",
        title: "Talking and language",
        body: "Getting your child talking, late talkers, new words and two languages at home.",
        links: [{ label: "Read the talking guides", href: "/stories#talking" }],
      },
      {
        tone: "chilli",
        icon: "puzzle-piece",
        title: "Learning and play",
        body: "What a young child is working on, and the toys and habits that serve it.",
        links: [{ label: "Read the learning guides", href: "/stories#learning" }],
      },
    ],
  },
};

/** Contact fold 2: five route cards, two from 720 px, three then two from 1024 px. */
export const Routes: Story = {
  args: {
    variant: "routes",
    band: true,
    heading: { title: "Pick the route that {hand:fits.}", id: "routes-title" },
    items: [
      {
        tone: "sun",
        icon: "question",
        title: "Before you order",
        body: "What Kheelu does, what it costs and the questions parents ask are on the Meet Kheelu page.",
        links: [{ label: "Meet Kheelu", href: "/products/kheelu" }],
      },
      {
        tone: "blue",
        icon: "package",
        title: "About your order",
        body: "Message or call us with your order number. Until we dispatch it, you can change your address, or cancel for a full refund.",
        links: [{ label: "Message us on WhatsApp", href: "https://wa.me/919187546483", ariaLabel: "Message us on WhatsApp about your order" }],
      },
      {
        tone: "chilli",
        icon: "users-three",
        title: "More than one Kheelu",
        body: "Each pre-order is for one Kheelu. For more, message us on WhatsApp.",
        links: [{ label: "Message us on WhatsApp", href: "https://wa.me/919187546483", ariaLabel: "Message us on WhatsApp about more than one Kheelu" }],
      },
      {
        tone: "sun",
        icon: "arrow-counter-clockwise",
        title: "Returns, refunds and delivery",
        body: "7-day returns, no questions asked, and a 6-month warranty. Delivery is included anywhere in India.",
        links: [
          { label: "Refunds and returns", href: "/refund" },
          { label: "Shipping", href: "/shipping" },
        ],
      },
      {
        tone: "blue",
        icon: "shield-check",
        title: "Safety and privacy",
        body: "When the microphone is on, where your child’s voice goes and what you can delete, in plain words.",
        links: [
          { label: "Safety", href: "/safety" },
          { label: "Privacy", href: "/privacy" },
        ],
      },
    ],
  },
};

/** Plain cards in two DS columns. */
export const Plain: Story = {
  args: {
    variant: "plain",
    columns: 2,
    heading: { title: "Two plain cards", id: "plain-title" },
    items: [
      { title: "AI mode", body: "Open conversation, on your home Wi‑Fi. It can’t browse the internet.", icon: "wifi-high", tone: "blue" },
      { title: "Story mode", body: "Stories, poems and jingles your child enjoys and learns from. No Wi‑Fi needed.", icon: "book-open", tone: "sun" },
    ],
  },
};
