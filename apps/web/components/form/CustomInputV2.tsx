import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { cn } from "@workspace/ui/lib/utils";

function CustomInput({
  name,
  label,
  type = "text",
  control,
  readOnly,
  disabled,
  className,
}: CustomInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          {type === "checkbox" ? (
            /** Checkbox Layout **/
            <div className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              {label && (
                <FormLabel className="cursor-pointer font-normal">
                  {label}
                </FormLabel>
              )}
            </div>
          ) : (
            /** Border Label with Smooth Transitions **/
            <div className="relative w-full">
              <FormControl>
                <Input
                  {...field}
                  type={type}
                  readOnly={readOnly}
                  disabled={disabled}
                  className="peer w-full rounded-md p-4 min-h-12 transition-all duration-200 ease-in-out"
                />
              </FormControl>
              <FormLabel
                className={cn(
                  "absolute text-muted-foreground left-3 cursor-text -translate-y-1/2 bg-background px-1 text-sm font-normal transition-all duration-200 ease-in-out peer-placeholder-shown:pointer-events-none top-1/2 peer-focus:top-0 peer-focus:text-xs peer-focus:cursor-default peer-focus:text-foreground",
                  field.value && "top-0 text-xs cursor-default text-foreground"
                )}
              >
                {label}
              </FormLabel>
            </div>
          )}
          <FormMessage className="mt-1 text-xs" />
        </FormItem>
      )}
    />
  );
}

export default CustomInput;
