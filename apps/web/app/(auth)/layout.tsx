import Image from "next/image";
import React from "react";
import { Card, CardContent } from "@workspace/ui/components/card";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-center min-h-svh flex-col bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={"flex flex-col gap-6"}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              {children}
              <div className="relative hidden bg-muted md:block">
                <Image
                  src="/assets/icons/placeholder.svg"
                  alt="Image"
                  layout="fill"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
