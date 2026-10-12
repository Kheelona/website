import type { SitePath } from "@/content/types";
import { absoluteUrl } from "../urls";
import { definedOnly, requireText } from "./shared";

/**
 * The HowTo node for /setup (architecture §9.2): built from the same steps the page shows. Supplies,
 * tools and a total time appear only when the page states them.
 */
export interface HowToFacts {
  readonly name: string;
  readonly description?: string;
  readonly path: SitePath;
  readonly steps: readonly {
    readonly name: string;
    readonly text: string;
    /** The step's section id on the page, without the `#`. */
    readonly anchor?: string;
  }[];
  readonly supply?: readonly string[];
  readonly tool?: readonly string[];
  /** An ISO 8601 duration the page states, such as `PT15M`. */
  readonly totalTime?: `PT${number}M`;
}

const FRAGMENT_ID = /^[A-Za-z][A-Za-z0-9_-]*$/;

export function howToNode(facts: HowToFacts) {
  if (facts.steps.length === 0) throw new Error("howToNode needs at least one step");
  return definedOnly({
    "@type": "HowTo" as const,
    name: requireText(facts.name, "HowTo name"),
    description: facts.description,
    url: absoluteUrl(facts.path),
    totalTime: facts.totalTime,
    supply: facts.supply?.map((name) => ({ "@type": "HowToSupply" as const, name })),
    tool: facts.tool?.map((name) => ({ "@type": "HowToTool" as const, name })),
    step: facts.steps.map(({ name, text, anchor }, index) => {
      if (anchor !== undefined && !FRAGMENT_ID.test(anchor)) {
        throw new Error(`HowTo step "${name}": anchor "${anchor}" must be a section id without "#"`);
      }
      return {
        "@type": "HowToStep" as const,
        position: index + 1,
        name: requireText(name, `HowTo step ${index + 1}'s name`),
        text: requireText(text, `HowTo step "${name}" text`),
        url: absoluteUrl(anchor === undefined ? facts.path : `${facts.path}#${anchor}`),
      };
    }),
  });
}

export type HowToNode = ReturnType<typeof howToNode>;
