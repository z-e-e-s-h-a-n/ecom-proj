"use client";
import {
  Eye,
  Heart,
  ShoppingCart,
  type LucideIcon,
  ArrowLeftRight,
} from "lucide-react";
import { Button, ButtonVariant } from "@workspace/ui/components/button";
import useStorage from "@/hooks/useStorage";

interface IProductActions {
  Icon: LucideIcon;
  label: string;
  action: (product: IProduct, variantId: string) => void;
  variant: ButtonVariant;
}

interface ProductButtonsProps {
  product: IProduct;
  variant: IProduct["variations"][number];
  setOpenQuickView: (isOpen: boolean) => void;
}

function ProductCardButtons({
  product,
  variant,
  setOpenQuickView,
}: ProductButtonsProps) {
  const { toggleWishlist, isInWishlist, toggleCart, isInCart } = useStorage();
  const variantId = variant._id;

  const isItemInCart = isInCart(product, variantId);
  const isItemInWishlist = isInWishlist(product, variantId);

  const productActions: IProductActions[] = [
    {
      Icon: ShoppingCart,
      label: isItemInCart ? "Remove from Cart" : "Add to Cart",
      action: toggleCart,
      variant: isItemInCart ? "default" : "outline",
    },
    {
      Icon: Heart,
      label: isItemInWishlist ? "Remove from Wishlist" : "Add to Wishlist",
      action: toggleWishlist,
      variant: isItemInWishlist ? "default" : "outline",
    },
    {
      Icon: Eye,
      label: "Quick View",
      action: () => setOpenQuickView(true),
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
    <div className="absolute right-4 top-6 z-20 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover/product-card:top-4 group-hover/product-card:opacity-100">
      {productActions.map(({ label, Icon, action, variant }) => (
        <Button
          key={label}
          size="icon"
          variant={variant}
          className="rounded-full"
          onClick={(e) => {
            e.preventDefault();
            action(product, variantId);
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
