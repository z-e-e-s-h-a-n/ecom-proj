import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getCurrentUser } from "@/lib/actions/user";

export interface AuthState {
  currentUser: IUser | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  isLoading: false,
};

// Async thunk to fetch the current user
export const fetchCurrentUser = createAsyncThunk("auth/fetchUser", async () => {
  return await getCurrentUser();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.currentUser = action.payload;
    },

    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearUser, setUser } = authSlice.actions;
export default authSlice.reducer;
