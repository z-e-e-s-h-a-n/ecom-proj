/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { signupSchema, type TSignUpSchema } from "@/schemas/form";
import {
  AuthFormNavigation,
  RenderAuthInputs,
  RenderSocialAuthButton,
} from "@/components/form/AuthFormUtils";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { registerUser } from "@/lib/actions/user";
import { useToast } from "@workspace/ui/hooks/use-toast";
import OTPModal from "@/components/form/OTPModal";

// SignUpForm Component
function SignUpForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOtpSend, setIsOtpSend] = useState(false);

  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {},
  });

  // Handle the registration process
  const handleSignUp = async (values: TSignUpSchema) => {
    const { firstName, lastName, email, password } = values;
    const name = `${firstName} ${lastName}`;
    setIsLoading(true);

    try {
      const response = await registerUser({ name, email, password });

      if (!response.success) throw new Error(response.message);

      toast({
        title: "Signup Successful",
        description: response.message,
      });
      setIsOtpSend(true);
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

  // Form submission handler
  const onSubmit = (values: TSignUpSchema) => {
    handleSignUp(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Create an Account</h1>
              <p className="text-muted-foreground">
                Fill out the fields to create an account.
              </p>
            </div>

            <RenderAuthInputs type="sign-up" control={form.control} />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full capitalize"
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>

            {errorMessage && (
              <p className="text-red-500 mt-2 text-sm" role="alert">
                *{errorMessage}
              </p>
            )}

            <RenderSocialAuthButton />
            <AuthFormNavigation type="sign-up" />
          </div>
        </form>
      </Form>

      {/* OTP Modal shown if OTP is sent */}
      {isOtpSend && (
        <OTPModal
          email={form.getValues("email")}
          purpose="email_verification"
          redirectUrl="/sign-in"
        />
      )}
    </>
  );
}

export default SignUpForm;
