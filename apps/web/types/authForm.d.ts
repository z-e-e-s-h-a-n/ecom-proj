import { FieldPath, Control } from "react-hook-form";

declare global {
  type TFormControl = Control<TSignUpSchema>;
  type TFormFieldPath = FieldPath<FormValuesType>;

  interface AuthFormType {
    type: "sign-up" | "sign-in" | "reset-password";
  }

  // extends  with input element props

  interface CustomInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    type?: "text" | "password" | "email" | "checkbox" | "number";
    placeholder?: string;
    control: TFormControl;
  }

  interface RenderAuthInputs {
    type: AuthFormType["type"];
    control: TFormControl;
  }
}

export {};
