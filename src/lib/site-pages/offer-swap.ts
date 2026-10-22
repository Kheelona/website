import { PREORDER_CAP_UNITS } from "@/config/site";
import { buildOffer } from "@/lib/offer/offer";
import { faqs } from "@/content/en-IN/faqs";
import { offerCopy } from "@/content/en-IN/offer";
import { share } from "@/content/en-IN/share";
import type { Copy, Offer } from "@/content/types";
import { isModeVariant } from "@/lib/content/mode";
import { toPlainText } from "@/lib/content/plain-text";

/**
 * The live offer on the redesigned pages (2026-10-22; ADR-005). The redesign is built in token mode (₹499 today,
 * ₹4,999 in total for the first 500), word for word from beta's token copy with the toy's visible name "Khelu". When
 * the store's paid count reaches the cap, getOffer() turns `full` and every page that shows a price must say beta's
 * full-mode words instead, within the offer window (300 s), as beta's React pages do.
 *
 * The swaps are DERIVED from the app's own content wherever beta has the sentence: every FAQ question and answer that
 * has a token and a full variant (content/en-IN/faqs.ts), the price line, the checkout sentence
 * and the WhatsApp share text (content/en-IN/offer.ts, share.ts), each rendered in both modes with buildOffer, so a
 * change of words or amounts there reaches these pages too. The redesign's own placements of the same facts (its meta
 * descriptions, the footer's two-line price, the dock, the offer card's split and later line, the "First 500"
 * sticker) are the explicit rules in `redesignSwaps`. test/site-pages.test.ts renders every built page in full mode
 * and fails on any token-mode amount or "first 500" left outside the legal pages' own text.
 */

/** The toy's visible name on the redesign: Kheelu → Khelu (redesign/pages/README.md). URLs never pass through here. */
export const toRedesignName = (text: string): string => text.replace(/Kheelu/g, "Khelu");

type Swap = readonly [from: string, to: string];

const TOKEN = buildOffer("token");

/** One content string in both modes, as the redesign prints it. */
function bothModes(value: Copy, full: Offer): Swap {
  return [toRedesignName(toPlainText(value, TOKEN)), toRedesignName(toPlainText(value, full))];
}

/** Beta's own words: every mode-variant FAQ, the price line and the checkout sentence. */
function contentSwaps(full: Offer): Swap[] {
  const out: Swap[] = [];
  for (const faq of Object.values(faqs)) {
    const { question, answer } = faq as { question: Copy; answer: Copy };
    if (isModeVariant(question)) out.push(bothModes(question, full));
    if (isModeVariant(answer)) out.push(bothModes(answer, full));
  }
  out.push(bothModes(offerCopy.sentence, full), bothModes(offerCopy.priceLine, full));
  /* Longest first, so a sentence that contains a shorter one is swapped whole. */
  return out.filter(([a, b]) => a !== b).sort((x, y) => y[0].length - x[0].length);
}

/** The redesign's own placements of the token facts, with full mode's words (beta's, where beta has the placement). */
function redesignSwaps(full: Offer): (Swap | readonly [RegExp, string])[] {
  const { token: T, launch: L, balance: B } = TOKEN.prices;
  const F = full.prices.full;
  const priceLine = toPlainText(offerCopy.priceLine, full); // "₹7,999 in total, paid in full when you order."
  const stickySmall = toPlainText(offerCopy.sticky.full.small, full); // "Paid in full · Deliveries start mid-November"
  return [
    /* The footer's price line, on two lines (pages/_shell/footer.html, index.html). */
    [`${T} today, refundable.<br>${L} in total.`, priceLine.replace(", ", ",<br>")],
    /* The dock (pages/_shell/after.html, index.html): the name and amount, then the small line (one line on phones). */
    [
      `<b><span class="ctabar__name">Khelu · </span>${L}</b><span class="ctabar__sep" aria-hidden="true"> · </span><span class="ctabar__small">${T} today, refundable</span>`,
      `<b><span class="ctabar__name">Khelu · </span>${F}</b><span class="ctabar__sep" aria-hidden="true"> · </span><span class="ctabar__small">${stickySmall}</span>`,
    ],
    /* Home's hero line under the sub-line: the ages, then the offer. */
    [`Ages 3 to 7 · Reserve for ${T} today, refundable · ${L} in total.`, `Ages 3 to 7 · ${priceLine}`],
    /* Meta descriptions (home, product, guide). */
    [`${L} in total; reserve with a refundable ${T}.`, priceLine],
    [`${L} in total; ${T} refundable advance.`, priceLine],
    /* /terms: its description names the reservation (the policy below it describes both modes). */
    [`${L} (incl. GST), reserved with a refundable ${T} advance.`, toPlainText(offerCopy.sentence, full)],
    /* The offer cards (home, product): the amount, then no split, no later line, no "First 500" sticker (beta's full
       card has neither, DS gap G-08). */
    [new RegExp(`(<div class="buy__price"><b>)${escape(L)}(</b>)`, "g"), `$1${F}$2`],
    [/\s*<ul class="splitrows">[\s\S]*?<\/ul>/g, ""],
    [/\s*<p class="later">[\s\S]*?<\/p>/g, ""],
    [/\s*<div class="sticker"[^>]*>[\s\S]*?<\/div>/g, ""],
    /* llms.txt and pricing.md: the price answer, in the redesign's words; full mode's is faqs.ts's `how-much`. */
    [
      `Khelu is ${L} in total (incl. GST) for the first ${PREORDER_CAP_UNITS} units, with delivery anywhere in India included. ` +
        `A refundable ${T} advance reserves yours today, and the remaining ${B} is due before delivery. ` +
        `${F} once the first ${PREORDER_CAP_UNITS} are gone. You can pay by UPI, card or net banking.`,
      toRedesignName(toPlainText(faqs["how-much"].answer, full)),
    ],
    /* pricing.md, llms.txt: the later-price line is a bullet of its own; it goes whole. */
    [new RegExp(`^- ${escape(toPlainText(offerCopy.card.later ?? "", TOKEN))}\\s*\\n`, "gm"), ""],
  ];
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** WhatsApp share links: the message is the share text in the mode, then the tagged address (offer.ts's offerShare). */
function swapShareLinks(html: string, full: Offer): string {
  const [from, to] = bothModes(share.text, full);
  return html.replace(/(https:\/\/wa\.me\/\?text=)([^"'&\s]+)/g, (whole, head: string, encoded: string) => {
    let text: string;
    try {
      text = decodeURIComponent(encoded);
    } catch {
      return whole;
    }
    return text.includes(from) ? `${head}${encodeURIComponent(text.replace(from, to))}` : whole;
  });
}

/** The Product offer's price in JSON-LD (rupees): the headline of the live mode. */
function swapSchemaPrice(html: string, offer: Offer): string {
  return html.replace(/("@type"\s*:\s*"Offer"[^{}]*?"price"\s*:\s*)"?[0-9.]+"?/g, `$1${offer.headlinePaise / 100}`);
}

/** The page (or machine file) in the live mode. Token mode is the redesign as built, apart from the schema price. */
export function applyOffer(text: string, offer: Offer): string {
  let out = swapSchemaPrice(text, offer);
  if (offer.mode === "token") return out;
  out = swapShareLinks(out, offer);
  for (const [from, to] of contentSwaps(offer)) out = out.split(from).join(to);
  for (const [from, to] of redesignSwaps(offer)) out = typeof from === "string" ? out.split(from).join(to) : out.replace(from, to);
  return out;
}
