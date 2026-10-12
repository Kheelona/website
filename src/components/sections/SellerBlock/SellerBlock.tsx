import { RichText } from "@/components/ui/RichText/RichText";
import { SellerLines } from "@/components/ui/SellerLines/SellerLines";
import { ContactFold, LeadLine, LegalCard } from "../GrievanceBlock/block-parts";
import type { SellerBlockProps } from "./seller-block.types";

/**
 * Who a parent is buying from (architecture §6.1; contact.md fold 4). On the contact page it is its own band fold:
 * the four seller lines in a DS card (`ks-seller`, contact.css:27-28, links 800), character for character as the
 * footer prints them (ui/SellerLines `block`). On a legal page it is the seller line of a part: a card with a bold
 * lead or a plain paragraph, whose links take the legal template's 700 (mockup-css-mapping §6.2). Server component.
 */
export function SellerBlock(props: SellerBlockProps) {
  if (props.context === "legal") {
    const { line, card = true, className } = props;
    return card ? <LegalCard lead={line.lead} text={line.text} className={className} /> : <LeadLine lead={line.lead} text={line.text} className={className} />;
  }
  const { lines } = props;
  return (
    <ContactFold titleId="seller-title" title={props.title} intro={props.intro} band>
      <div className="kh-card ks-seller">
        <SellerLines
          variant="block"
          entity={<RichText text={lines.entity} />}
          gstin={<RichText text={lines.gstin} />}
          address={<RichText text={lines.address} />}
          contact={<RichText text={lines.contact} />}
        />
      </div>
    </ContactFold>
  );
}
