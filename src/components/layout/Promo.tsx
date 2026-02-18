import Image from "next/image";
import { Button } from "../ui/Button";

function Promo() {
  return (
    <div className="fixed z-10 w-full bottom-10 hidden px-6 md:flex">
      <div className="bg-sky-blue md:flex w-full h-20 rounded-2xl  items-center px-6 text-white font-bold">
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
          <h3 className="text-[47px] h-10 ml-4">
            LUMI{" "}
            <span className="text-[34px] line-through decoration-tangerine ml-10">
              &nbsp;Rs 5999&nbsp;
            </span>{" "}
            <span className="ml-5">Rs 2999</span>
          </h3>
          <Button variant="secondary">PRE-ORDER</Button>
        </div>
      </div>
    </div>
  );
}

export default Promo;
