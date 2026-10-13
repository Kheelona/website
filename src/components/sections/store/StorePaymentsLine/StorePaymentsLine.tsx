import { clsx } from "clsx";
import { MARKETING_ORIGIN } from "@/config/env";
import type { PaymentsLineConfig } from "./store-payments-line.types";

export type { PaymentsLineConfig } from "./store-payments-line.types";

export interface StorePaymentsLineProps {
  readonly content: PaymentsLineConfig;
  /** Read after the chargeback link, which opens /refund in a new tab. */
  readonly newTabNote: string;
  /** On /thanks: the line carries `ph-no-capture`, as the page's bubble does, so that page keeps zero autocapture
   *  events (tracking inventory row 18). The store page leaves it off. */
  readonly noCapture?: boolean;
}

/**
 * D042's payments line with its chargeback link (store.md fold 7), as the last line of a store page's main: the store
 * and confirmation mockups print it in their shared store footer, but the store layout's policy links are a frozen
 * checkout contract, so the line sits just above the footer instead (wiki/qa/deviations.md V1; task 5.15 for the
 * store, task 4.8 for /thanks). Set like the footer's lines: muted, at the reading measure, aligned with the footer.
 * Server component.
 */
export function StorePaymentsLine({ content, newTabNote, noCapture = false }: StorePaymentsLineProps) {
  return (
    <div className={clsx("ks-store-payments", noCapture && "ph-no-capture")}>
      <div className="kh-container">
        <p className="kh-body-s ks-muted">
          {content.text}{" "}
          <a href={`${MARKETING_ORIGIN}${content.link.href}`} target="_blank" rel="noopener">
            {content.link.label}
            <span className="kh-sr">{newTabNote}</span>
          </a>
        </p>
      </div>
    </div>
  );
}
