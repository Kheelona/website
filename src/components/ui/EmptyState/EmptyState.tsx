import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { Tone } from "@/content/types";

/**
 * The DS EmptyState (`kh-empty`): an icon in a soft circle, then a title and one sentence, or the page's own
 * content. The 404 (variant `404`, `mk-404` in 404.css) composes it with its h1 heading and a List of four link rows
 * (EmptyStateSection, task 3.4): pass them as children, the nav as `ks-404__nav` and the List with
 * `className="ks-404__list"`. The art circle is decoration (`aria-hidden`).
 */
export interface EmptyStateProps {
  /** The DS icon in the circle (the `Icon` primitive). */
  icon: ReactNode;
  tone?: Tone;
  title?: ReactNode;
  body?: ReactNode;
  variant?: "404";
  /** The parent's composition class, added after the DS classes. */
  className?: string;
  children?: ReactNode;
}

export function EmptyState({ icon, tone, title, body, variant, className, children }: EmptyStateProps) {
  return (
    <div className={clsx("kh-empty", tone && `kh-tone-${tone}`, variant === "404" && "ks-404", className)}>
      <span className="kh-empty__art" aria-hidden="true">
        {icon}
      </span>
      {title !== undefined && <p className="kh-empty__title">{title}</p>}
      {body !== undefined && <p className="kh-empty__body">{body}</p>}
      {children}
    </div>
  );
}
