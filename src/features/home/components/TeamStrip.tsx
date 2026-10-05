import Image from "next/image";
import { TextLink } from "@/components/molecules/TextLink";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { FOUNDERS } from "@/lib/team";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

/** The co-founders (founder, 2026-10-04). Ria has left the site entirely, so
 *  this is every person in lib/team.ts; the filter stays so that a future
 *  non-founder hire does not land on Home without a decision. */
export const HOME_TEAM = FOUNDERS.filter((f) => f.role.startsWith("Co-founder"));

/** "Designed by parents in Bengaluru" (CMO merge, 2026-10-04): the founders on
 *  Home. The mockup said "Made by parents in Bengaluru"; "made ... in
 *  Bengaluru" reads as where the toy is manufactured, which the site has never
 *  claimed, so the heading matches the footer's "Designed by" (consistency
 *  pass, 2026-10-04). It shows the founders on
 *  Home, because a parent is trusting these people near their child. Each
 *  one-liner is the `short` field of `lib/team.ts`, condensed from the bio
 *  /team already publishes and claiming nothing it does not. The full story
 *  stays on /team; the recognition logos sit higher on the page. */
export function TeamStrip() {
  return (
    <>
      <Reveal>
        <SectionHeading
          eyebrow="Who we are"
          title="Designed by parents in Bengaluru."
          titleClassName="mb-3"
          lede="You are trusting us near your child, so here is who we are."
          ledeClassName="mb-10 max-w-[58ch]"
        />
      </Reveal>
      <ul className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        {HOME_TEAM.map((f, i) => (
          <Reveal as="li" key={f.id} delay={i * 0.05} className="flex flex-col gap-1.5">
            <Image
              src={f.photo}
              alt={f.name}
              width={480}
              height={480}
              sizes="(max-width: 1024px) 45vw, 260px"
              className="mb-2 aspect-square w-full rounded-(--radius-card) object-cover"
            />
            <p className="font-display text-[18px] font-extrabold text-ink-head">{f.name}</p>
            <p className="text-[15px] leading-snug text-ink-muted">{f.short}</p>
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button href={SUPPORT_WHATSAPP_HREF} variant="ghost">
          Ask us on WhatsApp
        </Button>
        <TextLink href="/team">Our story</TextLink>
      </Reveal>
    </>
  );
}
