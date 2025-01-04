"use client";
import {
  getUserCart,
  getUserWishlist,
  addToCartServer,
  removeFromCartServer,
  addToWishlistServer,
  removeFromWishlistServer,
  AddToCartPayload,
  RemoveFromCartPayload,
} from "@/lib/actions/user";
import {
  calculateCartPrice,
  getLocalStorage,
  updateLocalStorage,
} from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { getProduct, getProducts } from "@/lib/actions/product";

// --- Cart & Wishlist Handlers ---
export const useCart = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const { data, isLoading } = useQuery<ICartItems[]>({
    queryKey: ["cart"],
    queryFn: getUserCart,
    enabled: !!currentUser,
    initialData: getLocalStorage<ICartItems[]>("cart", []),
  });

  const addToCartMutation = useMutation({
    mutationFn: (items: AddToCartPayload[]) => addToCartServer(items),
    onSuccess: () => {
      if (currentUser) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (productId: string) => removeFromCartServer(productId),
    onSuccess: () => {
      if (currentUser) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });

  const addToCart = (product: IProduct, quantity: number) => {
    const localCart = getLocalStorage<ICartItems[]>("cart", []);
    const updatedCart = [...localCart, { productId: product, quantity }];

    updateLocalStorage("cart", updatedCart);
    queryClient.setQueryData(["cart"], updatedCart);

    if (currentUser) {
      addToCartMutation.mutate([{ productId: product._id, quantity }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const localCart = getLocalStorage<ICartItems[]>("cart", []);
    const updatedCart = localCart.filter(
      (item) => item.productId._id !== productId
    );

    updateLocalStorage("cart", updatedCart);
    queryClient.setQueryData(["cart"], updatedCart);

    if (currentUser) {
      removeFromCartMutation.mutate(productId);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const localCart = getLocalStorage<ICartItems[]>("cart", []);
    const updatedCart = localCart.map((item) =>
      item.productId._id === productId ? { ...item, quantity } : item
    );

    updateLocalStorage("cart", updatedCart);
    queryClient.setQueryData(["cart"], updatedCart);

    if (currentUser) {
      addToCartMutation.mutate([{ productId, quantity }]);
    }
  };

  const isInCart = (id: string) =>
    data.some(({ productId }) => productId._id === id);

  const cartSubTotal = data.reduce(
    (sum, item) =>
      sum +
      calculateCartPrice(
        item.productId.pricing["US"]?.original || 0,
        item.quantity
      ),
    0
  );

  return {
    cart: data,
    isInCart,
    cartSubTotal,
    isLoading,
    addToCart,
    removeFromCart,
    updateCartQuantity,
  };
};

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const { data, isLoading } = useQuery<IWishlistItems[]>({
    queryKey: ["wishlist"],
    queryFn: getUserWishlist,
    enabled: !!currentUser,
    initialData: getLocalStorage<IWishlistItems[]>("wishlist", []),
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (items: RemoveFromCartPayload[]) => addToWishlistServer(items),
    onSuccess: () => {
      if (currentUser) {
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      }
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) => removeFromWishlistServer(productId),
    onSuccess: () => {
      if (currentUser) {
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      }
    },
  });

  const addToWishlist = (product: IProduct) => {
    const localWishlist = getLocalStorage<IWishlistItems[]>("wishlist", []);
    const updatedWishlist = [...localWishlist, { productId: product }];

    updateLocalStorage("wishlist", updatedWishlist);
    queryClient.setQueryData(["wishlist"], updatedWishlist);

    if (currentUser) {
      addToWishlistMutation.mutate([{ productId: product._id }]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    const localWishlist = getLocalStorage<IWishlistItems[]>("wishlist", []);
    const updatedWishlist = localWishlist.filter(
      (item) => item.productId._id !== productId
    );

    updateLocalStorage("wishlist", updatedWishlist);
    queryClient.setQueryData(["wishlist"], updatedWishlist);

    if (currentUser) {
      removeFromWishlistMutation.mutate(productId);
    }
  };

  const isInWishlist = (id: string) =>
    data.some(({ productId }) => productId._id === id);

  return {
    wishlist: data,
    isInWishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
  };
};

// --- Products Hook ---
export const useProducts = () => {
  const { data, isLoading, error } = useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: getProducts,
    initialData: [],
  });

  return { products: data, isLoading, error };
};

// Single Product Hook for product detail
export const useProduct = (productId: string) => {
  const { data, isLoading, error } = useQuery<IProduct>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });

  return { product: data, isLoading, error };
};

// --- Sync Local Storage to Server ---
export const syncLocalToServer = async (currentUser: TCurrentUser) => {
  if (!currentUser) return;

  const localCart = getLocalStorage<ICartItems[]>("cart", []);
  const localWishlist = getLocalStorage<IWishlistItems[]>("wishlist", []);

  // Sync only if local data exists
  if (localCart.length > 0) {
    const cartPayload = localCart.map(({ productId, quantity }) => ({
      productId: productId._id,
      quantity,
    }));
    await addToCartServer(cartPayload);
    updateLocalStorage("cart", []);
  }

  if (localWishlist.length > 0) {
    const wishlistPayload = localWishlist.map(({ productId }) => ({
      productId: productId._id,
    }));
    await addToWishlistServer(wishlistPayload);
    updateLocalStorage("wishlist", []);
  }
};

// Combined Storage Hook (Cart, Wishlist, Products)
const useStorage = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { products } = useProducts();

  return { cart, wishlist, products };
};

export default useStorage;
