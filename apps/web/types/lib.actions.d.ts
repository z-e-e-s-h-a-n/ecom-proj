declare global {
  interface UpdateCartPayload {
    action: "add" | "remove" | "update";
    payload: {
      productId: string;
      quantity: number;
      variantId: string;
    }[];
  }

  type UpdateWishlistPayload = {
    action: "add" | "remove";
    payload: {
      productId: string;
      variantId: string;
    }[];
  };
}

export {};
