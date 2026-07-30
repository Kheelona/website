import Image from "next/image";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { Button } from "@/components/atoms/Button";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";

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
