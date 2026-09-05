import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SourcesList } from "./SourcesList";

const meta = {
  title: "Molecules/SourcesList",
  component: SourcesList,
} satisfies Meta<typeof SourcesList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Three: Story = {
  args: {
    sources: [
      { label: "WHO: Guidelines on physical activity, sedentary behaviour and sleep for children under 5 (2019)", url: "https://www.ncbi.nlm.nih.gov/books/NBK541169/" },
      { label: "Indian Academy of Pediatrics: Guidelines on screen time and digital wellness (2022)", url: "https://pubmed.ncbi.nlm.nih.gov/34969943/" },
      { label: "American Academy of Pediatrics: Media and Young Minds (2016)", url: "https://publications.aap.org/pediatrics/article/138/5/e20162591/60503/Media-and-Young-Minds" },
    ],
  },
};

export const Empty: Story = { args: { sources: [] } };
