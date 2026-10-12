/**
 * Type tests for StepsSection (task 3.4). `npm run typecheck` checks this file (the `.test-d.tsx` pattern of
 * src/content/types.test-d.ts): the accepted lines must type-check, and every line marked @ts-expect-error must be
 * refused, or the type check fails (TS2578). Never rendered. The config is one type per placement, so what a placement
 * does not render cannot be passed to it: `four` takes exactly four steps (setup.html fold 3), and `thanks` (the
 * confirmation's plain section) takes no ghost link and no band.
 */
import type { StepsSectionConfig, StepsSectionStep } from "./steps-section.types";
import { StepsSection } from "./StepsSection";

const STEP: StepsSectionStep = { title: "Charge Kheelu", body: "Plug it in." };
const heading = { title: "Connect Kheelu" };
const action = { label: "Read more", href: "/stories" } as const;

export const accepted: readonly StepsSectionConfig[] = [
  { variant: "checks", heading, steps: [STEP, STEP, STEP, STEP, STEP], action, band: true },
  { variant: "checks", heading, steps: [STEP] },
  { variant: "four", heading, steps: [STEP, STEP, STEP, STEP], id: "connect" },
  { variant: "thanks", heading, steps: [STEP, STEP, STEP], id: "next" },
];

export const misuses = () => (
  <>
    {/* @ts-expect-error four lays out exactly four steps (setup.html fold 3), never three */}
    <StepsSection variant="four" heading={heading} steps={[STEP, STEP, STEP]} />
    {/* @ts-expect-error four lays out exactly four steps, never five */}
    <StepsSection variant="four" heading={heading} steps={[STEP, STEP, STEP, STEP, STEP]} />
    {/* @ts-expect-error thanks is the confirmation's plain section: it renders no ghost link */}
    <StepsSection variant="thanks" heading={heading} steps={[STEP]} action={action} />
    {/* @ts-expect-error thanks sits in the confirmation's column: it renders no band */}
    <StepsSection variant="thanks" heading={heading} steps={[STEP]} band />
  </>
);
