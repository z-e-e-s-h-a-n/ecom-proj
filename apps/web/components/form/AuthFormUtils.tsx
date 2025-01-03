import React from "react";
import CustomInput from "@/components/form/CustomInput";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import {
  loginWithApple,
  loginWithGoogle,
  loginWithFacebook,
} from "@/lib/actions/user";

export const RenderAuthInputs = ({ type, control }: RenderAuthInputs) => {
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

      <CustomInput
        name="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        control={control}
      />

      {type !== "reset-password" && (
        <CustomInput
          name="password"
          type="password"
          label="Password"
          placeholder="Minimum 8 characters"
          control={control}
        />
      )}
    </>
  );
};

export const AuthFormNavigation = ({ type }: AuthFormType) => {
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
