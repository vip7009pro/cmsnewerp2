import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import { store } from "../redux/store";
import {
  changeUserData,
  login as loginSlice,
  logout as logoutSlice,
  update_socket,
  vendorLogin,
  vendorLogout,
} from "../redux/slices/globalSlice";
/* import axios from 'axios'; */
import axios from "axios";
import { UserData, WEB_SETTING_DATA } from "./GlobalInterface";
const cookies = new Cookies();
axios.defaults.withCredentials = true;
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
export function getUserData(): UserData | undefined {
  const state = store.getState();
  //console.log(state.totalSlice.server_ip);
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
let API_URL = getSever() + "/apivendors";
let UPLOAD_URL = getSever() + "/uploadfile";
let UPLOAD_CHECKSHEET_URL = getSever() + "/uploadfilechecksheet";
let server_ip_local: any = localStorage.getItem("server_ip")?.toString();
if (server_ip_local !== undefined) {
  API_URL = server_ip_local + "/apivendors";
  UPLOAD_URL = server_ip_local + "/uploadfile";
} else {
}
export function login(user: string, pass: string) {
  let API_URL = getSever() + "/apivendors";
  axios
    .post(API_URL, {
      command: "loginVendors",
      user: user,
      pass: pass,
      ctr_cd: getCtrCd(),
    })
    .then((response: any) => {
      var Jresult = response.data;      
      if (Jresult?.tk_status?.toUpperCase() === "OK") {       
        Swal.fire(
          "Thông báo",
          "Chúc mừng bạn, đăng nhập thành công !",
          "success"
        );       
        cookies.set("token_vendors", Jresult.token_content, { path: "/" });
        checkLogin()
          .then((data) => {
            
            if (data.data.tk_status.toUpperCase() === "NG") {              
              store.dispatch(vendorLogout(false));
              store.dispatch(
                changeUserData({
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
                })
              );
            } else {
             
              if (data.data.data.WORK_STATUS_CODE !== 0) {
                store.dispatch(changeUserData(data.data.data));
                store.dispatch(
                  update_socket({
                    event: "login",
                    data: data.data.data.EMPL_NO,
                  })
                );              
                store.dispatch(vendorLogin(true));
                setTimeout(() => {                  
                  store.dispatch(vendorLogin(true));
                }, 1000);
              } else {
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
  cookies.set("token_vendors", "reset", { path: "/" });
  store.dispatch(
    update_socket({
      event: "logoutVendors",
      data: getUserData()?.EMPL_NO,
    })
  );
  /* Swal.fire("Thông báo", "Đăng xuất thành công !", "success"); */
  setTimeout(() => {
    /* window.location.href = "/"; */
    store.dispatch(vendorLogout(false));
  }, 1000);
}
export async function checkLogin() {
  let API_URL = getSever() + "/apivendors";
  let UPLOAD_URL = getSever() + "/uploadfile";
  let data = await axios.post(API_URL, {
    command: "checkloginVendors",
    DATA: { CTR_CD: getCtrCd(), token_string: cookies.get("token_vendors") },
  });
  return data;
}
export async function generalQuery(command: string, queryData: any) {
  const CURRENT_API_URL = getSever() + "/apivendors";
  // console.log('API URL', CURRENT_API_URL);
  let data = await axios.post(CURRENT_API_URL, {
    command: command,
    DATA: {
      ...queryData,
      token_string: cookies.get("token_vendors"),
      CTR_CD: getCtrCd(),
    },
  });
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
  formData.append("token_string", cookies.get("token_vendors"));
  formData.append("CTR_CD", getCtrCd());
  if (filenamelist)
    formData.append("newfilenamelist", JSON.stringify(filenamelist));
  //console.log("filenamelist", filenamelist);
  //console.log("formData", formData);
  //console.log("token_vendors", cookies.get("token_vendors"));
  let data = await axios.post(UPLOAD_URL, formData, {
    onUploadProgress,
  });
  return data;
}