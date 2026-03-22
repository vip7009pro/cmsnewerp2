import type { RootState } from "../store";

export const selectLang = (state: RootState) => state.ui.lang;
export const selectSidebarMenu = (state: RootState) => state.ui.sidebarmenu;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectCtrCd = (state: RootState) => state.ui.ctr_cd;
export const selectServerIp = (state: RootState) => state.ui.server_ip;
export const selectSelectedServer = (state: RootState) => state.ui.selectedServer;
export const selectCompany = (state: RootState) => state.ui.company;
export const selectCompanyInfo = (state: RootState) => state.ui.cpnInfo;
export const selectLagMode = (state: RootState) => state.ui.lag_mode;
