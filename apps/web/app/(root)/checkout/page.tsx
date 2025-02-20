/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import AddressForm from "@/components/form/AddressForm";
import React, { useEffect, useMemo, useState } from "react";

import { useToast } from "@workspace/ui/hooks/use-toast";
import { useCart } from "@/hooks/useStorage";
import {
  getLocalStorage,
  getVariant,
  removeLocalStorage,
  updateLocalStorage,
} from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";
import usePricing from "@/hooks/usePricing";
import { Separator } from "@workspace/ui/components/separator";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import CartTable from "@/components/showcase/CartTable";
import {
  checkoutFormSchema,
  TCouponSchema,
  type TCheckoutFormSchema,
} from "@/schemas/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/form/CustomInputV2";
import { Form, FormMessage } from "@workspace/ui/components/form";
import { calculateShipping } from "@/lib/actions/product";
import RadioInput from "@/components/form/RadioInputV2";
import PaymentForm from "@/components/form/PaymentForm";
import CouponForm from "@/components/form/CouponForm";
import { AddUserAddress, placeUserOrder } from "@/lib/actions/user";
import useAuth from "@/hooks/useAuth";
import useStorageUtils from "@/hooks/useStorageUtils";
import OrderDetails from "@/components/showcase/OrderDetails";
import OtpInput from "@/components/form/OtpInput";
import { registerUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

function Checkout({ searchParams }: PageProps) {
  const router = useRouter();
  const { toastHandler } = useToast();
  const { cart, updateCart } = useCart();
  const { currentUser } = useAuth();
  const { formatOrderItems } = useStorageUtils();
  const [editCart, setEditCart] = useState(false);
  const [order, setOrder] = useState<IOrder | undefined>(undefined);
  const [isOtpModelOpen, setIsOtpModelOpen] = useState(false);
  const cartSource = (React.use(searchParams)?.cartSource as string) || "";
  const { formatProductPrice, calcCartSubtotal } = usePricing();
  const { currencyInfo } = useCurrency();
  const subtotal = calcCartSubtotal(cart).toFixed(2);
  const PENDING_ORDER_KEY = "pendingOrder";
  const pendingOrder = getLocalStorage<TCheckoutFormSchema | null>(
    PENDING_ORDER_KEY,
    null
  );
  const items = useMemo(
    () => (cartSource === "cartItem" && cart.length ? [cart.at(-1)!] : cart),
    [cart, cartSource]
  );

  const form = useForm<TCheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: pendingOrder ?? {
      identifier: currentUser?.email ?? currentUser?.phone,
      saveInfo: true,
      subscribe: true,
      billing: { method: "same" },
      payment: { method: "card" },
    },
  });

  const { isLoading, errorMessage } = form.watch("response") ?? {};

  const onSubmit = async (values: TCheckoutFormSchema) => {
    try {
      form.setValue("response.isLoading", true);
      if (!currentUser) {
        updateLocalStorage<TCheckoutFormSchema>(PENDING_ORDER_KEY, values);
        const response = await registerUser({
          identifier: values.identifier,
          firstName: values.shipping.address.firstName,
          lastName: values.shipping.address.lastName,
        });

        if (!response.success) {
          if (response.status === 409) {
            toastHandler({
              title: "User already exists, Your details are saved.",
              message: "Please login to place your order.",
            });
            setTimeout(() => {
              router.push("/sign-in?redirectUrl=/checkout");
            }, 2000);
          } else throw new Error(response.message);
        } else {
          toastHandler({ message: response.message });
          setIsOtpModelOpen(true);
        }
      } else {
        const shippingAddress = await AddUserAddress({
          ...values.shipping.address,
          type: "shipping",
        });
        let billingAddress = undefined;
        if (values.billing.method === "different") {
          billingAddress = await AddUserAddress({
            ...values.billing.address,
            type: "billing",
          });
        }

        const response = await placeUserOrder({
          items: formatOrderItems(items),
          totalAmount: parseFloat(subtotal),
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
        items.map(({ productId, variantId }) =>
          updateCart("remove", productId, variantId)
        );
      }
    } catch (error: any) {
      removeLocalStorage(PENDING_ORDER_KEY);
      form.setValue("response.errorMessage", error.message);
      toastHandler({ message: error?.message, variant: "destructive" });
    } finally {
      form.setValue("response.isLoading", false);
    }
  };

  const onCouponSubmit = async (values: TCouponSchema) => {};
  const shippingCost = form.watch("shipping.cost");

  useEffect(() => {
    if (!items.length || !currencyInfo) return;
    calculateShipping(items, currencyInfo).then((shipping) => {
      if (shipping) {
        form.setValue("shipping.cost", shipping);
        form.setValue("shipping.method", "standard");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, currencyInfo]);

  const paymentMethodOptions = useMemo(
    () => [
      {
        label: "Credit card",
        option: "card",
        extraContent: <PaymentForm form={form} basename="payment.card" />,
      },
      {
        label: "Cash on delivery",
        option: "cod",
      },
    ],
    [form]
  );

  const billingMethodOptions = useMemo(
    () => [
      {
        label: "Same as shipping address",
        option: "same",
      },
      {
        label: "Use a different billing address",
        option: "different",
        extraContent: <AddressForm form={form} basename="billing.address" />,
      },
    ],
    [form]
  );

  const shippingMethodOptions = useMemo(
    () => [
      {
        label: shippingCost ? "Standard Shipping" : "Free Shipping",
        option: shippingCost ? "standard" : "free",
        labelContent: shippingCost
          ? `${currencyInfo?.symbol}${shippingCost}`
          : undefined,
      },
    ],
    [shippingCost, currencyInfo]
  );

  if (!items?.length && !order) return <div>Items not found in your cart.</div>;

  return (
    <>
      {order ? (
        <OrderDetails order={order} />
      ) : (
        <div className="flex justify-between gap-8">
          <div className="w-[60%] space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 [&_>_div]:space-y-4"
                autoComplete="off"
              >
                <div>
                  <div className="flex justify-between">
                    <span className="h4">Contact</span>
                    <Link href="/sign-in" className="text-primary underline">
                      Login
                    </Link>
                  </div>
                  <CustomInput
                    name="identifier"
                    label="Email or Phone"
                    control={form.control}
                    disabled={!!currentUser}
                  />
                  <CustomInput
                    name="subscribe"
                    type="checkbox"
                    label="Email me with news and offers"
                    control={form.control}
                  />
                </div>
                <div>
                  <span className="h4">Delivery</span>
                  <AddressForm form={form} basename="shipping.address" />
                  <CustomInput
                    name="saveInfo"
                    type="checkbox"
                    label="Save this information for next time"
                    control={form.control}
                  />
                </div>
                <RadioInput
                  title="Shipping method"
                  name="shipping.method"
                  control={form.control}
                  options={shippingMethodOptions}
                />
                <div className="space-y-2">
                  <div>
                    <span className="h4">Payment</span>
                    <p className="text-sm text-muted-foreground">
                      All transactions are secure and encrypted.
                    </p>
                  </div>

                  <RadioInput
                    name="payment.method"
                    options={paymentMethodOptions}
                    control={form.control}
                  />

                  <RadioInput
                    title="Billing address"
                    name="billing.method"
                    control={form.control}
                    options={billingMethodOptions}
                  />
                </div>
                {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
                <Button className="w-full min-h-12" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Place order"}
                </Button>
              </form>
            </Form>
          </div>

          <div className="w-[40%] flex flex-col gap-4 bg-muted px-8 py-6 rounded">
            <div className="subtitle-1 flex items-center justify-between">
              <span>Order Summary ({items.length})</span>
              <Dialog open={editCart} onOpenChange={setEditCart}>
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="underline"
                    onClick={() => setEditCart(true)}
                  >
                    Edit cart
                  </Button>
                </DialogTrigger>
                <DialogContent className="m-auto max-w-[90%] min-h-[80vh]">
                  <DialogTitle className="sr-only">
                    Edit Your Cart Items
                  </DialogTitle>
                  <CartTable items={items} />
                </DialogContent>
              </Dialog>
            </div>
            <Separator />
            <ul className="flex flex-col gap-4 max-h-[220px] py-2 overflow-y-auto no-scrollbar">
              {items.map(({ productId: product, quantity, variantId }) => {
                const variant = getVariant(product, variantId);
                const { price, symbol } = formatProductPrice(variant.pricing);

                return (
                  <li
                    key={variantId}
                    className="flex items-center gap-2 w-full relative"
                    style={
                      { "--quantity": `"${quantity}"` } as React.CSSProperties
                    }
                  >
                    <div className="relative before:size-[22px] before:absolute before:-top-2 before:-right-2 before:bg-primary before:flex-center before:text-white before:rounded-full before:text-xs before:content-[var(--quantity)]">
                      <Image
                        src={variant.images[0]!}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="aspect-square size-16 rounded-md"
                      />
                    </div>
                    <div className="flex-1 flex justify-between">
                      <div className="flex flex-col">
                        <Link
                          href={`/products/${product._id}?variant=${variant._id}`}
                        >
                          {product.name}
                        </Link>
                        <span className="text-sm">
                          {Object.values(variant.attributes).join(", ")}
                        </span>
                      </div>
                      <span>
                        {symbol}
                        {price}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Separator />
            <CouponForm onSubmit={onCouponSubmit} />
            <Separator />
            <div className="flex flex-col gap-4">
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
                  <span>
                    {shippingCost
                      ? `${currencyInfo?.symbol}${shippingCost}`
                      : "Free"}
                  </span>
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
            </div>
          </div>
        </div>
      )}

      {isOtpModelOpen && (
        <OtpInput
          identifier={form.getValues("identifier")}
          purpose={"verifyEmail"}
          isOpen={isOtpModelOpen}
          setIsOpen={setIsOtpModelOpen}
          callback={form.handleSubmit(onSubmit)}
        />
      )}
    </>
  );
}

export default Checkout;
