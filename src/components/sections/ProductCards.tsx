"use client";

import Image from "next/image";

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
  name?: string | null;
  priceData?: WixPrice;
  price?: WixPrice;
  media?: WixMedia;
}

interface Product {
  id: number;
  name: string;
  price?: number;
  discountedPrice?: number;
  images: string[];
}

const ProductCards = ({ wixProducts }: { wixProducts: unknown[] }) => {
  const products: Product[] = (wixProducts ?? []).map((item: unknown, index: number) => {
    // If item already matches Product shape
    const maybeProduct = item as Record<string, unknown>;
    if (
      maybeProduct &&
      Array.isArray(maybeProduct.images) &&
      typeof maybeProduct.name === "string"
    ) {
      return {
        id: (maybeProduct.id as number) ?? index + 1,
        name: maybeProduct.name ?? "",
        price: maybeProduct.price as number | undefined,
        discountedPrice: maybeProduct.discountedPrice as number | undefined,
        images: (maybeProduct.images as string[]) ?? [],
      } as Product;
    }

    const raw = item as WixProductRaw;
    return {
      id: index + 1,
      name: raw.name ?? "",
      price: raw.priceData?.price ?? raw.price?.price,
      discountedPrice: raw.priceData?.discountedPrice ?? raw.price?.discountedPrice,
      images: raw.media?.items?.map((m) => m.image?.url ?? "").filter(Boolean) ?? [],
    } as Product;
  });

  return (
    <section className="relative max-w-350 mx-auto mb-10">
      {/* Promo Bar */}

      <div className="hidden md:flex relative h-20 rounded-2xl bg-sky-blue items-center px-6 text-white font-bold">
        <div className="absolute bottom-0 flex items-center gap-4">
          <Image
            src="/images/product-lumi-secondary.png"
            alt="Lumi"
            width={200}
            height={200}
            className="w-50 h-50 object-contain"
          />
        </div>
        <div className="flex items-center justify-between w-full px-45">
          <h3 className="text-[47px] h-10">
            LUMI{" "}
            <span className="text-[34px] line-through decoration-tangerine ml-10">
              &nbsp;Rs 5999&nbsp;
            </span>{" "}
            <span className="ml-5">Rs 2999</span>
          </h3>
          <button className="bg-muted-orange hover:bg-orange-500 transition text-white px-6 rounded-xl text-sm h-12.5 flex justify-center items-center text-[25px] font-heading pt-4 pb-2 tracking-wider">
            ORDER NOW
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="md:overflow-visible overflow-x-auto no-scrollbar">
        <div className="flex gap-5 mt-0 md:-mt-20 px-3 md:px-20 w-max">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="min-w-58.5 h-97.5 rounded-2xl border border-[#BCBCBC] bg-white p-3"
            >
              <div className="rounded-2xl overflow-hidden bg-gray-400 mb-4 flex items-center justify-center">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={208}
                  height={217}
                  className="w-52 h-54.25 object-cover"
                />
              </div>

              <h3 className="font-bold text-[23px]">
                <span className="text-tangerine">LUMI</span> – {product.name}
              </h3>
              <h3 className="font-bold text-[22px] line-through decoration-tangerine text-[#4F4F4F]">
                &nbsp;Rs {product.price}&nbsp;
              </h3>
              <h3 className="font-bold text-[29px] mb-1  text-[#4F4F4F]">
                Rs {product.discountedPrice}
              </h3>

              <button className="w-fit bg-sky-blue hover:opacity-90 text-white text-sm py-2 rounded-xl font-heading text-[20px] pt-2 pb-1 px-10">
                BUY NOW
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCards;
