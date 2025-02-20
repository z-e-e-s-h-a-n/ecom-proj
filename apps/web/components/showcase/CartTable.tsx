import { Button } from "@workspace/ui/components/button";
import { Trash2 } from "lucide-react";
import React from "react";
import QuantityInput from "../form/QuantityInput";
import Image from "next/image";
import Link from "next/link";
import { getVariant } from "@/lib/utils";
import usePricing from "@/hooks/usePricing";
import { useCart } from "@/hooks/useStorage";

function CartTable({ items }: { items: ICartItem[] }) {
  const { formatProductPrice } = usePricing();
  const { updateCart } = useCart();

  return (
    <div className="flex-1 max-h-[500px] overflow-y-auto no-scrollbar">
      <table className="min-w-full table-auto rounded-lg shadow-md">
        <thead className="sticky top-0 z-20">
          <tr className="bg-secondary text-left text-sm uppercase text-secondary-foreground">
            <th className="px-6 py-3">Product</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Quantity</th>
            <th className="px-6 py-3">Subtotal</th>
            <th className="sr-only">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ productId, quantity, variantId }) => {
            const variant = getVariant(productId, variantId);
            const { fmtPrice, price, multiplier } = formatProductPrice(
              variant.pricing
            );

            return (
              <tr key={variant._id} className="border-b hover:bg-secondary/20">
                <td className="px-6 py-4">
                  <Link
                    href={`/products/${productId._id}?variant=${variantId}`}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={variant.images[0] || "/path-to-placeholder.jpg"}
                      alt={productId.name || "Product"}
                      width={48}
                      height={48}
                      className="rounded object-contain aspect-square"
                    />
                    <span>{productId.name}</span>
                  </Link>
                </td>
                <td className="px-6 py-4">{fmtPrice}</td>
                <td className="px-6 py-4">
                  <QuantityInput
                    product={productId}
                    variant={variant}
                    quantity={quantity}
                  />
                </td>
                <td className="px-6 py-4">{multiplier(price, quantity)}</td>
                <td className="px-6 py-4 text-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => updateCart("remove", productId, variantId)}
                    className="rounded-full"
                  >
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CartTable;
