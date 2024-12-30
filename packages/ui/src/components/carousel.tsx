"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(
  (
    { className, children, variant = "outline", size = "icon", ...props },
    ref
  ) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(className, {
          "absolute h-8 w-8 rounded-full": !children,
          "-left-12 top-1/2 -translate-y-1/2":
            !children && orientation === "horizontal",
          "-top-12 left-1/2 -translate-x-1/2 rotate-90":
            !children && orientation === "vertical",
        })}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        {children ? children : <ArrowLeft className="h-4 w-4" />}
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(
  (
    { className, children, variant = "outline", size = "icon", ...props },
    ref
  ) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(className, {
          "absolute h-8 w-8 rounded-full": !children,
          "-right-12 top-1/2 -translate-y-1/2":
            !children && orientation === "horizontal",
          "-bottom-12 left-1/2 -translate-x-1/2 rotate-90":
            !children && orientation === "vertical",
        })}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        {children ? children : <ArrowRight className="h-4 w-4" />}
        <span className="sr-only">Next slide</span>
      </Button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

const CarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { api, orientation } = useCarousel();
  const [dots, setDots] = React.useState<number[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      const currentIndex = api.selectedScrollSnap();
      if (currentIndex !== activeIndex && !isAnimating) {
        setActiveIndex(currentIndex);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [api, activeIndex, isAnimating]);

  React.useEffect(() => {
    if (!api) return;

    const scrollSnaps = api.scrollSnapList().map((snap, idx) => idx);
    setDots(scrollSnaps);
  }, [api]);

  const handleDotClick = React.useCallback(
    (index: number) => {
      if (isAnimating || index === activeIndex || !api) return;

      setIsAnimating(true);
      api.scrollTo(index);

      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    },
    [api, isAnimating, activeIndex]
  );

  return (
    <div
      ref={ref}
      className={cn("absolute flex transform gap-2", className, {
        "bottom-4 left-1/2 -translate-x-1/2": orientation === "horizontal",
        "right-1/2 top-4 -translate-x-1/2": orientation === "vertical",
      })}
      {...props}
    >
      {dots.map((index) => (
        <button
          key={index}
          className={cn(
            "relative size-4 cursor-pointer rounded-full border border-transparent transition-transform duration-300 before:absolute before:inset-1/2 before:size-[7px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary before:transition-colors before:duration-300 hover:scale-110",
            {
              "scale-110 border-primary before:shadow-lg":
                index === activeIndex,
            }
          )}
          onClick={() => handleDotClick(index)}
          disabled={isAnimating || index === activeIndex}
        />
      ))}
    </div>
  );
});
CarouselDots.displayName = "CarouselDots";

const CarouselButtons = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      className={cn("flex-center relative gap-4", className, {
        "flex-row": orientation === "horizontal",
        "flex-col": orientation === "vertical",
      })}
      {...props}
    >
      <CarouselPrevious
        size="icon"
        variant="secondary"
        className="rounded-full"
      >
        <ArrowLeft />
      </CarouselPrevious>
      <CarouselNext size="icon" variant="secondary" className="rounded-full">
        <ArrowRight />
      </CarouselNext>
    </div>
  );
});
CarouselButtons.displayName = "CarouselButtons";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  CarouselPrevious,
  CarouselNext,
  CarouselButtons,
};
