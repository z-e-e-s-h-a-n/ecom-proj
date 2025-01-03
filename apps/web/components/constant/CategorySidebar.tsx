import { categories } from "@/constants/site";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface NestedCategoryList {
  items: Category[];
}

const NestedCategoryList = ({ items }: NestedCategoryList) => {
  return (
    <ul className="scrollbar-hidden absolute left-full top-0 z-10 hidden h-full w-[800px] flex-col gap-8 overflow-y-auto border bg-background p-6 opacity-0 shadow-light group-hover/category-item:flex group-hover/category-item:opacity-100">
      {items.map(({ label, url, items }) => (
        <li key={label} className="flex flex-col gap-4">
          <Link href={url} className="font-semibold">
            {label}
          </Link>

          {items && items.length > 0 && (
            <ul className="ga-x-4 flex w-full flex-wrap gap-2">
              {items.map(({ label, url }) => (
                <Link
                  key={label}
                  href={url}
                  className="w-[calc(25%-16px)] truncate text-sm"
                >
                  {label}
                </Link>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

function CategorySidebar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "body-2 relative max-h-fit w-64 rounded-md border bg-background py-1 shadow-light hover:[&_a]:text-primary",
        className
      )}
    >
      <ul>
        {categories.map(({ label, Icon, items }, index) => {
          return (
            <li key={label} className="group/category-item">
              <Link
                href="#"
                className={cn(
                  "flex-center-between px-5 py-2.5 group-hover/category-item:bg-secondary group-hover/category-item:text-primary [&_svg]:!size-5",
                  {
                    "border-b": index < categories.length - 1,
                  }
                )}
              >
                <div className="flex-items-center max-w-[calc(100%-28px)] gap-2">
                  {Icon && <Icon />}
                  <span className="truncate">{label}</span>
                </div>
                {items && items.length > 0 && <ChevronRight />}
              </Link>
              {items && items.length > 0 && (
                <NestedCategoryList items={items} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CategorySidebar;
