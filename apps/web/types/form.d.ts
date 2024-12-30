import { getAuthSchema } from "@/schemas/authForm";
import * as z from "zod";
import {
  UseFormReturn,
  FieldPath,
  DefaultValues,
  Control,
  ControllerRenderProps,
} from "react-hook-form";

export const formSchema = getAuthSchema("sign-up");

declare global {
  type initialFormValues = DefaultValues<FormValuesType>;
  type FormValuesType = z.infer<typeof formSchema>;
  type FormMethodsType = UseFormReturn<FormValuesType>;
  type FormControlType = Control<FormValuesType>;
  type FormFieldPathType = FieldPath<FormValuesType>;
  type FormFieldType = ControllerRenderProps<FormValuesType, FormFieldPathType>;

  interface AuthFormType {
    type: "sign-in" | "sign-up" | "reset-password";
  }

  interface CustomInputProps {
    name: FormFieldPathType;
    label: string;
    type: "text" | "password" | "email" | "checkbox";
    placeholder?: string;
    control: FormControlType;
  }
}

export {};
