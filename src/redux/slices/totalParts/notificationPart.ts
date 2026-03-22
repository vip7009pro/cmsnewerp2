import type { PayloadAction } from "@reduxjs/toolkit";
import type { WEB_SETTING_DATA } from "../../../api/GlobalInterface";

export const notificationReducers = {
  changeGLBSetting: (state: any, action: PayloadAction<WEB_SETTING_DATA[]>) => {
    state.globalSetting = action.payload;
  },
  updateNotiCount: (state: any, action: PayloadAction<number>) => {
    state.notificationCount = action.payload;
  },
};
