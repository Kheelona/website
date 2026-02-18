"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { useEffect, useMemo } from "react";
import { SectionHeader } from "../ui/SectionHeader";

interface WixPrice {
  price?: number | null;
  discountedPrice?: number | null;
}

interface WixMediaItem {
  image?: { url?: string };
}

interface WixMedia {
  items?: WixMediaItem[];
}

interface WixProductRaw {
  _id: string;
  name?: string | null;
  priceData?: WixPrice;
  price?: WixPrice;
  media?: WixMedia;
}

interface Product {
  id: string;
  name: string;
  price?: number;
  discountedPrice?: number;
  images: string[];
}

const ProductCards = ({ wixProducts }: { wixProducts: unknown[] }) => {
  const router = useRouter();
  const { addToCart, setCartOpen } = useCart();
  const { setProducts } = useProducts();

  const products: Product[] = useMemo(
    () =>
      (wixProducts ?? []).map((item: unknown, index: number) => {
        // If item already matches Product shape
        const maybeProduct = item as Record<string, unknown>;
        if (
          maybeProduct &&
          Array.isArray(maybeProduct.images) &&
          typeof maybeProduct.name === "string"
        ) {
          return {
            id: maybeProduct.id ?? index + 1,
            name: maybeProduct.name ?? "",
            price: maybeProduct.price as number | undefined,
            discountedPrice: maybeProduct.discountedPrice as number | undefined,
            images: (maybeProduct.images as string[]) ?? [],
          } as Product;
        }

        const raw = item as WixProductRaw;
        return {
          id: raw._id,
          name: raw.name ?? "",
          price: raw.priceData?.price ?? raw.price?.price,
          discountedPrice: raw.priceData?.discountedPrice ?? raw.price?.discountedPrice,
          images: raw.media?.items?.map((m) => m.image?.url ?? "").filter(Boolean) ?? [],
        } as Product;
      }),
    [wixProducts]
  );

  useEffect(() => {
    if (products.length > 0) {
      setProducts(products);
    }
  }, [products, setProducts]);

  return (
    <section
      id="products"
      className="relative max-w-350 mx-auto mb-10 pt-10"
      aria-labelledby="products-heading"
    >
      <SectionHeader title="Explore our offerings?" />

      {/* Product Grid */}
      <div className="md:overflow-visible overflow-x-auto no-scrollbar">
        <div className="flex gap-5 mt-0  px-3 md:px-20 w-max">
          {products.map((product: Product) => (
            <article
              key={product.id}
              className="min-w-83.5 min-h-104 rounded-2xl border border-[#BCBCBC] bg-white p-3 cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => {
                router.push(`/product/${product.id}`);
              }}
            >
              <div className="rounded-2xl overflow-hidden bg-gray-400 mb-6 flex items-center justify-center ">
                <Image
                  src={product.images[0]}
                  alt={`${product.name} - Lumi toy`}
                  width={299}
                  height={226}
                  className="w-77 h-54.25 object-cover"
                />
              </div>
              <div className="px-3 pb-3">
                <h3 className="font-bold text-[24px] mb-2">
                  <span className="text-tangerine">LUMI</span> – {product.name}
                </h3>
                <h3 className="font-bold text-[22px] line-through decoration-tangerine text-[#4F4F4F]">
                  &nbsp;Rs {product.price}&nbsp;
                </h3>
                <h3 className="font-bold text-[29px] mb-1  text-[#4F4F4F]">
                  Rs {product.discountedPrice}
                </h3>

                <Button
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: product.id,
                      name: `Lumi - ${product.name}`,
                      price: product.price ?? 0,
                      discountedPrice: product.discountedPrice ?? 0,
                      image: product.images[0] ?? "/toy.png",
                    });
                    setCartOpen(true);
                  }}
                >
                  PRE-ORDER
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCards;
