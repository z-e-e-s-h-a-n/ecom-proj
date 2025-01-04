"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/useStorage";
import { DELIVERY_CHARGE } from "@/constants/user";
import CartSummary from "@/components/user/CartSummary";
import { calculateCartPrice } from "@/lib/utils";

const Cart = () => {
  const { cart, removeFromCart, cartSubTotal, updateCartQuantity } = useCart();
  const grandTotal = cartSubTotal + DELIVERY_CHARGE;

  return (
    <div className="flex flex-col gap-8 pb-8 pt-16">
      <h1 className="h3">Checkout</h1>
      <div className="flex gap-6">
        {/* Cart Items */}
        <div className="flex-1 max-h-[500px] overflow-y-auto scrollbar-hidden">
          <table className="min-w-full table-auto rounded-lg shadow-md">
            <thead>
              <tr className="bg-secondary text-left text-sm uppercase text-secondary-foreground">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Subtotal</th>
                <th className="sr-only">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(({ productId, quantity }) => {
                const price = productId.pricing["US"]?.original || 0;

                return (
                  <tr
                    key={productId._id}
                    className="border-b hover:bg-secondary/20"
                  >
                    <td className="flex items-center gap-4 px-6 py-4">
                      <Image
                        src={productId.images[0] || "/path-to-placeholder.jpg"}
                        alt={productId.name || "Product"}
                        width={48}
                        height={48}
                        className="rounded object-contain aspect-square"
                      />
                      <span>{productId.name}</span>
                    </td>
                    <td className="px-6 py-4">${price}</td>
                    <td className="px-6 py-4">
                      <div className="flex-center  [&_>button]:size-6  [&_>button]:rounded-full  relative max-w-24 [&_>button]:absolute border rounded-lg">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="left-2"
                          disabled={quantity === 1}
                          onClick={() =>
                            updateCartQuantity(productId._id, quantity - 1)
                          }
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
                          disabled={quantity === productId.stock}
                          onClick={() =>
                            updateCartQuantity(productId._id, quantity + 1)
                          }
                        >
                          <Plus />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      ${calculateCartPrice(price, quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFromCart(productId._id)}
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

        {/* Cart Summary */}
        <CartSummary
          subtotal={cartSubTotal}
          total={grandTotal}
          btnText="Proceed to Checkout"
          btnUrl="/checkout"
        />
      </div>
    </div>
  );
};

export default Cart;
