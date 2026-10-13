import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { placeholder } from "@/lib/content/placeholder";
import type { FoundersSectionConfig } from "./founders-section.types";
import { FoundersSection } from "./FoundersSection";

/* FoundersSection (task 3.4): the team page's founder cards (team.html fold 3). Story and test data only (exported in
 * capitals, left out of the story list). FOUNDERS is the mockup's state, which the component's parity test compares:
 * the approved names, roles and words, a placeholder for each photo (B24) and each background gated (D038; its words
 * here are the mockup's placeholder notes). FOUNDERS_LIVE is the page's state since task 6.6 (D054 item 20): photos with
 * their alts and the background lines shown, in stand-in words (the page's own are src/content/en-IN/pages/team.ts). */

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

/** The page's state since task 6.6: each founder's photo (a live file's shape, 480 x 480) with its alt, and the
 *  background line shown. Stand-in alts and lines. */
export const FOUNDERS_LIVE: FoundersSectionConfig = {
  ...FOUNDERS,
  founders: FOUNDERS.founders.map((f, i) => ({
    ...f,
    photo: { src: "/team/apoorva.jpg", width: 480, height: 480, alt: i === 0 ? "A founder, as the photo shows them." : `Founder ${i + 1}, as the photo shows them.` },
    bio: { text: `Founder ${i + 1}’s background, in a line.` },
  })),
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

/** The mockup's state: initials badges, the photo placeholder (B24), backgrounds gated (D038). */
export const Gated: Story = {};

/** As the team page ships it (task 6.6, D054 item 20): the photos with their alts, the background lines shown. */
export const Live: Story = { args: FOUNDERS_LIVE };

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
