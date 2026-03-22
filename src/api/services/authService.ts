import axios from "axios";
import type { ApiScope } from "./apiBase";
import { getApiBaseUrl } from "./apiBase";
import { getCompany, getCtrCd } from "./appSelectors";
import { getToken } from "./tokenStorage";
import { encryptData } from "../GlobalFunction";

export async function login(scope: ApiScope, user: string, pass: string): Promise<any> {
  const apiUrl = getApiBaseUrl(scope);
  const command = scope === "vendors" ? "loginVendors" : "login";

  const payload =
    scope === "vendors"
      ? {
          command,
          user,
          pass,
          ctr_cd: getCtrCd(),
        }
      : {
          command,
          user,
          pass,
          ctr_cd: getCtrCd(),
          DATA: {
            CTR_CD: getCtrCd(),
            COMPANY: getCompany(),
            USER: user,
            PASS: pass,
          },
        };

  const response = await axios.post(apiUrl, payload);
  return response.data;
}

export async function checkLogin(scope: ApiScope): Promise<any> {
  const apiUrl = getApiBaseUrl(scope);
  const command = scope === "vendors" ? "checkloginVendors" : "checklogin";

  if (scope === "vendors") {
    const response = await axios.post(apiUrl, {
      command,
      DATA: { CTR_CD: getCtrCd(), token_string: getToken(scope) },
    });
    return response;
  }

  const publicKey = localStorage.getItem("publicKey");
  const datacheck = {
    COMPANY: getCompany(),
    CTR_CD: getCtrCd(),
    token_string: getToken(scope),
  };
  const encryptedData = !window.isSecureContext
    ? datacheck
    : await encryptData(publicKey ?? "", datacheck);

  const response = await axios.post(apiUrl, {
    secureContext: window.isSecureContext,
    command,
    DATA: encryptedData,
  });
  return response;
}
