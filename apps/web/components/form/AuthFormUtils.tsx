import React from "react";
import CustomInput from "@/components/form/CustomInputV1";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import {
  loginWithApple,
  loginWithGoogle,
  loginWithFacebook,
} from "@/lib/actions/auth";

export const RenderAuthInputs = ({
  type,
  control,
  isAuth,
}: RenderAuthInputs) => {
  return (
    <>
      {type === "sign-up" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomInput
            name="firstName"
            type="text"
            label="First Name"
            placeholder="Your First Name"
            control={control}
          />
          <CustomInput
            name="lastName"
            type="text"
            label="Last Name"
            placeholder="Your Last Name"
            control={control}
          />
        </div>
      )}

      {type !== "set-password" && !isAuth && (
        <CustomInput
          name="identifier"
          type="text"
          label="Email or Phone"
          placeholder="Enter your Email or Phone"
          control={control}
        />
      )}

      {type.includes("password") && isAuth ? (
        <>
          <CustomInput
            name="password"
            type="password"
            label="New Password"
            control={control}
          />
          <CustomInput
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            control={control}
          />
        </>
      ) : (
        !type.includes("password") && (
          <CustomInput
            name="password"
            type="password"
            label="Password"
            placeholder="Minimum 8 characters"
            control={control}
          />
        )
      )}

      {type === "sign-in" && (
        <div className="flex items-center">
          <CustomInput
            name="rememberMe"
            type="checkbox"
            label="Remember Me"
            control={control}
          />
          <Link
            href="/reset-password"
            className="ml-auto min-w-max text-sm underline-offset-2 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      )}
    </>
  );
};

export const AuthFormNavigation = ({ type }: { type: AuthFormType }) => {
  return (
    <div className="text-center text-sm">
      {type === "sign-in"
        ? "Don't have an account?"
        : type === "sign-up"
          ? "Already have an account?"
          : "Back to"}{" "}
      <Link
        href={type === "sign-in" ? "/sign-up" : "/sign-in"}
        className="underline underline-offset-4"
      >
        {type === "sign-in" ? "Sign Up" : "Sign In"}
      </Link>
    </div>
  );
};

export function RenderSocialAuthButton() {
  const providerList = [
    {
      provider: "google",
      action: loginWithGoogle,
    },
    {
      provider: "facebook",
      action: loginWithFacebook,
    },
    {
      provider: "apple",
      action: loginWithApple,
    },
  ];

  return (
    <>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {providerList.map(({ provider, action }) => (
          <Button
            key={provider}
            variant="outline"
            className="w-full"
            type="button"
            onClick={action}
          >
            <Image
              src={`/assets/icons/${provider}.svg`}
              alt={provider}
              width={16}
              height={16}
            />
            <span className="sr-only">Login with {provider} </span>
          </Button>
        ))}
      </div>
    </>
  );
}
