import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { StepList } from "@/components/molecules/StepList";
import { Reveal } from "@/components/molecules/Reveal";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { SETUP_STEPS } from "@/lib/setup-steps";
import { pageGraph, setupHowTo, breadcrumbs, pageMeta, jsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Setup: day one with Kheelu",
  description:
    "How simple day one will be: charge Kheelu, open the parent app, set your languages and topics, and let your child say hello.",
  path: "/setup",
});

/* Revamp M4 (theme B): hero on the backdrop + rooms, narrated by the
   persistent KheeluGuide (the old per-section KheeluSays bubble is gone).
   Copy: copy-v2 /SETUP. The four steps stay in lib/setup-steps so the Home
   band and this page can never drift apart (R9). */

export default function SetupPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            pageGraph(setupHowTo(SETUP_STEPS), breadcrumbs([{ name: "Setup", path: "/setup" }])),
          ),
        }}
      />
      <PageHero
        ratio="md:grid-cols-[1.15fr_0.85fr]"
        guide="joy"
        /* GATED:kheelu-line — founder sign-off before merge to master */
        say="Step three is my favourite. We say hello."
        media={
          <PhoneFrame
            src="/app/onboarding.png"
            alt="The parent app on day one, choosing who you are to your child"
            width={240}
            priority
          />
        }
      >
        <SectionHeading
          as="h1"
          eyebrow="Day one"
          title="Day one takes minutes."
          titleClassName="mb-5"
          lede="Four steps, no manual required. Kheelu is made for homes, not IT departments."
          ledeClassName="max-w-[56ch]"
        />
      </PageHero>

      <RoomsTrack>
        <Room fill="white" reveal="left">
          {/* steps sit directly under the h1, so their titles are h2 */}
          <StepList items={SETUP_STEPS} as="h2" />
          <Reveal className="mt-8">
            {/* TODO(claims-specs): add wake word + charger details when final. */}
            <p className="max-w-[62ch] text-[16px] text-ink-muted">
              The exact wake word and charger details will be published here
              with the final specs, before Kheelu ships.
            </p>
          </Reveal>
        </Room>

        <Room
          fill="white"
          id="reserve"
          guide="silly"
          /* GATED:kheelu-line */
          say="Save your spot. I'll mind Kheelu till launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
