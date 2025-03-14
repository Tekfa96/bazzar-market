import React from "react";
import Hero from "./components/Hero";
import CategoryList from "./components/CategoryList";
import StoreList from "./components/StoreList";
import Footer from "./components/Footer";
const page = () => {
  return (
    <div>
      <Hero />
      <CategoryList />
      <StoreList />
      <Footer />
    </div>
  );
};

export default page;
