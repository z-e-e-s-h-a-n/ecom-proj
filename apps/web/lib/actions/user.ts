import { apiRequest } from "@/config/axios";

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

export const getUserCart = async (): Promise<ICartItem[]> => {
  const response = await apiRequest("GET", `/users/cart`);
  return (response.data?.cart?.items || []) as ICartItem[];
};

export const getUserWishlist = async (): Promise<IWishlistItem[]> => {
  const response = await apiRequest("GET", `/users/wishlist`);
  return (response.data?.wishlist?.items || []) as IWishlistItem[];
};

export const updateUserCart = async ({
  action,
  payload,
}: UpdateCartPayload) => {
  if (action === "add") {
    await apiRequest("POST", "/users/cart", { items: payload });
  } else if (action === "remove") {
    await apiRequest("DELETE", `/users/cart`, payload[0]);
  } else if (action === "update") {
    await apiRequest("PUT", `/users/cart`, payload[0]);
  } else {
    throw new Error("Invalid action");
  }
};

export const updateUserWishlist = async ({
  action,
  payload,
}: UpdateWishlistPayload) => {
  if (action === "add") {
    await apiRequest("POST", "/users/wishlist", { items: payload });
  } else if (action === "remove") {
    await apiRequest("DELETE", "/users/wishlist", payload[0]);
    console.log("wishlist payload", payload);
  } else {
    throw new Error("Invalid action");
  }
};
