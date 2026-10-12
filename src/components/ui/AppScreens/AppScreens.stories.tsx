import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import appActivity from "@/assets/app/app-activity.webp";
import appPrivacy from "@/assets/app/app-privacy.webp";
import appTranscript from "@/assets/app/app-transcript.webp";
import { AppScreens } from "./AppScreens";

/* AppScreens (task 2.3; D044, D046). The four approved placements; alt texts and caption as the mockup. */

const CAPTION = "The Kheelona app is live on Apple’s App Store and the Google Play Store.";
const ONE_PHONE = "(min-width: 1024px) 280px, (min-width: 900px) 22vw, calc((100vw - 48px) / 2)";

const meta = {
  title: "UI/AppScreens",
  component: AppScreens,
  decorators: [
    (Story) => (
      <div className="kh-section">
        <div className="kh-container">
          <div className="kh-split">
            <div />
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  args: {
    variant: "home",
    sizes: ONE_PHONE,
    caption: CAPTION,
    screens: [
      { src: appTranscript, alt: "The parent app showing one conversation word for word: Kheelu greets Aarav, and when he asks for Hindi, Kheelu answers in Hindi." },
      { src: appActivity, alt: "The parent app's activity screen for today: 22 minutes of talking, 3 chats and 9 questions asked, with today's chats listed." },
    ],
  },
} satisfies Meta<typeof AppScreens>;

export default meta;
type Story = StoryObj<typeof meta>;

const PRIVACY = {
  src: appPrivacy,
  alt: "The parent app's privacy centre: keep chats for 36 months, a switch to save voice recordings, download your child's data, delete all chats, and links to the privacy policy, terms and the grievance officer.",
};

/** Home fold 5 (home.html:219-225). */
export const HomeTwo: Story = { args: { reveal: true } };

/** Home fold 6 (home.html:246-249): one phone, exactly as wide as each of two (D046). */
export const HomeOne: Story = { args: { screens: [PRIVACY], reveal: true } };

/** Product fold 5 (meet-kheelu.html:215-221). */
export const ProductTwo: Story = { args: { variant: "product", reveal: true } };

/** Product fold 6 (meet-kheelu.html:245-248): one phone standing alone. */
export const ProductSolo: Story = { args: { variant: "product", screens: [PRIVACY], reveal: true } };
