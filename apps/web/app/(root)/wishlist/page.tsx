import ProductSection from "@/components/showcase/ProductSection";
import React from "react";

function Wishlist() {
  const wishlistProducts = Array.from({ length: 5 }).map((_, index) => ({
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
        items={wishlistProducts}
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
