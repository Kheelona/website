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
  /** The seller lines, printed as the footer prints them (the shell renders the contact line with RichText); no GSTIN
   *  and no number on the website's footer (D063 items 2-3). */
  seller: { entity: ReactNode; address: ReactNode; contact: ReactNode };
  /** The legal row's last line: the grievance officer, on the contact page (D032). */
  grievance: FooterLink;
}

/**
 * The marketing site's footer: the DS Footer (`kh-footer`) exactly as mockup/partials/footer.html composes it, the logo,
 * the promise and the made-in line, three link columns, then the legal row with the seller lines (`SellerLines`
 * footer variant) and the grievance officer link, which since task Q2.16 joins the contact line in one group
 * (`ks-footer__links`), so the two wrap together and line up with the copyright and the address. footer.css gives the
 * legal row's links the DS link colour and a full tap height without moving the line (CMO M9; QAL-1). Server component;
 * every word and link comes from content by props.
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
        <SellerLines variant="footer" {...seller} links={<Link href={grievance.href}>{grievance.label}</Link>} />
      </div>
    </footer>
  );
}
