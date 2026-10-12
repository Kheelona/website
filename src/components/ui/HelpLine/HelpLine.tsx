import { clsx } from "clsx";
import type { ReactNode } from "react";

/**
 * The help line beside CTA blocks, closes and the store (`kh-body-s mk-help`, home.html fold 1; store.html):
 * a short lead, then the ways to reach a person, each a link with a 44 px tap area (mockup.css:29-31, 128).
 * The icon slot takes the `Icon` primitive (the store header's line has none); the lead and contact slots take
 * `RichText` from the content's support line.
 */
export interface HelpLineProps {
  icon?: ReactNode;
  /** "Questions?", "Still have a question?", "Rather talk to a person?", "Need help?". */
  lead: ReactNode;
  /** The links: WhatsApp, then the phone line. */
  contact: ReactNode;
  /** The parent's composition class (the store header's element), added after the DS classes. */
  className?: string;
}

export function HelpLine({ icon, lead, contact, className }: HelpLineProps) {
  return (
    <p className={clsx("kh-body-s", "ks-help", className)}>
      {icon}
      {icon !== undefined && " "}
      {lead} {contact}
    </p>
  );
}
