import { Button } from "@/components/ui/Button/Button";
import { HelpLine } from "@/components/ui/HelpLine/HelpLine";
import { Icon } from "@/components/ui/Icon/Icon";
import { RichText } from "@/components/ui/RichText/RichText";
import { MARKETING_ORIGIN } from "@/config/env";
import type { HelpBlockCopy } from "./help-block.types";

export interface HelpBlockProps {
  /** The fold's words (content/en-IN/store/confirmation.ts `help`). */
  copy: HelpBlockCopy;
  /** The h2's id, which names the section. */
  id?: string;
}

/**
 * The /thanks help fold (task 5.16; store-confirmation.html fold 5): the section named by its h2 in the store's heading
 * style (`ks-h2`, StoreDetails, task 5.15), then the help line with the DS WhatsApp icon (HelpLine `body`: the links and
 * the words after them), the undo as a muted paragraph (`ks-muted`, the store's helper), and the refund page as a ghost
 * link flush with the text (`ks-ghost-start`). The refund page is the marketing site's (`MARKETING_ORIGIN`, as the store
 * footer's policy links), in the same tab: the parent has finished paying. No tracking value, as live.
 * Server component.
 */
export function HelpBlock({ copy, id = "help-title" }: HelpBlockProps) {
  return (
    <section aria-labelledby={id}>
      <RichText as="h2" className="kh-title ks-h2" id={id} text={copy.heading} />
      <div className="ks-thanks__help">
        <HelpLine size="body" icon={<Icon name="whatsapp-logo" />} contact={<RichText text={copy.contact} />} />
        <RichText as="p" className="kh-body ks-muted" text={copy.undo} />
        <p className="ks-muted">
          <Button variant="ghost" href={`${MARKETING_ORIGIN}${copy.refund.href}`} iconEnd="arrow-right" className="ks-ghost-start">
            {copy.refund.label}
          </Button>
        </p>
      </div>
    </section>
  );
}
