import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { FaqItem, LeadText, Offer, ProseBlock, RichTextString } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";

/**
 * The DS FAQ (`kh-faq`): native `<details>`, so it opens with a tap, Enter or Space and works without JavaScript
 * (home.html fold 8, meet-kheelu.html, the store). Each answer sits in `ks-faq__clip`, the hook of the D049 pick 7
 * open animation in src/motion/motion.css (architecture §11.3): the content slot grows from 0fr to 1fr where the
 * browser has `::details-content`, and the clip keeps the DS padding of `kh-faq__a` from showing while it is
 * collapsed. The plus sign turns with the DS's own transition (bundle.css .kh-faq__sign).
 *
 * The question and answer slots take `RichText` and the sign slot the `Icon` primitive (plus); FaqSection maps the
 * page's FaqItems onto them and builds the FAQPage JSON-LD from the same items with `faqPlainItems`, so the schema
 * is the page's own words.
 */
export interface FaqListItem {
  /** The item's stable id (faqs.ts), used as the key. */
  id: string;
  question: ReactNode;
  /** The answer paragraph. */
  answer: ReactNode;
  /** More blocks after the answer paragraph. */
  detail?: ReactNode;
}

export interface FaqListProps {
  items: readonly FaqListItem[];
  /** The plus in its circle (the `Icon` primitive). */
  sign: ReactNode;
  /** Opens the first answer at load. */
  firstOpen?: boolean;
  reveal?: boolean;
  /** The parent's composition class, added after the DS class. */
  className?: string;
}

export function FaqList({ items, sign, firstOpen = false, reveal = false, className }: FaqListProps) {
  return (
    <div className={clsx("kh-faq", className)} data-reveal={reveal ? "" : undefined}>
      {items.map((item, i) => (
        <details key={item.id} className="kh-faq__item" open={firstOpen && i === 0}>
          <summary className="kh-faq__q">
            <span>{item.question}</span>
            <span className="kh-faq__sign" aria-hidden="true">
              {sign}
            </span>
          </summary>
          <div className="ks-faq__clip">
            <div className="kh-faq__a">
              <p>{item.answer}</p>
              {item.detail}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

/** One FAQ as plain text: the question and the answer exactly as the page shows them. */
export interface FaqPlainItem {
  id: string;
  question: string;
  answer: string;
}

/** The plain words of a bold lead and its text, joined as the renderer joins them (a space between). */
function leadText(value: LeadText, offer: Offer): string {
  return [value.lead, value.text]
    .filter((part): part is RichTextString => part !== undefined)
    .map((part) => toPlainText(part, offer))
    .join(" ");
}

/** The words of one detail block; only the text blocks an FAQ answer may hold. */
function detailText(block: ProseBlock, offer: Offer): string {
  switch (block.kind) {
    case "p":
    case "callout":
      return leadText(block, offer);
    case "h3":
    case "disclaimer":
      return toPlainText(block.text, offer);
    case "list":
      return block.items.map((item) => (typeof item === "string" ? toPlainText(item, offer) : leadText(item, offer))).join(" ");
    case "quote":
      return [block.quote, block.cite].filter((part): part is RichTextString => part !== undefined).map((part) => toPlainText(part, offer)).join(" ");
    default:
      throw new Error(`faqPlainItems: an FAQ answer holds text blocks only, not a ${block.kind} block`);
  }
}

/**
 * The FAQPage JSON-LD text of each item (architecture §5.2, §9.2): the question and the answer, with the detail
 * blocks' words after the answer, as the plain-text serialiser renders them (amounts and the delivery line from
 * the offer, link labels, source numbers, the answer for the offer's mode).
 */
export function faqPlainItems(items: readonly FaqItem[], offer: Offer): FaqPlainItem[] {
  return items.map((item) => ({
    id: item.id,
    question: toPlainText(item.question, offer),
    answer: [toPlainText(item.answer, offer), ...(item.detail ?? []).map((block) => detailText(block, offer))].join(" "),
  }));
}
