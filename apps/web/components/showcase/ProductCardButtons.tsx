"use client";
import { Eye, GitCompareArrows, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

function ProductCardButtons({ className }: { className?: string }) {
  const productActions = [
    {
      Icon: Heart,
      label: "Add to Wishlist",
      action: () => {},
    },
    {
      Icon: Eye,
      label: "Quick View",
      action: () => {},
    },
    {
      Icon: GitCompareArrows,
      label: "Compare",
      action: () => {},
    },
    {
      Icon: ShoppingCart,
      label: "Add to Cart",
      action: () => {},
    },
  ];

  return (
    <div
      className={cn(
        "absolute right-4 top-6 z-20 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover/product-card:top-4 group-hover/product-card:opacity-100",
        className,
      )}
    >
      {productActions.map(({ label, Icon, action }) => (
        <Button
          key={label}
          size="icon"
          variant="outline"
          className="rounded-full"
          onClick={(e) => {
            e.preventDefault();
            action();
          }}
        >
          <Icon />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  );
}

export default ProductCardButtons;
