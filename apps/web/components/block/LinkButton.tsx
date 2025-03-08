import React from "react";
import { Button, ButtonProps } from "@workspace/ui/components/button";
import Link from "next/link";

export interface LinkButtonProps extends ButtonProps {
  href: string;
}

function LinkButton({ href, children, ...buttonProps }: LinkButtonProps) {
  return (
    <Link href={href}>
      <Button {...buttonProps}>{children}</Button>
    </Link>
  );
}

export default LinkButton;
