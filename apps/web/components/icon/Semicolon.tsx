import { cn } from "@workspace/ui/lib/utils";

const Semicolon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      width="4"
      height="16"
      viewBox="0 0 4 16"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-[4px] h-[16px]", className)}
      {...props}
    >
      <circle cx="2" cy="2" r="2" fill="currentColor" />
      <circle cx="2" cy="14" r="2" fill="currentColor" />
    </svg>
  );
};

export default Semicolon;
