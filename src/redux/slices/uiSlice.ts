import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { initialTotalState } from "./totalParts/initialTotalState";

export type UiState = {
  lang: string;
  sidebarmenu: boolean;
  lag_mode: boolean;
  theme: any;
  ctr_cd: string;
  server_ip: string;
  selectedServer: string;
  company: string;
  cpnInfo: any;
};

const initialState: UiState = {
  lang: initialTotalState.lang ?? "vi",
  sidebarmenu: initialTotalState.sidebarmenu ?? false,
  lag_mode: initialTotalState.lag_mode ?? false,
  theme: initialTotalState.theme,
  ctr_cd: initialTotalState.ctr_cd,
  server_ip: initialTotalState.server_ip,
  selectedServer: initialTotalState.selectedServer,
  company: initialTotalState.company,
  cpnInfo: initialTotalState.cpnInfo,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLagMode: (state, action: PayloadAction<boolean>) => {
      state.lag_mode = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarmenu = !state.sidebarmenu;
    },
    hideSidebar: (state) => {
      state.sidebarmenu = false;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
    },
    switchTheme: (state, action: PayloadAction<string>) => {
      state.theme["CMS"].backgroundImage = action.payload;
      state.theme["PVN"].backgroundImage = action.payload;
    },
    setCtrCd: (state, action: PayloadAction<string>) => {
      state.ctr_cd = action.payload;
    },
    setServerIp: (state, action: PayloadAction<string>) => {
      state.server_ip = action.payload;
    },
    setSelectedServer: (state, action: PayloadAction<string>) => {
      state.selectedServer = action.payload;
    },
  },
});

export const {
  setLagMode,
  toggleSidebar,
  hideSidebar,
  setLanguage,
  switchTheme,
  setCtrCd,
  setServerIp,
  setSelectedServer,
} = uiSlice.actions;

export default uiSlice.reducer;
