import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "../../../api/GlobalInterface";

export const authReducers = {
  changeDiemDanhState: (state: any, action: PayloadAction<boolean>) => {
    state.diemdanhstate = action.payload;
  },
  changeUserData: (state: any, action: PayloadAction<UserData>) => {
    if (action.payload !== undefined) state.userData = action.payload;
  },
  logout: (state: any, action: PayloadAction<boolean>) => {
    state.loginState = action.payload;
  },
  login: (state: any, action: PayloadAction<boolean>) => {
    state.loginState = action.payload;
  },
  vendorLogin: (state: any, action: PayloadAction<boolean>) => {
    state.vendorLoginState = action.payload;
  },
  vendorLogout: (state: any, action: PayloadAction<boolean>) => {
    state.vendorLoginState = action.payload;
  },
};
