"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

type WixImage = {
  image?: {
    url?: string;
  };
};
type WixImageItem = {
  image?: {
    url?: string;
  };
};

type WixProduct = {
  _id?: string;
  name: string;
  description?: string;
  media?: {
    items?: WixImage[];
  };
  price?: any;
};

const icons = [
  { id: 1, icon: "/icons/screenFree.svg", label: "Screen-Free Fun" },
  { id: 2, icon: "/icons/voice.svg", label: "Voice chats" },
  { id: 3, icon: "/icons/infinite.svg", label: "Endless Conversations" },
  { id: 4, icon: "/icons/wifi.svg", label: "Wifi Connected" },
  { id: 5, icon: "/icons/shield.svg", label: "Age 3+" },
  { id: 6, icon: "/icons/book.svg", label: "Educational Playtime" },
];

const ProductHero = ({ product }: { product: WixProduct }) => {
  const { addToCart, setCartOpen } = useCart();

  const [hilightedImage, setHilightedImage] = useState<string>(
    product.media?.items?.[0]?.image?.url ?? ""
  );

  return (
    <section className="relative max-w-6xl mx-auto px-4 pt-40">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Image */}
        <div>
          <div className="w-full aspect-square rounded-2xl overflow-hidden">
            <Image
              src={hilightedImage}
              alt={product.name}
              width={500}
              height={500}
              className="w-125 h-125 object-cover mx-auto rounded-2xl"
            />
          </div>

          <div className="flex gap-3 mt-4 justify-center">
            {product?.media?.items?.map((item: WixImageItem, index: number) => (
              <button
                type="button"
                key={index}
                className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => {
                  setHilightedImage(item.image?.url ?? "");
                }}
                aria-label={`View image ${index + 1} of ${product.name}`}
              >
                <Image
                  src={item.image?.url ?? ""}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover mx-auto"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div>
          <h1 className="md:text-[45px] text-[24px] font-semibold ">{product.name}</h1>
          <p className="text-[26px]">A dino That can Talk!</p>
          <div className="flex items-center gap-2 mt-2 text-2xl">
            <span className="text-[#FFD802]">★ ★ ★ ★ ★</span>
            <span>4.8/5</span>
          </div>
          <div className="flex items-center gap-3 font-heading mt-8">
            <span className="line-through decoration-muted-orange text-[20px]">
              {" "}
              Rs. {product.price.price}{" "}
            </span>
            <span className="font-semibold text-[28px]">Rs. {product.price.discountedPrice}</span>
          </div>
          {/* <p className="mt-4 text-[20px] leading-relaxed">
            Hello! I’m Lumi, your warm and snuggly dino buddy. I adore big hugs, gentle giggles, and
            discovering new things side by side.
          </p> */}
          <div dangerouslySetInnerHTML={{ __html: product.description ?? "" }} />
          <div className="grid grid-cols-2 gap-y-3 gap-x-5 mt-6 text-sm">
            {icons.map((item) => (
              <div
                key={item.id}
                className="border border-[#EDEDED] rounded-3xl py-2 px-3 text-gray-700"
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={30}
                  height={30}
                  className="w-7.5 h-7.5 object-contain mx-auto"
                />
                <p className="text-center text-[20px]">{item.label}</p>
              </div>
            ))}
          </div>
          <button
            className="font-heading bg-sky-blue text-white w-full flex items-center justify-center pt-4 pb-2 rounded-2xl mt-10 text-[32px] cursor-pointer font-bold transition-colors duration-300 hover:bg-[#0c83ba]"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                id: product._id!,
                name: `Lumi - ${product.name}`,
                price: product.price.price ?? 0,
                discountedPrice: product.price.discountedPrice ?? 0,
                image: product.media?.items?.[0]?.image?.url ?? "",
              });
              setCartOpen(true);
            }}
          >
            PRE-ORDER
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
