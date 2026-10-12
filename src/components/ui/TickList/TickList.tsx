import { clsx } from "clsx";
import type { ReactNode } from "react";

/**
 * A list with a Kheelu Blue icon per line (`mk-ticks`, meet-kheelu.css:14-16): the product page's "Good to know",
 * "In the box" and "Safety" panels, and setup. The icon slot takes the `Icon` primitive (its svg is the row's first
 * child, which the CSS sizes and colours); the text slot takes `RichText` (placeholders included).
 */
export interface TickListItem {
  icon: ReactNode;
  text: ReactNode;
}

export interface TickListProps {
  items: readonly TickListItem[];
  /** The parent's composition class, added after `ks-ticks`. */
  className?: string;
}

export function TickList({ items, className }: TickListProps) {
  return (
    <ul className={clsx("ks-ticks", className)}>
      {items.map((item, i) => (
        <li key={i}>
          {item.icon}
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
