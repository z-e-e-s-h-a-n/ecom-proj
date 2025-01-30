import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProductCardButtons from "@/components/showcase/ProductCardButtons";
import { formatProductPrice, getVariant } from "@/lib/utils";

export interface IProductCard {
  product: IProduct;
  variantId?: string;
}

const ProductCard = ({ product, variantId }: IProductCard) => {
  const variant = getVariant(product, variantId);
  const { fmtOriginal, fmtPrice, sale } = formatProductPrice(variant.pricing);

  return (
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
        <ProductCardButtons product={product} variant={variant} />
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
        <div className="flex-items-center gap-2">
          <div className="flex-items-center gap-1">
            <Star className="size-4 text-orange-400" />
            <Star className="size-4 text-orange-400" />
            <Star className="size-4 text-orange-400" />
            <Star className="size-4 text-orange-400" />
            <Star className="size-4 text-orange-400" />
          </div>
          <span className="text-muted-foreground">
            ({product.reviews.length})
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
