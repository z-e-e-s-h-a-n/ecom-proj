"use client";
import { useCart } from "@/hooks/useStorage";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { Minus, Plus } from "lucide-react";

export interface IQuantityInput {
  quantity: number;
  variant: IProduct["variations"][number];
  product: IProduct;
  setQuantity?: (quantity: number) => void;
  className?: string;
}

function QuantityInput({
  variant,
  quantity,
  product,
  setQuantity,
  className,
}: IQuantityInput) {
  const { updateCart } = useCart();

  const handleQuantityChange = (quantity: number) => {
    if (setQuantity) {
      setQuantity(quantity);
    } else {
      updateCart("update", product, variant._id, quantity);
    }
  };

  return (
    <div
      className={cn(
        "flex-center flex-shrink-0  [&_>button]:size-6  [&_>button]:rounded-full  relative max-w-24 [&_>button]:absolute border rounded",
        className
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        className="left-2"
        disabled={quantity === 1}
        onClick={() => handleQuantityChange(quantity - 1)}
      >
        <Minus />
      </Button>
      <Input
        value={quantity}
        readOnly
        className="w-full text-center shad-input "
      />
      <Button
        size="icon"
        variant="ghost"
        className="right-2"
        disabled={quantity === variant.stock}
        onClick={() => handleQuantityChange(quantity + 1)}
      >
        <Plus />
      </Button>
    </div>
  );
}

export default QuantityInput;
