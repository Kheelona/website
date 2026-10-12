import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, ICON_VIEWBOX } from "@/assets/icons.generated";
import { Breadcrumbs } from "./Breadcrumbs";

const meta = {
  title: "UI/Breadcrumbs",
  component: Breadcrumbs,
  args: {
    label: "Breadcrumb",
    trail: [
      { name: "Stories", path: "/stories" },
      { name: "Learning and play", path: "/stories#learning" },
    ],
    /* Story stand-in for the Icon primitive (task 2.2, built in the same wave): the same DS svg. */
    separator: (
      <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
        <path d={ICON_PATHS["caret-right"]} />
      </svg>
    ),
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An article's trail (story-learning-toys-for-a-three-year-old.html). */
export const Default: Story = {};
