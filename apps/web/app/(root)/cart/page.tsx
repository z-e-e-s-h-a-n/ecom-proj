"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import useStorage from "@/hooks/useStorage";
import { productList } from "@/constants/product";
import { DELIVERY_CHARGE } from "@/constants/user";
import CartSummary from "@/components/user/CartSummary";

function Cart() {
  const { removeItem, updateCartQuantity, isInStorage, getItem } = useStorage();

  // Get cart products and their quantities
  const cartProducts = productList
    .filter(({ id }) => isInStorage("cart", id))
    .map((product) => ({
      ...product,
      quantity: getItem("cart", product.id)?.quantity || 0,
    }));

  // Handlers for cart actions
  const handleIncreaseQuantity = (itemId: string) => {
    updateCartQuantity(itemId, 1, "increment");
  };

  const handleDecreaseQuantity = (itemId: string) => {
    updateCartQuantity(itemId, 1, "decrement");
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem("cart", itemId);
  };

  // Calculate totals
  const total = cartProducts.reduce(
    (sum, product) => sum + (product.price.original ?? 0) * product.quantity,
    0
  );
  const grandTotal = total + DELIVERY_CHARGE;

  return (
    <div className="flex flex-col gap-8 pb-8 pt-16">
      <div>
        <h1 className="h3">Checkout</h1>
      </div>
      <div className="flex gap-6">
        {/* Cart Items */}
        <div className="flex-1 scrollbar-hidden max-h-[500px] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto rounded-lg shadow-md">
              <thead>
                <tr className="bg-secondary text-left text-sm uppercase text-secondary-foreground">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Subtotal</th>
                  <th className="sr-only w-max">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map(({ id, name, imageUrl, price, quantity }) => (
                  <tr className="border-b hover:bg-secondary/20" key={id}>
                    <td className="flex items-center gap-4 px-6 py-4">
                      <Image
                        src={imageUrl ?? "/path-to-placeholder.jpg"}
                        alt={name ?? "Product"}
                        width={48}
                        height={48}
                        className="rounded aspect-square object-contain"
                      />
                      <span>{name}</span>
                    </td>
                    <td className="px-6 py-4">${price.original.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-flex h-10 w-24 items-center overflow-hidden rounded-lg border">
                        <Minus
                          className="absolute left-2 cursor-pointer"
                          onClick={() => handleDecreaseQuantity(id)}
                        />
                        <Input
                          type="number"
                          value={quantity}
                          className="shad-input size-full !px-6 text-center"
                          readOnly
                        />
                        <Plus
                          className="absolute right-2 cursor-pointer"
                          onClick={() => handleIncreaseQuantity(id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      ${(price.original * quantity).toFixed(2)}
                    </td>
                    <td className="w-max px-6 py-4 text-center">
                      <Button
                        variant="destructive"
                        className="rounded-full"
                        size="icon"
                        aria-label="Remove Product"
                        onClick={() => handleRemoveItem(id)}
                      >
                        <Trash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cart Summary */}
        <CartSummary
          subtotal={total}
          total={grandTotal}
          btnText="Proceed to Checkout"
          btnUrl="/checkout"
        />
      </div>
    </div>
  );
}

export default Cart;
