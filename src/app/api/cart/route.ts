import { NextRequest, NextResponse } from "next/server";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { currentCart } from "@wix/ecom";
import { getWixTokenStorage, isWixConfigured } from "@/lib/wix/auth";

const WIX_STORES_APP_ID = "215238eb-22a5-4c36-9e7b-e7c08025e04e";

type CartItemResponse = {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  image: string;
};

type CartResponse = {
  items: CartItemResponse[];
};

function parseNumber(value?: string | number | null) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

async function createWixCartClient() {
  if (!isWixConfigured()) {
    throw new Error("Wix client ID not configured");
  }

  const tokenStorage = await getWixTokenStorage();

  return createClient({
    modules: { currentCart },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokenStorage,
    }),
  });
}

function mapCartItems(cart: { lineItems?: any[] } | undefined): CartItemResponse[] {
  return (cart?.lineItems ?? []).map((lineItem) => {
    const price = parseNumber(lineItem?.fullPrice?.amount ?? lineItem?.price?.amount);
    const discountedPrice = parseNumber(lineItem?.price?.amount ?? lineItem?.lineItemPrice?.amount);

    return {
      id: lineItem?._id ?? "",
      name: lineItem?.productName?.original ?? "",
      price,
      discountedPrice,
      quantity: lineItem?.quantity ?? 1,
      image: lineItem?.image ?? "/toy.png",
    };
  });
}

function isNotFoundError(error: unknown) {
  const err = error as {
    status?: number;
    statusCode?: number;
    details?: { httpStatusCode?: number };
  };
  return (
    err?.status === 404 ||
    err?.statusCode === 404 ||
    err?.details?.httpStatusCode === 404 ||
    String(error).includes("404")
  );
}

export async function GET() {
  try {
    const wixClient = await createWixCartClient();
    const cart = await wixClient.currentCart.getCurrentCart();
    return NextResponse.json<CartResponse>({ items: mapCartItems(cart) });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json<CartResponse>({ items: [] });
    }
    return NextResponse.json({ message: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const wixClient = await createWixCartClient();
    const body = (await request.json()) as { productId?: string; quantity?: number };

    if (!body.productId) {
      return NextResponse.json({ message: "Missing productId" }, { status: 400 });
    }

    const response = await wixClient.currentCart.addToCurrentCart({
      lineItems: [
        {
          catalogReference: {
            appId: WIX_STORES_APP_ID,
            catalogItemId: body.productId,
          },
          quantity: body.quantity ?? 1,
        },
      ],
    });

    return NextResponse.json<CartResponse>({ items: mapCartItems(response.cart) });
  } catch (error) {
    return NextResponse.json({ message: "Failed to add to cart" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const wixClient = await createWixCartClient();
    const body = (await request.json()) as { lineItemId?: string; quantity?: number };

    if (!body.lineItemId || !body.quantity || body.quantity < 1) {
      return NextResponse.json({ message: "Missing lineItemId or quantity" }, { status: 400 });
    }

    const response = await wixClient.currentCart.updateCurrentCartLineItemQuantity([
      {
        _id: body.lineItemId,
        quantity: body.quantity,
      },
    ]);

    return NextResponse.json<CartResponse>({ items: mapCartItems(response.cart) });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const wixClient = await createWixCartClient();
    const body = (await request.json().catch(() => ({}))) as {
      lineItemId?: string;
      clearAll?: boolean;
    };

    if (body.clearAll) {
      await wixClient.currentCart.deleteCurrentCart();
      return NextResponse.json<CartResponse>({ items: [] });
    }

    if (!body.lineItemId) {
      return NextResponse.json({ message: "Missing lineItemId" }, { status: 400 });
    }

    const response = await wixClient.currentCart.removeLineItemsFromCurrentCart([body.lineItemId]);
    return NextResponse.json<CartResponse>({ items: mapCartItems(response.cart) });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update cart" }, { status: 500 });
  }
}
