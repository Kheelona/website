/**
 * Type tests for Photo (task 2.3; ADR-010, N12). `npm run typecheck` (tsc --noEmit) checks this file: the
 * `.test-d.tsx` suffix is inside tsconfig.json's `**\/*.tsx` include and outside its `**\/*.test.tsx` exclude and
 * Vitest's runtime suite (the src/content/types.test-d.ts pattern). The accepted lines must type-check, and every
 * line marked @ts-expect-error must be refused, or the type check fails (TS2578). Never rendered.
 */
import type { StaticImageData } from "next/image";
import { Photo } from "./Photo";

const IRA = { src: { src: "/_next/static/media/ira-01.webp", width: 1208, height: 1500 } as StaticImageData, alt: "" };
const SIZES = "(min-width: 900px) 540px, calc(100vw - 32px)";

export const accepted = () => (
  <>
    <Photo image={IRA} sizes={SIZES} />
    <Photo image={IRA} sizes={SIZES} lcp />
    <Photo image={IRA} sizes={SIZES} fetchPriority="low" ratio="576 / 1209" />
  </>
);

export const misuses = () => (
  <>
    {/* @ts-expect-error sizes is required: the phone never fetches a laptop image */}
    <Photo image={IRA} />
    {/* @ts-expect-error no priority prop: deprecated in Next 16 (N12) */}
    <Photo image={IRA} sizes={SIZES} priority />
    {/* @ts-expect-error no preload prop: the LCP image takes lcp (eager, fetchpriority high) */}
    <Photo image={IRA} sizes={SIZES} preload />
    {/* @ts-expect-error the LCP hint comes only from lcp, never a high fetchPriority by hand */}
    <Photo image={IRA} sizes={SIZES} fetchPriority="high" />
    {/* @ts-expect-error a ratio is "width / height" */}
    <Photo image={IRA} sizes={SIZES} ratio="4:5" />
  </>
);

/** The bare form (task 3.6): the image alone, so nothing that belongs to the frame. */
export const bare = () => (
  <>
    <Photo bare image={IRA} sizes={SIZES} className="ks-know__img" />
    <Photo bare image={IRA} sizes={SIZES} lcp />
    <Photo bare image={IRA} sizes={SIZES} fetchPriority="low" />
    {/* @ts-expect-error sizes is required in the bare form too */}
    <Photo bare image={IRA} />
    {/* @ts-expect-error no frame variant: there is no frame */}
    <Photo bare image={IRA} sizes={SIZES} variant="wide" />
    {/* @ts-expect-error no larger frame radius */}
    <Photo bare image={IRA} sizes={SIZES} xl />
    {/* @ts-expect-error no crop ratio */}
    <Photo bare image={IRA} sizes={SIZES} ratio="4 / 5" />
    {/* @ts-expect-error no caption: a caption needs the figure */}
    <Photo bare image={IRA} sizes={SIZES} caption="x" />
    {/* @ts-expect-error no reveal: the reveal hook is the figure's */}
    <Photo bare image={IRA} sizes={SIZES} reveal />
  </>
);
