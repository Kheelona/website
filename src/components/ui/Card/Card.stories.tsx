import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import { Card } from "./Card";

/* Story stand-in for the Icon primitive (task 2.2, built in the same wave): the same DS svg. */
const icon = (name: IconName) => (
  <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);

const meta = {
  title: "UI/Card",
  component: Card,
  args: {
    tone: "blue",
    icon: icon("wifi-high"),
    title: "AI mode",
    body: "Open conversation, on your home Wi‑Fi. It can’t browse the internet.",
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A plain feature card (home.html fold 4). */
export const Plain: Story = {};
/** Tinted (home.html fold 3). */
export const Tint: Story = {
  args: { variant: "tint", tone: "sun", icon: icon("question"), title: "Where Kheelu comes in", body: "Kheelu answers your child, then asks a question back." },
};
/** Block (DS variant). */
export const Block: Story = { args: { variant: "block", tone: "chilli", icon: icon("bluetooth"), title: "Bluetooth mode", body: "Pair your phone and use it as a speaker." } };
/** A guide card with its link (home.html fold 7b). */
export const WithLink: Story = {
  args: {
    as: "div",
    tone: "blue",
    icon: icon("clock"),
    title: "Screen time",
    body: "How much, which rules hold up, and what to do when the screen goes off.",
    link: { href: "/stories#screen-time", label: "Read the screen-time guides", icon: icon("arrow-right") },
  },
};
/** A route card's link as a full tap target (contact.html, DS gap G-01). */
export const TapLink: Story = {
  args: {
    tone: "sun",
    icon: icon("arrow-counter-clockwise"),
    title: "Returns, refunds and delivery",
    body: "7-day returns, no questions asked, and a 6-month warranty.",
    link: { href: "/refund", label: "Refunds and returns", icon: icon("arrow-right"), tap: true },
  },
};
/** The hub's guide card: the title in the subtitle step. */
export const HubTitle: Story = {
  args: {
    tone: undefined,
    icon: undefined,
    titleType: "subtitle",
    title: "Late talker? What helps a child find their words",
    body: "What helps a 3 to 7 year old who talks later or less than others.",
    link: { href: "/stories/talking-toys-and-late-talkers", label: "Read the guide · 3 min read", icon: icon("arrow-right"), tap: true },
  },
};
/** The product page's compact mode row: the words grouped beside the icon. */
export const GroupText: Story = { args: { groupText: true } };
