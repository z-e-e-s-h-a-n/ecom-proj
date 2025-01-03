import {
  fetchUserCart,
  fetchUserWishlist,
  getCurrentUser,
  syncCartToServer,
  syncWishlistToServer,
} from "@/lib/actions/user";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const getLocalStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const storedValue = localStorage.getItem(key);
  return storedValue ? (JSON.parse(storedValue) as T) : fallback;
};

export const updateLocalStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Hook: Auth ---
export const useAuth = () => {
  const { data, isLoading } = useQuery<IUser | null>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return { currentUser: data, isLoading };
};

// --- Cart Hook ---
export const useCart = (currentUser: TCurrentUser) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery<ICart | null>({
    queryKey: ["cart"],
    queryFn: fetchUserCart,
    enabled: !!currentUser,
    initialData: getLocalStorage<ICart>("cart", { userId: "", items: [] }),
  });

  const addToCartMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => syncCartToServer({ productId, quantity }),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
      updateLocalStorage("cart", updatedCart);
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (productId: string) =>
      syncCartToServer({ productId, quantity: 0 }),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
      updateLocalStorage("cart", updatedCart);
    },
  });

  return {
    cart: data,
    isLoading,
    refetch,
    addToCart: (productId: string, quantity: number) =>
      addToCartMutation.mutate({ productId, quantity }),
    removeFromCart: (productId: string) =>
      removeFromCartMutation.mutate(productId),
  };
};

// --- Wishlist Hook ---
export const useWishlist = (currentUser: TCurrentUser) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery<IWishlist | null>({
    queryKey: ["wishlist"],
    queryFn: fetchUserWishlist,
    enabled: !!currentUser,
    initialData: getLocalStorage<IWishlist>("wishlist", {
      userId: "",
      items: [],
    }),
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => syncWishlistToServer({ productId }),
    onSuccess: (updatedWishlist) => {
      queryClient.setQueryData(["wishlist"], updatedWishlist);
      updateLocalStorage("wishlist", updatedWishlist);
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) =>
      syncWishlistToServer({ productId, remove: true }),
    onSuccess: (updatedWishlist) => {
      queryClient.setQueryData(["wishlist"], updatedWishlist);
      updateLocalStorage("wishlist", updatedWishlist);
    },
  });

  return {
    wishlist: data,
    isLoading,
    refetch,
    addToWishlist: (productId: string) =>
      addToWishlistMutation.mutate(productId),
    removeFromWishlist: (productId: string) =>
      removeFromWishlistMutation.mutate(productId),
  };
};

// --- Synchronization on Load ---
export const useStorageSync = () => {
  const { currentUser } = useAuth();
  const { cart } = useCart(currentUser);
  const { wishlist } = useWishlist(currentUser);

  useEffect(() => {
    if (cart) updateLocalStorage("cart", cart);
    if (wishlist) updateLocalStorage("wishlist", wishlist);
  }, [cart, wishlist]);
};
