import React from "react";
import Hero from "./Components/Hero";
import CategoryList from "./Components/CategoryList";
import StoreList from "./Components/StoreList";
import Footer from "./Components/Footer";
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
