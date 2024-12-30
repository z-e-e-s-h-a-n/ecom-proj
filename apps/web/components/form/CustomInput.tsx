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
  type,
  placeholder,
  control,
}: CustomInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <div
            className={cn("grid gap-2", {
              "flex-items-center flex-row-reverse gap-2": type === "checkbox",
            })}
          >
            <FormLabel className="shad-form-label">{label}</FormLabel>
            <FormControl>
              {type === "checkbox" ? (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              ) : (
                <Input placeholder={placeholder} type={type} {...field} />
              )}
            </FormControl>
          </div>
          <FormMessage className="shad-form-message" />
        </FormItem>
      )}
    />
  );
}

export default CustomInput;
