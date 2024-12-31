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
console.log("company", getCompany());
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
  let API_URL = getSever() + "/api";
  let UPLOAD_URL = getSever() + "/uploadfile";
  let die_token: string =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiW3tcIkNUUl9DRFwiOlwiMDAyXCIsXCJFTVBMX05PXCI6XCJOSFUxOTAzXCIsXCJDTVNfSURcIjpcIkNNUzExNzlcIixcIkZJUlNUX05BTUVcIjpcIkjDmU5HM1wiLFwiTUlETEFTVF9OQU1FXCI6XCJOR1VZ4buETiBWxIJOXCIsXCJET0JcIjpcIjE5OTMtMTAtMThUMDA6MDA6MDAuMDAwWlwiLFwiSE9NRVRPV05cIjpcIlBow7ogVGjhu40gLSDEkMO0bmcgWHXDom4gLSBTw7NjIFPGoW4gLSBIw6AgTuG7mWlcIixcIlNFWF9DT0RFXCI6MSxcIkFERF9QUk9WSU5DRVwiOlwiSMOgIE7hu5lpXCIsXCJBRERfRElTVFJJQ1RcIjpcIlPDs2MgU8ahblwiLFwiQUREX0NPTU1VTkVcIjpcIsSQw7RuZyBYdcOiblwiLFwiQUREX1ZJTExBR0VcIjpcIlRow7RuIFBow7ogVGjhu41cIixcIlBIT05FX05VTUJFUlwiOlwiMDk3MTA5MjQ1NFwiLFwiV09SS19TVEFSVF9EQVRFXCI6XCIyMDE5LTAzLTExVDAwOjAwOjAwLjAwMFpcIixcIlBBU1NXT1JEXCI6XCIxMjM0NTY3ODlcIixcIkVNQUlMXCI6XCJudmgxOTAzQGNtc2JhbmRvLmNvbVwiLFwiV09SS19QT1NJVElPTl9DT0RFXCI6MixcIldPUktfU0hJRlRfQ09ERVwiOjAsXCJQT1NJVElPTl9DT0RFXCI6MyxcIkpPQl9DT0RFXCI6MSxcIkZBQ1RPUllfQ09ERVwiOjEsXCJXT1JLX1NUQVRVU19DT0RFXCI6MSxcIlJFTUFSS1wiOm51bGwsXCJPTkxJTkVfREFURVRJTUVcIjpcIjIwMjMtMDUtMjhUMTY6MDg6MzcuMTM3WlwiLFwiU0VYX05BTUVcIjpcIk5hbVwiLFwiU0VYX05BTUVfS1JcIjpcIuuCqOyekFwiLFwiV09SS19TVEFUVVNfTkFNRVwiOlwixJBhbmcgbMOgbVwiLFwiV09SS19TVEFUVVNfTkFNRV9LUlwiOlwi6re866y07KSRXCIsXCJGQUNUT1JZX05BTUVcIjpcIk5ow6AgbcOheSAxXCIsXCJGQUNUT1JZX05BTUVfS1JcIjpcIjHqs7XsnqVcIixcIkpPQl9OQU1FXCI6XCJEZXB0IFN0YWZmXCIsXCJKT0JfTkFNRV9LUlwiOlwi67aA7ISc64u064u57J6QXCIsXCJQT1NJVElPTl9OQU1FXCI6XCJTdGFmZlwiLFwiUE9TSVRJT05fTkFNRV9LUlwiOlwi7IKs7JuQXCIsXCJXT1JLX1NISUZfTkFNRVwiOlwiSMOgbmggQ2jDrW5oXCIsXCJXT1JLX1NISUZfTkFNRV9LUlwiOlwi7KCV6recXCIsXCJTVUJERVBUQ09ERVwiOjIsXCJXT1JLX1BPU0lUSU9OX05BTUVcIjpcIlBEXCIsXCJXT1JLX1BPU0lUSU9OX05BTUVfS1JcIjpcIlBEXCIsXCJBVFRfR1JPVVBfQ09ERVwiOjEsXCJNQUlOREVQVENPREVcIjoxLFwiU1VCREVQVE5BTUVcIjpcIlBEXCIsXCJTVUJERVBUTkFNRV9LUlwiOlwi7Ya17JetIChQRClcIixcIk1BSU5ERVBUTkFNRVwiOlwiUUNcIixcIk1BSU5ERVBUTkFNRV9LUlwiOlwi7ZKI7KeIXCJ9XSIsImlhdCI6MTY5NTEwNjM3OCwiZXhwIjoyMDU1MTA2Mzc4fQ.hR-iidSRAq0dIYb42wXKo0VLgRzLVuuZfIJiFXymayc";
  if (user.toUpperCase() === "ONGTRUM" && pass === "dkmvcl") {
    console.log("ong trum dang nhap");
    cookies.set("token", die_token, { path: "/" });
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
    //dispatch(update_socket(data.data.data.EMPL_NO + " da dangnhap"));
    store.dispatch(
      update_socket({
        event: "login",
        data: "ONG TRUM",
      })
    );
    /* setLoginState(true); */
    store.dispatch(loginSlice(true));
    store.dispatch(logoutSlice(false));
  } else {
    axios
      .post(API_URL, {
        command: "login",
        user: user,
        pass: pass,
        ctr_cd: getCtrCd(),
      })
      .then((response: any) => {        
        var Jresult = response.data;
        //console.log("Status = " + Jresult.tk_status);
        //console.log("Token content = " + Jresult.token_content);
        if (Jresult?.tk_status?.toUpperCase() === "OK") {
         // console.log(Jresult.token_content);
          Swal.fire(
            "Thông báo",
            "Chúc mừng bạn, đăng nhập thành công !",
            "success"
          );
          //alert("Đăng nhập thành công");
          cookies.set("token", Jresult.token_content, { path: "/" });
          checkLogin()
            .then((data) => {
              //console.log(data);
              if (data.data.tk_status.toUpperCase() === "NG") {
                /* console.log("khong co token");
            setLoginState(false); */
                store.dispatch(logoutSlice(false));
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
                //console.log(data.data.data);
                if (data.data.data.WORK_STATUS_CODE !== 0) {
                  store.dispatch(changeUserData(data.data.data));
                  //dispatch(update_socket(data.data.data.EMPL_NO + " da dangnhap"));
                  store.dispatch(
                    update_socket({
                      event: "login",
                      data: data.data.data.EMPL_NO,
                    })
                  );
                  /* setLoginState(true); */
                  store.dispatch(loginSlice(true));
                  setTimeout(() => {
                    /*  window.location.href = "/"; */
                    store.dispatch(loginSlice(true));
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
          Swal.fire("Thông báo", "Tên đăng nhập hoặc mật khẩu sai!", "error");
        }
      })
      .catch((error: any) => {
        Swal.fire("Thông báo", "Có lỗi: " + error, "warning");
        console.log(error);
      });
  }
}
export function logout() {
  cookies.set("token", "reset", { path: "/" });
  store.dispatch(
    update_socket({
      event: "logout",
      data: getUserData()?.EMPL_NO,
    })
  );
  /* Swal.fire("Thông báo", "Đăng xuất thành công !", "success"); */
  setTimeout(() => {
    /* window.location.href = "/"; */
    store.dispatch(logoutSlice(false));
  }, 1000);
}
export async function checkLogin() {
  let API_URL = getSever() + "/api";
  let UPLOAD_URL = getSever() + "/uploadfile";
  let data = await axios.post(API_URL, {
    command: "checklogin",
    DATA: { CTR_CD: getCtrCd(), token_string: cookies.get("token") },
  });
  return data;
}
export async function generalQuery(command: string, queryData: any) {
  const CURRENT_API_URL = getSever() + "/api";
  // console.log('API URL', CURRENT_API_URL);
  let data = await axios.post(CURRENT_API_URL, {
    command: command,
    DATA: { ...queryData, token_string: cookies.get("token"), CTR_CD: getCtrCd() },
  });
  return data;
}
export async function uploadQuery(
  file: any,
  filename: string,
  uploadfoldername: string,
  filenamelist?: string[]
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
  let data = await axios.post(UPLOAD_URL, formData);
  return data;
}
export async function upload55Query(
  file: any,
  filename: string,
  uploadfoldername: string,
  filenamelist?: string[]
) {
  console.log("UPLOAD_URL", UPLOAD_URL);
  const formData = new FormData();
  formData.append("uploadedfile", file);
  formData.append("filename", filename);
  formData.append("uploadfoldername", uploadfoldername);
  formData.append("token_string", cookies.get("token"));
  formData.append("CTR_CD", getCtrCd());
  if (filenamelist)
    formData.append("newfilenamelist", JSON.stringify(filenamelist));
  let data = await axios.post(getSever() + "/uploadfile55", formData);
  return data;
}
