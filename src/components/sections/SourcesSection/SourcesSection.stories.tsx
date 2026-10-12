import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Source } from "@/content/types";
import { ArticleBody } from "../ArticleBody/ArticleBody";
import { LATE_TALKERS_BODY, LATE_TALKERS_SOURCES, LEARNING_TOYS_SOURCES, SOURCE_LABEL, SOURCES_LABEL } from "../ArticleBody/ArticleBody.stories";
import { SourcesSection } from "./SourcesSection";

/* SourcesSection (task 3.4): the numbered notes the source markers point at (D026; DS gap G-18, composed). The lists
 * are the approved copy (story-*.html, the last block of the column, with the article fixtures in ArticleBody.stories;
 * ai-toys-for-kids-in-india.html fold 5 here), story and test data only (exported in capitals, left out of the story
 * list). */

/** ai-toys-for-kids-in-india.html fold 5: the note under the questions. */
export const GUIDE_SOURCES: readonly Source[] = [
  {
    citation:
      "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
    href: "https://iris.who.int/handle/10665/311664",
  },
  {
    citation: "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families.",
    href: "https://doi.org/10.1542/peds.2016-2591",
  },
];

const meta = {
  title: "Sections/SourcesSection",
  component: SourcesSection,
  excludeStories: /^[A-Z0-9_]+$/,
  args: { variant: "article", label: SOURCES_LABEL, sources: LEARNING_TOYS_SOURCES },
  parameters: { layout: "fullscreen" },
  render: (args) => <ArticleBody blocks={[]} after={<SourcesSection {...args} />} />,
} satisfies Meta<typeof SourcesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An article's notes, last in the reading column, under a hairline. */
export const Article: Story = {};

/** The notes after a part, as the column spaces them; a marker in the text jumps to its note. */
export const ArticleAfterText: Story = {
  args: { sources: LATE_TALKERS_SOURCES },
  render: (args) => <ArticleBody blocks={LATE_TALKERS_BODY.slice(1, 2)} sourceLabel={SOURCE_LABEL} after={<SourcesSection {...args} />} />,
};

/** The buyer's guide's note under its questions: captions, the site's name as the link. */
export const Inline: Story = {
  args: { variant: "inline", sources: GUIDE_SOURCES },
  render: (args) => (
    <section className="kh-section">
      <div className="kh-container">
        <SourcesSection {...args} />
      </div>
    </section>
  ),
};
