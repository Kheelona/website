import { Alert } from "@/components/ui/Alert/Alert";
import { testModeCopy } from "@/content/en-IN/store/test-mode";

/**
 * "TEST MODE: no real payments" (D071 (K-182), T2): a DS warning Alert on the cream band at the very top of every store
 * page on a beta build, above the store header, so nobody mistakes a test payment on betastore.kheelona.com for a real
 * one. `StoreShell` renders it only when `SITE_ENV` is "beta" (the inlined build-time value, src/config/env.ts); on
 * production, preview and development nothing renders. A server component: no client code, no script.
 *
 * The DS Alert, tone `warning` (a polite `role="status"`; `danger` would be `role="alert"`, announced at once, which a
 * standing label must not be), static and not dismissible, in normal flow (never fixed, so it covers neither the page
 * nor the pay bar). Existing DS classes only, and no CSS of its own: the DS's tight band section (`kh-section
 * kh-section--band kh-section--tight`, the side padding the store header keeps) around the container, with the Alert
 * as the DS draws it on the band (a notice card). Production's CSS is therefore byte-identical to what it was before
 * this strip existed. The words come from content.
 */
export function TestModeStrip() {
  return (
    <div className="kh-section kh-section--band kh-section--tight">
      <div className="kh-container">
        <Alert tone="warning" title={testModeCopy.strip} />
      </div>
    </div>
  );
}
