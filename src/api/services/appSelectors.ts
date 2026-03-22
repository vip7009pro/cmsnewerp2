import { store } from "../../redux/store";
import type { UserData, WEB_SETTING_DATA } from "../GlobalInterface";

export function getCompany(): string {
  const state = store.getState();
  return state.ui.company;
}

export function getCtrCd(): string {
  const state = store.getState();
  return state.ui.ctr_cd;
}

export function getLagMode(): boolean {
  const state = store.getState();
  return state.ui.lag_mode;
}

export function getUserData(): UserData | undefined {
  const state = store.getState();
  return state.auth.userData;
}

export function getGlobalSetting(): WEB_SETTING_DATA[] {
  const state = store.getState();
  return state.totalSlice.globalSetting ?? [];
}

export function getAuditMode(): number {
  const auditMode: number = parseInt(
    getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "AUDIT_MODE")[0]
      ?.CURRENT_VALUE ?? "0",
  );
  return auditMode;
}

export function getSocket() {
  const state = store.getState();
  return state.socket.globalSocket;
}

export function getNotiCount() {
  const state = store.getState();
  return state.notifications.notificationCount;
}

export function getGlobalLang() {
  const state = store.getState();
  return state.ui.lang;
}
