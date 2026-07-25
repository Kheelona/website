import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { Eyebrow } from "@/components/atoms/Eyebrow";

/** R7: the recognition row from kheelona.ai (founder-published; assets from
 *  the kheelona.ai repo, entries mirror its content/site.ts RECOGNITION).
 *  Karnataka renders as seal + live text (the tall seal goes unreadable when
 *  squeezed); Founders Inc is text-only by design.
 *  R9: every logo box is one height (h-8) on one baseline (reviewer:
 *  inconsistent sizing), and `safetyLine` pairs the startup badges with the
 *  proof a worried parent actually cares about — all four facts already
 *  published on /safety. Home turns it on; Team's "Backed by" stays clean. */
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

const SAFETY_PROOFS = [
  "Wake-word mic",
  "Safety check on every reply",
  "One-tap delete",
  "Voice data never sold",
] as const;

export function RecognitionStrip({
  label = "Recognised by",
  safetyLine = false,
  bare = false,
}: {
  label?: string;
  safetyLine?: boolean;
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
      {safetyLine && (
        <Reveal className="mt-5">
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {SAFETY_PROOFS.join(" · ")} ·{" "}
            <Link
              href="/safety"
              className="font-semibold text-ink-head underline underline-offset-4"
            >
              See how we built safety in
            </Link>
          </p>
        </Reveal>
      )}
    </>
  );

  if (bare) return content;

  return (
    <Section wash="white">
      <Container className="py-8 md:py-10">{content}</Container>
    </Section>
  );
}
