import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { FOUNDERS } from "@/lib/team";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

/** "Made by parents in Bengaluru" (CMO merge, 2026-10-04): the founders on
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
          title="Made by parents in Bengaluru."
          titleClassName="mb-3"
          lede="You are trusting us near your child, so here is who we are."
          ledeClassName="mb-10 max-w-[58ch]"
        />
      </Reveal>
      <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {FOUNDERS.map((f, i) => (
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
        <Link
          href="/team"
          className="inline-flex items-center gap-1.5 rounded font-bold text-orange-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          Our story
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </>
  );
}
