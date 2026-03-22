import Cookies from "universal-cookie";
import type { ApiScope } from "./apiBase";

const cookies = new Cookies();

function getTokenKey(scope: ApiScope): string {
  return scope === "vendors" ? "token_vendors" : "token";
}

export function getToken(scope: ApiScope): string | undefined {
  return cookies.get(getTokenKey(scope));
}

export function setToken(scope: ApiScope, token: string): void {
  cookies.set(getTokenKey(scope), token, { path: "/" });
}

export function clearToken(scope: ApiScope): void {
  cookies.set(getTokenKey(scope), "", { path: "/" });
}

export function resetToken(scope: ApiScope): void {
  cookies.set(getTokenKey(scope), "reset", { path: "/" });
}
