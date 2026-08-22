import type { StoreEnv } from "@/lib/store/env";

/** Resend, over fetch (§8.25-i).
 *
 *  One endpoint, one header, no SDK. Same reasoning as the Razorpay module: a
 *  payment path should not grow a dependency for a POST.
 *
 *  NEVER THROWS. A failed email must not fail a payment. By the time this runs,
 *  a parent's money has moved and the order is recorded; if Resend is down, the
 *  right outcome is a logged failure and an order we can email later, not a 500
 *  that makes Razorpay retry the webhook and makes us look broken. */
export type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendResult = { sent: boolean; id?: string; error?: string };

export async function sendEmail(env: StoreEnv, email: Email): Promise<SendResult> {
  if (!env.resendApiKey) {
    // Expected state until the founder adds the DNS records and the key.
    console.warn(`[email] skipped "${email.subject}" to ${email.to}: no RESEND_API_KEY`);
    return { sent: false, error: "no-api-key" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.resendApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: env.emailFrom,
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[email] resend rejected "${email.subject}" (${response.status}): ${body}`);
      return { sent: false, error: `resend-${response.status}` };
    }

    const data = (await response.json()) as { id?: string };
    return { sent: true, id: data.id };
  } catch (error) {
    console.error(`[email] resend threw for "${email.subject}"`, error);
    return { sent: false, error: "network" };
  }
}
