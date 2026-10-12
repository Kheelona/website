import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SourceMarker } from "./SourceMarker";
import { SourcesNote } from "./SourcesNote";

/* A sourced line with its markers, then the note they point at, in the wording of the approved guide page. */
const meta = {
  title: "UI/SourceMarker",
  component: SourceMarker,
  parameters: { layout: "padded" },
  args: { n: 1, label: "Source" },
} satisfies Meta<typeof SourceMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <p className="kh-body">
      No more than an hour a day from age two until five.
      <SourceMarker {...args} />
      <SourceMarker {...args} n={2} />
    </p>
  ),
};

export const Article: Story = {
  args: { variant: "article" },
  render: Default.render,
};

export const WithSourcesNote: Story = {
  render: (args) => (
    <div>
      <p className="kh-body">
        No more than an hour a day from age two until five.
        <SourceMarker {...args} />
        <SourceMarker {...args} n={2} />
      </p>
      <SourcesNote
        label="Sources"
        sources={[
          {
            citation:
              "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
            href: "https://iris.who.int/handle/10665/311664",
          },
          {
            citation:
              "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families.",
            href: "https://doi.org/10.1542/peds.2016-2591",
          },
        ]}
      />
    </div>
  ),
};
