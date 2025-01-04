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
import { useCart, useWishlist } from "@/hooks/useStorage";
import { toast } from "sonner";

interface IProductActions {
  Icon: LucideIcon;
  label: string;
  action: () => void;
  variant: ButtonVariant;
}

interface ProductButtonsProps {
  product: IProduct;
  className?: string;
}

function ProductCardButtons({ className, product }: ProductButtonsProps) {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleCart = () => {
    if (isInCart(product._id)) {
      removeFromCart(product._id);
      toast(`Removed from your cart`, { description: product.name });
    } else {
      addToCart(product, 1);
      toast(`Added to your cart`, { description: product.name });
    }
  };

  // Function to toggle wishlist item
  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast(`Removed from your wishlist`, { description: product.name });
    } else {
      addToWishlist(product);
      toast(`Added to your wishlist`, { description: product.name });
    }
  };

  const productActions: IProductActions[] = [
    {
      Icon: ShoppingCart,
      label: isInCart(product._id) ? "Remove from Cart" : "Add to Cart",
      action: toggleCart,
      variant: isInCart(product._id) ? "default" : "outline",
    },
    {
      Icon: Heart,
      label: isInWishlist(product._id)
        ? "Remove from Wishlist"
        : "Add to Wishlist",
      action: toggleWishlist,
      variant: isInWishlist(product._id) ? "default" : "outline",
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
