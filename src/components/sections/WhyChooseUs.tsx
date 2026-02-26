"use client";

import { TickIcon } from "@/assets/icons/MemoTickIcon";
import { XCircle } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ListItemWithIcon } from "@/components/ui/ListItemWithIcon";
import { Button } from "../ui/Button";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";

export default function WhyChooseUs() {
  const { addToCart, setCartOpen } = useCart();
  const { firstProduct } = useProducts();

  return (
    <section
      id="features"
      className="w-full bg-muted-orange py-10 px-5 md:px-0"
      aria-labelledby="features-heading"
    >
      <SectionHeader
        id="features-heading"
        subtitle="Lumi vs Others"
        title="WHY SETTLE FOR LESS? UPGRADE TO LUMI"
        className="w-60 md:w-120 mx-auto"
      />

      {/* Comparison Card */}
      <div className="mx-auto max-w-4xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-13 shadow-lg mt-15">
        {/* Lumi Way */}
        <div className="col-span-7 bg-tangerine p-10 text-white">
          <p className="text-sm opacity-90 mb-2 text-[13px] md:text-[16px] ">The Smart Choice</p>
          <h3 className="font-heading text-[24px] md:text-[30px] mb-6">
            <span className="text-stroke-tangerine">LUMI</span> WAY
          </h3>

          <ul className="space-y-4  text-[16px]">
            {[
              "Multi language conversations that encourage children to speak freely.",
              "Screen-free, thoughtful play that reduces digital dependency",
              "Helps children express feelings and build emotional confidence",
              "Boosts vocabulary, verbal skills, and language exposure",
              "Grows with your child through evolving conversations",
            ].map((text, i) => (
              <ListItemWithIcon key={i} icon={<TickIcon className="text-lime-300" />}>
                {text}
              </ListItemWithIcon>
            ))}
          </ul>
        </div>
        {/* Old Way */}
        <div className="col-span-6 bg-white p-10 pb-15 text-gray-800">
          <p className="text-sm text-gray-500 mb-2 text-[13px] md:text-[16px] ">The Old Approach</p>
          <h3 className="font-heading text-[24px] md:text-[30px] mb-6">OLD WAY</h3>

          <ul className="space-y-4  text-[16px]">
            {[
              "The toy entertains, but doesn't actually engage or listen.",
              "Fun for five minutes, then ends up in the donation pile.",
              "Relies on loud noises and screens instead of imagination.",
              "Doesn't help the child express how they feel.",
              "It can't be used in new ways, so the child outgrows it fast.",
            ].map((text, i) => (
              <ListItemWithIcon key={i} icon={<XCircle className="text-red-500" />}>
                {text}
              </ListItemWithIcon>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-12 flex justify-center">
        <Button
          variant="primary"
          onClick={() => {
            if (firstProduct) {
              addToCart({
                id: firstProduct.id,
                name: firstProduct.name,
                price: firstProduct.price ?? 0,
                discountedPrice: firstProduct.discountedPrice ?? 0,
                image: firstProduct.images?.[0] ?? "/toy.png",
              });
              setCartOpen(true);
            }
          }}
        >
          PRE-ORDER
        </Button>
      </div>
    </section>
  );
}
