import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutSection from "./AboutSection";
import CollectionSection from "./CollectionSection";
import ReviewSection from "./ReviewSection";
const StoreTabs = ({ store }) => {
  return (
    <Tabs defaultValue="collection" className="w-full">
      <TabsList className="bg-white">
        <TabsTrigger value="collection">Collection</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="review">Review</TabsTrigger>
      </TabsList>
      {/* COLLECTION TAB */}
      <TabsContent value="collection">
        <CollectionSection store={store} />
      </TabsContent>
      {/* ABOUT TAB */}
      <TabsContent value="about">
        <AboutSection store={store} />
      </TabsContent>

      {/* REVIEW TAB */}
      <TabsContent value="review">
        <ReviewSection store={store} />
      </TabsContent>
    </Tabs>
  );
};

export default StoreTabs;
