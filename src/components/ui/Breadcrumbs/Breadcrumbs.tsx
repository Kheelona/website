import Link from "next/link";
import type { ReactNode } from "react";
import type { SitePath } from "@/content/types";

/**
 * The breadcrumb trail on article heads (DS gap G-11, composed; `mk-crumbs`, story-*.html fold 1): links to the
 * hub and the article's topic, each crumb after the first led by the caret. The list's type is the DS body-s step
 * in bold (mockup-css-mapping row 70). `breadcrumbList()` hands the same trail to the BreadcrumbList builder
 * (src/lib/seo, task 2.7), so the schema and the page never disagree.
 */
export interface Crumb {
  /** Plain words: the visible label and the schema's `name`. */
  name: string;
  path: SitePath;
}

export interface BreadcrumbsProps {
  trail: readonly Crumb[];
  /** The navigation's accessible name ("Breadcrumb", from content). */
  label: string;
  /** The caret between crumbs (the `Icon` primitive, caret-right). */
  separator: ReactNode;
}

export function Breadcrumbs({ trail, label, separator }: BreadcrumbsProps) {
  return (
    <nav className="ks-crumbs" aria-label={label}>
      <ol className="ks-type-body-s">
        {trail.map((crumb, i) => (
          <li key={crumb.path}>
            {i > 0 && separator}
            <Link href={crumb.path}>{crumb.name}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface BreadcrumbListItem extends Crumb {
  position: number;
}

/** The trail for BreadcrumbList: the visible crumbs, then the current page when given, numbered from 1. */
export function breadcrumbList(trail: readonly Crumb[], current?: Crumb): BreadcrumbListItem[] {
  return [...trail, ...(current ? [current] : [])].map((crumb, i) => ({ position: i + 1, name: crumb.name, path: crumb.path }));
}
