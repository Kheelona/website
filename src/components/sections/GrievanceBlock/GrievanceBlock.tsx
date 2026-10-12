import { ContactFold, LeadLine, LegalCard } from "./block-parts";
import type { GrievanceBlockProps } from "./grievance-block.types";

/**
 * The grievance officer and the response times, D032's published wording verbatim from the one content value
 * (content/en-IN/seller.ts), as the E-Commerce Rules require (architecture §6.1; contact.md fold 3). On the contact
 * page it is its own fold, the `#grievance` fragment the footer links to, the line in a DS card (`ks-grievance`,
 * contact.css:26-27, links 800); on a legal page it is a card in the part (privacy.html:289-293), whose links take
 * the legal template's 700 (mockup-css-mapping §6.2). Server component.
 */
export function GrievanceBlock(props: GrievanceBlockProps) {
  if (props.context === "legal") {
    return <LegalCard lead={props.line.lead} text={props.line.text} note={props.note} className={props.className} />;
  }
  return (
    <ContactFold id="grievance" titleId="grievance-title" title={props.title} intro={props.intro}>
      <div className="kh-card ks-grievance">
        <LeadLine lead={props.line.lead} text={props.line.text} className="kh-body-l" />
      </div>
    </ContactFold>
  );
}
