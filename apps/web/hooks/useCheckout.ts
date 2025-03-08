"use client";

import { useEffect, useMemo, useState } from "react";
import useStorage from "@/hooks/useStorage";
import {
  getLocalStorage,
  getVariant,
  removeLocalStorage,
  updateLocalStorage,
} from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import usePricing from "@/hooks/usePricing";
import { checkoutFormSchema, type TCheckoutFormSchema } from "@/schemas/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateShipping } from "@/lib/actions/product";
import { AddUserAddress, placeUserOrder } from "@/lib/actions/user";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { toast } from "sonner";

const useCheckout = (cartSource: string) => {
  const router = useRouter();
  const { cart, updateCart } = useStorage();
  const { currentUser } = useAuth();
  const { formatProductPrice, getCartSubtotal, formatCurrency } = usePricing();
  const { currencyInfo } = useCurrency();
  const [order, setOrder] = useState<IOrder | undefined>(undefined);

  const { subtotal, fmtSubtotal } = getCartSubtotal(cart);
  const PENDING_ORDER_KEY = "pendingOrder";

  const pendingOrder = getLocalStorage<TCheckoutFormSchema | null>(
    PENDING_ORDER_KEY,
    null
  );

  const items = useMemo(
    () => (cartSource === "cartItem" && cart.length ? [cart.at(-1)!] : cart),
    [cart, cartSource]
  );

  const formattedOrderItems = useMemo(
    () =>
      items.map(({ productId, quantity, variantId }) => {
        const { pricing } = getVariant(productId, variantId);

        return {
          productId: productId._id,
          variantId,
          quantity,
          price: formatProductPrice(pricing).price,
        };
      }),
    [currencyInfo, items]
  );

  const formattedShippingItems = useMemo(
    () =>
      items.map(({ productId, quantity, variantId }) => {
        const { pricing, shipping } = getVariant(productId, variantId);

        return {
          productId: productId._id,
          categoryId: productId.category._id,
          quantity,
          price: formatProductPrice(pricing).price,
          ...shipping,
        };
      }),
    [currencyInfo, items]
  );

  const form = useForm<TCheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: pendingOrder ?? {
      newsletter: true,
      saveInfo: true,
      shipping: { cost: 0 },
      billing: { method: "same" },
      payment: { method: "card" },
    },
  });

  const shippingCost = form.watch("shipping.cost");
  const grandTotal = subtotal + shippingCost;

  const onSubmit = async (values: TCheckoutFormSchema) => {
    try {
      form.setValue("response.isLoading", true);
      if (!currentUser) {
        updateLocalStorage<TCheckoutFormSchema>(PENDING_ORDER_KEY, values);
        toast.info("Details Saved", {
          description: "Please login to place your order.",
        });
        setTimeout(() => router.push("/sign-in?redirectUrl=/checkout"), 3000);
      } else {
        const shippingAddress = await AddUserAddress({
          ...values.shipping.address,
          type: "shipping",
        });
        let billingAddress;
        if (values.billing.method === "different") {
          billingAddress = await AddUserAddress({
            ...values.billing.address,
            type: "billing",
          });
        }

        const response = await placeUserOrder({
          items: formattedOrderItems,
          totalAmount: subtotal,
          shipping: {
            method: values.shipping.method,
            cost: values.shipping.cost,
            addressId: shippingAddress._id,
          },
          billing: {
            method: values.billing.method,
            addressId: billingAddress?._id,
          },
          payment: {
            method: values.payment.method,
            status: "pending",
            currency: currencyInfo?.currency,
            symbol: currencyInfo?.symbol,
          },
        });

        if (!response.success) throw new Error("Failed to place order");
        toast.success("Success", { description: "Order placed successfully." });
        removeLocalStorage(PENDING_ORDER_KEY);
        setOrder(response.data.order);
        items.forEach(({ productId, variantId }) =>
          updateCart("remove", productId, variantId, 1, false)
        );
      }
    } catch (error: any) {
      removeLocalStorage(PENDING_ORDER_KEY);
      toast.error("Success", { description: error?.message });
    } finally {
      form.setValue("response.isLoading", false);
    }
  };

  useEffect(() => {
    const debouncedShipping = debounce(() => {
      if (!formattedShippingItems.length) return;
      calculateShipping({
        items: formattedShippingItems,
        country: currencyInfo.countries[0]!,
      }).then((shipping) => {
        if (shipping) {
          form.setValue("shipping.cost", shipping);
          form.setValue("shipping.method", "standard");
        }
      });
    }, 500);

    debouncedShipping();
    return () => debouncedShipping.cancel();
  }, [formattedShippingItems, currencyInfo]);

  return {
    form,
    order,
    onSubmit,
    items,
    fmtSubtotal,
    fmtShippingCost: formatCurrency(shippingCost),
    fmtGrandTotal: formatCurrency(grandTotal),
  };
};

export default useCheckout;
