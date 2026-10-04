import { render } from "@testing-library/react";
import axe from "axe-core";
import { VideoMoments } from "@/components/organisms/VideoMoments";
import { HowItWorksLoop } from "@/components/organisms/HowItWorksLoop";
import { ArchitectureStack } from "@/components/organisms/ArchitectureStack";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { VIDEO_ASPECT, type VideoMoment } from "@/lib/video-moments";

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

/* Three rows is the minimum the carousel renders at all. Paths are fictional:
   axe reads the markup, and a file that does not resolve exercises the same
   tree a real one would. */
const VIDEO_A11Y_FIXTURES: readonly VideoMoment[] = ["one", "two", "three"].map((id) => ({
  id,
  chip: `A parent in city ${id}`,
  label: `What happens in clip ${id}.`,
  alt: `A child holding the cream Kheelu plush, clip ${id}.`,
  src: `/video/moments/${id}.mp4`,
  poster: `/video/moments/${id}.jpg`,
  width: VIDEO_ASPECT.width,
  height: VIDEO_ASPECT.height,
  hasOpenCaptions: true,
  consentOnFile: true,
}));

describe("V4 a11y (axe-core)", () => {
  /* AudioMoments held this slot until 2026-09-19, when the audio demos were
     removed from the site (§8.37). VideoMoments took the surface, so it takes
     the gate: same round, same tripwire. */
  it("VideoMoments: labelled tiles, list semantics, one motion control", async () => {
    const { container } = render(<VideoMoments moments={VIDEO_A11Y_FIXTURES} />);
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
