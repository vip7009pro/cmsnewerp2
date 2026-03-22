import type { RootState } from "../store";

export const selectNotificationCount = (state: RootState) => state.notifications.notificationCount;
export const selectGlobalSetting = (state: RootState) => state.notifications.globalSetting;
