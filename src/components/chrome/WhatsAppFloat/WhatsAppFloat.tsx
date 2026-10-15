import clsx from "clsx";
import { WHATSAPP_LOGO_GROUND, WHATSAPP_LOGO_HANDSET, WHATSAPP_LOGO_RIM, WHATSAPP_LOGO_VIEWBOX } from "@/assets/whatsapp-logo.generated";
import type { SupportChat, SupportChatContext } from "@/content/types";
import { StepAsideLink } from "./WhatsAppFloat.client";

/** The support line's click-to-chat link, `https://wa.me/<number>`. */
export type ClickToChatHref = `https://wa.me/${string}`;

/**
 * The D050 link: the support line's own click-to-chat link (content/en-IN/seller.ts `support.whatsapp`, which is
 * src/config/site.ts SUPPORT_WHATSAPP_HREF, so the number has one source) and the pre-filled text, encoded.
 */
export function whatsAppChatUrl(href: ClickToChatHref, text: string): string {
  if (href.includes("?")) throw new Error(`whatsAppChatUrl: "${href}" already carries a query; the text must be its only one`);
  return `${href}?text=${encodeURIComponent(text)}`;
}

export interface WhatsAppFloatProps {
  /** The support line's click-to-chat link: content/en-IN/seller.ts `support.whatsapp`. */
  href: ClickToChatHref;
  /** The link's name, the laptop label and the three texts: content/en-IN/seller.ts `chat` (its `number` is not read:
   *  the number comes with `href`). */
  chat: Omit<SupportChat, "number">;
  /** `site` in SiteShell (every marketing page and the 404); `store` on the store's pages; `thanks` on /thanks. */
  context: SupportChatContext;
}

/**
 * What the bubble steps aside from on a phone, by context (D050: it never covers a price or a form field), as a
 * selector of the elements it keeps clear:
 * - `site` (task 4.9 item 1): the prices, the price sentence beside a button (PriceSentence `beside`, `ks-price`) and the
 *   offer card's prices, split and fine print (OfferCard). At 324 px the resting bubble sat over the hero's price, and
 *   mid-page over a price while the bar had stepped aside or lifted it.
 * - `store` (task 4.7 item 3; task 7.1a): the details section holding the pre-order form (StoreDetails renders it with
 *   store-page.ts `details.id`, the mockup's `#details`), and, after it on a phone, the agreement card (OrderSummary,
 *   `ks-agree`) and the questions (FaqSection `store`, `ks-faq`), which print the price and what is paid today: at
 *   412 px the resting bubble sat over "₹4,999" in the card, and over an open answer's amount on the event page
 *   (CMO built-page review C, B1). The store page and the event pages share this context.
 * - `thanks` (task 4.9 item 2): the paid page's address step, holding the address form (AddressStep's own `#address`;
 *   the page itself is unchanged, ADR-013).
 */
export const STEP_ASIDE_FROM: Readonly<Record<SupportChatContext, string>> = {
  site: ".ks-price, .kh-offer__prices, .kh-offer__split, .kh-offer__fine",
  store: "#details, .ks-agree, .ks-faq",
  thanks: "#address",
};

/**
 * The persistent WhatsApp chat bubble (D050; architecture §5.3): a real link that opens WhatsApp in a new tab with
 * the context's pre-filled text, never an order number or personal data. The DS large icon button
 * (`kh-iconbtn kh-iconbtn--l`, 56 px) filled by the full-colour WhatsApp logo (D064 item 3, task Q2.4: Wikimedia
 * Commons' WhatsApp.svg, src/assets/whatsapp-logo.svg): the white bubble, its ground in WhatsApp green
 * (`--ks-wa-green`, the founder's one colour exception, DS gap G-20) and the white handset, coloured by
 * whatsapp-float.css; its name is the link's `aria-label`, so the logo and the laptop label beside it are hidden from
 * screen readers.
 *
 * What moves is CSS: the bubble rises by `--ks-buybar-h` less the bottom safe-area inset (the bar's height holds that
 * inset, and the bubble already sits that far above the edge; task 3.6) while `html[data-buybar="shown"]` (both
 * published by StickyBuyBar) and drops back when the bar steps aside, and the label slides out on hover and keyboard
 * focus (motion.css, D050 row); it hides while a modal dialog is open, and `body.ks-has-float` keeps the last content of
 * every page clear of it (whatsapp-float.css). The link is the one client part, `StepAsideLink` (tasks 4.7 and 4.9),
 * the server's markup until it arms: below 900 px it steps aside, off the right edge, while what its context names
 * (`STEP_ASIDE_FROM`: the prices, the store's form, the /thanks address step) crosses its band or a field of it has
 * focus, so it never covers a price or a field.
 * PostHog reads `data-ph-capture-attribute-cta="whatsapp-float"`; on /thanks the bubble also carries `ph-no-capture`,
 * so that page keeps zero autocapture events (tracking inventory row 18).
 */
export function WhatsAppFloat({ href, chat, context }: WhatsAppFloatProps) {
  const link = {
    className: clsx("kh-iconbtn kh-iconbtn--l ks-wa", context === "thanks" && "ph-no-capture"),
    href: whatsAppChatUrl(href, chat.texts[context]),
    target: "_blank",
    rel: "noopener",
    "aria-label": chat.label,
    "data-ph-capture-attribute-cta": "whatsapp-float",
  } as const;
  const content = (
    <>
      <svg className="ks-wa__logo" viewBox={WHATSAPP_LOGO_VIEWBOX} aria-hidden="true" focusable="false">
        <path className="ks-wa__rim" d={WHATSAPP_LOGO_RIM} />
        <path className="ks-wa__ground" d={WHATSAPP_LOGO_GROUND} />
        <path className="ks-wa__handset" d={WHATSAPP_LOGO_HANDSET} />
      </svg>
      <span className="kh-label-s ks-wa__label" aria-hidden="true">
        {chat.shortLabel}
      </span>
    </>
  );
  return (
    <StepAsideLink {...link} from={STEP_ASIDE_FROM[context]}>
      {content}
    </StepAsideLink>
  );
}
