import { render } from "@testing-library/react";
import axe from "axe-core";
import { AudioMoments } from "@/components/molecules/AudioMoments";
import { HowItWorksLoop } from "@/components/organisms/HowItWorksLoop";
import { ArchitectureStack } from "@/components/organisms/ArchitectureStack";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { AUDIO_MOMENTS } from "@/lib/audio-moments";

/* V4 a11y gate at the unit level: axe-core over every surface this round
   introduced or repainted. This is the fast tripwire; the full-page axe pass
   in a real browser stays part of the pre-merge checklist (colour contrast
   needs painted pixels, so axe's contrast rule is OFF here — the action-fill
   maths, white on #EF762F at 2.88:1 and knowingly accepted since §8.29, is
   asserted in test/contrast-tokens.test.ts). */
async function expectNoViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
    // jsdom cannot host axe's cross-frame bridge; the Tally iframe inside
    // FinaleCTA is third-party content anyway (V4-a made it render by default)
    iframes: false,
  });
  expect(
    results.violations.map((v) => `${v.id}: ${v.nodes.length} nodes`),
  ).toEqual([]);
}

describe("V4 a11y (axe-core)", () => {
  it("AudioMoments: labelled controls, list semantics, visible transcripts", async () => {
    const { container } = render(<AudioMoments moments={AUDIO_MOMENTS} />);
    await expectNoViolations(container);
  });

  it("HowItWorksLoop: readable list, decorative glow hidden", async () => {
    const { container } = render(
      <HowItWorksLoop
        steps={[
          { title: "Talk and play", label: "Step 1", body: "Questions and games." },
          { title: "Kheelu remembers", label: "Step 2 · Adaptive memory", body: "Vocabulary and pace." },
          { title: "Knowledge that sticks", label: "Step 3 · Real-world learning", body: "Ideas in conversation." },
        ]}
        repeatNote="Then it begins again."
      />,
    );
    await expectNoViolations(container);
  });

  it("ArchitectureStack: accordion semantics survive the custom styling", async () => {
    const { container } = render(
      <ArchitectureStack
        above={[
          { id: "a", name: "Physical AI companion", blurb: "The toy.", chips: ["Screen free"], tint: "bg-white" },
        ]}
        below={[
          { id: "b", name: "Hardware", blurb: "The body.", chips: ["Custom PCB"], tint: "bg-orange/15" },
        ]}
      />,
    );
    await expectNoViolations(container);
  });

  it("FinaleCTA: the white finale keeps heading order and link names", async () => {
    const { container } = render(<FinaleCTA />);
    await expectNoViolations(container);
  });
});
