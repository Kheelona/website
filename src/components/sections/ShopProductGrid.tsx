"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountedPrice: number;
  image: string;
  description: string;
  inStock: boolean;
}

export function ShopProductGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {products.map((product) => (
          <article
            key={product.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover-lift transition-all"
            itemScope
            itemType="https://schema.org/Product"
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 relative">
              <Image
                src={product.image}
                alt={`Lumi ${product.name} - AI Educational Toy`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-4"
                itemProp="image"
              />
              {product.inStock && (
                <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  In Stock
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="p-5">
              <h3 className="font-heading text-xl md:text-2xl mb-2" itemProp="name">
                <span className="text-tangerine">LUMI</span> - {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2" itemProp="description">
                {product.description}
              </p>

              {/* Pricing */}
              <div
                className="flex items-center gap-3 mb-4"
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <span
                  className="text-2xl font-bold text-gray-900"
                  itemProp="price"
                  content={product.discountedPrice.toString()}
                >
                  ₹{product.discountedPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="bg-tangerine/10 text-tangerine text-xs px-2 py-1 rounded">
                  50% OFF
                </span>
                <meta itemProp="priceCurrency" content="INR" />
                <link itemProp="availability" href="https://schema.org/InStock" />
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  addToCart({
                    productId: product.id,
                    name: `Lumi ${product.name}`,
                    price: product.price,
                    discountedPrice: product.discountedPrice,
                    image: product.image,
                  });
                }}
                className="w-full bg-sky-blue hover:bg-sky-blue/90 text-white py-3 rounded-xl font-heading text-lg transition-colors"
                aria-label={`Buy Lumi ${product.name} for ₹${product.discountedPrice}`}
              >
                BUY NOW
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
