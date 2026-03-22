import axios from "axios";
import type { ApiScope } from "./apiBase";
import { getApiBaseUrl, getServerIp } from "./apiBase";
import { getCompany, getCtrCd } from "./appSelectors";
import { getToken } from "./tokenStorage";
import { encryptData } from "../GlobalFunction";

export async function generalQuery(scope: ApiScope, command: string, queryData: any) {
  const apiUrl = getApiBaseUrl(scope);

  if (scope === "vendors") {
    const response = await axios.post(apiUrl, {
      command,
      DATA: {
        ...queryData,
        token_string: getToken(scope),
        CTR_CD: getCtrCd(),
      },
    });
    return response;
  }

  const publicKey = localStorage.getItem("publicKey");
  const DATA = {
    ...queryData,
    token_string: getToken(scope),
    CTR_CD: getCtrCd(),
    COMPANY: getCompany(),
  };

  const encryptedData = !window.isSecureContext
    ? DATA
    : await encryptData(publicKey ?? "", DATA);

  const response = await axios.post(apiUrl, {
    secureContext: window.isSecureContext,
    command,
    DATA: encryptedData,
  });

  return response;
}

export async function aiQuery(
  question: string,
  options?: {
    explain?: boolean;
    chat_history?: any;
    chat_summary?: any;
    session_id?: any;
  },
) {
  const currentAiUrl = `${getServerIp()}/ai/query`;
  const publicKey = localStorage.getItem("publicKey");

  const DATA = {
    question,
    explain: Boolean(options?.explain),
    chat_history: options?.chat_history,
    chat_summary: options?.chat_summary,
    session_id: options?.session_id,
    token_string: getToken("main"),
    CTR_CD: getCtrCd(),
    COMPANY: getCompany(),
  };

  const encryptedData = !window.isSecureContext
    ? DATA
    : await encryptData(publicKey ?? "", DATA);

  const response = await axios.post(
    currentAiUrl,
    {
      secureContext: window.isSecureContext,
      DATA: encryptedData,
    },
    {
      withCredentials: true,
    },
  );

  return response;
}

export async function aiExecuteSql(sql: string) {
  const currentAiUrl = `${getServerIp()}/ai/query`;
  const publicKey = localStorage.getItem("publicKey");

  const DATA = {
    sql_override: sql,
    token_string: getToken("main"),
    CTR_CD: getCtrCd(),
    COMPANY: getCompany(),
  };

  const encryptedData = !window.isSecureContext
    ? DATA
    : await encryptData(publicKey ?? "", DATA);

  const response = await axios.post(
    currentAiUrl,
    {
      secureContext: window.isSecureContext,
      DATA: encryptedData,
    },
    {
      withCredentials: true,
    },
  );

  return response;
}
