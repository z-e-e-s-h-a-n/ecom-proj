import React from "react";
import BannerCard, { BannerCardProps } from "./BannerCard";

export interface BannerCardSection {
  items: BannerCardProps[];
}

function BannerCardSection({ items }: BannerCardSection) {
  return (
    <div className="flex gap-6 ">
      {items.map((data, index) => (
        <BannerCard key={index} {...data} />
      ))}
    </div>
  );
}

export default BannerCardSection;
