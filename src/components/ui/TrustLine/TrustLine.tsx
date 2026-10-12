import { clsx } from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The trust line (architecture §5.2; strategy §3.2, CMO V4): short promises beside every CTA, each linked to its
 * terms with a 44 px tap area (`kh-trustline mk-trust`, home.html fold 1; mockup.css:107-109, 128). Without links
 * it is the plain facts line (`kh-trustline mk-facts`, home.html fold 6), whose own styling is the section's.
 *
 * Data by props: the items come from content/en-IN/trust.ts through the section, the icon slot takes the `Icon`
 * primitive and the label slot `RichText`. Centring is the parent's (CtaBlock's centred beside block,
 * TrustSection's facts line), as in the mockup.
 */
export interface TrustLineItem {
  /** The DS icon (`Icon`), drawn before the words. */
  icon: ReactNode;
  label: ReactNode;
  /** The terms the promise links to; omitted on the unlinked facts line. */
  href?: string;
}

export interface TrustLineProps {
  items: readonly TrustLineItem[];
  /**
   * The store's trust lines open the marketing site's terms in a new tab and say so to screen readers with this
   * visually hidden note (store.html fold 1: " (opens in a new tab)", from the store's content).
   */
  newTabNote?: string;
  /** The parent's composition class (`ks-facts`, a store element), added after the DS classes. */
  className?: string;
}

export function TrustLine({ items, newTabNote, className }: TrustLineProps) {
  const linked = items.some((item) => item.href !== undefined);
  return (
    <ul className={clsx("kh-trustline", linked && "ks-trust", className)}>
      {items.map((item, i) =>
        item.href === undefined ? (
          <li key={i}>
            {item.icon}
            {item.label}
          </li>
        ) : (
          <li key={i}>
            <Link href={item.href} {...(newTabNote !== undefined ? { target: "_blank", rel: "noopener" } : {})}>
              {item.icon}
              {item.label}
              {newTabNote !== undefined && <span className="kh-sr">{newTabNote}</span>}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
