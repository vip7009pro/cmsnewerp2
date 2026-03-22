import type { RootState } from "../store";

export const selectIsLoggedIn = (state: RootState) => state.auth.loginState;
export const selectIsVendorLoggedIn = (state: RootState) => state.auth.vendorLoginState;
export const selectDiemDanhState = (state: RootState) => state.auth.diemdanhstate;
export const selectUserData = (state: RootState) => state.auth.userData;
