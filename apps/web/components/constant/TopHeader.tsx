import { ChevronDown } from "lucide-react";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useCurrency } from "@/hooks/useCurrency";

function TopHeader() {
  const { currencyList, currencyInfo, setCurrency } = useCurrency();

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
      <Select onValueChange={setCurrency}>
        <SelectTrigger className="shad-no-focus border-none w-max gap-1">
          <SelectValue placeholder={currencyInfo?.currency} />
        </SelectTrigger>
        <SelectContent>
          {currencyList?.map(({ currency }) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default TopHeader;
