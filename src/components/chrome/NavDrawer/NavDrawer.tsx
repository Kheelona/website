import Link from "next/link";
import type { ReactNode } from "react";
import { ICON_X } from "@/assets/icons.generated";
import { Icon } from "@/components/ui/Icon/Icon";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { Logo } from "@/components/ui/Logo/Logo";
import { PreorderButton } from "@/components/ui/PreorderButton/PreorderButton";
import { PriceSentence } from "@/components/ui/PriceSentence/PriceSentence";
import type { Offer } from "@/content/types";
import type { NavLinkItem } from "../NavBar/NavBar.client";
import { NavDrawerDialog } from "./NavDrawer.client";

export interface NavDrawerProps {
  /** The dialog's id ("menu"), named by the menu button's `aria-controls`. */
  id: string;
  /** The dialog's name ("Menu"). */
  label: string;
  /** The links landmark's name ("Main", as the mockup names both navigations; only one is ever shown). */
  navLabel: string;
  logo: { alt: string; href: string };
  /** "Close menu": the close button's name and tooltip (the mockup gives it both). */
  closeLabel: string;
  links: readonly NavLinkItem[];
  /** "Pre-order Kheelu" (content/en-IN/cta.ts). */
  ctaLabel: string;
  /** The live offer: the first note is its price sentence (D028), in the current mode. */
  offer: Offer;
  /** The second note: when deliveries start and the returns promise. */
  note: ReactNode;
}

/**
 * The phone menu: the DS NavDrawer (`kh-drawer`) as a native modal dialog, exactly as mockup/partials/drawer.html
 * composes it (head with the logo and the close button, the four links with chevrons, then the large chilli button,
 * tracked `navbar-mobile`, with the price sentence and the delivery and returns line under it). The panel slides in
 * from the side and the DS scrim fades in behind it (D049 pick 5, motion.css). The dialog and its closing are the
 * client island NavDrawer.client.tsx; everything inside is rendered here, on the server.
 */
export function NavDrawer({ id, label, navLabel, logo, closeLabel, links, ctaLabel, offer, note }: NavDrawerProps) {
  return (
    <NavDrawerDialog id={id} label={label}>
      <div className="kh-drawer__panel">
        <div className="kh-drawer__head">
          <Logo alt={logo.alt} href={logo.href} />
          <IconButton icon={ICON_X} label={closeLabel} title={closeLabel} data-close-menu="" />
        </div>
        <nav className="kh-drawer__links" aria-label={navLabel}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="kh-drawer__link">
              <span>{link.label}</span>
              <Icon name="caret-right" className="kh-drawer__chev" />
            </Link>
          ))}
        </nav>
        <div className="kh-drawer__cta">
          <PreorderButton cta="navbar-mobile" label={ctaLabel} size="l" block />
          <PriceSentence offer={offer} variant="drawer" />
          <p className="kh-drawer__note">{note}</p>
        </div>
      </div>
    </NavDrawerDialog>
  );
}
