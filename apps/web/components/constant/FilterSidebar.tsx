import React from "react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Separator } from "@workspace/ui/components/separator";
import { Slider } from "@workspace/ui/components/slider";

function FilterSidebar() {
  const categories = [
    "Mens",
    "Women",
    "Kids",
    "Bags",
    "Belts",
    "Shoes",
    "Accessories",
    "Jackets",
    "Dresses",
    "Sweaters",
  ];

  const colors = [
    { label: "red", items: 10 },
    { label: "blue", items: 15 },
    { label: "green", items: 20 },
    { label: "yellow", items: 5 },
    { label: "orange", items: 12 },
    { label: "purple", items: 8 },
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];

  return (
    <Accordion
      type="multiple"
      className="sticky top-0 w-56 space-y-2 [&>div]:border-none [&>h3]:cursor-pointer [&_button]:hover:no-underline [&_label]:cursor-pointer [&_svg]:text-current"
    >
      <AccordionItem value="1">
        <AccordionTrigger className="subtitle-1">
          Product Categories
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          {categories.map((category, index) => (
            <div className="flex-justify-between" key={category}>
              <label
                htmlFor="terms"
                className="flex-items-center w-full gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Checkbox id="terms" />
                <span> {category}</span>
              </label>
              {index < 2 && <Plus className="size-4 flex-shrink-0" />}
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
      <Separator />
      <AccordionItem value="2">
        <AccordionTrigger className="subtitle-1">
          Filter by price
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <p>Price: $0 - $2000</p>
          <Slider defaultValue={[50]} max={100} step={1} />
        </AccordionContent>
        <div></div>
      </AccordionItem>
      <Separator />
      <AccordionItem value="3">
        <AccordionTrigger className="subtitle-1">
          Filter by Color
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          {colors.map(({ label, items }) => (
            <div
              key={label}
              className="flex-items-center cursor-pointer justify-between"
            >
              <div className="flex-items-center gap-2">
                <span
                  style={{ backgroundColor: label }}
                  className="size-4 rounded"
                />
                <span> {label}</span>
              </div>
              <span>({items})</span>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
      <Separator />
      <AccordionItem value="4">
        <AccordionTrigger className="subtitle-1">
          Filter by Size
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          {sizes.map((size) => (
            <div className="flex-justify-between" key={size}>
              <label
                htmlFor={size}
                className="flex-items-center w-full gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Checkbox id={size} />
                <span> {size}</span>
              </label>
              <span>(10)</span>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default FilterSidebar;
