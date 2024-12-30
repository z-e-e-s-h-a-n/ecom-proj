import { cn } from "@workspace/ui/lib/utils";
import React from "react";
import LinkButton from "../constant/LinkButton";

function SectionFooter({ className, linkButtonProps }: SectionFooterProps) {
  return (
    <div className={cn("flex-justify-center", className)}>
      <LinkButton text="View All Products" {...linkButtonProps} />
    </div>
  );
}

export default SectionFooter;
