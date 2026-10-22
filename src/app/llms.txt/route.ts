import { machineFileResponse } from "@/lib/site-pages/respond";

/** `/llms.txt`: the redesign's own file (redesign/dist/llms.txt, prepared by prebuild step 40), the one source of truth for the
 *  site's pages and facts; any amount follows the live offer (src/lib/site-pages/offer-swap.ts). Prerendered and
 *  revalidated within the offer window (ADR-005), as the pages are. */
export const dynamic = "force-static";
export const revalidate = 300;

export function GET() {
  return machineFileResponse("llms.txt");
}
