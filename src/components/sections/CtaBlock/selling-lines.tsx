import { HelpLine } from "@/components/ui/HelpLine/HelpLine";
import { ContentIcon, Icon } from "@/components/ui/Icon/Icon";
import { RichText } from "@/components/ui/RichText/RichText";
import { TrustLine } from "@/components/ui/TrustLine/TrustLine";
import type { Offer, TrustItem } from "@/content/types";
import type { CtaHelp } from "./cta-block.types";

/* The two lines every selling block shares (CtaBlock, OfferSection): the linked trust line and the help line,
   rendered from content shapes so a page passes its content as it is. */

export interface SellingTrustLineProps {
  readonly items: readonly TrustItem[];
  /** The offer resolves `{delivery}` in the delivery item. */
  readonly offer: Offer;
  readonly center?: boolean;
  readonly className?: string;
}

/** The trust line (`kh-trustline ks-trust`): each promise linked to its terms with its DS icon (strategy §3.2). */
export function SellingTrustLine({ items, offer, center, className }: SellingTrustLineProps) {
  return (
    <TrustLine
      items={items.map((item) => ({
        icon: <ContentIcon name={item.icon} />,
        label: <RichText text={item.label} offer={offer} />,
        href: item.href,
      }))}
      center={center}
      className={className}
    />
  );
}

export interface SellingHelpLineProps {
  readonly help: CtaHelp;
  readonly className?: string;
}

/** The help line beside every chilli button (`kh-body-s ks-help`): the WhatsApp icon, the lead, then the links, as
 *  every CTA block of the approved mockup draws it (home.html fold 1). */
export function SellingHelpLine({ help, className }: SellingHelpLineProps) {
  return (
    <HelpLine
      icon={<Icon name="whatsapp-logo" />}
      lead={<RichText text={help.lead} />}
      contact={<RichText text={help.contact} />}
      className={className}
    />
  );
}
