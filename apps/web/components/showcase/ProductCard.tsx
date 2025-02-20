import { Star } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import ProductCardButtons from "@/components/showcase/ProductCardButtons";
import { getVariant } from "@/lib/utils";
import usePricing from "@/hooks/usePricing";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import ProductDetails from "./ProductDetails";
import ProductRating from "./ProductRating";

export interface IProductCard {
  product: IProduct;
  variantId?: string;
}

const ProductCard = ({ product, variantId }: IProductCard) => {
  const variant = getVariant(product, variantId);
  const { formatProductPrice } = usePricing();
  const [openQuickView, setOpenQuickView] = useState(false);
  const { fmtOriginal, fmtPrice, sale } = formatProductPrice(variant.pricing);

  return (
    <Dialog open={openQuickView} onOpenChange={setOpenQuickView}>
      <Link
        href={`/products/${product._id}?variant=${variant?._id}`}
        className="group/product-card overflow-hidden rounded-md bg-background shadow-light"
      >
        <div className="flex-center relative h-[220px] w-full bg-secondary px-10 py-8">
          <Image
            src={product.images[0]!}
            alt="Product 1"
            width={190}
            height={180}
            loading="eager"
            className="h-full !object-contain transition-all duration-300 group-hover/product-card:scale-110"
          />
          <ProductCardButtons
            product={product}
            variant={variant}
            setOpenQuickView={setOpenQuickView}
          />
        </div>
        <div className="flex flex-col gap-1 px-2 py-4">
          <h3 className="h5 truncate">{product.name}</h3>
          <div className="flex-items-center subtitle-1 gap-2">
            <span>{fmtPrice}</span>
            {sale && (
              <span className="text-muted-foreground text-sm line-through">
                {fmtOriginal}
              </span>
            )}
          </div>
          <ProductRating product={product} showText={false} />
        </div>
      </Link>
      <DialogContent className="m-auto max-w-[90%]">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <ProductDetails product={product} currentVariant={variant} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;
