"use client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";
import React from "react";
import { Card } from "@workspace/ui/components/card";
import { Lock, Tag } from "lucide-react";
import Image from "next/image";
import { getVariant } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import usePricing from "@/hooks/usePricing";

// CartSummary Component
interface CartSummaryProps {
  btnUrl?: string;
  btnText?: string;
  btnAction?: () => void;
  disableBtn?: boolean;
  cardType?: "default" | "checkout";
  items?: ICartItem[];
}

function CartSummary({
  btnAction,
  disableBtn,
  btnText,
  btnUrl,
  items = [],
  cardType = "default",
}: CartSummaryProps) {
  const { currencyInfo } = useCurrency();
  const { calcCartSubtotal, formatProductPrice } = usePricing();
  if (!items || items?.length === 0) return null;

  const subtotal = calcCartSubtotal(items);
  const deliveryCharge = 0;
  const salesTax = 0;
  const total = subtotal + deliveryCharge + salesTax;

  return (
    <div className="space-y-4 w-80 h-fit sticky top-0">
      <Card className="h-full grid gap-3 p-4">
        <div className="subtitle-1 flex items-center justify-between">
          <span>Order Summary ({items.length})</span>
          {cardType !== "default" && <Button variant="link">Edit cart</Button>}
        </div>
        {cardType !== "default" && (
          <>
            <Separator />
            <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-hidden">
              {items.map(({ productId: product, variantId, quantity }) => {
                const variant = getVariant(product, variantId);
                const { price, multiplier } = formatProductPrice(
                  variant.pricing
                );

                return (
                  <div key={variant._id} className="flex items-center gap-4">
                    <Image
                      width={40}
                      height={40}
                      className="aspect-square object-contain"
                      src={variant.images[0]!}
                      alt={product.name}
                    />
                    <div className="text-sm flex-1 grid">
                      <Link
                        href={`/products/${product._id}?variant=${variantId}`}
                        className="flex justify-between gap-2"
                      >
                        <span>{product.name}</span>
                        <div className="flex gap-2">
                          <span>{multiplier(price, quantity)}</span>
                        </div>
                      </Link>
                      <span className="text-muted-foreground text-sm">
                        Qty: {quantity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center text-sm gap-2 underline">
            <Tag className="size-4" /> Have a coupon code
          </div>
          <form className="flex h-10 gap-2">
            <Input
              type="text"
              placeholder="Enter a coupon code"
              className="shadow-none"
            />
            <Button>Apply</Button>
          </form>
        </div>
        <Separator />
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {currencyInfo?.symbol}
              {subtotal.toFixed(2)}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Delivery</span>
            <span>
              {currencyInfo?.symbol}
              {deliveryCharge.toFixed(2)}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Sales tax</span>
            <span>
              {currencyInfo?.symbol}
              {salesTax.toFixed(2)}
            </span>
          </li>
        </ul>
        <Separator />
        <div className="h4 subtitle-1 flex justify-between">
          <span>Total</span>
          <span>
            {currencyInfo?.symbol}
            {total.toFixed(2)}
          </span>
        </div>
        {btnText && (
          <>
            <Separator />
            <Button onClick={btnAction} disabled={disableBtn}>
              {btnUrl ? <Link href={btnUrl}>{btnText}</Link> : btnText}
            </Button>
          </>
        )}
      </Card>
      <div className="text-sm flex-center gap-2 text-primary">
        <Lock className="size-4" /> Encrypted and secure payments
      </div>
    </div>
  );
}

export default CartSummary;
