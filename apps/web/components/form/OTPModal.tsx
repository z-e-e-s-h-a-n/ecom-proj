/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
import { IRequestOtpData, requestOtp, validateOtp } from "@/lib/actions/user";
import { useRouter } from "next/navigation";
import { useToast } from "@workspace/ui/hooks/use-toast";
import Image from "next/image";
import { X } from "lucide-react";
import { IApiResponse } from "@/config/axios";

interface IOtpModalProps extends IRequestOtpData {
  setOtpValidationResponse?: (value: IApiResponse) => void;
  redirectUrl?: string;
}

function OTPModal({
  email,
  purpose,
  redirectUrl = "/",
  setOtpValidationResponse,
}: IOtpModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Handle OTP validation
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await validateOtp({ email, otp, purpose });

      if (response?.success) {
        toast({
          title: "Success",
          description: "Email verified successfully.",
        });
        closeModal();
        handleRedirect(response);
      }
    } catch ({ message }: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsOpen(false);
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    try {
      const response = await requestOtp({ email, purpose });

      if (response?.success) {
        toast({
          title: "Success",
          description: "OTP sent successfully.",
        });
      }
    } catch ({ message }: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  };

  // Handle redirect or return response on success
  const handleRedirect = (response: IApiResponse) => {
    if (setOtpValidationResponse) {
      setOtpValidationResponse(response);
    } else {
      router.push(redirectUrl);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter Your OTP
            <X onClick={closeModal} className="otp-close-button" />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We’ve sent a code to{" "}
            <span className="pl-1 text-brand">{email}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup className="shad-otp">
            {Array.from({ length: 6 }).map((_, idx) => (
              <InputOTPSlot key={idx} index={idx} className="shad-otp-slot" />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
              type="button"
            >
              Submit
              {isLoading && (
                <Image
                  src="assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>
            <div className="subtitle-2 text-center text-light-100">
              Didn’t get a code?{" "}
              <Button
                type="button"
                variant="link"
                className="pl-1 text-brand"
                onClick={handleResendOTP}
              >
                Resend OTP
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OTPModal;
