import Link from "next/link";
import { Faq } from "@/components/molecules/Faq";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { pageGraph, faqPage, breadcrumbs, pageMeta, jsonLd } from "@/lib/seo";
import { FAQ_GROUPS } from "@/lib/faq";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

export const metadata = pageMeta({
  title: "Questions parents ask about Kheelu",
  description:
    "Short, straight answers about Kheelu: what it is, safety and privacy, price and refunds, and delivery. Can't find yours? Ask us on WhatsApp.",
  path: "/faq",
});

const JSON_LD = pageGraph(
  faqPage(FAQ_GROUPS.flatMap((g) => g.items)),
  breadcrumbs([{ name: "FAQ", path: "/faq" }]),
);

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(JSON_LD) }} />

      <section className="kh-page-hero">
        <div className="kh-wrap kh-stack">
          <h1 className="kh-h1">Questions parents ask</h1>
          <p className="kh-lead">
            Short, straight answers. Can&apos;t find yours?{" "}
            <a href={SUPPORT_WHATSAPP_HREF} className="font-semibold text-ink-head underline underline-offset-4">
              Ask us on WhatsApp
            </a>
            .
          </p>
        </div>
      </section>

      <section className="kh-sec pt-0 min-[900px]:pt-0">
        <div className="kh-wrap">
          {FAQ_GROUPS.map((g) => (
            <div key={g.title}>
              <h2 className="kh-faq-group">{g.title}</h2>
              <Faq items={[...g.items]} name={`faq-${g.title}`} openFirst={false} />
            </div>
          ))}
          <p className="kh-note mt-8">
            The full terms live on{" "}
            <Link href="/refund" className="font-semibold underline underline-offset-4">
              Refunds
            </Link>{" "}
            and{" "}
            <Link href="/shipping" className="font-semibold underline underline-offset-4">
              Shipping
            </Link>
            .
          </p>
        </div>
      </section>

      <FinaleCTA />
    </>
  );
}
