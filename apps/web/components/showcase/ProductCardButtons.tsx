"use client";
import {
  Eye,
  Heart,
  ShoppingCart,
  type LucideIcon,
  ArrowLeftRight,
} from "lucide-react";
import { Button, ButtonVariant } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import useStorage from "@/hooks/useStorage";
import { toast } from "sonner";

interface IProductActions {
  Icon: LucideIcon;
  label: string;
  action: () => void;
  variant: ButtonVariant;
}

interface ProductButtonsProps extends IProduct {
  className?: string;
}

function ProductCardButtons({ className, id, name }: ProductButtonsProps) {
  const { addItem, removeItem, isInStorage } = useStorage();

  const isInCart = isInStorage("cart", id);
  const isInWishlist = isInStorage("wishlist", id);

  const toggleCart = () => {
    if (isInCart) {
      removeItem("cart", id);
      toast(`Removed from your cart`, { description: name });
    } else {
      addItem("cart", id);
      toast(`Added to your cart`, { description: name });
    }
  };

  // Function to toggle wishlist item
  const toggleWishlist = () => {
    if (isInWishlist) {
      removeItem("wishlist", id);
      toast(`Removed from your wishlist`, { description: name });
    } else {
      addItem("wishlist", id);
      toast(`Added to your wishlist`, { description: name });
    }
  };

  const productActions: IProductActions[] = [
    {
      Icon: ShoppingCart,
      label: isInCart ? "Remove from Cart" : "Add to Cart",
      action: toggleCart,
      variant: isInCart ? "default" : "outline",
    },
    {
      Icon: Heart,
      label: isInWishlist ? "Remove from Wishlist" : "Add to Wishlist",
      action: toggleWishlist,
      variant: isInWishlist ? "default" : "outline",
    },
    {
      Icon: Eye,
      label: "Quick View",
      action: () => {},
      variant: "outline",
    },
    {
      Icon: ArrowLeftRight,
      label: "Compare",
      action: () => {},
      variant: "outline",
    },
  ];

  return (
    <div
      className={cn(
        "absolute right-4 top-6 z-20 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover/product-card:top-4 group-hover/product-card:opacity-100",
        className
      )}
    >
      {productActions.map(({ label, Icon, action, variant }) => (
        <Button
          key={label}
          size="icon"
          variant={variant}
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
