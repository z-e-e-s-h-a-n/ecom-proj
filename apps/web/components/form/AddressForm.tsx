"use client";

import { Form } from "@workspace/ui/components/form";
import CustomInput from "@/components/form/CustomInputV2";
import { cn } from "@workspace/ui/lib/utils";
import { addressSchema, TAddressSchema } from "@/schemas/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// AddressForm Component
interface AddressFormProps {
  className?: string;
  form?: any;
  basename?: string;
  onSubmit?: (values: TAddressSchema) => void;
}

function AddressForm({
  form,
  basename = "",
  className,
  onSubmit,
}: AddressFormProps) {
  if (basename) basename = `${basename}.`;

  const addressForm = useForm<TAddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {},
  });

  const renderInputFields = (form: any) => (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <CustomInput
          name={`${basename}firstName`}
          label="First Name"
          control={form.control}
        />
        <CustomInput
          name={`${basename}lastName`}
          label="Last Name"
          control={form.control}
        />
      </div>
      <CustomInput
        name={`${basename}street`}
        label="Address"
        control={form.control}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <CustomInput
          name={`${basename}country`}
          label="Country"
          control={form.control}
        />
        <CustomInput
          name={`${basename}city`}
          label="City"
          control={form.control}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CustomInput
          name={`${basename}state`}
          label="Region/Province"
          control={form.control}
        />
        <CustomInput
          name={`${basename}zip`}
          label="Zip Code"
          control={form.control}
        />
      </div>
    </>
  );

  return onSubmit ? (
    <Form {...addressForm}>
      <form
        onSubmit={addressForm.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
      >
        {renderInputFields(addressForm)}
      </form>
    </Form>
  ) : (
    form && <div className="space-y-4">{renderInputFields(form)}</div>
  );
}

export default AddressForm;
