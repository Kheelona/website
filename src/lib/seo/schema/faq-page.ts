import { requireText } from "./shared";

/**
 * The FAQPage node (architecture §9.2): Home, the product page, /safety and the guide. The items are
 * the plain-text serialisation of the FAQ items the page shows (ui/FaqList exposes them), so each
 * answer here is word for word on the page (`test/guards/jsonld-matches-page.test.ts`).
 */
export interface FaqPlainItem {
  readonly question: string;
  readonly answer: string;
}

export function faqPageNode(items: readonly FaqPlainItem[]) {
  if (items.length === 0) throw new Error("faqPageNode needs at least one question");
  const questions = new Set<string>();
  return {
    "@type": "FAQPage" as const,
    mainEntity: items.map(({ question, answer }) => {
      requireText(question, "A FAQ question");
      if (questions.has(question)) throw new Error(`FAQ question "${question}" is listed twice`);
      questions.add(question);
      return {
        "@type": "Question" as const,
        name: question,
        acceptedAnswer: { "@type": "Answer" as const, text: requireText(answer, `The answer to "${question}"`) },
      };
    }),
  };
}

export type FaqPageNode = ReturnType<typeof faqPageNode>;
