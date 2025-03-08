import { cn } from "@workspace/ui/lib/utils";
import React from "react";
import LinkButton from "@/components/block/LinkButton";

function SectionFooter({ className, buttonProps }: SectionFooterProps) {
  const { children = "View All Products", ...btnProps } = buttonProps;

  return (
    <div className={cn("flex justify-center", className)}>
      <LinkButton children={children} {...btnProps} />
    </div>
  );
}

export default SectionFooter;
