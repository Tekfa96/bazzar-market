"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getCategories } from "../(utils)/GlobalApi";
import { useSearchParams } from "next/navigation";
const CategoryList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const params = useSearchParams();
  // GET CATEGORY LIST
  const getCategoryList = () => {
    getCategories().then((res) => {
      //console.log(res.categoryies);
      setCategoryList(res.categoryies);
    });
  };
  useEffect(() => {
    setSelectedCategory(params.get("category"));
    getCategoryList();
  }, [params]);
  return (
    <section className="max-padd-container py-10 xl:py-20">
      <div className="flexCenter gap-8 xl:gap-12 flex-wrap">
        {categoryList &&
          categoryList.map((category, i) => (
            <Link
              key={i}
              href={"?category=" + category.slug}
              scroll={false}
              className="flexCenter flex-col"
            >
              <div className="h-32 w-32 sm:h-44 p-8 rounded-2xl cursor-pointer bg-white">
                <Image
                  src={category.icon?.url}
                  alt={category.name}
                  height={155}
                  width={155}
                  className="object-cover aspect-square"
                />
              </div>
              <h5
                className={`h5 mt-6 ${
                  selectedCategory == category.slug
                    ? "border-b-4 border-primary"
                    : "border-b-4 border-primary"
                } `}
              >
                {category.name}
              </h5>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default CategoryList;
