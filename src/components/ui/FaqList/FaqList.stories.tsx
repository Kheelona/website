import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import { FaqList } from "./FaqList";

/* Story stand-in for the Icon primitive (task 2.2, built in the same wave): the same DS svg. */
const icon = (name: IconName) => (
  <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);

/* Home's questions (home.html fold 8), as RichText renders them, in the words faqs.ts prints since the live team's code
   check (D058; task 8b.1b). test/e2e/motion-faq.spec.ts runs on these stories. */
const items = [
  {
    id: "think-less",
    question: "Won’t an AI toy make my child think less?",
    answer:
      "That’s exactly what Kheelu is designed against. Most AI gives answers. Kheelu answers your child, then asks them a question back, so they do the thinking. It can’t browse the internet, and when it doesn’t know something, it says so instead of guessing. You can read every conversation in the parent app.",
  },
  {
    id: "ages",
    question: "What ages is Kheelu for?",
    answer:
      "Kheelu is made for children aged 3 to 7. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby. At setup, you enter your child’s age in the parent app. You can change it later. The AI model gets child-safety rules for that age, with Google’s safety filters on top.",
  },
  {
    id: "returns",
    question: "What if it isn’t right for us?",
    answer:
      "Return it within 7 days of delivery, no questions asked. Opened is fine: just send back everything that came in the box, undamaged. We arrange the pickup, free.",
  },
];

const meta = {
  title: "UI/FaqList",
  component: FaqList,
  args: { items, sign: icon("plus") },
  parameters: { layout: "padded" },
} satisfies Meta<typeof FaqList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every answer closed (Home, the product page, the store). */
export const Default: Story = {};

/** The first answer open at load. */
export const FirstOpen: Story = { args: { firstOpen: true } };

/** An answer with more blocks after its paragraph. */
export const WithDetail: Story = {
  args: {
    items: [
      {
        ...items[2],
        detail: (
          <ul>
            <li>Arrived faulty? Tell us within 7 days and we replace it.</li>
          </ul>
        ),
      },
    ],
  },
};
