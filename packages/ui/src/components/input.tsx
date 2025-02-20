import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Eye, EyeClosed } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const renderInput = () => (
      <input
        type={type === "password" && showPassword ? "text" : type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );

    const EyeButton = showPassword ? Eye : EyeClosed;

    return type === "password" ? (
      <div className="relative flex items-center">
        {renderInput()}

        <EyeButton
          className="absolute right-4 size-4 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>
    ) : (
      renderInput()
    );
  }
);
Input.displayName = "Input";

export { Input };
