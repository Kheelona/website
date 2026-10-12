import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Source } from "@/content/types";
import { ArticleBody } from "../ArticleBody/ArticleBody";
import { LATE_TALKERS_BODY, SOURCE_LABEL } from "../ArticleBody/ArticleBody.stories";
import { SourcesSection } from "./SourcesSection";

/* SourcesSection (task 3.4): the numbered notes the source markers point at (D026; DS gap G-18, composed). The lists
 * are the approved copy (story-*.html, the last block of the column; ai-toys-for-kids-in-india.html fold 5), story and
 * test data only (exported in capitals, left out of the story list). */

/** The heading the article notes and the guide's note open with. */
export const SOURCES_LABEL = "Sources";

export const LEARNING_TOYS_SOURCES: readonly Source[] = [
  {
    citation:
      "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
    href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
  },
  {
    citation: "Ministry of Human Resource Development (now Ministry of Education), Government of India, “National Education Policy 2020”, 2020, chapter 4, para 4.1, p. 11.",
    href: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
  },
  {
    citation: "Ministry of Human Resource Development (now Ministry of Education), Government of India, “National Education Policy 2020”, 2020, chapter 1, para 1.2, p. 7.",
    href: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
  },
  {
    citation:
      "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract and Results.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
  },
  {
    citation:
      "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
    href: "https://iris.who.int/handle/10665/311664",
  },
  {
    citation: "Indian Academy of Pediatrics, “Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents”, Indian Pediatrics, 2022, p. 239.",
    href: "https://www.indianpediatrics.net/mar2022/235.pdf",
  },
  {
    citation: "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families.",
    href: "https://doi.org/10.1542/peds.2016-2591",
  },
];

export const SAFE_AI_TOY_SOURCES: readonly Source[] = [
  { citation: "Fairplay, “AI Toys are NOT Safe for Kids” (advisory), 2025, opening paragraph.", href: "https://fairplayforkids.org/pf/aitoyadvisory/" },
  {
    citation:
      "Common Sense Media, “Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks” (press release), 22 January 2026, paragraph 1 and the list of findings.",
    href: "https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks",
  },
  {
    citation: "Common Sense Media Youth AI Safety Institute, “AI Toys” (risk assessment), 2026, “What we found” and “Where they fall short”.",
    href: "https://institute.commonsensemedia.org/risk-assessments/ai-toys",
  },
];

export const LATE_TALKERS_SOURCES: readonly Source[] = [
  {
    citation: "US Centers for Disease Control and Prevention, “Learn the Signs. Act Early.”: milestones by 3 years, 2026 (reviewed 16 May), Language/Communication and “act early”.",
    href: "https://www.cdc.gov/act-early/milestones/3-years.html",
  },
  {
    citation: "American Speech-Language-Hearing Association, “Communication Milestones: 3 to 4 Years” and “Communication Milestones: 2 to 3 Years”, undated pages.",
    href: "https://www.asha.org/public/developmental-milestones/communication-milestones-3-to-4-years/",
  },
  {
    citation:
      "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
    href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
  },
  {
    citation:
      "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract, Method and Discussion.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
  },
  {
    citation:
      "American Academy of Pediatrics and American Speech-Language-Hearing Association, “Young Children Learning Multiple Languages: Parent FAQs”, HealthyChildren.org, 2025 (updated 20 November).",
    href: "https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx",
  },
  {
    citation: "American Speech-Language-Hearing Association, “Late Language Emergence” (Practice Portal), undated, Assessment: Cultural and Linguistic Considerations.",
    href: "https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/",
  },
];

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
