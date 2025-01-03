import { apiRequest } from "@/config/axios";

type ActionType = "add" | "remove";
interface syncDBPayload {
  items?: AddToCartPayload[];
  productIds?: string[];
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export const getCurrentUser = async () => {
  try {
    const response = await apiRequest("GET", "/users/me");
    console.log("response response response response response", response);

    if (!response.success) return null;
    return response.data.user as IUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const fetchUserCart = async () => {
  const response = await apiRequest("GET", `/users/cart`);
  return response.data.cart;
};

export const fetchUserWishlist = async () => {
  const response = await apiRequest("GET", `/users/wishlist`);
  return response.data.wishlist;
};

export const syncCartToServer = async (
  action: ActionType,
  payload: syncDBPayload
) => {
  const response = await apiRequest(
    action === "add" ? "POST" : "DELETE",
    "/users/cart",
    payload
  );
  return response.data.cart;
};

export const syncWishlistToServer = async (
  action: ActionType,
  payload: syncDBPayload
) => {
  const response = await apiRequest(
    action === "add" ? "POST" : "DELETE",
    "/users/wishlist",
    payload
  );
  return response.data.wishlist;
};
