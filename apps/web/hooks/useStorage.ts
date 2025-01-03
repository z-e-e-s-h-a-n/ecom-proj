// hooks/useStorage.ts
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useStore";
import { useUserSelector } from "@/store/features/user/userSelector";
import {
  updateList,
  setCartItemQuantity,
  ListType,
  ItemId,
  CartItem,
  UserState,
} from "@/store/features/user/userSlice";

function useStorage() {
  const dispatch = useAppDispatch();
  const { cart, wishlist } = useUserSelector();

  useEffect(() => {
    const syncedState: Partial<UserState> = { cart, wishlist };
    Object.keys(syncedState).forEach((list) => {
      localStorage.setItem(list, JSON.stringify(syncedState[list as ListType]));
    });
  }, [cart, wishlist]);

  const updateItem = (
    listType: ListType,
    itemId: ItemId,
    operation: "add" | "remove"
  ) => {
    dispatch(updateList({ listType, itemId, operation }));
  };

  const updateCartQuantity = (itemId: ItemId, quantity: number) => {
    dispatch(setCartItemQuantity({ itemId, quantity }));
  };

  const isInStorage = (listType: ListType, id: ItemId) => {
    if (listType === "cart") {
      return cart.some((item) => item.id === id);
    } else if (listType === "wishlist") {
      return wishlist.includes(id);
    } else {
      throw new Error(`Unsupported listType: ${listType}`);
    }
  };

  function getItem(
    listType: ListType,
    id: ItemId
  ): CartItem | ItemId | undefined {
    if (listType === "cart") {
      return cart.find((item) => item.id === id);
    } else if (listType === "wishlist") {
      return wishlist.find((itemId) => itemId === id);
    } else {
      throw new Error(`Unsupported listType: ${listType}`);
    }
  }

  return {
    addItem: (listType: ListType, itemId: ItemId) =>
      updateItem(listType, itemId, "add"),
    removeItem: (listType: ListType, itemId: ItemId) =>
      updateItem(listType, itemId, "remove"),
    updateCartQuantity,
    isInStorage,
    getItem,
  };
}

export default useStorage;
