"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Product {
  id: string | number;
  name: string;
  price?: number;
  discountedPrice?: number;
  images?: string[];
}

interface ProductsContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  firstProduct: Product | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const firstProduct = products.length > 0 ? products[0] : null;

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        firstProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
