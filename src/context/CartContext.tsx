"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  image: string;
}

export interface AddToCartInput {
  id: string | number;
  name?: string;
  price?: number;
  discountedPrice?: number;
  image?: string;
  quantity?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: AddToCartInput) => Promise<void>;
  removeFromCart: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotalItems: () => number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const isWixEnabled = Boolean(process.env.NEXT_PUBLIC_WIX_CLIENT_ID);

  const refreshCart = useCallback(async () => {
    if (!isWixEnabled) return;

    try {
      const res = await fetch("/api/cart", { method: "GET" });
      if (!res.ok) return;
      const data = (await res.json()) as { items?: CartItem[] };
      setCartItems(data.items ?? []);
    } catch {
      // Ignore cart fetch errors and keep UI functional
    }
  }, [isWixEnabled]);

  useEffect(() => {
    if (!isWixEnabled) return;

    queueMicrotask(() => {
      void refreshCart();
    });
  }, [isWixEnabled, refreshCart]);

  const addToCart = async (item: AddToCartInput) => {
    if (!isWixEnabled) {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          return prevItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + (item.quantity ?? 1) }
              : cartItem
          );
        }

        return [
          ...prevItems,
          {
            id: item.id,
            name: item.name ?? "",
            price: item.price ?? 0,
            discountedPrice: item.discountedPrice ?? item.price ?? 0,
            quantity: item.quantity ?? 1,
            image: item.image ?? "/toy.png",
          },
        ];
      });
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.id,
          quantity: item.quantity ?? 1,
        }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { items?: CartItem[] };
      setCartItems(data.items ?? []);
    } catch {
      // Ignore add-to-cart errors and keep UI functional
    }
  };

  const removeFromCart = async (id: string | number) => {
    if (!isWixEnabled) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItemId: id }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { items?: CartItem[] };
      setCartItems(data.items ?? []);
    } catch {
      // Ignore remove errors
    }
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    if (!isWixEnabled) {
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItemId: id, quantity }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { items?: CartItem[] };
      setCartItems(data.items ?? []);
    } catch {
      // Ignore quantity update errors
    }
  };

  const clearCart = async () => {
    if (!isWixEnabled) {
      setCartItems([]);
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { items?: CartItem[] };
      setCartItems(data.items ?? []);
    } catch {
      // Ignore clear cart errors
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setCartOpen,
        refreshCart,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
