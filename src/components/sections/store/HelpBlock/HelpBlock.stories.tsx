import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { HelpBlock } from "./HelpBlock";

/* HelpBlock (task 5.16): /thanks fold 5, the words from the content module. */

const meta = {
  title: "Sections/Store/HelpBlock",
  component: HelpBlock,
  parameters: { layout: "fullscreen" },
  args: { copy: confirmation.help },
  render: (args) => (
    <div className="kh-section ks-thanks">
      <div className="ks-thanks__col">
        <HelpBlock {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof HelpBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The approved fold: the help line, the undo, the refund page. */
export const Default: Story = {};
