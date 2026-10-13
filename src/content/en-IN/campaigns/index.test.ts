import { describe, expect, it } from "vitest";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { routes } from "../routes";
import { campaignSlugs, campaigns, getCampaign, type CampaignEntry } from "./index";

/* The campaign registry (architecture §5.4; structure §3.3; task 2.1): a campaign page is a content
 * module plus one line here, served by src/app/(site)/lp/[slug] with `dynamicParams = false`.
 * Empty at launch, so the route's generateStaticParams returns [] and every /lp/<slug> is a 404
 * (Next allows an empty list only with Cache Components off, ADR-005). */

/** True only when A and B are the same type. */
type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

/* Task 4.5 item 1: an entry is the whole page, exactly what PageTemplate renders (meta, folds, declared nodes), so the
 * registry's `satisfies` refuses a half page and the route needs no narrower type of its own. The type check reads
 * this file (tsconfig.guards.json). */
const entryIsAPage: Equals<CampaignEntry, PageContent> = true;

describe("the campaign registry", () => {
  it("holds whole pages: an entry is the page shape PageTemplate renders", () => {
    expect(entryIsAPage).toBe(true);
  });

  it("is empty at launch", () => {
    expect(campaigns).toEqual({});
    expect(campaignSlugs).toEqual([]);
  });

  it("finds nothing for any slug, inherited names included", () => {
    for (const slug of ["summer", "kheelu", "toString", "constructor", "__proto__"]) {
      expect(getCampaign(slug), slug).toBeUndefined();
    }
  });

  it("never claims a path the URL plan already serves", () => {
    const planned = new Set(routes.map((r) => r.path));
    for (const slug of campaignSlugs) expect(planned.has(`/lp/${slug}`), slug).toBe(false);
  });
});
