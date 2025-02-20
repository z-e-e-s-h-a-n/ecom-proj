declare global {
  type AuthFormType = "sign-up" | "sign-in" | "reset-password" | "set-password";
  interface CustomInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    type?: "text" | "password" | "email" | "checkbox" | "number";
    control: any;
  }

  interface RenderAuthInputs {
    type: AuthFormType;
    control: any;
    isAuth?: boolean;
  }

  export interface RadioInputProps {
    className?: string;
    title?: string;
    name: string;
    control: any;
    options: Array<{
      label: string;
      option: string;
      labelContent?: string | React.ReactNode;
      extraContent?: React.ReactNode;
    }>;
  }
}

export {};
