/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { signinSchema, type TSignInSchema } from "@/schemas/form";
import {
  AuthFormNavigation,
  RenderAuthInputs,
  RenderSocialAuthButton,
} from "@/components/form/AuthFormUtils";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { loginUser } from "@/lib/actions/auth";
import CustomInput from "@/components/form/CustomInput";
import Link from "next/link";
import OTPModal from "@/components/form/OTPModal";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { useRouter } from "next/navigation";

function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOtpSend, setIsOtpSend] = useState(false);

  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {},
  });

  // Handle sign-in process
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });

      if (!response.success) throw new Error(response.message);

      toast({ title: "Login Successful", description: response.message });
      router.push("/");
    } catch (error: any) {
      handleError(error.message, error.data);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP process if the user is not verified
  const handleError = (message: string, data: any) => {
    setErrorMessage(message);
    toast({ variant: "destructive", title: "Error", description: message });

    if (data?.user?.isVerified === false) {
      setIsOtpSend(true);
    }
  };

  // Form submission handler
  const onSubmit = async (values: TSignInSchema) => {
    const { email, password } = values;
    handleSignIn(email, password);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">Login to your account.</p>
            </div>

            <RenderAuthInputs type="sign-in" control={form.control} />

            <div className="flex items-center">
              <CustomInput
                name="rememberMe"
                type="checkbox"
                label="Remember Me"
                control={form.control}
              />
              <Link
                href="/reset-password"
                className="ml-auto min-w-max text-sm underline-offset-2 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full capitalize"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </Button>

            {errorMessage && (
              <p className="text-red-500 mt-2 text-sm" role="alert">
                *{errorMessage}
              </p>
            )}

            <RenderSocialAuthButton />
            <AuthFormNavigation type="sign-in" />
          </div>
        </form>
      </Form>

      {isOtpSend && (
        <OTPModal
          email={form.getValues("email")}
          purpose="email_verification"
        />
      )}
    </>
  );
}

export default SignInForm;
