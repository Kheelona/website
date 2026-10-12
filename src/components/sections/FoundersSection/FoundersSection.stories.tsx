import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { placeholder } from "@/lib/content/placeholder";
import type { FoundersSectionConfig } from "./founders-section.types";
import { FoundersSection } from "./FoundersSection";

/* FoundersSection (task 3.4): the team page's founder cards (team.html fold 3). The cards are the approved copy, story
 * and test data only (exported in capitals, left out of the story list). The backgrounds are proof-gated (D038, F11)
 * and never render while gated; their words here are the mockup's placeholder notes, never the unproven credentials.
 * The photos wait on B24 and show a placeholder. */

const gated = { gated: { proof: "F11" } } as const;
const photo = placeholder("B24", "founder photo");

export const FOUNDERS: FoundersSectionConfig = {
  title: "The Kheelona {hand:founders.}",
  founders: [
    {
      name: "Apoorva Sahu",
      role: "Co-Founder and CEO",
      initials: "AS",
      photo,
      body: "Apoorva leads Kheelona and owns the promise we make to your family.",
      bio: { text: "{ph:F11 Apoorva’s background, shown once its proof is filed}", ...gated },
      link: { label: "Apoorva on LinkedIn", href: "https://www.linkedin.com/in/sahu-apoorva/" },
    },
    {
      name: "Aman Soni",
      role: "Co-Founder and CTO",
      initials: "AS",
      photo,
      body: "Aman builds the part your child talks to: how Kheelu listens and replies, and the safety layer every reply passes. He is also our grievance officer.",
      bio: { text: "{ph:F11 Aman’s background, shown once its proof is filed}", ...gated },
      link: { label: "Aman on LinkedIn", href: "https://www.linkedin.com/in/aman-soni-6b17b6223/" },
    },
    {
      name: "Kashyap C.R",
      role: "Co-Founder and Chief Hardware Officer",
      initials: "KC",
      photo,
      body: "Kashyap builds the toy itself: the hardware inside the plush, and how it is powered and charged.",
      bio: { text: "{ph:F11 Kashyap’s background, shown once its proof is filed}", ...gated },
      link: { label: "Kashyap on LinkedIn", href: "https://www.linkedin.com/in/kashyap-c-r-7ba18177/" },
    },
  ],
};

const meta = {
  title: "Sections/FoundersSection",
  component: FoundersSection,
  excludeStories: /^[A-Z0-9_]+$/,
  args: FOUNDERS,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FoundersSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** As it ships today: initials badges, the photo placeholder (B24), backgrounds hidden until their proof is filed. */
export const Gated: Story = {};

/** Once a background's proof is filed, its line shows under the card's words (the gate removed in content). */
export const BioFiled: Story = {
  args: { founders: FOUNDERS.founders.map((f) => ({ ...f, bio: f.bio && { text: f.bio.text } })) },
};

/** Once the founders' photos are approved (B24): the photo takes the badge's place, beside the name. */
export const WithPhoto: Story = {
  args: {
    founders: FOUNDERS.founders.map((f) => ({ ...f, photo: { src: "/media/kheelu-front.jpg", width: 1200, height: 1200, alt: "" } })),
  },
};
