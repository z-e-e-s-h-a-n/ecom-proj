import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel";
import SectionHeader from "./SectionHeader";
import SectionFooter from "./SectionFooter";
import { cn } from "@workspace/ui/lib/utils";
import CategoryCard from "./CategoryCard";
function CategorySection({
  items,
  className,
  headerProps,
  footerProps,
}: CategorySectionProps) {
  return (
    <Carousel className={cn("flex flex-col gap-10 pb-8 pt-16", className)}>
      <SectionHeader {...headerProps} useCarousel={true} />
      <CarouselContent className="-ml-[30px]">
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className="basis-1/2 pl-[30px] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <CategoryCard {...item} className="w-full" />
          </CarouselItem>
        ))}
      </CarouselContent>
      {footerProps && <SectionFooter {...footerProps} />}
    </Carousel>
  );
}

export default CategorySection;
