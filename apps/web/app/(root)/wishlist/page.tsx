"use client";
import ProductSection from "@/components/showcase/ProductSection";
import useStorage from "@/hooks/useStorage";
import React from "react";

function Wishlist() {
  const { wishlist, cart, products } = useStorage();

  const wishlistProducts = wishlist.map(({ productId }) => productId);

  const justForYouProducts = products
    .filter(
      (product) =>
        !wishlistProducts?.some((item) => item._id === product._id) &&
        !cart?.some((item) => item.productId._id === product._id) &&
        product.stock > 0
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
