import type { Metadata } from "next";
import Image from "next/image";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { Button } from "@/components/atoms/Button";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";

/* The 404 says so in its title (2026-08-12). It used to inherit the root
   layout's default title, so every broken URL served a page called "Lumi by
   Kheelona: the screen-free friend that grows with your child, ages 2 to 5" —
   indistinguishable from a real page in any analytics tool. That is why
   Ahrefs' "Possible 404" report sat empty while /accessibility-statement was
   quietly taking 10.8% of all site entries into a dead end. Detectors match on
   the title; give them something to match.

   NO brand suffix here: not-found.tsx DOES receive the root layout's
   `%s · Kheelona` template, even though app/page.tsx does not. Writing the
   suffix by hand rendered "Page not found · Kheelona · Kheelona" against a
   local production build, which is why it is measured rather than reasoned
   about. Next injects `robots: noindex` on 404s by itself, so there is none
   here. */
export const metadata: Metadata = {
  title: "Page not found",
  description: "That page is not here. Find Lumi, the journal, or the way home.",
};

/* Revamp M4 (theme B): the 404 joins the room grammar. It also gains the
   finale, which closes a real gap: PREORDER_HREF is "#reserve", so the navbar
   and the guide dock both pointed at an anchor this page did not have.
   Copy: copy-v2 NOT-FOUND. */
export default function NotFound() {
  return (
    <>
      <PageHero
        ratio="md:grid-cols-[1.1fr_0.9fr]"
        guide="curious"
        media={
          <Image
            src="/product/lumi-blue-2.png"
            alt="Lumi, the sky blue talking plush toy, waiting patiently"
            width={1234}
            height={1600}
            sizes="(max-width: 768px) 60vw, 300px"
            priority
            className="h-auto w-full max-w-[260px]"
          />
        }
      >
        <SectionHeading
          as="h1"
          title="This page wandered off."
          titleClassName="mb-4"
          lede="Lumi asked the moon. The moon has not seen it either. Let us take you home."
          ledeClassName="mb-8 max-w-[48ch] text-[19px]"
        />
        <div className="flex flex-wrap gap-4">
          <Button href="/">Back to the start</Button>
          <Button href="/products/lumi" variant="ghost">
            Meet Lumi
          </Button>
        </div>
      </PageHero>

      <RoomsTrack>
        <Room
          fill="white"
          id="reserve"
          guide="silly"
          /* GATED:kheelu-line */
          say="Save your spot. I'll mind Lumi till launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
