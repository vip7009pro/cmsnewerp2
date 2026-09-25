import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import { store } from "../redux/store";
import {
  changeUserData, 
  login as loginSlice,  
  logout as logoutSlice,
  update_socket,
} from "../redux/slices/globalSlice";
/* import axios from 'axios'; */
import axios from "axios";
import { UserData, WEB_SETTING_DATA } from "./GlobalInterface";
// encryptData nằm ở utilCore (không kéo recharts/barcode) — Api.ts thuộc graph khởi động.
import { encryptData } from "./services/utilCore";
import { DEFAULT_USER_DATA } from "./defaultUserData";

const cookies = new Cookies();
axios.defaults.withCredentials = true;
axios.defaults.timeout = 45000; // 45 giây chống treo socket vô hạn trên trình duyệt

// Cờ chống logout trùng lặp (xem logout() bên dưới).
let loggingOut = false;
let authExpiredAlertShown = false;

export function notifySessionExpired(customMessage?: string) {
  if (authExpiredAlertShown || isLoggingOut()) return;
  authExpiredAlertShown = true;
  Swal.fire({
    title: "Hết phiên làm việc",
    text:
      customMessage ||
      "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
    icon: "warning",
    confirmButtonText: "Đồng ý",
  }).then(() => {
    authExpiredAlertShown = false;
    logout();
  });
}

// Bắt mã 401 hoặc payload { tk_status: "TOKEN_EXPIRED" } tập trung cho toàn ứng dụng
axios.interceptors.response.use(
  (response) => {
    const tkStatus = String(response?.data?.tk_status ?? "").toUpperCase();
    if (tkStatus === "TOKEN_EXPIRED") {
      notifySessionExpired(response?.data?.message);
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const tkStatus = String(error?.response?.data?.tk_status ?? "").toUpperCase();
    if (status === 401 || tkStatus === "TOKEN_EXPIRED") {
      notifySessionExpired(error?.response?.data?.message);
    }
    return Promise.reject(error);
  }
);
export function getSever(): string {
  const state = store.getState();
  //console.log(state.totalSlice.server_ip);
  return state.totalSlice.server_ip;
  //return "http://localhost:3002";
}
export function getCompany(): string {
  const state = store.getState();
  //console.log(state.totalSlice.server_ip);
  return state.totalSlice.company;
}
export function getLagMode(): boolean {
  const state = store.getState();
  //console.log(state.totalSlice.server_ip);
  return state.totalSlice.lag_mode;
}
export function getUserData(): UserData | undefined {
  const state = store.getState();
  //console.log(state.totalSlice.server_ip);
  //console.log("getUserData", state.totalSlice.userData);
  return state.totalSlice.userData;
}
export function getSocket() {
  const state = store.getState();
  return state.totalSlice.globalSocket;
}
export function getNotiCount() {
  const state = store.getState();
  return state.totalSlice.notificationCount;
}
export function getGlobalLang() {
  const state = store.getState();
  return state.totalSlice.lang;
}
export function getGlobalSetting() {
  const state = store.getState();
  return state.totalSlice.globalSetting;
}
export function getAuditMode() {
  const auditMode: number = parseInt(
    getGlobalSetting()?.filter(
      (ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === "AUDIT_MODE"
    )[0]?.CURRENT_VALUE ?? "0"
  );
  return auditMode;
}
export function getCtrCd() {
  const state = store.getState();
  return state.totalSlice.ctr_cd;
}
//console.log("company", getCompany());
let API_URL = getSever() + "/api";
let UPLOAD_URL = getSever() + "/uploadfile";
let UPLOAD_CHECKSHEET_URL = getSever() + "/uploadfilechecksheet";
let server_ip_local: any = localStorage.getItem("server_ip")?.toString();
if (server_ip_local !== undefined) {
  API_URL = server_ip_local + "/api";
  UPLOAD_URL = server_ip_local + "/uploadfile";
} else {
}
export function login(user: string, pass: string) {
  // Vào màn đăng nhập mới ⇒ mở lại khoá chống logout trùng.
  loggingOut = false;
  authExpiredAlertShown = false;
  let API_URL = getSever() + "/api";
  axios
    .post(API_URL, {
      command: "login",
      user: user,
      pass: pass,
      ctr_cd: getCtrCd(),
      DATA: {
        CTR_CD: getCtrCd(),
        COMPANY: getCompany(),
        USER: user,
        PASS: pass,
      }
    })
    .then((response: any) => {
      var Jresult = response.data;    
      //console.log("Jresult", Jresult);  
      if (Jresult?.tk_status?.toUpperCase() === "OK") {       
        Swal.fire(
          "Thông báo",
          "Chúc mừng bạn, đăng nhập thành công !",
          "success"
        );       
        cookies.set("token", Jresult.token_content, {
          path: "/",
          sameSite: "lax",
          secure: window.location.protocol === "https:",
        });        
        localStorage.setItem("publicKey", Jresult.publicKey);
        checkLogin()
          .then((data) => {
            //console.log("data", data);
            
            const tkStatus = String(data?.data?.tk_status ?? "").toUpperCase();
            const userData = data?.data?.data;
            if (tkStatus !== "OK" || !userData) {              
              store.dispatch(loginSlice(false));
              store.dispatch(
                changeUserData(DEFAULT_USER_DATA)
              );
            } else {             
              if (userData.WORK_STATUS_CODE !== 0) {
                store.dispatch(changeUserData(userData));
                store.dispatch(
                  update_socket({
                    event: "login",
                    data: userData.EMPL_NO,
                  })
                );              
                store.dispatch(loginSlice(true));
                setTimeout(() => {                  
                  store.dispatch(loginSlice(true));
                }, 1000);
              } else {
                cookies.set("token", "", { path: "/" });        
                Swal.fire(                  
                  "Thông báo",
                  "Nghỉ việc rồi không truy cập được!",
                  "error"
                );
              }
            }
          })
          .catch((err) => {
            console.log(err + " ");
          });
      } else {
        Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
      }
    })
    .catch((error: any) => {
      Swal.fire("Thông báo", "Có lỗi: " + error, "warning");
      console.log(error);
    });
}
export function logout() {
  // Chống logout trùng lặp: nhiều nguồn có thể gọi logout() cùng lúc
  // (nút Logout ở header/sidebar, token hết hạn, license check, socket notification "logout").
  if (loggingOut) return;
  loggingOut = true;

  try {
    // Giá trị "reset" là quy ước của backend (xem authService.logout trong practice1).
    cookies.set("token", "reset", { path: "/" });
    localStorage.removeItem("publicKey");
  } catch (error) {
    console.log(error);
  }

  const emplNo = getUserData()?.EMPL_NO;
  store.dispatch(
    update_socket({
      event: "logout",
      data: emplNo,
    })
  );

  // Trước đây phần này nằm trong setTimeout 1000ms: trong đúng 1 giây đó AppRoutes vẫn còn
  // render với token đã bị vô hiệu ⇒ các interval nền (refresh token 30s, checkWebVer,
  // checkLicense) bắn request lỗi, thậm chí trigger logout lần 2 → nhấp nháy / trắng màn hình.
  // Nay xoá dữ liệu user và hạ cờ đăng nhập NGAY trong cùng một nhịp render.
  /* Swal.fire("Thông báo", "Đăng xuất thành công !", "success"); */
  store.dispatch(changeUserData(DEFAULT_USER_DATA));
  store.dispatch(logoutSlice(false));
}

/**
 * Đang trong quá trình logout.
 * Dùng để chặn các tác vụ nền ghi lại cookie token sau khi đã đăng xuất
 * (ví dụ checkMYCHAMCONG trong Home.tsx ghi REFRESH_TOKEN về cookie).
 */
export function isLoggingOut(): boolean {
  return loggingOut;
}
export async function checkLogin() {
  let API_URL = getSever() + "/api";
  let UPLOAD_URL = getSever() + "/uploadfile";
  let publicKey = localStorage.getItem("publicKey");
  let datacheck = {
    COMPANY: getCompany(),
    CTR_CD: getCtrCd(),
    token_string: cookies.get("token")
  }
//  console.log("publicKey",publicKey)
  let encryptedData = !window.isSecureContext ? datacheck : await encryptData(publicKey??"",datacheck);
  let data = await axios.post(
    API_URL,
    {
      secureContext: window.isSecureContext,    
      command: "checklogin",
      DATA: encryptedData,
    },
    { timeout: 20000 }
  );
  return data;
}
export async function aiQuery(question: string, options?: { 
  explain?: boolean, 
  chat_history?: any, 
  chat_summary?: any, 
  session_id?: any 
}) {
  const CURRENT_AI_URL = getSever() + "/ai/query";
  let publicKey = localStorage.getItem("publicKey");

  let DATA = {
    question,
    explain: Boolean(options?.explain),
    chat_history: options?.chat_history,
    chat_summary: options?.chat_summary,
    session_id: options?.session_id,
    token_string: cookies.get("token"),
    CTR_CD: getCtrCd(),
    COMPANY: getCompany(),
  };

  let encryptedData = !window.isSecureContext ? DATA : await encryptData(publicKey ?? "", DATA);
  let data = await axios.post(
    CURRENT_AI_URL,
    {
      secureContext: window.isSecureContext,
      DATA: encryptedData,
    },
    {
      withCredentials: true,
      timeout: 60000,
    },
  );
  return data;
}
export async function aiExecuteSql(sql: string) {
  const CURRENT_AI_URL = getSever() + "/ai/query";
  let publicKey = localStorage.getItem("publicKey");

  let DATA = {
    sql_override: sql,
    token_string: cookies.get("token"),
    CTR_CD: getCtrCd(),
    COMPANY: getCompany(),
  };

  let encryptedData = !window.isSecureContext ? DATA : await encryptData(publicKey ?? "", DATA);
  let data = await axios.post(
    CURRENT_AI_URL,
    {
      secureContext: window.isSecureContext,
      DATA: encryptedData,
    },
    {
      withCredentials: true,
      timeout: 60000,
    },
  );
  return data;
}
export async function generalQuery(command: string, queryData: any, options?: { timeout?: number }) {
  const CURRENT_API_URL = getSever() + "/api";
  // console.log('API URL', CURRENT_API_URL);
  let publicKey = localStorage.getItem("publicKey");
  
  let DATA = {
    ...queryData,
    token_string: cookies.get("token"),
    CTR_CD: getCtrCd(),
    COMPANY: getCompany(),
  };
  //console.log("secureContext",window.isSecureContext)
  //console.log("publicKey",publicKey)
  let encryptedData = !window.isSecureContext ? DATA : await encryptData(publicKey??"",DATA);
  let data = await axios.post(
    CURRENT_API_URL,
    {
      secureContext: window.isSecureContext,
      command: command,
      DATA: encryptedData,
    },
    {
      timeout: options?.timeout ?? 45000,
    }
  );
//delay 1s
 /*  if(getCompany() === "CMS"){
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } */
  return data;
}
export async function uploadQuery(
  file: any,
  filename: string,
  uploadfoldername: string,
  filenamelist?: string[],
  onUploadProgress?: (progressEvent: any) => void
) {
  const formData = new FormData();
  formData.append("uploadedfile", file);
  formData.append("filename", filename);
  formData.append("uploadfoldername", uploadfoldername);
  formData.append("token_string", cookies.get("token"));
  formData.append("CTR_CD", getCtrCd());
  if (filenamelist)
    formData.append("newfilenamelist", JSON.stringify(filenamelist));
  //console.log("filenamelist", filenamelist);
  //console.log("formData", formData);
  //console.log("token", cookies.get("token"));
  let data = await axios.post(UPLOAD_URL, formData, {
    onUploadProgress,
  });
  return data;
}