import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "../../api/GlobalInterface";
import { initialTotalState } from "./totalParts/initialTotalState";

export type AuthState = {
  loginState: boolean;
  vendorLoginState: boolean;
  diemdanhstate: boolean;
  userData: UserData;
};

const initialState: AuthState = {
  loginState: initialTotalState.loginState ?? false,
  vendorLoginState: initialTotalState.vendorLoginState ?? false,
  diemdanhstate: initialTotalState.diemdanhstate ?? false,
  userData: initialTotalState.userData!,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginState: (state, action: PayloadAction<boolean>) => {
      state.loginState = action.payload;
    },
    setVendorLoginState: (state, action: PayloadAction<boolean>) => {
      state.vendorLoginState = action.payload;
    },
    setDiemDanhState: (state, action: PayloadAction<boolean>) => {
      state.diemdanhstate = action.payload;
    },
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
  },
});

export const {
  setLoginState,
  setVendorLoginState,
  setDiemDanhState,
  setUserData,
} = authSlice.actions;

export default authSlice.reducer;
