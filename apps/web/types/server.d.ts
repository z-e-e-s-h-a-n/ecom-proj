// --- Types ---
declare global {
  interface IUser {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    isAuth: boolean;
    role: "user" | "admin";
  }

  type TCurrentUser = IUser | null | undefined;

  interface IProduct {
    _id: string;
    name: string;
    desc: string;
    images: string[];
    category: string;
    pricing: {
      [countryCode: string]: { original: number; sale?: number };
    };
    availability: {
      [countryCode: string]: boolean;
    };
    stock: number;
    variants: {
      colors: string[];
      sizes: string[];
      attributes: Record<string, string | number>;
    };
    rating: number;
    reviews: string[];
    isActive: boolean;
    tags: string[];
    specs: Record<string, string | number>;
    brand: string;
    sku: string;
    upc: string;
    material: string;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  }

  interface ICartItem {
    productId: IProduct;
    quantity: number;
  }

  interface ICart {
    userId: string;
    items: ICartItem[];
  }

  interface IWishlistItem {
    productId: IProduct;
  }

  interface IWishlist {
    userId: string;
    items: IWishlistItem[];
  }
}

export {};
