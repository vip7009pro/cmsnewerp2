import type { RootState } from "../store";

export const selectLang = (state: RootState) => state.ui.lang;
export const selectCompany = (state: RootState) => state.ui.company;
export const selectCompanyInfo = (state: RootState) => state.ui.cpnInfo;
export const selectCtrCd = (state: RootState) => state.ui.ctr_cd;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectServerIp = (state: RootState) => state.ui.server_ip;

export const selectUserData = (state: RootState) => state.auth.userData;
export const selectNotificationCount = (state: RootState) => state.notifications.notificationCount ?? 0;
export const selectSidebarMenu = (state: RootState) => state.ui.sidebarmenu;
export const selectSelectedServer = (state: RootState) => state.ui.selectedServer;

export const selectLoginState = (state: RootState) => state.auth.loginState;
export const selectVendorLoginState = (state: RootState) => state.auth.vendorLoginState;
export const selectDiemDanhState = (state: RootState) => state.auth.diemdanhstate;

export const selectTabModeSwap = (state: RootState) => state.tabs.tabModeSwap;
export const selectTabIndex = (state: RootState) => state.tabs.tabIndex;
export const selectTabs = (state: RootState) => state.tabs.tabs;
