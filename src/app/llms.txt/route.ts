import { HOSTS } from "@/config/env";
import { cta } from "@/content/en-IN/cta";
import { faqs, type FaqId } from "@/content/en-IN/faqs";
import { navigation, type NavLink } from "@/content/en-IN/navigation";
import { organization } from "@/content/en-IN/organization";
import { product } from "@/content/en-IN/products/kheelu/product";
import { routes } from "@/content/en-IN/routes";
import { seller } from "@/content/en-IN/seller";
import { topics } from "@/content/en-IN/stories/topics";
import { SAFETY_FACTS, TRUST_FULL, trustItems } from "@/content/en-IN/trust";
import type { Copy, Offer, SitePath } from "@/content/types";
import { organizationFacts } from "@/layouts/SiteShell/site-graph";
import { pickMode } from "@/lib/content/mode";
import { nodesToPlainText } from "@/lib/content/plain-text";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { getOffer } from "@/lib/offer/get-offer";
import { absoluteUrl } from "@/lib/seo/urls";

/**
 * `/llms.txt` (architecture §9.3, ADR-012): the site's shape and its facts in one fetch, for answer engines.
 *
 * HARD RULE (lessons §6): it restates visible copy only. Every line below is the text of a content module the
 * pages render (the FAQ answers, the product facts, the trust items, the seller lines, the nav labels), joined
 * only by list marks, links, ": " and " · "; the headings are the file's own framing. Unannounced facts are
 * absent, never guessed: a placeholder is left out. Amounts come from the live offer, so the first one is the
 * total (incl. GST) in both modes and the advance comes second (D028). The company facts are the site shell's
 * Organization input (`organizationFacts`, task 3.1), never restated here. `test/machine-files.test.ts` holds
 * all of this to account in both offer modes.
 *
 * A Route Handler (Next has no static-text file convention), prerendered and revalidated with the offer mode
 * (ADR-005): a sell-out flip reaches it within the offer window, as it reaches the pages.
 */
export const dynamic = "force-static";
export const revalidate = 300;

/** The day this file's body last changed in substance. Bump it in the same commit as the change: a model that
 *  reads "Last updated" trusts the rest exactly that much. */
export const LLMS_UPDATED = "2026-10-15";

/** The questions it answers, in order: the rename first (Kheelu was Lumi), then Home's and the product page's
 *  answers a model is asked about most. One price answer only, so "first 500 units" appears once (D041). The languages
 *  answer the product page gives since task 8c.4 (D061) follows the ages (task 8c.5). The price answer is the one
 *  /pricing.md gives (`how-much`) since task Q2.9: Home's answer lost its GST and its cap with the selling update (D065
 *  items 3-4), and this file, which is not a selling page, keeps both (task Q2.8), so the total "(incl. GST)" stays its
 *  first amount (D028). */
const QUESTIONS: readonly FaqId[] = [
  "same-as-lumi",
  "what-ages",
  "languages",
  "how-much",
  "think-less",
  "wifi",
  "after-the-first-week",
  "not-right-for-us",
  "returns-and-warranty",
  "when-arrive",
  "how-to-pay",
];

/** Rich text as the words a parent reads, with any placeholder (an unannounced fact) left out; a line whose
 *  only fact was the placeholder ("Battery safety: …") goes whole, rather than leave its label hanging. */
function announced(value: Copy, offer: Offer): string {
  const known = (nodes: readonly RichNode[]): RichNode[] =>
    nodes.flatMap((node): RichNode[] => {
      if (node.kind === "placeholder") return [];
      return "children" in node ? [{ ...node, children: known(node.children) }] : [node];
    });
  const text = nodesToPlainText(known(parseRichText(pickMode(value, offer.mode))), offer)
    .replace(/\s+/g, " ")
    .trim();
  return text.endsWith(":") ? "" : text;
}

/** The label the chrome links a path with: the nav first, then the footer; Home by the brand's name. */
function labelOf(path: SitePath, name: string): string {
  if (path === "/") return name;
  const links: readonly NavLink[] = [...navigation.main, ...navigation.footer.columns.flatMap<NavLink>((column) => column.links)];
  const link = links.find((l) => l.href === path);
  if (!link) throw new Error(`llms.txt: no nav or footer label links ${path} (src/content/en-IN/navigation.ts)`);
  return link.label;
}

export function llmsText(offer: Offer): string {
  const org = organizationFacts(organization);
  const say = (value: Copy) => announced(value, offer);
  const lines: string[] = [`# ${org.name}`, "", `> ${say(faqs["what-is-an-ai-toy"].answer)}`, ""];

  lines.push(`## ${product.schema.name}`, "");
  for (const row of [...product.specs, ...product.declarations]) {
    const values = (Array.isArray(row.value) ? row.value : [row.value]) as readonly string[];
    if (values.some((v) => v.includes("{price:"))) continue; // amounts belong to the price answers below
    /* The number only on /contact and the legal pages (D063 item 2): the consumer care declaration's call line, which the
       product page prints for the Legal Metrology rules (task Q2.10), is left out here. */
    const value = values.filter((v) => !v.includes("tel:")).map(say).filter(Boolean).join(" · ");
    if (value) lines.push(`- ${row.term}: ${value}`);
  }

  lines.push("", "## Safety", "");
  for (const item of [...SAFETY_FACTS, ...product.safety]) {
    const text = say(item.text);
    if (text) lines.push(`- ${text}`);
  }

  lines.push("", "## Questions parents ask", "");
  for (const id of QUESTIONS) lines.push(`### ${say(faqs[id].question)}`, "", say(faqs[id].answer), "");

  lines.push("## Delivery, returns and payment", "");
  for (const id of ["deliveries-start", ...TRUST_FULL] as const) lines.push(`- ${say(trustItems[id].label)}`);

  lines.push("", "## Contact", "");
  /* The WhatsApp address in plain text (task Q2.9): the number is on /contact and the legal pages only (D063 item 2), so
     a reader of this file sees how to reach the team here; the email on its own line (each line restates one content
     record, the machine-files test). */
  lines.push(`- ${say(seller.help.contact)}: ${seller.support.whatsapp}`, `- ${seller.support.email}`);
  /* The number only on /contact and the legal pages (D063 item 2, D064 item 11; task Q2.3): the officer's line without it. */
  lines.push(`- ${say(`${seller.grievance.footerLine.lead} ${seller.grievance.footerLine.text}`)}`);

  lines.push("", "## Company", "", `- ${org.legalName}`, `- ${seller.origin.line}`);
  for (const founder of org.founders ?? []) lines.push(`- ${founder.name}: ${founder.jobTitle}`);

  lines.push("", "## Pages", "");
  for (const route of routes.filter((r) => r.kind !== "article")) {
    lines.push(`- [${labelOf(route.path, org.name)}](${absoluteUrl(route.path)})`);
  }
  lines.push(`- [${cta.preorder}](https://${HOSTS.production.store})`);

  lines.push("", "## Guides for parents", "");
  for (const topic of topics) lines.push(`- [${topic.title}](${absoluteUrl(`/stories#${topic.id}`)}): ${topic.lead}`);

  lines.push("", "## Machine-readable", "", `- ${absoluteUrl("/pricing.md")}`);

  lines.push("", "## Official profiles", "");
  for (const profile of org.sameAs ?? []) lines.push(`- ${profile}`);

  lines.push("", `Last updated: ${LLMS_UPDATED}`, "");
  return lines.join("\n");
}

export async function GET() {
  /* No cache-control of its own: Next sends the ISR header (s-maxage=300, stale-while-revalidate), so no
     browser or shared cache keeps a body past the offer window (ADR-005). */
  return new Response(llmsText(await getOffer()), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
