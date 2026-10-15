import { clsx } from "clsx";
import type { ReactNode } from "react";

/** The DS body step of each help line in the approved mockup. */
const SIZE_CLASS = {
  /** Beside CTAs, closes and the store (home.html fold 1, store.html). */
  "body-s": "kh-body-s",
  /** /thanks fold 5 (store-confirmation.html), the refund and shipping pages' help line, /setup's "Meet Kheelu" line. */
  body: "kh-body",
  /** /setup's contact line under "Stuck?" (setup.html fold 7). */
  "body-l": "kh-body-l",
} as const;

export type HelpLineSize = keyof typeof SIZE_CLASS;

/**
 * Every help line of the approved mockup (`mk-help`): beside CTA blocks, closes and the store, on /thanks, the legal
 * pages and /setup. An optional icon, an optional short lead, then the ways to reach a person, each a link with a
 * 44 px tap area (mockup.css:29-31, 128). The icon slot takes the `Icon` primitive; the lead and contact slots take
 * `RichText` from the content's support line. Words that follow the links (/thanks: ", quoting your order number, or
 * email …"; /setup: "Tell us your order number, …") belong to the same sentence, so they go inside `contact`.
 */
export interface HelpLineProps {
  /** The DS body step: `body-s` (default), `body`, `body-l`. One step only, since tokens.css puts kh-body-s last. */
  size?: HelpLineSize;
  icon?: ReactNode;
  /** "Questions?" (the help line everywhere since the selling update, plan v2 §1.1), "Still have a question?" (the product FAQ),
   *  "Rather talk to a person?" (the store's checkout column, as approved). /thanks and /setup's contact line have none. */
  lead?: ReactNode;
  /** The links (WhatsApp, sometimes the email; the phone only on /contact and the legal pages, D063 item 2), with any words
   *  that follow them. */
  contact: ReactNode;
  /** The parent's composition class (the store header's element, the legal pages' and /setup's), added after the DS classes. */
  className?: string;
}

export function HelpLine({ size = "body-s", icon, lead, contact, className }: HelpLineProps) {
  return (
    <p className={clsx(SIZE_CLASS[size], "ks-help", className)}>
      {icon}
      {icon !== undefined && " "}
      {lead !== undefined && (
        <>
          {lead}{" "}
        </>
      )}
      {contact}
    </p>
  );
}
