// store/features/user/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLocalStorage } from "@/lib/utils";

// Shared Types
export type ListType = "cart" | "wishlist";
export type ItemId = string;
export type OperationType = "add" | "remove";

export interface CartItem {
  id: ItemId;
  quantity: number;
}

export type UpdatePayload = {
  listType: ListType;
  itemId: ItemId;
};

export interface UserState {
  cart: CartItem[];
  wishlist: ItemId[];
}

export const initialState: UserState = {
  cart: getLocalStorage("cart", []),
  wishlist: getLocalStorage("wishlist", []),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateList(
      state,
      action: PayloadAction<UpdatePayload & { operation: OperationType }>
    ) {
      const { listType, itemId, operation } = action.payload;

      if (listType === "cart") {
        if (operation === "add") {
          const cart = state.cart as typeof state.cart;
          if (!cart.some((item) => item.id === itemId)) {
            cart.push({ id: itemId, quantity: 1 });
          }
        } else if (operation === "remove") {
          state.cart = state.cart.filter((item) => item.id !== itemId);
        }
      } else if (listType === "wishlist") {
        if (operation === "add") {
          if (!state.wishlist.includes(itemId)) {
            state.wishlist.push(itemId);
          }
        } else if (operation === "remove") {
          state.wishlist = state.wishlist.filter((id) => id !== itemId);
        }
      } else {
        throw new Error(`Unsupported listType: ${listType}`);
      }
    },
    setCartItemQuantity(
      state,
      action: PayloadAction<{ itemId: ItemId; quantity: number }>
    ) {
      const { itemId, quantity } = action.payload;
      const cartItem = state.cart.find((item) => item.id === itemId);
      if (cartItem && quantity > 0) {
        cartItem.quantity = quantity;
      }
    },
  },
});

export const { updateList, setCartItemQuantity } = userSlice.actions;
export default userSlice.reducer;
