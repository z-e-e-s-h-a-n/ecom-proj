import { apiRequest } from "@/config/axios";

export interface ICartPayloadServer {
  productId: string;
  quantity: number;
}

export interface IWishlistPayloadServer {
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

export const addToCartServer = async (items: ICartPayloadServer[]) => {
  await apiRequest("POST", "/users/cart", { items });
};

export const updateCartItemServer = async (item: ICartPayloadServer) => {
  await apiRequest("PUT", `/users/cart`, { ...item });
};

export const removeFromCartServer = async (productId: string) => {
  await apiRequest("DELETE", `/users/cart/${productId}`);
};

export const addToWishlistServer = async (items: IWishlistPayloadServer[]) => {
  await apiRequest("POST", "/users/wishlist", { items });
};

export const removeFromWishlistServer = async (productId: string) => {
  await apiRequest("DELETE", `/users/wishlist/${productId}`);
};
