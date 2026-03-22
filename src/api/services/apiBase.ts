import axios from "axios";
import { store } from "../../redux/store";

export type ApiScope = "main" | "vendors";

export function getServerIp(): string {
  const state = store.getState();
  const serverIpFromState = state.ui.server_ip;
  const serverIpFromLocalStorage = localStorage.getItem("server_ip")?.toString();
  return serverIpFromLocalStorage ?? serverIpFromState;
}

export function getApiBaseUrl(scope: ApiScope): string {
  const serverIp = getServerIp();
  return scope === "vendors" ? `${serverIp}/apivendors` : `${serverIp}/api`;
}

export function getUploadUrl(): string {
  const serverIp = getServerIp();
  return `${serverIp}/uploadfile`;
}

export function getUploadChecksheetUrl(): string {
  const serverIp = getServerIp();
  return `${serverIp}/uploadfilechecksheet`;
}

axios.defaults.withCredentials = true;
