import { couponSchema, TCouponSchema } from "@/schemas/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Tag } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

export interface ICouponFormProps {
  className?: string;
  onSubmit: (coupon: string) => void;
}

function CouponForm({ onSubmit }: ICouponFormProps) {
  const form = useForm<TCouponSchema>({
    resolver: zodResolver(couponSchema),
  });

  const onCouponSubmit = (values: TCouponSchema) => {
    onSubmit(values.coupon);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onCouponSubmit)}>
        <FormField
          control={form.control}
          name={"coupon"}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="flex items-center text-foreground font-normal text-sm gap-2 underline">
                <Tag className="size-4" /> Have a coupon code
              </FormLabel>
              <div className="flex h-10 gap-2">
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Enter a coupon code"
                    className="shadow-none w-full h-full"
                  />
                </FormControl>
                <Button type="submit" className=" h-full">
                  Apply
                </Button>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default CouponForm;
