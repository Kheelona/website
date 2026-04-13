"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | string[];
}

const faqs: FAQItem[] = [
  {
    question: "How does it help my child speak better?",
    answer:
      "Kheelona toys are designed to talk with your child. By practicing daily conversations in a fun, friendly way, children naturally lose their hesitation and become more confident speakers.",
  },
  {
    question: "Will this help increase my child’s vocabulary?",
    answer:
      "Yes! Through interactive stories and smart chats, Kheelona introduces new words and phrases in the right context. It’s like having a playful tutor who makes learning feel like a game.",
  },
  {
    question: "Does kheelona help in reducing screen time?",
    answer:
      " Kheelona toys are 100% screen-free. Kheelona toys Helps in protecting your child’s eyes and encouraging them to play in the real world, not behind a glass screen.",
  },
  {
    question: "Can you speak any regional language with kheelona toys?",
    answer:
      "Kheelona is multilingual. Your child can chat in English, Hindi, and other regional languages. This helps them stay connected to their roots while learning global languages.",
  },
  {
    question: "Is my child’s data safe?",
    answer:
      "Your privacy is our top priority. We use high-level encryption to ensure all interactions remain private. We never sell your data or share it with third parties.",
  },
  {
    question: "When will my pre-order be dispatched?",
    answer:
      "All pre-orders are scheduled to be shipped by June 2026. We will send you a tracking link via email as soon as your Kheelona is on its way.",
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
