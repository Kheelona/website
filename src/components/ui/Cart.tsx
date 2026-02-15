"use client";

import Image from "next/image";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function CartUI() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, getTotalItems } = useCart();

  const itemCount = getTotalItems();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.discountedPrice * item.quantity,
    0
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Shopping cart"
          className="relative flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 transition-colors"
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
        <Dialog.Overlay className="fixed inset-0 bg-white/40 backdrop-blur-xl z-40" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          {/* Cart Container */}
          <div className="w-105 rounded-3xl p-4 relative h-[80vh] overflow-y-visible">
            {/* Close Button */}
            <Dialog.Close asChild>
              <button className="absolute -top-8 right-4 w-10 h-10 rounded-full text-black  bg-white border border-[#BDBDBD] flex items-center justify-center hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </Dialog.Close>

            {/* Inner Card */}
            <div className="bg-white h-full rounded-3xl p-4 pt-6 border border-[#BDBDBD]">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 h-[calc(100%-255px)] overflow-y-auto">
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
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover border rounded-2xl overflow-hidden"
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
                    <div className="text-[12px] flex justify-between text-gray-600 mb-4">
                      <span>Discount</span>
                      <span>-50%</span>
                    </div>
                    <div className="text-[20px] flex justify-between text-gray-600 mb-2">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="text-[20px] flex justify-between items-end pb-4 border-t border-[#BDBDBD] pt-4">
                      <span className="text-2xl font-semibold">Total</span>
                      <span className="text-3xl font-bold">
                        ₹{Math.round(subtotal * 0.5).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Buy Button */}
                    <button className="w-full bg-tangerine text-white text-lg font-bold py-3 rounded-xl transition-colors font-heading text-[24px]">
                      BUY NOW
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
