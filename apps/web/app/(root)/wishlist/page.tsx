"use client";
import ProductSection from "@/components/section/ProductSection";
import useStorage from "@/hooks/useStorage";
import { getVariant } from "@/lib/utils";
import React from "react";

function Wishlist() {
  const { wishlist, cart, products } = useStorage();

  const wishlistProducts = wishlist.map(({ productId, variantId }) => ({
    product: productId,
    variantId,
  }));

  const justForYouProducts = products
    .filter(
      ({ product }) =>
        !wishlist?.some(
          ({ productId, variantId }) =>
            productId._id === product._id ||
            !(getVariant(productId, variantId)?.stock > 0)
        ) && !cart?.some((item) => item.productId._id === product._id)
    )
    .slice(0, 5);

  return (
    <>
      <ProductSection
        items={wishlistProducts}
        headerProps={{
          subtitle: {
            text: `Wishlist (${wishlistProducts.length})`,
            showBefore: false,
          },
          buttonProps: {
            href: "/products",
            variant: "outline",
            children: "Move All To Bag",
          },
        }}
      />
      <ProductSection
        items={justForYouProducts}
        headerProps={{
          subtitle: { text: `Just For You` },
          buttonProps: {
            href: "/products",
            variant: "outline",
          },
        }}
      />
    </>
  );
}

export default Wishlist;
