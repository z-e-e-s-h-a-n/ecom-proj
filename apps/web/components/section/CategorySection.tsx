import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel";
import SectionHeader from "@/components/section/SectionHeader";
import SectionFooter from "@/components/section/SectionFooter";
import { cn } from "@workspace/ui/lib/utils";
import CategoryCard from "@/components/block/CategoryCard";
function CategorySection({
  items,
  className,
  headerProps,
  footerProps,
}: CategorySectionProps) {
  return (
    <Carousel className={cn("flex flex-col gap-10", className)}>
      <SectionHeader {...headerProps} useCarousel={true} />
      <CarouselContent className="-ml-[24px]">
        {items?.map((item, index) => (
          <CarouselItem
            key={index}
            className="basis-1/2 pl-[24px] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <CategoryCard {...item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {footerProps && <SectionFooter {...footerProps} />}
    </Carousel>
  );
}

export default CategorySection;
