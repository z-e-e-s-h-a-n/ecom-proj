import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";

function FeatureCard({
  className,
  index = 0,
  imageUrl,
  title,
  desc,
  url,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        `flex-items-end bg-zinc text-zinc-foreground relative min-h-52 overflow-hidden rounded-lg border dark:bg-secondary dark:text-secondary-foreground`,
        className,
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          className={cn(
            "object-contain",
            index < 2
              ? "translate-y-4 scale-90 object-right-bottom"
              : "scale-75 object-center",
          )}
        />
      </div>

      <div className="relative z-10 flex max-w-64 flex-col justify-end gap-2 p-4">
        <h3 className="h3 !font-medium">{title}</h3>
        <p className="text-sm">{desc}</p>

        <Link href={url} className="subtitle-1 py-2 underline">
          Shop Now
        </Link>
      </div>
    </div>
  );
}

export default FeatureCard;
