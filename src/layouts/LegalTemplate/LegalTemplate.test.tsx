import { render, screen, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { mockupFold, skeleton, words, type SkeletonOptions } from "../../../test/support/mockup-compare";
import { legalTemplateCopy } from "@/content/en-IN/legal/shared";
import { seller } from "@/content/en-IN/seller";
import type * as Content from "@/content/types";
import { buildOffer } from "@/lib/offer/offer";
import { legalSellerSentence } from "@/lib/content/seller-lines";
import { toPlainText } from "@/lib/content/plain-text";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { LEGAL_FIXTURES, LEGAL_SLUGS, type LegalSlug } from "../../../test/fixtures/legal";
import { LegalTemplate } from "./LegalTemplate";
import type * as Template from "./legal-template.types";
import type { LegalPage, LegalTemplateProps } from "./legal-template.types";

/* LegalTemplate (task 4.3; architecture §5.2 "Legal layout"; mockup-css-mapping §3.6, §6.1-6.5): the four approved
 * legal pages, rendered from fixture content copied from them (test/fixtures/legal), compared element by element
 * (classes with the mockup's prefix renamed ks-, ARIA, ids, addresses, order) and word for word with each page's
 * <main> as built (mockup/<slug>.html). Two families behind one variant: privacy and terms ("reference"), refund and
 * shipping ("notice"). The pixels are test/e2e/legal-template.spec.ts's. */

const TOKEN = buildOffer("token");
const FULL = buildOffer("full");

function page(slug: LegalSlug, overrides: Partial<LegalTemplateProps> = {}): ReactElement {
  const { doc, variant } = LEGAL_FIXTURES[slug];
  return (
    <main id="main">
      <LegalTemplate doc={doc} variant={variant} copy={legalTemplateCopy} offer={TOKEN} {...overrides} />
    </main>
  );
}
const mainOf = (ui: ReactElement) => render(ui).container.querySelector("main")!;

/** What the build adds and the mockup does not carry: the generated type steps (mockup-css-mapping §3.6 rows 27-51),
 *  the list reset TrustList puts on its list (mockup.css:95), the paragraph sticker's margin class (the mockup's inline
 *  `margin: 0`) and the template's family modifiers, each asserted on its own below. The mockup's value markers
 *  (`span[data-src]` around an amount or the delivery line, N22) are its own: the build prints the value alone. */
const OPTIONS: SkeletonOptions = {
  drop: /^ks-(?:type-.+|list-reset|sticker--flush|draft--notice|doc--(?:reference|notice)|doc-summary--(?:reference|notice)|doc-close--(?:reference|notice)|toc--groups)$/,
  unwrap: "span[data-src]",
};

describe.each(LEGAL_SLUGS)("LegalTemplate: %s, fixture content against the approved page", (slug) => {
  const mockup = mockupFold(slug, "main");

  it("renders the mockup's markup: same elements, classes, ARIA, ids, addresses and order", () => {
    expect(skeleton(mainOf(page(slug)), OPTIONS)).toBe(skeleton(mockup, OPTIONS));
  });

  it("says every word the mockup says, prices and the delivery line from the offer", () => {
    expect(words(mainOf(page(slug)))).toBe(words(mockup));
  });

  it("ships no mockup-only markup and nothing that moves (no mk- class, data-src, reveal or drawing doodle)", () => {
    const main = mainOf(page(slug));
    expect(main.innerHTML).not.toMatch(/\bmk-|data-src/);
    expect(main.querySelector("[data-reveal], [data-draw], svg.ks-doodle")).toBeNull();
  });

  it("has one h1, the page's, naming the hero; every contents link reaches its part", () => {
    const main = mainOf(page(slug));
    const h1 = within(main).getByRole("heading", { level: 1 });
    expect(main.querySelector("section")).toHaveAttribute("aria-labelledby", h1.id);
    expect(h1.id).toBe(`${slug}-title`);
    const nav = within(main).getByRole("navigation", { name: "On this page" });
    const targets = [...nav.querySelectorAll("a")].map((a) => a.getAttribute("href")!.slice(1));
    expect(targets).toHaveLength(LEGAL_FIXTURES[slug].doc.parts.length);
    for (const id of targets) expect(main.querySelector(`#${id}`), id).not.toBeNull();
  });

  it("names every part by its heading, and the short version and the close by theirs", () => {
    const main = mainOf(page(slug));
    for (const part of main.querySelectorAll(".ks-doc__part")) {
      const label = part.getAttribute("aria-labelledby")!;
      expect(part.querySelector("h2")!.id).toBe(label);
    }
    expect(within(main).getByRole("region", { name: "The short version." })).toHaveClass("ks-doc-summary");
  });

  it("renders in full mode too (every amount from the offer)", () => {
    expect(() => mainOf(page(slug, { offer: FULL }))).not.toThrow();
  });
});

describe("LegalTemplate: the two families (mockup-css-mapping §6.1)", () => {
  it("reference (privacy, terms): a plain draft note, the eyebrow, the seller and grievance lines as cards", () => {
    for (const slug of ["privacy", "terms"] as const) {
      const main = mainOf(page(slug));
      const draft = main.querySelector(".ks-draft")!;
      expect(draft.querySelector("svg")).toBeNull();
      expect(draft).not.toHaveClass("ks-draft--notice");
      expect(main.querySelector(".ks-doc")).toHaveClass("ks-doc--reference");
      expect(main.querySelector(".ks-doc-close")).toHaveClass("ks-doc-close--reference");
      expect(main.querySelector(".ks-doc-close .kh-card")).toHaveClass("kh-tone-blue");
      expect(main.querySelector(".ks-doc-summary")).toHaveClass("ks-doc-summary--reference");
      expect(main.querySelector(".ks-doc-summary")).not.toHaveClass("ks-doc-summary--notice");
      const cards = [...main.querySelectorAll(".ks-doc__card")];
      const sellerCard = cards.find((c) => c.textContent!.includes(toPlainText(legalSellerSentence(seller))))!;
      const grievanceCard = cards.find((c) => c.textContent!.startsWith("Grievance Officer:"))!;
      // Privacy and terms keep no phrase together (only the phone link keeps itself whole).
      for (const card of [sellerCard, grievanceCard]) expect(card.querySelectorAll(":not(a) > span.ks-nowrap")).toHaveLength(0);
    }
  });

  it("notice (refund, shipping): the draft note's icon, the board, the help line, the seller as a plain line with its phrases kept together", () => {
    for (const slug of ["refund", "shipping"] as const) {
      const main = mainOf(page(slug));
      expect(main.querySelector(".ks-draft")).toHaveClass("ks-draft--notice");
      expect(main.querySelector(".ks-draft > svg.kh-icon + span")).not.toBeNull();
      expect(main.querySelector(".ks-doc")).toHaveClass("ks-doc--notice");
      expect(main.querySelector(".ks-doc-summary")).toHaveClass("ks-doc-summary--notice");
      expect(main.querySelector(".ks-doc-summary")).not.toHaveClass("ks-doc-summary--reference");
      expect(main.querySelector(".ks-doc-close")).toHaveClass("ks-doc-close--notice");
      expect(main.querySelector(".ks-doc-close .kh-card")).toHaveClass("kh-tone-sun");
      expect(main.querySelector(".ks-hero .kh-art.ks-doc-art")).toHaveStyle({ "--kh-ratio": "4 / 3" });
      expect(main.querySelector(".ks-doc-summary > .kh-container > p.kh-body.ks-help.ks-doc-help")).not.toBeNull();
      const kept = [...main.querySelectorAll(".ks-doc__part span.ks-nowrap")].map((s) => s.textContent);
      expect(kept).toEqual(expect.arrayContaining(["No 51", "(Old Site No 1)", "Bengaluru 560041", "Co-Founder"]));
      const sellerLine = [...main.querySelectorAll(".ks-doc__part > p")].find((p) => p.textContent!.includes("registered at"))!;
      expect(sellerLine.closest(".kh-card")).toBeNull();
    }
  });

  it("notice parts step up from 1024 px: headings to 32/38 at weight 700, subheadings to 24/30 (§3.6 rows 48-51, §6.5)", () => {
    const main = mainOf(page("refund"));
    for (const h2 of main.querySelectorAll(".ks-doc__part > h2")) expect(h2).toHaveClass("kh-title", "ks-type-headline@xl");
    for (const h3 of main.querySelectorAll(".ks-doc__part > h3")) expect(h3).toHaveClass("kh-subtitle", "ks-type-title@xl");
    const reference = mainOf(page("privacy"));
    expect(reference.querySelector(".ks-doc__part > h2")).not.toHaveClass("ks-type-headline@xl");
  });

  it("the document column and the answer-first lines take the DS type steps (§3.6 rows 27-28, 31-33, 38-41)", () => {
    const main = mainOf(page("privacy"));
    expect(main.querySelector(".ks-doc__body")).toHaveClass("ks-type-body", "ks-type-body-l@xl");
    const answers = main.querySelectorAll(".ks-doc__answer");
    expect(answers).toHaveLength(2);
    for (const a of answers) expect(a).toHaveClass("ks-type-body-l", "ks-type-lead@xl");
  });

  it("terms: the short version as numbered points in the Sunshine panel, and the parts in three groups", () => {
    const main = mainOf(page("terms"));
    expect(main.querySelector(".kh-card.kh-card--tint.kh-tone-sun.ks-short-panel > ol.ks-short.kh-body-l[role=list]")).not.toBeNull();
    const nav = within(main).getByRole("navigation", { name: "On this page" });
    expect(nav).toHaveClass("ks-toc--groups");
    const groups = within(nav).getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(groups).toEqual(["Your pre-order", "Using Kheelu", "The legal part"]);
    expect([...nav.querySelectorAll("ol")].map((ol) => ol.getAttribute("aria-labelledby"))).toEqual(["toc-part-1", "toc-part-2", "toc-part-3"]);
    expect([...main.querySelectorAll(".ks-doc__group")].map((p) => p.textContent)).toEqual([
      "Part one · Your pre-order",
      "Part two · Using Kheelu",
      "Part three · The legal part",
    ]);
    expect(mainOf(page("privacy")).querySelector(".ks-toc")).not.toHaveClass("ks-toc--groups");
  });

  it("refund: the numbered return steps, the callout, and the #chargeback paragraph the store footer links to", () => {
    const main = mainOf(page("refund"));
    expect(main.querySelectorAll("ol.ks-doc__steps[role=list] > li")).toHaveLength(3);
    expect(main.querySelector("p.kh-card.kh-card--tint.kh-tone-sun.ks-doc__callout > svg.kh-icon + strong")).not.toBeNull();
    expect(main.querySelector("p#chargeback")?.closest(".ks-doc__part")).not.toBeNull();
  });

  it("privacy: the tools one per block, and the recipients as phone rows and a laptop table, both named", () => {
    const main = mainOf(page("privacy"));
    expect(main.querySelectorAll(".ks-tools > .ks-tool")).toHaveLength(7);
    expect(main.querySelectorAll("ul.ks-recips[role=list] > li")).toHaveLength(10);
    const table = within(main).getByRole("region", { name: "Everyone who handles your data, and where" });
    expect(table).toHaveClass("kh-compare-wrap", "ks-recips-table");
    expect(table).toHaveAttribute("tabindex", "0");
    expect(main.querySelector(".ks-recips li")!.textContent).toBe(
      "Speech and AI providers [PLACEHOLDER: names, or “on request”]What: Turn your child’s voice into Kheelu’s replyWhere: Servers in India",
    );
  });
});

describe("LegalTemplate: the shared blocks come from seller.ts, never retyped (4.4's guard)", () => {
  it("every grievance card prints the D032 line and the complaint-reference note, on all four pages", () => {
    for (const slug of LEGAL_SLUGS) {
      const main = mainOf(page(slug));
      const card = [...main.querySelectorAll(".ks-doc__card")].find((c) => c.textContent!.startsWith("Grievance Officer:"))!;
      expect(card.querySelectorAll("p")).toHaveLength(2);
      expect(card.querySelector("p")!.textContent).toBe(`${toPlainText(seller.grievance.line.lead)} ${toPlainText(seller.grievance.line.text)}`);
      expect(card.querySelectorAll("p")[1].textContent).toBe(toPlainText(legalTemplateCopy.grievanceNote));
    }
  });

  it("the legal fixtures hold no GSTIN, address, grievance wording or close help line of their own", () => {
    for (const slug of LEGAL_SLUGS) {
      const source = readRepoFile(`test/fixtures/legal/${slug}.ts`);
      expect(source).not.toContain(seller.gstin);
      expect(source).not.toContain("Kokarya");
      expect(source).not.toContain("Grievance Officer");
      expect(source, "the close's help line is seller.help, through the template's words").not.toContain(seller.help.contact);
    }
  });
});

/* Task 4.5 item 3: the words the template prints around every legal document live once, in
 * src/content/en-IN/legal/shared.ts, and the reference close's help line is seller.help itself (lead and contact). */
describe("LegalTemplate: the template's own words", () => {
  const helpOf = (main: Element) => main.querySelectorAll(".ks-doc-close .ks-help");

  it("privacy and terms: the close's help line is seller.help, its lead and its contact, after the related pages", () => {
    expect(legalTemplateCopy.help).toBe(seller.help);
    for (const slug of ["privacy", "terms"] as const) {
      const help = helpOf(mainOf(page(slug)));
      expect(help).toHaveLength(1);
      expect(help[0].textContent!.trim()).toBe(`${seller.help.lead} ${toPlainText(seller.help.contact)}`);
      expect(help[0].previousElementSibling).toHaveClass("ks-also");
      expect(help[0].querySelector("svg.kh-icon")).not.toBeNull();
    }
  });

  it("prints whatever the words give it, never a line of its own", () => {
    const copy = { ...legalTemplateCopy, help: { lead: "Rather talk to a person?", contact: "[WhatsApp](https://wa.me/919187546483)" } };
    const help = helpOf(mainOf(page("terms", { copy })));
    expect(help[0].textContent!.trim()).toBe("Rather talk to a person? WhatsApp");
    expect(within(help[0] as HTMLElement).getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", "https://wa.me/919187546483");
  });

  it("refund and shipping: no help line in the close (their help line sits under the short version)", () => {
    for (const slug of ["refund", "shipping"] as const) expect(helpOf(mainOf(page(slug)))).toHaveLength(0);
  });
});

/** True only when A and B are the same type. */
type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

/* Task 4.5 item 2: the legal shapes content writes live in src/content/types.ts (a legal module imports no layout,
 * structure §6), and this folder re-exports them, so every existing import keeps working. Checked by the type check. */
const reExported: [
  Equals<Template.LegalPage, Content.LegalPage>,
  Equals<Template.LegalTemplateCopy, Content.LegalTemplateCopy>,
  Equals<Template.LegalPagePart, Content.LegalPart>,
  Equals<Template.LegalPageBlock, Content.LegalBlock>,
  Equals<Template.LegalRecipients, Content.RecipientsBlock>,
  Equals<Template.LegalShared, Content.SharedBlock>,
  Equals<Template.LegalHero, Content.LegalHero>,
  Equals<Template.LegalParagraph, Content.LegalParagraph>,
  Equals<Template.LegalCardBlock, Content.LegalCardBlock>,
  Equals<Template.LegalGroup, Content.LegalGroup>,
] = [true, true, true, true, true, true, true, true, true, true];

describe("LegalTemplate: copy that changes with the offer (terms in full mode, task 5.12)", () => {
  const terms = LEGAL_FIXTURES.terms.doc;
  if (terms.summary.kind !== "points") throw new Error("terms' short version is numbered points");
  /** Terms with its first point and its price paragraphs per mode, and a paragraph there in token mode only. */
  const byMode: LegalPage = {
    ...terms,
    summary: {
      ...terms.summary,
      points: [
        { lead: "What you pay.", text: { token: "Reserve yours for {price:token} today.", full: "{price:full} (incl. GST), paid in full when you order." } },
        ...terms.summary.points.slice(1),
      ],
    },
    parts: terms.parts.map((part) =>
      part.id !== "price"
        ? part
        : {
            ...part,
            blocks: [
              { kind: "p", id: "first-500", text: { token: "While the first 500 units last, it costs {price:headline}.", full: "Kheelu costs {price:full} (incl. GST)." } },
              { kind: "p", text: { token: "The {price:balance} balance is paid by a payment link.", full: "" } },
              ...part.blocks,
            ],
          },
    ),
  };

  it("the legal shapes live in content/types.ts and this folder re-exports them", () => {
    expect(reExported.every(Boolean)).toBe(true);
    const source = readRepoFile("src/layouts/LegalTemplate/legal-template.types.ts");
    expect(source).toMatch(/from "@\/content\/types";/);
    expect(source.match(/^export (?:interface|type) (\w+)/gm)?.map((line) => line.split(/\s+/)[2])).toEqual([
      "LegalVariant",
      "LegalRecipients",
      "LegalShared",
      "LegalPageBlock",
      "LegalPagePart",
      "LegalTemplateProps",
    ]);
  });

  it("renders each mode's words: the token mode's in token mode", () => {
    const main = mainOf(page("terms", { doc: byMode }));
    expect(main.querySelector(".ks-short li")!.textContent).toBe(`What you pay. Reserve yours for ${TOKEN.prices.token} today.`);
    const paragraphs = [...main.querySelectorAll("#price > p")].map((p) => p.textContent);
    expect(paragraphs.slice(0, 2)).toEqual([
      `While the first 500 units last, it costs ${TOKEN.prices.headline}.`,
      `The ${TOKEN.prices.balance} balance is paid by a payment link.`,
    ]);
    expect(main.querySelector("p#first-500")).not.toBeNull();
  });

  it("and the full mode's in full mode, leaving out a paragraph that has no words in it (never an empty <p>)", () => {
    const main = mainOf(page("terms", { doc: byMode, offer: FULL }));
    expect(main.querySelector(".ks-short li")!.textContent).toBe(`What you pay. ${FULL.prices.full} (incl. GST), paid in full when you order.`);
    const paragraphs = [...main.querySelectorAll("#price > p")];
    expect(paragraphs[0].textContent).toBe(`Kheelu costs ${FULL.prices.full} (incl. GST).`);
    expect(paragraphs.map((p) => p.textContent)).not.toContain(`The ${TOKEN.prices.balance} balance is paid by a payment link.`);
    expect(paragraphs).toHaveLength(mainOf(page("terms", { doc: byMode })).querySelectorAll("#price > p").length - 1);
    expect([...main.querySelectorAll("main p, main li")].filter((el) => el.textContent!.trim() === "")).toEqual([]);
  });
});

describe("LegalTemplate: status and the last-updated line", () => {
  const approved: LegalPage = { ...LEGAL_FIXTURES.refund.doc, status: "approved", approvedOn: "2026-10-20" };

  it("shows the draft note only while the document is a draft", () => {
    render(page("refund"));
    expect(screen.getByText("Draft for the founder’s approval; not legal advice.")).toBeInTheDocument();
  });

  it("an approved document shows no draft note and its approval date in long form", () => {
    const main = mainOf(page("refund", { doc: approved }));
    expect(main.querySelector(".ks-draft")).toBeNull();
    expect(main.querySelector(".ks-updated")!.textContent).toBe("Last updated: 20 October 2026");
  });

  it("a draft with a stored date prints the date, not a placeholder", () => {
    const dated: LegalPage = { ...LEGAL_FIXTURES.privacy.doc, approvedOn: "2026-11-02" };
    expect(mainOf(page("privacy", { doc: dated })).querySelector(".ks-updated")!.textContent).toBe("Last updated: 2 November 2026");
  });
});

describe("LegalTemplate: the close", () => {
  it("refund and shipping: Meet Kheelu carries its tracking value, the second action is a ghost link (architecture §8.3)", () => {
    for (const [slug, cta] of [["refund", "refund-learn"], ["shipping", "shipping-learn"]] as const) {
      const main = mainOf(page(slug));
      const region = within(main).getByRole("region", { name: "Still deciding?" });
      const [learn, other] = within(region).getAllByRole("link");
      expect(learn).toHaveClass("kh-btn", "kh-btn--secondary");
      expect(learn).toHaveAttribute("data-ph-capture-attribute-cta", cta);
      expect(learn.querySelector("svg.kh-icon")).not.toBeNull();
      expect(other).toHaveClass("kh-btn", "kh-btn--ghost");
      expect(other).not.toHaveAttribute("data-ph-capture-attribute-cta");
    }
  });

  it("privacy and terms: no tracking value on the close (the policy row of strategy §5)", () => {
    for (const slug of ["privacy", "terms"] as const) {
      expect(mainOf(page(slug)).querySelector(".ks-doc-close [data-ph-capture-attribute-cta]")).toBeNull();
    }
  });

  it("refuses an action whose tracking value is not a registered secondary value", () => {
    const doc = LEGAL_FIXTURES.refund.doc;
    const bad: LegalPage = { ...doc, close: { ...doc.close!, actions: [{ label: "Meet Kheelu", href: "/products/kheelu", cta: "home-arc" }] } };
    expect(() => mainOf(page("refund", { doc: bad }))).toThrow(/home-arc/);
  });
});

describe("LegalTemplate: content it cannot draw fails the build", () => {
  it("a part whose group has no eyebrow", () => {
    const doc = LEGAL_FIXTURES.terms.doc;
    const bad: LegalPage = { ...doc, groups: doc.groups!.slice(1) };
    expect(() => mainOf(page("terms", { doc: bad }))).toThrow(/Your pre-order/);
  });

  it("an icon the design system lacks", () => {
    const doc = LEGAL_FIXTURES.privacy.doc;
    if (doc.summary.kind !== "trust") throw new Error("privacy's short version is a trust list");
    const bad: LegalPage = { ...doc, summary: { ...doc.summary, items: [{ icon: "not-an-icon", title: "x", body: "y" }] } };
    expect(() => mainOf(page("privacy", { doc: bad }))).toThrow(/not-an-icon/);
  });
});

describe("legal-template.css: one file, two families (mockup-css-mapping §6.1-6.5)", () => {
  const css = readRepoFile("src/layouts/LegalTemplate/legal-template.css");

  /* Task 4.5 item 4: only privacy.css:17 and terms.css:17 style a promise's links (mapping rows 22-23); refund.css and
     shipping.css have no such rule, so a link in a notice page's promise keeps the DS default. */
  it("styles a promise's links in the reference family only (privacy.css:17, terms.css:17; mapping rows 22-23)", () => {
    expect(css).toMatch(/\.ks-doc-summary--reference \.kh-trust__body a[,\s{]/);
    expect(css).not.toMatch(/\.ks-doc-summary \.kh-trust__body a\b/);
    expect(css).not.toMatch(/\.ks-doc-summary--notice \.kh-trust__body a\b/);
  });

  it("the contents number column is 3.5ch in reference and 3ch in notice (privacy.css:24, refund.css:31)", () => {
    expect(css).toMatch(/\.ks-toc a \{[^}]*grid-template-columns: 3\.5ch minmax\(0, 1fr\);/);
    expect(css).toMatch(/\.ks-doc--notice \.ks-toc a \{\s*grid-template-columns: 3ch minmax\(0, 1fr\);/);
  });

  it("the measure sits on the column in notice and on each block in reference (refund.css:35, privacy.css:33, 45)", () => {
    expect(css).toMatch(/\.ks-doc--notice \.ks-doc__body \{\s*max-width: var\(--measure\);/);
    expect(css).toMatch(/\.ks-doc--reference \.ks-doc__part :is\(p, ul, ol\) \{\s*max-width: var\(--measure\);/);
  });

  it("only reference's contents list scrolls in its own box and takes compact rows under a mouse (privacy.css:84, 93-95)", () => {
    expect(css).toMatch(/\.ks-doc--reference \.ks-toc \{\s*max-height: calc\(100vh - var\(--space-5\) \* 2\);\s*overflow-y: auto;/);
    expect(css).toMatch(/@media \(min-width: 1024px\) and \(pointer: fine\) \{\s*\.ks-doc--reference \.ks-toc a \{/);
  });

  it("notice headings keep weight 700 under the headline step, as approved (§6.5)", () => {
    expect(css).toMatch(/\.ks-doc--notice \.ks-doc__part h2 \{[^}]*font-weight: 700;/);
  });

  it("the refund steps are numbered by the ported counter (ks-step, §6.4) and the privacy tools are ported (ks-tool, §6.3)", () => {
    expect(css).toMatch(/counter-reset: ks-step;/);
    expect(css).toMatch(/counter-increment: ks-step;/);
    expect(css).toMatch(/content: counter\(ks-step\);/);
    expect(css).toMatch(/\.ks-tools \{/);
    expect(css).toMatch(/\.ks-tool \{/);
  });
});
