import { LucideIcon } from "lucide-react";

declare global {
  /* Footer */
  interface FooterContentItem {
    title: string;
    items: {
      label: string;
      url: string;
      Icon?: LucideIcon;
      external?: boolean;
    }[];
  }

  /* Categories */
  interface Category {
    label: string;
    url: string;
    Icon?: LucideIcon;
    items?: Category[];
  }
}

export {};
