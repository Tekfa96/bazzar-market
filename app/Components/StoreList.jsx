"use client";
import React, { useEffect, useState, useRef } from "react";
import StoreItem from "./StoreItem";
import { getStores } from "../(utils)/GlobalApi";
import { useSearchParams } from "next/navigation";
import { CartContext } from "../(context)/CartContext";

const StoreList = ({ cart }) => {
  const params = useSearchParams();
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const storeListRef = useRef(null); // Référence pour scroller
  const isFirstLoad = useRef(true); // Empêcher le scroll initial

  // Fonction pour faire défiler la page vers la liste de magasins
  const scrollToStoreList = () => {
    if (storeListRef.current) {
      storeListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // GET STORE LIST
  const getStoreList = (_category) => {
    setLoading(true);
    getStores(_category).then((res) => {
      setStoreList(res?.stores || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    const currentCategory = params.get("category") || "all";
    setCategory(currentCategory);
  }, [params]);

  useEffect(() => {
    getStoreList(category);

    // Ne pas scroller lors du premier chargement de la page
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // scroller

    scrollToStoreList();
  }, [category]);

  return (
    <section className="max-padd-container py-6 pb-20">
      <h2 className="h2 !mb-2 capitalize">
        Featured{" "}
        <span className="text-primary font-normal">{category} Stores</span>
      </h2>
      <h4 className="h4 text-red-500 mb-10">({storeList?.length} Results)</h4>
      <div
        ref={storeListRef} // Référence utilisée ici pour le défilement
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-3"
      >
        {!loading ? (
          storeList.map((store, i) => (
            <div key={i}>
              <StoreItem store={store} />
            </div>
          ))
        ) : (
          <h4 className="h4">Loading...</h4>
        )}
      </div>
    </section>
  );
};

export default StoreList;
