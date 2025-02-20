import { getVariant } from "@/lib/utils";
import usePricing from "./usePricing";
import { useCart, useWishlist } from "./useStorage";

const useStorageUtils = () => {
  const { isInCart, toggleCart, updateCart } = useCart();
  const { isInWishlist, toggleWishlist, updateWishlist } = useWishlist();
  const { formatProductPrice } = usePricing();

  const formatOrderItems = (items: ICartItem[]): PlaceOrderPayload["items"] =>
    items.map(({ productId, quantity, variantId }) => ({
      productId: productId._id,
      variantId,
      quantity,
      price: formatProductPrice(getVariant(productId, variantId).pricing).price,
    }));

  return {
    isInCart,
    toggleCart,
    updateCart,
    isInWishlist,
    toggleWishlist,
    updateWishlist,
    formatOrderItems,
  };
};

export default useStorageUtils;
