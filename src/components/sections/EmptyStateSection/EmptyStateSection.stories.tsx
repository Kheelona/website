import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { EmptyStateSectionConfig } from "./empty-state-section.types";
import { EmptyStateSection } from "./EmptyStateSection";

/* EmptyStateSection (task 3.4): the 404's first fold (404.html fold 1). The words and links are the approved copy,
 * story and test data only (exported in capitals, left out of the story list); the 404 page (task 5.10) passes them
 * from pages/not-found.ts. */

export const NOT_FOUND: EmptyStateSectionConfig = {
  icon: "magnifying-glass",
  tone: "blue",
  eyebrow: "Page not found",
  title: "We can’t find that page.",
  lead: "The link may be old, or the address may have a typo. Where were you headed?",
  nav: {
    label: "Where to go next",
    links: [
      { icon: "house", tone: "sun", title: "Home", sub: "What Kheelu is, on one page.", href: "/" },
      { icon: "heart", tone: "chilli", title: "Meet Kheelu", sub: "The toy, its three modes and the price.", href: "/products/kheelu" },
      { icon: "book-open", tone: "blue", title: "Stories", sub: "Guides for parents of 3 to 7 year olds.", href: "/stories" },
      { icon: "chat-circle-dots", tone: "sun", title: "Contact", sub: "WhatsApp, call or email the team.", href: "/contact" },
    ],
  },
};

const meta = {
  title: "Sections/EmptyStateSection",
  component: EmptyStateSection,
  excludeStories: /^[A-Z0-9_]+$/,
  args: NOT_FOUND,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmptyStateSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The 404: the band, the icon circle, the one h1, then four full-width link rows. */
export const NotFound: Story = {};
