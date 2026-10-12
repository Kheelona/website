import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { seller } from "@/content/en-IN/seller";
import { GrievanceBlock } from "./GrievanceBlock";

/* GrievanceBlock (task 3.2): the D032 block from the one content value, in its two contexts. */

const meta: Meta<typeof GrievanceBlock> = {
  title: "Sections/GrievanceBlock",
  component: GrievanceBlock,
  args: {
    context: "contact",
    title: "Make a formal complaint.",
    intro: "If something has gone wrong and we haven’t put it right, you can complain formally to our grievance officer. Please include your order number.",
    line: seller.grievance.line,
  },
};

export default meta;
type Story = StoryObj<typeof GrievanceBlock>;

/** `contact`: the contact page's fold 3, `#grievance` (links 800). */
export const Contact: Story = {};

/** `legal`: the card in a legal page's part (links take the legal template's 700, task 4.3), shown here in a DS section. */
export const Legal: Story = {
  args: { context: "legal", line: seller.grievance.line },
  render: (args) => (
    <section className="kh-section">
      <div className="kh-container">
        <GrievanceBlock {...args} />
      </div>
    </section>
  ),
};
