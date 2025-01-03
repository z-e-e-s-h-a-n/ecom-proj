import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import ProductCardButtons from "@/components/showcase/ProductCardButtons";

export interface ProductCardProps extends IProduct {
  className?: string;
}

function ProductCard(product: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group/product-card overflow-hidden rounded-md bg-background shadow-light",
        product.className
      )}
    >
      <div className="flex-center relative h-[220px] w-full bg-secondary px-10 py-8">
        <Image
          src={product.imageUrl}
          alt="Product 1"
          width={190}
          height={180}
          loading="eager"
          className="h-full !object-contain transition-all duration-300 group-hover/product-card:scale-110"
        />
        <ProductCardButtons {...product} />
      </div>
      <div className="flex flex-col gap-1 px-2 py-4">
        <h3 className="h5 truncate">HAVIT HV-G92 Gamepad</h3>
        <div className="flex-items-center subtitle-1 gap-2">
          <span>$120</span>
          <span className="text-muted-foreground line-through">$160</span>
        </div>
        <div className="flex-items-center gap-2">
          <div className="flex-items-center gap-1">
            <Star className="size-4 text-orange-400" />
            <Star className="size-4 text-orange-400" />
            <Star className="size-4 text-orange-400" />
            <Star className="size-4 text-orange-400" />
            <Star className="size-4 text-orange-400" />
          </div>
          <span className="text-muted-foreground">(88)</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
