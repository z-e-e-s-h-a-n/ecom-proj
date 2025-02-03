// --- Types ---
declare global {
  interface IUser {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    role: "user" | "admin";
  }

  type TCurrentUser = IUser | null | undefined;

  export interface IShipping {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  }

  export interface IVariant extends IShipping {
    _id: string;
    pricing: {
      currency: string;
      symbol: string;
      original: number;
      sale?: number;
    }[];
    sku: string;
    stock: number;
    images: string[];
    attributes: Record<string, string>;
    isActive: boolean;
    isDefault: boolean;
  }

  export interface IReview {
    userId: string;
    productId: string;
    variantId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }

  export type AttrTypes = "color" | "select" | "radio" | "button" | "image";

  export interface IAttribute {
    name: string;
    type: AttrTypes;
    options: string[];
    categories: string[];
  }

  export interface ISpecification {
    name: string;
    options: string[];
    categories: string[];
  }

  export interface IProduct {
    _id: string;
    name: string;
    slug: string;
    highlights?: string[];
    description: string;
    images: string[];
    video?: string;
    tags: string[];
    rating: number;
    category: string;
    variations: IVariant[];
    attributes: {
      id: IAttribute;
      options: string[];
    }[];
    specifications: {
      id: ISpecification;
      value: string | number | boolean;
    }[];
    reviews: IReview[];
    isActive: boolean;
  }

  export interface ICartItem {
    productId: IProduct;
    quantity: number;
    variantId: string;
  }

  export interface IWishlistItem {
    productId: IProduct;
    variantId: string;
  }

  export interface ICurrencyOption {
    currency: string;
    symbol: string;
    multiplier: number;
    isDefault: boolean;
    countries: { name: string; code: string }[];
  }
}

export {};
