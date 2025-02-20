"use client";

import { Button } from "@workspace/ui/components/button";
import { Lock } from "lucide-react";
import { useCart } from "@/hooks/useStorage";
import Link from "next/link";
import usePricing from "@/hooks/usePricing";
import { Separator } from "@workspace/ui/components/separator";
import { Card } from "@workspace/ui/components/card";
import { useCurrency } from "@/hooks/useCurrency";
import CartTable from "@/components/showcase/CartTable";

const Cart = () => {
  const { cart } = useCart();
  const { calcCartSubtotal } = usePricing();
  const { currencyInfo } = useCurrency();
  const subtotal = calcCartSubtotal(cart).toFixed(2);

  if (!cart.length) return <div>Items not found in your cart.</div>;

  return (
    <>
      <h1 className="h3">Checkout</h1>
      <div className="flex gap-6">
        {/* Cart Items */}
        <CartTable items={cart} />

        {/* Cart Summary */}
        <div className="space-y-4 w-80 h-fit sticky top-0">
          <Card className="h-full grid gap-3 p-4">
            <span>Order Summary ({cart.length})</span>

            <Separator />

            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {currencyInfo?.symbol}
                  {subtotal}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Shipping</span>
                <span className="text-sm">calc at checkout</span>
              </li>
            </ul>
            <Separator />
            <div className="h4 subtitle-1 flex justify-between">
              <span>Total</span>
              <span>
                {currencyInfo?.symbol}
                {subtotal}
              </span>
            </div>
            <Button>
              <Link href="/checkout">PROCEED TO CHECKOUT</Link>
            </Button>
          </Card>
          <div className="text-sm flex-center gap-2 text-primary">
            <Lock className="size-4" /> Encrypted and secure payments
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
