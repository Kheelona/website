import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { buildOffer } from "@/lib/offer/offer";
import type { StepsSectionConfig } from "./steps-section.types";
import { StepsSection, StepsTip } from "./StepsSection";

/* StepsSection (task 3.4): the DS StepLoop under its heading, in the three approved placements. The steps are the
 * approved copy, story and test data only (exported in capitals, left out of the story list). */

/** ai-toys-for-kids-in-india.html fold 2: the five checks, then the ghost link to the article. */
export const GUIDE_CHECKS: StepsSectionConfig = {
  variant: "checks",
  band: true,
  heading: {
    eyebrow: "The five checks",
    title: "Five things to {mark:check} before you buy an AI toy.",
    lead: "Each one is a question a maker should answer in a sentence. If the answer is vague, ask again.",
  },
  steps: [
    { title: "Does it have a screen or a camera?", body: "A screen gives your child something to watch. A camera can see your child and your home." },
    { title: "When is the microphone on?", body: "Ask what turns it on, how you can tell it’s listening, and when it switches off." },
    { title: "Can it reach the open internet?", body: "A toy that can browse can land on things you’d never choose for your child. Ask where its answers come from." },
    { title: "Can you read every conversation?", body: "A summary shows you what the maker chose to show. Ask whether you can read every word, and delete it yourself." },
    { title: "Does it speak your family’s languages?", body: "Ask which languages it speaks today, not which ones are coming." },
  ],
  action: { label: "Read more: what to look for in a safe AI toy", href: "/stories/what-to-look-for-in-a-safe-ai-toy" },
};

/** setup.html fold 3: four steps, two by two from 720 px, one row from 1024 px. */
export const SETUP_STEPS: StepsSectionConfig = {
  variant: "four",
  id: "connect",
  heading: { title: "Connect Kheelu to your {hand:home Wi‑Fi.}" },
  steps: [
    { tone: "sun", title: "Open the parent app.", body: "Follow the steps on screen. The app walks you through the rest." },
    { tone: "blue", title: "Press and hold the button on Kheelu’s back.", body: "Hold it for 3 seconds, until the light starts pulsing blue." },
    { tone: "chilli", title: "Join Kheelu’s own Wi‑Fi.", body: "When the app asks, connect your phone to Kheelu’s own small Wi‑Fi network." },
    { tone: "sun", title: "Add your home Wi‑Fi.", body: "Finish in the app with your home Wi‑Fi password. Kheelu then joins your home network." },
  ],
};

/** setup.html fold 2: the Wi-Fi tip under the "Before you start" list. */
export const SETUP_TIP = "Kheelu connects to 2.4 GHz Wi‑Fi. If your router shows two network names, choose the 2.4 GHz one.";

/** store-confirmation.html fold 4: what happens next, in the confirmation's column. */
export const THANKS_STEPS: StepsSectionConfig = {
  variant: "thanks",
  heading: { title: "What happens next" },
  steps: [
    { tone: "sun", title: "Check your email", body: "Your confirmation has your order number and a link back to this page." },
    {
      tone: "blue",
      title: "Pay the balance",
      body: "When your Kheelu is ready to leave us, we send a payment link for the {price:balance} balance on WhatsApp and by email.",
    },
    { tone: "chilli", title: "Track your delivery", body: "When it is dispatched, we send you the courier and tracking details." },
  ],
};

const offer = buildOffer("token");

const meta = {
  title: "Sections/StepsSection",
  component: StepsSection,
  excludeStories: /^[A-Z0-9_]+$/,
  args: { ...GUIDE_CHECKS, offer },
  parameters: { layout: "fullscreen" },
  /* Story args merge over these, so each placement below states its band and link itself. */
} satisfies Meta<typeof StepsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The guide's five checks: no arrows, the numeral beside each check on phones, one row from 1200 px. */
export const Checks: Story = {};

/** Setup's four steps in their tones. */
export const Four: Story = { args: { ...SETUP_STEPS, band: false, action: undefined, offer } };

/** The confirmation's three steps, the balance from the offer. */
export const Thanks: Story = {
  args: { ...THANKS_STEPS, band: false, action: undefined, offer },
  render: (args) => (
    <div className="kh-section">
      <div className="kh-container">
        <StepsSection {...args} />
      </div>
    </div>
  ),
};

/** Setup's Wi-Fi tip, the line that closes the "Before you start" fold above the steps. */
export const Tip: Story = {
  render: () => (
    <section className="kh-section kh-section--band">
      <div className="kh-container">
        <StepsTip text={SETUP_TIP} />
      </div>
    </section>
  ),
};
