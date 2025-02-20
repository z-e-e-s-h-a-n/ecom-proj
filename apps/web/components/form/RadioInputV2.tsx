import { FormField } from "@workspace/ui/components/form";
import { cn } from "@workspace/ui/lib/utils";

const RadioInput = ({
  className,
  title,
  options,
  name,
  control,
}: RadioInputProps) => {
  const hasSingleOption = options.length === 1;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <fieldset className={cn("space-y-4", className)}>
          {title && <legend>{title}</legend>}
          <ul>
            {options.map(
              ({ label, labelContent, extraContent, option }, index) => {
                const isSelected = field.value === option;
                const isLast = index === options.length - 1;
                const hasExtra = Boolean(extraContent);

                const containerClasses = cn(
                  "p-[14px] border flex items-center justify-between cursor-pointer gap-3 transition-all duration-300 ease-in-out",
                  isSelected
                    ? "bg-muted border-muted-foreground"
                    : "border-border",
                  hasSingleOption
                    ? "rounded"
                    : isLast && hasExtra && !isSelected
                      ? "rounded-b-md"
                      : isLast && !hasExtra && "rounded-b-md",
                  index === 0 && "rounded-t-md"
                );

                const labelClasses = cn(
                  "cursor-pointer flex items-center gap-3",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                );

                return (
                  <li key={label} className="grid">
                    <div
                      className={containerClasses}
                      onClick={() => field.onChange(option)}
                    >
                      <div className={labelClasses}>
                        {!hasSingleOption && (
                          <span
                            className={cn(
                              "relative size-5 flex-center border before:rounded-full rounded-full transition-all duration-300 ease-in-out transform",
                              "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary",
                              isSelected
                                ? "bg-primary before:size-2 before:bg-white scale-110"
                                : "bg-background before:size-full"
                            )}
                          />
                        )}
                        <span>{label}</span>
                      </div>

                      {labelContent && <span>{labelContent}</span>}
                    </div>

                    {hasExtra && (
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300 ease-in-out",
                          isSelected
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        )}
                        aria-hidden={!isSelected}
                      >
                        <div
                          className={cn(
                            "border border-t-0 p-[14px]",
                            isLast && "rounded-b-md"
                          )}
                        >
                          {extraContent}
                        </div>
                      </div>
                    )}
                  </li>
                );
              }
            )}
          </ul>
        </fieldset>
      )}
    />
  );
};

export default RadioInput;
