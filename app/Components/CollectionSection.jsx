import { Button } from "@/components/UI/button";
import { LucideShoppingBasket, ZoomIn, X } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  addToCartOtherProducts,
  addToCartClothes,
  connectStoreToCartItem,
} from "../(utils)/GlobalApi";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { CartContext } from "../(context)/CartContext";
import { cn } from "@/lib/utils";

const CollectionSection = ({ store }) => {
  const [collectionItemList, setcollectionItemList] = useState([]);
  const { updateCart, setUpdateCart } = useContext(CartContext);
  const { isSignedIn, user } = useUser();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [zoomedImage, setZoomedImage] = useState(null);
  const [popupImage, setPopupImage] = useState(null);
  const imageRef = useRef(null);

  const openImage = (url) => {
    setPopupImage(url);
  };

  const closePopup = () => {
    setPopupImage(null);
  };

  const zoomImage = (itemId) => {
    setZoomedImage(zoomedImage === itemId ? null : itemId);
  };

  const filterCollection = (category) => {
    const result = store?.collection?.filter(
      (item) => item.category == category
    );
    console.log(result);
    setcollectionItemList(result[0]);
  };

  const addToCartHandler = async (item) => {
    try {
      if (!isSignedIn) {
        toast.error("Please login to add items to your cart.");
        return;
      }

      // Vérifier si le store est déjà connecté pour éviter un appel réseau inutile
      const storeConnected =
        store.isConnected ?? (await connectStoreToCartItem());
      if (!storeConnected) {
        toast.error("Failed to connect store. Please try again.");
        return;
      }

      const selectedOption = selectedOptions[item.id] || {};
      const { color, size } = selectedOption;

      if (store.storeType?.[0] === "clothing") {
        if (!color || !size) {
          toast.error(
            `Please select ${!color ? "a color" : ""}${!color && !size ? " and " : ""}${!size ? "a size" : ""} before adding to cart.`
          );
          return;
        }
      }

      // Préparation des données à envoyer
      const data = {
        email: user?.primaryEmailAddress?.emailAddress,
        name: item.name,
        description: item.description,
        productImage: item?.productImage?.url,
        price: item?.price,
        storeSlug: store.slug,
        color,
        size,
      };

      // Ajout au panier selon le type de produit
      const addToCartFunc =
        store.storeType?.[0] === "clothing"
          ? addToCartClothes
          : addToCartOtherProducts;
      const res = await addToCartFunc(data);

      if (!res) {
        toast.error("Failed to add item to cart.");
        return;
      }

      // Mettre à jour le panier avec une légère latence
      setTimeout(() => {
        setUpdateCart((prev) => !prev);
        toast.success("Item added to cart successfully!");
      }, 500);
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const updateSelection = (itemId, type, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [type]: value,
      },
    }));
  };

  useEffect(() => {
    if (store?.collection?.length > 0) {
      // Filtrer directement en fonction de la première catégorie de la collection
      filterCollection(store.collection[0].category);
    }
  }, [store]); // Ajoute store comme dépendance

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
      <div className="col-span-4 md:col-span-3 m-5">
        <h4 className="h4 mt-8 md:mt-0">
          {collectionItemList.category}{" "}
          <span className="text-primary">Collection</span>
        </h4>
        {/* COLLECTION ITEM */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-3 ">
          {collectionItemList?.collectionItem?.map((item, i) => (
            <div
              key={i}
              className="max-w-xs rounded-lg shadow-lg overflow-hidden  bg-white "
            >
              <div className="relative">
                <Image
                  src={item?.productImage?.url}
                  alt={item.name}
                  ref={imageRef}
                  width={180}
                  height={180}
                  className={`object-cover aspect-square rounded-xl bg-white w-[180px] h-[180px] mx-auto m-5 cursor-pointer transition-transform duration-300 ${zoomedImage === item.id ? "scale-150" : "scale-100"}`}
                  onClick={() => openImage(item?.productImage?.url)}
                />
                <Button
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                  onClick={() => zoomImage(item.id)}
                >
                  <ZoomIn size={20} />
                </Button>
              </div>
              <div>
                <div className="flex justify-between items-center m-2">
                  <h4 className="text-lg md:text-xl font-semibold text-gray-800">
                    {item.name}
                  </h4>
                  <h5 className="text-primary text-lg font-bold">
                    ${item.price}
                  </h5>
                </div>

                {store.storeType?.[0] === "clothing" && (
                  <>
                    <div className="m-2">
                      <h5 className="text-sm font-medium mb-2">Color</h5>
                      <div className="flex flex-wrap gap-x-3 gap-y-2">
                        {item.productColor?.map((color) => (
                          <button
                            key={color}
                            onClick={() =>
                              updateSelection(item.id, "color", color)
                            }
                            className={cn(
                              "w-8 h-8 rounded-full border-2 transition-all",
                              selectedOptions[item.id]?.color === color
                                ? "border-black ring-2 ring-offset-1 scale-110"
                                : "border-gray-300 hover:scale-105"
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="m-2">
                      <h5 className="text-sm font-medium mb-2">Size</h5>
                      <div className="flex flex-wrap gap-x-3 gap-y-2">
                        {item.productSize?.map((size) => (
                          <Button
                            key={size}
                            variant={
                              selectedOptions[item.id]?.size === size
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              updateSelection(item.id, "size", size)
                            }
                            className="px-4 py-2 text-xs font-semibold rounded-md hover:scale-105"
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <h5 className="h5 m-2">Description:</h5>
                <p className="p m-2">{item.description}</p>

                <div className="flex justify-center items-center m-2">
                  <LucideShoppingBasket
                    onClick={() => addToCartHandler(item)}
                    size={31}
                    className="bg-primary rounded-full p-1 m-2 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {popupImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg">
            <button
              className="absolute top-2 right-2 text-black"
              onClick={closePopup}
            >
              <X size={24} />
            </button>
            <Image
              src={popupImage}
              alt="Zoomed"
              width={500}
              height={500}
              className="max-w-full max-h-[80vh] rounded"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CollectionSection;
