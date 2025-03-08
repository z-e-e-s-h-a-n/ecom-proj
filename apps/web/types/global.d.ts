import { LinkButtonProps } from "@/components/block/LinkButton";
import React from "react";

declare global {
  interface SegmentParams {
    [key: string]: string;
  }

  type TSearchParams = Record<string, string | string[] | undefined>;

  interface PageProps {
    params: Promise<SegmentParams>;
    searchParams: Promise<TSearchParams>;
    children?: React.ReactNode;
  }

  type IconProps = React.SVGProps<SVGSVGElement>;

  interface CountdownTimerProps {
    startDate: string;
    endDate: string;
  }

  interface HeaderProps {
    currentUser?: TCurrentUser;
  }

  interface ShowcaseSectionProps {
    className?: string;
    useCarousel?: boolean;
    headerProps?: SectionHeaderProps;
    footerProps?: SectionFooterProps;
  }

  interface SectionHeaderProps {
    className?: string;
    title?: string;
    subtitle?: {
      text: string;
      showBefore?: boolean;
    };
    countdown?: CountdownData;
    buttonProps?: LinkButtonProps;
    useCarousel?: boolean;
  }

  interface SectionFooterProps {
    className?: string;
    buttonProps: LinkButtonProps;
  }

  interface ProductSectionProps extends ShowcaseSectionProps {
    items: { product: IProduct; variantId?: string }[];
  }

  interface CategorySectionProps extends ShowcaseSectionProps {
    items: ICategory[];
  }

  // types.ts
  export interface IQueryParams extends TSearchParams {
    searchQuery?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    [key: string]: any;
  }

  export interface ProductResponse {
    products: Array<{ product: IProduct }>;
    total: number;
    page: number;
    limit: number;
  }
}

export {};
