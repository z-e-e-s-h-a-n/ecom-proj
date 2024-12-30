import FeatureCard from "./FeatureCard";
import { cn } from "@workspace/ui/lib/utils";
import SectionHeader from "./SectionHeader";

function FeatureSection({
  items,
  headerProps,
  className,
}: FeatureSectionProps) {
  return (
    <div className={cn("flex flex-col gap-10 pb-8 pt-16", className)}>
      <SectionHeader {...headerProps} />
      <div className="grid grid-cols-4 grid-rows-2 gap-6">
        {items.map((feature, index) => (
          <FeatureCard key={index} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

export default FeatureSection;
