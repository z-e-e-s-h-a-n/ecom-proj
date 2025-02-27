/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Button } from "@workspace/ui/components/button";
import { Form, FormMessage } from "@workspace/ui/components/form";
import {
  AuthFormNavigation,
  RenderAuthInputs,
  RenderSocialAuthButton,
} from "@/components/form/AuthFormUtils";
import OTPModal from "@/components/form/OtpInput";
import {
  signupSchema,
  signinSchema,
  resetPasswordSchema,
  type TSignUpSchema,
  type TSignInSchema,
  type TResetPassSchema,
} from "@/schemas/form";
import {
  registerUser,
  loginUser,
  requestOtp,
  resetPassword,
  validateOtp,
} from "@/lib/actions/auth";

const formatAuthType = (type: string): string => {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatOtpPurpose = (type: AuthFormType): OtpPurpose => {
  return (
    type.includes("reset")
      ? type
          .split("-")
          .map((word, index) =>
            index === 0
              ? word.toLowerCase()
              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join("")
      : "verifyEmail"
  ) as OtpPurpose;
};

const getSchema = (type: string) => {
  return type === "sign-up"
    ? signupSchema
    : type === "sign-in"
      ? signinSchema
      : resetPasswordSchema;
};

const AuthForm = ({ params, searchParams }: PageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { toastHandler } = useToast();
  const [isOtpModelOpen, setIsOtpModelOpen] = useState(false);

  const type = React.use(params)?.type as AuthFormType;
  const formType = useMemo(() => formatAuthType(type), [type]);
  const schema = useMemo(() => getSchema(type), [type]);

  let identifier = React.use(searchParams)?.identifier as string;
  let purpose = React.use(searchParams)?.purpose as OtpPurpose;
  if (!purpose) purpose = formatOtpPurpose(type);
  let redirectUrl = React.use(searchParams)?.redirectUrl as string;
  const redirectQuery = redirectUrl ? `?redirectUrl=${redirectUrl}` : "";
  const queryPath = `${pathname}${redirectQuery}`;
  const secret = React.use(searchParams)?.secret as string;

  const form = useForm<TSignUpSchema | TSignInSchema | TResetPassSchema>({
    resolver: zodResolver(schema as any),
    defaultValues: { identifier, isAuth: false },
  });

  const { isLoading, errorMessage } = form.watch("response") ?? {};

  const isAuth = form.watch("isAuth");
  if (!identifier) identifier = form.watch("identifier");

  useEffect(() => {
    if (identifier) form.setValue("identifier", identifier);
    if (secret && identifier) {
      validateOtp({
        identifier,
        secret,
        purpose,
        type: "token",
        verifyOnly: true,
      })
        .then((response) => {
          if (response.success) form.setValue("isAuth", true);
          else router.push(queryPath);
        })
        .catch(() => {});
    } else if (isAuth) {
      form.reset();
    }
  }, [identifier, secret]);

  const handleAuthAction = async (values: any) => {
    try {
      form.setValue("response.isLoading", true);
      let response;
      if (type === "sign-up") {
        response = await registerUser(values);
        if (!response.success) throw new Error(response.message);
        if (!redirectUrl) redirectUrl = "/";
        setIsOtpModelOpen(true);
      } else if (type === "sign-in") {
        response = await loginUser(values);
        if (!response.success) {
          if (response?.data?.user?.isAuth === false) setIsOtpModelOpen(true);
          throw new Error(response.message);
        }
        if (!redirectUrl) redirectUrl = "/";
        router.push(redirectUrl);
      } else {
        if (isAuth && values.password) {
          response = await resetPassword({ ...values, secret, purpose });
          if (!response.success) {
            router.push(queryPath);
            throw new Error(response.message);
          }
          router.push(`/sign-in${redirectQuery}`);
        } else if (!secret) {
          response = await requestOtp({
            identifier: values.identifier,
            purpose,
          });
          if (!response.success) throw new Error(response.message);
          setIsOtpModelOpen(true);
        }
      }
      toastHandler({ message: response!.message });
    } catch (error: any) {
      form.setValue("response.errorMessage", error.message);
      toastHandler({ message: error.message, variant: "destructive" });
    } finally {
      form.setValue("response.isLoading", false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAuthAction)}
          className="p-6 md:p-8"
        >
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{formType}</h1>
              <p className="text-muted-foreground">
                {type === "sign-up"
                  ? "Fill out the fields to create an account."
                  : type === "sign-in"
                    ? "Login to your account."
                    : `Enter your email to ${formType}.`}
              </p>
            </div>

            <RenderAuthInputs
              type={type}
              control={form.control}
              isAuth={isAuth}
              redirectQuery={redirectQuery}
            />
            {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full capitalize"
            >
              {isLoading ? "Loading..." : formType}
            </Button>

            {type !== "reset-password" && type !== "set-password" && (
              <RenderSocialAuthButton redirectQuery={redirectQuery} />
            )}
            <AuthFormNavigation type={type} redirectQuery={redirectQuery} />
          </div>
        </form>
      </Form>

      {isOtpModelOpen && (
        <OTPModal
          identifier={form.getValues("identifier")}
          purpose={purpose}
          isOpen={isOtpModelOpen}
          setIsOpen={setIsOtpModelOpen}
          redirectUrl={redirectUrl}
        />
      )}
    </>
  );
};

export default AuthForm;
