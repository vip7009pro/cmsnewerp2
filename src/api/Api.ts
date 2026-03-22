import Swal from "sweetalert2";
import { store } from "../redux/store";
import { setLoginState, setUserData } from "../redux/slices/authSlice";
import { emitSocketEvent } from "../redux/slices/socketSlice";
import { UserData } from "./GlobalInterface";
import { getServerIp } from "./services/apiBase";
import * as appSelectors from "./services/appSelectors";
import * as tokenStorage from "./services/tokenStorage";
import * as authService from "./services/authService";
import * as queryService from "./services/queryService";
import * as uploadService from "./services/uploadService";

export function getSever(): string {
  return getServerIp();
}
export function getCompany(): string {
  return appSelectors.getCompany();
}
export function getLagMode(): boolean {
  return appSelectors.getLagMode();
}
export function getUserData(): UserData | undefined {
  return appSelectors.getUserData();
}
export function getSocket() {
  return appSelectors.getSocket();
}
export function getNotiCount() {
  return appSelectors.getNotiCount();
}
export function getGlobalLang() {
  return appSelectors.getGlobalLang();
}
export function getGlobalSetting() {
  return appSelectors.getGlobalSetting();
}
export function getAuditMode() {
  return appSelectors.getAuditMode();
}
export function getCtrCd() {
  return appSelectors.getCtrCd();
}
console.log("company", getCompany());

export function login(user: string, pass: string) {
  authService
    .login("main", user, pass)
    .then((Jresult: any) => {
      console.log("Jresult", Jresult);
      if (Jresult?.tk_status?.toUpperCase() === "OK") {
        Swal.fire(
          "Thông báo",
          "Chúc mừng bạn, đăng nhập thành công !",
          "success",
        );
        tokenStorage.setToken("main", Jresult.token_content);
        localStorage.setItem("publicKey", Jresult.publicKey);
        checkLogin()
          .then((data) => {
            console.log("data", data);

            if (data.data.tk_status.toUpperCase() === "NG") {
              store.dispatch(setLoginState(false));
              store.dispatch(
                setUserData({
                  ADD_COMMUNE: "Đông Xuân",
                  ADD_DISTRICT: "Sóc Sơn",
                  ADD_PROVINCE: "Hà Nội",
                  ADD_VILLAGE: "Thôn Phú Thọ",
                  ATT_GROUP_CODE: 1,
                  CMS_ID: "CMS1179",
                  CTR_CD: "002",
                  DOB: "1993-10-18T00:00:00.000Z",
                  EMAIL: "nvh1903@cmsbando.com",
                  EMPL_NO: "none",
                  FACTORY_CODE: 1,
                  FACTORY_NAME: "Nhà máy 1",
                  FACTORY_NAME_KR: "1공장",
                  FIRST_NAME: "HÙNG3",
                  HOMETOWN: "Phụ Thọ - Đông Xuân - Sóc Sơn - Hà Nội",
                  JOB_CODE: 1,
                  JOB_NAME: "Dept Staff",
                  JOB_NAME_KR: "부서담당자",
                  MAINDEPTCODE: 1,
                  MAINDEPTNAME: "QC",
                  MAINDEPTNAME_KR: "품질",
                  MIDLAST_NAME: "NGUYỄN VĂN",
                  ONLINE_DATETIME: "2022-07-12T20:49:52.600Z",
                  PASSWORD: "",
                  PHONE_NUMBER: "0971092454",
                  POSITION_CODE: 3,
                  POSITION_NAME: "Staff",
                  POSITION_NAME_KR: "사원",
                  REMARK: "",
                  SEX_CODE: 1,
                  SEX_NAME: "Nam",
                  SEX_NAME_KR: "남자",
                  SUBDEPTCODE: 2,
                  SUBDEPTNAME: "PD",
                  SUBDEPTNAME_KR: "통역",
                  WORK_POSITION_CODE: 2,
                  WORK_POSITION_NAME: "PD",
                  WORK_POSITION_NAME_KR: "PD",
                  WORK_SHIFT_CODE: 0,
                  WORK_SHIF_NAME: "Hành Chính",
                  WORK_SHIF_NAME_KR: "정규",
                  WORK_START_DATE: "2019-03-11T00:00:00.000Z",
                  WORK_STATUS_CODE: 1,
                  WORK_STATUS_NAME: "Đang làm",
                  WORK_STATUS_NAME_KR: "근무중",
                  EMPL_IMAGE: "N",
                }),
              );
            } else {
              if (data.data.data.WORK_STATUS_CODE !== 0) {
                store.dispatch(setUserData(data.data.data));
                store.dispatch(
                  emitSocketEvent({
                    event: "login",
                    data: data.data.data.EMPL_NO,
                  }),
                );
                store.dispatch(setLoginState(true));
                setTimeout(() => {
                  store.dispatch(setLoginState(true));
                }, 1000);
              } else {
                tokenStorage.clearToken("main");
                Swal.fire(
                  "Thông báo",
                  "Nghỉ việc rồi không truy cập được!",
                  "error",
                );
              }
            }
          })
          .catch((err) => {
            console.log(err + " ");
          });
      } else {
        Swal.fire("Thông báo", "Lỗi: " + Jresult?.message, "error");
      }
    })
    .catch((error: any) => {
      Swal.fire("Thông báo", "Có lỗi: " + error, "warning");
      console.log(error);
    });
}
export function logout() {
  tokenStorage.resetToken("main");
  localStorage.removeItem("publicKey");
  store.dispatch(
    emitSocketEvent({ 
      event: "logout",
      data: getUserData()?.EMPL_NO,
    })
  );
  /* Swal.fire("Thông báo", "Đăng xuất thành công !", "success"); */
  setTimeout(() => {
    /* window.location.href = "/"; */
    store.dispatch(setLoginState(false));
  }, 1000);
}
export async function checkLogin() {
  return authService.checkLogin("main");
}
export async function aiQuery(question: string, options?: { 
  explain?: boolean, 
  chat_history?: any, 
  chat_summary?: any, 
  session_id?: any 
}) {
  return queryService.aiQuery(question, options);
}
export async function aiExecuteSql(sql: string) {
  return queryService.aiExecuteSql(sql);
}
export async function generalQuery(command: string, queryData: any) {
  return queryService.generalQuery("main", command, queryData);
}
export async function uploadQuery(
  file: any,
  filename: string,
  uploadfoldername: string,
  filenamelist?: string[],
  onUploadProgress?: (progressEvent: any) => void
) {
  return uploadService.uploadQuery(
    "main",
    file,
    filename,
    uploadfoldername,
    filenamelist,
    onUploadProgress,
  );
}