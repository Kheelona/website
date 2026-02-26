"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | string[];
}

const faqs: FAQItem[] = [
  {
    question: "Is my child's data safe?",
    answer:
      "Absolutely. We use end-to-end encryption and never share your child's data with third parties. Privacy is our top priority.",
  },
  {
    question: "What age range are these toys suitable for?",
    answer:
      "Our AI-soft plush toys are designed for children aged 5 and up. Each toy is crafted from hypoallergenic materials and meets all applicable safety standards.",
  },
  {
    question: "How long does shipping take?",
    answer: "We offer India-wide tracked shipping. Standard delivery takes 5-7 business days.",
  },
  {
    question: "Does the toy have emotion recognition?",
    answer: [
      "Captures children's multi-dimensional emotions (e.g., happiness, sadness, anger) through every conversation.",
      "Automatically activates positive guidance dialogues when abnormal or dangerous emotions are detected, and sends real-time alerts to the parent app.",
    ],
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="w-full bg-white py-12 md:py-16 px-4 md:px-8"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2
            id="faq-heading"
            className="font-heading text-[28px] md:text-[40px] text-stroke-tangerine"
          >
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-gray-600 mt-3 text-[16px] md:text-[20px]">
            Got questions? We have answers!
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-[16px] md:text-[18px] text-gray-800 pr-4">
                  {faq.question}
                </span>
                <span className="shrink-0 text-tangerine">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-6 h-6" aria-hidden="true" />
                  )}
                </span>
              </button>

              {openIndex === index && (
                <div id={`faq-answer-${index}`} className="px-5 md:px-6 pb-5 md:pb-6 bg-gray-50">
                  {Array.isArray(faq.answer) ? (
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-[14px] md:text-[16px]">
                      {faq.answer.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 text-[14px] md:text-[16px]">{faq.answer}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
