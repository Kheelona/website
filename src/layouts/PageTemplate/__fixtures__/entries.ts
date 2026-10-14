import { films, filmsStrip } from "@/content/en-IN/films";
import { faqs } from "@/content/en-IN/faqs";
import { TRUST_COMPACT, trustItems } from "@/content/en-IN/trust";
import type { ArtBoardRef, ImageRef } from "@/content/types";
import { placeholder } from "@/lib/content/placeholder";
import type { CtaBlockConfig } from "@/components/sections/CtaBlock/cta-block.types";
import type { SectionEntryOf, SectionKind } from "../../sections-registry";

/*
 * Test support for the page template and the section registry (task 4.1), never shipped: no page imports it. One
 * small, valid entry per section kind, so the registry's tests can render every kind, plus the shared pieces the
 * template's tests compose pages from. Words are short stand-ins (the sections' own tests hold the approved words).
 */

/** A raster at a stable path, as content gives one. */
export const IMAGE: ImageRef = { src: "/media/kheelu-front.jpg", width: 1200, height: 1200, alt: "Kheelu, the cream plush rabbit" };

/** A one-layer scrapbook board. */
export const ART: ArtBoardRef = { tone: "sun", label: "Kheelu by Kheelona", layers: [{ image: IMAGE, left: 10, width: 60, bottom: 0 }] };

/** The compact trust pair beside a CTA. */
export const COMPACT = TRUST_COMPACT.map((id) => trustItems[id]);

/** A CTA block as a page's content writes it. */
export const CTA_BLOCK: CtaBlockConfig = { cta: "finale", align: "center", trust: COMPACT, helpLine: true };

/** One fixture entry per kind, without slots (the slot cases are the tests' own). */
export const ENTRY_FIXTURES: { readonly [K in SectionKind]: SectionEntryOf<K> } = {
  "hero-section": {
    kind: "hero-section",
    config: { variant: "answer", heading: { id: "hero-title", eyebrow: "Kheelu", title: "A toy that {hand:asks back}", lead: "For ages 3 to 7." } },
  },
  "films-strip": {
    kind: "films-strip",
    config: {
      heading: { id: "films-title", title: "Watch it {hand:ask}" },
      films,
      labels: { ...filmsStrip, of: "of" },
      posters: "lazy",
    },
  },
  "feature-split": {
    kind: "feature-split",
    config: { variant: "ticks", heading: { id: "before-title", title: "Before you {hand:start}" }, items: [{ icon: "check", body: "Home Wi‑Fi." }] },
  },
  "modes-section": {
    kind: "modes-section",
    config: {
      variant: "home",
      heading: { id: "what-title", title: "What is {hand:Kheelu?}", lead: "A plush toy that talks with your child." },
      photo: { image: IMAGE },
      modes: [{ tone: "blue", icon: "wifi-high", title: "AI mode", body: "It talks and asks back." }],
      languages: { title: "Languages", items: [{ native: "English" }] },
    },
  },
  "trust-section": {
    kind: "trust-section",
    config: {
      variant: "never",
      heading: { id: "never-title", title: "What you {hand:won’t} find" },
      items: [{ icon: "eye-slash", title: "Does it have a camera?", body: "No camera." }],
    },
  },
  "compare-by-category": {
    kind: "compare-by-category",
    config: {
      heading: { id: "compare-title", title: "How it {hand:compares}" },
      label: "Comparison by kind of product",
      firstColumn: "What matters",
      columns: { us: "Kheelu", others: ["Tablets"] },
      rows: [
        {
          label: "Screen-free",
          us: { mark: "yes", text: "Yes" },
          others: [{ mark: "no", text: "No" }],
          phone: { us: "Kheelu: Yes", others: ["Tablets: No"] },
        },
      ],
      caption: "Kinds of products, not brands.",
    },
  },
  "card-grid": {
    kind: "card-grid",
    config: { variant: "plain", heading: { id: "cards-title", title: "Three {hand:ways}" }, items: [{ title: "One way", body: "Words." }] },
  },
  "steps-section": {
    kind: "steps-section",
    config: { variant: "checks", heading: { title: "Five {hand:checks}" }, steps: [{ title: "Ask", body: "Does it ask back?" }] },
  },
  "faq-section": {
    kind: "faq-section",
    config: { heading: { id: "faq-title", title: "Questions parents {hand:ask}" }, items: [faqs["think-less"], faqs["what-ages"]] },
  },
  "offer-section": {
    kind: "offer-section",
    config: { variant: "photo", heading: { title: "Pre-order {hand:Kheelu}" }, cta: "product-offer", trust: COMPACT, photo: IMAGE },
  },
  "close-section": {
    kind: "close-section",
    config: { variant: "center", heading: { title: "Meet {hand:Kheelu}" }, cta: { cta: "finale", trust: COMPACT, helpLine: true } },
  },
  "answer-section": {
    kind: "answer-section",
    config: { variant: "team", question: "Who makes {hand:Kheelu?}", answer: "Kheelona, a team in Bengaluru." },
  },
  "product-details": {
    kind: "product-details",
    config: {
      heading: { title: "The {hand:details}" },
      tabsLabel: "Product details",
      specs: { title: "Specs", rows: [{ term: "Ages", value: "3 to 7" }] },
      box: { title: "In the box", items: [{ icon: "package", text: "Kheelu plush toy" }] },
      /* The product page's Safety tab line, in the live team's words (D058 item 1; product.ts). */
      safety: {
        title: "Safety",
        items: [{ icon: "shield-check", text: "Every reply comes from an AI model given child-safety rules and the age you enter in the parent app, with Google’s safety filters on top." }],
      },
      declarations: { title: "Declarations", rows: [{ term: "MRP", value: "{price:mrp} (incl. of all taxes)" }] },
    },
  },
  "topic-section": {
    kind: "topic-section",
    config: { topic: { id: "talking", title: "Talking" }, items: [{ title: "A guide", summary: "What it says." }] },
  },
  "founders-section": {
    kind: "founders-section",
    config: {
      title: "The {hand:founders}",
      founders: [
        {
          name: "A Founder",
          role: "Co-Founder",
          initials: "AF",
          photo: placeholder("B24", "founder photo"),
          body: "Builds Kheelu.",
          link: { label: "LinkedIn", href: "https://www.linkedin.com/in/example" },
        },
      ],
    },
  },
  "recognition-strip": {
    kind: "recognition-strip",
    config: { title: "Recognised by", items: [{ name: "A programme" }] },
  },
  "grievance-block": {
    kind: "grievance-block",
    config: { context: "legal", line: { lead: "Grievance Officer:", text: "A name, an address." } },
  },
  "seller-block": {
    kind: "seller-block",
    config: { context: "legal", line: { lead: "Seller:", text: "A company, an address." } },
  },
  "empty-state-section": {
    kind: "empty-state-section",
    config: {
      icon: "question",
      title: "This page {hand:wandered off}",
      nav: { label: "Ways on", links: [{ icon: "house", title: "Home", href: "/" }] },
    },
  },
  "sources-section": {
    kind: "sources-section",
    config: { variant: "inline", label: "Sources", sources: [{ citation: "A study", href: "https://developingchild.harvard.edu/" }] },
  },
  "article-head": {
    kind: "article-head",
    config: {
      head: { title: "A {hand:guide}", author: "The Kheelona team" },
      published: "2026-09-15",
      trail: [{ name: "Stories", path: "/stories" }],
      labels: { breadcrumb: "Breadcrumb", published: "First published" },
    },
  },
  "article-body": {
    kind: "article-body",
    config: { blocks: [{ kind: "part", title: "A part", blocks: [{ kind: "p", text: "A paragraph." }] }] },
  },
  "related-guides": {
    kind: "related-guides",
    config: { variant: "related", title: "Related guides", items: [{ title: "Another guide", href: "/stories" }] },
  },
};
