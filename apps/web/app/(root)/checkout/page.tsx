/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AddressForm from "@/components/form/AddressForm";
import CartSummary from "@/components/user/CartSummary";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { productList } from "@/constants/product";
import { cn } from "@workspace/ui/lib/utils";
import { cardPaymentSchema, type TCardPaymentSchema } from "@/schemas/form";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import CustomInput from "@/components/form/CustomInput";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export type CheckoutSteps = "address" | "payment";
export type SetStepAction = React.Dispatch<React.SetStateAction<CheckoutSteps>>;

function CheckoutLayout() {
  const { toast } = useToast();
  const [step, setStep] = useState<CheckoutSteps>("address");
  const [payMethod, setPayMethod] = useState<"card" | "cod">("card");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TCardPaymentSchema>({
    resolver: zodResolver(cardPaymentSchema),
    defaultValues: {},
  });

  const handlePaymentSubmit = async (values: TCardPaymentSchema) => {
    setIsLoading(true);
    try {
      const response = { success: true, message: "Payment successful!" };
      if (!response.success) throw new Error(response.message);
      toast({ title: "Success", description: response.message });
      setStep("payment");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPaymentForm = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handlePaymentSubmit)}
        className="space-y-8"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <CustomInput
            name="cardName"
            placeholder="Name on Card"
            control={form.control}
          />
          <CustomInput
            name="cardNumber"
            placeholder="Card Number"
            control={form.control}
          />
          <CustomInput
            name="expiryDate"
            placeholder="MM/YY"
            control={form.control}
          />
          <CustomInput name="cvv" placeholder="CVV" control={form.control} />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Submit Payment"}
        </Button>
      </form>
    </Form>
  );

  return (
    <div className="flex gap-16">
      <div className="flex-1 space-y-12">
        <AddressForm step={step} setStep={setStep} />
        {step === "payment" ? (
          <Card>
            <CardHeader>
              <h3 className="h4">Payment</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {["card", "cod"].map((method) => (
                <Card
                  key={method}
                  className="p-4 space-y-8"
                  onClick={() => setPayMethod(method as "card" | "cod")}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("size-4 border rounded-full", {
                        "bg-primary": payMethod === method,
                      })}
                    />
                    <span className="h5 capitalize">
                      {method === "cod" ? "Cash on Delivery" : "Card"}
                    </span>
                  </div>
                  {payMethod === method &&
                    method === "card" &&
                    renderPaymentForm()}
                </Card>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <h3 className="h4">Payment</h3>
            </CardHeader>
          </Card>
        )}
      </div>
      <CartSummary
        subtotal={150}
        total={200}
        cardType="checkout"
        disableBtn={step !== "payment" || isLoading || payMethod !== "cod"}
        cartList={productList.slice(0, 6)}
        btnText={step === "payment" ? "Place Order" : "Proceed to Checkout"}
        btnAction={() => {
          toast({
            title: "Order Placed",
            description: "Your order has been successfully placed.",
          });
        }}
      />
    </div>
  );
}

export default CheckoutLayout;
