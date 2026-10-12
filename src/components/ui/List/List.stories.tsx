import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import { List } from "./List";

/* Story stand-in for the Icon primitive (task 2.2, built in the same wave): the same DS svg. */
const icon = (name: IconName) => (
  <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);

const meta = {
  title: "UI/List",
  component: List,
  args: {
    chevron: icon("caret-right"),
    items: [
      { title: "Home", sub: "What Kheelu is, on one page.", href: "/", icon: icon("house"), tone: "sun" },
      { title: "Stories", sub: "Guides for parents of 3 to 7 year olds.", href: "/stories", icon: icon("book-open"), tone: "blue" },
      { title: "Contact", sub: "WhatsApp, call or email the team.", href: "/contact", icon: icon("chat-circle-dots"), tone: "sun" },
    ],
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The 404's link rows. */
export const LinkRows: Story = {};
/** Related guides: title and chevron. */
export const Related: Story = {
  args: {
    items: [
      { title: "What actually builds a sharp brain in the early years", href: "/stories#learning" },
      { title: "A toy that talks is not a toy that listens", href: "/stories#talking" },
    ],
  },
};
/** The hub's quiet rows: an h3 title and a line, no link. */
export const QuietRows: Story = {
  args: {
    titleAs: "h3",
    chevron: undefined,
    items: [
      { title: "Busy hands, no screens", sub: "Screen-free ways to keep a young child busy at home." },
      { title: "Screen-free does not mean silent", sub: "What a childhood full of talk looks like, without a single screen." },
    ],
  },
};
