"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@workspace/ui/hooks/use-toast";
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

const useCheckout = (cartSource: string) => {
  const router = useRouter();
  const { toastHandler } = useToast();
  const { cart, updateCart } = useStorage();
  const { currentUser } = useAuth();
  const { formatProductPrice, calcCartSubtotal } = usePricing();
  const { currencyInfo } = useCurrency();
  const [order, setOrder] = useState<IOrder | undefined>(undefined);

  const subtotal = calcCartSubtotal(cart);
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
      items.map(({ productId, quantity, variantId }) => ({
        productId: productId._id,
        variantId,
        quantity,
        price: formatProductPrice(getVariant(productId, variantId).pricing)
          .price,
      })),
    []
  );

  const formattedShippingItems = useMemo(
    () =>
      items.map(({ productId, quantity, variantId }) => ({
        categoryId: productId.category._id,
        quantity,
        price: formatProductPrice(getVariant(productId, variantId).pricing)
          .price,
      })),
    []
  );

  const form = useForm<TCheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: pendingOrder ?? {
      saveInfo: true,
      billing: { method: "same" },
      payment: { method: "card" },
    },
  });

  const onSubmit = async (values: TCheckoutFormSchema) => {
    try {
      form.setValue("response.isLoading", true);
      if (!currentUser) {
        updateLocalStorage<TCheckoutFormSchema>(PENDING_ORDER_KEY, values);
        toastHandler({
          title: "Details Saved",
          message: "Please login to place your order.",
          variant: "destructive",
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
        toastHandler({ message: "Order placed successfully." });
        removeLocalStorage(PENDING_ORDER_KEY);
        setOrder(response.data.order);
        items.forEach(({ productId, variantId }) =>
          updateCart("remove", productId, variantId, 1, false)
        );
      }
    } catch (error: any) {
      removeLocalStorage(PENDING_ORDER_KEY);
      toastHandler({ message: error?.message, variant: "destructive" });
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
        subtotal,
      }).then((shipping) => {
        if (shipping) {
          form.setValue("shipping.cost", shipping);
          form.setValue("shipping.method", "standard");
        }
      });
    }, 500);

    debouncedShipping();
    return () => debouncedShipping.cancel();
  }, [formattedShippingItems.length, currencyInfo]);

  return { form, order, onSubmit, items, subtotal };
};

export default useCheckout;
