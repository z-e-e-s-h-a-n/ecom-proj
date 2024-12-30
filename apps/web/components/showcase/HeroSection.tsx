import Image from "next/image";
import CategorySidebar from "@/components/constant/CategorySidebar";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@workspace/ui/components/carousel";
import { heroImages } from "@/constants";
import { Button } from "@workspace/ui/components/button";

function HeroSection() {
  return (
    <div className="flex gap-6 rounded-md pt-8">
      <CategorySidebar />
      <Carousel className="flex-1 overflow-hidden rounded-md border shadow-light">
        <CarouselContent>
          {heroImages.map(({ src, alt }) => (
            <CarouselItem key={src}>
              <div className="flex-justify-between relative min-h-[500px]">
                <div className="absolute left-5 top-1/4 z-30 max-w-[400px]">
                  <h1 className="h1 text-black">Lorem ipsum consectetur</h1>
                  <p className="mb-8 mt-4 text-black">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dignissimos quidem nesciunt dolore.
                  </p>
                  <div className="flex-items-center gap-4">
                    <Button>Shop Now</Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>
                <Image src={src} alt={alt} layout="fill" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselDots />
      </Carousel>
    </div>
  );
}

export default HeroSection;
