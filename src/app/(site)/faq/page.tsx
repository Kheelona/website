import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Faq } from "@/components/molecules/Faq";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHero } from "@/components/templates/PageHero";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { pageGraph, faqPage, breadcrumbs, pageMeta, jsonLd } from "@/lib/seo";
import { FAQ_GROUPS } from "@/lib/faq";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

export const metadata = pageMeta({
  title: "Questions parents ask about Kheelu",
  description:
    "Short, straight answers about Kheelu: what it is, safety and privacy, price and refunds, and delivery. Cannot find yours? Ask us on WhatsApp.",
  path: "/faq",
});

/* Every answer below renders, so the FAQPage graph may describe all of them
   (schema mirrors visible copy only). */
const JSON_LD = pageGraph(
  faqPage(FAQ_GROUPS.flatMap((g) => g.items)),
  breadcrumbs([{ name: "FAQ", path: "/faq" }]),
);

const LINK =
  "rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2";

/* /faq (CMO merge, 2026-10-04): the mockup's new page. Until now /faq was a
   308 to /products/kheelu#faq; it is a real page from this round, and the
   redirect is gone from next.config.ts. Four groups, one native-<details>
   list each (every answer in the HTML, no client JavaScript), all closed so
   the questions scan as a list. Each list gets its own `name`, so opening a
   question in one group does not close one in another. */
export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(JSON_LD) }} />

      <PageHero>
        <SectionHeading
          as="h1"
          eyebrow="FAQ"
          title="Questions parents ask."
          titleClassName="mb-5"
          lede={
            <>
              Short, straight answers. Cannot find yours?{" "}
              <a href={SUPPORT_WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={LINK}>
                Ask us on WhatsApp
              </a>
              .
            </>
          }
          ledeClassName="max-w-[58ch]"
        />
      </PageHero>

      <RoomsTrack>
        <Room fill="white" reveal="left">
          <div className="mx-auto flex max-w-[860px] flex-col gap-12">
            {FAQ_GROUPS.map((g) => (
              <Reveal key={g.title}>
                <SectionHeading level="minor" title={g.title} titleClassName="mb-5" />
                <div className="rounded-(--radius-card) border border-line">
                  <Faq items={[...g.items]} name={`faq-${g.title}`} openFirst={false} />
                </div>
              </Reveal>
            ))}
            <p className="text-[16px] text-ink">
              The full terms live on the{" "}
              <Link href="/refund" className={LINK}>
                refund policy
              </Link>{" "}
              and the{" "}
              <Link href="/shipping" className={LINK}>
                shipping details
              </Link>
              . Safety has its own page, with longer answers:{" "}
              <Link href="/safety" className={LINK}>
                how we keep Kheelu safe
              </Link>
              .
            </p>
          </div>
        </Room>

        <Room fill="white" id="reserve" reveal="pop" className="overflow-x-clip">
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
