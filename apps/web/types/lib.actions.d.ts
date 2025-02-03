declare global {
  interface UpdateCartPayload {
    action: "add" | "remove" | "update";
    items: {
      productId: string;
      quantity: number;
      variantId: string;
    }[];
  }

  type UpdateWishlistPayload = {
    action: "add" | "remove";
    items: {
      productId: string;
      variantId: string;
    }[];
  };
}

export {};
