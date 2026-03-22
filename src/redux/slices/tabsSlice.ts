import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ReactElement } from "react";
import type { ELE_ARRAY } from "../../api/GlobalInterface";
import { initialTotalState, persistTabs, showAddTabLimitWarning } from "./totalParts/initialTotalState";

export type TabsState = {
  tabs: ELE_ARRAY[];
  componentArray: Array<any>;
  tabIndex: number;
  tabModeSwap: boolean;
};

const initialState: TabsState = {
  tabs: initialTotalState.tabs,
  componentArray: initialTotalState.componentArray,
  tabIndex: initialTotalState.tabIndex,
  tabModeSwap: initialTotalState.tabModeSwap,
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<ELE_ARRAY>) => {
      if (state.tabs.filter((e: ELE_ARRAY) => e.ELE_CODE !== "-1").length < 8) {
        if (state.tabs.map((e: ELE_ARRAY) => e.ELE_CODE).includes(action.payload.ELE_CODE)) return;
        state.tabs = [...state.tabs, action.payload];
        persistTabs(state.tabs);
      } else {
        showAddTabLimitWarning();
      }
    },
    addComponent: (state, action: PayloadAction<ReactElement>) => {
      state.componentArray = [...state.componentArray, action.payload];
      console.log(state.componentArray);
    },
    resetTab: (state) => {
      state.tabs = [];
      persistTabs(state.tabs);
    },
    closeTab: (state, action: PayloadAction<number>) => {
      let checkallDeleted: number = 0;
      for (let i = 0; i < state.tabs.length; i++) {
        if (state.tabs[i].ELE_CODE !== "-1") checkallDeleted++;
      }

      if (checkallDeleted > 1) {
        state.tabs[action.payload] = {
          ELE_CODE: "-1",
          ELE_NAME: "DELETED",
          REACT_ELE: "",
          PAGE_ID: -1,
        };

        persistTabs(state.tabs);

        if (action.payload < state.tabs.length - 1) {
          let nextTabIndex = action.payload + 1;
          while (nextTabIndex < state.tabs.length && state.tabs[nextTabIndex].ELE_CODE === "-1") {
            nextTabIndex++;
          }
          if (nextTabIndex === state.tabs.length) {
            nextTabIndex = action.payload;
            while (nextTabIndex > 0 && state.tabs[nextTabIndex].ELE_CODE === "-1") {
              nextTabIndex--;
            }
          }
          console.log("next tab index: ", nextTabIndex);
          state.tabIndex = nextTabIndex;
        } else {
          let nextTabIndex = action.payload;
          while (nextTabIndex > 0 && state.tabs[nextTabIndex].ELE_CODE === "-1") {
            nextTabIndex--;
          }
          state.tabIndex = nextTabIndex;
        }
      } else {
        state.tabs = [];
        state.tabIndex = 0;
        persistTabs(state.tabs);
      }
    },
    setTabIndex: (state, action: PayloadAction<number>) => {
      console.log("set tab index: ", action.payload);
      state.tabIndex = action.payload;
    },
    setTabModeSwap: (state, action: PayloadAction<boolean>) => {
      state.tabModeSwap = action.payload;
    },
  },
});

export const {
  addTab,
  addComponent,
  resetTab,
  closeTab,
  setTabIndex,
  setTabModeSwap,
} = tabsSlice.actions;

export default tabsSlice.reducer;
