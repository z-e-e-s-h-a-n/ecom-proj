import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel";
import SectionHeader from "@/components/section/SectionHeader";
import SectionFooter from "@/components/section/SectionFooter";
import { cn } from "@workspace/ui/lib/utils";
import ProductCard from "@/components/block/ProductCard";

function ProductSection({
  items,
  className,
  headerProps,
  footerProps,
  useCarousel = false,
}: ProductSectionProps) {
  return useCarousel ? (
    <Carousel className={cn("flex flex-col gap-10", className)}>
      <SectionHeader {...headerProps} useCarousel={useCarousel} />
      <CarouselContent className="-ml-[24px]">
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className="basis-full pl-[24px] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <ProductCard {...item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {footerProps && <SectionFooter {...footerProps} />}
    </Carousel>
  ) : (
    <div className={cn("grid gap-8 ", className)}>
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
