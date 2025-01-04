import { apiRequest } from "@/config/axios";

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface RemoveFromCartPayload {
  productId: string;
}

export const getCurrentUser = async (): Promise<TCurrentUser> => {
  try {
    const response = await apiRequest("GET", "/users/me");
    if (!response.success) return null;
    return response.data.user as IUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// API Calls
export const getUserCart = async (): Promise<ICartItems[]> => {
  const response = await apiRequest("GET", `/users/cart`);
  return response.data?.cart?.items || [];
};

export const getUserWishlist = async (): Promise<IWishlistItems[]> => {
  const response = await apiRequest("GET", `/users/wishlist`);
  return response.data?.wishlist?.items || [];
};

export const addToCartServer = async (items: AddToCartPayload[]) => {
  await apiRequest("POST", "/users/cart", { items });
};

export const removeFromCartServer = async (productId: string) => {
  await apiRequest("DELETE", `/users/cart/${productId}`);
};

export const addToWishlistServer = async (items: RemoveFromCartPayload[]) => {
  await apiRequest("POST", "/users/wishlist", { items });
};

export const removeFromWishlistServer = async (productId: string) => {
  await apiRequest("DELETE", `/users/wishlist/${productId}`);
};
