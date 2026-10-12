import { describe, expect, it } from "vitest";
import { faqPageNode } from "./faq-page";

describe("faqPageNode", () => {
  /* The items are the plain-text serialisation of the FAQ items the page shows (ui/FaqList exposes
     them, task 2.4), so every answer here is word for word on the page (jsonld-matches-page). */
  it("turns the page's FAQ items into Question and Answer nodes, in order", () => {
    expect(
      faqPageNode([
        { question: "How much is Kheelu?", answer: "Kheelu is ₹4,999 (incl. GST)." },
        { question: "Does it need Wi-Fi?", answer: "Story mode does not. AI mode does." },
      ]),
    ).toEqual({
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How much is Kheelu?", acceptedAnswer: { "@type": "Answer", text: "Kheelu is ₹4,999 (incl. GST)." } },
        { "@type": "Question", name: "Does it need Wi-Fi?", acceptedAnswer: { "@type": "Answer", text: "Story mode does not. AI mode does." } },
      ],
    });
  });

  it("refuses an empty FAQ, which would be an invalid FAQPage", () => {
    expect(() => faqPageNode([])).toThrow(/at least one/);
  });

  it("refuses an empty question or answer", () => {
    expect(() => faqPageNode([{ question: " ", answer: "A" }])).toThrow(/question/i);
    expect(() => faqPageNode([{ question: "Q?", answer: "" }])).toThrow(/answer/i);
  });

  it("refuses the same question twice", () => {
    const item = { question: "How much is Kheelu?", answer: "₹4,999." };
    expect(() => faqPageNode([item, item])).toThrow(/twice/);
  });
});
