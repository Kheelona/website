import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CompareByCategory } from "./CompareByCategory";

/* CompareByCategory (task 3.3): Home fold 7 with its approved words (home.html:270-307). Narrower than 720 px it shows
   the phone cards, from 720 px the DS table. */

const meta = {
  title: "Sections/CompareByCategory",
  component: CompareByCategory,
  args: {
    heading: {
      eyebrow: "Compare",
      title: "Other AI gives answers. Kheelu {hand:asks questions.}",
      lead: "Thinking out loud, not tapping on a screen.",
      id: "compare-title",
    },
    label: "Comparison by kind of product",
    firstColumn: "What matters",
    columns: { us: "Kheelu", others: ["Puzzles and activity books", "Learning apps and videos", "Smart speakers and chatbots"] },
    rows: [
      {
        label: "Screen-free",
        us: { mark: "yes", text: "Yes" },
        others: [{ mark: "yes", text: "Yes" }, { mark: "no", text: "No" }, { mark: "some", text: "Varies" }],
        phone: { us: "Kheelu: Yes", others: ["Puzzles and activity books: yes", "Learning apps and videos: no", "Smart speakers and chatbots: varies"] },
      },
      {
        label: "Holds a back-and-forth conversation",
        us: { mark: "yes", text: "Yes" },
        others: [{ mark: "no", text: "No" }, { mark: "some", text: "Rarely: mostly tapping and watching" }, { mark: "yes", text: "Yes" }],
        phone: {
          us: "Kheelu: Yes",
          others: ["Puzzles and activity books: no", "Learning apps and videos: rarely, mostly tapping and watching", "Smart speakers and chatbots: yes"],
        },
      },
      {
        label: "Asks your child a question back",
        us: { mark: "yes", text: "Yes, after it answers" },
        others: [{ mark: "no", text: "No" }, { mark: "some", text: "Some ask quiz questions" }, { mark: "some", text: "Usually just answers" }],
        phone: {
          us: "Kheelu: Yes, after it answers",
          others: ["Puzzles and activity books: no", "Learning apps and videos: some ask quiz questions", "Smart speakers and chatbots: usually just answer"],
        },
      },
      {
        label: "You can read every conversation",
        us: { mark: "yes", text: "Yes, in the parent app" },
        others: [{ mark: "some", text: "Nothing to read" }, { mark: "some", text: "Nothing to read" }, { mark: "some", text: "Varies" }],
        phone: {
          us: "Kheelu: Yes, in the parent app",
          others: ["Puzzles and activity books: nothing to read", "Learning apps and videos: nothing to read", "Smart speakers and chatbots: varies"],
        },
      },
    ],
    caption: "Kinds of products, not brands: what each one usually does.",
    link: { label: "How to choose an AI toy", href: "/ai-toys-for-kids-in-india", cta: "compare-learn" },
  },
} satisfies Meta<typeof CompareByCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home fold 7: cards below 720 px, the table from 720 px, then the guide link (`compare-learn`). */
export const Home: Story = {};
