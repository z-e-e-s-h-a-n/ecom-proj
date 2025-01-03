/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  resetEmailSchema,
  resetPasswordSchema,
  type TResetPassSchema,
} from "@/schemas/form";
import {
  AuthFormNavigation,
  RenderAuthInputs,
} from "@/components/form/AuthFormUtils";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { requestOtp, resetPassword } from "@/lib/actions/auth";
import { useToast } from "@workspace/ui/hooks/use-toast";
import OTPModal from "@/components/form/OTPModal";
import CustomInput from "@/components/form/CustomInput";
import { useRouter } from "next/navigation";
import { defaultApiResponse, IApiResponse } from "@/config/axios";

// Form component
function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpValidationResponse, setOtpValidationResponse] =
    useState<IApiResponse>(defaultApiResponse);

  // Use different schema based on OTP validation status
  const form = useForm<TResetPassSchema>({
    resolver: zodResolver(
      otpValidationResponse.success ? resetPasswordSchema : resetEmailSchema
    ),
    defaultValues: {},
  });

  // Function to handle OTP sending
  const sendOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await requestOtp({ email, purpose: "password_reset" });
      if (!response.success) throw new Error(response.message);

      setIsOtpSent(true);
      toast({ title: "OTP Sent", description: response.message });
    } catch (error: any) {
      handleError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle password reset submission
  const resetUserPassword = async (newPassword: string) => {
    setIsLoading(true);
    try {
      const token = otpValidationResponse.data.token;
      const response = await resetPassword({ token, newPassword });
      if (!response.success) throw new Error(response.message);

      toast({
        title: "Password Reset Successful",
        description: response.message,
      });
      router.push("/sign-in");
    } catch (error: any) {
      handleError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle error state
  const handleError = (message: string) => {
    setErrorMessage(message);
    toast({ variant: "destructive", title: "Error", description: message });
  };

  // Submit handler
  const onSubmit = async (values: TResetPassSchema) => {
    if (otpValidationResponse.success) {
      resetUserPassword(values.password);
    } else {
      sendOtp(values.email);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Forget Password</h1>
              <p className="text-muted-foreground">
                Please enter your email address to reset your password.
              </p>
            </div>

            {otpValidationResponse.success ? (
              <>
                <CustomInput
                  name="password"
                  type="password"
                  label="New Password"
                  placeholder="Minimum 8 characters"
                  control={form.control}
                />
                <CustomInput
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Minimum 8 characters"
                  control={form.control}
                />
              </>
            ) : (
              <RenderAuthInputs type="reset-password" control={form.control} />
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full capitalize"
            >
              {isLoading
                ? "Loading..."
                : otpValidationResponse.success
                  ? "Submit"
                  : "Send OTP"}
            </Button>

            {errorMessage && (
              <p className="text-red-500 mt-2 text-sm" role="alert">
                *{errorMessage}
              </p>
            )}

            <AuthFormNavigation type="reset-password" />
          </div>
        </form>
      </Form>

      {isOtpSent && (
        <OTPModal
          email={form.getValues("email")}
          purpose="password_reset"
          setOtpValidationResponse={setOtpValidationResponse}
        />
      )}
    </>
  );
}

export default ResetPasswordForm;
