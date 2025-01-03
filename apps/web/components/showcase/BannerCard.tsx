import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";

export interface BannerCardProps {
  title: string;
  subtitle: string;
  btnText: string;
  url: string;
  imageUrl: string;
}

function BannerCard({
  imageUrl,
  title,
  subtitle,
  btnText,
  url,
}: BannerCardProps) {
  return (
    <Link href={url} className={cn("flex-items-center relative flex-1 h-44")}>
      <Image src={imageUrl} alt="" layout="fill" />
      <div className="p-4 z-10 text-white  gap-6 flex flex-col">
        <div className="flex subtitle-1 flex-col">
          <span>{subtitle}</span>
          <span>{title}</span>
        </div>
        <button className="capitalize border-white border-b-2 w-max">
          {btnText}
        </button>
      </div>
    </Link>
  );
}

export default BannerCard;
