import { ChevronDown } from "lucide-react";
import Link from "next/link";

function TopHeader() {
  return (
    <div className="body-2 flex-center-between bg-zinc text-zinc-foreground container py-3 dark:bg-secondary dark:text-secondary-foreground">
      <div />
      <div className="flex-center gap-2">
        <p>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
        </p>
        <Link href="/shop" className="font-semibold underline">
          Shop Now
        </Link>
      </div>
      <div className="flex-items-center gap-1">
        <span>English</span>
        <ChevronDown className="size-5" />
      </div>
    </div>
  );
}

export default TopHeader;
