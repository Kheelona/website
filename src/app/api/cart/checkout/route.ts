import { NextRequest, NextResponse } from "next/server";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { getWixTokenStorage, isWixConfigured } from "@/lib/wix/auth";

type CheckoutResponse = {
  redirectUrl: string;
};

type WixError = {
  message?: string;
  status?: number;
  statusCode?: number;
  details?: { httpStatusCode?: number; applicationError?: { description?: string } };
};

function getReturnTo(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get("returnTo");
  if (returnTo && returnTo.startsWith("/")) return returnTo;

  const referer = request.headers.get("referer");
  if (!referer) return "/";

  try {
    const refererUrl = new URL(referer);
    return `${refererUrl.pathname}${refererUrl.search}`;
  } catch {
    return "/";
  }
}

function isUnauthorizedError(error: unknown) {
  const err = error as {
    status?: number;
    statusCode?: number;
    details?: { httpStatusCode?: number };
  };
  return (
    err?.status === 401 ||
    err?.statusCode === 401 ||
    err?.details?.httpStatusCode === 401 ||
    String(error).includes("401")
  );
}

async function createWixCheckoutClient() {
  if (!isWixConfigured()) {
    throw new Error("Wix client ID not configured");
  }

  const tokenStorage = await getWixTokenStorage();

  return createClient({
    modules: { currentCart, redirects },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokenStorage,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const wixClient = await createWixCheckoutClient();

    const origin = request.nextUrl.origin;
    const returnTo = getReturnTo(request);

    const current = await wixClient.currentCart.getCurrentCart();
    if (!current?.lineItems?.length) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const checkout = await wixClient.currentCart.createCheckoutFromCurrentCart({
      channelType: "WEB",
    });

    let redirectUrl = "";
    try {
      const redirectSession = await wixClient.redirects.createRedirectSession({
        ecomCheckout: {
          checkoutId: checkout.checkoutId,
        },
        callbacks: {
          postFlowUrl: `${origin}${returnTo}`,
        },
        origin,
      });

      redirectUrl =
        redirectSession.redirectSession?.fullUrl || redirectSession.redirectSession?.shortUrl || "";
    } catch {
      // Fallback for localhost/dev or redirect session errors
      redirectUrl =
        checkout.checkout?.checkoutUrl || checkout.checkout?.url || checkout.checkoutUrl || "";
    }

    if (!redirectUrl) {
      return NextResponse.json({ message: "Failed to create checkout" }, { status: 500 });
    }

    return NextResponse.json<CheckoutResponse>({ redirectUrl });
  } catch (error) {
    if (isUnauthorizedError(error)) {
      const returnTo = getReturnTo(request);
      const loginUrl = `/api/auth/wix/login?returnTo=${encodeURIComponent(returnTo)}`;
      return NextResponse.json(
        { message: "Please login to continue checkout", loginUrl },
        { status: 401 }
      );
    }

    const err = error as WixError;
    const devDetails =
      process.env.NODE_ENV !== "production"
        ? {
            error:
              err?.details?.applicationError?.description ||
              err?.message ||
              "Unknown checkout error",
            status: err?.status ?? err?.statusCode ?? err?.details?.httpStatusCode ?? null,
          }
        : {};

    return NextResponse.json(
      { message: "Failed to create checkout", ...devDetails },
      { status: 500 }
    );
  }
}
