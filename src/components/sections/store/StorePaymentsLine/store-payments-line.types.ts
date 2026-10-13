import type { SitePath } from "@/content/types";

/** D042's payments line with its chargeback link (store.md fold 7), the last line of the store page's and /thanks's
 *  main (wiki/qa/deviations.md V1: the store layout's policy links are a frozen checkout contract). */
export interface PaymentsLineConfig {
  readonly text: string;
  readonly link: { readonly label: string; readonly href: SitePath };
}
