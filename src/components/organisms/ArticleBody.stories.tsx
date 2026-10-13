import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleBody } from "./ArticleBody";

const meta = {
  title: "Organisms/ArticleBody",
  component: ArticleBody,
} satisfies Meta<typeof ArticleBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EveryBlock: Story = {
  args: {
    doc: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Every answered question teaches two things at once." }] },
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Why talking beats watching" }] },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Read the " },
            { type: "text", text: "Safety page", marks: [{ type: "link", attrs: { href: "/safety" } }] },
            { type: "text", text: " and the " },
            { type: "text", text: "WHO guideline", marks: [{ type: "link", attrs: { href: "https://www.ncbi.nlm.nih.gov/books/NBK541169/" } }] },
            { type: "text", text: ", then " },
            { type: "text", text: "talk", marks: [{ type: "bold" }] },
            { type: "text", text: "." },
          ],
        },
        { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Three habits" }] },
        {
          type: "bulletList",
          content: ["Narrate dinner", "Ask open questions", "Wait for the answer"].map((t) => ({
            type: "listItem",
            content: [{ type: "paragraph", content: [{ type: "text", text: t }] }],
          })),
        },
        { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text: "Children learn to think in the space a listener gives them." }] }] },
        { type: "horizontalRule" },
        {
          type: "image",
          attrs: { src: "/stories/how-children-learn-by-talking.jpg", alt: "A grandmother and two children on a veranda", caption: "Serve and return, live.", width: 1440, height: 803 },
        },
        { type: "videoEmbed", attrs: { provider: "youtube", videoId: "dQw4w9WgXcQ", title: "A film", caption: "" } },
      ],
    },
  },
};
