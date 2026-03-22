import type { RootState } from "../store";

export const selectTabs = (state: RootState) => state.tabs.tabs;
export const selectTabIndex = (state: RootState) => state.tabs.tabIndex;
export const selectTabModeSwap = (state: RootState) => state.tabs.tabModeSwap;
