import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { WEB_SETTING_DATA } from "../../api/GlobalInterface";
import { initialTotalState } from "./totalParts/initialTotalState";

export type NotificationsState = {
  notificationCount: number;
  globalSetting: WEB_SETTING_DATA[];
};

const initialState: NotificationsState = {
  notificationCount: initialTotalState.notificationCount ?? 0,
  globalSetting: initialTotalState.globalSetting ?? [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setGlobalSetting: (state, action: PayloadAction<WEB_SETTING_DATA[]>) => {
      state.globalSetting = action.payload;
    },
    setNotificationCount: (state, action: PayloadAction<number>) => {
      state.notificationCount = action.payload;
    },
  },
});

export const { setGlobalSetting, setNotificationCount } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
