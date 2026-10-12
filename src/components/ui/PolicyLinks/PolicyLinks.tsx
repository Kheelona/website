/** One policy link: its words and where it goes (on the store, a kheelona.com address). */
export interface PolicyLink {
  readonly label: string;
  readonly href: string;
}

export interface PolicyLinksProps {
  /** The navigation landmark's name ("Policies"). */
  label: string;
  links: readonly PolicyLink[];
  /** Read after each link by screen readers only (" (opens in a new tab)"), from content. */
  newTabNote: string;
}

/**
 * The store's policy links (`ks-policy`, from the approved mockup's `mk-policy`, mockup/css/store.css:20-21):
 * a labelled `<nav>` of links, each opening in a new tab so the parent never loses the form, and each saying
 * so to screen readers. Ink, extra bold, rows at the DS tap height (`--tap-min`, 48 px) that wrap.
 */
export function PolicyLinks({ label, links, newTabNote }: PolicyLinksProps) {
  if (links.length === 0) return null;
  return (
    <nav className="ks-policy" aria-label={label}>
      {links.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noopener">
          {link.label}
          <span className="kh-sr">{newTabNote}</span>
        </a>
      ))}
    </nav>
  );
}
