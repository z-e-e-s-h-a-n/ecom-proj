import React from "react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Slider } from "@workspace/ui/components/slider";
import useCategories from "@/hooks/useCategories";
import useAttributes from "@/hooks/useAttributes";

interface FilterSidebarProps {
  filters?: IQueryParams;
  onChange: (updates: IQueryParams) => void;
}

function FilterSidebar({ filters = {}, onChange }: FilterSidebarProps) {
  const selectedCategories = filters.categories;
  const minPrice = filters.minPrice || 0;
  const maxPrice = filters.maxPrice || Infinity;

  const { categories } = useCategories();
  const { attributes } = useAttributes(selectedCategories);

  const handleFilterUpdate = (key: string, value: string) => {
    const currentValue = filters[key] ?? [value];
    const updatedValues = currentValue.includes(value)
      ? currentValue.filter((v: string) => v !== value)
      : [...currentValue, value];

    onChange({ [key]: updatedValues });
  };

  return (
    <Accordion
      type="multiple"
      className="sticky top-0 w-56 space-y-2"
      defaultValue={["categories", "price"]}
    >
      {/* Category Filter */}
      <AccordionItem value="categories">
        <AccordionTrigger className="subtitle-1 !no-underline">
          Product Categories
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          {categories.map(({ _id, name, parent }) => {
            const isSelected = selectedCategories?.includes(_id);
            return (
              <div className="flex-justify-between" key={_id}>
                <label
                  className="flex-items-center w-full gap-2 text-sm font-medium cursor-pointer"
                  htmlFor={_id}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() =>
                      handleFilterUpdate("categories", _id)
                    }
                    id={_id}
                  />
                  <span>{name}</span>
                </label>
                {parent && <Plus className="size-4 flex-shrink-0" />}
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>

      {/* Price Filter */}
      <AccordionItem value="price">
        <AccordionTrigger className="subtitle-1 !no-underline">
          Filter by price
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <Slider
            value={[minPrice, maxPrice]}
            max={2000}
            step={1}
            onValueChange={([minPrice, maxPrice]) =>
              onChange({ minPrice, maxPrice })
            }
          />
          <p>
            Price: ${minPrice} - {maxPrice}
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* Attribute Filters */}
      {attributes.map(({ _id, name, options, type }) => (
        <React.Fragment key={_id}>
          <AccordionItem value={name}>
            <AccordionTrigger className="subtitle-1 !no-underline">
              Filter by {name}
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {options.map((option) => {
                const isSelected = filters[`attr_${_id}`]?.includes(option);
                return (
                  <div
                    key={option}
                    className="flex-items-center cursor-pointer justify-between"
                    onClick={() => handleFilterUpdate(`attr_${_id}`, option)}
                  >
                    {type === "color" ? (
                      <div className="flex-items-center gap-2">
                        <span
                          style={{ backgroundColor: option }}
                          className="size-4 rounded"
                        />
                        <span>{option}</span>
                      </div>
                    ) : (
                      <label className="flex-items-center w-full gap-2">
                        <Checkbox checked={isSelected} />
                        <span>{option}</span>
                      </label>
                    )}
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </React.Fragment>
      ))}
    </Accordion>
  );
}

export default FilterSidebar;
