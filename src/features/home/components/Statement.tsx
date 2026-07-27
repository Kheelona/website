import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";

/** Home room 2 (revamp M2): the brand statement, copy-v2 [seed]. Replaces
 *  WhyWeExist + KheeluIntro (the guide now carries Kheelu's presence). */
export function Statement() {
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:gap-14">
      <Reveal>
        <SectionHeading
          title="We build companions, not gadgets."
          titleClassName="max-w-[14ch]"
        />
      </Reveal>
      <Reveal delay={0.08} className="md:pt-2">
        <p className="mb-5 max-w-[54ch] text-[clamp(18px,1.6vw,21px)]">
          A gadget waits to be told what to do. A companion starts the
          conversation. Lumi asks your child a question, listens to the
          answer, then asks the next one. That back and forth is how your
          child learns to think.
        </p>
        <p className="mb-5 max-w-[44ch] border-l-[3px] border-orange pl-5 font-display text-[clamp(20px,2vw,25px)] font-bold leading-[1.35] text-ink-head">
          Lumi listens and answers. It remembers what your child said last
          time. Your child feels known, not managed.
        </p>
        {/* V3 bridge: the sentence that makes the education half land without
            turning the page into ed-tech. Fun is what the child sees. */}
        <p className="max-w-[48ch] font-display text-[18px] font-bold text-ink-head">
          Lumi plays like a toy and teaches like a tutor. Your child will only
          notice the friend.
        </p>
      </Reveal>
    </div>
  );
}
