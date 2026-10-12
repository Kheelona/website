import type { ReactNode } from "react";
import { HelpLine } from "@/components/ui/HelpLine/HelpLine";
import { Logo } from "@/components/ui/Logo/Logo";

export interface StoreHeaderProps {
  /** The logo's text ("Kheelona"), the marketing site's address (MARKETING_ORIGIN: the beta site on beta) and the
   *  link's own name. */
  logo: { alt: string; href: string; linkLabel: string };
  /** "Need help?" and the WhatsApp and call links (content/en-IN/seller.ts `storeHelp`, rendered by the shell). */
  help: { lead: ReactNode; contact: ReactNode };
}

/**
 * The store's header (mockup/store.html fold 0, shared with the confirmation page): whose store this is, and a person
 * to reach, without five ways to leave (the live store chrome, by design). The DS nav bar's look (`kh-nav`) around the
 * content container, the logo linking to the marketing site, and the store's help line (`HelpLine`, its links with
 * 44 px tap areas). store-header.css ports store.css:9-11 and :24.
 */
export function StoreHeader({ logo, help }: StoreHeaderProps) {
  return (
    <header className="kh-nav ks-store-head">
      <div className="kh-container ks-store-head__in">
        <Logo alt={logo.alt} href={logo.href} linkLabel={logo.linkLabel} />
        <HelpLine lead={help.lead} contact={help.contact} className="ks-store-head__help" />
      </div>
    </header>
  );
}
