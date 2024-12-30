import React from "react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";  

function LinkButton({
  text,
  href,
  children,
  className,
  ...buttonProps
}: LinkButtonProps) {
  return (
    <Button {...buttonProps} className={cn("w-max capitalize", className)}>
      <Link href={href}>
        {children}
        {text}
      </Link>
    </Button>
  );
}

export default LinkButton;
