// Shop.tsx
"use client";
import React, { useState } from "react";
import FilterSidebar from "@/components/layout/FilterSidebar";
import { Grid2x2 } from "lucide-react";
import Sort from "@/components/block/Sort";
import PageNav from "@/components/block/PageNav";
import ProductCard from "@/components/block/ProductCard";
import { useProducts } from "@/hooks/useStorage";
import SearchBar from "@/components/form/SearchBar";

function Shop() {
  const [queryParams, setQueryParams] = useState<IQueryParams>({});
  const { products, total, page, limit } = useProducts(queryParams);
  const updateQueryParams = (update: Partial<IQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...update }));
  };

  return (
    <>
      <SearchBar
        className="m-auto w-1/2"
        value={queryParams.searchQuery}
        onChange={(searchQuery) => updateQueryParams({ searchQuery })}
      />
      <div className="flex gap-8">
        <FilterSidebar filters={queryParams} onChange={updateQueryParams} />
        <div className="flex-1 space-y-6">
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Grid2x2 className="size-5" />
              <span>
                Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)}{" "}
                of {total} results
              </span>
            </div>

            <div className="sort-container">
              <p className="hidden text-sm text-muted-foreground sm:block">
                Sort By
              </p>
              <Sort
                value={queryParams.sort || ""}
                onChange={updateQueryParams}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products?.map(({ product }, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <PageNav
            currentPage={page}
            totalPages={Math.ceil(total / limit)}
            onChange={updateQueryParams}
          />
        </div>
      </div>
    </>
  );
}

export default Shop;
