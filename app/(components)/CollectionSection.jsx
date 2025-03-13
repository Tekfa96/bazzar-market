import { Button } from "@/components/ui/button";
import { LucideShoppingBasket, Minus, Plus } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { addToCart } from "../(utils)/GlobalApi";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { CartContext } from "../(context)/CartContext";
const CollectionSection = ({ store }) => {
  const [collectionItemList, setcollectionItemList] = useState([]);
  const { updateCart, setUpdateCart } = useContext(CartContext);
  const { user } = useUser();
  const [quantities, setQuantities] = useState(0);

  const filterCollection = (category) => {
    const result = store?.collection?.filter(
      (item) => item.category == category
    );
    console.log(result);
    setcollectionItemList(result[0]);
  };

  const addToCartHandler = (item) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      newQuantities[item.id] = (newQuantities[item.id] || 0) + 1; // Incrémente la quantité de l'article
      return newQuantities;
    });
    toast("Adding to Cart");
    const data = {
      email: user?.primaryEmailAddress.emailAddress,
      name: item?.name,
      description: item?.description,
      productImage: item?.productImage?.url,
      price: item?.price,
      storeSlug: store.slug,
    };

    addToCart(data).then(
      (res) => {
        setUpdateCart((prev) => !prev);
        toast("Added to Cart");
        //console.log(res);
      },
      (error) => {
        toast("Error while adding item to cart");
      }
    );
    //console.log(data);
  };
  useEffect(() => {
    store?.collection && filterCollection(store?.collection[0]?.category);
  }, [store]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-4">
      {/* COLLECTION */}
      <div className="flex flex-col mr-10 gap-2">
        {store?.collection?.map((item, i) => (
          <Button
            key={i}
            onClick={() => filterCollection(item.category)}
            variant="ghost"
            className="flex justify-start bg-white hover:bg-primary rounded-lg font-bold focus-within:bg-primary max-w-xs"
          >
            {item.category}
          </Button>
        ))}
      </div>
      <div className="col-span-4 md:col-span-3">
        <h4 className="h4 mt-8 md:mt-0">
          {collectionItemList.category}{" "}
          <span className="text-primary">Collection</span>
        </h4>
        {/* COLLECTION ITEM */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-3">
          {collectionItemList?.collectionItem?.map((item, i) => (
            <div
              key={i}
              className="p-4 flex flex-col max-sm:max-w-60 sm:flex-row gap-3 rounded-2xl shadow-slate-900/5 bg-white"
            >
              <Image
                src={item?.productImage?.url}
                alt={item.name}
                width={220}
                height={220}
                className="object-cover aspect-square rounded-xl bg-[#f9f4ec]"
              />
              <div>
                <h4 className="h4 mb-1">{item.name}</h4>
                <h5 className="h5">${item.price}</h5>
                <p>{item.description}</p>
                <div className="flexBetween mt-2">
                  <div className="inline-flex gap-1.5 bg-primary/30 rounded-full ring-1 p-1 cursor-pointer ">
                    <Minus className="bg-white rounded-full p-1 ring-1 ring-primary/30 cursor-pointer" />{" "}
                    {quantities[item.id] || 0}
                    <Plus className="bg-primary rounded-full p-1 ring-1 ring-primary cursor-pointer" />
                  </div>
                  <LucideShoppingBasket
                    onClick={() => addToCartHandler(item)}
                    size={31}
                    className="bg-primary rounded-full p-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
