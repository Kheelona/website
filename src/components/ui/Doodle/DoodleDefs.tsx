import { DoodleChalkFilter } from "@/assets/doodles.generated";

/* The one shared chalk grain filter, #ks-chalk (task 2.3; ADR-010, architecture §10). Every DS doodle file ships
 * the same feTurbulence filter under the same id; the generated inline doodles point at this single copy instead,
 * so a page never repeats an id. Rendered once per page by the shells (SiteShell, task 3.1), before any drawn
 * doodle. A zero-size SVG taken out of the flow (doodle.css), not display: none, so every browser resolves the
 * reference. */
export function DoodleDefs() {
  return (
    <svg className="ks-doodle-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <DoodleChalkFilter />
      </defs>
    </svg>
  );
}
