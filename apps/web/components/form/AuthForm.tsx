"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import CustomInput from "@/components/form/CustomInput";
import { getAuthSchema } from "@/schemas/authForm";
 
function AuthForm({ type }: AuthFormType) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = getAuthSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      console.log(values);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderText = () => {
    switch (type) {
      case "sign-in":
        return {
          title: "Welcome Back",
          description: "Login to your Acme Inc account",
        };
      case "sign-up":
        return {
          title: "Create an Account",
          description: "Fill out the fields to create an account.",
        };
      case "reset-password":
        return {
          title: "Forget Password",
          description:
            "Please enter your email address to reset your password.",
        };
      default:
        return { title: "", description: "" };
    }
  };

  const { title, description } = getHeaderText();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex-items-center flex-col text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-balance text-muted-foreground">{description}</p>
          </div>

          {type === "sign-up" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                name="firstName"
                type="text"
                label="First Name"
                placeholder="Your First Name"
                control={form.control}
              />
              <CustomInput
                name="lastName"
                type="text"
                label="Last Name"
                placeholder="Your Last Name"
                control={form.control}
              />
            </div>
          )}

          <CustomInput
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            control={form.control}
          />

          {type !== "reset-password" && (
            <>
              <CustomInput
                name="password"
                type="password"
                label="Password"
                placeholder="Minimum 8 characters"
                control={form.control}
              />

              {type === "sign-in" && (
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
              )}
            </>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full capitalize"
          >
            {isLoading ? (
              <Image
                src="/assets/icons/loader.svg"
                alt="Loading..."
                width={24}
                height={24}
              />
            ) : (
              type.split("-").join(" ")
            )}
          </Button>

          {errorMessage && (
            <p className="text-red-500 mt-2 text-sm" role="alert">
              *{errorMessage}
            </p>
          )}

          {type !== "reset-password" && (
            <>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <SocialButton provider="apple" type={type} />
                <SocialButton provider="google" type={type} />
                <SocialButton provider="facebook" type={type} />
              </div>
            </>
          )}

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
        </div>
      </form>
    </Form>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SocialButton({ provider, type }: { provider: string; type: string }) {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() =>{
          // TODO: Implement OAuth authentication for the social provider
  }
      }
    >
      <Image
        src={`/assets/icons/${provider}.svg`}
        alt={provider}
        width={16}
        height={16}
      />
      <span className="sr-only">Login with {provider} </span>
      {/* {type === "sign-in" ? `Sign in` : `Sign up`} with {provider} */}
    </Button>
  );
}

export default AuthForm;
