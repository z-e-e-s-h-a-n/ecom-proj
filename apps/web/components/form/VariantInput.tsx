import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import React from "react";

export interface IVariantInput {
  product: IProduct;
  selectedAttributes: { [key: string]: string };
  handleAttributeChange: (attributeName: string, value: string) => void;
}

function VariantInput({
  product,
  selectedAttributes,
  handleAttributeChange,
}: IVariantInput) {
  return (
    <div className="flex flex-col gap-4">
      {product.attributes.map(({ id: attr, options }) => {
        const { name, type } = attr;

        return (
          <div key={name} className="flex flex-col gap-2">
            <label className="font-medium flex items-center gap-2">
              {name}:
              <span className="text-sm text-muted-foreground font-normal">
                {selectedAttributes[name]}
              </span>
            </label>
            <div className="flex flex-wrap gap-4">
              {type === "color" && (
                <div className="flex gap-2">
                  {options.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedAttributes[name] === color
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleAttributeChange(name, color)}
                    />
                  ))}
                </div>
              )}

              {type === "image" && (
                <div className="flex gap-2">
                  {options.map((img) => (
                    <button
                      key={img}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                        selectedAttributes[name] === img
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                      onClick={() => handleAttributeChange(name, img)}
                    >
                      <Image
                        src={img}
                        alt={img}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {type === "radio" && (
                <div className="flex gap-4">
                  {options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={name}
                        checked={selectedAttributes[name] === option}
                        onChange={() => handleAttributeChange(name, option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {type === "select" && (
                <select
                  className="border rounded-md px-3 py-2"
                  value={selectedAttributes[name] || ""}
                  onChange={(e) => handleAttributeChange(name, e.target.value)}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {type === "button" && (
                <div className="flex gap-2">
                  {options.map((option) => (
                    <Button
                      key={option}
                      size="icon"
                      variant={
                        selectedAttributes[name] === option
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleAttributeChange(name, option)}
                      className="w-max px-2 py-1"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default VariantInput;
