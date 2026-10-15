import { Logo } from "@/components/ui/Logo/Logo";
import { PreorderButton } from "@/components/ui/PreorderButton/PreorderButton";
import { NavBarLinks, NavMenuButton, type NavLinkItem } from "./NavBar.client";

export interface NavBarProps {
  /** The landmark's name ("Main"). */
  label: string;
  /** The logo's text ("Kheelona, home") and the home path. */
  logo: { alt: string; href: string };
  /** Meet Kheelu, Safety, Stories, Team: content/en-IN/navigation.ts `main`. */
  links: readonly NavLinkItem[];
  /** "Pre-order Kheelu" (content/en-IN/cta.ts). */
  ctaLabel: string;
  /** The phone menu button's name and the id of the drawer dialog it opens. */
  menu: { label: string; controls: string };
}

/**
 * The marketing site's navigation: the DS NavBar (`kh-nav`) exactly as mockup/partials/nav.html composes it. On phones
 * the logo and the menu button only, so the hero's chilli button is the one in view; from 900 px the four links and
 * the small chilli button (`ks-nav-cta`, nav-bar.css; G-06, D041), tracked `navbar`, in a bar that sticks to the top
 * (task Q2.5). A server component: the links
 * and the menu button are the small client parts in NavBar.client.tsx; the chilli button is rendered here and never
 * reaches a client bundle (wave-2 close ruling).
 */
export function NavBar({ label, logo, links, ctaLabel, menu }: NavBarProps) {
  return (
    <nav className="kh-nav" aria-label={label}>
      <Logo alt={logo.alt} href={logo.href} />
      <NavBarLinks links={links} />
      <div className="kh-nav__end">
        <PreorderButton cta="navbar" label={ctaLabel} size="s" className="ks-nav-cta" />
        <NavMenuButton label={menu.label} controls={menu.controls} />
      </div>
    </nav>
  );
}
