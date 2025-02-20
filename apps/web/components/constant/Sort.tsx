// Sort.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { sortTypes } from "@/constants/site";

interface SortProps {
  value: string;
  onChange: (updates: IQueryParams) => void;
}

function Sort({ value, onChange }: SortProps) {
  const handleSort = (selectedValue: string) => {
    onChange({ sort: selectedValue });
  };

  return (
    <Select value={value} onValueChange={handleSort}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0]?.label} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map(({ label, value }) => (
          <SelectItem key={value} value={value} className="shad-select-item">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default Sort;
