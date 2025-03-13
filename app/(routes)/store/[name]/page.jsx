"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import StoreTabs from "@/app/(components)/StoreTabs";
import { getStoresDetails } from "@/app/(utils)/GlobalApi";

const StoreDetails = () => {
  const router = useRouter();
  const param = usePathname();
  const [store, setStore] = useState([]);

  const GetStoreDetails = (restaurantSlug) => {
    getStoresDetails(restaurantSlug).then((res) => {
      console.log(res);
      setStore(res?.store);
    });
  };

  const calculateRating = () => {
    let total = 0;
    let count = 0;
    store?.review?.forEach((item) => {
      total += item.star;
      count++;
    });
    const result = total / count;
    return result ? result.toFixed(1) : "4.5";
  };

  useEffect(() => {
    GetStoreDetails(param.split("/")[2]);
  }, [param]);

  return (
    <div>
      <section className="max-padd-container">
        {/* STORE IMAGE */}
        {store?.banner?.url && (
          <div>
            <Image
              src={store?.banner?.url}
              alt={store.name}
              height={10000}
              width={10000}
              className="h-[211px] w-full object-cover rounded-xl"
            />
          </div>
        )}

        {/* STORE NAME WITH BACK BUTTON */}
        <div className="flex items-center gap-2 my-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft size={22} />
          </button>
          <h4 className="bold-24">{store.name}</h4>
        </div>

        {/* RATING */}
        <div className="flex gap-2">
          <Star size={17} fill="orange" color="orange" />
          <h5 className="h5 leading-snug text-gray-30">
            {calculateRating()}
            <span className="pl-2">({store?.review?.length})</span>
          </h5>
        </div>

        {/* ADDRESS */}
        <p className="flexStart gap-1 my-1">
          <MapPin size={17} /> {store.address}
        </p>

        {/* STORE DATA */}
        <div className="my-3">
          <StoreTabs store={store} />
        </div>
      </section>
    </div>
  );
};

export default StoreDetails;
