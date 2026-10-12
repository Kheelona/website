import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StepLoop } from "./StepLoop";

const meta = {
  title: "UI/StepLoop",
  component: StepLoop,
  args: {
    steps: [
      { title: "Check your email", body: "Your confirmation has your order number and a link back to this page.", tone: "sun" },
      { title: "Pay the balance", body: "When your Kheelu is ready to leave us, we send a payment link on WhatsApp.", tone: "blue" },
      { title: "Track your delivery", body: "When it is dispatched, we send you the courier and tracking details.", tone: "chilli" },
    ],
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof StepLoop>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The DS loop (the confirmation's "What happens next"). */
export const Loop: Story = {};

/** The guide's five checks: no arrows; one row from 1200 px. */
export const Checks: Story = {
  args: {
    variant: "checks",
    steps: [
      { title: "Does it have a screen or a camera?", body: "A screen gives your child something to watch. A camera can see your child and your home." },
      { title: "When is the microphone on?", body: "Ask what turns it on, how you can tell it’s listening, and when it switches off." },
      { title: "Can it reach the open internet?", body: "Ask where its answers come from." },
      { title: "Can you read every conversation?", body: "Ask whether you can read every word, and delete it yourself." },
      { title: "Does it speak your family’s languages?", body: "Ask which languages it speaks today, not which ones are coming." },
    ],
  },
};

/** Setup's four steps: two by two from 720 px, one row from 1024 px. */
export const Four: Story = {
  args: {
    variant: "four",
    steps: [
      { title: "Open the parent app.", body: "Follow the steps on screen. The app walks you through the rest.", tone: "sun" },
      { title: "Press and hold the button on Kheelu’s back.", body: "Hold it for 3 seconds, until the light starts pulsing blue.", tone: "blue" },
      { title: "Join Kheelu’s own Wi‑Fi.", body: "When the app asks, connect your phone to Kheelu’s own small Wi‑Fi network.", tone: "chilli" },
      { title: "Add your home Wi‑Fi.", body: "Finish in the app with your home Wi‑Fi password.", tone: "sun" },
    ],
  },
};
