"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { addressSchema, type TAddressSchema } from "@/schemas/form";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import CustomInput from "@/components/form/CustomInput";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { cn } from "@workspace/ui/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@workspace/ui/components/card";
import { CheckoutSteps, SetStepAction } from "@/app/(root)/checkout/page";

// AddressForm Component
interface AddressFormProps {
  className?: string;
  step?: CheckoutSteps;
  setStep?: SetStepAction;
}

function AddressForm({ className, step, setStep }: AddressFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<TAddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: TAddressSchema) => {
    setIsLoading(true);
    try {
      const response = {
        success: true,
        message: "Address submitted successfully.",
      };
      if (!response.success) throw new Error(response.message);
      toast({ title: "Success", description: response.message });
      setStep?.("payment");
    } catch (error: any) {
      setErrorMessage(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "payment") {
    const values = form.getValues();
    return (
      <Card>
        <CardHeader>
          <h3 className="h4">Address Details</h3>
        </CardHeader>
        <CardContent className="flex-justify-between">
          <div className="space-y-1 text-muted-foreground">
            <p>
              {values.firstName} {values.lastName}
            </p>
            <p>{values.phone}</p>
            <p>
              {values.country}, {values.state}, {values.city}
            </p>
            <p>
              {values.address}, {values.zip}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setStep?.("address")}
            className="mt-auto !text-primary"
          >
            Edit
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={cn("space-y-6", className)}>
          <CardHeader>
            <h3 className="h4">Address Details</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <CustomInput
                name="firstName"
                label="First Name"
                placeholder="Your First Name"
                control={form.control}
              />
              <CustomInput
                name="lastName"
                label="Last Name"
                placeholder="Your Last Name"
                control={form.control}
              />
            </div>
            <CustomInput
              name="phone"
              label="Phone Number"
              placeholder="Your Mobile Number"
              control={form.control}
            />
            <CustomInput
              name="country"
              label="Country"
              placeholder="Your Country"
              control={form.control}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <CustomInput
                name="address"
                label="Address"
                placeholder="Your Address"
                control={form.control}
              />
              <CustomInput
                name="city"
                label="City"
                placeholder="Your City"
                control={form.control}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <CustomInput
                name="state"
                label="Region/Province"
                placeholder="Your Region/Province"
                control={form.control}
              />
              <CustomInput
                name="zip"
                label="Zip Code"
                placeholder="Your Zip Code"
                control={form.control}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-max">
              {isLoading ? "Loading..." : "Continue"}
            </Button>
            {errorMessage && (
              <p className="text-red-500 mt-2 text-sm">*{errorMessage}</p>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default AddressForm;
