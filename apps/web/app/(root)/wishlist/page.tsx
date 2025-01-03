"use client";
import ProductSection from "@/components/showcase/ProductSection";
import { productList } from "@/constants/product";
import { useUserSelector } from "@/store/features/user/userSelector";
import React from "react";

function Wishlist() {
  const { wishlist, cart } = useUserSelector();

  const wishlistProducts = productList.filter((product) =>
    wishlist.includes(product.id)
  );

  const justForYouProducts = productList
    .filter(
      (product) =>
        !wishlist.includes(product.id) &&
        !cart.find((item) => item.id === product.id) &&
        product.inStock
    )
    .slice(0, 5);

  return (
    <div>
      <ProductSection
        items={wishlistProducts}
        headerProps={{
          subtitle: {
            text: `Wishlist (${wishlistProducts.length})`,
            showBefore: false,
          },
          linkButtonProps: {
            href: "/products",
            variant: "outline",
            text: "Move All To Bag",
          },
        }}
      />
      <ProductSection
        items={justForYouProducts}
        headerProps={{
          subtitle: { text: `Just For You` },
          linkButtonProps: {
            href: "/products",
            variant: "outline",
          },
        }}
      />
    </div>
  );
}

export default Wishlist;
