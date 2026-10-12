import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import { Icon } from "./Icon";

/* A DS icon decorative and labelled, and the whole set at the DS large icon size. */
const meta = {
  title: "UI/Icon",
  component: Icon,
  parameters: { layout: "padded" },
  args: { name: "arrow-right" },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Decorative: Story = {};
export const Labelled: Story = { args: { name: "shield-check", label: "Safe" } };

export const AllIcons: Story = {
  render: () => (
    <div className="kh-icon-grid">
      {(Object.keys(ICON_PATHS) as IconName[]).map((name) => (
        <div key={name} className="kh-icon-cell">
          <Icon name={name} />
          {name}
        </div>
      ))}
    </div>
  ),
};
