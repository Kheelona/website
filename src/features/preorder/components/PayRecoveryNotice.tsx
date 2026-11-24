import { Alert } from "@/components/ui/Alert/Alert";
import { payRecoveryCopy } from "@/content/en-IN/store/pay-recovery";

/** "Your payment is still open." with the two things a parent can do about it (D070 / B2, K-172): finish paying the
 *  order they already started, or forget it and use the form. A DS info Alert (role=status, announced politely) in the
 *  form's own column, above the pay button, with the DS small buttons; shown only when the server says the order this
 *  tab started is still unpaid. Presentation only: what the buttons do lives in PreorderForm. */
export function PayRecoveryNotice({ onContinue, onStartAgain }: { onContinue: (event: React.MouseEvent<HTMLButtonElement>) => void; onStartAgain: () => void }) {
  return (
    <Alert
      action={
        <div className="ks-inapp__action">
          <button type="button" className="kh-btn kh-btn--secondary kh-btn--s" onClick={onContinue}>
            {payRecoveryCopy.continue}
          </button>
          <button type="button" className="kh-btn kh-btn--ghost kh-btn--s" onClick={onStartAgain}>
            {payRecoveryCopy.startAgain}
          </button>
        </div>
      }
    >
      <p>{payRecoveryCopy.notice}</p>
    </Alert>
  );
}
