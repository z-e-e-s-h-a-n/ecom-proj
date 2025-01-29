"use client";

import React, { useState, useEffect, useCallback } from "react";
import BreadcrumbNav from "@/components/constant/BreadcrumbNav";
import ProductSection from "@/components/showcase/ProductSection";
import { useStorageUtils, useProduct, useProducts } from "@/hooks/useStorage";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { Bus, Heart, RefreshCcw } from "lucide-react";
import Image from "next/image";
import QuantityInput from "@/components/form/QuantityInput";
import VariantInput from "@/components/form/VariantInput";
import { getVariant, formatPrice } from "@/lib/utils";

function ProductDetails({ params, searchParams }: PageParams) {
  const id = React.use(params)?.id || "";
  const variantId = (React.use(searchParams)?.variant as string) || "";
  const { product, isLoading, error } = useProduct(id);
  const { isInCart, isInWishlist, toggleCart, toggleWishlist } =
    useStorageUtils();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [selectedVariant, setSelectedVariant] = useState<
    IVariant | undefined
  >();

  const { variations } = product || {};

  const handleAttributeChange = useCallback(
    (attributeName: string, value: string) => {
      setSelectedAttributes((prev) => {
        const updatedAttributes = { ...prev, [attributeName]: value };
        const matchingVariant = variations?.find((variant) =>
          Object.entries(updatedAttributes).every(
            ([attrName, attrValue]) =>
              variant.attributes[attrName] === attrValue
          )
        );
        if (matchingVariant) setSelectedVariant(matchingVariant);
        return updatedAttributes;
      });
    },
    [variations]
  );

  useEffect(() => {
    if (product) {
      const currentVariant = getVariant(product, variantId);

      if (currentVariant) {
        Object.entries(currentVariant.attributes).forEach(([name, value]) => {
          handleAttributeChange(name, value);
        });
      }
    }
  }, [product, variantId, handleAttributeChange]);

  if (isLoading)
    return <div className="p-6 text-center">Loading product details...</div>;
  if (error || !product || !selectedVariant)
    return <div className="p-6 text-center">Product not found.</div>;

  const renderPricing = () => {
    const { original, sale } =
      selectedVariant?.pricing.find((p) => p.region === "US") || {};
    return (
      <div className="flex gap-4 text-lg">
        <span className="text-primary">{formatPrice(sale || original)}</span>
        {sale && <span className="line-through">{formatPrice(original)}</span>}
      </div>
    );
  };

  return (
    <>
      <BreadcrumbNav />
      <div className="flex grid-cols-1 gap-8 p-6 md:grid-cols-2">
        {/* Images Section */}
        <div className="flex flex-col gap-4 lg:flex-row-reverse h-max">
          <Image
            src={selectedVariant?.images[0] || product.images[0]!}
            alt={product.name}
            width={500}
            height={500}
            className="max-h-[500px] max-w-[500px] bg-secondary"
          />
          <div className="flex gap-4 lg:flex-col">
            {product.images.map((img, index) => (
              <div
                key={index}
                className="cursor-pointer bg-secondary relative rounded w-[100px] h-[100px]"
              >
                <Image src={img} alt={`Thumbnail ${index + 1}`} layout="fill" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="max-w-[400px] space-y-6">
          <header className="space-y-2">
            <h1 className="h3">{product.name}</h1>
            <div className="flex items-center gap-2">
              <span>Stars</span>
              <span>({product.reviews?.length || 0} Reviews)</span>
              <span>
                | {selectedVariant?.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </header>

          {renderPricing()}

          <p className="text-light text-sm">{product.description}</p>

          <VariantInput
            product={product}
            selectedAttributes={selectedAttributes}
            handleAttributeChange={handleAttributeChange}
          />

          <div className="flex items-center gap-4">
            <QuantityInput
              product={product}
              variant={selectedVariant}
              quantity={quantity}
              setQuantity={setQuantity}
            />
            <Button
              disabled={selectedVariant?.stock === 0}
              onClick={() => toggleCart(product, selectedVariant._id, quantity)}
            >
              {isInCart(product, selectedVariant._id)
                ? "Remove from Cart"
                : "Add to Cart"}
            </Button>
            <Button
              size="icon"
              variant={
                isInWishlist(product, selectedVariant._id)
                  ? "default"
                  : "outline"
              }
              onClick={() => toggleWishlist(product, selectedVariant._id)}
            >
              <Heart />
            </Button>
          </div>

          <div className="grid w-[400px] gap-4 border px-4 py-6 [&_svg]:size-7">
            {[
              {
                icon: <Bus />,
                title: "Free Delivery",
                desc: "Enter your postal code for Delivery Availability",
              },
              {
                icon: <RefreshCcw />,
                title: "Return Delivery",
                desc: "Return Delivery within 30 Days",
              },
            ].map(({ icon, title, desc }, index) => (
              <>
                <div key={index} className="flex items-center gap-4">
                  {icon}
                  <div className="grid gap-1">
                    <span className="subtitle-1">{title}</span>
                    <p className="text-xs">{desc}</p>
                  </div>
                </div>
                {index === 0 && <Separator />}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <ProductSection
        items={products}
        useCarousel={true}
        headerProps={{ subtitle: { text: "Related Products" } }}
      />
    </>
  );
}

export default ProductDetails;
