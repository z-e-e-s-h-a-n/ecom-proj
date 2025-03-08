import { TAddressSchema } from "@workspace/shared/schemas/address";

declare global {
  interface UpdateCartPayload {
    action: "add" | "remove" | "update";
    items: (Omit<ICartItem, "productId"> & { productId: string })[];
  }

  type UpdateWishlistPayload = {
    action: "add" | "remove";
    items: (Omit<IWishlistItem, "productId"> & { productId: string })[];
  };

  interface UpdateAddressPayload extends TAddressSchema {
    addressId: string;
  }

  interface FilteredProductsResponse {
    products: { product: IProduct }[];
    total: number;
    page: number;
    limit: number;
  }
}

export {};
