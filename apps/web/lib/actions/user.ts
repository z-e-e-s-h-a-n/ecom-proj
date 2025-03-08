import { apiRequest } from "@/config/axios";
import { getLocalStorage } from "../utils";
import { TOrderSchema } from "@workspace/shared/schemas/order";
import { TAddressSchema } from "@workspace/shared/schemas/address";

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

export const updateUserCart = async ({ action, items }: UpdateCartPayload) => {
  if (action === "add") {
    await apiRequest("POST", "/users/cart", { data: items });
  } else if (action === "remove") {
    await apiRequest("DELETE", `/users/cart`, { data: items[0] });
  } else if (action === "update") {
    await apiRequest("PUT", `/users/cart`, { data: items[0] });
  } else {
    throw new Error("Invalid action");
  }
};

export const updateUserWishlist = async ({
  action,
  items,
}: UpdateWishlistPayload) => {
  if (action === "add") {
    await apiRequest("POST", "/users/wishlist", { data: items });
  } else if (action === "remove") {
    await apiRequest("DELETE", "/users/wishlist", { data: items[0] });
  } else {
    throw new Error("Invalid action");
  }
};

export const placeUserOrder = async (data: TOrderSchema) => {
  return await apiRequest("POST", "/users/orders", { data });
};

export const syncUserStorage = async (currentUser: TCurrentUser) => {
  if (!currentUser) return;

  try {
    const localCart = getLocalStorage<ICartItem[]>("cart", []);
    const localWishlist = getLocalStorage<IWishlistItem[]>("wishlist", []);

    if (localCart.length) {
      const items = localCart.map(({ productId, quantity, variantId }) => ({
        productId: productId._id,
        quantity,
        variantId,
      }));
      await updateUserCart({ action: "add", items });
    }

    if (localWishlist.length) {
      const items = localWishlist.map(({ productId, variantId }) => ({
        productId: productId._id,
        variantId,
      }));
      await updateUserWishlist({ action: "add", items });
    }
  } catch (error) {
    console.error("Sync local to server failed:", error);
  }
};

export const AddUserAddress = async (
  data: TAddressSchema
): Promise<IAddress> => {
  const response = await apiRequest("POST", "/users/address", { data });
  if (!response.success) throw new Error(response.message);
  return response.data.address;
};

export const getUserAddresses = async (): Promise<IAddress[]> => {
  const response = await apiRequest("GET", "/users/address");
  return response.data.addresses;
};

export const getUserAddress = async (addressId: string): Promise<IAddress> => {
  const response = await apiRequest("GET", `/users/address/${addressId}`);
  return response.data.address;
};

export const updateUserAddress = async ({
  addressId,
  ...data
}: UpdateAddressPayload) => {
  return await apiRequest("PUT", `/users/address/${addressId}`, { data });
};

export const deleteUserAddress = async (addressId: string) => {
  return await apiRequest("DELETE", `/users/address/${addressId}`);
};
