import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/Button/Button";
import { Actions } from "@/components/ui/Layout/Layout";
import { films, filmsStrip } from "@/content/en-IN/films";
import { FilmsStrip } from "./FilmsStrip";

/* FilmsStrip (task 3.3): the seven parent films (D040) as Home (fold 2), the product page (fold 2) and the store
   (fold 6) show them, with the films and the strip's labels from content (content/en-IN/films.ts, task 3.6) and the
   files under public/video/moments (Storybook serves public/). test/e2e/films.spec.ts and motion-films.spec.ts run on
   these stories, so they test what the pages publish. The CTA block after Home's strip is the page's (CtaBlock, task
   3.2); a plain chilli button stands in for it. */

const meta = {
  title: "Sections/FilmsStrip",
  component: FilmsStrip,
  args: {
    heading: {
      eyebrow: "See it ask",
      title: "Kheelu asks. Watch them {hand:think.}",
      lead: "Real children, real families. Press play on any of them.",
      id: "ask-title",
    },
    films,
    labels: filmsStrip,
    proof: { text: "Kids doing the talking. Parents, in their own words.", size: "body-s" },
    posters: "eager-low",
  },
} satisfies Meta<typeof FilmsStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 2: the first three posters eager at low priority, then the CTA block. */
export const Home: Story = {
  args: {
    after: (
      <Actions center>
        <Button variant="cta" size="l" cta="see-it-ask" href="/store">
          Pre-order Kheelu
        </Button>
      </Actions>
    ),
  },
};

/** The product page's fold 2 (`#films`): every poster lazy, the consent line in the caption style. */
export const Product: Story = {
  args: {
    id: "films",
    heading: {
      eyebrow: "Real homes",
      title: "Real families, in their {hand:own homes.}",
      lead: "Watch the children do the thinking. Then hear from two of their parents.",
      id: "films-title",
    },
    proof: { text: "Shared with each family’s written consent.", size: "caption" },
    posters: "lazy",
  },
};

/** The store's fold 6: below every money answer, with the way back to the form. */
export const Store: Story = {
  args: {
    heading: { title: "See Kheelu {nowrap:{hand:ask},} in real homes.", lead: "Real children in real homes. Press play on any of them.", id: "ask-title" },
    posters: "lazy",
    link: { label: "Back to your details", href: "#details", iconEnd: "caret-up" },
  },
};
