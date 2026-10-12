import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/Button/Button";
import { Actions } from "@/components/ui/Layout/Layout";
import { FilmsStrip } from "./FilmsStrip";
import type { FilmTile } from "./films-strip.types";

/* FilmsStrip (task 3.3): the seven parent films (D040) as Home (fold 2), the product page (fold 2) and the store
   (fold 6) show them, with the films' approved words and the files under public/video/moments (Storybook serves
   public/). test/e2e/films.spec.ts and motion-films.spec.ts run on these stories. The CTA block after Home's strip is
   the page's (CtaBlock, task 3.2); a plain chilli button stands in for it. */

const film = (id: string, chip: string, caption: string, duration: FilmTile["duration"], alt: string): FilmTile => ({
  id,
  chip,
  caption,
  duration,
  poster: { src: `/video/moments/${id}.jpg`, width: 1080, height: 1920, alt },
  video: `/video/moments/${id}.mp4`,
});

const FILMS: FilmTile[] = [
  film("learning-by-asking", "Learning by asking", "Kheelu asks her to explain carrom, and thanks her for the reminder.", "0:30", "A young girl on a playmat holding the cream Kheelu plush."),
  film("first-conversations", "Real families", "Children asking Kheelu their own questions, in their own languages.", "0:38", "Children talking to the cream Kheelu plush."),
  film("a-parent-speaks", "In a parent’s words", "Nikita on what changed when the toy spoke back.", "0:46", "A parent speaking to camera at home."),
  film("a-mother-joins-in", "A mother joins in", "Arha’s mother asks the questions, and Kheelu answers her by name.", "0:28", "A girl and her mother on a sofa with the cream Kheelu plush."),
  film("counting-out-loud", "Counting out loud", "Three bricks and two more, worked out on the floor with Kheelu.", "0:31", "A boy on the floor with Lego bricks and the cream Kheelu plush."),
  film("a-story-in-two-languages", "Two languages", "In AI mode, Arha switches to English, and Kheelu switches with her.", "0:31", "A girl on a sofa beside the cream Kheelu plush."),
  film("a-father-speaks", "A father’s view", "Siddhant’s father on what play away from a screen looks like.", "0:30", "A father seated at home, speaking to camera."),
];

const LABELS = { listLabel: "Seven films of families with Kheelu", previous: "Previous video", next: "Next video", length: "Length", play: "Play:", of: "of" };

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
    films: FILMS,
    labels: LABELS,
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
      title: "Seven families, in their {hand:own homes.}",
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
