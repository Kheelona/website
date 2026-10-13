import { privacyPage } from "@/content/en-IN/legal/privacy";
import { legalTemplateCopy } from "@/content/en-IN/legal/shared";
import type { SitePath } from "@/content/types";
import { LegalTemplate } from "@/layouts/LegalTemplate/LegalTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The privacy policy (task 5.11; structure §3.1, §5): its legal module through LegalTemplate's reference family
 * (privacy and terms; mockup-css-mapping §6.1), with the template's shared words and the live offer. Thin: every word is
 * the module's (src/content/en-IN/legal/privacy.ts) or the template's (legal/shared.ts).
 *
 * STANDING RULE (website-steps §8.21-c, enforced by test/analytics-tags.test.ts, which renders this route): a tool or a
 * processor that touches a visitor and the sentence describing it ship in the SAME commit, now in the module.
 *
 * The page names no amount, so it sets no revalidate of its own: the (site) layout's window covers the drawer's price
 * sentence (ADR-005). No buy bar (privacy.html meta `"buybar": false`) and no structured data beyond the shell's
 * (architecture §9.2). The title and description read the same in both modes (pageMeta needs no offer). */

const PATH: SitePath = "/privacy";

export const metadata = pageMeta({ ...privacyPage.meta, path: PATH });

export default async function PrivacyPage() {
  return <LegalTemplate doc={privacyPage} variant="reference" copy={legalTemplateCopy} offer={await getOffer()} />;
}
