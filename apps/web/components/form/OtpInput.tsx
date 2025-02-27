/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { Button } from "@workspace/ui/components/button";
import { requestOtp, validateOtp } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@workspace/ui/hooks/use-toast";
import Image from "next/image";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { otpFormSchema, TOtpFormSchema } from "@/schemas/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";

interface IOtpInputProps {
  identifier: string;
  purpose: OtpPurpose;
  redirectUrl?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function OtpInput({
  identifier,
  purpose,
  redirectUrl,
  isOpen,
  setIsOpen,
}: IOtpInputProps) {
  const router = useRouter();
  const { toastHandler } = useToast();

  const form = useForm<TOtpFormSchema>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  });

  const { isLoading, errorMessage } = form.watch("response") ?? {};
  const sendingOtp = form.watch("sendingOtp") ?? false;

  const onSubmit = async ({ otp: secret }: TOtpFormSchema) => {
    try {
      form.setValue("response.isLoading", true);
      const response = await validateOtp({ identifier, secret, purpose });
      if (!response?.success) throw new Error(response.message);
      if (response.data.secret) {
        toastHandler({ message: response.message });
        redirectUrl = `?secret=${response.data.secret}&identifier=${identifier}&purpose=${purpose}&redirectUrl=${redirectUrl ?? ""}`;
      } else toastHandler({ message: "Email verified successfully." });
      setIsOpen(false);
      if (redirectUrl) router.push(redirectUrl);
    } catch (error: any) {
      form.setValue("response.errorMessage", error.message);
      toastHandler({ message: error.message, variant: "destructive" });
    } finally {
      form.setValue("response.isLoading", false);
    }
  };

  const handleResendOTP = async () => {
    try {
      form.setValue("sendingOtp", true);
      const response = await requestOtp({ identifier, purpose });
      if (!response.success) throw new Error(response.message);
      toastHandler({ message: "OTP sent successfully" });
    } catch (error: any) {
      form.setValue("response.errorMessage", error.message);
      toastHandler({ message: error.message, variant: "destructive" });
    } finally {
      form.setValue("sendingOtp", false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <Form {...form}>
          <form className="space-y-4">
            <AlertDialogHeader className="relative flex justify-center">
              <AlertDialogTitle className="h2 text-center">
                Enter Your OTP
                <X
                  onClick={() => setIsOpen(false)}
                  className="otp-close-button"
                />
              </AlertDialogTitle>
              <AlertDialogDescription className="subtitle-2 text-center text-light-100">
                We’ve sent a code to{" "}
                <span className="pl-1 text-brand">{identifier}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="shad-otp">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <InputOTPSlot
                            key={idx}
                            index={idx}
                            className="shad-otp-slot"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

            <AlertDialogFooter>
              <div className="flex w-full flex-col gap-4">
                <AlertDialogAction asChild>
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    type="submit"
                    disabled={isLoading || sendingOtp}
                    className="shad-submit-btn h-12"
                  >
                    Submit
                    {isLoading && !sendingOtp && (
                      <Image
                        src="assets/icons/loader.svg"
                        alt="loader"
                        width={24}
                        height={24}
                        className="ml-2 animate-spin"
                      />
                    )}
                  </Button>
                </AlertDialogAction>
                <div className="subtitle-2 text-center text-light-100">
                  Didn’t get a code?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="pl-1 text-brand"
                    onClick={handleResendOTP}
                    disabled={isLoading || sendingOtp}
                  >
                    Resend OTP
                  </Button>
                </div>
              </div>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OtpInput;
