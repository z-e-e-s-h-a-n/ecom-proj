"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import QuantityInput from "@/components/form/QuantityInput";
import VariantInput from "@/components/form/VariantInput";
import { useRouter } from "next/navigation";
import usePricing from "@/hooks/usePricing";
import ProductRating from "@/components/block/ProductRating";
import useStorage from "@/hooks/useStorage";

export interface IProductDetails {
  product: IProduct;
  currentVariant: IVariant;
}

function ProductDetails({ product, currentVariant }: IProductDetails) {
  const router = useRouter();
  const { formatProductPrice } = usePricing();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(currentVariant);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const { isInCart, isInWishlist, toggleCart, toggleWishlist, updateCart } =
    useStorage();

  const handleAttributeChange = useCallback(
    (name: string, value: string) => {
      setSelectedAttributes((prev) => {
        const updatedAttributes = { ...prev, [name]: value };
        const matchingVariant = product.variations?.find((variant) =>
          Object.entries(updatedAttributes).every(
            ([attrName, attrValue]) =>
              variant.attributes[attrName] === attrValue
          )
        );
        if (matchingVariant) setSelectedVariant(matchingVariant);
        return updatedAttributes;
      });
    },
    [product.variations]
  );

  useEffect(() => {
    if (currentVariant) {
      Object.entries(currentVariant.attributes).forEach(([name, value]) => {
        setSelectedAttributes((prev) => ({ ...prev, [name]: value }));
      });
    }
  }, [currentVariant, handleAttributeChange]);

  const renderPricing = () => {
    const { fmtOriginal, sale, fmtPrice } = formatProductPrice(
      selectedVariant.pricing
    );
    return (
      <div className="flex items-center gap-4 text-lg">
        <span className="text-primary">{fmtPrice}</span>
        {sale && (
          <span className="line-through text-muted-foreground text-sm">
            {fmtOriginal}
          </span>
        )}
      </div>
    );
  };

  const handleBuyNow = () => {
    updateCart("add", product, selectedVariant._id, quantity, false);
    router.push("/checkout?cartSource=cartItem");
  };

  return (
    <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
      {/* Images Section */}
      <div className="flex flex-col gap-4 lg:flex-row-reverse h-max">
        <Image
          src={selectedVariant?.images[0] || product.images[0]!}
          alt={product.title}
          width={500}
          height={500}
          className="max-h-250 max-w-250 lg:max-h-[500px] lg:max-w-[500px] bg-secondary"
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
          <h1 className="h3">{product.title}</h1>
          <div className="flex items-center gap-2">
            <ProductRating product={product} />|
            <span
              className={
                selectedVariant?.stock > 0 ? "text-green-600" : "text-red-600"
              }
            >
              {selectedVariant?.stock > 0 ? "In Stock" : "Out of Stock"}
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
          <span>Quantity:</span>

          <QuantityInput
            product={product}
            variant={selectedVariant}
            quantity={quantity}
            setQuantity={setQuantity}
            className="w-1/3"
          />

          <Button
            size="icon"
            disabled={selectedVariant?.stock === 0}
            variant={
              isInCart(product, selectedVariant._id) ? "default" : "outline"
            }
            onClick={() => toggleCart(product, selectedVariant._id, quantity)}
            className="flex-shrink-0"
          >
            <ShoppingCart />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button className="w-1/2" onClick={handleBuyNow}>
            Buy Now
          </Button>

          <Button
            size="icon"
            variant={
              isInWishlist(product, selectedVariant._id) ? "default" : "outline"
            }
            onClick={() => toggleWishlist(product, selectedVariant._id)}
            className="flex-shrink-0"
          >
            <Heart />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
