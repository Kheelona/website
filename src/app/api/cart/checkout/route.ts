import { NextRequest, NextResponse } from "next/server";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { getWixTokenStorage, isWixConfigured } from "@/lib/wix/auth";

type CheckoutResponse = {
  redirectUrl: string;
};

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

    const checkout = await wixClient.currentCart.createCheckoutFromCurrentCart({
      channelType: "WEB",
    });

    console.log("Created checkout:", checkout);

    const redirectSession = await wixClient.redirects.createRedirectSession({
      ecomCheckout: {
        checkoutId: checkout.checkoutId,
      },
      callbacks: {
        postFlowUrl: origin,
      },
      origin,
    });

    console.log("Redirect session:", redirectSession);

    const redirectUrl =
      redirectSession.redirectSession?.fullUrl || redirectSession.redirectSession?.shortUrl || "";

    console.log("Redirect url:", redirectUrl);

    if (!redirectUrl) {
      return NextResponse.json({ message: "Failed to create checkout" }, { status: 500 });
    }

    return NextResponse.json<CheckoutResponse>({ redirectUrl });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create checkout" }, { status: 500 });
  }
}
