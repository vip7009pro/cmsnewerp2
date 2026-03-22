import type { PayloadAction } from "@reduxjs/toolkit";

export const uiReducers = {
  changeLagMode: (state: any, action: PayloadAction<boolean>) => {
    state.lag_mode = action.payload;
  },
  toggleSidebar: (state: any) => {
    state.sidebarmenu = !state.sidebarmenu;
  },
  hideSidebar: (state: any) => {
    state.sidebarmenu = false;
  },
  changeGLBLanguage: (state: any, action: PayloadAction<string>) => {
    state.lang = action.payload;
  },
  switchTheme: (state: any, action: PayloadAction<string>) => {
    state.theme["CMS"].backgroundImage = action.payload;
    state.theme["PVN"].backgroundImage = action.payload;
  },
  changeCtrCd: (state: any, action: PayloadAction<string>) => {
    state.ctr_cd = action.payload;
  },
  changeServer: (state: any, action: PayloadAction<string>) => {
    state.server_ip = action.payload;
  },
  changeSelectedServer: (state: any, action: PayloadAction<string>) => {
    state.selectedServer = action.payload;
  },
};
