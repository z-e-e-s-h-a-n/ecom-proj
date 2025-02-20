"use client";

import { Form } from "@workspace/ui/components/form";
import CustomInput from "@/components/form/CustomInputV2";
import { cn } from "@workspace/ui/lib/utils";
import { paymentFormSchema, TPaymentFormSchema } from "@/schemas/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// PaymentForm Component
interface PaymentFormProps {
  className?: string;
  form?: any;
  basename?: string;
  onSubmit?: (data: TPaymentFormSchema) => void;
}

function PaymentForm({
  className,
  form,
  basename = "",
  onSubmit,
}: PaymentFormProps) {
  if (basename) basename = `${basename}.`;

  const paymentForm = useForm<TPaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {},
  });

  const renderInputFields = (form: any) => (
    <>
      <CustomInput
        name={`${basename}number`}
        label="Credit card"
        control={form.control}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <CustomInput
          name={`${basename}expiry`}
          label="Expiry date (MM / YY)"
          control={form.control}
        />
        <CustomInput
          name={`${basename}cvv`}
          label="Security code"
          control={form.control}
        />
      </div>
      <CustomInput
        name={`${basename}name`}
        label="Name on card"
        control={form.control}
      />
    </>
  );

  return onSubmit ? (
    <Form {...paymentForm}>
      <form
        onSubmit={paymentForm.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
      >
        {renderInputFields(paymentForm)}
      </form>
    </Form>
  ) : (
    form && <div className="space-y-4">{renderInputFields(form)}</div>
  );
}

export default PaymentForm;
