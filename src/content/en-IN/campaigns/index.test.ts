import { describe, expect, it } from "vitest";
import { routes } from "../routes";
import { campaignSlugs, campaigns, getCampaign } from "./index";

/* The campaign registry (architecture §5.4; structure §3.3; task 2.1): a campaign page is a content
 * module plus one line here, served by src/app/(site)/lp/[slug] with `dynamicParams = false`.
 * Empty at launch, so the route's generateStaticParams returns [] and every /lp/<slug> is a 404
 * (Next allows an empty list only with Cache Components off, ADR-005). */

describe("the campaign registry", () => {
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
