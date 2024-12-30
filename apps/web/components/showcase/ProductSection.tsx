import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel";
import SectionHeader from "./SectionHeader";
import SectionFooter from "./SectionFooter";
import { cn } from "@workspace/ui/lib/utils";
import ProductCard from "./ProductCard";

function ProductSection({
  items,
  className,
  headerProps,
  footerProps,
  useCarousel = false,
}: ProductSectionProps) {
  return useCarousel ? (
    <Carousel className={cn("flex flex-col gap-10 pb-8 pt-16", className)}>
      <SectionHeader {...headerProps} useCarousel={useCarousel} />
      <CarouselContent className="-ml-[30px]">
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className="basis-full pl-[30px] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <ProductCard {...item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {footerProps && <SectionFooter {...footerProps} />}
    </Carousel>
  ) : (
    <div className={cn("grid gap-8 pb-8 pt-16", className)}>
      <SectionHeader {...headerProps} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item, index) => (
          <ProductCard key={index} {...item} />
        ))}
      </div>
      {footerProps && <SectionFooter {...footerProps} />}
    </div>
  );
}

export default ProductSection;
