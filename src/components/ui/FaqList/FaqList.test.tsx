import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FaqItem, Offer } from "@/content/types";
import { FaqList, faqPlainItems } from "./FaqList";

const sign = <svg className="kh-icon" data-icon="plus" aria-hidden="true" />;
const ITEMS = [
  { id: "ages", question: "What ages is Kheelu for?", answer: "Kheelu is made for children aged 3 to 7." },
  { id: "arrival", question: "When will my Kheelu arrive?", answer: "Deliveries start mid-November." },
];
const list = (ui: React.ReactElement) => render(ui).container.firstElementChild as HTMLElement;

describe("FaqList", () => {
  it("renders native details as home.html fold 8 does, each answer inside ks-faq__clip (D049 pick 7)", () => {
    const faq = list(<FaqList items={ITEMS} sign={sign} />);
    expect(faq.tagName).toBe("DIV");
    expect(faq.className).toBe("kh-faq");
    const item = faq.firstElementChild as HTMLElement;
    expect(item.outerHTML).toBe(
      '<details class="kh-faq__item">' +
        '<summary class="kh-faq__q"><span>What ages is Kheelu for?</span>' +
        '<span class="kh-faq__sign" aria-hidden="true"><svg class="kh-icon" data-icon="plus" aria-hidden="true"></svg></span></summary>' +
        '<div class="ks-faq__clip"><div class="kh-faq__a"><p>Kheelu is made for children aged 3 to 7.</p></div></div>' +
        "</details>",
    );
  });

  it("has no JavaScript and no button: the question is the summary, so Enter and Space open it natively", () => {
    const faq = list(<FaqList items={ITEMS} sign={sign} />);
    expect(faq.querySelectorAll("details > summary.kh-faq__q")).toHaveLength(2);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("starts with every answer closed, or the first open when asked", () => {
    const closed = list(<FaqList items={ITEMS} sign={sign} />);
    expect([...closed.querySelectorAll("details")].map((d) => d.open)).toEqual([false, false]);
    const first = list(<FaqList items={ITEMS} sign={sign} firstOpen />);
    expect([...first.querySelectorAll("details")].map((d) => d.open)).toEqual([true, false]);
  });

  it("keeps the extra detail after the answer paragraph, inside the clip", () => {
    const faq = list(<FaqList sign={sign} items={[{ ...ITEMS[0], detail: <ul><li>One more line</li></ul> }]} />);
    expect(faq.querySelector(".ks-faq__clip > .kh-faq__a")?.innerHTML).toBe("<p>Kheelu is made for children aged 3 to 7.</p><ul><li>One more line</li></ul>");
  });

  it("reveals on scroll only when asked, and takes the parent's class", () => {
    expect(list(<FaqList items={ITEMS} sign={sign} />).hasAttribute("data-reveal")).toBe(false);
    const faq = list(<FaqList items={ITEMS} sign={sign} reveal className="ks-faq-list" />);
    expect(faq.getAttribute("data-reveal")).toBe("");
    expect(faq.className).toBe("kh-faq ks-faq-list");
  });
});

const OFFER: Offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { token: "₹499", balance: "₹4,500", headline: "₹4,999", full: "₹7,999", mrp: "₹7,999" },
  sentence: "Reserve yours for {price:token} today.",
  sticky: { big: "{price:token} today", small: "refundable" },
  card: { product: "Kheelu", priceNote: "incl. GST", perks: { home: [], product: [] } },
  plus: "Kheelona+",
  delivery: "Deliveries start mid-November",
  availabilityStarts: "2026-11-15",
};

describe("faqPlainItems (the FAQPage JSON-LD text)", () => {
  it("gives each question and answer as the exact words the page shows: amounts, delivery, link labels, source numbers", () => {
    const items: FaqItem[] = [
      {
        id: "price-and-advance",
        question: "How much is Kheelu, and how does the advance work?",
        answer: "Kheelu is {price:headline} (incl. GST). A refundable {price:token} advance reserves yours.[^1] See [the refund policy](/refund).",
      },
      { id: "arrival", question: "When will my Kheelu arrive?", answer: "{delivery}. Pre-orders are served first." },
    ];
    expect(faqPlainItems(items, OFFER)).toEqual([
      {
        id: "price-and-advance",
        question: "How much is Kheelu, and how does the advance work?",
        answer: "Kheelu is ₹4,999 (incl. GST). A refundable ₹499 advance reserves yours.[1] See the refund policy.",
      },
      { id: "arrival", question: "When will my Kheelu arrive?", answer: "Deliveries start mid-November. Pre-orders are served first." },
    ]);
  });

  it("picks the answer for the offer's mode when it changes with the mode", () => {
    const items: FaqItem[] = [
      { id: "pay", question: "What do I pay today?", answer: { token: "{price:token} today.", full: "{price:full}, paid in full." } },
    ];
    expect(faqPlainItems(items, OFFER)[0].answer).toBe("₹499 today.");
    expect(faqPlainItems(items, { ...OFFER, mode: "full" })[0].answer).toBe("₹7,999, paid in full.");
  });

  it("adds the words of the detail blocks after the answer, in order", () => {
    const items: FaqItem[] = [
      {
        id: "returns",
        question: "What if it isn’t right for us?",
        answer: "Return it within 7 days of delivery.",
        detail: [
          { kind: "p", lead: "Faulty?", text: "Tell us within 7 days." },
          { kind: "list", items: ["Pickup is free.", { lead: "Refund:", text: "within 7 working days." }] },
        ],
      },
    ];
    expect(faqPlainItems(items, OFFER)[0].answer).toBe(
      "Return it within 7 days of delivery. Faulty? Tell us within 7 days. Pickup is free. Refund: within 7 working days.",
    );
  });

  it("refuses a detail block that has no place in an FAQ answer", () => {
    const items: FaqItem[] = [
      {
        id: "x",
        question: "Q?",
        answer: "A.",
        detail: [{ kind: "figure", image: { src: "/og/home.jpg", width: 1200, height: 630, alt: "" } }],
      },
    ];
    expect(() => faqPlainItems(items, OFFER)).toThrow(/figure/);
  });
});
