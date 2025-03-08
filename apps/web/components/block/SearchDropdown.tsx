import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getVariant } from "@/lib/utils";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@workspace/ui/lib/utils";
import SearchBar from "@/components/form/SearchBar";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useStorage";

const SearchDropdown = ({ className }: { className?: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300).trim();
  const router = useRouter();
  const { products, isProductsLoading } = useProducts({
    limit: "6",
    searchQuery: debouncedQuery,
  });

  return (
    <div className={cn("relative", className)}>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onFocus={() => setIsSearchOpen(true)}
        onBlur={() => setIsSearchOpen(false)}
      />
      {isSearchOpen && !isProductsLoading && debouncedQuery && (
        <ul className="absolute top-10 bg-secondary p-4 rounded w-[220px] z-10 grid gap-4">
          {products.length > 0 ? (
            products.map(({ product }) => {
              const variant = getVariant(product);
              return (
                <Link
                  key={product._id}
                  href={`/products/${product._id}?variant=${variant._id}`}
                  className="flex items-center gap-2"
                  onMouseDown={() => {
                    setSearchQuery("");
                    router.push(
                      `/products/${product._id}?variant=${variant._id}`
                    );
                  }}
                >
                  <Image
                    src={variant.images[0]!}
                    alt={product.title}
                    width={40}
                    height={40}
                    className="size-12 aspect-square rounded"
                  />
                  <span className="text-sm truncate">{product.title}</span>
                </Link>
              );
            })
          ) : (
            <li className="text-sm text-muted-foreground">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdown;
