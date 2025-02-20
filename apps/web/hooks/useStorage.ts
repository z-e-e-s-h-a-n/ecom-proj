import {
  getUserCart,
  getUserWishlist,
  updateUserCart,
  updateUserWishlist,
} from "@/lib/actions/user";
import { getLocalStorage, updateLocalStorage } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import {
  FilteredProductsResponse,
  getProduct,
  getProducts,
} from "@/lib/actions/product";
import { useToast } from "@workspace/ui/hooks/use-toast";

export const useCart = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const updateCartLocal = (updatedCart: ICartItem[]) => {
    updateLocalStorage("cart", updatedCart);
    queryClient.setQueryData(["cart"], updatedCart);
  };

  const syncStorage = async (payload: UpdateCartPayload) => {
    try {
      await updateUserCart(payload);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    } catch (error) {
      console.error("Failed to sync cart to server:", error);
    }
  };

  const { data, isLoading } = useQuery<ICartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (currentUser) {
        const serverCart = await getUserCart();
        updateCartLocal(serverCart);
        return serverCart;
      }
      return getLocalStorage<ICartItem[]>("cart", []);
    },
    enabled: currentUser !== undefined,
    initialData: [],
  });

  const updateCart = (
    action: "add" | "update" | "remove",
    product: IProduct,
    variantId: string,
    quantity = 1
  ) => {
    const localCart = getLocalStorage<ICartItem[]>("cart", []);
    let updatedCart: ICartItem[] = [...localCart];

    const existingIndex = localCart.findIndex(
      (item) =>
        item.productId._id === product._id && item.variantId === variantId
    );

    if (action === "add" && existingIndex === -1) {
      updatedCart.push({ productId: product, quantity, variantId });
    } else if (action === "update" && existingIndex !== -1) {
      updatedCart[existingIndex]!.quantity = quantity;
    } else if (action === "remove" && existingIndex !== -1) {
      updatedCart = updatedCart.filter(
        (item) =>
          item.productId._id !== product._id || item.variantId !== variantId
      );
    }

    updateCartLocal(updatedCart);

    if (currentUser?._id) {
      const items = [{ productId: product._id, quantity, variantId }];
      syncStorage({ action, items });
    }

    toast({
      title: `Product ${action === "add" ? "added to" : "removed from"} cart successfully`,
      description: `${product.name} has been ${action === "add" ? "added to" : "removed from"} your cart.`,
    });
  };

  const isInCart = (product: IProduct, variantId: string) =>
    data?.some(
      (item) =>
        item.productId._id === product._id && item.variantId === variantId
    );

  const toggleCart = (product: IProduct, variantId: string, quantity = 1) =>
    updateCart(
      isInCart(product, variantId) ? "remove" : "add",
      product,
      variantId,
      quantity
    );

  return {
    cart: data || [],
    isLoading,
    isInCart,
    toggleCart,
    updateCart,
  };
};

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const updateWishlistLocal = (updatedWishlist: IWishlistItem[]) => {
    updateLocalStorage("wishlist", updatedWishlist);
    queryClient.setQueryData(["wishlist"], updatedWishlist);
  };

  const syncStorage = async (payload: UpdateWishlistPayload) => {
    try {
      await updateUserWishlist(payload);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    } catch (error) {
      console.error("Failed to sync wishlist to server:", error);
    }
  };

  const { data, isLoading } = useQuery<IWishlistItem[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      if (currentUser) {
        const serverWishlist = await getUserWishlist();
        updateWishlistLocal(serverWishlist);
        return serverWishlist;
      }
      return getLocalStorage<IWishlistItem[]>("wishlist", []);
    },
    enabled: currentUser !== undefined,
    initialData: [],
  });

  const updateWishlist = (
    action: "add" | "remove",
    product: IProduct,
    variantId: string
  ) => {
    const localWishlist = getLocalStorage<IWishlistItem[]>("wishlist", []);
    let updatedWishlist: IWishlistItem[] = [...localWishlist];

    const existingIndex = localWishlist.findIndex(
      (item) =>
        item.productId._id === product._id && item.variantId === variantId
    );

    if (action === "add" && existingIndex === -1) {
      updatedWishlist.push({ productId: product, variantId });
    } else if (action === "remove" && existingIndex !== -1) {
      updatedWishlist = updatedWishlist.filter(
        (item) =>
          item.productId._id !== product._id || item.variantId !== variantId
      );
    }

    updateWishlistLocal(updatedWishlist);

    if (currentUser?._id) {
      const items = [{ productId: product._id, variantId }];
      syncStorage({ action, items });
    }

    toast({
      title: `Product ${action === "add" ? "added to" : "removed from"} wishlist successfully`,
      description: `${product.name} has been ${action === "add" ? "added to" : "removed from"} your wishlist.`,
    });
  };

  const isInWishlist = (product: IProduct, variantId: string) =>
    data?.some(
      (item) =>
        item.productId._id === product._id && item.variantId === variantId
    );

  const toggleWishlist = (product: IProduct, variantId: string) => {
    updateWishlist(
      isInWishlist(product, variantId) ? "remove" : "add",
      product,
      variantId
    );
  };

  return {
    wishlist: data || [],
    isLoading,
    toggleWishlist,
    isInWishlist,
    updateWishlist,
  };
};

export const useProducts = (params?: TSearchParams) => {
  const { data, isLoading, error } = useQuery<FilteredProductsResponse>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    initialData: { products: [], total: 0, page: 1, limit: 12 },
  });

  return { ...data, isLoading, error };
};

export const useProduct = (productId: string) => {
  const { data, isLoading, error } = useQuery<IProduct>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });

  return { product: data, isLoading, error };
};

const useStorage = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { products } = useProducts();

  return { cart, wishlist, products };
};

export default useStorage;
