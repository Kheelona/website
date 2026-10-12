import type { SitePath } from "@/content/types";
import { absoluteUrl } from "../urls";
import { requireText } from "./shared";

/**
 * The BreadcrumbList node (architecture §9.2): only where breadcrumbs are visible, and exactly the
 * crumbs the page shows, in order. Nothing is prepended. The last crumb may be the page itself,
 * without a link.
 */
export interface Crumb {
  readonly name: string;
  readonly path?: SitePath;
}

export function breadcrumbListNode(crumbs: readonly Crumb[]) {
  if (crumbs.length === 0) throw new Error("breadcrumbListNode needs at least one crumb");
  return {
    "@type": "BreadcrumbList" as const,
    itemListElement: crumbs.map(({ name, path }, index) => {
      if (path === undefined && index !== crumbs.length - 1) {
        throw new Error(`Crumb "${name}" has no link: only the last crumb, the page itself, may go without one`);
      }
      return {
        "@type": "ListItem" as const,
        position: index + 1,
        name: requireText(name, `Crumb ${index + 1}'s name`),
        ...(path === undefined ? {} : { item: absoluteUrl(path) }),
      };
    }),
  };
}

export type BreadcrumbListNode = ReturnType<typeof breadcrumbListNode>;
