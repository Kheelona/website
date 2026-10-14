import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { teamPage } from "@/content/en-IN/pages/team";
import { placeholder } from "@/lib/content/placeholder";
import type { FoundersSectionConfig } from "./founders-section.types";
import { FoundersSection } from "./FoundersSection";

/* FoundersSection (task 3.4): the team page's founder cards (team.html fold 3). Story and test data only (exported in
 * capitals, left out of the story list). FOUNDERS is the mockup's state, which the component's parity test compares:
 * the approved names and roles, a placeholder for each photo (B24) and each background gated (D038; its words here are
 * the mockup's placeholder notes); each card's words are the team page's own (src/content/en-IN/pages/team.ts), read,
 * never retyped, so the stories say what the site says (task 8b.1d: Aman's line in the live team's code-checked words,
 * D058; the parity test applies the same change to the frozen mockup). FOUNDERS_LIVE is the page's state since task 6.6
 * (D054 item 20): photos with their alts and the background lines shown, in stand-in words (the page's own are
 * team.ts's). */

const gated = { gated: { proof: "F11" } } as const;
const photo = placeholder("B24", "founder photo");

type PageSection = (typeof teamPage.sections)[number];
const fold = teamPage.sections.find((s): s is Extract<PageSection, { kind: "founders-section" }> => s.kind === "founders-section");
/** A founder's words on the team page (its fold 3 card's body). */
function wordsOf(name: string): string {
  const card = fold?.config.founders.find((f) => f.name === name);
  if (!card) throw new Error(`FoundersSection stories: the team page has no card for ${name}`);
  return card.body;
}

export const FOUNDERS: FoundersSectionConfig = {
  title: "The Kheelona {hand:founders.}",
  founders: [
    {
      name: "Apoorva Sahu",
      role: "Co-Founder and CEO",
      initials: "AS",
      photo,
      body: wordsOf("Apoorva Sahu"),
      bio: { text: "{ph:F11 Apoorva’s background, shown once its proof is filed}", ...gated },
      link: { label: "Apoorva on LinkedIn", href: "https://www.linkedin.com/in/sahu-apoorva/" },
    },
    {
      name: "Aman Soni",
      role: "Co-Founder and CTO",
      initials: "AS",
      photo,
      body: wordsOf("Aman Soni"),
      bio: { text: "{ph:F11 Aman’s background, shown once its proof is filed}", ...gated },
      link: { label: "Aman on LinkedIn", href: "https://www.linkedin.com/in/aman-soni-6b17b6223/" },
    },
    {
      name: "Kashyap C.R",
      role: "Co-Founder and Chief Hardware Officer",
      initials: "KC",
      photo,
      body: wordsOf("Kashyap C.R"),
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
