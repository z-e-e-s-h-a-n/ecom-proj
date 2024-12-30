import BreadcrumbNav from "@/components/constant/BreadcrumbNav";
import FilterSidebar from "@/components/constant/FilterSidebar";
import { Grid2x2 } from "lucide-react";
import React from "react";

import Sort from "@/components/constant/Sort";
import PageNav from "@/components/constant/PageNav";
import ProductCard from "@/components/showcase/ProductCard";

function Search() {
  const searchResults = Array.from({ length: 10 }).map((_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: { original: 19.99, sale: 15.99 },
    imageUrl: `/assets/images/product-${index + 1}.png`,
    category: "Electronics",
    rating: 4.5,
    reviews: 100,
    inStock: true,
  }));

  return (
    <div className="flex flex-col gap-8 pb-8 pt-16">
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
            {searchResults.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
          <PageNav />
        </div>
      </div>
    </div>
  );
}

export default Search;
