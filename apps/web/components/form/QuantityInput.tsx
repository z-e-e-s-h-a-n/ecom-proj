"use client";
import { useCart } from "@/hooks/useStorage";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Minus, Plus } from "lucide-react";

export interface IQuantityInput {
  quantity: number;
  variant: IProduct["variations"][number];
  product: IProduct;
  setQuantity?: (quantity: number) => void;
}

function QuantityInput({
  variant,
  quantity,
  product,
  setQuantity,
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
    <div className="flex-center  [&_>button]:size-6  [&_>button]:rounded-full  relative max-w-24 [&_>button]:absolute border rounded-lg">
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
