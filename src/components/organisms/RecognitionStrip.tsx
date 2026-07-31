import Image from "next/image";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { Eyebrow } from "@/components/atoms/Eyebrow";

/** R7: the recognition row from kheelona.ai (founder-published; assets from
 *  the kheelona.ai repo, entries mirror its content/site.ts RECOGNITION).
 *  Karnataka renders as seal + live text (the tall seal goes unreadable when
 *  squeezed); Founders Inc is text-only by design.
 *  R9: every logo box is one height (h-8) on one baseline (reviewer:
 *  inconsistent sizing).
 *  V6-12: the `safetyLine` prop is gone — no call site ever passed it after
 *  the V3 rebuild, so it was a dead branch shipping four proof chips nowhere. */
const ENTRIES = [
  {
    name: "NVIDIA Inception Program",
    logo: { src: "/recognition/nvidia-inception.png", w: 575, h: 200 },
  },
  {
    name: "Karnataka Elevate",
    mark: { src: "/recognition/karnataka-seal.png", w: 240, h: 240 },
  },
  {
    name: "nasscom startups",
    logo: { src: "/recognition/nasscom.png", w: 306, h: 126 },
  },
  { name: "Founders Inc" },
] as const;

export function RecognitionStrip({
  label = "Recognised by",
  bare = false,
}: {
  label?: string;
  /** Revamp M2: render content-only, for composition inside a Room (the
   *  legacy Section shell stays for routes not yet on the room grammar). */
  bare?: boolean;
}) {
  const content = (
    <>
      <Reveal className="flex flex-wrap items-center gap-x-6 gap-y-4">
          {/* R11: the muted inline variant of the shared kicker (audit: this
              was the one hand-rolled copy of Eyebrow's classes) */}
          <Eyebrow color="text-ink-muted" className="mb-0">
            {label}
          </Eyebrow>
          <ul className="flex flex-wrap items-center gap-3">
            {ENTRIES.map((e) => (
              <li
                key={e.name}
                className="flex h-14 items-center gap-3 rounded-(--radius-card) border border-line-soft bg-white px-5"
              >
                {"logo" in e && e.logo ? (
                  <Image
                    src={e.logo.src}
                    alt={e.name}
                    width={e.logo.w}
                    height={e.logo.h}
                    className="h-8 w-auto"
                  />
                ) : (
                  <>
                    {"mark" in e && e.mark && (
                      <Image
                        src={e.mark.src}
                        alt=""
                        width={e.mark.w}
                        height={e.mark.h}
                        className="h-8 w-8"
                      />
                    )}
                    <span className="text-[16px] font-semibold text-ink-head">
                      {e.name}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
    </>
  );

  if (bare) return content;

  return (
    <Section wash="white">
      <Container className="py-8 md:py-10">{content}</Container>
    </Section>
  );
}
