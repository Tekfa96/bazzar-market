import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import AboutSection from "./AboutSection";
import CollectionSection from "./CollectionSection";
import ReviewSection from "./ReviewSection";
const StoreTabs = ({ store, cart }) => {
  return (
    <Tabs defaultValue="collection" className="w-full">
      <TabsList className="bg-white">
        <TabsTrigger value="collection">Collection</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="review">Review</TabsTrigger>
      </TabsList>
      {/* COLLECTION TAB */}
      <TabsContent value="collection">
        <CollectionSection store={store} cart={cart} />
      </TabsContent>
      {/* ABOUT TAB */}
      <TabsContent value="about">
        <AboutSection store={store} cart={cart} />
      </TabsContent>

      {/* REVIEW TAB */}
      <TabsContent value="review">
        <ReviewSection store={store} cart={cart} />
      </TabsContent>
    </Tabs>
  );
};

export default StoreTabs;
