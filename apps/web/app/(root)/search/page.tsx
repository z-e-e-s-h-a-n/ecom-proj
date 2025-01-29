"use client";
import BreadcrumbNav from "@/components/constant/BreadcrumbNav";
import FilterSidebar from "@/components/constant/FilterSidebar";
import { Grid2x2 } from "lucide-react";
import React from "react";

import Sort from "@/components/constant/Sort";
import PageNav from "@/components/constant/PageNav";
import ProductCard from "@/components/showcase/ProductCard";
import { useProducts } from "@/hooks/useStorage";

function Search() {
  const { products } = useProducts();
  return (
    <>
      <BreadcrumbNav />
      <div className="flex gap-8">
        <FilterSidebar />
        <div className="flex-1 space-y-6">
          <div className="flex-justify-between gap-4">
            <div className="flex-items-center gap-2 text-sm text-muted-foreground">
              <Grid2x2 className="size-5" />
              <span>Showing 1-6 of 72 results</span>
            </div>
            <div className="sort-container">
              <p className="hidden text-sm text-muted-foreground sm:block">
                Sort By
              </p>
              <Sort />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <PageNav />
        </div>
      </div>
    </>
  );
}

export default Search;
