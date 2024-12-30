import { cn } from "@workspace/ui/lib/utils"; 
import React from "react";

function CountBadge({ count, children, className = "" }: BadgeProps) {
  return (
    <span
      className={cn(
        "flex-center absolute -right-2 -top-2.5 size-4 rounded-full bg-primary p-1 text-xs text-white",
        className,
      )}
    >
      {count}
      {children}
    </span>
  );
}

export default CountBadge;
