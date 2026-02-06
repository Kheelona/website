"use client";

import Image from "next/image";
import { Button } from "../ui/Button";
import { useState } from "react";

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
  name: string;
  description?: string;
  media?: {
    items?: WixImage[];
  };
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
  const [hilightedImage, setHilightedImage] = useState(product?.media?.items?.[0].image?.url ?? "");
  return (
    <section className="relative min-h-screen max-w-6xl mx-auto px-4 pt-40">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Image */}
        <div>
          <div className="w-full aspect-square rounded-2xl overflow-hidden">
            <Image
              src={hilightedImage}
              alt={product.name}
              width={500}
              height={500}
              className="w-125 h-125 object-contain mx-auto"
            />
          </div>

          <div className="flex gap-3 mt-4 justify-center">
            {product?.media?.items?.map((item: WixImageItem, index: number) => (
              <div
                key={index}
                className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => {
                  setHilightedImage(item.image?.url);
                }}
              >
                <Image
                  src={item.image?.url}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover mx-auto"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div>
          <h1 className="text-2xl font-semibold ">{product.name}</h1>
          <p className="text-[26px]">A dino That can Talk!</p>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-yellow-500">★ ★ ★ ★ ★</span>
            <span>4.8/5</span>
          </div>
          <div className="flex items-center gap-3 mt-3 font-heading">
            <span className="line-through decoration-muted-orange text-[20px]"> Rs. 5,999 </span>
            <span className="font-semibold text-[28px]">Rs. 2,999</span>
          </div>
          {/* <p className="mt-4 text-[20px] leading-relaxed">
            Hello! I’m Lumi, your warm and snuggly dino buddy. I adore big hugs, gentle giggles, and
            discovering new things side by side.
          </p> */}
          <div dangerouslySetInnerHTML={{ __html: product.description ?? "" }} />
          <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
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
          <button className="font-heading bg-sky-blue text-white w-full flex items-center justify-center pt-4 pb-2 rounded-2xl mt-10 text-[32px]">
            Buy Now
          </button>
        </div>
      </div>
      <div className="w-full absolute bottom-0 left-0 hidden md:flex bg-sky-blue rounded-2xl">
        <div className="h-20  flex  items-center px-6 text-white font-bold">
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
            <Button variant="secondary" className="absolute right-10">
              ORDER NOW
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
