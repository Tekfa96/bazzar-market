import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const StoreItem = ({ store }) => {
  const calculateRating = () => {
    let total = 0;
    let count = 0;
    store?.review.forEach((item) => {
      total += item.star;
      count++;
    });
    const result = total / count;
    return result ? result.toFixed(1) : "4.5";
  };
  return (
    <Link href={"/store/" + store?.slug}>
      <div className="p-3 pb-0 rounded-xl bg-white cursor-pointer">
        <Image
          src={store.banner.url}
          alt={store.name}
          height={400}
          width={400}
          className="h-[211px] rounded-xl object-cover"
        />
        <div className="p-2">
          <h4 className="h4 !mb-1">{store.name}</h4>
          <div className="flexBetween">
            <div className="flex gap-2">
              <Star size={17} fill="red" color="red" />
              <h5 className="h5 leading-snug text-gray-30 ">
                {calculateRating()}
              </h5>
              <p className="font-medium capitalize">{store.storeType[0]}</p>
            </div>
            <h5 className="h5">{store.categoryies[0].name}</h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoreItem;
