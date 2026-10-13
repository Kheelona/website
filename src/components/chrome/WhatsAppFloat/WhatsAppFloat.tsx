import clsx from "clsx";
import { ICON_WHATSAPP_LOGO } from "@/assets/icons.generated";
import { Glyph } from "@/components/ui/Icon/Glyph";
import type { SupportChat, SupportChatContext } from "@/content/types";

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
 * The persistent WhatsApp chat bubble (D050; architecture §5.3): a real link that opens WhatsApp in a new tab with
 * the context's pre-filled text, never an order number or personal data. The DS large icon button
 * (`kh-iconbtn kh-iconbtn--l`, 56 px) with the DS `whatsapp-logo` icon in white on WhatsApp green (`--ks-wa-green`,
 * the founder's one colour exception, DS gap G-20); its name is the link's `aria-label`, so the laptop label beside it
 * is hidden from screen readers.
 *
 * Everything that moves is CSS, so this renders on the server with no client part (wave-2 close note): the bubble
 * rises by `--ks-buybar-h` less the bottom safe-area inset (the bar's height holds that inset, and the bubble already
 * sits that far above the edge; task 3.6) while `html[data-buybar="shown"]` (both published by StickyBuyBar) and drops
 * back when the bar steps aside, and the label slides out on hover and keyboard focus (motion.css, D050 row); it
 * hides while a modal dialog is open, and `body.ks-has-float` keeps the last content of every page clear of it
 * (whatsapp-float.css). PostHog reads `data-ph-capture-attribute-cta="whatsapp-float"`; on /thanks the bubble also
 * carries `ph-no-capture`, so that page keeps zero autocapture events (tracking inventory row 18).
 */
export function WhatsAppFloat({ href, chat, context }: WhatsAppFloatProps) {
  return (
    <a
      className={clsx("kh-iconbtn kh-iconbtn--l ks-wa", context === "thanks" && "ph-no-capture")}
      href={whatsAppChatUrl(href, chat.texts[context])}
      target="_blank"
      rel="noopener"
      aria-label={chat.label}
      data-ph-capture-attribute-cta="whatsapp-float"
    >
      <Glyph d={ICON_WHATSAPP_LOGO} />
      <span className="kh-label-s ks-wa__label" aria-hidden="true">
        {chat.shortLabel}
      </span>
    </a>
  );
}
