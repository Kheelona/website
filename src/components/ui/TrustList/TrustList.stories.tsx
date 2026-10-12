import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Image from "next/image";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import { TrustList } from "./TrustList";

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

const titled = [
  {
    icon: icon("microphone"),
    title: "You’ll always see when it’s listening.",
    body: "Its microphone turns on only when someone presses the wake-up button. A light on Kheelu shows whenever it’s listening.",
  },
  { icon: icon("eye"), title: "You can read every conversation.", body: "In the parent app. Delete any of them in one tap." },
  { icon: icon("hand-heart"), title: "We don’t sell your data.", body: "Your child’s data is never used to advertise to them." },
];

const meta = {
  title: "UI/TrustList",
  component: TrustList,
  args: {
    items: [
      { icon: icon("eye"), body: "Read every conversation in the parent app, word for word." },
      { icon: icon("sliders-horizontal"), body: "You set your child’s age in the app, and the age-graded safety layer follows it." },
    ],
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof TrustList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bodies only, as a ul (home.html fold 5). */
export const Default: Story = {};
/** Titled items as articles (home.html fold 6). */
export const Articles: Story = { args: { as: "div", items: titled } };
/** A numbered list (safety.html, the guide's answers). */
export const Numbered: Story = { args: { as: "ol", items: titled } };
/** The article's facts: bold lead-ins inside a body-step paragraph, and the belly unit's photo as the last cell. */
export const Facts: Story = {
  args: {
    variant: "facts",
    bodyType: "body",
    items: [
      { icon: icon("microphone"), title: "The microphone.", body: "It turns on only when someone presses the wake-up button." },
      { icon: icon("question"), title: "When it doesn’t know.", body: "It says so, instead of guessing." },
    ],
    children: (
      <figure className="kh-photo kh-photo--square">
        <Image src={KHEELU.src} width={KHEELU.width} height={KHEELU.height} sizes="(min-width: 720px) 240px, 50vw" alt={KHEELU.alt} />
      </figure>
    ),
  },
};
