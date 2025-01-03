import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import user from "@/store/features/user/userSlice";
import auth from "@/store/features/auth/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { user, auth },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

// `buildCreateSlice` allows us to create a slice with async thunks.

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  AppState,
  unknown,
  Action
>;
