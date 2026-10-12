import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import { CompareTable } from "./CompareTable";

/* Story stand-in for the Icon primitive (task 2.2, built in the same wave): the same DS svg. */
const icon = (name: IconName) => (
  <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);
const yes = (text: string) => ({ mark: "yes" as const, icon: icon("check"), text });
const no = { mark: "no" as const, icon: icon("x"), text: "No" };
const some = (text: string) => ({ mark: "some" as const, text });

const meta = {
  title: "UI/CompareTable",
  component: CompareTable,
  args: {
    label: "Comparison by kind of product",
    firstColumn: "What matters",
    columns: ["Kheelu", "Puzzles and activity books", "Learning apps and videos", "Smart speakers and chatbots"],
    usIndex: 0,
    rows: [
      { label: "Screen-free", cells: [yes("Yes"), yes("Yes"), no, some("Varies")] },
      { label: "Holds a back-and-forth conversation", cells: [yes("Yes"), no, some("Rarely: mostly tapping and watching"), yes("Yes")] },
      { label: "Asks your child a question back", cells: [yes("Yes, after it answers"), no, some("Some ask quiz questions"), some("Usually just answers")] },
    ],
    caption: "Kinds of products, not brands: what each one usually does.",
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof CompareTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Home's comparison (shown from 720 px). */
export const Default: Story = {};
/** The privacy page's recipients table: plain cells, no Kheelu column. */
export const Plain: Story = {
  args: {
    label: "Everyone who handles your data, and where",
    firstColumn: "Who",
    columns: ["What they do for us", "Where"],
    usIndex: undefined,
    rows: [
      { label: "Razorpay", cells: [{ text: "Takes your payment" }, { text: <span className="ks-placeholder">[PLACEHOLDER: region]</span> }] },
      { label: "PostHog", cells: [{ text: "Taps, screen replays and errors on this site" }, { text: "United States" }] },
    ],
    caption: undefined,
  },
};
