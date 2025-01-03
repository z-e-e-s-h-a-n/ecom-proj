declare global {
  interface IUser {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    isAuth: boolean;
    role: "user" | "admin";
  }

  interface IProduct {
    id: string;
    name: string;
    desc: string;
    images: string[];
    category: mongoose.Types.ObjectId;
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
    reviews: mongoose.Types.ObjectId[];
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
    createdAt: Date;
    updatedAt: Date;
  }
}
export {};
