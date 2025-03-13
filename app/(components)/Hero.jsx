import { ArrowRight, House } from "lucide-react";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section className="max-padd-container">
      <div className="max-padd-container bg-hero bg-cover bg-center bg-no-repeat h-[722px] w-full rounded-2xl">
        <div className="relative max-w[777px] top-32 sm:top-60">
          <h1 className="h1 capitalize max-w-[611px]">
            Elevate your wardrobe with trendy fashion from{" "}
            <span className="bg-secondary rounded-full px-2">Bazzar</span>
          </h1>
          <div className="flex gap-x-10 max-md:flex-col-reverse mt-14 sm:mt-28">
            <Link
              href={"/"}
              className="bg-black p-1.5 text-white pl-8 rounded-full flexCenter gap-x-2 inline-flex w-full max-w-[261px]"
            >
              <span className="pr-4">Latest Products</span>
              <div className="bg-white text-black flexCenter h-9 w-9 rounded-full">
                <House size={23} />
              </div>
              <div className="bg-white text-black flexCenter h-9 w-9 rounded-full">
                <ArrowRight size={23} />
              </div>
            </Link>
            <p className="my-2 text-black">
              Your ultimate online marketplace connecting buyers and sellers
              with ease.
              <br /> Discover diverse stores, exclusive products seamless
              shopping.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
