"use client";

import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export const getWixImageUrl = (wixImage: string, width = 800, height = 600) => {
  if (!wixImage) return "";

  const imageId = wixImage.split("/")[3];
  // 7303e2_06733c7a98f542a3aabe9de534d7cc60~mv2.jpeg

  return `https://static.wixstatic.com/media/${imageId}/v1/fill/w_${width},h_${height},al_c,q_90/${imageId}`;
};

export default function CartUI() {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, isCartOpen, setCartOpen } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const itemCount = getTotalItems();

  // const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = cartItems.reduce((total, item) => total + item.discountedPrice * item.quantity, 0);

  useEffect(() => {
    if (itemCount == 0) {
      setCartOpen(false);
    }
  }, [itemCount, setCartOpen]);

  const handleCheckout = async () => {
    if (isCheckingOut || cartItems.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutError("");
    try {
      const response = await fetch(
        `/api/cart/checkout?returnTo=${encodeURIComponent(
          `${window.location.pathname}${window.location.search}`
        )}`,
        { method: "POST" }
      );

      const data = (await response.json()) as {
        redirectUrl?: string;
        loginUrl?: string;
        message?: string;
      };

      if (response.status === 401 && data.loginUrl) {
        window.location.href = data.loginUrl;
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to create checkout");
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      throw new Error("Missing redirect URL");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create checkout";
      setCheckoutError(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Dialog.Root open={isCartOpen} onOpenChange={setCartOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Shopping cart"
          className="relative flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ShoppingCart size={22} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
              {itemCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-white/40 backdrop-blur-xl z-[60]" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-[70]">
          <Dialog.Title className="sr-only">Shopping cart</Dialog.Title>
          {/* Cart Container */}
          <div className="w-105 rounded-3xl p-4 relative h-[700] max-h-[80vh] overflow-y-visible">
            {/* Close Button */}
            <Dialog.Close asChild>
              <button className="absolute -top-8 right-4 w-10 h-10 rounded-full text-black  bg-white border border-[#BDBDBD] flex items-center justify-center hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </Dialog.Close>

            {/* Inner Card */}
            <div className="bg-white h-full rounded-3xl p-8 pt-15 px-5 border border-[#BDBDBD]">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Cart Items */}
                  <div className="grow space-y-4 mb-6 h-[calc(100%-255px)] ">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 pb-4 border-b last:border-b-0 border-[#BDBDBD]"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-2xl bg-gray-100 border border-[#BDBDBD] flex items-center justify-center shrink-0">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition-colors border border-[#BDBDBD]"
                          >
                            <X size={14} />
                          </button>
                          <Image
                            src={getWixImageUrl(item.image)}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover border rounded-2xl"
                          />
                        </div>

                        {/* Product Name and Price */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#4A4A4A] text-[20px]">
                            {item.name}
                          </h3>
                          {/* <p className="text-sm text-gray-500">
                            ₹{item.discountedPrice.toLocaleString("en-IN")}
                          </p> */}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 border border-[#C0C0C0] rounded-full px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded-full transition-colors font-heading leading-0 mt-1 text-[16px]"
                          >
                            -
                          </button>
                          <span className="font-medium text-center font-heading leading-0 mt-1 text-[16px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded-full transition-colors font-heading leading-0 mt-1 text-[16px]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="border border-[#BDBDBD] rounded-2xl p-4">
                    <div className="text-[14px] flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span>-50%</span>
                    </div>
                    {/* <div className="text-[20px] flex justify-between text-gray-600 mb-2">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div> */}

                    <div className="text-[20px] flex justify-between items-end pb-4">
                      <span className="text-[24px] font-semibold">Subtotal</span>
                      <span className="text-[24px] font-bold">
                        ₹{Math.round(total).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Buy Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full bg-tangerine text-white text-lg font-bold py-3 rounded-xl transition-colors font-heading text-[24px] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isCheckingOut ? "Redirecting..." : "BUY NOW"}
                    </button>
                    {checkoutError ? (
                      <p className="mt-2 text-sm text-red-600 text-center">{checkoutError}</p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
