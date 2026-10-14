import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Image from "next/image";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import { Card } from "./Card";

/* A stable public image (public/media/kheelu-front.jpg, task 1.5) standing in for the page's photo. */
const KHEELU = {
  src: "/media/kheelu-front.jpg",
  width: 1200,
  height: 1200,
  alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
};

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
/** Block (DS variant; no approved page uses it). Shown on Sunshine, ink on the fill: on Chilli or Kheelu Blue the DS
 *  puts white text on the fill, which fails AA contrast (DS gap G-02). */
export const Block: Story = { args: { variant: "block", tone: "sun", icon: icon("bluetooth"), title: "Bluetooth mode", body: "Pair your phone and use it as a speaker." } };
/** A guide card with its link (home.html fold 7b). */
export const WithLink: Story = {
  args: {
    as: "div",
    tone: "blue",
    icon: icon("clock"),
    title: "Screen time",
    body: "How much, what the guidelines say, and what to do when the screen goes off.",
    link: { href: "/stories#screen-time", label: "Read the screen-time guides", icon: icon("arrow-right") },
  },
};
/** A single card link as a full tap target (the team page's founder cards, DS gap G-01). */
export const TapLink: Story = {
  args: {
    tone: undefined,
    icon: undefined,
    title: "Apoorva Sahu",
    body: "Apoorva leads Kheelona and owns the promise we make to your family.",
    link: { href: "https://www.linkedin.com/in/sahu-apoorva/", label: "Apoorva on LinkedIn", icon: icon("arrow-right"), tap: true },
  },
};
/** A contact route card (contact.html fold 2): its links row at the foot, each link a full tap target (G-01). */
export const LinksRow: Story = {
  args: {
    tone: "sun",
    icon: icon("arrow-counter-clockwise"),
    title: "Returns, refunds and delivery",
    body: "7-day returns, no questions asked, and a 6-month warranty. Delivery is included anywhere in India.",
    links: [
      { href: "/refund", label: "Refunds and returns", icon: icon("arrow-right") },
      { href: "/shipping", label: "Shipping", icon: icon("arrow-right") },
    ],
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
/** The product page's Good to know card (meet-kheelu.html fold 4): a classed text group (title and a tick list), then
 *  the photo in the trailing slot. Its layout classes are ModesSection's (task 3.3). */
export const GoodToKnow: Story = {
  args: {
    variant: "tint",
    tone: "sun",
    icon: undefined,
    body: undefined,
    title: "Good to know",
    titleId: "know-title",
    labelledBy: "know-title",
    groupText: true,
    groupClassName: "ks-know__text",
    children: (
      <ul>
        <li>AI mode needs your home Wi‑Fi. Story mode and Bluetooth mode work without it.</li>
      </ul>
    ),
    after: <Image src={KHEELU.src} width={KHEELU.width} height={KHEELU.height} sizes="(min-width: 720px) 240px, 50vw" alt={KHEELU.alt} />,
  },
};
