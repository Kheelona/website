/**
 * Type tests for GrievanceBlock (task 3.6 item 6). `npm run typecheck` (tsc --noEmit) checks this file: the
 * `.test-d.tsx` suffix is inside tsconfig.json's `**\/*.tsx` include and outside its `**\/*.test.tsx` exclude and
 * Vitest's runtime suite. Every line marked @ts-expect-error must be refused, or the type check fails (TS2578).
 * Never rendered.
 *
 * D032's line, the fold's words and the complaint-reference note are the same in both offer modes and render without
 * the offer, so each is one `RichTextString`, never the per-mode `Copy` shape (which would throw at render).
 */
import { GrievanceBlock } from "./GrievanceBlock";

const MODES = { token: "Token words", full: "Full words" } as const;
const LINE = { lead: "Grievance Officer:", text: "Aman Soni, Co-Founder and CTO." };

export const accepted = () => (
  <>
    <GrievanceBlock context="contact" title="Make a formal complaint." intro="Please include your order number." line={LINE} />
    <GrievanceBlock context="legal" line={LINE} note="{ph:how you get a complaint reference}" className="ks-doc__card" />
  </>
);

export const misuses = () => (
  <>
    {/* @ts-expect-error the fold's title is one string: it renders without the offer */}
    <GrievanceBlock context="contact" title={MODES} intro="x" line={LINE} />
    {/* @ts-expect-error nor the sentence beside the card */}
    <GrievanceBlock context="contact" title="x" intro={MODES} line={LINE} />
    {/* @ts-expect-error nor D032's line */}
    <GrievanceBlock context="legal" line={{ lead: "Grievance Officer:", text: MODES }} />
    {/* @ts-expect-error nor its lead */}
    <GrievanceBlock context="legal" line={{ lead: MODES, text: "x" }} />
    {/* @ts-expect-error nor the complaint-reference note */}
    <GrievanceBlock context="legal" line={LINE} note={MODES} />
  </>
);
