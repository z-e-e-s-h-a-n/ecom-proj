import { TShippingSchema } from "@workspace/shared/schemas/product";

// --- Types ---
declare global {
  interface IUser {
    _id: string;
    firstName: string;
    lastName?: string;
    name: string;
    email?: string;
    phone?: string;
    role: UserRole;
    isAuth: boolean;
  }
  export type UserRole = "customer" | "admin";
  export type TCurrentUser = IUser | null | undefined;
  export type TOrderStatus = "pending" | "shipped" | "delivered" | "canceled";
  export type TPaymentMethod = "cod" | "card" | "wallet" | "gPay" | "applePay";
  export type TPaymentStatus = "pending" | "completed" | "failed";
  export type TBillingMethod = "same" | "different";
  export type TShippingMethod = "standard" | "express" | "free";
  export type AttrTypes = "color" | "select" | "radio" | "button" | "image";
  export type OtpPurpose = "verifyEmail" | "resetPassword" | "setPassword";
  export type OtpType = "token" | "otp";
  export interface IAddress {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
    type: "shipping" | "billing";
    label: "home" | "work";
  }

  export interface IOrderItem {
    productId: IProduct;
    variantId: string;
    quantity: number;
    price: number;
  }

  export interface IOrder {
    userId: string;
    items: IOrderItem[];
    totalAmount: number;
    orderStatus: TOrderStatus;
    transactionId?: string;
    metadata: Map<string, any>;
    shipping: { method: TShippingMethod; addressId: IAddress; cost: number };
    billing: { method: TBillingMethod; addressId: IAddress };
    payment: {
      method: TPaymentMethod;
      status: TPaymentStatus;
      currency: string;
      symbol: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }

  export interface IVariant {
    _id: string;
    pricing: {
      currencyId: ICurrencyOption;
      original: number;
      sale?: number;
    }[];
    sku: string;
    stock: number;
    images: string[];
    attributes: Record<string, string>;
    shipping: TShippingSchema;
    isActive: boolean;
    isDefault: boolean;
  }

  export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    desc?: string;
    image?: string;
    parent?: string;
  }

  export interface IReview {
    _id: string;
    userId: string;
    productId: IProduct;
    variantId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }

  export interface IAttribute {
    _id: string;
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
    title: string;
    slug: string;
    highlights?: string[];
    description: string;
    images: string[];
    video?: string;
    tags: string[];
    rating: number;
    category: ICategory;
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
    countries: string[];
    decimalSeparator: string;
    thousandSeparator: string;
  }

  export interface IShippingMethod {
    name: string;
    enabled: boolean;
    description?: string;
    countries: string[];
    methods: {
      name: string;
      type: "flatRate" | "freeShipping";
      taxStatus: "taxable" | "none";
      cost: string;
      categories?: string[];
      require: "none" | "coupon" | "min" | "either";
      calcType: "perClass" | "perOrder";
    }[];
  }
}

export {};
