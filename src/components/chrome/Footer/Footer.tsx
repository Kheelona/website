import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo/Logo";
import { SellerLines } from "@/components/ui/SellerLines/SellerLines";

export interface FooterLink {
  readonly label: string;
  /** A site path (next/link). */
  readonly href: string;
}

export interface FooterProps {
  /** The footer logo's text ("Kheelona"); it is not a link (partials/footer.html). */
  logoAlt: string;
  /** Under the logo; never the DS default, whose wake-word line is banned (claims §4.1). */
  promise: string;
  made: string;
  /** Kheelu, Read, Help: content/en-IN/navigation.ts `footer.columns`. */
  columns: readonly { readonly id: string; readonly title: string; readonly links: readonly FooterLink[] }[];
  /** The four seller lines, printed as the footer prints them (the shell renders the contact line with RichText). */
  seller: { entity: ReactNode; gstin: ReactNode; address: ReactNode; contact: ReactNode };
  /** The legal row's last line: the grievance officer, on the contact page (D032). */
  grievance: FooterLink;
}

/**
 * The marketing site's footer: the DS Footer (`kh-footer`) exactly as mockup/partials/footer.html composes it, the logo,
 * the promise and the made-in line, three link columns, then the legal row with the seller lines (`SellerLines`
 * footer variant) and the grievance officer link. footer.css ports mockup.css:126, the legal row's links in the DS
 * link colour with a full tap height (CMO M9). Server component; every word and link comes from content by props.
 */
export function Footer({ logoAlt, promise, made, columns, seller, grievance }: FooterProps) {
  return (
    <footer className="kh-footer">
      <div className="kh-footer__top">
        <Logo alt={logoAlt} />
        <p className="kh-footer__promise">{promise}</p>
        <p className="kh-footer__made">{made}</p>
      </div>
      <div className="kh-footer__cols">
        {columns.map((column) => (
          <div key={column.id} className="kh-footer__col">
            <h2>{column.title}</h2>
            {column.links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="kh-footer__legal">
        <SellerLines variant="footer" {...seller} />
        <span>
          <Link href={grievance.href}>{grievance.label}</Link>
        </span>
      </div>
    </footer>
  );
}
