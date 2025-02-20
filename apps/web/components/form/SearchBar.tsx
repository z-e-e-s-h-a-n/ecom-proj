import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Search } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

export interface ISearchBarProps {
  className?: string;
  value?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchBar = ({
  className,
  value = "",
  onChange,
  onFocus,
  onBlur,
}: ISearchBarProps) => {
  return (
    <div className={cn("relative flex items-center w-[220px]", className)}>
      <Input
        className="w-full"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <Button
        variant="simple"
        size="icon"
        className="absolute right-1 rounded-full"
      >
        <Search />
      </Button>
    </div>
  );
};

export default SearchBar;
