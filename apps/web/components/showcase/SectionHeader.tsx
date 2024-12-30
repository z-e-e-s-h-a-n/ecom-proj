import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import CountdownTimer from "./CountdownTimer";
import { CarouselButtons } from "@workspace/ui/components/carousel";
import LinkButton from "@/components/constant/LinkButton";

function SectionHeader({
  useCarousel,
  className,
  countdown,
  title,
  subtitle,
  linkButtonProps,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex-items-end gap-20", className)}>
      <div className="flex flex-col gap-6">
        {subtitle && (
          <span
            className={cn("h5 flex-items-center gap-4", {
              "before:inline-block before:h-10 before:w-5 before:rounded-sm before:bg-primary":
                subtitle.showBefore !== false,
            })}
          >
            {subtitle.text}
          </span>
        )}
        {title && <h2 className="h2 !font-semibold">{title}</h2>}
      </div>
      {countdown && <CountdownTimer {...countdown} />}
      {useCarousel && <CarouselButtons className="ml-auto" />}
      {linkButtonProps && (
        <LinkButton text="View All" className="ml-auto" {...linkButtonProps} />
      )}
    </div>
  );
}
export default SectionHeader;
