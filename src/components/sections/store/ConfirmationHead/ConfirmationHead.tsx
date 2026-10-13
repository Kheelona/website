import { HelpLine } from "@/components/ui/HelpLine/HelpLine";
import { ContentIcon } from "@/components/ui/Icon/Icon";
import { RichText } from "@/components/ui/RichText/RichText";
import type { HelpLineCopy } from "@/content/types";
import type { ConfirmationHeadCopy } from "./confirmation-head.types";
import { fillSlots } from "./slot-text";

export interface ConfirmationHeadProps {
  /** The state's words: paid, confirming or link needed (content/en-IN/store/confirmation.ts `head`). */
  copy: ConfirmationHeadCopy;
  /** The amount paid, formatted from the order row (paid lede only). */
  amount?: string;
  /** The email the confirmation went to, from the order row (paid lede only). */
  email?: string;
  /** A help line after the lede, inside the head: the link-needed state's person who can find the order. */
  help?: HelpLineCopy;
  /** The h1's id, which names the section. */
  id?: string;
}

/**
 * The /thanks head (task 5.16; store-confirmation.html fold 1): a section named by the page's one h1, holding the DS
 * SectionHeading markup with the eyebrow's DS icon (`ks-thanks__eyebrow`) and the lede as a large muted paragraph
 * (`ks-thanks__lede`). The lede's slots take the order's amount and email as plain text, one text node, so a value is
 * never read as markup. confirmation-head.css also holds the page column the folds sit in (`ks-thanks`,
 * `ks-thanks__col`, store-confirmation.css:8-9), which the page draws around them with the PostHog privacy classes.
 * Server component.
 */
export function ConfirmationHead({ copy, amount, email, help, id = "thanks-title" }: ConfirmationHeadProps) {
  const values = { ...(amount !== undefined ? { amount } : {}), ...(email !== undefined ? { email } : {}) };
  return (
    <section aria-labelledby={id}>
      <header className="kh-heading">
        <p className="kh-eyebrow ks-thanks__eyebrow">
          {copy.icon !== undefined && <ContentIcon name={copy.icon} />}
          <RichText text={copy.eyebrow} />
        </p>
        <h1 className="kh-heading__title" id={id}>
          <RichText text={copy.heading} />
        </h1>
        <p className="kh-body-l ks-thanks__lede">{fillSlots(copy.lede, values as Record<"amount" | "email", string>)}</p>
        {help !== undefined && <HelpLine size="body" lead={<RichText text={help.lead} />} contact={<RichText text={help.contact} />} />}
      </header>
    </section>
  );
}
